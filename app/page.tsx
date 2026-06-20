"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  RiFileCopy2Fill,
  RiDiscordFill,
  RiArrowRightUpLine,
  RiPlayFill,
  RiInstagramFill,
  RiYoutubeFill,
  RiFacebookCircleFill,
  RiTwitterFill
} from "react-icons/ri";



// ===== Types ===== \\
interface Player {
  username: string;
  rank?: string;
  rankColor?: string;
  nameColor?: string;
}


// ===== Server Status ===== \\
interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
    list?: Player[];
  };
  version?: string;
}



// ===== Home Page ===== \\
export default function Home() {

  // === Environment Variable Loading === \\
  const serverIp = process.env.NEXT_PUBLIC_SERVER_IP;
  const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE;

  const [status, setStatus] = useState<ServerStatus>({ online: false });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);


  // === API Calls === \\
  const fetchStatus = () => {
    fetch("/api/server-status")
      .then((res) => res.json())
      .then((data) => {
        if (data.online) {
          const playerList: Player[] = data.players?.list ?? [];
          setStatus({
            online: true,
            players: {
              online: data.players?.online,
              max: data.players?.max,
              list: playerList,
            },
            version: data.version,
          });
        } else {
          setStatus({ online: false });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch server status", err);
        setLoading(false);
      });
  };


  // === Server Status Refreshing === \
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);


  // === Copy IP Address === \\
  const handleCopyIp = () => {
    navigator.clipboard.writeText(String(serverIp));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  // === Page Structure === \\
  return (
    <main className="w-full flex-grow">

      {/* Top Section (Video, Logo, Mini Beschreibung, Buttons) */}
      <section id="hero" className="relative h-[42rem] flex flex-col justify-center items-center px-4 text-center overflow-hidden">

        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-50"
        >
          <source src="/background1.webm" type="video/webm" />
        </video>

        <div className="absolute inset-0 bg-neutral-950/60 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,180,244,0.08),transparent_65%)] z-[1]" />

        {/* Logo + Buttons */}
        <div className="z-[2] max-w-[48rem] space-y-6 select-none mt-12">
          <div className="relative group flex justify-center">
            <img
              alt="CraftTogetherMC Logo"
              src="/logo_lettering.png"
              className="max-h-48 md:max-h-56 object-contain cursor-pointer transition transform duration-500 hover:scale-105 drop-shadow-[0_10px_20px_rgba(52,180,244,0.35)]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textFallback = document.getElementById('logo-text-fallback');
                if (textFallback) textFallback.style.display = 'block';
              }}
            />
          </div>
          
          {/* Mini Beschreibung */}
          <p className="text-md md:text-lg text-neutral-300 font-medium tracking-wide max-w-[36rem] mx-auto drop-shadow-md">
            Wir sind ein gemütlicher, aufstrebender Minecraft-Server für alle Freunde des originalgetreuen Survival-Gameplays.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">

            {/* IP Button */}
            <button onClick={handleCopyIp} className="btn-premium btn-join w-full sm:w-auto min-w-[12.5rem] relative group">
              <RiFileCopy2Fill className="text-xl" />
              <span>{copied ? "IP Kopiert!" : "Jetzt Joinen!"}</span>
              {copied && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2.5 py-1 rounded shadow-md font-bold whitespace-nowrap animate-bounce">
                  IP kopiert: {serverIp}
                </div>
              )}
            </button>
            
            {/* Discord Button (Link) */}
            <a
              href={discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium btn-discord w-full sm:w-auto min-w-[12.5rem]"
            >
              <RiDiscordFill className="text-xl" />
              <span>Unser Discord!</span>
            </a>
          </div>
        </div>

        <div className="h-48 absolute left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-[#0a0a0a] z-[3] pointer-events-none" />
      </section>



      {/* Rest der Seite */}
      <section id="content" className="w-full relative z-20 px-4 md:px-6">
        <div className="flex justify-center items-center w-full">
          <div className="glass-card flex flex-col xl:flex-row w-full max-w-[62rem] p-6 md:p-8 rounded-2xl gap-8 -mt-24 shadow-2xl">

            {/* YouTube Video Embed */}
            <div className="w-full xl:w-1/2 aspect-video rounded-xl overflow-hidden border border-white/[0.08] relative group bg-neutral-900 flex items-center justify-center">
              <iframe
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/nY82tthVJm8?autoplay=0"
                title="CraftTogetherMC Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Beschreibung */}
            <div className="w-full xl:w-1/2 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
                  <span className="h-6 w-1.5 bg-brand-cyan rounded-full inline-block"></span>
                  Freebuild mit Vanilla-Feeling
                </h2>
                <div className="text-neutral-300 space-y-4 leading-relaxed font-normal text-md">
                  <p>
                    <b>CraftTogetherMC</b> ist ein gemütlicher, aufstrebender Minecraft-Server
                    und richtet sich an Freunde des <b>originalgetreuen (Vanilla) Minecraft</b>.
                  </p>
                  <p>
                    Unser Konzept besteht darin, ein Spielerlebnis zu bieten, das sich anfühlt als würdest
                    du wie im Singleplayer — nur mit anderen Spielern — Vanilla-Minecraft spielen.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="regelwerk" className="btn-premium btn-info text-center flex-grow">
                  <span>Unsere Regeln</span>
                  <RiArrowRightUpLine />
                </Link>
                <Link href="/tutorials/join" className="btn-premium btn-info text-center flex-grow">
                  <span>Wie joine ich?</span>
                  <RiArrowRightUpLine />
                </Link>
              </div>
            </div>

          </div>
        </div>

        

        {/* Server Informationen */}
        <div className="max-w-[62rem] mx-auto mt-12">
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              Was erwartet dich?
            </h3>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* Vanilla Gameplay */}
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <h4 className="text-base font-bold text-brand-cyan mb-2">Vanilla Gameplay</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Spiele wie im Singleplayer, nur eben nicht alleine! 
                </p>
              </div>

              {/* Freebuild ohne Claiming */}
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <h4 className="text-base font-bold text-brand-cyan mb-2">Freebuild-Welten ohne Claiming</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Keine nervigen Claim-Systeme - such dir einen freien Platz und baue drauf los!
                </p>
              </div>

              {/* Performance */}
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <h4 className="text-base font-bold text-brand-cyan mb-2">Starke Serverperformance</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Genieße lagfreies Spielen mit bis zu 20 Chunks Sichtweite!
                </p>
              </div>

              {/* Votes */}
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <h4 className="text-base font-bold text-brand-cyan mb-2">Kein Vote-Zwang</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Wir zwingen niemanden zum Voten für unseren Server.
                </p>
              </div>

              {/* Bauwerk Sicherheit */}
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <h4 className="text-base font-bold text-brand-cyan mb-2">Sicherheit für deine Bauwerke</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Deine Bauten bleiben bestehen, auch wenn du mal länger fort bist.
                </p>
              </div>

              {/* Creative */}
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <h4 className="text-base font-bold text-brand-cyan mb-2">Seperate Kreativ-Welt</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Teste dein Redstone und baue deine Ideen im Kreativmodus vor.
                </p>
              </div>

              {/* Farmwelt */}
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <h4 className="text-base font-bold text-brand-cyan mb-2">Regelmäßige Farmweltresets</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Starte frisch in eine neue Farmwelt voller Ressourcen und Materialien.
                </p>
              </div>

              {/* Minigames */}
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <h4 className="text-base font-bold text-brand-cyan mb-2">Minigames und Events</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Freue dich auf Auktionen, Minigames, Events, Secrets und mehr!
                </p>
              </div>

              {/* Community */}
              <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <h4 className="text-base font-bold text-brand-cyan mb-2">Eine freundliche Community</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Wir sind eine sehr hilfsbereite und offene Community :D
                </p>
              </div>

                  
            </div>
          </div>
        </div>
        

        {/* Server Status */}
        <div className="max-w-[62rem] mx-auto mt-12">
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${status.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              Server-Status & Live-Spieler
            </h3>

            {loading ? (
              <div className="text-center py-6 text-neutral-400">
                Lade Server-Informationen...
              </div>
            ) : status.online ? (

              <div className="space-y-6">
  
                {/* Infokarten */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="bg-white/[0.03] border border-white/[0.05] p-4 rounded-xl text-center">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium">Spieler Online</p>
                    <p className="text-2xl font-black text-brand-cyan mt-1">
                      {status.players?.online} / {status.players?.max}
                    </p>
                  </div>

                  <div className="bg-white/[0.03] border border-white/[0.05] p-4 rounded-xl text-center">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium">Server IP</p>
                    <p className="text-lg font-bold text-neutral-200 mt-1.5 select-all">{serverIp}</p>
                  </div>

                  <div className="bg-white/[0.03] border border-white/[0.05] p-4 rounded-xl text-center">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium">Version</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1.5">{status.version}</p>
                  </div>

                </div>


                {/* Player List */}
                {status.players?.list && status.players.list.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Gerade online:</h4>
                    <div className="flex flex-wrap gap-3">
                      {status.players.list.map((player) => (
                        <div
                          key={player.username}
                          className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.06] hover:border-white/20 py-1.5 px-3 rounded-lg transition duration-200 group"
                        >

                          {/* Spielerkopf */}
                          <img
                            src={`https://minotar.net/avatar/${player.username}/24`}
                            alt={`${player.username} head`}
                            className="w-6 h-6 rounded flex-shrink-0"
                          />

                          {/* Color Formating */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            {player.rank && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                                style={{
                                  color: player.rankColor ?? '#AAAAAA',
                                  border: `1px solid ${player.rankColor ?? '#AAAAAA'}55`,
                                  background: `${player.rankColor ?? '#AAAAAA'}15`,
                                }}
                              >
                                {player.rank}
                              </span>
                            )}
                            <span
                              className="text-sm font-medium truncate"
                              style={{ color: player.nameColor ?? '#FFFFFF' }}
                            >
                              {player.username}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                ) : (

                  // ===== Keine Spieler Fallback ===== \\
                  <div className="text-center py-4 bg-white/[0.02] border border-white/[0.04] rounded-xl text-neutral-500 text-sm">
                    Keine Spieler online :/
                  </div>

                )}
              </div>
            ) : (

              // ===== Server Offline Fallback ===== \\
              <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-xl text-center space-y-2">
                <p className="text-lg font-bold text-red-400">Server offline</p>
                <p className="text-neutral-400 text-sm">Der Server ist derzeit nicht erreichbar. Bitte versuche es später noch einmal.</p>
              </div>

            )}
          </div>
        </div>

        
        {/* 4. Social Media */}
        <div className="max-w-[62rem] mx-auto mt-12 mb-16 text-center space-y-6">
          <h3 className="text-lg font-bold text-neutral-400 uppercase tracking-widest">
            Folge uns auf Social Media
          </h3>
          <div className="flex justify-center items-center gap-4">

            {/* Instagram */}
            <a
              href="https://www.instagram.com/crafttogethermc.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 rounded-xl glass-card flex items-center justify-center text-xl text-neutral-400 hover:text-pink-400 hover:scale-110 transition-all duration-300"
            >
              <RiInstagramFill />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/c/CraftTogetherDE"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 rounded-xl glass-card flex items-center justify-center text-xl text-neutral-400 hover:text-red-500 hover:scale-110 transition-all duration-300"
            >
              <RiYoutubeFill />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/CraftTogetherMC"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 rounded-xl glass-card flex items-center justify-center text-xl text-neutral-400 hover:text-blue-500 hover:scale-110 transition-all duration-300"
            >
              <RiFacebookCircleFill />
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com/CraftTogetherDE"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 rounded-xl glass-card flex items-center justify-center text-xl text-neutral-400 hover:text-sky-400 hover:scale-110 transition-all duration-300"
            >
              <RiTwitterFill />
            </a>
          </div>
        </div>

      </section>

    </main>
  );
}
