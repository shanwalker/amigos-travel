/**
 * ============================================
 * AUTOMATED USER MIGRATION SCRIPT
 * ============================================
 * This script helps migrate users from old to new Supabase project
 * 
 * REQUIREMENTS:
 * - Node.js installed
 * - @supabase/supabase-js package
 * - Service role keys for BOTH projects
 * 
 * USAGE:
 * 1. npm install @supabase/supabase-js
 * 2. Update the configuration below
 * 3. node migrate_users.js
 * ============================================
 */

import { createClient } from '@supabase/supabase-js';

// ============================================
// CONFIGURATION
// ============================================

const OLD_SUPABASE_URL = 'https://whdbtkkgesfgqtkfedne.supabase.co';
const OLD_SUPABASE_SERVICE_KEY = 'YOUR_OLD_SERVICE_ROLE_KEY_HERE';

const NEW_SUPABASE_URL = 'https://mqkazvelueppcravkdsc.supabase.co';
const NEW_SUPABASE_SERVICE_KEY = 'YOUR_NEW_SERVICE_ROLE_KEY_HERE';

// ============================================
// CREATE CLIENTS
// ============================================

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// ============================================
// MIGRATION FUNCTIONS
// ============================================

async function exportUsers() {
    console.log('📤 Exporting users from old database...');

    const { data: users, error } = await oldSupabase.auth.admin.listUsers();

    if (error) {
        console.error('❌ Error exporting users:', error);
        return null;
    }

    console.log(`✅ Found ${users.users.length} users to migrate`);
    return users.users;
}

async function exportProfiles() {
    console.log('📤 Exporting profiles from old database...');

    const { data: profiles, error } = await oldSupabase
        .from('profiles')
        .select('*');

    if (error) {
        console.error('❌ Error exporting profiles:', error);
        return null;
    }

    console.log(`✅ Found ${profiles.length} profiles to migrate`);
    return profiles;
}

async function createUserInNew(user) {
    try {
        // Create user with temporary password
        const { data, error } = await newSupabase.auth.admin.createUser({
            email: user.email,
            email_confirm: true, // Auto-confirm email
            user_metadata: user.user_metadata || {},
            app_metadata: user.app_metadata || {},
        });

        if (error) {
            console.error(`❌ Error creating user ${user.email}:`, error.message);
            return null;
        }

        console.log(`✅ Created user: ${user.email}`);
        return data.user;
    } catch (err) {
        console.error(`❌ Exception creating user ${user.email}:`, err.message);
        return null;
    }
}

async function createProfileInNew(profile, newUserId) {
    try {
        const { data, error } = await newSupabase
            .from('profiles')
            .insert({
                id: newUserId, // Use new user ID
                email: profile.email,
                full_name: profile.full_name,
                role: profile.role || 'user',
                created_at: profile.created_at,
                updated_at: profile.updated_at || new Date().toISOString(),
            });

        if (error) {
            console.error(`❌ Error creating profile for ${profile.email}:`, error.message);
            return false;
        }

        console.log(`✅ Created profile: ${profile.email}`);
        return true;
    } catch (err) {
        console.error(`❌ Exception creating profile for ${profile.email}:`, err.message);
        return false;
    }
}

async function sendPasswordResetEmail(email) {
    try {
        const { error } = await newSupabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://your-app-url.com/reset-password',
        });

        if (error) {
            console.error(`❌ Error sending reset email to ${email}:`, error.message);
            return false;
        }

        console.log(`📧 Sent password reset email to: ${email}`);
        return true;
    } catch (err) {
        console.error(`❌ Exception sending reset email to ${email}:`, err.message);
        return false;
    }
}

// ============================================
// MAIN MIGRATION FUNCTION
// ============================================

async function migrateDatabase() {
    console.log('🚀 Starting database migration...\n');

    // Step 1: Export users
    const oldUsers = await exportUsers();
    if (!oldUsers) {
        console.error('❌ Failed to export users. Aborting migration.');
        return;
    }

    // Step 2: Export profiles
    const oldProfiles = await exportProfiles();
    if (!oldProfiles) {
        console.error('❌ Failed to export profiles. Aborting migration.');
        return;
    }

    // Step 3: Create mapping
    const emailToProfile = {};
    oldProfiles.forEach(profile => {
        emailToProfile[profile.email] = profile;
    });

    // Step 4: Migrate users
    console.log('\n📝 Migrating users...\n');

    const results = {
        success: 0,
        failed: 0,
        emails: []
    };

    for (const user of oldUsers) {
        // Create user in new database
        const newUser = await createUserInNew(user);

        if (newUser) {
            // Create corresponding profile
            const profile = emailToProfile[user.email];
            if (profile) {
                await createProfileInNew(profile, newUser.id);
            }

            // Send password reset email
            await sendPasswordResetEmail(user.email);

            results.success++;
            results.emails.push(user.email);
        } else {
            results.failed++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 5: Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${results.success} users`);
    console.log(`❌ Failed: ${results.failed} users`);
    console.log(`📧 Password reset emails sent to all users`);
    console.log('='.repeat(50));

    if (results.emails.length > 0) {
        console.log('\n📋 Migrated users:');
        results.emails.forEach(email => console.log(`  - ${email}`));
    }

    console.log('\n✅ Migration complete!');
    console.log('⚠️  Users will need to reset their passwords using the email link.');
}

// ============================================
// RUN MIGRATION
// ============================================

// Check if service keys are configured
if (OLD_SUPABASE_SERVICE_KEY === 'YOUR_OLD_SERVICE_ROLE_KEY_HERE' ||
    NEW_SUPABASE_SERVICE_KEY === 'YOUR_NEW_SERVICE_ROLE_KEY_HERE') {
    console.error('❌ Please configure your service role keys in the script!');
    console.log('\nTo get your service role keys:');
    console.log('1. Go to Supabase Dashboard → Settings → API');
    console.log('2. Copy the "service_role" key (NOT the anon key)');
    console.log('3. Update OLD_SUPABASE_SERVICE_KEY and NEW_SUPABASE_SERVICE_KEY in this script');
    console.log('\n⚠️  WARNING: Keep service role keys SECRET! Never commit them to Git!');
    process.exit(1);
}

// Run the migration
migrateDatabase().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
});
