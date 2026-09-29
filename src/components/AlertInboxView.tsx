import React, { useState } from 'react';
import { CapAlert, UserRole } from '../types/nowcast';
import { buildCap12Xml } from '../data/stormEngine';

interface AlertInboxViewProps {
  alerts: CapAlert[];
  selectedAlertId: string;
  onSelectAlert: (alertId: string) => void;
  onUpdateAlertStatus: (
    alertId: string,
    newStatus: CapAlert['status'],
    notes: string,
    updatedFields?: Partial<CapAlert>
  ) => void;
  userRole: UserRole;
}

export const AlertInboxView: React.FC<AlertInboxViewProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  onUpdateAlertStatus,
  userRole,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | CapAlert['status']>('ALL');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [previewFormat, setPreviewFormat] = useState<'SUMMARY' | 'CAP_SPEC'>('SUMMARY');
  const [copiedFlag, setCopiedFlag] = useState<boolean>(false);
  const [auditNoteInput, setAuditNoteInput] = useState<string>('');

  const activeAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0];

  const [editHeadlineEn, setEditHeadlineEn] = useState<string>(activeAlert?.headlineEn || '');
  const [editDescEn, setEditDescEn] = useState<string>(activeAlert?.descriptionEn || '');
  const [editInstrEn, setEditInstrEn] = useState<string>(activeAlert?.instructionEn || '');
  const [editHeadlineReg, setEditHeadlineReg] = useState<string>(activeAlert?.headlineRegional || '');
  const [editInstrReg, setEditInstrReg] = useState<string>(activeAlert?.instructionRegional || '');
  const [editSeverity, setEditSeverity] = useState<CapAlert['severity']>(activeAlert?.severity || 'Severe');

  const startEditing = (alert: CapAlert) => {
    setEditHeadlineEn(alert.headlineEn);
    setEditDescEn(alert.descriptionEn);
    setEditInstrEn(alert.instructionEn);
    setEditHeadlineReg(alert.headlineRegional);
    setEditInstrReg(alert.instructionRegional);
    setEditSeverity(alert.severity);
    setIsEditing(true);
  };

  const saveEdits = () => {
    if (!activeAlert) return;
    onUpdateAlertStatus(
      activeAlert.id,
      activeAlert.status,
      auditNoteInput.trim() || 'Edited bilingual CAP message and instructions prior to dispatch.',
      {
        headlineEn: editHeadlineEn,
        descriptionEn: editDescEn,
        instructionEn: editInstrEn,
        headlineRegional: editHeadlineReg,
        instructionRegional: editInstrReg,
        severity: editSeverity,
      }
    );
    setIsEditing(false);
    setAuditNoteInput('');
  };

  const filteredAlerts = alerts.filter((a) =>
    statusFilter === 'ALL' ? true : a.status === statusFilter
  );

  const capXmlString = activeAlert ? buildCap12Xml(activeAlert) : '';

  const handleCopyXml = () => {
    navigator.clipboard.writeText(capXmlString);
    setCopiedFlag(true);
    setTimeout(() => setCopiedFlag(false), 1800);
  };

  const handleDownloadCap = (ext: 'xml' | 'json') => {
    if (!activeAlert) return;
    const content = ext === 'xml' ? capXmlString : JSON.stringify(activeAlert, null, 2);
    const blob = new Blob([content], {
      type: ext === 'xml' ? 'application/xml;charset=utf-8' : 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeAlert.capIdentifier}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusText = (status: CapAlert['status']) => {
    switch (status) {
      case 'DRAFT':
        return '[STATUS: DRAFT / AWAITING APPROVAL]';
      case 'APPROVED':
        return '[STATUS: APPROVED / READY FOR CAP]';
      case 'PUBLISHED':
        return '[STATUS: PUBLISHED / DISPATCHED]';
      case 'SUPPRESSED':
        return '[STATUS: SUPPRESSED / HOLD]';
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#12161F] min-h-0 overflow-hidden">
      {/* Left Column: Alert Queue (Zero Colored Left Stripe) */}
      <div className="w-full lg:w-[380px] shrink-0 border-r border-[#262E3D] bg-[#171C26] flex flex-col h-full">
        <div className="p-4 border-b border-[#262E3D]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#E2E8F0] font-display">
              Human-in-the-Loop Alert Queue
            </h2>
            <span className="text-xs font-mono text-[#94A3B8]">{alerts.length} Total</span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Calibrated alerts require forecaster verification before CAP 1.2 broadcast to State and District DMAs.
          </p>

          <div className="mt-3 flex items-center gap-1 p-1 bg-[#12161F] border border-[#262E3D]">
            {(['ALL', 'DRAFT', 'APPROVED', 'PUBLISHED', 'SUPPRESSED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`flex-1 py-1 px-1.5 text-[11px] font-mono whitespace-nowrap cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#D97706] text-[#12161F] font-semibold'
                    : 'text-[#94A3B8]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Alert Cards List (Full 1px Border Selection, Zero Colored Left Stripe) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center border border-[#262E3D] bg-[#12161F]">
              <p className="text-xs text-[#94A3B8]">No alerts match filter `{statusFilter}`.</p>
              <button
                onClick={() => setStatusFilter('ALL')}
                className="mt-3 px-3 py-1.5 bg-[#171C26] border border-[#262E3D] text-xs text-[#E2E8F0] cursor-pointer"
              >
                [ Show All Alerts ]
              </button>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isSelected = item.id === activeAlert?.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectAlert(item.id);
                    setIsEditing(false);
                  }}
                  className={`w-full text-left p-3.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#12161F] border-[#D97706]'
                      : 'bg-[#141922] border-[#262E3D]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={isSelected ? 'text-[#D97706] font-semibold' : 'text-[#94A3B8]'}>
                      {statusText(item.status)}
                    </span>
                    <span className="text-[#94A3B8]">+{item.leadTimeMin}m Lead</span>
                  </div>
                  <div className="mt-1.5 text-sm font-semibold text-[#E2E8F0] leading-snug">
                    {item.cellDesignation}
                  </div>
                  <div className="mt-1 text-xs text-[#CBD5E1] line-clamp-2">{item.headlineEn}</div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-[#94A3B8]">
                    <span>P(Ltg): {(item.lightningProb * 100).toFixed(0)}%</span>
                    <span>·</span>
                    <span>Trust: {(item.trustHitRate * 100).toFixed(0)}%</span>
                    <span>·</span>
                    <span>{item.impactedBlocks.length} Blocks</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Main Area */}
      {activeAlert ? (
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#262E3D]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
                <span>CAP ID: {activeAlert.capIdentifier}</span>
                <span>·</span>
                <span className="text-[#D97706]">{statusText(activeAlert.status)}</span>
                <span>·</span>
                <span>Window: {activeAlert.effectiveWindow}</span>
              </div>
              <h1 className="mt-1.5 text-xl font-semibold text-[#E2E8F0] font-display">
                {activeAlert.headlineEn}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-mono text-[#94A3B8]">
                <span className="text-[#E2E8F0]">Why Card: {activeAlert.whyHeadline}</span>
                <span>·</span>
                <span className="text-[#4D8B6E] font-semibold">
                  Verified Bin Hit Rate: {(activeAlert.trustHitRate * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {!isEditing && (
                <button
                  onClick={() => startEditing(activeAlert)}
                  className="px-3 py-2 bg-[#171C26] border border-[#262E3D] text-[#E2E8F0] cursor-pointer whitespace-nowrap"
                >
                  [ Edit Text / Thresholds ]
                </button>
              )}

              {activeAlert.status === 'DRAFT' && (
                <button
                  onClick={() =>
                    onUpdateAlertStatus(
                      activeAlert.id,
                      'APPROVED',
                      auditNoteInput.trim() || `Approved by ${userRole} after Why Card and Trust Ribbon review.`
                    )
                  }
                  className="px-4 py-2 bg-[#D97706] text-[#12161F] font-semibold cursor-pointer whitespace-nowrap"
                >
                  [ Approve Alert ]
                </button>
              )}

              {(activeAlert.status === 'APPROVED' || activeAlert.status === 'DRAFT') && (
                <button
                  onClick={() =>
                    onUpdateAlertStatus(
                      activeAlert.id,
                      'PUBLISHED',
                      auditNoteInput.trim() ||
                        `Published signed CAP 1.2 XML/JSON to ${activeAlert.channels.join(', ')}.`
                    )
                  }
                  className="px-4 py-2 bg-[#4D8B6E] text-[#12161F] font-semibold cursor-pointer whitespace-nowrap"
                >
                  [ Publish CAP 1.2 Feed ]
                </button>
              )}

              {activeAlert.status !== 'SUPPRESSED' && (
                <button
                  onClick={() =>
                    onUpdateAlertStatus(
                      activeAlert.id,
                      'SUPPRESSED',
                      auditNoteInput.trim() || 'Suppressed by forecaster (outflow boundary stabilizing).'
                    )
                  }
                  className="px-3 py-2 bg-[#2B1917] border border-[#B93829] text-[#E2E8F0] cursor-pointer whitespace-nowrap"
                >
                  [ Suppress ]
                </button>
              )}
            </div>
          </div>

          {/* Mode Tabs & Export Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-1 p-1 bg-[#171C26] border border-[#262E3D]">
              <button
                onClick={() => setPreviewFormat('SUMMARY')}
                className={`px-3 py-1.5 cursor-pointer ${
                  previewFormat === 'SUMMARY'
                    ? 'bg-[#D97706] text-[#12161F] font-semibold'
                    : 'text-[#94A3B8]'
                }`}
              >
                Bilingual Bulletin and Block Impact
              </button>
              <button
                onClick={() => setPreviewFormat('CAP_SPEC')}
                className={`px-3 py-1.5 cursor-pointer ${
                  previewFormat === 'CAP_SPEC'
                    ? 'bg-[#D97706] text-[#12161F] font-semibold'
                    : 'text-[#94A3B8]'
                }`}
              >
                OASIS CAP 1.2 Structured Schema
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyXml}
                className="px-3 py-1.5 bg-[#171C26] border border-[#262E3D] text-[#E2E8F0] cursor-pointer"
              >
                {copiedFlag ? '[ Copied CAP XML ]' : '[ Copy CAP XML ]'}
              </button>
              <button
                onClick={() => handleDownloadCap('xml')}
                className="px-3 py-1.5 bg-[#171C26] border border-[#262E3D] text-[#E2E8F0] cursor-pointer"
              >
                [ Export .XML ]
              </button>
              <button
                onClick={() => handleDownloadCap('json')}
                className="px-3 py-1.5 bg-[#171C26] border border-[#262E3D] text-[#E2E8F0] cursor-pointer"
              >
                [ Export .JSON ]
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="p-4 bg-[#171C26] border border-[#D97706] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#D97706]">
                  Edit Bilingual CAP Bulletin and Forecaster Note
                </h3>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#94A3B8]">Severity:</label>
                  <select
                    value={editSeverity}
                    onChange={(e) => setEditSeverity(e.target.value as CapAlert['severity'])}
                    className="bg-[#12161F] border border-[#262E3D] px-2 py-1 text-xs text-[#E2E8F0] font-mono"
                  >
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#CBD5E1]">English Headline</label>
                  <input
                    type="text"
                    value={editHeadlineEn}
                    onChange={(e) => setEditHeadlineEn(e.target.value)}
                    className="w-full bg-[#12161F] border border-[#262E3D] px-3 py-2 text-xs text-[#E2E8F0]"
                  />
                  <label className="block text-xs font-medium text-[#CBD5E1]">English Technical Description</label>
                  <textarea
                    rows={3}
                    value={editDescEn}
                    onChange={(e) => setEditDescEn(e.target.value)}
                    className="w-full bg-[#12161F] border border-[#262E3D] px-3 py-2 text-xs text-[#E2E8F0]"
                  />
                  <label className="block text-xs font-medium text-[#CBD5E1]">English Public Safety Instruction</label>
                  <textarea
                    rows={2}
                    value={editInstrEn}
                    onChange={(e) => setEditInstrEn(e.target.value)}
                    className="w-full bg-[#12161F] border border-[#262E3D] px-3 py-2 text-xs text-[#E2E8F0]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#CBD5E1]">
                    Regional Headline ({activeAlert.regionalLangLabel})
                  </label>
                  <input
                    type="text"
                    value={editHeadlineReg}
                    onChange={(e) => setEditHeadlineReg(e.target.value)}
                    className="w-full bg-[#12161F] border border-[#262E3D] px-3 py-2 text-xs text-[#E2E8F0]"
                  />
                  <label className="block text-xs font-medium text-[#CBD5E1]">
                    Regional Safety Instruction ({activeAlert.regionalLangLabel})
                  </label>
                  <textarea
                    rows={3}
                    value={editInstrReg}
                    onChange={(e) => setEditInstrReg(e.target.value)}
                    className="w-full bg-[#12161F] border border-[#262E3D] px-3 py-2 text-xs text-[#E2E8F0]"
                  />
                  <label className="block text-xs font-medium text-[#CBD5E1]">Audit Log Verification Note</label>
                  <input
                    type="text"
                    placeholder="e.g., Adjusted coastal ETA window for Digha block"
                    value={auditNoteInput}
                    onChange={(e) => setAuditNoteInput(e.target.value)}
                    className="w-full bg-[#12161F] border border-[#262E3D] px-3 py-2 text-xs text-[#E2E8F0]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 font-mono">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-[#12161F] border border-[#262E3D] text-xs text-[#CBD5E1] cursor-pointer"
                >
                  [ Cancel ]
                </button>
                <button
                  onClick={saveEdits}
                  className="px-4 py-1.5 bg-[#D97706] text-[#12161F] font-semibold text-xs cursor-pointer"
                >
                  [ Save Bulletin Changes ]
                </button>
              </div>
            </div>
          )}

          {previewFormat === 'SUMMARY' ? (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="p-4 bg-[#171C26] border border-[#262E3D] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                    <span>LANGUAGE: en-IN (English Official)</span>
                    <span>SEVERITY: {activeAlert.severity.toUpperCase()}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#E2E8F0]">{activeAlert.headlineEn}</h3>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">{activeAlert.descriptionEn}</p>
                  <div className="pt-2 border-t border-[#262E3D]">
                    <div className="text-[11px] font-mono text-[#D97706]">ACTIONABLE INSTRUCTION:</div>
                    <p className="mt-0.5 text-xs text-[#E2E8F0]">{activeAlert.instructionEn}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#171C26] border border-[#262E3D] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                    <span>LANGUAGE: {activeAlert.regionalLangCode}-IN ({activeAlert.regionalLangLabel})</span>
                    <span>CITIZEN / FARMER SMS AND CAP</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#E2E8F0]">{activeAlert.headlineRegional}</h3>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">{activeAlert.descriptionRegional}</p>
                  <div className="pt-2 border-t border-[#262E3D]">
                    <div className="text-[11px] font-mono text-[#D97706]">নিরাপত্তা নির্দেশিকা (SAFETY ACTION):</div>
                    <p className="mt-0.5 text-xs text-[#E2E8F0]">{activeAlert.instructionRegional}</p>
                  </div>
                </div>
              </div>

              {/* District / Block Impact Table */}
              <div className="bg-[#171C26] border border-[#262E3D] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#E2E8F0]">
                    Impacted Administrative Districts and Blocks (Polygon Intersection)
                  </h3>
                  <span className="text-xs font-mono text-[#94A3B8]">
                    Polygon Vertices: {activeAlert.polygonCoords.length} · Channels:{' '}
                    {activeAlert.channels.join(' / ')}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs border border-[#262E3D]">
                    <thead>
                      <tr className="border-b border-[#262E3D] bg-[#12161F] text-[#94A3B8] font-mono text-[11px]">
                        <th className="py-2 px-3">District</th>
                        <th className="py-2 px-3">Impacted Blocks</th>
                        <th className="py-2 px-3 text-right">Population</th>
                        <th className="py-2 px-3 text-right">ETA Window</th>
                        <th className="py-2 px-3 text-right">P(Lightning)</th>
                        <th className="py-2 px-3 text-right">Peak Core</th>
                        <th className="py-2 px-3">Sector Directive</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262E3D]">
                      {activeAlert.impactedBlocks.map((b, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-medium text-[#E2E8F0] whitespace-nowrap">
                            {b.district}
                          </td>
                          <td className="py-2.5 px-3 text-[#CBD5E1] whitespace-nowrap">{b.blockName}</td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#CBD5E1]">
                            {b.populationEstimate.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#D97706] whitespace-nowrap">
                            +{b.etaStartMin}m to +{b.etaClearMin}m
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#D97706] font-semibold">
                            {(b.peakLightningProb * 100).toFixed(0)}%
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#E2E8F0]">
                            {b.peakDbz} dBZ
                          </td>
                          <td className="py-2.5 px-3 text-[#CBD5E1]">{b.recommendedAction}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Trail */}
              <div className="bg-[#171C26] border border-[#262E3D] p-4">
                <h3 className="text-sm font-semibold text-[#E2E8F0] mb-3">
                  Verification and Forecaster Audit Log
                </h3>
                <div className="space-y-2">
                  {activeAlert.auditLog.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 bg-[#12161F] border border-[#262E3D] text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#D97706]">{entry.timestamp}</span>
                        <span>·</span>
                        <span className="text-[#E2E8F0] font-semibold">{entry.action}</span>
                        <span>·</span>
                        <span className="text-[#94A3B8]">{entry.actor}</span>
                      </div>
                      <div className="text-[#CBD5E1] font-sans">{entry.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Structured CAP 1.2 XML Element Table (Replaces Terminal Window) */
            <div className="bg-[#171C26] border border-[#262E3D] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#E2E8F0]">
                  OASIS CAP 1.2 Element Specification Ledger (urn:oasis:names:tc:emergency:cap:1.2)
                </h3>
                <span className="text-xs font-mono text-[#4D8B6E]">[SCHEMA VALIDATED]</span>
              </div>
              <table className="w-full text-left border-collapse font-mono text-xs border border-[#262E3D]">
                <thead>
                  <tr className="border-b border-[#262E3D] bg-[#12161F] text-[#94A3B8]">
                    <th className="py-2 px-3 w-56">CAP 1.2 Element / Parameter</th>
                    <th className="py-2 px-3">Serialized Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262E3D]">
                  <tr>
                    <td className="py-2 px-3 text-[#D97706]">alert.identifier</td>
                    <td className="py-2 px-3 text-[#E2E8F0]">{activeAlert.capIdentifier}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#D97706]">alert.sender</td>
                    <td className="py-2 px-3 text-[#E2E8F0]">nowcast-ops@imd.gov.in</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#D97706]">info.category / event</td>
                    <td className="py-2 px-3 text-[#E2E8F0]">Met / Thunderstorm and Severe Lightning Nowcast</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#D97706]">info.urgency / severity / certainty</td>
                    <td className="py-2 px-3 text-[#E2E8F0]">
                      {activeAlert.urgency} / {activeAlert.severity} / {activeAlert.certainty}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#D97706]">parameter.STORMSIGHT_WHY_CARD</td>
                    <td className="py-2 px-3 text-[#E2E8F0]">{activeAlert.whyHeadline}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#D97706]">parameter.LIGHTNING_PROBABILITY_60M</td>
                    <td className="py-2 px-3 text-[#E2E8F0]">{(activeAlert.lightningProb * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#D97706]">area.polygon</td>
                    <td className="py-2 px-3 text-[#94A3B8]">
                      {activeAlert.polygonCoords.map((c) => `${c[0].toFixed(4)},${c[1].toFixed(4)}`).join(' ')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
