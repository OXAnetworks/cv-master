"use client";

import React from "react";
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

export default function NewFolder() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const formSchema = z.object({
    title: z
      .string()
      .min(4, t("NEW_VACANCY_ERROR_MIN"))
      .max(30, t("NEW_VACANCY_ERROR_MAX")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("NEW_VACANCY_TITLE")}</DialogTitle>
            <DialogDescription>
              Crearas una nueva vacante donde podras agregar los criterios de
              busqueda, detalles de la vacante y las CVs de los candidatos para
              su evaluacion.
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full flex gap-2 items-center mt-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            placeholder={t("NEW_VACANCY_PLACEHOLDER")}
                            autoComplete="off"
                            minLength={4}
                            maxLength={30}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="absolute " />
                      </FormItem>
                    )}
                  />
                  <Button size={"icon"} className="aspect-square w-12">
                    <IconArrowRight />
                  </Button>
                </form>
               
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <button
        className="w-full flex flex-col gap-1 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="bg-muted aspect-square w-full rounded-md flex justify-center items-center">
          <IconPlus size={48} className="text-muted-foreground" />
        </div>
        {/* <p className="text-center">Nueva vacante</p> */}
      </button>
    </>
  );
}
