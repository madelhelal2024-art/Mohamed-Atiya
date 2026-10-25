import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SafeExternalLink } from '../components/SafeExternalLink';
import data from '../data/student-programs.json';
import { isSafeContactUrl, isSafeContentUrl } from '../lib/urls';
export function StudentProgramsPage() {
    const course = data.program;
    return <section className="page-section student-programs-page">
    <div className="container">
    <nav aria-label="مسار الصفحة" className="breadcrumbs">
    <ol>
    <li>
    <Link to="/">الرئيسية</Link>
    </li>
    <li>
    <Icon className="breadcrumb-separator" name="chevron"/>
    </li>
    <li aria-current="page">{data.pageTitle}</li>
    </ol>
    </nav>
    <div className="page-heading">
    <p className="section-kicker">تعلم عملي للطلاب</p>
    <h1 id="page-title" tabIndex={-1}>{data.pageTitle}</h1>
    <p>{data.pageDescription}</p>
    </div>
    <article className="student-course-hero">
    <div>
    <span className="student-course-badge">
    <Icon name="sparkle"/> {course.badge}</span>
    <h2>{course.title}</h2>{course.description.map((p, i) => <p key={i}>{p}</p>)}</div>
    <div className="student-course-price">
    <small>قيمة الاشتراك</small>
    <strong>{course.priceLabel}</strong>
    <span>{course.priceNote}</span>
    </div>
    </article>
    <div className="student-programs-grid">
    <section className="student-info-card" aria-labelledby="course-benefits-title">
    <div className="student-card-heading">
    <Icon name="brain"/>
    <div>
    <p className="section-kicker">ماذا سيتعلم الطالب؟</p>
    <h2 id="course-benefits-title">أهم محاور البرنامج</h2>
    </div>
    </div>
    <ul className="student-benefit-list">{course.benefits.map((benefit, i) => <li key={i}>
        <Icon name="check-circle"/> {benefit}</li>)}</ul>
    </section>
      <section className="student-info-card student-subscribe-card" aria-labelledby="subscribe-title">
    <div className="student-card-heading">
    <Icon name="message"/>
    <div>
    <p className="section-kicker">طريقة الاشتراك</p>
    <h2 id="subscribe-title">{course.enrollmentTitle}</h2>
    </div>
    </div>
    <ol className="student-steps">{course.enrollmentSteps.map((step, i) => <li key={i}>{step}</li>)}</ol>{typeof course.enrollmentUrl === 'string' && isSafeContactUrl(course.enrollmentUrl) ? <SafeExternalLink className="primary-button student-whatsapp-button" href={course.enrollmentUrl} mode="contact">
        <Icon name="message"/>
        <span>{course.enrollmentButton}</span>
        </SafeExternalLink> : <p className="inline-empty">أضف رابط التواصل لتفعيل زر الاشتراك.</p>}</section>
    </div>
    <section aria-labelledby="lectures-title" className="student-section">
    <div className="student-section-heading">
    <div>
    <p className="section-kicker">المحاضرات المسجلة</p>
    <h2 id="lectures-title">شاهد المحاضرات</h2>
    </div>
    <p>{course.accessNote}</p>
    </div>
    <div className="student-lecture-grid">{course.lectures.map((lecture, index) => <article className="student-lecture-card" key={lecture.id}>
        <div className="student-lecture-number">{index + 1}</div>
        <div>
        <span className={lecture.free ? 'student-access-tag is-free' : 'student-access-tag is-locked'}>{lecture.url ? (lecture.free ? 'متاحة للجميع' : 'وصول مقيّد من المصدر') : 'بانتظار إضافة المحتوى'}</span>
        <h3>{lecture.title}</h3>
        <p>{lecture.description}</p>
        </div>{typeof lecture.url === 'string' && isSafeContentUrl(lecture.url) ? <SafeExternalLink className={lecture.free ? 'primary-button' : 'secondary-button'} href={lecture.url}>
            <Icon name={lecture.free ? 'play' : 'video'}/>
            <span>{lecture.free ? 'شاهد الآن' : 'فتح المحاضرة'}</span>
            </SafeExternalLink> : <button className="secondary-button" disabled type="button">
            <Icon name="video"/>
            <span>لم يُضف الرابط بعد</span>
            </button>}</article>)}</div>
    </section>
    <section aria-labelledby="material-title" className="student-material-card">
    <div className="student-card-heading">
    <Icon name="file"/>
    <div>
    <p className="section-kicker">المادة العلمية للبرنامج</p>
    <h2 id="material-title">{course.material.title}</h2>
    </div>
    </div>
    <p>{course.material.description}</p>
    <div className="student-material-actions">{typeof course.material.url === 'string' && isSafeContentUrl(course.material.url) ? <SafeExternalLink className="secondary-button" href={course.material.url}>
        <Icon name="file"/>
        <span>فتح المادة العلمية</span>
        </SafeExternalLink> : <span className="inline-empty">لم يُضف ملف المادة العلمية بعد.</span>}<span className="student-access-note">{course.material.accessNote}</span>
    </div>
    </section>
  </div>
    </section>;
}
