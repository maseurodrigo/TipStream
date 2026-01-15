import { useParams } from 'react-router-dom';
import { useSocketConnection } from './hooks/useSocketConnection';
import { BetsList } from './components/BetsList';
import { getColorWithOpacity } from './utils/helpers';

export default function Viewer() {
  const { sessionId } = useParams();
  const { bets, bettingSites, displaySettings } = useSocketConnection({ sessionId, isEditor: false });

  return (
    <div className="pointer-events-auto inline-block fixed top-6 left-6 min-w-80 w-fit z-10">
      <div
        className="p-2 rounded-lg backdrop-blur-lg shadow-[0_0_35px_rgba(0,0,0,0.2)] hover:shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-shadow duration-300"
        style={{
          backgroundColor: getColorWithOpacity(displaySettings.baseColor, 0.4),
          width: displaySettings.tipsBoxWidth,
          ...(displaySettings.maxHeightMode && {
            height: displaySettings.tipsBoxHeight,
            minHeight: 300,
            maxHeight: 1200
          })
        }}
      >
        <BetsList
          bets={bets}
          carouselMode={displaySettings.carouselMode}
          carouselTimer={displaySettings.carouselTimer}
          maxBetsPCol={displaySettings.maxBetsPCol}
          maxHeightMode={displaySettings.maxHeightMode}
          bettingSites={bettingSites}
          isStreamMode={true}
          showHeader={displaySettings.showHeader}
          showPnLTracker={displaySettings.showPnLTracker}
          headerTitle={displaySettings.headerTitle}
          logoUrl={displaySettings.logoUrl}
          logoSize={displaySettings.logoSize}
          baseColor={displaySettings.baseColor}
          opacity={displaySettings.opacity}
          editingId={null}
        />
      </div>
    </div>
  );
}
