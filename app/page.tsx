"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CategoryPie from "@/components/CategoryPie";
import MonthlyLine from "@/components/MonthlyLine";
import MonthPicker from "@/components/MonthPicker";
import type { Transaction, Category } from "@/lib/types";

function firstDayMonthISO(monthStr?: string) {
  // monthStr: YYYY-MM
  const d = monthStr ? new Date(monthStr + "-01") : new Date();
  d.setDate(1);
  return d.toISOString().slice(0,10);
}
function lastDayMonthISO(monthStr?: string) {
  const d = monthStr ? new Date(monthStr + "-01") : new Date();
  d.setMonth(d.getMonth()+1, 0); // last day of month
  return d.toISOString().slice(0,10);
}

export default function Dashboard() {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string|null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tx, setTx] = useState<Transaction[]>([]);

  const urlMonth = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("month") ?? undefined : undefined;
  const start = firstDayMonthISO(urlMonth);
  const end = lastDayMonthISO(urlMonth);

  useEffect(()=>{
    (async () => {
      const { data:{user} } = await supabase.auth.getUser();
      if (!user) {
        setReady(true);
        return;
      }
      setUserId(user.id);
      const { data: cats } = await supabase.from("categories").select("*").eq("user_id", user.id);
      setCategories(cats ?? []);
      const { data: txs } = await supabase.from("transactions").select("*").eq("user_id", user.id).gte("occurred_on", start).lte("occurred_on", end).order("occurred_on");
      setTx(txs ?? []);
      setReady(true);
    })();
  }, [start, end]);

  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tx) {
      if (!t.category_id) continue;
      const cat = categories.find(c => c.id === t.category_id);
      if (!cat || cat.type !== "expense") continue;
      map.set(cat.name, (map.get(cat.name) ?? 0) + Number(t.amount));
    }
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [tx, categories]);

  const lineData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tx) {
      const key = t.occurred_on;
      const val = Number(t.amount) * ( (()=>{
        const cat = categories.find(c=>c.id===t.category_id);
        return cat?.type === "income" ? -1 : 1;
      })() );
      map.set(key, (map.get(key) ?? 0) + val);
    }
    const days = Array.from(map.keys()).sort();
    const amounts = days.map(d => Number(map.get(d)?.toFixed(2)));
    return { days, amounts };
  }, [tx, categories]);

  return (
    <div className="grid gap-4">
      <div className="card" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <MonthPicker />
      </div>
      {!ready ? (
        <div className="card">Loading…</div>
      ) : !userId ? (
        <div className="card">
          <p>You are not signed in. <a className="link" href="/login">Log in</a> to start tracking your budget.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h2 className="font-semibold mb-2">Spending by Category (Pie)</h2>
              <CategoryPie data={pieData} />
            </div>
            <div className="card">
              <h2 className="font-semibold mb-2">Daily Net Flow (Line)</h2>
              <MonthlyLine days={lineData.days} amounts={lineData.amounts} />
            </div>
          </div>
          <div className="card">
            <h2 className="font-semibold mb-2">This Month — Totals</h2>
            <div style={{display:"grid", gridTemplateColumns: "1fr 1fr 1fr", gap:".75rem"}}>
              <div className="card"><div className="label">Expenses</div><div className="text-2xl">
                { (tx.filter(t=>{
                    const cat = categories.find(c=>c.id===t.category_id);
                    return cat?.type === "expense" || !cat;
                  }).reduce((a,b)=>a+Number(b.amount), 0)).toFixed(2) } DOP
              </div></div>
              <div className="card"><div className="label">Income</div><div className="text-2xl">
                { (tx.filter(t=>{
                    const cat = categories.find(c=>c.id===t.category_id);
                    return cat?.type === "income";
                  }).reduce((a,b)=>a+Number(b.amount), 0)).toFixed(2) } DOP
              </div></div>
              <div className="card"><div className="label">Net</div><div className="text-2xl">
                { (()=>{
                  const exp = tx.filter(t=>{
                    const cat = categories.find(c=>c.id===t.category_id);
                    return cat?.type === "expense" || !cat;
                  }).reduce((a,b)=>a+Number(b.amount), 0);
                  const inc = tx.filter(t=>{
                    const cat = categories.find(c=>c.id===t.category_id);
                    return cat?.type === "income";
                  }).reduce((a,b)=>a+Number(b.amount), 0);
                  return (inc - exp).toFixed(2);
                })() } DOP
              </div></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
