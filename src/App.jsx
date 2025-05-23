
import Header from './components/Header';
import Summarizer from './components/Summarizer';

import { useState,useEffect } from 'react';


const App = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summarry, setSummary] = useState('');
  const [inputText, setInputText] = useState('');
  const [model, setModel] = useState('deepseek/deepseek-chat-v3-0324:free');
  


  useEffect = ()=> {
    const storedHistory = localStorage.getItem('summaryHistory') || [];
    setHistory(JSON.parse(storedHistory));
     }, [];
 
  return (
    <div className="App">
      <Header title="Aplikasi Ringkasan Teks" />
      <main className="container mx-auto p-4">
        <Summarizer />
      </main>
    </div>
  
 
  )

}

export default App
