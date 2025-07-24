// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { UserProvider } from '../context/UserContext';
import AIChatbot from '../components/AIChatbot';

function App({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <UserProvider>
      <Component {...pageProps} />
      <AIChatbot />
    </UserProvider>
  );
}

export default App;