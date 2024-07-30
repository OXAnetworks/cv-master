"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import React from "react";

export default function Login() {
  const supabase = createClient();

  const signInWithGoogle = async () => {
    const res = await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div className="size-full flex justify-center items-center">
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    </div>
  );
}
