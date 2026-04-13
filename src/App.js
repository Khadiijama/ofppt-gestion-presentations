import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import APropos from './pages/APropos';

// Formateur pages
import FormateurDashboard from './pages/FormateurDashboard';
import GestionPresentations from './pages/formateur/GestionPresentations';
import GestionClasses from './pages/formateur/GestionClasses';
import CalendrierFormateur from './pages/formateur/CalendrierFormateur';
import Rapports from './pages/formateur/Rapports';

// Stagiaire pages
import EtudiantDashboard from './pages/EtudiantDashboard';
import MesPresentations from './pages/stagiaire/MesPresentations';

// Shared pages
import Bibliotheque from './pages/Bibliotheque';
import Parametres from './pages/Parametres';

import './index.css';

const FormateurLayout = ({ children }) => (
  <ProtectedRoute allowedRole="formateur">
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const StagiaireLayout = ({ children }) => (
  <ProtectedRoute allowedRole="stagiaire">
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const AuthLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/a-propos" element={<APropos />} />

          {/* Formateur */}
          <Route path="/formateur" element={<FormateurLayout><FormateurDashboard /></FormateurLayout>} />
          <Route path="/formateur/presentations" element={<FormateurLayout><GestionPresentations /></FormateurLayout>} />
          <Route path="/formateur/classes" element={<FormateurLayout><GestionClasses /></FormateurLayout>} />
          <Route path="/formateur/calendrier" element={<FormateurLayout><CalendrierFormateur /></FormateurLayout>} />
          <Route path="/formateur/rapports" element={<FormateurLayout><Rapports /></FormateurLayout>} />

          {/* Stagiaire */}
          <Route path="/stagiaire" element={<StagiaireLayout><EtudiantDashboard /></StagiaireLayout>} />
          <Route path="/stagiaire/presentations" element={<StagiaireLayout><MesPresentations /></StagiaireLayout>} />

          {/* Shared (authenticated) */}
          <Route path="/bibliotheque" element={<AuthLayout><Bibliotheque /></AuthLayout>} />
          <Route path="/parametres" element={<AuthLayout><Parametres /></AuthLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
