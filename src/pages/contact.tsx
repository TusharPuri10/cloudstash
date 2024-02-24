import Head from "next/head";
import Character from "@/components/3dmodels/Character";
import NextNProgress from "nextjs-progressbar";
import Topbar from "@/components/UI/Topbar";

export default function App() {
  return (
    <div className="relative z-0 w-full h-screen">
      <NextNProgress color="#FFB000" />
      <Head>
        <title>Cloud Stash</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" inset-y-0 w-full absolute z-50 h-20">
        <Topbar />
        <h1 className="pt-40 pl-8 mb-4 text-3xl text-white font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
          Developed by Tushar Puri
        </h1>
        <p className="pt-4 pr-24 flex justify-center items-center text-lg font-normal text-white lg:text-xl space-x-6">
          <a href="https://github.com/TusharPuri10" target="_blank">
            <img
              className="rounded-full w-10 h-10 bg-white hover:opacity-75"
              src="/icons/github.webp"
              alt=""
            />
          </a>
          <a href="https://twitter.com/TusharP78096727" target="_blank">
            <img
              className="rounded-full w-10 h-10 hover:opacity-75"
              src="/icons/twitter.webp"
              alt=""
            />
          </a>
          <a
            href="https://www.linkedin.com/in/tushar-puri-0b94201a8/"
            target="_blank"
          >
            <img
              className="rounded-full w-10 h-10 hover:opacity-75"
              src="/icons/linkedin.webp"
              alt=""
            />
          </a>
          <a href="https://www.instagram.com/tusharpuri10/" target="_blank">
            <img
              className="rounded-full w-10 h-10 hover:opacity-75"
              src="/icons/instagram.webp"
              alt=""
            />
          </a>
        </p>
      </div>
      <Character />
    </div>
  );
}
