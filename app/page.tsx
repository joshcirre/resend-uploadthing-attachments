// page.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { UploadButton, UploadDropzone, Uploader } from "@/utils/uploadthing";
import { SubmitButton } from "@/components/submit-button";
import { sendEmail } from "@/server/sendEmail";

export default function Home() {
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          // Assuming the response object has a property 'fileUrl'
          setFileUrls(res?.map((file) => file.url) || []);
          setFileNames(res?.map((file) => file.name) || []);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      <form action={() => sendEmail(fileUrls, fileNames)}>
        <SubmitButton />
      </form>
    </main>
  );
}
