import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex items-center justify-center pt-20 pb-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 tracking-wide">
            <span className="text-[#A9B299]">YOO</span>
            <span className="text-[#6B4C4C]">N</span>
          </h1>
          <p className="text-xl text-gray-800 font-medium">
            Dalal ak jamm si
          </p>
        </div>
      </div>

      <div className="px-6 pb-12 space-y-4">
        <div className="bg-[#A9B299] rounded-3xl p-8 mb-8">
          <div className="h-32"></div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#6B4C4C] text-white py-4 rounded-full text-lg font-medium hover:bg-[#5A3E3E] transition-colors"
        >
          Se connecter
        </button>

        <button
          onClick={() => navigate('/register')}
          className="w-full bg-transparent border-2 border-[#A9B299] text-[#6B4C4C] py-4 rounded-full text-lg font-medium hover:bg-[#A9B299] hover:text-white transition-colors"
        >
          S'inscrire
        </button>

        <button
          onClick={() => navigate('/home')}
          className="w-full text-gray-600 py-4 text-base hover:text-gray-800 transition-colors"
        >
          Continuer en tant qu'invité
        </button>
      </div>
    </div>
  );
}
