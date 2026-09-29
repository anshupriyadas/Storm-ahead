import {
  CapAlert,
  PilotRegionConfig,
  PointNowcastProbe,
  RadarStation,
  ReliabilityCurvePoint,
  SourceAdapterItem,
  StormCell,
  VerificationLeadMetric,
} from '../types/nowcast';

export const PILOT_REGIONS: PilotRegionConfig[] = [
  {
    id: 'pilot_east',
    code: 'IMD-ER-01',
    name: 'East India Pilot (WB / Odisha / Jharkhand)',
    subtitle: 'Kalbaisakhi Norwester and Chota Nagpur Convective Corridor',
    centerLat: 22.15,
    centerLon: 87.1,
    bbox: [19.6, 84.5, 24.4, 89.5],
    regionalLangCode: 'bn',
    regionalLangLabel: 'Bengali (বাংলা)',
    thresholds: {
      lightningProbAlert: 0.6,
      severeDbzProbAlert: 0.4,
      vrfMinConfidence: 0.45,
    },
  },
  {
    id: 'pilot_coast',
    code: 'IMD-SR-02',
    name: 'Coastal Andhra and North Bay Domain',
    subtitle: 'Tropical Feeder Bands and Sea-Breeze Convergence Zone',
    centerLat: 17.4,
    centerLon: 82.7,
    bbox: [15.2, 79.8, 19.6, 85.4],
    regionalLangCode: 'te',
    regionalLangLabel: 'Telugu (తెలుగు)',
    thresholds: {
      lightningProbAlert: 0.58,
      severeDbzProbAlert: 0.42,
      vrfMinConfidence: 0.45,
    },
  },
  {
    id: 'pilot_central',
    code: 'IMD-CR-03',
    name: 'Central India Monsoon Trough',
    subtitle: 'Vidarbha and Chhattisgarh Deep Orographic Convection',
    centerLat: 21.15,
    centerLon: 80.2,
    bbox: [18.8, 77.5, 23.5, 83.0],
    regionalLangCode: 'hi',
    regionalLangLabel: 'Hindi (हिन्दी)',
    thresholds: {
      lightningProbAlert: 0.62,
      severeDbzProbAlert: 0.4,
      vrfMinConfidence: 0.48,
    },
  },
];

export const INITIAL_RADAR_STATIONS: RadarStation[] = [
  {
    id: 'dwr_kolkata',
    code: 'DWR-VECC',
    name: 'DWR Kolkata (New Secretariat)',
    lat: 22.5726,
    lon: 88.3639,
    rangeKm: 250,
    band: 'S-Band',
    adapter: 'adapters.radar.OdimHdf5',
    path: 'data/radar/dwr_kolkata/',
    weightRule: 'range_beam',
    status: 'NOMINAL',
    lastScanMinAgo: 2,
    clutterFilterDbz: 18,
    liveTempC: 31.4,
    liveCapeJkg: 2840,
    liveWindKmh: 46,
    liveWindDirDeg: 305,
  },
  {
    id: 'dwr_paradip',
    code: 'DWR-VOPR',
    name: 'DWR Paradip Port',
    lat: 20.2648,
    lon: 86.6085,
    rangeKm: 250,
    band: 'S-Band',
    adapter: 'adapters.radar.OdimHdf5',
    path: 'data/radar/dwr_paradip/',
    weightRule: 'range_beam',
    status: 'NOMINAL',
    lastScanMinAgo: 4,
    clutterFilterDbz: 16,
    liveTempC: 29.8,
    liveCapeJkg: 2490,
    liveWindKmh: 38,
    liveWindDirDeg: 230,
  },
  {
    id: 'dwr_ranchi',
    code: 'DWR-VERC',
    name: 'DWR Ranchi (Birsa Munda)',
    lat: 23.3441,
    lon: 85.3096,
    rangeKm: 220,
    band: 'S-Band',
    adapter: 'adapters.radar.OdimHdf5',
    path: 'data/radar/dwr_ranchi/',
    weightRule: 'range_beam',
    status: 'NOMINAL',
    lastScanMinAgo: 3,
    clutterFilterDbz: 20,
    liveTempC: 28.2,
    liveCapeJkg: 2180,
    liveWindKmh: 52,
    liveWindDirDeg: 295,
  },
  {
    id: 'dwr_balasore',
    code: 'DWR-VOBL',
    name: 'DWR Chandipur / Balasore',
    lat: 21.4934,
    lon: 86.9195,
    rangeKm: 180,
    band: 'C-Band',
    adapter: 'adapters.radar.OdimHdf5',
    path: 'data/radar/dwr_balasore/',
    weightRule: 'range_beam',
    status: 'MASKED_VRF_TEST',
    lastScanMinAgo: 6,
    clutterFilterDbz: 18,
    liveTempC: 30.6,
    liveCapeJkg: 2960,
    liveWindKmh: 54,
    liveWindDirDeg: 285,
  },
];

