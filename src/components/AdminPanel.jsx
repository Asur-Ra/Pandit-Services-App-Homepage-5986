import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLock, FiSave, FiEye, FiEyeOff, FiEdit, FiHome, FiTrendingUp, FiDownload, FiGlobe, FiUpload } = FiIcons;

const AdminPanel = ({ businessData, updateBusinessData, isAuthenticated, setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(businessData);
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  
  // Update formData when businessData changes (important for persistence)
  useEffect(() => {
    setFormData(businessData);
  }, [businessData]);

  const handleLogin = (e) => {
    e.preventDefault();
    // The password is intentionally hardcoded and not visible in the UI
    const adminPassword = atob('c3lzdHVt'); // Base64 encoded "systum"
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }

      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        const newAppFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64String
        };
        
        handleInputChange('appFile', newAppFile);
        setSaveStatus('APK file ready to save. Click Save Changes to update.');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('Saving changes...');
      await updateBusinessData(formData);
      setSaveStatus('Changes saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus('Error saving changes. Please try again.');
      setTimeout(() => setSaveStatus(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const goToHomepage = () => {
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiLock} className="text-2xl text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
            <p className="text-gray-600 mt-2">Enter password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
            >
              Access Admin Panel
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={goToHomepage}
              className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2 mx-auto"
            >
              <SafeIcon icon={FiHome} />
              Back to Homepage
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-orange-100">Manage your business information</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={goToHomepage}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                >
                  <SafeIcon icon={FiHome} />
                  View Site
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Business Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <SafeIcon icon={FiEdit} className="text-orange-600" />
                  Business Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName || ''}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.websiteUrl || ''}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {/* Links & Stats */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Links & Social Media
                </h3>

                {/* App Upload Section */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <SafeIcon icon={FiDownload} className="text-blue-600" />
                    App Download
                  </h4>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App Name
                    </label>
                    <input
                      type="text"
                      value={formData.appName || ''}
                      onChange={(e) => handleInputChange('appName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your App Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload APK File
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".apk"
                      className="hidden"
                    />
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={triggerFileInput}
                        className="bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        disabled={isSaving}
                      >
                        <SafeIcon icon={FiUpload} />
                        Select APK File
                      </button>
                      {formData.appFile && (
                        <div className="text-sm text-gray-600 bg-blue-100 p-3 rounded-lg">
                          <div className="font-medium">Current file:</div>
                          <div className="truncate">{formData.appFile.name || 'app.apk'}</div>
                          {formData.appFile.size && (
                            <div>{(formData.appFile.size / 1024 / 1024).toFixed(2)} MB</div>
                          )}
                          <div className="text-xs text-green-600 mt-1">
                            {formData.appFile.data ? '✓ File ready to upload' : '✓ File available for download'}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload your APK file here for direct downloads (max size: 50MB)
                    </p>
                  </div>

                  {/* Alternative Play Store Link */}
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternative Play Store URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.appUrl || ''}
                      onChange={(e) => handleInputChange('appUrl', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://play.google.com/store/apps/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagramUrl || ''}
                    onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={formData.facebookUrl || ''}
                    onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://facebook.com/yourbusiness"
                  />
                </div>

                {/* Trust Building Stats */}
                <div className="bg-orange-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <SafeIcon icon={FiTrendingUp} className="text-orange-600" />
                    Trust Building Stats
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Pandits
                      </label>
                      <input
                        type="number"
                        value={formData.totalPandits || ''}
                        onChange={(e) => handleInputChange('totalPandits', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Happy Customers
                      </label>
                      <input
                        type="number"
                        value={formData.happyCustomers || ''}
                        onChange={(e) => handleInputChange('happyCustomers', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3">
                    💡 These numbers appear on your homepage to build trust with visitors
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex flex-col items-center gap-4">
              {saveStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-medium ${saveStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}
                >
                  {saveStatus}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className={`${isSaving ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'} text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2`}
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiSave} />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;