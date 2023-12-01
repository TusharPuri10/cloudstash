import Head from "next/head";
import CloudAndBox from "@/components/CloudAndBox";
import NextNProgress from 'nextjs-progressbar';

export default function App() {

  return (
    <div className="relative z-0 w-full h-screen">
      <NextNProgress color='#FFB000'/>
      <Head>
        <title>Cloud Stash</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="absolute inset-0 z-50 h-20">
          <h1 className="flex justify-center items-center pt-4 mt-8 mr-12 mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">A cloud-based storage service</h1>
          <p className="flex justify-center items-center text-lg font-normal text-white lg:text-xl">Enter the box</p>
        </div>
        <CloudAndBox/>
    </div>
  );
}
