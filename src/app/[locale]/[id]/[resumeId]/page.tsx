import ResumeInfo from "@/components/ResumeInfo";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Resume({
  params,
}: {
  params: { resumeId: string };
}) {
  const supabase = createClient();
  const user = supabase.auth.getUser();

  if (!(await user).data.user) {
    redirect("/login");
  }

  let { data: resumes, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", params.resumeId);

  const resume = resumes && resumes[0] ? resumes[0] : null;

  if (resume) {
    return <ResumeInfo resume={resume} />;
  } else {
    return redirect("/");
  }
}
