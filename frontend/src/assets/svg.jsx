const svg = {
  eye: ({ fill = "#000", height = 24, width = 24 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke={fill} strokeWidth="2" />
    </svg>
  ),
  google: ({ fill = "#004bd6", height = 20, width = 20 }) => (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>),
  eyeOff: ({ fill = "#000", height = 24, width = 24 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12C1 12 2.64 8.74 6.06 6.94M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12C23 12 21.36 15.26 17.94 17.06M9.9 4.24L3 11M9.9 4.24L14.1 19.76M14.1 19.76L17.94 17.94M14.1 19.76L9.9 4.24"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  logo: ({ fill = "#004bd6", height = 36, width = 36 }) => (
    <svg  width={width} height={height} x={0} y={0} viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve" ><g><path d="M295.65 187.81c6.32 6.95 9.48 15.84 9.48 26.66s-3.16 19.05-9.48 25.72-15.58 10-27.77 10h-35.21v-72.8h35.21c12.19 0 21.45 3.48 27.77 10.42zM512 150v212c0 82.84-67.16 150-150 150H150C67.16 512 0 444.84 0 362V150C0 67.16 67.16 0 150 0h212c82.84 0 150 67.16 150 150zm-146.88 64.13c0-16.41-3.96-30.79-11.88-43.15s-19.17-22.02-33.75-28.97c-14.59-6.95-31.79-10.42-51.61-10.42h-121v35.21l25.8 5.47v167.65l-25.8 5.47v35.03h111.6v-35.03l-25.81-5.47v-43.75h35.21c19.82 0 37.03-3.42 51.61-10.25 14.58-6.84 25.83-16.41 33.75-28.71s11.88-26.66 11.88-43.07z" data-name={33} fill={fill} opacity={1} data-original="#000000"  /></g></svg>
  ),
  bell: ({ fill = "#0f172a", height = 22, width = 22 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9C6 6.24 8.24 4 11 4H13C15.76 4 18 6.24 18 9V11.5C18 12.84 18.53 14.12 19.47 15.06L20.5 16.09"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 16.5L6.2 15.3C7.18 14.32 7.73 12.99 7.73 11.6V9"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.5 19C9.9 20.2 10.9 21 12 21C13.1 21 14.1 20.2 14.5 19"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 16.5H20"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  user: ({ fill = "#0f172a", height = 22, width = 22 }) => (
    <svg width={width} height={height} x={0} y={0} viewBox="0 0 24 24" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve" className><g><g fill="#000" fillRule="evenodd" clipRule="evenodd"><path d="M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM9 16a4 4 0 0 0-4 4v1a1 1 0 1 1-2 0v-1a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v1a1 1 0 1 1-2 0v-1a4 4 0 0 0-4-4z" fill={fill} opacity={1} data-original="#000000" className /></g></g></svg>
  ),
  chevronDown: ({ fill = "#0f172a", height = 18, width = 18 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chevronRight: ({ fill = "#0f172a", height = 18, width = 18 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  menu: ({ fill = "#0f172a", height = 22, width = 22 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6H20M4 12H20M4 18H20"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  close: ({ fill = "#0f172a", height = 22, width = 22 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6L18 18M6 18L18 6"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  dashboard: ({ fill = "#0f172a", height = 20, width = 20 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="7" height="7" rx="2" stroke={fill} strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="2" stroke={fill} strokeWidth="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="2" stroke={fill} strokeWidth="1.8" />
      <rect x="13" y="13" width="7" height="7" rx="2" stroke={fill} strokeWidth="1.8" />
    </svg>
  ),
  users: ({ fill = "#0f172a", height = 20, width = 20 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9" cy="8" r="3" stroke={fill} strokeWidth="1.8" />
      <circle cx="17" cy="9" r="2.5" stroke={fill} strokeWidth="1.8" />
      <path
        d="M4 20C5 17.5 7 16 9.5 16C12 16 14 17.5 15 20"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.5 18C15.2 16.8 16.5 16.1 18 16"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  report: ({ fill = "#0f172a", height = 20, width = 20 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4H14L18 8V20H6V4Z"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 4V8H18"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 13H15M9 17H13"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  shield: ({ fill = "#0f172a", height = 20, width = 20 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3L19 6V12C19 16.5 15.8 19.8 12 21C8.2 19.8 5 16.5 5 12V6L12 3Z"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  settings: ({ fill = "#0f172a", height = 20, width = 20 }) => (
    <svg width={width} height={height} x={0} y={0} viewBox="0 0 32 32" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve" className><g><g data-name="Layer 2"><path d="M29.21 11.84a3.92 3.92 0 0 1-3.09-5.3 1.84 1.84 0 0 0-.55-2.07 14.75 14.75 0 0 0-4.4-2.55 1.85 1.85 0 0 0-2.09.58 3.91 3.91 0 0 1-6.16 0 1.85 1.85 0 0 0-2.09-.58 14.82 14.82 0 0 0-4.1 2.3 1.86 1.86 0 0 0-.58 2.13 3.9 3.9 0 0 1-3.25 5.36 1.85 1.85 0 0 0-1.62 1.49A14.14 14.14 0 0 0 1 16a14.32 14.32 0 0 0 .19 2.35 1.85 1.85 0 0 0 1.63 1.55A3.9 3.9 0 0 1 6 25.41a1.82 1.82 0 0 0 .51 2.18 14.86 14.86 0 0 0 4.36 2.51 2 2 0 0 0 .63.11 1.84 1.84 0 0 0 1.5-.78 3.87 3.87 0 0 1 3.2-1.68 3.92 3.92 0 0 1 3.14 1.58 1.84 1.84 0 0 0 2.16.61 15 15 0 0 0 4-2.39 1.85 1.85 0 0 0 .54-2.11 3.9 3.9 0 0 1 3.13-5.39 1.85 1.85 0 0 0 1.57-1.52A14.5 14.5 0 0 0 31 16a14.35 14.35 0 0 0-.25-2.67 1.83 1.83 0 0 0-1.54-1.49zm-.42 6.24a5.91 5.91 0 0 0-4.65 8 12.69 12.69 0 0 1-3.3 2 5.87 5.87 0 0 0-4.67-2.29 5.94 5.94 0 0 0-4.76 2.43 13.07 13.07 0 0 1-3.58-2.06 5.87 5.87 0 0 0-.29-5.26 5.93 5.93 0 0 0-4.44-2.94A13.67 13.67 0 0 1 3 16a12.28 12.28 0 0 1 .22-2.31 5.9 5.9 0 0 0 4.37-2.82 5.86 5.86 0 0 0 .46-5.14 12.79 12.79 0 0 1 3.37-1.9 5.92 5.92 0 0 0 9.16 0 12.76 12.76 0 0 1 3.63 2.11 5.92 5.92 0 0 0 4.59 7.86A12.77 12.77 0 0 1 29 16a13.46 13.46 0 0 1-.17 2.08z" fill={fill} opacity={1} data-original="#000000" className /><path d="M16 10a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" fill={fill} opacity={1} data-original="#000000" /></g></g></svg>
  ),
  arrowLeft: ({ fill = "#0f172a", height = 20, width = 20 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 6L8 12L14 18"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrowRight: ({ fill = "#0f172a", height = 20, width = 20 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 6L16 12L10 18"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  logout: ({ fill = "#ef4444", height = 20, width = 20 }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 7L20 12L15 17"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12H9"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H13"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  edit: ({ fill = "#0f172a", height = 18, width = 18 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21H7L18.5 9.5L14.5 5.5L3 17V21Z" stroke={fill} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13.5 6.5L17.5 10.5" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20.5 7.5C21.3 6.7 21.3 5.3 20.5 4.5L19.5 3.5C18.7 2.7 17.3 2.7 16.5 3.5L15.5 4.5L19.5 8.5L20.5 7.5Z" stroke={fill} strokeWidth="1.8" />
    </svg>
  ),
  delete: ({ fill = "#ef4444", height = 18, width = 18 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 7V5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5V7" stroke={fill} strokeWidth="1.8" />
      <path d="M18 7L17.2 19C17.1 20.1 16.2 21 15.1 21H8.9C7.8 21 6.9 20.1 6.8 19L6 7" stroke={fill} strokeWidth="1.8" />
      <path d="M10 11V17" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 11V17" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  sidebarHandle: ({ fill = "#0f172a", height = 22, width = 22 }) => (
    <svg height={height} width={width} x={0} y={0} viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve" className><g><path d="M216 420.4c-2.6 2.3-5.9 3.4-9.9 3.4s-10-1.8-18.1-5.4-14.7-8.8-19.8-15.6-7.7-11.8-7.7-15 1.1-6 3.4-8.2l114.5-127L162.2 133c-2.3-2.3-3.4-5-3.4-8.2s2.5-8.3 7.6-15.3 11.7-12.3 19.8-15.9 14.2-5.4 18.1-5.4 7.3 1.3 9.9 4l131 145.1c5.3 5.3 7.9 10 7.9 14.2s-1.9 8.1-5.7 11.9z" fill={fill} opacity={1} data-original="#000000" /></g></svg>),
  community: ({ fill = "#0f172a", height = 20, width = 20 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 20H22V18C22 16.34 20.66 15 19 15C18.1 15 17.29 15.38 16.71 16M17 20H7M17 20V18C17 17.34 16.82 16.72 16.5 16.19M7 20H2V18C2 16.34 3.34 15 5 15C5.9 15 6.71 15.38 7.29 16M7 20V18C7 17.34 7.18 16.72 7.5 16.19M12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12ZM19 12C20.1 12 21 11.1 21 10C21 8.9 20.1 8 19 8C17.9 8 17 8.9 17 10C17 11.1 17.9 12 19 12ZM5 12C6.1 12 7 11.1 7 10C7 8.9 6.1 8 5 8C3.9 8 3 8.9 3 10C3 11.1 3.9 12 5 12ZM16.5 16.19C15.79 14.92 14.5 14 13 14H11C9.5 14 8.21 14.92 7.5 16.19" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  drag: ({ fill = "#323232", width = 18, height = 18, className = "" }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="6" cy="6" r="1.6" fill={fill} />
      <circle cx="6" cy="12" r="1.6" fill={fill} />
      <circle cx="6" cy="18" r="1.6" fill={fill} />
      <circle cx="12" cy="6" r="1.6" fill={fill} />
      <circle cx="12" cy="12" r="1.6" fill={fill} />
      <circle cx="12" cy="18" r="1.6" fill={fill} />
    </svg>
  ),
  back: ({ fill = "#0f172a", width = 18, height = 18, className = "" }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M15 18L9 12L15 6" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: ({ fill = "#0f172a", width = 18, height = 18, className = "" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="11" cy="11" r="7" stroke={fill} strokeWidth="2" />
      <path d="M20 20L17 17" stroke={fill} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  calendar: ({ fill = "#0f172a", width = 18, height = 18, className = "" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke={fill} strokeWidth="2" />
      <path d="M3 9H21M8 3V6M16 3V6" stroke={fill} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  mapPin: ({ fill = "#0f172a", width = 18, height = 18, className = "" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke={fill} strokeWidth="2" />
    </svg>
  ),
  ticket: ({ fill = "#0f172a", width = 22, height = 22, className = "" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
      <path d="M15 6v12" stroke={fill} strokeWidth="2" strokeDasharray="2 2" />
    </svg>
  ),
  seat: ({ fill = "#0f172a", width = 22, height = 22, className = "" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 11V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" stroke={fill} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 11h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 17v3M18 17v3" stroke={fill} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  bolt: ({ fill = "#0f172a", width = 22, height = 22, className = "" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke={fill} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
};

export default svg;
