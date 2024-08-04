import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

// Definir el tipo de datos que se almacenará en el contexto
type AuthContextData = {
  user: User | null;
  signInWithGoogle: () => void;
  logout: () => void;
};

// Crear el contexto
export const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

// Crear el proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const signInWithGoogle = async () => {
    const res = await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const getUser = async () => {
    const res = await supabase.auth.getUser();
    setUser(res.data.user);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          // getUser();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          router.push("/");
        }
      }
    );

    getUser();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
