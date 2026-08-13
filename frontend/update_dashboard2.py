import re

with open('C:/Projects/AI_ML/CoreWatch/frontend/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False

nav_items = """
import Sidebar, { NavItem } from '../../components/layout/Sidebar';
import { LayoutDashboard, Users, UserPlus, Settings, CreditCard, Video, History, UserCircle, Bell, Eye, ArrowUpCircle } from 'lucide-react';

const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard?tab=dashboard', icon: LayoutDashboard, roles: ['admin', 'user', 'demo'] },
  { label: 'Customers', href: '/dashboard?tab=customers', icon: Users, roles: ['admin'], children: [
    { label: 'All Customers', href: '/dashboard?tab=customers', icon: Users },
    { label: 'Add Customer', href: '/dashboard?tab=add_customer', icon: UserPlus }
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
"""

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

i = 0
while i < len(lines):
    line = lines[i]
    
    if "import { useRouter } from 'next/navigation';" in line:
        new_lines.append("import { useRouter, useSearchParams } from 'next/navigation';\n")
        i += 1
        continue
        
    if "export default function DashboardPage() {" in line:
        new_lines.append(nav_items)
        new_lines.append(line)
        i += 1
        continue

    if "  const router = useRouter();" in line:
        new_lines.append(line)
        new_lines.append("  const searchParams = useSearchParams();\n")
        new_lines.append("  const urlTab = searchParams.get('tab');\n")
        i += 1
        continue
        
    if "const [activeTab, setActiveTab] = useState<string>('dashboard');" in line:
        new_lines.append("  const [activeTab, setActiveTab] = useState<string>(urlTab || 'dashboard');\n\n  useEffect(() => {\n    if (urlTab) setActiveTab(urlTab);\n  }, [urlTab]);\n")
        i += 1
        continue
        
    if "const renderSidebar = (isMobile: boolean) => {" in line:
        # Skip until we find "  return ("
        while i < len(lines) and "  return (" not in lines[i]:
            i += 1
        continue
        
    if "{/* Mobile Drawer Aside */}" in line:
        new_lines.append(sidebar_component)
        # Skip until we find {/* RIGHT MAIN WORKSPACE AREA */} or the equal signs
        while i < len(lines) and "{/* RIGHT MAIN WORKSPACE AREA */}" not in lines[i]:
            i += 1
        # Now we found RIGHT MAIN WORKSPACE AREA. But we missed the equal signs above it.
        new_lines.append("      {/* ========================================================================= */}\n")
        new_lines.append(lines[i]) # append RIGHT MAIN WORKSPACE AREA
        i += 1
        continue
        
    new_lines.append(line)
    i += 1

with open('C:/Projects/AI_ML/CoreWatch/frontend/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Done!')
