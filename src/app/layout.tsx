import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Atractive Smithers',
    template: '%s | Atractive Smithers'
  },
  description: 'Atractive Smithers',
  keywords: ['memes', 'atractive', 'smithers', 'nyocla'],
  authors: [{ name: "Un fan d'Atractive Smithers" }],
  creator: 'Un fan d\'Atractive Smithers',
  publisher: 'Un fan d\'Atractive Smithers',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://atractivesmithers.com'),
  openGraph: {
    type: 'website',
    locale: 'ca_ES',
    url: 'https://atractivesmithers.com',
    title: 'Atractive Smithers',
    description: 'Atractive Smithers',
    siteName: 'Atractive Smithers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atractive Smithers',
    description: 'Atractive Smithers',
    creator: '@atractive_smithers',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jetbrainsMono.className} min-h-screen antialiased relative`}>
        <div
          className="fixed inset-0 bg-[url('/atractive_smithers.jpg')] bg-contain md:bg-cover bg-center bg-no-repeat"
          style={{
            filter: 'brightness(0.3)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="relative z-10">
          <header className="py-4">
            <div className="container">
              <div className="flex flex-col md:flex-row items-center justify-between relative">
                <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
                  <Link href="/" className="pointer-events-auto">
                    <h1 className="text-3xl mt-2font-bold relative group">
                      <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent animate-[gradient_3s_ease_infinite]"></span>
                      <span className="relative inline-block animate-[float_3s_ease-in-out_infinite] hover:animate-none">
                        <span className="animate-[glow_2s_ease-in-out_infinite]">
                          Atractive smithers
                        </span>
                      </span>
                    </h1>
                  </Link>
                </div>
                <div className="invisible md:visible">
                  {/* Spacer to balance the right side */}
                </div>
                <div className="flex flex-row gap-4 z-10 pt-12 md:pt-0">
                  <Link href="/posts" className="group">
                    <div className="bg-gray-300 rounded-xl p-2 transition-all duration-300 hover:scale-105">
                      <h2 className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">
                        <img src='/search.ico' alt='posts' height={32} width={32}/>
                      </h2>
                    </div>
                  </Link>
                  <Link href="/comentaris" className="group">
                    <div className="bg-gray-300 rounded-xl p-2 transition-all duration-300 hover:scale-105">
                      <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        <img src='/comments.ico' alt='comentaris' height={32} width={32}/>
                      </h2>
                    </div>
                  </Link>
                  <Link href="/whatsapp3" className="group">
                    <div className="bg-gray-300 rounded-xl p-2 transition-all duration-300 hover:bg-green-700 hover:scale-105">
                      <h2 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                        <img src='/w3.ico' alt='WhatsApp' height={32} width={32}/>
                      </h2>
                    </div>
                  </Link>
                  <Link href="/karaoke-eteri" className="group">
                    <div className="bg-gray-300  rounded-xl p-2 transition-all duration-300 hover:bg-green-700 hover:scale-105">
                      <h2 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                        <img src='/sing.ico' alt='karaoke' height={32} width={32}/>
                      </h2>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}