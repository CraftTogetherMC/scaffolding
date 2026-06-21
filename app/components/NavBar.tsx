"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiHome4Fill,
  RiNewspaperFill,
  RiBookmarkFill,
  RiMap2Fill
} from "react-icons/ri";
import { FaInfo } from "react-icons/fa";


// ===== Link Directory ===== \\ 
const links = [
  { href: "/", label: "Home", icon: RiHome4Fill, external: false },
  { href: "/news", label: "News", icon: RiNewspaperFill, external: false },
  { href: "/regelwerk", label: "Regeln", icon: RiBookmarkFill, external: false },
  { href: "/tutorials", label: "Tutorials", icon: FaInfo, external: false },
  { href: "https://map.craft-together-mc.de", label: "Livemap", icon: RiMap2Fill, external: true },
];


// ===== NavBar Function ===== \\
export const NavBar = () => {
  const path = usePathname();

  // ===== Irgendwas nützliches ===== \\

  // Helper to check if a link is active.
  // For subpages (like /tutorials/regelwerk), it checks if it starts with the link href.
  const isActive = (href: string) => {
    if (href === "/") {
      return path === "/";
    }
    return path.startsWith(href);
  };

  // ===== NavBar Creating ===== \\
  return (
    <nav className="w-full relative z-50 flex flex-col items-center select-none">
      <div className="fixed top-4 block max-w-full px-4">

        <ul className="flex flex-row bg-neutral-900/60 backdrop-blur-lg border border-white/[0.08] p-1.5 rounded-xl shadow-lg shadow-black/40">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              
              <li key={link.href} className="mx-0.5 md:mx-1">
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : "_self"}
                  className={`nav-link ${active ? "nav-link-active" : ""}`}
                >
                  <link.icon className={`text-lg md:mr-1.5 transition-transform duration-300 ${active ? "scale-110 text-brand-cyan" : "text-neutral-400 group-hover:text-white"}`} />

                  {/* Button Mobile Adaption */}
                  <span className={`text-sm tracking-wide md:inline ${active ? "inline font-bold" : "hidden"}`}>
                    {link.label}
                  </span>
                </Link>

              </li>
            );
          })}
        </ul>

      </div>
    </nav>
  );
};
