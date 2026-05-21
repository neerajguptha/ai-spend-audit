"use client";

import { useEffect, useState } from "react";
import { auditTool } from "@/lib/audit-engine";
import { ToolInput } from "@/types/tool";
import { supabase } from "@/lib/supabase";

export default function SpendForm() {
  const [tool, setTool] = useState("");
  const [plan, setPlan] = useState("");
  const [monthlySpend, setMonthlySpend] = useState("");
  const [seats, setSeats] = useState("");

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const [tools, setTools] = useState<ToolInput[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("audit-form");

    if (savedData) {
      const parsed = JSON.parse(savedData);

      setTool(parsed.tool || "");
      setPlan(parsed.plan || "");
      setMonthlySpend(parsed.monthlySpend || "");
      setSeats(parsed.seats || "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "audit-form",
      JSON.stringify({ tool, plan, monthlySpend, seats })
    );
  }, [tool, plan, monthlySpend, seats]);

  function addTool() {
    if (!tool || !plan || !monthlySpend || !seats) {
      alert("Please fill all fields");
      return;
    }

    const newTool: ToolInput = {
      tool,
      plan,
      monthlySpend: Number(monthlySpend),
      seats: Number(seats),
    };

    setTools([...tools, newTool]);

    setTool("");
    setPlan("");
    setMonthlySpend("");
    setSeats("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (tools.length === 0) {
      alert("Please add at least one tool");
      return;
    }

    if (!email || !companyName || !role || !teamSize) {
      alert("Please fill all company details");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools,
          email,
          companyName,
          role,
          teamSize,
        }),
      });

      const data = await res.json();

      if (data?.success) {
        setResult({
          audits: tools.map((t) => auditTool(t)),
          totalSavings: data.data?.totalSavings || 0,
          annualSavings: data.data?.annualSavings || 0,
          summary: data.data?.summary,
        });
      } else {
        throw new Error(data.message);
      }

      const totalSavings = tools
        .map((t) => auditTool(t).savings)
        .reduce((a, b) => a + b, 0);

      await supabase.from("audits").insert([
        {
          tools,
          total_savings: totalSavings,
          email,
          company_name: companyName,
          role,
          team_size: Number(teamSize),
        },
      ]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating audit");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 p-6 rounded-2xl mt-10 space-y-4"
    >
      <h2 className="text-2xl font-bold">AI Spend Audit</h2>

      {/* TOOL INPUTS */}
      <select
        value={tool}
        onChange={(e) => setTool(e.target.value)}
        className="w-full p-3 rounded-lg bg-black border border-zinc-700"
      >
        <option value="">Select Tool</option>
        <option value="chatgpt">ChatGPT</option>
        <option value="claude">Claude</option>
        <option value="cursor">Cursor</option>
        <option value="copilot">GitHub Copilot</option>
        <option value="gemini">Gemini</option>
      </select>

      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="w-full p-3 rounded-lg bg-black border border-zinc-700"
      >
        <option value="">Select Plan</option>
        <option value="plus">Plus</option>
        <option value="team">Team</option>
        <option value="enterprise">Enterprise</option>
        <option value="pro">Pro</option>
        <option value="business">Business</option>
      </select>

      <input
        type="number"
        placeholder="Monthly Spend"
        value={monthlySpend}
        onChange={(e) => setMonthlySpend(e.target.value)}
        className="w-full p-3 rounded-lg bg-black border border-zinc-700"
      />

      <input
        type="number"
        placeholder="Seats"
        value={seats}
        onChange={(e) => setSeats(e.target.value)}
        className="w-full p-3 rounded-lg bg-black border border-zinc-700"
      />

      <button
        type="button"
        onClick={addTool}
        className="w-full bg-zinc-700 py-3 rounded-lg font-semibold"
      >
        Add Tool
      </button>

      {/* TOOL LIST */}
      {tools.map((t, i) => (
        <div
          key={i}
          className="bg-black border border-zinc-700 p-3 rounded-lg"
        >
          {t.tool} - {t.plan} - ${t.monthlySpend}
        </div>
      ))}

      {/* LEAD INFO */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-lg bg-black border border-zinc-700"
      />

      <input
        placeholder="Company"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="w-full p-3 rounded-lg bg-black border border-zinc-700"
      />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-3 rounded-lg bg-black border border-zinc-700"
      />

      <input
        type="number"
        placeholder="Team Size"
        value={teamSize}
        onChange={(e) => setTeamSize(e.target.value)}
        className="w-full p-3 rounded-lg bg-black border border-zinc-700"
      />

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black py-3 rounded-lg font-semibold"
      >
        {loading ? "Generating..." : "Generate Audit"}
      </button>

      {/* ================= RESULT UI (UPGRADED) ================= */}
      {result && (
        <div className="mt-6 space-y-6">

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
              <p className="text-sm text-zinc-400">Monthly Savings</p>
              <h2 className="text-3xl font-bold text-green-400">
                ${result.totalSavings}
              </h2>
            </div>

            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
              <p className="text-sm text-zinc-400">Annual Savings</p>
              <h2 className="text-3xl font-bold text-emerald-400">
                ${result.annualSavings}
              </h2>
            </div>

            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
              <p className="text-sm text-zinc-400">Tools Analyzed</p>
              <h2 className="text-3xl font-bold text-blue-400">
                {result.audits.length}
              </h2>
            </div>

          </div>

          {/* TOOL BREAKDOWN */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-4">
              Tool-wise Analysis
            </h3>

            <div className="space-y-3">
              {result.audits.map((audit: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-black border border-zinc-800 rounded-xl p-4"
                >
                  <div>
                    <p className="font-semibold">{audit.tool}</p>
                    <p className="text-sm text-zinc-400">{audit.plan}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-green-400 font-bold">
                      ${audit.savings}/mo
                    </p>
                    <p className="text-xs text-zinc-500">Saved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI SUMMARY */}
          {result.summary && (
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-2">
                AI Insight
              </h3>
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                {result.summary}
              </p>
            </div>
          )}

        </div>
      )}
    </form>
  );
}