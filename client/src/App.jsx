import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);

  const API_URL = "http://localhost:5000/api/test";

  // Fetch data from server
  const fetchItems = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setItems(data);
  };

  // Send data to server
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Test DB Connection</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <button type="submit">Save</button>
      </form>

      <h2>Saved Items:</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {new Date(item.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
