"use client";

import { useEffect, useState, useTransition } from "react";
import { deletePost, deleteProject } from "@/lib/studio-actions";

type ItemType = "post" | "project";

export function DeleteItemButton({ id, title, type }: { id: string; title: string; type: ItemType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const itemLabel = type === "post" ? "post" : "project";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) { if (event.key === "Escape" && !isPending) setIsOpen(false); }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPending]);

  function confirmDelete() {
    const formData = new FormData();
    formData.set("id", id);
    startTransition(() => (type === "post" ? deletePost(formData) : deleteProject(formData)));
  }

  return <><button className="button-secondary border-red-200/30 text-red-100 hover:border-red-200/60 hover:bg-red-200/10" type="button" onClick={() => setIsOpen(true)}>Delete</button>{isOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/75 p-4" role="presentation"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151a17] p-6 shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title"><p className="eyebrow">Confirm deletion</p><h2 id="delete-dialog-title" className="mt-3 text-2xl font-medium tracking-[-0.04em] text-white">Delete this {itemLabel}?</h2><p className="mt-3 leading-7 text-zinc-400">“{title}” will be permanently removed. This action cannot be undone.</p><div className="mt-7 flex flex-wrap justify-end gap-3"><button className="button-secondary" type="button" onClick={() => setIsOpen(false)} disabled={isPending}>Cancel</button><button className="rounded-full bg-red-200 px-4 py-2 text-sm font-medium text-red-950 transition hover:bg-red-100 disabled:cursor-wait disabled:opacity-60" type="button" onClick={confirmDelete} disabled={isPending}>{isPending ? "Deleting…" : "Delete permanently"}</button></div></div></div>}</>;
}
