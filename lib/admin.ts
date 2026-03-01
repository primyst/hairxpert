import { createServerSupabaseClient } from "@/lib/supabase-server";

/**
 * Returns the current user if they are an admin, otherwise null.
 * Admin emails are set via ADMIN_EMAILS env var (comma-separated).
 * e.g. ADMIN_EMAILS=owner@hairxpert.com,manager@hairxpert.com
 */
export async function getAdminUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes(user.email.toLowerCase())) return null;

  return user;
}

export function isAdminEmail(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}
