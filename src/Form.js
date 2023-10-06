import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "./Form.css";

function Form() {
  const [link, setLink] = useState("");
  const [ctaMessage, setCtaMessage] = useState("");
  const [shortenedLink, setShortenedLink] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("Component1");
  const [selectedAlignment, setSelectedAlignment] = useState("bottom left");
  const iframeRef = useRef(null);

  const componentOptions = [
    "Component1",
    "Component2",
    "Component3",
    "Component4",
    "Component5",
    "Component6",
  ];
  const alignment = [
    "bottom left",
    "bottom right",
    "bottom center",
    // "Component4",
    // "Component5",
    // "Component6",
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
          selected_alignment: selectedAlignment,
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
        <div classname="yo">
          <h1 className="header">Generate short link </h1>
          {shortenedLink && (
            <div className="">
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
        </div>
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
        <label>
          Select Alignment:
          <select
            className="select"
            value={selectedAlignment}
            onChange={(e) => setSelectedAlignment(e.target.value)}
          >
            {alignment.map((option) => (
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
