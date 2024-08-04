import { i18nRouter } from "next-i18n-router";
import i18nConfig from "./i18nConfig";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

function includesUUID(pathname) {
  return uuidRegex.test(pathname);
}

function extractUUID(pathname) {
  const match = pathname.match(uuidRegex);
  return match ? match[0] : null;
}

export async function middleware(request) {
  await updateSession(request);

  // const supabase = createClient();
  // const { data, error } = await supabase.auth.getUser();

  // /*if (error || !data?.user) {
  //   redirect("/login");
  // }*/

  // if (data?.user) {
  //   if (request.nextUrl.pathname.includes("/login")) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   } else if (includesUUID(request.nextUrl.pathname)) {
  //     const uuid = extractUUID(request.nextUrl.pathname);

  //     let { data: vacancies, error } = await supabase
  //       .from("vacancies")
  //       .select("*")
  //       .eq("id", uuid);

  //     if (error || !vacancies) {
  //       return NextResponse.redirect(new URL("/", request.url));
  //     }

  //     const vacancy = vacancies[0];

  //     console.log("vacancy", vacancy);

  //     if (vacancy?.user_id === data.user.id) {
  //       return i18nRouter(request, i18nConfig);
  //     } else {
  //       return NextResponse.redirect(new URL("/", request.url));
  //     }
  //   } else {
  //     return i18nRouter(request, i18nConfig);
  //   }
  // }

  // if (!data?.user) {
  //   if (request.nextUrl.pathname.includes("/login")) {
  //     return i18nRouter(request, i18nConfig);
  //   }

  //   if (includesUUID(request.nextUrl.pathname)) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
