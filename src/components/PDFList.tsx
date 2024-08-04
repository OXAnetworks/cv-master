"use client";

import React, { useRef, useState } from "react";
import { IconFiles } from "@tabler/icons-react";
import PDFFile from "./PDFFile";
import { CVResult } from "@/lib/type";
import { Separator } from "./ui/separator";
import CVResultProfile from "./CVResultProfile";
import { useTranslation } from "react-i18next";

interface PDFListProps {
  list: CVResult[];
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function PDFList({
  list,
  selectedFiles,
  setSelectedFiles,
}: PDFListProps) {
  const [t] = useTranslation("global");

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    const newFiles = pdfFiles.filter(
      (newFile) => !selectedFiles.some((file) => file.name === newFile.name)
    );

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    const newFiles = pdfFiles.filter(
      (newFile) => !selectedFiles.some((file) => file.name === newFile.name)
    );

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  if (list.length > 0) {
    return (
      <div className="w-full max-h-full bg-muted/50 dark:bg-muted/20 p-4 rounded-lg flex flex-col gap-4 overflow-hidden">
        <div
          className={`w-full h-20 p-4 rounded-lg border-4 border-border border-dashed flex justify-center items-center gap-2 ${
            isDragging ? "bg-blue-100 border-blue-400" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <IconFiles size={72} className="text-muted-foreground" />
          <p className="text-muted-foreground text-sm">{t("DRAG_HERE")}</p>
          <input
            type="file"
            ref={inputRef}
            style={{ display: "none" }}
            accept="application/pdf"
            onChange={handleFileSelect}
            multiple
          />
          {selectedFiles.length > 0 && (
            <> {selectedFiles.length} archivo(s) cargado(s)</>
          )}
        </div>
        <div className="h-full space-y-4 overflow-y-auto">
          {list.map((result) => (
            <div className="w-full flex flex-col gap-4" key={result.id}>
              <Separator />
              <CVResultProfile {...result} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`w-full h-full p-4 rounded-lg border-4 border-border border-dashed flex flex-col justify-center items-center gap-2 ${
          isDragging ? "bg-blue-100 border-blue-400" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <IconFiles size={72} className="text-muted-foreground" />
        <p className="text-muted-foreground text-sm">{t("DRAG_HERE")}</p>
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          accept="application/pdf"
          onChange={handleFileSelect}
          multiple
        />
        {selectedFiles.length > 0 && (
          <div className="mt-4 w-full flex flex-col gap-2">
            {selectedFiles.map((file) => (
              <PDFFile key={file.name} file={file} removeFile={removeFile} />
            ))}
            <p className="text-sm mt-2">
              {selectedFiles.length} archivo(s) cargado(s)
            </p>
          </div>
        )}
      </div>
    );
  }
}
