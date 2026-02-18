const requiredServerEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "OPENAI_API_KEY",
] as const;

type RequiredServerEnv = (typeof requiredServerEnv)[number];

let validated = false;

export function getEnvVar(name: RequiredServerEnv) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function validateEnv() {
  if (validated) {
    return;
  }

  const missing = requiredServerEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Environment validation failed. Missing: ${missing.join(", ")}`);
  }

  validated = true;
}
