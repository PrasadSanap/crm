'use client';

import { useState, useEffect } from 'react';

interface Lead {
  _id: string;
  companyName: string;
  contactPerson: string;
  dealStage: string;
  dealValue: number;
}

// 1. DYNAMIC PRODUCTION ROUTING CONFIGURATION
// Next.js reads NEXT_PUBLIC_ variables directly on the client side in production.
// If it's missing (like in local development), it smoothly falls back to localhost:5000.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      try {
        // 2. Updated path to use the dynamic cloud production URL string variable
        const authResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@saas.com',
            password: 'password123'
          })
        });

        const authData = await authResponse.json();

        if (!authData.success) {
          throw new Error(authData.message || 'Authentication failed');
        }

        // 3. Updated path to fetch the multi-tenant metrics stream from the active server
        const leadsResponse = await fetch(`${BACKEND_URL}/api/leads`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          }
        });

        const leadsData = await leadsResponse.json();
        
        if (Array.isArray(leadsData)) {
          setLeads(leadsData);
        } else if (leadsData.success && Array.isArray(leadsData.data)) {
          setLeads(leadsData.data);
        } else {
          setLeads([]);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Full-stack connection error:', err);
        setError(err.message || 'Could not load secure dashboard data.');
        setLoading(false);
      }
    };

    fetchSessionAndData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              B2B Enterprise SaaS Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Multi-Tenant CRM Environment | Live Remote Cluster</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs px-3 py-1.5 rounded-full font-mono font-medium">
            Role: Admin (RBAC-Active)
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 border border-slate-800/80 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-3"></div>
            <p className="text-slate-400 font-mono text-xs">Decrypting secure JWT token stream...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg font-mono">
            Error: {error}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-200">Active Leads Pipeline</h2>
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-mono">
                {leads.length} Records Found
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-950/40">
                    <th className="px-6 py-3.5">Company Name</th>
                    <th className="px-6 py-3.5">Contact Person</th>
                    <th className="px-4 py-3.5 text-center">Deal Stage</th>
                    <th className="px-6 py-3.5 text-right">Deal Value ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-slate-500 font-mono text-xs">
                        No active multi-tenant records found in this partition.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-100">{lead.companyName}</td>
                        <td className="px-6 py-4 text-slate-300">{lead.contactPerson}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-mono font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 uppercase">
                            {lead.dealStage}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-400 font-mono">
                          ${lead.dealValue?.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
