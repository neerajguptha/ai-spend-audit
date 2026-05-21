"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AuditsPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudits();
  }, []);

  async function fetchAudits() {
    setLoading(true);

    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setAudits(data || []);
    } else {
      console.error(error);
    }

    setLoading(false);
  }

  // 📊 BAR CHART DATA
  const barData = audits.map((a) => ({
    name: a.company_name || "Unknown",
    savings: a.total_savings || 0,
  }));

  // 📊 PIE CHART DATA
  const toolCount: Record<string, number> = {};

  audits.forEach((audit) => {
    (audit.tools || []).forEach((t: any) => {
      toolCount[t.tool] = (toolCount[t.tool] || 0) + 1;
    });
  });

  const pieData = Object.keys(toolCount).map((key) => ({
    name: key,
    value: toolCount[key],
  }));

  const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#a855f7", "#ef4444"];

  // 🧠 AI INSIGHTS ENGINE (NEW)
  function generateInsights(data: any[]) {
    const total = data.reduce(
      (acc, a) => acc + (a.total_savings || 0),
      0
    );

    const avg = data.length ? total / data.length : 0;

    const topCompany = data.reduce(
      (max, a) =>
        (a.total_savings || 0) > (max.total_savings || 0) ? a : max,
      data[0] || {}
    );

    const insights = [];

    if (total > 2000) {
      insights.push(
        "High SaaS spending detected across companies. Strong optimization potential exists."
      );
    } else {
      insights.push(
        "SaaS spending is moderate, but optimization opportunities still exist."
      );
    }

    if (avg > 300) {
      insights.push(
        "Average savings per company is high — consider standardizing SaaS usage policies."
      );
    }

    if (topCompany?.company_name) {
      insights.push(
        `Top savings opportunity: ${topCompany.company_name} shows highest optimization potential.`
      );
    }

    if (data.length >= 5) {
      insights.push(
        "Sufficient data collected for trend-based analysis and forecasting."
      );
    }

    return insights;
  }

  return (
    <div className="p-6 text-white space-y-8">

      <h1 className="text-3xl font-bold">
        Audit Analytics Dashboard
      </h1>

      {/* LOADING */}
      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : (
        <>
          {/* KPI SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-700">
              <p className="text-sm text-zinc-400">Total Audits</p>
              <h2 className="text-2xl font-bold">{audits.length}</h2>
            </div>

            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-700">
              <p className="text-sm text-zinc-400">Total Savings</p>
              <h2 className="text-2xl font-bold text-green-400">
                $
                {audits.reduce(
                  (acc, a) => acc + (a.total_savings || 0),
                  0
                )}
              </h2>
            </div>

            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-700">
              <p className="text-sm text-zinc-400">Avg Savings</p>
              <h2 className="text-2xl font-bold text-blue-400">
                $
                {audits.length
                  ? Math.round(
                      audits.reduce(
                        (acc, a) => acc + (a.total_savings || 0),
                        0
                      ) / audits.length
                    )
                  : 0}
              </h2>
            </div>

          </div>

          {/* BAR CHART */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">
              Savings by Company
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="savings" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">
              Tool Usage Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 🧠 AI INSIGHTS (NEW SECTION) */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 rounded-xl border border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">
              AI Insights
            </h2>

            <ul className="space-y-3 text-sm text-zinc-300">
              {generateInsights(audits).map((insight, i) => (
                <li key={i} className="flex gap-2">
                  <span>💡</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

        </>
      )}
    </div>
  );
}