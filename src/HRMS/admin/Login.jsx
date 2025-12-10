import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";
import { adminAuthAPI } from '../../utils/api';
import { IMAGE_ASSETS } from '../../constants/ImageContants';
import { ROUTES } from '../../constants/RoutesContants';


const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    admin_email: 'devanbhensdadiya123@gmail.com',
    admin_password: 'test'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if already logged in and verify token
  useEffect(() => {
    const checkAuth = async () => {
      const adminToken = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');

      if (adminToken && adminData) {
        try {
          // Verify token by making a profile request
          await adminAuthAPI.getProfile(adminToken);
          // Token is valid, redirect to dashboard
          navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminAuthAPI.login(
        formData.admin_email, 
        formData.admin_password
      );

      const data = response.data;

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <Icon icon="mdi:loading" className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-primary items-center justify-center bg-stone-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-primary-card-light rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="w-full flex items-center justify-center py-2">
              <img src={IMAGE_ASSETS.LOGO} alt="Logo" className='w-58' />
            </div>
            <div className='w-full border-b border-stone-700 py-2'/>
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-800/30 rounded">
                <Icon icon="mdi:alert-circle" className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:email-outline" className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="admin_email"
                  value={formData.admin_email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="block w-full pl-10 pr-4 py-2.5 rounded-lg bg-stone-900 border border-gray-700 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none placeholder-gray-500 autofill:bg-stone-900 autofill:text-white [&:-webkit-autofill]:bg-stone-900 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgb(28_25_23)_inset] [&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_rgb(28_25_23)_inset] [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_rgb(28_25_23)_inset]"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:lock-outline" className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="admin_password"
                  value={formData.admin_password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-12 py-2.5 bg-stone-900 border border-gray-700 text-white rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-colors outline-none placeholder-gray-500 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgb(28_25_23)_inset] [&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_rgb(28_25_23)_inset] [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_rgb(28_25_23)_inset]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <Icon icon="mdi:eye-off-outline" className="h-5 w-5" />
                  ) : (
                    <Icon icon="mdi:eye-outline" className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon icon="mdi:loading" className="animate-spin h-5 w-5" />
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
