"use client";

import PDFList from "@/components/PDFList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useKey } from "@/context/KeyContext";
import { CVResult, Vacancy } from "@/lib/type";
import { IconLoader2 } from "@tabler/icons-react";
import React, { useState } from "react";

export default function Editor({ vacancy }: { vacancy: Vacancy | null }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vacancyName: vacancy?.name || "",
    profileSearch: "",
    skills: "",
    experience: "",
    language: "",
    files: [],
  });

  const [list, setList] = useState<CVResult[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { key } = useKey();

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      const validFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );
      if (validFiles.length !== files.length) {
        alert("Only PDF files are allowed");
      }
      setFormData((prevData) => ({ ...prevData, files: validFiles }));
      setSelectedFiles(validFiles);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*if (key === "" || key === undefined) {
      alert("Please enter your OpenAI API key");
      return;
    }*/
    setLoading(true);

    for (const file of selectedFiles) {
      const data = new FormData();
      data.append("profileSearch", formData.profileSearch);
      data.append("skills", formData.skills);
      data.append("experience", formData.experience);
      data.append("language", formData.language);
      data.append("files", file);
      if (key !== undefined || key !== "") {
        data.append("openaikey", key);
      }

      data.append("route", vacancy?.s3_route || "");

      try {
        const response = await fetch("/api/cv-analysis", {
          method: "POST",
          body: data,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("Success:", result);
        setList((list) => [...list, result.candidate]);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setLoading(false);
    console.log("DONE");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-8 h-full">
      <div className="w-full flex-col">
        <div className="space-y-4">
          <div>
            <Label>
              Vacancy name:
              <Input
                required
                type="text"
                name="vacancyName"
                value={formData.vacancyName}
                onChange={handleChange}
                placeholder="Software Engineer, Jun 2024"
              />
            </Label>
          </div>
          <Separator />
          <div>
            <Label>
              Profile Search:
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
              Skills:
              <Textarea
                required
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="min-h-[80px] resize-none"
                placeholder="e.g. JavaScript, React, Node.js"
              />
            </Label>
          </div>
          <div>
            <Label>
              Experience:
              <Input
                required
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 5"
              />
            </Label>
          </div>
          <div>
            <Label>
              Language:
              <Input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g. English, Spanish"
              />
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <IconLoader2 className="animate-spin" /> : "Submit"}
          </Button>
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
