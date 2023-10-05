import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
// import Component1 from "./Component1";
// import Component2 from "./Component2";
// import Component3 from "./Component3";
// import Component4 from "./Component4";

function Form() {
  const [link, setLink] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [ctaMessage, setCtaMessage] = useState("");
  const [shortenedLink, setShortenedLink] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("Component1"); // Default selection
  const iframeRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/generate-link/",
        {
          url: link,
          cta_message: ctaMessage,
          selected_component: selectedComponent, // Send selected component to the backend
        }
      );

      if (response.data && response.data.short_code) {
        setShortenedLink(response.data.short_code);
      }
    } catch (error) {
      console.error("Error creating shortened link:", error);
    }
  };

  useEffect(() => {
    if (shortenedLink) {
      const iframe = iframeRef.current;
      iframe.src = `http://localhost:8000/${shortenedLink}`;

      window.addEventListener("message", (event) => {
        if (event.origin === iframe.src) {
          iframe.contentWindow.postMessage({ ctaMessage }, iframe.src);
          iframe.style.height = "100vh";
        }
      });
    }
  }, [shortenedLink, ctaMessage]);

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", backgroundColor: "navajowhite", height: "100vh" }}>
      <h1>Farzi Website bana lo</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Link:
          <input
            style={{ marginLeft: "4px", width: "400px", marginRight: "4px" }}
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>

        <label>
          Select Component:
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            <option value="Component1">Component 1</option>
            <option value="Component2">Component 2</option>
            <option value="Component3">Component 3</option>
            <option value="Component4">Component 4</option>
          </select>
        </label>

        <button type="submit">Generate Farzi Link</button>
      </form>

      {shortenedLink && (
        <div>
          Farzi Link Taiyaar hai:{" "}
          <a
            href={`http://localhost:8000/${shortenedLink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click
          </a>{" "}
        </div>
      )}

      <iframe
        ref={iframeRef}
        title="Generated Website"
        width="1000px"
        height="600px"
      ></iframe>
    </div>
  );
}

export default Form;
