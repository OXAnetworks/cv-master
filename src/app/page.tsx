"use client";

import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [profileSearch, setProfileSearch] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [language, setLanguage] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    files.forEach(async (file) => {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("profileSearch", profileSearch);
      formData.append("skills", skills);
      formData.append("experience", experience);
      formData.append("language", language);

      const res = await fetch("/api/cv-analysis", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
    });
  };

  return (
    <div>
      <h1>AI Assistant</h1>
      <p>
        This is a web application that uses AI to analyze CVs and provide
        summaries.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf"
          value={files}
          onChange={(e: any) => setFiles(e.target.files)}
          multiple
        />
        <input
          type="text"
          name="profileSearch"
          placeholder="Profile search"
          value={profileSearch}
          onChange={(e) => setProfileSearch(e.target.value)}
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        <input
          type="text"
          name="language"
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
