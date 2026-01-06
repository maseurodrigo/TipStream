import { useState } from 'react';
import { Eye, EyeOff, Settings, PlusCircle, Download } from 'lucide-react';

interface ControlButtonsProps {
  sessionID: string;
  viewerCount: number;
  isStreamMode: boolean;
  onToggleStream: () => void;
  onOpenConfig: () => void;
  onOpenForm: () => void;
  onExportBets: () => void;
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
  const fullViewerLink = `${window.location.origin}/stream/${sessionID}`;

  const copyURLToClipboard = () => {
    navigator.clipboard.writeText(fullViewerLink);
  };

  return (
    <div className="fixed top-6 right-6 flex gap-4 pointer-events-auto z-20">
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-center items-center max-w-screen-xl bg-[rgba(31,32,41,0.4)] text-white pl-8 pr-4 py-2 rounded-lg shadow-lg">
          <span className="max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
            {fullViewerLink}
          </span>
          <button
            onClick={copyURLToClipboard}
            className="bg-gray-900/90 hover:bg-gray-800 text-white ml-4 py-3 px-3 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-gray-700/30"
          >
            <svg
              className="w-[18px] h-[18px] dark:text-white"
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
        <div className="flex justify-center items-center max-w-screen-xl bg-[rgba(31,32,41,0.4)] text-white pl-4 pr-2 py-2 rounded-lg shadow-lg">
          <span className="flex items-center max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
            <label className="mr-2">{viewerCount}</label>
            <span className="relative flex mr-2 size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
            </span>
          </span>
        </div>
      </div>
      <button
        onClick={onToggleStream}
        className="bg-gray-900/90 hover:bg-gray-800 text-white rounded-2xl p-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-gray-700/30"
        title={isStreamMode ? "Switch to Edit Mode" : "Switch to Stream Mode"}
      >
        {isStreamMode ? <Eye size={24} /> : <EyeOff size={24} />}
      </button>
      <button
        onClick={onOpenConfig}
        className="bg-gray-900/90 hover:bg-gray-800 text-white rounded-2xl p-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-gray-700/30"
      >
        <Settings size={24} className="transform hover:rotate-90 transition-transform duration-300" />
      </button>
      {/* Export to Excel Button */}
      <div className="fixed bottom-28 right-8">
        <div className="relative">
          <button
            onClick={onExportBets}
            onMouseEnter={() => setShowExportTooltip(true)}
            onMouseLeave={() => setShowExportTooltip(false)}
            className="text-white rounded-xl p-3 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-white/10"
            style={{ backgroundColor: baseColor }}
            title="Export bets to Excel"
          >
            <Download size={20} className="transition-transform duration-300" />
          </button>
          {showExportTooltip && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900/95 text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-700/30 backdrop-blur-lg">
              Export to Excel
              <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1">
                <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-gray-900/95"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Bet Button */}
      <button
        onClick={onOpenForm}
        className="fixed bottom-8 right-8 text-white rounded-2xl p-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-white/10"
        style={{ backgroundColor: baseColor }}
      >
        <PlusCircle size={24} className="transform hover:rotate-180 transition-transform duration-300" />
      </button>
    </div>
  );
};
