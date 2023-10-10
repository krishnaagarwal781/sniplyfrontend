import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  Component1,
  Component2,
  Component3,
  Component4,
  Component5,
  Component6,
} from "./Components";

function Form() {
  const [link, setLink] = useState("");
  // eslint-disable-next-line
  const [ctaMessage, setCtaMessage] = useState("");
  const [shortenedLink, setShortenedLink] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [selectedAlignment, setSelectedAlignment] = useState("bottom left");
  const iframeRef = useRef(null);
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const componentOptions = [
    { label: "Component1", component: <Component1 /> },
    { label: "Component2", component: <Component2 /> },
    { label: "Component3", component: <Component3 /> },
    { label: "Component4", component: <Component4 /> },
    { label: "Component5", component: <Component5 /> },
    { label: "Component6", component: <Component6 /> },
  ];
  const alignment = ["bottom left", "bottom right", "bottom center"];

  /*****************Production******************/
  // eslint-disable-next-line
  const apiProduction = "https://sniplybackend.onrender.com";

  /*****************Development******************/
  // eslint-disable-next-line
  const apiDev = "http://127.0.0.1:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiProduction}/generate-link/`, {
        url: link,
        cta_message: ctaMessage,
        selected_component: selectedComponent,
        selected_alignment: selectedAlignment,
      });

      if (response.data && response.data.short_code) {
        setShortenedLink(response.data.short_code);
      }
    } catch (error) {
      console.error("Error creating shortened link:", error);
    }
  };
  const trackLinkClick = async () => {
    try {
      // Send a request to track the click
      await axios.get(`${apiProduction}/track-visit/${shortenedLink}`);
      console.log("Link click tracked successfully.");
    } catch (error) {
      console.error("Error tracking link click:", error);
    }
  };
  useEffect(() => {
    if (shortenedLink) {
      const iframe = iframeRef.current;

      const domainPath = link
        .replace(/https?:\/\//, "")
        .replace(/\/$/, "")
        .replace(/\//g, "_");

      const iframeSrc = `${apiProduction}/${encodeURIComponent(
        domainPath
      )}/${shortenedLink}`;

      iframe.src = iframeSrc;

      iframe.onload = (event) => {
        fetch(`${apiProduction}/track-visit/${shortenedLink}`, {
          method: "GET",
          mode: "no-cors",
        });

        if (event.origin === iframe.src) {
          iframe.contentWindow.postMessage({ ctaMessage }, iframe.src);
          iframe.style.height = "100vh";
        }
      };
    }
  }, [shortenedLink, ctaMessage, link]);

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="yo">
          <h1
            style={{
              fontSize: "36px",
              color: "#c300ff",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            Generate short link
          </h1>
          {shortenedLink && (
            <div>
              Website is generated:{" "}
              <a
                href={`${apiProduction}/${encodeURIComponent(
                  link
                    .trim()
                    .replace(/(^\w+:|^)\/\//, "")
                    .replace(/\//g, "_")
                )}/${shortenedLink}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#b009f3",
                  textDecoration: "none",
                  marginLeft: "5px",
                  fontWeight: "bold",
                }}
                onClick={trackLinkClick} // Call the trackLinkClick function when the link is clicked
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
          <div className="custom-select">
            <div className="select-selected" style={{ fontSize: "18px" }}>
              You have selected {selectedComponent}
            </div>
            <div
              style={{ display: "flex", flexWrap: "wrap" }}
              className="select-items select-hide"
            >
              {componentOptions.map((option) => (
                <div
                  key={option.label}
                  onClick={() => setSelectedComponent(option.label)}
                  className={`${
                    selectedComponent === option.label ? "selected-option" : ""
                  }`}
                  style={{
                    flex: "0 0 calc(33.33% - 10px)",
                    padding: "10px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    backgroundColor:
                      selectedComponent === option.label
                        ? "#e46ae4"
                        : "initial" && hoveredComponent === option.label
                        ? "pink"
                        : "initial",
                  }}
                  onMouseEnter={(e) => {
                    setHoveredComponent(option.label);
                  }}
                  onMouseLeave={(e) => {
                    setHoveredComponent(null);
                  }}
                >
                  {option.component}
                </div>
              ))}
            </div>
          </div>
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
