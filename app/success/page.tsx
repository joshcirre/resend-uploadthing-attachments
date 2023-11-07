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
      <Link href="/">
        <button className=" mt-12 px-4 py-2 text-2xl font-bold text-white transition-all duration-500 ease-in-out transform border-2 border-blue-700 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:-translate-y-1">
          Send another one
        </button>
      </Link>
    </main>
  );
}
