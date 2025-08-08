"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";
import type { Category } from "@/lib/types";

const schema = z.object({
  amount: z.coerce.number().positive("Amount must be > 0"),
  occurred_on: z.string().min(1, "Required"),
  category_id: z.string().optional(),
  note: z.string().optional(),
});

export default function AddTransactionForm() {
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      const { data } = await supabase.from("categories").select("*").eq("user_id", user.user.id).order("name");
      setCats(data ?? []);
    })();
  }, []);

  const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { occurred_on: new Date().toISOString().slice(0,10) }
  });

  const onSubmit = async (values:any) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) { alert("Please log in first."); return; }
    const { error } = await supabase.from("transactions").insert({
      user_id: user.user.id,
      amount: values.amount,
      occurred_on: values.occurred_on,
      category_id: values.category_id || null,
      note: values.note || null
    });
    if (error) alert(error.message);
    else { reset({ amount: "", occurred_on: new Date().toISOString().slice(0,10), note:"", category_id:"" }); location.reload(); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card" style={{display:"grid", gap:".5rem"}}>
      <div>
        <label className="label">Amount (DOP)</label>
        <input className="input" type="number" step="0.01" {...register("amount")} />
        {errors.amount && <div style={{color:"#f87171"}}>{String(errors.amount.message)}</div>}
      </div>
      <div>
        <label className="label">Date</label>
        <input className="input" type="date" {...register("occurred_on")} />
      </div>
      <div>
        <label className="label">Category</label>
        <select className="input" {...register("category_id")}>
          <option value="">Uncategorized</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
        </select>
      </div>
      <div>
        <label className="label">Note</label>
        <input className="input" placeholder="optional" {...register("note")} />
      </div>
      <button className="btn" disabled={isSubmitting}>Add Transaction</button>
    </form>
  );
}
