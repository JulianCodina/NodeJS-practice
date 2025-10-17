import { useState } from "react";
import axios from "axios";

function App() {
  const [post, setPost] = useState({
    subject: "",
    body: "",
    imageUrl: "",
    userId: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        post
      );
      console.log("Post creado:", response.data);
      alert("Post creado exitosamente!");
    } catch (error) {
      console.error("Error al crear el post:", error);
    }
  };

  return (
    <div className="App">
      <h1>Crear Nuevo Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={post.subject}
          onChange={(e) => setPost({ ...post, subject: e.target.value })}
        />
        <textarea
          placeholder="Contenido"
          value={post.body}
          onChange={(e) => setPost({ ...post, body: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={post.imageUrl}
          onChange={(e) => setPost({ ...post, imageUrl: e.target.value })}
        />
        <button type="submit">Crear Post</button>
      </form>
    </div>
  );
}

export default App;
