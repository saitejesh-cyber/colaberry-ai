import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";

type CatalogSearchBoxProps = {
  placeholder?: string;
};

export default function CatalogSearchBox({ placeholder = "Ask about agents, MCPs, or skills..." }: CatalogSearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="sticky bottom-0 z-20 mt-8 border-t border-[var(--stroke)] bg-[var(--surface-frosted)] py-3 backdrop-blur-sm">
      <form onSubmit={handleSubmit} role="search" aria-label="Catalog search" className="mx-auto flex max-w-2xl gap-2 px-4">
        <label htmlFor="catalog-search-input" className="sr-only">Search the catalog</label>
        <input
          id="catalog-search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search the catalog"
          className="input-premium flex-1"
        />
        <button type="submit" className="btn btn-primary whitespace-nowrap px-5 py-2.5 text-sm">
          Search
        </button>
      </form>
    </div>
  );
}
