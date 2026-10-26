import { useState } from 'react';
import { treasureSlides } from '../data/grade-six-lesson-interactions';

export function GradeSixTreasurePresentation() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = treasureSlides[slideIndex];

  return (
    <section className="treasure-learning" aria-labelledby="treasure-presentation-title">
      <header className="treasure-learning__intro">
        <h2 id="treasure-presentation-title">عرض الدرس التفاعلي</h2>
        <p>شرائح مرتّبة للشرح على السبورة أو المراجعة. استخدم «التالي» و«السابق» للتنقّل بين الأفكار.</p>
      </header>
      <div className="treasure-slide" aria-live="polite" aria-atomic="true">
        <div className="treasure-slide__head">
          <span>{slide.eyebrow}</span>
          <span>شريحة {slideIndex + 1} من {treasureSlides.length}</span>
        </div>
        <h3>{slide.title}</h3>
        <ul>{slide.points.map((point) => <li key={point}>{point}</li>)}</ul>
        <div className="treasure-slide__takeaway"><strong>الخلاصة:</strong> {slide.takeaway}</div>
      </div>
      <nav className="treasure-slide-nav" aria-label="التنقل بين شرائح الدرس">
        <button className="treasure-button treasure-button--subtle" type="button" disabled={slideIndex === 0} onClick={() => setSlideIndex((index) => index - 1)}>السابق</button>
        <div className="treasure-slide-dots" aria-label="اختر شريحة">
          {treasureSlides.map((item, index) => (
            <button
              key={item.title}
              className={index === slideIndex ? 'is-current' : ''}
              type="button"
              aria-label={`شريحة ${index + 1}: ${item.title}`}
              aria-current={index === slideIndex ? 'step' : undefined}
              onClick={() => setSlideIndex(index)}
            />
          ))}
        </div>
        <button className="treasure-button" type="button" disabled={slideIndex === treasureSlides.length - 1} onClick={() => setSlideIndex((index) => index + 1)}>التالي</button>
      </nav>
    </section>
  );
}
