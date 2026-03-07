import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, LogIn } from "lucide-react";
import loginHero from "@/assets/auth-login-hero.jpg";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log('🔐 Attempting login with:', { email });

      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      console.log('✅ Login successful:', response.data);

      // Save user info and token to localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data));

      // Navigate based on role
      if (response.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (response.data.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Hero */}
      <section className="hidden md:flex flex-1 relative bg-primary/10 items-center justify-center p-12 lg:p-24 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/15 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Compass className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">SkillUp</span>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl mb-12 border-4 border-card">
            <img src={loginHero} alt="Students collaborating" className="w-full aspect-video object-cover" />
          </div>
          <h1 className="text-foreground text-5xl font-black leading-tight tracking-tight mb-6">
            Unlock your potential.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Join over 10,000 students discovering new skills today. Experience a new way of learning designed for the modern world.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-card bg-muted" />
              <div className="w-10 h-10 rounded-full border-2 border-card bg-muted-foreground/30" />
              <div className="w-10 h-10 rounded-full border-2 border-card bg-muted-foreground/50" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Trusted by students worldwide</span>
          </div>
        </div>
      </section>

      {/* Right Form */}
      <section className="flex-1 flex flex-col bg-card p-8 md:p-12 lg:p-20 overflow-y-auto">
        <div className="max-w-[440px] w-full mx-auto my-auto">
          {/* Mobile logo */}
          <div className="md:hidden mb-12 flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillUp</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Please enter your details to sign in.</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "login" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setActiveTab("signup"); navigate("/signup"); }}
              className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "signup" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Sign Up
            </button>
          </div>

          {/* Google */}
          <div className="mb-8">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl hover:bg-accent transition-all font-semibold text-foreground text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-4 text-sm text-muted-foreground">Or continue with email</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-foreground">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="8-minimum characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label className="text-sm text-muted-foreground">Remember me for 30 days</label>
            </div>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              <LogIn className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
          </p>

          <footer className="mt-auto pt-12 flex justify-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Terms of Service</a>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default Login;
