import { NextResponse } from "next/server";
import { getSiteSettings, resolveAssetUrl } from "@/lib/site-settings";

export async function GET() {
  const { resumePath } = await getSiteSettings();
  const resumeUrl = resolveAssetUrl(resumePath);
  if (!resumeUrl) return new NextResponse("Resume not available", { status: 404 });
  const response = await fetch(resumeUrl);
  if (!response.ok || !response.body) return new NextResponse("Resume not available", { status: 404 });
  return new NextResponse(response.body, { headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="Shibil-Mohammed-Resume.pdf"', "Cache-Control": "public, max-age=3600" } });
}
