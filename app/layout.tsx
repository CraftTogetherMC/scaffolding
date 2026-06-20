import type { Metadata } from "next";
import { Fira_Sans, Nata_Sans } from "next/font/google";
import "./globals.css";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";



// ===== Schrift ===== \\
const fira = Fira_Sans({
  subsets: ['latin'],
  weight: "400",
  display: "swap"
})



// ===== Site Metadata ===== \\
export const metadata: Metadata = {
  title: {
    default: "CraftTogetherMC",
    template: "%s - CraftTogetherMC",
  },
  keywords: "minecraft server vanilla freebuild survival citybuild craft together creeper mobspawn redstone craft attack",
  description: "CraftTogetherMC ist ein gemütlicher, aufstrebender Minecraft-Server und richtet sich an Freunde des originalgetreuen Minecraft. Gespielt wird \'Survival\' im Freebuild! Es gibt bei uns keine Plots, Claims oder Grundstücke. Der perfekte Server für CraftAttack-Fans.",
  icons: {
    icon: "/favicon.ico",
  },
};



// ===== Main Layout ===== \\
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fira.className} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col bg-neutral-dark text-neutral-200">
        <NavBar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>

    </html>
  );
}
