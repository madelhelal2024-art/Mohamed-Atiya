import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3CircularProgressChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const D3CircularProgressChart: React.FC<D3CircularProgressChartProps> = ({
  percentage,
  size = 140,
  strokeWidth = 12,
  color = '#2563EB',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = size / 2;
    const innerRadius = radius - strokeWidth;

    const g = svg
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`);

    // Background circle arc
    const arcBg = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append('path')
      .attr('d', arcBg as any)
      .attr('fill', '#E2E8F0');

    // Foreground progress arc
    const validPercent = Math.min(100, Math.max(0, percentage));
    const angle = (validPercent / 100) * 2 * Math.PI;

    const arcFg = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(angle)
      .cornerRadius(strokeWidth / 2);

    g.append('path')
      .attr('d', arcFg as any)
      .attr('fill', color);

    // Percentage text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', `${size * 0.22}px`)
      .attr('font-weight', 'bold')
      .attr('fill', '#0F172A')
      .text(`${validPercent}%`);
  }, [percentage, size, strokeWidth, color]);

  return <svg ref={svgRef} width={size} height={size} style={{ display: 'block' }} />;
};
