"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AddTransactionForm from "@/components/AddTransactionForm";
import type { Transaction, Category } from "@/lib/types";

export default function TransactionsPage() {
  const [uid, setUid] = useState<string|null>(null);
  const [tx, setTx] = useState<Transaction[]>([]);
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(()=>{
    (async () => {
      const { data:{user} } = await supabase.auth.getUser();
      setUid(user?.id ?? null);
      if (!user) return;
      const [{ data: txs }, { data: categories }] = await Promise.all([
        supabase.from("transactions").select("*").eq("user_id", user.id).order("occurred_on", { ascending: false }),
        supabase.from("categories").select("*").eq("user_id", user.id)
      ]);
      setTx(txs ?? []);
      setCats(categories ?? []);
    })();
  }, []);

  const nameById = useMemo(()=>Object.fromEntries(cats.map(c=>[c.id, `${c.name} (${c.type})`])),[cats]);

  const onDelete = async (id:string) => {
    if (!confirm("Delete this transaction?")) return;
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) alert(error.message); else location.reload();
  };

  return (
    <div className="grid gap-3">
      <h1 className="text-xl font-bold">Transactions</h1>
      {!uid ? <div className="card">Please <a className="link" href="/login">log in</a>.</div> : (
        <>
          <AddTransactionForm />
          <div className="card">
            <table className="table">
              <thead><tr><th>Date</th><th>Amount (DOP)</th><th>Category</th><th>Note</th><th></th></tr></thead>
              <tbody>
                {tx.map(t => (
                  <tr key={t.id}>
                    <td>{t.occurred_on}</td>
                    <td>{Number(t.amount).toFixed(2)}</td>
                    <td>{t.category_id ? nameById[t.category_id] : "—"}</td>
                    <td>{t.note ?? ""}</td>
                    <td><button className="btn secondary" onClick={()=>onDelete(t.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
