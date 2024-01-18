"use client";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface Product {
  id: number;
  nome: string;
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
      console.log("Success:", response);
    } catch (error) {
      console.log("Error:", error);
      alert("Ocorreu um erro ao tentar se conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  // Quando a tela for carregada, execute.
  useEffect(() => {
    loadItems();
  }, []);

  async function handleAddItem() {
    const data: Omit<Product, "id"> = { nome: textInput, isEditing: false };

    try {
      const response = await api.post("/products", data);
      loadItems();
      console.log("Success:", response);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function handleDeleteItem(itemId: number) {
    console.log(itemId);

    try {
      await api.delete(`/products/${itemId}`);

      const filteredItems = items.filter((item) => item.id !== itemId);
      setItems(filteredItems);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function handleEditItem(itemId: number) {
    let tempItem: any;

    const result = items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, isEditing: !item.isEditing };
        tempItem = updatedItem;

        return updatedItem;
      }
      return item;
    });

    setItems(result);
    if (!tempItem.isEditing) await api.put(`/products/${itemId}`, tempItem);
  }

  function handleChangeItem(itemId: number, textValue: string) {
    const result = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, nome: textValue };
      }
      return item;
    });

    setItems(result);
  }

  return (
    <main>
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
            {item.isEditing ? (
              <input
                value={item.nome}
                onChange={(e) => handleChangeItem(item.id, e.target.value)}
              />
            ) : (
              item.nome
            )}

            <button onClick={() => handleEditItem(item.id)}>
              {item.isEditing ? "Salvar" : "Editar"}
            </button>
            <button onClick={() => handleDeleteItem(item.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
