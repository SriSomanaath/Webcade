import hrefData from "../../../public/bookmarklet-href.json";
import { BookmarkletLinkInner } from "./BookmarkletLinkInner";

const hrefMap = hrefData as Record<string, string>;
const FALLBACK_SLUG = "brickout";

type Variant = "solid" | "outline";

export function BookmarkletLink({
  className = "",
  children,
  variant = "solid",
  slug,
}: {
  className?: string;
  children?: React.ReactNode;
  variant?: Variant;
  slug?: string;
}) {
  const safeSlug =
    slug && /^[a-z0-9-]+$/.test(slug) && hrefMap[slug] ? slug : FALLBACK_SLUG;
  const href = hrefMap[safeSlug] ?? hrefMap[FALLBACK_SLUG] ?? "javascript:void(0)";

  return (
    <BookmarkletLinkInner href={href} className={className} variant={variant}>
      {children}
    </BookmarkletLinkInner>
  );
}
