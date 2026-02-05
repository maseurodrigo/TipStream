import { X } from 'lucide-react';
import { Checkbox, Typography, Input } from "@material-tailwind/react";
import { DisplaySettings } from '../utils/types';
import { getColorWithOpacity } from '../utils/helpers';
import { Slider } from './Slider';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DisplaySettings;
  onConfigChange: (updates: Partial<DisplaySettings>) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50">
      <div
        className="bg-gray-900/95 rounded-3xl w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-all duration-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-8 pb-6 border-b border-gray-800/50">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-1">Overlay Settings</h2>
            <p className="text-sm text-gray-400">Customize your stream overlay appearance</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-200 p-2.5 hover:bg-gray-800/50 rounded-xl group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1">

          {/* Display Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Display Options
            </h3>
            <div className="grid grid-cols-4 p-3 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 shadow-lg">
              <Checkbox
                defaultChecked={config.showHeader}
                ripple={true}
                label={<Typography className="font-space font-medium text-sm text-gray-200" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Show Header</Typography>}
                color="blue"
                className="text-gray-500 bg-gray-800/50 border-gray-600/50 focus:border-gray-500 transition-all duration-300 rounded-xl"
                onChange={(e) => onConfigChange({ showHeader: e.target.checked })}
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <Checkbox
                defaultChecked={config.showPnLTracker}
                ripple={true}
                label={<Typography className="font-space font-medium text-sm text-gray-200" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Show PnL Tracker</Typography>}
                color="blue"
                className="text-gray-500 bg-gray-800/50 border-gray-600/50 focus:border-gray-500 transition-all duration-300 rounded-xl"
                onChange={(e) => onConfigChange({ showPnLTracker: e.target.checked })}
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <Checkbox
                defaultChecked={config.carouselMode}
                disabled={config.maxHeightMode}
                ripple={true}
                label={<Typography className="font-space font-medium text-sm text-gray-200" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Carousel Mode</Typography>}
                color="blue"
                className="text-gray-500 bg-gray-800/50 border-gray-600/50 focus:border-gray-500 transition-all duration-300 rounded-xl"
                onChange={(e) => onConfigChange({ carouselMode: e.target.checked })}
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <Checkbox
                defaultChecked={config.maxHeightMode}
                disabled={config.carouselMode}
                ripple={true}
                label={<Typography className="font-space font-medium text-sm text-gray-200" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Max Height Mode</Typography>}
                color="blue"
                className="text-gray-500 bg-gray-800/50 border-gray-600/50 focus:border-gray-500 transition-all duration-300 rounded-xl"
                onChange={(e) => onConfigChange({ maxHeightMode: e.target.checked })}
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </div>
          </div>

          {/* Header Settings */}
          {config.showHeader && (
            <div className="space-y-3 pb-6 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Header Settings
              </h3>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="group">
                    <Input
                      type="text"
                      value={config.headerTitle}
                      onChange={(e) => onConfigChange({ headerTitle: e.target.value })}
                      label="Header Title"
                      variant="outlined"
                      color="blue"
                      size="lg"
                      className="text-white !text-base !font-medium"
                      containerProps={{ className: "min-w-0" }}
                      labelProps={{
                        className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                      }}
                      crossOrigin={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  </div>

                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={config.opacity * 100}
                    onChange={(value) => onConfigChange({ opacity: value / 100 })}
                    label="Header Opacity"
                    valueFormatter={(value) => `${Math.round(value)}%`}
                    trackColor={config.baseColor}
                    thumbColor={config.baseColor}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 group">
                      <Input
                        type="text"
                        value={config.logoUrl}
                        onChange={(e) => onConfigChange({ logoUrl: e.target.value })}
                        label="Logo URL"
                        variant="outlined"
                        color="blue"
                        size="lg"
                        className="text-white !text-base !font-medium"
                        containerProps={{ className: "min-w-0" }}
                        labelProps={{
                          className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                        }}
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    </div>
                    {config.logoUrl && (
                      <div className="flex-shrink-0 p-1 bg-gray-800/30 rounded-lg border border-gray-700/30">
                        <img
                          src={config.logoUrl}
                          alt="Logo preview"
                          className="h-8 w-8 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                          }}
                          onLoad={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'block';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <Slider
                    min={2}
                    max={5}
                    step={1}
                    value={config.logoSize}
                    onChange={(value) => onConfigChange({ logoSize: value })}
                    label="Logo Size"
                    trackColor={config.baseColor}
                    thumbColor={config.baseColor}
                  />
                </div>
              </div>
                </div>
            </div>
          )}

          {/* Appearance */}
          <div className={`space-y-3 ${(!config.maxHeightMode || config.carouselMode) ? 'pb-6 border-b border-gray-700/50' : ''}`}>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Appearance
            </h3>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 shadow-lg">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Base Color</label>
                <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
                  <div className="relative group w-12 h-12 flex-shrink-0">
                    <input
                      type="color"
                      value={config.baseColor}
                      onChange={(e) => onConfigChange({ baseColor: e.target.value })}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                    />
                    <div
                      className="absolute inset-0 rounded-lg shadow-md ring-2 ring-gray-600/50 group-hover:ring-blue-500/50 transition-all duration-300 cursor-pointer"
                      style={{ backgroundColor: config.baseColor }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400 uppercase">HEX</span>
                      <code className="text-sm font-mono text-blue-400 bg-gray-900/50 px-3 py-1.5 rounded-lg">{config.baseColor}</code>
                    </div>
                    <span className="text-xs text-gray-500">Click swatch to change</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Settings */}
          {(!config.maxHeightMode || config.carouselMode) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
                Layout Settings
              </h3>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 shadow-lg">
                {!config.carouselMode && !config.maxHeightMode && (
                  <div className="group">
                    <Input
                      type="number"
                      min="2"
                      max="10"
                      value={config.maxBetsPCol.toString()}
                      onChange={(e) => onConfigChange({ maxBetsPCol: parseInt(e.target.value) })}
                      label="Max Bets per Column"
                      variant="outlined"
                      color="blue"
                      size="lg"
                      className="text-white !text-base !font-medium"
                      containerProps={{ className: "min-w-0" }}
                      labelProps={{
                        className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                      }}
                      crossOrigin={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    <p className="mt-1.5 text-xs text-gray-500 ml-3">e.g., 5</p>
                  </div>
                )}

                {config.carouselMode && (
                  <div className="group">
                    <Input
                      type="number"
                      min="3"
                      max="30"
                      step="1"
                      value={config.carouselTimer.toString()}
                      onChange={(e) => onConfigChange({ carouselTimer: parseInt(e.target.value) })}
                      label="Carousel Timer"
                      variant="outlined"
                      color="blue"
                      size="lg"
                      className="text-white !text-base !font-medium"
                      containerProps={{ className: "min-w-0" }}
                      labelProps={{
                        className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                      }}
                      crossOrigin={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    <p className="mt-1.5 text-xs text-gray-500 ml-3">Seconds between transitions (e.g., 5)</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
