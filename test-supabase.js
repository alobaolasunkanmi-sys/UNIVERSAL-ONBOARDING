import { createClient } from '@supabase/supabase-js';

const url = 'https://wdofkmeganxtousspkyr.supabase.co/rest/v1/';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2ZrbWVnYW54dG91c3Nwa3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDM2NTMsImV4cCI6MjEwMDM3OTY1M30.nK97sakkhmCZl1KVB8wU6nOaIpP_ymNSYMOlU2mt-oU';

const supabase = createClient(url, key);

async function test() {
  try {
    const { data, error } = await supabase.from('accounts').select('id').limit(1);
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success! Data:', data);
    }
  } catch (e) {
    console.error('Exception:', e.message);
  }
}
test();
