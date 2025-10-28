import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

export default function RegisterSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col safe-area-top">
      <div className="flex-1 flex items-center justify-center mobile-container">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-4 text-[#6B4C4C]">
            Inscription réussie !
          </h1>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-[#6B4C4C] bg-opacity-10 rounded-xl">
              <Mail className="w-5 h-5 text-[#6B4C4C] mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-[#6B4C4C] mb-1">Vérifiez votre email</p>
                <p className="text-sm text-gray-600">
                  Un email de confirmation a été envoyé pour activer votre compte
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#A9B299] bg-opacity-10 rounded-xl">
              <CheckCircle className="w-5 h-5 text-[#A9B299] mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-[#A9B299] mb-1">Email de bienvenue</p>
                <p className="text-sm text-gray-600">
                  Vous recevrez également un email de bienvenue personnalisé
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-[#6B4C4C] to-[#8A6A6A] text-white py-4 rounded-xl font-semibold hover:from-[#5A3E3E] hover:to-[#7A5A5A] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Aller à la connexion
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-sm text-gray-500">
              Redirection automatique dans quelques secondes...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}