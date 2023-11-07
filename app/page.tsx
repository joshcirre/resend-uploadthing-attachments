"use client";
import { UploadDropzone } from "@/app/utils/uploadthing";
import toast from "react-hot-toast";

export default function Home() {

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 space-y-10">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);

          toast.success("Upload complete. Let's send some cats!");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
