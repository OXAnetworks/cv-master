"use client";

import React from "react";
import { ToggleTheme } from "./ToggleTheme";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IconHome, IconSearch, IconSettings } from "@tabler/icons-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
          {pathname.split("/").map((path, index) => {
            if (path === "") return null;
            return (
              <>
                <BreadcrumbItem key={path}>
                  <BreadcrumbLink asChild className="capitalize">
                    <Link href={pathname.split(path)[1]}>{path}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < pathname.split("/").length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        {/* <ToggleTheme /> */}
        <Button asChild size={"icon"} variant={pathname === "/settings" ? "secondary" : "outline"}>
          <Link href="/settings">
            <IconSettings />
          </Link>
        </Button>
      </div>
    </div>
  );
}
