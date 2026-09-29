export type LifecycleStage = 'INITIATING' | 'GROWING' | 'MATURE' | 'DECAYING';

export type ModelType = 'HYBRID_AI' | 'IMD_BASELINE' | 'OPTICAL_FLOW' | 'PERSISTENCE';

export type GridLayerType =
  | 'DBZ_COMPOSITE'
  | 'DBZ_CONFIDENCE'
  | 'VIRTUAL_RADAR_FILL'
  | 'SAT_TIR_BT'
  | 'SAT_COOLING_RATE'
  | 'LIGHTNING_DENSITY'
  | 'NWP_CAPE_SHEAR'
  | 'PROB_LIGHTNING'
  | 'PROB_SEVERE_45DBZ';

export type UserRole = 'FORECASTER' | 'DISASTER_OFFICER' | 'RESEARCHER';

export interface RadarStation {
  id: string;
  code: string;
  name: string;
  lat: number;
  lon: number;
  rangeKm: number;
  band: 'S-Band' | 'C-Band' | 'X-Band';
  adapter: string;
  path: string;
  weightRule: 'range_beam' | 'uniform_qc';
  status: 'NOMINAL' | 'MASKED_VRF_TEST' | 'STALE';
  lastScanMinAgo: number;
  clutterFilterDbz: number;
  liveTempC?: number;
  liveCapeJkg?: number;
  liveWindKmh?: number;
  liveWindDirDeg?: number;
}

export interface ShapFeatureContribution {
  feature: string;
  rawMetric: string;
  shapDelta: number; // e.g., +0.24 or -0.07
  direction: 'POSITIVE' | 'NEGATIVE';
  plainExplanation: string;
}

export interface TrustRibbonData {
  regionName: string;
  season: string;
  leadTimeMin: number;
  probabilityBin: string; // e.g., "0.70 – 0.80"
  forecastProbability: number;
  observedHitRate: number;
  conformalBandPct: number; // e.g. ±6.5%
  brierScore: number;
  sampleCount: number;
  calibrationGrade: 'WELL_CALIBRATED' | 'SLIGHT_OVERFORECAST' | 'DRIFT_WATCH';
}

export interface ImpactedBlock {
  district: string;
  blockName: string;
  populationEstimate: number;
  etaStartMin: number;
  etaPeakMin: number;
  etaClearMin: number;
  peakLightningProb: number;
  peakDbz: number;
  recommendedAction: string;
}

export interface LeadProbabilitySet {
  leadMin: number; // 0, 30, 60, 90, 120, 150, 180
  hybridAi: {
    lightningProb: number;
    dbz35Prob: number;
    dbz45Prob: number;
    pixelWeight: number;
    cellWeight: number;
    uncertaintyBand: number;
  };
  imdBaseline: {
    lightningProb: number;
    dbz35Prob: number;
    dbz45Prob: number;
  };
  opticalFlow: {
    lightningProb: number;
    dbz35Prob: number;
    dbz45Prob: number;
  };
  persistence: {
    lightningProb: number;
    dbz35Prob: number;
    dbz45Prob: number;
  };
}

export interface TrackPoint {
  timeOffsetMin: number; // -60, -40, -20, 0, +30, +60, +90, +120, +150, +180
  lat: number;
  lon: number;
  maxDbz: number;
  radiusKm: number;
  stage: LifecycleStage;
  isVirtualFilled?: boolean;
}

export interface StormCell {
  id: string;
  designation: string;
  regionId: string;
  stage: LifecycleStage;
  lat: number;
  lon: number;
  radiusKm: number;
  areaKm2: number;
  maxDbz: number;
  echoTopKm: number;
  satBtTir1K: number;
  coolingRateK20m: number; // e.g., -14.8 K / 20 min
  wvMinusTirK: number;
  ltgRateFlashesMin: number;
  ltgJumpSigma: number;
  isLightningJump: boolean;
  motionSpeedKmh: number;
  motionBearingDeg: number; // meteorological direction moving towards
  ageMin: number;
  capeJkg: number;
  cinJkg: number;
  shear06Ms: number;
  pwatMm: number;
  moistureConvGkgS: number;
  inRadarGap: boolean;
  vrfConfidence: number;
  shapContributions: ShapFeatureContribution[];
  whySummary: string;
  trustRibbon: TrustRibbonData;
  leadForecasts: LeadProbabilitySet[];
  impactedBlocks: ImpactedBlock[];
  track: TrackPoint[];
}

