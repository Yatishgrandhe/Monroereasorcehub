'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type BreadcrumbItem = { label: string; href?: string };

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-text-muted)]">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-x-2">
            {i > 0 && (
              <ChevronRight className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="link-underline text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[var(--color-text)]" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