export const INITIAL_STORM_CELLS: StormCell[] = [
  {
    id: 'CELL-26072-A',
    designation: 'VN-401 · Kharagpur to Midnapore Squall Core',
    regionId: 'pilot_east',
    stage: 'GROWING',
    lat: 22.34,
    lon: 87.31,
    radiusKm: 24,
    areaKm2: 1810,
    maxDbz: 56.5,
    echoTopKm: 14.8,
    satBtTir1K: 204.2,
    coolingRateK20m: -15.6,
    wvMinusTirK: 4.8,
    ltgRateFlashesMin: 38.4,
    ltgJumpSigma: 2.9,
    isLightningJump: true,
    motionSpeedKmh: 54,
    motionBearingDeg: 122,
    ageMin: 40,
    capeJkg: 3140,
    cinJkg: -18,
    shear06Ms: 23.4,
    pwatMm: 58.2,
    moistureConvGkgS: 1.92,
    inRadarGap: false,
    vrfConfidence: 0.94,
    whySummary:
      'INSAT-3DR TIR1 cloud-top cooled 15.6 K in 20 min with a +2.9 sigma lightning jump; 3,140 J/kg CAPE and 23.4 m/s deep-layer shear sustain rapid upscale growth along the ESE outflow boundary.',
    shapContributions: [
      {
        feature: 'Lightning Jump (Delta Flash Rate)',
        rawMetric: '38.4 fl/min (+2.9s)',
        shapDelta: 0.26,
        direction: 'POSITIVE',
        plainExplanation: 'Total flash rate more than doubled in 10 minutes, preceding severe CG strikes and >50 dBZ core expansion.',
      },
      {
        feature: 'Satellite TIR1 Cooling Rate',
        rawMetric: '-15.6 K / 20 min',
        shapDelta: 0.21,
        direction: 'POSITIVE',
        plainExplanation: 'Intense updraft overshooting tropopause (204.2 K cloud-top brightness temp).',
      },
      {
        feature: 'NWP Surface CAPE and 0-6 km Shear',
        rawMetric: '3,140 J/kg · 23.4 m/s',
        shapDelta: 0.16,
        direction: 'POSITIVE',
        plainExplanation: 'High buoyant energy paired with strong vertical wind shear prevents updraft choking.',
      },
      {
        feature: 'Low-Level Moisture Convergence',
        rawMetric: '+1.92 g/kg·s',
        shapDelta: 0.09,
        direction: 'POSITIVE',
        plainExplanation: 'Bay of Bengal southerly moisture inflow feeding the leading gust front.',
      },
      {
        feature: 'Convective Inhibition (CIN)',
        rawMetric: '-18 J/kg',
        shapDelta: -0.04,
        direction: 'NEGATIVE',
        plainExplanation: 'Minimal residual capping inversion ahead of the squall line.',
      },
    ],
    trustRibbon: {
      regionName: 'East India Pilot',
      season: 'Pre-Monsoon / Norwester',
      leadTimeMin: 60,
      probabilityBin: '0.80 to 0.90',
      forecastProbability: 0.88,
      observedHitRate: 0.85,
      conformalBandPct: 5.2,
      brierScore: 0.084,
      sampleCount: 412,
      calibrationGrade: 'WELL_CALIBRATED',
    },
    leadForecasts: [
      {
        leadMin: 0,
        hybridAi: { lightningProb: 0.96, dbz35Prob: 0.98, dbz45Prob: 0.91, pixelWeight: 0.75, cellWeight: 0.25, uncertaintyBand: 0.03 },
        imdBaseline: { lightningProb: 0.92, dbz35Prob: 0.94, dbz45Prob: 0.85 },
        opticalFlow: { lightningProb: 0.92, dbz35Prob: 0.95, dbz45Prob: 0.86 },
        persistence: { lightningProb: 0.95, dbz35Prob: 0.96, dbz45Prob: 0.88 },
      },
      {
        leadMin: 30,
        hybridAi: { lightningProb: 0.93, dbz35Prob: 0.94, dbz45Prob: 0.86, pixelWeight: 0.62, cellWeight: 0.38, uncertaintyBand: 0.04 },
        imdBaseline: { lightningProb: 0.81, dbz35Prob: 0.83, dbz45Prob: 0.71 },
        opticalFlow: { lightningProb: 0.79, dbz35Prob: 0.82, dbz45Prob: 0.68 },
        persistence: { lightningProb: 0.64, dbz35Prob: 0.68, dbz45Prob: 0.52 },
      },
      {
        leadMin: 60,
        hybridAi: { lightningProb: 0.88, dbz35Prob: 0.89, dbz45Prob: 0.78, pixelWeight: 0.50, cellWeight: 0.50, uncertaintyBand: 0.05 },
        imdBaseline: { lightningProb: 0.69, dbz35Prob: 0.72, dbz45Prob: 0.56 },
        opticalFlow: { lightningProb: 0.66, dbz35Prob: 0.70, dbz45Prob: 0.53 },
        persistence: { lightningProb: 0.42, dbz35Prob: 0.46, dbz45Prob: 0.34 },
      },
      {
        leadMin: 90,
        hybridAi: { lightningProb: 0.81, dbz35Prob: 0.82, dbz45Prob: 0.69, pixelWeight: 0.44, cellWeight: 0.56, uncertaintyBand: 0.07 },
        imdBaseline: { lightningProb: 0.57, dbz35Prob: 0.61, dbz45Prob: 0.44 },
        opticalFlow: { lightningProb: 0.53, dbz35Prob: 0.58, dbz45Prob: 0.41 },
        persistence: { lightningProb: 0.29, dbz35Prob: 0.33, dbz45Prob: 0.21 },
      },
      {
        leadMin: 120,
        hybridAi: { lightningProb: 0.74, dbz35Prob: 0.75, dbz45Prob: 0.58, pixelWeight: 0.38, cellWeight: 0.62, uncertaintyBand: 0.08 },
        imdBaseline: { lightningProb: 0.46, dbz35Prob: 0.49, dbz45Prob: 0.33 },
        opticalFlow: { lightningProb: 0.43, dbz35Prob: 0.47, dbz45Prob: 0.30 },
        persistence: { lightningProb: 0.19, dbz35Prob: 0.22, dbz45Prob: 0.12 },
      },
      {
        leadMin: 150,
        hybridAi: { lightningProb: 0.63, dbz35Prob: 0.65, dbz45Prob: 0.45, pixelWeight: 0.34, cellWeight: 0.66, uncertaintyBand: 0.09 },
        imdBaseline: { lightningProb: 0.36, dbz35Prob: 0.39, dbz45Prob: 0.23 },
        opticalFlow: { lightningProb: 0.33, dbz35Prob: 0.37, dbz45Prob: 0.21 },
        persistence: { lightningProb: 0.14, dbz35Prob: 0.16, dbz45Prob: 0.08 },
      },
      {
        leadMin: 180,
        hybridAi: { lightningProb: 0.52, dbz35Prob: 0.54, dbz45Prob: 0.34, pixelWeight: 0.30, cellWeight: 0.70, uncertaintyBand: 0.11 },
        imdBaseline: { lightningProb: 0.27, dbz35Prob: 0.31, dbz45Prob: 0.16 },
        opticalFlow: { lightningProb: 0.25, dbz35Prob: 0.29, dbz45Prob: 0.14 },
        persistence: { lightningProb: 0.10, dbz35Prob: 0.11, dbz45Prob: 0.05 },
      },
    ],
    impactedBlocks: [
      {
        district: 'Paschim Medinipur',
        blockName: 'Kharagpur-II and Debra',
        populationEstimate: 342000,
        etaStartMin: 5,
        etaPeakMin: 20,
        etaClearMin: 55,
        peakLightningProb: 0.94,
        peakDbz: 57,
        recommendedAction: 'Halt outdoor agricultural and railway yard work immediately; shelter in grounded masonry structures.',
      },
      {
        district: 'Howrah',
        blockName: 'Uluberia-I and Bagnan',
        populationEstimate: 485000,
        etaStartMin: 35,
        etaPeakMin: 55,
        etaClearMin: 95,
        peakLightningProb: 0.89,
        peakDbz: 54,
        recommendedAction: 'Suspend ferry crossings on Hooghly and Rupnarayan rivers; secure overhead port cranes.',
      },
      {
        district: 'Kolkata and South 24 Parganas',
        blockName: 'Alipore · Budge Budge · Thakurpukur',
        populationEstimate: 1290000,
        etaStartMin: 65,
        etaPeakMin: 90,
        etaClearMin: 135,
        peakLightningProb: 0.82,
        peakDbz: 51,
        recommendedAction: 'Issue urban squall and cloud-to-ground lightning advisory; pre-stage municipal drainage pumps.',
      },
    ],
    track: [
      { timeOffsetMin: -60, lat: 22.62, lon: 86.78, maxDbz: 38, radiusKm: 14, stage: 'INITIATING' },
      { timeOffsetMin: -40, lat: 22.53, lon: 86.95, maxDbz: 45, radiusKm: 18, stage: 'GROWING' },
      { timeOffsetMin: -20, lat: 22.44, lon: 87.13, maxDbz: 51, radiusKm: 21, stage: 'GROWING' },
      { timeOffsetMin: 0, lat: 22.34, lon: 87.31, maxDbz: 56.5, radiusKm: 24, stage: 'GROWING' },
      { timeOffsetMin: 30, lat: 22.21, lon: 87.56, maxDbz: 58.0, radiusKm: 27, stage: 'MATURE' },
      { timeOffsetMin: 60, lat: 22.07, lon: 87.82, maxDbz: 55.5, radiusKm: 28, stage: 'MATURE' },
      { timeOffsetMin: 90, lat: 21.93, lon: 88.08, maxDbz: 52.0, radiusKm: 26, stage: 'MATURE' },
      { timeOffsetMin: 120, lat: 21.79, lon: 88.34, maxDbz: 47.5, radiusKm: 24, stage: 'DECAYING' },
      { timeOffsetMin: 150, lat: 21.66, lon: 88.58, maxDbz: 42.0, radiusKm: 21, stage: 'DECAYING' },
      { timeOffsetMin: 180, lat: 21.53, lon: 88.81, maxDbz: 36.5, radiusKm: 18, stage: 'DECAYING' },
    ],
  },
  {
    id: 'CELL-26072-B',
    designation: 'VN-402 · Mayurbhanj to Balasore Gap Supercell (VRF Active)',
    regionId: 'pilot_east',
    stage: 'MATURE',
    lat: 21.58,
    lon: 86.62,
    radiusKm: 26,
    areaKm2: 2120,
    maxDbz: 53.0,
    echoTopKm: 15.2,
    satBtTir1K: 199.8,
    coolingRateK20m: -12.4,
    wvMinusTirK: 5.4,
    ltgRateFlashesMin: 44.2,
    ltgJumpSigma: 3.1,
    isLightningJump: true,
    motionSpeedKmh: 48,
    motionBearingDeg: 108,
    ageMin: 65,
    capeJkg: 2980,
    cinJkg: -12,
    shear06Ms: 25.1,
    pwatMm: 61.4,
    moistureConvGkgS: 2.15,
    inRadarGap: true,
    vrfConfidence: 0.78,
    whySummary:
      'Located inside the Balasore radar outage zone: Virtual Radar Fill (U-Net) reconstructs a 53.0 dBZ core from INSAT-3DR 199.8 K overshooting tops, WV minus TIR (+5.4 K), and 44.2 flashes/min.',
    shapContributions: [
      {
        feature: 'Virtual Radar Fill (Sat + Ltg U-Net)',
        rawMetric: '53.0 dBZ (source=virtual)',
        shapDelta: 0.28,
        direction: 'POSITIVE',
        plainExplanation: 'Reconstructed reflectivity where DWR Balasore is masked; validated by 44.2 fl/min lightning density.',
      },
      {
        feature: 'WV minus TIR1 Brightness Temp Diff',
        rawMetric: '+5.4 K (Deep Overshoot)',
        shapDelta: 0.22,
        direction: 'POSITIVE',
        plainExplanation: 'Positive WV minus TIR difference indicates lower-stratospheric water vapour injection above anvil.',
      },
      {
        feature: 'Lightning Flash Density and Jump',
        rawMetric: '44.2 fl/min (+3.1s)',
        shapDelta: 0.19,
        direction: 'POSITIVE',
        plainExplanation: 'Intense mixed-phase graupel-ice collision charging in the mid-tropospheric updraft.',
      },
      {
        feature: 'Radar Beam Distance Penalty',
        rawMetric: 'source=virtual (conf 0.78)',
        shapDelta: -0.07,
        direction: 'NEGATIVE',
        plainExplanation: 'Honest uncertainty widens conformal interval by +/-3.4% due to masked local C-band radar.',
      },
    ],
    trustRibbon: {
      regionName: 'East India Pilot (VRF Mode)',
      season: 'Pre-Monsoon / Norwester',
      leadTimeMin: 60,
      probabilityBin: '0.80 to 0.90',
      forecastProbability: 0.84,
      observedHitRate: 0.81,
      conformalBandPct: 7.8,
      brierScore: 0.096,
      sampleCount: 285,
      calibrationGrade: 'WELL_CALIBRATED',
    },
    leadForecasts: [
      {
        leadMin: 0,
        hybridAi: { lightningProb: 0.94, dbz35Prob: 0.95, dbz45Prob: 0.87, pixelWeight: 0.68, cellWeight: 0.32, uncertaintyBand: 0.06 },
        imdBaseline: { lightningProb: 0.61, dbz35Prob: 0.58, dbz45Prob: 0.42 },
        opticalFlow: { lightningProb: 0.59, dbz35Prob: 0.56, dbz45Prob: 0.40 },
        persistence: { lightningProb: 0.55, dbz35Prob: 0.52, dbz45Prob: 0.38 },
      },
      {
        leadMin: 30,
        hybridAi: { lightningProb: 0.90, dbz35Prob: 0.91, dbz45Prob: 0.82, pixelWeight: 0.58, cellWeight: 0.42, uncertaintyBand: 0.07 },
        imdBaseline: { lightningProb: 0.54, dbz35Prob: 0.51, dbz45Prob: 0.36 },
        opticalFlow: { lightningProb: 0.52, dbz35Prob: 0.49, dbz45Prob: 0.35 },
        persistence: { lightningProb: 0.44, dbz35Prob: 0.41, dbz45Prob: 0.28 },
      },
      {
        leadMin: 60,
        hybridAi: { lightningProb: 0.84, dbz35Prob: 0.86, dbz45Prob: 0.74, pixelWeight: 0.48, cellWeight: 0.52, uncertaintyBand: 0.08 },
        imdBaseline: { lightningProb: 0.45, dbz35Prob: 0.43, dbz45Prob: 0.29 },
        opticalFlow: { lightningProb: 0.43, dbz35Prob: 0.41, dbz45Prob: 0.28 },
        persistence: { lightningProb: 0.31, dbz35Prob: 0.29, dbz45Prob: 0.19 },
      },
      {
        leadMin: 90,
        hybridAi: { lightningProb: 0.76, dbz35Prob: 0.78, dbz45Prob: 0.64, pixelWeight: 0.42, cellWeight: 0.58, uncertaintyBand: 0.09 },
        imdBaseline: { lightningProb: 0.38, dbz35Prob: 0.36, dbz45Prob: 0.23 },
        opticalFlow: { lightningProb: 0.35, dbz35Prob: 0.34, dbz45Prob: 0.21 },
        persistence: { lightningProb: 0.22, dbz35Prob: 0.21, dbz45Prob: 0.13 },
      },
      {
        leadMin: 120,
        hybridAi: { lightningProb: 0.67, dbz35Prob: 0.69, dbz45Prob: 0.52, pixelWeight: 0.36, cellWeight: 0.64, uncertaintyBand: 0.10 },
        imdBaseline: { lightningProb: 0.30, dbz35Prob: 0.29, dbz45Prob: 0.18 },
        opticalFlow: { lightningProb: 0.28, dbz35Prob: 0.27, dbz45Prob: 0.16 },
        persistence: { lightningProb: 0.15, dbz35Prob: 0.14, dbz45Prob: 0.09 },
      },
      {
        leadMin: 150,
        hybridAi: { lightningProb: 0.56, dbz35Prob: 0.58, dbz45Prob: 0.40, pixelWeight: 0.32, cellWeight: 0.68, uncertaintyBand: 0.11 },
        imdBaseline: { lightningProb: 0.23, dbz35Prob: 0.22, dbz45Prob: 0.13 },
        opticalFlow: { lightningProb: 0.21, dbz35Prob: 0.20, dbz45Prob: 0.11 },
        persistence: { lightningProb: 0.11, dbz35Prob: 0.10, dbz45Prob: 0.06 },
      },
      {
        leadMin: 180,
        hybridAi: { lightningProb: 0.45, dbz35Prob: 0.47, dbz45Prob: 0.29, pixelWeight: 0.28, cellWeight: 0.72, uncertaintyBand: 0.12 },
        imdBaseline: { lightningProb: 0.18, dbz35Prob: 0.17, dbz45Prob: 0.09 },
        opticalFlow: { lightningProb: 0.16, dbz35Prob: 0.15, dbz45Prob: 0.08 },
        persistence: { lightningProb: 0.08, dbz35Prob: 0.07, dbz45Prob: 0.04 },
      },
    ],
    impactedBlocks: [
      {
        district: 'Balasore',
        blockName: 'Jaleswar · Basta · Baliapal',
        populationEstimate: 410000,
        etaStartMin: 10,
        etaPeakMin: 25,
        etaClearMin: 60,
        peakLightningProb: 0.91,
        peakDbz: 53,
        recommendedAction: 'Alert coastal fishing vessels and Subarnarekha riverine panchayats immediately.',
      },
      {
        district: 'Purba Medinipur',
        blockName: 'Digha · Ramnagar-I · Contai',
        populationEstimate: 530000,
        etaStartMin: 40,
        etaPeakMin: 65,
        etaClearMin: 105,
        peakLightningProb: 0.84,
        peakDbz: 50,
        recommendedAction: 'Clear coastal beaches and tourist promenades; warn marine trawlers within 30 km offshore.',
      },
    ],
    track: [
      { timeOffsetMin: -60, lat: 21.79, lon: 86.10, maxDbz: 42, radiusKm: 18, stage: 'GROWING', isVirtualFilled: true },
      { timeOffsetMin: -40, lat: 21.72, lon: 86.27, maxDbz: 47, radiusKm: 21, stage: 'GROWING', isVirtualFilled: true },
      { timeOffsetMin: -20, lat: 21.65, lon: 86.45, maxDbz: 51, radiusKm: 24, stage: 'MATURE', isVirtualFilled: true },
      { timeOffsetMin: 0, lat: 21.58, lon: 86.62, maxDbz: 53.0, radiusKm: 26, stage: 'MATURE', isVirtualFilled: true },
      { timeOffsetMin: 30, lat: 21.49, lon: 86.87, maxDbz: 52.0, radiusKm: 26, stage: 'MATURE', isVirtualFilled: true },
      { timeOffsetMin: 60, lat: 21.39, lon: 87.12, maxDbz: 49.5, radiusKm: 25, stage: 'MATURE', isVirtualFilled: true },
      { timeOffsetMin: 90, lat: 21.29, lon: 87.37, maxDbz: 46.0, radiusKm: 23, stage: 'DECAYING' },
      { timeOffsetMin: 120, lat: 21.19, lon: 87.62, maxDbz: 41.5, radiusKm: 20, stage: 'DECAYING' },
      { timeOffsetMin: 150, lat: 21.09, lon: 87.86, maxDbz: 37.0, radiusKm: 18, stage: 'DECAYING' },
      { timeOffsetMin: 180, lat: 20.99, lon: 88.10, maxDbz: 32.0, radiusKm: 15, stage: 'DECAYING' },
    ],
  },
  {
    id: 'CELL-26072-C',
    designation: 'VN-403 · Purulia to Bankura Pre-Echo Initiation Candidate',
    regionId: 'pilot_east',
    stage: 'INITIATING',
    lat: 23.22,
    lon: 86.52,
    radiusKm: 15,
    areaKm2: 706,
    maxDbz: 24.5,
    echoTopKm: 9.4,
    satBtTir1K: 226.4,
    coolingRateK20m: -17.2,
    wvMinusTirK: 2.9,
    ltgRateFlashesMin: 6.8,
    ltgJumpSigma: 2.1,
    isLightningJump: true,
    motionSpeedKmh: 42,
    motionBearingDeg: 115,
    ageMin: 15,
    capeJkg: 3320,
    cinJkg: -14,
    shear06Ms: 21.8,
    pwatMm: 54.6,
    moistureConvGkgS: 2.34,
    inRadarGap: false,
    vrfConfidence: 0.91,
    whySummary:
      'Convective Initiation detected 25 to 35 min BEFORE 35 dBZ radar threshold: INSAT-3DR shows -17.2 K / 20 min explosive cloud-top cooling over Purulia dryline with 3,320 J/kg CAPE. Optical-flow misses this completely.',
    shapContributions: [
      {
        feature: 'INSAT Cloud-Top Cooling (Delta BT)',
        rawMetric: '-17.2 K / 20 min',
        shapDelta: 0.34,
        direction: 'POSITIVE',
        plainExplanation: 'Explosive cumulus congestus glaciation detected prior to heavy precipitation fallout.',
      },
      {
        feature: 'Low-Level Moisture Convergence',
        rawMetric: '+2.34 g/kg·s (Dryline)',
        shapDelta: 0.23,
        direction: 'POSITIVE',
        plainExplanation: 'Chota Nagpur plateau dryline convergence lifting high-theta-e boundary layer air.',
      },
      {
        feature: 'NWP CAPE Conditioning',
        rawMetric: '3,320 J/kg · CIN -14 J/kg',
        shapDelta: 0.18,
        direction: 'POSITIVE',
        plainExplanation: 'Capping inversion eroded; parcel ascent uninhibited through 200 hPa.',
      },
      {
        feature: 'Current Radar Reflectivity',
        rawMetric: '24.5 dBZ (Pre-35 dBZ)',
        shapDelta: -0.09,
        direction: 'NEGATIVE',
        plainExplanation: 'Hydrometeors still aloft in growing updraft; radar echo will surge above 45 dBZ within +30 min.',
      },
    ],
    trustRibbon: {
      regionName: 'East India Pilot (Initiation Head)',
      season: 'Pre-Monsoon / Norwester',
      leadTimeMin: 60,
      probabilityBin: '0.70 to 0.80',
      forecastProbability: 0.79,
      observedHitRate: 0.76,
      conformalBandPct: 6.4,
      brierScore: 0.102,
      sampleCount: 318,
      calibrationGrade: 'WELL_CALIBRATED',
    },
    leadForecasts: [
      {
        leadMin: 0,
        hybridAi: { lightningProb: 0.48, dbz35Prob: 0.32, dbz45Prob: 0.14, pixelWeight: 0.25, cellWeight: 0.75, uncertaintyBand: 0.06 },
        imdBaseline: { lightningProb: 0.18, dbz35Prob: 0.15, dbz45Prob: 0.05 },
        opticalFlow: { lightningProb: 0.12, dbz35Prob: 0.10, dbz45Prob: 0.03 },
        persistence: { lightningProb: 0.12, dbz35Prob: 0.10, dbz45Prob: 0.03 },
      },
      {
        leadMin: 30,
        hybridAi: { lightningProb: 0.76, dbz35Prob: 0.78, dbz45Prob: 0.58, pixelWeight: 0.30, cellWeight: 0.70, uncertaintyBand: 0.07 },
        imdBaseline: { lightningProb: 0.22, dbz35Prob: 0.19, dbz45Prob: 0.08 },
        opticalFlow: { lightningProb: 0.11, dbz35Prob: 0.09, dbz45Prob: 0.02 },
        persistence: { lightningProb: 0.10, dbz35Prob: 0.08, dbz45Prob: 0.02 },
      },
      {
        leadMin: 60,
        hybridAi: { lightningProb: 0.79, dbz35Prob: 0.82, dbz45Prob: 0.67, pixelWeight: 0.38, cellWeight: 0.62, uncertaintyBand: 0.07 },
        imdBaseline: { lightningProb: 0.24, dbz35Prob: 0.21, dbz45Prob: 0.09 },
        opticalFlow: { lightningProb: 0.09, dbz35Prob: 0.08, dbz45Prob: 0.02 },
        persistence: { lightningProb: 0.08, dbz35Prob: 0.07, dbz45Prob: 0.01 },
      },
      {
        leadMin: 90,
        hybridAi: { lightningProb: 0.75, dbz35Prob: 0.77, dbz45Prob: 0.61, pixelWeight: 0.45, cellWeight: 0.55, uncertaintyBand: 0.08 },
        imdBaseline: { lightningProb: 0.20, dbz35Prob: 0.18, dbz45Prob: 0.07 },
        opticalFlow: { lightningProb: 0.07, dbz35Prob: 0.06, dbz45Prob: 0.01 },
        persistence: { lightningProb: 0.06, dbz35Prob: 0.05, dbz45Prob: 0.01 },
      },
      {
        leadMin: 120,
        hybridAi: { lightningProb: 0.66, dbz35Prob: 0.68, dbz45Prob: 0.49, pixelWeight: 0.48, cellWeight: 0.52, uncertaintyBand: 0.09 },
        imdBaseline: { lightningProb: 0.16, dbz35Prob: 0.15, dbz45Prob: 0.05 },
        opticalFlow: { lightningProb: 0.05, dbz35Prob: 0.05, dbz45Prob: 0.01 },
        persistence: { lightningProb: 0.05, dbz35Prob: 0.04, dbz45Prob: 0.01 },
      },
      {
        leadMin: 150,
        hybridAi: { lightningProb: 0.54, dbz35Prob: 0.56, dbz45Prob: 0.38, pixelWeight: 0.50, cellWeight: 0.50, uncertaintyBand: 0.10 },
        imdBaseline: { lightningProb: 0.12, dbz35Prob: 0.11, dbz45Prob: 0.04 },
        opticalFlow: { lightningProb: 0.04, dbz35Prob: 0.04, dbz45Prob: 0.01 },
        persistence: { lightningProb: 0.04, dbz35Prob: 0.03, dbz45Prob: 0.01 },
      },
      {
        leadMin: 180,
        hybridAi: { lightningProb: 0.42, dbz35Prob: 0.44, dbz45Prob: 0.27, pixelWeight: 0.50, cellWeight: 0.50, uncertaintyBand: 0.11 },
        imdBaseline: { lightningProb: 0.09, dbz35Prob: 0.08, dbz45Prob: 0.03 },
        opticalFlow: { lightningProb: 0.03, dbz35Prob: 0.03, dbz45Prob: 0.01 },
        persistence: { lightningProb: 0.03, dbz35Prob: 0.02, dbz45Prob: 0.01 },
      },
    ],
    impactedBlocks: [
      {
        district: 'Bankura',
        blockName: 'Chhatna · Bankura-I · Onda',
        populationEstimate: 380000,
        etaStartMin: 25,
        etaPeakMin: 50,
        etaClearMin: 90,
        peakLightningProb: 0.79,
        peakDbz: 49,
        recommendedAction: 'Early pre-echo lightning warning for paddy field workers; cell rapidly intensifying.',
      },
      {
        district: 'Purba Bardhaman',
        blockName: 'Khandaghosh · Burdwan-I',
        populationEstimate: 510000,
        etaStartMin: 70,
        etaPeakMin: 95,
        etaClearMin: 140,
        peakLightningProb: 0.74,
        peakDbz: 47,
        recommendedAction: 'Issue block-level agro-meteorological lightning alert via SDMA SMS gateway.',
      },
    ],
    track: [
      { timeOffsetMin: -60, lat: 23.42, lon: 86.08, maxDbz: 12, radiusKm: 8, stage: 'INITIATING' },
      { timeOffsetMin: -40, lat: 23.35, lon: 86.22, maxDbz: 16, radiusKm: 10, stage: 'INITIATING' },
      { timeOffsetMin: -20, lat: 23.29, lon: 86.37, maxDbz: 20, radiusKm: 12, stage: 'INITIATING' },
      { timeOffsetMin: 0, lat: 23.22, lon: 86.52, maxDbz: 24.5, radiusKm: 15, stage: 'INITIATING' },
      { timeOffsetMin: 30, lat: 23.12, lon: 86.74, maxDbz: 44.0, radiusKm: 20, stage: 'GROWING' },
      { timeOffsetMin: 60, lat: 23.01, lon: 86.97, maxDbz: 51.0, radiusKm: 24, stage: 'MATURE' },
      { timeOffsetMin: 90, lat: 22.90, lon: 87.20, maxDbz: 49.0, radiusKm: 23, stage: 'MATURE' },
      { timeOffsetMin: 120, lat: 22.79, lon: 87.43, maxDbz: 43.5, radiusKm: 21, stage: 'DECAYING' },
      { timeOffsetMin: 150, lat: 22.68, lon: 87.65, maxDbz: 37.0, radiusKm: 18, stage: 'DECAYING' },
      { timeOffsetMin: 180, lat: 22.58, lon: 87.86, maxDbz: 31.0, radiusKm: 15, stage: 'DECAYING' },
    ],
  },
  {
    id: 'CELL-26072-D',
    designation: 'VN-404 · Sundarbans to Gosaba Outflow Remnant',
    regionId: 'pilot_east',
    stage: 'DECAYING',
    lat: 21.88,
    lon: 88.78,
    radiusKm: 19,
    areaKm2: 1134,
    maxDbz: 39.0,
    echoTopKm: 10.2,
    satBtTir1K: 234.5,
    coolingRateK20m: 6.4,
    wvMinusTirK: -3.2,
    ltgRateFlashesMin: 4.2,
    ltgJumpSigma: -1.4,
    isLightningJump: false,
    motionSpeedKmh: 36,
    motionBearingDeg: 102,
    ageMin: 115,
    capeJkg: 920,
    cinJkg: -84,
    shear06Ms: 11.2,
    pwatMm: 49.0,
    moistureConvGkgS: -0.45,
    inRadarGap: false,
    vrfConfidence: 0.96,
    whySummary:
      'LightGBM Cell Brain classifies DECAYING stage: cloud-top warming (+6.4 K / 20 min), flash rate dropped 72%, and cold-pool CIN (-84 J/kg) cuts off surface inflow. Prevents false-alarm warning extension.',
    shapContributions: [
      {
        feature: 'Anvil Cloud-Top Warming (Delta BT)',
        rawMetric: '+6.4 K / 20 min',
        shapDelta: -0.27,
        direction: 'NEGATIVE',
        plainExplanation: 'Updraft collapse confirmed by rapidly warming TIR1 brightness temperature.',
      },
      {
        feature: 'Convective Inhibition (Cold Pool)',
        rawMetric: 'CIN -84 J/kg · CAPE 920',
        shapDelta: -0.21,
        direction: 'NEGATIVE',
        plainExplanation: 'Rain-cooled outflow stabilized the boundary layer; new parcel ascent blocked.',
      },
      {
        feature: 'Flash Trend Collapse',
        rawMetric: '4.2 fl/min (-1.4s)',
        shapDelta: -0.16,
        direction: 'NEGATIVE',
        plainExplanation: 'Mixed-phase riming ceased; only isolated stratiform anvil crawlers remain.',
      },
      {
        feature: 'Residual Radar Core',
        rawMetric: '39.0 dBZ',
        shapDelta: 0.11,
        direction: 'POSITIVE',
        plainExplanation: 'Stratiform rain shield still produces moderate echoes for ~30 min before dissipation.',
      },
    ],
    trustRibbon: {
      regionName: 'East India Pilot (Decay Filter)',
      season: 'Pre-Monsoon / Norwester',
      leadTimeMin: 60,
      probabilityBin: '0.10 to 0.20',
      forecastProbability: 0.16,
      observedHitRate: 0.15,
      conformalBandPct: 4.1,
      brierScore: 0.068,
      sampleCount: 390,
      calibrationGrade: 'WELL_CALIBRATED',
    },
    leadForecasts: [
      {
        leadMin: 0,
        hybridAi: { lightningProb: 0.34, dbz35Prob: 0.62, dbz45Prob: 0.18, pixelWeight: 0.40, cellWeight: 0.60, uncertaintyBand: 0.04 },
        imdBaseline: { lightningProb: 0.58, dbz35Prob: 0.74, dbz45Prob: 0.38 },
        opticalFlow: { lightningProb: 0.64, dbz35Prob: 0.78, dbz45Prob: 0.42 },
        persistence: { lightningProb: 0.68, dbz35Prob: 0.80, dbz45Prob: 0.45 },
      },
      {
        leadMin: 30,
        hybridAi: { lightningProb: 0.22, dbz35Prob: 0.38, dbz45Prob: 0.08, pixelWeight: 0.32, cellWeight: 0.68, uncertaintyBand: 0.04 },
        imdBaseline: { lightningProb: 0.49, dbz35Prob: 0.62, dbz45Prob: 0.29 },
        opticalFlow: { lightningProb: 0.58, dbz35Prob: 0.71, dbz45Prob: 0.36 },
        persistence: { lightningProb: 0.60, dbz35Prob: 0.72, dbz45Prob: 0.38 },
      },
      {
        leadMin: 60,
        hybridAi: { lightningProb: 0.16, dbz35Prob: 0.21, dbz45Prob: 0.04, pixelWeight: 0.25, cellWeight: 0.75, uncertaintyBand: 0.05 },
        imdBaseline: { lightningProb: 0.41, dbz35Prob: 0.52, dbz45Prob: 0.22 },
        opticalFlow: { lightningProb: 0.51, dbz35Prob: 0.64, dbz45Prob: 0.31 },
        persistence: { lightningProb: 0.52, dbz35Prob: 0.65, dbz45Prob: 0.32 },
      },
      {
        leadMin: 90,
        hybridAi: { lightningProb: 0.09, dbz35Prob: 0.12, dbz45Prob: 0.02, pixelWeight: 0.22, cellWeight: 0.78, uncertaintyBand: 0.05 },
        imdBaseline: { lightningProb: 0.34, dbz35Prob: 0.44, dbz45Prob: 0.16 },
        opticalFlow: { lightningProb: 0.45, dbz35Prob: 0.56, dbz45Prob: 0.25 },
        persistence: { lightningProb: 0.46, dbz35Prob: 0.58, dbz45Prob: 0.26 },
      },
      {
        leadMin: 120,
        hybridAi: { lightningProb: 0.05, dbz35Prob: 0.07, dbz45Prob: 0.01, pixelWeight: 0.20, cellWeight: 0.80, uncertaintyBand: 0.04 },
        imdBaseline: { lightningProb: 0.28, dbz35Prob: 0.36, dbz45Prob: 0.12 },
        opticalFlow: { lightningProb: 0.39, dbz35Prob: 0.48, dbz45Prob: 0.20 },
        persistence: { lightningProb: 0.40, dbz35Prob: 0.50, dbz45Prob: 0.21 },
      },
      {
        leadMin: 150,
        hybridAi: { lightningProb: 0.03, dbz35Prob: 0.04, dbz45Prob: 0.01, pixelWeight: 0.20, cellWeight: 0.80, uncertaintyBand: 0.03 },
        imdBaseline: { lightningProb: 0.22, dbz35Prob: 0.28, dbz45Prob: 0.09 },
        opticalFlow: { lightningProb: 0.33, dbz35Prob: 0.41, dbz45Prob: 0.16 },
        persistence: { lightningProb: 0.35, dbz35Prob: 0.44, dbz45Prob: 0.18 },
      },
      {
        leadMin: 180,
        hybridAi: { lightningProb: 0.02, dbz35Prob: 0.02, dbz45Prob: 0.00, pixelWeight: 0.20, cellWeight: 0.80, uncertaintyBand: 0.03 },
        imdBaseline: { lightningProb: 0.18, dbz35Prob: 0.22, dbz45Prob: 0.06 },
        opticalFlow: { lightningProb: 0.28, dbz35Prob: 0.35, dbz45Prob: 0.12 },
        persistence: { lightningProb: 0.30, dbz35Prob: 0.38, dbz45Prob: 0.14 },
      },
    ],
    impactedBlocks: [
      {
        district: 'South 24 Parganas',
        blockName: 'Gosaba · Basanti (Sundarbans)',
        populationEstimate: 265000,
        etaStartMin: 0,
        etaPeakMin: 15,
        etaClearMin: 40,
        peakLightningProb: 0.34,
        peakDbz: 39,
        recommendedAction: 'Downgrade severe warning to light-to-moderate rain advisory; prevents false-alarm fatigue.',
      },
    ],
    track: [
      { timeOffsetMin: -60, lat: 22.02, lon: 88.22, maxDbz: 52, radiusKm: 25, stage: 'MATURE' },
      { timeOffsetMin: -40, lat: 21.97, lon: 88.41, maxDbz: 48, radiusKm: 23, stage: 'MATURE' },
      { timeOffsetMin: -20, lat: 21.92, lon: 88.60, maxDbz: 44, radiusKm: 21, stage: 'DECAYING' },
      { timeOffsetMin: 0, lat: 21.88, lon: 88.78, maxDbz: 39.0, radiusKm: 19, stage: 'DECAYING' },
      { timeOffsetMin: 30, lat: 21.82, lon: 88.98, maxDbz: 33.0, radiusKm: 16, stage: 'DECAYING' },
      { timeOffsetMin: 60, lat: 21.76, lon: 89.16, maxDbz: 26.0, radiusKm: 13, stage: 'DECAYING' },
      { timeOffsetMin: 90, lat: 21.71, lon: 89.32, maxDbz: 19.0, radiusKm: 10, stage: 'DECAYING' },
      { timeOffsetMin: 120, lat: 21.66, lon: 89.46, maxDbz: 14.0, radiusKm: 8, stage: 'DECAYING' },
      { timeOffsetMin: 150, lat: 21.62, lon: 89.58, maxDbz: 10.0, radiusKm: 6, stage: 'DECAYING' },
      { timeOffsetMin: 180, lat: 21.58, lon: 89.68, maxDbz: 8.0, radiusKm: 5, stage: 'DECAYING' },
    ],
  },
];

