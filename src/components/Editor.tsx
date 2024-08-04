"use client";

import PDFList from "@/components/PDFList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useKey } from "@/context/KeyContext";
import { useVacancy } from "@/context/VacancySelect";
import { CVResult, Vacancy } from "@/lib/type";
import { IconLoader2 } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function Editor({
  vacancy,
  CVList,
}: {
  vacancy: Vacancy | null;
  CVList: CVResult[];
}) {
  const { setSelectedVacancy, setSelectedResume } = useVacancy();
  const { key, form } = useKey();

  const [t, i18n] = useTranslation("global");

  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const [formData, setFormData] = useState<{
    vacancyName: string;
    vacancyId: string;
    profileSearch: any;
    skills: any;
    experience: any;
    language: any;
    openaikey: string;
    files: File[];
  }>({
    vacancyName: vacancy?.name || "",
    vacancyId: vacancy?.id || "",
    profileSearch: vacancy?.requirements?.profileSearch || "",
    skills: vacancy?.requirements?.skills || "",
    experience: vacancy?.requirements?.experience || "",
    language: vacancy?.requirements?.language || i18n.language || "",
    openaikey: key || "",
    files: [],
  });

  const [list, setList] = useState<CVResult[]>(CVList || []);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const formatRemainingTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hoursDisplay =
      hours > 0 ? `${hours} ${t("HOUR")}${hours > 1 ? "s" : ""} ` : "";
    const minutesDisplay =
      minutes > 0 ? `${minutes} ${t("MINUTE")}${minutes > 1 ? "s" : ""} ` : "";
    const secondsDisplay = `${seconds} ${t("SECOND")}${seconds > 1 ? "s" : ""}`;

    return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`.trim();
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement; // Asegúrate de que es un HTMLInputElement
    const { name, value, files } = target;

    if (name === "files" && files) {
      const validFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );

      if (validFiles.length !== files.length) {
        alert("Only PDF files are allowed");
      }

      setFormData((prevData) => ({
        ...prevData,
        files: validFiles as File[], // Asegúrate de que el tipo sea File[]
      }));
      setSelectedFiles(validFiles as File[]);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!key || key === "") {
      form.setError("key", {
        type: "manual",
        message: t("SOMETHING_HERE"),
      });
      return;
    }

    setLoading(true);

    const averageTimePerFile = 20000; // Tiempo promedio por archivo en milisegundos (20 segundos)
    const totalFiles = selectedFiles.length;
    const totalTime = totalFiles * averageTimePerFile;

    setRemainingTime(totalTime);

    for (const file of selectedFiles) {
      const data = new FormData();
      data.append("name", formData.vacancyName);
      data.append("profileSearch", formData.profileSearch);
      data.append("skills", formData.skills);
      data.append("experience", formData.experience);
      data.append("language", formData.language);
      data.append("files", file);
      if (key !== undefined || key !== "") {
        data.append("openaikey", key);
      }

      data.append("route", vacancy?.s3_route || "");
      data.append("vacancyName", formData.vacancyName);
      data.append("vacancyId", formData.vacancyId);

      try {
        const response = await fetch("/api/cv-analysis", {
          method: "POST",
          body: data,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        // console.log("Success:", result);
        setList((list) => [...list, result]);

        // Restar el tiempo promedio por archivo una vez que se resuelve la promesa
        setRemainingTime((prevTime) =>
          Math.max(prevTime - averageTimePerFile, 0)
        );
      } catch (error) {
        console.error("Error:", error);
        // Restar el tiempo promedio por archivo incluso si hay un error
        setRemainingTime((prevTime) =>
          Math.max(prevTime - averageTimePerFile, 0)
        );

        toast.error(t("SHOMETHING_WRONG"));
        break;
      }
    }

    setLoading(false);
    setRemainingTime(0); // Restablece el tiempo restante a 0 al finalizar
  };

  useEffect(() => {
    if (vacancy) {
      setSelectedVacancy(vacancy);
    }

    setSelectedResume(null);
  }, [vacancy]);

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-8 h-full">
      <div className="w-full flex-col">
        <div className="space-y-4">
          <div>
            <Label>
              {t("VACANCY_NAME")}
              <Input
                required
                type="text"
                name="vacancyName"
                value={formData.vacancyName}
                onChange={handleChange}
                placeholder={t("VACANCY_NAME_PLACEHOLDER")}
              />
            </Label>
          </div>
          <Separator />
          <div>
            <Label>
              {t("VACANCY_PROFILE_SEARCH")}
              <Textarea
                required
                name="profileSearch"
                value={formData.profileSearch}
                onChange={handleChange}
                className="min-h-[80px] resize-none"
                placeholder="e.g. Software Engineer in New York City"
              />
            </Label>
          </div>
          <div>
            <Label>
              {t("VACANCY_SKILLS")}
              <Textarea
                required
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="min-h-[80px] resize-none"
                placeholder={t("VACANCY_SKILLS_PLACEHOLDER")}
              />
            </Label>
          </div>
          <div>
            <Label>
              {t("VACANCY_EXPERIENCE")}
              <Input
                required
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder={t("VACANCY_EXPERIENCE_PLACEHOLDER")}
              />
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <IconLoader2 className="animate-spin" /> : "Submit"}
          </Button>
          {loading && remainingTime > 0 && (
            <div className="flex justify-end text-sm opacity-50">
              <p>
                {t("REMAINING_TIME")}: {formatRemainingTime(remainingTime)}
              </p>
            </div>
          )}
        </div>
      </div>
      <PDFList
        list={list}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />
    </form>
  );
}
