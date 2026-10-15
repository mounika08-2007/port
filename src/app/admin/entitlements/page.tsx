'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Loader2,
  CheckCircle2,
  CreditCard,
  Tag,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import type { UserEntitlement } from '@/types/database.types';

export default function AdminEntitlementsPage() {
  const [entitlements, setEntitlements] = useState<UserEntitlement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntitlements = async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('user_entitlements')
        .select('*')
        .order('activated_at', { ascending: false });

      if (data) {
        setEntitlements(data as UserEntitlement[]);
      }
    } catch (err) {
      console.error('Failed to load user entitlements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntitlements();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 size={32} className="animate-spin text-[#137cc2] mx-auto mb-3" />
        <p className="text-xs text-[#536471]">Loading entitlement records from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e1e8ed] gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
            <ShieldCheck size={22} className="text-[#137cc2]" /> Plan Entitlements &amp; Audit Ledger
          </h1>
          <p className="text-xs text-[#536471] mt-1">
            Real-time audit log of all activated theme packs, demo entitlements, and transaction references.
          </p>
        </div>

        <button
          onClick={loadEntitlements}
          className="px-3.5 py-2 rounded-xl border border-[#d8e7f0] bg-white hover:bg-[#f1f5f9] text-xs font-semibold text-[#0f1419] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Entitlements Table */}
      <div className="rounded-3xl bg-white border border-[#d8e7f0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] border-b border-[#e1e8ed] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Transaction Ref</th>
                <th className="py-3.5 px-4">Theme Pack</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Listed / Paid</th>
                <th className="py-3.5 px-5">Activated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {entitlements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#536471]">
                    No entitlement records found yet. Entitlements appear here upon plan activation.
                  </td>
                </tr>
              ) : (
                entitlements.map((e, idx) => (
                  <tr key={e.id || idx} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs font-bold text-[#137cc2] block">
                        {e.transaction_ref}
                      </span>
                      <span className="text-[10px] text-[#64748b]">
                        User: {e.user_id?.substring(0, 8)}...
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#0f1419]">
                      <span className="px-2.5 py-1 rounded-lg bg-[#E3ECF6] text-[#137cc2] text-xs font-mono">
                        {e.pack_slug}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] font-bold text-[10px] uppercase border border-[#10b981]/30">
                        {e.status}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-[#64748b] line-through text-[11px] block">
                        ₹{e.listed_price_inr}
                      </span>
                      <strong className="text-xs font-bold text-[#10b981]">
                        ₹{e.amount_paid_inr} (Demo Pass)
                      </strong>
                    </td>

                    <td className="py-4 px-5 text-[#536471] text-[11px]">
                      {e.activated_at
                        ? new Date(e.activated_at).toLocaleString()
                        : 'Recently'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
