import re

with open('C:/Projects/AI_ML/CoreWatch/frontend/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports
content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter, useSearchParams } from 'next/navigation';\nimport Sidebar, { NavItem } from '../../components/layout/Sidebar';\nimport { LayoutDashboard, Users, UserPlus, Settings, CreditCard, Video, History, UserCircle, Bell, Eye, ArrowUpCircle } from 'lucide-react';")

# 2. Add NAVIGATION_ITEMS outside the component
nav_items = """
const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard?tab=dashboard', icon: LayoutDashboard, roles: ['admin', 'user', 'demo'] },
  { label: 'Customers', href: '/dashboard?tab=customers', icon: Users, roles: ['admin'], children: [
    { label: 'All Customers', href: '/dashboard?tab=customers' },
    { label: 'Add Customer', href: '/dashboard?tab=add_customer' }
  ]},
  { label: 'Settings', href: '/dashboard?tab=settings', icon: Settings, roles: ['admin', 'user'] },
  { label: 'Subscription', href: '/dashboard?tab=subscription', icon: CreditCard, roles: ['admin'] },
  { label: 'Live Camera', href: '/dashboard?tab=live_camera', icon: Video, roles: ['user'] },
  { label: 'Subscription Detail', href: '/dashboard?tab=subscription_detail', icon: CreditCard, roles: ['user'] },
  { label: 'Event History', href: '/dashboard?tab=event_history', icon: History, roles: ['user'] },
  { label: 'Profile', href: '/dashboard?tab=profile', icon: UserCircle, roles: ['user'] },
  { label: 'Notification', href: '/dashboard?tab=notification', icon: Bell, roles: ['user'] },
  { label: 'Demo Overview', href: '/dashboard?tab=demo_overview', icon: Eye, roles: ['demo'] },
  { label: 'Upgrade Account', href: '/dashboard?tab=upgrade_account', icon: ArrowUpCircle, roles: ['demo'] },
];

export default function DashboardPage() {"""
content = content.replace("export default function DashboardPage() {", nav_items)

# 3. Add useSearchParams logic
search_params_logic = """
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get('tab');
"""
content = content.replace("  const router = useRouter();", search_params_logic)

content = content.replace("const [activeTab, setActiveTab] = useState<string>('dashboard');", "const [activeTab, setActiveTab] = useState<string>(urlTab || 'dashboard');\n\n  useEffect(() => {\n    if (urlTab) setActiveTab(urlTab);\n  }, [urlTab]);")

# 4. Remove old renderSidebar
content = re.sub(r'const renderSidebar =.*?};\n\n    return \(\n      <div className="h-full flex flex-col justify-between select-none">', 'return (\n      <div className="h-full flex flex-col justify-between select-none">', content, flags=re.DOTALL)

# 5. Remove old aside elements and replace with Sidebar
sidebar_component = """
      <Sidebar
        items={NAVIGATION_ITEMS}
        user={{ firstName: user?.name, email: user?.email, role: currentRole }}
        logoIcon={LayoutDashboard}
        logoTitle="COREWATCH"
        logoSubtitle="Control Center"
        profileHref="/dashboard?tab=profile"
        changePasswordHref="/dashboard?tab=profile"
        twoFactorHref="/dashboard?tab=profile"
        mobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        onLogout={handleLogout}
      />
"""
content = re.sub(r'\{/\* Mobile Drawer Aside \*/\}.*?\{/\* ========================================================================= \*/\}', sidebar_component + '      {/* ========================================================================= */}', content, flags=re.DOTALL)

with open('C:/Projects/AI_ML/CoreWatch/frontend/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
