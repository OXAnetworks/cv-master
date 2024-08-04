"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { Next13ProgressBar } from "next13-progressbar";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { VacancyProvider } from "@/context/VacancySelect";
import { VacanciesProvider } from "@/context/VacanciesContext";
import { KeyProvider } from "@/context/KeyContext";

export default function Providers({
  children,
  apiKey,
}: {
  children: React.ReactNode;
  apiKey: string | undefined;
}) {


  return (
    <AuthProvider>
      <KeyProvider apiKey={apiKey}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <VacanciesProvider>
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
          </VacanciesProvider>
        </ThemeProvider>
      </KeyProvider>
    </AuthProvider>
  );
}
