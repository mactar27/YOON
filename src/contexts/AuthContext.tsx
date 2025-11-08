import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: 'citizen' | 'expert' | 'admin';
}

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'citizen' | 'expert' | 'admin';
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Liste des admins (emails qui seront automatiquement admins)
const ADMIN_EMAILS = [
  'admin@yoon.sn',
  'superadmin@yoon.sn',
  'admin@yoonsenegal.com'
];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: 'citizen' | 'expert' | 'admin') => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const generateUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const fetchProfile = (userId: string, userEmail?: string) => {
    try {
      const savedProfile = localStorage.getItem(`profile_${userId}`);
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        // S'assurer que le profil a les champs nécessaires pour l'avatar
        setProfile(profile);
        return;
      }

      // Si pas de profil trouvé, créer un profil par défaut basé sur l'email
      if (userEmail) {
        const isAdmin = ADMIN_EMAILS.includes(userEmail.toLowerCase());
        const defaultRole: 'citizen' | 'expert' | 'admin' = isAdmin ? 'admin' : 'citizen';

        const defaultProfile: UserProfile = {
          id: userId,
          full_name: userEmail.split('@')[0], // Nom temporaire basé sur l'email
          role: defaultRole,
          phone: '',
          avatar_url: '',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setProfile(defaultProfile);
        localStorage.setItem(`profile_${userId}`, JSON.stringify(defaultProfile));
        return;
      }

      setProfile(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Vérifier s'il y a un utilisateur connecté dans le localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchProfile(userData.id, userData.email);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'citizen' | 'expert' | 'admin' = 'citizen') => {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = localStorage.getItem(`user_${email}`);
      if (existingUser) {
        return { error: 'Un utilisateur avec cet email existe déjà' };
      }

      const userId = generateUserId();
      const newUser: User = {
        id: userId,
        email,
        full_name: fullName,
        role
      };

      // Stocker l'utilisateur
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);

      // Créer et stocker le profil
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      const finalRole: 'citizen' | 'expert' | 'admin' = isAdmin ? 'admin' : role;

      const newProfile: UserProfile = {
        id: userId,
        full_name: fullName,
        role: finalRole,
        phone: '',
        avatar_url: '',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setProfile(newProfile);
      localStorage.setItem(`profile_${userId}`, JSON.stringify(newProfile));

      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error: 'Erreur lors de l\'inscription' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Comptes de démonstration
      const demoAccounts: Array<{email: string, password: string, role: 'citizen' | 'expert' | 'admin'}> = [
        { email: 'expert@yoon.sn', password: 'expert123', role: 'expert' },
        { email: 'citizen@yoon.sn', password: 'citizen123', role: 'citizen' },
        { email: 'admin@yoon.sn', password: 'admin123', role: 'admin' }
      ];

      // Vérifier si c'est un compte de démonstration
      const demoAccount = demoAccounts.find(acc =>
        acc.email.toLowerCase() === email.toLowerCase() &&
        acc.password === password
      );

      if (demoAccount) {
        // Forcer la création d'un nouvel utilisateur et profil pour les comptes de démonstration
        const userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        const userName = demoAccount.email.split('@')[0];
        const userData: User = {
          id: userId,
          email: demoAccount.email,
          full_name: userName,
          role: demoAccount.role
        };
        
        // Créer le profil correspondant
        const profile: UserProfile = {
          id: userId,
          full_name: userName,
          role: demoAccount.role,
          phone: '',
          avatar_url: '',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Nettoyer les anciennes données et stocker les nouvelles
        localStorage.removeItem(`user_${email}`);
        localStorage.removeItem(`profile_${userId}`);
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        setUser(userData);
        setProfile(profile);
        
        console.log('Demo account login:', { userData, profile });
      } else {
        // Utiliser le système normal d'authentification
        const savedUser = localStorage.getItem(`user_${email}`);
        if (!savedUser) {
          return { error: 'Aucun utilisateur trouvé avec cet email' };
        }

        const userData = JSON.parse(savedUser);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setUser(userData);
        fetchProfile(userData.id, userData.email);
      }

      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: 'Erreur lors de la connexion' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      fetchProfile(user.id, user.email);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
