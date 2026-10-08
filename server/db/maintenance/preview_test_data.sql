-- ==============================================================================
-- preview_test_data.sql
-- READ-ONLY inspection script for identifying test artifacts in Supabase.
-- This file contains ONLY SELECT statements. NO DELETE statements are present.
-- Review these rows in Supabase SQL Editor and delete manually by exact UUID if desired.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TEST-PREFIXED ARTIFACTS (Strict escaped match on 'test_%')
-- ------------------------------------------------------------------------------

-- 1A. Test Users (Teachers, Receptionists, Students)
SELECT 
    id, 
    username, 
    name, 
    role, 
    subject,
    phone, 
    email, 
    is_active, 
    created_at
FROM users
WHERE username LIKE 'test\_%' ESCAPE '\'
ORDER BY created_at DESC;

-- 1B. Test Syllabus Chapters
SELECT 
    id, 
    class_grade, 
    subject, 
    chapter_name, 
    completed_at, 
    created_by
FROM syllabus
WHERE chapter_name LIKE 'test\_%' ESCAPE '\'
ORDER BY completed_at DESC;

-- 1C. Test Consultation Inquiries
SELECT 
    id, 
    student_name, 
    parent_name, 
    admission_year, 
    stream, 
    contact_number, 
    email, 
    status, 
    submitted_at
FROM consultations
WHERE student_name LIKE 'test\_%' ESCAPE '\'
ORDER BY submitted_at DESC;


-- ------------------------------------------------------------------------------
-- 2. POTENTIAL TEST ROWS FROM EARLIER SESSIONS (Inspect before taking any action)
-- ------------------------------------------------------------------------------

-- 2A. Potential test users created by legacy test scripts
SELECT 
    id, 
    username, 
    name, 
    role, 
    subject, 
    phone, 
    email, 
    is_active, 
    created_at
FROM users
WHERE username LIKE 'prof\_rc\_%' ESCAPE '\'
   OR username LIKE 'desk\_%' ESCAPE '\'
   OR username LIKE 'student\_%' ESCAPE '\'
ORDER BY created_at DESC;

-- 2B. Syllabus chapters matching initial test chapter name
SELECT 
    id, 
    class_grade, 
    subject, 
    chapter_name, 
    completed_at, 
    created_by
FROM syllabus
WHERE chapter_name = 'Units & Measurements'
ORDER BY completed_at DESC;

-- 2C. Consultations matching initial test inquiry values
SELECT 
    id, 
    student_name, 
    parent_name, 
    admission_year, 
    stream, 
    contact_number, 
    email, 
    status, 
    submitted_at
FROM consultations
WHERE student_name = 'Pranav Deshmukh'
   OR email = 'test_pranav@example.com'
   OR contact_number = '9823123456'
ORDER BY submitted_at DESC;

-- ------------------------------------------------------------------------------
-- End of preview queries.
-- Use the specific UUIDs identified above to remove any verified test records manually.
-- ------------------------------------------------------------------------------
