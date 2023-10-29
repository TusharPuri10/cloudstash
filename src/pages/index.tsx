import Head from "next/head"
import Topbar from "@/components/Topbar";
import Cloud from "@/components/Cloud";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Cloud Stash</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Topbar/>
      <div className="flex" style={{ backgroundColor: '#AEDEFC' }}>
        <div className="flex-auto max-w-xs overflow-hidden rounded-lg shadow-lg h-60">
          <div className="px-6 py-4">
            <h4 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">This is the title</h4>
            <p className="leading-normal text-gray-700">Lorem ipsum dolor, sit amet cons ectetur adipis icing elit. Praesen tium, quibusdam facere quo laborum maiores sequi nam tenetur laud.</p>
          </div>
        </div>
        <div className="ml-auto" >
          <Cloud/>
        </div>
      </div>

    </div>
  );
}

