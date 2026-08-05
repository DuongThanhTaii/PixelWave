"use client";

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function FandomsAdmin() {
  const [status, setStatus] = useState('');
  const [fandomData, setFandomData] = useState({ name: '', slug: '', color: '#000000', iconUrl: '' });
  const [fandomFile, setFandomFile] = useState<File | null>(null);
  const [fandoms, setFandoms] = useState<any[]>([]);

  const loadFandoms = async () => {
    try {
      const data: any = await fetchApi('/admin/fandoms');
      if (data) {
        setFandoms(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    loadFandoms();
  }, []);

  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('pixelwave_token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error(data.message || 'Upload failed');
  };

  const handleCreateFandom = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Creating fandom... Uploading icon if any...');
    try {
      let iconUrl = fandomData.iconUrl;
      if (fandomFile) {
        iconUrl = await handleUploadFile(fandomFile);
      }
      await fetchApi('/admin/fandoms', {
        method: 'POST',
        body: JSON.stringify({ name: fandomData.name, slug: fandomData.slug, color: fandomData.color, iconUrl })
      });
      setStatus('Fandom created successfully!');
      setFandomData({ name: '', slug: '', color: '#000000', iconUrl: '' });
      setFandomFile(null);
      loadFandoms();
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase mb-6">Manage Fandoms 🌟</h1>
      {status && (
        <div className="mb-6 bg-yellow-200 border-2 border-black p-4 font-bold shadow-[4px_4px_0_0_#000]">
          {status}
        </div>
      )}

      <section className="border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000] max-w-2xl">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Create Fandom</h2>
        <form onSubmit={handleCreateFandom} className="flex flex-col gap-4 font-data text-sm">
          <input type="text" placeholder="Fandom Name" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={fandomData.name} onChange={e => setFandomData({...fandomData, name: e.target.value})} />
          <input type="text" placeholder="Slug" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={fandomData.slug} onChange={e => setFandomData({...fandomData, slug: e.target.value})} />
          
          <div className="flex gap-4 items-center p-2 border-2 border-black bg-gray-50">
            <span className="font-bold">Color:</span>
            <input type="color" className="w-12 h-10 cursor-pointer border-2 border-black" value={fandomData.color} onChange={e => setFandomData({...fandomData, color: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-black bg-gray-50">
            <span className="font-bold">Icon</span>
            <input type="text" placeholder="Icon Image URL" className="border-2 border-black p-2 outline-none focus:bg-white mb-2" value={fandomData.iconUrl} onChange={e => setFandomData({...fandomData, iconUrl: e.target.value})} />
            <span className="text-xs text-gray-500">OR Upload Icon File</span>
            <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-[var(--color-pw-neon-lime)] file:text-black file:cursor-pointer hover:file:opacity-90" onChange={e => setFandomFile(e.target.files?.[0] || null)} />
          </div>

          <button type="submit" className="bg-[var(--color-pw-vibrant-blue)] text-white border-2 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none mt-2 text-lg">Submit Fandom</button>
        </form>
      </section>

      <section className="mt-8 border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000]">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Existing Fandoms</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-data text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-pw-neon-lime)] border-b-2 border-black">
                <th className="p-2 border-r-2 border-black">Icon</th>
                <th className="p-2 border-r-2 border-black">Name</th>
                <th className="p-2 border-r-2 border-black">Color</th>
                <th className="p-2 border-r-2 border-black">ID</th>
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {fandoms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">No fandoms found.</td>
                </tr>
              ) : (
                fandoms.map((fandom: any) => (
                  <tr key={fandom.id} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="p-2 border-r border-gray-300">
                      {fandom.iconUrl ? <img src={fandom.iconUrl} alt={fandom.name} className="w-10 h-10 object-cover border-2 border-black rounded-full" /> : '-'}
                    </td>
                    <td className="p-2 border-r border-gray-300 font-bold">{fandom.name}</td>
                    <td className="p-2 border-r border-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-black" style={{ backgroundColor: fandom.color }}></div>
                        <span>{fandom.color}</span>
                      </div>
                    </td>
                    <td className="p-2 border-r border-gray-300 text-xs font-mono">{fandom.id}</td>
                    <td className="p-2">{new Date(fandom.createdAt).toLocaleDateString()}</td>
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
