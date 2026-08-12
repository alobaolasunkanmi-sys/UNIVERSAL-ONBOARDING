import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn(
        'Supabase URL or Anon Key missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in environment variables.'
      );
    }
    // Sanitize URL to ensure base project origin (stripping /rest/v1/ if included)
    let rawUrl = supabaseUrl || 'https://tabvggcparpohjfochsz.supabase.co';
    rawUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    
    const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhYnZnZ2NwYXJwb2hqZm9jaHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NTUwNjksImV4cCI6MjEwMDIzMTA2OX0.QJPVYlD8HT54VaqAmx4qZGt_Q6N8_xXigE8rS9ALA9M';
    supabaseInstance = createClient(rawUrl, key);
  }
  return supabaseInstance;
}

export const supabase = getSupabase();
