import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOneFurniture, FurnitureItem } from "../services/api";

const colorNames: { [key: string]: string } = {
  "#ffffff": "белый",
  "#999999": "серый",
  "#000000": "чёрный",
  "#8b4513": "коричневый",
  "#FF0000": "красный",
  "#FFFF00": "жёлтый",
  "#800080": "фиолетовый",
  "#0000FF": "синий",
  "#008000": "зелёный",
};

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<FurnitureItem | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    fetchOneFurniture(id)
      .then(setItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error || !item) return <p className="text-danger">{error || "Товар не найден"}</p>;

  return (
    <div>
      <h2>{item.name}</h2>
      <p>{item.description}</p>

      <p><strong>Тип:</strong> {item.type}</p>
      <p><strong>Цвет:</strong> {colorNames[item.color] || item.color}</p>
      <p><strong>Размер:</strong> {item.width}×{item.height}×{item.depth} см</p>

      <div className="row">
        {item.images.map((src, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <img src={src} alt={`Фото ${index + 1}`} className="img-fluid rounded border" />
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/constructor", { state: { item } })}
      >
        🔧 Открыть в конструкторе
      </button>
    </div>
  );
}
