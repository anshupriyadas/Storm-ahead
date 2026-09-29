import React from 'react';
import { ModelType, StormCell } from '../types/nowcast';
import { getCellStateAtTime } from '../data/stormEngine';

interface CellInspectorPanelProps {
  cell: StormCell;
  timeOffsetMin: number;
  activeModel: ModelType;
  vrfEnabled: boolean;
  onDraftOrOpenAlert: (cell: StormCell) => void;
  isLoadingSkeleton?: boolean;
}

export const CellInspectorPanel: React.FC<CellInspectorPanelProps> = ({
  cell,
  timeOffsetMin,
  activeModel,
  vrfEnabled,
  onDraftOrOpenAlert,
  isLoadingSkeleton = false,
}) => {
  const curState = getCellStateAtTime(cell, timeOffsetMin, activeModel);

  const targetLead = timeOffsetMin > 0 ? timeOffsetMin : 60;
  const activeLeadForecast =
    cell.leadForecasts.reduce((prev, curr) =>
      Math.abs(curr.leadMin - targetLead) < Math.abs(prev.leadMin - targetLead) ? curr : prev
    ) || cell.leadForecasts[2];

  const stageLabel = (stage: StormCell['stage']) => {
    switch (stage) {
      case 'INITIATING':
        return '[STAGE: INITIATING / PRE-ECHO]';
      case 'GROWING':
        return '[STAGE: GROWING / INTENSIFYING]';
      case 'MATURE':
        return '[STAGE: MATURE / SEVERE CORE]';
      case 'DECAYING':
        return '[STAGE: DECAYING / DISSIPATING]';
    }
  };

  if (isLoadingSkeleton) {
    return (
      <aside className="w-full lg:w-[400px] xl:w-[420px] shrink-0 bg-[#171C26] border-l border-[#262E3D] p-4 space-y-4">
        <div className="h-4 w-48 bg-[#262E3D] animate-pulse" />
        <div className="h-6 w-72 bg-[#262E3D] animate-pulse" />
        <div className="h-9 w-full bg-[#262E3D] animate-pulse" />
        <div className="h-28 w-full bg-[#12161F] border border-[#262E3D] animate-pulse" />
        <div className="h-44 w-full bg-[#12161F] border border-[#262E3D] animate-pulse" />
        <div className="h-36 w-full bg-[#12161F] border border-[#262E3D] animate-pulse" />
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-[400px] xl:w-[420px] shrink-0 bg-[#171C26] border-l border-[#262E3D] flex flex-col h-full overflow-y-auto">
      {/* 1. Cell Header & Lifecycle Stage */}
      <div className="p-4 border-b border-[#262E3D]">
        <div className="flex items-center justify-between gap-2 text-xs text-[#94A3B8] font-mono">
          <span>ID: {cell.id}</span>
          <span>·</span>
          <span className="text-[#D97706] font-semibold">{stageLabel(curState.stage)}</span>
        </div>

        <h2 className="mt-1.5 text-base font-semibold text-[#E2E8F0] font-display tracking-tight">
          {cell.designation}
        </h2>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-[#94A3B8] font-mono">
          <span>
            {curState.lat.toFixed(2)}N, {curState.lon.toFixed(2)}E
          </span>
          <span>·</span>
          <span>
            Vector {cell.motionSpeedKmh} km/h @ {cell.motionBearingDeg} deg
          </span>
          <span>·</span>
          <span>Age {cell.ageMin} min</span>
        </div>

        {cell.inRadarGap && (
          <div className="mt-2.5 px-2.5 py-1.5 bg-[#231C14] border border-[#D97706] text-xs text-[#E2E8F0] font-mono">
            {vrfEnabled
              ? `[SOURCE=VIRTUAL] VRF Confidence ${(cell.vrfConfidence * 100).toFixed(0)}% (Sat+Ltg U-Net)`
              : `[RADAR GAP] Local DWR Masked and VRF Disabled`}
          </div>
        )}

        <button
          onClick={() => onDraftOrOpenAlert(cell)}
          className="mt-3 w-full py-2 px-4 bg-[#D97706] text-[#12161F] font-semibold text-xs font-mono uppercase tracking-wider cursor-pointer"
        >
          [ Review / Publish CAP 1.2 Alert for Cell ]
        </button>
      </div>

      {/* 2. Canonical Grid Telemetry Ledger (2-Column Structured Table, Zero 3-Card Row) */}
      <div className="p-4 border-b border-[#262E3D] bg-[#141922]">
        <h3 className="text-xs font-semibold text-[#E2E8F0] mb-2">
          01. Canonical Grid Cell Observations
        </h3>
        <table className="w-full text-left border-collapse font-mono text-xs tabular-nums border border-[#262E3D]">
          <tbody>
            <tr className="border-b border-[#262E3D]">
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                Max Echo
              </td>
              <td className="py-1.5 px-2.5 text-[#E2E8F0] font-semibold border-r border-[#262E3D]">
                {curState.maxDbz.toFixed(1)} dBZ
              </td>
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                Cooling Rate
              </td>
              <td className="py-1.5 px-2.5 text-[#D97706] font-semibold">
                {cell.coolingRateK20m > 0
                  ? `+${cell.coolingRateK20m.toFixed(1)}`
                  : cell.coolingRateK20m.toFixed(1)}{' '}
                K/20m
              </td>
            </tr>
            <tr className="border-b border-[#262E3D]">
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                Flash Rate
              </td>
              <td className="py-1.5 px-2.5 text-[#E2E8F0] font-semibold border-r border-[#262E3D]">
                {cell.ltgRateFlashesMin.toFixed(1)} fl/m
              </td>
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                NWP CAPE
              </td>
              <td className="py-1.5 px-2.5 text-[#E2E8F0] font-semibold">
                {cell.capeJkg.toLocaleString()} J/kg
              </td>
            </tr>
            <tr>
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                0 to 6 km Shear
              </td>
              <td className="py-1.5 px-2.5 text-[#E2E8F0] font-semibold border-r border-[#262E3D]">
                {cell.shear06Ms.toFixed(1)} m/s
              </td>
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                WV minus TIR1
              </td>
              <td className="py-1.5 px-2.5 text-[#E2E8F0] font-semibold">
                {cell.wvMinusTirK > 0 ? `+${cell.wvMinusTirK.toFixed(1)}` : cell.wvMinusTirK.toFixed(1)} K
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. Two-Brain Gated Blend Weight Indicator */}
      <div className="px-4 py-3 border-b border-[#262E3D]">
        <div className="flex items-center justify-between text-xs text-[#E2E8F0] mb-1.5">
          <span className="font-medium">02. Two-Brain Gated Blend (+{activeLeadForecast.leadMin}m Lead)</span>
          <span className="font-mono text-[11px] text-[#D97706]">
            Pixel {(activeLeadForecast.hybridAi.pixelWeight * 100).toFixed(0)}% · Cell{' '}
            {(activeLeadForecast.hybridAi.cellWeight * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#12161F] border border-[#262E3D] overflow-hidden flex">
          <div
            style={{ width: `${activeLeadForecast.hybridAi.pixelWeight * 100}%` }}
            className="bg-[#5B82A6] h-full"
          />
          <div
            style={{ width: `${activeLeadForecast.hybridAi.cellWeight * 100}%` }}
            className="bg-[#D97706] h-full"
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
          <span>Steel: U-Net/ConvGRU (Motion)</span>
          <span>Ochre: LightGBM (Lifecycle)</span>
        </div>
      </div>

      {/* 4. WHY CARD (SHAP Attribution) */}
      <div className="p-4 border-b border-[#262E3D]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#E2E8F0]">
            03. Why Card : Forecast Attribution (SHAP)
          </h3>
          <span className="text-[11px] font-mono text-[#D97706] font-semibold">
            P(Ltg +{activeLeadForecast.leadMin}m) = {(activeLeadForecast.hybridAi.lightningProb * 100).toFixed(0)}%
          </span>
        </div>

        <p className="mt-2 text-xs text-[#CBD5E1] leading-relaxed bg-[#12161F] p-2.5 border border-[#262E3D]">
          {cell.whySummary}
        </p>

        <div className="mt-3 space-y-2.5">
          {cell.shapContributions.map((item, idx) => {
            const absPct = Math.min(100, Math.round(Math.abs(item.shapDelta) * 260));
            const isPos = item.direction === 'POSITIVE';
            return (
              <div key={idx} className="text-xs">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#E2E8F0] font-medium truncate max-w-[215px]">{item.feature}</span>
                  <span className="text-[#94A3B8]">
                    {item.rawMetric} ·{' '}
                    <strong className={isPos ? 'text-[#D97706]' : 'text-[#94A3B8]'}>
                      {item.shapDelta > 0 ? `+${item.shapDelta.toFixed(2)}` : item.shapDelta.toFixed(2)}
                    </strong>
                  </span>
                </div>
                <div className="mt-1 w-full h-1.5 bg-[#12161F] border border-[#262E3D] overflow-hidden">
                  <div
                    style={{ width: `${absPct}%` }}
                    className={`h-full ${isPos ? 'bg-[#D97706]' : 'bg-[#5B82A6]'}`}
                  />
                </div>
                <div className="mt-0.5 text-[11px] text-[#94A3B8] leading-snug">{item.plainExplanation}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TRUST RIBBON (2x2 Ledger Table instead of 3-card row) */}
      <div className="p-4 border-b border-[#262E3D] bg-[#141922]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-[#E2E8F0]">
            04. Trust Ribbon : Historical Reliability
          </h3>
          <span className="text-[11px] font-mono text-[#4D8B6E] font-semibold">[CALIBRATED]</span>
        </div>

        <table className="w-full text-left border-collapse font-mono text-xs tabular-nums border border-[#262E3D]">
          <tbody>
            <tr className="border-b border-[#262E3D]">
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                Probability Bin
              </td>
              <td className="py-1.5 px-2.5 text-[#E2E8F0] font-semibold border-r border-[#262E3D]">
                {cell.trustRibbon.probabilityBin}
              </td>
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                Observed Hit Rate
              </td>
              <td className="py-1.5 px-2.5 text-[#D97706] font-semibold">
                {(cell.trustRibbon.observedHitRate * 100).toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                Conformal Band
              </td>
              <td className="py-1.5 px-2.5 text-[#E2E8F0] border-r border-[#262E3D]">
                +/-{cell.trustRibbon.conformalBandPct}% (N={cell.trustRibbon.sampleCount})
              </td>
              <td className="py-1.5 px-2.5 text-[#94A3B8] bg-[#12161F] border-r border-[#262E3D]">
                Brier Score
              </td>
              <td className="py-1.5 px-2.5 text-[#E2E8F0] font-semibold">
                {cell.trustRibbon.brierScore.toFixed(3)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 6. Model vs Baseline Lead-Time Probability Matrix */}
      <div className="p-4 border-b border-[#262E3D]">
        <h3 className="text-xs font-semibold text-[#E2E8F0] mb-2">
          05. Lightning Probability vs. Baselines (0 to 180 min)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px] tabular-nums border border-[#262E3D]">
            <thead>
              <tr className="border-b border-[#262E3D] bg-[#12161F] text-[#94A3B8]">
                <th className="py-1.5 px-2 font-medium">Lead</th>
                <th className="py-1.5 px-2 text-right font-medium text-[#D97706]">StormSight</th>
                <th className="py-1.5 px-2 text-right font-medium">IMD Base</th>
                <th className="py-1.5 px-2 text-right font-medium">Opt-Flow</th>
                <th className="py-1.5 px-2 text-right font-medium">Persist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262E3D]">
              {cell.leadForecasts
                .filter((f) => [0, 30, 60, 120, 180].includes(f.leadMin))
                .map((f) => (
                  <tr key={f.leadMin}>
                    <td className="py-1.5 px-2 text-[#E2E8F0]">+{f.leadMin}m</td>
                    <td className="py-1.5 px-2 text-right font-semibold text-[#D97706]">
                      {(f.hybridAi.lightningProb * 100).toFixed(0)}%
                    </td>
                    <td className="py-1.5 px-2 text-right text-[#E2E8F0]">
                      {(f.imdBaseline.lightningProb * 100).toFixed(0)}%
                    </td>
                    <td className="py-1.5 px-2 text-right text-[#94A3B8]">
                      {(f.opticalFlow.lightningProb * 100).toFixed(0)}%
                    </td>
                    <td className="py-1.5 px-2 text-right text-[#94A3B8]">
                      {(f.persistence.lightningProb * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. District & Block Impact ETA Schedule */}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-[#E2E8F0] mb-2">
          06. Block-Level Impact and Arrival Window (ETA)
        </h3>
        <div className="space-y-2">
          {cell.impactedBlocks.map((b, i) => (
            <div key={i} className="p-2.5 bg-[#12161F] border border-[#262E3D] text-xs">
              <div className="flex items-center justify-between font-medium text-[#E2E8F0]">
                <span>
                  {b.district} · {b.blockName}
                </span>
                <span className="font-mono text-[11px] text-[#D97706]">
                  ETA +{b.etaStartMin} to +{b.etaClearMin}m
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[#94A3B8] font-mono">
                <span>Pop: {(b.populationEstimate / 1000).toFixed(0)}k</span>
                <span>·</span>
                <span>P(Ltg): {(b.peakLightningProb * 100).toFixed(0)}%</span>
                <span>·</span>
                <span>Peak: {b.peakDbz} dBZ</span>
              </div>
              <div className="mt-1 text-[11px] text-[#CBD5E1]">{b.recommendedAction}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
