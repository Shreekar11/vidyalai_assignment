import React, { useState, useEffect } from 'react';
import Posts from '../components/Posts';
import Footer from '../components/Footer';
import TopNavbar from '../components/Navbar';

export default function HomePage() {
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);

  const handleScroll = () => {
    const fixedScrollY = 100;
    if (window.scrollY > fixedScrollY) {
      setIsNavbarFixed(true);
    } else {
      setIsNavbarFixed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <div
        style={
          isNavbarFixed
            ? { position: 'fixed', top: 0, width: '100%', zIndex: 1000 }
            : null
        }
      >
        <TopNavbar />
      </div>
      <div style={{ marginTop: isNavbarFixed ? '60px' : '0px' }}>
        <div style={{ margin: '60px 0px 20px' }}>
          <Posts />
        </div>
        <Footer />
      </div>
    </div>
  );
}
