import React, { useState, useEffect } from 'react';
import { Bet } from './utils/types';
import { getColorWithOpacity } from './utils/helpers';
import { exportBetsToExcel } from './utils/exportToExcel';
import { useSocketConnection } from './hooks/useSocketConnection';
import { useBetForm } from './hooks/useBetForm';
import { useBetEdit } from './hooks/useBetEdit';
import { BetsList } from './components/BetsList';
import { ConfigModal } from './components/ConfigModal';
import { AddBetModal } from './components/AddBetModal';
import { ControlButtons } from './components/ControlButtons';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isStreamMode, setIsStreamMode] = useState(false);

  // Socket connection and state management
  const {
    bets,
    setBets,
    bettingSites,
    displaySettings,
    setDisplaySettings,
    sessionID,
    wsSockets,
  } = useSocketConnection({ isEditor: true });

  // Bet form management
  const betForm = useBetForm(bettingSites);

  // Bet edit management
  const betEdit = useBetEdit(bettingSites[0]?.value || '');

  // Initialize default site when betting sites load
  useEffect(() => {
    if (bettingSites.length > 0) {
      betForm.setNewSite(bettingSites[0].value);
    }
  }, [bettingSites]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBet = betForm.submitBet();
    if (newBet) {
      setBets((prev) => [...prev, newBet]);
      betForm.resetForm(bettingSites[0]?.value || '');
      setIsFormOpen(false);
    }
  };

  const updateBetStatus = (id: string, newStatus: 'green' | 'red' | 'void' | 'half-win' | 'half-loss') => {
    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === id) {
          return {
            ...bet,
            status: bet.status === newStatus ? 'pending' : newStatus
          };
        }
        return bet;
      })
    );
  };

  const deleteBet = (id: string) => {
    setBets((prev) => prev.filter((bet) => bet.id !== id));
  };

  const startEdit = (bet: Bet) => {
    betEdit.startEdit(bet, bettingSites[0]?.value || '');
  };

  const saveEdit = () => {
    const updatedBets = betEdit.saveEdit(bets);
    if (updatedBets) {
      setBets(updatedBets);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ backgroundColor: getColorWithOpacity(displaySettings.baseColor, 0.5) }}>
      {/* Control Buttons */}
      <ControlButtons
        sessionID={sessionID}
        viewerCount={wsSockets.length}
        isStreamMode={isStreamMode}
        onToggleStream={() => setIsStreamMode(!isStreamMode)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenForm={() => {
          betForm.resetForm(bettingSites[0]?.value || '');
          setIsFormOpen(true);
        }}
        onExportBets={() => exportBetsToExcel(bets)}
        baseColor={displaySettings.baseColor}
      />

      {/* Configuration Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={displaySettings}
        onConfigChange={(updates) => setDisplaySettings(prev => ({ ...prev, ...updates }))}
      />

      {/* Add Bet Form Modal */}
      <AddBetModal
        isOpen={isFormOpen}
        onClose={() => {
          betForm.resetForm(bettingSites[0]?.value || '');
          setIsFormOpen(false);
        }}
        formState={betForm}
        onSubmit={handleSubmit}
        bettingSites={bettingSites}
        baseColor={displaySettings.baseColor}
      />

      {/* Betting Tips Box with Resize Handle */}
      <div className="pointer-events-auto inline-block fixed top-6 left-6 min-w-80 w-fit z-10">
        <div
          className="relative p-2 rounded-lg backdrop-blur-lg shadow-[0_0_35px_rgba(0,0,0,0.2)] hover:shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-shadow duration-300"
          style={{
            backgroundColor: getColorWithOpacity(displaySettings.baseColor, 0.4),
            width: displaySettings.tipsBoxWidth,
            minWidth: 300,
            maxWidth: 1200,
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
            isStreamMode={isStreamMode}
            showHeader={displaySettings.showHeader}
            showPnLTracker={displaySettings.showPnLTracker}
            headerTitle={displaySettings.headerTitle}
            logoUrl={displaySettings.logoUrl}
            logoSize={displaySettings.logoSize}
            baseColor={displaySettings.baseColor}
            opacity={displaySettings.opacity}
            editingId={betEdit.editingId}
            editState={betEdit}
            onEdit={startEdit}
            onSaveEdit={saveEdit}
            onCancelEdit={betEdit.cancelEdit}
            onDelete={deleteBet}
            onStatusChange={updateBetStatus}
          />

          {/* Drag handle for width resizing */}
          <div
            className="absolute top-0 right-0 h-full w-3 py-8 cursor-ew-resize z-50"
            style={{ background: 'transparent' }}
            onMouseDown={e => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = displaySettings.tipsBoxWidth;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const delta = moveEvent.clientX - startX;
                let newWidth = startWidth + delta;
                newWidth = Math.max(300, Math.min(1200, newWidth));
                setDisplaySettings(prev => ({ ...prev, tipsBoxWidth: newWidth }));
              };

              const onMouseUp = () => {
                localStorage.setItem('tipsBoxWidth', displaySettings.tipsBoxWidth.toString());
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
              };

              window.addEventListener('mousemove', onMouseMove);
              window.addEventListener('mouseup', onMouseUp);
            }}
          >
            {/* Add a visual indicator */}
            <div className="h-full w-1 bg-gray-500/40 rounded-full mx-auto"></div>
          </div>

          {/* Drag handle for height resizing - only visible when maxHeightMode is enabled */}
          {displaySettings.maxHeightMode && (
            <div
              className="absolute bottom-0 left-0 w-full h-3 px-8 cursor-ns-resize z-50"
              style={{ background: 'transparent' }}
              onMouseDown={e => {
                e.preventDefault();
                const startY = e.clientY;
                const startHeight = displaySettings.tipsBoxHeight;

                const onMouseMove = (moveEvent: MouseEvent) => {
                  const delta = moveEvent.clientY - startY;
                  let newHeight = startHeight + delta;
                  newHeight = Math.max(300, Math.min(1200, newHeight));
                  setDisplaySettings(prev => ({ ...prev, tipsBoxHeight: newHeight }));
                };

                const onMouseUp = () => {
                  localStorage.setItem('tipsBoxHeight', displaySettings.tipsBoxHeight.toString());
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                };

                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
            >
              {/* Add a visual indicator */}
              <div className="w-full h-1 bg-gray-500/40 rounded-full my-auto"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
