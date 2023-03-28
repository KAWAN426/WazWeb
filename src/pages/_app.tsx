import type { AppProps } from 'next/app'
import { Inter } from '@next/font/google'
import { GlobalStyle } from '../css/globals';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const font = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  useEffect(() => {
    const styleSheet = document.styleSheets[document.styleSheets.length - 1]
    if (styleSheet && styleSheet.ownerNode) (styleSheet.ownerNode as HTMLElement).id = "compyDesign"
  }, [])
  return (
    <>
      {
        pathname !== "/design/[id]/view"
          ? <>
            <style jsx global>{`
              html { font-family: ${font.style.fontFamily}; }
            `}</style>
            <GlobalStyle />
          </> : null
      }
      <Component {...pageProps} />
    </>
  )
}
