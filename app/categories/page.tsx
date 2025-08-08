"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AddCategoryForm from "@/components/AddCategoryForm";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [uid, setUid] = useState<string|null>(null);

  useEffect(()=>{
    (async () => {
      const { data:{user} } = await supabase.auth.getUser();
      setUid(user?.id ?? null);
      if (!user) return;
      const { data } = await supabase.from("categories").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setCats(data ?? []);
    })();
  }, []);

  const onDelete = async (id:string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      setCats((prev) => prev.filter((c) => c.id !== id));
      alert("Category deleted");
    }
  };

  return (
    <div className="grid gap-3">
      <h1 className="text-xl font-bold">Categories</h1>
      {!uid ? <div className="card">Please <a className="link" href="/login">log in</a>.</div> : (
        <>
          <AddCategoryForm />
          <div className="card">
            <table className="table">
              <thead><tr><th>Name</th><th>Type</th><th></th></tr></thead>
              <tbody>
                {cats.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.type}</td>
                    <td><button className="btn secondary" onClick={()=>onDelete(c.id)}>Delete</button></td>
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
