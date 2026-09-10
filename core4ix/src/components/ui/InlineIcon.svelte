<script>
  export let name = '';
  export let size = 24;
  export let strokeWidth = 2;
  export let className = '';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  aria-hidden="true"
>
  {#if name === 'rocket'}
    <path d="M5 19c2.5-1 4.5-3 5.5-5.5" />
    <path d="M14 10 9 15l-2-2 5-5c2.5-2.5 5.5-3.5 8-4-0.5 2.5-1.5 5.5-4 8Z" />
    <path d="M9 15H5v-4" />
    <circle cx="15.5" cy="8.5" r="1.2" />
  {:else if name === 'bar-chart-3'}
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20v-4" />
  {:else if name === 'building-2'}
    <path d="M4 20V6l8-3 8 3v14" />
    <path d="M9 9h.01" />
    <path d="M15 9h.01" />
    <path d="M9 13h.01" />
    <path d="M15 13h.01" />
    <path d="M10 20v-3h4v3" />
  {:else if name === 'factory'}
    <path d="M3 21V9l5 3V9l5 3V5l3 2v14Z" />
    <path d="M14 5V3h3v4" />
    <path d="M7 21v-4" />
    <path d="M12 21v-4" />
    <path d="M17 21v-4" />
  {:else if name === 'shield-check'}
    <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z" />
    <path d="m9 12 2 2 4-4" />
  {:else if name === 'lightbulb'}
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M8 14c-1.2-1-2-2.6-2-4.4A6 6 0 0 1 18 9.6c0 1.8-.8 3.4-2 4.4-.7.7-1 1.3-1 2.4h-6c0-1.1-.3-1.7-1-2.4Z" />
  {:else if name === 'scale'}
    <path d="M12 3v18" />
    <path d="M7 6h10" />
    <path d="M5 6 2.5 11h5Z" />
    <path d="M21.5 11 19 6l-2.5 5Z" />
    <path d="M8 21h8" />
  {:else if name === 'users-2'}
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="3" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 4.13a3 3 0 0 1 0 5.74" />
  {:else if name === 'refresh-ccw'}
    <path d="M3 12a9 9 0 0 1 15.5-6.1L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.1L3 16" />
    <path d="M3 21v-5h5" />
  {:else if name === 'book-open-check'}
    <path d="M12 7c-1.7-1.3-4-2-7-2v14c3 0 5.3.7 7 2" />
    <path d="M12 7c1.7-1.3 4-2 7-2v14c-3 0-5.3.7-7 2" />
    <path d="m14.5 11 1.5 1.5 3-3" />
  {:else if name === 'chevron-right'}
    <path d="m9 18 6-6-6-6" />
  {:else if name === 'arrow-right'}
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  {:else if name === 'briefcase-business'}
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  {:else if name === 'clock-3'}
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v4h3.5" />
  {:else if name === 'headphones'}
    <path d="M4 13a8 8 0 0 1 16 0" />
    <rect x="3" y="12" width="4" height="7" rx="2" />
    <rect x="17" y="12" width="4" height="7" rx="2" />
  {:else if name === 'mail'}
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  {:else if name === 'map-pin'}
    <path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  {:else if name === 'message-square-quote'}
    <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    <path d="M9 9h1v3H8V9h1" />
    <path d="M14 9h1v3h-2V9h1" />
  {:else if name === 'phone'}
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.6a2 2 0 0 1-.6 1.8l-1.5 1.5a16 16 0 0 0 7.1 7.1l1.5-1.5a2 2 0 0 1 1.8-.6l2.6.4A2 2 0 0 1 22 16.9Z" />
  {:else if name === 'sparkles'}
    <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
    <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    <path d="m5 14 .7 1.8L7.5 16l-1.8.7L5 18.5l-.7-1.8L2.5 16l1.8-.2L5 14Z" />
  {:else if name === 'workflow'}
    <rect x="3" y="4" width="6" height="6" rx="1.5" />
    <rect x="15" y="4" width="6" height="6" rx="1.5" />
    <rect x="9" y="14" width="6" height="6" rx="1.5" />
    <path d="M9 7h6" />
    <path d="M12 10v4" />
  {:else}
    <circle cx="12" cy="12" r="8" />
  {/if}
</svg>
