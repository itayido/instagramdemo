import { useEffect, useState } from "react";
import { Link } from "react-router";

function Albums() {
  const [albumsList, setAlbumsList] = useState([]);
  const ActiveUser = JSON.parse(localStorage.getItem("ActiveUser"));

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await fetch(
          `http://localhost:3000/albums?userId=${ActiveUser.id}`
        );
        const albums = await response.json();
        setAlbumsList(albums);
      } catch (err) {
        console.log(err);
      }
    }
    fetchAlbums();
  }, [ActiveUser.id]);

  const addAlbum = async (title) => {
    const newId = "temp" + Date.now();
    const newItem = {
      id: "" + newId,
      title,
      userId: ActiveUser.id,
    };
    setAlbumsList((prev) => [...prev, newItem]);

    try {
      const res = await fetch("http://localhost:3000/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setAlbumsList((prev) => prev.map((t) => (t.id === newId ? created : t)));
    } catch {
      setAlbumsList((prev) => prev.filter((t) => t.id !== newId));
    }
  };

  return (
    <div>
      <ul>
        {albumsList.length === 0
          ? "No Albums"
          : albumsList.map((album) => (
              <li key={album.id}>
                <Link to={`album/${album.id}`}>
                  {album.title} ({album.id})
                </Link>
              </li>
            ))}
      </ul>

      <input
        type="text"
        placeholder="add album"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            addAlbum(e.target.value.trim());
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

export default Albums;
