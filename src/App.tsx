import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import SplashScreen from './pages/SplashScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import RegisterSuccess from './pages/RegisterSuccess';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ExpertsPage from './pages/ExpertsPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AdminPanel from './pages/AdminPanel';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import PrivacyPage from './pages/PrivacyPage';
import ExpertRegistrationPage from './pages/ExpertRegistrationPage';
import ExpertProfilePage from './pages/ExpertProfilePage';
import AddDocumentPage from './pages/AddDocumentPage';
import ConsultationPage from './pages/ConsultationPage';
import MessagesPage from './pages/MessagesPage';
import MessagesListPage from './pages/MessagesListPage';
import FavoritesPage from './pages/FavoritesPage';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/welcome" element={<WelcomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/register-success" element={<RegisterSuccess />} />

              <Route path="/home" element={<><HomePage /><BottomNav /></>} />
              <Route path="/search" element={<><SearchPage /><BottomNav /></>} />
              <Route path="/messages" element={<MessagesListPage />} />
              <Route path="/experts" element={<><ExpertsPage /><BottomNav /></>} />
              <Route path="/profile" element={<><ProfilePage /><BottomNav /></>} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile/help" element={<HelpPage />} />
              <Route path="/settings/privacy" element={<PrivacyPage />} />
              <Route path="/expert-registration" element={<ExpertRegistrationPage />} />
              <Route path="/expert-profile" element={<ExpertProfilePage />} />
              <Route path="/consultation/:expertId" element={<ConsultationPage />} />
              <Route path="/messages/:expertId" element={<MessagesPage />} />
              <Route path="/favorites" element={<><FavoritesPage /><BottomNav /></>} />
              <Route path="/admin/add-document" element={<AddDocumentPage />} />
              <Route path="/admin" element={<><AdminPanel /><BottomNav /></>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
