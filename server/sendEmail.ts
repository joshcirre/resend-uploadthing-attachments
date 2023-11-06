// sendEmail.ts
"use server";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import GithubAccessTokenEmail from "@/components/EmailTemplate";
import { redirect } from "next/navigation";

export async function sendEmail(fileUrls: string[], fileNames: string[]) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const attachments = fileUrls.map((fileUrl, index) => ({
    path: fileUrl,
    filename: fileNames[index],
  }));

  const { data } = await resend.emails.send({
    from: "Josh <josh@sidekicai.com>",
    to: ["josh@zimfy.co"],
    subject: "How's it going?",
    headers: {
      "X-Entity-Ref-ID": randomUUID(),
    },
    attachments,
    react: GithubAccessTokenEmail({ username: "joshcirre" }),
  });

  console.log(data);

  redirect("/success");
}
