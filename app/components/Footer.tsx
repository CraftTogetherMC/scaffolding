import React from "react";
import Link from "next/link";


// ===== Footer Function ===== \\
export const Footer = () => {
  return (

    <footer id="footer" className="flex flex-col mt-auto w-full">

      <div className="h-24 bg-gradient-to-b from-transparent to-neutral-950/60 pointer-events-none"></div>

      <div className="bg-neutral-950/90 border-t border-white/[0.05] backdrop-blur-md text-sm text-neutral-400 p-8 md:px-16 md:py-12">
        <div className="max-w-[62rem] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">

          {/* Infobereich + Credits */}
          <div className="space-y-3">

            <p className="text-neutral-200">
              <Link href="/" className="font-bold hover:text-brand-cyan transition-colors">
                CraftTogetherMC
              </Link>
              {" "}- Freebuild mit Vanilla-Feeling
            </p>

            <p className="text-neutral-500 max-w-[28rem] leading-relaxed">
              We are not affiliated with or endorsed by{" "}
              <a
                href="https://www.minecraft.net"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-300 transition-colors"
              >
                Mojang Studios / AB
              </a>.
            </p>

            <p className="text-xs text-neutral-600">
              Created with ❤ by the
              {" "}
              <a
                href="https://masercloud.de/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-cyan transition-colors"
              >
                Masercloud Team
              </a>
              {" "} and {" "}
               <a
                href="https://cedrik.me"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-cyan transition-colors"
              >
                Ceddix
              </a>
              
              

            </p>

          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-neutral-300">

            <Link href="/" className="hover:text-brand-cyan transition-colors">
              Home
            </Link>

            <Link href="/news" className="hover:text-brand-cyan transition-colors">
              News
            </Link>

            <Link href="/regelwerk" className="hover:text-brand-cyan transition-colors">
              Regeln
            </Link>

            <Link href="/tutorials/votes" className="hover:text-brand-cyan transition-colors">
              Votes
            </Link>

            <span className="text-neutral-700">|</span>

            <Link href="/impressum" className="hover:text-brand-cyan transition-colors font-medium">
              Impressum
            </Link>

            <Link href="/datenschutz" className="hover:text-brand-cyan transition-colors font-medium">
              Datenschutz
            </Link>
            
          </div>

        </div>
      </div>
    </footer>
  );
};
