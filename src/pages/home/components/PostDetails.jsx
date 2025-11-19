import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const ActiveUser = JSON.parse(localStorage.getItem("ActiveUser"));

  useEffect(() => {
    async function fetchPost() {
      try {
        const postRes = await fetch(`http://localhost:3000/posts/${postId}`);
        const data = await postRes.json();
        setPost(data);

        const commentsRes = await fetch(
          `http://localhost:3000/comments?postId=${postId}`
        );
        const commentsData = await commentsRes.json();

        setComments(commentsData);
      } catch (err) {
        console.error("Error:", err);
      }
    }
    fetchPost();
  }, [postId]);

  async function addComment(e) {
    e.preventDefault();

    const newItem = {
      postId,
      name: ActiveUser.username,
      email: ActiveUser.email,
      body: newComment,
    };

    setNewComment("");

    try {
      const res = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed");
      const created = await res.json();
      setComments((prev) => [...prev, created]);
    } catch (err) {
      alert("couldnt add your comment");
      console.error("Error:", err);
    }
  }

  async function deleteComment(commentId) {
    try {
      const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error:", err);
      alert("couldnt delete your comment");
    }
  }

  return (
    <div>
      <Link to="../posts">Back to Posts</Link>

      <h2>{post.title}</h2>
      <p>{post.body}</p>

      <h3>Comments:</h3>
      {comments.length === 0 ? (
        <p>No comments</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.name}</strong>: {comment.body}
              {comment.email === ActiveUser.email && (
                <button onClick={() => deleteComment(comment.id)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addComment}>
        <h4>Add a comment</h4>
        <input
          type="text"
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default PostDetails;
