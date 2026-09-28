import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20" {...props}>
      {children}
    </svg>
  );
}

export function TeamIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.3 11.1a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Zm7.6-1.2a2.45 2.45 0 1 0 0-4.9 2.45 2.45 0 0 0 0 4.9ZM2.8 19.2v-1.5c0-2.7 2.46-4.6 5.5-4.6s5.5 1.9 5.5 4.6v1.5h-11Zm11.8-6.3c.42-.12.87-.18 1.3-.18 2.54 0 4.6 1.58 4.6 3.84v1.14h-4.33" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </IconBase>
  );
}

export function AthleteIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5.5 20v-1.55c0-3.06 2.9-5.45 6.5-5.45s6.5 2.39 6.5 5.45V20h-13Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </IconBase>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 3.8h14v16.4H5V3.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <circle cx="12" cy="9" r="2.1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.4 16.2c.62-1.53 1.83-2.3 3.6-2.3s2.98.77 3.6 2.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </IconBase>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </IconBase>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </IconBase>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m14.8 5.2 4 4M4.5 19.5l1-4.5L15.7 4.8a1.9 1.9 0 0 1 2.7 0l.8.8a1.9 1.9 0 0 1 0 2.7L9 18.5l-4.5 1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </IconBase>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.5V12l3.2 1.9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </IconBase>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 2.8c.65 4.72 2.48 6.55 7.2 7.2-4.72.65-6.55 2.48-7.2 7.2-.65-4.72-2.48-6.55-7.2-7.2 4.72-.65 6.55-2.48 7.2-7.2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="M18.7 16.5c.22 1.56.84 2.18 2.4 2.4-1.56.22-2.18.84-2.4 2.4-.22-1.56-.84-2.18-2.4-2.4 1.56-.22 2.18-.84 2.4-2.4Z" fill="currentColor" />
    </IconBase>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7.5 3.5v4M16.5 3.5v4M3.8 10h16.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </IconBase>
  );
}
