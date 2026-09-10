import React from 'react'
import Navbar from './pages/Navbar'
import HeroSection from './pages/HeroSection'
import AboutUs from './pages/AboutUs'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Technologies from './pages/Technologies'
import ContactFooter from './pages/ContactFooter'
import MemoryCarousel from './pages/MemoryCarousel'

function App() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <AboutUs/>
      <Technologies/>
      <Portfolio/>
      <MemoryCarousel/>
      <Services/>
      <ContactFooter/>
    </div>
  )
}

export default App