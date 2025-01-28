import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, X, Check, Settings, Trash2, Pencil, Plus, Eye, EyeOff } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { motion } from "framer-motion";

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

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [newTip, setNewTip] = useState('');
  const [newOdds, setNewOdds] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [newBalanceType, setNewBalanceType] = useState<'units' | 'money'>('units');
  const [bets, setBets] = useState<Bet[]>([]);
  const [baseColor, setBaseColor] = useState('#2D3748');
  const [opacity, setOpacity] = useState(0.8);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editOdds, setEditOdds] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [editBalanceType, setEditBalanceType] = useState<'units' | 'money'>('units');
  const [editingMultipleTips, setEditingMultipleTips] = useState<{ tip: string; odds: string }[]>([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [headerTitle, setHeaderTitle] = useState('Live Bets');
  const [betType, setBetType] = useState<'single' | 'multiple'>('single');
  const [multipleTips, setMultipleTips] = useState<{ tip: string; odds: string }[]>([{ tip: '', odds: '' }]);
  const [isStreamMode, setIsStreamMode] = useState(false);
  const [sessionID, setSessionID] = useState(''); // State to store the unique session ID
  const [wsSockets, setWSSockets] = useState<string[]>([]); // To store fetched socket IDs

  // Create a ref to store the Socket.io client instance
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  useEffect(() => {

    // Initialize Socket.io client using the server URL from environment variables
    socketRef.current = io(import.meta.env.VITE_SOCKET_SERVER_URL);

    // Generate a unique session ID using the built-in crypto API
    const randSessionId = crypto.randomUUID();
    setSessionID(randSessionId);

    // Notify the backend that the dashboard has created or joined this session
    socketRef.current?.emit('joinRoom', randSessionId);

    // Listen for room updates and fetch sockets
    const handleRoomUpdate = () => {
      socketRef.current?.emit('getRoomSockets', randSessionId, (response: any) => {
        
        // Update the state with fetched socket IDs
        if (response.success) { setWSSockets(response.sockets); }
      });
    };

    // Listen to fetch the updated list of sockets in the room
    socketRef.current?.on('roomUpdate', handleRoomUpdate);

    // Clean up the socket connection on unmount
    return () => {
      socketRef.current?.off('roomUpdate', handleRoomUpdate);
      socketRef.current?.emit('leaveRoom', randSessionId);
      socketRef.current?.disconnect();
    };

  }, []);

  useEffect(() => {
    // Send the updated text to the backend along with the session ID
    socketRef.current?.emit('update', { 
      sessionID, 
      updates: { logoUrl, headerTitle, baseColor, opacity, bets } 
    });
  }, [logoUrl, headerTitle, baseColor, opacity, bets]);

  const handleNumberChange = (value: string, setter: (value: string) => void) => {
    const regex = /^\d*\.?\d*$/;
    if (value === '' || regex.test(value)) {
      setter(value);
    }
  };

  const calculateTotalOdds = (tips: { tip: string; odds: string }[]): string => {
    const total = tips.reduce((acc, curr) => {
      const odds = parseFloat(curr.odds) || 0;
      return acc * (odds || 1);
    }, 1);
    return total.toFixed(2);
  };

  const addTip = (isEditing: boolean = false) => {
    if (isEditing) {
      setEditingMultipleTips([...editingMultipleTips, { tip: '', odds: '' }]);
    } else {
      setMultipleTips([...multipleTips, { tip: '', odds: '' }]);
    }
  };

  const removeTip = (index: number, isEditing: boolean = false) => {
    if (isEditing) {
      setEditingMultipleTips(editingMultipleTips.filter((_, i) => i !== index));
    } else {
      setMultipleTips(multipleTips.filter((_, i) => i !== index));
    }
  };

  const updateMultipleTip = (index: number, field: 'tip' | 'odds', value: string, isEditing: boolean = false) => {
    const newTips = isEditing ? [...editingMultipleTips] : [...multipleTips];
    if (field === 'odds') {
      const regex = /^\d*\.?\d*$/;
      if (!regex.test(value) && value !== '') return;
    }
    newTips[index] = { ...newTips[index], [field]: value };
    if (isEditing) {
      setEditingMultipleTips(newTips);
    } else {
      setMultipleTips(newTips);
    }
  };

  const resetForm = () => {
    setNewTip('');
    setNewOdds('');
    setNewBalance('');
    setNewBalanceType('units');
    setMultipleTips([{ tip: '', odds: '' }]);
    setBetType('single');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (betType === 'single') {
      if (!newTip.trim()) return;

      const bet: SingleBet = {
        id: crypto.randomUUID(),
        tip: newTip.trim(),
        odds: newOdds.trim(),
        balance: newBalance.trim(),
        balanceType: newBalanceType,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString(),
        type: 'single'
      };

      setBets((prev) => [...prev, bet]);
    } else {
      const validTips = multipleTips.filter(tip => tip.tip.trim() && tip.odds.trim());
      if (validTips.length < 2) return;

      const bet: MultipleBet = {
        id: crypto.randomUUID(),
        tips: validTips,
        balance: newBalance.trim(),
        balanceType: newBalanceType,
        totalOdds: calculateTotalOdds(validTips),
        status: 'pending',
        timestamp: new Date().toLocaleTimeString(),
        type: 'multiple'
      };

      setBets((prev) => [...prev, bet]);
    }

    resetForm();
    setIsFormOpen(false);
  };

  const updateBetStatus = (id: string, newStatus: 'green' | 'red') => {
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
    setEditingId(bet.id);
    if (bet.type === 'single') {
      setEditText(bet.tip);
      setEditOdds(bet.odds);
      setEditBalance(bet.balance);
      setEditBalanceType(bet.balanceType);
    } else {
      setEditingMultipleTips(bet.tips.map(tip => ({ ...tip })));
      setEditBalance(bet.balance);
      setEditBalanceType(bet.balanceType);
    }
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === editingId) {
          if (bet.type === 'single') {
            return { 
              ...bet, 
              tip: editText.trim(), 
              odds: editOdds.trim(),
              balance: editBalance.trim(),
              balanceType: editBalanceType
            };
          } else {
            const validTips = editingMultipleTips.filter(tip => tip.tip.trim() && tip.odds.trim());
            if (validTips.length < 2) return bet;
            return {
              ...bet,
              tips: validTips,
              balance: editBalance.trim(),
              balanceType: editBalanceType,
              totalOdds: calculateTotalOdds(validTips)
            };
          }
        }
        return bet;
      })
    );
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditOdds('');
    setEditBalance('');
    setEditBalanceType('units');
    setEditingMultipleTips([]);
  };

  const getColorWithOpacity = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Get the full URL dynamically and append {sessionID}
  const fullViewerLink = `${window.location.origin}/stream/${sessionID}`;

  // Copies fullViewerLink URL to clipboard
  const copyURLToClipboard = () => { navigator.clipboard.writeText(fullViewerLink); }

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ fontFamily: "SpaceGrotesk", backgroundColor: getColorWithOpacity(baseColor, 0.5) }}>
      {/* Control Buttons */}
      <div className="fixed top-6 right-6 flex gap-4 pointer-events-auto z-50">
        <div className="flex justify-center items-center w-full">
          <div className="flex justify-center items-center max-w-screen-xl bg-[rgba(31,32,41,0.4)] text-white pl-8 pr-4 py-2 rounded-lg shadow-lg">
            <span className="max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
              {fullViewerLink}
            </span>
            <button onClick={copyURLToClipboard}
              className="bg-gray-900/90 hover:bg-gray-800 text-white ml-4 py-3 px-3 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-gray-700/30">
              <svg className="w-[18px] h-[18px] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex justify-center items-center max-w-screen-xl bg-[rgba(31,32,41,0.4)] text-white pl-4 pr-2 py-2 rounded-lg shadow-lg">
            <span className="flex items-center max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
              <label className="mr-2">{wsSockets.length}</label>
              <span className="relative flex mr-2 size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
              </span>
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsStreamMode(!isStreamMode)}
          className="bg-gray-900/90 hover:bg-gray-800 text-white rounded-2xl p-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-gray-700/30"
          title={isStreamMode ? "Switch to Edit Mode" : "Switch to Stream Mode"}>
          {isStreamMode ? <Eye size={24} /> : <EyeOff size={24} />}
        </button>
        <button
          onClick={() => setIsConfigOpen(true)}
          className="bg-gray-900/90 hover:bg-gray-800 text-white rounded-2xl p-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-gray-700/30">
          <Settings size={24} className="transform hover:rotate-90 transition-transform duration-300" />
        </button>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="fixed bottom-8 right-8 text-white rounded-2xl p-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-white/10"
          style={{ backgroundColor: baseColor }}>
          <PlusCircle size={24} className="transform hover:rotate-180 transition-transform duration-300" />
        </button>
      </div>

      {/* Configuration Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50">
          <div 
            className="bg-gray-900/95 p-8 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-all duration-300 border border-gray-700/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Overlay Settings</h2>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">Title</label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="Enter a title..."
                  className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Enter logo URL..."
                  className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                />
                {logoUrl && (
                  <div className="mt-2 p-2 bg-gray-800/50 rounded-xl">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="h-8 w-8 object-cover rounded-full mx-auto"
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
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    Base Color
                  </label>
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-full h-14 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">Header Color Opacity ({Math.round(opacity * 100)}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity * 100}
                    onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${getColorWithOpacity(baseColor, 1)}, ${getColorWithOpacity(baseColor, 1)} ${opacity * 100}%, #374151 ${opacity * 100}%, #374151)`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50">
          <div 
            className="bg-gray-900/95 p-8 rounded-3xl w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-all duration-300 border border-gray-700/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Add New Bet</h2>
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setBetType('single')}
                  className={`flex-1 py-2 px-4 rounded-xl transition-all duration-300 ${
                    betType === 'single'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Single Bet
                </button>
                <button
                  type="button"
                  onClick={() => setBetType('multiple')}
                  className={`flex-1 py-2 px-4 rounded-xl transition-all duration-300 ${
                    betType === 'multiple'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Multiple Bet
                </button>
              </div>

              {betType === 'single' ? (
                <>
                  <div>
                    <input
                      type="text"
                      value={newTip}
                      onChange={(e) => setNewTip(e.target.value)}
                      placeholder="Enter betting tip..."
                      className="w-full p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-lg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={newOdds}
                        onChange={(e) => handleNumberChange(e.target.value, setNewOdds)}
                        placeholder="Enter odds (e.g., 1.75)..."
                        className="w-full p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={newBalance}
                          onChange={(e) => handleNumberChange(e.target.value, setNewBalance)}
                          placeholder={newBalanceType === 'units' ? "Enter units..." : "Enter amount..."}
                          className="flex-1 p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setNewBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                          className="px-3 rounded-xl bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                        >
                          {newBalanceType === 'units' ? 'Units' : 'Money'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {multipleTips.map((tip, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={tip.tip}
                          onChange={(e) => updateMultipleTip(index, 'tip', e.target.value)}
                          placeholder={`Tip ${index + 1}`}
                          className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={tip.odds}
                          onChange={(e) => updateMultipleTip(index, 'odds', e.target.value)}
                          placeholder="Odds"
                          className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        />
                      </div>
                      {multipleTips.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTip(index)}
                          className="p-3 rounded-xl hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTip()}
                    className="w-full py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/30 flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                  {multipleTips.length > 1 && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400">Total Odds: <span className="text-white font-medium">{calculateTotalOdds(multipleTips)}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={newBalance}
                          onChange={(e) => handleNumberChange(e.target.value, setNewBalance)}
                          placeholder={newBalanceType === 'units' ? "Enter units..." : "Enter amount..."}
                          className="flex-1 p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setNewBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                          className="px-3 rounded-xl bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                        >
                          {newBalanceType === 'units' ? 'Units' : 'Money'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl transition-all duration-300 text-white font-medium shadow-lg hover:shadow-2xl text-lg"
                style={{ backgroundColor: baseColor }}
              >
                Add {betType === 'single' ? 'Single Bet' : 'Multiple Bet'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Betting Tips Box */}
      <div 
        className="pointer-events-auto inline-block fixed top-6 left-6"
        style={{
          minWidth: '20rem',
          maxWidth: '90vw',
          zIndex: 10
        }}
      >
        <div 
          className="p-2 rounded-lg backdrop-blur-lg shadow-[0_0_35px_rgba(0,0,0,0.2)] hover:shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-shadow duration-300" 
          style={{ 
            backgroundColor: getColorWithOpacity(baseColor, 0.4)
          }}
        >
          <div 
            className="p-6 rounded-lg shadow-lg" 
            style={{ 
              backgroundColor: getColorWithOpacity(baseColor, opacity)
            }}
          >
            <div className="flex items-center justify-center gap-4">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-8 w-8 object-cover rounded-full shadow-lg"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              )}
              <h1 className="text-3xl font-bold text-center text-white drop-shadow-lg tracking-tight">{headerTitle}</h1>
            </div>
          </div>
          <div className="divide-y divide-gray-700/30">
            {bets.map((bet) => (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                key={bet.id}
                className={`bg-gray-900/80 p-6 mt-2 rounded-lg shadow-lg flex items-center gap-4`}
              >
                <div className="flex-1 min-w-0 mr-6">
                  {editingId === bet.id ? (
                    <div className="space-y-3">
                      {bet.type === 'single' ? (
                        <>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                            autoFocus
                          />
                          <div className="flex gap-4">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={editOdds}
                              onChange={(e) => handleNumberChange(e.target.value, setEditOdds)}
                              placeholder="Enter odds..."
                              className="flex-1 p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                            />
                            <div className="flex-1">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={editBalance}
                                  onChange={(e) => handleNumberChange(e.target.value, setEditBalance)}
                                  placeholder={editBalanceType === 'units' ? "Enter units..." : "Enter amount..."}
                                  className="flex-1 p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                                  className="px-3 rounded-lg bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                                >
                                  {editBalanceType === 'units' ? 'Units' : 'Money'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          {editingMultipleTips.map((tip, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={tip.tip}
                                  onChange={(e) => updateMultipleTip(index, 'tip', e.target.value, true)}
                                  placeholder={`Tip ${index + 1}`}
                                  className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                                />
                              </div>
                              <div className="w-32">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={tip.odds}
                                  onChange={(e) => updateMultipleTip(index, 'odds', e.target.value, true)}
                                  placeholder="Odds"
                                  className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                                />
                              </div>
                              {editingMultipleTips.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeTip(index, true)}
                                  className="p-2 rounded-lg hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                                >
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addTip(true)}
                            className="w-full py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/30 flex items-center justify-center">
                            <Plus size={20} />
                          </button>
                          {editingMultipleTips.length > 1 && (
                            <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                              <div className="flex items-center justify-between">
                                <p className="text-gray-400">Total Odds: <span className="text-white font-medium">{calculateTotalOdds(editingMultipleTips)}</span></p>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={editBalance}
                                  onChange={(e) => handleNumberChange(e.target.value, setEditBalance)}
                                  placeholder={editBalanceType === 'units' ? "Enter units..." : "Enter amount..."}
                                  className="flex-1 p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                                  className="px-3 rounded-lg bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                                >
                                  {editBalanceType === 'units' ? 'Units' : 'Money'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {bet.type === 'single' ? (
                        <>
                          <p className="font-medium text-white text-lg tracking-tight truncate">{bet.tip}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {bet.odds && (
                              <span className="flex text-sm font-medium px-2 py-1 rounded-lg shadow-lg bg-gray-800/80 text-gray-300">
                                <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" d="M9 15a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm3.845-1.855a2.4 2.4 0 0 1 1.2-1.226 1 1 0 0 1 1.992-.026c.426.15.809.408 1.111.749a1 1 0 1 1-1.496 1.327.682.682 0 0 0-.36-.213.997.997 0 0 1-.113-.032.4.4 0 0 0-.394.074.93.93 0 0 0 .455.254 2.914 2.914 0 0 1 1.504.9c.373.433.669 1.092.464 1.823a.996.996 0 0 1-.046.129c-.226.519-.627.94-1.132 1.192a1 1 0 0 1-1.956.093 2.68 2.68 0 0 1-1.227-.798 1 1 0 1 1 1.506-1.315.682.682 0 0 0 .363.216c.038.009.075.02.111.032a.4.4 0 0 0 .395-.074.93.93 0 0 0-.455-.254 2.91 2.91 0 0 1-1.503-.9c-.375-.433-.666-1.089-.466-1.817a.994.994 0 0 1 .047-.134Zm1.884.573.003.008c-.003-.005-.003-.008-.003-.008Zm.55 2.613s-.002-.002-.003-.007a.032.032 0 0 1 .003.007ZM4 14a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1Zm3-2a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm6.5-8a1 1 0 0 1 1-1H18a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-.796l-2.341 2.049a1 1 0 0 1-1.24.06l-2.894-2.066L6.614 9.29a1 1 0 1 1-1.228-1.578l4.5-3.5a1 1 0 0 1 1.195-.025l2.856 2.04L15.34 5h-.84a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
                                </svg>
                                {bet.odds}
                              </span>
                            )}
                            {bet.balance && (
                              <span className="flex text-sm font-medium px-2 py-1 rounded-lg shadow-lg bg-gray-800/80 text-gray-300">
                                {bet.balanceType === 'units' ? 
                                  <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                                  </svg>
                                  : 
                                  <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                                  </svg>
                                }
                                {bet.balance}
                              </span>
                            )}
                            <span className="text-sm text-gray-400 tracking-wide">{bet.timestamp}</span>
                            {isStreamMode && bet.status !== 'pending' && (
                              <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
                                bet.status === 'green'
                                  ? 'animate-pulse bg-green-900/20 text-green-400 border border-green-500/20'
                                  : 'animate-pulse bg-red-900/20 text-red-400 border border-red-500/20'
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
                                <span className="text-sm font-medium px-2 py-1 rounded-lg shadow-md bg-gray-800/80 text-gray-300">
                                  {tip.odds}
                                </span>
                              </div>
                            ))}
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-4">
                                <span className="flex text-sm font-medium px-2 py-1 rounded-lg shadow-lg bg-blue-900/20 text-blue-300 border border-blue-500/20">
                                  <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M9 15a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm3.845-1.855a2.4 2.4 0 0 1 1.2-1.226 1 1 0 0 1 1.992-.026c.426.15.809.408 1.111.749a1 1 0 1 1-1.496 1.327.682.682 0 0 0-.36-.213.997.997 0 0 1-.113-.032.4.4 0 0 0-.394.074.93.93 0 0 0 .455.254 2.914 2.914 0 0 1 1.504.9c.373.433.669 1.092.464 1.823a.996.996 0 0 1-.046.129c-.226.519-.627.94-1.132 1.192a1 1 0 0 1-1.956.093 2.68 2.68 0 0 1-1.227-.798 1 1 0 1 1 1.506-1.315.682.682 0 0 0 .363.216c.038.009.075.02.111.032a.4.4 0 0 0 .395-.074.93.93 0 0 0-.455-.254 2.91 2.91 0 0 1-1.503-.9c-.375-.433-.666-1.089-.466-1.817a.994.994 0 0 1 .047-.134Zm1.884.573.003.008c-.003-.005-.003-.008-.003-.008Zm.55 2.613s-.002-.002-.003-.007a.032.032 0 0 1 .003.007ZM4 14a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1Zm3-2a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm6.5-8a1 1 0 0 1 1-1H18a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-.796l-2.341 2.049a1 1 0 0 1-1.24.06l-2.894-2.066L6.614 9.29a1 1 0 1 1-1.228-1.578l4.5-3.5a1 1 0 0 1 1.195-.025l2.856 2.04L15.34 5h-.84a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
                                  </svg>
                                  Total: {bet.totalOdds}
                                </span>
                                {bet.balance && (
                                  <span className="flex text-sm font-medium px-2 py-1 rounded-lg shadow-lg bg-gray-800/80 text-gray-300">
                                    {bet.balanceType === 'units' ? 
                                      <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                                      </svg>                                     
                                      : 
                                      <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                                      </svg>
                                    }
                                    {bet.balance} 
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-400 tracking-wide">{bet.timestamp}</span>
                              {isStreamMode && bet.status !== 'pending' && (
                                <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
                                  bet.status === 'green'
                                    ? 'animate-pulse bg-green-900/20 text-green-400 border border-green-500/20'
                                    : 'animate-pulse bg-red-900/20 text-red-400 border border-red-500/20'
                                }`}>
                                  {bet.status.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
                {!isStreamMode && (
                  <div className="flex items-center gap-3 shrink-0">
                    {editingId === bet.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="p-3 rounded-xl hover:bg-green-600/20 text-green-500 hover:text-green-400 transition-all duration-300 border border-green-500/20 hover:border-green-500/30"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-3 rounded-xl hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        {bet.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => updateBetStatus(bet.id, 'green')}
                              className="p-3 rounded-xl hover:bg-green-600/20 text-green-500 hover:text-green-400 transition-all duration-300 border border-green-500/20 hover:border-green-500/30"
                            >
                              <Check size={20} />
                            </button>
                            <button
                              onClick={() => updateBetStatus(bet.id, 'red')}
                              className="p-3 rounded-xl hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                            >
                              <X size={20} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => updateBetStatus(bet.id, bet.status === 'green' ? 'green' : 'red')}
                            className={`h-[44px] flex items-center text-sm font-semibold px-4 rounded-xl shadow-md mr-3 cursor-pointer transition-all duration-300 ${
                              bet.status === 'green' 
                                ? 'text-green-400 bg-green-900/20 border border-green-500/20 hover:bg-green-900/30' 
                                : 'text-red-400 bg-red-900/20 border border-red-500/20 hover:bg-red-900/30'
                            }`}
                          >
                            {bet.status.toUpperCase()}
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(bet)}
                          className="p-3 rounded-xl hover:bg-blue-600/20 text-blue-500 hover:text-blue-400 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/30"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => deleteBet(bet.id)}
                          className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            {bets.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                <p className="text-lg">No open bets yet</p>
                <p className="text-sm mt-2">Click the + button to add one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;