export const INITIAL_CAP_ALERTS: CapAlert[] = [
  {
    id: 'CAP-20260929-ER-001',
    capIdentifier: 'IN-IMD-STORMSIGHT-20260929-401',
    cellId: 'CELL-26072-A',
    cellDesignation: 'VN-401 · Kharagpur to Midnapore Squall Core',
    regionId: 'pilot_east',
    status: 'DRAFT',
    createdAt: '2026-09-29T08:20:00Z',
    updatedAt: '2026-09-29T08:20:00Z',
    effectiveWindow: '08:25 UTC to 10:35 UTC (+5 to +135 min)',
    expiresAt: '2026-09-29T10:40:00Z',
    severity: 'Severe',
    urgency: 'Immediate',
    certainty: 'Likely',
    lightningProb: 0.88,
    severeDbzProb: 0.78,
    leadTimeMin: 60,
    headlineEn:
      'Severe Thunderstorm and Intense Cloud-to-Ground Lightning Alert for Paschim Medinipur, Howrah and Kolkata',
    descriptionEn:
      'StormSight Hybrid Nowcast tracks a rapidly growing squall line (VN-401, max echo 56.5 dBZ, 38.4 flashes/min with +2.9s lightning jump) moving ESE at 54 km/h. Cloud-top cooled 15.6 K in 20 minutes over a 3,140 J/kg CAPE pool. High probability (88%) of intense lightning and >50 dBZ convective cores over the next 60 to 90 minutes.',
    instructionEn:
      'Move indoors into grounded masonry buildings immediately. Suspend open-field agricultural harvesting, river ferry operations on Hooghly/Rupnarayan, and outdoor crane maintenance until +95 min.',
    regionalLangCode: 'bn',
    regionalLangLabel: 'Bengali (বাংলা)',
    headlineRegional:
      'পশ্চিম মেদিনীপুর, হাওড়া এবং কলকাতার জন্য তীব্র বজ্রবিদ্যুৎ ও কালবৈশাখী ঝড়ের সতর্কবার্তা',
    descriptionRegional:
      'স্টর্মসাইট (StormSight) হাইব্রিড নাউকাস্ট ৫৬.৫ dBZ প্রতিফলন এবং প্রতি মিনিটে ৩৮.৪টি বজ্রপাত সহ একটি দ্রুত বর্ধনশীল ঝড়ের কোষ (VN-401) ট্র্যাক করছে যা ঘণ্টায় ৫৪ কিমি বেগে অগ্রসর হচ্ছে। আগামী ৬০ থেকে ৯০ মিনিটের মধ্যে তীব্র বজ্রপাতের সম্ভাবনা ৮৮%।',
    instructionRegional:
      'অবিলম্বে পাকা ও নিরাপদ আশ্রয়ে চলে যান। খোলা মাঠে চাষের কাজ, হুগলি ও রূপনারায়ণ নদীতে ফেরি চলাচল এবং খোলা জায়গায় অবস্থান বন্ধ রাখুন।',
    polygonCoords: [
      [22.52, 87.12],
      [22.64, 88.45],
      [22.15, 88.58],
      [21.98, 87.24],
    ],
    impactedBlocks: INITIAL_STORM_CELLS[0].impactedBlocks,
    channels: ['CAP_FEED', 'SDMA_DASHBOARD', 'SMS_GATEWAY', 'WEBHOOK'],
    whyHeadline: 'Cloud top cooled 15.6 K in 20 min · Lightning jump +2.9s · CAPE 3,140 J/kg',
    trustHitRate: 0.85,
    auditLog: [
      {
        timestamp: '08:20:04 UTC',
        actor: 'StormSight Decision Engine v1.4',
        role: 'FORECASTER',
        action: 'AUTO_DRAFTED',
        notes: 'Triggered by calibrated lightning_p = 0.88 (>= 0.60 threshold) and severe_p = 0.78.',
      },
    ],
  },
  {
    id: 'CAP-20260929-ER-002',
    capIdentifier: 'IN-IMD-STORMSIGHT-20260929-402',
    cellId: 'CELL-26072-B',
    cellDesignation: 'VN-402 · Mayurbhanj to Balasore Gap Supercell (VRF Active)',
    regionId: 'pilot_east',
    status: 'APPROVED',
    createdAt: '2026-09-29T08:10:00Z',
    updatedAt: '2026-09-29T08:14:22Z',
    effectiveWindow: '08:20 UTC to 10:05 UTC (+10 to +105 min)',
    expiresAt: '2026-09-29T10:15:00Z',
    severity: 'Severe',
    urgency: 'Immediate',
    certainty: 'Likely',
    lightningProb: 0.84,
    severeDbzProb: 0.74,
    leadTimeMin: 60,
    headlineEn:
      'Coastal Severe Lightning and Squall Warning for Balasore (Jaleswar, Basta) and Purba Medinipur (Digha, Contai)',
    descriptionEn:
      'Virtual Radar Fill (VRF) and INSAT-3DR overshooting-top imagery (199.8 K) confirm a mature 53.0 dBZ convective cell with 44.2 flashes/min crossing the Balasore to Digha coastal corridor at 48 km/h.',
    instructionEn:
      'Evacuate open beaches at Digha, Mandarmani, and Talsari immediately. Recall artisanal fishing boats within 30 km of shore.',
    regionalLangCode: 'bn',
    regionalLangLabel: 'Bengali (বাংলা)',
    headlineRegional:
      'বালেশ্বর এবং পূর্ব মেদিনীপুর (দিঘা ও কাঁথি) উপকূলীয় অঞ্চলে তীব্র বজ্রপাত ও ঝড়ের সতর্কতা',
    descriptionRegional:
      'ভার্চুয়াল রাডার ফিল (VRF) এবং ইনস্যাট-৩ডিআর উপগ্রহ চিত্রে বালেশ্বর ও দিঘা উপকূলের দিকে ৪৮ কিমি/ঘণ্টা বেগে অগ্রসরমান একটি শক্তিশালী বজ্রগর্ভ মেঘ (৫৩.০ dBZ, ৪৪.২ বজ্রপাত/মিনিট) শনাক্ত হয়েছে।',
    instructionRegional:
      'দিঘা ও মন্দারমণি সমুদ্র সৈকত অবিলম্বে খালি করুন। উপকূলীয় মৎস্যজীবীদের দ্রুত নিরাপদ বন্দরে ফিরে আসার নির্দেশ দেওয়া হচ্ছে।',
    polygonCoords: [
      [21.75, 86.45],
      [21.68, 87.65],
      [21.18, 87.58],
      [21.26, 86.38],
    ],
    impactedBlocks: INITIAL_STORM_CELLS[1].impactedBlocks,
    channels: ['CAP_FEED', 'SDMA_DASHBOARD', 'SMS_GATEWAY'],
    whyHeadline: 'Virtual Radar Fill 53.0 dBZ · WV minus TIR +5.4 K · 44.2 flashes/min (+3.1s)',
    trustHitRate: 0.81,
    auditLog: [
      {
        timestamp: '08:10:02 UTC',
        actor: 'StormSight Decision Engine v1.4',
        role: 'FORECASTER',
        action: 'AUTO_DRAFTED',
        notes: 'Flagged via VRF satellite-lightning fusion during DWR Balasore mask.',
      },
      {
        timestamp: '08:14:22 UTC',
        actor: 'Dr. A. Chatterjee (Duty Officer)',
        role: 'FORECASTER',
        action: 'APPROVED',
        notes: 'Verified VRF reflectivity against IITM lightning stroke cluster; approved for SDMA dispatch.',
      },
    ],
  },
  {
    id: 'CAP-20260929-ER-003',
    capIdentifier: 'IN-IMD-STORMSIGHT-20260929-403',
    cellId: 'CELL-26072-C',
    cellDesignation: 'VN-403 · Purulia to Bankura Pre-Echo Initiation Candidate',
    regionId: 'pilot_east',
    status: 'DRAFT',
    createdAt: '2026-09-29T08:22:00Z',
    updatedAt: '2026-09-29T08:22:00Z',
    effectiveWindow: '08:45 UTC to 10:40 UTC (+25 to +140 min)',
    expiresAt: '2026-09-29T10:45:00Z',
    severity: 'Moderate',
    urgency: 'Expected',
    certainty: 'Likely',
    lightningProb: 0.79,
    severeDbzProb: 0.67,
    leadTimeMin: 60,
    headlineEn:
      'Early Convective Initiation and Lightning Advisory for Bankura and Purba Bardhaman (+25 to +90 min)',
    descriptionEn:
      'Pre-echo satellite cooling (-17.2 K / 20 min) and dryline moisture convergence (+2.34 g/kg·s) indicate rapid thunderstorm initiation over Bankura within 25 to 35 minutes, intensifying >45 dBZ by +60 min.',
    instructionEn:
      'Farmers and outdoor workers in Chhatna, Bankura-I, and Onda blocks should plan shelter before 08:45 UTC as cloud-to-ground lightning will begin rapidly.',
    regionalLangCode: 'bn',
    regionalLangLabel: 'Bengali (বাংলা)',
    headlineRegional:
      'বাঁকুড়া এবং পূর্ব বর্ধমান জেলার জন্য আগাম বজ্রগর্ভ মেঘ সৃষ্টি ও বজ্রপাতের সতর্কবার্তা',
    descriptionRegional:
      'উপগ্রহ চিত্রে মেঘের শীর্ষভাগের দ্রুত শীতলীকরণ (-১৭.২ K / ২০ মিনিট) থেকে স্পষ্ট যে আগামী ২৫ থেকে ৩৫ মিনিটের মধ্যে বাঁকুড়ার ওপর তীব্র বজ্রবিদ্যুৎ সহ ঝড় সৃষ্টি হতে চলেছে।',
    instructionRegional:
      'ছাতনা, বাঁকুড়া-১ এবং ওন্দা ব্লকের কৃষক ও খোলা মাঠের কর্মীদের আগামী ২৫ মিনিটের মধ্যে নিরাপদ আশ্রয়ে যাওয়ার পরামর্শ দেওয়া হচ্ছে।',
    polygonCoords: [
      [23.38, 86.42],
      [23.22, 87.58],
      [22.72, 87.52],
      [22.88, 86.35],
    ],
    impactedBlocks: INITIAL_STORM_CELLS[2].impactedBlocks,
    channels: ['CAP_FEED', 'SDMA_DASHBOARD'],
    whyHeadline: 'Pre-echo initiation: -17.2 K / 20 min cooling · Dryline convergence +2.34 g/kg·s',
    trustHitRate: 0.76,
    auditLog: [
      {
        timestamp: '08:22:11 UTC',
        actor: 'StormSight Initiation Head (LightGBM)',
        role: 'FORECASTER',
        action: 'AUTO_DRAFTED',
        notes: 'Seeded from INSAT cooling candidate before 35 dBZ radar echo threshold.',
      },
    ],
  },
];

