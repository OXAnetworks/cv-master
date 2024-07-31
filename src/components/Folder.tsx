import { Vacancy } from "@/lib/type";
import { IconFolderFilled, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export default function Folder({
  id,
  name,
  created_at,
  requirements,
  s3_route,
  user_id,
}: Vacancy) {
  return (
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
  );
}
