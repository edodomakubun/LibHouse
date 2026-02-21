"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface MaterialInteractionsProps {
  id: string;
  initialUpvotes: number;
  initialComments: any[];
}

export function MaterialInteractions({ id, initialUpvotes, initialComments }: MaterialInteractionsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleUpvote = async () => {
    try {
      const res = await fetch(`/api/material/${id}/upvote`, {
        method: "POST",
        body: JSON.stringify({ userId: "user_123" }), // Mock
      });
      if (res.ok) {
        const data = await res.json() as { action: 'added' | 'removed' };
        setIsUpvoted(data.action === 'added');
        setUpvotes(prev => data.action === 'added' ? prev + 1 : prev - 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async () => {
    if (!comment) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/material/${id}/comment`, {
        method: "POST",
        body: JSON.stringify({ content: comment, userId: "user_123" }),
      });
      if (res.ok) {
        setComment("");
        router.refresh(); // Refresh server component data
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="card-pastel bg-pastel-pink/10 border-pastel-pink/20 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-3xl font-black italic">{upvotes}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Upvotes dapet</span>
          </div>
          <Button
            variant="pastel"
            className={cn("w-14 h-14 p-0 rounded-2xl shadow-lg transition-all", isUpvoted && "bg-pastel-pink")}
            onClick={handleUpvote}
          >
            <Heart size={24} className={cn("transition-all", isUpvoted ? "fill-current scale-110" : "fill-none")} />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-black/10 bg-white">
          Bagiin ke Bestie
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-black italic flex items-center gap-2">
          <MessageCircle size={24} /> Komentar ({initialComments.length})
        </h3>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              className="w-full rounded-2xl border-2 border-black/5 p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pastel-purple min-h-[100px] bg-white/50"
              placeholder="Kasih feedback dong..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="primary"
              size="sm"
              className="absolute bottom-3 right-3"
              disabled={!comment || isSubmitting}
              onClick={handleComment}
            >
              {isSubmitting ? "..." : "Kirim"}
            </Button>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {initialComments.length === 0 ? (
              <p className="text-center py-4 text-sm opacity-40 font-bold italic">Belum ada komentar... Sepi amat kek kuburan. 👻</p>
            ) : (
              initialComments.map((c) => (
                <div key={c.id} className="p-4 bg-white/50 rounded-2xl border border-black/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-xs italic">@{c.userId || 'Anon'}</span>
                    <span className="text-[10px] font-bold opacity-30 uppercase">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium opacity-80">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
