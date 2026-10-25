import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { unlockBadge } from '../lib/storage';

interface DrawLine {
  tool: 'pen' | 'eraser';
  color: string;
  strokeWidth: number;
  points: number[];
}

export const BoardPage: React.FC = () => {
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#2563EB');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [lines, setLines] = useState<DrawLine[]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stageDimensions, setStageDimensions] = useState({ width: 900, height: 600 });

  // Load saved board from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('educational_app_board_state');
      if (saved) {
        setLines(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Update canvas size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth || 900;
        const h = Math.max(500, window.innerHeight - 250);
        setStageDimensions({ width: w, height: h });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    setLines((prev) => [
      ...prev,
      {
        tool,
        color: tool === 'eraser' ? '#FFFFFF' : color,
        strokeWidth: tool === 'eraser' ? 24 : strokeWidth,
        points: [pos.x, pos.y],
      },
    ]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    setLines((prev) => {
      const lastLine = prev[prev.length - 1];
      if (!lastLine) return prev;
      const newPoints = lastLine.points.concat([point.x, point.y]);
      const updatedLine = { ...lastLine, points: newPoints };
      return [...prev.slice(0, prev.length - 1), updatedLine];
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    // Persist lines
    try {
      localStorage.setItem('educational_app_board_state', JSON.stringify(lines));
      unlockBadge('board-artist');
    } catch {
      // Storage quota
    }
  };

  const handleClear = () => {
    setLines([]);
    try {
      localStorage.removeItem('educational_app_board_state');
    } catch {}
  };

  const handleDownloadImage = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lines));
    const link = document.createElement('a');
    link.download = `whiteboard-notes-${Date.now()}.json`;
    link.href = dataStr;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const colorsList = ['#0F172A', '#2563EB', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'السبورة التفاعلية' }]} />

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            السبورة التفاعلية الذكية
          </h1>
          <p style={{ color: '#64748b' }}>
            مساحة حرة للرسم، تدوين الملاحظات، حل المسائل، وتصدير العمل بصيغة صورة أو ملف مشروع.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" onClick={handleDownloadImage} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            تصدير كصورة PNG 🖼️
          </button>
          <button type="button" onClick={handleDownloadJson} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            تصدير ملف الملاحظات 💾
          </button>
          <button type="button" onClick={handleClear} className="btn-secondary" style={{ color: '#dc2626', borderColor: '#fca5a5', fontSize: '0.85rem' }}>
            مسح السبورة 🗑️
          </button>
        </div>
      </div>

      {/* Whiteboard Workspace */}
      <div className="board-container" ref={containerRef}>
        {/* Toolbar */}
        <div className="board-toolbar">
          <button
            type="button"
            className={`board-tool-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => setTool('pen')}
          >
            ✏️ قلم الرسم
          </button>
          <button
            type="button"
            className={`board-tool-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
          >
            🧼 الممحاة
          </button>

          {/* Color palette */}
          {tool === 'pen' && (
            <div className="board-color-picker" style={{ margin: '0 0.5rem' }}>
              {colorsList.map((c) => (
                <div
                  key={c}
                  className={`board-color-dot ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          )}

          {/* Stroke size selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: 'auto' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>سمك الخط:</span>
            <input
              type="range"
              min="2"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              style={{ width: '90px' }}
            />
          </div>
        </div>

        {/* Konva Stage Canvas */}
        <div className="board-canvas-area board-v2-grid">
          <Stage
            ref={stageRef}
            width={stageDimensions.width}
            height={stageDimensions.height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};
