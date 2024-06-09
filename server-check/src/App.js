import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [servers, setServers] = useState({});
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [deleteUrl, setDeleteUrl] = useState("");
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
      <div className="howToUse">
        <p>
          ssl 인증서 문제로 외부 proxy를 통해 간접적으로 접근하는 방법을
          사용하고 있습니다.<br></br>proxy에 문제가 생길 경우 현재 페이지가
          제대로 동작하지 않을 수 있습니다.
        </p>
        <p>아래와 같은 방법으로 직접적으로 추가할 수 있습니다.</p>
        <div className="commands">
          <div>
            <p>&nbsp;&nbsp;추가</p>
            <p className="howToUseCommand">
              동방ip:9973/add?url=&lt;내부ip:port&gt;&mail=&lt;email&gt;
            </p>
          </div>
          <div>
            <p>&nbsp;&nbsp;제거</p>
            <p className="howToUseCommand">
              동방ip:9973/del?url=&lt;내부ip:port&gt;
            </p>
          </div>
        </div>
        <div className="commands222">
          <div>
            <p>&nbsp;&nbsp;확인</p>
            <p className="howToUseCommand">동방ip:9973/</p>
          </div>
        </div>
      </div>
      <div className="inputPart">
        <form onSubmit={handleSubmit} className="addPart">
          <div className="smallPart">
            <label>URL: </label>
            <input
              placeholder="내부ip:port"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="smallPart">
            <label>Email(선택): </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">추가</button>
        </form>
        <form onSubmit={handleDelete} className="delPart">
          <div>
            <label>삭제할 URL: </label>
            <br></br>
            <input
              type="text"
              value={deleteUrl}
              onChange={(e) => setDeleteUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit">삭제</button>
        </form>
      </div>
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
