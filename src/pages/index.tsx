import Head from "next/head";
import CloudAndBox from "@/components/3dmodels/CloudAndBox";
import NextNProgress from 'nextjs-progressbar';
import Topbar from '@/components/UI/Topbar';

export default function App() {
  return (
    <div className="relative z-0 w-full h-screen">
      <NextNProgress color='#FFB000'/>
      <Head>
        <title>Cloud Stash</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute inset-0 z-50 h-20">
        <Topbar/>
        <h1 className="flex justify-center items-center pt-4 mt-8 mr-4 mb-2 text-2xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl xl:text-6xl">
          A cloud-based storage service
        </h1>
        <p className="flex justify-center items-center text-base font-normal text-white md:text-lg lg:text-xl">
          Enter the box
        </p>
      </div>
      <CloudAndBox/>
    </div>
  );
}
