import { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Background from './components/Background';
import ParticleNetwork from './components/ParticleNetwork';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Experience from './pages/Experience';
import Photos from './pages/Photos';
import Interests from './pages/Interests';
import Projects from './pages/Projects';

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <Background />
      <ParticleNetwork />
      <Navbar />
      <ScrollToTop />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/Projects" element={<Projects />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/interests" element={<Interests />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