export const INITIAL_SOURCE_ADAPTERS: SourceAdapterItem[] = [
  {
    id: 'src_dwr_kolkata',
    name: 'dwr_kolkata (IMD S-Band DWR)',
    category: 'RADAR',
    adapterClass: 'adapters.radar.OdimHdf5',
    format: 'ODIM_H5 / Volumetric Polar to 2 km Zarr',
    pathOrEndpoint: 'data/radar/dwr_kolkata/',
    resolutionKm: 2.0,
    cadenceMin: 10,
    lastIngestTime: '08:20:00 UTC',
    freshnessSec: 42,
    status: 'LIVE',
    qcPassRatePct: 98.7,
    qcFlagsActive: ['CLUTTER_DOPPLER_FILTER', 'BEAM_BLOCK_CORRECTION'],
    configSnippet: `- {name: dwr_kolkata, adapter: adapters.radar.OdimHdf5, path: "data/radar/dwr_kolkata/", weight_rule: range_beam}`,
  },
  {
    id: 'src_dwr_paradip',
    name: 'dwr_paradip (IMD S-Band Coastal)',
    category: 'RADAR',
    adapterClass: 'adapters.radar.OdimHdf5',
    format: 'ODIM_H5 / Volumetric Polar to 2 km Zarr',
    pathOrEndpoint: 'data/radar/dwr_paradip/',
    resolutionKm: 2.0,
    cadenceMin: 10,
    lastIngestTime: '08:20:00 UTC',
    freshnessSec: 68,
    status: 'LIVE',
    qcPassRatePct: 97.4,
    qcFlagsActive: ['SEA_CLUTTER_SUPPRESSION', 'AP_ANOMALOUS_PROP_CHECK'],
    configSnippet: `- {name: dwr_paradip, adapter: adapters.radar.OdimHdf5, path: "data/radar/dwr_paradip/", weight_rule: range_beam}`,
  },
  {
    id: 'src_dwr_ranchi',
    name: 'dwr_ranchi (IMD S-Band Plateau)',
    category: 'RADAR',
    adapterClass: 'adapters.radar.OdimHdf5',
    format: 'ODIM_H5 / Volumetric Polar to 2 km Zarr',
    pathOrEndpoint: 'data/radar/dwr_ranchi/',
    resolutionKm: 2.0,
    cadenceMin: 10,
    lastIngestTime: '08:20:00 UTC',
    freshnessSec: 55,
    status: 'LIVE',
    qcPassRatePct: 99.1,
    qcFlagsActive: ['OROGRAPHIC_CLUTTER_MASK'],
    configSnippet: `- {name: dwr_ranchi, adapter: adapters.radar.OdimHdf5, path: "data/radar/dwr_ranchi/", weight_rule: range_beam}`,
  },
  {
    id: 'src_insat_3dr',
    name: 'insat_imager (ISRO/IMD INSAT-3DR/3DS)',
    category: 'SATELLITE',
    adapterClass: 'adapters.sat.MosdacH5',
    format: 'HDF5 L1B Geostationary to Parallax Corrected 2 km Grid',
    pathOrEndpoint: 'stream://mosdac.gov.in/insat3dr/l1b',
    resolutionKm: 4.0,
    cadenceMin: 15,
    lastIngestTime: '08:15:00 UTC',
    freshnessSec: 110,
    status: 'LIVE',
    qcPassRatePct: 99.8,
    qcFlagsActive: ['PARALLAX_SHIFT_CORRECTION', 'NAV_LIMB_CHECK'],
    configSnippet: `- {name: insat_imager, adapter: adapters.sat.MosdacH5, channels: [TIR1, TIR2, WV, MIR]}`,
  },
  {
    id: 'src_iitm_ldn',
    name: 'ltg_net (IITM / IMD Lightning Network)',
    category: 'LIGHTNING',
    adapterClass: 'adapters.ltg.CsvStream',
    format: 'Stroke/Flash CSV Stream to 5 km Aggregation + 2s Jump Detector',
    pathOrEndpoint: 'tcp://llds.tropmet.res.in:9042/east_stream',
    resolutionKm: 5.0,
    cadenceMin: 5,
    lastIngestTime: '08:20:00 UTC',
    freshnessSec: 19,
    status: 'LIVE',
    qcPassRatePct: 99.5,
    qcFlagsActive: ['DE_DUPLICATE_STROKES_15MS', 'AMPLITUDE_SANITY_FILTER'],
    configSnippet: `- {name: ltg_net, adapter: adapters.ltg.CsvStream, window_min: 10}`,
  },
  {
    id: 'src_imd_nwp',
    name: 'nwp_main (IMD GFS / NCUM + Open-Meteo Live)',
    category: 'NWP',
    adapterClass: 'adapters.nwp.GribFields',
    format: 'GRIB2 / JSON to Hourly Bilinear Interpolated Conditioning',
    pathOrEndpoint: 'https://api.open-meteo.com/v1/forecast',
    resolutionKm: 12.0,
    cadenceMin: 60,
    lastIngestTime: '08:00:00 UTC',
    freshnessSec: 180,
    status: 'LIVE',
    qcPassRatePct: 100.0,
    qcFlagsActive: ['THERMODYNAMIC_BALANCE_CHECK'],
    configSnippet: `- {name: nwp_main, adapter: adapters.nwp.GribFields, fields: [cape, cin, pwat, shear_0_6, mconv]}`,
  },
];

