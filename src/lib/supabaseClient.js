import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifbiwoqbrrkdwvwqvtqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYml3b3FicnJrZHd2d3F2dHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTQyNDMsImV4cCI6MjA2NzU5MDI0M30.JcRdFR-K2nzG9WDNBLTAwv9fY750sc8hum84jB9GIu8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);