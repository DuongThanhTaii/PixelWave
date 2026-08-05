"use client";

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';

export default function UsersAdmin() {
  const { role: currentUserRole } = useUserStore();
  const [status, setStatus] = useState('');
  const [roleData, setRoleData] = useState({ userId: '', role: 'MODERATOR' });

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Updating role...');
    try {
      await fetchApi(`/admin/users/${roleData.userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: roleData.role })
      });
      setStatus('Role updated successfully!');
      setRoleData({ userId: '', role: 'MODERATOR' });
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase mb-6">Manage Roles 👑</h1>
      {status && (
        <div className="mb-6 bg-yellow-200 border-2 border-black p-4 font-bold shadow-[4px_4px_0_0_#000]">
          {status}
        </div>
      )}

      <section className="border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000] max-w-2xl">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Promote User</h2>
        <form onSubmit={handleUpdateRole} className="flex flex-col gap-4 font-data text-sm">
          <input type="text" placeholder="User ID" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={roleData.userId} onChange={e => setRoleData({...roleData, userId: e.target.value})} />
          
          <div className="flex flex-col gap-1">
            <span className="font-bold">Select Role:</span>
            <select className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={roleData.role} onChange={e => setRoleData({...roleData, role: e.target.value})}>
              <option value="USER">USER</option>
              <option value="MODERATOR">MODERATOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button type="submit" disabled={currentUserRole !== 'ADMIN'} className="bg-gray-800 text-white border-2 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 mt-2 text-lg">Update Role</button>
          {currentUserRole !== 'ADMIN' && <p className="text-xs text-red-600 font-bold">Requires ADMIN role to perform this action.</p>}
        </form>
      </section>
    </div>
  );
}
