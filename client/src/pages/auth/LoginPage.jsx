import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginUser } from "@/features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await dispatch(loginUser(form)).unwrap();
    navigate(location.state?.from?.pathname || "/");
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Welcome back</p>
          <h1 className="text-3xl font-black">Login to MediMart</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            Login
          </Button>
        </form>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          New here? <Link to="/register" className="font-bold text-brand-600">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
