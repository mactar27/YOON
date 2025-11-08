import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Naviguer vers la page d'accueil après 2 secondes
    const navTimer = setTimeout(() => {
      try {
        console.log('Navigating to welcome page...');
        navigate('/welcome', { replace: true });
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback direct
        window.location.href = '/welcome';
      }
    }, 2000);

    return () => {
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#6B4C4C] via-[#6B4C4C] to-[#5A3E3E]">
      {/* Logo simple */}
      <div className="mb-8">
        <h1 className="text-8xl font-bold tracking-wider text-center">
          <span className="text-[#7B8A52]">YOO</span>
          <span className="text-white">N</span>
        </h1>
      </div>

      {/* Spinner de chargement simple */}
      <div className="w-12 h-12 border-4 border-white/20 rounded-full">
        <div className="w-full h-full border-4 border-[#7B8A52] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
