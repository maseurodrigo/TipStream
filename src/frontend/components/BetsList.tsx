import { Carousel } from "@material-tailwind/react";
import { Bet, BettingSite } from '../utils/types';
import { chunkArray } from '../utils/helpers';
import { Header } from './Header';
import { BetCard } from './BetCard';
import { PnLTracker } from './PnLTracker';

interface BetsListProps {
  bets: Bet[];
  carouselMode: boolean;
  carouselTimer: number;
  maxBetsPCol: number;
  maxHeightMode: boolean;
  bettingSites: BettingSite[];
  isStreamMode: boolean;
  showHeader: boolean;
  showPnLTracker: boolean;
  headerTitle: string;
  logoUrl: string;
  logoSize: number;
  baseColor: string;
  opacity: number;
  editingId: string | null;
  editState?: any;
  onEdit?: (bet: Bet) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: 'green' | 'red') => void;
}

export const BetsList: React.FC<BetsListProps> = ({
  bets,
  carouselMode,
  carouselTimer,
  maxBetsPCol,
  maxHeightMode,
  bettingSites,
  isStreamMode,
  showHeader,
  showPnLTracker,
  headerTitle,
  logoUrl,
  logoSize,
  baseColor,
  opacity,
  editingId,
  editState,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onStatusChange,
}) => {
  const betColumns = chunkArray(bets, maxBetsPCol);

  // For maxHeightMode with auto-scrolling in stream mode
  const renderAutoScrollContent = () => {
    if (maxHeightMode && isStreamMode && bets.length > 0) {
      return (
        <div className="auto-scroll-container overflow-hidden h-full">
          <div className="auto-scroll-content">
            {bets.map((bet) => (
              <div key={bet.id} className="mb-2">
                <BetCard
                  bet={bet}
                  bettingSites={bettingSites}
                  isEditing={editingId === bet.id}
                  isStreamMode={isStreamMode}
                  editState={editState}
                  onEdit={onEdit}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              </div>
            ))}
            {/* Duplicate content for seamless loop */}
            {bets.map((bet) => (
              <div key={`${bet.id}-duplicate`} className="mb-2">
                <BetCard
                  bet={bet}
                  bettingSites={bettingSites}
                  isEditing={false}
                  isStreamMode={isStreamMode}
                  editState={editState}
                  onEdit={onEdit}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Header
        showHeader={showHeader}
        headerTitle={headerTitle}
        logoUrl={logoUrl}
        logoSize={logoSize}
        baseColor={baseColor}
        opacity={opacity}
      />

      {showPnLTracker && <PnLTracker bets={bets} baseColor={baseColor} />}

        {maxHeightMode && isStreamMode ? (
          renderAutoScrollContent()
        ) : carouselMode ? (
          <div className="max-h-[90vh] max-w-[100vw]">
            <Carousel
              autoplay={true}
              autoplayDelay={carouselTimer * 1000}
              loop={true}
              transition={{ type: "tween", duration: 0.5 }}
              className="flex overflow-hidden rounded-lg"
              prevArrow={({ handlePrev }) => <span className="hidden" onClick={handlePrev} />}
              nextArrow={({ handleNext }) => <span className="hidden" onClick={handleNext} />}
              navigation={() => <div className="hidden" />}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {bets.map((bet) => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                  bettingSites={bettingSites}
                  isEditing={editingId === bet.id}
                  isStreamMode={isStreamMode}
                  editState={editState}
                  onEdit={onEdit}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
            </Carousel>
            {bets.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                <p className="text-lg">No open bets yet</p>
                <p className="text-sm mt-2">{isStreamMode ? 'Wait for some suggestions to be added!' : 'Click the + button to add one!'}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center gap-2 max-w-[90vw] max-h-[90vh] w-full">
            {betColumns.map((column: Bet[], columnIndex: number) => (
              <div key={columnIndex} className="flex flex-col space-y-2 w-full">
                {column.map((bet) => (
                  <BetCard
                    key={bet.id}
                    bet={bet}
                    bettingSites={bettingSites}
                    isEditing={editingId === bet.id}
                    isStreamMode={isStreamMode}
                    editState={editState}
                    onEdit={onEdit}
                    onSaveEdit={onSaveEdit}
                    onCancelEdit={onCancelEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            ))}
            {bets.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                <p className="text-lg">No open bets yet</p>
                <p className="text-sm mt-2">{isStreamMode ? 'Wait for some suggestions to be added!' : 'Click the + button to add one!'}</p>
              </div>
            )}
          </div>
        )}
    </>
  );
};
