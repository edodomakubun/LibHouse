import { FileText, Heart, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MaterialCardProps {
  id: string;
  title: string;
  category: string;
  author: string;
  upvotes: number;
  comments: number;
  isAnonymous?: boolean;
  color?: 'pink' | 'blue' | 'purple' | 'yellow';
}

export function MaterialCard({
  id,
  title,
  category,
  author,
  upvotes,
  comments,
  isAnonymous,
  color = 'purple'
}: MaterialCardProps) {
  const bgColors = {
    pink: "bg-pastel-pink/20 hover:bg-pastel-pink/30",
    blue: "bg-pastel-blue/20 hover:bg-pastel-blue/30",
    purple: "bg-pastel-purple/20 hover:bg-pastel-purple/30",
    yellow: "bg-pastel-yellow/20 hover:bg-pastel-yellow/30",
  };

  return (
    <Link href={`/material/${id}`}>
      <div className={cn(
        "card-pastel flex flex-col gap-4 h-full group cursor-pointer",
        bgColors[color]
      )}>
        <div className="flex justify-between items-start">
          <div className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-black uppercase tracking-tighter">
            {category}
          </div>
          <FileText className="opacity-20 group-hover:opacity-100 transition-opacity" size={24} />
        </div>

        <h3 className="text-xl font-extrabold leading-tight group-hover:text-pastel-purple transition-colors">
          {title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5">
          <div className="flex items-center gap-2 text-sm font-bold opacity-60">
            {isAnonymous ? (
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center">
                  <User size={12} />
                </div>
                <span>Anonim</span>
              </div>
            ) : (
              <span>@{author}</span>
            )}
          </div>

          <div className="flex gap-3 text-xs font-black">
            <div className="flex items-center gap-1">
              <Heart size={14} className="fill-current text-pastel-pink" />
              <span>{upvotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} className="opacity-40" />
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
