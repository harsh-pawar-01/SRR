-- 001_init.sql: SRR / Royal Academy Database Schema Initialization
-- Paste this script directly into Supabase SQL Editor to execute.

-- 1. Enable Cryptographic Functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'reception', 'admin')),
    subject TEXT CHECK (subject IS NULL OR subject IN ('Physics', 'Chemistry', 'Mathematics', 'Biology')),
    phone TEXT NOT NULL,
    email TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    mobile_no TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_mobile_no TEXT NOT NULL,
    address TEXT NOT NULL,
    college_name TEXT NOT NULL,
    class_grade TEXT NOT NULL CHECK (class_grade IN ('11th', '12th')),
    admission_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MARKS TABLE
CREATE TABLE IF NOT EXISTS marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    subject TEXT NOT NULL CHECK (subject IN ('Physics', 'Chemistry', 'Mathematics', 'Biology')),
    marks_obtained NUMERIC(5,2) NOT NULL CHECK (marks_obtained >= 0),
    total_marks NUMERIC(5,2) NOT NULL CHECK (total_marks > 0),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT chk_marks_obtained_total CHECK (marks_obtained <= total_marks)
);

-- 5. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent')),
    CONSTRAINT uq_student_date UNIQUE (student_id, date)
);

-- 6. FEES TABLE
CREATE TABLE IF NOT EXISTS fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (paid_amount >= 0),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Partial', 'Paid')),
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. FEE_PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_id UUID NOT NULL REFERENCES fees(id) ON DELETE CASCADE,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_order_id TEXT,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    method TEXT NOT NULL DEFAULT 'CASH' CHECK (method IN ('CASH', 'RAZORPAY', 'MANUAL', 'CHEQUE', 'UPI')),
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SYLLABUS TABLE
CREATE TABLE IF NOT EXISTS syllabus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_grade TEXT NOT NULL CHECK (class_grade IN ('11th', '12th')),
    subject TEXT NOT NULL CHECK (subject IN ('Physics', 'Chemistry', 'Mathematics', 'Biology')),
    chapter_name TEXT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- 9. CONSULTATIONS TABLE
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    admission_year TEXT NOT NULL,
    stream TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Followed Up', 'Enrolled', 'Closed')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. INDEXES ON FOREIGN KEYS AND FREQUENTLY FILTERED COLUMNS
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_class_grade ON students(class_grade);
CREATE INDEX IF NOT EXISTS idx_marks_student_id ON marks(student_id);
CREATE INDEX IF NOT EXISTS idx_marks_subject_date ON marks(subject, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_fees_student_id ON fees(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_status ON fees(status);
CREATE INDEX IF NOT EXISTS idx_fee_payments_fee_id ON fee_payments(fee_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_razorpay_id ON fee_payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_grade_subject ON syllabus(class_grade, subject);
CREATE INDEX IF NOT EXISTS idx_consultations_submitted_at ON consultations(submitted_at DESC);

-- 11. ROW LEVEL SECURITY (RLS) ENABLED ON ALL TABLES (NO POLICIES: BACKEND-ONLY ACCESS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- 12. RACE-SAFE ATOMIC PAYMENT STORED FUNCTION
CREATE OR REPLACE FUNCTION record_fee_payment(
    p_fee_id UUID,
    p_amount NUMERIC(12,2),
    p_method TEXT,
    p_razorpay_payment_id TEXT DEFAULT NULL,
    p_razorpay_order_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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
