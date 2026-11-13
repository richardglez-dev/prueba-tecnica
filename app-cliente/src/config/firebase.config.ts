import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

// Abajo obtenemos las variables de entorno
const firebaseConfig = Constants.expoConfig?.extra?.firebase;

if (
  !firebaseConfig?.apiKey ||
  !firebaseConfig?.databaseURL ||
  !firebaseConfig?.projectId
) {
  throw new Error('Faltan variables de configuración de Firebase');
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que utilizaremos
export const database = getDatabase(app);
export const auth = getAuth(app);
