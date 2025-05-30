export interface FurnitureItem {
  id?: number;
  type: string;
  name: string;
  color: string;
  width: number;
  height: number;
  depth: number;
  description: string;
  images: string[];
  shelves?: number[];
}

const API_URL = "http://localhost:3001/furniture";

type FetchFurnitureParams = {
  type?: string;
  color?: string;
  search?: string;
};

export const fetchFurniture = async (params: FetchFurnitureParams = {}): Promise<FurnitureItem[]> => {
  const query = new URLSearchParams();

  if (params.type) query.append('type', params.type);
  if (params.color) query.append('color', params.color);
  if (params.search) query.append('search', params.search);

  const url = `${API_URL}?${query.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Ошибка загрузки данных");
  }

  return res.json();
};
