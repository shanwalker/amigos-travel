import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mqkazvelueppcravkdsc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2F6dmVsdWVwcGNyYXZrZHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTQ0MTMsImV4cCI6MjA4NTA5MDQxM30.-Evrlhcsw_lkKMVkoKPpjIT2uuMc1ukrdrruYPdpsnM';

// Validate that credentials are available
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
