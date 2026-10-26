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
          <a className="btn-primary grade-six-resource__pdf-link" href={resource.url} target="_blank" rel="noopener noreferrer">فتح البوكليت أو تنزيله ↗</a>
          <details className="grade-six-resource__pdf-preview">
            <summary>معاينة صفحات البوكليت داخل الدرس</summary>
            <iframe title={`معاينة ${resource.title}`} src={resource.url} loading="lazy" />
          </details>
        </>
      )}
      {kind === 'file' && <a className="grade-six-resource__download" href={resource.url} target="_blank" rel="noopener noreferrer">فتح الملف ↗</a>}
    </article>
  );
}
