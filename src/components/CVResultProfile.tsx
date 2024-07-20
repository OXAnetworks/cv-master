import { CVResult } from "@/lib/type";
import { IconStarFilled, IconUser } from "@tabler/icons-react";
import React from "react";

export default function CVResultProfile({
  name,
  skills,
  experience,
  resume,
  why,
  isApproved,
  stars,
}: CVResult) {
  return (
    <div className="flex gap-4">
      <div className="flex justify-center items-center bg-muted-foreground w-12 rounded-full aspect-square">
        <IconUser size={32} className="text-muted" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="font-bold">{name}</p>
        
      </div>
      <div className="flex-1"></div>
      <div className="flex flex-col justify-end text-right">
        <div className="flex items-center gap-1 font-bold justify-end">
          {stars || 0} <IconStarFilled className="text-primary" />{" "}
        </div>
        <p
          className={`text-sm ${
            isApproved ? "text-primary" : "text-red-500"
          }`}
        >
          {isApproved ? "Approved" : "Rejected"}
        </p>
      </div>
    </div>
  );
}
