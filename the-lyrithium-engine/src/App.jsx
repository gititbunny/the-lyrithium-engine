import { useRef, useState } from "react";
import axios from "axios";
import "./style.css";

export default function App() {
  const inputRef = useRef(null);
  const poemRef = useRef(null);
  const [poemVisible, setPoemVisible] = useState(false);

  function displayPoem(response) {
    new window.Typewriter("#poem", {
      strings: response.data.answer,
      autoStart: true,
      delay: 1,
      cursor: "",
    });
  }

  function generatePoem(event) {
    event.preventDefault();

    const instructionsInput = inputRef.current;
    const apiKey = "04a7c8423bffd931f0eo50c50b099bt8";
    const prompt = `User instructions: Generate a poem about ${instructionsInput.value}`;
    const context =
      "You are a romantic message expert and love to write short messages. Your mission is to generate an 8 line message. Each line must be seperated with a <br/>. Make sure to follow the user instructions. Do not include a title to the message. Sign the message with 'The Lyrithium Engine' inside a italic <em> element inside a strong <strong> element at the bottom of the poem";

    const apiURL = `https://api.shecodes.io/ai/v1/generate?prompt=${prompt}&context=${context}&key=${apiKey}`;

    setPoemVisible(true);
    if (poemRef.current) {
      poemRef.current.classList.remove("hidden");
      poemRef.current.innerHTML = `<div class="generating">🖋 A poem about ${instructionsInput.value} is generating...</div>`;
    }

    axios.get(apiURL).then(displayPoem);
  }

  async function copyPoem() {
    if (!poemRef.current) return;
    const text = poemRef.current.innerText.trim();

    try {
      await navigator.clipboard.writeText(text);
      const btn = document.getElementById("copy-btn");
      if (btn) {
        const original = btn.innerText;
        btn.innerText = "Copied!";
        setTimeout(() => (btn.innerText = original), 1200);
      }
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }

  return (
    <div className="container">
      <header>
        <div className="logo-container">
          <img
            src="/src/logo.png"
            alt="The Lyrithium Engine Logo"
            className="logo"
          />
        </div>
        <h1>The Lyrithium Engine</h1>
        <p>AI Romantic Message Generator</p>
      </header>

      <main>
        <div className="form-container">
          <form id="poem-generator-form" onSubmit={generatePoem}>
            <input
              type="text"
              placeholder="Enter a message topic..."
              autoFocus
              required
              autoComplete="off"
              className="instructions"
              id="user-instructions"
              ref={inputRef}
            />
            <input type="submit" className="submit-button" />
          </form>
          <div className="hint">
            e.g. a name, keyword, favorite thing, etc...
          </div>
        </div>

        <div className="poem-wrapper">
          <div
            className={`poem ${poemVisible ? "" : "hidden"}`}
            id="poem"
            ref={poemRef}
          ></div>

          {poemVisible && (
            <button
              id="copy-btn"
              type="button"
              className="copy-button"
              onClick={copyPoem}
              aria-label="Copy generated message"
              title="Copy message"
            >
              Copy message
            </button>
          )}
        </div>
      </main>

      <footer>
        <em>
          This project was coded by{" "}
          <a href="https://www.linkedin.com/in/ninankhwashu/" target="_blank">
            NN
          </a>
        </em>
      </footer>
    </div>
  );
}
