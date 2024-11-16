import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { Bricolage_Grotesque, Space_Mono } from 'next/font/google'
import '../styles/globals.css'
import CovidNavbar from './nav'

const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: '400',
})

export const metadata = {
  title: 'COVID-19 Dashboard',
  description: 'Interactive COVID-19 data visualization dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-[#1a1b1e] text-white antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <div className="flex min-h-screen flex-col">
          <CovidNavbar />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
