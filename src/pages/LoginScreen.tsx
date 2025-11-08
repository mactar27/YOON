import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../contexts/AuthContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { signIn, profile, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // useEffect pour rediriger après connexion
  useEffect(() => {
    if (user && profile) {
      // Afficher le message de bienvenue
      alert(`Connexion réussie !\n\nBienvenue ${profile.role === 'expert' ? 'Expert' : profile.role === 'admin' ? 'Administrateur' : 'Citoyen'} YOON !`);
      
      // Redirection basée sur le rôle
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [user, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Debug: Afficher les données saisies
    console.log('Tentative de connexion:', { email, password });

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(`Email ou mot de passe incorrect. Comptes disponibles:\n- Admin: admin@yoon.sn / admin123\n- Expert: expert@yoon.sn / expert123\n- Citoyen: citizen@yoon.sn / citizen123`);
        setLoading(false);
      } else {
        // La redirection se fait via useEffect
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Une erreur est survenue. Utilisez les comptes de démonstration.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#A9B299]/5 to-white">
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
      <div className="flex-1 px-6 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Logo et titre */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold tracking-wider">
              <span className="text-[#A9B299]">YOO</span>
              <span className="text-[#6B4C4C]">N</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-[#6B4C4C]">
            Connexion
          </h2>
          <p className="text-gray-600 text-lg">
            Accédez à votre espace personnel
          </p>
        </div>

        {/* Élément décoratif */}

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-4 rounded-2xl backdrop-blur-sm shadow-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm"
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
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4C4C] text-white py-5 rounded-2xl text-lg font-semibold hover:bg-[#5A3E3E] transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="text-center text-gray-600 pt-4">
            Pas encore de compte?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-[#6B4C4C] font-semibold hover:underline"
            >
              S'inscrire
            </button>
          </p>
        </form>
      </div>

      {/* Éléments décoratifs de bas de page */}
      <div className="relative h-16 overflow-hidden">
      </div>
    </div>
  );
}
