"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import ImageExtension from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { cn } from "@/lib/utils";
import "@/app/globals.css"; // Ensure styles are loaded

// Initialize lowlight for syntax highlighting
const lowlight = createLowlight(common);

interface TipTapEditorProps {
    className?: string;
    initialContent?: string;
    onUpdate?: (markdown: string) => void;
    editorRef?: React.MutableRefObject<Editor | null>;
    onEditorReady?: (editor: Editor) => void;
}

export function TipTapEditor({
    className,
    initialContent = "",
    onUpdate,
    editorRef,
    onEditorReady,
}: TipTapEditorProps) {
    const [content, setContent] = useState(initialContent);

    const uploadImage = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            // ... (keep extensions)
            StarterKit.configure({
                codeBlock: false,
            }),
            Markdown.configure({
                html: false,
                transformPastedText: true,
                transformCopiedText: true,
            }),
            ImageExtension,
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: "prose dark:prose-invert max-w-none focus:outline-none min-h-[500px]",
            },
            handleDrop: (view, event, slice, moved) => {
                // ... (keep logic)
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith("image/")) {
                        event.preventDefault();
                        uploadImage(file).then((url) => {
                            if (url) {
                                const { schema } = view.state;
                                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                                if (coordinates) {
                                    const node = schema.nodes.image.create({ src: url });
                                    const transaction = view.state.tr.insert(coordinates.pos, node);
                                    view.dispatch(transaction);
                                }
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
            handlePaste: (view, event, slice) => {
                // ... (keep logic)
                const item = event.clipboardData?.items[0];
                if (item && item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        event.preventDefault();
                        uploadImage(file).then((url) => {
                            if (url) {
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: url });
                                const transaction = view.state.tr.replaceSelectionWith(node);
                                view.dispatch(transaction);
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
        },
        onCreate: ({ editor }) => {
            onEditorReady?.(editor);
        },
        onUpdate: ({ editor }) => {
            const getMarkdown = (editor.storage as any)?.markdown?.getMarkdown;
            if (typeof getMarkdown === "function") {
                onUpdate?.(getMarkdown.call((editor.storage as any).markdown));
            }
        },
    });

    // Expose editor instance to parent via ref
    useEffect(() => {
        if (editor && editorRef) {
            editorRef.current = editor;
        }
    }, [editor, editorRef]);

    // Handle external content updates (Markdown -> Editor)
    useEffect(() => {
        const currentMarkdown = (editor?.storage as any)?.markdown?.getMarkdown();
        // Only set if significantly different and not focused to prevent overwriting user typing
        // Avoiding infinite loops is key here. Ideally we use a prop to trigger 'reset'
        // For now we trust the manual sync button in parent, so we don't auto-update from props here generally
        // unless it's the very first load.
    }, [initialContent, editor]);

    if (!editor) {
        return (
            <div className={cn("w-full h-full text-muted-foreground", className)}>
                <div className="py-8 text-sm">Loading editor…</div>
            </div>
        );
    }

    return (
        <div className={cn("w-full h-full", className)}>
            <EditorContent editor={editor} />
        </div>
    );
}
