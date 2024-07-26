import { IconFolderFilled, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface FolderProps {
  id: string;
  name: string;
}

export default function Folder({ name, id }: FolderProps) {
  return (
    <Link
      href={`/${id}`}
      className="w-full flex flex-col justify-center items-center gap-1 cursor-pointer aspect-square relative hover:bg-muted rounded-lg group"
    >
      <div className="w-full flex justify-center items-center group-active:scale-95 transition-transform duration-300 ease-in-out">
        <IconFolderFilled className="size-11/12 text-primary -translate-y-5" />
      </div>
      <p className="text-center absolute bottom-0 w-full overflow-hidden text-ellipsis line-clamp-2 mb-2">
        {name}
      </p>
    </Link>
  );
}
