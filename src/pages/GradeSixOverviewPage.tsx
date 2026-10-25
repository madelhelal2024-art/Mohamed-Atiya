import { Breadcrumbs } from '../components/Breadcrumbs';
import { GradeSixTermCards } from '../components/GradeSixTermCards';
import terms from '../data/grade-six-terms.json';
import '../styles/grade-six-home.css';

export function GradeSixOverviewPage() {
  return (
    <section className="grade-six-overview" aria-labelledby="grade-six-heading">
      <Breadcrumbs items={[{ label: 'الصف السادس الابتدائي' }]} />
      <header className="grade-six-overview__header">
        <span className="grade-six-overview__eyebrow">{terms.subject}</span>
        <h1 id="grade-six-heading">{terms.grade}</h1>
        <p>اختر الفصل الدراسي الذي تريد دراسته. لكل فصل قسم مستقل، وسنضيف الشرح والتدريبات بمجرد توفير مواده.</p>
      </header>
      <GradeSixTermCards />
    </section>
  );
}
