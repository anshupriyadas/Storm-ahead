import React, { useEffect, useRef, useState } from 'react';
import {
  GridLayerType,
  ModelType,
  PilotRegionConfig,
  PointNowcastProbe,
  RadarStation,
  StormCell,
} from '../types/nowcast';
import { getCellStateAtTime, haversineKm, samplePointNowcast } from '../data/stormEngine';

interface RadarCanvasViewportProps {
  region: PilotRegionConfig;
  radars: RadarStation[];
  cells: StormCell[];
  selectedCellId: string;
  onSelectCell: (cellId: string) => void;
  activeLayer: GridLayerType;
  onChangeLayer: (layer: GridLayerType) => void;
  activeModel: ModelType;
  showBaselineComparison: boolean;
  vrfEnabled: boolean;
  onToggleRadarMask: (radarId: string) => void;
  timeOffsetMin: number;
  pointProbe: PointNowcastProbe | null;
  onPointProbeChange: (probe: PointNowcastProbe) => void;
  isLoadingSkeleton: boolean;
}

const COASTLINE_AND_BORDERS: Array<{ name: string; type: 'coast' | 'border' | 'river'; points: Array<[number, number]> }> = [
  {
    name: 'Bay of Bengal Coastline',
    type: 'coast',
    points: [
      [19.80, 85.82],
      [20.02, 86.20],
      [20.26, 86.61],
      [20.72, 86.98],
      [21.12, 86.85],
      [21.49, 86.92],
      [21.62, 87.52],
      [21.78, 87.88],
      [22.12, 88.18],
      [21.65, 88.28],
      [21.58, 88.62],
      [21.62, 89.05],
      [21.72, 89.48],
    ],
  },
  {
    name: 'Hooghly River Corridor',
    type: 'river',
    points: [
      [24.15, 88.25],
      [23.42, 88.38],
      [22.90, 88.39],
      [22.57, 88.35],
      [22.12, 88.18],
    ],
  },
  {
    name: 'Subarnarekha and Damodar Basins',
    type: 'river',
    points: [
      [23.35, 85.32],
      [22.78, 86.20],
      [22.15, 86.72],
      [21.56, 87.28],
    ],
  },
  {
    name: 'State Boundary Reference',
    type: 'border',
    points: [
      [23.85, 86.85],
      [23.38, 86.05],
      [22.85, 86.40],
      [22.45, 86.78],
      [21.95, 86.72],
      [21.62, 87.45],
    ],
  },
];

const DISTRICT_REFERENCE_LABELS: Array<{ name: string; lat: number; lon: number }> = [
  { name: 'KOLKATA', lat: 22.57, lon: 88.36 },
  { name: 'HOWRAH', lat: 22.58, lon: 88.10 },
  { name: 'KHARAGPUR', lat: 22.34, lon: 87.31 },
  { name: 'BANKURA', lat: 23.23, lon: 87.07 },
  { name: 'PURULIA', lat: 23.33, lon: 86.36 },
  { name: 'RANCHI', lat: 23.34, lon: 85.31 },
  { name: 'JAMSHEDPUR', lat: 22.80, lon: 86.20 },
  { name: 'BALASORE', lat: 21.49, lon: 86.92 },
  { name: 'DIGHA', lat: 21.62, lon: 87.52 },
  { name: 'PARADIP', lat: 20.26, lon: 86.61 },
  { name: 'BHUBANESWAR', lat: 20.29, lon: 85.82 },
  { name: 'SUNDARBANS', lat: 21.85, lon: 88.85 },
];

/**
 * Calibrated non-rainbow duotone intensity ramp (Steel Slate -> Ochre -> Copper -> Oxide Core)
 */
function dbzToCalibratedRgba(dbz: number, isVirtual: boolean): [number, number, number, number] {
  if (dbz < 16) return [0, 0, 0, 0];
  const alphaBoost = isVirtual ? 0.72 : 0.88;
  if (dbz < 28) return [59, 82, 107, Math.round(130 * alphaBoost)]; // #3B526B Steel Slate
  if (dbz < 36) return [74, 120, 138, Math.round(165 * alphaBoost)]; // #4A788A Muted Steel Teal
  if (dbz < 44) return [194, 120, 41, Math.round(195 * alphaBoost)]; // #C27829 Calibrated Ochre
  if (dbz < 52) return [217, 93, 36, Math.round(215 * alphaBoost)]; // #D95D24 Signal Copper
  return [185, 56, 41, Math.round(235 * alphaBoost)]; // #B93829 Oxide Rust Core
}

