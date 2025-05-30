import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

type CustomModel = {
  id: number;
  baseId: number;
  base: {
    name: string;
    type: string;
  };
  data: {
    color?: string;
    width?: number;
    height?: number;
    depth?: number;
    shelves?: number[];
  };
};

const AdminPage = () => {
  const [models, setModels] = useState<CustomModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/admin/custom-models', {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Ошибка доступа');
        const data = await res.json();
        setModels(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:3001/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Панель администратора</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Выйти
        </button>
      </div>

      {models.length === 0 ? (
        <p>Нет кастомных моделей.</p>
      ) : (
        <ul>
          {models.map((model) => (
            <li key={model.id}>
              <strong>{model.base.name}</strong> ({model.base.type})<br />
              Размеры: {model.data?.width}×{model.data?.height}×{model.data?.depth} <br />
              Цвет: {model.data?.color || '—'} <br />
              Полки: {model.data?.shelves?.join(', ') || 'нет'} <br />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;
