type RequiredKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  | "SUPABASE_SECRET_KEY"
  | "PORTFOLIO_OWNER_EMAIL";

function read(key: RequiredKey) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function readOptional(key: RequiredKey) {
  return process.env[key] ?? "";
}

export const supabaseConfig = {
  url: () => read("NEXT_PUBLIC_SUPABASE_URL"),
  publishableKey: () => read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  secretKey: () => read("SUPABASE_SECRET_KEY"),
  ownerEmail: () => readOptional("PORTFOLIO_OWNER_EMAIL").toLowerCase(),
};
