"use client";
import { useState } from "react";
import { UploadDropzone } from "@/app/utils/uploadthing";
import { SubmitButton } from "@/app/components/submit-button";
import { sendEmail } from "@/app/actions/sendEmail";
import toast from "react-hot-toast";
import { getCatPictures } from "@/app/actions/getCatPictures";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Home() {
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [emailTo, setEmailTo] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [sendCustomMessage, setSendCustomMessage] = useState<boolean>(false);
  const [parent, enableAnimations] = useAutoAnimate();

  const fetchCatPictures = async () => {
    const catPictures = await getCatPictures();
    setFileUrls(
      catPictures.map((cat: { url: string; name: string }) => cat.url)
    );
    setFileNames(
      catPictures.map((cat: { url: string; name: string }) => cat.name)
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 space-y-10">
      <button
        onClick={fetchCatPictures}
        className="px-4 py-2 text-2xl font-bold text-white transition-all duration-500 ease-in-out transform border-2 border-blue-700 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:-translate-y-1"
      >
        Get Random Cat Pictures
      </button>
      <div className="relative flex justify-center text-sm font-medium leading-6">
        <span className="text-xs italic text-gray-900">
          Or upload your own favorite cat pictures.
        </span>
      </div>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          // Assuming the response object has a property 'fileUrl'
          setFileUrls(res?.map((file) => file.url) || []);
          setFileNames(res?.map((file) => file.name) || []);
          toast.success("Upload complete. Let's send some cats!");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      <form
        action={() =>
          sendEmail(
            fileUrls,
            fileNames,
            emailTo,
            customMessage,
            sendCustomMessage
          )
        }
      >
        {fileNames.length > 0 && (
          <div
            className="p-4 text-blue-700 bg-blue-100 border-l-4 border-blue-500"
            role="alert"
          >
            <p className="font-bold">
              {fileNames.length} gorgeous cats ready to send.
            </p>
          </div>
        )}
        <h3 className="mt-4 text-lg font-bold tracking-tight text-blue-900">
          Who should we send these beautiful kitties to?
        </h3>
        <div ref={parent}>
          <div className="flex items-center h-6 mt-4">
            <input
              id="sendCustomMessage"
              aria-describedby="sendCustomMessage-description"
              name="sendCustomMessage"
              type="checkbox"
              checked={sendCustomMessage}
              onChange={(e) => setSendCustomMessage(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
            />
            <div className="ml-3 text-sm leading-6">
              <label
                htmlFor="sendCustomMessage"
                className="font-medium text-gray-900"
              >
                Send custom message
              </label>
            </div>
          </div>
          {sendCustomMessage && (
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              required={sendCustomMessage}
              placeholder="Your custom message"
              className="w-full px-3 py-2 mt-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
            />
          )}
        </div>
        <div className="flex mt-2 space-x-2">
          <input
            type="email"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            placeholder="Recipient's email"
            required
            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
          />
          <SubmitButton />
        </div>
      </form>
    </main>
  );
}
