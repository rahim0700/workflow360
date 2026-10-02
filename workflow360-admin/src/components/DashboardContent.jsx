import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Truck, ShieldCheck, Clock, RefreshCw, Plus, X } from 'lucide-react';

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
  const [errorMessage, setErrorMessage] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitor_name: '',
    contact_info: '',
    purpose_of_visit: '',
    host_username: '',
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      
      const [fieldRes, visitorRes, deliveryRes] = await Promise.all([
        api.get('/field-activities/').catch(() => ({ data: [] })),
        api.get('/visitors/').catch(() => ({ data: [] })),
        api.get('/deliveries/').catch(() => ({ data: [] })),
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
      setErrorMessage("Failed to fetch dashboard data. Make sure Django endpoints are available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/visitors/', newVisitor);
      setIsModalOpen(false);
      setNewVisitor({ visitor_name: '', contact_info: '', purpose_of_visit: '', host_username: '' });
      fetchDashboardData(); // Refresh data to show the new visitor
    } catch (err) {
      console.error("Error adding visitor:", err);
      alert("Failed to save visitor. Check inputs.");
    }
  };

  return (
    <div className="flex-1 w-full p-8 overflow-y-auto bg-slate-900 text-white relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold capitalize">Overview Control Panel</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm transition text-white font-medium"
          >
            <Plus size={16} /> Add Visitor
          </button>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition text-white"
          >
            <RefreshCw size={16} /> Refresh Data
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
          {errorMessage}
        </div>
      )}

      {/* Overview Metrics Cards */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Field Activities</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{loading ? '...' : stats.fieldCount}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Registered Visitors</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{loading ? '...' : stats.visitorCount}</h3>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Deliveries</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{loading ? '...' : stats.deliveryCount}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Truck size={24} />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Pending Sign-Offs</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{loading ? '...' : stats.pendingDeliveries}</h3>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
                <Clock size={24} />
              </div>
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
              {fieldData.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-slate-400">No field activities found.</td></tr>
              ) : (
                fieldData.map((item) => (
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
                ))
              )}
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
              {visitorData.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-slate-400">No visitor logs found.</td></tr>
              ) : (
                visitorData.map((visitor) => (
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
                ))
              )}
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
              {deliveryData.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-slate-400">No deliveries found.</td></tr>
              ) : (
                deliveryData.map((delivery) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Visitor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Register New Visitor</h2>
            <form onSubmit={handleVisitorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Visitor Name</label>
                <input 
                  type="text" 
                  required
                  value={newVisitor.visitor_name}
                  onChange={(e) => setNewVisitor({...newVisitor, visitor_name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Jane Smith"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Contact Info</label>
                <input 
                  type="text" 
                  required
                  value={newVisitor.contact_info}
                  onChange={(e) => setNewVisitor({...newVisitor, contact_info: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Phone or Email"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Purpose of Visit</label>
                <textarea 
                  required
                  value={newVisitor.purpose_of_visit}
                  onChange={(e) => setNewVisitor({...newVisitor, purpose_of_visit: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Meeting details..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Host Username</label>
                <input 
                  type="text" 
                  value={newVisitor.host_username}
                  onChange={(e) => setNewVisitor({...newVisitor, host_username: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. admin_user"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  Save Visitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}