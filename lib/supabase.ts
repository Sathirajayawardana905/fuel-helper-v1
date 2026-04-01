import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qbzpvjbpgeekkyctupco.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienB2amJwZ2Vla2t5Y3R1cGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzAwMDMsImV4cCI6MjA4OTUwNjAwM30._UvZxlt9TrU3yQa4HawWsWn-VZF9eEJBrPsqukmIHO4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);