import { createClient } from '@supabase/supabase-js';

// Credentials provided for Cutverse Team
const supabaseUrl = 'https://vffchkaznhnyuujmpwts.supabase.co';
const supabaseKey = 'sb_publishable_FDEKhbCoKe01Z1OUvEQ7MA_E0dT1v3S';

export const supabase = createClient(supabaseUrl, supabaseKey);