export const RadarCanvasViewport: React.FC<RadarCanvasViewportProps> = ({
  region,
  radars,
  cells,
  selectedCellId,
  onSelectCell,
  activeLayer,
  onChangeLayer,
  activeModel,
  showBaselineComparison,
  vrfEnabled,
  onToggleRadarMask,
  timeOffsetMin,
  pointProbe,
  onPointProbeChange,
  isLoadingSkeleton,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ dLat: number; dLon: number }>({ dLat: 0, dLon: 0 });
  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [sweepAngleDeg, setSweepAngleDeg] = useState<number>(0);
  const [isProbingPoint, setIsProbingPoint] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngleDeg((prev) => (prev + 9) % 360);
    }, 140);
    return () => clearInterval(interval);
  }, []);

  const [baseMinLat, baseMinLon, baseMaxLat, baseMaxLon] = region.bbox;
  const latSpan = (baseMaxLat - baseMinLat) / zoom;
  const lonSpan = (baseMaxLon - baseMinLon) / zoom;
  const centerLat = region.centerLat + panOffset.dLat;
  const centerLon = region.centerLon + panOffset.dLon;
  const minLat = centerLat - latSpan / 2;
  const maxLat = centerLat + latSpan / 2;
  const minLon = centerLon - lonSpan / 2;
  const maxLon = centerLon + lonSpan / 2;

  const latLonToXY = (lat: number, lon: number, width: number, height: number) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * width;
    const y = ((maxLat - lat) / (maxLat - minLat)) * height;
    return { x, y };
  };

  const xyToLatLon = (x: number, y: number, width: number, height: number) => {
    const lon = minLon + (x / width) * (maxLon - minLon);
    const lat = maxLat - (y / height) * (maxLat - minLat);
    return { lat, lon };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Deep Slate Base Surface (#12161F, zero pure black)
    ctx.fillStyle = '#12161F';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#151A24';
    ctx.fillRect(0, 0, width, height * 0.78);

    // 2. Render Canonical 2km Gridded Field
    const gridW = 128;
    const gridH = 88;
    const offscreen = document.createElement('canvas');
    offscreen.width = gridW;
    offscreen.height = gridH;
    const offCtx = offscreen.getContext('2d');

    if (offCtx) {
      const imgData = offCtx.createImageData(gridW, gridH);
      const data = imgData.data;

      const cellStates = cells.map((cell) => ({
        cell,
        state: getCellStateAtTime(cell, timeOffsetMin, activeModel),
      }));

      for (let gy = 0; gy < gridH; gy++) {
        const lat = maxLat - (gy / gridH) * (maxLat - minLat);
        for (let gx = 0; gx < gridW; gx++) {
          const lon = minLon + (gx / gridW) * (maxLon - minLon);
          const idx = (gy * gridW + gx) * 4;

          let radarConf = 0;
          for (const r of radars) {
            if (r.status === 'NOMINAL') {
              const d = haversineKm(lat, lon, r.lat, r.lon);
              if (d <= r.rangeKm) {
                const c = Math.max(0.15, 1 - 0.65 * Math.pow(d / r.rangeKm, 1.4));
                if (c > radarConf) radarConf = c;
              }
            }
          }
          const isRadarGap = radarConf < 0.45;

          let maxDbz = 0;
          let coolingRate = 0;
          let ltgDensity = 0;
          let capeVal = 1750 + Math.sin(lat * 2.2) * 350 + Math.cos(lon * 1.9) * 350;
          let probLtg = 0;
          let probSev = 0;

          for (const { cell, state } of cellStates) {
            const dist = haversineKm(lat, lon, state.lat, state.lon);
            const sigma = state.radiusKm * 0.92;
            if (dist < sigma * 3.0) {
              const g = Math.exp(-(dist * dist) / (2 * sigma * sigma));
              const localDbz = state.maxDbz * g;
              if (localDbz > maxDbz) maxDbz = localDbz;

              const localCool = Math.abs(cell.coolingRateK20m) * Math.pow(g, 0.75);
              if (localCool > coolingRate) coolingRate = localCool;

              ltgDensity += cell.ltgRateFlashesMin * g;
              capeVal = Math.max(capeVal, cell.capeJkg * Math.pow(g, 0.45));

              const targetLead = timeOffsetMin > 0 ? timeOffsetMin : 60;
              const leadObj =
                cell.leadForecasts.reduce((prev, curr) =>
                  Math.abs(curr.leadMin - targetLead) < Math.abs(prev.leadMin - targetLead) ? curr : prev
                ) || cell.leadForecasts[2];

              const mKey =
                activeModel === 'HYBRID_AI'
                  ? 'hybridAi'
                  : activeModel === 'IMD_BASELINE'
                    ? 'imdBaseline'
                    : activeModel === 'OPTICAL_FLOW'
                      ? 'opticalFlow'
                      : 'persistence';

              probLtg = Math.max(probLtg, leadObj[mKey].lightningProb * Math.pow(g, 0.7));
              probSev = Math.max(probSev, leadObj[mKey].dbz45Prob * Math.pow(g, 0.75));
            }
          }

          if (activeLayer === 'DBZ_COMPOSITE' || activeLayer === 'VIRTUAL_RADAR_FILL') {
            if (isRadarGap && !vrfEnabled) {
              if (activeLayer === 'VIRTUAL_RADAR_FILL') {
                data[idx] = 194;
                data[idx + 1] = 120;
                data[idx + 2] = 41;
                data[idx + 3] = 28;
              }
            } else {
              const [r, g, b, a] = dbzToCalibratedRgba(maxDbz, isRadarGap && vrfEnabled);
              if (isRadarGap && vrfEnabled && maxDbz >= 16) {
                const stripe = (gx + gy) % 3 === 0 ? 0.52 : 1.0;
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = Math.round(a * stripe);
              } else {
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = a;
              }
            }
          } else if (activeLayer === 'DBZ_CONFIDENCE') {
            const effConf = isRadarGap ? (vrfEnabled ? 0.68 : 0.1) : radarConf;
            if (effConf > 0.12) {
              data[idx] = isRadarGap ? 194 : 91;
              data[idx + 1] = isRadarGap ? 120 : 130;
              data[idx + 2] = isRadarGap ? 41 : 166;
              data[idx + 3] = Math.round(effConf * 120);
            }
          } else if (activeLayer === 'SAT_TIR_BT' || activeLayer === 'SAT_COOLING_RATE') {
            if (coolingRate > 2.5) {
              const norm = Math.min(1, coolingRate / 18.0);
              data[idx] = Math.round(74 + norm * 120);
              data[idx + 1] = Math.round(120 + norm * 20);
              data[idx + 2] = Math.round(150 + norm * 35);
              data[idx + 3] = Math.round(norm * 205);
            }
          } else if (activeLayer === 'LIGHTNING_DENSITY') {
            if (ltgDensity > 1.2) {
              const norm = Math.min(1, ltgDensity / 42.0);
              data[idx] = 217;
              data[idx + 1] = Math.round(145 - norm * 50);
              data[idx + 2] = 40;
              data[idx + 3] = Math.round(norm * 215);
            }
          } else if (activeLayer === 'NWP_CAPE_SHEAR') {
            const normCape = Math.max(0, Math.min(1, (capeVal - 1400) / 2200));
            if (normCape > 0.1) {
              data[idx] = Math.round(194 * normCape);
              data[idx + 1] = Math.round(120 * normCape);
              data[idx + 2] = Math.round(55 * (1 - normCape * 0.5));
              data[idx + 3] = Math.round(normCape * 115);
            }
          } else if (activeLayer === 'PROB_LIGHTNING' || activeLayer === 'PROB_SEVERE_45DBZ') {
            const p = activeLayer === 'PROB_LIGHTNING' ? probLtg : probSev;
            if (p > 0.15) {
              if (p > 0.75) {
                data[idx] = 185;
                data[idx + 1] = 56;
                data[idx + 2] = 41;
                data[idx + 3] = Math.round(p * 210);
              } else if (p > 0.5) {
                data[idx] = 217;
                data[idx + 1] = 119;
                data[idx + 2] = 6;
                data[idx + 3] = Math.round(p * 190);
              } else {
                data[idx] = 91;
                data[idx + 1] = 130;
                data[idx + 2] = 166;
                data[idx + 3] = Math.round(p * 165);
              }
            }
          }
        }
      }

      offCtx.putImageData(imgData, 0, 0);
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(offscreen, 0, 0, width, height);
      ctx.restore();
    }

    // 3. Coordinate Graticule Lines (no dot grids, strictly continuous hairline axes)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';

    for (let lat = Math.ceil(minLat); lat <= Math.floor(maxLat); lat += 1) {
      const { y } = latLonToXY(lat, minLon, width, height);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.fillText(`${lat.toFixed(0)}N`, 8, y - 4);
    }

    for (let lon = Math.ceil(minLon); lon <= Math.floor(maxLon); lon += 1) {
      const { x } = latLonToXY(minLat, lon, width, height);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.fillText(`${lon.toFixed(0)}E`, x + 4, height - 8);
    }

    // 4. Coastline, Rivers, and Borders
    for (const feat of COASTLINE_AND_BORDERS) {
      ctx.beginPath();
      feat.points.forEach(([lat, lon], i) => {
        const { x, y } = latLonToXY(lat, lon, width, height);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      if (feat.type === 'coast') {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
      } else if (feat.type === 'river') {
        ctx.strokeStyle = 'rgba(91, 130, 166, 0.32)';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. District Reference Labels
    ctx.font = '500 10px "JetBrains Mono", monospace';
    for (const d of DISTRICT_REFERENCE_LABELS) {
      const { x, y } = latLonToXY(d.lat, d.lon, width, height);
      if (x >= 20 && x <= width - 40 && y >= 20 && y <= height - 20) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        ctx.fillText(d.name, x + 5, y + 3);
      }
    }

    // 6. Doppler Weather Radar Range Rings & Sweeps
    for (const radar of radars) {
      const { x, y } = latLonToXY(radar.lat, radar.lon, width, height);
      const edgePt = latLonToXY(radar.lat + radar.rangeKm / 111.0, radar.lon, width, height);
      const radiusPx = Math.abs(y - edgePt.y);

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radiusPx, 0, Math.PI * 2);
      if (radar.status === 'MASKED_VRF_TEST') {
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.65)';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(91, 130, 166, 0.38)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);
        ctx.stroke();

        const rad = (sweepAngleDeg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(rad) * radiusPx, y + Math.sin(rad) * radiusPx);
        ctx.strokeStyle = 'rgba(91, 130, 166, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.fillStyle = radar.status === 'MASKED_VRF_TEST' ? '#D97706' : '#5B82A6';
      ctx.fillRect(x - 3.5, y - 3.5, 7, 7);

      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillStyle = radar.status === 'MASKED_VRF_TEST' ? '#D97706' : '#94A3B8';
      const statusSuffix =
        radar.status === 'MASKED_VRF_TEST'
          ? vrfEnabled
            ? ' [MASKED: VRF ACTIVE]'
            : ' [MASKED: GAP]'
          : '';
      ctx.fillText(`${radar.code}${statusSuffix}`, x + 7, y - 5);
      ctx.restore();
    }

    // 7. Storm Cell Tracks, Trajectory Cones & Square Technical Markers
    for (const cell of cells) {
      const isSelected = cell.id === selectedCellId;
      const curState = getCellStateAtTime(cell, timeOffsetMin, activeModel);
      const { x: cx, y: cy } = latLonToXY(curState.lat, curState.lon, width, height);

      const pastPoints = cell.track.filter((p) => p.timeOffsetMin <= 0);
      if (pastPoints.length > 1) {
        ctx.save();
        ctx.beginPath();
        pastPoints.forEach((p, idx) => {
          const pt = latLonToXY(p.lat, p.lon, width, height);
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.65)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        pastPoints.forEach((p) => {
          const pt = latLonToXY(p.lat, p.lon, width, height);
          ctx.fillStyle = '#94A3B8';
          ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
        });
        ctx.restore();
      }

      if (showBaselineComparison && activeModel === 'HYBRID_AI') {
        ctx.save();
        ctx.beginPath();
        [0, 30, 60, 90, 120, 150, 180].forEach((lead, idx) => {
          const ofState = getCellStateAtTime(cell, lead, 'OPTICAL_FLOW');
          const pt = latLonToXY(ofState.lat, ofState.lon, width, height);
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = 'rgba(185, 56, 41, 0.7)';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.restore();
      }

      const futureLeads = [0, 30, 60, 90, 120, 150, 180];
      ctx.save();
      ctx.beginPath();
      futureLeads.forEach((lead, idx) => {
        const st = getCellStateAtTime(cell, lead, activeModel);
        const pt = latLonToXY(st.lat, st.lon, width, height);
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = isSelected ? '#D97706' : 'rgba(217, 119, 6, 0.65)';
      ctx.lineWidth = isSelected ? 2.2 : 1.5;
      ctx.setLineDash([5, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      [60, 120, 180].forEach((lead) => {
        const st = getCellStateAtTime(cell, lead, activeModel);
        const pt = latLonToXY(st.lat, st.lon, width, height);
        ctx.fillStyle = isSelected ? '#D97706' : '#8C5820';
        ctx.fillRect(pt.x - 2.5, pt.y - 2.5, 5, 5);
        if (isSelected) {
          ctx.font = '500 9px "JetBrains Mono", monospace';
          ctx.fillStyle = '#E2E8F0';
          ctx.fillText(`+${lead}m`, pt.x + 5, pt.y - 4);
        }
      });
      ctx.restore();

      const edgeCell = latLonToXY(curState.lat + curState.radiusKm / 111.0, curState.lon, width, height);
      const cellRadPx = Math.max(12, Math.abs(cy - edgeCell.y));

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, cellRadPx, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? '#D97706' : '#CBD5E1';
      if (cell.inRadarGap && vrfEnabled) {
        ctx.setLineDash([5, 3]);
      } else if (curState.stage === 'INITIATING') {
        ctx.setLineDash([3, 3]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.lineWidth = isSelected ? 2.2 : 1.4;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isSelected ? '#D97706' : '#E2E8F0';
      ctx.fillRect(cx - 3, cy - 3, 6, 6);

      const labelCode = cell.designation.split('·')[0].trim();
      const labelText = `${labelCode} / ${curState.maxDbz.toFixed(0)}dBZ / ${curState.stage}`;
      ctx.font = '600 10px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(labelText).width;
      const boxX = cx - textWidth / 2 - 6;
      const boxY = cy - cellRadPx - 22;

      ctx.fillStyle = '#171C26';
      ctx.fillRect(boxX, boxY, textWidth + 12, 17);
      ctx.strokeStyle = isSelected ? '#D97706' : '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, textWidth + 12, 17);

      ctx.fillStyle = isSelected ? '#E2E8F0' : '#94A3B8';
      ctx.fillText(labelText, boxX + 6, boxY + 12);
      ctx.restore();
    }

    // 8. Point Probe Crosshair
    if (pointProbe) {
      const { x: px, y: py } = latLonToXY(pointProbe.lat, pointProbe.lon, width, height);
      ctx.save();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.4;
      ctx.strokeRect(px - 6, py - 6, 12, 12);
      ctx.beginPath();
      ctx.moveTo(px - 11, py);
      ctx.lineTo(px + 11, py);
      ctx.moveTo(px, py - 11);
      ctx.lineTo(px, py + 11);
      ctx.stroke();
      ctx.restore();
    }
  }, [
    region,
    radars,
    cells,
    selectedCellId,
    activeLayer,
    activeModel,
    showBaselineComparison,
    vrfEnabled,
    timeOffsetMin,
    zoom,
    panOffset,
    sweepAngleDeg,
    pointProbe,
  ]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const { lat, lon } = xyToLatLon(x, y, canvas.width, canvas.height);

    let closestCell: StormCell | null = null;
    let minCellDist = 38;
    for (const cell of cells) {
      const st = getCellStateAtTime(cell, timeOffsetMin, activeModel);
      const d = haversineKm(lat, lon, st.lat, st.lon);
      if (d < minCellDist) {
        minCellDist = d;
        closestCell = cell;
      }
    }

    if (closestCell) {
      onSelectCell(closestCell.id);
    }

    setIsProbingPoint(true);
    const probe = samplePointNowcast(lat, lon, radars, cells, timeOffsetMin, vrfEnabled, activeModel);
    onPointProbeChange(probe);
    setTimeout(() => setIsProbingPoint(false), 260);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const { lat, lon } = xyToLatLon(x, y, canvas.width, canvas.height);
    setHoverCoords({ lat, lon });
  };

  const LAYER_OPTIONS: Array<{ id: GridLayerType; label: string }> = [
    { id: 'DBZ_COMPOSITE', label: 'Radar Mosaic + VRF' },
    { id: 'PROB_LIGHTNING', label: 'Lightning Prob' },
    { id: 'PROB_SEVERE_45DBZ', label: 'Severe >=45 dBZ Prob' },
    { id: 'VIRTUAL_RADAR_FILL', label: 'Virtual Radar Fill' },
    { id: 'SAT_COOLING_RATE', label: 'INSAT Cooling Rate' },
    { id: 'LIGHTNING_DENSITY', label: 'IITM Flash Density' },
    { id: 'NWP_CAPE_SHEAR', label: 'NWP CAPE Pool' },
    { id: 'DBZ_CONFIDENCE', label: 'Grid Confidence Mask' },
  ];

  const maskedCount = radars.filter((r) => r.status === 'MASKED_VRF_TEST').length;

  return (
    <div className="flex-1 flex flex-col bg-[#12161F] border-x border-[#262E3D] overflow-hidden select-none">
      {/* Solid Structural Top Bar 1: Canonical Grid Layer Selector & Zoom */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#171C26] border-b border-[#262E3D]">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-[11px] font-mono text-[#94A3B8] mr-1.5 uppercase">LAYER:</span>
          {LAYER_OPTIONS.map((layer) => {
            const active = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => onChangeLayer(layer.id)}
                className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer border ${
                  active
                    ? 'bg-[#D97706] text-[#12161F] font-semibold border-[#D97706]'
                    : 'bg-[#12161F] text-[#94A3B8] border-[#262E3D]'
                }`}
              >
                {layer.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
          <button
            onClick={() => setZoom((z) => Math.min(2.2, Number((z + 0.25).toFixed(2))))}
            className="px-2.5 py-1 text-[#E2E8F0] bg-[#12161F] border border-[#262E3D] cursor-pointer"
          >
            [ + ]
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.25).toFixed(2))))}
            className="px-2.5 py-1 text-[#E2E8F0] bg-[#12161F] border border-[#262E3D] cursor-pointer"
          >
            [ - ]
          </button>
          <button
            onClick={() => {
              setZoom(1.0);
              setPanOffset({ dLat: 0, dLon: 0 });
            }}
            className="px-2.5 py-1 text-[#E2E8F0] bg-[#12161F] border border-[#262E3D] cursor-pointer whitespace-nowrap"
          >
            ZOOM {(zoom * 100).toFixed(0)}%
          </button>
        </div>
      </div>

      {/* Solid Structural Top Bar 2: Domain Telemetry & Masked Radar VRF Controls (Zero Liquid Glass) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#141922] border-b border-[#262E3D] text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2 text-[#94A3B8]">
          <span className="text-[#D97706] font-semibold">{region.code}</span>
          <span>·</span>
          <span>2.0 km Zarr Grid</span>
          <span>·</span>
          <span className="text-[#E2E8F0]">
            {timeOffsetMin === 0
              ? 'T+00m (OBSERVED)'
              : timeOffsetMin < 0
                ? `T${timeOffsetMin}m (ARCHIVE)`
                : `T+${timeOffsetMin}m (NOWCAST)`}
          </span>
          {maskedCount > 0 && (
            <>
              <span>·</span>
              <span className="text-[#D97706]">
                {vrfEnabled
                  ? `[VRF ACTIVE: ${maskedCount} RADAR MASKED / SOURCE=VIRTUAL]`
                  : `[BLIND ZONE: ${maskedCount} RADAR MASKED / VRF OFF]`}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] text-[#94A3B8] mr-1">DWR FEEDS:</span>
          {radars.map((r) => {
            const isMasked = r.status === 'MASKED_VRF_TEST';
            return (
              <button
                key={r.id}
                onClick={() => onToggleRadarMask(r.id)}
                className={`px-2 py-0.5 text-[11px] font-mono border cursor-pointer whitespace-nowrap ${
                  isMasked
                    ? 'bg-[#2B2118] border-[#D97706] text-[#D97706]'
                    : 'bg-[#12161F] border-[#262E3D] text-[#E2E8F0]'
                }`}
              >
                {isMasked ? `[MASKED] ${r.code}` : `[LIVE] ${r.code}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Radar Canvas Stage */}
      <div className="relative flex-1 min-h-[380px] w-full overflow-hidden">
        {isLoadingSkeleton ? (
          <div className="w-full h-full bg-[#12161F] p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-4 w-64 bg-[#1E2532] animate-pulse" />
              <div className="h-3 w-96 bg-[#1A202C] animate-pulse" />
            </div>
            <div className="my-auto mx-auto w-72 h-72 border border-[#262E3D] flex items-center justify-center">
              <span className="font-mono text-xs text-[#94A3B8]">
                REGRIDDING 2.0 KM CANONICAL ZARR TILES...
              </span>
            </div>
            <div className="h-6 w-full bg-[#1A202C] animate-pulse" />
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={960}
            height={580}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => setHoverCoords(null)}
            className="w-full h-full object-cover cursor-crosshair block"
          />
        )}
      </div>

      {/* Solid Docked Bottom Telemetry & Calibrated Non-Rainbow Scale Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-[#171C26] border-t border-[#262E3D] text-xs font-mono">
        {/* Calibrated Duotone Reflectivity Scale (Zero Rainbow) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#94A3B8]">SCALE (dBZ):</span>
          <span className="px-2 py-0.5 bg-[#3B526B] text-[#E2E8F0] text-[10px]">20 dBZ</span>
          <span className="px-2 py-0.5 bg-[#4A788A] text-[#E2E8F0] text-[10px]">30 dBZ</span>
          <span className="px-2 py-0.5 bg-[#C27829] text-[#12161F] font-semibold text-[10px]">40 dBZ</span>
          <span className="px-2 py-0.5 bg-[#D95D24] text-[#12161F] font-semibold text-[10px]">48 dBZ</span>
          <span className="px-2 py-0.5 bg-[#B93829] text-[#E2E8F0] font-semibold text-[10px]">&gt;=54 dBZ</span>
          <span className="text-[11px] text-[#94A3B8] ml-1">
            Solid = Observed · Hatched = VRF (source=virtual)
          </span>
        </div>

        {/* Point Probe Readout with Skeleton Loader state */}
        <div className="flex items-center gap-3">
          {isProbingPoint || isLoadingSkeleton ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-32 bg-[#262E3D] animate-pulse" />
              <div className="h-4 w-44 bg-[#262E3D] animate-pulse" />
            </div>
          ) : pointProbe ? (
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-[#D97706]">
                PROBE:{' '}
                {hoverCoords
                  ? `${hoverCoords.lat.toFixed(2)}N, ${hoverCoords.lon.toFixed(2)}E`
                  : `${pointProbe.lat.toFixed(2)}N, ${pointProbe.lon.toFixed(2)}E`}
              </span>
              <span>·</span>
              <span className="text-[#E2E8F0]">{pointProbe.nearestDistrict}</span>
              <span>·</span>
              <span className="text-[#E2E8F0] font-semibold">
                {pointProbe.dbz} dBZ [{pointProbe.source === 'virtual' ? 'VRF' : 'OBS'}]
              </span>
              <span>·</span>
              <span className="text-[#D97706] font-semibold">
                P(Ltg +60m): {(pointProbe.probLightning60m * 100).toFixed(0)}%
              </span>
              <span>·</span>
              <span className="text-[#94A3B8]">
                Hit Rate: {(pointProbe.trustObservedHitRate * 100).toFixed(0)}%
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
