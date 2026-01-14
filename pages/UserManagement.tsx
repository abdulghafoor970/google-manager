
import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, UserPlus, MoreVertical, Mail, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  users: User[];
  onUpdateUserRole: (email: string, role: UserRole) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUserRole }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-500 mt-1">Control access levels and manage team members</p>
        </div>
        <button className="bg-white text-indigo-600 border-2 border-indigo-50 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-sm">
          <UserPlus size={20} />
          Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center group">
            <div className="relative mb-4">
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-white shadow-xl ring-2 ring-gray-100" />
              <div className={`absolute bottom-0 right-0 p-1.5 rounded-full border-2 border-white shadow-sm ${
                user.role === UserRole.ADMIN ? 'bg-indigo-500' : user.role === UserRole.MANAGER ? 'bg-emerald-500' : 'bg-gray-400'
              }`}>
                {user.role === UserRole.ADMIN ? <ShieldAlert size={12} className="text-white" /> : user.role === UserRole.MANAGER ? <ShieldCheck size={12} className="text-white" /> : <UserIcon size={12} className="text-white" />}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1 mb-6">
              <Mail size={14} />
              {user.email}
            </div>

            <div className="w-full space-y-3 pt-6 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Assign Role</p>
              <div className="flex gap-2">
                {Object.values(UserRole).map(role => (
                  <button
                    key={role}
                    onClick={() => onUpdateUserRole(user.email, role)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      user.role === role 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <button className="mt-6 text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100">
              Remove User
            </button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-2xl shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Role Permissions Matrix</h3>
          <p className="text-indigo-100 opacity-80 max-w-md">Admin users can manage system-wide settings, managers handle inventory/AI, and users have read-only visibility.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl font-bold hover:bg-white/30 transition-all border border-white/10">
            View Policy Docs
          </button>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all">
            Update Access Control
          </button>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default UserManagement;
