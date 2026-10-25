import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import teacherData from '../data/teacher.json';
import curriculumData from '../data/curriculum.json';
import { BrandImage } from './BrandImage';
import { Icon } from './Icon';
import { searchCurriculum, SearchResultItem } from '../lib/search';
import { Curriculum } from '../types/content';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'الرئيسية', path: '/' },
    { label: 'المنهج والدروس', path: '/curriculum' },
    { label: 'السبورة التفاعلية', path: '/board' },
    { label: 'الملف والتقدم', path: '/profile' },
    { label: 'البرامج والدورات', path: '/programs' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      const results = searchCurriculum(curriculumData as unknown as Curriculum, q);
      setSearchResults(results.slice(0, 6));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectResult = (url: string) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Logo & Teacher Title */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <BrandImage
              src={teacherData.logo || '/assets/brand/logo-placeholder.svg'}
              alt={teacherData.name}
              style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'contain' }}
            />
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {teacherData.name}
              </h1>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{teacherData.title}</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav aria-label="التنقل الرئيسي" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isActive ? '#2563EB' : '#475569',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f1f5f9',
                borderRadius: '9999px',
                padding: '0.4rem 0.85rem',
                border: '1px solid #cbd5e1',
              }}
            >
              <Icon name="search" size={16} className="text-muted" />
              <input
                type="text"
                placeholder="ابحث عن درس أو وحدة..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.85rem',
                  width: '100%',
                  fontFamily: 'inherit',
                  direction: 'rtl',
                }}
              />
            </div>

            {/* Search dropdown */}
            {showResults && searchResults.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  left: 0,
                  marginTop: '0.5rem',
                  background: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  zIndex: 200,
                }}
              >
                {searchResults.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelectResult(item.url)}
                    style={{
                      padding: '0.65rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.title}</span>
                    <span className="badge" style={{ fontSize: '0.7rem', background: '#f1f5f9', color: '#64748b' }}>
                      {item.type === 'lesson' ? 'درس' : item.type === 'unit' ? 'وحدة' : 'مستوى'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">{children}</div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#ffffff',
          borderTop: '1px solid var(--border-color)',
          padding: '2rem 0',
          marginTop: 'auto',
          fontSize: '0.9rem',
          color: '#64748b',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontWeight: 700, color: '#0f172a' }}>{teacherData.name}</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{teacherData.bio}</p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/curriculum" style={{ color: '#475569' }}>المناهج</Link>
            <Link to="/board" style={{ color: '#475569' }}>السبورة</Link>
            <Link to="/profile" style={{ color: '#475569' }}>التقدم والشارات</Link>
            <Link to="/programs" style={{ color: '#475569' }}>البرامج</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
