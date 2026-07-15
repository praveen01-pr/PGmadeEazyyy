import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import Cookies from 'js-cookie';

const SignInForm = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const userData = Cookies.get('user');
    if (userData) {
      const userDataObj = JSON.parse(userData);
      // Redirect based on user type
      switch(userDataObj.userType) {
        case 'ROLE_ADMIN':
          navigate('/admin-dashboard', { replace: true });
          break;
        case 'ROLE_PROVIDER':
          navigate('/provider-dashboard', { replace: true });
          break;
        case 'ROLE_SEEKER':
          navigate('/seeker-dashboard', { replace: true });
          break;
        default:
          break;
      }
    }

    // Prevent back navigation when logged in
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setMessage("Checking credentials...");
      
      const result = await login(formData.email, formData.password);
      
      if (result) {
        setMessage("Login successful! Redirecting to dashboard...");
        
        // Get user type from cookies
        const userData = Cookies.get('user');
        if (!userData) {
          throw new Error('User data not found');
        }

        const userDataObj = JSON.parse(userData);
        console.log('User data from cookies:', userDataObj);
        
        // Add a small delay before navigation for better UX
        setTimeout(() => {
          // Redirect based on user type with replace: true to prevent back navigation
          switch(userDataObj.userType) {
            case 'ROLE_ADMIN':
              navigate('/admin-dashboard', { replace: true });
              break;
            case 'ROLE_PROVIDER':
              navigate('/provider-dashboard', { replace: true });
              break;
            case 'ROLE_SEEKER':
              navigate('/seeker-dashboard', { replace: true });
              break;
            default:
              throw new Error('Invalid user type');
          }
        }, 1500);
      } else {
        setMessage("Invalid credentials. Please try again.");
      }

    } catch (err) {
      setMessage(err.message || "Login failed. Please try again.");
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="container px-4">
        <div className="max-w-md mx-auto bg-black/80 p-8 rounded-xl shadow-xl border border-orange-600">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to continue to PG Made Easy</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-10 py-3 rounded-lg bg-black/50 border border-orange-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-10 py-3 rounded-lg bg-black/50 border border-orange-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {message && (
              <p className={`mt-2 text-sm ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-orange-500 hover:text-orange-400">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;