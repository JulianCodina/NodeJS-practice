import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const userID = 2;
const username = "Julian";

function App() {
  const [posts, setPosts] = useState();
  const [replies, setReplies] = useState();

  const [newPost, setNewPost] = useState({
    user_id: userID,
    subject: "",
    content: "",
    image_url: "",
  });

  const [userPostLikes, setUserPostLikes] = useState([3]);
  const [userReplyLikes, setUserReplyLikes] = useState([]);

  const [openReplies, setOpenReplies] = useState(false);
  const [postOpen, setPostOpen] = useState(null);
  const [replyValue, setReplyValue] = useState("");

  async function handleLike(postId, replyId = null) {
    const like = {
      post_id: postId,
      user_id: userID,
      reply_id: replyId,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/likes`,
        like
      );
      console.log("Like seteado:", response.data);
    } catch (error) {
      console.error("Error al crear el like:", error);
    }
    if (!replyId) {
      if (userPostLikes.some((like) => like.post_id === postId)) {
        setUserPostLikes(
          userPostLikes.filter((like) => like.post_id !== postId)
        );
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes - 1 } : post
          )
        );
      } else {
        setUserPostLikes([...userPostLikes, like]);
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      }
    } else {
      if (
        userReplyLikes.some(
          (like) => like.post_id === postId && like.reply_id === replyId
        )
      ) {
        setUserReplyLikes(
          userReplyLikes.filter(
            (like) => !(like.post_id === postId && like.reply_id === replyId)
          )
        );
        setReplies(
          replies.map((reply) =>
            reply.id === replyId ? { ...reply, likes: reply.likes - 1 } : reply
          )
        );
      } else {
        setUserReplyLikes([...userReplyLikes, like]);
        setReplies(
          replies.map((reply) =>
            reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
          )
        );
      }
    }
  }

  async function handleReplies(postId) {
    if (postOpen === postId) {
      setPostOpen(null);
      setOpenReplies(false);
      return;
    }
    setPostOpen(postId);
    setOpenReplies(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/replies/${postId}`
      );
      const sortedReplies = [...response.data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      console.log("Replies: ", sortedReplies);
      setReplies(sortedReplies);

      const likes = await axios.get(
        `${import.meta.env.VITE_API_URL}/likes/${userID}/${postId}`
      );
      setUserReplyLikes(likes.data);
      console.log("Replies Likes: ", likes.data);
    } catch (error) {
      console.error("Error al obtener los replies:", error);
    }
  }

  async function handleReply(postId) {
    if (!replyValue.trim()) return;

    const newReply = {
      id: Math.floor(Math.random() * 1000) * 3, // No me andaba el import del uuid asi que le meto esto ya fue
      post_id: postId,
      content: replyValue,
      user_id: userID,
      username: username,
      likes: 0,
      created_at: new Date().toISOString(),
    };

    setReplies((prevReplies) => [newReply, ...(prevReplies || [])]);
    setReplyValue("");

    const fetch = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/replies`,
          newReply
        );
        console.log("Reply creado:", response.data);
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, replies: post.replies + 1 } : post
          )
        );

        const replies = await axios.get(
          `${import.meta.env.VITE_API_URL}/replies/${postId}`
        );
        setReplies(replies.data);
        console.log("Replies: ", replies.data);
      } catch (error) {
        console.error("Error al crear el reply:", error);
        setReplies((prevReplies) => prevReplies.filter((r) => r !== newReply));
      }
    };
    fetch();
  }

  async function deleteReply(postId, replyId) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/replies/${replyId}`);
      console.log("Reply eliminado:", replyId);
      setReplies((prevReplies) => prevReplies.filter((r) => r.id !== replyId));
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, replies: post.replies - 1 } : post
        )
      );
    } catch (error) {
      console.error("Error al eliminar el reply:", error);
    }
  }

  async function handleCreatePost(event) {
    event.preventDefault();
    console.log("newPost: ", newPost);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        newPost
      );
      console.log("Post creado:", response.data);
      setNewPost({
        user_id: userID,
        subject: "",
        content: "",
        image_url: "",
      });
      const posts = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
      setPosts(posts.data);
    } catch (error) {
      console.error("Error al crear el post:", error);
    }
  }

  async function deletePost(postId) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postId}`);
      console.log("Post eliminado:", postId);
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error al eliminar el post:", error);
    }
  }

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const fetch = async () => {
      try {
        const posts = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
        setPosts(posts.data);
        console.log("Posts: ", posts.data);
        const likes = await axios.get(
          `${import.meta.env.VITE_API_URL}/likes/${userID}`
        );
        setUserPostLikes(likes.data);
        console.log("Likes: ", likes.data);
      } catch (error) {
        console.error("Error al obtener los posts:", error);
      }
    };
    fetch();
  }, []);

  return (
    <div className="App">
      <img className="header" src="header.png" alt="header" />
      <div className="background">
        <img className="background" src="background.png" alt="background" />
      </div>
      <main>
        <div className="sidebar">
          <h2>Buscar</h2>
          <input type="text" placeholder="Buscar" />
          <h2>Crear Post</h2>
          <form
            onSubmit={handleCreatePost}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <input
              type="text"
              placeholder="Título"
              value={newPost.subject}
              onChange={(e) =>
                setNewPost({ ...newPost, subject: e.target.value })
              }
            />
            <textarea
              placeholder="Contenido"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="URL de la imagen"
              value={newPost.image_url}
              onChange={(e) =>
                setNewPost({ ...newPost, image_url: e.target.value })
              }
            />
            <button type="submit">Crear Post</button>
          </form>
          <h2>Perfil</h2>

          <button onClick={() => handleLogout()}>Cerrar Sesión</button>
        </div>
        <div className="posts">
          <div className="column">
            {posts &&
              posts.map((post, index) => {
                if (index % 2 === 0) {
                  return (
                    <article
                      key={index}
                      className={postOpen === post.id ? "selected" : ""}
                    >
                      <h2>{post.subject}</h2>
                      <p>{post.content}</p>
                      {post.image_url && (
                        <img
                          className="postImg"
                          src={post.image_url}
                          alt={post.subject}
                        />
                      )}
                      <div className="footer">
                        <div className="info">
                          <p>Por: {post.username}</p>
                          <p>
                            Fecha:{" "}
                            {post.created_at.slice(0, 10).replaceAll("-", "/")}
                          </p>
                        </div>
                        <div className="actions">
                          {post.user_id === userID && (
                            <button onClick={() => deletePost(post.id)}>
                              <img
                                className="icon"
                                src="delete.png"
                                alt="delete"
                              />
                            </button>
                          )}
                          <button onClick={() => handleLike(post.id)}>
                            <img
                              className="icon"
                              src={
                                userPostLikes.some(
                                  (like) => like.post_id === post.id
                                )
                                  ? "likeOn.png"
                                  : "like.png"
                              }
                              alt="like"
                            />
                            {post.likes}
                          </button>
                          <button onClick={() => handleReplies(post.id)}>
                            <img
                              className="icon"
                              src={
                                postOpen === post.id
                                  ? "replyOn.png"
                                  : "reply.png"
                              }
                              alt="reply"
                            />
                            {post.replies}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              })}
          </div>
          <div className="column">
            {posts &&
              posts.map((post, index) => {
                if (index % 2 !== 0) {
                  return (
                    <article
                      key={index}
                      className={postOpen === post.id ? "selected" : ""}
                    >
                      <h2>{post.subject}</h2>
                      <p>{post.content}</p>
                      {post.image_url && (
                        <img
                          className="postImg"
                          src={post.image_url}
                          alt={post.subject}
                        />
                      )}
                      <div className="footer">
                        <div className="info">
                          <p>Por: {post.username}</p>
                          <p>
                            Fecha:{" "}
                            {post.created_at.slice(0, 10).replaceAll("-", "/")}
                          </p>
                        </div>
                        <div className="actions">
                          {post.user_id === userID && (
                            <button onClick={() => deletePost(post.id)}>
                              <img
                                className="icon"
                                src="delete.png"
                                alt="delete"
                              />
                            </button>
                          )}
                          <button onClick={() => handleLike(post.id)}>
                            <img
                              className="icon"
                              src={
                                userPostLikes.some(
                                  (like) => like.post_id === post.id
                                )
                                  ? "likeOn.png"
                                  : "like.png"
                              }
                              alt="like"
                            />
                            {post.likes}
                          </button>
                          <button onClick={() => handleReplies(post.id)}>
                            <img
                              className="icon"
                              src={
                                postOpen === post.id
                                  ? "replyOn.png"
                                  : "reply.png"
                              }
                              alt="reply"
                            />
                            {post.replies}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              })}
          </div>
        </div>
        {openReplies && (
          <div className="replies">
            <div className="header">
              <h2>Respuestas</h2>
              <button onClick={() => handleReplies(postOpen)}>
                <img className="icon" src="close.png" alt="close" />
              </button>
            </div>
            <div className="repliesList">
              <div className="newReply">
                <input
                  type="text"
                  placeholder="Añadir una respuesta"
                  value={replyValue}
                  onChange={(e) => setReplyValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReply(postOpen)}
                />
                <button onClick={() => handleReply(postOpen)}>
                  <img className="icon" src="send.png" alt="send" />
                </button>
              </div>
              {replies &&
              replies.filter((reply) => reply.post_id === postOpen).length ===
                0 ? (
                <p>Aún no hay respuestas</p>
              ) : (
                replies &&
                [...replies.filter((reply) => reply.post_id === postOpen)]
                  .sort((a, b) => a.created_at - b.created_at)
                  .map((reply) => (
                    <div className="reply" key={reply.id}>
                      <div className="msg">
                        <p className="label username">{reply.username}</p>
                        <p>{reply.content}</p>
                        <p className="label">
                          {reply.created_at &&
                            reply.created_at.slice(0, 10).replaceAll("-", "/")}
                        </p>
                      </div>
                      <div className="buttons" style={{ display: "flex" }}>
                        {reply.user_id === userID && (
                          <button
                            onClick={() => deleteReply(postOpen, reply.id)}
                          >
                            <img
                              className="icon"
                              src="delete.png"
                              alt="delete"
                            />
                          </button>
                        )}
                        <button onClick={() => handleLike(postOpen, reply.id)}>
                          <img
                            className="icon"
                            src={
                              userReplyLikes.some(
                                (like) => like.reply_id === reply.id
                              )
                                ? "likeOn.png"
                                : "like.png"
                            }
                            alt="like"
                          />
                          {reply.likes !== 0 && reply.likes}
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
