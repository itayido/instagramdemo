import { useEffect, useState } from "react";
import { Link } from "react-router";
function Posts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const ActiveUser = JSON.parse(localStorage.getItem("ActiveUser"));

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch(
          `http://localhost:3000/posts?userId=${ActiveUser.id}`
        );
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.log("Error fetching posts:", err);
      }
    }
    fetchItems();
  }, []);

  async function addPost(title, body) {
    const tempId = "temp" + Date.now();
    const newItem = { id: tempId, userId: "" + ActiveUser.id, title, body };

    setPosts((prev) => [...prev, newItem]);

    try {
      const res = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: ActiveUser.id, title, body }),
      });
      if (!res.ok) throw new Error();

      const createdPost = await res.json();

      setPosts((prev) =>
        prev.map((post) => (post.id === tempId ? createdPost : post))
      );
    } catch {
      setPosts((prev) => prev.filter((post) => post.id !== tempId));
    }
  }

  async function deletePost(id) {
    setPosts((prev) => prev.filter((item) => item.id !== id));
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("failed");
      console.log("deleted");
    } catch (err) {
      console.log("error:", err);
      const itemToRestore = posts.find((post) => post.id === id);
      if (itemToRestore) {
        setPosts((prev) => [...prev, itemToRestore]);
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    addPost(title, content);
    setTitle("");
    setContent("");
  }
  return (
    <div>
      <h2>Posts by {ActiveUser.username}</h2>
      <ul>
        {posts.length === 0 ? (
          <p>No Posts</p>
        ) : (
          posts.map((post) => (
            <div key={post.id}>
              <Link to={`/home/posts/${post.id}`}>
                <li key={post.id}>
                  ID: {post.id} <br />
                  Title: {post.title}
                </li>
              </Link>
              <button onClick={() => deletePost(post.id)}>delete</button>
            </div>
          ))
        )}
      </ul>
      <h4> Add new post </h4>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Post Title:</label>
        <input
          type="text"
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <label htmlFor="content">Post Content:</label>
        <input
          type="text"
          id="content"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit"> Add </button>
      </form>
    </div>
  );
}

export default Posts;
