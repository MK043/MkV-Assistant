import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [storyboard, setStoryboard] = useState(null);
  const [fatigue, setFatigue] = useState(null);
  const [user, setUser] = useState({ name: 'Михайло Багин', email: 'mykhailo.bahyn@student.uzhnu.edu.ua', role: 'Студент ІПЗ-1 • УжНУ', isLoggedIn: true });
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatformFilter, setActivePlatformFilter] = useState('all'); // 'all' | 'Meta Ads' | 'TikTok Ads'
  const [dateRange, setDateRange] = useState('Останні 30 днів');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [cData, sData, fData, uData] = await Promise.all([
          mockApi.getCampaigns(),
          mockApi.getStoryboard(),
          mockApi.getFatigueData(),
          mockApi.getUser(),
        ]);
        setCampaigns(cData);
        setStoryboard(sData);
        setFatigue(fData);
        setUser(uData);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleCreateCampaign = async (campaignData) => {
    const created = await mockApi.addCampaign(campaignData);
    setCampaigns((prev) => [created, ...prev]);
  };

  const handleToggleCampaign = async (id) => {
    // optimistic update
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    await mockApi.toggleCampaign(id);
  };

  const handleGenerateStoryboard = async (params) => {
    const generated = await mockApi.generateStoryboard(params);
    setStoryboard(generated);
    return generated;
  };

  const handleRotateHook = async (selectedVariant) => {
    const updated = await mockApi.rotateHook(selectedVariant);
    setFatigue(updated);
  };

  const handleLogin = async (email) => {
    const loggedUser = await mockApi.login(email);
    setUser(loggedUser);
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    const guest = await mockApi.logout();
    setUser(guest);
  };

  const togglePlatform = (platform) => {
    setActivePlatformFilter((prev) => (prev === platform ? 'all' : platform));
  };

  return (
    <AppContext.Provider
      value={{
        campaigns,
        storyboard,
        fatigue,
        user,
        searchQuery,
        setSearchQuery,
        activePlatformFilter,
        togglePlatform,
        dateRange,
        setDateRange,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isLoading,
        handleCreateCampaign,
        handleToggleCampaign,
        handleGenerateStoryboard,
        handleRotateHook,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
