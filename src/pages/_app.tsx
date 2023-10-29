import '@/styles/globals.css'
import { Session } from 'inspector'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import {AnimatePresence} from 'framer-motion';

export default function App({ Component, pageProps }: AppProps) {
  return <SessionProvider session={pageProps.session}>
          <AnimatePresence>
            <Component {...pageProps} />
          </AnimatePresence>
        </SessionProvider>
}
