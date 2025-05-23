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

  useEffect(() => {
    const storedHistory = localStorage.getItem("summaryHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // const handleSummarize = async () => {
  //   if (inputText.trim() === '') return;
  //   setSummary('');
  //   setLoading(true);

  // }
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
        />
      </main>
      <Histori history={history} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
