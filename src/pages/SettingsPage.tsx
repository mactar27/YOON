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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold tracking-wide">
            <span className="text-[#A9B299]">{t('settings.title')}</span>
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profil Section */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('settings.profile')}</h2>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#A9B299] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{profile?.full_name || 'Utilisateur'}</p>
              <p className="text-sm text-gray-500">{profile?.phone || 'Numéro non défini'}</p>
            </div>
          </div>
        </div>

        {/* Préférences */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('settings.preferences')}</h2>

          {/* Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{t('settings.notifications')}</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-colors ${
                notifications ? 'bg-[#6B4C4C]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Mode sombre */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Moon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{t('settings.dark_mode')}</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-[#6B4C4C]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Langue */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{t('settings.language')}</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('settings.support')}</h2>

          <button
            onClick={() => navigate('/settings/privacy')}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{t('settings.privacy')}</span>
            </div>
            <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
          </button>

          <button
            onClick={() => navigate('/profile/help')}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{t('settings.help')}</span>
            </div>
            <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
          </button>

          <div className="pt-3">
            <p className="text-xs text-gray-500 text-center">Version 1.0.0</p>
          </div>
        </div>

        {/* Déconnexion */}
        <div className="bg-white rounded-xl p-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('settings.sign_out')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}