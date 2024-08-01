"use client";

import React from "react";
import { ToggleTheme } from "./ToggleTheme";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IconHome } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Language } from "./Language";
import User from "./User";
import { useVacancy } from "@/context/VacancySelect";

const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

function includesUUID(pathname: string) {
  return uuidRegex.test(pathname);
}

export default function Navbar() {
  let pathname = usePathname();
  const { selectedVacancy } = useVacancy();

  return (
    <div className="w-full p-4 bg-card border border-border rounded-md flex justify-between items-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <IconHome />{" "}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {/* {pathname.split("/").map((path, index) => {
            if (path === "") return null;
            return (
              <>
                <BreadcrumbItem key={path}>
                  <BreadcrumbLink asChild className="capitalize">
                    <Link href={pathname.split(path)[0]}>{path}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < pathname.split("/").length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </>
            );
          })} */}
          <BreadcrumbLink>
            {(selectedVacancy && includesUUID(pathname)) && selectedVacancy.name}
          </BreadcrumbLink>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <ToggleTheme />
        <Language />
        {/* <Button asChild size={"icon"} variant={pathname === "/settings" ? "secondary" : "outline"}>
          <Link href="/settings">
            <IconSettings />
          </Link>
        </Button> */}
        <User />
      </div>
    </div>
  );
}
