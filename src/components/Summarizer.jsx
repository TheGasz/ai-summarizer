import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import { createWorker } from "tesseract.js";

const Summarizer = ({
  inputText,
  setInputText,
  summary,
  handleSummarize,
  handleReset,
  model,
  setModel,
  loading,
  isSpeaking,
  setIsSpeaking,
  ocr,
  setOcr,
}) => {
  const [worker, setWorker] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  useEffect(() => {
    const initWorker = async () => {
      const newWorker = await createWorker();
      setWorker(newWorker);
    };
    initWorker();
    return () => {
      handleStopNgomong();
      if (worker) {
        worker.terminate();
      }
    };
  }, []);

  const handleImageUpload = async (event) => {
    if (!worker) {
      console.error("Worker belum siap!");
      return;
    }

    const file = event.target.files[0];
    const {
      data: { text },
    } = await worker.recognize(file);
    console.log("Hasil OCR:", text);
    setOcr(text);
    setInputText((prevText) => prevText + "\n" + text);
  };

  const handleNgomong = () => {
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = "id-ID";
    utterance.voice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang === "id-ID");
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    utterance.onboundary = (event) => {
      console.log("Boundary event:", event);
      const charIndex = event.charIndex;
      const wordIndex = summary.substring(0, charIndex).split(" ").length - 1;
      setCurrentIndex(wordIndex);
      if (wordIndex >= summary.split(" ").length - 1) {
        setIsSpeaking(false);
        setCurrentIndex(-1);
      }
    };
  };
  const handleStopNgomong = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentIndex(-1);
  };

  const exportPdf = () => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const doc = new jsPDF();
        const wrappedText = doc.splitTextToSize(summary, 180);
        doc.text(wrappedText, 10, 10);
        doc.save("document.pdf");
      } else {
        console.log("User membatalkan!");
      }
    });
  };

  return (
    <>
      <p className="mb-4 text-lg">Masukkan teks untuk diringkas:</p>
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="deepseek/deepseek-chat-v3-0324:free">DeepSeek V3</option>
        <option value="meta-llama/llama-3.3-70b-instruct:free">
          Llama 3.3 70B Instruct (Meta)
        </option>
        <option value="google/gemini-2.0-flash-exp:free">
          Gemini Flash 2.0 Experimental (Google)
        </option>
      </select>
      <div className="flex flex-col sm:flex-row gap-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="5"
          placeholder="Masukkan teks di sini"
        ></textarea>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSummarize}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Ringkas
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
          >
            Reset
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 p-2 border border-gray-300 rounded cursor-pointer"
          ></input>
        </div>
      </div>
      <section className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Hasil Ringkasan</h2>
        <div className="flex items-center justify-between mb-4">
          {summary &&
            (!isSpeaking ? (
              <button
                onClick={handleNgomong}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
              >
                <FaVolumeUp />
                Ngomong bang
              </button>
            ) : (
              <button
                onClick={handleStopNgomong}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer flex items-center gap-2"
              >
                <FaVolumeMute />
                Meneng bang
              </button>
            ))}
          {summary && (
            <button
              onClick={exportPdf}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer flex items-center gap-2"
            >
              Export to PDF
            </button>
          )}
        </div>

        <div className="text-gray-700">
          {summary ? (
            <>
              <p>
                {summary.split(" ").map((word, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: index === currentIndex ? "bold" : "normal",
                    }}
                  >
                    {word}{" "}
                  </span>
                ))}
              </p>
            </>
          ) : loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3">Memproses ringkasan...</span>
            </div>
          ) : (
            "Hasil ringkasan teks akan muncul di sini setelah proses ringkasan selesai."
          )}
        </div>
      </section>
    </>
  );
};

export default Summarizer;
