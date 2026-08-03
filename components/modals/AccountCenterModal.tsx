"use client";

import React, { useState } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { Settings, LogOut, Download, Lock, CheckCircle2, Shield, Bell, X } from 'lucide-react';

export const AccountCenterModal: React.FC = () => {
  const { isAccountModalOpen, setIsAccountModalOpen, userProfile } = useMovieDiary();

  // Settings toggles & logout confirmation state
  const [hdPosters, setHdPosters] = useState(true);
  const [spoilerGuard, setSpoilerGuard] = useState(true);
  const [premiereAlerts, setPremiereAlerts] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  if (!isAccountModalOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Header Bar */}
          <div className="px-5 py-4 bg-[var(--surface-subtle)] border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-honey)] text-[var(--accent-honey-text)] flex items-center justify-center shadow-xs">
                <Settings className="w-4.5 h-4.5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)] font-serif uppercase tracking-tight">
                  User Dashboard & Account Center
                </h3>
                <span className="text-[10px] font-extrabold text-[var(--text-muted)] tracking-wider block">
                  Filmoire VIP Vault Controls & Preferences
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsAccountModalOpen(false)}
              className="theme-x-btn w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer shrink-0"
              title="Close Account Center"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 min-h-0 no-scrollbar">
            
            {/* Account Status & Vault Overview */}
            <div className="p-5 rounded-3xl bg-linear-to-br from-[var(--surface-subtle)] via-[var(--surface-card)] to-[var(--surface-subtle)] border-2 border-[var(--border-color)] shadow-md space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-bl from-rose-500/15 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-3 relative z-10 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500">
                    <Shield className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[var(--text-primary)] uppercase tracking-wide">
                      Filmoire Vault & Account Status
                    </h4>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] block">
                      End-to-End Encrypted Physical Cinema Archive
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-2xs">
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                  <span>VIP Auteur Active</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
                <div className="p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] shadow-inner">
                  <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase block mb-0.5">Registered Email</span>
                  <span className="font-mono text-xs font-black text-[var(--text-primary)] truncate block">{userProfile.handle ? `${userProfile.handle.replace('@', '')}@filmoire.com` : 'fourth.sheena@filmoire.com'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] shadow-inner">
                  <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase block mb-0.5">Cloud Sync Status</span>
                  <span className="font-bold text-xs text-[var(--accent-sakura-text)] flex items-center gap-1 truncate block">
                    <Lock className="w-3 h-3 text-amber-500 inline shrink-0" />
                    <span>Vault 100% Synced</span>
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] shadow-inner">
                  <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase block mb-0.5">Member Since</span>
                  <span className="font-sans text-xs font-black text-[var(--text-primary)] truncate block">October 2024 (Founders)</span>
                </div>
              </div>
            </div>

            {/* Interactive Dashboard Preferences */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-500 stroke-[2.5]" />
                <span>Dashboard Preferences & Controls</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => setHdPosters(!hdPosters)}
                  className="p-4 rounded-2xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-center justify-between gap-3 cursor-pointer transition-all shadow-xs group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-black text-xs text-[var(--text-primary)] block">4K High-Def Artwork</span>
                    <span className="text-[11px] font-medium text-[var(--text-secondary)] block truncate mt-0.5">Fetch cinema posters in master quality</span>
                  </div>
                  <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${hdPosters ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-700'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${hdPosters ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => setSpoilerGuard(!spoilerGuard)}
                  className="p-4 rounded-2xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-center justify-between gap-3 cursor-pointer transition-all shadow-xs group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-black text-xs text-[var(--text-primary)] block">Spoiler Guard 2.0</span>
                    <span className="text-[11px] font-medium text-[var(--text-secondary)] block truncate mt-0.5">Auto-mask storyline plot reveals in reviews</span>
                  </div>
                  <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${spoilerGuard ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-700'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${spoilerGuard ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => setPremiereAlerts(!premiereAlerts)}
                  className="p-4 rounded-2xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-center justify-between gap-3 cursor-pointer transition-all shadow-xs sm:col-span-2 group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-black text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-rose-500" />
                      <span>Watchlist Premiere Alerts</span>
                    </span>
                    <span className="text-[11px] font-medium text-[var(--text-secondary)] block mt-0.5">Notify when bookmarked films arrive on streaming platforms or Blu-ray</span>
                  </div>
                  <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${premiereAlerts ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-700'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${premiereAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Management & Session Controls */}
            <div className="p-5 rounded-3xl bg-linear-to-r from-slate-900/5 via-rose-500/5 to-slate-900/5 border-2 border-[var(--border-color)] space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h5 className="font-black text-sm text-[var(--text-primary)]">Data Export & Backup</h5>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">
                    Download a full JSON copy of your diary logs, ratings, and custom movie collections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Your complete physical movie diary has been packaged and exported as filmoire-archive.json!')}
                  className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm transition-all cursor-pointer shrink-0 flex items-center gap-1.5 hover:scale-102"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" />
                  <span>Export Archive</span>
                </button>
              </div>

              <div className="border-t border-[var(--border-color)]/70 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h5 className="font-black text-sm text-rose-600 dark:text-rose-400">Active Session & Security</h5>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">
                    Sign out of your Filmoire account across this device and secure your local vault.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all cursor-pointer shrink-0 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  <span>Log Out of Filmoire</span>
                </button>
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3.5 bg-[var(--surface-subtle)] border-t border-[var(--border-color)] flex items-center justify-end shrink-0">
            <button
              onClick={() => setIsAccountModalOpen(false)}
              className="px-6 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-md hover:scale-105 transition-all cursor-pointer border border-[var(--border-color)]/50"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* LOG OUT CONFIRMATION MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-3xl p-6 shadow-2xl space-y-5 text-center relative">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-inner">
              <LogOut className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[var(--text-primary)] font-serif">
                Sign Out of Filmoire?
              </h3>
              <p className="text-xs font-semibold text-[var(--text-secondary)] leading-relaxed">
                Your movie diary logs and customized profile have been securely synchronized to the cloud vault. Are you ready to close the notebook?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2 border-t border-[var(--border-color)]/70">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)] transition-all cursor-pointer"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  setIsAccountModalOpen(false);
                  alert("You have successfully signed out of Filmoire. See you at the next screening!");
                }}
                className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer hover:scale-102"
              >
                Confirm Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
