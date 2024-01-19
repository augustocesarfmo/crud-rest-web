"use client";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface Product {
  id: number;
  text: string;
  isEditing: boolean;
  isDone: boolean;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [items, setItems] = useState<Product[]>([]);

  async function loadItems() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await api.get("/products");
      setItems(response.data);
    } catch (error) {
      console.log("Error:", error);
      alert("Ocorreu um erro ao tentar se conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleAddItem() {
    const data: Product = {
      id: items.length + 1,
      text: textInput,
      isEditing: false,
      isDone: false,
    };

    try {
      await api.post("/products", data);
      setItems([...items, data]);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  function handleChangeItem(product: Product) {
    const result = items.map((item) => {
      if (item.id === product.id) {
        return product;
      }
      return item;
    });

    setItems(result);
  }

  async function handleDeleteItem(product: Product) {
    try {
      await api.delete(`/products/${product.id}`);

      const filteredItems = items.filter((item) => item.id !== product.id);
      setItems(filteredItems);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <main>
      <h2>Lista de tarefas</h2>
      <div style={{ display: "flex", gap: "5px" }}>
        <input
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Adicionar tarefa"
        />
        <button onClick={handleAddItem}>Adicionar</button>
      </div>

      {loading && <p>Carregando...</p>}

      <ul className="flex">
        {items.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.isDone}
              onChange={() =>
                handleChangeItem({ ...item, isDone: !item.isDone })
              }
            />
            {item.isEditing ? (
              <input
                value={item.text}
                onChange={(e) =>
                  handleChangeItem({ ...item, text: e.target.value })
                }
              />
            ) : (
              <span
                style={{
                  textDecoration: `${item.isDone ? "line-through" : "none"}`,
                }}
              >
                {item.text}
              </span>
            )}

            <button
              onClick={() =>
                handleChangeItem({ ...item, isEditing: !item.isEditing })
              }
            >
              {item.isEditing ? "Salvar" : "Editar"}
            </button>
            <button onClick={() => handleDeleteItem(item)}>Deletar</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
