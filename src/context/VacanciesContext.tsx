import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Vacancy } from "@/lib/type";

// Define el tipo de datos que se almacenará en el contexto
interface VacanciesContextData {
  vacancies: Vacancy[];
  addVacancy: (vacancy: Vacancy) => void;
  loading: boolean;
  fetchData: (withLoader?: boolean) => void;
}

// Crea el contexto
export const VacanciesContext = createContext<VacanciesContextData>({
  vacancies: [],
  addVacancy: () => {},
  loading: true,
  fetchData: (withLoader = true) => {},
});

// Crea el proveedor del contexto
export const VacanciesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(false);

  const addVacancy = (vacancy: Vacancy) => {
    setVacancies([...vacancies, vacancy]);
  };

  const fetchData = async (withLoader = true) => {
    if (withLoader) setLoading(true);

    const response = await fetch("/api/get-vacancies");

    if (response.ok) {
      const data = await response.json();
      setVacancies(data);
    } else {
      console.error("Failed to fetch");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setVacancies([]);
      setLoading(false);
    }
  }, [user]);

  return (
    <VacanciesContext.Provider
      value={{ vacancies, addVacancy, loading, fetchData }}
    >
      {children}
    </VacanciesContext.Provider>
  );
};

export const useVacancies = () => {
  const context = React.useContext(VacanciesContext);
  if (context === undefined) {
    throw new Error("useVacancies must be used within a VacanciesProvider");
  }
  return context;
};
