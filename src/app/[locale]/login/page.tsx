"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";
import React from "react";

export default function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="size-full flex justify-center items-center">
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    </div>
  );
}
