"use client"

import { useState } from "react"

export default function Home() {

  const [text, setText] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateNotes = () => {
    setIsLoading(true)
    // Simulate AI generation delay
    setTimeout(() => {
      setNotes("AI generated notes will appear here. This is a placeholder for the actual Gemini API response, structured with bullet points and key takeaways.")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <main className="container">
      <header>
        <h1>AI Study Notes Generator</h1>
        <p className="subtitle">Transform your raw study materials into clean, organized notes instantly.</p>
      </header>

      <section className="glass-panel">
        <textarea
          placeholder="Paste your study material, lecture transcript, or textbook excerpt here..."
          value={text}
          onChange={(e)=>setText(e.target.value)}
        />
        
        <button 
          className="btn-primary" 
          onClick={generateNotes}
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Generating...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Generate Notes
            </>
          )}
        </button>
      </section>

      {notes && (
        <section className="glass-panel notes-container">
          <h2 className="notes-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Generated Notes
          </h2>
          <div className="notes-content">
            <p>{notes}</p>
          </div>
        </section>
      )}
    </main>
  )
}