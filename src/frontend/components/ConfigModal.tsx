import { X } from 'lucide-react';
import { Checkbox, Typography, Switch } from "@material-tailwind/react";
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
        className="bg-gray-900/95 p-8 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-all duration-300 border border-gray-700/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Overlay Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-8">
          <div className="flex items-center justify-evenly w-full pb-4 border-b-2 border-gray-600/50">
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
            <Switch
              defaultChecked={config.carouselMode}
              ripple={true}
              label={<Typography className="font-space font-medium text-sm text-gray-200" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Carousel Mode</Typography>}
              className="h-full w-full checked:bg-blue-500"
              containerProps={{ className: "w-11 h-6" }}
              circleProps={{ className: "before:hidden left-0.5 border-none" }}
              onChange={(e) => onConfigChange({ carouselMode: e.target.checked })}
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>
          <div className={config.showHeader ? 'block' : 'hidden'}>
            <label className="block text-sm font-medium text-gray-200 mb-3">Title</label>
            <input
              disabled={!config.showHeader}
              type="text"
              value={config.headerTitle}
              onChange={(e) => onConfigChange({ headerTitle: e.target.value })}
              placeholder="Enter a title..."
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            />
          </div>
          <div className={`${config.showHeader ? 'flex items-center justify-center gap-6' : 'hidden'}`}>
            <div className="w-3/5">
              <label className="block text-sm font-medium text-gray-200 mb-3">Logo URL</label>
              <input
                disabled={!config.showHeader}
                type="text"
                value={config.logoUrl}
                onChange={(e) => onConfigChange({ logoUrl: e.target.value })}
                placeholder="Enter logo URL..."
                className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
              />
              {config.logoUrl && (
                <div className="mt-2 p-2 bg-gray-800/50 rounded-xl">
                  <img
                    src={config.logoUrl}
                    alt="Logo preview"
                    className={`h-8 w-8 object-cover rounded-full mx-auto shadow-lg`}
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
            <div className="w-2/5">
              <label className="block text-sm font-medium text-gray-200 mb-3">Logo Size</label>
              <input
                disabled={!config.showHeader}
                type="range"
                min="2"
                max="5"
                step="1"
                value={config.logoSize}
                onChange={(e) => onConfigChange({ logoSize: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-200 mb-3">Base Color</label>
              <input
                type="color"
                value={config.baseColor}
                onChange={(e) => onConfigChange({ baseColor: e.target.value })}
                className="w-full h-14 rounded-xl cursor-pointer"
              />
            </div>
            <div className={config.showHeader ? 'flex-1' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-200 mb-3">Header Color Opacity ({Math.round(config.opacity * 100)}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.opacity * 100}
                onChange={(e) => onConfigChange({ opacity: parseInt(e.target.value) / 100 })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(to right, ${getColorWithOpacity(config.baseColor, 1)}, ${getColorWithOpacity(config.baseColor, 1)} ${config.opacity * 100}%, #374151 ${config.opacity * 100}%, #374151)`
                }}
              />
            </div>
          </div>
          <div className={config.carouselMode ? 'hidden' : 'block'}>
            <label className="block text-sm font-medium text-gray-200 mb-3">Max Bets/Column</label>
            <input
              type="number"
              min="2"
              max="10"
              value={config.maxBetsPCol}
              onChange={(e) => onConfigChange({ maxBetsPCol: parseInt(e.target.value) })}
              placeholder="Enter a number..."
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            />
          </div>
          <div className={config.carouselMode ? 'block' : 'hidden'}>
            <label className="block text-sm font-medium text-gray-200 mb-3">Bet Carousel Time (secs)</label>
            <input
              type="number"
              min="3"
              max="30"
              step="1"
              value={config.carouselTimer}
              onChange={(e) => onConfigChange({ carouselTimer: parseInt(e.target.value) })}
              placeholder="Enter a number..."
              className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
