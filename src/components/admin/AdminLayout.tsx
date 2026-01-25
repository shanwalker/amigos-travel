import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  Users,
  MessageSquare,
  BookOpen,
  Mail,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Search,
  Settings,
  Shield,
  Sparkles,
  Ticket,
  Wand2,
  UserCheck,
  ClipboardList,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Map, label: 'Trips', path: '/admin/trips' },
  { icon: CalendarCheck, label: 'Bookings', path: '/admin/bookings' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: ClipboardList, label: 'All Requests', path: '/admin/all-requests' },
  { icon: Sparkles, label: 'Surprise Requests', path: '/admin/surprise-requests' },
  { icon: Ticket, label: 'Reservations', path: '/admin/reservations' },
  { icon: Wand2, label: 'Custom Requests', path: '/admin/custom-requests' },
  { icon: UserCheck, label: 'Local Buddies', path: '/admin/local-buddies' },
  { icon: MessageSquare, label: 'Testimonials', path: '/admin/testimonials' },
  { icon: BookOpen, label: 'Stories', path: '/admin/stories' },
  { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userInitials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A';

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[hsl(220,20%,10%)]/95 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileOpen(true)}
          className="text-gray-400 hover:text-white hover:bg-white/5"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          <span className="font-bold text-white">Admin</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8 border-2 border-red-500/30">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600 text-white text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[hsl(220,20%,12%)] border-white/10">
            <DropdownMenuLabel className="text-gray-300">Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={() => navigate('/')} className="text-gray-300 focus:bg-white/5 focus:text-white">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Site
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:bg-red-500/10 focus:text-red-300">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/80 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-[hsl(220,20%,10%)] border-r border-white/5 z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-white">Admin Panel</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-64px)]">
                <nav className="p-4 space-y-1">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium',
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-white border border-red-500/30'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5",
                        location.pathname === item.path ? "text-red-400" : ""
                      )} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-[hsl(220,20%,10%)] border-r border-white/5 z-40"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-white text-lg">Admin</span>
                  <p className="text-[10px] text-gray-500 -mt-1">TravelAmigo</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mx-auto">
              <Shield className="h-5 w-5 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-white/5",
              collapsed && "absolute right-2"
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium',
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-white border border-red-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0",
                  location.pathname === item.path ? "text-red-400" : ""
                )} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        {/* User Menu */}
        <div className="p-4 border-t border-white/5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 h-auto py-2 text-gray-300 hover:bg-white/5 hover:text-white',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Avatar className="h-9 w-9 border-2 border-red-500/30">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600 text-white text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-left"
                    >
                      <p className="text-sm font-medium text-white truncate max-w-[140px]">
                        {user?.user_metadata?.full_name || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[140px]">
                        Administrator
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[hsl(220,20%,12%)] border-white/10">
              <DropdownMenuLabel className="text-gray-300">Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={() => navigate('/')} 
                className="text-gray-300 focus:bg-white/5 focus:text-white"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Site
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-400 focus:bg-red-500/10 focus:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 min-h-screen transition-all duration-300',
          'pt-16 lg:pt-0',
          collapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
        )}
      >
        {/* Top Header Bar */}
        <header className="hidden lg:flex h-16 items-center justify-between px-8 border-b border-white/5 bg-[hsl(220,20%,10%)]/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search..." 
                className="w-64 pl-10 h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
