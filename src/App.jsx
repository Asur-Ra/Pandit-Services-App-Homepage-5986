import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import AdminPanel from './components/AdminPanel';
import './App.css';
import { fetchBusinessData, updateBusinessData as updateSupabaseBusinessData, transformDatabaseToAppFormat } from './lib/businessDataService';

function App() {
  const [businessData, setBusinessData] = useState({
    businessName: 'PanditConnect',
    description: 'Connect with experienced and verified pandits for all your religious ceremonies and rituals. Find the perfect pandit for your needs.',
    appUrl: '',
    appName: 'PanditConnect App',
    appFile: null,
    websiteUrl: 'https://panditconnect.com',
    instagramUrl: 'https://instagram.com/panditconnect',
    facebookUrl: 'https://facebook.com/panditconnect',
    phone: '+91 9876543210',
    email: 'contact@panditconnect.com',
    totalPandits: 500,
    happyCustomers: 1000
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        setIsLoading(true);
        const dbData = await fetchBusinessData();
        
        // If we have data from the database, use it
        if (dbData) {
          const formattedData = transformDatabaseToAppFormat(dbData);
          console.log('Loaded data from Supabase:', formattedData);
          setBusinessData(formattedData);
        } else {
          // Otherwise, try to load from localStorage as fallback
          try {
            const savedData = localStorage.getItem('panditBusinessData');
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              console.log('Loaded data from localStorage fallback:', parsedData);
              setBusinessData(parsedData);
              
              // Upload localStorage data to Supabase for future use
              await updateSupabaseBusinessData(parsedData);
            }
          } catch (localError) {
            console.error('Error loading data from localStorage:', localError);
          }
        }
      } catch (error) {
        console.error('Error loading business data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBusinessData();
  }, []);

  // Update business data both in Supabase and localStorage
  const updateBusinessData = async (newData) => {
    try {
      console.log('Updating business data:', newData);
      
      // Update Supabase first
      await updateSupabaseBusinessData(newData);
      
      // Then update local state
      setBusinessData(newData);
      
      // Also keep localStorage in sync as a fallback
      localStorage.setItem('panditBusinessData', JSON.stringify(newData));
      console.log('Data saved successfully');
      
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Routes>
          <Route 
            path="/" 
            element={<Homepage businessData={businessData} />} 
          />
          <Route 
            path="/admin" 
            element={
              <AdminPanel 
                businessData={businessData}
                updateBusinessData={updateBusinessData}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;