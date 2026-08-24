# 🎓 SKILLORA — Aprende. Practica. Evoluciona.

> Plataforma LMS (*Learning Management System*) fullstack moderna, desacoplada y lista para producción. Desarrollada con **React 18 + Vite** en el frontend y un **Backend propio en Node.js + Express + PostgreSQL + JWT + bcrypt + Zod** (completamente independiente de servicios BaaS / Supabase).

---

## 🏛️ Arquitectura del Sistema

Skillora implementa una arquitectura cliente-servidor desacoplada basada en servicios REST, validación estricta en tiempo de ejecución y autenticación mediante JSON Web Tokens:

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (SPA)                         │
│   React 18 + Vite + Tailwind CSS + Framer Motion + Lucide   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ HTTP / REST API (JSON)
                               │ Headers: Authorization: Bearer <JWT>
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (API REST)                     │
│               Node.js + Express (ES Modules)                │
│                                                             │
│  ├── 🔐 Autenticación & Hashing Seguro (JWT + bcryptjs)     │
│  ├── 🛡️  Control de Acceso Basado en Roles (Student / Admin) │
│  ├── 🚦 Rate Limiting en Endpoints Sensibles                │
│  ├── ⚙️  Validación Estricta de Esquemas con Zod            │
│  ├── 🧠 Motor de Evaluación Anti-Cheat en Servidor          │
│  ├── 📜 Validación Estricta de Certificaciones (UUID)       │
│  └── 🚫 Fail-Fast Config: Cero secretos por defecto         │
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

## 📁 Estructura del Repositorio

El proyecto está organizado en dos módulos independientes y desacoplados:

```
SKILLORA/
├── frontend/                     # Aplicación Cliente (SPA)
│   ├── public/                   # Favicon y recursos estáticos
│   ├── src/
│   │   ├── components/           # Componentes UI reutilizables
│   │   │   ├── admin/            # Editor de temarios, modal de quizzes, detalles de alumnos
│   │   │   ├── common/           # Botones, tarjetas, modales, badges, skeletons
│   │   │   ├── courses/          # Tarjetas de catálogo, filtros, temario y hero
│   │   │   ├── layout/           # Navbar, Footer, StudentLayout, AdminLayout
│   │   │   ├── learning/         # Reproductor de video, lector markdown, barra lateral
│   │   │   └── quizzes/          # Tarjetas de preguntas y modal de resultados
│   │   ├── contexts/             # AuthContext (JWT) y NotificationContext (Toasts)
│   │   ├── pages/                # Vistas de la aplicación
│   │   │   ├── admin/            # Dashboard admin, cursos, quizzes, estudiantes, categorías
│   │   │   ├── auth/             # Login, Registro y Recuperación
│   │   │   ├── public/           # Home, Catálogo y Detalle de Curso
│   │   │   └── student/          # Dashboard alumno, mis cursos, aula virtual, certificados, perfil
│   │   ├── routes/               # AppRoutes, ProtectedRoute y AdminRoute
│   │   ├── services/
│   │   │   ├── apiClient.js      # Cliente HTTP centralizado con inyección automática de JWT
│   │   │   ├── authService.js    # Auth, registro, login y tokens JWT
│   │   │   ├── courseService.js  # Cursos, módulos y lecciones
│   │   │   ├── enrollmentService.js # Inscripciones de alumnos
│   │   │   ├── progressService.js   # Registro de lecciones completadas
│   │   │   ├── quizService.js    # Consumo de evaluaciones
│   │   │   ├── certificateService.js # Verificación y descarga de certificados
│   │   │   └── adminService.js   # Métricas y fichas académicas
│   │   ├── styles/               # Directivas de Tailwind CSS
│   │   ├── utils/                # Generador de PDF/PNG (jsPDF + html2canvas) y formateadores
│   │   ├── App.jsx               # Enrutador principal y Providers
│   │   └── main.jsx              # Punto de entrada de React
│   ├── package.json              # Dependencias del frontend (sin Supabase)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/                      # Servidor API REST
│   ├── src/
│   │   ├── config/               # Variables de entorno con validación estricta
│   │   │   └── config.js         # (Falla inmediatamente si falta JWT_SECRET o DATABASE_URL)
│   │   ├── controllers/          # Controladores HTTP desacoplados
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── categoryController.js
│   │   │   ├── enrollmentController.js
│   │   │   ├── progressController.js
│   │   │   ├── quizController.js
│   │   │   ├── certificateController.js
│   │   │   └── adminController.js
│   │   ├── middleware/           # Middlewares de Express
│   │   │   ├── authMiddleware.js # Extracción y verificación Bearer JWT
│   │   │   ├── roleMiddleware.js # Control de acceso por roles (admin, student)
│   │   │   ├── errorMiddleware.js# Manejo centralizado de errores
│   │   │   └── validate.js       # Validación de esquemas Zod
│   │   ├── routes/               # Rutas modulares montadas en /api
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── enrollmentRoutes.js
│   │   │   ├── progressRoutes.js
│   │   │   ├── quizRoutes.js
│   │   │   ├── certificateRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   └── index.js
│   │   ├── services/             # Lógica de negocio y persistencia en PostgreSQL
│   │   │   ├── authService.js
│   │   │   ├── courseService.js
│   │   │   ├── enrollmentService.js
│   │   │   ├── progressService.js
│   │   │   ├── quizService.js    # Motor de evaluación y protección anti-cheat
│   │   │   ├── certificateService.js # Emisión estricta (100% lecciones + quiz aprobado + inscripción)
│   │   │   └── adminService.js
│   │   ├── validators/           # Esquemas Zod para request bodies y params
│   │   ├── utils/                # Utilidades de JWT y bcrypt
│   │   │   ├── jwt.js
│   │   │   └── password.js
│   │   ├── db/
│   │   │   ├── database.js       # Pool de conexiones PostgreSQL (pg)
│   │   │   ├── schema.sql        # Esquema DDL con 13 tablas relacionales e índices
│   │   │   └── seed.js           # Script de creación de tablas y datos iniciales
│   │   ├── app.js                # Configuración de Express, CORS y middlewares
│   │   └── server.js             # Punto de entrada del servidor en puerto 4000
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── package.json                  # Scripts raíz para coordinar frontend y backend
└── README.md
```

