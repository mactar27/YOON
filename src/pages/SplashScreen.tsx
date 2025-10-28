import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Afficher le texte après un court délai
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 500);

    // Naviguer vers la page d'accueil après 3 secondes
    const navTimer = setTimeout(() => {
      navigate('/welcome');
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6B4C4C] relative overflow-hidden">
      {/* Cercle de chargement animé */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Cercle extérieur */}
          <div className="w-32 h-32 border-4 border-[#A9B299]/30 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-4 h-4 bg-[#A9B299] rounded-full transform -translate-x-1 -translate-y-1"></div>
          </div>
          {/* Cercle intérieur */}
          <div className="absolute inset-4 border-2 border-white/20 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Texte principal */}
      <div className={`text-center transition-all duration-1000 ${showText ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'}`}>
        <h1 className="text-7xl font-bold tracking-wider mb-4">
          <span className="text-[#A9B299]">YOO</span>
          <span className="text-white">N</span>
        </h1>

        {/* Slogan */}
        <p className="text-white/80 text-lg font-light tracking-wide">
          Droit Citoyen • Justice • Égalité
        </p>

        {/* Indicateur de chargement textuel */}
        <div className="mt-8 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#A9B299] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#A9B299] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#A9B299] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Effet de particules subtil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#A9B299]/30 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
      </div>
    </div>
  );
}
