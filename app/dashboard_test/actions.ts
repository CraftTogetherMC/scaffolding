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
  authorIcon: string,
  customDate: string,
  imageUrl: string,
  webhookChannel: string,
  onlyDiscord: boolean,
  bodyContent: string
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

    const todayStr = new Date().toISOString().split('T')[0];
    const displayDate = customDate || todayStr;

    // A. MDX DATEI SPEICHERN (Nur wenn nicht "Nur Discord" markiert ist)
    if (!onlyDiscord) {
      const newsDir = path.join(CONTENT_PATH, 'news');
      if (!fs.existsSync(newsDir)) {
        fs.mkdirSync(newsDir, { recursive: true });
      }

      const fileName = `${slug}.mdx`;
      const filePath = path.join(newsDir, fileName);

      // Frontmatter dynamisch aufbauen
      let fileContent = `---\n`;
      fileContent += `title: "${title.replace(/"/g, '\\"')}"\n`;
      fileContent += `date: "${displayDate}"\n`;
      fileContent += `author: "${author.replace(/"/g, '\\"')}"\n`;
      if (authorIcon) fileContent += `authorIcon: "${authorIcon.replace(/"/g, '\\"')}"\n`;
      if (imageUrl) fileContent += `imageUrl: "${imageUrl.replace(/"/g, '\\"')}"\n`;
      fileContent += `---\n\n${bodyContent}\n`;

      await fs.promises.writeFile(filePath, fileContent, 'utf-8');
    }

    // B. DISCORD WEBHOOK LOGIK
    let discordWebhookUrl = '';
    // Holt die Webhook-URLs aus den Environment Variables eures Next-Servers
    if (webhookChannel === 'masercloud') {
      discordWebhookUrl = process.env.WEBHOOK_MASERCLOUD || '';
    } else if (webhookChannel === 'changelog') {
      discordWebhookUrl = process.env.WEBHOOK_CHANGELOG || '';
    }

    if (discordWebhookUrl) {
      const embed: any = {
        title: `📢 Server-News: ${title}`,
        // Nimmt die ersten 4000 Zeichen des Body-Contents als Description für Discord
        description: bodyContent.substring(0, 4000), 
        color: 3454200, 
        footer: {
          text: "CraftTogetherMC – Freebuild mit Vanilla-Feeling",
        }
      };

      // Wenn es auch eine Website-News ist, füge den Link hinzu
      if (!onlyDiscord) {
        embed.url = `https://craft-together-mc.de/news/${slug}`;
      }

      // Autor-Informationen (inkl. Icon falls vorhanden)
      if (author || authorIcon) {
        embed.author = {
          name: author || "Admin-Team",
          icon_url: authorIcon || undefined
        };
      }

      // Bild hinzufügen
      if (imageUrl) {
        embed.image = { url: imageUrl };
      }

      const payload = { embeds: [embed] };

      const res = await fetch(discordWebhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Discord Webhook responded with status:", res.status);
        return { 
          success: true, 
          message: onlyDiscord 
            ? "Nur-Discord-Modus: Senden fehlgeschlagen (Webhook Fehler)." 
            : "News auf Website erstellt, aber Discord-Benachrichtigung schlug fehl."
        };
      }
    } else if (onlyDiscord) {
      return { success: false, message: "Webhook URL für diesen Kanal nicht konfiguriert!" };
    }

    return { 
      success: true, 
      message: onlyDiscord 
        ? "Nachricht erfolgreich an Discord gesendet!" 
        : "News-Beitrag erfolgreich erstellt und gesendet!" 
    };

  } catch (error: any) {
    console.error("Create News Error:", error);
    return { success: false, message: error.message || "Fehler beim Erstellen der News." };
  }
}