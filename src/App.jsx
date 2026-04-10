import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import ChatWidget from './components/ChatWidget'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />

      {/* Hero + ChatWidget 左右布局 */}
      <div className="hero-chat-container">
        <div className="hero-section">
          <Hero />
        </div>
        <div className="chat-section">
          <ChatWidget />
        </div>
      </div>

      <About id="about" />
      <Experience id="experience" />
      <Skills id="skills" />
      <Footer />
    </div>
  )
}

export default App
