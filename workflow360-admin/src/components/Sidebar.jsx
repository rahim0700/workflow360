import React from 'react';
import { LayoutDashboard, Users, Truck, ShieldCheck, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard },
    { id: 'field', label: 'Field Workforce', icon: ShieldCheck },
    { id: 'visitors', label: 'Visitor Logs', icon: Users },
    { id: 'deliveries', label: 'Delivery Manifests', icon: Truck },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen p-4">
      <div className="text-xl font-bold text-white mb-8 px-2 tracking-wide">
        WorkFlow<span className="text-blue-500">360</span>
      </div>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="pt-4 border-t border-slate-800">
        <button 
          onClick={() => localStorage.clear()} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}