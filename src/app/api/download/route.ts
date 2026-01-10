import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Enforce robust handling: Force Multipart parsing
        const formData = await request.formData();
        const content = formData.get("content") as string;
        let filename = (formData.get("filename") as string) || "content.md";

        // Validate content availability
        if (!content) {
            throw new Error("Content field is empty in FormData");
        }

        // Sanitize filename
        const safeFilename = filename.replace(/[\/\\]/g, '_');
        const encodedFilename = encodeURIComponent(safeFilename);

        return new NextResponse(content, {
            status: 200,
            headers: {
                "Content-Type": "application/octet-stream", // Force binary download
                "Content-Disposition": `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodedFilename}`,
            },
        });
    } catch (error: any) {
        console.error("Download Critical Error:", error);

        // FAIL-SAFE: Return an error file with a PROPER NAME.
        // This ensures the browser never saves a random UUID, even on error.
        const errorContent = `# Download Error Report\n\nReason: ${error.message || "Unknown Error"}\n\nTimestamp: ${new Date().toISOString()}`;
        return new NextResponse(errorContent, {
            status: 200, // Return 200 so browser treats it as a file, not an error page
            headers: {
                "Content-Type": "text/markdown; charset=utf-8",
                "Content-Disposition": `attachment; filename="error_report.md"`,
            },
        });
    }
}
