"use client";

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

export default function BadgesAdmin() {
  const [status, setStatus] = useState('');
  const [badgeData, setBadgeData] = useState({
    id: '',
    name: '',
    description: '',
    icon: '',
    rarity: 'common',
    category: 'system',
    conditionType: 'pixels_placed',
    conditionMetric: 'count',
    conditionTarget: '10',
    conditionTimeWindowMs: '',
    animationType: ''
  });
  const [badges, setBadges] = useState<any[]>([]);

  const loadBadges = async () => {
    try {
      const data: any = await fetchApi('/admin/badges');
      if (data) {
        setBadges(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBadges();
  }, []);

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Creating badge...');
    try {
      await fetchApi('/admin/badges', {
        method: 'POST',
        body: JSON.stringify({
          ...badgeData,
          conditionTarget: parseInt(badgeData.conditionTarget, 10),
          conditionTimeWindowMs: badgeData.conditionTimeWindowMs ? parseInt(badgeData.conditionTimeWindowMs, 10) : undefined
        })
      });
      setStatus('Badge created successfully!');
      setBadgeData({
        id: '',
        name: '',
        description: '',
        icon: '',
        rarity: 'common',
        category: 'system',
        conditionType: 'pixels_placed',
        conditionMetric: 'count',
        conditionTarget: '10',
        conditionTimeWindowMs: '',
        animationType: ''
      });
      loadBadges();
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase mb-6">Manage Badges 🏆</h1>
      {status && (
        <div className="mb-6 bg-yellow-200 border-2 border-black p-4 font-bold shadow-[4px_4px_0_0_#000]">
          {status}
        </div>
      )}

      <section className="border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000] max-w-2xl">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Create Badge</h2>
        <form onSubmit={handleCreateBadge} className="flex flex-col gap-4 font-data text-sm">
          <input type="text" placeholder="Badge ID (e.g. first_pixel)" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={badgeData.id} onChange={e => setBadgeData({...badgeData, id: e.target.value})} />
          <input type="text" placeholder="Name (e.g. First Blood)" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={badgeData.name} onChange={e => setBadgeData({...badgeData, name: e.target.value})} />
          <textarea placeholder="Description" required className="border-2 border-black p-2 outline-none focus:bg-gray-100 h-20" value={badgeData.description} onChange={e => setBadgeData({...badgeData, description: e.target.value})} />
          <input type="text" placeholder="Icon (Emoji or URL) (e.g. ✨)" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={badgeData.icon} onChange={e => setBadgeData({...badgeData, icon: e.target.value})} />
          
          <div className="flex gap-4">
            <div className="flex-1">
              <span className="font-bold block mb-1">Rarity</span>
              <select className="w-full border-2 border-black p-2 outline-none focus:bg-gray-100" value={badgeData.rarity} onChange={e => setBadgeData({...badgeData, rarity: e.target.value})}>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
            <div className="flex-1">
              <span className="font-bold block mb-1">Category</span>
              <select className="w-full border-2 border-black p-2 outline-none focus:bg-gray-100" value={badgeData.category} onChange={e => setBadgeData({...badgeData, category: e.target.value})}>
                <option value="system">System</option>
                <option value="canvas">Canvas</option>
                <option value="music">Music</option>
                <option value="fandom">Fandom</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <span className="font-bold block mb-1">Condition Type</span>
              <input type="text" placeholder="e.g. pixels_placed" required className="w-full border-2 border-black p-2 outline-none focus:bg-gray-100" value={badgeData.conditionType} onChange={e => setBadgeData({...badgeData, conditionType: e.target.value})} />
            </div>
            <div className="flex-1">
              <span className="font-bold block mb-1">Condition Metric</span>
              <input type="text" placeholder="e.g. count" required className="w-full border-2 border-black p-2 outline-none focus:bg-gray-100" value={badgeData.conditionMetric} onChange={e => setBadgeData({...badgeData, conditionMetric: e.target.value})} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <span className="font-bold block mb-1">Condition Target</span>
              <input type="number" placeholder="e.g. 1" required className="w-full border-2 border-black p-2 outline-none focus:bg-gray-100" value={badgeData.conditionTarget} onChange={e => setBadgeData({...badgeData, conditionTarget: e.target.value})} />
            </div>
            <div className="flex-1">
              <span className="font-bold block mb-1">Time Window (ms) [Optional]</span>
              <input type="number" placeholder="Leave empty if lifetime" className="w-full border-2 border-black p-2 outline-none focus:bg-gray-100" value={badgeData.conditionTimeWindowMs} onChange={e => setBadgeData({...badgeData, conditionTimeWindowMs: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="bg-[var(--color-pw-vibrant-blue)] text-white border-2 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none mt-2 text-lg">Create Badge</button>
        </form>
      </section>

      <section className="mt-8 border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000]">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Existing Badges</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-data text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-pw-neon-lime)] border-b-2 border-black">
                <th className="p-2 border-r-2 border-black">Icon</th>
                <th className="p-2 border-r-2 border-black">ID</th>
                <th className="p-2 border-r-2 border-black">Name</th>
                <th className="p-2 border-r-2 border-black">Rarity</th>
                <th className="p-2 border-r-2 border-black">Target</th>
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {badges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">No badges found.</td>
                </tr>
              ) : (
                badges.map((badge: any) => (
                  <tr key={badge.id} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="p-2 border-r border-gray-300 text-2xl text-center">{badge.icon}</td>
                    <td className="p-2 border-r border-gray-300 font-bold">{badge.id}</td>
                    <td className="p-2 border-r border-gray-300">{badge.name}</td>
                    <td className="p-2 border-r border-gray-300 uppercase">{badge.rarity}</td>
                    <td className="p-2 border-r border-gray-300 text-xs font-mono">{badge.conditionType} &ge; {badge.conditionTarget}</td>
                    <td className="p-2">{new Date(badge.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
