// app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Booking state params that were passed through the OAuth redirect
  const bookingParams = {
    service: searchParams.get("service") || "",
    stylist: searchParams.get("stylist") || "",
    slot: searchParams.get("slot") || "",
    price: searchParams.get("price") || "",
    duration: searchParams.get("duration") || "",
  };
  const hasBookingState = Boolean(bookingParams.service);

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to booking page with state preserved, or dashboard
      if (hasBookingState) {
        const params = new URLSearchParams();
        Object.entries(bookingParams).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });
        params.set("step", "3"); // Jump straight to confirm step
        return NextResponse.redirect(`${origin}/book?${params.toString()}`);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Auth failed — back to auth with error
  return NextResponse.redirect(`${origin}/auth?error=oauth_failed`);
}
