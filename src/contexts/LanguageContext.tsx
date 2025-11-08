import React, { createContext, useContext, useState } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Traductions
const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.search': 'Recherche',
    'nav.messages': 'Messages',
    'nav.experts': 'Experts',
    'nav.profile': 'Profil',
    'nav.admin': 'Admin',

    // Header
    'header.notifications': 'Notifications',
    'header.favorites': 'Favoris',
    'header.settings': 'Paramètres',

    // Accueil
    'home.welcome': 'Bienvenue',
    'home.explore': 'Explorez vos droits et devoirs juridiques',
    'home.legal_content': 'Contenus juridiques',
    'home.filter': 'Filtrer',
    'home.categories': 'Catégories',
    'home.no_content': 'Aucun contenu disponible pour le moment',

    // Recherche
    'search.placeholder': 'Rechercher texte de juridique',
    'search.no_results': 'Aucun résultat',
    'search.try_keywords': 'Essayez d\'autres mots-clés ou catégories',

    // Paramètres
    'settings.title': 'Paramètres',
    'settings.profile': 'Profil',
    'settings.preferences': 'Préférences',
    'settings.notifications': 'Notifications',
    'settings.dark_mode': 'Mode sombre',
    'settings.language': 'Langue',
    'settings.support': 'Support',
    'settings.privacy': 'Confidentialité',
    'settings.help': 'Aide & Support',
    'settings.sign_out': 'Se déconnecter',

    // Profil
    'profile.personal_info': 'Informations personnelles',
    'profile.documents': 'Mes documents',
    'profile.consultations': 'Mes consultations',
    'profile.settings': 'Paramètres',
    'profile.help': 'Aide & Support',
    'profile.admin_panel': 'Panneau d\'administration',
    'profile.expert_status': 'Statut Expert',
    'profile.verified': 'Compte vérifié et actif',
    'profile.sign_out': 'Déconnexion',

    // Commun
    'common.back': 'Retour',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.messages': 'Messages',
    'nav.experts': 'Experts',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',

    // Header
    'header.notifications': 'Notifications',
    'header.favorites': 'Favorites',
    'header.settings': 'Settings',

    // Accueil
    'home.welcome': 'Welcome',
    'home.explore': 'Explore your legal rights and duties',
    'home.legal_content': 'Legal Content',
    'home.filter': 'Filter',
    'home.categories': 'Categories',
    'home.no_content': 'No content available at the moment',

    // Recherche
    'search.placeholder': 'Search legal text',
    'search.no_results': 'No results',
    'search.try_keywords': 'Try other keywords or categories',

    // Paramètres
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.preferences': 'Preferences',
    'settings.notifications': 'Notifications',
    'settings.dark_mode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.support': 'Support',
    'settings.privacy': 'Privacy',
    'settings.help': 'Help & Support',
    'settings.sign_out': 'Sign Out',

    // Profil
    'profile.personal_info': 'Personal Information',
    'profile.documents': 'My Documents',
    'profile.consultations': 'My Consultations',
    'profile.settings': 'Settings',
    'profile.help': 'Help & Support',
    'profile.admin_panel': 'Admin Panel',
    'profile.expert_status': 'Expert Status',
    'profile.verified': 'Verified and active account',
    'profile.sign_out': 'Sign Out',

    // Commun
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Récupérer la langue depuis localStorage ou utiliser 'fr' par défaut
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'fr';
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};