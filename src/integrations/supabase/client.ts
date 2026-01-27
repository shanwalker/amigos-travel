import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://whdbtkkgesfgqtkfedne.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZGJ0a2tnZXNmZ3F0a2ZlZG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTYwODgsImV4cCI6MjA4NDEzMjA4OH0.GeQsaI7LW29-FL1AIm-lMPqduKaWUyRkH_JNEWTBKms';

// Validate that credentials are available
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
