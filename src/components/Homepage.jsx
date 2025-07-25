import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSmartphone, FiInstagram, FiFacebook, FiPhone, FiMail, FiStar, FiUsers, FiHeart, FiSettings, FiGlobe, FiDownload } = FiIcons;

const Homepage = ({ businessData }) => {
  const handleLinkClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    if (businessData.appFile) {
      // If we have a URL from Supabase storage, use that
      if (businessData.appFile.url) {
        window.open(businessData.appFile.url, '_blank');
      } 
      // If we have a base64 data (from localStorage fallback), use that
      else if (businessData.appFile.data) {
        const link = document.createElement('a');
        link.href = businessData.appFile.data;
        link.download = businessData.appFile.name || 'app.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (businessData.appUrl) {
      // If no direct file, use the URL
      handleLinkClick(businessData.appUrl);
    } else {
      alert('App download is not available at the moment.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header - Clean without gear icon */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg"
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
              {businessData.businessName || 'PanditConnect'}
            </h1>
            <p className="text-gray-600 text-lg">
              Your Trusted Spiritual Connection Platform
            </p>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiHeart} className="text-3xl text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Connect with Verified Pandits
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {businessData.description || 'Connect with experienced and verified pandits for all your religious ceremonies and rituals.'}
            </p>
            {/* Stats - Now editable from admin */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                <SafeIcon icon={FiUsers} className="text-3xl text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{businessData.totalPandits || 0}+</div>
                <div className="text-gray-600">Verified Pandits</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                <SafeIcon icon={FiStar} className="text-3xl text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{businessData.happyCustomers || 0}+</div>
                <div className="text-gray-600">Happy Customers</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                <SafeIcon icon={FiHeart} className="text-3xl text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">24/7</div>
                <div className="text-gray-600">Support</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Download App Section */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="py-16 px-4 bg-gradient-to-r from-orange-500 to-red-500"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Download Our App
          </h3>
          <p className="text-xl text-orange-100 mb-8">
            Get instant access to verified pandits in your area
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-3"
            >
              <SafeIcon icon={FiDownload} className="text-2xl" />
              {businessData.appFile ? 'Download APK' : 'Download App'}
            </motion.button>
            
            {/* Website Button */}
            {businessData.websiteUrl && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLinkClick(businessData.websiteUrl)}
                className="bg-orange-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-3"
              >
                <SafeIcon icon={FiGlobe} className="text-2xl" />
                Visit Website
              </motion.button>
            )}
          </div>
          {businessData.appName && (
            <p className="text-orange-100 mt-4 text-lg">
              {businessData.appName} - Connect with trusted pandits anytime, anywhere
            </p>
          )}
        </div>
      </motion.section>

      {/* Social Media & Contact */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="py-16 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Connect With Us
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Social Media */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-lg p-8">
              <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Follow Us
              </h4>
              <div className="space-y-4">
                {businessData.instagramUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLinkClick(businessData.instagramUrl)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <SafeIcon icon={FiInstagram} className="text-2xl" />
                    Follow on Instagram
                  </motion.button>
                )}
                
                {businessData.facebookUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLinkClick(businessData.facebookUrl)}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <SafeIcon icon={FiFacebook} className="text-2xl" />
                    Follow on Facebook
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-lg p-8">
              <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Contact Us
              </h4>
              <div className="space-y-6">
                {businessData.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiPhone} className="text-xl text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Phone</div>
                      <div className="text-gray-600">{businessData.phone}</div>
                    </div>
                  </div>
                )}
                
                {businessData.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiMail} className="text-xl text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Email</div>
                      <div className="text-gray-600">{businessData.email}</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer with Admin Link */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-300">
            © 2024 {businessData.businessName || 'PanditConnect'}. All rights reserved.
          </p>
          <p className="text-gray-400 mt-2">
            Connecting devotees with trusted spiritual guides
          </p>
          {/* Admin Access in Footer */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <Link
              to="/admin"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors inline-flex items-center gap-2"
            >
              <SafeIcon icon={FiSettings} className="text-sm" />
              Business Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;