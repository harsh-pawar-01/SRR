/**
 * testEndpoints.js
 * Comprehensive automated test suite verifying all Supabase backend endpoints.
 * Usage: node scripts/testEndpoints.js
 */

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const http = require('http');

async function runTests() {
    console.log('--- Starting SRR Backend Endpoint Tests ---');

    // Import app without starting default port
    // We override process.env.PORT for this test run if needed
    const { app } = require('../server');
    const testServer = http.createServer(app);

    await new Promise((resolve) => testServer.listen(0, '127.0.0.1', resolve));
    const port = testServer.address().port;
    const baseUrl = `http://127.0.0.1:${port}/api`;
    console.log(`Test server running at ${baseUrl}`);

    let adminToken = null;
    let teacherToken = null;
    let receptionToken = null;
    let studentToken = null;

    let createdTeacherId = null;
    let createdStudentId = null;
    let studentUserId = null;
    let createdFeeId = null;
    let createdChapterId = null;
    let createdConsultationId = null;

    const results = [];

    const test = async (name, fn) => {
        try {
            await fn();
            results.push({ name, passed: true });
            console.log(` PASS: ${name}`);
        } catch (err) {
            results.push({ name, passed: false, error: err.message });
            console.error(` FAIL: ${name} -> ${err.message}`);
        }
    };

    const assert = (condition, msg) => {
        if (!condition) throw new Error(msg || 'Assertion failed');
    };

    // 1. Health Check
    await test('GET / -> Health check returns success', async () => {
        const res = await fetch(`http://127.0.0.1:${port}/`);
        const json = await res.json();
        assert(res.status === 200, `Expected 200, got ${res.status}`);
        assert(json.success === true, 'Expected success === true');
    });

    // 2. Auth: Bad Login
    await test('POST /api/auth/login -> Generic error on bad password', async () => {
        const res = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: process.env.ADMIN_USERNAME, password: 'WrongPassword123!' }),
        });
        const json = await res.json();
        assert(res.status === 401, `Expected 401, got ${res.status}`);
        assert(json.message === 'Invalid username or password', `Expected generic error message, got: ${json.message}`);
    });

    // 3. Auth: Admin Login
    await test('POST /api/auth/login -> Admin login generates valid 7d JWT', async () => {
        const res = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            }),
        });
        const json = await res.json();
        assert(res.status === 200, `Expected 200, got ${res.status}`);
        assert(json.data.token, 'Expected token to be returned');
        assert(json.data.user.role === 'admin', 'Expected role to be admin');
        adminToken = json.data.token;
    });

    // 4. Auth: GET /me
    await test('GET /api/auth/me -> Returns authenticated admin profile', async () => {
        const res = await fetch(`${baseUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const json = await res.json();
        assert(res.status === 200, `Expected 200, got ${res.status}`);
        assert(json.data.username === process.env.ADMIN_USERNAME, 'Username mismatch');
    });

    // 5. Users: Admin creates teacher
    const testTeacherUser = `prof_rc_${Date.now()}`;
    await test('POST /api/users -> Admin creates Physics teacher', async () => {
        const res = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                username: testTeacherUser,
                password: 'teacherPass123',
                name: 'Prof. R. C. Patil',
                role: 'teacher',
                subject: 'Physics',
                phone: '9822054321',
            }),
        });
        const json = await res.json();
        assert(res.status === 201, `Expected 201, got ${res.status}: ${json.message}`);
        assert(json.data.subject === 'Physics', 'Expected subject Physics');
        createdTeacherId = json.data.id;
    });

    // 6. Users: Admin creates receptionist
    const testReceptionUser = `desk_${Date.now()}`;
    await test('POST /api/users -> Admin creates Receptionist', async () => {
        const res = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                username: testReceptionUser,
                password: 'receptionPass123',
                name: 'Suresh Patil Desk',
                role: 'reception',
                phone: '9822111000',
            }),
        });
        const json = await res.json();
        assert(res.status === 201, `Expected 201, got ${res.status}: ${json.message}`);
        assert(json.data.role === 'reception', 'Expected role reception');
    });

    // 7. Teacher and Reception Logins
    await test('POST /api/auth/login -> Teacher and Reception can log in', async () => {
        const resTeacher = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: testTeacherUser, password: 'teacherPass123' }),
        });
        const jsonTeacher = await resTeacher.json();
        assert(resTeacher.status === 200, 'Teacher login failed');
        teacherToken = jsonTeacher.data.token;

        const resRec = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: testReceptionUser, password: 'receptionPass123' }),
        });
        const jsonRec = await resRec.json();
        assert(resRec.status === 200, 'Reception login failed');
        receptionToken = jsonRec.data.token;
    });

    // 8. Students: Reception admits a student
    const testStudentUser = `student_${Date.now()}`;
    await test('POST /api/students/admit -> Receptionist admits new student', async () => {
        const res = await fetch(`${baseUrl}/students/admit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${receptionToken}`,
            },
            body: JSON.stringify({
                name: 'Atharva Patil',
                username: testStudentUser,
                password: 'studentPass123',
                mobileNo: '9822012345',
                parentName: 'Ravindra Patil',
                parentMobNo: '9423056789',
                address: 'Shivaji Road, Vita',
                collegeName: 'Modern College of Science, Vita',
                classGrade: '11th',
            }),
        });
        const json = await res.json();
        assert(res.status === 201, `Expected 201, got ${res.status}: ${json.message}`);
        assert(json.data.class_grade === '11th', 'Expected classGrade 11th');
        createdStudentId = json.data.id;
        studentUserId = json.data.user_id;
    });

    // 9. Student Login
    await test('POST /api/auth/login -> Admitted student logs in with hashed credentials', async () => {
        const res = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: testStudentUser, password: 'studentPass123' }),
        });
        const json = await res.json();
        assert(res.status === 200, `Student login failed: ${json.message}`);
        assert(json.data.user.role === 'student', 'Expected role student');
        assert(json.data.user.studentId === createdStudentId, 'Expected studentId attached');
        studentToken = json.data.token;
    });

    // 10. Student Ownership Protection
    await test('GET /api/students/:id -> Student cannot read another ID', async () => {
        // Read own
        const ownRes = await fetch(`${baseUrl}/students/${createdStudentId}`, {
            headers: { Authorization: `Bearer ${studentToken}` },
        });
        assert(ownRes.status === 200, `Own record failed with ${ownRes.status}`);

        // Fake other UUID
        const fakeId = '00000000-0000-0000-0000-000000000000';
        const otherRes = await fetch(`${baseUrl}/students/${fakeId}`, {
            headers: { Authorization: `Bearer ${studentToken}` },
        });
        // Returns 404 if not found or 403 if unauthorized
        assert(otherRes.status === 404 || otherRes.status === 403, `Expected 404 or 403, got ${otherRes.status}`);
    });

    // 11. Syllabus: Teacher subject boundary
    await test('POST /api/syllabus -> Physics teacher can add Physics chapter but NOT Chemistry', async () => {
        // Should succeed: Physics
        const okRes = await fetch(`${baseUrl}/syllabus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${teacherToken}`,
            },
            body: JSON.stringify({
                classGrade: '11th',
                subject: 'Physics',
                chapterName: 'Units & Measurements',
            }),
        });
        const okJson = await okRes.json();
        assert(okRes.status === 201, `Physics chapter failed: ${okJson.message}`);
        createdChapterId = okJson.data.id;

        // Should fail: Chemistry
        const failRes = await fetch(`${baseUrl}/syllabus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${teacherToken}`,
            },
            body: JSON.stringify({
                classGrade: '11th',
                subject: 'Chemistry',
                chapterName: 'Mole Concept',
            }),
        });
        assert(failRes.status === 403, `Expected 403 for unauthorized subject, got ${failRes.status}`);
    });

    // 12. Marks: Teacher subject boundary
    await test('POST /api/marks -> Physics teacher can add Physics mark but NOT Chemistry', async () => {
        // Should succeed: Physics
        const okRes = await fetch(`${baseUrl}/marks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${teacherToken}`,
            },
            body: JSON.stringify({
                testName: 'Weekly Test #01',
                subject: 'Physics',
                totalMarks: 100,
                studentId: createdStudentId,
                marksObtained: 85,
            }),
        });
        const okJson = await okRes.json();
        assert(okRes.status === 201, `Physics mark failed: ${okJson.message}`);

        // Should fail: Chemistry
        const failRes = await fetch(`${baseUrl}/marks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${teacherToken}`,
            },
            body: JSON.stringify({
                testName: 'Weekly Test #01',
                subject: 'Chemistry',
                totalMarks: 100,
                studentId: createdStudentId,
                marksObtained: 85,
            }),
        });
        assert(failRes.status === 403, `Expected 403 for unauthorized subject, got ${failRes.status}`);
    });

    // 13. Student reads own marks
    await test('GET /api/marks -> Student reads own marks successfully', async () => {
        const res = await fetch(`${baseUrl}/marks`, {
            headers: { Authorization: `Bearer ${studentToken}` },
        });
        const json = await res.json();
        assert(res.status === 200, `Expected 200, got ${res.status}`);
        assert(json.data.length > 0, 'Expected at least 1 mark entry');
        assert(json.data[0].marks_obtained === 85, 'Mark score mismatch');
    });

    // 14. Attendance: Reception marks attendance
    const todayStr = new Date().toISOString().split('T')[0];
    await test('POST /api/attendance -> Reception marks attendance and student reads own', async () => {
        const markRes = await fetch(`${baseUrl}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${receptionToken}`,
            },
            body: JSON.stringify({
                date: todayStr,
                attendanceList: [{ studentId: createdStudentId, status: 'Present' }],
            }),
        });
        assert(markRes.status === 200, `Attendance mark failed: ${markRes.status}`);

        // Student reads attendance
        const getRes = await fetch(`${baseUrl}/attendance`, {
            headers: { Authorization: `Bearer ${studentToken}` },
        });
        const getJson = await getRes.json();
        assert(getRes.status === 200, `Attendance fetch failed: ${getRes.status}`);
        assert(getJson.data.some((a) => a.date === todayStr && a.status === 'Present'), 'Attendance record not found');
    });

    // 15. Promotions: 11th to 12th
    await test('POST /api/students/swap-11-to-12 -> Promotes student to 12th standard', async () => {
        const res = await fetch(`${baseUrl}/students/swap-11-to-12`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${receptionToken}`,
            },
            body: JSON.stringify({ studentIds: [createdStudentId] }),
        });
        const json = await res.json();
        assert(res.status === 200, `Promotion failed: ${res.status}`);
        assert(json.count >= 1, 'Expected at least 1 promoted student');

        // Verify grade
        const checkRes = await fetch(`${baseUrl}/students/${createdStudentId}`, {
            headers: { Authorization: `Bearer ${receptionToken}` },
        });
        const checkJson = await checkRes.json();
        assert(checkJson.data.class_grade === '12th', `Expected 12th, got ${checkJson.data.class_grade}`);
    });

    // 16. Consultations: Public inquiry & reception review
    await test('POST /api/consultations -> Public submission & reception status update', async () => {
        // Public submission
        const submitRes = await fetch(`${baseUrl}/consultations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentName: 'Pranav Deshmukh',
                parentName: 'Sanjay Deshmukh',
                admissionYear: '11th Standard',
                stream: 'JEE (Engineering)',
                contactNumber: '9823123456',
                email: 'pranav.deshmukh@gmail.com',
                address: 'Station Road, Vita',
                message: 'Inquiring about hostel availability',
            }),
        });
        const submitJson = await submitRes.json();
        assert(submitRes.status === 201, `Public submission failed: ${submitJson.message}`);
        createdConsultationId = submitJson.data.id;

        // Reception update status
        const updateRes = await fetch(`${baseUrl}/consultations/${createdConsultationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${receptionToken}`,
            },
            body: JSON.stringify({ status: 'Followed Up' }),
        });
        const updateJson = await updateRes.json();
        assert(updateRes.status === 200, `Status update failed: ${updateJson.message}`);
        assert(updateJson.data.status === 'Followed Up', 'Status update mismatch');
    });

    // 17. Fees: Create Fee & Race-Safe Payments
    await test('Fees Lifecycle: Assign fee, record installment, reject overpayment, mark paid', async () => {
        // Step A: Assign fee (₹50,000)
        const feeRes = await fetch(`${baseUrl}/fees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${receptionToken}`,
            },
            body: JSON.stringify({
                studentId: createdStudentId,
                totalAmount: 50000,
                dueDate: '2026-11-30',
            }),
        });
        const feeJson = await feeRes.json();
        assert(feeRes.status === 201, `Fee creation failed: ${feeJson.message}`);
        createdFeeId = feeJson.data.id;

        // Step B: Record installment ₹20,000
        const payRes1 = await fetch(`${baseUrl}/fees/${createdFeeId}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${receptionToken}`,
            },
            body: JSON.stringify({
                amount: 20000,
                method: 'CASH',
            }),
        });
        const payJson1 = await payRes1.json();
        assert(payRes1.status === 200, `First payment failed: ${payJson1.message}`);
        assert(Number(payJson1.data.paid_amount) === 20000, 'Paid amount mismatch');
        assert(payJson1.data.status === 'Partial', `Expected Partial status, got ${payJson1.data.status}`);

        // Step C: Reject payment larger than remaining balance (₹40,000 > ₹30,000)
        const overpayRes = await fetch(`${baseUrl}/fees/${createdFeeId}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${receptionToken}`,
            },
            body: JSON.stringify({
                amount: 40000,
                method: 'CASH',
            }),
        });
        assert(overpayRes.status === 400, `Expected 400 for overpayment, got ${overpayRes.status}`);

        // Step D: Pay remaining balance ₹30,000
        const payRes2 = await fetch(`${baseUrl}/fees/${createdFeeId}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${receptionToken}`,
            },
            body: JSON.stringify({
                amount: 30000,
                method: 'CASH',
            }),
        });
        const payJson2 = await payRes2.json();
        assert(payRes2.status === 200, `Second payment failed: ${payJson2.message}`);
        assert(Number(payJson2.data.paid_amount) === 50000, 'Paid amount mismatch');
        assert(payJson2.data.status === 'Paid', `Expected Paid status, got ${payJson2.data.status}`);
    });

    // Clean up test server
    testServer.close();

    console.log('\n--- Test Suite Summary ---');
    const passedCount = results.filter((r) => r.passed).length;
    console.log(`Passed: ${passedCount}/${results.length}`);

    if (passedCount === results.length) {
        console.log('ALL TESTS PASSED SUCCESSFULLY!');
        process.exit(0);
    } else {
        console.error('SOME TESTS FAILED.');
        process.exit(1);
    }
}

runTests().catch((err) => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
});
