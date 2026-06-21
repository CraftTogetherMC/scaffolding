import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMdxBySlug } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { Metadata } from "next";


// ===== File Name ===== \\
const FILE_SLUG = "datenschutz";


// ===== .mdx Metadata ===== \\
export async function generateMetadata(): Promise<Metadata> {
  const data = await getMdxBySlug("", FILE_SLUG);
  
  if (!data) {
    return { title: "Page Not Found" };
  }

  return {
    title: data.frontmatter.title,
    description: data.frontmatter.description,
  };
}


// ===== Main Function ===== \\
export default async function Regelwerk() {
  const data = await getMdxBySlug("", FILE_SLUG);

  if (!data) {
    notFound();
  }

  return (

    <article className="w-full flex-grow px-4 md:px-6 py-28 flex justify-center min-h-screen">
      
        {/* Background Image */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Image
            src="/comand.png" 
            alt="comand"
            fill
            priority 
            quality={75}
            className="object-cover object-center brightness-[0.3]" 
            />
        </div>

      {/* Datenschutz */}
      <div className="glass-card relative z-10 w-full max-w-[50rem] p-6 md:p-10 rounded-2xl shadow-2xl backdrop-blur-xl">
        
        <header className="mb-8 border-b border-white/[0.08] pb-6">
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {data.frontmatter.title}
          </h1>
          
          {data.frontmatter.description && (
            <p className="text-neutral-400 mt-2 text-md md:text-lg">
              {data.frontmatter.description}
            </p>
          )}
        
        </header>

        <div className="prose-custom">
          <MDXRemote source={data.content} />
        </div>
      
      </div>
    </article>
  );
}