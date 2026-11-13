# Chat de productos en tiempo real

Este proyecto fue desarrollado como parte de la prueba técnica. Consiste en un chat en tiempo real entre un cliente y un comercio, donde ambos pueden intercambiar mensajes y el comercio tiene la posibilidad de enviar ofertas de productos.

Desde la aplicación móvil, el cliente puede aceptar o rechazar las ofertas recibidas. Cuando acepta una, se registra un pedido a través de una API desarrollada con NestJS. Si rechaza la oferta, simplemente se actualiza su estado en Firebase.

## Tecnologías utilizadas

Para el desarrollo utilicé las siguientes tecnologías:

- **NestJS y TypeScript:** para la API encargada de registrar y consultar pedidos.
- **React Native con Expo:** para la aplicación móvil del cliente.
- **React con Vite:** para la aplicación web del comercio.
- **Firebase Realtime Database:** para sincronizar los mensajes y las ofertas en tiempo real.
- **Firebase Authentication:** para permitir el acceso mediante autenticación anónima.

## Organización del proyecto

El repositorio está dividido en tres carpetas principales:

```text
prueba-tecnica/
├── api/
├── app-cliente/
├── app-comercio/
└── README.md
```

Cada aplicación tiene sus propias dependencias y archivos de configuración.

## Configuración inicial

Para ejecutar el proyecto es necesario tener instalados Node.js y npm, además de contar con un proyecto de Firebase que tenga habilitados Realtime Database y Authentication con acceso anónimo.

Las aplicaciones web y móvil deben utilizar las credenciales del mismo proyecto de Firebase.

También es importante configurar el mismo identificador de chat en ambas aplicaciones. Para las pruebas utilicé `chat-001`.

### 1. API — NestJS

Ingresar a la carpeta:

```bash
cd api
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor:

```bash
npm run start:dev
```

La API se ejecuta en `http://localhost:3000`.

### 2. Aplicación web — Comercio

Ingresar a la carpeta:

```bash
cd app-comercio
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` tomando como referencia `.env.example` y completar los datos de Firebase.

Las variables utilizadas son:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_CHAT_ID=chat-001
```

Iniciar la aplicación:

```bash
npm run dev
```

La terminal mostrará la dirección para acceder al chat desde el navegador.

### 3. Aplicación móvil — Cliente

Ingresar a la carpeta:

```bash
cd app-cliente
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` a partir de `.env.example` y completar las siguientes variables:

```dotenv
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

CHAT_ID=chat-001
API_URL=http://TU_IP_LOCAL:3000
```

En `API_URL` se debe colocar la dirección IP de la computadora donde está ejecutándose NestJS.

Durante las pruebas utilicé un dispositivo Android físico conectado a la misma red Wi-Fi que la computadora.

La configuración de las variables se realiza desde `app.config.ts`.

Para iniciar la aplicación:

```bash
npx expo start --lan
```

Luego abrirla desde el dispositivo Android utilizando Expo.

## ¿Cómo funciona el chat?

Una vez que las aplicaciones están ejecutándose, tanto el cliente como el comercio pueden enviar y recibir mensajes en tiempo real.

Los mensajes se guardan directamente en Firebase Realtime Database, utilizando la siguiente estructura:

```text
chats/
  {chatId}/
    messages/
      {messageId}/
```

Se manejan dos tipos de mensajes:

- `text`: mensajes de texto normales.
- `product_offer`: ofertas de productos enviadas por el comercio.

Las ofertas pueden tener tres estados: `pending`, `accepted` o `rejected`.

### Envío de ofertas

Desde la aplicación web, el comercio puede ingresar el nombre y el precio de un producto y enviarlo como una oferta.

La oferta aparece automáticamente en el chat del cliente con dos opciones: aceptar o rechazar.

### Aceptación de ofertas

Cuando el cliente acepta una oferta, la aplicación envía una solicitud a la API NestJS para registrar el pedido.

Si el registro se completa correctamente, se actualiza el estado de la oferta a `accepted` en Firebase.

Ese cambio también se refleja en el chat del comercio.

### Rechazo de ofertas

Cuando el cliente rechaza una oferta, su estado cambia a `rejected` directamente en Firebase.

En este caso no se registra ningún pedido en la API.

Para controlar los cambios de estado, utilicé una transacción de Firebase que comprueba que la oferta todavía esté pendiente.

## API de pedidos

La API cuenta con dos endpoints principales.

### POST /orders

Permite registrar un pedido cuando se acepta una oferta.

Ejemplo de solicitud:

```json
{
  "chatId": "chat-001",
  "messageId": "mensaje-001",
  "product": {
    "id": "producto-001",
    "name": "Teclado",
    "price": 150000,
    "currency": "PYG"
  }
}
```

Al registrar un pedido, se genera un identificador único, una fecha de creación y el estado `created`.

También se agregaron algunas validaciones para evitar pedidos incorrectos:

- El identificador del chat es obligatorio.
- El producto debe tener un identificador.
- El precio debe ser un número mayor que cero.
- No se permite registrar dos pedidos con el mismo `chatId` y `messageId`.

### GET /orders/:id

Permite consultar un pedido utilizando su identificador.

Ejemplo:

```http
GET http://localhost:3000/orders/ID_DEL_PEDIDO
```

Si no existe, la API devuelve un error 404.

### Almacenamiento de pedidos

Para esta prueba técnica opté por almacenar los pedidos en memoria, una de las alternativas permitidas en el enunciado.

Esto significa que los pedidos registrados se mantienen mientras la API esté ejecutándose y se pierden cuando el servidor se reinicia.

## Reglas utilizadas en Firebase

Para las pruebas configuré las siguientes reglas en Realtime Database:

```json
{
  "rules": {
    "chats": {
      "$chatId": {
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    }
  }
}
```

Estas reglas permiten leer y escribir mensajes a usuarios autenticados en Firebase.

Como se utiliza autenticación anónima, esta configuración está pensada únicamente para el entorno de prueba. En una aplicación de producción sería necesario implementar una autorización más específica para distinguir los permisos del cliente y del comercio.

## Cómo probar el funcionamiento

Para comprobar el flujo completo:

1. Iniciar la API NestJS.
2. Abrir la aplicación web del comercio.
3. Abrir la aplicación móvil del cliente.
4. Enviar mensajes desde cualquiera de las aplicaciones y comprobar que aparecen en la otra.
5. Enviar una oferta desde el comercio.
6. Aceptar la oferta desde el cliente y verificar que su estado cambie en ambas aplicaciones.
7. Consultar el pedido generado mediante `GET /orders/:id`.
8. Enviar otra oferta y rechazarla para comprobar que cambie su estado sin registrar un pedido.

