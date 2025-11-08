import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'expert' | 'admin'>('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation côté client
    if (!fullName.trim()) {
      setError('Le nom complet est requis');
      return;
    }

    if (!email.trim()) {
      setError('L\'email est requis');
      return;
    }

    if (!email.includes('@')) {
      setError('L\'email doit être valide');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    if (role === 'expert') {
      // Pour les experts, rediriger directement vers le formulaire détaillé sans inscription
      navigate('/expert-registration', {
        state: { email, password, fullName, role }
      });
    } else {
      // Pour les citoyens, inscription locale
      try {
        const { error: signUpError } = await signUp(email, password, fullName, role);

        if (signUpError) {
          setError(signUpError || 'Erreur lors de l\'inscription');
          setLoading(false);
        } else {
          // Inscription réussie - l'utilisateur sera redirigé automatiquement
          alert(`✅ Bienvenue ${fullName} !

Votre compte citoyen a été créé avec succès.
Vous pouvez maintenant accéder à tous les contenus juridiques et contacter des experts.

Bienvenue dans la plateforme YOON !`);
          navigate('/home');
        }
      } catch (error) {
        console.error('Error during citizen signup:', error);
        setError('Une erreur inattendue est survenue. Veuillez réessayer.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#7B8A52]/5 to-white">
      {/* Header avec bouton retour */}
      <div className="h-24 flex items-center px-6">
        
        <div className="relative z-10 p-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-white rounded-full transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-[#6B4C4C]" />
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 px-6 flex flex-col justify-center max-w-md mx-auto w-full py-6">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-wider">
              <span className="text-[#7B8A52]">YOO</span>
              <span className="text-[#6B4C4C]">N</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-[#6B4C4C]">
            Créer un compte
          </h2>
          <p className="text-gray-600 text-lg">
            Rejoignez la plateforme juridique du Sénégal
          </p>
        </div>

        {/* Élément décoratif */}

        {/* Formulaire moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-[#7B8A52]/20">
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-4 rounded-2xl backdrop-blur-sm shadow-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Type de compte
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`py-3.5 px-4 rounded-2xl border-2 font-semibold transition-all duration-200 ${
                    role === 'citizen'
                      ? 'border-[#6B4C4C] bg-[#6B4C4C] text-white shadow-lg transform scale-105'
                      : 'border-[#7B8A52]/30 text-[#6B4C4C] hover:border-[#7B8A52] hover:bg-[#7B8A52]/10'
                  }`}
                >
                  Citoyen
                </button>
                <button
                  type="button"
                  onClick={() => setRole('expert')}
                  className={`py-3.5 px-4 rounded-2xl border-2 font-semibold transition-all duration-200 ${
                    role === 'expert'
                      ? 'border-[#6B4C4C] bg-[#6B4C4C] text-white shadow-lg transform scale-105'
                      : 'border-[#7B8A52]/30 text-[#6B4C4C] hover:border-[#7B8A52] hover:bg-[#7B8A52]/10'
                  }`}
                >
                  Expert
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-5 py-4 border border-[#7B8A52]/30 rounded-2xl focus:ring-2 focus:ring-[#7B8A52] focus:border-[#7B8A52] outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm"
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 border border-[#7B8A52]/30 rounded-2xl focus:ring-2 focus:ring-[#7B8A52] focus:border-[#7B8A52] outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border border-[#7B8A52]/30 rounded-2xl focus:ring-2 focus:ring-[#7B8A52] focus:border-[#7B8A52] outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 py-4 border border-[#7B8A52]/30 rounded-2xl focus:ring-2 focus:ring-[#7B8A52] focus:border-[#7B8A52] outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Message informatif pour les experts */}
            {role === 'expert' && (
              <div className="bg-blue-50/80 border border-blue-200/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-blue-600 mt-0.5">ℹ️</div>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Inscription simplifiée pour experts</p>
                    <p>Vous serez directement redirigé vers notre formulaire d'expert complet pour saisir toutes vos informations professionnelles.</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6B4C4C] text-white py-5 rounded-2xl text-lg font-semibold hover:bg-[#5A3E3E] transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>

            <p className="text-center text-gray-600 pt-4">
              Déjà un compte?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#6B4C4C] font-semibold hover:underline"
              >
                Se connecter
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Éléments décoratifs de bas de page */}
      <div className="relative h-16 overflow-hidden">
      </div>
    </div>
  );
}
