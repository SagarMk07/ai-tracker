const requiredServerEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "OPENAI_API_KEY",
] as const;

export function getEnvVar(name: (typeof requiredServerEnv)[number]) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function validateEnv() {
  for (const key of requiredServerEnv) {
    if (!process.env[key]) {
      throw new Error(`Environment validation failed. Missing: ${key}`);
    }
  }
}
