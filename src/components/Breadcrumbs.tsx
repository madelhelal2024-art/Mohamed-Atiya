import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="مسار التنقل" style={{ margin: '1rem 0', fontSize: '0.9rem', color: '#64748b' }}>
      <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
        <li>
          <Link to="/" style={{ color: '#2563eb', fontWeight: 600 }}>الرئيسية</Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <span aria-hidden="true" style={{ color: '#94a3b8' }}>/</span>
              <li>
                {item.path && !isLast ? (
                  <Link to={item.path} style={{ color: '#2563eb' }}>{item.label}</Link>
                ) : (
                  <span style={{ color: isLast ? '#0f172a' : 'inherit', fontWeight: isLast ? 700 : 400 }}>
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
