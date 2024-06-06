import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [servers, setServers] = useState({});
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [deleteUrl, setDeleteUrl] = useState(""); // 삭제할 URL 상태 추가
  const origin_url = "http://223.194.20.119:9973/";
  const cors_proxy = "https://cors-anywhere.herokuapp.com/";

  useEffect(() => {
    fetch(`${cors_proxy}${origin_url}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
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

    const requestUrl = `${cors_proxy}${origin_url}add?url=${encodeURIComponent(
      url
    )}${email ? `&mail=${encodeURIComponent(email)}` : ""}`;

    fetch(requestUrl, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
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

  const handleDelete = (event) => {
    event.preventDefault();
    if (!deleteUrl) {
      alert("삭제할 URL을 입력하세요.");
      return;
    }

    const requestUrlDel = `${cors_proxy}${origin_url}del?url=${encodeURIComponent(
      deleteUrl
    )}`;

    fetch(requestUrlDel, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Delete Response:", data);
        alert("데이터가 성공적으로 삭제되었습니다.");
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        alert("err: ", error);
      });
  };

  return (
    <div className="App">
      <h1>Server Checker</h1>
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
      {/* 삭제 기능을 위한 입력 필드와 버튼 추가 */}
      <form onSubmit={handleDelete}>
        <div>
          <label>삭제할 URL: </label>
          <input
            type="text"
            value={deleteUrl}
            onChange={(e) => setDeleteUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">삭제</button>
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
