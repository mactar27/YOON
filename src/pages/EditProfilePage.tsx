import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Mail, Lock, User, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { imageService } from '../lib/imageService';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    email: user?.email || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Charger l'image de profil existante au démarrage
  useEffect(() => {
    if (user?.email) {
      const imageUrl = imageService.getProfileImage(user.email);
      setCurrentAvatar(imageUrl);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Valider le fichier
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Le fichier doit être une image' });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 5MB' });
        return;
      }

      setAvatarFile(file);
      
      // Créer un aperçu simple
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setAvatarPreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      console.log('Processing local avatar...');
      
      // Utiliser notre service d'images local
      if (user?.email) {
        const base64 = await imageService.saveProfileImage(user.email, file);
        console.log('Avatar sauvegardé localement');
        
        // Retourner l'URL data pour l'affichage immédiat
        return base64;
      }
      
      throw new Error('Utilisateur non connecté');
    } catch (error) {
      console.error('Error handling avatar:', error);
      setMessage({ type: 'error', text: `Erreur: ${(error as Error).message}` });
      return null;
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      let avatarUrl = profile?.avatar_url;

      // Upload avatar if changed
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Simuler la mise à jour du profil localement
      if (user?.id) {
        // Utiliser le même système de stockage que l'AuthContext
        const savedProfile = localStorage.getItem(`profile_${user.id}`);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          const updatedProfile = {
            ...profile,
            full_name: formData.full_name,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          };
          localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
        }
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });

      // Mettre à jour l'image actuelle avec la nouvelle image sauvegardée
      if (avatarPreview) {
        setCurrentAvatar(avatarPreview);
      } else {
        setCurrentAvatar(null);
      }

      // Rafraîchir le profil localement
      setTimeout(async () => {
        await refreshProfile();
        console.log('Profile refreshed after save');
      }, 500);

    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message || 'Erreur lors de la mise à jour' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Simuler le changement de mot de passe localement
      if (user?.email) {
        const savedUser = localStorage.getItem(`user_${user.email}`);
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          userData.password = passwords.newPassword;
          localStorage.setItem(`user_${user.email}`, JSON.stringify(userData));
        }
      }

      setMessage({ type: 'success', text: 'Mot de passe changé avec succès !' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message || 'Erreur lors du changement de mot de passe' });
    } finally {
      setLoading(false);
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
            <span className="text-gray-700 ml-2">• Modifier le profil</span>
          </h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Section Avatar moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h2 className="text-xl font-semibold text-[#6B4C4C] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6B4C4C] rounded-xl flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            Photo de profil
          </h2>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-2xl bg-[#6B4C4C] flex items-center justify-center overflow-hidden shadow-lg">
                {avatarPreview || currentAvatar ? (
                  <img
                    src={avatarPreview || currentAvatar || ''}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-3xl">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              {/* Bouton principal pour changer la photo */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#6B4C4C] rounded-xl flex items-center justify-center hover:bg-[#5A3E3E] transition-all duration-200 shadow-lg transform hover:scale-110"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-sm text-gray-600 font-medium text-center">
              {currentAvatar ? 'Appuyez pour changer la photo' : 'Appuyez pour ajouter une photo'}
            </p>
          </div>
        </div>

        {/* Section Informations personnelles moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h2 className="text-xl font-semibold text-[#6B4C4C] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6B4C4C] rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            Informations personnelles
          </h2>

          <div className="space-y-4">
            {/* Nom complet */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B4C4C]" />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299]/50 bg-white/50 backdrop-blur-sm text-[#6B4C4C] placeholder-gray-400"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B4C4C]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299]/50 bg-white/50 backdrop-blur-sm text-[#6B4C4C] placeholder-gray-400"
                  placeholder="votre.email@example.com"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-[#6B4C4C] to-[#5A3E3E] text-white py-3.5 rounded-2xl font-semibold hover:from-[#5A3E3E] hover:to-[#4A3535] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02]"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

        {/* Section Changement de mot de passe moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#A9B299]/20 shadow-lg">
          <h2 className="text-xl font-semibold text-[#6B4C4C] mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6B4C4C] rounded-xl flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            Changer le mot de passe
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B4C4C]" />
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299]/50 bg-white/50 backdrop-blur-sm text-[#6B4C4C] placeholder-gray-400"
                  placeholder="Nouveau mot de passe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B4C4C]" />
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299]/50 bg-white/50 backdrop-blur-sm text-[#6B4C4C] placeholder-gray-400"
                  placeholder="Confirmer le mot de passe"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={loading || !passwords.newPassword || !passwords.confirmPassword}
            className="w-full mt-6 bg-gradient-to-r from-[#A9B299] to-[#8A9279] text-white py-3.5 rounded-2xl font-semibold hover:from-[#8A9279] hover:to-[#6B7B59] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02]"
          >
            <Lock className="w-5 h-5" />
            Changer le mot de passe
          </button>
        </div>

        {/* Message de feedback moderne */}
        {message && (
          <div className={`p-4 rounded-2xl border-l-4 shadow-lg backdrop-blur-sm ${
            message.type === 'success'
              ? 'bg-green-50/80 border-green-500 text-green-800'
              : 'bg-red-50/80 border-red-500 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}
      </div>

      </div>
  );
}