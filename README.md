# NextJS, UploadThing, and Resend Attachments

![CleanShot 2023-11-07 at 01 49 23](https://github.com/joshcirre/resend-uploadthing-attachments/assets/8452303/be87245c-b416-4851-a2e8-d6cf6b3ea2ae)


With new libraries, features, frameworks, and seemingly so much more coming out every single week, what's the best way to actually grok (no not X.ai) how to use these features, frameworks, libraries to your advantage.

Well, here's a practical mini-tutorial and example repo for you to get up and running with some of the hottest buzz-words in tech: Resend, UploadThing, and NextJS Server components.

![](https://media.giphy.com/media/tBb19eUNiEjBsYeZPhu/giphy.gif) 

Without further ado, let's create a simple application that can send some attachments (cat pictures) to an email using the Resend API.

First, let's start off with a fresh NextJS install. Or you can go ahead and browse to the `start` branch of this repo, fork it, and follow along that way. It has everything installed for you so you can [skip](https://github.com/joshcirre/resend-uploadthing-attachments/edit/main/README.md#skipping-the-setup) to the part where you can just start connecting things.

### Fresh NextJS Install

Here's the settings I chose but you can go ahead and customize and adjust to your preferences. However, we are going to be using the App directory pretty heavily, so I would suggest making sure that is a preference (at least for today).
![](https://firebasestorage.googleapis.com/v0/b/reflect-prod.appspot.com/o/users%2FOBFxKTIKYoTLGmmlpcVR0a98Yto1%2Fda0015ed8aca4c729d3a588512f22037?alt=media\&token=3619b5c6-ba29-4378-a7cb-a8379942b32e)

Here's some other things that we will npm install just to make sure we have them ready to go when the need arises:
- Formkit/Auto-Animate (to add in some razzle-dazzle)
- React-Email (to make emails look pretty)
- React-Hot-Toast (bread and butter)

As well as the trio of main libraries we will be using today:
- React Email
- UploadThing

and
- Resend

Here's a snippet that helps us get those installed properly:

```
npm install @formkit/auto-animate 
@react-email/components 
@uploadthing/react 
uploadthing resend 
react-hot-toast
```

### Resend and UploadThing Setup

Now there are a few boilerplate files that need to be created in order to get Resend and UploadThing setup and running. Let's start with UploadThing. You can follow the App Router Docs (https://docs.uploadthing.com/getting-started/appdir) on their site for more in-depth setup, but here's a quick 2 minute copy and paste.
1. After signing up (https://uploadthing.com/sign-in), grab a key from your dashboard (https://uploadthing.com/dashboard) and put it in your `.env.local` file.
2. Next, set up a FileRoute. In `app/api/uploadthing/`, create a `core.ts` file and a `route.ts` file.

`core.ts`
```js
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 2 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

`route.ts`
```js
import { createNextRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
```


1. After those files have been created, you'll need to wrap your tailwind.config.ts in the UploadThing `withUt` function.
2. Create UploadThing components

In your app/utils folder, create an `uploadthing.ts` file.

Now onto creating the necessary .env files to get up and running with Resend:
1. If you have not created an account, go ahead and [sign-up](https://resend.com/signup) for the incredible free plan that Resend offers.
2. Once in your dashboard, visit API Keys (https://resend.com/api-keys) to generate one for our application. Place this in the `RESEND_API_KEY` env variable.
3. In order to start sending emails properly, you'll have to make sure you have a domain set up through [Resend](https://resend.com/docs/dashboard/domains/introduction) (don't worry, it shouldn't take too long!) If you run into any issues, feel free to reach out on their [Discord](https://resend.com/discord).

## Skipping the Setup

I went ahead and did all of the above in the `start` branch of this repo and cleaned up some of the out-of-the-box NextJS styles. So if you want to follow along _exactly_, forking the `start` branch might be a good idea. Otherwise, have fun making this tutorial your own and I hope you truly learn how incredible Resend, React Email, and UploadThing can be.

### Server Actions

If this is your first foray into NextJS server actions, there's a lot to take in, and can be quite overwhelming all at once. The gist is that they allow you to write code specifically on the server without having to set up an entirely different API route. This enables you to co-locate client-side code and server-side code in the same file.

So let's create our first action. While server actions can be used as async functions within a page, we are going to use the `app/actions` convention in order to keep things as clean as possible while also being able to bring it into our `use client` page.

Here's the code for our `app/actions/sendEmail.ts` file:

```js
"use server";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { KittyEmail } from "@/app/components/email-template";
import { redirect } from "next/navigation";
import { renderAsync } from "@react-email/render";

export async function sendEmail(
  fileUrls: string[],
  fileNames: string[],
  emailTo: string,
  customMessage: string,
  sendCustomMessage: boolean
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const html = await renderAsync(
    KittyEmail({ customMessage }) as React.ReactElement
  );

  const attachments = fileUrls.map((url, i) => ({
    filename: fileNames[i],
    path: url,
  }));

  const { data } = await resend.emails.send({
    from: "Cat Attack <kittycorner@sidekicai.com>",
    to: [emailTo],
    subject: "Would some cats make you happy?",
    headers: {
      "X-Entity-Ref-ID": randomUUID(),
    },
    attachments,
    html: html,
  });

  console.log(data);
  redirect("/success");
}
```


This allows us to call this `sendEmail` function from within our client code as a form action. No need to setup a specific route, use fetch, and then wait for a response. We can use the tools given to use out of the box with the browser, send off a request to resend to send an email, and then redirect to a different page. Neat, huh?

### The Resend Bit

> As of writing this (Nov. 7th), there is a open issue with a fix that is open on the resendlabs/resend-node (https://github.com/resendlabs/resend-node/pull/259) SDK with a small workaround that we will have to use in order to get react-email templates working with the latest Resend and NextJS version.

Sending emails and attachments is the simplest part of this little demo app because Resend makes it that incredibly easy.

We will get into how we are passing attachments shortly, but sending attachments with the Resend Node SDK is as simple as passing an array with a `filename` and either a `path` or `content` which is a base64 buffer or string.

For this tutorial, we will be using URLs that we either pass from the `thecatapi.com` or using the URL path that is given after using UploadThing to send along with our email. Resend does the hard work of actually attaching those to the email itself.

The `X-Entity-Ref-ID` header is passed a randomUUID so that a new email to the same email address will appear as a separate thread and not be automatically bundled up with any existing emails. This is helpful for a variety of reasons, but for a silly app like this, it's just nice to show off features here and there so that you (the reader) can keep things like this in mind for a production application you might need to use these tools for.

### Get Cat Pictures

Lastly, we will create one more action called `getCatPictures.ts`. This will allow us to hit an external api from within a server action. Again, this is just a cleaner way of doing API calls like you would generally perform if you are used to NextJS pages or any other standard Node-based framework.

```js
"use server";

export async function getCatPictures() {
  const response = await fetch("https://api.thecatapi.com/v1/images/search?limit=2");
  const data = await response.json();
  return data.slice(0, 2).map((cat: any) => {
    const urlParts = cat.url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const name = `${cat.id}.${fileName.split('.')[1]}`;
    return { url: cat.url, name };
  });
}
```


The neat part here is you actually get fetch directly in the async function. You can see in the code that this is slightly different than the Resend server action since we aren't redirecting anywhere. We are just returning data.

So server actions can be called from a form where we know we are going to either revalidate, redirect (or both) OR they can be called from a client like we will do with this getCatPictures function from a standard button onClick event.

## A Few More Goodies

Okay, but how do we actually tell Resend how to display the content we want to send? Well, React Email (also made by the Resend team) is a perfect companion to Resend. You saw in the previous `sendEmail` code that we just passed in a React component and rendered that to HTML. Well take a look at the template code itself.

`app/components/email-template.tsx`

```js
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

export const KittyEmail = ({ customMessage }: { customMessage?: string }) => (
  <Html>
    <Head />
    <Preview>A friend thought you might need some love.</Preview>
    <Body style={main}>
      <Container
        style={{
          ...container,
          textAlign: "center" as
            | "left"
            | "right"
            | "center"
            | "justify"
            | "initial"
            | "inherit",
        }}
      >
        <Heading style={h1}>Kitty Korner</Heading>
        <Text style={text}>
          So we heard you like cats. Here&apos;s some cats from a friend of
          yours who just wants to cheer you up.
        </Text>
        {customMessage && (
          <Container style={quoteBox}>
            <Text style={text}>{customMessage}</Text>
          </Container>
        )}
      </Container>
    </Body>
  </Html>
);

export default KittyEmail;

const main = {
  backgroundColor: "transparent",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  colorScheme: "light dark",
};

const container = {
  margin: "auto",
  padding: "96px 20px 64px",
  textAlign: "center",
};

const h1 = {
  color: "currentColor",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "currentColor",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 40px",
};

const quoteBox = {
  border: "1px solid #ddd",
  padding: "10px",
  margin: "20px 0",
  borderRadius: "5px",
  backgroundColor: "#f9f9f9",
};
```


No, that can't be right? Wizardry.

![](https://media.giphy.com/media/kE3kJ2OZMoMdpJ8ge7/giphy.gif).

Yep, that's absolutely right. React Email allows you to just write React code and then have it magically rendered through something like Resend. Plus, it works on the most popular email clients out there (even Yahoo).

You see here in the code that we are just passing a `customMessage` prop into the KittyEmail component which means we can use it just like if we were using it in any standard React component (because that's exactly what it is).

So, while I'd love to write a whole bunch more explaining how this works and what steps you need to take to make it work, there's really not much to it. The React Email library has multiple components you can use and a library of [popular examples](https://demo.react.email/preview/vercel-invite-user) that are definitely worth taking a look at.

Now, on to the SubmitButton.

`app/components/submit-button.tsx`

```js
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {pending ? 'Sending...' : 'Send'}
        </button>
    )
}
```


We specifically broke this out into its own component to show you exactly how client components can be interspersed and mingled in with server components. Do you see the little `use client` at the top there? We can get the formStatus (the form we are going to use the `sendEmail` server function with here in a bit), and have the text of the button updated as we are waiting for the server function to complete. It's neat. Not only are you getting to use tools built into the browser that makes it compatible without any JavaScript, you can also sprinkle in the interactivity as if you were making a client-side fetch request.

## Putting it Together

`app/page.tsx`

```js
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
```


Now, here's the behemoth of code (it's really not that big) in the `page.tsx` index file. Let's walk it through step-by-step, shall we? First we have State set up for all of the things that we need: form data _(I'm also not incredibly sure there isn't an easier way to pass this in but since we are collecting data from the client and not just using input fields, I think this way is the way to go)._

Next up, we have the fetchCatPictures function. And... there we have it. We are calling the server action in our app/actions folder right in the async call.

There's a button that can fetch the cat pictures.

The UploadDropZone UploadThing helper component.

The form with `action` set to `sendEmail` in our actions folder.

And then finally the `SubmitButton` (which, remember is a client side button) smack dab in the middle of the form that uses the `sendEmail` action.

Of course, there is quite a bit of additional tips, tricks, and niceties like Toast Success on upload, sending a custom message checkbox that animates using Formkit's AutoAnimate plugin, and lastly the Success page that we redirect to:

`app/success/page.tsx`

```js
import Image from "next/image";
import Link from "next/link";

export default function Success() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500 mb-2">Success!</h1>
      <p className="text-2xl text-gray-700 font-semibold">
        A cute cat is on its way to your friend.
      </p>
      <div className="w-96 mt-8 rounded-lg overflow-hidden">
        <Image
          src="/cat.gif"
          layout="responsive"
          width={500}
          height={500}
          objectFit="contain"
          alt="Celebration cat"
        />
      </div>
      <Link
        href="/"
        className=" mt-12 px-4 py-2 text-2xl font-bold text-white transition-all duration-500 ease-in-out transform border-2 border-blue-700 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:-translate-y-1"
      >
        Send Another
      </Link>
    </main>
  );
}
```


Overall, I hope you learned something you might not have known before. The tools we used today separately are fantastic, but together are even more incredible knowing that you can get up-to-speed without having to touch infrastructure you would have otherwise had to mess around for hours with.

### Extra Credit

Looking for something harder? Here's what I would improve if I wanted to continue learning NextJS App Router/Server actions, Resend, and others.
1. Show a random cat picture in the HTML of the email.
2. Set up Auth so that way you know who is sending emails.
3. If no Auth (or even if you do), set up Upstash to do some rate limiting.
4. Set up Zod and do some server validation for inputs.
