import type { ReactNode, SVGProps } from 'react';
export type IconName = 'check' | 'close' | 'search' | 'arrow-right' | 'check-circle' | 'clock' | 'compass' | 'edit' | 'feather' | 'flag' | 'heart' | 'play' | 'star' | 'trending-up' | 'user' | 'volume-high' | 'arrow-left' | 'book' | 'brain' | 'chevron' | 'clipboard' | 'download' | 'external' | 'file' | 'game' | 'home' | 'layers' | 'mail' | 'map' | 'message' | 'sparkle' | 'video';
const paths: Record<IconName, ReactNode> = {
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
    search: <>
    <circle cx="10.5" cy="10.5" r="6.5"/>
    <path d="m16 16 5 5"/></>,
    'arrow-right': <>
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/></>,
    'check-circle': <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <path d="m9 11 3 3L22 4"/></>,
    clock: <>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/></>,
    compass: <>
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>,
    edit: <>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    feather: <>
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
    <line x1="16" y1="8" x2="2" y2="22"/>
    <line x1="17.5" y1="15" x2="9" y2="15"/></>,
    flag: <>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" y1="22" x2="4" y2="15"/></>,
    heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>,
    play: <path d="m8 5 11 7-11 7V5Z"/>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    'trending-up': <>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/></>,
    user: <>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/></>,
    'volume-high': <>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></>,
    'arrow-left': <>
    <path d="M19 12H5"/>
    <path d="m12 19-7-7 7-7"/></>,
    book: <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    brain: <>
    <path d="M9.5 4.5A2.5 2.5 0 0 0 7 7v.2A3 3 0 0 0 5 10v.2A3 3 0 0 0 6 16v.5A2.5 2.5 0 0 0 10.5 18V6a2 2 0 0 0-1-1.5Z"/>
    <path d="M14.5 4.5A2.5 2.5 0 0 1 17 7v.2a3 3 0 0 1 2 2.8v.2a3 3 0 0 1-1 5.8v.5a2.5 2.5 0 0 1-4.5 1.5V6a2 2 0 0 1 1-1.5Z"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    clipboard: <>
    <rect width="14" height="18" x="5" y="4" rx="2"/>
    <path d="M9 4.5V3h6v1.5M9 11h6M9 15h4"/></>,
    download: <>
    <path d="M12 3v12"/>
    <path d="m7 10 5 5 5-5"/>
    <path d="M5 21h14"/></>,
    external: <>
    <path d="M15 3h6v6"/>
    <path d="M10 14 21 3"/>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    file: <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
    <path d="M14 2v6h6"/></>,
    game: <>
    <path d="M6 12h4M8 10v4"/>
    <path d="M15 13h.01M18 11h.01"/>
    <path d="M17.3 6H6.7a4 4 0 0 0-3.8 2.7L1.5 15a3 3 0 0 0 4.9 3l2-2h7.2l2 2a3 3 0 0 0 4.9-3l-1.4-6.3A4 4 0 0 0 17.3 6Z"/></>,
    home: <>
    <path d="m3 11 9-8 9 8"/>
    <path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    layers: <>
    <path d="m12 2 9 5-9 5-9-5 9-5Z"/>
    <path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
    mail: <>
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-10 6L2 7"/></>,
    map: <>
    <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/>
    <path d="M9 3v15M15 6v15"/></>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>,
    sparkle: <>
    <path d="m12 3-1.2 3.2L8 7.5l2.8 1.3L12 12l1.2-3.2L16 7.5l-2.8-1.3L12 3Z"/>
    <path d="m5 13-.8 2.2L2 16l2.2.8L5 19l.8-2.2L8 16l-2.2-.8L5 13ZM19 12l-.8 2.2-2.2.8 2.2.8L19 18l.8-2.2L22 15l-2.2-.8L19 12Z"/></>,
    video: <>
    <path d="m16 13 5 3V8l-5 3"/>
    <rect width="13" height="12" x="3" y="6" rx="2"/></>,
};
export function Icon({ name, ...props }: {
    name: IconName;
} & SVGProps<SVGSVGElement>) {
    return (<svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" {...props}>
      {paths[name]}
    </svg>);
}
