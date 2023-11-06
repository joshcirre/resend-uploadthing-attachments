"use client";

import React, { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          // Assuming the response object has a property 'fileUrl'
          setFileUrl(res?.[0].url || null);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      {fileUrl && <p>Uploaded file URL: {fileUrl}</p>}
    </main>
  );
}
