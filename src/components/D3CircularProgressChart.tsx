import * as d3 from 'd3';
import { useEffect, useId, useRef, useState } from 'react';
export interface D3CircularProgressChartProps {
    completed: number;
    total: number;
    percentage: number;
    title?: string;
    size?: number;
    strokeWidth?: number;
    colorScheme?: 'emerald' | 'indigo' | string;
}
export function D3CircularProgressChart({ completed, total, percentage, title = 'الوحدة', size = 56, strokeWidth = 5.5, colorScheme = 'emerald' }: D3CircularProgressChartProps) {
    const svgRef = useRef<SVGSVGElement | null>(null), previous = useRef(0), first = useRef(true);
    const [updated, setUpdated] = useState(false);
    const gradientId = `progress-${useId().replace(/[^a-z0-9-]/gi, '')}`;
    const value = Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) : 0;
    useEffect(() => { if (first.current) {
        first.current = false;
        return;
    } setUpdated(true); const timer = setTimeout(() => setUpdated(false), 900); return () => clearTimeout(timer); }, [value, completed]);
    useEffect(() => {
        if (!svgRef.current)
            return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').interrupt().remove();
        const radius = size / 2, inner = Math.max(0, radius - strokeWidth);
        svg.attr('viewBox', `0 0 ${size} ${size}`);
        const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);
        const gradient = svg.append('defs').append('linearGradient').attr('id', gradientId).attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', value === 100 ? '#4ade80' : '#ffffff');
        gradient.append('stop').attr('offset', '100%').attr('stop-color', value === 100 ? '#22c55e' : '#93c5fd');
        const track = d3.arc<void>().innerRadius(inner).outerRadius(radius).startAngle(0).endAngle(2 * Math.PI);
        g.append('path').attr('d', track() || '').attr('fill', 'rgba(255,255,255,.22)').attr('class', 'd3-circle-track');
        const arc = d3.arc<{
            endAngle: number;
        }>().innerRadius(inner).outerRadius(radius).startAngle(0).endAngle(d => d.endAngle).cornerRadius(strokeWidth / 2);
        const oldValue = previous.current;
        const end = value / 100 * 2 * Math.PI, from = oldValue / 100 * 2 * Math.PI;
        const path = g.append('path').attr('fill', `url(#${gradientId})`).attr('class', 'd3-circle-fill').attr('d', arc({ endAngle: end }) || '');
        const text = g.append('text').attr('class', 'd3-circle-percentage-text').attr('text-anchor', 'middle').attr('dominant-baseline', 'central').attr('font-size', size >= 56 ? '12px' : '11px').attr('font-weight', '800').attr('fill', '#ffffff').text(`${value}%`);
        const animate = import.meta.env.MODE !== 'test' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches && Math.abs(from - end) > .001;
        if (animate) {
            path.attr('d', arc({ endAngle: from }) || '').transition().duration(700).ease(d3.easeCubicOut).attrTween('d', () => { const interpolate = d3.interpolateNumber(from, end); return (t: number) => arc({ endAngle: interpolate(t) }) || ''; });
            text.text(`${previous.current}%`).transition().duration(700).ease(d3.easeCubicOut).tween('text', () => { const interpolate = d3.interpolateNumber(oldValue, value); return function (this: SVGTextElement, t: number) { this.textContent = `${Math.round(interpolate(t))}%`; }; });
        }
        previous.current = value;
        return () => { svg.selectAll('*').interrupt(); };
    }, [value, size, strokeWidth, colorScheme, gradientId]);
    return <div className={`d3-circular-progress-wrapper d3-circular-progress-wrapper--loaded${updated ? ' d3-circular-progress-wrapper--updated' : ''}${value === 100 ? ' d3-circular-progress-wrapper--completed' : ''}`} role="meter" aria-label={`نسبة إنجاز ${title}: ${value}% (${completed} من ${total})`} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} data-testid="d3-circular-progress" data-updating={updated ? 'true' : 'false'}>
    <svg ref={svgRef} width={size} height={size} className="d3-circular-progress-svg" aria-hidden="true"/>
    <div className="d3-circular-progress-info">
    <span className="d3-circular-progress-info__label">نسبة الإنجاز</span>
    <span className="d3-circular-progress-info__count">{completed} / {total} دروس</span>
    </div>
    </div>;
}
