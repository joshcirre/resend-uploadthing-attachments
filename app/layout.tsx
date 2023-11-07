import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Send a Kitty",
  description:
    "Make someone's day with a cute kitty. Built with Resend, UploadThing, and Next.js.",
};

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        {children}
        <a
          href="https://github.com/joshcirre/resend-uploadthing-attachments"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-6 bottom-6"
        >
          <Image src="/github-mark.svg" alt="Github" width={25} height={25} />
        </a>
      </body>
    </html>
  );
}
