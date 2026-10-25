import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import '../styles/grade-six-home.css';

export function GradeSixTermTwoPage() {
  return (
    <section className="grade-six-term-two" aria-labelledby="term-two-title">
      <Breadcrumbs items={[
        { label: 'الصف السادس الابتدائي', path: '/grade-six' },
        { label: 'الفصل الدراسي الثاني' },
      ]} />
      <div className="grade-six-term-two__empty" role="status">
        <span className="grade-six-term-two__icon" aria-hidden="true">٢</span>
        <span className="grade-six-term-card__badge is-pending">بانتظار المحتوى</span>
        <h1 id="term-two-title">اللغة العربية — الصف السادس الابتدائي</h1>
        <h2>الفصل الدراسي الثاني</h2>
        <p>هذا القسم جاهز لاستقبال فهرس الكتاب ودروسه، لكن لم تصلنا مواد الفصل الدراسي الثاني بعد. سنرتّب وحداته وأنشطته هنا عند إرسالها.</p>
        <Link className="btn-primary" to="/grade-six">العودة إلى الفصلين الدراسيين</Link>
      </div>
    </section>
  );
}
