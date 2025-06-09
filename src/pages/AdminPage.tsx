import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCustomModels, logout, CustomModel } from "../services/api";

export default function AdminPage() {
  const [models, setModels] = useState<CustomModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomModels()
      .then(setModels)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Панель администратора</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Выйти</button>
      </div>

      {models.length === 0 ? (
        <p>Нет кастомных моделей.</p>
      ) : (
        <ul>
          {models.map((m) => (
            <li key={m.id}>
              <strong>{m.base.name}</strong> ({m.base.type})<br />
              Размеры: {m.data?.width}×{m.data?.height}×{m.data?.depth}<br />
              Цвет: {m.data?.color || '—'}<br />
              Полки: {m.data?.shelves?.join(', ') || 'нет'}<hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
