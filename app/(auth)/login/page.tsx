"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=> setIsLogged(!!data.user));
  },[]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined } });
    if (error) alert(error.message);
    else alert("Check your email for the magic link!");
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    location.href = "/";
  };

  return (
    <div className="card" style={{display:"grid", gap:"1rem"}}>
      <h1 className="text-xl font-bold">Login</h1>
      {isLogged ? (
        <button className="btn" onClick={onLogout}>Sign out</button>
      ) : (
        <form onSubmit={onLogin} style={{display:"grid", gap:".5rem"}}>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          <button className="btn" type="submit">Send magic link</button>
        </form>
      )}
    </div>
  );
}
