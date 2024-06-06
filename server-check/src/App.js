import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [servers, setServers] = useState({});
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("http://172.21.203.60:9973/")
      .then((response) => response.json())
      .then((data) => setServers(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!url) {
      alert("URL을 입력하세요.");
      return;
    }

    const requestUrl = `http://172.21.203.60:9973/add?url=${encodeURIComponent(
      url
    )}${email ? `&mail=${encodeURIComponent(email)}` : ""}`;

    fetch(requestUrl, { method: "POST" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response:", data);
        alert("데이터가 성공적으로 전송되었습니다.");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert("데이터 전송 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="App">
      <h1>서버 상태</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>URL: </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email(선택): </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">추가</button>
      </form>
      <ul>
        {Object.keys(servers).map((key) => (
          <li
            key={key}
            className={
              servers[key].work === undefined
                ? "not-checked"
                : servers[key].work
                ? "working"
                : "not-working"
            }
          >
            {servers[key].url} -{" "}
            {servers[key].work === undefined
              ? "확인되지 않음"
              : servers[key].work
              ? "작동 중"
              : "작동 안 함"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
