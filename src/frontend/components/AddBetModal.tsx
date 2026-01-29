import React from 'react';
import { X, Plus } from 'lucide-react';
import { Input, Select, Option } from "@material-tailwind/react";
import { BettingSite } from '../utils/types';
import { UseBetFormReturn } from '../hooks/useBetForm';
import { calculateTotalOdds } from '../utils/helpers';

interface AddBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  formState: UseBetFormReturn;
  onSubmit: (e: React.FormEvent) => void;
  bettingSites: BettingSite[];
  baseColor: string;
}

export const AddBetModal: React.FC<AddBetModalProps> = ({
  isOpen,
  onClose,
  formState,
  onSubmit,
  bettingSites,
  baseColor,
}) => {
  if (!isOpen) return null;

  const {
    betType,
    setBetType,
    newTip,
    setNewTip,
    newTeams,
    setNewTeams,
    newOdds,
    setNewOdds,
    newSite,
    setNewSite,
    newBalance,
    setNewBalance,
    newBalanceType,
    setNewBalanceType,
    multipleTips,
    addTip,
    removeTip,
    updateMultipleTip,
    handleOddsChange,
    handleBalanceChange,
  } = formState;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50 p-4">
      <div
        className="bg-gray-900/95 rounded-3xl w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-all duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-8 pb-6 flex-shrink-0">
          <h2 className="text-3xl font-bold text-white tracking-tight">Add New Bet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-8 flex-shrink-0">
            <div className="flex border-b border-gray-700/50">
              <button
                type="button"
                onClick={() => setBetType('single')}
                className={`flex-1 py-3 px-6 font-medium transition-all duration-300 relative ${
                  betType === 'single'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Single Bet
                {betType === 'single' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                    style={{ backgroundColor: baseColor }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setBetType('multiple')}
                className={`flex-1 py-3 px-6 font-medium transition-all duration-300 relative ${
                  betType === 'multiple'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Multiple Bet
                {betType === 'multiple' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                    style={{ backgroundColor: baseColor }}
                  />
                )}
              </button>
            </div>
          </div>

          <div className="px-8 py-6 flex-1 overflow-y-auto max-h-[60vh]">
            {betType === 'single' ? (
              <div className="space-y-6">
                <div>
                  <Input
                    type="text"
                    value={newTip}
                    onChange={(e) => setNewTip(e.target.value)}
                    label="Betting tip"
                    variant="outlined"
                    color="blue"
                    size="lg"
                    className="text-white !text-base"
                    containerProps={{ className: "min-w-0" }}
                    labelProps={{
                      className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                    }}
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    value={newTeams}
                    onChange={(e) => setNewTeams(e.target.value)}
                    label="Teams (e.g., Team A vs Team B)"
                    variant="outlined"
                    color="blue"
                    size="lg"
                    className="text-white !text-base"
                    containerProps={{ className: "min-w-0" }}
                    labelProps={{
                      className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                    }}
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={newOdds}
                      onChange={(e) => handleOddsChange(e.target.value)}
                      label="Odds (e.g., 1.75)"
                      variant="outlined"
                      color="blue"
                      size="lg"
                      className="text-white !text-base"
                      containerProps={{ className: "min-w-0" }}
                      labelProps={{
                        className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                      }}
                      crossOrigin={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={newBalance}
                        onChange={(e) => handleBalanceChange(e.target.value)}
                        label={newBalanceType === 'units' ? "Units" : "Amount"}
                        variant="outlined"
                        color="blue"
                        size="lg"
                        className="text-white !text-base"
                        containerProps={{ className: "min-w-0" }}
                        labelProps={{
                          className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                        }}
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setNewBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                        className="px-4 rounded-xl bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                        title={newBalanceType === 'units' ? 'Switch to Money' : 'Switch to Units'}
                      >
                        {newBalanceType === 'units' ? (
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <Select
                    value={newSite}
                    onChange={(val) => setNewSite(val as string)}
                    label="Betting Site"
                    variant="outlined"
                    color="blue"
                    size="lg"
                    className="text-white !text-base"
                    containerProps={{ className: "min-w-0" }}
                    labelProps={{
                      className: "!text-gray-400 peer-focus:!text-blue-400"
                    }}
                    menuProps={{
                      className: "bg-gray-800 border border-gray-700 max-h-40 overflow-y-auto"
                    }}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {bettingSites.map(site => (
                      <Option key={site.value} value={site.value} className="text-white hover:bg-gray-700">
                        {site.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            ) : (
            <div className="space-y-4">
              {multipleTips.map((tip, index) => (
                <div key={index} className="flex gap-2 items-stretch w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 flex-wrap">
                      <div className="flex-[2] min-w-[200px] space-y-2">
                        <Input
                          type="text"
                          value={tip.tip}
                          onChange={(e) => updateMultipleTip(index, 'tip', e.target.value)}
                          label={`Tip ${index + 1}`}
                          variant="outlined"
                          color="blue"
                          className="text-white !text-base"
                          containerProps={{ className: "min-w-0" }}
                          labelProps={{
                            className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                          }}
                          crossOrigin={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                        <Input
                          type="text"
                          value={tip.teams}
                          onChange={(e) => updateMultipleTip(index, 'teams', e.target.value)}
                          label="Teams (e.g., Team A vs Team B)"
                          variant="outlined"
                          color="blue"
                          className="text-white !text-base"
                          containerProps={{ className: "min-w-0" }}
                          labelProps={{
                            className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                          }}
                          crossOrigin={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </div>
                      <div className="flex-1 min-w-[120px] self-start pt-1">
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={tip.odds}
                          onChange={(e) => updateMultipleTip(index, 'odds', e.target.value)}
                          label="Odds"
                          variant="outlined"
                          color="blue"
                          className="text-white !text-base"
                          containerProps={{ className: "min-w-0" }}
                          labelProps={{
                            className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                          }}
                          crossOrigin={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </div>
                    </div>
                  </div>
                  {multipleTips.length > 1 && (
                    <div className="flex-shrink-0 flex">
                      <button
                        type="button"
                        onClick={() => removeTip(index)}
                        className="h-full px-3 rounded-xl hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30 flex items-center justify-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
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
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={newBalance}
                      onChange={(e) => handleBalanceChange(e.target.value)}
                      label={newBalanceType === 'units' ? "Units" : "Amount"}
                      variant="outlined"
                      color="blue"
                      className="text-white !text-base"
                      containerProps={{ className: "min-w-0" }}
                      labelProps={{
                        className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                      }}
                      crossOrigin={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setNewBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                      className="px-4 rounded-xl bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                      title={newBalanceType === 'units' ? 'Switch to Money' : 'Switch to Units'}
                    >
                      {newBalanceType === 'units' ? (
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div>
                    <Select
                      value={newSite}
                      onChange={(val) => setNewSite(val as string)}
                      label="Betting Site"
                      variant="outlined"
                      color="blue"
                      className="text-white !text-base"
                      containerProps={{ className: "min-w-0" }}
                      labelProps={{
                        className: "!text-gray-400 peer-focus:!text-blue-400"
                      }}
                      menuProps={{
                        className: "bg-gray-800 border border-gray-700 max-h-60 overflow-y-auto mt-2"
                      }}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {bettingSites.map(site => (
                        <Option key={site.value} value={site.value} className="text-white hover:bg-gray-700">
                          {site.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>

          <div className="px-8 pb-8 flex-shrink-0">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl transition-all duration-300 text-white font-medium shadow-lg hover:shadow-2xl text-lg"
              style={{ backgroundColor: baseColor }}
            >
              Add {betType === 'single' ? 'Single Bet' : 'Multiple Bet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
