import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка входа");
      }

      navigate("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4">🔐 Вход администратора</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Логин:</label>
          <input
            type="text"
            className="form-control"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Пароль:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Войти
        </button>

        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
}
