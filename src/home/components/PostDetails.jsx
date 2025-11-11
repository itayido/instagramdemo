import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const postRes = await fetch(`http://localhost:3000/posts/${id}`);
        if (!postRes.ok) throw new Error("Failed to get the post");
        const data = await postRes.json();
        setPost(data);

        const commentsRes = await fetch(
          `http://localhost:3000/comments?postId=${id}`
        );
        if (!commentsRes.ok) throw new Error("Failed to get the comments");
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (err) {
        console.error("Error:", err);
      }
    }

    fetchPost();
  }, [id]);

  return (
    <div>
      <Link to="/home/posts">Back to Posts</Link>

      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <h3>Comments:</h3>

      {comments.length === 0 ? (
        <p>No comments</p>
      ) : (
        <details open>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                {comment.name}: {comment.body}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export default PostDetails;
