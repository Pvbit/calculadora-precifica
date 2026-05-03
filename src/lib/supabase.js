import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wygjvpgnxcpmvfafumwy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Z2p2cGdueGNwbXZmYWZ1bXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMjIyNzcsImV4cCI6MjA5MTc5ODI3N30.Gv46suJHm5ezMVO1jmzpGlqgg4s6pMpnYi7hpVjc4QA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)