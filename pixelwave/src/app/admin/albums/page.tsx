"use client";

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

export default function AlbumsAdmin() {
  const [status, setStatus] = useState('');
  const [albumData, setAlbumData] = useState({ title: '', slug: '', artistId: '', artworkUrl: '' });
  const [albumFile, setAlbumFile] = useState<File | null>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [artists, setArtists] = useState<{value: string, label: string}[]>([]);

  const loadData = async () => {
    try {
      const [albumsRes, artistsRes] = await Promise.all([
        fetchApi('/admin/albums'),
        fetchApi('/admin/artists')
      ]) as any[];
      if (albumsRes.success) setAlbums(albumsRes.data);
      if (artistsRes.success) {
        setArtists(artistsRes.data.map((a: any) => ({ value: a.id, label: a.name })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
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
      loadData();
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
          
          <div>
            <span className="font-bold block mb-1">Artist</span>
            <SearchableSelect 
              options={artists}
              value={albumData.artistId}
              onChange={(val) => setAlbumData({...albumData, artistId: val})}
              placeholder="Select Artist..."
              required
            />
          </div>
          
          <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-black bg-gray-50">
            <span className="font-bold">Artwork</span>
            <input type="text" placeholder="Artwork Image URL" className="border-2 border-black p-2 outline-none focus:bg-white mb-2" value={albumData.artworkUrl} onChange={e => setAlbumData({...albumData, artworkUrl: e.target.value})} />
            <span className="text-xs text-gray-500">OR Upload Artwork File</span>
            <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-[var(--color-pw-neon-lime)] file:text-black file:cursor-pointer hover:file:opacity-90" onChange={e => setAlbumFile(e.target.files?.[0] || null)} />
          </div>

          <button type="submit" className="bg-black text-white border-2 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0_0_#000] mt-2 text-lg">Submit Album</button>
        </form>
      </section>

      <section className="mt-8 border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000]">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Existing Albums</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-data text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-pw-neon-lime)] border-b-2 border-black">
                <th className="p-2 border-r-2 border-black">Artwork</th>
                <th className="p-2 border-r-2 border-black">Title</th>
                <th className="p-2 border-r-2 border-black">Artist</th>
                <th className="p-2 border-r-2 border-black">ID</th>
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {albums.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">No albums found.</td>
                </tr>
              ) : (
                albums.map((album: any) => (
                  <tr key={album.id} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="p-2 border-r border-gray-300">
                      {album.artworkUrl ? <img src={album.artworkUrl} alt={album.title} className="w-10 h-10 object-cover border-2 border-black rounded" /> : '-'}
                    </td>
                    <td className="p-2 border-r border-gray-300 font-bold">{album.title}</td>
                    <td className="p-2 border-r border-gray-300">{album.artist?.name || 'Unknown'}</td>
                    <td className="p-2 border-r border-gray-300 text-xs font-mono">{album.id}</td>
                    <td className="p-2">{new Date(album.createdAt).toLocaleDateString()}</td>
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
