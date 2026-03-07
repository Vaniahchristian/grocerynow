"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { getImageUrl } from "@/lib/image-utils";

interface ShareProductButtonProps {
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    images?: string[];
    price: number;
  };
  referralCode?: string;
}

export function ShareProductButton({ product, referralCode }: ShareProductButtonProps) {
  const getUrl = () => {
    const base = `${window.location.origin}/products/${product.id}`;
    return referralCode ? `${base}?ref=${encodeURIComponent(referralCode)}` : base;
  };

  const text = `Check out this product: ${product.name} - UGX ${(product.price || 0).toLocaleString()}`;

  const quickShare = async () => {
    const url = getUrl();
    try {
      if (navigator.share) {
        // Try Web Share API Level 2 with image file (mobile Chrome, etc.)
        try {
          const galleryFirst = product.images?.find((i) => i && i !== product.image) || product.images?.[0] || product.image;
          if (galleryFirst) {
            let imgUrl = getImageUrl(galleryFirst);
            // Ensure absolute URL for fetch
            if (typeof window !== "undefined" && !imgUrl.startsWith("http")) {
              if (imgUrl.startsWith("/")) {
                imgUrl = `${window.location.origin}${imgUrl}`;
              } else {
                imgUrl = `${window.location.origin}/${imgUrl}`;
              }
            }
            const res = await fetch(imgUrl);
            const blob = await res.blob();

            const ext = (blob.type?.split("/")[1] || "jpg").split(";")[0];
            const file = new File([blob], `product-${product.id}.${ext}`, { type: blob.type || "image/jpeg" });
            if ((navigator as any).canShare?.({ files: [file] })) {
              await (navigator as any).share({ title: product.name, text, url, files: [file] });
              return;
            }
          }
        } catch {}
        // Fallback: share without file
        await navigator.share({ title: product.name, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast({ title: "Link copied!", description: "Product link copied to clipboard." });
      }
    } catch (e) {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast({ title: "Link copied!", description: "Product link copied to clipboard." });
      } catch {}
    }
  };

  const open = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const url = typeof window !== "undefined" ? encodeURIComponent(getUrl()) : "";
  const encText = encodeURIComponent(text);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="xl"
          className="flex items-center justify-center gap-2 rounded-2xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 shadow-sm transition-colors share-button"
          onClick={(e) => {
            // Let menu open, but also try quick native share if supported on touch devices
            if ((navigator as any).share) {
              e.preventDefault();
              e.stopPropagation();
              quickShare();
            }
          }}
        >
          <Share2 className="w-4 h-4" data-testid="share-icon" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Share to</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => open(`https://wa.me/?text=${url}%20${encText}`)}>WhatsApp</DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)}>Facebook</DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(`https://twitter.com/intent/tweet?text=${encText}&url=${url}`)}>X (Twitter)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(`https://t.me/share/url?url=${url}&text=${encText}`)}>Telegram</DropdownMenuItem>
        <DropdownMenuItem onClick={() => open(`mailto:?subject=${encodeURIComponent(product.name)}&body=${encText}%0A${url}`)}>Email</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            const shareUrl = decodeURIComponent(url);
            await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
            toast({ title: "Link copied!", description: "Copied to clipboard." });
          }}
        >
          Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}