import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Setup = () => {
  const navigate = useNavigate();
  const [isSetup, setIsSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ' Solar EPC Pvt Ltd',
    companyCode: 'ATPL001',
    gstin: '',
    pan: '',
    address: '',
    state: '',
    city: ''
  });

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const res = await axios.get('/api/setup/check');
      setIsSetup(res.data.data.isSetup);
      if (res.data.data.isSetup) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Setup check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/setup/create-super-admin', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        companyCode: formData.companyCode,
        gstin: formData.gstin,
        pan: formData.pan,
        address: formData.address,
        state: formData.state,
        city: formData.city
      });

      if (res.data.success) {
        toast.success('Super Admin created successfully!');
        toast.success('Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isSetup) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-solar-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-solar-100 mb-4">
            <Sun className="w-8 h-8 text-solar-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900"> Solar EPC</h1>
          <p className="text-gray-500 mt-1">First Time Setup - Create Super Admin</p>
        </div>

        <div className="card">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Welcome to First Time Setup</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This is a one-time setup to create your Super Admin account.
                  After this, you can login and create other users.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Super Admin Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">1</span>
                Super Admin Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required placeholder="admin@atpl.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="input-field pr-10" required minLength={6} placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field" required placeholder="Confirm password" />
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-solar-100 text-solar-600 flex items-center justify-center text-sm font-bold">2</span>
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="input-field" required placeholder="Company name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Code *</label>
                  <input type="text" name="companyCode" value={formData.companyCode} onChange={handleChange} className="input-field" required placeholder="e.g. ATPL001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                  <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} className="input-field" placeholder="22AAAAA0000A1Z5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
                  <input type="text" name="pan" value={formData.pan} onChange={handleChange} className="input-field" placeholder="AAAAA0000A" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} className="input-field" rows="2" placeholder="Company address"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="input-field" placeholder="State" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" placeholder="City" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> This setup can only be done once. After creating the Super Admin,
                you will be redirected to the login page. Make sure to remember your email and password!
              </p>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Super Admin...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Create Super Admin & Setup System
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setup;
