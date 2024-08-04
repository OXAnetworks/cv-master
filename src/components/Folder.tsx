"use client";

import { Vacancy } from "@/lib/type";
import { IconFolderFilled, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { t } from "i18next";
import { useRouter } from "next13-progressbar";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useVacancies } from "@/context/VacanciesContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

export default function Folder({ id, name }: Vacancy) {
  const { user } = useAuth();
  const { fetchData } = useVacancies();
  const router = useRouter();
  const [t] = useTranslation("global");

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleOpen = () => {
    router.push(`/${id}`);
  };

  const handleDelete = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("userName", user.id);
    formData.append("folderName", name);

    toast.promise(
      fetch("/api/delete-folder", {
        method: "POST",
        body: formData,
      }),
      {
        loading: t("DELETING"),
        success: () => {
          fetchData(false);
          return t("DELETED");
        },
        error: t("DELETED_ERROR"),
      }
    );
  };

  return (
    <>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("DELETE")} <b>{name}</b>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                {t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")} <b>{name}</b>?
              </p>
              <p>{t("THIS_ACTION_IS_IRREVERSIBLE")}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleDelete} variant="destructive">
                {t("DELETE")}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Link
            href={`/${id}`}
            className="w-full flex flex-col justify-center items-center gap-1 cursor-pointer aspect-square relative hover:bg-muted rounded-lg group"
          >
            <div className="w-full flex justify-center items-center group-active:scale-95 transition-transform duration-300 ease-in-out">
              <IconFolderFilled className="size-11/12 text-primary -translate-y-5" />
            </div>
            <p className="text-center absolute bottom-0 w-full overflow-hidden text-ellipsis line-clamp-2 mb-2 text-sm h-10">
              {name}
            </p>
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleOpen}>{t("OPEN")}</ContextMenuItem>
          <ContextMenuItem onClick={() => setOpenAlert(true)}>
            {t("DELETE")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
