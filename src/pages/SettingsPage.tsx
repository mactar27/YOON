import { useState } from 'react';
import { ArrowLeft, Bell, Moon, Globe, Shield, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';


export default function SettingsPage() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white pb-20">
      {/* Header moderne avec éléments décoratifs */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-[#A9B299]/10 rounded-full transition-all duration-200 backdrop-blur-sm mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B4C4C]" />
          </button>
          <h1 className="text-2xl font-bold tracking-wide">
            <span className="text-[#A9B299]">YOO</span>
            <span className="text-[#6B4C4C]">N</span>
            <span className="text-gray-700 ml-2">• {t('settings.title')}</span>
          </h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Section Profil moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h2 className="text-xl font-semibold text-[#6B4C4C] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6B4C4C] rounded-xl flex items-center justify-center">
              <span className="text-white text-sm"></span>
            </div>
            {t('settings.profile')}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#6B4C4C] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-[#6B4C4C] text-lg">{profile?.full_name || 'Utilisateur'}</p>
              <p className="text-sm text-gray-600">{profile?.phone || 'Numéro non défini'}</p>
            </div>
          </div>
        </div>

        {/* Section Préférences moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h2 className="text-xl font-semibold text-[#6B4C4C] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6B4C4C] rounded-xl flex items-center justify-center">
              <span className="text-white text-sm"></span>
            </div>
            {t('settings.preferences')}
          </h2>

          <div className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between py-3 border-b border-[#A9B299]/20">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#A9B299]/20 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#6B4C4C]" />
                </div>
                <span className="text-[#6B4C4C] font-medium">{t('settings.notifications')}</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${
                  notifications ? 'bg-[#6B4C4C]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    notifications ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Mode sombre */}
            <div className="flex items-center justify-between py-3 border-b border-[#A9B299]/20">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#A9B299]/20 rounded-xl flex items-center justify-center">
                  <Moon className="w-5 h-5 text-[#6B4C4C]" />
                </div>
                <span className="text-[#6B4C4C] font-medium">{t('settings.dark_mode')}</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-7 rounded-full transition-all duration-300 ${
                  theme === 'dark' ? 'bg-[#6B4C4C]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Langue */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#A9B299]/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#6B4C4C]" />
                </div>
                <span className="text-[#6B4C4C] font-medium">{t('settings.language')}</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                className="px-4 py-2 border border-[#A9B299]/30 rounded-xl text-sm font-medium text-[#6B4C4C] bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#A9B299]/50"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section Support moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h2 className="text-xl font-semibold text-[#6B4C4C] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6B4C4C] rounded-xl flex items-center justify-center">
              <span className="text-white text-sm"></span>
            </div>
            {t('settings.support')}
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/settings/privacy')}
              className="w-full flex items-center justify-between p-4 bg-[#A9B299]/10 rounded-xl hover:bg-[#A9B299]/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#A9B299]/20 rounded-xl flex items-center justify-center group-hover:bg-[#A9B299]/30 transition-colors">
                  <Shield className="w-5 h-5 text-[#6B4C4C]" />
                </div>
                <span className="text-[#6B4C4C] font-medium">{t('settings.privacy')}</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-[#A9B299] rotate-180" />
            </button>

            <button
              onClick={() => {
                // Force la navigation avec window.location
                window.location.href = '/profile/help';
              }}
              className="w-full flex items-center justify-between p-4 bg-[#A9B299]/10 rounded-xl hover:bg-[#A9B299]/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#A9B299]/20 rounded-xl flex items-center justify-center group-hover:bg-[#A9B299]/30 transition-colors">
                  <HelpCircle className="w-5 h-5 text-[#6B4C4C]" />
                </div>
                <span className="text-[#6B4C4C] font-medium">{t('settings.help')}</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-[#A9B299] rotate-180" />
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#A9B299]/20">
            <p className="text-sm text-gray-500 text-center">Version 1.0.0 • YOON App</p>
          </div>
        </div>

        {/* Bouton Déconnexion moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg transform hover:scale-[1.02]"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('settings.sign_out')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
