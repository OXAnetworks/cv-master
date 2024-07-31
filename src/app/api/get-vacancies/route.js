import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createClient();

  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("vacancies")
    .select("*")
    .eq("user_id", user.data.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error getting vacancies: ${error.message}`);
    return new Response("Error getting vacancies", { status: 500 });
  } else {
    return new Response(JSON.stringify(data), { status: 200 });
  }
}
