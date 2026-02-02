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
        <div className="flex justify-between items-center p-8 pb-6 flex-shrink-0 border-b border-gray-800/50">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-1">Add New Bet</h2>
            <p className="text-sm text-gray-400">Enter your betting information below</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-200 p-2.5 hover:bg-gray-800/50 rounded-xl group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-8 pt-6 flex-shrink-0">
            <div className="flex gap-3 p-1.5 bg-gray-800/40 rounded-xl border border-gray-700/50">
              <button
                type="button"
                onClick={() => setBetType('single')}
                className={`flex-1 py-3 px-6 font-semibold transition-all duration-200 rounded-lg relative ${
                  betType === 'single'
                    ? 'text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                }`}
                style={betType === 'single' ? {
                  backgroundColor: baseColor,
                  boxShadow: `0 4px 12px -2px ${baseColor}50`
                } : {}}
              >
                Single Bet
              </button>
              <button
                type="button"
                onClick={() => setBetType('multiple')}
                className={`flex-1 py-3 px-6 font-semibold transition-all duration-200 rounded-lg relative ${
                  betType === 'multiple'
                    ? 'text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                }`}
                style={betType === 'multiple' ? {
                  backgroundColor: baseColor,
                  boxShadow: `0 4px 12px -2px ${baseColor}50`
                } : {}}
              >
                Multiple Bet
              </button>
            </div>
          </div>

          <div className="px-8 py-6 flex-1 overflow-y-auto max-h-[60vh]">
            {betType === 'single' ? (
              <div className="space-y-4">
                {/* Bet Information Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 shadow-lg">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Bet Information
                  </h3>
                  <div className="space-y-4">
                    <div className="group">
                      <Input
                        type="text"
                        value={newTip}
                        onChange={(e) => setNewTip(e.target.value)}
                        label="Betting Tip"
                        variant="outlined"
                        color="blue"
                        size="lg"
                        className="text-white !text-base !font-medium"
                        containerProps={{ className: "min-w-0" }}
                        labelProps={{
                          className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                        }}
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    </div>
                    <div className="group">
                      <Input
                        type="text"
                        value={newTeams}
                        onChange={(e) => setNewTeams(e.target.value)}
                        label="Match Teams"
                        variant="outlined"
                        color="blue"
                        size="lg"
                        className="text-white !text-base !font-medium"
                        containerProps={{ className: "min-w-0" }}
                        labelProps={{
                          className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                        }}
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                      <p className="mt-1.5 text-xs text-gray-500 ml-3">e.g., Team A vs Team B</p>
                    </div>
                  </div>
                </div>

                {/* Odds & Stake Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 shadow-lg">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Odds & Stake
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={newOdds}
                        onChange={(e) => handleOddsChange(e.target.value)}
                        label="Odds"
                        variant="outlined"
                        color="blue"
                        size="lg"
                        className="text-white !text-base !font-medium"
                        containerProps={{ className: "min-w-0" }}
                        labelProps={{
                          className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                        }}
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                      <p className="mt-1.5 text-xs text-gray-500 ml-3">e.g., 1.95</p>
                    </div>
                    <div className="group">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            type="text"
                            inputMode="decimal"
                            value={newBalance}
                            onChange={(e) => handleBalanceChange(e.target.value)}
                            label={newBalanceType === 'units' ? "Units" : "Amount"}
                            variant="outlined"
                            color="blue"
                            size="lg"
                            className="text-white !text-base !font-medium"
                            containerProps={{ className: "min-w-0" }}
                            labelProps={{
                              className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                            }}
                            crossOrigin={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                          className="px-4 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 text-blue-400 hover:text-blue-300 border border-blue-500/40 hover:bg-blue-500/20 hover:border-blue-400/60 transition-all duration-200 shadow-lg hover:shadow-blue-500/5 ring-1 ring-white/5"
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
                      <p className="mt-1.5 text-xs text-gray-500 ml-3">
                        {newBalanceType === 'units' ? 'e.g., 1.5' : 'e.g., 25'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Betting Site Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 shadow-lg">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Betting Platform
                  </h3>
                  <div className="group">
                    <Select
                      value={newSite}
                      onChange={(val) => setNewSite(val as string)}
                      label="Betting Site"
                      variant="outlined"
                      color="blue"
                      size="lg"
                      className="text-white !text-base !font-medium"
                      containerProps={{ className: "min-w-0" }}
                      labelProps={{
                        className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-focus:!font-semibold"
                      }}
                      menuProps={{
                        className: "bg-gray-800 border border-gray-700 max-h-40 overflow-y-auto shadow-xl"
                      }}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {bettingSites.map(site => (
                        <Option key={site.value} value={site.value} className="text-white hover:bg-gray-700 !font-medium">
                          {site.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
            <div className="space-y-5">
              {multipleTips.map((tip, index) => (
                <div key={index} className="relative group/card">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-800/20 border border-gray-700/50 hover:border-gray-600/60 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <div className="flex gap-4 items-start w-full">
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-4 flex-wrap">
                          <div className="flex-[2] min-w-[200px] space-y-4">
                            <div className="group">
                              <Input
                                type="text"
                                value={tip.tip}
                                onChange={(e) => updateMultipleTip(index, 'tip', e.target.value)}
                                label={`Tip ${index + 1}`}
                                variant="outlined"
                                color="blue"
                                className="text-white !text-base !font-medium"
                                containerProps={{ className: "min-w-0" }}
                                labelProps={{
                                  className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                                }}
                                crossOrigin={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              />
                            </div>
                            <div className="group">
                              <Input
                                type="text"
                                value={tip.teams}
                                onChange={(e) => updateMultipleTip(index, 'teams', e.target.value)}
                                label="Match Teams"
                                variant="outlined"
                                color="blue"
                                className="text-white !text-base !font-medium"
                                containerProps={{ className: "min-w-0" }}
                                labelProps={{
                                  className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                                }}
                                crossOrigin={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              />
                              <p className="mt-1.5 text-xs text-gray-500 ml-3">e.g., Team A vs Team B</p>
                            </div>
                          </div>
                          <div className="flex-1 min-w-[120px] self-start group">
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={tip.odds}
                              onChange={(e) => updateMultipleTip(index, 'odds', e.target.value)}
                              label="Odds"
                              variant="outlined"
                              color="blue"
                              className="text-white !text-base !font-medium"
                              containerProps={{ className: "min-w-0" }}
                              labelProps={{
                                className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                              }}
                              crossOrigin={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            />
                            <p className="mt-1.5 text-xs text-gray-500 ml-3">e.g., 1.95</p>
                          </div>
                        </div>
                      </div>
                      {multipleTips.length > 1 && (
                        <div className="flex-shrink-0 flex">
                          <button
                            type="button"
                            onClick={() => removeTip(index)}
                            className="px-3 py-3 rounded-xl hover:bg-red-600/25 text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/40 hover:border-red-400/60 flex items-center justify-center shadow-lg hover:shadow-red-500/5 group bg-gradient-to-br from-gray-800/50 to-gray-900/50 ring-1 ring-white/5"
                            title="Remove this tip"
                          >
                            <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addTip()}
                className="w-full py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/15 transition-all duration-200 border-2 border-dashed border-blue-500/30 hover:border-blue-400/50 flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
                <span>Add Another Tip</span>
              </button>
              {multipleTips.length > 1 && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-gray-800/40 to-gray-800/20 border border-blue-500/30 shadow-xl">
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-blue-400/20">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Total Combined Odds</h3>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30">
                      <p className="text-base text-white font-bold tracking-tight">{calculateTotalOdds(multipleTips)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                      <div className="group">
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={newBalance}
                          onChange={(e) => handleBalanceChange(e.target.value)}
                          label={newBalanceType === 'units' ? "Units" : "Amount"}
                          variant="outlined"
                          color="blue"
                          className="text-white !text-base !font-medium"
                          containerProps={{ className: "min-w-0" }}
                          labelProps={{
                            className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-500 peer-focus:!font-semibold"
                          }}
                          crossOrigin={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                        <p className="mt-1.5 text-xs text-gray-500 ml-3">
                          {newBalanceType === 'units' ? 'e.g., 1.5' : 'e.g., 25'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                        className="px-3.5 py-2.5 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 text-blue-400 hover:text-blue-300 border border-blue-500/40 hover:bg-blue-500/20 hover:border-blue-400/60 transition-all duration-200 shadow-lg hover:shadow-blue-500/5 ring-1 ring-white/5"
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
                    <div className="group">
                      <Select
                        value={newSite}
                        onChange={(val) => setNewSite(val as string)}
                        label="Betting Site"
                        variant="outlined"
                        color="blue"
                        className="text-white !text-base !font-medium"
                        containerProps={{ className: "min-w-0" }}
                        labelProps={{
                          className: "!text-gray-400 !font-medium peer-focus:!text-blue-400 peer-focus:!font-semibold"
                        }}
                        menuProps={{
                          className: "bg-gray-800 border border-gray-700 max-h-60 overflow-y-auto shadow-xl"
                        }}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {bettingSites.map(site => (
                          <Option key={site.value} value={site.value} className="text-white hover:bg-gray-700 !font-medium">
                            {site.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>

          <div className="px-8 pb-8 flex-shrink-0">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl transition-all duration-200 text-white font-semibold text-base tracking-wide hover:scale-[1.01] active:scale-[0.99] hover:brightness-110"
              style={{
                backgroundColor: baseColor,
                boxShadow: `0 8px 20px -3px rgba(0, 0, 0, 0.3), 0 4px 12px -2px ${baseColor}40, 0 2px 6px -1px rgba(0, 0, 0, 0.25)`
              }}
            >
              Add {betType === 'single' ? 'Single Bet' : 'Multiple Bet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
