import { Link } from 'react-router-dom';
import teacherData from '../data/teacher.json';
import { BrandImage } from '../components/BrandImage';
import { GradeSixTermCards } from '../components/GradeSixTermCards';
import '../styles/grade-six-home.css';

export function HomePage() {
  return (
    <div className="grade-six-home">
      <section className="grade-six-home__hero">
        <div className="grade-six-home__teacher-photo">
          <BrandImage src={teacherData.avatar} alt={`صورة ${teacherData.name}`} />
        </div>
        <div className="grade-six-home__welcome">
          <span className="grade-six-home__eyebrow">نتعلّم العربية بإبداع</span>
          <h1>{teacherData.name}</h1>
          <p className="grade-six-home__teacher-title">{teacherData.title}</p>
          <p>مرحبًا بك في مساحة تعلّم اللغة العربية للصف السادس الابتدائي. اختر فصلك الدراسي، ثم افتح عنوان الدرس للوصول إلى ملفاته وأقسامه التعليمية.</p>
          <div className="grade-six-home__actions">
            <Link className="grade-six-home__main-link" to="/grade-six">ابدأ من الصف السادس ←</Link>
            <Link className="grade-six-home__alt-link" to="/board">السبورة التفاعلية</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="choose-term-heading" className="grade-six-home__choose">
        <h2 className="grade-six-home__heading" id="choose-term-heading">اللغة العربية — الصف السادس الابتدائي</h2>
        <p className="grade-six-home__intro">اختر أحد الفصلين الدراسيين. يمكنك الآن تصفّح عناوين الفصل الأول، وسنضيف محتوى الدروس تدريجيًا بعد توفير الملفات.</p>
        <GradeSixTermCards />
      </section>
    </div>
  );
}
