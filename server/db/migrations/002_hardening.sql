-- 002_hardening.sql: Hardening and Permission Restrictions

-- Update record_fee_payment to SECURITY INVOKER with search_path=public
CREATE OR REPLACE FUNCTION record_fee_payment(
    p_fee_id UUID,
    p_amount NUMERIC(12,2),
    p_method TEXT,
    p_razorpay_payment_id TEXT DEFAULT NULL,
    p_razorpay_order_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_fee fees%ROWTYPE;
    v_payment fee_payments%ROWTYPE;
    v_new_paid NUMERIC(12,2);
    v_new_status TEXT;
BEGIN
    -- Idempotency check: if Razorpay payment was already recorded, return existing state
    IF p_razorpay_payment_id IS NOT NULL THEN
        SELECT * INTO v_payment FROM fee_payments WHERE razorpay_payment_id = p_razorpay_payment_id;
        IF FOUND THEN
            SELECT * INTO v_fee FROM fees WHERE id = v_payment.fee_id;
            RETURN jsonb_build_object(
                'success', true,
                'already_processed', true,
                'fee', to_jsonb(v_fee),
                'payment', to_jsonb(v_payment)
            );
        END IF;
    END IF;

    -- Row-level lock on fees to guarantee race-condition safety
    SELECT * INTO v_fee FROM fees WHERE id = p_fee_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Fee record % not found', p_fee_id;
    END IF;

    -- Check remaining balance: reject payments larger than the remaining balance
    IF (v_fee.paid_amount + p_amount) > v_fee.total_amount THEN
        RAISE EXCEPTION 'Payment amount % exceeds remaining balance of %', p_amount, (v_fee.total_amount - v_fee.paid_amount);
    END IF;

    -- Calculate updated paid amount & status
    v_new_paid := v_fee.paid_amount + p_amount;
    IF v_new_paid >= v_fee.total_amount THEN
        v_new_status := 'Paid';
    ELSIF v_new_paid > 0 THEN
        v_new_status := 'Partial';
    ELSE
        v_new_status := 'Pending';
    END IF;

    -- Record transaction into fee_payments
    INSERT INTO fee_payments (fee_id, razorpay_payment_id, razorpay_order_id, amount, method, paid_at)
    VALUES (p_fee_id, p_razorpay_payment_id, p_razorpay_order_id, p_amount, p_method, NOW())
    RETURNING * INTO v_payment;

    -- Atomically update fees
    UPDATE fees
    SET paid_amount = v_new_paid,
        status = v_new_status
    WHERE id = p_fee_id
    RETURNING * INTO v_fee;

    RETURN jsonb_build_object(
        'success', true,
        'already_processed', false,
        'fee', to_jsonb(v_fee),
        'payment', to_jsonb(v_payment)
    );
END;
$$;

-- Revoke execute from PUBLIC, anon, and authenticated; grant only to service_role
REVOKE EXECUTE ON FUNCTION record_fee_payment(UUID, NUMERIC, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION record_fee_payment(UUID, NUMERIC, TEXT, TEXT, TEXT) TO service_role;

-- Revoke all table privileges from anon and authenticated
REVOKE ALL ON TABLE users, students, marks, attendance, fees, fee_payments, syllabus, consultations FROM anon, authenticated;
