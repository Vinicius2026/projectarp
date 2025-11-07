// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push";

// Secrets configurados no Supabase Studio (Edge Functions > Secrets)
const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@example.com";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const { notification_id } = await req.json();

    // 1) Buscar notificação
    const { data: notif, error: nErr } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", notification_id)
      .single();
    if (nErr || !notif) throw nErr || new Error("Notification not found");

    // 2) Buscar inscritos (alvos)
    let subq = supabase.from("push_subscriptions").select("*");
    if (notif.target_type === "user" && notif.target_user_id) {
      subq = subq.eq("user_id", notif.target_user_id);
    }
    const { data: subs, error: sErr } = await subq;
    if (sErr) throw sErr;

    const payload = JSON.stringify({
      title: notif.title,
      message: notif.message,
      url: notif.url || "/",
    });

    // Configurar VAPID (web-push npm via esm.sh)
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    let sent = 0;
    for (const s of subs ?? []) {
      try {
        await webpush.sendNotification(s.subscription_details as any, payload);
        sent++;
      } catch (err) {
        const status = (err as any)?.statusCode || (err as any)?.status || 0;
        if (status === 404 || status === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", s.id);
        }
      }
    }

    await supabase
      .from("notifications")
      .update({ status: "sent", sent_count: sent, target_count: subs?.length || 0 })
      .eq("id", notification_id);

    return new Response(JSON.stringify({ ok: true, sent }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});


