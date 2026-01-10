"use client";

import React from "react";
import { Copy, FileText, Menu, Share2, Download, Bold, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
    onExport?: () => void;
}

export function Header({ onExport }: HeaderProps) {
    const { setTheme, theme } = useTheme();

    return (
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background shrink-0 z-20">
            <div className="flex items-center gap-6">
                {/* Logo area */}
                <div className="flex items-center gap-3 text-primary">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="size-5 text-primary" />
                    </div>
                    <h1 className="hidden md:block text-lg font-bold tracking-tight text-foreground">
                        MD Editor
                    </h1>
                </div>

                {/* Document Title Input */}
                <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block"></div>
                <div className="flex flex-col justify-center">
                    <input
                        className="bg-transparent border-none p-0 h-auto text-sm font-medium focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground w-64 hover:bg-muted/50 rounded px-2 -ml-2 transition-colors"
                        type="text"
                        defaultValue="Subject_Project_Proposal.md"
                    />
                    <span className="text-[10px] text-muted-foreground px-2 -ml-2">
                        Last saved 2 mins ago
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-1 text-muted-foreground">
                    <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                        File
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                        Edit
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                        View
                    </button>
                </div>
                <div className="h-8 w-[1px] bg-border hidden md:block"></div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center justify-center size-9 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                    title="Toggle Theme"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </button>

                <button
                    onClick={onExport}
                    className="flex items-center justify-center h-9 px-4 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                    <Download className="mr-2 size-4" />
                    <span className="hidden sm:inline">Export</span>
                </button>
                <button className="flex items-center justify-center h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold shadow-sm transition-colors">
                    <Share2 className="mr-2 size-4" />
                    <span className="hidden sm:inline">Share</span>
                </button>
                <div className="size-9 ml-2 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                    {/* Profile Check */}
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-500 size-full" />
                </div>
            </div>
        </header>
    );
}
