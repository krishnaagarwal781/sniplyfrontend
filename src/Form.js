import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "./Form.css";

function Form() {
  const [link, setLink] = useState("");
  const [ctaMessage, setCtaMessage] = useState("");
  const [shortenedLink, setShortenedLink] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("Component1");
  const iframeRef = useRef(null);

  const componentOptions = [
    "Component1",
    "Component2",
    "Component3",
    "Component4",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://sniplybackend.onrender.com/generate-link/",
        {
          url: link,
          cta_message: ctaMessage,
          selected_component: selectedComponent,
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
      iframe.src = `https://sniplybackend.onrender.com/${shortenedLink}`;

      window.addEventListener("message", (event) => {
        if (event.origin === iframe.src) {
          iframe.contentWindow.postMessage({ ctaMessage }, iframe.src);
          iframe.style.height = "100vh";
        }
      });
    }
  }, [shortenedLink, ctaMessage]);

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="header">Convert Your Customized Website</h1>
        <label>
          Enter Link:
          <input
            className="input"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>

        <label>
          Select Component:
          <select
            className="select"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            {componentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button className="generate-button" type="submit">
          Generate Link
        </button>
      </form>

      {shortenedLink && (
        <div className="link-container">
          Website is generated:{" "}
          <a
            href={`https://sniplybackend.onrender.com/${shortenedLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Click
          </a>
        </div>
      )}

      <iframe
        ref={iframeRef}
        title="Generated Website"
        className="iframe"
        width="600px"
        height="600px"
      ></iframe>
    </div>
  );
}

export default Form;
