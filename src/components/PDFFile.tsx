"use client";

import React from "react";
import { IconX } from "@tabler/icons-react";

interface PDFFileProps {
  file: File;
  removeFile: (file: File) => void;
}

const PDFFile: React.FC<PDFFileProps> = ({ file, removeFile }) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded-lg">
      <p className="truncate max-w-xs">{file.name}</p>
      <button
        className="ml-2 text-red-500"
        onClick={(e) => {
          e.stopPropagation();
          removeFile(file);
        }}
      >
        <IconX size={16} />
      </button>
    </div>
  );
};

export default PDFFile;
