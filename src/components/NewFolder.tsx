import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export default function NewFolder() {
  return (
    <Link
      href={"/new"}
      className="w-full flex flex-col gap-1 cursor-pointer"
    >
      <div className="bg-muted aspect-square w-full rounded-md flex justify-center items-center">
        <IconPlus size={48} className="text-muted-foreground" />
      </div>
      {/* <p className="text-center">Nueva vacante</p> */}
    </Link>
  );
}
