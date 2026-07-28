"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import type { Comment } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useDictionary } from "@/lib/i18n/useLocale";

export default function CommentsSection({ comments }: { comments: Comment[] }) {
  const { user } = useStore();
  const { locale, t } = useDictionary();
  const [list, setList] = useState(comments);
  const [text, setText] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setList((l) => [...l, { id: `local-${Date.now()}`, author: user?.name ?? "GlutenFree Directory user", avatarSeed: 900, date: new Date().toISOString(), body: text }]);
    setText("");
  }

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
        <MessageCircle size={20} className="text-brand" /> {t.blog.commentsTitle} ({list.length})
      </h2>
      <div className="space-y-4">
        {list.map((c) => (
          <div key={c.id} className="card flex gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">{c.author.slice(0, 1)}</span>
            <div>
              <p className="text-sm font-semibold text-ink">{c.author} <span className="ml-2 text-xs font-normal text-muted">{formatDate(c.date, locale)}</span></p>
              <p className="mt-1 text-sm text-ink-soft">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="card card-soft mt-5 p-4">
        <label htmlFor="comment" className="field-label">{t.blog.leaveComment}</label>
        <textarea id="comment" className="field" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.blog.commentPlaceholder} required />
        <button type="submit" className="btn btn-primary btn-sm mt-3">{t.blog.publishComment}</button>
      </form>
    </div>
  );
}
