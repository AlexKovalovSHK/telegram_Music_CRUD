import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import PieceList from './components/PieceList';
import './App.css';

function App() {
  try {
    const lp = retrieveLaunchParams();

    if (lp?.themeParams) {
      const themeParams = lp.themeParams as any;
      const root = document.documentElement;
      if (themeParams.bgColor) root.style.setProperty('--bs-body-bg', themeParams.bgColor);
      if (themeParams.textColor) root.style.setProperty('--bs-body-color', themeParams.textColor);
      if (themeParams.buttonColor) root.style.setProperty('--bs-primary', themeParams.buttonColor);
      if (themeParams.secondaryBgColor) root.style.setProperty('--bs-secondary-bg', themeParams.secondaryBgColor);
    }
  } catch {
    // Приложение открыто вне Telegram — тема не применяется, это нормально
  }

  return (
    <div className="min-vh-100">
      <PieceList />
    </div>
  );
}

export default App;