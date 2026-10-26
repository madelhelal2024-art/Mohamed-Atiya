import { useEffect, useRef, useState } from 'react';
import type { GradeSixFile } from '../lib/grade-six-resources';

function SegmentedVideo({ title, parts }: { title: string; parts: string[] }) {
  const [currentPart, setCurrentPart] = useState(0);
  const [continuePlayback, setContinuePlayback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (continuePlayback) {
      void videoRef.current?.play().catch(() => {
        setContinuePlayback(false);
      });
    }
  }, [currentPart, continuePlayback]);

  const nextPart = () => {
    if (currentPart + 1 < parts.length) {
      setContinuePlayback(true);
      setCurrentPart((value) => value + 1);
    }
  };

  return (
    <div className="grade-six-resource__video">
      <video
        key={currentPart}
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        src={parts[currentPart]}
        aria-label={`${title} — جزء ${(currentPart + 1).toLocaleString('ar-EG')} من ${parts.length.toLocaleString('ar-EG')}`}
        onEnded={() => nextPart()}
        onPlay={() => setContinuePlayback(false)}
      >
        متصفحك لا يدعم تشغيل الفيديو. استخدم الرابط المباشر أسفل المشغّل.
      </video>
      {parts.length > 1 && (
        <div className="grade-six-resource__video-navigation">
          <span>الجزء {(currentPart + 1).toLocaleString('ar-EG')} من {parts.length.toLocaleString('ar-EG')} — ينتقل المشغّل تلقائيًا للجزء التالي</span>
          <div>
            <button type="button" className="btn-secondary" disabled={currentPart === 0} onClick={() => { setContinuePlayback(false); setCurrentPart((v) => v - 1); }}>الجزء السابق</button>
            <button type="button" className="btn-secondary" disabled={currentPart === parts.length - 1} onClick={() => nextPart()}>الجزء التالي</button>
          </div>
        </div>
      )}
      <a className="grade-six-resource__download" href={parts[currentPart]} target="_blank" rel="noopener noreferrer">فتح الجزء الحالي مباشرة ↗</a>
    </div>
  );
}

/** Render pages as ordinary images; native PDF iframes are unreliable in some browsers. */
export function GradeSixBookletPages({ title, pages }: { title: string; pages: string[] }) {
  const [pageIndex, setPageIndex] = useState(0);
  const currentPage = pages[pageIndex];

  if (pages.length === 0) return null;

  return (
    <section className="grade-six-booklet" aria-label={`صفحات ${title}`}>
      <h5>تصفّح صفحات البوكليت</h5>
      <p>صفحات كاملة وواضحة داخل الدرس. اضغط على الصفحة لفتحها بحجم أكبر.</p>
      <div className="grade-six-booklet__navigation">
        <button className="btn-secondary" type="button" disabled={pageIndex === 0} onClick={() => setPageIndex((value) => value - 1)}>السابق</button>
        <label htmlFor="grade-six-booklet-page-select">اذهب إلى الصفحة</label>
        <select
          id="grade-six-booklet-page-select"
          value={pageIndex}
          onChange={(event) => setPageIndex(Number(event.target.value))}
          aria-label="اختر صفحة من البوكليت"
        >
          {pages.map((_, index) => <option key={index} value={index}>صفحة {index + 1} من {pages.length}</option>)}
        </select>
        <button className="btn-secondary" type="button" disabled={pageIndex === pages.length - 1} onClick={() => setPageIndex((value) => value + 1)}>التالي</button>
      </div>
      <figure className="grade-six-booklet__page">
        <a href={currentPage} target="_blank" rel="noopener noreferrer" aria-label={`افتح صفحة ${pageIndex + 1} بحجم كامل`}>
          <img src={currentPage} alt={`صفحة ${pageIndex + 1} من ${pages.length} — ${title}`} loading="lazy" />
        </a>
        <figcaption aria-live="polite">الصفحة {pageIndex + 1} من {pages.length}</figcaption>
      </figure>
      <div className="grade-six-booklet__page-picker" aria-label="كل صفحات البوكليت">
        {pages.map((_, index) => (
          <button
            key={index}
            type="button"
            className={pageIndex === index ? 'is-current' : ''}
            aria-label={`اعرض صفحة ${index + 1}`}
            aria-current={pageIndex === index ? 'page' : undefined}
            onClick={() => setPageIndex(index)}
          >{index + 1}</button>
        ))}
      </div>
    </section>
  );
}

export function GradeSixResourcePreview({ resource }: { resource: GradeSixFile }) {
  const kind = resource.kind || 'file';
  return (
    <article className="grade-six-resource">
      <h4>{resource.title}</h4>
      {resource.description && <p>{resource.description}</p>}
      {kind === 'image' && (
        <figure>
          <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`فتح صورة ${resource.title} بحجمها الكامل`}>
            <img src={resource.url} alt={resource.title} loading="lazy" />
          </a>
          <figcaption>اضغط على الصورة لتكبيرها.</figcaption>
        </figure>
      )}
      {kind === 'video' && <SegmentedVideo title={resource.title} parts={resource.parts?.length ? resource.parts : [resource.url]} />}
      {kind === 'pdf' && (
        <>
          <a className="btn-primary grade-six-resource__pdf-link" href={resource.url} download>تنزيل البوكليت PDF</a>
          {resource.pages?.length ? (
            <GradeSixBookletPages title={resource.title} pages={resource.pages} />
          ) : (
            <p>يمكنك تنزيل ملف PDF وفتحه في قارئ الملفات على جهازك.</p>
          )}
        </>
      )}
      {kind === 'file' && <a className="btn-primary grade-six-resource__file-link" href={resource.url} download={resource.url.endsWith('.pptx') || resource.url.endsWith('.ppt') || undefined} target="_blank" rel="noopener noreferrer">{resource.url.endsWith('.pptx') || resource.url.endsWith('.ppt') ? 'تنزيل العرض التقديمي PowerPoint' : 'فتح الملف ↗'}</a>}
    </article>
  );
}
