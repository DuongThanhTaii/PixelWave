"use client";

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function AlbumsAdmin() {
  const [status, setStatus] = useState('');
  const [albumData, setAlbumData] = useState({ title: '', slug: '', artistId: '', artworkUrl: '' });
  const [albumFile, setAlbumFile] = useState<File | null>(null);

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

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Creating album... Uploading artwork if any...');
    try {
      let artworkUrl = albumData.artworkUrl;
      if (albumFile) {
        artworkUrl = await handleUploadFile(albumFile);
      }
      await fetchApi('/admin/albums', {
        method: 'POST',
        body: JSON.stringify({ ...albumData, artworkUrl })
      });
      setStatus('Album created successfully!');
      setAlbumData({ title: '', slug: '', artistId: '', artworkUrl: '' });
      setAlbumFile(null);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase mb-6">Manage Albums 💿</h1>
      {status && (
        <div className="mb-6 bg-yellow-200 border-2 border-black p-4 font-bold shadow-[4px_4px_0_0_#000]">
          {status}
        </div>
      )}

      <section className="border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000] max-w-2xl">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Create Album</h2>
        <form onSubmit={handleCreateAlbum} className="flex flex-col gap-4 font-data text-sm">
          <input type="text" placeholder="Album Title" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={albumData.title} onChange={e => setAlbumData({...albumData, title: e.target.value})} />
          <input type="text" placeholder="Slug" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={albumData.slug} onChange={e => setAlbumData({...albumData, slug: e.target.value})} />
          <input type="text" placeholder="Artist ID" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={albumData.artistId} onChange={e => setAlbumData({...albumData, artistId: e.target.value})} />
          
          <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-black bg-gray-50">
            <span className="font-bold">Artwork</span>
            <input type="text" placeholder="Artwork Image URL" className="border-2 border-black p-2 outline-none focus:bg-white mb-2" value={albumData.artworkUrl} onChange={e => setAlbumData({...albumData, artworkUrl: e.target.value})} />
            <span className="text-xs text-gray-500">OR Upload Artwork File</span>
            <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-[var(--color-pw-neon-lime)] file:text-black file:cursor-pointer hover:file:opacity-90" onChange={e => setAlbumFile(e.target.files?.[0] || null)} />
          </div>

          <button type="submit" className="bg-black text-white border-2 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0_0_#000] mt-2 text-lg">Submit Album</button>
        </form>
      </section>
    </div>
  );
}
