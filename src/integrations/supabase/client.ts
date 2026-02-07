
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://oocpnxwiyepvkqgbkwev.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vY3BueHdpeWVwdmtxZ2Jrd2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMDE5MDQsImV4cCI6MjA4NTg3NzkwNH0.TDG9GAHODppZFmfmy3ViNtOBAiWJN5K-gDraS_Q83Uw';

// Validate that credentials are available
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
