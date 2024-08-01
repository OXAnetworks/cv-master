"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { Next13ProgressBar } from "next13-progressbar";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { VacancyProvider } from "@/context/VacancySelect";

export default function Providers({
  children,
  apiKey,
}: {
  children: React.ReactNode;
  apiKey: string | undefined;
}) {
  let router = useRouter();

  useEffect(() => {
    if (!apiKey) {
      toast.info("Please enter your OpenAI API key", {
        important: true,
        duration: 60000,
        richColors: true,
        action: {
          label: "Enter your API key",
          onClick: () => {
            router.push("/settings");
          },
        },
        actionButtonStyle: {
          backgroundColor: "#3b82f6",
          color: "#fff",
        },
        cancel: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  }, [apiKey]);

  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <VacancyProvider>
          {children}
          <Toaster />
          <Next13ProgressBar
            height="1.5px"
            color="#3b82f6"
            options={{ showSpinner: false }}
            showOnShallow
          />
        </VacancyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
