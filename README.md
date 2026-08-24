# 🎓 SKILLORA — Aprende. Practica. Evoluciona.

> Plataforma LMS (*Learning Management System*) fullstack de alto rendimiento construida con una arquitectura profesional desacoplada: **Frontend en React 18 + Vite** y un **Backend propio en Node.js + Express + PostgreSQL + JWT + bcrypt + Zod**.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (SPA)                         │
│   React 18 + Vite + Tailwind CSS + Framer Motion + Lucide   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ HTTP / REST API
                               │ Headers: Authorization: Bearer <JWT>
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (API REST)                     │
│               Node.js + Express + ES Modules                │
│                                                             │
│  ├── 🔐 Autenticación & Autorización (JWT + bcryptjs)        │
│  ├── 🛡️  Control de Acceso Basado en Roles (Student / Admin) │
│  ├── ⚙️  Validación Estricta de Esquemas con Zod            │
│  ├── 🚦 Rate Limiting en Endpoints Sensibles                │
│  ├── 🧠 Lógica de Negocio & Motor de Evaluación Anti-Cheat  │
│  └── 📜 Generación & Verificación de Certificados            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ PostgreSQL Driver (pg.Pool)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BASE DE DATOS (PostgreSQL)                  │
│       13 Tablas Relacionales + Índices de Rendimiento        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
SKILLORA/
├── frontend/                     # Aplicación Cliente React + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/           # Componentes UI, Cursos, Aula, Admin, Quizzes
│   │   ├── contexts/             # AuthContext (JWT) y NotificationContext
│   │   ├── pages/                # Vistas Públicas, Estudiante y Administrador
│   │   ├── routes/               # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/
│   │   │   ├── apiClient.js      # Cliente HTTP centralizado con inyección de JWT
│   │   │   ├── authService.js    # Auth, perfiles y usuarios demo
│   │   │   ├── courseService.js  # Catálogo, cursos, módulos y lecciones
│   │   │   ├── enrollmentService.js
│   │   │   ├── progressService.js
│   │   │   ├── quizService.js    # Consumo seguro de evaluaciones
│   │   │   ├── certificateService.js
│   │   │   └── adminService.js   # Métricas y fichas académicas
│   │   ├── styles/               # Tailwind CSS y directivas
│   │   ├── utils/                # Generadores de PDF/PNG y formateadores
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                      # Servidor API REST Node.js + Express
│   ├── src/
│   │   ├── config/               # Variables de entorno y configuración
│   │   ├── controllers/          # Controladores HTTP desacoplados
│   │   ├── middleware/           # authMiddleware, roleMiddleware, errorMiddleware, validate
│   │   ├── routes/               # Rutas modulares (/auth, /courses, /quizzes, etc.)
│   │   ├── services/             # Lógica de negocio y persistencia
│   │   ├── validators/           # Esquemas Zod para requests
│   │   ├── utils/                # Hashing con bcrypt y sign/verify JWT
│   │   ├── db/
│   │   │   ├── database.js       # Pool PostgreSQL y modo resiliente
│   │   │   ├── schema.sql        # DDL con 13 tablas relacionales e índices
│   │   │   └── seed.js           # Script de sembrado de datos iniciales
│   │   ├── app.js                # Configuración de Express, CORS y middlewares
│   │   └── server.js             # Punto de entrada HTTP
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── package.json                  # Scripts coordinados del repositorio
└── README.md
```

---

## 🔌 Colección de Endpoints REST API

### 🔐 Autenticación (`/api/auth`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registra nuevo estudiante (`role: 'student'`) y devuelve JWT |
| `POST` | `/api/auth/login` | Público | Valida credenciales con `bcrypt.compare` y entrega JWT |
| `GET` | `/api/auth/me` | Autenticado | Obtiene perfil del usuario activo a partir del token JWT |
| `PUT` | `/api/auth/profile` | Autenticado | Actualiza datos del perfil (nombre, avatar, teléfono, bio) |
| `POST` | `/api/auth/forgot-password` | Público | Solicita restablecimiento de contraseña |

### 📚 Cursos y Temarios (`/api/courses`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Público | Lista cursos con filtros (categoría, nivel, duración, búsqueda, orden) |
| `GET` | `/api/courses/:slug` | Público | Detalle completo de curso con módulos y lecciones |
| `POST` | `/api/courses` | **Admin** | Crea un nuevo curso |
| `PUT` | `/api/courses/:id` | **Admin** | Actualiza metadatos y configuración del curso |
| `DELETE` | `/api/courses/:id` | **Admin** | Elimina curso |
| `POST` | `/api/courses/:id/duplicate` | **Admin** | Duplica un curso y su estructura de contenido |
| `POST` | `/api/courses/:id/modules` | **Admin** | Guarda el árbol completo de módulos y lecciones |

### 🏷️ Categorías (`/api/categories`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Público | Lista todas las categorías del catálogo |
| `POST` | `/api/categories` | **Admin** | Crea o edita una categoría |
| `DELETE` | `/api/categories/:id` | **Admin** | Elimina una categoría |

### 📝 Inscripciones & Progreso
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/courses/:courseId/enroll` | Autenticado | Inscribe al estudiante en un curso |
| `GET` | `/api/me/courses` | Autenticado | Lista los cursos inscritos con porcentajes de avance |
| `GET` | `/api/me/courses/:courseId` | Autenticado | Verifica estado de inscripción |
| `POST` | `/api/lessons/:lessonId/complete` | Autenticado | Marca lección como completada |
| `DELETE` | `/api/lessons/:lessonId/complete` | Autenticado | Desmarca lección |
| `GET` | `/api/courses/:courseId/progress` | Autenticado | Calcula porcentaje, lecciones vistas y última lección |

