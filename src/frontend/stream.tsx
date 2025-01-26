import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

interface SingleBet {
  id: string;
  tip: string;
  odds: string;
  balance: string;
  balanceType: 'units' | 'money';
  status: 'pending' | 'green' | 'red';
  timestamp: string;
  type: 'single';
}

interface MultipleBet {
  id: string;
  tips: {
    tip: string;
    odds: string;
  }[];
  balance: string;
  balanceType: 'units' | 'money';
  totalOdds: string;
  status: 'pending' | 'green' | 'red';
  timestamp: string;
  type: 'multiple';
}

type Bet = SingleBet | MultipleBet;

export default function Viewer() {
  const { sessionId } = useParams(); // Retrieve the session ID from the URL
  const [logoUrl, setLogoUrl] = useState('');
  const [headerTitle, setHeaderTitle] = useState('Live Bets');
  const [baseColor, setBaseColor] = useState('#2D3748');
  const [opacity, setOpacity] = useState(0.8);
  const [bets, setBets] = useState<Bet[]>([]);

  // Create a ref to store the Socket.io client instance
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  useEffect(() => {
    if (!sessionId) return; // Wait until the session ID is available

    // Initialize Socket.io client using the server URL from environment variables
    socketRef.current = io(import.meta.env.VITE_SOCKET_SERVER_URL);

    // Join the session room
    socketRef.current.emit('join', sessionId);

    // Listen for updates sent to the session
    socketRef.current.on('receive-update', (updates) => {
        // Update state with received updates
        if (updates.logoUrl !== undefined) setLogoUrl(updates.logoUrl);
        if (updates.headerTitle !== undefined) setHeaderTitle(updates.headerTitle);
        if (updates.baseColor !== undefined) setBaseColor(updates.baseColor);
        if (updates.opacity !== undefined) setOpacity(updates.opacity);
        if (updates.bets !== undefined) setBets(updates.bets);        
    });

    // Cleanup listeners when the component unmounts or session ID changes
    return () => { socketRef.current?.disconnect(); };

  }, [sessionId]); // Re-run the effect if the session ID changes

  const getColorWithOpacity = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return <div 
    className={`pointer-events-auto inline-block fixed top-6 left-6`}
    style={{
      minWidth: '20rem',
      maxWidth: '90vw',
      zIndex: 10
    }}
  >
    <div className="bg-gray-900/90 backdrop-blur-lg rounded-t-3xl border border-gray-700/30 shadow-[0_0_35px_rgba(0,0,0,0.2)] hover:shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-shadow duration-300">
      <div 
        className="p-6 rounded-t-3xl" 
        style={{ 
          backgroundColor: getColorWithOpacity(baseColor, opacity)
        }}
      >
        <div className="flex items-center justify-center gap-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 w-8 object-cover rounded-full"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          )}
          <h1 className="text-3xl font-bold text-center text-white tracking-tight">{headerTitle}</h1>
        </div>
      </div>
      <div className="divide-y divide-gray-700/30">
        {bets.map((bet) => (
          <div
            key={bet.id}
            className={`p-6 flex items-center gap-4 ${
              bet.status === 'green'
                ? 'bg-green-900/10'
                : bet.status === 'red'
                ? 'bg-red-900/10'
                : ''
            }`}
          >
            <div className="flex-1 min-w-0">
              {bet.type === 'single' ? (
                <>
                  <p className="font-medium text-white text-lg tracking-tight truncate">{bet.tip}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {bet.odds && (
                      <span className="text-sm font-medium px-2 py-1 rounded-lg bg-gray-800/50 text-gray-300">
                        {bet.odds}
                      </span>
                    )}
                    {bet.balance && (
                      <span className="text-sm font-medium px-2 py-1 rounded-lg bg-gray-800/50 text-gray-300">
                        {bet.balance} {bet.balanceType === 'units' ? 'units' : '$'}
                      </span>
                    )}
                    <span className="text-sm text-gray-400 tracking-wide">{bet.timestamp}</span>
                    {bet.status !== 'pending' && (
                      <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
                        bet.status === 'green'
                          ? 'bg-green-900/20 text-green-400 border border-green-500/20'
                          : 'bg-red-900/20 text-red-400 border border-red-500/20'
                      }`}>
                        {bet.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    {bet.tips.map((tip, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <p className="font-medium text-white text-lg tracking-tight truncate">{tip.tip}</p>
                        <span className="text-sm font-medium px-2 py-1 rounded-lg bg-gray-800/50 text-gray-300">
                          {tip.odds}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium px-2 py-1 rounded-lg bg-blue-900/20 text-blue-300 border border-blue-500/20">
                          Total: {bet.totalOdds}
                        </span>
                        {bet.balance && (
                          <span className="text-sm font-medium px-2 py-1 rounded-lg bg-gray-800/50 text-gray-300">
                            {bet.balance} {bet.balanceType === 'units' ? 'units' : '$'}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-400 tracking-wide">{bet.timestamp}</span>
                      {bet.status !== 'pending' && (
                        <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
                          bet.status === 'green'
                            ? 'bg-green-900/20 text-green-400 border border-green-500/20'
                            : 'bg-red-900/20 text-red-400 border border-red-500/20'
                        }`}>
                          {bet.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {bets.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            <p className="text-lg">No betting tips yet</p>
            <p className="text-sm mt-2">Wait until some suggestions are added!</p>
          </div>
        )}
      </div>
    </div>
  </div>;
}