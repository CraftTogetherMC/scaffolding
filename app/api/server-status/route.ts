import { status } from "minecraft-server-util";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";



// ===== Minecraft Colorcode List ===== \\
const MC_COLORS: Record<string, string> = {
  "0": "#000000", "1": "#0000AA", "2": "#00AA00", "3": "#00AAAA",
  "4": "#AA0000", "5": "#AA00AA", "6": "#FFAA00", "7": "#AAAAAA",
  "8": "#555555", "9": "#5555FF", "a": "#55FF55", "b": "#55FFFF",
  "c": "#FF5555", "d": "#FF55FF", "e": "#FFFF55", "f": "#FFFFFF",
};



// ===== Player ===== \\
interface ParsedPlayer {
  username: string;
  rank?: string;
  rankColor?: string;
  nameColor?: string;
}



// ===== Player Formatting ===== \\
function parsePlayerName(raw: string): ParsedPlayer {
  let currentColor = "#FFFFFF";
  let rank: string | undefined;
  let rankColor: string | undefined;
  let nameColor: string | undefined;
  let username = "";

  let i = 0;
  while (i < raw.length) {
    if (raw[i] === "§" && i + 1 < raw.length) {
      const code = raw[i + 1].toLowerCase();
      currentColor = MC_COLORS[code] ?? (code === "r" ? "#FFFFFF" : currentColor);
      i += 2;
    } 
    else if (raw[i] === "[") {
      const end = raw.indexOf("]", i);
      
      if (end !== -1) {
        rank = raw.slice(i + 1, end);
        rankColor = currentColor;
        i = end + 1;
        while (i < raw.length && raw[i] === " ") i++;
      } 
      
      else {
        username += raw[i++];
      }
    } 
    else {
      // First non-space character after rank sets the name color
      if (!nameColor && raw[i] !== " ") nameColor = currentColor;
      username += raw[i++];
    }
  }

  username = username.replace(/§./g, "").trim();

  return {
    username: username || raw.replace(/§./g, "").replace(/\[.*?\]\s*/g, "").trim(),
    rank,
    rankColor,
    nameColor: nameColor ?? "#FFFFFF",
  };

}



// ===== § Format Cleaner ===== \\
function cleanString(raw: string): string {
  return raw.replace(/§./g, "").trim();
}



// ===== API Endpoint ===== \\
export async function GET() {
  const host = process.env.MINECRAFT_SERVER_HOST;
  const port = parseInt(process.env.MINECRAFT_SERVER_PORT ?? "25565", 10);

  try {
    const result = await status(String(host), port, { timeout: 5000 });

    return NextResponse.json({

      online: true,
      players: {
        online: result.players.online,
        max: result.players.max,
        list: (result.players.sample ?? []).map((p) => parsePlayerName(p.name)),
      },

      version: cleanString(result.version.name),
      motd: result.motd.clean,

    });
  }

  catch {
    return NextResponse.json({ online: false }, { status: 200 });
  }

}