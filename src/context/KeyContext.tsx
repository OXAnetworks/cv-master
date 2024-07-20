"use client";

import React, { createContext, useEffect, useState } from "react";

// Define el tipo de dato para el contexto
type KeyContextType = {
  key: string;
  setKey: React.Dispatch<React.SetStateAction<string>>;
};

// Crea el contexto
export const KeyContext = createContext<KeyContextType | undefined>(undefined);

// Crea el proveedor del contexto
export const KeyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [key, setKey] = useState("");

  return (
    <KeyContext.Provider value={{ key, setKey }}>
      {children}
    </KeyContext.Provider>
  );
};

export const useKey = () => {
  const context = React.useContext(KeyContext);
  if (!context) {
    throw new Error("useKey must be used within a KeyProvider");
  }
  return context;
};
