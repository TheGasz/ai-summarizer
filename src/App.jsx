import ReactMarkdown from "react-markdown";
import Header from "./components/Header";
import Summarizer from "./components/Summarizer";
import Histori from "./components/Histori";
import { useState, useEffect } from "react";

const App = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [inputText, setInputText] = useState("");
  const [model, setModel] = useState("deepseek/deepseek-chat-v3-0324:free");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem("summaryHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleSummarize = async () => {
    if (inputText.trim() === "") {
      alert("Teks tidak boleh kosong");
      return;
    }
    setSummary("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPEN_ROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: `Summarize  without using any bullet points or numbering and any addition answer.Answer in language the use speak:\n${inputText}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      setSummary(data.choices[0].message.content);
      const newHistory = [...history, data.choices[0].message.content];
      setHistory(newHistory);
      localStorage.setItem("summaryHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Error fetching summary:", error);
      alert("Terjadi kesalahan saat mengambil ringkasan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setSummary("");
  };
  const handleDelete = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem("summaryHistory", JSON.stringify(newHistory));
  };
  return (
    <div className="App">
      <Header title="Aplikasi Ringkasan Teks" />
      <main className="container mx-auto p-4">
        <Summarizer
          inputText={inputText}
          setInputText={setInputText}
          summary={summary}
          model={model}
          setModel={setModel}
          handleReset={handleReset}
          handleSummarize={handleSummarize}
          loading={loading}
          isSpeaking={isSpeaking}
          setIsSpeaking={setIsSpeaking}
        />
      </main>
      <div className ="container mx-auto p-4">
        <Histori history={history} handleDelete={handleDelete} />
      </div>
    
    </div>
  );
};

export default App;