export const VERIFICATION_METRICS_BY_LEAD: VerificationLeadMetric[] = [
  {
    leadMin: 30,
    targetThreshold: { pod: 0.75, far: 0.35, csi: 0.45 },
    hybridAi: { pod: 0.86, far: 0.21, csi: 0.70, brier: 0.068, fss5km: 0.84 },
    imdBaseline: { pod: 0.72, far: 0.34, csi: 0.52, brier: 0.118, fss5km: 0.69 },
    opticalFlow: { pod: 0.69, far: 0.36, csi: 0.49, brier: 0.129, fss5km: 0.66 },
    persistence: { pod: 0.54, far: 0.48, csi: 0.36, brier: 0.184, fss5km: 0.49 },
  },
  {
    leadMin: 60,
    targetThreshold: { pod: 0.65, far: 0.45, csi: 0.35 },
    hybridAi: { pod: 0.78, far: 0.28, csi: 0.60, brier: 0.089, fss5km: 0.76 },
    imdBaseline: { pod: 0.59, far: 0.43, csi: 0.41, brier: 0.152, fss5km: 0.57 },
    opticalFlow: { pod: 0.55, far: 0.46, csi: 0.38, brier: 0.168, fss5km: 0.53 },
    persistence: { pod: 0.38, far: 0.59, csi: 0.24, brier: 0.235, fss5km: 0.35 },
  },
  {
    leadMin: 120,
    targetThreshold: { pod: 0.50, far: 0.55, csi: 0.25 },
    hybridAi: { pod: 0.64, far: 0.37, csi: 0.47, brier: 0.124, fss5km: 0.65 },
    imdBaseline: { pod: 0.42, far: 0.54, csi: 0.28, brier: 0.198, fss5km: 0.43 },
    opticalFlow: { pod: 0.38, far: 0.58, csi: 0.25, brier: 0.215, fss5km: 0.39 },
    persistence: { pod: 0.22, far: 0.71, csi: 0.14, brier: 0.289, fss5km: 0.22 },
  },
  {
    leadMin: 180,
    targetThreshold: { pod: 0.40, far: 0.60, csi: 0.20 },
    hybridAi: { pod: 0.53, far: 0.44, csi: 0.37, brier: 0.151, fss5km: 0.56 },
    imdBaseline: { pod: 0.31, far: 0.63, csi: 0.19, brier: 0.236, fss5km: 0.32 },
    opticalFlow: { pod: 0.27, far: 0.66, csi: 0.16, brier: 0.254, fss5km: 0.28 },
    persistence: { pod: 0.14, far: 0.79, csi: 0.09, brier: 0.324, fss5km: 0.15 },
  },
];

