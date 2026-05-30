import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Features from './pages/Features';
import FlowText from './pages/FlowText';
import FlowDiagram from './pages/FlowDiagram';
import FlowVoice from './pages/FlowVoice';
import DifferSocial from './pages/DifferSocial';
import DifferFacebook from './pages/DifferFacebook';
import DifferWhatsapp from './pages/DifferWhatsapp';
import TopReasons from './pages/TopReasons';
import Gifts from './pages/Gifts';
import UseCases from './pages/UseCases';
import Taglines from './pages/Taglines';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import EnquiryDashboard from './pages/admin/EnquiryDashboard';
import ClientManagement from './pages/admin/ClientManagement';
import Clients from './pages/Clients';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

// Footer Component with Modal
function Footer() {
  const [legalModal, setLegalModal] = useState(null);

  useEffect(() => {
    if (!legalModal) return;

    const onKey = (e) => {
      if (e.key === 'Escape') setLegalModal(null);
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [legalModal]);

  const legalPortal =
    legalModal &&
    createPortal(
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setLegalModal(null)}
        />
        <div className="relative z-10 w-full max-w-4xl bg-slate-900 rounded-xl overflow-hidden shadow-xl">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-white font-semibold">
              {legalModal === 'privacy'
                ? 'Privacy Policy'
                : 'Terms and Conditions'}
            </h2>
            <button
              onClick={() => setLegalModal(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <iframe
            title="legal"
            src={
              legalModal === 'privacy'
                ? '/privacy-polocy.html'
                : '/terms-and-condictions.html'
            }
            className="w-full h-[70vh] bg-slate-900"
          />
        </div>
      </div>,
      document.body
    );

  return (
    <>
      {legalPortal}

      <footer className="bg-[#030712] text-slate-400 text-center py-6 border-t border-white/5">
        <div className="flex flex-col items-center gap-2 text-sm">

          <div className="flex gap-24 mt-2">
            <button
              onClick={() => setLegalModal('privacy')}
              className="text-blue-400 hover:underline"
            >
              Privacy Policy
            </button>

<p>© 2026 Closed Circuit AI Pvt Ltd</p>


            <button
              onClick={() => setLegalModal('terms')}
              className="text-blue-400 hover:underline"
            >
              Terms & Conditions
            </button>
          </div>

        </div>
      </footer>
    </>
  );
}

// Main App
function AppShell() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === '/login' ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/enquiries';

  return (
    <div className={`min-h-screen flex flex-col ${isAdminRoute ? 'bg-[#030712]' : 'bg-slate-50'}`}>
      {!isAdminRoute && <Navbar />}

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/flow-text" element={<FlowText />} />
            <Route path="/flow-diagram" element={<FlowDiagram />} />
            <Route path="/flow-voice" element={<FlowVoice />} />
            <Route path="/differ-social" element={<DifferSocial />} />
            <Route path="/differ-facebook" element={<DifferFacebook />} />
            <Route path="/differ-whatsapp" element={<DifferWhatsapp />} />
            <Route path="/top-reasons" element={<TopReasons />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/taglines" element={<Taglines />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/client" element={<Navigate to="/clients" replace />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/enquiries"
              element={
                <AdminRoute>
                  <EnquiryDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <AdminRoute>
                  <ClientManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/enquiries"
              element={<Navigate to="/admin/enquiries" replace />}
            />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppShell />
    </Router>
  );
}