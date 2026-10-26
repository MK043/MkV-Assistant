import React, { useState, useMemo } from 'react';
import {
  Shield,
  TrendingUp,
  Edit3,
  Copy,
  Trash2,
  Download,
  RefreshCw,
  Activity,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  X,
  CheckSquare,
  SlidersHorizontal,
  Search,
  Plus,
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useApp } from '../../context/AppContext';
import styles from './Campaigns.module.css';

export default function Campaigns() {
  const {
    campaigns,
    handleToggleCampaign,
    handleDuplicateCampaign,
    handleDeleteCampaign,
    handleSimulateLiveTick,
    handleUpdateCampaign,
    setEditingCampaign,
    liveAlert,
    liveSyncActive,
    setLiveSyncActive,
    searchQuery,
    setSearchQuery,
    setIsCreateModalOpen,
  } = useApp();

  // Status & Platform Filtering
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'paused'
  const [platformFilter, setPlatformFilter] = useState('all'); // 'all' | 'Meta Ads' | 'TikTok Ads'

  // Interactive sorting state
  const [sortField, setSortField] = useState('spend'); // 'name' | 'platform' | 'budget' | 'spend' | 'cpa' | 'roas'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState([]);

  // Expandable Auction Details Drawer
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Auto-rules switches
  const [cpaGuardActive, setCpaGuardActive] = useState(true);
  const [roasScalerActive, setRoasScalerActive] = useState(true);

  // Helper number parsers for sorting
  const getCpaNumber = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  };

  const getRoasNumber = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  };

  // Dynamic Filtering by tab, platform and search
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      // Tab filter (Status)
      if (activeTab === 'active' && !c.active) return false;
      if (activeTab === 'paused' && c.active) return false;

      // Platform filter
      if (platformFilter !== 'all' && c.platform !== platformFilter) return false;

      // Search query filter
      if (searchQuery.trim() && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [campaigns, activeTab, platformFilter, searchQuery]);

  // Dynamic Sorting
  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'cpa') {
        valA = getCpaNumber(a.cpa);
        valB = getCpaNumber(b.cpa);
      } else if (sortField === 'roas') {
        valA = getRoasNumber(a.roas);
        valB = getRoasNumber(b.roas);
      } else if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredCampaigns, sortField, sortDirection]);

  // Counts
  const totalCount = campaigns.length;
  const activeCount = campaigns.filter((c) => c.active).length;
  const pausedCount = campaigns.filter((c) => !c.active).length;
  const metaCount = campaigns.filter((c) => c.platform === 'Meta Ads').length;
  const tikTokCount = campaigns.filter((c) => c.platform === 'TikTok Ads').length;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // Metric columns default to descending sort, string to ascending
      setSortDirection(['budget', 'spend', 'roas', 'cpa'].includes(field) ? 'desc' : 'asc');
    }
  };

  // In-line fast budget scaler (+10% / -10%)
  const handleQuickScale = async (campaign, percentChange) => {
    const currentBudget = Number(campaign.budget) || 50;
    const newBudget = Math.max(10, Math.round(currentBudget * (1 + percentChange / 100)));
    await handleUpdateCampaign(campaign.id, { budget: newBudget });
  };

  // Bulk actions handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredCampaigns.length && filteredCampaigns.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCampaigns.map((c) => c.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkToggleActive = async (targetActive) => {
    for (const id of selectedIds) {
      const campaign = campaigns.find((c) => c.id === id);
      if (campaign && campaign.active !== targetActive) {
        await handleToggleCampaign(id);
      }
    }
  };

  const handleBulkScaleBudget = async (percentChange) => {
    for (const id of selectedIds) {
      const campaign = campaigns.find((c) => c.id === id);
      if (campaign) {
        const currentBudget = Number(campaign.budget) || 50;
        const newBudget = Math.max(10, Math.round(currentBudget * (1 + percentChange / 100)));
        await handleUpdateCampaign(id, { budget: newBudget });
      }
    }
  };

  const handleExportCsv = (customList = campaigns) => {
    const headers = ['ID,Назва кампанії,Платформа,Добовий бюджет ($),Витрати ($),Ліди,CPA ($),ROAS,Статус'];
    const rows = customList.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.platform}"`,
      c.budget,
      c.spend,
      c.leads || 0,
      c.cpa,
      c.roas,
      c.active ? 'Активна' : 'На паузі',
    ].join(','));
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MkV_Campaigns_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkExportSelected = () => {
    const selectedList = campaigns.filter((c) => selectedIds.includes(c.id));
    handleExportCsv(selectedList);
  };

  const formatBudget = (val) => {
    if (typeof val === 'number') return `$${val.toFixed(2)} / день`;
    return String(val);
  };

  const formatSpend = (val) => {
    if (typeof val === 'number') {
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return String(val);
  };

  const formatCpa = (val) => {
    if (typeof val === 'number') return `$${val.toFixed(2)}`;
    return String(val);
  };

  const formatRoas = (val) => {
    if (typeof val === 'number') return `${val.toFixed(2)}x`;
    return String(val);
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className={styles.sortIconMuted} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={12} className={styles.sortIconActive} />
    ) : (
      <ArrowDown size={12} className={styles.sortIconActive} />
    );
  };

  const allFilteredSelected =
    filteredCampaigns.length > 0 && selectedIds.length === filteredCampaigns.length;

  return (
    <div>
      <Navbar
        title="Управління рекламними кампаніями"
        subtitle="Медіабаїнг, оптимізація аукціонів та автоправила"
      />

      <div className={styles.container}>
        {liveAlert && (
          <div className={styles.alertBanner}>
            <Activity size={16} />
            <span>{liveAlert}</span>
          </div>
        )}

        {/* Clean & Structured Toolbar (Organized Search, Tabs & Platform Selector) */}
        <div className={styles.topBar}>
          <div className={styles.filtersGroup}>
            {/* Real In-Page Search Box */}
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Пошук кампанії за назвою..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery('')}
                  title="Очистити пошук"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Status Segmented Tabs */}
            <div className={styles.segmentedControl}>
              <button
                type="button"
                className={`${styles.segmentBtn} ${activeTab === 'all' ? styles.segmentBtnActive : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Всі ({totalCount})
              </button>
              <button
                type="button"
                className={`${styles.segmentBtn} ${activeTab === 'active' ? styles.segmentBtnActive : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Активні ({activeCount})
              </button>
              <button
                type="button"
                className={`${styles.segmentBtn} ${activeTab === 'paused' ? styles.segmentBtnActive : ''}`}
                onClick={() => setActiveTab('paused')}
              >
                На паузі ({pausedCount})
              </button>
            </div>

            {/* Platform Filter Pills */}
            <div className={styles.platformFilterGroup}>
              <button
                type="button"
                className={`${styles.filterPill} ${platformFilter === 'all' ? styles.filterPillActive : ''}`}
                onClick={() => setPlatformFilter('all')}
              >
                Всі канали
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${platformFilter === 'Meta Ads' ? styles.filterPillActive : ''}`}
                onClick={() => setPlatformFilter('Meta Ads')}
              >
                Meta Ads ({metaCount})
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${platformFilter === 'TikTok Ads' ? styles.filterPillActive : ''}`}
                onClick={() => setPlatformFilter('TikTok Ads')}
              >
                TikTok Ads ({tikTokCount})
              </button>
            </div>
          </div>

          <div className={styles.actionsWrapper}>
            <button
              type="button"
              className={styles.primaryCreateBtn}
              onClick={() => setIsCreateModalOpen(true)}
              title="Створити нову рекламну кампанію"
            >
              <Plus size={15} />
              <span>Створити кампанію</span>
            </button>

            <button
              type="button"
              className={`${styles.secondaryBtn} ${liveSyncActive ? styles.liveBtnActive : ''}`}
              onClick={() => setLiveSyncActive(!liveSyncActive)}
              title="Автоматичний пульс лідів кожні 7 секунд"
            >
              <Activity size={14} />
              <span>{liveSyncActive ? '● Live Sync (Увімк)' : 'Live Sync'}</span>
            </button>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleSimulateLiveTick}
              title="Оновити витрати та отримати нові заявки"
            >
              <RefreshCw size={14} />
              <span>Пульс метрик</span>
            </button>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => handleExportCsv(campaigns)}
              title="Завантажити повний звіт кампаній у CSV"
            >
              <Download size={14} />
              <span>Експорт CSV</span>
            </button>
          </div>
        </div>

        {/* Floating Bulk Action Bar when campaigns are selected */}

        {/* Floating Bulk Action Bar when campaigns are selected */}
        {selectedIds.length > 0 && (
          <div className={styles.bulkActionBar}>
            <div className={styles.bulkInfo}>
              <CheckSquare size={16} className={styles.bulkIcon} />
              <span>
                Вибрано кампаній: <strong>{selectedIds.length}</strong> з {filteredCampaigns.length}
              </span>
            </div>
            <div className={styles.bulkActions}>
              <button
                type="button"
                className={styles.bulkActionBtn}
                onClick={() => handleBulkToggleActive(true)}
                title="Увімкнути вибрані кампанії"
              >
                <Play size={13} />
                <span>Увімкнути</span>
              </button>
              <button
                type="button"
                className={styles.bulkActionBtn}
                onClick={() => handleBulkToggleActive(false)}
                title="Поставити на паузу вибрані"
              >
                <Pause size={13} />
                <span>На паузу</span>
              </button>
              <button
                type="button"
                className={styles.bulkActionBtn}
                onClick={() => handleBulkScaleBudget(10)}
                title="Масштабувати бюджет на +10%"
              >
                <TrendingUp size={13} />
                <span>+10% Бюджет</span>
              </button>
              <button
                type="button"
                className={styles.bulkActionBtn}
                onClick={() => handleBulkScaleBudget(-10)}
                title="Зменшити бюджет на -10%"
              >
                <TrendingUp size={13} style={{ transform: 'rotate(180deg)' }} />
                <span>-10% Бюджет</span>
              </button>
              <button
                type="button"
                className={styles.bulkActionBtn}
                onClick={handleBulkExportSelected}
                title="Експорт лише вибраних кампаній"
              >
                <Download size={13} />
                <span>Експорт</span>
              </button>
              <button
                type="button"
                className={styles.bulkClearBtn}
                onClick={() => setSelectedIds([])}
                title="Скинути виділення"
              >
                <X size={14} />
                <span>Скинути</span>
              </button>
            </div>
          </div>
        )}

        {/* Campaigns Table with Sorting & Row Accordion */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle}>Активні рекламні кампанії та медіабаїнг</h2>
            <div className={styles.cardMetaBadge}>
              <SlidersHorizontal size={13} />
              <span>Клікніть на стовпець для сортування або на стрілку для перегляду аналітики аукціону</span>
            </div>
          </div>

          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '42px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      className={styles.customCheckbox}
                      checked={allFilteredSelected}
                      onChange={handleToggleSelectAll}
                      title="Вибрати всі відфільтровані кампанії"
                    />
                  </th>
                  <th className={styles.thSortable} style={{ width: '25%' }} onClick={() => handleSort('name')}>
                    <div className={styles.thContent}>
                      <span>НАЗВА КАМПАНІЇ</span>
                      {renderSortIndicator('name')}
                    </div>
                  </th>
                  <th className={styles.thSortable} style={{ width: '13%' }} onClick={() => handleSort('platform')}>
                    <div className={styles.thContent}>
                      <span>ПЛАТФОРМА</span>
                      {renderSortIndicator('platform')}
                    </div>
                  </th>
                  <th className={styles.thSortable} style={{ width: '16%' }} onClick={() => handleSort('budget')}>
                    <div className={styles.thContent}>
                      <span>ДОБОВИЙ БЮДЖЕТ</span>
                      {renderSortIndicator('budget')}
                    </div>
                  </th>
                  <th className={styles.thSortable} style={{ width: '12%' }} onClick={() => handleSort('spend')}>
                    <div className={styles.thContent}>
                      <span>ВИТРАТИ</span>
                      {renderSortIndicator('spend')}
                    </div>
                  </th>
                  <th className={styles.thSortable} style={{ width: '10%' }} onClick={() => handleSort('cpa')}>
                    <div className={styles.thContent}>
                      <span>CPA (ЛІД)</span>
                      {renderSortIndicator('cpa')}
                    </div>
                  </th>
                  <th className={styles.thSortable} style={{ width: '8%' }} onClick={() => handleSort('roas')}>
                    <div className={styles.thContent}>
                      <span>ROAS</span>
                      {renderSortIndicator('roas')}
                    </div>
                  </th>
                  <th style={{ width: '65px', textAlign: 'center' }}>СТАТУС</th>
                  <th style={{ width: '125px', textAlign: 'right' }}>ДІЇ ТАРГЕТОЛОГА</th>
                </tr>
              </thead>
              <tbody>
                {sortedCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      Не знайдено кампаній за вибраними критеріями фільтрації.
                    </td>
                  </tr>
                ) : (
                  sortedCampaigns.map((c) => {
                    const isSelected = selectedIds.includes(c.id);
                    const isExpanded = expandedRowId === c.id;
                    const cpaNum = getCpaNumber(c.cpa);
                    const roasNum = getRoasNumber(c.roas);

                    return (
                      <React.Fragment key={c.id}>
                        <tr className={`${isSelected ? styles.rowSelected : ''} ${isExpanded ? styles.rowExpandedHead : ''}`}>
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              className={styles.customCheckbox}
                              checked={isSelected}
                              onChange={() => handleToggleSelectOne(c.id)}
                            />
                          </td>
                          <td>
                            <div className={styles.campaignNameCol}>
                              <button
                                type="button"
                                className={styles.rowChevronBtn}
                                onClick={() => setExpandedRowId(isExpanded ? null : c.id)}
                                title="Розкрити деталі аукціону та рекомендації"
                              >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                              <span className={styles.campaignName}>{c.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`${styles.platformPill} ${!c.isMeta ? styles.platformTikTok : ''}`}>
                              {c.platform}
                            </span>
                          </td>
                          <td>
                            <div className={styles.budgetContainer}>
                              <span className={styles.budgetVal}>{formatBudget(c.budget)}</span>
                              <div className={styles.budgetScalerGroup}>
                                <button
                                  type="button"
                                  className={styles.scalerBtn}
                                  title="Знизити бюджет на -10%"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickScale(c, -10);
                                  }}
                                >
                                  -10%
                                </button>
                                <button
                                  type="button"
                                  className={styles.scalerBtn}
                                  title="Підвищити бюджет на +10%"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickScale(c, 10);
                                  }}
                                >
                                  +10%
                                </button>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{formatSpend(c.spend)}</td>
                          <td style={{ color: cpaNum > 15 ? 'var(--color-danger)' : 'inherit' }}>
                            {formatCpa(c.cpa)}
                          </td>
                          <td>
                            <span
                              className={styles.roasVal}
                              style={{ color: roasNum >= 3.0 ? 'var(--color-success)' : 'var(--color-danger)' }}
                            >
                              {formatRoas(c.roas)}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                checked={c.active}
                                onChange={() => handleToggleCampaign(c.id)}
                              />
                              <span className={styles.slider} />
                            </label>
                          </td>
                          <td>
                            <div className={styles.rowActions}>
                              <button
                                type="button"
                                className={`${styles.iconBtn} ${isExpanded ? styles.iconBtnActive : ''}`}
                                title="Аукціонна діагностика"
                                onClick={() => setExpandedRowId(isExpanded ? null : c.id)}
                              >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                              <button
                                type="button"
                                className={styles.iconBtn}
                                title="Редагувати параметри кампанії"
                                onClick={() => setEditingCampaign(c)}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                className={styles.iconBtn}
                                title="Дублювати кампанію"
                                onClick={() => handleDuplicateCampaign(c.id)}
                              >
                                <Copy size={14} />
                              </button>
                              <button
                                type="button"
                                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                title="Видалити або архівувати"
                                onClick={() => handleDeleteCampaign(c.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Auction Metrics Drawer */}
                        {isExpanded && (
                          <tr className={styles.drawerRow}>
                            <td colSpan={9} className={styles.drawerCell}>
                              <div className={styles.drawerContent}>
                                <div className={styles.drawerHeader}>
                                  <div className={styles.drawerHeaderTitle}>
                                    <Activity size={16} className={styles.drawerIcon} />
                                    <span>
                                      Аукціонні показники та AI-діагностика: <strong>{c.name}</strong>
                                    </span>
                                  </div>
                                  <span className={styles.bidStrategyBadge}>
                                    Стратегія ставок: Lowest Cost (Автоматична)
                                  </span>
                                </div>

                                <div className={styles.auctionMetricsGrid}>
                                  <div className={styles.auctionCard}>
                                    <span className={styles.auctionCardLabel}>CTR (Клікабельність)</span>
                                    <div className={styles.auctionCardValRow}>
                                      <span className={styles.auctionCardVal}>
                                        {(2.1 + ((c.id * 37) % 15) / 10).toFixed(2)}%
                                      </span>
                                      <span className={styles.metricBadgePositive}>Вище норми</span>
                                    </div>
                                    <span className={styles.auctionCardSub}>Бенчмарк ніші: 1.45%</span>
                                  </div>

                                  <div className={styles.auctionCard}>
                                    <span className={styles.auctionCardLabel}>CPM (Ціна 1k показів)</span>
                                    <div className={styles.auctionCardValRow}>
                                      <span className={styles.auctionCardVal}>
                                        ${(4.2 + ((c.id * 65) % 25) / 10).toFixed(2)}
                                      </span>
                                      <span className={styles.metricBadgeNeutral}>Оптимальний</span>
                                    </div>
                                    <span className={styles.auctionCardSub}>Конкуренція аукціону: Помірна</span>
                                  </div>

                                  <div className={styles.auctionCard}>
                                    <span className={styles.auctionCardLabel}>Частота показу (Frequency)</span>
                                    <div className={styles.auctionCardValRow}>
                                      <span className={styles.auctionCardVal}>
                                        {(1.3 + ((c.spend || 100) / 3200) % 1.2).toFixed(2)}x
                                      </span>
                                      <span
                                        className={
                                          (1.3 + ((c.spend || 100) / 3200) % 1.2) > 2.2
                                            ? styles.metricBadgeWarning
                                            : styles.metricBadgePositive
                                        }
                                      >
                                        {(1.3 + ((c.spend || 100) / 3200) % 1.2) > 2.2
                                          ? 'Ризик вигорання'
                                          : 'Без вигорання'}
                                      </span>
                                    </div>
                                    <span className={styles.auctionCardSub}>Аудиторія ще не виснажена</span>
                                  </div>

                                  <div className={styles.auctionCard}>
                                    <span className={styles.auctionCardLabel}>Охоплення / Покази</span>
                                    <div className={styles.auctionCardValRow}>
                                      <span className={styles.auctionCardVal}>
                                        {Math.round((c.spend || 100) * 185).toLocaleString()}
                                      </span>
                                      <span className={styles.metricBadgeNeutral}>
                                        {Math.round((c.spend || 100) * 240).toLocaleString()} показів
                                      </span>
                                    </div>
                                    <span className={styles.auctionCardSub}>
                                      Конверсія сторінки (CR): {(5.2 + ((c.id * 8) % 35) / 10).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>

                                <div className={styles.aiRecommendationBox}>
                                  <div className={styles.aiRecHeader}>
                                    <TrendingUp size={15} />
                                    <span>AI-рекомендація медіабаєру:</span>
                                  </div>
                                  <p className={styles.aiRecText}>
                                    {roasNum >= 4.0
                                      ? `Кампанія демонструє надвисоку окупність (${formatRoas(c.roas)}). Рекомендується масштабувати денний бюджет на +15% кожні 48 годин для стабільного збереження ціни за конверсію.`
                                      : cpaNum > 15
                                      ? `Ціна ліда (${formatCpa(c.cpa)}) вища за комфортний таргет ($15.00). Рекомендується замінити перші 3 секунди креативу в Creative Studio або розширити таргетинг.`
                                      : `Кампанія працює в межах цільового бенчмарку (CPA: ${formatCpa(c.cpa)}, ROAS: ${formatRoas(c.roas)}). Автоматичні правила утримують аукціон у безпечній зоні.`}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Auto-Rules Section */}
        <h2 className={styles.rulesSectionTitle}>Автоматичні правила захисту бюджету (Auto-Rules)</h2>
        <div className={styles.rulesGrid}>
          {/* Rule 1 */}
          <div className={styles.ruleCard}>
            <div>
              <div className={styles.ruleHeader}>
                <div className={styles.ruleTitleWrapper}>
                  <Shield size={18} className={styles.ruleIcon} />
                  <span className={styles.ruleTitle}>Захист від зливу: CPA Guard (&gt; $15.00)</span>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={cpaGuardActive}
                    onChange={() => setCpaGuardActive(!cpaGuardActive)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
              <p className={styles.ruleCondition}>
                <strong>Умова:</strong> якщо за останні 6 годин вартість заявки перевищує $15.00, кампанія миттєво ставиться на паузу.
              </p>
            </div>
            <div className={styles.ruleSavedBadge}>
              Врятовано: $340.00
            </div>
          </div>

          {/* Rule 2 */}
          <div className={styles.ruleCard}>
            <div>
              <div className={styles.ruleHeader}>
                <div className={styles.ruleTitleWrapper}>
                  <TrendingUp size={18} className={styles.ruleIcon} />
                  <span className={styles.ruleTitle}>Авто-масштабування: ROAS Scaler (&gt; 4.0x)</span>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={roasScalerActive}
                    onChange={() => setRoasScalerActive(!roasScalerActive)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
              <p className={styles.ruleCondition}>
                <strong>Умова:</strong> якщо кампанія приносить ROAS понад 4.0x при мінімум 10 конверсіях, добовий бюджет зростає на +20%.
              </p>
            </div>
            <div
              className={styles.ruleSavedBadge}
              style={{
                color: 'var(--color-success)',
                borderColor: 'var(--color-success-border)',
                backgroundColor: 'var(--color-success-bg)',
              }}
            >
              Приріст лідів: +18%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
