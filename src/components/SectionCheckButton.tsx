import { useEffect, useRef, useState } from 'react';
import { playCheckClickSound } from '../lib/audio';
import { ConfettiBurst } from './ConfettiBurst';
import { Icon } from './Icon';
export interface SectionCheckButtonProps {
    isFinished: boolean;
    onToggle: () => void;
    ariaLabel?: string;
    title?: string;
    finishedTitle?: string;
    unfinishedTitle?: string;
    finishedText?: string;
    unfinishedText?: string;
    className?: string;
    soundEnabled?: boolean;
}
export function SectionCheckButton({ isFinished, onToggle, ariaLabel, title, finishedTitle = 'تم الإنجاز', unfinishedTitle = 'وضع كـ مكتمل', finishedText = 'مكتمل', unfinishedText = 'إكمال', className = '', soundEnabled = true }: SectionCheckButtonProps) {
    const [isPopping, setIsPopping] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => { if (timer.current)
        clearTimeout(timer.current); }, []);
    const defaultTitle = isFinished ? finishedTitle : unfinishedTitle;
    const resolvedTitle = title !== undefined ? title : defaultTitle;
    function handleClick() {
        if (soundEnabled)
            playCheckClickSound({ isCompleting: !isFinished });
        if (!isFinished) {
            if (timer.current)
                clearTimeout(timer.current);
            setIsPopping(true);
            timer.current = setTimeout(() => setIsPopping(false), 850);
        }
        else {
            if (timer.current)
                clearTimeout(timer.current);
            setIsPopping(false);
        }
        onToggle();
    }
    return (<button type="button" className={`index-section-check-btn${isFinished ? ' is-finished' : ''}${isPopping ? ' is-popping' : ''} ${className}`.trim()} onClick={handleClick} aria-label={ariaLabel} aria-pressed={isFinished} title={resolvedTitle} data-tooltip={defaultTitle} data-popping={isPopping ? 'true' : 'false'}>
      <span className="index-check-btn__icon-wrapper">
    <Icon name={isFinished ? 'check-circle' : 'check'} className={isPopping ? 'index-check-pop-icon' : ''}/>{isPopping && <ConfettiBurst testId="check-confetti-burst"/>}</span>
      <span>{isFinished ? finishedText : unfinishedText}</span>
      <span className="index-section-check-btn__tooltip" role="tooltip" aria-hidden="true">{resolvedTitle}</span>
    </button>);
}
