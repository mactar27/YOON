import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Scale, CheckCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase'; // eslint-disable-line @typescript-eslint/no-unused-vars

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
      // Simulation d'inscription automatique sans vérification
      console.log('Expert registration data:', {
        ...formData,
        photoFile: photoFile?.name,
        full_name: `${formData.first_name} ${formData.last_name}`.trim()
      });

      // Simulation de création automatique du compte expert
      setTimeout(() => {
        // Créer un nouvel expert mock pour la démonstration
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

        // Sauvegarder temporairement dans localStorage pour la démonstration
        const existingExperts = JSON.parse(localStorage.getItem('yoon_new_experts') || '[]');
        existingExperts.push(newExpert);
        localStorage.setItem('yoon_new_experts', JSON.stringify(existingExperts));

        alert(`✅ Félicitations ${formData.first_name} !

Votre compte expert a été créé automatiquement et vous êtes maintenant connecté.
Vous pouvez commencer à recevoir des demandes de consultation immédiatement.

Bienvenue dans le réseau YOON !`);

        // Rediriger vers la page experts pour voir le nouvel expert
        navigate('/experts');
      }, 2000);

    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }

    // Sauvegarder l'expert dans localStorage pour la démonstration
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
            <span className="text-[#A9B299]">Devenir</span>
            <span className="text-[#6B4C4C]"> Expert</span>
          </h1>
        </div>
      </div>

      <div className="p-4">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Étape {currentStep} sur 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#6B4C4C] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-br from-[#A9B299] to-[#8A9279] rounded-xl p-6 text-white mb-6">
          <Scale className="w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold mb-2">Rejoignez notre réseau d'experts</h2>
          <p className="opacity-90 text-sm">
            Partagez votre expertise juridique et aidez les citoyens sénégalais à accéder au droit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message d'information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Inscription automatique</p>
                <p>Une fois votre formulaire soumis, votre compte expert sera créé automatiquement sans validation manuelle. Vous pourrez commencer à travailler immédiatement.</p>
              </div>
            </div>
          </div>
          {/* Étape 1: Informations de base */}
          {currentStep === 1 && (
            <>
              {/* Photo de profil */}
              <div className="bg-white rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Photo de profil</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Scale className="w-8 h-8 text-gray-400" />
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
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#A9B299] bg-opacity-20 text-[#6B4C4C] rounded-lg cursor-pointer hover:bg-opacity-30 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">Choisir une photo</span>
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Format JPG, PNG. Taille max: 2MB</p>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="bg-white rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations personnelles</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                          errors.first_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Amadou"
                      />
                      {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                          errors.last_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Ndiaye"
                      />
                      {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone personnel *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+221 XX XXX XX XX"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de bureau
                      </label>
                      <input
                        type="tel"
                        name="office_number"
                        value={formData.office_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                        placeholder="+221 XX XXX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro CNI *
                    </label>
                    <input
                      type="text"
                      name="cni"
                      value={formData.cni}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                        errors.cni ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Numéro de carte d'identité"
                    />
                    {errors.cni && <p className="text-red-500 text-xs mt-1">{errors.cni}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="expert@yoon.sn"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmer mot de passe *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations professionnelles</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-4 h-4 text-[#6B4C4C] border-gray-300 rounded focus:ring-[#A9B299]"
                        />
                        <span className="text-sm text-gray-700">{specialty}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specialties && <p className="text-red-500 text-xs mt-1">{errors.specialties}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Années d'expérience *
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                        errors.experience_years ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: 5"
                    />
                    {errors.experience_years && <p className="text-red-500 text-xs mt-1">{errors.experience_years}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tarif consultation *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="consultation_fee"
                        value={formData.consultation_fee}
                        onChange={handleInputChange}
                        min="0"
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                          errors.consultation_fee ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 50000"
                      />
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilités *
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                      errors.availability ? 'border-red-500' : 'border-gray-300'
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biographie *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299] ${
                      errors.bio ? 'border-red-500' : 'border-gray-300'
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
              <div className="bg-white rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations du cabinet (optionnel)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du cabinet
                    </label>
                    <input
                      type="text"
                      name="office_name"
                      value={formData.office_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                      placeholder="Ex: Cabinet Ndiaye & Associés"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse du cabinet
                    </label>
                    <textarea
                      name="office_address"
                      value={formData.office_address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                      placeholder="Adresse complète du cabinet"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone du cabinet
                      </label>
                      <input
                        type="tel"
                        name="office_phone"
                        value={formData.office_phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                        placeholder="+221 XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email du cabinet
                      </label>
                      <input
                        type="email"
                        name="office_email"
                        value={formData.office_email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                        placeholder="contact@cabinet.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Langues parlées */}
              <div className="bg-white rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Langues parlées (optionnel)</h3>
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
                        className="w-4 h-4 text-[#6B4C4C] border-gray-300 rounded focus:ring-[#A9B299]"
                      />
                      <span className="text-sm text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Conditions */}
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-[#6B4C4C] border-gray-300 rounded focus:ring-[#A9B299]"
              />
              <div className="text-sm text-gray-600">
                <p className="mb-2">
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
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 bg-[#6B4C4C] text-white py-3 rounded-xl font-medium hover:bg-[#5A3E3E] transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#6B4C4C] text-white py-3 rounded-xl font-medium hover:bg-[#5A3E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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