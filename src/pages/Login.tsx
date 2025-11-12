import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import loginIllustration from "@/assets/login-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0">

        <div className="bg-white/90 rounded-l-2xl md:rounded-r-none shadow-xl border border-black/5 p-8 md:p-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3A66CC] mb-8 tracking-tight">
            Welcome Back
          </h2>

          <h3 className="text-xl font-bold text-[#3A66CC] mb-6">LOGIN</h3>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <div className="relative">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-8"
                  placeholder="yourname"
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
                  className="w-full bg-transparent border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-8"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-6 top-2.5 text-gray-400 hover:text-gray-600"
                  aria-label="toggle password visibility"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <Lock className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-start justify-between text-xs text-gray-500">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Remember Me
              </label>

              <div className="flex flex-col items-end leading-4">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="hover:underline"
                >
                  Forgot Password
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="mt-1 text-[#3A66CC] font-semibold hover:underline"
                >
                  Register Now
                </button>
              </div>
            </div>

            <button
                type="submit"
                className="w-64 md:w-72 mt-3 rounded-full bg-[#CFE0FF] text-[#3A66CC] font-semibold text-lg md:text-xl tracking-wide py-3.5 md:py-4 shadow-xl hover:shadow-2xl hover:brightness-105 active:scale-[0.98] transition"
                >
                    LOGIN
            </button>
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
