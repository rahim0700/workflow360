import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Truck, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

export default function DashboardContent({ activeTab }) {
  const [stats, setStats] = useState({
    fieldCount: 0,
    visitorCount: 0,
    deliveryCount: 0,
    pendingDeliveries: 0,
  });
  const [fieldData, setFieldData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [fieldRes, visitorRes, deliveryRes] = await Promise.all([
        api.get('/field-activities/'),
        api.get('/visitors/'),
        api.get('/deliveries/'),
      ]);

      setFieldData(fieldRes.data);
      setVisitorData(visitorRes.data);
      setDeliveryData(deliveryRes.data);

      setStats({
        fieldCount: fieldRes.data.length,
        visitorCount: visitorRes.data.length,
        deliveryCount: deliveryRes.data.length,
        pendingDeliveries: deliveryRes.data.filter(d => d.status === 'PENDING').length,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-950 text-slate-400 flex items-center justify-center">
        <RefreshCw className="animate-spin mr-2" size={20} /> Loading operational telemetry...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold capitalize">{activeTab.replace('-', ' ')} Control Panel</h1>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      {/* Overview Metrics Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-400 font-medium">Field Activities</span>
                <ShieldCheck className="text-blue-500" size={24} />
              </div>
              <div className="text-3xl font-bold">{stats.fieldCount}</div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-400 font-medium">Registered Visitors</span>
                <Users className="text-emerald-500" size={24} />
              </div>
              <div className="text-3xl font-bold">{stats.visitorCount}</div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-400 font-medium">Total Deliveries</span>
                <Truck className="text-purple-500" size={24} />
              </div>
              <div className="text-3xl font-bold">{stats.deliveryCount}</div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-400 font-medium">Pending Sign-Offs</span>
                <Clock className="text-amber-500" size={24} />
              </div>
              <div className="text-3xl font-bold">{stats.pendingDeliveries}</div>
            </div>
          </div>
        </div>
      )}

      {/* Field Workforce Tab */}
      {activeTab === 'field' && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-sm bg-slate-900/50">
                <th className="p-4">Agent</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status Notes</th>
                <th className="p-4">Task Completed</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {fieldData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850">
                  <td className="p-4 font-medium">{item.agent_username}</td>
                  <td className="p-4">{item.location_name}</td>
                  <td className="p-4 text-slate-300">{item.status_notes}</td>
                  <td className="p-4">
                    {item.is_task_completed ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">Completed</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400">In Progress</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Visitor Logs Tab */}
      {activeTab === 'visitors' && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-sm bg-slate-900/50">
                <th className="p-4">Visitor Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Purpose</th>
                <th className="p-4">Host</th>
                <th className="p-4">Arrival Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {visitorData.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-slate-850">
                  <td className="p-4 font-medium">{visitor.visitor_name}</td>
                  <td className="p-4 text-slate-300">{visitor.contact_info}</td>
                  <td className="p-4">{visitor.purpose_of_visit}</td>
                  <td className="p-4">{visitor.host_username || 'N/A'}</td>
                  <td className="p-4 text-slate-400">{new Date(visitor.arrival_time).toLocaleString()}</td>
                  <td className="p-4">
                    {visitor.is_checked_out ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">Checked Out</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">Checked In</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delivery Manifests Tab */}
      {activeTab === 'deliveries' && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-sm bg-slate-900/50">
                <th className="p-4">Manifest ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Item Details</th>
                <th className="p-4">Recipient</th>
                <th className="p-4">Status</th>
                <th className="p-4">Logged At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {deliveryData.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-slate-850">
                  <td className="p-4 font-medium">#{delivery.id}</td>
                  <td className="p-4">{delivery.department}</td>
                  <td className="p-4 text-slate-300">{delivery.item_manifest}</td>
                  <td className="p-4">{delivery.recipient_username || 'Unassigned'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      delivery.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' :
                      delivery.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(delivery.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}