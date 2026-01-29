import { X } from 'lucide-react';
import { Checkbox, Typography, Input } from "@material-tailwind/react";
import { DisplaySettings } from '../utils/types';
import { getColorWithOpacity } from '../utils/helpers';

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
        <div className="flex justify-between items-center px-8 pt-8 pb-6 border-b border-gray-700/50">
          <h2 className="text-3xl font-bold text-white tracking-tight">Overlay Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8 overflow-y-auto flex-1">

          {/* Display Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Display Options</h3>
            <div className="grid grid-cols-4 gap-4">
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
            <div className="space-y-4 pb-8 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white">Header Settings</h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Header Opacity: <span className="text-blue-400">{Math.round(config.opacity * 100)}%</span>
                    </label>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={config.opacity * 100}
                        onChange={(e) => onConfigChange({ opacity: parseInt(e.target.value) / 100 })}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:bg-blue-400 [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-400 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:bg-blue-400 [&::-moz-range-thumb]:transition-all"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${getColorWithOpacity(config.baseColor, 1)}, ${getColorWithOpacity(config.baseColor, 1)} ${config.opacity * 100}%, #374151 ${config.opacity * 100}%, #374151)`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Logo Size: <span className="text-blue-400">{config.logoSize}</span>
                    </label>
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
                      <input
                        type="range"
                        min="2"
                        max="5"
                        step="1"
                        value={config.logoSize}
                        onChange={(e) => onConfigChange({ logoSize: parseInt(e.target.value, 10) })}
                        className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer transition-all duration-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:bg-blue-400 [&::-webkit-slider-thumb]:transition-all [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-400 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:bg-blue-400 [&::-moz-range-thumb]:transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Appearance</h3>

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

          {/* Layout Settings */}
          {(!config.maxHeightMode || config.carouselMode) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Layout Settings</h3>

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
          )}

        </div>
      </div>
    </div>
  );
};