export const RELIABILITY_CURVE_DATA: ReliabilityCurvePoint[] = [
  { binCenter: 0.1, hybridObserved: 0.09, imdObserved: 0.16, opticalFlowObserved: 0.19, forecastCount: 1420 },
  { binCenter: 0.2, hybridObserved: 0.19, imdObserved: 0.28, opticalFlowObserved: 0.31, forecastCount: 980 },
  { binCenter: 0.3, hybridObserved: 0.31, imdObserved: 0.39, opticalFlowObserved: 0.42, forecastCount: 740 },
  { binCenter: 0.4, hybridObserved: 0.41, imdObserved: 0.48, opticalFlowObserved: 0.51, forecastCount: 610 },
  { binCenter: 0.5, hybridObserved: 0.49, imdObserved: 0.57, opticalFlowObserved: 0.61, forecastCount: 520 },
  { binCenter: 0.6, hybridObserved: 0.59, imdObserved: 0.52, opticalFlowObserved: 0.49, forecastCount: 465 },
  { binCenter: 0.7, hybridObserved: 0.68, imdObserved: 0.58, opticalFlowObserved: 0.54, forecastCount: 390 },
  { binCenter: 0.8, hybridObserved: 0.79, imdObserved: 0.66, opticalFlowObserved: 0.61, forecastCount: 340 },
  { binCenter: 0.9, hybridObserved: 0.88, imdObserved: 0.74, opticalFlowObserved: 0.68, forecastCount: 260 },
];

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getCellStateAtTime(
  cell: StormCell,
  timeOffsetMin: number,
  model: 'HYBRID_AI' | 'IMD_BASELINE' | 'OPTICAL_FLOW' | 'PERSISTENCE'
) {
  const track = cell.track;
  if (timeOffsetMin <= 0) {
    for (let i = 0; i < track.length - 1; i++) {
      const p0 = track[i];
      const p1 = track[i + 1];
      if (timeOffsetMin >= p0.timeOffsetMin && timeOffsetMin <= p1.timeOffsetMin) {
        const span = p1.timeOffsetMin - p0.timeOffsetMin || 1;
        const t = (timeOffsetMin - p0.timeOffsetMin) / span;
        return {
          lat: p0.lat + (p1.lat - p0.lat) * t,
          lon: p0.lon + (p1.lon - p0.lon) * t,
          maxDbz: p0.maxDbz + (p1.maxDbz - p0.maxDbz) * t,
          radiusKm: p0.radiusKm + (p1.radiusKm - p0.radiusKm) * t,
          stage: t < 0.5 ? p0.stage : p1.stage,
          isVirtualFilled: p1.isVirtualFilled,
        };
      }
    }
  }

  const originPoint = track.find((p) => p.timeOffsetMin === 0) || track[3];

  if (model === 'PERSISTENCE') {
    return {
      lat: originPoint.lat,
      lon: originPoint.lon,
      maxDbz: originPoint.maxDbz,
      radiusKm: originPoint.radiusKm,
      stage: originPoint.stage,
      isVirtualFilled: originPoint.isVirtualFilled,
    };
  }

  if (model === 'OPTICAL_FLOW' || model === 'IMD_BASELINE') {
    const hours = timeOffsetMin / 60;
    const distKm = cell.motionSpeedKmh * hours;
    const bearingRad = (cell.motionBearingDeg * Math.PI) / 180;
    const dLat = (distKm * Math.cos(bearingRad)) / 111.0;
    const dLon = (distKm * Math.sin(bearingRad)) / (111.0 * Math.cos((originPoint.lat * Math.PI) / 180));
    const decayFactor = model === 'IMD_BASELINE' ? 1 - 0.04 * hours : 1 - 0.02 * hours;
    return {
      lat: originPoint.lat + dLat,
      lon: originPoint.lon + dLon,
      maxDbz: Math.max(15, originPoint.maxDbz * decayFactor),
      radiusKm: originPoint.radiusKm,
      stage: originPoint.stage,
      isVirtualFilled: originPoint.isVirtualFilled,
    };
  }

  for (let i = 0; i < track.length - 1; i++) {
    const p0 = track[i];
    const p1 = track[i + 1];
    if (timeOffsetMin >= p0.timeOffsetMin && timeOffsetMin <= p1.timeOffsetMin) {
      const span = p1.timeOffsetMin - p0.timeOffsetMin || 1;
      const t = (timeOffsetMin - p0.timeOffsetMin) / span;
      return {
        lat: p0.lat + (p1.lat - p0.lat) * t,
        lon: p0.lon + (p1.lon - p0.lon) * t,
        maxDbz: p0.maxDbz + (p1.maxDbz - p0.maxDbz) * t,
        radiusKm: p0.radiusKm + (p1.radiusKm - p0.radiusKm) * t,
        stage: t < 0.5 ? p0.stage : p1.stage,
        isVirtualFilled: p1.isVirtualFilled,
      };
    }
  }

  const last = track[track.length - 1];
  return {
    lat: last.lat,
    lon: last.lon,
    maxDbz: last.maxDbz,
    radiusKm: last.radiusKm,
    stage: last.stage,
    isVirtualFilled: last.isVirtualFilled,
  };
}

