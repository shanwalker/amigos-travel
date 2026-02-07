
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

// Use the NEW project URL and Key directly to verify
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://oocpnxwiyepvkqgbkwev.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
    console.error('❌ VITE_SUPABASE_ANON_KEY is missing. Check your .env file.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkMigration() {
    console.log('🔍 Verifying Database Migration...');

    // 1. Check for 'trips' table
    const { data: trips, error: tripsError } = await supabase.from('trips').select('count', { count: 'exact', head: true });

    if (tripsError) {
        if (tripsError.code === '42P01') { // undefined_table
            console.log('❌ Table "trips" DOES NOT EXIST. Migration has NOT ran.');
            return false;
        }
        console.error('⚠️ Error checking trips (Full):', JSON.stringify(tripsError, null, 2));
    } else {
        console.log('✅ Table "trips" exists.');
    }

    // 2. Check for 'profiles' table
    const { error: profilesError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (!profilesError) console.log('✅ Table "profiles" exists.');

    // 3. Check for 'user_roles' table
    const { error: rolesError } = await supabase.from('user_roles').select('count', { count: 'exact', head: true });
    if (!rolesError) console.log('✅ Table "user_roles" exists.');

    console.log('\n🏁 Conclusion:');
    if (!tripsError && !profilesError && !rolesError) {
        console.log('🚀 DATABASE IS READY! The SQL script was successfully executed.');
        return true;
    } else {
        console.log('🛑 Database is INCOMPLETE. Please run NEW_PROJECT_SETUP.sql.');
        return false;
    }
}

checkMigration();
