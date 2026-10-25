import React from 'react';
import { isExternalUrl, isSafeUrl, sanitizeUrl } from '../lib/urls';

interface SafeExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  fallbackText?: string;
}

export const SafeExternalLink: React.FC<SafeExternalLinkProps> = ({
  href,
  children,
  className = '',
  ...props
}) => {
  const safe = isSafeUrl(href);
  const targetHref = safe ? sanitizeUrl(href) : '#';
  const isExt = isExternalUrl(targetHref);

  return (
    <a
      href={targetHref}
      className={className}
      target={isExt ? '_blank' : undefined}
      rel={isExt ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
};
