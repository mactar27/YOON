import { useState, useEffect } from 'react';
import { Users, FileText, UserCheck, Shield, TrendingUp, Upload, Save, X, BarChart3, MessageSquare, Eye, EyeOff, Activity, Award, Clock, Eye as ViewIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import type { Database } from '../lib/database.types';

type LegalContent = Database['public']['Tables']['legal_content']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type LegalExpert = Database['public']['Tables']['legal_experts']['Row'];
// type ConsultationCase = Database['public']['Tables']['consultation_cases']['Row'];

interface Stats {
  totalUsers: number;
  totalExperts: number;
  totalContent: number;
  totalCases: number;
}

const CATEGORIES = [
  { id: 'loi_penale', label: 'Loi Pénale' },
  { id: 'code_famille', label: 'Code Famille' },
  { id: 'droit_civil', label: 'Droit Civil' },
  { id: 'droit_travail', label: 'Droit du Travail' },
  { id: 'foncier', label: 'Foncier' },
  { id: 'impots', label: 'Impôts' },
  { id: 'assurances', label: 'Assurances' },
  { id: 'environnement', label: 'Environnement' },
  { id: 'constitution', label: 'Constitution' },
  { id: 'procedure_penale', label: 'Procédure Pénale' },
  { id: 'procedure_civile', label: 'Procédure Civile' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'sante', label: 'Santé' },
  { id: 'education', label: 'Éducation' },
  { id: 'electoral', label: 'Électoral' },
  { id: 'presse', label: 'Presse' },
  { id: 'transport', label: 'Transport' },
  { id: 'foret', label: 'Forêt' },
  { id: 'urbanisme', label: 'Urbanisme' },
  { id: 'marches_publics', label: 'Marchés Publics' },
  { id: 'propriete_intellectuelle', label: 'Propriété Intellectuelle' },
  { id: 'securite_sociale', label: 'Sécurité Sociale' },
  { id: 'aviation', label: 'Aviation' },
];

export default function AdminPanel() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalExperts: 0,
    totalContent: 0,
    totalCases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'experts' | 'content' | 'cases'>('dashboard');

  // États pour les différentes sections
  const [contents, setContents] = useState<LegalContent[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [experts, setExperts] = useState<ExpertWithProfile[]>([]);
  // const [cases, setCases] = useState<ConsultationCase[]>([]);

  // États pour la modal de visualisation
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<LegalContent | null>(null);

  // États pour les formulaires
  const [showContentForm, setShowContentForm] = useState(false);
  const [contentFormData, setContentFormData] = useState({
    title: '',
    category: '',
    summary: '',
    content: '',
    language: 'fr',
    tags: [] as string[],
    is_published: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/home');
      return;
    }
    loadStats();
    loadContents();
    loadUsers();
    loadExperts();
    // loadCases();
  }, [profile, navigate]);

  const loadUsers = async () => {
    try {
      console.log('Loading users...');

      // First check if we can access the table
      const { error: testError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('Cannot access user_profiles table:', testError);
        setUsers([]);
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        throw error;
      }

      console.log('Users loaded:', data?.length || 0, 'users');
      console.log('Users data:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const loadExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_experts')
        .select(`
          *,
          user_profiles!inner(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExperts(data || []);
    } catch (error) {
      console.error('Error loading experts:', error);
    }
  };

  interface ExpertWithProfile extends LegalExpert {
    user_profiles: UserProfile;
  }

  // const loadCases = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('consultation_cases')
  //       .select(`
  //         *,
  //         user_profiles!inner(*),
  //         legal_experts(*)
  //       `)
  //       .order('created_at', { ascending: false });

  //     if (error) throw error;
  //     setCases(data || []);
  //   } catch (error) {
  //     console.error('Error loading cases:', error);
  //   }
  // };

  const loadContents = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error loading contents:', error);
    }
  };

  const loadStats = async () => {
    try {
      const [usersRes, expertsRes, contentRes, casesRes] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('legal_experts').select('id', { count: 'exact', head: true }),
        supabase.from('legal_content').select('id', { count: 'exact', head: true }),
        supabase.from('consultation_cases').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalExperts: expertsRes.count || 0,
        totalContent: contentRes.count || 0,
        totalCases: casesRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Users, label: 'Utilisateurs', value: stats.totalUsers, color: 'from-[#6B4C4C] to-[#8A6A6A]', trend: '+12%', description: 'Nouveaux cette semaine' },
    { icon: UserCheck, label: 'Experts', value: stats.totalExperts, color: 'from-[#8A6A6A] to-[#A9B299]', trend: '+3', description: 'Experts actifs' },
    { icon: FileText, label: 'Contenus', value: stats.totalContent, color: 'from-[#A9B299] to-[#C4D4B0]', trend: '+8', description: 'Documents publiés' },
    { icon: TrendingUp, label: 'Cas juridiques', value: stats.totalCases, color: 'from-[#C4D4B0] to-[#E8F5E8]', trend: '+15%', description: 'Cette semaine' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Veuillez sélectionner un fichier PDF valide.');
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log('Submitting content:', contentFormData);

      // Créer le contenu dans la base de données
      const { data, error } = await supabase
        .from('legal_content')
        .insert({
          title: contentFormData.title,
          category: contentFormData.category,
          summary: contentFormData.summary,
          content: contentFormData.content,
          language: contentFormData.language,
          tags: contentFormData.tags,
          is_published: contentFormData.is_published
        })
        .select();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      console.log('Content inserted successfully:', data);

      // Reset form
      setContentFormData({
        title: '',
        category: '',
        summary: '',
        content: '',
        language: 'fr',
        tags: [],
        is_published: false
      });
      setSelectedFile(null);
      setShowContentForm(false);
      loadContents();

      alert('Contenu ajouté avec succès !');
    } catch (error) {
      console.error('Error submitting content:', error);
      alert('Erreur lors de l\'ajout du contenu: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const togglePublish = async (content: LegalContent) => {
    try {
      const { error } = await supabase
        .from('legal_content')
        .update({ is_published: !content.is_published })
        .eq('id', content.id);

      if (error) throw error;
      loadContents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteContent = async (id: string) => {
    // Créer une modal de confirmation stylisée au lieu d'utiliser confirm()
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full border-l-4 border-[#8B4513]">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#8B4513] bg-opacity-10 flex items-center justify-center">
              <span class="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Suppression définitive</h3>
              <p class="text-sm text-gray-600">Cette action est irréversible</p>
            </div>
          </div>

          <div class="mb-6">
            <p class="text-gray-700 mb-3">Vous êtes sur le point de supprimer définitivement ce document. Cette action entraînera :</p>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• La perte permanente du contenu juridique</li>
              <li>• La suppression de toutes les métadonnées</li>
              <li>• La révocation de l'accès pour tous les utilisateurs</li>
              <li>• La perte des statistiques de consultation</li>
            </ul>
          </div>

          <div class="flex gap-3">
            <button id="cancel-btn" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button id="confirm-btn" class="flex-1 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors">
              Continuer
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    return new Promise<void>((resolve) => {
      const cancelBtn = modal.querySelector('#cancel-btn') as HTMLButtonElement;
      const confirmBtn = modal.querySelector('#confirm-btn') as HTMLButtonElement;

      cancelBtn.onclick = () => {
        document.body.removeChild(modal);
        resolve();
      };

      confirmBtn.onclick = () => {
        document.body.removeChild(modal);
        showSecondConfirmation(id);
      };
    });
  };

  const showSecondConfirmation = async (id: string) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full border-l-4 border-red-500">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span class="text-2xl">🚨</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Dernière confirmation</h3>
              <p class="text-sm text-gray-600">Action définitive et irréversible</p>
            </div>
          </div>

          <div class="mb-6">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p class="text-red-800 font-medium mb-2">⚠️ ATTENTION CRITIQUE</p>
              <p class="text-red-700 text-sm">Cette action est :</p>
              <ul class="text-red-700 text-sm mt-2 space-y-1">
                <li>• <strong>IRRÉVERSIBLE</strong></li>
                <li>• <strong>DÉFINITIVE</strong></li>
                <li>• <strong>SANS RETOUR POSSIBLE</strong></li>
              </ul>
            </div>
            <p class="text-gray-700 text-sm">Tous les utilisateurs perdront définitivement l'accès à ce document.</p>
          </div>

          <div class="flex gap-3">
            <button id="cancel-btn" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button id="confirm-btn" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    return new Promise<void>((resolve) => {
      const cancelBtn = modal.querySelector('#cancel-btn') as HTMLButtonElement;
      const confirmBtn = modal.querySelector('#confirm-btn') as HTMLButtonElement;

      cancelBtn.onclick = () => {
        document.body.removeChild(modal);
        resolve();
      };

      confirmBtn.onclick = async () => {
        document.body.removeChild(modal);

        try {
          const { error } = await supabase
            .from('legal_content')
            .delete()
            .eq('id', id);

          if (error) throw error;

          // Fermer la modal si elle était ouverte pour ce document
          if (selectedDocument?.id === id) {
            setShowDocumentModal(false);
            setSelectedDocument(null);
          }

          loadContents();
          loadStats();

          // Notification de succès stylisée
          showSuccessNotification();
        } catch (error) {
          console.error('Error:', error);
          showErrorNotification(error);
        }
      };
    });
  };

  const showSuccessNotification = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full border-l-4 border-green-500">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span class="text-2xl">✅</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Suppression réussie</h3>
              <p class="text-sm text-gray-600">Le document a été supprimé définitivement</p>
            </div>
          </div>

          <div class="mb-6">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-green-800 font-medium mb-2">Opération effectuée avec succès</p>
              <ul class="text-green-700 text-sm space-y-1">
                <li>• ✅ Base de données nettoyée</li>
                <li>• ✅ Accès utilisateur révoqué</li>
                <li>• ✅ Statistiques mises à jour</li>
              </ul>
            </div>
          </div>

          <div class="flex justify-end">
            <button id="close-btn" class="px-6 py-2 bg-[#6B4C4C] text-white rounded-lg hover:bg-[#5A3E3E] transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#close-btn') as HTMLButtonElement;
    closeBtn.onclick = () => {
      document.body.removeChild(modal);
    };

    // Auto-fermeture après 3 secondes
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 3000);
  };

  const showErrorNotification = (error: any) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full border-l-4 border-red-500">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span class="text-2xl">❌</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Erreur de suppression</h3>
              <p class="text-sm text-gray-600">Une erreur inattendue s'est produite</p>
            </div>
          </div>

          <div class="mb-6">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-800 font-medium mb-2">Problème détecté</p>
              <ul class="text-red-700 text-sm space-y-1">
                <li>• ❌ Le document n'a pas été supprimé</li>
                <li>• ❌ Veuillez réessayer l'opération</li>
                <li>• ❌ Contactez l'administrateur si le problème persiste</li>
              </ul>
            </div>
            <details class="mt-3">
              <summary class="text-xs text-gray-500 cursor-pointer">Détails techniques</summary>
              <pre class="text-xs text-gray-600 mt-2 bg-gray-100 p-2 rounded overflow-x-auto">${error}</pre>
            </details>
          </div>

          <div class="flex justify-end">
            <button id="close-btn" class="px-6 py-2 bg-[#6B4C4C] text-white rounded-lg hover:bg-[#5A3E3E] transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#close-btn') as HTMLButtonElement;
    closeBtn.onclick = () => {
      document.body.removeChild(modal);
    };
  };

  const toggleExpertVerification = async (expert: ExpertWithProfile) => {
    try {
      const { error } = await supabase
        .from('legal_experts')
        .update({ is_verified: !expert.is_verified })
        .eq('id', expert.id);

      if (error) throw error;
      loadExperts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleExpertAvailability = async (expert: ExpertWithProfile) => {
    try {
      const { error } = await supabase
        .from('legal_experts')
        .update({ is_available: !expert.is_available })
        .eq('id', expert.id);

      if (error) throw error;
      loadExperts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteExpert = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet expert ?')) return;

    try {
      const { error } = await supabase
        .from('legal_experts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadExperts();
      loadStats();
    } catch (error) {
      console.error('Error:', error);
    }
  };


  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="bg-gradient-to-br from-[#6B4C4C] to-[#8A6A6A] px-6 py-10 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Shield className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-1">Administration</h1>
                <p className="text-lg opacity-90">Panneau de contrôle de la plateforme juridique</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Session active</p>
              <p className="text-lg font-semibold">{profile?.full_name || 'Administrateur'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Navigation par onglets */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-8 py-5 font-semibold text-sm border-b-3 transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'dashboard'
                    ? 'border-[#6B4C4C] text-[#6B4C4C] bg-[#6B4C4C] bg-opacity-5'
                    : 'border-transparent text-gray-600 hover:text-[#6B4C4C] hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-8 py-5 font-semibold text-sm border-b-3 transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'users'
                    ? 'border-[#6B4C4C] text-[#6B4C4C] bg-[#6B4C4C] bg-opacity-5'
                    : 'border-transparent text-gray-600 hover:text-[#6B4C4C] hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4" />
                Utilisateurs
              </button>
              <button
                onClick={() => setActiveTab('experts')}
                className={`px-8 py-5 font-semibold text-sm border-b-3 transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'experts'
                    ? 'border-[#6B4C4C] text-[#6B4C4C] bg-[#6B4C4C] bg-opacity-5'
                    : 'border-transparent text-gray-600 hover:text-[#6B4C4C] hover:bg-gray-50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Experts
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-8 py-5 font-semibold text-sm border-b-3 transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'content'
                    ? 'border-[#6B4C4C] text-[#6B4C4C] bg-[#6B4C4C] bg-opacity-5'
                    : 'border-transparent text-gray-600 hover:text-[#6B4C4C] hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                Contenus
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`px-8 py-5 font-semibold text-sm border-b-3 transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'cases'
                    ? 'border-[#6B4C4C] text-[#6B4C4C] bg-[#6B4C4C] bg-opacity-5'
                    : 'border-transparent text-gray-600 hover:text-[#6B4C4C] hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Cas
              </button>
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'dashboard' && (
          <>
            {/* Section d'accueil du dashboard */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-[#6B4C4C]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue dans votre tableau de bord</h2>
                  <p className="text-gray-600">Aperçu général de votre plateforme juridique</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Dernière mise à jour</p>
                  <p className="text-lg font-semibold text-[#6B4C4C]">{new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl h-32 animate-pulse shadow-sm"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <card.icon className="w-8 h-8 opacity-90" />
                      <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">
                        {card.trend}
                      </span>
                    </div>
                    <p className="text-3xl font-bold mb-2">{card.value}</p>
                    <p className="text-sm opacity-90 mb-1">{card.label}</p>
                    <p className="text-xs opacity-75">{card.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Section des activités récentes */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Activités récentes */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-[#6B4C4C]" />
                  <h3 className="text-lg font-semibold text-gray-800">Activités récentes</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Nouveau contenu ajouté</p>
                      <p className="text-xs text-gray-500">Code de la famille - il y a 2h</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Expert validé</p>
                      <p className="text-xs text-gray-500">Marie Dupont - il y a 4h</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Nouveau cas juridique</p>
                      <p className="text-xs text-gray-500">Droit du travail - il y a 6h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-[#6B4C4C]" />
                  <h3 className="text-lg font-semibold text-gray-800">Aperçu rapide</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#6B4C4C] bg-opacity-10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-[#6B4C4C]" />
                      <span className="text-sm font-medium text-gray-700">Taux de validation</span>
                    </div>
                    <span className="text-lg font-bold text-[#6B4C4C]">94%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#A9B299] bg-opacity-10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#A9B299]" />
                      <span className="text-sm font-medium text-gray-700">Temps moyen</span>
                    </div>
                    <span className="text-lg font-bold text-[#A9B299]">2.3j</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#C4D4B0] bg-opacity-10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-[#C4D4B0]" />
                      <span className="text-sm font-medium text-gray-700">Satisfaction</span>
                    </div>
                    <span className="text-lg font-bold text-[#C4D4B0]">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h2>
                  <p className="text-gray-600 mt-1">Administration des comptes utilisateur</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-[#6B4C4C] bg-opacity-10 text-[#6B4C4C] rounded-lg font-medium">
                    {users.length} utilisateurs
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              {loading ? (
                <div className="animate-pulse space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun utilisateur trouvé</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Les utilisateurs apparaîtront ici une fois qu'ils se seront inscrits sur la plateforme.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {users.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-[#6B4C4C] hover:border-opacity-20">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B4C4C] to-[#8A6A6A] flex items-center justify-center text-white font-bold text-lg">
                            {user.full_name?.charAt(0).toUpperCase() || user.id.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {user.full_name || 'Utilisateur sans nom'}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                user.role === 'admin'
                                  ? 'bg-red-100 text-red-800'
                                  : user.role === 'expert'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role === 'admin' ? 'Administrateur' : user.role === 'expert' ? 'Expert' : 'Citoyen'}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.is_active ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              ID: {user.id}
                            </p>
                            {user.phone && (
                              <p className="text-sm text-gray-700 mb-1">
                                <span className="font-medium">Téléphone:</span> {user.phone}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                              {user.updated_at !== user.created_at && (
                                <span>Mis à jour le {new Date(user.updated_at).toLocaleDateString('fr-FR')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {/* TODO: Implement user edit */}}
                            className="px-4 py-2 bg-[#6B4C4C] text-white rounded-lg text-sm font-medium hover:bg-[#5A3E3E] transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => {/* TODO: Implement user status toggle */}}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              user.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {user.is_active ? 'Actif' : 'Inactif'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'experts' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestion des experts</h2>
                  <p className="text-gray-600 mt-1">
                    Validez les demandes d'inscription des experts juridiques
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                    {experts.filter(e => e.is_verified).length} vérifiés
                  </div>
                  <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
                    {experts.filter(e => !e.is_verified).length} en attente
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              {loading ? (
                <div className="animate-pulse space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              ) : experts.length === 0 ? (
                <div className="text-center py-16">
                  <UserCheck className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun expert trouvé</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Les nouvelles demandes d'inscription des experts juridiques apparaîtront ici
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {experts.map((expert) => (
                    <div key={expert.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-[#6B4C4C] hover:border-opacity-20">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B4C4C] to-[#8A6A6A] flex items-center justify-center text-white font-bold text-lg">
                            {expert.user_profiles?.full_name?.charAt(0).toUpperCase() || 'E'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {expert.user_profiles?.full_name || 'Expert sans nom'}
                              </h3>
                              {expert.is_verified ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  Vérifié
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                                  <EyeOff className="w-3 h-3" />
                                  En attente
                                </span>
                              )}
                              {expert.is_available ? (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Disponible
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                  Indisponible
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {expert.bio || 'Aucune biographie disponible'}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {expert.specialties?.slice(0, 3).map((specialty, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-[#A9B299] bg-opacity-20 text-[#6B4C4C] text-xs rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                              {expert.specialties && expert.specialties.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{expert.specialties.length - 3}
                                </span>
                              )}
                            </div>
                            {expert.consultation_fee && (
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Tarif:</span> {expert.consultation_fee.toLocaleString()} FCFA
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Inscrit le {new Date(expert.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!expert.is_verified && (
                            <button
                              onClick={() => toggleExpertVerification(expert)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <UserCheck className="w-4 h-4" />
                              Valider
                            </button>
                          )}
                          <button
                            onClick={() => toggleExpertAvailability(expert)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              expert.is_available
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {expert.is_available ? 'Disponible' : 'Indisponible'}
                          </button>
                          <button
                            onClick={() => deleteExpert(expert.id)}
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <>
            {/* Bouton d'ajout rapide */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/admin/add-document')}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#6B4C4C] to-[#8A6A6A] text-white rounded-xl hover:from-[#5A3E3E] hover:to-[#7A5A5A] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Upload className="w-5 h-5" />
                <span className="font-semibold">Ajouter un document</span>
              </button>
            </div>

            {/* Liste des contenus */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des contenus</h2>
                    <p className="text-gray-600 mt-1">Administration des documents juridiques</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                      {contents.filter(c => c.is_published).length} publiés
                    </div>
                    <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium">
                      {contents.filter(c => !c.is_published).length} brouillons
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-8">
                  <div className="animate-pulse space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              ) : contents.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun contenu trouvé</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Commencez par ajouter votre premier document juridique
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {contents.map((content) => (
                    <div key={content.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900">{content.title}</h3>
                            <p className="text-sm text-gray-500">
                              {CATEGORIES.find(c => c.id === content.category)?.label} •
                              {content.is_published ? 'Publié' : 'Brouillon'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              // Ouvrir le document dans un nouvel onglet
                              // Pour l'instant, on ouvre toujours la modal car file_url n'existe pas encore dans le schéma
                              setSelectedDocument(content);
                              setShowDocumentModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir le document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => togglePublish(content)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              content.is_published
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {content.is_published ? 'Publié' : 'Brouillon'}
                          </button>

                          <button
                            onClick={() => deleteContent(content.id)}
                            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg text-sm font-medium hover:bg-[#A0522D] transition-colors"
                          >
                            Supprimer définitivement
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'cases' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestion des cas juridiques</h2>
                  <p className="text-gray-600 mt-1">Suivi et gestion des consultations</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-[#6B4C4C] bg-opacity-10 text-[#6B4C4C] rounded-lg font-medium">
                    {stats.totalCases} cas actifs
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="text-center py-16">
                <TrendingUp className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Fonctionnalité en développement</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Le système de gestion des cas juridiques permettra de suivre les consultations, assigner des experts et gérer les paiements.
                </p>
                <div className="mt-6 flex justify-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#6B4C4C]">{stats.totalCases}</div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{Math.floor(stats.totalCases * 0.6)}</div>
                    <div className="text-sm text-gray-500">En cours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{Math.floor(stats.totalCases * 0.35)}</div>
                    <div className="text-sm text-gray-500">Résolus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{Math.floor(stats.totalCases * 0.05)}</div>
                    <div className="text-sm text-gray-500">En attente</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de visualisation du document */}
        {showDocumentModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedDocument.title}</h2>
                  <p className="text-gray-600 mt-1">
                    {CATEGORIES.find(c => c.id === selectedDocument.category)?.label} •
                    {selectedDocument.is_published ? 'Publié' : 'Brouillon'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDocumentModal(false);
                    setSelectedDocument(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Bouton pour ouvrir le PDF si disponible */}
                <div className="mb-6 flex gap-4">
                  <button
                    onClick={() => {
                      // Ouvrir le PDF directement depuis le dossier public
                      // Utiliser les noms de fichiers exacts du dossier public
                      const fileMap: { [key: string]: string } = {
                        'CIMA Code assurances': 'CIMA-Code-assurances.pdf',
                        'CODE DE LA FAMILLE': 'CODE-DE-LA-FAMILLE.pdf',
                        'code foncier': 'code-foncier.pdf',
                        'code general des impots 2013': 'code-general-des-impots-2013.pdf',
                        'code du travail': 'codedutravail.pdf',
                        'code penal': 'codepenal.pdf',
                        'Senegal Civil & Commercial Obligations Code': 'Senegal Civil & Commercial Obligations Code.pdf',
                        'Senegal Code 2001 environnement': 'Senegal-Code-2001-environnement.pdf'
                      };

                      const pdfName = fileMap[selectedDocument.title] || `${selectedDocument.title.toLowerCase().replace(/\s+/g, '_')}.pdf`;
                      const pdfPath = `/${pdfName}`;
                      console.log('Tentative d\'ouverture:', pdfPath);
                      window.open(pdfPath, '_blank');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#6B4C4C] text-white rounded-lg hover:bg-[#5A3E3E] transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Ouvrir le PDF complet
                  </button>
                  <button
                    onClick={() => {
                      // Télécharger le PDF
                      const fileMap: { [key: string]: string } = {
                        'CIMA Code assurances': 'CIMA-Code-assurances.pdf',
                        'CODE DE LA FAMILLE': 'CODE-DE-LA-FAMILLE.pdf',
                        'code foncier': 'code-foncier.pdf',
                        'code general des impots 2013': 'code-general-des-impots-2013.pdf',
                        'code du travail': 'codedutravail.pdf',
                        'code penal': 'codepenal.pdf',
                        'Senegal Civil & Commercial Obligations Code': 'Senegal Civil & Commercial Obligations Code.pdf',
                        'Senegal Code 2001 environnement': 'Senegal-Code-2001-environnement.pdf'
                      };

                      const pdfName = fileMap[selectedDocument.title] || `${selectedDocument.title.toLowerCase().replace(/\s+/g, '_')}.pdf`;
                      const link = document.createElement('a');
                      link.href = `/${pdfName}`;
                      link.download = `${selectedDocument.title}.pdf`;
                      console.log('Tentative de téléchargement:', link.href);
                      link.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-[#6B4C4C] text-[#6B4C4C] rounded-lg hover:bg-[#6B4C4C] hover:text-white transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Télécharger
                  </button>
                </div>

                {selectedDocument.summary && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Résumé</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedDocument.summary}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Contenu complet</h3>
                  <div className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap border-l-4 border-[#6B4C4C]">
                    {selectedDocument.content || 'Aucun contenu disponible.'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Langue:</span> {selectedDocument.language === 'fr' ? 'Français' : selectedDocument.language}
                  </div>
                  <div>
                    <span className="font-medium">Créé le:</span> {new Date(selectedDocument.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  <div>
                    <span className="font-medium">Statut:</span> {selectedDocument.is_published ? 'Publié' : 'Brouillon'}
                  </div>
                  <div>
                    <span className="font-medium">Vues:</span> {selectedDocument.views_count || 0}
                  </div>
                  {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedDocument.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-[#A9B299] bg-opacity-20 text-[#6B4C4C] text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'ajout de contenu */}
        {showContentForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Ajouter un nouveau document</h2>
                <p className="text-gray-600 mt-1">Remplissez les informations du document juridique</p>
              </div>
              <button
                onClick={() => setShowContentForm(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleContentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={contentFormData.title}
                    onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                    placeholder="Titre du document"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={contentFormData.category}
                    onChange={(e) => setContentFormData({ ...contentFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Résumé
                </label>
                <textarea
                  value={contentFormData.summary}
                  onChange={(e) => setContentFormData({ ...contentFormData, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                  rows={3}
                  placeholder="Résumé du document"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu complet
                </label>
                <textarea
                  value={contentFormData.content}
                  onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                  rows={5}
                  placeholder="Contenu complet du document"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier PDF
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4C4C] focus:border-transparent"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Fichier sélectionné : {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contentFormData.is_published}
                    onChange={(e) => setContentFormData({ ...contentFormData, is_published: e.target.checked })}
                    className="rounded border-gray-300 text-[#6B4C4C] focus:ring-[#6B4C4C]"
                  />
                  <span className="text-sm text-gray-700">Publier immédiatement</span>
                </label>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#6B4C4C] to-[#8A6A6A] text-white rounded-xl hover:from-[#5A3E3E] hover:to-[#7A5A5A] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {uploading ? 'Enregistrement...' : 'Enregistrer le document'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowContentForm(false)}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}


      </div>
    </div>
  );
}
