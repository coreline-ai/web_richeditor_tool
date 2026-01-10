"use client";

import React, { useRef } from "react";
import {
    Undo,
    Redo,
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Code,
    Minus,
    Image as ImageIcon,
    RefreshCw,
    Save,
    Heading1,
    Heading2,
    Heading3
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
    className?: string;
    editor: Editor | null;
    onSync: () => void;
    onSave: () => void;
}

export function Toolbar({ className, editor, onSync, onSave }: ToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editor) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    editor.chain().focus().setImage({ src: data.url }).run();
                }
            } catch (err) {
                console.error("Toolbar upload failed", err);
            }
        }
        // Reset input value to allow selecting same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className={cn("flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border shrink-0 overflow-x-auto", className)}>
            <div className="flex items-center gap-1 min-w-max">
                {/* History */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border">
                    <ToolbarButton
                        icon={<Undo className="size-5" />}
                        title="Undo"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                    />
                    <ToolbarButton
                        icon={<Redo className="size-5" />}
                        title="Redo"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                    />
                </div>

                {/* Text Styles */}
                <div className="flex items-center gap-0.5 px-2 border-r border-border">
                    <ToolbarButton
                        icon={<Bold className="size-5" />}
                        title="Bold"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive("bold")}
                    />
                    <ToolbarButton
                        icon={<Italic className="size-5" />}
                        title="Italic"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive("italic")}
                    />
                    <ToolbarButton
                        icon={<Strikethrough className="size-5" />}
                        title="Strikethrough"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive("strike")}
                    />
                </div>

                {/* Headers */}
                <div className="flex items-center gap-0.5 px-2 border-r border-border">
                    <ToolbarButton
                        icon={<Heading1 className="size-5" />}
                        title="Heading 1"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive("heading", { level: 1 })}
                    />
                    <ToolbarButton
                        icon={<Heading2 className="size-5" />}
                        title="Heading 2"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive("heading", { level: 2 })}
                    />
                    <ToolbarButton
                        icon={<Heading3 className="size-5" />}
                        title="Heading 3"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive("heading", { level: 3 })}
                    />
                </div>

                {/* Lists & Quote */}
                <div className="flex items-center gap-0.5 px-2 border-r border-border">
                    <ToolbarButton
                        icon={<List className="size-5" />}
                        title="Bullet List"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive("bulletList")}
                    />
                    <ToolbarButton
                        icon={<ListOrdered className="size-5" />}
                        title="Ordered List"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive("orderedList")}
                    />
                    <ToolbarButton
                        icon={<Quote className="size-5" />}
                        title="Blockquote"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive("blockquote")}
                    />
                </div>

                {/* Insert */}
                <div className="flex items-center gap-0.5 px-2 border-r border-border">
                    <ToolbarButton
                        icon={<Code className="size-5" />}
                        title="Code Block"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive("codeBlock")}
                    />
                    <ToolbarButton
                        icon={<Minus className="size-5" />}
                        title="Horizontal Rule"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    />
                    <ToolbarButton
                        icon={<ImageIcon className="size-5" />}
                        title="Image"
                        onClick={() => fileInputRef.current?.click()}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 pl-4">
                <button
                    type="button"
                    onClick={onSync}
                    className="flex items-center gap-2 h-8 px-3 rounded text-muted-foreground hover:bg-muted text-sm font-medium transition-colors"
                >
                    <RefreshCw className="size-4" />
                    <span className="hidden lg:inline">Sync Changes</span>
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    className="flex items-center gap-2 h-8 px-3 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
                >
                    <Save className="size-4" />
                    <span className="hidden lg:inline">Save MD</span>
                </button>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
            />
        </div >
    );
}

function ToolbarButton({
    icon,
    title,
    isActive,
    disabled,
    onClick,
}: {
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "size-8 flex items-center justify-center rounded transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                isActive && "bg-muted text-primary",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {icon}
        </button>
    );
}
