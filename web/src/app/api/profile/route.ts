import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/apiProxy";

export async function GET(req: NextRequest) { return proxyToApi(req, "/api/profile"); }
export async function PUT(req: NextRequest) { return proxyToApi(req, "/api/profile"); }
