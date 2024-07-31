import Editor from "@/components/Editor";
import { CVResult, Vacancy } from "@/lib/type";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import React from "react";

export default async function page({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const user = supabase.auth.getUser();

  if (!(await user).data.user) {
    redirect("/login");
  }

  let { data: vacancie, error } = await supabase
    .from("vacancies")
    .select("*")
    .eq("id", params.id);

  const vacancy: Vacancy | null = vacancie && vacancie[0] ? vacancie[0] : {};

  const { data, error: resumesError } = await supabase
    .from("resumes")
    .select("*")
    .eq("vacancy_id", vacancy?.id)
    .order("created_at", { ascending: false });

  const resumes = data?.map((resume: any) => resume.result);

  const list: CVResult[] | null = resumes ? resumes : [];

  return <Editor vacancy={vacancy} CVList={list} />;
}
