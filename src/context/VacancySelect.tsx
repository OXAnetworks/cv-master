"use client";

import { Resume, Vacancy } from "@/lib/type";
import React, { createContext, useState } from "react";

// Crea el contexto de la vacante seleccionada
export const VacancyContext = createContext<{
  selectedVacancy: Vacancy | null;
  setSelectedVacancy: React.Dispatch<React.SetStateAction<Vacancy | null>>;
  selectedResume: Resume | null;
  setSelectedResume: React.Dispatch<React.SetStateAction<Resume | null>>;
}>({
  selectedVacancy: null,
  setSelectedVacancy: () => {},
  selectedResume: null,
  setSelectedResume: () => {},
});

// Componente proveedor del contexto
export const VacancyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  return (
    <VacancyContext.Provider
      value={{
        selectedVacancy,
        setSelectedVacancy,
        selectedResume,
        setSelectedResume,
      }}
    >
      {children}
    </VacancyContext.Provider>
  );
};

export const useVacancy = () => {
  const context = React.useContext(VacancyContext);
  if (!context) {
    throw new Error("useVacancy must be used within a VacancyProvider");
  }
  return context;
};
