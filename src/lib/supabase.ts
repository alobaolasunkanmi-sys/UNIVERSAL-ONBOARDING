import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('YOUR_')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to test active Supabase connection
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!supabase) {
    return {
      connected: false,
      message: 'Supabase credentials are missing in environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY).'
    };
  }

  try {
    const { error } = await supabase.from('accounts').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return {
        connected: false,
        message: `Supabase connection attempt failed: ${error.message} (Code: ${error.code})`
      };
    }
    return {
      connected: true,
      message: 'Successfully connected to Supabase database!'
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to communicate with Supabase: ${err.message || 'Unknown network error'}`
    };
  }
}