export interface AlertAuditEntry {
  timestamp: string;
  actor: string;
  role: UserRole;
  action: 'AUTO_DRAFTED' | 'EDITED' | 'APPROVED' | 'PUBLISHED_CAP' | 'SUPPRESSED';
  notes: string;
}

export interface CapAlert {
  id: string;
  capIdentifier: string;
  cellId: string;
  cellDesignation: string;
  regionId: string;
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'SUPPRESSED';
  createdAt: string;
  updatedAt: string;
  effectiveWindow: string;
  expiresAt: string;
  severity: 'Extreme' | 'Severe' | 'Moderate';
  urgency: 'Immediate' | 'Expected';
  certainty: 'Observed' | 'Likely';
  lightningProb: number;
  severeDbzProb: number;
  leadTimeMin: number;
  headlineEn: string;
  descriptionEn: string;
  instructionEn: string;
  regionalLangCode: 'bn' | 'hi' | 'or' | 'te';
  regionalLangLabel: string;
  headlineRegional: string;
  descriptionRegional: string;
  instructionRegional: string;
  polygonCoords: Array<[number, number]>; // [lat, lon]
  impactedBlocks: ImpactedBlock[];
  channels: Array<'CAP_FEED' | 'WEBHOOK' | 'SMS_GATEWAY' | 'SDMA_DASHBOARD'>;
  whyHeadline: string;
  trustHitRate: number;
  auditLog: AlertAuditEntry[];
}

export interface SourceAdapterItem {
  id: string;
  name: string;
  category: 'RADAR' | 'SATELLITE' | 'LIGHTNING' | 'NWP';
  adapterClass: string;
  format: string;
  pathOrEndpoint: string;
  resolutionKm: number;
  cadenceMin: number;
  lastIngestTime: string;
  freshnessSec: number;
  status: 'LIVE' | 'DEGRADED' | 'MASKED';
  qcPassRatePct: number;
  qcFlagsActive: string[];
  configSnippet: string;
}

export interface VerificationLeadMetric {
  leadMin: number;
  targetThreshold: {
    pod: number;
    far: number;
    csi: number;
  };
  hybridAi: {
    pod: number;
    far: number;
    csi: number;
    brier: number;
    fss5km: number;
  };
  imdBaseline: {
    pod: number;
    far: number;
    csi: number;
    brier: number;
    fss5km: number;
  };
  opticalFlow: {
    pod: number;
    far: number;
    csi: number;
    brier: number;
    fss5km: number;
  };
  persistence: {
    pod: number;
    far: number;
    csi: number;
    brier: number;
    fss5km: number;
  };
}

export interface ReliabilityCurvePoint {
  binCenter: number;
  hybridObserved: number;
  imdObserved: number;
  opticalFlowObserved: number;
  forecastCount: number;
}

export interface PilotRegionConfig {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  centerLat: number;
  centerLon: number;
  bbox: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
  regionalLangCode: 'bn' | 'hi' | 'or' | 'te';
  regionalLangLabel: string;
  thresholds: {
    lightningProbAlert: number;
    severeDbzProbAlert: number;
    vrfMinConfidence: number;
  };
}

export interface PointNowcastProbe {
  lat: number;
  lon: number;
  nearestDistrict: string;
  dbz: number;
  dbzConfidence: number;
  source: 'observed' | 'virtual';
  satBtTir1K: number;
  coolingRateK20m: number;
  ltgRate: number;
  capeJkg: number;
  shearMs: number;
  probLightning30m: number;
  probLightning60m: number;
  probLightning120m: number;
  probSevere60m: number;
  trustObservedHitRate: number;
}
