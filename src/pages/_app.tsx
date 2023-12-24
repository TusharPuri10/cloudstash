import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <RecoilRoot>
        <AnimatePresence>
          <Component {...pageProps} />
        </AnimatePresence>
      </RecoilRoot>
    </SessionProvider>
  );
}
