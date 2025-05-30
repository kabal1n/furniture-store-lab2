import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FurnitureItem } from "../services/api";

const ConstructorPage: React.FC = () => {
  const location = useLocation();
  const originalItem = (location.state as { item: FurnitureItem })?.item;

  const [item, setItem] = useState<FurnitureItem | null>(originalItem);
  const [shelves, setShelves] = useState<number[]>(item?.shelves || []);
  const [message, setMessage] = useState("");

  if (!item) {
    return <p className="text-danger">Модель не загружена. Откройте из карточки товара.</p>;
  }

  const handleSave = async () => {
  try {
    const response = await fetch("http://localhost:3001/custom-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({
        baseId: item.id,
        data: {
          width: item.width,
          height: item.height,
          depth: item.depth,
          color: item.color,
          shelves: item.type === "шкаф" ? shelves : undefined
        }
      })
    });

    if (!response.ok) throw new Error("Ошибка при сохранении");

    setMessage("Модель успешно сохранена");
  } catch (err) {
    setMessage("Ошибка при сохранении");
    console.error(err);
  }
};


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


  return (
    <div>
      <h2>Конструктор мебели: {item.name}</h2>

      <div className="row">
        {item.images.map((src, index) => (
          <div className="col-md-6 mb-3" key={index}>
            <img src={src} alt={`Вид ${index + 1}`} className="img-fluid rounded border" />
          </div>
        ))}
      </div>

      {/* Блок габаритов */}
      <div className="mb-4">
        <label className="form-label fw-bold">Габариты (см):</label>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Ширина</label>
            <input
              type="number"
              className="form-control"
              value={item.width}
              onChange={(e) => setItem({ ...item, width: Number(e.target.value) })}
              min={0}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Высота</label>
            <input
              type="number"
              className="form-control"
              value={item.height}
              onChange={(e) => setItem({ ...item, height: Number(e.target.value) })}
              min={0}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Глубина</label>
            <input
              type="number"
              className="form-control"
              value={item.depth}
              onChange={(e) => setItem({ ...item, depth: Number(e.target.value) })}
              min={0}
            />
          </div>
        </div>
      </div>

      {/* Цвет */}
    <div className="mb-3">
    <label className="form-label">Цвет:</label>
    <select
        className="form-select"
        value={item.color}
        onChange={(e) => setItem({ ...item, color: e.target.value })}
    >
        {predefinedColors.map((color) => (
        <option key={color.value} value={color.value}>
            {color.name}
        </option>
        ))}
    </select>
    </div>

      {/* Только для шкафов — настройка полок */}
      {item.type === "шкаф" && (
        <div className="mb-4">
          <h5>Полки:</h5>
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={() => setShelves([...shelves, 50])}
          >
            ➕ Добавить полку
          </button>
          {shelves.length > 0 &&
            shelves.map((pos, index) => (
              <div key={index} className="mb-2 d-flex align-items-center">
                <span className="me-2">Позиция (в %):</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="form-control form-control-sm me-2"
                  style={{ width: "80px" }}
                  value={pos}
                  onChange={(e) => {
                    const updated = [...shelves];
                    updated[index] = +e.target.value;
                    setShelves(updated);
                  }}
                />
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    const updated = shelves.filter((_, i) => i !== index);
                    setShelves(updated);
                  }}
                >
                  Удалить
                </button>
              </div>
            ))}

          {/* Схематичное отображение шкафа */}
          <div
            style={{
              position: "relative",
              width: "200px",
              height: "400px",
              border: "2px solid #333",
              marginTop: "20px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {shelves.map((pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: `${pos}%`,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#007bff",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <button className="btn btn-success" onClick={handleSave}>
        💾 Сохранить модель
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default ConstructorPage;
