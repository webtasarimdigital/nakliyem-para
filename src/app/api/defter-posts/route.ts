import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getFirestoreDefterPosts, createFirestoreDefterPost } from "@/lib/firebase/firestore";
import { DefterPost } from "@/types";

const DATA_DIR = path.join(process.cwd(), ".data");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

function readJson<T>(filename: string, fallback: T): T {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(filename: string, data: unknown): void {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("writeJson error:", err);
  }
}

export async function GET() {
  const localPosts = readJson<DefterPost[]>("defter_posts.json", []);
  let firestorePosts: DefterPost[] = [];

  try {
    firestorePosts = await getFirestoreDefterPosts();
  } catch (err) {
    console.warn("API route getFirestoreDefterPosts error:", err);
  }

  const map = new Map<string, DefterPost>();
  firestorePosts.forEach(p => {
    if (p && p.id) map.set(p.id, p);
  });
  localPosts.forEach(p => {
    if (p && p.id && !map.has(p.id)) map.set(p.id, p);
  });

  const posts = Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  return NextResponse.json({ success: true, posts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { post } = body;
    if (!post?.id) {
      return NextResponse.json({ success: false, error: "Geçersiz veri." }, { status: 400 });
    }

    // 1. Firestore senkronizasyonu (tüm istemciler ve gizli sekmeler için)
    try {
      await createFirestoreDefterPost(post);
    } catch (fsErr) {
      console.warn("API route createFirestoreDefterPost error:", fsErr);
    }

    // 2. Yerel dosya önbelleği
    try {
      const existing = readJson<DefterPost[]>("defter_posts.json", []);
      if (!existing.some(p => p.id === post.id)) {
        writeJson("defter_posts.json", [post, ...existing]);
      }
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("defter-posts POST route error:", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası." }, { status: 500 });
  }
}

