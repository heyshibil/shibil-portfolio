# Supabase setup

1. Create a Supabase project in your own account.
2. Open its SQL Editor and run `schema.sql` once.
3. Copy `.env.example` to `.env.local` and fill the three Supabase values from Settings → API Keys.
4. Never commit `.env.local` or share the secret key.

The secret key is used only by server-side dashboard actions. The public website can read published content only through row-level security policies.
