import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AnimatedRoutes from './components/layout/AnimatedRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Animated Background Blobs */}
        <div className="bg-blobs">
          <div className="blob-1"></div>
          <div className="blob-2"></div>
        </div>

        {/* Global Toaster */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '16px',
              background: 'rgba(30, 41, 59, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f8fafc',
              boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
            },
          }}
        />

        {/* Routes with Framer Motion */}
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;