---

## 🔌 Colección de Endpoints REST API

### 🔐 Autenticación (`/api/auth`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registra nuevo estudiante (`role: 'student'`) y entrega token JWT |
| `POST` | `/api/auth/login` | Público | Valida credenciales con `bcrypt.compare` y entrega token JWT |
| `GET` | `/api/auth/me` | Autenticado | Obtiene perfil del usuario activo a partir del token JWT |
| `PUT` | `/api/auth/profile` | Autenticado | Actualiza datos del perfil (nombre, avatar, teléfono, bio) |
| `POST` | `/api/auth/forgot-password` | Público | Solicita restablecimiento de contraseña |

### 📚 Cursos y Temarios (`/api/courses`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Público | Lista cursos con filtros (categoría, nivel, duración, búsqueda, orden) |
| `GET` | `/api/courses/:slug` | Público | Detalle completo de curso con módulos y lecciones |
| `POST` | `/api/courses` | **Admin** | Crea un nuevo curso con validación Zod |
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
| `GET` | `/api/quizzes/:id` | **Inscrito / Admin** | Obtiene preguntas del quiz (**`is_correct` nunca viaja al cliente**) |
| `POST` | `/api/quizzes/:id/submit` | Autenticado | Envía respuestas; el servidor evalúa, puntúa y registra intento |
| `GET` | `/api/quizzes/:id/attempts` | Autenticado | Historial de intentos del usuario |
| `POST` | `/api/quizzes` | **Admin** | Crea o actualiza evaluación con respuestas correctas |

### 📜 Certificados (`/api/certificates`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/certificates` | Autenticado | Lista certificados obtenidos por el usuario |
| `GET` | `/api/certificates/:code` | Público | Verificación pública mediante código oficial `SKL-YYYY-XXXXXXXX` |
| `POST` | `/api/certificates` | Autenticado | Emite certificado tras validar 100% de lecciones + quiz aprobado + inscripción |

