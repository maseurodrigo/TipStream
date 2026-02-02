import React, { useMemo } from 'react';
import { Bet } from '../utils/types';

interface PnLTrackerProps {
  bets: Bet[];
  baseColor: string;
}

export const PnLTracker: React.FC<PnLTrackerProps> = ({ bets, baseColor }) => {
  const pnlData = useMemo(() => {
    if (bets.length === 0) {
      return null;
    }

    // Check if all bets have consistent balance type
    const firstBalanceType = bets[0].balanceType;
    const hasInconsistentTypes = bets.some(bet => bet.balanceType !== firstBalanceType);

    if (hasInconsistentTypes) {
      return null; // Don't show PnL if balance types are mixed
    }

    let totalStaked = 0;
    let totalReturns = 0;
    const balanceType = firstBalanceType;

    bets.forEach((bet) => {
      const balance = parseFloat(bet.balance);

      if (bet.type === 'single') {
        const odds = parseFloat(bet.odds);
        totalStaked += balance;

        if (bet.status === 'green') {
          totalReturns += balance * odds;
        } else if (bet.status === 'red') {
          // Red bet contributes nothing to returns
        } else {
          // Pending bet - we still count the stake against PnL
        }
      } else if (bet.type === 'multiple') {
        const totalOdds = parseFloat(bet.totalOdds);
        totalStaked += balance;

        if (bet.status === 'green') {
          totalReturns += balance * totalOdds;
        } else if (bet.status === 'red') {
          // Red bet contributes nothing to returns
        } else {
          // Pending bet - we still count the stake against PnL
        }
      }
    });

    const pnl = totalReturns - totalStaked;
    const isProfit = pnl >= 0;

    return {
      pnl,
      isProfit,
      balanceType,
      totalStaked,
      totalReturns,
    };
  }, [bets]);

  if (!pnlData) {
    return null;
  }

  const pnlColor = pnlData.isProfit ? '#10b981' : '#ef4444'; // green-500 : red-500
  const pnlSign = pnlData.pnl >= 0 ? '+' : '';

  const CurrencyIcon = pnlData.balanceType === 'units' ? (
    <svg className="w-[16px] h-[16px] ml-1.5 inline-block dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
    </svg>
  ) : (
    <svg className="w-[16px] h-[16px] ml-1.5 inline-block dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
    </svg>
  );

  return (
    <div
      className="mb-3 px-3 py-2 rounded-2xl backdrop-blur-md shadow-xl border-2 transition-all duration-300 hover:shadow-2xl"
      style={{
        backgroundColor: `${pnlColor}18`,
        borderColor: pnlColor,
        boxShadow: `0 8px 20px -3px rgba(0, 0, 0, 0.3), 0 4px 12px -2px ${pnlColor}20`
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col pl-1">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-tight mb-1">
            Session PnL
          </span>
          <span
            className="text-xl font-bold flex items-center transition-all duration-300 leading-tight"
            style={{ color: pnlColor }}
          >
            {pnlSign}{pnlData.pnl.toFixed(2)}
            {CurrencyIcon}
          </span>
        </div>
        <div className="flex flex-col items-end text-xs text-gray-300 gap-1 bg-gradient-to-br from-gray-800/50 to-gray-800/30 px-3 py-2 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">Staked:</span>
            <span className="font-bold text-white">{pnlData.totalStaked.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">Returns:</span>
            <span className="font-bold" style={{ color: pnlData.isProfit ? '#10b981' : '#f59e0b' }}>
              {pnlData.totalReturns.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
