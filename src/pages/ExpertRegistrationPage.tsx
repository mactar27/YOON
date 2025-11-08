import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Scale, CheckCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const SPECIALTIES = [
  'Droit civil',
  'Droit pénal',
  'Droit du travail',
  'Droit de la famille',
  'Droit commercial',
  'Droit fiscal',
  'Droit immobilier',
  'Droit des affaires',
  'Droit international',
  'Droit constitutionnel',
  'Droit administratif',
  'Droit des assurances'
];

const LANGUAGES = [
  'Français',
  'Anglais',
  'Wolof',
  'Arabe',
  'Portugais',
  'Espagnol'
];

const CURRENCIES = [
  'FCFA',
  'EUR',
  'USD'
];

const AVAILABILITY_OPTIONS = [
  'Lundi - Vendredi (9h-17h)',
  'Lundi - Vendredi (14h-18h)',
  'Samedi (9h-12h)',
  'Sur rendez-vous uniquement',
  'Téléphone uniquement'
];

export default function ExpertRegistrationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const prefilledData = location.state as { email: string; password: string; fullName: string; role: string } | null;
  const [formData, setFormData] = useState({
    first_name: prefilledData?.fullName?.split(' ')[0] || '',
    last_name: prefilledData?.fullName?.split(' ').slice(1).join(' ') || '',
    phone: '',
    office_number: '',
    cni: '',
    specialties: [] as string[],
    experience_years: '',
    consultation_fee: '',
    currency: 'FCFA',
    availability: '',
    bio: '',
    office_name: '',
    office_address: '',
    office_phone: '',
    office_email: '',
    languages: [] as string[],
    email: prefilledData?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = 'Prénom requis';
      if (!formData.last_name.trim()) newErrors.last_name = 'Nom requis';
      if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
      if (!formData.cni.trim()) newErrors.cni = 'Numéro CNI requis';
      if (!formData.email.trim()) newErrors.email = 'Email requis';
      if (!formData.password) newErrors.password = 'Mot de passe requis';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (step === 2) {
      if (formData.specialties.length === 0) newErrors.specialties = 'Au moins une spécialité requise';
      if (!formData.experience_years) newErrors.experience_years = 'Expérience requise';
      if (!formData.consultation_fee) newErrors.consultation_fee = 'Tarif requis';
      if (!formData.availability) newErrors.availability = 'Disponibilités requises';
      if (!formData.bio.trim()) newErrors.bio = 'Biographie requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      console.log('Expert registration data:', {
        ...formData,
        photoFile: photoFile?.name,
        full_name: `${formData.first_name} ${formData.last_name}`.trim()
      });

      setTimeout(() => {
        const newExpert = {
          id: `new-${Date.now()}`,
          user_id: `user-${Date.now()}`,
          specialties: formData.specialties,
          bio: formData.bio,
          is_verified: true,
          is_available: true,
          consultation_fee: parseInt(formData.consultation_fee),
          user: {
            full_name: `${formData.first_name} ${formData.last_name}`,
            avatar_url: null
          }
        };

        const existingExperts = JSON.parse(localStorage.getItem('yoon_new_experts') || '[]');
        existingExperts.push(newExpert);
        localStorage.setItem('yoon_new_experts', JSON.stringify(existingExperts));

        alert(`✅ Félicitations ${formData.first_name} !

Votre compte expert a été créé automatiquement et vous êtes maintenant connecté.
Vous pouvez commencer à recevoir des demandes de consultation immédiatement.

Bienvenue dans le réseau YOON !`);

        navigate('/experts');
      }, 2000);

    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }

    const newExpert = {
      id: Date.now().toString(),
      user_id: Date.now().toString(),
      specialties: formData.specialties,
      bio: formData.bio,
      is_verified: true,
      is_available: true,
      consultation_fee: parseInt(formData.consultation_fee),
      experience_years: parseInt(formData.experience_years),
      user: {
        full_name: `${formData.first_name} ${formData.last_name}`,
        avatar_url: null
      }
    };

    const existingExperts = JSON.parse(localStorage.getItem('yoon_new_experts') || '[]');
    existingExperts.push(newExpert);
    localStorage.setItem('yoon_new_experts', JSON.stringify(existingExperts));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#A9B299]/5 to-white pb-20">
      {/* Header moderne */}
      <div className="bg-white border-b border-gray-200">
        
        <div className="relative px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-[#A9B299]/10 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B4C4C]" />
          </button>
          <h1 className="text-2xl font-bold tracking-wide">
            <span className="text-[#A9B299]">Devenir</span>
            <span className="text-[#6B4C4C]"> Expert</span>
          </h1>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Progress indicator moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#6B4C4C]">Étape {currentStep} sur 3</span>
            <span className="text-sm text-gray-500 font-medium">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-white/50 backdrop-blur-sm rounded-2xl h-3 border border-[#A9B299]/20">
            <div
              className="bg-gradient-to-r from-[#A9B299] to-[#6B4C4C] h-3 rounded-2xl transition-all duration-500 shadow-sm"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Section d'introduction modernisée */}
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[#6B7A4A] rounded-3xl"></div>
          
          <div className="relative p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-[#6B4C4C]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Rejoignez notre réseau d'experts</h2>
            <p className="opacity-90 text-lg">
              Partagez votre expertise juridique et aidez les citoyens sénégalais à accéder au droit.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message d'information modernisé */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1 text-[#6B4C4C]">Inscription automatique</p>
                <p>Une fois votre formulaire soumis, votre compte expert sera créé automatiquement sans validation manuelle. Vous pourrez commencer à travailler immédiatement.</p>
              </div>
            </div>
          </div>

          {/* Étape 1: Informations de base */}
          {currentStep === 1 && (
            <>
              {/* Photo de profil */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-5 mb-6">
                <h3 className="text-lg font-semibold text-[#6B4C4C] mb-4">Photo de profil</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A9B299]/20 to-[#6B4C4C]/20 flex items-center justify-center overflow-hidden border border-[#A9B299]/30">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Scale className="w-8 h-8 text-[#A9B299]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#6B4C4C] text-white rounded-2xl cursor-pointer hover:bg-[#5A3E3E] transform hover:scale-105 transition-all duration-200 shadow-lg">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">Choisir une photo</span>
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Format JPG, PNG. Taille max: 2MB</p>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-5 mb-6">
                <h3 className="text-lg font-semibold text-[#6B4C4C] mb-4">Informations personnelles</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                          errors.first_name ? 'border-red-500' : ''
                        }`}
                        placeholder="Ex: Amadou"
                      />
                      {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                          errors.last_name ? 'border-red-500' : ''
                        }`}
                        placeholder="Ex: Ndiaye"
                      />
                      {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                        Téléphone personnel *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                          errors.phone ? 'border-red-500' : ''
                        }`}
                        placeholder="+221 XX XXX XX XX"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                        Numéro de bureau
                      </label>
                      <input
                        type="tel"
                        name="office_number"
                        value={formData.office_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="+221 XX XXX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                      Numéro CNI *
                    </label>
                    <input
                      type="text"
                      name="cni"
                      value={formData.cni}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                        errors.cni ? 'border-red-500' : ''
                      }`}
                      placeholder="Numéro de carte d'identité"
                    />
                    {errors.cni && <p className="text-red-500 text-xs mt-1">{errors.cni}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder="expert@yoon.sn"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                        Mot de passe *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.password ? 'border-red-500' : ''
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6B4C4C] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                        Confirmer mot de passe *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                            errors.confirmPassword ? 'border-red-500' : ''
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6B4C4C] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Étape 2: Informations professionnelles */}
          {currentStep === 2 && (
            <div className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-5 mb-6">
              <h3 className="text-lg font-semibold text-[#6B4C4C] mb-4">Informations professionnelles</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                    Spécialités juridiques * (sélectionnez au moins une)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {SPECIALTIES.map(specialty => (
                      <label key={specialty} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...formData.specialties, specialty]
                              : formData.specialties.filter(s => s !== specialty);
                            setFormData(prev => ({ ...prev, specialties: updated }));
                          }}
                          className="w-4 h-4 text-[#6B4C4C] border-[#A9B299]/30 rounded focus:ring-[#A9B299] focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">{specialty}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specialties && <p className="text-red-500 text-xs mt-1">{errors.specialties}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                      Années d'expérience *
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                        errors.experience_years ? 'border-red-500' : ''
                      }`}
                      placeholder="Ex: 5"
                    />
                    {errors.experience_years && <p className="text-red-500 text-xs mt-1">{errors.experience_years}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                      Tarif consultation *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="consultation_fee"
                        value={formData.consultation_fee}
                        onChange={handleInputChange}
                        min="0"
                        className={`flex-1 px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                          errors.consultation_fee ? 'border-red-500' : ''
                        }`}
                        placeholder="Ex: 50000"
                      />
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="px-3 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200"
                      >
                        {CURRENCIES.map(currency => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                    {errors.consultation_fee && <p className="text-red-500 text-xs mt-1">{errors.consultation_fee}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                    Disponibilités *
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                      errors.availability ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Sélectionnez vos disponibilités</option>
                    {AVAILABILITY_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.availability && <p className="text-red-500 text-xs mt-1">{errors.availability}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                    Biographie *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 resize-none ${
                      errors.bio ? 'border-red-500' : ''
                    }`}
                    placeholder="Décrivez votre parcours, vos compétences et votre approche..."
                  />
                  {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Informations complémentaires */}
          {currentStep === 3 && (
            <>
              {/* Informations du cabinet */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-5 mb-6">
                <h3 className="text-lg font-semibold text-[#6B4C4C] mb-4">Informations du cabinet (optionnel)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                      Nom du cabinet
                    </label>
                    <input
                      type="text"
                      name="office_name"
                      value={formData.office_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200"
                      placeholder="Ex: Cabinet Ndiaye & Associés"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                      Adresse du cabinet
                    </label>
                    <textarea
                      name="office_address"
                      value={formData.office_address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200 resize-none"
                      placeholder="Adresse complète du cabinet"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                        Téléphone du cabinet
                      </label>
                      <input
                        type="tel"
                        name="office_phone"
                        value={formData.office_phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="+221 XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6B4C4C] mb-2">
                        Email du cabinet
                      </label>
                      <input
                        type="email"
                        name="office_email"
                        value={formData.office_email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-[#A9B299]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A9B299] focus:border-[#A9B299] bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="contact@cabinet.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Langues parlées */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-5 mb-6">
                <h3 className="text-lg font-semibold text-[#6B4C4C] mb-4">Langues parlées (optionnel)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(language => (
                    <label key={language} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(language)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...formData.languages, language]
                            : formData.languages.filter(l => l !== language);
                          setFormData(prev => ({ ...prev, languages: updated }));
                        }}
                        className="w-4 h-4 text-[#6B4C4C] border-[#A9B299]/30 rounded focus:ring-[#A9B299] focus:ring-2"
                      />
                      <span className="text-sm text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Conditions */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#A9B299]/20 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-[#6B4C4C] border-[#A9B299]/30 rounded focus:ring-[#A9B299] focus:ring-2"
              />
              <div className="text-sm text-gray-700">
                <p className="mb-2 font-medium text-[#6B4C4C]">
                  J'accepte les conditions d'utilisation de la plateforme YOON.
                </p>
                <p>
                  Je m'engage à respecter le code de déontologie professionnelle et à fournir des services juridiques de qualité.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 border border-[#A9B299]/30 text-[#6B4C4C] py-4 rounded-2xl font-semibold hover:bg-[#A9B299]/10 transition-all duration-200 transform hover:scale-105"
              >
                Précédent
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 bg-[#6B4C4C] text-white py-4 rounded-2xl font-semibold hover:bg-[#5A3E3E] transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#6B4C4C] text-white py-4 rounded-2xl font-semibold hover:bg-[#5A3E3E] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Finaliser l'inscription
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}