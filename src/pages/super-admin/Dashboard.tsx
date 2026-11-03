import React from 'react';
import { 
  Users, 
  School, 
  CreditCard, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const REVENUE_DATA = [
  { name: 'Jan', revenue: 4000, users: 240 },
  { name: 'Feb', revenue: 3000, users: 198 },
  { name: 'Mar', revenue: 2000, users: 980 },
  { name: 'Apr', revenue: 2780, users: 390 },
  { name: 'May', revenue: 1890, users: 480 },
  { name: 'Jun', revenue: 2390, users: 380 },
  { name: 'Jul', revenue: 3490, users: 430 },
];

const PLAN_DISTRIBUTION = [
  { name: 'Essai', value: 400, color: '#94a3b8' },
  { name: 'Standard', value: 300, color: '#10b981' },
  { name: 'Premium', value: 300, color: '#6366f1' },
  { name: 'Enterprise', value: 200, color: '#f59e0b' },
];

export default function SuperAdminDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/super-admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord Super Admin</h1>
          <p className="text-slate-500">Bienvenue dans l'espace de gestion MégafixaEduc SaaS.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="Écoles Actives" 
          value={stats.schoolCount || 0} 
          change="+0" 
          trend="up"
          icon={School}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatsCard 
          title="Utilisateurs Totaux" 
          value={stats.userCount || 0} 
          change="+0" 
          trend="up"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard 
          title="Élèves Inscrits" 
          value={stats.studentCount || 0} 
          change="+0" 
          trend="up"
          icon={Activity}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* User Engagement or something else placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Activité du Système</h3>
          </div>
          <div className="h-80 flex items-center justify-center text-slate-400 font-medium">
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-3 opacity-20" />
              <p>Graphique d'activité bientôt disponible</p>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Grid: Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Activité Récente</h3>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Voir tout</button>
          </div>
          <div className="divide-y divide-slate-50">
            <ActivityItem 
              icon={CheckCircle2}
              title="Ticket résolu"
              description="Problème d'importation d'élèves résolu"
              time="Il y a 1 heure"
              color="bg-blue-50 text-blue-600"
            />
            <ActivityItem 
              icon={Clock}
              title="Nouvel essai"
              description="Complexe Scolaire La Lumière"
              time="Il y a 2 heures"
              color="bg-amber-50 text-amber-600"
            />
          </div>
        </div>

        {/* System Health / Key Metrics Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Santé du Système</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-600 uppercase">Tous les systèmes sont opérationnels</span>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <HealthMetric title="Temps de réponse API" value="42ms" status="excellent" />
            <HealthMetric title="Utilisation stockage" value="1.2 TB / 5 TB" status="good" />
            <HealthMetric title="Inscriptions (24h)" value="14 nouvelles écoles" status="excellent" />
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tickets ouverts</p>
                <p className="text-xl font-bold text-slate-900">24</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alertes sécu</p>
                <p className="text-xl font-bold text-slate-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, trend, icon: Icon, iconColor, iconBg }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl", iconBg)}>
          <Icon size={24} className={iconColor} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, description, time, color }: any) {
  return (
    <div className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
      <div className={cn("p-2 rounded-lg shrink-0", color)}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
        <p className="text-xs text-slate-500 truncate">{description}</p>
      </div>
      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{time}</span>
    </div>
  );
}

function HealthMetric({ title, value, status }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{value}</p>
      </div>
      <div className={cn(
        "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
        status === 'excellent' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
      )}>
        {status}
      </div>
    </div>
  );
}
