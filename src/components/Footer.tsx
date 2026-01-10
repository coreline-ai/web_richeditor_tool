import React from "react";

export function Footer() {
    return (
        <footer className="bg-background border-t border-border px-4 py-1.5 flex justify-between items-center text-xs text-muted-foreground shrink-0 z-20">
            <div className="flex gap-4">
                <span>
                    Words: <strong className="text-foreground">0</strong>
                </span>
                <span>
                    Characters: <strong className="text-foreground">0</strong>
                </span>
                <span>
                    Reading Time: <strong className="text-foreground">0 min</strong>
                </span>
            </div>
            <div className="flex gap-4">
                <span className="flex items-center gap-1">
                    <span className="block w-2 h-2 rounded-full bg-green-500"></span> Saved
                </span>
                <span>Cursor: 1:1</span>
            </div>
        </footer>
    );
}
