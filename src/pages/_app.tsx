import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import {AnimatePresence} from 'framer-motion';
import Topbar from '@/components/Topbar';

export default function App({ Component, pageProps }: AppProps) {
  return <SessionProvider session={pageProps.session}>
          <AnimatePresence>
          <Topbar/>
            <Component {...pageProps} />
          </AnimatePresence>
        </SessionProvider>
}
