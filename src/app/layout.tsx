import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Use Outfit font for a more premium, modern, and clean look
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Wayfare — AI trip planner",
  description: "Describe your trip. Get a plan you can shape. Explore custom generated day-by-day itineraries and customize your stops.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const settings = JSON.parse(localStorage.getItem('wayfare_settings') || '{}');
                const darkTheme = settings.theme === 'dark' || (!settings.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (darkTheme) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
