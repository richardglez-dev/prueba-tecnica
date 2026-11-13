
import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './config/firebase.config';
import ChatPage from './chat/pages/ChatPage';

function App() {

  useEffect(() => {
    const iniciarSesion = async () => {
      try {
        await signInAnonymously(auth);
        console.log('Firebase conectado correctamente');
      } catch (error) {
        console.error('Error de autenticación:', error);
      }
    };

    iniciarSesion();
  }, []);

  return <ChatPage />;
}

export default App;
