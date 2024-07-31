"use client";

import Folder from "@/components/Folder";
import NewFolder from "@/components/NewFolder";
import { useAuth } from "@/context/AuthContext";
import { Vacancy } from "@/lib/type";
import { IconFolderFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [data, setData] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch("/api/get-vacancies");

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error("Failed to fetch");
      }
      setLoading(false);
    };

    if (user) {
      fetchData();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      <NewFolder />
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full flex flex-col justify-center items-center gap-1 aspect-square relative rounded-lg group opacity-70"
            >
              <div className="w-full flex justify-center items-center group-active:scale-95 transition-transform duration-300 ease-in-out">
                <IconFolderFilled className="size-11/12 text-muted -translate-y-5 animate-pulse" />
              </div>
              <div className="absolute bottom-0 w-full flex flex-col justify-center items-center overflow-hidden text-ellipsis line-clamp-2 mb-2 gap-2 animate-pulse">
                <div className="h-4 bg-muted rounded-md w-full"></div>
                <div className="h-4 bg-muted rounded-md w-1/2"></div>
              </div>
            </div>
          ))
        : data.map((folder) => <Folder key={folder.id} {...folder} />)}
    </div>
  );
}
