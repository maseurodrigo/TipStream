import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Bet, BettingSite, DisplaySettings } from '../utils/types';

interface UseSocketConnectionProps {
  sessionId?: string;
  isEditor?: boolean;
}

interface UseSocketConnectionReturn {
  bets: Bet[];
  setBets: (bets: Bet[] | ((prev: Bet[]) => Bet[])) => void;
  bettingSites: BettingSite[];
  displaySettings: DisplaySettings;
  setDisplaySettings: (settings: DisplaySettings | ((prev: DisplaySettings) => DisplaySettings)) => void;
  sessionID: string;
  wsSockets: string[];
  isConnected: boolean;
  resetSession: () => void;
}

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  tipsBoxWidth: 400,
  tipsBoxHeight: 600,
  maxHeightMode: false,
  showHeader: false,
  showPnLTracker: true,
  carouselMode: false,
  headerTitle: 'Live Bets',
  logoUrl: '',
  logoSize: 2,
  baseColor: '#2D3748',
  opacity: 0.8,
  maxBetsPCol: 8,
  carouselTimer: 8,
};

export const useSocketConnection = ({
  sessionId,
  isEditor = false,
}: UseSocketConnectionProps): UseSocketConnectionReturn => {
  const [bettingSites, setBettingSites] = useState<BettingSite[]>([]);
  const [wsSockets, setWSSockets] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Load persisted data from localStorage (only for editor)
  const loadPersistedSessionID = () => {
    if (isEditor) {
      const stored = localStorage.getItem('editorSessionID');
      return stored || crypto.randomUUID();
    }
    return '';
  };

  const loadPersistedBets = (): Bet[] => {
    if (isEditor) {
      const stored = localStorage.getItem('editorBets');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  };

  const loadPersistedDisplaySettings = (): DisplaySettings => {
    if (isEditor) {
      const stored = localStorage.getItem('editorDisplaySettings');
      if (stored) {
        try {
          return { ...DEFAULT_DISPLAY_SETTINGS, ...JSON.parse(stored) };
        } catch {
          return DEFAULT_DISPLAY_SETTINGS;
        }
      }
    }
    return DEFAULT_DISPLAY_SETTINGS;
  };

  const [generatedSessionID] = useState(loadPersistedSessionID);
  const [bets, setBets] = useState<Bet[]>(loadPersistedBets);
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(loadPersistedDisplaySettings);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  // Save sessionID to localStorage when it changes (only for editor)
  useEffect(() => {
    if (isEditor && generatedSessionID) {
      localStorage.setItem('editorSessionID', generatedSessionID);
    }
  }, [generatedSessionID, isEditor]);

  // Save bets to localStorage when they change (only for editor)
  useEffect(() => {
    if (isEditor) {
      localStorage.setItem('editorBets', JSON.stringify(bets));
    }
  }, [bets, isEditor]);

  // Save displaySettings to localStorage when they change (only for editor)
  useEffect(() => {
    if (isEditor) {
      localStorage.setItem('editorDisplaySettings', JSON.stringify(displaySettings));
    }
  }, [displaySettings, isEditor]);

  // Reset session function
  const resetSession = () => {
    if (!isEditor) return;

    // Clear localStorage (but keep the sessionID)
    localStorage.removeItem('editorBets');
    localStorage.removeItem('editorDisplaySettings');
    localStorage.removeItem('tipsBoxWidth');
    localStorage.removeItem('tipsBoxHeight');

    // Reset state (keep the same room/sessionID)
    setBets([]);
    setDisplaySettings(DEFAULT_DISPLAY_SETTINGS);
  };

  useEffect(() => {
    // Load betting sites from external JSON file
    fetch('/src/data/bettingSites.json')
      .then(res => res.json())
      .then(data => setBettingSites(data))
      .catch(() => setBettingSites([]));

    // Initialize Socket.io client
    socketRef.current = io(import.meta.env.VITE_SOCKET_SERVER_URL, { transports: ['websocket'] });

    // Use the already loaded sessionID (from localStorage) instead of creating a new one
    const currentSessionId = isEditor ? generatedSessionID : sessionId;

    // Join the session room
    socketRef.current?.emit('joinRoom', currentSessionId);
    setIsConnected(true);

    if (isEditor) {
      // Editor: Fetch initial room sockets immediately after joining
      socketRef.current?.emit('getRoomSockets', currentSessionId, (response: any) => {
        if (response.success) {
          setWSSockets(response.sockets);
        }
      });

      // Editor: Listen for room updates and fetch sockets
      const handleRoomUpdate = () => {
        socketRef.current?.emit('getRoomSockets', currentSessionId, (response: any) => {
          if (response.success) {
            setWSSockets(response.sockets);
          }
        });
      };

      socketRef.current?.on('roomUpdate', handleRoomUpdate);
    } else {
      // Viewer: Receive last known data state when joining
      socketRef.current?.on('lastDataState', (updates) => {
        if (updates.tipsBoxWidth !== undefined) {
          setDisplaySettings(prev => ({ ...prev, tipsBoxWidth: updates.tipsBoxWidth }));
        }
        if (updates.tipsBoxHeight !== undefined) {
          setDisplaySettings(prev => ({ ...prev, tipsBoxHeight: updates.tipsBoxHeight }));
        }
        if (updates.maxHeightMode !== undefined) {
          setDisplaySettings(prev => ({ ...prev, maxHeightMode: updates.maxHeightMode }));
        }
        if (updates.showHeader !== undefined) {
          setDisplaySettings(prev => ({ ...prev, showHeader: updates.showHeader }));
        }
        if (updates.showPnLTracker !== undefined) {
          setDisplaySettings(prev => ({ ...prev, showPnLTracker: updates.showPnLTracker }));
        }
        if (updates.carouselMode !== undefined) {
          setDisplaySettings(prev => ({ ...prev, carouselMode: updates.carouselMode }));
        }
        if (updates.headerTitle !== undefined) {
          setDisplaySettings(prev => ({ ...prev, headerTitle: updates.headerTitle }));
        }
        if (updates.logoUrl !== undefined) {
          setDisplaySettings(prev => ({ ...prev, logoUrl: updates.logoUrl }));
        }
        if (updates.logoSize !== undefined) {
          setDisplaySettings(prev => ({ ...prev, logoSize: updates.logoSize }));
        }
        if (updates.baseColor !== undefined) {
          setDisplaySettings(prev => ({ ...prev, baseColor: updates.baseColor }));
        }
        if (updates.opacity !== undefined) {
          setDisplaySettings(prev => ({ ...prev, opacity: updates.opacity }));
        }
        if (updates.maxBetsPCol !== undefined) {
          setDisplaySettings(prev => ({ ...prev, maxBetsPCol: updates.maxBetsPCol }));
        }
        if (updates.carouselTimer !== undefined) {
          setDisplaySettings(prev => ({ ...prev, carouselTimer: updates.carouselTimer }));
        }
        if (updates.bets !== undefined) {
          setBets(updates.bets);
        }
      });

      // Viewer: Listen for updates sent to the session
      socketRef.current?.on('receiveUpdate', (updates) => {
        if (updates.tipsBoxWidth !== undefined) {
          setDisplaySettings(prev => ({ ...prev, tipsBoxWidth: updates.tipsBoxWidth }));
        }
        if (updates.tipsBoxHeight !== undefined) {
          setDisplaySettings(prev => ({ ...prev, tipsBoxHeight: updates.tipsBoxHeight }));
        }
        if (updates.maxHeightMode !== undefined) {
          setDisplaySettings(prev => ({ ...prev, maxHeightMode: updates.maxHeightMode }));
        }
        if (updates.showHeader !== undefined) {
          setDisplaySettings(prev => ({ ...prev, showHeader: updates.showHeader }));
        }
        if (updates.showPnLTracker !== undefined) {
          setDisplaySettings(prev => ({ ...prev, showPnLTracker: updates.showPnLTracker }));
        }
        if (updates.carouselMode !== undefined) {
          setDisplaySettings(prev => ({ ...prev, carouselMode: updates.carouselMode }));
        }
        if (updates.headerTitle !== undefined) {
          setDisplaySettings(prev => ({ ...prev, headerTitle: updates.headerTitle }));
        }
        if (updates.logoUrl !== undefined) {
          setDisplaySettings(prev => ({ ...prev, logoUrl: updates.logoUrl }));
        }
        if (updates.logoSize !== undefined) {
          setDisplaySettings(prev => ({ ...prev, logoSize: updates.logoSize }));
        }
        if (updates.baseColor !== undefined) {
          setDisplaySettings(prev => ({ ...prev, baseColor: updates.baseColor }));
        }
        if (updates.opacity !== undefined) {
          setDisplaySettings(prev => ({ ...prev, opacity: updates.opacity }));
        }
        if (updates.maxBetsPCol !== undefined) {
          setDisplaySettings(prev => ({ ...prev, maxBetsPCol: updates.maxBetsPCol }));
        }
        if (updates.carouselTimer !== undefined) {
          setDisplaySettings(prev => ({ ...prev, carouselTimer: updates.carouselTimer }));
        }
        if (updates.bets !== undefined) {
          setBets(updates.bets);
        }
      });
    }

    // Cleanup
    return () => {
      if (isEditor) {
        socketRef.current?.off('roomUpdate');
      } else {
        socketRef.current?.off('lastDataState');
        socketRef.current?.off('receiveUpdate');
      }
      socketRef.current?.emit('leaveRoom', currentSessionId);
      socketRef.current?.disconnect();
      setIsConnected(false);
    };
  }, [sessionId, isEditor]);

  // Editor: Send updates to connected viewers
  useEffect(() => {
    if (isEditor && generatedSessionID && isConnected) {
      socketRef.current?.emit('update', {
        sessionID: generatedSessionID,
        updates: {
          ...displaySettings,
          bets,
        },
      });
    }
  }, [isEditor, generatedSessionID, displaySettings, bets, isConnected]);

  return {
    bets,
    setBets,
    bettingSites,
    displaySettings,
    setDisplaySettings,
    sessionID: isEditor ? generatedSessionID : (sessionId || ''),
    wsSockets,
    isConnected,
    resetSession,
  };
};
