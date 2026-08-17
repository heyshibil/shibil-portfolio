"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type GalleryImage = { id: string; src: string; alt: string };

export function ProjectGallery({ images, projectName }: { images: GalleryImage[]; projectName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const activeImage = images[activeIndex];
  const goTo = (index: number) => setActiveIndex((index + images.length) % images.length);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPreviewOpen(false);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  if (!images.length) return null;

  return <section aria-label={`${projectName} screenshots`} className="mt-14">
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70">
      <button type="button" className="group block aspect-[16/10] w-full cursor-zoom-in" onClick={() => setIsPreviewOpen(true)} aria-label={`Preview ${activeImage.alt}`}>
        <Image src={activeImage.src} alt={activeImage.alt} fill priority={activeIndex === 0} sizes="(max-width: 768px) 100vw, 1152px" className="object-contain p-2 transition duration-500 group-hover:scale-[1.015] sm:p-4" />
      </button>
      {images.length > 1 && <><button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous screenshot" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-zinc-950/70 text-xl text-white backdrop-blur transition hover:border-emerald-200/60">←</button><button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next screenshot" className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-zinc-950/70 text-xl text-white backdrop-blur transition hover:border-emerald-200/60">→</button></>}
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">{images.map((image, index) => <button key={image.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show screenshot ${index + 1}`} aria-current={index === activeIndex} className={`relative aspect-[16/10] overflow-hidden rounded-lg border bg-zinc-950 transition ${index === activeIndex ? "border-emerald-200" : "border-white/10 opacity-60 hover:opacity-100"}`}><Image src={image.src} alt="" fill sizes="(max-width: 640px) 33vw, 180px" className="object-cover" /></button>)}</div>
    <p className="mt-3 text-sm text-zinc-500">{activeIndex + 1} of {images.length} · Select an image to preview it.</p>
    {isPreviewOpen && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${projectName} screenshot preview`} onClick={() => setIsPreviewOpen(false)}><div className="relative h-[85vh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}><Image src={activeImage.src} alt={activeImage.alt} fill sizes="100vw" className="object-contain" /><button type="button" onClick={() => setIsPreviewOpen(false)} aria-label="Close preview" className="absolute right-0 top-0 grid size-10 place-items-center rounded-full border border-white/20 bg-black/60 text-xl text-white">×</button></div></div>}
  </section>;
}
