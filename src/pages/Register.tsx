import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-neutral-200 px-4 pt-32 pb-10 scroll-smooth">
      <div className="w-full max-w-5xl bg-[#D7E6FF] rounded-2xl border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] mx-auto px-6 sm:px-10 py-10">
        <div className="w-full max-w-md bg-white rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-black/10 p-6 sm:p-8 mx-auto">
          <div className="bg-white/80 rounded-xl p-6 sm:p-8">
            <h2 className="text-3xl font-extrabold text-[#3A66CC] text-center mb-10">
              Register
            </h2>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-[#3A66CC] mb-1">Username</label>
                <div className="relative">
                  <input className="w-full border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-8" />
                  <User className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#3A66CC] mb-1">Alamat Email</label>
                <div className="relative">
                  <input type="email" className="w-full border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-8" />
                  <Mail className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#3A66CC] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-6 top-2.5 text-gray-400 hover:text-gray-600"
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
                    className="w-full border-b border-gray-300 focus:border-[#3A66CC] outline-none py-2 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-6 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Lock className="absolute right-0 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="w-64 rounded-full bg-[#CFE0FF] text-[#3A66CC] font-semibold text-lg py-3 shadow-md hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition"
                >
                  LOGIN
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
