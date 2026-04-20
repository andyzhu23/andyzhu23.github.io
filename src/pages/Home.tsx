import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import DustText from '../components/DustText';

function useFontSize() {
  const [size, setSize] = useState(window.innerWidth < 480 ? 50 : window.innerWidth < 768 ? 65 : 90);
  useEffect(() => {
    const onResize = () => setSize(window.innerWidth < 480 ? 50 : window.innerWidth < 768 ? 65 : 90);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

// Module-level flag: survives SPA navigation, resets on full page refresh
let introPlayedThisSession = false;

export default function Home() {
  const fontSize = useFontSize();
  const skipAnim = useRef(introPlayedThisSession);
  const [animDone, setAnimDone] = useState(introPlayedThisSession);

  const handleAnimDone = useCallback(() => {
    introPlayedThisSession = true;
    document.body.classList.add('intro-done');
    setAnimDone(true);
  }, []);

  useEffect(() => {
    if (skipAnim.current) {
      document.body.classList.add('intro-done');
    }
    return () => {
      introPlayedThisSession = true;
      document.body.classList.add('intro-done');
    };
  }, []);

  return (
    <div className="page home-page">
      {!animDone && (
        <DustText text={"Andy\nZhu"} fontSize={fontSize} onAnimationDone={handleAnimDone} />
      )}
      <div className="home-hero">
        <h1 className={`home-name-dom ${animDone ? 'visible' : ''}`}>
          <span className="home-name-line">Andy</span>
          <span className="home-name-line">Zhu</span>
        </h1>
        <p className={`home-chinese-name ${animDone ? 'visible' : ''}`}>朱哲远</p>
        <p className={`home-tagline ${animDone ? 'visible' : ''}`}>
          Computer Science @ Cambridge &middot; Software Engineer
        </p>
        <div className={`home-cta ${animDone ? 'visible' : ''}`}>
          <Link to="/about" className="btn btn-primary">About Me</Link>
          <Link to="/experience" className="btn btn-outline">Experience</Link>
        </div>
        <div className={`home-socials ${animDone ? 'visible' : ''}`}>
          <a href="https://github.com/andyzhu23" target="_blank" rel="noopener noreferrer" title="GitHub">GitHub</a>
          <a href="https://www.linkedin.com/in/andy-zhu-92409323b" target="_blank" rel="noopener noreferrer" title="LinkedIn">LinkedIn</a>
          <a href="https://open.spotify.com/user/andy_zhu23" target="_blank" rel="noopener noreferrer" title="Spotify">Spotify</a>
          <a href="https://www.instagram.com/littlenotorzzie" target="_blank" rel="noopener noreferrer" title="Instagram">Instagram</a>
        </div>
      </div>
    </div>
  );
}
