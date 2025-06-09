import { useEffect, useState } from "react";
import { fetchFurniture, FurnitureItem } from "../services/api";
import { Link } from "react-router-dom";

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

export default function CatalogPage() {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");

  useEffect(() => {
    fetchFurniture({ search: searchQuery })
      .then(setFurniture)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const filtered = furniture.filter((item) => {
    return (
      (!typeFilter || item.type === typeFilter) &&
      (!colorFilter || item.color === colorFilter)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Каталог мебели</h2>
        <Link to="/login" className="btn btn-outline-primary">Вход</Link>
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Поиск по названию"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-3 d-flex gap-3">
        <div>
          <label>Тип:</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="form-select">
            <option value="">Все</option>
            <option value="стол">Стол</option>
            <option value="диван">Диван</option>
            <option value="шкаф">Шкаф</option>
          </select>
        </div>

        <div>
          <label>Цвет:</label>
          <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)} className="form-select">
            <option value="">Все</option>
            {Object.entries(colorNames).map(([value, name]) => (
              <option key={value} value={value}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {filtered.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <Link to={`/item/${item.id}`} className="text-decoration-none text-dark">
              <div className="card h-100">
                <img src={item.images[0]} className="card-img-top" alt={item.name} />
                <div className="card-body">
                  <h5>{item.name}</h5>
                  <p>{item.description}</p>
                  <p>
                    <strong>Тип:</strong> {item.type}<br />
                    <strong>Цвет:</strong> {colorNames[item.color] || item.color}<br />
                    <strong>Размер:</strong> {item.width}×{item.height}×{item.depth} см
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
