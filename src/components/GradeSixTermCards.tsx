import { Link } from 'react-router-dom';
import terms from '../data/grade-six-terms.json';
import termOneIndex from '../data/grade-six-term-one-index.json';
import '../styles/grade-six-home.css';

const unitCount = termOneIndex.units.length;

export function GradeSixTermCards() {
  return (
    <div className="grade-six-term-grid" aria-label="الفصلان الدراسيان للصف السادس">
      {terms.terms.map((term, index) => {
        const ready = term.status === 'index-ready';
        return (
          <Link className="grade-six-term-card" to={term.path} key={term.id}>
            <span className="grade-six-term-card__index" aria-hidden="true">{index === 0 ? '٠١' : '٠٢'}</span>
            <span className={`grade-six-term-card__badge ${ready ? 'is-ready' : 'is-pending'}`}>
              {ready ? 'الفهرس متاح' : 'بانتظار المحتوى'}
            </span>
            <strong>{term.title}</strong>
            <span className="grade-six-term-card__description">{term.description}</span>
            {ready && <span className="grade-six-term-card__units">{unitCount} وحدات دراسية</span>}
            <span className="grade-six-term-card__action">{ready ? 'تصفح الفهرس' : 'عرض القسم'} <span aria-hidden="true">←</span></span>
          </Link>
        );
      })}
    </div>
  );
}
