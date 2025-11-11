import { useEffect, useState } from "react";
import { useParams } from "react-router";

function AlbumDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [start, setStart] = useState(0);
  const limit = 5;

  async function fetchDetails() {
    try {
      const response = await fetch(
        `http://localhost:3000/photos?albumId=${id}&_start=${start}&_limit=${limit}`
      );
      const responseJson = await response.json();
      if (start === 0) {
        setDetails(responseJson);
      } else {
        setDetails((prev) => [...prev, ...responseJson]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setStart(0);
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [start, id]);

  function handleLoadMore() {
    setStart((prevStart) => prevStart + limit);
  }

  const deletePhotos = async (id) => {
    setDetails((prev) => prev.filter((item) => item.id !== id));
    try {
      const response = await fetch(`http://localhost:3000/photos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("error");
      console.log("error");
    } catch (err) {
      console.log("error:", err);
      const itemToRestore = details.find((item) => item.id === id);
      if (itemToRestore) {
        setDetails((prev) => [...prev, itemToRestore]);
      }
    }
  };

  const addPhotos = async (thumbnailUrl) => {
    const newId = "temp" + Date.now();
    const newPhoto = {
      id: "" + newId,
      thumbnailUrl,
      albumId: id,
    };
    setDetails((prev) => [...prev, newPhoto]);
    try {
      const res = await fetch("http://localhost:3000/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPhoto),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      if (created.id !== newId) {
        setDetails((prev) => prev.map((t) => (t.id === newId ? created : t)));
      }
    } catch {
      setDetails((prev) => prev.filter((t) => t.id !== newId));
    }
  };

  return (
    <div>
      <ul>
        {details.length === 0
          ? "No Photos"
          : details.map((photo) => {
              console.log("photo: ", photo);
              return (
                <li key={photo.id}>
                  <img
                    src={photo.thumbnailUrl}
                    style={{ width: "300px" }}
                  ></img>
                  <button onClick={() => deletePhotos(photo.id)}>delete</button>
                </li>
              );
            })}
      </ul>
      <button onClick={handleLoadMore}>load more</button>
      <input
        style={{ marginTop: "5px" }}
        type="text"
        placeholder=" enter url "
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            addPhotos(e.target.value.trim());
            e.target.value = "";
          }
        }}
      ></input>

      {id}
    </div>
  );
}

export default AlbumDetails;
