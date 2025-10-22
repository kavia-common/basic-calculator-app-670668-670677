import React, { useEffect } from 'react';
import './styles.css';
import Calculator from './components/Calculator';

// PUBLIC_INTERFACE
function App() {
  /**
   * Set a neutral light theme background on mount.
   */
  useEffect(() => {
    document.body.classList.add('ocean-bg');
    return () => {
      document.body.classList.remove('ocean-bg');
    };
  }, []);

  return (
    <div className="App ocean-app">
      <Calculator />
    </div>
  );
}

export default App;
