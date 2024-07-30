"use client";

import React, { useEffect } from "react";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

export default function NewLogin() {
  const router = useRouter();

  return (
    <>
      <button
        className="w-full flex flex-col gap-1 cursor-pointer"
        onClick={() => router.push("/login")}
      >
        <div className="bg-muted aspect-square w-full rounded-md flex justify-center items-center">
          <IconPlus size={48} className="text-muted-foreground" />
        </div>
      </button>
    </>
  );
}
