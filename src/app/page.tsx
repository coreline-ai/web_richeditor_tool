"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toolbar } from "@/components/editor/Toolbar";
import { Editor } from "@tiptap/react";
import { saveAs } from 'file-saver';

const TipTapEditor = dynamic(
  () => import("@/components/editor/TipTapEditor").then((m) => m.TipTapEditor),
  { ssr: false }
);

const DEFAULT_MARKDOWN = `# Productivity App Design Specification

This document outlines the core features and design language for the new desktop productivity suite. The goal is to create a *distraction-free environment* that empowers users to focus on content creation.

![Dashboard Concept Art](https://images.unsplash.com/photo-1550684848-fac1c5b4e853)
Figure 1.1: Dashboard Concept Art

## 1. Key Features
- **Real-time Sync:** Seamlessly update content across devices.
- **Markdown Support:** Full compatibility with standard markdown syntax.
- **Offline Mode:** Work without an internet connection.

> "Design is not just what it looks like and feels like. Design is how it works."
`;

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [editor, setEditor] = useState<Editor | null>(null);

  // Editor -> Markdown Sync (On Update)
  const handleEditorUpdate = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  // Markdown -> Editor Sync (Manual Trigger)
  const handleSyncToEditor = () => {
    if (editor) {
      editor.commands.setContent(markdown);
    }
  };

  // File Download
  const handleDownload = () => {
    let content = markdown;
    if (editor) {
      try {
        content = (editor.storage as any).markdown.getMarkdown();
      } catch (e) {
        console.warn("Failed to get markdown from editor storage, using state fallback", e);
      }
    }

    console.log("Requesting server-side download via Form (target=_blank)...");

    // Using target="_blank" ensures the download happens in a separate context.
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/download';
    form.target = '_blank';
    form.enctype = 'multipart/form-data'; // Switch to multipart for reliability
    form.style.display = 'none';

    const contentInput = document.createElement('input');
    contentInput.type = 'hidden';
    contentInput.name = 'content';
    contentInput.value = content;
    form.appendChild(contentInput);

    const filenameInput = document.createElement('input');
    filenameInput.type = 'hidden';
    filenameInput.name = 'filename';
    filenameInput.value = 'content.md';
    form.appendChild(filenameInput);

    document.body.appendChild(form);
    form.submit();

    // Cleanup after a delay to ensure submission happens
    setTimeout(() => {
      document.body.removeChild(form);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header onExport={handleDownload} />

      <Toolbar
        editor={editor}
        onSync={handleSyncToEditor}
        onSave={handleDownload}
      />

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left Pane: Rich Text Editor */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto bg-background flex flex-col relative group border-b md:border-b-0 md:border-r border-border">
          <div className="sticky top-0 z-10 px-8 py-2 bg-background/90 backdrop-blur-sm border-b border-transparent group-hover:border-border transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rich Text</span>
          </div>

          <div className="px-8 md:px-12 pb-20 pt-4 max-w-3xl mx-auto w-full">
            <TipTapEditor
              initialContent={DEFAULT_MARKDOWN}
              onUpdate={handleEditorUpdate}
              onEditorReady={setEditor}
            />
          </div>
        </div>

        {/* Draggable Handle Simulation (Desktop Only) */}
        <div className="hidden md:flex w-[1px] bg-border hover:bg-primary cursor-col-resize hover:w-1 transition-all z-30 relative items-center justify-center group -ml-[0.5px]">
          <div className="h-8 w-1 bg-muted-foreground/30 rounded-full group-hover:bg-primary transition-colors absolute"></div>
        </div>

        {/* Right Pane: Markdown Source */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto bg-muted/10 flex flex-col font-mono text-sm group">
          <div className="sticky top-0 z-10 px-6 py-2 bg-muted/10 backdrop-blur-sm border-b border-transparent group-hover:border-border transition-colors flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Markdown Source</span>
            <span className="text-[10px] text-muted-foreground">UTF-8</span>
          </div>

          <textarea
            className="flex-1 w-full p-6 md:p-8 pt-4 pb-20 bg-transparent border-none resize-none focus:outline-none text-muted-foreground leading-relaxed"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
