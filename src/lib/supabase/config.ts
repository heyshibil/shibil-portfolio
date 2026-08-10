type RequiredKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  | "SUPABASE_SECRET_KEY"
  | "PORTFOLIO_OWNER_EMAIL";

function read(key: RequiredKey, { required = true }: { required?: boolean } = {}) {
  const value = process.env[key]?.trim();
  if (!value) {
    if (!required) {
      return "";
    }

    if (process.env.NODE_ENV === "production") {
      console.warn(`Missing required environment variable: ${key}. Continuing with an empty value.`);
      return "";
    }

    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function hasValue(key: RequiredKey) {
  return Boolean(read(key, { required: false }));
}

export const supabaseConfig = {
  url: () => read("NEXT_PUBLIC_SUPABASE_URL"),
  publishableKey: () => read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  secretKey: () => read("SUPABASE_SECRET_KEY"),
  ownerEmail: () => read("PORTFOLIO_OWNER_EMAIL", { required: false }).toLowerCase(),
  hasPublicConfig: () => hasValue("NEXT_PUBLIC_SUPABASE_URL") && hasValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  hasAdminConfig: () => hasValue("NEXT_PUBLIC_SUPABASE_URL") && hasValue("SUPABASE_SECRET_KEY"),
};
