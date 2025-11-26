import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuthHook";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !password || !passwordConfirm) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, passwordConfirm);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(result.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-neutral-200 px-4 pt-32 pb-10 scroll-smooth">
      <div className="w-full max-w-5xl bg-[#D7E6FF] rounded-2xl border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] mx-auto px-6 sm:px-10 py-10">
        <div className="w-full max-w-md bg-white rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-black/10 p-6 sm:p-8 mx-auto">
          <div className="bg-white/80 rounded-xl p-6 sm:p-8">
            <h2 className="text-3xl font-extrabold text-[#3A66CC] text-center mb-10">
              Register
            </h2>

            {error && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">Akun berhasil dibuat</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-[#3A66CC] mb-1">Username</label>
                <div className="relative">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-8 disabled:bg-gray-50"
                    placeholder="Nama pengguna"
                  />
                  <User className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#3A66CC] mb-1">Alamat Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-8 disabled:bg-gray-50"
                    placeholder="Email untuk authentikasi"
                  />
                  <Mail className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#3A66CC] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-12 disabled:bg-gray-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    disabled={loading}
                    className="absolute right-6 top-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Lock className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#3A66CC] mb-1">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    disabled={loading}
                    className="w-full border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-12 disabled:bg-gray-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={loading}
                    className="absolute right-6 top-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Lock className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-64 rounded-full bg-[#CFE0FF] text-[#3A66CC] font-semibold text-lg py-3 shadow-md hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#3A66CC] font-semibold hover:underline"
                >
                  Login disini
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
