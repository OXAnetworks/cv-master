import { i18nRouter } from "next-i18n-router";
import i18nConfig from "./i18nConfig";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request) {
  // Primero actualizamos la sesión
  await updateSession(request);
  // Luego manejamos la internacionalización
  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
