import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Experience from './pages/Experience';
import Blog from './pages/Blog';
import Interests from './pages/Interests';

function App() {
  const location = useLocation();

  // On non-home pages, show background/navbar immediately
  useEffect(() => {
    if (location.pathname !== '/') {
      document.body.classList.add('intro-done');
    }
  }, [location.pathname]);

  return (
    <>
      <Background />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/interests" element={<Interests />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
