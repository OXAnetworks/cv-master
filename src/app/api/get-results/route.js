import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  const supabase = createClient();

  const { vacancyId } = await request.json();

  if (!vacancyId) {
    return new Response("Missing vacancyId", { status: 400 });
  }

  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("vacancy_id", vacancyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error getting resumes: ${error.message}`);
    return new Response("Error getting resumes", { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
