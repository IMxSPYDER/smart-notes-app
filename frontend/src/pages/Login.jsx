import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CheckCircle, XCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: ""
  });

  const showPopup = (message, type) => {
    setPopup({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setPopup({
        show: false,
        message: "",
        type: ""
      });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/login", form);

      login(res.data.access_token);

      localStorage.setItem(
        "userId",
        res.data.user.id
      );

      showPopup(
        "Login Successful :)",
        "success"
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      showPopup(
        err.response?.data?.message ||
          "Invalid Email or Password :(",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      
      {/* Popup */}
      {popup.show && (
        <div
          className={`fixed top-5 right-5 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white animate-bounce z-50
          ${
            popup.type === "success"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {popup.type === "success" ? (
            <CheckCircle size={22} />
          ) : (
            <XCircle size={22} />
          )}

          <p className="font-medium">
            {popup.message}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Welcome Back 👋
          </h1>

          <p className="text-slate-400 mt-2">
            Login to continue
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-slate-300 mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none border border-slate-600 focus:border-green-400 focus:ring-2 focus:ring-green-400 transition"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-slate-300 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none border border-slate-600 focus:border-green-400 focus:ring-2 focus:ring-green-400 transition"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-xl font-semibold text-white transition duration-300 cursor-pointer shadow-lg
          ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 hover:scale-[1.02]"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-slate-400 mt-6 text-sm">
          Secure Login System 
        </p>
      </form>
    </div>
  );
};

export default Login;