import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulation de connexion pour les comptes de démonstration (Supabase non configuré)
    const demoAccounts = [
      { email: 'expert@yoon.sn', password: 'expert123', role: 'expert' },
      { email: 'citizen@yoon.sn', password: 'citizen123', role: 'citizen' },
      { email: 'admin@yoon.sn', password: 'admin123', role: 'admin' }
    ];

    const demoAccount = demoAccounts.find(acc => acc.email === email && acc.password === password);

    if (demoAccount) {
      // Simulation de connexion réussie pour les comptes de démonstration
      setError('');
      setLoading(false);
      alert(`✅ Connexion réussie !\n\nBienvenue ${demoAccount.role === 'expert' ? 'Expert' : demoAccount.role === 'admin' ? 'Administrateur' : 'Citoyen'} YOON !`);
      navigate('/home');
      return;
    }

    // Si ce n'est pas un compte de démonstration, essayer Supabase (mais ça échouera car non configuré)
    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError('Email ou mot de passe incorrect. Utilisez les comptes de démonstration.');
        setLoading(false);
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Une erreur est survenue. Utilisez les comptes de démonstration.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-[#6B4C4C]">
            Connexion
          </h1>
          <p className="text-gray-600">
            Accédez à votre espace personnel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4C4C] text-white py-4 rounded-full text-lg font-medium hover:bg-[#5A3E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>



          <p className="text-center text-gray-600">
            Pas encore de compte?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-[#6B4C4C] font-medium hover:underline"
            >
              S'inscrire
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
