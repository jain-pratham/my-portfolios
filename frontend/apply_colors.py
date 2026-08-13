import re

# Fix page.tsx
with open('app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    page_content = f.read()

page_content = page_content.replace(
    '<div className="flex-1 flex flex-col min-w-0 overflow-hidden">',
    '<div className={lex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 }>'
)

with open('app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_content)

# Fix Sidebar.tsx
with open('components/layout/Sidebar.tsx', 'r', encoding='utf-8') as f:
    sidebar_content = f.read()

sidebar_content = sidebar_content.replace(
    '"sa-sidebar fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-out lg:translate-x-0 lg:z-20 font-sans antialiased",',
    '"sa-sidebar fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-out lg:translate-x-0 lg:z-20 font-sans antialiased",\n        "bg-[var(--sidebar-background)] dark:bg-gradient-to-b dark:from-[#0A0B0E] dark:via-[#050608] dark:to-black border-r border-[var(--sidebar-border)] shadow-[4px_0_24px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.8)]",'
)

sidebar_content = sidebar_content.replace('text-white/70', 'text-sidebar-foreground/70 dark:text-white/70')
sidebar_content = sidebar_content.replace('text-white/75', 'text-sidebar-foreground/75 dark:text-white/75')
sidebar_content = sidebar_content.replace('text-white/60', 'text-sidebar-foreground/60 dark:text-white/60')
sidebar_content = sidebar_content.replace('text-white/50', 'text-sidebar-foreground/50 dark:text-white/50')
sidebar_content = sidebar_content.replace('text-white', 'text-sidebar-foreground dark:text-white')
sidebar_content = sidebar_content.replace('border-white/15', 'border-sidebar-foreground/15 dark:border-white/15')
sidebar_content = sidebar_content.replace('border-white/25', 'border-sidebar-foreground/25 dark:border-white/25')
sidebar_content = sidebar_content.replace('border-white/10', 'border-sidebar-foreground/10 dark:border-white/10')
sidebar_content = sidebar_content.replace('bg-white/10', 'bg-sidebar-foreground/10 dark:bg-white/10')
sidebar_content = sidebar_content.replace('bg-white/15', 'bg-sidebar-foreground/15 dark:bg-white/15')
sidebar_content = sidebar_content.replace('bg-white/5', 'bg-sidebar-foreground/5 dark:bg-white/5')
sidebar_content = sidebar_content.replace('bg-white/40', 'bg-sidebar-foreground/40 dark:bg-white/40')
sidebar_content = sidebar_content.replace('ring-white/40', 'ring-sidebar-foreground/40 dark:ring-white/40')

# Also fix brand colors
sidebar_content = sidebar_content.replace('var(--color-accent)', 'var(--primary)')
sidebar_content = sidebar_content.replace('var(--color-secondary)', 'var(--primary)')

with open('components/layout/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(sidebar_content)

print("Colors and layout adjusted!")
