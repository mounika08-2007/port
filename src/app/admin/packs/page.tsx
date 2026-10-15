'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Save,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { DEFAULT_THEME_PACKS } from '@/lib/themePacks';
import type { ThemePack } from '@/types/database.types';

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<ThemePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<number | null>(null);

  const loadPacks = async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('theme_packs')
        .select('*')
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        setPacks(
          data.map((item) => ({
            ...item,
            features: Array.isArray(item.features)
              ? item.features
              : typeof item.features === 'string'
              ? JSON.parse(item.features)
              : [],
          }))
        );
      } else {
        setPacks(DEFAULT_THEME_PACKS);
      }
    } catch {
      setPacks(DEFAULT_THEME_PACKS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, []);

  const handleUpdatePrice = async (index: number) => {
    setSavingIndex(index);
    const pack = packs[index];
    const supabase = createClient();

    try {
      await supabase
        .from('theme_packs')
        .upsert({
          slug: pack.slug,
          name: pack.name,
          tagline: pack.tagline,
          listed_price: Number(pack.listed_price),
          currency: pack.currency || 'INR',
          is_active: pack.is_active,
          features: pack.features,
          updated_at: new Date().toISOString(),
        });

      setSaveSuccess(index);
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      console.error('Failed to update pack in Supabase:', err);
    } finally {
      setSavingIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 size={32} className="animate-spin text-[#137cc2] mx-auto mb-3" />
        <p className="text-xs text-[#536471]">Loading theme packs catalog from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e1e8ed] gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
            <Tag size={22} className="text-[#137cc2]" /> Theme Packs &amp; Pricing Management
          </h1>
          <p className="text-xs text-[#536471] mt-1">
            Configure catalog listed prices, feature descriptions, and pack availability in real-time.
          </p>
        </div>

        <button
          onClick={loadPacks}
          className="px-3.5 py-2 rounded-xl border border-[#d8e7f0] bg-white hover:bg-[#f1f5f9] text-xs font-semibold text-[#0f1419] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Packs Grid */}
      <div className="grid gap-6">
        {packs.map((pack, idx) => (
          <div
            key={pack.slug}
            className="p-6 rounded-3xl bg-white border border-[#d8e7f0] shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#137cc2] bg-[#E3ECF6] px-2 py-0.5 rounded-md uppercase">
                  {pack.slug}
                </span>
                <h3 className="text-lg font-bold text-[#0f1419] mt-1">{pack.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#536471]">Status:</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...packs];
                    updated[idx].is_active = !updated[idx].is_active;
                    setPacks(updated);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    pack.is_active
                      ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                      : 'bg-[#f1f5f9] text-[#64748b] border border-[#cbd5e1]'
                  }`}
                >
                  {pack.is_active ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                  Tagline / Description
                </label>
                <textarea
                  value={pack.tagline}
                  rows={2}
                  onChange={(e) => {
                    const updated = [...packs];
                    updated[idx].tagline = e.target.value;
                    setPacks(updated);
                  }}
                  className="glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f1419] mb-1">
                  Catalog Listed Price (₹ INR)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#536471]">₹</span>
                  <input
                    type="number"
                    value={pack.listed_price}
                    onChange={(e) => {
                      const updated = [...packs];
                      updated[idx].listed_price = Number(e.target.value);
                      setPacks(updated);
                    }}
                    className="glass-input text-sm font-bold"
                  />
                </div>
                <span className="text-[10px] text-[#64748b] mt-1 block">
                  Changes update the public catalog and checkout instantly.
                </span>
              </div>
            </div>

            {/* Save Button for this pack */}
            <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
              {saveSuccess === idx ? (
                <span className="text-xs font-semibold text-[#10b981] flex items-center gap-1">
                  <CheckCircle2 size={15} /> Price and settings saved to Supabase!
                </span>
              ) : (
                <span className="text-xs text-[#64748b]">
                  {pack.features.length} features configured
                </span>
              )}

              <button
                type="button"
                onClick={() => handleUpdatePrice(idx)}
                disabled={savingIndex === idx}
                className="px-4 py-2 rounded-xl bg-[#137cc2] hover:bg-[#0f66a0] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {savingIndex === idx ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
