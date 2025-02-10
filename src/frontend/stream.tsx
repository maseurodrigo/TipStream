import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from "@material-tailwind/react";
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

export default function Viewer() {
  const { sessionId } = useParams(); // Retrieve the session ID from the URL  
  const [showHeader, setShowHeader] = useState(true);
  const [carouselMode, setCarouselMode] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('Live Bets');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSize, setLogoSize] = useState(2);
  const [baseColor, setBaseColor] = useState('#2D3748');
  const [opacity, setOpacity] = useState(0.8);
  const [maxBetsPCol, setMaxBetsPCol] = useState(8);
  const [maxCarouselWidth, setMaxCarouselWidth] = useState(95);
  const [carouselTimer, setCarouselTimer] = useState(8);
  const [bets, setBets] = useState<Bet[]>([]);

  // Create a ref to store the Socket.io client instance
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  useEffect(() => {
    if (!sessionId) return; // Wait until the session ID is available

    // Initialize Socket.io client using the server URL from environment variables
    socketRef.current = io(import.meta.env.VITE_SOCKET_SERVER_URL);

    // Join the session room
    socketRef.current?.emit('joinRoom', sessionId);

    // Listen for updates sent to the session
    socketRef.current?.on('receive-update', (updates) => {
      if (updates.showHeader !== undefined) setShowHeader(updates.showHeader);
      if (updates.carouselMode !== undefined) setCarouselMode(updates.carouselMode);
      if (updates.headerTitle !== undefined) setHeaderTitle(updates.headerTitle);
      if (updates.logoUrl !== undefined) setLogoUrl(updates.logoUrl);
      if (updates.logoSize !== undefined) setLogoSize(updates.logoSize);
      if (updates.baseColor !== undefined) setBaseColor(updates.baseColor);
      if (updates.opacity !== undefined) setOpacity(updates.opacity);
      if (updates.maxBetsPCol !== undefined) setMaxBetsPCol(updates.maxBetsPCol);
      if (updates.maxCarouselWidth !== undefined) setMaxCarouselWidth(updates.maxCarouselWidth);
      if (updates.carouselTimer !== undefined) setCarouselTimer(updates.carouselTimer);
      if (updates.bets !== undefined) setBets(updates.bets);
    });

    // Cleanup listeners when the component unmounts or session ID changes
    return () => { 
      socketRef.current?.off('receive-update');
      socketRef.current?.emit('leaveRoom', sessionId);
      socketRef.current?.disconnect();
    };

  }, [sessionId]); // Re-run the effect if the session ID changes

  const getColorWithOpacity = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Function to chunk bets into groups of maxBetsPCol
  const chunkArray = (arr: any[], size: number) => {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  // Chunk the bets into columns
  const betColumns = chunkArray(bets, maxBetsPCol);

  return <div className={`pointer-events-auto inline-block fixed top-6 left-6 min-w-80 max-w-7xl z-10`} style={{ fontFamily: "SpaceGrotesk" }}>
    <div 
      className="p-2 rounded-lg backdrop-blur-lg shadow-[0_0_35px_rgba(0,0,0,0.2)] hover:shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-shadow duration-300" 
      style={{ 
        backgroundColor: getColorWithOpacity(baseColor, 0.4)
      }}>
      {showHeader && (
        <div 
          className="p-6 mb-2 rounded-lg shadow-lg" 
          style={{ 
            backgroundColor: getColorWithOpacity(baseColor, opacity)
          }}>
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
            <h1 className="text-3xl font-bold text-center text-white drop-shadow-lg tracking-tight">{headerTitle}</h1>
          </div>
        </div>
      )}
      {carouselMode ? (
        <div className="max-h-[90vh]" style={{ maxWidth: `${maxCarouselWidth}vw` }}>
          <Carousel
            autoplay={true}
            autoplayDelay={carouselTimer * 1000}
            loop={true}
            transition={{ type: "tween", duration: 0.5 }}
            className="flex overflow-hidden rounded-lg"
            prevArrow={({ handlePrev }) => <span className="hidden" onClick={handlePrev} />}
            nextArrow={({ handleNext }) => <span className="hidden" onClick={handleNext} />}
            navigation={() => <div className="hidden" />}>
            {bets.map((bet) => (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                key={bet.id}
                className={`bg-gray-900/80 p-6 rounded-lg shadow-lg flex items-center gap-4`}>
                <div className="flex-1 min-w-0">
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
                        {bet.status !== 'pending' && (
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
                          {bet.status !== 'pending' && (
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
                </div>
              </motion.div>
            ))}
          </Carousel>
          {bets.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              <p className="text-lg">No open bets yet</p>
              <p className="text-sm mt-2">Wait until some suggestions are added!</p>
            </div>
          )}
        </div>
      ): (
        <div className="grid gap-2 justify-center max-w-[90vw] max-h-[90vh] grid-flow-col auto-cols-max">
          {betColumns.map((column: Bet[], columnIndex: number) => (
            <div key={columnIndex} className="flex flex-col space-y-2 min-w-80">
              {column.map((bet) => (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  key={bet.id}
                  className={`bg-gray-900/80 p-6 rounded-lg shadow-lg flex items-center gap-4`}>
                  <div className="flex-1 min-w-0">
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
                          {bet.status !== 'pending' && (
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
                            {bet.status !== 'pending' && (
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
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
          {bets.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              <p className="text-lg">No open bets yet</p>
              <p className="text-sm mt-2">Wait until some suggestions are added!</p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>;
}