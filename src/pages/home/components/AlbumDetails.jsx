import { useEffect, useState } from "react";
import { useParams } from "react-router";

function AlbumDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [newPhoto, setNewPhoto] = useState("");

  const [start, setStart] = useState(0);
  const limit = 5;

  useEffect(() => {
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

    fetchDetails();
  }, [start]);

  function handleLoadMore() {
    setStart((prevStart) => prevStart + limit);
  }

  const deletePhotos = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/photos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("error");
      setDetails((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("error:", err);
      alert("couldnt delete photo");
    }
  };

  const addPhotos = async (thumbnailUrl) => {
    const newPhoto = {
      thumbnailUrl,
      albumId: id,
    };

    try {
      const res = await fetch("http://localhost:3000/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPhoto),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setDetails((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
      alert("couldnt add photo");
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    addPhotos(newPhoto);
    setNewPhoto("");
  }

  return (
    <div>
      <ul>
        {details.length === 0
          ? "No Photos"
          : details.map((photo) => {
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="add album"
          onChange={(e) => setNewPhoto(e.target.value)}
        />
        <button type="submit"> Add </button>
      </form>
    </div>
  );
}

export default AlbumDetails;
