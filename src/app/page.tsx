"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title && !city) {
      router.push("/jobs");
    } else {
      const query = new URLSearchParams();
      if (title) query.set("title", title);
      if (city) query.set("city", city);

      router.push(`/jobs?${query.toString()}`);
    }
  };

  return (
    <div>
      <h1>Find a Job</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Job title or company"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select city</option>
          <option value="Kyiv">Kyiv</option>
          <option value="Lviv">Lviv</option>
          <option value="Odessa">Odessa</option>
          <option value="Zhytomyr">Zhytomyr</option>
        </select>
        <button type="submit">Find Jobs</button>
      </form>
    </div>
  );
}