export function samplePointNowcast(
  lat: number,
  lon: number,
  radars: RadarStation[],
  cells: StormCell[],
  timeOffsetMin: number,
  vrfEnabled: boolean,
  model: 'HYBRID_AI' | 'IMD_BASELINE' | 'OPTICAL_FLOW' | 'PERSISTENCE'
): PointNowcastProbe {
  let bestRadarConf = 0;
  for (const r of radars) {
    if (r.status === 'NOMINAL') {
      const dist = haversineKm(lat, lon, r.lat, r.lon);
      if (dist <= r.rangeKm) {
        const normRange = dist / r.rangeKm;
        const conf = Math.max(0.15, 1 - 0.65 * Math.pow(normRange, 1.4));
        if (conf > bestRadarConf) bestRadarConf = conf;
      }
    }
  }

  let maxDbzAtPoint = 8.0;
  let satBtTir1K = 286.0;
  let coolingRateK20m = -0.8;
  let ltgRate = 0.0;
  let capeJkg = 1850 + Math.sin(lat * 2.1) * 420 + Math.cos(lon * 1.8) * 380;
  let shearMs = 15.2 + Math.cos(lat * 1.5) * 4.5;
  let probLtg30 = 0.08;
  let probLtg60 = 0.07;
  let probLtg120 = 0.05;
  let probSev60 = 0.03;

  for (const cell of cells) {
    const state = getCellStateAtTime(cell, timeOffsetMin, model);
    const dist = haversineKm(lat, lon, state.lat, state.lon);
    const sigma = state.radiusKm * 0.85;
    const gauss = Math.exp(-(dist * dist) / (2 * sigma * sigma));

    if (gauss > 0.05) {
      const cellDbz = state.maxDbz * gauss;
      if (cellDbz > maxDbzAtPoint) {
        maxDbzAtPoint = cellDbz;
      }
      const cellBt = 286 - (286 - cell.satBtTir1K) * Math.pow(gauss, 0.6);
      if (cellBt < satBtTir1K) satBtTir1K = cellBt;
      if (cell.coolingRateK20m * gauss < coolingRateK20m) {
        coolingRateK20m = cell.coolingRateK20m * gauss;
      }
      ltgRate += cell.ltgRateFlashesMin * gauss;
      capeJkg = Math.max(capeJkg, cell.capeJkg * gauss + capeJkg * (1 - gauss));
      shearMs = Math.max(shearMs, cell.shear06Ms * gauss + shearMs * (1 - gauss));

      const f30 = cell.leadForecasts.find((f) => f.leadMin === 30) || cell.leadForecasts[1];
      const f60 = cell.leadForecasts.find((f) => f.leadMin === 60) || cell.leadForecasts[2];
      const f120 = cell.leadForecasts.find((f) => f.leadMin === 120) || cell.leadForecasts[4];

      const mKey =
        model === 'HYBRID_AI'
          ? 'hybridAi'
          : model === 'IMD_BASELINE'
            ? 'imdBaseline'
            : model === 'OPTICAL_FLOW'
              ? 'opticalFlow'
              : 'persistence';

      probLtg30 = Math.max(probLtg30, f30[mKey].lightningProb * gauss);
      probLtg60 = Math.max(probLtg60, f60[mKey].lightningProb * gauss);
      probLtg120 = Math.max(probLtg120, f120[mKey].lightningProb * gauss);
      probSev60 = Math.max(probSev60, f60[mKey].dbz45Prob * gauss);
    }
  }

  const isGap = bestRadarConf < 0.45;
  const source: 'observed' | 'virtual' = isGap && vrfEnabled ? 'virtual' : 'observed';
  const effectiveDbz = isGap && !vrfEnabled ? 0 : maxDbzAtPoint;
  const effectiveConf = isGap ? (vrfEnabled ? 0.74 : 0.12) : bestRadarConf;

  const districts = [
    { name: 'Kolkata Metro', lat: 22.57, lon: 88.36 },
    { name: 'Paschim Medinipur (Kharagpur)', lat: 22.34, lon: 87.31 },
    { name: 'Howrah (Uluberia)', lat: 22.47, lon: 88.11 },
    { name: 'Balasore Coastal', lat: 21.49, lon: 86.92 },
    { name: 'Purba Medinipur (Digha)', lat: 21.62, lon: 87.52 },
    { name: 'Bankura Plateau', lat: 23.23, lon: 87.07 },
    { name: 'Purulia Dryline', lat: 23.33, lon: 86.36 },
    { name: 'Ranchi Uplands', lat: 23.34, lon: 85.31 },
    { name: 'Paradip / Jagatsinghpur', lat: 20.26, lon: 86.61 },
    { name: 'South 24 Parganas (Sundarbans)', lat: 21.88, lon: 88.78 },
  ];
  let nearestDistrict = 'East India Canonical Grid';
  let minDist = 99999;
  for (const d of districts) {
    const dist = haversineKm(lat, lon, d.lat, d.lon);
    if (dist < minDist) {
      minDist = dist;
      nearestDistrict = d.name;
    }
  }

  return {
    lat,
    lon,
    nearestDistrict,
    dbz: Number(effectiveDbz.toFixed(1)),
    dbzConfidence: Number(effectiveConf.toFixed(2)),
    source,
    satBtTir1K: Number(satBtTir1K.toFixed(1)),
    coolingRateK20m: Number(coolingRateK20m.toFixed(1)),
    ltgRate: Number(ltgRate.toFixed(1)),
    capeJkg: Math.round(capeJkg),
    shearMs: Number(shearMs.toFixed(1)),
    probLightning30m: Number(Math.min(0.99, probLtg30).toFixed(2)),
    probLightning60m: Number(Math.min(0.99, probLtg60).toFixed(2)),
    probLightning120m: Number(Math.min(0.99, probLtg120).toFixed(2)),
    probSevere60m: Number(Math.min(0.99, probSev60).toFixed(2)),
    trustObservedHitRate: Number(Math.max(0.72, Math.min(0.91, probLtg60 * 0.96)).toFixed(2)),
  };
}

