import { useState } from 'react';
import { Eye, EyeOff, Settings, PlusCircle, Download } from 'lucide-react';

interface ControlButtonsProps {
  sessionID: string;
  viewerCount: number;
  isStreamMode: boolean;
  onToggleStream: () => void;
  onOpenConfig: () => void;
  onOpenForm: () => void;
  onExportBets: () => boolean;
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
  baseColor,
}) => {
  const [showExportTooltip, setShowExportTooltip] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showNoBetsMessage, setShowNoBetsMessage] = useState(false);
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

  return (
    <div className="fixed top-6 right-6 flex gap-3 pointer-events-auto z-20">
      <div className="flex justify-start items-center">
        <div className="relative flex justify-center items-center max-w-[280px] hover:max-w-[600px] bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white pl-6 pr-3 py-2.5 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-700/50 transition-all duration-500 ease-in-out hover:shadow-2xl">
          <span className="overflow-hidden whitespace-nowrap text-ellipsis font-medium text-sm">
            {fullViewerLink}
          </span>
          {isCopied && (
            <div className="ml-3 whitespace-nowrap bg-gradient-to-br from-green-600 to-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-green-500/50 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-300 animate-out fade-out zoom-out-95 flex-shrink-0">
              Copied!
            </div>
          )}
          <button
            onClick={copyURLToClipboard}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 hover:from-gray-700/90 hover:to-gray-800/90 text-white ml-3 py-2.5 px-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-lg border border-gray-700/50 hover:border-gray-600/50 group flex-shrink-0"
          >
            <svg
              className="w-[18px] h-[18px] dark:text-white group-hover:scale-110 transition-transform duration-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-center items-center max-w-screen-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
          <span className="flex items-center max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
            <label className="mr-2 font-semibold text-sm">{viewerCount}</label>
            <span className="relative flex mr-1 size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></span>
            </span>
          </span>
        </div>
      </div>
      <button
        onClick={onToggleStream}
        className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 hover:from-gray-800/95 hover:to-gray-700/95 text-white rounded-2xl p-4 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 backdrop-blur-lg border border-gray-700/50 hover:border-gray-600/50 group"
        title={isStreamMode ? "Switch to Edit Mode" : "Switch to Stream Mode"}
      >
        {isStreamMode ? <Eye size={24} className="group-hover:scale-110 transition-transform duration-200" /> : <EyeOff size={24} className="group-hover:scale-110 transition-transform duration-200" />}
      </button>
      <button
        onClick={onOpenConfig}
        className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 hover:from-gray-800/95 hover:to-gray-700/95 text-white rounded-2xl p-4 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 backdrop-blur-lg border border-gray-700/50 hover:border-gray-600/50 group"
      >
        <Settings size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
      {/* Export to Excel Button */}
      <div className="fixed bottom-28 right-8">
        <div className="relative">
          <button
            onClick={handleExportBets}
            onMouseEnter={() => setShowExportTooltip(true)}
            onMouseLeave={() => setShowExportTooltip(false)}
            className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 hover:from-gray-800/95 hover:to-gray-700/95 text-white rounded-2xl p-3.5 transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border border-gray-700/50 hover:border-gray-600/50 group shadow-xl hover:shadow-2xl"
            title="Export bets to Excel"
          >
            <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
          </button>
          {showExportTooltip && !showNoBetsMessage && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gradient-to-br from-gray-900 to-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-lg">
              Export to Excel
              <div className="absolute left-full top-1/2 -translate-y-1/2">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
              </div>
            </div>
          )}
          {showNoBetsMessage && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gradient-to-br from-amber-800 to-amber-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-amber-600/50 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-300 animate-out fade-out zoom-out-95">
              No bets to export!
              <div className="absolute left-full top-1/2 -translate-y-1/2">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-amber-900"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Bet Button */}
      <button
        onClick={onOpenForm}
        className="fixed bottom-8 right-8 text-white rounded-2xl p-5 transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border border-white/20 hover:border-white/30 group shadow-xl hover:shadow-2xl hover:brightness-110"
        style={{
          background: `linear-gradient(to bottom right, ${baseColor}, ${baseColor}dd)`,
          boxShadow: `0 8px 20px -3px rgba(0, 0, 0, 0.3), 0 4px 12px -2px ${baseColor}40`
        }}
      >
        <PlusCircle size={26} className="group-hover:rotate-180 transition-transform duration-300" />
      </button>
    </div>
  );
};
