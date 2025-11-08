import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#7B8A52]/5 to-white">
      {/* Header */}
      <div className="h-32"></div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo et titre */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-7xl font-bold tracking-wider">
              <span className="text-[#7B8A52]">YOO</span>
              <span className="text-[#6B4C4C]">N</span>
            </h1>
          </div>
          <p className="text-2xl text-gray-800 font-medium mb-2">
            Dalal ak jamm si
          </p>
          <p className="text-gray-600 text-lg">
            Votre plateforme juridique intelligente
          </p>
        </div>

      </div>

      {/* Boutons */}
      <div className="px-6 pb-8 space-y-4">
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#6B4C4C] text-white py-5 rounded-2xl text-lg font-semibold hover:bg-[#5A3E3E] transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
        >
          Se connecter
        </button>

        <button
          onClick={() => navigate('/register')}
          className="w-full bg-white border-2 border-[#7B8A52] text-[#6B4C4C] py-5 rounded-2xl text-lg font-semibold hover:bg-[#7B8A52] hover:text-white transform hover:scale-[1.02] transition-all duration-200 shadow-md"
        >
          S'inscrire
        </button>

        <button
          onClick={() => navigate('/home')}
          className="w-full text-gray-600 py-4 text-base hover:text-[#6B4C4C] transition-colors font-medium"
        >
          Continuer en tant qu'invité
        </button>
      </div>

      {/* Éléments décoratifs de bas de page */}
      <div className="relative h-16 overflow-hidden">
      </div>
    </div>
  );
}
