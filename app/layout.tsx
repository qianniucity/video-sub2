import "@/styles/globals.css"
import { Inter as FontSans } from "next/font/google"
import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/darkmodel/theme-provider";
import { Footer } from "@/components/footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Footer />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
