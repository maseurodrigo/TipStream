import { useState } from 'react';
import { Eye, EyeOff, Settings, PlusCircle, Download, RefreshCw } from 'lucide-react';

interface ControlButtonsProps {
  sessionID: string;
  viewerCount: number;
  isStreamMode: boolean;
  onToggleStream: () => void;
  onOpenConfig: () => void;
  onOpenForm: () => void;
  onExportBets: () => boolean;
  onReset: () => void;
  baseColor: string;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  sessionID,
  viewerCount,
  isStreamMode,
  onToggleStream,
  onOpenConfig,
  onOpenForm,
  onExportBets,
  onReset,
  baseColor,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showNoBetsMessage, setShowNoBetsMessage] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const fullViewerLink = `${window.location.origin}/stream/${sessionID}`;

  const copyURLToClipboard = () => {
    navigator.clipboard.writeText(fullViewerLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportBets = () => {
    const success = onExportBets();
    if (!success) {
      setShowNoBetsMessage(true);
      setTimeout(() => setShowNoBetsMessage(false), 2000);
    }
  };

  const handleReset = () => {
    if (showResetConfirm) {
      onReset();
      setShowResetConfirm(false);
      setShowResetSuccess(true);
      setTimeout(() => setShowResetSuccess(false), 2000);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-screen flex flex-col pointer-events-auto z-20 p-6">
      {/* Right Navigation Bar Container */}
      <div className="flex flex-col h-full w-64 bg-gray-900/95 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-gray-700/50">

        {/* Header Section */}
        <div className="px-6 py-5 rounded-t-2xl border-b border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-800/10">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-5 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${baseColor}, ${baseColor}dd)`
              }}
            ></div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Dashboard</h2>
          </div>
        </div>

        {/* Session Info Section */}
        <div className="px-4 py-4 border-b border-gray-800/50">
          <div className="space-y-2.5">
            {/* Viewer Count */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 shadow-sm">
              <div className="flex items-center justify-center min-w-[20px]">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></span>
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500">Active Viewers</p>
                <p className="text-sm font-bold text-white mt-0.5">{viewerCount}</p>
              </div>
            </div>

            {/* Session Link */}
            <div className="relative">
              <button
                onClick={copyURLToClipboard}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-br from-gray-800/40 to-gray-800/20 hover:from-gray-800/50 hover:to-gray-800/30 border border-gray-700/50 hover:border-gray-600/60 transition-all duration-200 w-full group/copy shadow-sm"
              >
                <div className="flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover/copy:text-blue-400 transition-colors"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-medium text-gray-500">Stream Link</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">Click to copy</p>
                </div>
              </button>
              {isCopied && (
                <div className="absolute -left-24 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gradient-to-br from-green-600 to-green-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg border border-green-500/50 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-300 animate-out fade-out zoom-out-95 flex-shrink-0">
                  Copied!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Actions</p>

          {/* Toggle Stream Button */}
          <button
            onClick={onToggleStream}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-br from-gray-800/40 to-gray-800/20 hover:from-gray-800/50 hover:to-gray-800/30 border border-gray-700/50 hover:border-gray-600/60 transition-all duration-200 w-full group/stream shadow-sm"
          >
            <div className="flex items-center justify-center">
              {isStreamMode ? (
                <Eye size={18} className="text-gray-400 group-hover/stream:text-blue-400 transition-colors" />
              ) : (
                <EyeOff size={18} className="text-gray-400 group-hover/stream:text-blue-400 transition-colors" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">
                {isStreamMode ? 'Edit Mode' : 'Stream Mode'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {isStreamMode ? 'Make changes' : 'View only'}
              </p>
            </div>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenConfig}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-br from-gray-800/40 to-gray-800/20 hover:from-gray-800/50 hover:to-gray-800/30 border border-gray-700/50 hover:border-gray-600/60 transition-all duration-200 w-full group/settings shadow-sm"
          >
            <div className="flex items-center justify-center">
              <Settings size={18} className="text-gray-400 group-hover/settings:text-blue-400 group-hover/settings:rotate-90 transition-all duration-300" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">Settings</p>
              <p className="text-xs text-gray-500 mt-0.5">Configure display</p>
            </div>
          </button>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={handleExportBets}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-br from-gray-800/40 to-gray-800/20 hover:from-gray-800/50 hover:to-gray-800/30 border border-gray-700/50 hover:border-gray-600/60 transition-all duration-200 w-full group/export shadow-sm"
            >
              <div className="flex items-center justify-center">
                <Download size={18} className="text-gray-400 group-hover/export:text-blue-400 transition-colors" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">Export Data</p>
                <p className="text-xs text-gray-500 mt-0.5">Download Excel</p>
              </div>
            </button>
            {showNoBetsMessage && (
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-amber-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xl border border-amber-500/50 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200">
                No bets to export!
              </div>
            )}
          </div>

          {/* Reset Button */}
          <div className="relative">
            <button
              onClick={handleReset}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-br transition-all duration-200 w-full group/reset shadow-sm ${
                showResetConfirm
                  ? 'from-red-600/40 to-red-700/30 border-red-500/60 hover:border-red-400/70'
                  : 'from-gray-800/40 to-gray-800/20 hover:from-gray-800/50 hover:to-gray-800/30 border-gray-700/50 hover:border-gray-600/60'
              } border`}
            >
              <div className="flex items-center justify-center">
                <RefreshCw
                  size={18}
                  className={`transition-all duration-200 ${
                    showResetConfirm
                      ? 'text-red-400 rotate-180'
                      : 'text-gray-400 group-hover/reset:text-blue-400 group-hover/reset:rotate-180'
                  }`}
                />
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${showResetConfirm ? 'text-red-300' : 'text-white'}`}>
                  {showResetConfirm ? 'Click Again to Confirm' : 'Reset All Data'}
                </p>
                <p className={`text-xs mt-0.5 ${showResetConfirm ? 'text-red-400' : 'text-gray-500'}`}>
                  {showResetConfirm ? 'Clear bets & settings' : 'Clear bets & settings'}
                </p>
              </div>
            </button>
            {showResetConfirm && (
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xl border border-red-500/50 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200">
                This will clear everything!
              </div>
            )}
            {showResetSuccess && (
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gradient-to-br from-green-600 to-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-green-500/50 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-300">
                Data cleared successfully!
              </div>
            )}
          </div>
        </div>

        {/* Primary Action - Add Bet */}
        <div className="px-4 py-4 border-t border-gray-700/50">
          <button
            onClick={onOpenForm}
            className="flex items-center justify-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 w-full group/add border border-white/20 hover:border-white/30 shadow-lg hover:shadow-xl active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${baseColor}, ${baseColor}dd)`,
              boxShadow: `0 4px 16px -2px ${baseColor}60`
            }}
          >
            <PlusCircle size={20} className="text-white group-hover/add:rotate-180 transition-transform duration-300" />
            <span className="text-sm font-bold text-white uppercase tracking-wide">Add New Bet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
