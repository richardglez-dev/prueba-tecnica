import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';

import { auth } from './config/firebase.config';
import ChatScreen from './chat/screens/ChatScreen';

export default function App() {

  useEffect(() => {
    const iniciarSesion = async () => {
      try {
        const resultado = await signInAnonymously(auth);

        console.log('Firebase conectado correctamente');
        console.log('Usuario:', resultado.user.uid);

      } catch (error) {
        console.error('Error al autenticar:', error);
      }
    };

    iniciarSesion();
  }, []);

  return <ChatScreen />;
}
