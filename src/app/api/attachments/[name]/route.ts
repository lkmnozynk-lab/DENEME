import { readFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

/**
 * Serves quote-form attachments — ADMIN ONLY.
 *
 * Unlike /api/uploads (public images), these are files submitted by visitors
 * through the quote form and may be sensitive (manuscripts, etc.). The route
 * requires an authenticated session and streams from /public/uploads/attachments.
 */
const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  zip: "application/zip",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { name } = await params;

  // Reject anything but a plain filename (no traversal, no slashes).
  if (!/^[a-zA-Z0-9._-]+$/.test(name) || name.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "attachments");
  const filePath = path.join(dir, name);

  // Defence-in-depth: ensure the resolved path stays inside the attachments dir.
  if (!path.resolve(filePath).startsWith(path.resolve(dir) + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        // Don't let shared caches/proxies retain a private file.
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${name}"`,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
