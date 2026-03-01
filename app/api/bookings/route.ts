import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  sendAdminBookingAlert,
  sendClientBookingConfirmation,
  sendClientStatusEmail,
} from "@/lib/email";

// ─── POST /api/bookings — Create new booking ──────────────────
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { service, price, duration, stylist, slot } = body;

    if (!service || !stylist || !slot) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userName = user.user_metadata?.full_name || user.email || "Guest";

    // Insert booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        user_email: user.email,
        user_name: userName,
        service,
        price,
        duration,
        stylist,
        slot,
        status: "confirmed",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Booking insert error:", error);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    // Fire emails in parallel — don't block the response on email delivery
    await Promise.allSettled([
      sendAdminBookingAlert({
        id: booking.id,
        user_name: userName,
        user_email: user.email ?? "",
        service,
        price,
        duration,
        stylist,
        slot,
      }),
      sendClientBookingConfirmation({
        user_name: userName,
        user_email: user.email ?? "",
        service,
        price,
        duration,
        stylist,
        slot,
      }),
    ]);

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/bookings — Update booking status ──────────────
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Only admins can update status
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    if (!adminEmails.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const validStatuses = ["confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    // Notify client of status change
    if (booking.user_email) {
      await sendClientStatusEmail({
        user_name: booking.user_name,
        user_email: booking.user_email,
        service: booking.service,
        stylist: booking.stylist,
        slot: booking.slot,
        status,
      });
    }

    return NextResponse.json({ booking });
  } catch (err) {
    console.error("PATCH /api/bookings error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
