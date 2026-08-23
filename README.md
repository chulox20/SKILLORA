# 🎓 SKILLORA — Aprende. Practica. Evoluciona.

> Plataforma de aprendizaje en línea moderna, educativa, tecnológica y amigable (LMS - Learning Management System) desarrollada con **React, Vite, Tailwind CSS, Framer Motion y Supabase**.

---

## 🌟 Características Principales

### 👨🎓 Experiencia del Estudiante
- **Catálogo Interactivo**: Exploración de cursos con filtros combinados por Categoría (Desarrollo, Diseño, IA, Negocios, Marketing, Productividad), Nivel de dificultad, Duración y Criterios de ordenación.
- **Detalle del Curso**: Ficha completa con temario desglosado por módulos y lecciones, objetivos clave, requisitos previos y perfil del instructor.
- **Inscripción en 1-Click**: Sistema de inscripciones sin fricción con persistencia relacional (`enrollments`).
- **Dashboard del Estudiante**: Resumen visual con curso actual en progreso, porcentaje completado, métricas (cursos inscritos, completados, horas aprendidas y certificados obtenidos).
- **Aula Virtual / Reproductor Inmersivo (`/learn/:courseSlug/:lessonSlug`)**:
  - Lecciones en **Video** (YouTube / MP4).
  - Lecciones de **Artículo de Lectura** (Markdown formateado con snippets de código y botón de copiado).
  - Lecciones de **Quiz Interactivo** integradas.
  - Navegación fluida: `[← Anterior]`, `[Marcar como completada ✓]`, `[Siguiente →]`.
  - Barra lateral colapsable y adaptable a móviles.
- **Motor de Evaluaciones y Quizzes**:
  - Preguntas de opción múltiple con avance paso a paso.
  - Calificación instantánea con umbral de aprobación ($\ge 70\%$).
  - Retroalimentación detallada con desglose de respuestas correctas/incorrectas y opción de reintento.
- **Certificaciones Oficiales Verificables**:
  - Generación automática de certificados oficiales con código único (`SKL-2026-XXXXX`).
  - Animación de confeti y vistas verificables públicamente.
  - Descarga instantánea en **PDF de alta resolución** o **PNG**.
- **Gestión de Perfil**: Actualización de avatar, datos personales, biografía y consulta de historial académico.

---

### 👨💼 Panel de Control Administrativo (`/admin`)
- **Dashboard con Métricas Globales**: Total de estudiantes, cursos publicados, volumen de inscripciones y tasa de finalización.
- **Gestión Completa de Cursos**:
  - Creación y edición con campos detallados, objetivos y requisitos.
  - Duplicación de cursos con 1 click.
  - Publicación y despublicación en tiempo real.
  - Eliminación con confirmación segura.
- **Editor Visual de Módulos y Lecciones**:
  - Creación y ordenación de módulos temáticos.
  - Creación de lecciones de video, artículo y quiz.
- **Constructor de Quizzes**:
  - Creación de preguntas, opciones dinámicas y marcación visual de la respuesta correcta.
  - Configuración del puntaje mínimo de aprobación.
- **Gestión y Ficha Académica de Estudiantes**:
  - Directorio de estudiantes registrados.
  - Consulta de expedientes con cursos activos, progreso porcentual, historial de intentos y certificados emitidos.
- **Gestión de Categorías**:
  - Administración de áreas de conocimiento, iconos y descripción.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6 |
| **Estilos & UI** | Tailwind CSS, Lucide React, Framer Motion, Clsx, Tailwind Merge |
| **Formularios & Validación** | React Hook Form, Zod, @hookform/resolvers |
| **Certificados & Exportación** | jsPDF, html2canvas, canvas-confetti |
| **Backend & Base de Datos** | Supabase (PostgreSQL, Row Level Security, Auth, Storage) |
| **Modo Híbrido** | Soporte dual Supabase Live + Fallback offline con seed data completo en LocalStorage |

---

## 🗄️ Esquema de Base de Datos (13 Tablas)

El proyecto incluye scripts SQL completos en `supabase/schema.sql` y `supabase/seed.sql`:

1. `profiles` — Perfiles de usuario (roles `student` y `admin`).
2. `categories` — Categorías temáticas de cursos.
3. `courses` — Catálogo de cursos con niveles, duración y estado (`draft`, `published`, `archived`).
4. `course_modules` — Módulos temáticos por curso.
5. `lessons` — Lecciones individuales (`video`, `article`, `quiz`).
6. `enrollments` — Inscripciones únicas por estudiante y curso.
7. `lesson_progress` — Registro granular de lecciones completadas.
8. `quizzes` — Evaluaciones vinculadas a lecciones.
9. `quiz_questions` — Preguntas de opción múltiple.
10. `quiz_options` — Alternativas de respuesta con indicador de acierto.
11. `quiz_attempts` — Historial de intentos con puntuación y estado de aprobación.
12. `quiz_answers` — Respuestas detalladas por intento.
13. `certificates` — Certificados emitidos con código único de validación.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/chulox20/SKILLORA.git
cd SKILLORA
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (Opcional)
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```
Configura tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> **Nota**: Si no configuras Supabase, Skillora funcionará inmediatamente en **Modo Local Híbrido** con datos precargados realistas y persistencia en el navegador.

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

### 5. Compilar para Producción
```bash
npm run build
```

---

## 👥 Cuentas Demo para Evaluación Rápida

La aplicación cuenta con botones de acceso rápido de 1-click en la barra superior y en `/login`:

- **👨🎓 Estudiante Demo**:
  - Email: `estudiante@skillora.edu`
  - Contraseña: `password123`
- **👨💼 Administrador Demo**:
  - Email: `admin@skillora.edu`
  - Contraseña: `adminpassword`

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Diseñado para la comunidad de desarrolladores y estudiantes.
