import { useState, useContext } from "react";

import API from "../api/axios";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post("/login", form);

    login(res.data.access_token);

    localStorage.setItem(
      "userId",
      res.data.user.id
    );

    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-96"
      >
        <h1 className="text-3xl mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-slate-700"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-slate-700"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <button
          className="w-full bg-green-500 p-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;