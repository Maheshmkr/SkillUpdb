import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import authHero from "@/assets/auth-signup-hero.jpg";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // placeholder – navigate to explore on submit
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={authHero} alt="Learner focused on screen" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-16 text-white w-full">
          <div className="mb-8">
            <div className="w-12 h-1 bg-primary mb-6" />
            <h1 className="text-5xl font-bold leading-tight mb-4">Start your journey today.</h1>
            <p className="text-xl text-white/90 max-w-md">Join thousands of students mastering new skills and shaping their future with our expert-led courses.</p>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-muted" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-muted-foreground/30" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-muted-foreground/50" />
            </div>
            <span>Trusted by 50,000+ learners worldwide</span>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-card">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">EduDiscover</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create an account</h2>
            <p className="text-muted-foreground">Join our community and start learning.</p>
          </div>

          {/* Google button */}
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl bg-card hover:bg-accent transition-colors font-medium text-foreground">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground uppercase tracking-widest text-xs font-semibold">or signup with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  required
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]">
                Create Account
              </button>
            </div>
            <div className="flex items-start gap-3 text-xs text-muted-foreground mt-6 leading-relaxed">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-border text-primary focus:ring-primary" />
              <span>
                By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </span>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline ml-1">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