### 👨💼 Panel de Administración (`/api/admin`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | **Admin** | Estadísticas globales (estudiantes, cursos, inscripciones, completados) |
| `GET` | `/api/admin/students` | **Admin** | Directorio de alumnos registrados con métricas académicas |
| `GET` | `/api/admin/students/:id` | **Admin** | Ficha académica detallada de un estudiante con historial |

---

## 🗄️ Esquema de Base de Datos PostgreSQL (13 Tablas)

El archivo `backend/src/db/schema.sql` define la estructura relacional completa:

1. `users`: Identidad, credenciales (`password_hash`), roles (`student`, `admin`), avatar, teléfono y biografía.
2. `categories`: Áreas de conocimiento y slugs de navegación.
3. `courses`: Catálogo con metadatos, nivel, duración, estado (`draft`, `published`, `archived`) y JSON de objetivos/requisitos.
4. `course_modules`: Módulos temáticos por curso ordenados por `order_index`.
5. `lessons`: Lecciones (`video`, `article`, `quiz`) con contenido markdown, video URL y duración.
6. `enrollments`: Inscripciones con restricción `UNIQUE(user_id, course_id)`.
7. `lesson_progress`: Progreso granular con restricción `UNIQUE(user_id, lesson_id)`.
8. `quizzes`: Evaluaciones vinculadas a cursos o lecciones con puntaje de aprobación (`passing_score`).
9. `quiz_questions`: Preguntas de opción múltiple por evaluación.
10. `quiz_options`: Opciones de respuesta con indicador protegido `is_correct`.
11. `quiz_attempts`: Historial de intentos con puntuación y estado (`passed`).
12. `quiz_answers`: Registro detallado de respuestas evaluadas en el servidor.
13. `certificates`: Certificados oficiales emitidos con restricción `UNIQUE(certificate_code)`.

---

## 🛡️ Seguridad y Buenas Prácticas

- **Cero Secretos Hardcodeados**: `config.js` implementa validación estricta en el arranque (`fail-fast`). No existen claves de respaldo en el código fuente.
- **Cero Contraseñas en Texto Plano**: Hashing seguro con `bcryptjs` (10 rondas de salting).
- **Protección Anti-Cheat en Evaluaciones**: La columna `is_correct` reside y se procesa únicamente en PostgreSQL. El cliente solo recibe identificadores de preguntas y opciones.
- **Acceso Restringido a Quizzes**: El endpoint `GET /api/quizzes/:id` exige que el alumno esté inscrito en el curso correspondiente o sea administrador.
- **Emisión Blindada de Certificados**: `POST /api/certificates` verifica directamente en base de datos la combinación de:
  1. Inscripción activa en `enrollments`.
  2. 100% de lecciones completadas en `lesson_progress`.
  3. Intento con calificación aprobatoria ($\ge 70\%$) en `quiz_attempts`.
- **Generación Basada en UUID**: Códigos de verificación únicos derivados de identificadores criptográficos `crypto.randomUUID()` (`SKL-2026-XXXXXXXX`).
- **Rate Limiting**: `express-rate-limit` protegiendo los endpoints de autenticación contra ataques de fuerza bruta.
- **CORS Configurado**: Restringido a los orígenes autorizados del frontend (`http://localhost:3000`, `http://localhost:5173`).

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/chulox20/SKILLORA.git
cd SKILLORA
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar Variables de Entorno

**Backend (`backend/.env`):**
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/skillora
JWT_SECRET=tu_clave_secreta_jwt_larga_y_segura_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000,http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Inicializar y Sembrar la Base de Datos
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

## 👥 Cuentas Demo de Acceso Rápido

El sistema incluye botones de **1-Click Demo** en la barra de navegación superior:

- 👨🎓 **Estudiante Demo**: `estudiante@skillora.edu` / `password123`
- 👨💼 **Administrador Demo**: `admin@skillora.edu` / `adminpassword`

---

## 📄 Licencia

MIT License — Desarrollado como plataforma LMS educativa, moderna y modular.
