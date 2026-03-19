import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Only show sidebar if user is logged in
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30 selection:text-white relative">
      <Navbar />

      {!isAuthPage && user && <Sidebar />}

      <main className={`transition-all duration-300 ease-in-out ${!isAuthPage && user ? 'lg:ml-64' : ''} pt-20 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen relative z-10`}>
        <div className="max-w-[1200px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;