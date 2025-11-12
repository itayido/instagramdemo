import { useEffect, useState } from "react";
import { Link } from "react-router";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchValue, setSearchValue] = useState("");

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
    setTitle("");
    setContent("");
    try {
      const res = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: ActiveUser.id, title, body }),
      });
      if (!res.ok) throw new Error();
      const createdPost = await res.json();
      setPosts((prev) => [...prev, createdPost]);
    } catch {
      alert("couldnt add your post");
    }
  }

  async function deletePost(id) {
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("couldnt delete your post");
      console.log("error:", err);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    addPost(title, content);
    setTitle("");
    setContent("");
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      <h2>Posts by {ActiveUser.username}</h2>
      <label htmlFor="search">Search:</label>
      <input
        id="search"
        type="text"
        placeholder="Search by title..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <ul>
        {filteredPosts.length === 0 ? (
          <p>No Posts</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id}>
              <Link to={`post/${post.id}`}>
                <li>
                  ID: {post.id} <br />
                  Title: {post.title}
                </li>
              </Link>
              <button onClick={() => deletePost(post.id)}>delete</button>
            </div>
          ))
        )}
      </ul>

      <h4>Add new post</h4>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <label>Content:</label>
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default Posts;
