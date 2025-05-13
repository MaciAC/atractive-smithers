import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Meme Viewer',
  description: 'View and interact with memes',
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
              <Link href="/" className="block">
                <h1 className="text-3xl mt-10 font-bold text-left relative group">
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent animate-[gradient_3s_ease_infinite]"></span>
                  <span className="relative inline-block animate-[float_3s_ease-in-out_infinite] hover:animate-none">
                    <span className="animate-[glow_2s_ease-in-out_infinite]">
                      Atractive smithers
                    </span>
                  </span>
                </h1>
              </Link>
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