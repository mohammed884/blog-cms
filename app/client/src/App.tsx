import { FormEvent, useState } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const [cover, setCover] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const handleUpload = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (!cover && !avatar) return; 
      const formData = new FormData();
      if (avatar) formData.append("avatar", avatar);
      if (cover) formData.append("cover", cover);
      const res = await axios.post(
        "http://localhost:6060/articles/add",
        formData
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <form encType="multipart/form-data" onSubmit={handleUpload}>
        <input
          type="file"
          name="cover"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCover(e.target.files ? e.target.files[0] : null)
          }
          id=""
        />
                <input
          type="file"
          name="avatar"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAvatar(e.target.files ? e.target.files[0] : null)
          }
          id=""
        />
        <button type="submit">upload</button>
      </form>
    </div>
  );
}

export default App;
