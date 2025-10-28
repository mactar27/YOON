import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Mail, Lock, User, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file as File);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      console.log('Starting avatar upload...');

      // For now, just return a placeholder URL to test the UI
      // Replace this with actual Supabase upload when storage is configured
      const mockUrl = `https://via.placeholder.com/150?text=${file.name}`;
      console.log('Using mock URL for testing:', mockUrl);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return mockUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage({ type: 'error', text: `Erreur upload: ${(error as Error).message}` });
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

      // Update profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.full_name,
          avatar_url: avatarUrl,
        } as any)
        .eq('id', user!.id);

      if (error) throw error;

      // Update email if changed
      if (formData.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });
        if (emailError) throw emailError;
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });

      // Force refresh profile to show updated data immediately
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
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Mot de passe changé avec succès !' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message || 'Erreur lors du changement de mot de passe' });
    } finally {
      setLoading(false);
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
            <span className="text-[#A9B299]">Modifier le profil</span>
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar Section */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Photo de profil</h2>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#A9B299] flex items-center justify-center overflow-hidden">
                {avatarPreview || profile?.avatar_url ? (
                  <img
                    src={avatarPreview || profile?.avatar_url || ''}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#6B4C4C] rounded-full flex items-center justify-center"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">Appuyez pour changer la photo</p>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations personnelles</h2>

          <div className="space-y-4">
            {/* Nom complet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>


            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                  placeholder="votre.email@example.com"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full mt-6 bg-[#6B4C4C] text-white py-3 rounded-lg font-medium hover:bg-[#5A3E3E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

        {/* Changement de mot de passe */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Changer le mot de passe</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                  placeholder="Nouveau mot de passe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                  placeholder="Confirmer le mot de passe"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={loading || !passwords.newPassword || !passwords.confirmPassword}
            className="w-full mt-6 bg-[#A9B299] text-white py-3 rounded-lg font-medium hover:bg-[#8A9279] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Changer le mot de passe
          </button>
        </div>

        {/* Message de feedback */}
        {message && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}