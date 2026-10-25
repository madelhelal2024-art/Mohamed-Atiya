import React from 'react';
import { SafeExternalLink } from './SafeExternalLink';

interface BookletViewerProps {
  title: string;
  url: string;
  totalPages?: number;
  description?: string;
}

export const BookletViewer: React.FC<BookletViewerProps> = ({
  title,
  url,
  totalPages = 1,
  description,
}) => {
  return (
    <div className="pdf-viewer-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{title}</h4>
          {description && (
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>{description}</p>
          )}
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            عدد الصفحات المقدر: {totalPages} صفحات
          </span>
        </div>

        <SafeExternalLink href={url} className="btn-primary">
          <span>تحميل / استعراض البوكليت 📄</span>
        </SafeExternalLink>
      </div>

      <div className="pdf-preview-box">
        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📑</div>
          <p style={{ fontWeight: 600, color: '#475569' }}>معاينة المذكرة والبوكليت التعليمي</p>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            يمكنك فتح المستند الكامل أو تحميله للطباعة والمذاكرة غير المتصلة.
          </p>
        </div>
      </div>
    </div>
  );
};
