import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = 'https://ypxaqquelznsaamunkwh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweGFxcXVlbHpuc2FhbXVua3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTA1NzAsImV4cCI6MjA4Mzk4NjU3MH0.QE79cN8zKexFM3R5Iojr0tuZkhRyoJiwPgNUNsTgVio';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
