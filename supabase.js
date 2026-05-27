const SUPABASE_URL = 'https://svsslnlchpekoyrzqyqw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f2cxBGUMYbR8eFOuD70RdQ_KmPouH8E';

export const supabase = {
  from: (table) => ({
    insert: async (data) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) return { error: await res.text() };
      return { error: null };
    },
    upsert: async (data, options) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) return { error: await res.text() };
      return { error: null };
    }
  })
};