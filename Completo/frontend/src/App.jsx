import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const userID = 1;
const username = "Julián";

function App() {
  const [posts, setPosts] = useState();
  const [replies, setReplies] = useState();

  const [userPostLikes, setUserPostLikes] = useState([3]);
  const [userReplyLikes, setUserReplyLikes] = useState([]);

  const [openReplies, setOpenReplies] = useState(false);
  const [postOpen, setPostOpen] = useState(null);
  const [replyValue, setReplyValue] = useState("");

  function handleLike(postId, type) {
    if (type === "post") {
      if (userPostLikes.includes(postId)) {
        setUserPostLikes(userPostLikes.filter((id) => id !== postId));
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes - 1 } : post
          )
        );
      } else {
        setUserPostLikes([...userPostLikes, postId]);
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      }
    } else {
      if (userReplyLikes.includes(postId)) {
        setUserReplyLikes(userReplyLikes.filter((id) => id !== postId));
        setReplies(
          replies.map((reply) =>
            reply.id === postId ? { ...reply, likes: reply.likes - 1 } : reply
          )
        );
      } else {
        setUserReplyLikes([...userReplyLikes, postId]);
        setReplies(
          replies.map((reply) =>
            reply.id === postId ? { ...reply, likes: reply.likes + 1 } : reply
          )
        );
      }
    }
  }

  function handleReplies(postId) {
    if (postOpen === postId) {
      setPostOpen(null);
      setOpenReplies(false);
      return;
    }
    setPostOpen(postId);
    setOpenReplies(true);
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/replies/${postId}`
        );
        const sortedReplies = [...response.data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setReplies(sortedReplies);
      } catch (error) {
        console.error("Error al obtener los replies:", error);
      }
    };
    fetch();
  }

  function handleReply(postId) {
    if (!replyValue.trim()) return;

    const newReply = {
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
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, replies: post.replies + 1 } : post
          )
        );
      } catch (error) {
        console.error("Error al crear el reply:", error);
        setReplies((prevReplies) => prevReplies.filter((r) => r !== newReply));
      }
    };
    fetch();
  }

  /*
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

  const CreatePostForm = () => {
    return (
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
    );
  };*/

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts`
        );
        setPosts(response.data);
        console.log(response.data);
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
        <div className="posts">
          <div id="column1" className="column">
            {posts
              ? posts.map((post, index) => {
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
                              {post.created_at
                                .slice(0, 10)
                                .replaceAll("-", "/")}
                            </p>
                          </div>
                          <div className="actions">
                            <button onClick={() => handleLike(post.id, "post")}>
                              <img
                                className="icon"
                                src={
                                  userPostLikes.some((id) => id === post.id)
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
                })
              : null}
          </div>
          <div id="column2" className="column">
            {posts
              ? posts.map((post, index) => {
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
                              {post.created_at
                                .slice(0, 10)
                                .replaceAll("-", "/")}
                            </p>
                          </div>
                          <div className="actions">
                            <button onClick={() => handleLike(post.id, "post")}>
                              <img
                                className="icon"
                                src={
                                  userPostLikes.some((id) => id === post.id)
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
                })
              : null}
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
                  .sort((a, b) => b.likes - a.likes)
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
                      <button onClick={() => handleLike(reply.id, "reply")}>
                        <img
                          className="icon"
                          src={
                            userReplyLikes.some((id) => id === reply.id)
                              ? "likeOn.png"
                              : "like.png"
                          }
                          alt="like"
                        />
                        {reply.likes !== 0 && reply.likes}
                      </button>
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
