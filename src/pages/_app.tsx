import "@/styles/globals.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <RecoilRoot>
        <AnimatePresence>
        <Head>
        <title>Cloud Stash</title>
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
        </Head>
          <Component {...pageProps} />
        </AnimatePresence>
      </RecoilRoot>
    </SessionProvider>
  );
}
