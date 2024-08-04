"use client";

import React, { createContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  IconArrowRightBar,
  IconDeviceFloppy,
  IconLoader2,
} from "@tabler/icons-react";
import { Progress } from "@/components/ui/progress";
import { ProgressIndicator } from "@radix-ui/react-progress";
import { Language } from "@/components/Language";

// Define el tipo de dato para el contexto
type KeyContextType = {
  key: string | undefined;
  setKey: React.Dispatch<React.SetStateAction<string | undefined>>;
  form: UseFormReturn<{ key: string }, any, undefined>;
};

// Crea el contexto
export const KeyContext = createContext<KeyContextType | undefined>(undefined);

// Crea el proveedor del contexto
export const KeyProvider: React.FC<{
  children: React.ReactNode;
  apiKey: string | undefined;
}> = ({ children, apiKey }) => {
  const [t, i18n] = useTranslation("global");

  const [key, setKey] = useState<string | undefined>(apiKey || "");
  const [isFocused, setIsFocused] = useState(false);

  const [show, setShow] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [regresiveProgress, setRegresiveProgress] = useState<number>(100);

  const handleFocus = () => {
    setIsFocused(true);
    setError(false);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const formSchema = z.object({
    key: z.string().nonempty(t("SOMETHING_HERE")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const res = await fetch("/api/test-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: values.key,
        language: i18n.language,
      }),
    });

    if (res.ok) {
      localStorage.setItem("openai_key", values.key);

      setKey(values.key);

      const data = await res.json();
      setMessage(data.message);

      const interval = setInterval(() => {
        setRegresiveProgress((prev) => prev - 1);
      }, 100);

      setTimeout(() => {
        setShow(false);
        clearInterval(interval);
      }, 10000);
    } else {
      setError(true);
      form.setError("key", {
        type: "manual",
        message: t("SOMETHING_WEIRD"),
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!key || key === "") {
      setShow(true);
    }
  }, [key, apiKey]);

  useEffect(() => {
    const _key = localStorage.getItem("openai_key");
    if (!key && _key) {
      setKey(_key);
      setShow(false);
    }
  }, [key]);

  return (
    <KeyContext.Provider value={{ key, setKey, form }}>
      {children}
      {show && (
        <div className="fixed max-w-[600px] bottom-10 right-5 left-5 md:translate-x-0 md:left-auto md:right-10 bg-card border border-boder z-50 p-4 rounded-md shadow-xl flex flex-col gap-2">
          {message.length > 0 && (
            <Progress value={regresiveProgress} className="h-0.5" />
          )}

          {message.length === 0 && <p className="text-sm">{t("NO_API_KEY")}</p>}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2 relative"
            >
              <span className="text-7xl absolute translate-x-44 md:-translate-x-24 -translate-y-28 md:-translate-y-4 -rotate-12 drop-shadow-xl z-50">
                {isFocused
                  ? "🙈"
                  : error
                  ? "🤨"
                  : message.length > 0
                  ? "😁"
                  : loading
                  ? "🤔"
                  : "🐵"}
              </span>
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl onFocus={handleFocus} onBlur={handleBlur}>
                      <Input
                        type="password"
                        placeholder="sk-...JLlh"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute bg-card p-2 -top-24 md:-top-20 border border-border rounded-md" />
                  </FormItem>
                )}
              />
              <Button size={"icon"} disabled={loading}>
                {loading ? (
                  <IconLoader2 className="animate-spin" />
                ) : (
                  <IconDeviceFloppy />
                )}
              </Button>
            </form>
          </Form>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      )}
    </KeyContext.Provider>
  );
};

export const useKey = () => {
  const context = React.useContext(KeyContext);
  if (!context) {
    throw new Error("useKey must be used within a KeyProvider");
  }
  return context;
};
