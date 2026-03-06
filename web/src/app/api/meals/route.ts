import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/apiProxy";

export async function GET(req: NextRequest) { return proxyToApi(req, "/api/meals"); }
export async function POST(req: NextRequest) { return proxyToApi(req, "/api/meals"); }
