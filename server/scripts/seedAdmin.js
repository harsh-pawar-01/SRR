/**
 * seedAdmin.js
 * Creates the initial administrator account in Supabase from environment variables.
 * Usage: node scripts/seedAdmin.js
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

async function seedAdmin() {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const phone = process.env.ADMIN_PHONE || '9999999999';

    if (!username || !password) {
        console.error('Error: ADMIN_USERNAME and ADMIN_PASSWORD must be defined in .env');
        process.exit(1);
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env');
        process.exit(1);
    }

    try {
        console.log(`Checking if admin user '${username}' exists...`);

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