export async function fetchLiveOpenMeteoForRadars(radars: RadarStation[]): Promise<{
  updatedRadars: RadarStation[];
  timestampUtc: string;
}> {
  const updated = await Promise.all(
    radars.map(async (r) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${r.lat}&longitude=${r.lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,cape&timezone=UTC`;
        const res = await fetch(url);
        if (!res.ok) return r;
        const data = await res.json();
        const cur = data?.current;
        if (!cur) return r;
        return {
          ...r,
          liveTempC: typeof cur.temperature_2m === 'number' ? cur.temperature_2m : r.liveTempC,
          liveWindKmh: typeof cur.wind_speed_10m === 'number' ? cur.wind_speed_10m : r.liveWindKmh,
          liveWindDirDeg:
            typeof cur.wind_direction_10m === 'number' ? cur.wind_direction_10m : r.liveWindDirDeg,
          liveCapeJkg:
            typeof cur.cape === 'number' && cur.cape > 0
              ? Math.max(cur.cape, r.liveCapeJkg || 1800)
              : r.liveCapeJkg,
          lastScanMinAgo: 1,
        };
      } catch {
        return r;
      }
    })
  );

  return {
    updatedRadars: updated,
    timestampUtc: new Date().toISOString().slice(11, 19) + ' UTC',
  };
}

export function buildCap12Xml(alert: CapAlert): string {
  const polyStr = alert.polygonCoords.map((c) => `${c[0].toFixed(4)},${c[1].toFixed(4)}`).join(' ');
  const firstCoord = alert.polygonCoords[0]
    ? `${alert.polygonCoords[0][0].toFixed(4)},${alert.polygonCoords[0][1].toFixed(4)}`
    : '';
  const blocksList = alert.impactedBlocks
    .map((b) => `${b.district} (${b.blockName}: ETA +${b.etaStartMin} to +${b.etaClearMin}m)`)
    .join('; ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${alert.capIdentifier}</identifier>
  <sender>nowcast-ops@imd.gov.in</sender>
  <sent>${alert.updatedAt}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <note>StormSight (VajraNow SIH 26072) Calibrated Hybrid Nowcast · Trust Hit Rate: ${(alert.trustHitRate * 100).toFixed(0)}%</note>
  <info>
    <language>en-IN</language>
    <category>Met</category>
    <event>Thunderstorm and Severe Lightning Nowcast</event>
    <urgency>${alert.urgency}</urgency>
    <severity>${alert.severity}</severity>
    <certainty>${alert.certainty}</certainty>
    <effective>${alert.createdAt}</effective>
    <expires>${alert.expiresAt}</expires>
    <senderName>India Meteorological Department : StormSight Enhancement Layer</senderName>
    <headline>${alert.headlineEn}</headline>
    <description>${alert.descriptionEn}</description>
    <instruction>${alert.instructionEn}</instruction>
    <parameter>
      <valueName>STORMSIGHT_WHY_CARD</valueName>
      <value>${alert.whyHeadline}</value>
    </parameter>
    <parameter>
      <valueName>LIGHTNING_PROBABILITY_60M</valueName>
      <value>${(alert.lightningProb * 100).toFixed(1)}%</value>
    </parameter>
    <parameter>
      <valueName>IMPACTED_BLOCKS_ETA</valueName>
      <value>${blocksList}</value>
    </parameter>
    <area>
      <areaDesc>${alert.impactedBlocks.map((b) => b.district).join(', ')}</areaDesc>
      <polygon>${polyStr} ${firstCoord}</polygon>
    </area>
  </info>
  <info>
    <language>${alert.regionalLangCode}-IN</language>
    <category>Met</category>
    <event>বজ্রবিদ্যুৎ ও কালবৈশাখী সতর্কবার্তা</event>
    <urgency>${alert.urgency}</urgency>
    <severity>${alert.severity}</severity>
    <certainty>${alert.certainty}</certainty>
    <headline>${alert.headlineRegional}</headline>
    <description>${alert.descriptionRegional}</description>
    <instruction>${alert.instructionRegional}</instruction>
  </info>
</alert>`;
}

export function buildSourcesYamlConfig(
  region: PilotRegionConfig,
  adapters: SourceAdapterItem[]
): string {
  const radars = adapters.filter((a) => a.category === 'RADAR');
  const sats = adapters.filter((a) => a.category === 'SATELLITE');
  const ltgs = adapters.filter((a) => a.category === 'LIGHTNING');
  const nwps = adapters.filter((a) => a.category === 'NWP');

  return `region: ${region.id}
domain_code: ${region.code}
grid: {res_km: 2, step_min: 10, tile: 256, crs: "EPSG:4326", store: "zarr://canonical_grid_v1"}
sources:
  radar:
${radars.map((r) => `    ${r.configSnippet}`).join('\n')}
  satellite:
${sats.map((s) => `    ${s.configSnippet}`).join('\n')}
  lightning:
${ltgs.map((l) => `    ${l.configSnippet}`).join('\n')}
  nwp:
${nwps.map((n) => `    ${n.configSnippet}`).join('\n')}
models:
  vrf:    {impl: models.vrf.SatToRadarUNet, weights: registry/vrf_v1, min_dbz_conf: ${region.thresholds.vrfMinConfidence}}
  pixel:  {impl: models.pixel.UNetConvGRU,  weights: registry/pixel_v1, leads_min: [30, 60, 90, 120, 150, 180]}
  cell:   {impl: models.cell.LGBLifecycle,  weights: registry/cell_v1,  explainer: shap_tree}
  fusion: {impl: models.fusion.GatedBlend,  calibrator: isotonic_conformal}
  baselines: [imd_operational, optical_flow_lk, persistence]
alerts:
  thresholds: {lightning_p: ${region.thresholds.lightningProbAlert}, severe_p: ${region.thresholds.severeDbzProbAlert}}
  channels: [cap_feed, sdma_dashboard, sms_gateway, webhook]
  languages: [en, ${region.regionalLangCode}]`;
}
