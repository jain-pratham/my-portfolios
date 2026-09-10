import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@/styles/animations.css";
import ThemeProvider from "@/components/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"]
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["500", "700"]
});

export const metadata = {
  title: "Pratham | ML & Full Stack Developer",
  description:
    "Professional freelance portfolio of Pratham - Machine Learning Developer and Full Stack Developer.",
  keywords: ["Pratham", "Machine Learning", "Full Stack", "Next.js", "MERN", "Portfolio"],
  authors: [{ name: "Pratham" }],
  openGraph: {
    title: "Pratham Portfolio",
    description: "Machine Learning Developer and Full Stack Developer",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${space.variable}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem("theme");
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const theme = stored || (prefersDark ? "dark" : "light");
                  document.documentElement.classList.toggle("dark", theme === "dark");
                } catch (e) {}
              })();
            `
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
