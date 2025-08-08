"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function MonthPicker() {
  const router = useRouter();
  const params = useSearchParams();
  const month = params.get("month") ?? new Date().toISOString().slice(0,7);

  return (
    <div style={{display:"flex", gap:".5rem", alignItems:"center"}}>
      <label className="label">Month</label>
      <input className="input" type="month" value={month}
        onChange={(e)=>{
          const m = e.target.value;
          const q = new URLSearchParams(params.toString());
          q.set("month", m);
          router.push("/?"+q.toString());
        }}
      />
    </div>
  );
}
