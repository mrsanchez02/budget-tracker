"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Required"),
  type: z.enum(["expense","income"]),
});

export default function AddCategoryForm() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const { register, handleSubmit, reset, formState:{errors, isSubmitting} } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: "expense" }
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) { setMessage({ type: "error", text: "Please log in first." }); return; }
    const { error } = await supabase.from("categories").insert({
      user_id: user.user.id, name: values.name, type: values.type
    });
    if (error) setMessage({ type: "error", text: error.message });
    else {
      reset({ name:"", type:"expense" });
      setMessage({ type: "success", text: "Category added." });
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card" style={{display:"grid", gap:".5rem"}}>
      <div>
        <label className="label">Name</label>
        <input className="input" {...register("name")} placeholder="e.g. Food" />
        {errors.name && <div style={{color:"#f87171"}}>{String(errors.name.message)}</div>}
      </div>
      <div>
        <label className="label">Type</label>
        <select className="input" {...register("type")}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      {message && (
        <div style={{color: message.type === "error" ? "#f87171" : "#4ade80"}}>
          {message.text}
        </div>
      )}
      <button className="btn" disabled={isSubmitting}>Add Category</button>
    </form>
  );
}
