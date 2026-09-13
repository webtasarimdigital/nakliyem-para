import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(filename: string, fallback: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return fallback;
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch { return fallback; }
}

function writeJson(filename: string, data: unknown): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try { fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8"); } catch (err) { console.error("writeJson error:", err); }
}

export async function GET() {
  const posts = readJson<unknown[]>("defter_posts.json", []);
  return NextResponse.json({ success: true, posts });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { post } = body;
  if (!post?.id) return NextResponse.json({ success: false, error: "Gecersiz veri." }, { status: 400 });
  const existing = readJson<unknown[]>("defter_posts.json", []);
  const arr = existing as Array<{ id: string }>;
  if (!arr.some(p => p.id === post.id)) writeJson("defter_posts.json", [post, ...arr]);
  return NextResponse.json({ success: true });
}
