import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  DollarSign, 
  Package, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  Megaphone, 
  Users2, 
  FileText, 
  Wrench,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User as UserIcon,
  Globe,
  Mail,
  Lock,
  History,
  Activity,
  Sparkles
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../contexts/AuthContext';
import { toggleAIAssistant } from '../AIAssistantWidget';
import logo from '../../LOGO_MEGFIXAEDEUC_PRO.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MenuItem {
  title: string;
  icon: any;
  path?: string;
  submenu?: { title: string; path: string }[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Tableau de bord',
    icon: LayoutDashboard,
    submenu: [
      { title: 'Vue d\'ensemble', path: '/super-admin' },
      { title: 'Statistiques', path: '/super-admin/stats' },
      { title: 'Activité récente', path: '/super-admin/activite' },
    ]
  },
  {
    title: 'Utilisateurs & Clients',
    icon: Users,
    submenu: [
      { title: 'Tous les utilisateurs', path: '/super-admin/users' },
      { title: 'Clients (Écoles)', path: '/super-admin/clients' },
      { title: 'Administrateurs', path: '/super-admin/admins' },
      { title: 'Utilisateurs actifs', path: '/super-admin/users/active' },
      { title: 'Utilisateurs inactifs', path: '/super-admin/users/inactive' },
    ]
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    submenu: [
      { title: 'Acquisition', path: '/super-admin/analytics/acquisition' },
      { title: 'Engagement', path: '/super-admin/analytics/engagement' },
      { title: 'Rétention', path: '/super-admin/analytics/retention' },
      { title: 'Churn', path: '/super-admin/analytics/churn' },
      { title: 'Rapports', path: '/super-admin/analytics/reports' },
    ]
  },
  {
    title: 'Configuration Système',
    icon: Settings,
    submenu: [
      { title: 'Configuration App', path: '/super-admin/product/config' },
      { title: 'Notifications', path: '/super-admin/product/notifications' },
      { title: 'Emails automatiques', path: '/super-admin/product/emails' },
      { title: 'Pages publiques', path: '/super-admin/product/pages' },
      { title: 'Maintenance', path: '/super-admin/product/maintenance' },
    ]
  },
  {
    title: 'Support',
    icon: HelpCircle,
    submenu: [
      { title: 'Tickets', path: '/super-admin/support/tickets' },
      { title: 'Conversations', path: '/super-admin/support/chats' },
      { title: 'FAQ', path: '/super-admin/support/faq' },
      { title: 'Base de connaissances', path: '/super-admin/support/kb' },
    ]
  },
  {
    title: 'Marketing',
    icon: Megaphone,
    submenu: [
      { title: 'Campagnes', path: '/super-admin/marketing/campaigns' },
      { title: 'Codes promotionnels', path: '/super-admin/marketing/promos' },
      { title: 'Affiliés', path: '/super-admin/marketing/affiliates' },
    ]
  },
  {
    title: 'Sécurité',
    icon: ShieldCheck,
    submenu: [
      { title: 'Journal d\'activité', path: '/super-admin/security/logs' },
      { title: 'Sessions actives', path: '/super-admin/security/sessions' },
      { title: 'Rôles & permissions', path: '/super-admin/security/permissions' },
    ]
  },
  {
    title: 'Équipe',
    icon: Users2,
    submenu: [
      { title: 'Membres', path: '/super-admin/team' },
      { title: 'Invitations', path: '/super-admin/team/invites' },
    ]
  },
  {
    title: 'Journaux & Rapports',
    icon: FileText,
    submenu: [
      { title: 'Journal système', path: '/super-admin/logs/system' },
      { title: 'Journal financier', path: '/super-admin/logs/finance' },
      { title: 'Export de données', path: '/super-admin/logs/export' },
    ]
  },
  {
    title: 'Paramètres',
    icon: Settings,
    submenu: [
      { title: 'Général', path: '/super-admin/settings' },
      { title: 'Moyens de Paiement', path: '/super-admin/settings/payment' },
      { title: 'Compte Admin', path: '/super-admin/settings/account' },
      { title: 'API & Webhooks', path: '/super-admin/settings/api' },
      { title: 'Intégrations', path: '/super-admin/settings/integrations' },
    ]
  },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title) 
        : [...prev, title]
    );
  };

  const isPathActive = (path: string) => location.pathname === path;
  const isMenuOpen = (title: string) => openMenus.includes(title);

  // Auto-open menu containing current path
  React.useEffect(() => {
    MENU_ITEMS.forEach(item => {
      if (item.submenu?.some(sub => location.pathname === sub.path)) {
        if (!openMenus.includes(item.title)) {
          setOpenMenus(prev => [...prev, item.title]);
        }
      }
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-8" />
              <span className="font-bold text-slate-800 text-sm">Super Admin</span>
            </div>
          ) : (
            <img src={logo} alt="Logo" className="h-8 mx-auto" />
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <nav className="px-2 space-y-1">
            {MENU_ITEMS.map((item) => (
              <div key={item.title}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                        openMenus.includes(item.title) 
                          ? "bg-slate-50 text-indigo-600" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={cn(
                          "shrink-0",
                          openMenus.includes(item.title) ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                        )} />
                        {isSidebarOpen && <span>{item.title}</span>}
                      </div>
                      {isSidebarOpen && (
                        isMenuOpen(item.title) ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {isMenuOpen(item.title) && isSidebarOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-100">
                            {item.submenu.map((sub) => (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                className={cn(
                                  "block px-3 py-1.5 text-xs font-medium rounded-r-lg transition-all",
                                  isPathActive(sub.path)
                                    ? "text-indigo-600 bg-indigo-50 border-l-2 border-indigo-600 -ml-[2px]"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={item.path || '#'}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      isPathActive(item.path || '')
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon size={20} className={cn(
                      "shrink-0",
                      isPathActive(item.path || '') ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    )} />
                    {isSidebarOpen && <span>{item.title}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bouton Assistant IA en dessous des options du menu latéral */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => toggleAIAssistant()}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-primary-700 hover:from-indigo-700 hover:to-primary-800 text-white shadow-sm hover:shadow transition-all group cursor-pointer",
              !isSidebarOpen && "justify-center px-2 py-2"
            )}
            title="Assistant IA MégafixaBot"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/25 group-hover:scale-110 transition-transform">
                <Sparkles size={15} className="text-amber-300" />
              </div>
              {isSidebarOpen && (
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold leading-tight truncate flex items-center gap-1">
                    Assistant IA
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </p>
                  <p className="text-[10px] text-white/80 leading-tight truncate">MégafixaBot 7j/7</p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-white/20 text-white uppercase tracking-wider shrink-0 border border-white/20">
                Ouvrir
              </span>
            )}
          </button>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher une école, un utilisateur, une facture..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <Link to="/super-admin/profile" className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.nom}</p>
                <p className="text-[10px] font-medium text-indigo-600 uppercase mt-1">Super Administrateur</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-indigo-50 group-hover:border-indigo-200 transition-all">
                <UserIcon size={20} />
              </div>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
