// sendEmail.ts
"use server";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { KittyEmail } from "@/app/components/email-template";
import { redirect } from "next/navigation";
import { renderAsync } from "@react-email/render";

export async function sendEmail(fileUrls: string[], fileNames: string[], emailTo: string, customMessage: string, sendCustomMessage: boolean) {

  const resend = new Resend(process.env.RESEND_API_KEY);

  const html = await renderAsync(KittyEmail({customMessage}) as React.ReactElement);

  const attachments = fileUrls.map((url, i) => ({
    filename: fileNames[i],
    path: url,
  }));

  const { data } = await resend.emails.send({
    from: "Cat Attack <kittycorner@sidekicai.com>",
    to: [emailTo],
    subject: "Would cats make you happy?",
    headers: {
      "X-Entity-Ref-ID": randomUUID(),
    },
    attachments,
    html: html,
  });

  console.log(data);
  redirect("/success");
}
