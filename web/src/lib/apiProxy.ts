import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:3001";

/**
 * Shared proxy handler to forward frontend API calls to the Express backend.
 * Eliminates duplicated proxy logic across route files.
 */
export async function proxyToApi(req: NextRequest, path: string) {
  try {
    const url = new URL(req.url);
    const targetUrl = `${API_URL}${path}${url.search}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = await req.text();
    }

    const res = await fetch(targetUrl, options);
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "API proxy error" }, { status: 502 });
  }
}
