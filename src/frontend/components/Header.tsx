import { getColorWithOpacity } from '../utils/helpers';

interface HeaderProps {
  showHeader: boolean;
  headerTitle: string;
  logoUrl: string;
  logoSize: number;
  baseColor: string;
  opacity: number;
}

export const Header: React.FC<HeaderProps> = ({
  showHeader,
  headerTitle,
  logoUrl,
  logoSize,
  baseColor,
  opacity,
}) => {
  if (!showHeader) return null;

  return (
    <div
      className="px-6 py-4 mb-3 rounded-2xl shadow-xl backdrop-blur-md border border-white/10 transition-all duration-300"
      style={{
        backgroundColor: getColorWithOpacity(baseColor, opacity),
        boxShadow: `0 8px 20px -3px rgba(0, 0, 0, 0.3), 0 4px 12px -2px ${baseColor}40`
      }}
    >
      <div className="flex items-center justify-center gap-4">
        {logoUrl && (
          <div className="relative group">
            <img
              src={logoUrl}
              alt="Logo"
              className="object-cover rounded-full shadow-xl ring-2 ring-white/20 group-hover:ring-white/30 transition-all duration-300"
              style={{ width: `${logoSize}rem`, height: `${logoSize}rem` }}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-center text-white drop-shadow-2xl tracking-tight">
          {headerTitle}
        </h1>
      </div>
    </div>
  );
};
