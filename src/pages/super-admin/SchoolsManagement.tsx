import React from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  School, 
  Users, 
  CreditCard, 
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Mail,
  Phone
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SchoolsManagement() {
  const [schools, setSchools] = React.useState<any[]>([]);
  const [plans, setPlans] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newSchool, setNewSchool] = React.useState({ nom: '', code_ecole: '', email: '', plan_abonnement: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [schoolsRes, plansRes] = await Promise.all([
        fetch('/api/super-admin/schools', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/super-admin/plans', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (schoolsRes.ok) {
        const data = await schoolsRes.json();
        setSchools(data);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
        if (plansData.length > 0 && !newSchool.plan_abonnement) {
          setNewSchool(prev => ({ ...prev, plan_abonnement: plansData[0].name }));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);


  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.nom) return toast.error("Le nom est obligatoire");

    try {
      const response = await fetch('/api/super-admin/schools', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newSchool)
      });

      if (response.ok) {
        toast.success("École créée avec succès");
        setShowAddModal(false);
        setNewSchool({ nom: '', code_ecole: '', email: '', plan_abonnement: plans.length > 0 ? plans[0].name : 'Standard' });
        fetchData();
      }
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  const filteredSchools = schools.filter(s => 
    s.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code_ecole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Écoles</h1>
          <p className="text-slate-500">Gérez les établissements inscrits et leurs abonnements.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} />
          Nouvelle École
        </button>
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Ajouter une nouvelle école</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSchool} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nom de l'établissement</label>
                <input 
                  autoFocus
                  type="text" 
                  required
                  value={newSchool.nom}
                  onChange={(e) => setNewSchool({...newSchool, nom: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Code École</label>
                <input 
                  type="text" 
                  value={newSchool.code_ecole}
                  onChange={(e) => setNewSchool({...newSchool, code_ecole: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Contact</label>
                <input 
                  type="email" 
                  value={newSchool.email}
                  onChange={(e) => setNewSchool({...newSchool, email: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Plan Initial</label>
                <select 
                  value={newSchool.plan_abonnement}
                  onChange={(e) => setNewSchool({...newSchool, plan_abonnement: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                  {plans.length === 0 && (
                    <>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                      <option value="Gratuit">Gratuit</option>
                    </>
                  )}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700"
                >
                  Créer l'école
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, code ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-slate-50 border-none rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20">
            <option>Tous les plans</option>
            <option>Essai</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">École</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Abonnement</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Utilisateurs / Élèves</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date d'inscription</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSchools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                        {s.nom?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{s.nom}</p>
                        <p className="text-xs text-slate-500 truncate">{s.code_ecole || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase",
                      "bg-indigo-50 text-indigo-600"
                    )}>
                      <CreditCard size={12} />
                      {s.plan_abonnement || 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1" title="Utilisateurs">
                        <Users size={14} className="text-slate-400" />
                        {s.user_count || 0}
                      </span>
                      <span className="flex items-center gap-1" title="Élèves">
                        <School size={14} className="text-slate-400" />
                        {s.student_count || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase",
                      s.statut_abonnement === 'actif' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {s.statut_abonnement === 'actif' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {s.statut_abonnement === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 italic">Accès protégé</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
