"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"

export default function Home() {

  const [text, setText] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const generateNotes = async () => {
    setIsLoading(true)
    setError("")
    setNotes("")
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate notes.")
      }

      setNotes(data.notes)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
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

      {error && (
        <section className="glass-panel error-container" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', marginTop: '2rem' }}>
          <h2 className="error-header" style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.2rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Error
          </h2>
          <p style={{ marginTop: '0.5rem', color: '#cbd5e1', fontSize: '0.95rem' }}>{error}</p>
        </section>
      )}

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
            <ReactMarkdown>{notes}</ReactMarkdown>
          </div>
        </section>
      )}

      <footer className="footer" style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
        <p>Created by <span style={{ color: 'var(--accent-color)', fontWeight: '600', textShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}>Karthikeyan</span></p>
      </footer>
    </main>
  )
}