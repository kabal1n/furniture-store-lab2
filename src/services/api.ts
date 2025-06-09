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

export interface CustomModel {
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
}

const BASE_URL = "http://localhost:3001";

const checkRes = async (res: Response) => {
  if (!res.ok) throw new Error(await res.text() || "Ошибка запроса");
  return res.json();
};

export const fetchFurniture = async (params: {
  type?: string;
  color?: string;
  search?: string;
} = {}): Promise<FurnitureItem[]> => {
  const query = new URLSearchParams(params as Record<string, string>);
  return checkRes(await fetch(`${BASE_URL}/furniture?${query}`, { credentials: 'include' }));
};

export const fetchOneFurniture = async (id: string): Promise<FurnitureItem> => {
  return checkRes(await fetch(`${BASE_URL}/furniture/${id}`));
};

export const fetchCustomModels = async (): Promise<CustomModel[]> => {
  return checkRes(await fetch(`${BASE_URL}/admin/custom-models`, { credentials: 'include' }));
};

export const saveCustomModel = async (payload: {
  baseId: number;
  data: any;
}): Promise<void> => {
  await checkRes(await fetch(`${BASE_URL}/custom-model`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  }));
};

export const login = async (login: string, password: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ login, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Ошибка входа");
};

export const logout = async (): Promise<void> => {
  await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
};
