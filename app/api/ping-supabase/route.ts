import { supabase } from "@/lib/db"

export async function HEAD() {
  try {
    await supabase.from("heartbeat").select("id").limit(1);
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 500 });
  }
}