### 🧠 Evaluaciones & Quizzes (`/api/quizzes`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/quizzes/:id` | Público | Obtiene preguntas del quiz (**`is_correct` nunca viaja al cliente**) |
| `POST` | `/api/quizzes/:id/submit` | Autenticado | Envía respuestas; el servidor evalúa, puntúa y registra intento |
| `GET` | `/api/quizzes/:id/attempts` | Autenticado | Historial de intentos del usuario |
| `POST` | `/api/quizzes` | **Admin** | Crea o actualiza evaluación con respuestas correctas |

### 📜 Certificados (`/api/certificates`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/certificates` | Autenticado | Lista certificados obtenidos por el usuario |
| `GET` | `/api/certificates/:code` | Público | Verificación pública mediante código oficial `SKL-YYYY-XXXXX` |
| `POST` | `/api/certificates` | Autenticado | Emite certificado tras validar 100% de lecciones + quiz aprobado |

### 👨💼 Panel de Administración (`/api/admin`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | **Admin** | Estadísticas globales (estudiantes, cursos, inscripciones, completados) |
| `GET` | `/api/admin/students` | **Admin** | Directorio de alumnos registrados con métricas académicas |
| `GET` | `/api/admin/students/:id` | **Admin** | Ficha académica detallada de un estudiante con historial |

---

## 🗄️ Modelo de Datos PostgreSQL (13 Tablas)

1. `users`: Identidad, credenciales (`password_hash`), roles (`student`, `admin`), avatar y biografía.
2. `categories`: Áreas de conocimiento y slugs de filtrado.
3. `courses`: Catálogo con metadatos, nivel, duración, estado (`draft`, `published`, `archived`) y JSON de objetivos/requisitos.
4. `course_modules`: Módulos temáticos por curso ordenados por `order_index`.
5. `lessons`: Lecciones (`video`, `article`, `quiz`) con contenido, URL y duración.
6. `enrollments`: Inscripciones con restricción `UNIQUE(user_id, course_id)`.
7. `lesson_progress`: Progreso granular con restricción `UNIQUE(user_id, lesson_id)`.
8. `quizzes`: Cuestionarios vinculados con puntaje de aprobación (`passing_score`).
9. `quiz_questions`: Preguntas por evaluación.
10. `quiz_options`: Opciones con indicador protegido `is_correct`.
11. `quiz_attempts`: Historial de calificaciones y estado de aprobación.
12. `quiz_answers`: Registro de opciones elegidas y aciertos calculados en servidor.
13. `certificates`: Certificados oficiales con restricción `UNIQUE(certificate_code)`.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/chulox20/SKILLORA.git
cd SKILLORA
```

### 2. Instalar dependencias
```bash
# Instalar todo en frontend y backend
npm run install:all
```

### 3. Configurar Variables de Entorno

**Backend (`backend/.env`):**
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/skillora
JWT_SECRET=skillora_super_secure_jwt_secret_key_2026_edu
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000,http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Sembrar la Base de Datos
```bash
npm run seed
```

### 5. Iniciar Servidores de Desarrollo

**Terminal 1 — Backend API:**
```bash
npm run dev:backend
# Servidor escuchando en http://localhost:4000/api
```

**Terminal 2 — Frontend SPA:**
```bash
npm run dev:frontend
# Aplicación lista en http://localhost:3000
```

---

## 👥 Cuentas Demo para Evaluación Rápida

La aplicación cuenta con botones de **1-Click Demo** en la barra superior:

- 👨🎓 **Estudiante Demo**: `estudiante@skillora.edu` / `password123`
- 👨💼 **Administrador Demo**: `admin@skillora.edu` / `adminpassword`

---

## 📄 Licencia

MIT License — Creado como plataforma LMS educativa moderna y modular.
