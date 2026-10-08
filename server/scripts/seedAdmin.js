/**
 * seedAdmin.js
 * Creates the initial administrator account in Supabase from environment variables.
 * Usage: 
 *   Production/Dev: node scripts/seedAdmin.js
 *   Test DB:        node scripts/seedAdmin.js --test
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const isTestMode = process.argv.includes('--test') || process.env.NODE_ENV === 'test';
const envFileName = isTestMode ? '.env.test' : '.env';
const envPath = path.resolve(__dirname, `../${envFileName}`);

if (!fs.existsSync(envPath)) {
    console.error(`FATAL: server/${envFileName} file is missing.`);
    if (isTestMode) {
        console.error('Create server/.env.test from server/.env.test.example with test Supabase credentials.');
    }
    process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const [key, value] of Object.entries(envConfig)) {
    process.env[key] = value;
}

if (isTestMode) {
    const prodEnvPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(prodEnvPath)) {
        const prodEnv = dotenv.parse(fs.readFileSync(prodEnvPath));
        if (prodEnv.SUPABASE_URL && process.env.SUPABASE_URL && prodEnv.SUPABASE_URL.trim() === process.env.SUPABASE_URL.trim()) {
            console.error('FATAL SAFETY VIOLATION: SUPABASE_URL in server/.env.test matches server/.env (production)!');
            console.error('Refusing to seed admin into production database using test runner.');
            process.exit(1);
        }
    }
}

async function seedAdmin() {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const phone = process.env.ADMIN_PHONE || '9999999999';

    if (!username || !password) {
        console.error(`Error: ADMIN_USERNAME and ADMIN_PASSWORD must be defined in ${envFileName}`);
        process.exit(1);
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error(`Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in ${envFileName}`);
        process.exit(1);
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    try {
        console.log(`Checking if admin user '${username}' exists in ${isTestMode ? 'TEST' : 'MAIN'} database...`);

        // Check if user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, username, role')
            .eq('username', username)
            .maybeSingle();

        if (fetchError) {
            console.error('Database query error:', fetchError.message);
            process.exit(1);
        }

        if (existingUser) {
            console.log(`Admin account '${existingUser.username}' (ID: ${existingUser.id}) already exists. Seed skipped.`);
            process.exit(0);
        }

        // Hash the admin password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert administrator record
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
                username: username.trim(),
                password_hash: passwordHash,
                name: 'System Administrator',
                role: 'admin',
                phone: phone.trim(),
                email: 'admin@srracademy.com',
                is_active: true
            })
            .select('id, username, name, role')
            .single();

        if (insertError) {
            console.error('Failed to create admin account:', insertError.message);
            process.exit(1);
        }

        console.log(`Admin account '${newUser.username}' created successfully with role '${newUser.role}' (ID: ${newUser.id}).`);
        process.exit(0);
    } catch (err) {
        console.error('Unexpected error while seeding admin account:', err.message);
        process.exit(1);
    }
}

seedAdmin();
