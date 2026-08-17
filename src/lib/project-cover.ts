export const DEFAULT_PROJECT_COVER = "/projects/default_project.png";
export const PORTFOLIO_ASSETS_BUCKET = "portfolio-assets";
export const PROJECT_COVER_MAX_BYTES = 5 * 1024 * 1024;
export const PROJECT_COVER_MAX_SIZE_LABEL = "5 MB";
export const PROJECT_GALLERY_MAX_BYTES = 5 * 1024 * 1024;
export const PROJECT_GALLERY_MAX_SIZE_LABEL = "5 MB per image";

export function resolveProjectCoverSrc(coverImagePath: string | null | undefined) {
  if (!coverImagePath?.trim()) return DEFAULT_PROJECT_COVER;
  if (coverImagePath.startsWith("http://") || coverImagePath.startsWith("https://") || coverImagePath.startsWith("/")) {
    return coverImagePath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return DEFAULT_PROJECT_COVER;
  return `${baseUrl}/storage/v1/object/public/${PORTFOLIO_ASSETS_BUCKET}/${coverImagePath}`;
}

export function resolveProjectGallerySrc(imagePath: string | null | undefined) {
  return resolveProjectCoverSrc(imagePath);
}
