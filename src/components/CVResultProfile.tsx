import { CVResult } from "@/lib/type";
import { IconStarFilled, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CVResultProfile({
  id,
  name,
  skills,
  experience,
  summary,
  why,
  isApproved,
  stars,
  contact,
}: CVResult) {
  const [t] = useTranslation("global");

  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${id}`} className="flex gap-4 group">
      <div className="flex justify-center items-center bg-muted-foreground w-12 rounded-full aspect-square group-hover:bg-primary/20 ransition-colors duration-300 ease-in-out">
        <IconUser
          size={32}
          className="text-muted group-hover:text-primary transition-colors duration-300 ease-in-out"
        />
      </div>
      <div className="flex flex-col justify-start items-start">
        <p className="font-bold">{name}</p>
        <p className="text-sm opacity-50">{contact.email || contact.phone}</p>
      </div>
      <div className="flex-1"></div>
      <div className="flex flex-col justify-end text-right">
        <div className="flex items-center gap-1 font-bold justify-end">
          {stars || 0} <IconStarFilled className="text-primary" />{" "}
        </div>
        <p
          className={`text-sm ${isApproved ? "text-primary" : "text-red-500"}`}
        >
          {isApproved ? t("APPROVED") : t("REJECTED")}
        </p>
      </div>
    </Link>
  );
}
