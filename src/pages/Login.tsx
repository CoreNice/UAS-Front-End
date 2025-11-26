import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuthHook";
import loginIllustration from "@/assets/login-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Redirect based on role
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 300);
    } else {
      setError(result.message || "Login Gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0">

        <div className="bg-white/90 rounded-l-2xl md:rounded-r-none shadow-xl border border-black/5 p-8 md:p-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3A66CC] mb-8 tracking-tight">
            Welcome Back
          </h2>

          <h3 className="text-xl font-bold text-[#3A66CC] mb-6">LOGIN</h3>

          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-8 disabled:bg-gray-50"
                  placeholder="user@email.com"
                />
                <User className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-8 disabled:bg-gray-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  disabled={loading}
                  className="absolute right-6 top-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="toggle password visibility"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <Lock className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Removed Remember Me and Forgot Password per design request */}

            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={loading}
                className="w-64 md:w-72 mt-3 rounded-full bg-[#CFE0FF] text-[#3A66CC] font-semibold text-lg md:text-xl tracking-wide py-3.5 md:py-4 shadow-xl hover:shadow-2xl hover:brightness-105 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                disabled={loading}
                className="mt-4 text-gray-600 disabled:opacity-50"
              >
                Belum punya akun? <span className="font-semibold hover:underline text-[#3A66CC]">Register disini</span>
              </button>

            </div>
          </form>
        </div>

        <div className="bg-[#DDEAFF] rounded-r-2xl md:rounded-l-none shadow-xl border border-black/5 p-6 md:p-10 flex items-center justify-center">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="max-w-[420px] w-full aspect-square object-contain drop-shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
