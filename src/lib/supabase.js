import { createClient } from '@supabase/supabase-js';

// Use the credentials from your Supabase project
const SUPABASE_URL = 'https://phqraumhwgnkvmstlgbg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocXJhdW1od2dua3Ztc3RsZ2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjc2NTAsImV4cCI6MjA2ODk0MzY1MH0.kvFtevv1oYskxpo9jVZhxz7HEUMLfPI2A2hDLaAvsi8';

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;