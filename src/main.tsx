import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/board.css';
import './styles/board-v2.css';
import './styles/curriculum-index.css';
import './styles/guided-assistant.css';
import './styles/learning-badges.css';
import './styles/learning-profile.css';
import './styles/lesson-experience.css';
import './styles/pdf-drawer.css';
import './styles/student-programs.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
