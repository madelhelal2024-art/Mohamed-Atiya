import React from 'react';
import { SafeExternalLink } from './SafeExternalLink';

export interface ResourceItem {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'doc';
  url: string;
}

interface ResourceListProps {
  resources: ResourceItem[];
}

export const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>لا توجد موارد إضافية مسجلة.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {resources.map((res) => (
        <div
          key={res.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{res.title}</span>
          <SafeExternalLink href={res.url} className="btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>
            فتح المورد
          </SafeExternalLink>
        </div>
      ))}
    </div>
  );
};
