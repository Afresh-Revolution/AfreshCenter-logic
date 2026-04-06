import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[supabase] WARNING: SUPABASE_URL or SUPABASE_SERVICE_KEY is not set. ' +
    'Image uploads to Supabase Storage will fail.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
