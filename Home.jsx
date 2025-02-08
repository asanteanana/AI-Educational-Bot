import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ChatInput from "../components/ChatInput";
import ResponseCard from "../components/ResponseCard";

const Home = () => {
  const [response, setResponse] = useState("");

  const handleSend = async (query) => {
    const res = await fetch("http://localhost:8000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResponse(data.answer);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <ChatInput onSend={handleSend} />
        {response && <ResponseCard text={response} />}
      </div>
    </div>
  );
};

export default Home;
