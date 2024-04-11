import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

const supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_KEY
);

export default supabase;
