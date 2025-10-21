# 🚀 Práctica de Node.js - Fundamentos y Full Stack

![Holonet Preview](./holonet.jpg)


> Este repositorio contiene ejercicios y prácticas de Node.js, culminando con el desarrollo de **Holonet**, un foro de discusión full stack que sirve como proyecto integrador de los conceptos aprendidos.

## 📚 Acerca de este Proyecto

Este proyecto forma parte de mi proceso de aprendizaje de Node.js y desarrollo full stack. A través de diferentes ejercicios y prácticas, he ido construyendo una base sólida en:

- Fundamentos de Node.js y JavaScript en el servidor
- Creación de APIs RESTful con Express
- Manejo de bases de datos con SQLite
- Autenticación y manejo de sesiones
- Desarrollo frontend con React

El proyecto final, **Holonet**, es un foro de discusión que implementa todos estos conceptos en una aplicación web completa y funcional.

## 🛠️ Tecnologías Implementadas

### Frontend

- **React 18** - Biblioteca de JavaScript para construir interfaces de usuario
- **React Router v6** - Manejo de rutas del lado del cliente
- **Context API** - Gestión de estado global (autenticación)
- **Vite** - Herramienta de construcción y servidor de desarrollo
- **CSS Vanilla** - Estilos personalizados sin frameworks
- **Axios** - Cliente HTTP para peticiones a la API

> **Nota sobre el diseño:** Este proyecto está enfocado principalmente en la práctica de desarrollo backend. Como tal, la interfaz de usuario no está optimizada para ser responsive y se recomienda su visualización en pantallas de escritorio.

### Backend

- **Node.js** - Entorno de ejecución de JavaScript
- **Express** - Framework para aplicaciones web
- **SQLite** - Base de datos relacional ligera
- **Express Session** - Manejo de sesiones del lado del servidor
- **CORS** - Middleware para habilitar CORS

## 🚀 Características Principales

### Autenticación

- Registro de nuevos usuarios
- Inicio de sesión con persistencia de sesión
- Rutas protegidas
- Cierre de sesión

### Publicaciones

- Crear publicaciones
- Ver todas las publicaciones en tiempo real
- Eliminar publicaciones propias
- Sistema de "me gusta"

### Comentarios

- Añadir comentarios a publicaciones
- Eliminar comentarios propios
- Interacción en tiempo real

### Perfil de Usuario

- Ver perfil
- Actualizar información personal
- Cambiar contraseña

## 🛠️ Configuración del Entorno

### Requisitos Previos

- Node.js (v16 o superior)
- npm (v8 o superior)
- Git

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/foro-discusion.git
   cd foro-discusion
   ```

2. **Configurar el Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Configurar el Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configurar Variables de Entorno**
   - Crear un archivo `.env` en la carpeta `backend` con:
     ```
     PORT=3001
     SESSION_SECRET=tu_secreto_seguro_aqui
     ```

## 🚀 Ejecutar el Proyecto

### Modo Desarrollo

1. **Iniciar el servidor de desarrollo del frontend**

   ```bash
   cd frontend
   npm run dev
   ```

2. **Iniciar el servidor backend**

   ```bash
   cd ../backend
   npm run dev
   ```

3. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - API: http://localhost:3000

### Scripts Útiles

#### Backend

- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon
- `npm start`: Inicia el servidor en producción
- `npm test`: Ejecuta las pruebas unitarias

#### Frontend

- `npm run dev`: Inicia el servidor de desarrollo Vite
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción

## 📂 Estructura del Proyecto

```
foro-discusion/
├── backend/               # Código del servidor
│   ├── src/
│   │   ├── controllers/   # Lógica de controladores
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Rutas de la API
│   │   ├── middleware/    # Middlewares personalizados
│   │   └── app.js         # Configuración de Express
│   └── database/          # Archivos de la base de datos SQLite
│
└── frontend/              # Aplicación React
    ├── src/
    │   ├── components/    # Componentes reutilizables
    │   ├── context/       # Contextos de React
    │   ├── pages/         # Componentes de página
    │   ├── services/      # Servicios API
    │   └── styles/        # Estilos globales
    └── public/            # Archivos estáticos
```

## 🔒 Seguridad

- Manejo seguro de contraseñas
- Protección contra CSRF
- Validación de entradas tanto en frontend como en backend
- Manejo seguro de sesiones
- Variables de entorno para datos sensibles

## 📝 Notas para Desarrolladores

- **Base de Datos**: SQLite se utiliza por simplicidad en desarrollo. Para producción, considera migrar a PostgreSQL o MySQL.
- **Variables de Entorno**: Asegúrate de configurar correctamente las variables de entorno en producción.
- **Formato de Código**: El proyecto utiliza ESLint y Prettier para mantener un código consistente.

## 📄 Licencia

Este es un proyecto de código abierto. Siéntete libre de usarlo como referencia o base para tus propios proyectos. Se agradece la atribución al autor original.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee las guías de contribución antes de enviar pull requests.

## ✉️ Contacto

¿Tienes preguntas? No dudes en abrir un issue en el repositorio.

---

Desarrollado con ❤️ por Julián - 2025
