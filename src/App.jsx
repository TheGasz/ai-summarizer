
import Header from './components/Header';
import Summarizer from './components/Summarizer';

import { useState,useEffect } from 'react';


const App = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summarry, setSummary] = useState('');
  const [inputText, setInputText] = useState('');
  const [model, setModel] = useState('meta-llama/llama-3.3-70b-instruct:free');


  useEffect
 
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
