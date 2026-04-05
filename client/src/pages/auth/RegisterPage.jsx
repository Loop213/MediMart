import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerUser } from "@/features/auth/authSlice";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await dispatch(registerUser(form)).unwrap();
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Create account</p>
          <h1 className="text-3xl font-black">Start ordering with MediMart</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Already have an account? <Link to="/login" className="font-bold text-brand-600">Login</Link>
        </p>
      </Card>
    </div>
  );
}
