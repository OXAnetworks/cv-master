import Editor from "@/components/Editor";
import { Vacancy } from "@/lib/type";
import { createClient } from "@/utils/supabase/server";
import React from "react";

export default async function page({ params }: { params: { id: string } }) {
  const supabase = createClient();

  let { data: vacancie, error } = await supabase
    .from("vacancies")
    .select("*")
    .eq("id", params.id);

  const vacancy: Vacancy | null = vacancie && vacancie[0] ? vacancie[0] : {};

  return <Editor vacancy={vacancy} />;
}
