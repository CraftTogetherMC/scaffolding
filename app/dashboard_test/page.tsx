"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { marked } from 'marked';
import { 
  getMdxFilesList, 
  readMdxFile, 
  saveMdxFile, 
  createNewsPost,
  MdxFileItem 
} from './actions';
import { 
  RiFileEditFill, 
  RiNotificationBadgeFill, 
  RiSave2Fill, 
  RiAddCircleFill,
  RiFileList3Fill,
  RiSendPlaneFill,
  RiInformationLine
} from 'react-icons/ri';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'editor' | 'news'>('editor');

  // --- File Editor States ---
  const [files, setFiles] = useState<MdxFileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [editorLoading, setEditorLoading] = useState(false);
  const [editorStatus, setEditorStatus] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' });

  // --- News Creator States ---
  const [newsTitle, setNewsTitle] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsAuthorIcon, setNewsAuthorIcon] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsWebhook, setNewsWebhook] = useState('changelog');
  const [newsBody, setNewsBody] = useState('');
  const [onlyDiscord, setOnlyDiscord] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsStatus, setNewsStatus] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' });

  // --- Editor Logic ---
  useEffect(() => {
    loadFilesList();
  }, []);

  const loadFilesList = async () => {
    try {
      const list = await getMdxFilesList();
      setFiles(list);
      if (list.length > 0 && !selectedFile) {
        handleSelectFile(list[0].relativePath);
      }
    } catch (err) {
      console.error("Failed to load MDX files", err);
    }
  };

  const handleSelectFile = async (relativePath: string) => {
    setSelectedFile(relativePath);
    setEditorLoading(true);
    setEditorStatus({ type: '', text: '' });
    try {
      const content = await readMdxFile(relativePath);
      setFileContent(content);
    } catch (err: any) {
      setEditorStatus({ type: 'error', text: err.message || "Fehler beim Laden der Datei." });
    } finally {
      setEditorLoading(false);
    }
  };

  const handleSaveFile = async () => {
    if (!selectedFile) return;
    setEditorLoading(true);
    setEditorStatus({ type: '', text: '' });
    try {
      const res = await saveMdxFile(selectedFile, fileContent);
      if (res.success) {
        setEditorStatus({ type: 'success', text: res.message });
      } else {
        setEditorStatus({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setEditorStatus({ type: 'error', text: err.message || "Fehler beim Speichern." });
    } finally {
      setEditorLoading(false);
    }
  };

  // --- News Creator Logic ---
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsBody) {
      setNewsStatus({ type: 'error', text: "Titel und Inhalt sind Pflichtfelder." });
      return;
    }
    setNewsLoading(true);
    setNewsStatus({ type: '', text: '' });
    
    try {
      const res = await createNewsPost(
        newsTitle,
        newsAuthor || "Admin-Team",
        newsAuthorIcon,
        newsDate,
        newsImage,
        newsWebhook,
        onlyDiscord,
        newsBody
      );
      
      if (res.success) {
        setNewsStatus({ type: 'success', text: res.message });
        setNewsTitle('');
        setNewsAuthor('');
        setNewsDate('');
        setNewsAuthorIcon('');
        setNewsImage('');
        setNewsBody('');
        setOnlyDiscord(false);
        loadFilesList();
      } else {
        setNewsStatus({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setNewsStatus({ type: 'error', text: err.message || "Fehler beim Erstellen der News." });
    } finally {
      setNewsLoading(false);
    }
  };

  const renderPreview = () => {
    return { __html: marked(newsBody || '# Vorschau\nTippe links etwas ein...') };
  };

  return (
    <main className="w-full flex-grow relative min-h-screen overflow-hidden">
      
        <div className="fixed inset-0 z-0 pointer-events-none">
              <Image
                src="/spawnie.png" 
                alt="spawnie"
                fill // Now it peacefully fills the fixed div!
                priority 
                quality={75}
                // Removed the style prop and 'fixed' class from here
                className="object-cover object-center brightness-[0.3]" 
              />
        </div>

      {/* 2. DASHBOARD CONTENT */}
      <div className="relative z-10 w-full h-full overflow-y-auto px-4 md:px-6 py-28 flex flex-col items-center select-none">
        <div className="w-full max-w-[90rem] space-y-8">
          
          {/* Header */}
          <header className="space-y-2 text-center md:text-left glass-card p-6 rounded-xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Admin-Dashboard</h1>
            <p className="text-neutral-400 text-sm">Verwalte das Regelwerk, erstelle Ankündigungen und bearbeite MDX-Seiten.</p>
          </header>

          {/* Tab Selection */}
          <div className="flex border-b border-white/[0.08] gap-4">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all duration-200 ${activeTab === 'editor' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
            >
              <RiFileEditFill /> Seiten-Editor
            </button>
            <button 
              onClick={() => setActiveTab('news')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all duration-200 ${activeTab === 'news' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
            >
              <RiNotificationBadgeFill /> News verfassen
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            
            {/* TAB 1: MDX Pages Editor */}
            {activeTab === 'editor' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Sidebar: Files List */}
                <div className="lg:col-span-1 glass-card p-4 rounded-xl flex flex-col gap-2 h-fit">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-2 mb-2 flex items-center gap-1.5">
                    <RiFileList3Fill /> MDX-Dateien
                  </h3>
                  {files.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {files.map((file) => (
                        <button
                          key={file.relativePath}
                          onClick={() => handleSelectFile(file.relativePath)}
                          className={`text-left text-sm py-2 px-3 rounded-lg font-medium transition-all ${selectedFile === file.relativePath ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30' : 'text-neutral-400 hover:bg-white/[0.03] hover:text-white border border-transparent'}`}
                        >
                          {file.relativePath}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 italic p-2">Keine MDX-Dateien gefunden.</p>
                  )}
                </div>

                {/* Main Area: Code Editor */}
                <div className="lg:col-span-3 glass-card p-6 rounded-xl space-y-4">
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-md font-bold text-white select-all">{selectedFile}</h3>
                          <p className="text-xs text-neutral-500 mt-0.5">Direkte MDX-Bearbeitung (inklusive Frontmatter)</p>
                        </div>
                        <button onClick={handleSaveFile} disabled={editorLoading} className="btn-premium btn-join py-2 px-4 text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                          <RiSave2Fill /> {editorLoading ? 'Speichere...' : 'Speichern'}
                        </button>
                      </div>

                      {editorStatus.text && (
                        <div className={`p-3.5 rounded-lg text-sm border flex items-center gap-2 ${editorStatus.type === 'success' ? 'bg-green-950/20 border-green-900/40 text-green-400' : 'bg-red-950/20 border-red-900/40 text-red-400'}`}>
                          <RiInformationLine className="text-lg flex-shrink-0" />
                          <span>{editorStatus.text}</span>
                        </div>
                      )}

                      <div className="relative">
                        {editorLoading && (
                          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-10 text-sm text-neutral-400">
                            Lade Dateiinhalt...
                          </div>
                        )}
                        <textarea
                          value={fileContent}
                          onChange={(e) => setFileContent(e.target.value)}
                          rows={22}
                          className="w-full bg-neutral-950/80 border border-white/[0.08] focus:border-brand-cyan/50 focus:outline-none p-4 rounded-lg font-mono text-sm leading-relaxed text-neutral-300 resize-y"
                          placeholder="Inhalt der MDX-Datei..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-neutral-500 space-y-2">
                      <p className="text-lg font-bold">Keine Datei ausgewählt</p>
                      <p className="text-sm">Bitte wähle eine MDX-Datei aus der linken Liste aus, um sie zu bearbeiten.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: News Creator */}
            {activeTab === 'news' && (
              <div id="news-editor" className="flex flex-col h-full p-2 md:p-4">
                <form onSubmit={handleCreateNews} className="max-w-full mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Linke Spalte: Eingabefelder */}
                    <div className="space-y-6 flex flex-col glass-card p-6 rounded-xl">
                        <div className="pb-4 border-b border-white/5">
                            <h3 className="text-cyan-400 font-black text-xs uppercase tracking-widest">News Webhook Tool</h3>
                            <p className="text-neutral-500 text-[10px] uppercase mt-1">Sendet Ankündigungen direkt an Discord und speichert sie auf der Website</p>
                        </div>

                        {newsStatus.text && (
                          <div className={`p-3.5 rounded-lg text-sm border flex items-center gap-2 ${newsStatus.type === 'success' ? 'bg-green-950/20 border-green-900/40 text-green-400' : 'bg-red-950/20 border-red-900/40 text-red-400'}`}>
                            <RiInformationLine className="text-lg flex-shrink-0" />
                            <span>{newsStatus.text}</span>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 uppercase font-bold ml-2">Überschrift</label>
                                <input type="text" required value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="z.B. Changelog" className="w-full bg-neutral-950/80 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-cyan/50 transition text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 uppercase font-bold ml-2">Datum (Titel)</label>
                                <input type="text" value={newsDate} onChange={(e) => setNewsDate(e.target.value)} placeholder="z.B. 06.03.2026" className="w-full bg-neutral-950/80 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-cyan/50 transition text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 uppercase font-bold ml-2">Author Name</label>
                                <input type="text" value={newsAuthor} onChange={(e) => setNewsAuthor(e.target.value)} placeholder="z.B. Ceddix" className="w-full bg-neutral-950/80 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-cyan/50 transition text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 uppercase font-bold ml-2">Author Icon URL</label>
                                <input type="text" value={newsAuthorIcon} onChange={(e) => setNewsAuthorIcon(e.target.value)} placeholder="https://..." className="w-full bg-neutral-950/80 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-cyan/50 transition text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 uppercase font-bold ml-2">Bild URL</label>
                                <input type="text" value={newsImage} onChange={(e) => setNewsImage(e.target.value)} placeholder="https://..." className="w-full bg-neutral-950/80 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-cyan/50 transition text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-500 uppercase font-bold ml-2">Webhook Channel</label>
                                <select value={newsWebhook} onChange={(e) => setNewsWebhook(e.target.value)} className="w-full bg-neutral-950/80 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-cyan/50 transition text-neutral-300">
                                    <option value="masercloud">Masercloud Test</option>
                                    <option value="changelog">Changelog</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-neutral-500 uppercase font-bold ml-2">Nachrichten Inhalt</label>
                            <textarea required spellCheck="false" value={newsBody} onChange={(e) => setNewsBody(e.target.value)} className="w-full h-64 bg-neutral-950/80 border border-white/10 rounded-xl p-4 text-neutral-300 font-mono text-sm outline-none resize-none leading-relaxed focus:border-brand-cyan/50 transition" placeholder="Schreibe hier deine News in Markdown..."></textarea>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 w-full">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" checked={onlyDiscord} onChange={(e) => setOnlyDiscord(e.target.checked)} className="sr-only peer" />
                                    <div className="w-6 h-6 border-2 border-white/10 rounded-lg bg-white/5 transition-all group-hover:border-brand-cyan/50 peer-checked:bg-brand-cyan peer-checked:border-brand-cyan flex items-center justify-center">
                                        <span className="text-[10px] text-black opacity-0 peer-checked:opacity-100 transition-opacity">✔</span>
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest group-hover:text-neutral-300 transition-colors">NUR DISCORD WEBHOOK (keine Website)</span>
                            </label>

                            <button type="submit" disabled={newsLoading} className="btn-premium btn-join min-h-12 w-full sm:w-auto min-w-[15rem] flex items-center justify-center gap-1.5 disabled:opacity-50">
                                <RiSendPlaneFill /> {newsLoading ? 'Veröffentliche...' : 'Senden & Veröffentlichen'}
                            </button>
                        </div>
                    </div> 
                    
                    {/* Rechte Spalte: Live Preview */}
                    <div className="flex flex-col h-full min-h-[400px]">
                        <div id="news-preview" className="flex-1 glass-card p-8 rounded-xl overflow-y-auto scroll-smooth border border-white/5">
                            <div dangerouslySetInnerHTML={renderPreview()} className="prose prose-invert prose-cyan max-w-none" />
                        </div>
                    </div>

                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}