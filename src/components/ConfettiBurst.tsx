export interface ConfettiBurstProps {
    className?: string;
    testId?: string;
}
export function ConfettiBurst({ className = '', testId }: ConfettiBurstProps) {
    return (<span className={`index-confetti-burst ${className}`.trim()} aria-hidden="true" data-testid={testId}>
      <span className="index-confetti-dot p1"/>
    <span className="index-confetti-dot p2"/>
      <span className="index-confetti-dot p3"/>
    <span className="index-confetti-dot p4"/>
      <span className="index-confetti-dot p5"/>
    <span className="index-confetti-dot p6"/>
    </span>);
}
