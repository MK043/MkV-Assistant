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
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [liveAlert, setLiveAlert] = useState(null);
  const [liveSyncActive, setLiveSyncActive] = useState(false);
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
    triggerAlert(`Кампанію «${created.name}» створено та активовано в аукціоні.`);
  };

  const handleUpdateCampaign = async (id, fields) => {
    const updated = await mockApi.updateCampaign(id, fields);
    setCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setEditingCampaign(null);
    triggerAlert(`Кампанію «${updated.name}» успішно оновлено.`);
  };

  const handleDuplicateCampaign = async (id) => {
    const duplicated = await mockApi.duplicateCampaign(id);
    if (duplicated) {
      setCampaigns((prev) => [duplicated, ...prev]);
      triggerAlert(`Створено дублікат кампанії «${duplicated.name}».`);
    }
  };

  const handleDeleteCampaign = async (id) => {
    const target = campaigns.find((c) => c.id === id);
    await mockApi.deleteCampaign(id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    triggerAlert(`Кампанію «${target?.name || id}» архівовано/видалено.`);
  };

  const handleSimulateLiveTick = async () => {
    const result = await mockApi.simulateLiveTick();
    setCampaigns(result.campaigns);
    triggerAlert(`Live Sync: +${result.addedLeads} лідів, +$${result.addedSpend} витрат зафіксовано в реальному часі.`);
  };

  const handleAddCustomScene = async (scene) => {
    const updated = await mockApi.addCustomScene(scene);
    setStoryboard(updated);
    triggerAlert(`Сцену №${updated.scenes.length} додано до розкадровки.`);
  };

  const triggerAlert = (message) => {
    setLiveAlert(message);
    setTimeout(() => {
      setLiveAlert((curr) => (curr === message ? null : curr));
    }, 4500);
  };

  // Background Live Sync Simulator
  useEffect(() => {
    if (!liveSyncActive) return;
    const interval = setInterval(() => {
      handleSimulateLiveTick();
    }, 7000);
    return () => clearInterval(interval);
  }, [liveSyncActive]);

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
        editingCampaign,
        setEditingCampaign,
        liveAlert,
        setLiveAlert,
        liveSyncActive,
        setLiveSyncActive,
        isLoading,
        handleCreateCampaign,
        handleUpdateCampaign,
        handleDuplicateCampaign,
        handleDeleteCampaign,
        handleSimulateLiveTick,
        handleAddCustomScene,
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
