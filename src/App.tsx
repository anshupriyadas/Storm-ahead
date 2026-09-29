import React, { useEffect, useState } from 'react';
import {
  CapAlert,
  GridLayerType,
  ModelType,
  PilotRegionConfig,
  PointNowcastProbe,
  RadarStation,
  SourceAdapterItem,
  StormCell,
  UserRole,
} from './types/nowcast';
import {
  fetchLiveOpenMeteoForRadars,
  getCellStateAtTime,
  INITIAL_CAP_ALERTS,
  INITIAL_RADAR_STATIONS,
  INITIAL_SOURCE_ADAPTERS,
  INITIAL_STORM_CELLS,
  PILOT_REGIONS,
  samplePointNowcast,
} from './data/stormEngine';
import { RadarCanvasViewport } from './components/RadarCanvasViewport';
import { CellInspectorPanel } from './components/CellInspectorPanel';
import { AlertInboxView } from './components/AlertInboxView';
import { VerificationView } from './components/VerificationView';
import { SourceAdaptersView } from './components/SourceAdaptersView';

type ActiveTab = 'NOWCAST_MAP' | 'ALERT_INBOX' | 'VERIFICATION' | 'ADAPTERS' | 'TOS' | 'PRIVACY';

const LEAD_STEPS = [-60, -40, -20, 0, 30, 60, 90, 120, 150, 180];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('NOWCAST_MAP');
  const [userRole, setUserRole] = useState<UserRole>('FORECASTER');
  const [selectedRegion, setSelectedRegion] = useState<PilotRegionConfig>(PILOT_REGIONS[0]);

  const [radars, setRadars] = useState<RadarStation[]>(INITIAL_RADAR_STATIONS);
  const [cells, setCells] = useState<StormCell[]>(INITIAL_STORM_CELLS);
  const [selectedCellId, setSelectedCellId] = useState<string>(INITIAL_STORM_CELLS[0].id);

  const [alerts, setAlerts] = useState<CapAlert[]>(INITIAL_CAP_ALERTS);
  const [selectedAlertId, setSelectedAlertId] = useState<string>(INITIAL_CAP_ALERTS[0].id);
  const [adapters, setAdapters] = useState<SourceAdapterItem[]>(INITIAL_SOURCE_ADAPTERS);

  const [activeLayer, setActiveLayer] = useState<GridLayerType>('DBZ_COMPOSITE');
  const [activeModel, setActiveModel] = useState<ModelType>('HYBRID_AI');
  const [vrfEnabled, setVrfEnabled] = useState<boolean>(true);
  const [showBaselineComparison, setShowBaselineComparison] = useState<boolean>(true);
  const [lightningAlertThreshold, setLightningAlertThreshold] = useState<number>(0.6);

  const [timeOffsetMin, setTimeOffsetMin] = useState<number>(0);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);
  const [replaySpeedMs, setReplaySpeedMs] = useState<number>(1400);

  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState<boolean>(false);
  const [lastLiveSyncUtc, setLastLiveSyncUtc] = useState<string>('08:20:00 UTC');

  const [pointProbe, setPointProbe] = useState<PointNowcastProbe | null>(() =>
    samplePointNowcast(
      22.34,
      87.31,
      INITIAL_RADAR_STATIONS,
      INITIAL_STORM_CELLS,
      0,
      true,
      'HYBRID_AI'
    )
  );

  const handleSyncLiveOpenMeteo = async () => {
    setIsSyncingLive(true);
    setIsLoadingSkeleton(true);
    const { updatedRadars, timestampUtc } = await fetchLiveOpenMeteoForRadars(radars);
    setRadars(updatedRadars);
    setLastLiveSyncUtc(timestampUtc);
    setTimeout(() => {
      setIsSyncingLive(false);
      setIsLoadingSkeleton(false);
    }, 340);
  };

  useEffect(() => {
    handleSyncLiveOpenMeteo();
  }, []);

  useEffect(() => {
    if (!isPlayingReplay) return;
    const timer = setInterval(() => {
      setTimeOffsetMin((prev) => {
        const idx = LEAD_STEPS.indexOf(prev);
        if (idx === -1 || idx === LEAD_STEPS.length - 1) {
          return LEAD_STEPS[0];
        }
        return LEAD_STEPS[idx + 1];
      });
    }, replaySpeedMs);
    return () => clearInterval(timer);
  }, [isPlayingReplay, replaySpeedMs]);

  useEffect(() => {
    if (pointProbe) {
      setPointProbe(
        samplePointNowcast(
          pointProbe.lat,
          pointProbe.lon,
          radars,
          cells,
          timeOffsetMin,
          vrfEnabled,
          activeModel
        )
      );
    }
  }, [timeOffsetMin, vrfEnabled, activeModel, radars, cells]);

  const selectedCell = cells.find((c) => c.id === selectedCellId) || cells[0];

  const handleToggleRadarMask = (radarId: string) => {
    setRadars((prev) =>
      prev.map((r) =>
        r.id === radarId
          ? { ...r, status: r.status === 'MASKED_VRF_TEST' ? 'NOMINAL' : 'MASKED_VRF_TEST' }
          : r
      )
    );
  };

  // Live Interactive Product Demo: Inject a new growing storm cell onto the canonical grid
  const handleInjectSimulatedCell = () => {
    setIsLoadingSkeleton(true);
    const nextNum = 401 + cells.length;
    const baseLat = 22.75 + (Math.random() * 0.5 - 0.25);
    const baseLon = 87.65 + (Math.random() * 0.5 - 0.25);
    const newCell: StormCell = {
      ...INITIAL_STORM_CELLS[0],
      id: `CELL-26072-${String.fromCharCode(65 + cells.length)}`,
      designation: `VN-${nextNum} · Hooghly to Nadia Squall Cell`,
      stage: 'GROWING',
      lat: Number(baseLat.toFixed(2)),
      lon: Number(baseLon.toFixed(2)),
      maxDbz: 51.5,
      coolingRateK20m: -14.2,
      ltgRateFlashesMin: 29.5,
      capeJkg: 3050,
      track: INITIAL_STORM_CELLS[0].track.map((pt) => ({
        ...pt,
        lat: Number((pt.lat + (baseLat - 22.34)).toFixed(2)),
        lon: Number((pt.lon + (baseLon - 87.31)).toFixed(2)),
      })),
    };
    setCells((prev) => [newCell, ...prev]);
    setSelectedCellId(newCell.id);
    setTimeout(() => setIsLoadingSkeleton(false), 280);
  };

  const handleDraftOrOpenAlert = (cell: StormCell) => {
    const existing = alerts.find((a) => a.cellId === cell.id);
    if (existing) {
      setSelectedAlertId(existing.id);
      setActiveTab('ALERT_INBOX');
      return;
    }

    const f60 = cell.leadForecasts.find((f) => f.leadMin === 60) || cell.leadForecasts[2];
    const newAlert: CapAlert = {
      id: `CAP-${Date.now()}`,
      capIdentifier: `IN-IMD-STORMAHEAD-20260929-${cell.id.slice(-1)}`,
      cellId: cell.id,
      cellDesignation: cell.designation,
      regionId: selectedRegion.id,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effectiveWindow: '+10 min to +120 min',
      expiresAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      severity: f60.hybridAi.lightningProb >= 0.75 ? 'Severe' : 'Moderate',
      urgency: 'Immediate',
      certainty: 'Likely',
      lightningProb: f60.hybridAi.lightningProb,
      severeDbzProb: f60.hybridAi.dbz45Prob,
      leadTimeMin: 60,
      headlineEn: `Thunderstorm and Lightning Nowcast Advisory for ${cell.impactedBlocks
        .map((b) => b.district)
        .join(', ')}`,
      descriptionEn: cell.whySummary,
      instructionEn:
        cell.impactedBlocks[0]?.recommendedAction ||
        'Take shelter inside grounded masonry buildings and monitor official IMD updates.',
      regionalLangCode: selectedRegion.regionalLangCode,
      regionalLangLabel: selectedRegion.regionalLangLabel,
      headlineRegional: `${cell.impactedBlocks.map((b) => b.district).join(', ')} অঞ্চলের জন্য বজ্রপাত ও ঝড়ের সতর্কবার্তা`,
      descriptionRegional: `স্টর্মসাইট নাউকাস্ট মডেল আগামী ৬০ মিনিটে ${(
        f60.hybridAi.lightningProb * 100
      ).toFixed(0)}% বজ্রপাতের সম্ভাবনা নির্দেশ করছে।`,
      instructionRegional: 'নিরাপদ পাকা আশ্রয়ে থাকুন এবং খোলা মাঠ এড়িয়ে চলুন।',
      polygonCoords: [
        [cell.lat + 0.2, cell.lon - 0.2],
        [cell.lat + 0.2, cell.lon + 0.4],
        [cell.lat - 0.3, cell.lon + 0.4],
        [cell.lat - 0.3, cell.lon - 0.2],
      ],
      impactedBlocks: cell.impactedBlocks,
      channels: ['CAP_FEED', 'SDMA_DASHBOARD'],
      whyHeadline: cell.whySummary.slice(0, 95) + '...',
      trustHitRate: cell.trustRibbon.observedHitRate,
      auditLog: [
        {
          timestamp: new Date().toISOString().slice(11, 19) + ' UTC',
          actor: `Forecaster (${userRole})`,
          role: userRole,
          action: 'AUTO_DRAFTED',
          notes: `Drafted directly from Cell Inspector for ${cell.id}.`,
        },
      ],
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setSelectedAlertId(newAlert.id);
    setActiveTab('ALERT_INBOX');
  };

  const handleUpdateAlertStatus = (
    alertId: string,
    newStatus: CapAlert['status'],
    notes: string,
    updatedFields?: Partial<CapAlert>
  ) => {
    const nowUtc = new Date().toISOString().slice(11, 19) + ' UTC';
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        const actionType =
          updatedFields && newStatus === a.status
            ? 'EDITED'
            : newStatus === 'APPROVED'
              ? 'APPROVED'
              : newStatus === 'PUBLISHED'
                ? 'PUBLISHED_CAP'
                : newStatus === 'SUPPRESSED'
                  ? 'SUPPRESSED'
                  : 'EDITED';

        return {
          ...a,
          ...updatedFields,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          auditLog: [
            ...a.auditLog,
            {
              timestamp: nowUtc,
              actor: `Duty Officer (${userRole})`,
              role: userRole,
              action: actionType,
              notes,
            },
          ],
        };
      })
    );
  };

  const handleAddAdapterAndRadar = (newAdapter: SourceAdapterItem, newRadar?: RadarStation) => {
    setAdapters((prev) => [...prev, newAdapter]);
    if (newRadar) {
      setRadars((prev) => [...prev, newRadar]);
    }
  };

  const draftAlertsCount = alerts.filter((a) => a.status === 'DRAFT').length;

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#12161F] text-[#E2E8F0] overflow-hidden">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="h-12 shrink-0 flex items-center justify-between px-5 bg-[#171C26] border-b border-[#262E3D]">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('NOWCAST_MAP');
          }}
          className="text-lg font-bold tracking-tight text-[#E2E8F0] font-display whitespace-nowrap"
        >
          StormAhead
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium">
          <button
            onClick={() => setActiveTab('NOWCAST_MAP')}
            className={`py-1 whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'NOWCAST_MAP'
                ? 'text-[#D97706] border-[#D97706]'
                : 'text-[#94A3B8] border-transparent'
            }`}
          >
            Radar and Nowcast
          </button>
          <button
            onClick={() => setActiveTab('ALERT_INBOX')}
            className={`py-1 whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'ALERT_INBOX'
                ? 'text-[#D97706] border-[#D97706]'
                : 'text-[#94A3B8] border-transparent'
            }`}
          >
            Alert Inbox and CAP ({draftAlertsCount} Draft)
          </button>
          <button
            onClick={() => setActiveTab('VERIFICATION')}
            className={`py-1 whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'VERIFICATION'
                ? 'text-[#D97706] border-[#D97706]'
                : 'text-[#94A3B8] border-transparent'
            }`}
          >
            Verification and Skill
          </button>
          <button
            onClick={() => setActiveTab('ADAPTERS')}
            className={`py-1 whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'ADAPTERS'
                ? 'text-[#D97706] border-[#D97706]'
                : 'text-[#94A3B8] border-transparent'
            }`}
          >
            Source Adapters
          </button>
        </nav>

        {/* Zone 3: 2 primary actions */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <select
            aria-label="Active Operational Role"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="bg-[#12161F] border border-[#262E3D] text-xs font-mono text-[#E2E8F0] px-2.5 py-1.5 cursor-pointer"
          >
            <option value="FORECASTER">Role: IMD Forecaster</option>
            <option value="DISASTER_OFFICER">Role: District Disaster Officer</option>
            <option value="RESEARCHER">Role: ML Researcher</option>
          </select>

          <button
            onClick={handleSyncLiveOpenMeteo}
            disabled={isSyncingLive}
            className="px-3.5 py-1.5 bg-[#D97706] disabled:opacity-50 text-[#12161F] font-semibold text-xs whitespace-nowrap cursor-pointer"
          >
            {isSyncingLive ? '[ SYNCING... ]' : '[ SYNC LIVE FEED ]'}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden items-center justify-around bg-[#171C26] border-b border-[#262E3D] py-1.5 px-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('NOWCAST_MAP')}
          className={activeTab === 'NOWCAST_MAP' ? 'text-[#D97706] font-semibold' : 'text-[#94A3B8]'}
        >
          Nowcast
        </button>
        <button
          onClick={() => setActiveTab('ALERT_INBOX')}
          className={activeTab === 'ALERT_INBOX' ? 'text-[#D97706] font-semibold' : 'text-[#94A3B8]'}
        >
          Alerts ({draftAlertsCount})
        </button>
        <button
          onClick={() => setActiveTab('VERIFICATION')}
          className={activeTab === 'VERIFICATION' ? 'text-[#D97706] font-semibold' : 'text-[#94A3B8]'}
        >
          Verification
        </button>
        <button
          onClick={() => setActiveTab('ADAPTERS')}
          className={activeTab === 'ADAPTERS' ? 'text-[#D97706] font-semibold' : 'text-[#94A3B8]'}
        >
          Adapters
        </button>
      </div>

      {/* MAIN WORKSPACE STAGE */}
      {activeTab === 'NOWCAST_MAP' && (
        <main className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left Control & Parameter Column */}
          <aside className="w-full lg:w-[340px] shrink-0 bg-[#171C26] flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b border-[#262E3D] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>VAJRANOW · SIH 26072</span>
                <span className="text-[#4D8B6E]">[SYNC: {lastLiveSyncUtc}]</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Operational Pilot Domain
                </label>
                <select
                  value={selectedRegion.id}
                  onChange={(e) => {
                    setIsLoadingSkeleton(true);
                    const reg = PILOT_REGIONS.find((r) => r.id === e.target.value) || PILOT_REGIONS[0];
                    setSelectedRegion(reg);
                    setLightningAlertThreshold(reg.thresholds.lightningProbAlert);
                    setTimeout(() => setIsLoadingSkeleton(false), 300);
                  }}
                  className="w-full bg-[#12161F] border border-[#262E3D] px-2.5 py-1.5 text-xs text-[#E2E8F0] font-medium"
                >
                  {PILOT_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.code} : {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Nowcast Engine / Baseline Mode
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#12161F] border border-[#262E3D] font-mono text-[11px]">
                  {(
                    [
                      { id: 'HYBRID_AI', label: 'StormAheads Hybrid' },
                      { id: 'IMD_BASELINE', label: 'IMD Baseline' },
                      { id: 'OPTICAL_FLOW', label: 'Optical-Flow' },
                      { id: 'PERSISTENCE', label: 'Persistence' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveModel(m.id)}
                      className={`py-1 px-2 whitespace-nowrap cursor-pointer ${
                        activeModel === m.id
                          ? 'bg-[#D97706] text-[#12161F] font-semibold'
                          : 'text-[#94A3B8]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1 space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[#CBD5E1]">Virtual Radar Fill (VRF U-Net)</span>
                  <input
                    type="checkbox"
                    checked={vrfEnabled}
                    onChange={(e) => setVrfEnabled(e.target.checked)}
                    className="accent-[#D97706] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[#CBD5E1]">Overlay Optical-Flow Drift Track</span>
                  <input
                    type="checkbox"
                    checked={showBaselineComparison}
                    onChange={(e) => setShowBaselineComparison(e.target.checked)}
                    className="accent-[#D97706] w-4 h-4 cursor-pointer"
                  />
                </label>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] mb-1">
                    <span>Alert Threshold P(Lightning)</span>
                    <span className="text-[#D97706]">{(lightningAlertThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.35}
                    max={0.85}
                    step={0.05}
                    value={lightningAlertThreshold}
                    onChange={(e) => setLightningAlertThreshold(parseFloat(e.target.value))}
                    className="w-full accent-[#D97706] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Tracked Convective Cells & Interactive Cell Injector */}
            <div className="p-4 border-b border-[#262E3D]">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-semibold text-[#E2E8F0]">
                  Tracked Storm Cells ({cells.length})
                </h2>
                <button
                  onClick={handleInjectSimulatedCell}
                  className="px-2 py-0.5 bg-[#12161F] border border-[#D97706] text-[10px] font-mono text-[#D97706] cursor-pointer"
                >
                  [ + INJECT CELL ]
                </button>
              </div>

              <div className="space-y-2">
                {cells.map((cell) => {
                  const isSelected = cell.id === selectedCellId;
                  const st = getCellStateAtTime(cell, timeOffsetMin, activeModel);
                  const f60 = cell.leadForecasts.find((f) => f.leadMin === 60) || cell.leadForecasts[2];
                  const exceedsThreshold = f60.hybridAi.lightningProb >= lightningAlertThreshold;

                  return (
                    <button
                      key={cell.id}
                      onClick={() => setSelectedCellId(cell.id)}
                      className={`w-full text-left p-2.5 border cursor-pointer ${
                        isSelected
                          ? 'bg-[#12161F] border-[#D97706]'
                          : 'bg-[#141922] border-[#262E3D]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#D97706] font-semibold">{cell.id}</span>
                        <span className="text-[#CBD5E1]">[{st.stage}]</span>
                      </div>

                      <div className="mt-1 text-xs font-medium text-[#E2E8F0] truncate">
                        {cell.designation.split('·')[1]?.trim() || cell.designation}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                        <span>{st.maxDbz.toFixed(1)} dBZ</span>
                        <span>·</span>
                        <span>{cell.coolingRateK20m.toFixed(1)} K/20m</span>
                        <span>·</span>
                        <span className={exceedsThreshold ? 'text-[#D97706] font-semibold' : 'text-[#CBD5E1]'}>
                          P(Ltg): {(f60.hybridAi.lightningProb * 100).toFixed(0)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Doppler Weather Radar Feed Health */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-semibold text-[#E2E8F0]">
                  Doppler Radar Mosaic and Live NWP
                </h2>
                <span className="text-[10px] font-mono text-[#94A3B8]">Open-Meteo Synced</span>
              </div>

              <div className="space-y-2">
                {radars.map((r) => {
                  const isMasked = r.status === 'MASKED_VRF_TEST';
                  return (
                    <div
                      key={r.id}
                      className="p-2.5 bg-[#12161F] border border-[#262E3D] text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#E2E8F0]">{r.code}</span>
                        <button
                          onClick={() => handleToggleRadarMask(r.id)}
                          className={`px-2 py-0.5 text-[10px] border cursor-pointer ${
                            isMasked
                              ? 'bg-[#2B2118] border-[#D97706] text-[#D97706]'
                              : 'bg-[#171C26] border-[#262E3D] text-[#4D8B6E]'
                          }`}
                        >
                          {isMasked ? '[MASKED : UNMASK]' : '[NOMINAL : MASK]'}
                        </button>
                      </div>
                      <div className="mt-1 text-[11px] text-[#94A3B8] font-sans">{r.name}</div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#CBD5E1]">
                        <span>T: {r.liveTempC?.toFixed(1)}C</span>
                        <span>·</span>
                        <span>CAPE: {r.liveCapeJkg} J/kg</span>
                        <span>·</span>
                        <span>Wind: {r.liveWindKmh} km/h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Center Interactive Radar Viewport + Bottom Nowcast Time Scrubber */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <RadarCanvasViewport
              region={selectedRegion}
              radars={radars}
              cells={cells}
              selectedCellId={selectedCellId}
              onSelectCell={setSelectedCellId}
              activeLayer={activeLayer}
              onChangeLayer={setActiveLayer}
              activeModel={activeModel}
              showBaselineComparison={showBaselineComparison}
              vrfEnabled={vrfEnabled}
              onToggleRadarMask={handleToggleRadarMask}
              timeOffsetMin={timeOffsetMin}
              pointProbe={pointProbe}
              onPointProbeChange={setPointProbe}
              isLoadingSkeleton={isLoadingSkeleton}
            />

            {/* Bottom Nowcast Scrubber & Replay Controls */}
            <div className="bg-[#171C26] border-t border-x border-[#262E3D] px-4 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsPlayingReplay((p) => !p)}
                    className="px-3 py-1.5 bg-[#D97706] text-[#12161F] font-semibold cursor-pointer whitespace-nowrap"
                  >
                    {isPlayingReplay ? '[ PAUSE REPLAY ]' : '[ PLAY 0 TO 3H LOOP ]'}
                  </button>

                  <button
                    onClick={() => {
                      setIsPlayingReplay(false);
                      const idx = LEAD_STEPS.indexOf(timeOffsetMin);
                      if (idx > 0) setTimeOffsetMin(LEAD_STEPS[idx - 1]);
                    }}
                    className="px-2.5 py-1.5 bg-[#12161F] border border-[#262E3D] text-[#E2E8F0] cursor-pointer"
                  >
                    [ &lt; ]
                  </button>

                  <button
                    onClick={() => {
                      setIsPlayingReplay(false);
                      setTimeOffsetMin(0);
                    }}
                    className="px-2.5 py-1.5 bg-[#12161F] border border-[#262E3D] text-[#E2E8F0] cursor-pointer"
                  >
                    NOW (0m)
                  </button>

                  <button
                    onClick={() => {
                      setIsPlayingReplay(false);
                      const idx = LEAD_STEPS.indexOf(timeOffsetMin);
                      if (idx < LEAD_STEPS.length - 1) setTimeOffsetMin(LEAD_STEPS[idx + 1]);
                    }}
                    className="px-2.5 py-1.5 bg-[#12161F] border border-[#262E3D] text-[#E2E8F0] cursor-pointer"
                  >
                    [ &gt; ]
                  </button>

                  <select
                    aria-label="Replay Speed"
                    value={replaySpeedMs}
                    onChange={(e) => setReplaySpeedMs(Number(e.target.value))}
                    className="ml-1 bg-[#12161F] border border-[#262E3D] px-2 py-1.5 text-xs font-mono text-[#CBD5E1]"
                  >
                    <option value={1400}>1x Speed</option>
                    <option value={750}>2x Speed</option>
                    <option value={400}>4x Speed</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto">
                  {LEAD_STEPS.map((step) => {
                    const isCurrent = timeOffsetMin === step;
                    return (
                      <button
                        key={step}
                        onClick={() => {
                          setIsPlayingReplay(false);
                          setTimeOffsetMin(step);
                        }}
                        className={`px-2.5 py-1 border whitespace-nowrap cursor-pointer ${
                          isCurrent
                            ? 'bg-[#D97706] text-[#12161F] border-[#D97706] font-bold'
                            : 'bg-[#12161F] text-[#CBD5E1] border-[#262E3D]'
                        }`}
                      >
                        {step === 0 ? '0m (NOW)' : step > 0 ? `+${step}m` : `${step}m`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspector Column */}
          <CellInspectorPanel
            cell={selectedCell}
            timeOffsetMin={timeOffsetMin}
            activeModel={activeModel}
            vrfEnabled={vrfEnabled}
            onDraftOrOpenAlert={handleDraftOrOpenAlert}
            isLoadingSkeleton={isLoadingSkeleton}
          />
        </main>
      )}

      {activeTab === 'ALERT_INBOX' && (
        <AlertInboxView
          alerts={alerts}
          selectedAlertId={selectedAlertId}
          onSelectAlert={setSelectedAlertId}
          onUpdateAlertStatus={handleUpdateAlertStatus}
          userRole={userRole}
        />
      )}

      {activeTab === 'VERIFICATION' && <VerificationView region={selectedRegion} />}

      {activeTab === 'ADAPTERS' && (
        <SourceAdaptersView
          region={selectedRegion}
          adapters={adapters}
          radars={radars}
          onAddAdapterAndRadar={handleAddAdapterAndRadar}
          onSyncLiveOpenMeteo={handleSyncLiveOpenMeteo}
          isSyncingLive={isSyncingLive}
          lastLiveSyncUtc={lastLiveSyncUtc}
        />
      )}

      {/* Terms of Service & Operational Governance View */}
      {activeTab === 'TOS' && (
        <div className="flex-1 overflow-y-auto bg-[#12161F] p-8">
          <div className="max-w-3xl mx-auto bg-[#171C26] border border-[#262E3D] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262E3D] pb-3">
              <h1 className="text-lg font-semibold text-[#E2E8F0] font-display">
                Terms of Service and Operational Decision-Support Agreement
              </h1>
              <button
                onClick={() => setActiveTab('NOWCAST_MAP')}
                className="px-3 py-1 bg-[#12161F] border border-[#262E3D] text-xs font-mono text-[#D97706] cursor-pointer"
              >
                [ RETURN TO WORKSPACE ]
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#CBD5E1] leading-relaxed">
              <p>
                <strong>01. Operational Positioning (SIH 26072 / IMD Enhancement Layer):</strong> StormAhead (VajraNow) operates strictly as a read-only AI/ML decision-support enhancement layer sitting beside existing India Meteorological Department (IMD) Doppler Weather Radar, INSAT satellite, IITM lightning network, and NWP infrastructure.
              </p>
              <p>
                <strong>02. Human-in-the-Loop Alert Governance:</strong> Auto-drafted Common Alerting Protocol (OASIS CAP 1.2) bulletins generated by the hybrid U-Net/ConvGRU and LightGBM models must be reviewed and approved by an authorized duty forecaster prior to public dissemination to State and District Disaster Management Authorities (SDMA/DDMA).
              </p>
              <p>
                <strong>03. Virtual Radar Fill (VRF) Provenance Disclosure:</strong> Any synthetic reflectivity generated where physical radar coverage is masked or degraded is tagged with <code className="font-mono text-[#D97706]">source=virtual</code> and carries explicit conformal uncertainty bounds.
              </p>
              <p>
                <strong>04. Reproducibility and Audit Trail:</strong> Every forecast execution records model weights version, configuration hash, and input source freshness manifest. All alert approvals, edits, and suppressions are logged in the immutable audit ledger.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Data Governance Policy View */}
      {activeTab === 'PRIVACY' && (
        <div className="flex-1 overflow-y-auto bg-[#12161F] p-8">
          <div className="max-w-3xl mx-auto bg-[#171C26] border border-[#262E3D] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262E3D] pb-3">
              <h1 className="text-lg font-semibold text-[#E2E8F0] font-display">
                Privacy Policy and Meteorological Data Governance
              </h1>
              <button
                onClick={() => setActiveTab('NOWCAST_MAP')}
                className="px-3 py-1 bg-[#12161F] border border-[#262E3D] text-xs font-mono text-[#D97706] cursor-pointer"
              >
                [ RETURN TO WORKSPACE ]
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#CBD5E1] leading-relaxed">
              <p>
                <strong>01. Meteorological Data Licensing:</strong> All ingested volumetric radar scans, geostationary imager channels, and lightning stroke feeds respect MoES/IMD and WMO data governance policies. Restricted operational feeds are processed in-memory within the canonical Zarr grid and are never redistributed to unauthorized third parties.
              </p>
              <p>
                <strong>02. Operator and Forecaster Privacy:</strong> Duty officer identifiers recorded in the CAP 1.2 audit trail are used solely for statutory disaster-management accountability and internal verification skill analysis.
              </p>
              <p>
                <strong>03. Citizen Alert Privacy:</strong> Block-level impact lists and CAP 1.2 feeds broadcast geographic polygons and arrival windows without collecting or storing personally identifiable citizen geolocation data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quiet Footer with Real Links to TOS, Privacy Policy & Navigation */}
      <footer className="h-8 shrink-0 bg-[#141922] border-t border-[#262E3D] px-5 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
        <div>
          StormAhead (SIH 26072) · MoES / IMD Decision-Support Platform
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('TOS')}
            className={`cursor-pointer ${activeTab === 'TOS' ? 'text-[#D97706] underline' : 'text-[#94A3B8]'}`}
          >
            Terms of Service
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveTab('PRIVACY')}
            className={`cursor-pointer ${activeTab === 'PRIVACY' ? 'text-[#D97706] underline' : 'text-[#94A3B8]'}`}
          >
            Privacy Policy
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveTab('ADAPTERS')}
            className="text-[#94A3B8] cursor-pointer"
          >
            Canonical Grid v1.4
          </button>
        </div>
      </footer>
    </div>
  );
}
