"use server";

import fs from 'fs';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'content');

export interface MdxFileItem {
  name: string;
  relativePath: string;
  folder: string;
}

// 1. Get list of all editable MDX files
export async function getMdxFilesList(): Promise<MdxFileItem[]> {
  const filesList: MdxFileItem[] = [];

  const scanDir = (dir: string, folder = "") => {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Only scan direct subfolders (like news/ and tutorials/)
        if (!folder) {
          scanDir(fullPath, item);
        }
      } else if (item.endsWith('.mdx')) {
        filesList.push({
          name: item,
          relativePath: folder ? path.join(folder, item) : item,
          folder: folder,
        });
      }
    });
  };

  scanDir(CONTENT_PATH);
  return filesList;
}

// 2. Read the raw text of a file
export async function readMdxFile(relativePath: string): Promise<string> {
  const safePath = path.join(CONTENT_PATH, relativePath);
  
  // Security check: ensure path is within CONTENT_PATH
  if (!safePath.startsWith(CONTENT_PATH)) {
    throw new Error("Access denied: File path outside of content directory.");
  }

  if (!fs.existsSync(safePath)) {
    throw new Error("File not found.");
  }

  return fs.promises.readFile(safePath, 'utf-8');
}

// 3. Save content to a file
export async function saveMdxFile(relativePath: string, content: string): Promise<{ success: boolean; message: string }> {
  try {
    const safePath = path.join(CONTENT_PATH, relativePath);
    
    // Security check
    if (!safePath.startsWith(CONTENT_PATH)) {
      throw new Error("Access denied: File path outside of content directory.");
    }

    await fs.promises.writeFile(safePath, content, 'utf-8');
    return { success: true, message: "Datei erfolgreich gespeichert!" };
  } catch (error: any) {
    console.error("Save MDX Error:", error);
    return { success: false, message: error.message || "Fehler beim Speichern der Datei." };
  }
}

// 4. Create a new News post and notify Discord Webhook
export async function createNewsPost(
  title: string,
  author: string,
  excerpt: string,
  bodyContent: string,
  discordWebhookUrl?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) {
      throw new Error("Ungültiger Titel für den News-Artikel.");
    }

    const newsDir = path.join(CONTENT_PATH, 'news');
    if (!fs.existsSync(newsDir)) {
      fs.mkdirSync(newsDir, { recursive: true });
    }

    const fileName = `${slug}.mdx`;
    const filePath = path.join(newsDir, fileName);

    const todayStr = new Date().toISOString().split('T')[0];

    // Build MDX with frontmatter
    const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${todayStr}"
author: "${author.replace(/"/g, '\\"')}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
---

${bodyContent}
`;

    await fs.promises.writeFile(filePath, fileContent, 'utf-8');

    // 5. Send announcement to Discord Webhook if provided
    if (discordWebhookUrl && discordWebhookUrl.trim().startsWith('https://discord.com/api/webhooks/')) {
      const payload = {
        embeds: [
          {
            title: `📢 Server-News: ${title}`,
            description: excerpt || "Ein neuer News-Beitrag wurde veröffentlicht!",
            color: 3454200, // Hex equivalent of brand-cyan (#34B4F4)
            url: `https://craft-together-mc.de/news/${slug}`,
            fields: [
              {
                name: "Autor",
                value: author || "Admin-Team",
                inline: true,
              },
              {
                name: "Datum",
                value: todayStr,
                inline: true,
              }
            ],
            footer: {
              text: "CraftTogetherMC – Freebuild mit Vanilla-Feeling",
            }
          }
        ]
      };

      const res = await fetch(discordWebhookUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Discord Webhook responded with status:", res.status);
        return { 
          success: true, 
          message: "News erstellt, aber Discord Webhook-Benachrichtigung schlug fehl." 
        };
      }
    }

    return { success: true, message: "News-Beitrag erfolgreich erstellt!" };
  } catch (error: any) {
    console.error("Create News Error:", error);
    return { success: false, message: error.message || "Fehler beim Erstellen der News." };
  }
}
