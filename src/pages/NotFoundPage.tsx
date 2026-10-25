import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
        الصفحة غير موجودة (404)
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقل محتواه.
      </p>
      <Link to="/" className="btn-primary">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
};
