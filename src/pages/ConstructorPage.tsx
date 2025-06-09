import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FurnitureItem, saveCustomModel } from "../services/api";

const colorOptions = [
  { name: "Белый", value: "#ffffff" },
  { name: "Серый", value: "#999999" },
  { name: "Чёрный", value: "#000000" },
  { name: "Коричневый", value: "#8b4513" },
  { name: "Красный", value: "#FF0000" },
  { name: "Жёлтый", value: "#FFFF00" },
  { name: "Фиолетовый", value: "#800080" },
  { name: "Синий", value: "#0000FF" },
  { name: "Зелёный", value: "#008000" },
];

export default function ConstructorPage() {
  const location = useLocation();
  const originalItem = (location.state as { item: FurnitureItem })?.item;

  const [item, setItem] = useState<FurnitureItem | null>(originalItem);
  const [shelves, setShelves] = useState<number[]>(item?.shelves || []);
  const [message, setMessage] = useState("");

  if (!item) return <p className="text-danger">Модель не загружена</p>;

  const handleSave = async () => {
    try {
      await saveCustomModel({
        baseId: item.id!,
        data: {
          width: item.width,
          height: item.height,
          depth: item.depth,
          color: item.color,
          shelves: item.type === "шкаф" ? shelves : undefined,
        },
      });
      setMessage("✅ Модель успешно сохранена");
    } catch (err) {
      console.error(err);
      setMessage("❌ Ошибка при сохранении модели");
    }
  };

  return (
    <div>
      <h2>Конструктор мебели: {item.name}</h2>

      <div className="row">
        {item.images.map((src, index) => (
          <div className="col-md-6 mb-3" key={index}>
            <img src={src} alt={`Изображение ${index + 1}`} className="img-fluid rounded border" />
          </div>
        ))}
      </div>

      {/* Габариты */}
      <div className="mb-4">
        <h5>Габариты (см):</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Ширина</label>
            <input
              type="number"
              className="form-control"
              min={0}
              value={item.width}
              onChange={(e) => setItem({ ...item, width: +e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Высота</label>
            <input
              type="number"
              className="form-control"
              min={0}
              value={item.height}
              onChange={(e) => setItem({ ...item, height: +e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Глубина</label>
            <input
              type="number"
              className="form-control"
              min={0}
              value={item.depth}
              onChange={(e) => setItem({ ...item, depth: +e.target.value })}
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
          {colorOptions.map((color) => (
            <option key={color.value} value={color.value}>{color.name}</option>
          ))}
        </select>
      </div>

      {/* Полки для шкафов */}
      {item.type === "шкаф" && (
        <div className="mb-4">
          <h5>Полки</h5>
          <button
            className="btn btn-outline-primary btn-sm mb-2"
            onClick={() => setShelves([...shelves, 50])}
          >
            ➕ Добавить полку
          </button>

          {shelves.map((pos, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <span className="me-2">Позиция:</span>
              <input
                type="number"
                min={0}
                max={100}
                className="form-control form-control-sm me-2"
                value={pos}
                onChange={(e) => {
                  const updated = [...shelves];
                  updated[index] = +e.target.value;
                  setShelves(updated);
                }}
                style={{ width: "80px" }}
              />
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  setShelves(shelves.filter((_, i) => i !== index));
                }}
              >
                Удалить
              </button>
            </div>
          ))}

          {/* Визуализация шкафа */}
          <div
            style={{
              position: "relative",
              width: "200px",
              height: "400px",
              border: "2px solid #333",
              backgroundColor: "#f8f9fa",
              marginTop: "1rem",
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
}
