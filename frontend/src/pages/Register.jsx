import API from "../api/axios";
import {
  useNavigate,
  Link
} from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  UserPlus
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] =
    useState(false);

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

      await API.post("/register", form);

      showPopup(
        "Registration Successful :)",
        "success"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      showPopup(
        err.response?.data?.message ||
          "Registration Failed :(",
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
          <div className="flex justify-center mb-3">
            <div className="bg-blue-500 p-4 rounded-full">
              <UserPlus
                size={32}
                className="text-white"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white">
            Create Account 🚀
          </h1>

          <p className="text-slate-400 mt-2">
            Register to get started
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
            className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none border border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition"
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
            className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none border border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition"
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
          className={`w-full p-3 rounded-xl cursor-pointer font-semibold text-white transition duration-300 shadow-lg
          ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 hover:scale-[1.02]"
          }`}
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>

        {/* Login Link */}
        <p className="text-center text-slate-400 mt-5 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-semibold transition"
          >
            Login
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-slate-500 mt-4 text-sm">
          Join us today
        </p>
      </form>
    </div>
  );
};

export default Register;