import React, { useEffect, useState } from "react";
import { fetchFurniture, FurnitureItem } from "../services/api";
import { Link } from "react-router-dom";

const CatalogPage: React.FC = () => {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");

  const [minWidth, setMinWidth] = useState<number | undefined>();
  const [maxWidth, setMaxWidth] = useState<number | undefined>();
  const [minHeight, setMinHeight] = useState<number | undefined>();
  const [maxHeight, setMaxHeight] = useState<number | undefined>();
  const [minDepth, setMinDepth] = useState<number | undefined>();
  const [maxDepth, setMaxDepth] = useState<number | undefined>();

  useEffect(() => {
    fetchFurniture({ search: searchQuery })
      .then(setFurniture)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const filteredFurniture = furniture.filter((item) => {
    return (
      (!typeFilter || item.type === typeFilter) &&
      (!colorFilter || item.color === colorFilter) &&
      (!minWidth || item.width >= minWidth) &&
      (!maxWidth || item.width <= maxWidth) &&
      (!minHeight || item.height >= minHeight) &&
      (!maxHeight || item.height <= maxHeight) &&
      (!minDepth || item.depth >= minDepth) &&
      (!maxDepth || item.depth <= maxDepth)
    );
  });

  const predefinedColors = [
    { name: "Белый", value: "#ffffff" },
    { name: "Серый", value: "#999999" },
    { name: "Чёрный", value: "#000000" },
    { name: "Коричневый", value: "#8b4513" },
    { name: "Красный", value: "#FF0000" },
    { name: "Желтый", value: "#FF0000" },
    { name: "Фиолетовый", value: "#800080" },
    { name: "Синий", value: "#0000FF" },
    { name: "Зеленый", value: "#008000" },
  ];

  const colorNames: { [key: string]: string } = {
    "#ffffff": "белый",
    "#999999": "серый",
    "#000000": "чёрный",
    "#8b4513": "коричневый",
    "#FF0000": "красный",
    "#FFFF00": "желтый",
    "#800080": "фиолетовый",
    "#0000FF": "синий",
    "#008000": "зеленый",
  };

  return (
    <div>
      <h2>Каталог мебели</h2>

      <div className="d-flex justify-content-end mb-3">
        <Link to="/login" className="btn btn-outline-primary">
          Вход
        </Link>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Поиск по названию"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-3">
        <label className="me-2">Тип: </label>
        <select onChange={(e) => setTypeFilter(e.target.value)} className="form-select d-inline w-auto me-3">
          <option value="">Все</option>
          <option value="стол">Стол</option>
          <option value="диван">Диван</option>
          <option value="шкаф">Шкаф</option>
        </select>

        <label className="me-2">Цвет: </label>
        <select
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
          className="form-select d-inline w-auto"
        >
          <option value="">Все</option>
          {predefinedColors.map((color) => (
            <option key={color.value} value={color.value}>
              {color.name}
            </option>
          ))}
        </select>
      </div>


      <div className="row mt-4">
        {filteredFurniture.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <Link to={`/item/${item.id}`} className="text-decoration-none text-dark">
              <div className="card h-100">
                <img
                  src={item.images[0]}
                  className="card-img-top"
                  alt={item.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p>{item.description}</p>
                  <p>
                    <strong>Тип:</strong> {item.type} | <strong>Цвет:</strong> {colorNames[item.color] || item.color}
                  </p>
                  <p>
                    <strong>ШхВхГ:</strong> {item.width}x{item.height}x{item.depth} см
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
