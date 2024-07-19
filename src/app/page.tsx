"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    profileSearch: "",
    skills: "",
    experience: "",
    language: "",
    files: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      const validFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );
      if (validFiles.length !== files.length) {
        alert("Only PDF files are allowed");
      }
      setFormData((prevData) => ({ ...prevData, files: validFiles }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const file of formData.files) {
      const data = new FormData();
      data.append("profileSearch", formData.profileSearch);
      data.append("skills", formData.skills);
      data.append("experience", formData.experience);
      data.append("language", formData.language);
      data.append("file", file);

      try {
        const response = await fetch("/api/cv-analysis", {
          method: "POST",
          body: data,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("Success:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Profile Search:
            <input
              type="text"
              name="profileSearch"
              value={formData.profileSearch}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Skills:
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Experience:
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Language:
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            PDF Files:
            <input
              type="file"
              name="files"
              accept="application/pdf"
              multiple
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
