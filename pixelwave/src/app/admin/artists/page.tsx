"use client";

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function ArtistsAdmin() {
  const [status, setStatus] = useState('');
  const [artistData, setArtistData] = useState({ name: '', slug: '', bio: '', avatarUrl: '' });
  const [artistFile, setArtistFile] = useState<File | null>(null);

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

  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Creating artist... Uploading avatar if any...');
    try {
      let avatarUrl = artistData.avatarUrl;
      if (artistFile) {
        avatarUrl = await handleUploadFile(artistFile);
      }
      await fetchApi('/admin/artists', {
        method: 'POST',
        body: JSON.stringify({ ...artistData, avatarUrl })
      });
      setStatus('Artist created successfully!');
      setArtistData({ name: '', slug: '', bio: '', avatarUrl: '' });
      setArtistFile(null);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase mb-6">Manage Artists 🎤</h1>
      {status && (
        <div className="mb-6 bg-yellow-200 border-2 border-black p-4 font-bold shadow-[4px_4px_0_0_#000]">
          {status}
        </div>
      )}

      <section className="border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000] max-w-2xl">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Create Artist</h2>
        <form onSubmit={handleCreateArtist} className="flex flex-col gap-4 font-data text-sm">
          <input type="text" placeholder="Artist Name" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={artistData.name} onChange={e => setArtistData({...artistData, name: e.target.value})} />
          <input type="text" placeholder="Slug" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={artistData.slug} onChange={e => setArtistData({...artistData, slug: e.target.value})} />
          <textarea placeholder="Bio" rows={3} className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={artistData.bio} onChange={e => setArtistData({...artistData, bio: e.target.value})} />
          <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-black bg-gray-50">
            <span className="font-bold">Avatar</span>
            <input type="text" placeholder="Avatar Image URL" className="border-2 border-black p-2 outline-none focus:bg-white mb-2" value={artistData.avatarUrl} onChange={e => setArtistData({...artistData, avatarUrl: e.target.value})} />
            <span className="text-xs text-gray-500">OR Upload Avatar File</span>
            <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-[var(--color-pw-neon-lime)] file:text-black file:cursor-pointer hover:file:opacity-90" onChange={e => setArtistFile(e.target.files?.[0] || null)} />
          </div>
          <button type="submit" className="bg-[var(--color-pw-surface-100)] text-black border-2 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none mt-2 text-lg">Submit Artist</button>
        </form>
      </section>
    </div>
  );
}
