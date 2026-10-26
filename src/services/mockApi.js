// Mock API Service for MkV Sales Manager CRM
// Simulates asynchronous REST API calls with LocalStorage persistence
import { generateSmartStoryboard } from './aiScriptEngine';

const STORAGE_KEYS = {
  CAMPAIGNS: 'mkv_campaigns_v1',
  STORYBOARD: 'mkv_storyboard_v1',
  FATIGUE: 'mkv_fatigue_v1',
  RULES: 'mkv_rules_v1',
  USER: 'mkv_user_v1',
};

const initialCampaigns = [
  { id: 1, name: 'EcoCream_Broad_Traffic', platform: 'Meta Ads', isMeta: true, budget: 150, spend: 4120, leads: 396, cpa: 10.40, roas: 4.20, active: true },
  { id: 2, name: 'TikTok_Spark_TopHook', platform: 'TikTok Ads', isMeta: false, budget: 100, spend: 2650, leads: 270, cpa: 9.80, roas: 4.50, active: true },
  { id: 3, name: 'Retargeting_Catalog_UA', platform: 'Meta Ads', isMeta: true, budget: 60, spend: 1280, leads: 106, cpa: 12.10, roas: 3.80, active: true },
  { id: 4, name: 'Promo_BlackFriday_Teaser', platform: 'TikTok Ads', isMeta: false, budget: 50, spend: 840, leads: 44, cpa: 18.90, roas: 1.80, active: false },
  { id: 5, name: 'Old_Creative_Test_PL', platform: 'Meta Ads', isMeta: true, budget: 30, spend: 420, leads: 26, cpa: 16.20, roas: 2.10, active: false },
];

const initialStoryboard = {
  title: 'EcoCosmetics — Ранковий догляд',
  duration: '20 секунд',
  product: 'Натуральна сироватка для обличчя',
  hookType: 'Проблема → Рішення (Problem-Solution)',
  tone: 'Дружня, експертна, без реклами в лоб',
  scenes: [
    {
      number: 1,
      time: '0–3с',
      title: 'Хук (Привернення 80% уваги)',
      visual: 'Крупний план обличчя в дзеркалі, дівчина розчаровано змиває водою звичайний крем.',
      quote: '«Чому твій крем забиває пори, а не зволожує? Якщо шкіра досі тьмяна — викинь його...»',
      tag: 'Hold Rate ціль: > 40%',
    },
    {
      number: 2,
      time: '4–14с',
      title: 'Демонстрація проблеми та засобу',
      visual: 'Кадр з текстурою легкої сироватки з пептидами. Швидке вбирання, миттєве сяйво без липкості.',
      quote: '«100% рослинні пептиди проникають глибоко в дерму. Замінює 3 звичайні баночки щоранку.»',
      tag: 'Демонстрація продукту',
    },
    {
      number: 3,
      time: '15–20с',
      title: 'Заклик до дії (Конверсія / Офер)',
      visual: 'Фірмова баночка поруч зі стрілкою на кнопку замовлення. Плашка зі знижкою -25%.',
      quote: '«Тисни на посилання під відео та забирай набір зі знижкою 25% і безкоштовною доставкою!»',
      tag: 'Офер: Знижка -25%',
    },
  ],
};

const initialFatigue = {
  score: 24,
  statusLabel: 'Норма',
  frequency: '1.8x',
  creatives: [
    { id: 1, name: 'EcoCream_Hook_Curiosity', platform: 'Meta Reels', holdRate: '48.2%', freq: '1.6x', status: 'effective', action: 'Масштабувати' },
    { id: 2, name: 'TikTok_Spark_Review', platform: 'TikTok Ads', holdRate: '39.5%', freq: '2.1x', status: 'stable', action: 'Спостереження' },
    { id: 3, name: 'SummerSale_OldHook', platform: 'TikTok / Reels', holdRate: '14.8%', freq: '3.4x', status: 'fatigued', action: 'Замінити хук ⚡' },
  ],
};

function getStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export const mockApi = {
  // --- CAMPAIGNS ---
  async getCampaigns() {
    await new Promise((r) => setTimeout(r, 120));
    return getStorage(STORAGE_KEYS.CAMPAIGNS, initialCampaigns);
  },

  async addCampaign(newCampaign) {
    await new Promise((r) => setTimeout(r, 200));
    const current = getStorage(STORAGE_KEYS.CAMPAIGNS, initialCampaigns);
    const created = {
      id: Date.now(),
      name: newCampaign.name || 'New_Campaign_Auto',
      platform: newCampaign.platform || 'Meta Ads',
      isMeta: newCampaign.platform !== 'TikTok Ads',
      budget: Number(newCampaign.budget) || 100,
      spend: 0,
      leads: 0,
      cpa: 0,
      roas: Number(newCampaign.roasTarget) || 3.50,
      active: true,
    };
    const updated = [created, ...current];
    setStorage(STORAGE_KEYS.CAMPAIGNS, updated);
    return created;
  },

  async toggleCampaign(id) {
    await new Promise((r) => setTimeout(r, 80));
    const current = getStorage(STORAGE_KEYS.CAMPAIGNS, initialCampaigns);
    const updated = current.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
    setStorage(STORAGE_KEYS.CAMPAIGNS, updated);
    return updated.find((c) => c.id === id);
  },

  async updateCampaign(id, fields) {
    await new Promise((r) => setTimeout(r, 150));
    const current = getStorage(STORAGE_KEYS.CAMPAIGNS, initialCampaigns);
    const updated = current.map((c) => {
      if (c.id === id) {
        const budgetNum = Number(fields.budget) || c.budget;
        const roasNum = Number(fields.roas) || c.roas;
        return {
          ...c,
          ...fields,
          budget: budgetNum,
          roas: roasNum,
          isMeta: fields.platform ? fields.platform !== 'TikTok Ads' : c.isMeta,
        };
      }
      return c;
    });
    setStorage(STORAGE_KEYS.CAMPAIGNS, updated);
    return updated.find((c) => c.id === id);
  },

  async duplicateCampaign(id) {
    await new Promise((r) => setTimeout(r, 120));
    const current = getStorage(STORAGE_KEYS.CAMPAIGNS, initialCampaigns);
    const original = current.find((c) => c.id === id);
    if (!original) return null;

    const copy = {
      ...original,
      id: Date.now(),
      name: `${original.name}_Copy`,
      spend: 0,
      leads: 0,
      active: true,
    };
    const updated = [copy, ...current];
    setStorage(STORAGE_KEYS.CAMPAIGNS, updated);
    return copy;
  },

  async deleteCampaign(id) {
    await new Promise((r) => setTimeout(r, 100));
    const current = getStorage(STORAGE_KEYS.CAMPAIGNS, initialCampaigns);
    const updated = current.filter((c) => c.id !== id);
    setStorage(STORAGE_KEYS.CAMPAIGNS, updated);
    return updated;
  },

  async simulateLiveTick() {
    await new Promise((r) => setTimeout(r, 100));
    const current = getStorage(STORAGE_KEYS.CAMPAIGNS, initialCampaigns);
    let totalAddedSpend = 0;
    let totalAddedLeads = 0;

    const updated = current.map((c) => {
      if (!c.active) return c;
      const spendInc = Math.round((Math.random() * 8 + 2) * 10) / 10;
      const leadInc = Math.random() > 0.45 ? 1 : 0;
      totalAddedSpend += spendInc;
      totalAddedLeads += leadInc;

      const newSpend = Math.round(((c.spend || 0) + spendInc) * 100) / 100;
      const newLeads = (c.leads || 0) + leadInc;
      const newCpa = newLeads > 0 ? Math.round((newSpend / newLeads) * 100) / 100 : c.cpa;
      const roasJitter = (Math.random() * 0.1 - 0.05);
      const newRoas = Math.max(1.0, Math.round((Number(c.roas || 3.5) + roasJitter) * 100) / 100);

      return {
        ...c,
        spend: newSpend,
        leads: newLeads,
        cpa: newCpa,
        roas: newRoas,
      };
    });

    setStorage(STORAGE_KEYS.CAMPAIGNS, updated);
    return {
      campaigns: updated,
      addedSpend: Math.round(totalAddedSpend * 100) / 100,
      addedLeads: totalAddedLeads,
    };
  },

  // --- STORYBOARD ---
  async getStoryboard() {
    await new Promise((r) => setTimeout(r, 100));
    return getStorage(STORAGE_KEYS.STORYBOARD, initialStoryboard);
  },

  async generateStoryboard(params) {
    await new Promise((r) => setTimeout(r, 600)); // realistic generation delay
    const generated = generateSmartStoryboard(params);
    setStorage(STORAGE_KEYS.STORYBOARD, generated);
    return generated;
  },

  async addCustomScene(scene) {
    await new Promise((r) => setTimeout(r, 100));
    const current = getStorage(STORAGE_KEYS.STORYBOARD, initialStoryboard);
    const scenes = current.scenes || [];
    const newNumber = scenes.length + 1;
    const newScene = {
      number: newNumber,
      time: scene.time || `Сцена ${newNumber}`,
      title: scene.title || `Додаткова сцена ${newNumber}`,
      visual: scene.visual || 'Візуальна дія на екрані',
      quote: scene.quote || 'Текст спікера або закадрова озвучка',
      tag: scene.tag || 'Користувацька сцена',
    };
    const updated = {
      ...current,
      scenes: [...scenes, newScene],
    };
    setStorage(STORAGE_KEYS.STORYBOARD, updated);
    return updated;
  },

  // --- FATIGUE DETECTOR ---
  async getFatigueData() {
    await new Promise((r) => setTimeout(r, 100));
    return getStorage(STORAGE_KEYS.FATIGUE, initialFatigue);
  },

  async rotateHook(selectedVariant) {
    await new Promise((r) => setTimeout(r, 300));
    const current = getStorage(STORAGE_KEYS.FATIGUE, initialFatigue);
    const updatedCreatives = current.creatives.map((c) => {
      if (c.id === 3) {
        return {
          ...c,
          name: `SummerSale_Rotated_${selectedVariant}`,
          holdRate: '38.4% (Відновлено ✓)',
          status: 'stable',
          action: 'Оновлено ✓',
        };
      }
      return c;
    });
    const updated = {
      ...current,
      score: 18,
      statusLabel: 'Оптимально',
      creatives: updatedCreatives,
    };
    setStorage(STORAGE_KEYS.FATIGUE, updated);
    return updated;
  },

  // --- AUTH ---
  async getUser() {
    return getStorage(STORAGE_KEYS.USER, {
      name: 'Михайло Багин',
      email: 'mykhailo.bahyn@student.uzhnu.edu.ua',
      role: 'Студент ІПЗ-1 • УжНУ',
      isLoggedIn: true,
    });
  },

  async login(email) {
    await new Promise((r) => setTimeout(r, 200));
    const user = {
      name: email.split('@')[0],
      email,
      role: 'Таргетолог / Медіабаєр',
      isLoggedIn: true,
    };
    setStorage(STORAGE_KEYS.USER, user);
    return user;
  },

  async logout() {
    const user = {
      name: 'Гість',
      email: 'unauthorized',
      role: 'Неавторизований',
      isLoggedIn: false,
    };
    setStorage(STORAGE_KEYS.USER, user);
    return user;
  },
};
