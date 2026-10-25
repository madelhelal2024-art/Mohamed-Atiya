import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import teacherData from '../data/teacher.json';
import { BrandImage } from './BrandImage';

const links = [
  { label: 'الرئيسية', path: '/' },
  { label: 'الصف السادس', path: '/grade-six' },
  { label: 'الفصل الأول', path: '/grade-six/term-one' },
  { label: 'الفصل الثاني', path: '/grade-six/term-two' },
  { label: 'السبورة التفاعلية', path: '/board' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="grade-six-site-header">
        <div className="container grade-six-site-header__inner">
          <Link to="/" className="grade-six-site-header__brand">
            {teacherData.logo && <BrandImage src={teacherData.logo} alt="شعار المعلم" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />}
            <span>
              <strong>{teacherData.name}</strong>
              <small>{teacherData.title}</small>
            </span>
          </Link>
          <nav className="grade-six-site-header__nav" aria-label="التنقل الرئيسي">
            {links.map((link) => {
              const isActive = link.path === '/grade-six'
                ? location.pathname === link.path
                : location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(`${link.path}/`));
              return <Link to={link.path} key={link.path} aria-current={isActive ? 'page' : undefined} className={isActive ? 'is-active' : undefined}>{link.label}</Link>;
            })}
          </nav>
          <Link className="grade-six-site-header__search" to="/grade-six/term-one">⌕ البحث في الفصل الأول</Link>
        </div>
      </header>

      <main className="grade-six-site-main"><div className="container">{children}</div></main>

      <footer className="grade-six-site-footer">
        <div className="container grade-six-site-footer__inner">
          <div><strong>{teacherData.name}</strong><p>اللغة العربية — الصف السادس الابتدائي</p></div>
          <nav aria-label="روابط التذييل">
            <Link to="/grade-six">الصف السادس</Link>
            <Link to="/grade-six/term-one">الفصل الأول</Link>
            <Link to="/grade-six/term-two">الفصل الثاني</Link>
            <Link to="/board">السبورة التفاعلية</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
