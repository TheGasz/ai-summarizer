import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

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
}) => {
  const handleNgomong = () => {
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = "id-ID";
    utterance.voice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang === "id-ID");
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };
  const handleStopNgomong = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
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
        const text = summary;

        doc.text(text, 50, 50);
        doc.save("document.pdf");
      } else {
        console.log("User membatalkan!");
      }
    });
  };

  useEffect(() => {
    return () => {
      handleStopNgomong();
    };
  }, []);

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
        </div>
      </div>
      <section className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Hasil Ringkasan</h2>
        <div className="flex items-center justify-between mb-4">
          {summary &&
            (!isSpeaking ? (
              <button
                onClick={handleNgomong}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-red-600 transition cursor-pointer"
              >
                <FaVolumeUp />
                Ngomong bang
              </button>
            ) : (
              <button
                onClick={handleStopNgomong}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
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
              export pdf
            </button>
          )}
        </div>

        <div className="text-gray-700">
          {summary ? (
            <ReactMarkdown>{summary}</ReactMarkdown>
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
