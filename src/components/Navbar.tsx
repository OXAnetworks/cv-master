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

export default function Navbar() {
  let pathname = usePathname();

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
      </div>
    </div>
  );
}
