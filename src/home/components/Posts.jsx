import { useEffect, useState } from "react";
import { Link } from "react-router";
function Posts() {
  const [data, setData] = useState([]);
  const ActiveUser = JSON.parse(localStorage.getItem("ActiveUser"));

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch(
          `http://localhost:3000/posts?userId=${ActiveUser.id}`
        );
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.log("Error fetching posts:", err);
      }
    }
    fetchItems();
  }, []);

  return (
    <div>
      <h2>Posts by {ActiveUser.username}</h2>

      <ul>
        {data.length === 0 ? (
          <p>No Posts</p>
        ) : (
          data.map((post) => (
            <Link to={`/home/posts/${post.id}`} key={post.id}>
              <li key={post.id}>
                ID: {post.id} <br />
                Title: {post.title}
              </li>
            </Link>
          ))
        )}
      </ul>
    </div>
  );
}

export default Posts;
