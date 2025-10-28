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
      // Pour les citoyens, inscription via Supabase
      try {
        const { error: signUpError } = await signUp(email, password, fullName, role);

        if (signUpError) {
          setError(signUpError.message || 'Erreur lors de l\'inscription');
          setLoading(false);
        } else {
          // Inscription réussie - l'utilisateur sera redirigé automatiquement par Supabase
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col safe-area-top">
      <div className="mobile-padding">
        <button
          onClick={() => navigate(-1)}
          className="p-3 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 touch-target shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 text-[#6B4C4C]" />
        </button>
      </div>

      <div className="flex-1 mobile-container pb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[#6B4C4C]">
              Créer un compte
            </h1>
            <p className="text-gray-600">
              Rejoignez la plateforme juridique du Sénégal
            </p>
          </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  role === 'citizen'
                    ? 'border-[#6B4C4C] bg-[#6B4C4C] text-white'
                    : 'border-gray-300 text-gray-700 hover:border-[#A9B299]'
                }`}
              >
                Citoyen
              </button>
              <button
                type="button"
                onClick={() => setRole('expert')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  role === 'expert'
                    ? 'border-[#6B4C4C] bg-[#6B4C4C] text-white'
                    : 'border-gray-300 text-gray-700 hover:border-[#A9B299]'
                }`}
              >
                Expert
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9B299] focus:border-transparent outline-none"
              placeholder="Votre nom complet"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9B299] focus:border-transparent outline-none"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9B299] focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9B299] focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Message informatif pour les experts */}
          {role === 'expert' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">ℹ️</div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Inscription simplifiée pour experts</p>
                  <p>Vous serez directement redirigé vers notre formulaire d'expert complet pour saisir toutes vos informations professionnelles.</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4C4C] text-white py-4 rounded-full text-lg font-medium hover:bg-[#5A3E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Déjà un compte?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#6B4C4C] font-medium hover:underline"
            >
              Se connecter
            </button>
          </p>
        </form>
        </div>
      </div>
    </div>
  );
}
