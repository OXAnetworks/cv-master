/* eslint-disable @next/next/no-img-element */
"use client";

import { useVacancy } from "@/context/VacancySelect";
import { Resume } from "@/lib/type";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconLoader2, IconStar, IconStarFilled } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { useTranslation } from "react-i18next";

export default function ResumeInfo({ resume }: { resume: Resume }) {
  const supabase = createClient();
  const [t] = useTranslation("global");

  const { setSelectedResume } = useVacancy();
  const [pdfImgae, setPdfImage] = useState<string>("");
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [pdf, setPdf] = useState<any>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const getPdfImage = async () => {
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(`${resume.id}.png`, 3600);

    if (error) {
      console.error(error);
      return;
    }

    setPdfImage(data.signedUrl);
  };

  const getPdf = async () => {
    setLoadingPdf(true);

    const formData = new FormData();
    formData.append("path", resume.s3_route);

    const res = await fetch("/api/get-pdf", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    setPdf(url + "#zoom=100&view=FitH&pagemode=thumbs");

    setLoadingPdf(false);
  };

  useEffect(() => {
    setSelectedResume(resume);
  }, []);

  useEffect(() => {
    getPdfImage();
    getPdf();
  }, [resume]);

  return (
    <>
      <Dialog open={openPdfViewer} onOpenChange={setOpenPdfViewer}>
        <DialogContent className="max-w-full md:max-w-[70%] h-full md:h-[95%] ">
          <DialogHeader>
            <DialogTitle className="hidden">{resume.result.name}</DialogTitle>
            <div className="w-full h-full rounded-md overflow-hidden">
              <iframe src={pdf} className="w-full h-full"></iframe>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <button
            disabled={loadingPdf}
            onClick={() => setOpenPdfViewer(true)}
            className="w-full md:w-48 aspect-[1/1.41] border rounded-md border-border p-2 group cursor-pointer relative flex justify-center items-center disabled:cursor-progress"
          >
            {loadingPdf && (
              <IconLoader2 className="animate-spin absolute z-50 text-primary" />
            )}
            {pdfImgae ? (
              <img
                src={pdfImgae}
                alt=""
                className={`size-full group-hover:scale-105 transition duration-300 ease-in-out rounded-md crisp-edges bg-muted/50 ${
                  loadingPdf && "opacity-50"
                }`}
              />
            ) : (
              <div className="size-full bg-muted/50 rounded-md animate-pulse"></div>
            )}
          </button>
          <div className="p-4 border border-border w-full rounded-md flex flex-col gap-4">
            <div className="flex gap-4 items-center justify-between">
              <h1 className="text-xl font-bold">{resume.result.name}</h1>
              <div className="flex flex-col">
                {resume.result.isApproved ? (
                  <p className="text-primary font-bold text-end">{t("APPROVED")}</p>
                ) : (
                  <p className="text-red-500 font-bold text-end">{t("REJECTED")}</p>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: resume.result.stars }).map(
                          (_, i) => (
                            <IconStarFilled
                              key={i}
                              size={16}
                              className="text-primary"
                            />
                          )
                        )}
                        {Array.from({ length: 5 - resume.result.stars }).map(
                          (_, i) => (
                            <IconStar
                              key={i}
                              size={16}
                              className="text-primary"
                            />
                          )
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Calificación {resume.result.stars}/5 </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="">
              <h2 className="text-sm opacity-70 mb-1">{t("SUMMARY")}</h2>
              <p>{resume.result.summary}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="p-4 border border-border rounded-md w-full md:w-1/3">
            <h2 className="text-sm opacity-70 mb-1">{t("EXPERIENCE")}</h2>
            {resume.result.experience.map((exp, i) => (
              <ul key={i} className="list-disc list-inside space-y-2">
                <li className="capitalize">{exp}</li>
              </ul>
            ))}
          </div>
          <div className="p-4 border border-border rounded-md w-full md:w-1/3">
            <h2 className="text-sm opacity-70 mb-1">{t("SKILLS")}</h2>
            {resume.result.skills.map((skill, i) => (
              <ul key={i} className="list-disc list-inside">
                <li className="capitalize">{skill}</li>
              </ul>
            ))}
          </div>
          <div className="p-4 border border-border rounded-md w-full md:w-1/3">
            <h2 className="text-sm opacity-70 mb-1">{t("CONTACT")}</h2>
            <ul className="list-disc list-inside">
              <li>{resume.result.contact.email}</li>
              <li>{resume.result.contact.phone}</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-4 ">
          <div className="p-4 border border-border rounded-md w-full">
            <h2 className="text-sm opacity-70 mb-1">{t("WHY")}</h2>
            {resume.result.why}
          </div>
        </div>
      </div>
    </>
  );
}
