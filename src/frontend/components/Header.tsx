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
      className="px-6 py-3 mb-2 rounded-lg shadow-lg"
      style={{
        backgroundColor: getColorWithOpacity(baseColor, opacity)
      }}
    >
      <div className="flex items-center justify-center gap-4">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            className="object-cover rounded-full shadow-lg"
            style={{ width: `${logoSize}rem`, height: `${logoSize}rem` }}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
            }}
          />
        )}
        <h1 className="text-3xl font-bold text-center text-white drop-shadow-lg tracking-tight">
          {headerTitle}
        </h1>
      </div>
    </div>
  );
};
