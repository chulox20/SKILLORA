import { pool, isDbConnected } from './database.js';
import { hashPassword } from '../utils/password.js';
import { authService } from '../services/authService.js';
import { courseService } from '../services/courseService.js';
import { quizService } from '../services/quizService.js';
import { enrollmentService } from '../services/enrollmentService.js';
import { progressService } from '../services/progressService.js';
import { certificateService } from '../services/certificateService.js';

export async function seedInitialData() {
  console.log('🌱 [Seed] Preparing seed dataset...');

  // 1. Password hashes
  const adminHash = await hashPassword('adminpassword');
  const studentHash = await hashPassword('password123');

  // 2. Demo Users
  const adminUser = {
    id: 'user-admin-1',
    full_name: 'Administrador Skillora',
    email: 'admin@skillora.edu',
    password_hash: adminHash,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    phone: '+1 (555) 999-0000',
    bio: 'Director de contenidos y curador académico en Skillora.',
    created_at: new Date().toISOString(),
  };

  const studentUser = {
    id: 'user-student-1',
    full_name: 'Jesús Figueroa',
    email: 'estudiante@skillora.edu',
    password_hash: studentHash,
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    phone: '+1 (555) 234-5678',
    bio: 'Estudiante apasionado por el desarrollo web y React.',
    created_at: new Date().toISOString(),
  };

  authService.seedUser(adminUser);
  authService.seedUser(studentUser);

  // 3. Categories
  const categories = [
    {
      id: 'cat-1',
      name: 'Desarrollo',
      slug: 'desarrollo',
      description: 'Aprende frontend, backend, frameworks modernos y desarrollo web fullstack.',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      icon: 'Code2',
    },
    {
      id: 'cat-2',
      name: 'Diseño',
      slug: 'diseno',
      description: 'Domina UI/UX, Figma, sistemas de diseño y prototipado profesional.',
      image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
      icon: 'Palette',
    },
    {
      id: 'cat-3',
      name: 'Negocios',
      slug: 'negocios',
      description: 'Estrategias de emprendimiento, finanzas, modelos de negocio y liderazgo.',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      icon: 'Briefcase',
    },
    {
      id: 'cat-4',
      name: 'Marketing',
      slug: 'marketing',
      description: 'Growth hacking, SEO, redes sociales, embudos de venta y copywriting.',
      image_url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=600&auto=format&fit=crop&q=80',
      icon: 'Megaphone',
    },
    {
      id: 'cat-5',
      name: 'Inteligencia Artificial',
      slug: 'ia',
      description: 'Machine Learning, LLMs, prompt engineering y automatización con IA.',
      image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      icon: 'Brain',
    },
    {
      id: 'cat-6',
      name: 'Productividad',
      slug: 'productividad',
      description: 'Gestión de proyectos, hábitos efectivos, Notion, metodologías ágiles y foco.',
      image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80',
      icon: 'TrendingUp',
    },
  ];

  categories.forEach((cat) => courseService.seedCategory(cat));

  // 4. Courses with full syllabus
  const reactCourse = {
    id: 'course-1',
    category_id: 'cat-1',
    category_name: 'Desarrollo Web',
    title: 'React desde cero',
    slug: 'react-desde-cero',
    short_description: 'Domina React 19 construyendo aplicaciones interactivas y proyectos reales paso a paso.',
    description:
      'Aprende los fundamentos y conceptos avanzados de React. Comprende el Virtual DOM, domina los Hooks fundamentales (useState, useEffect, useMemo, useRef), gestiona el estado global y construye una aplicación completa lista para producción.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    level: 'beginner',
    duration: '6h 30m',
    rating: 4.9,
    reviews_count: 128,
    students_count: 245,
    status: 'published',
    objectives: [
      'Componentes React y arquitectura declarativa',
      'Hooks esenciales (useState, useEffect, useRef, useMemo)',
      'Gestión de estado local y global',
      'Routing dinámico con React Router',
      'Consumo de APIs asíncronas',
      'Proyecto final con despliegue en producción',
    ],
    requirements: [
      'Conocimientos básicos de HTML, CSS y JavaScript (ES6+)',
      'Computadora con Node.js y editor de código',
    ],
    instructor: {
      name: 'Carlos Mendoza',
      role: 'Senior Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    modules: [
      {
        id: 'mod-1',
        course_id: 'course-1',
        title: 'Módulo 1 — Fundamentos',
        description: 'Aprende qué es React, cómo funciona JSX y la creación de tus primeros componentes.',
        order_index: 1,
        lessons: [
          {
            id: 'les-1-1',
            module_id: 'mod-1',
            title: '01 Introducción a React',
            slug: '01-introduccion-a-react',
            description: 'Bienvenida al curso y visión general de lo que construirás.',
            type: 'video',
            video_url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
            duration: '15 min',
            order_index: 1,
            content: 'En esta primera lección cubrimos la arquitectura de React y configuramos nuestro entorno con Node.js y Express.',
          },
          {
            id: 'les-1-2',
            module_id: 'mod-1',
            title: '02 ¿Qué es React y el Virtual DOM?',
            slug: '02-que-es-react-virtual-dom',
            description: 'Comprende cómo React optimiza el renderizado mediante el Virtual DOM.',
            type: 'article',
            duration: '20 min',
            order_index: 2,
            content: `# ¿Qué es React y el Virtual DOM?

React es una librería de JavaScript declarativa y eficiente para construir interfaces de usuario.

### Principios Clave:
1. **Basado en Componentes**: Cada parte de la UI es una función reutilizable.
2. **Virtual DOM**: Representación en memoria que minimiza mutaciones costosas en el DOM real.
3. **Flujo de datos unidireccional**: Los datos fluyen de padres a hijos a través de props.

\`\`\`jsx
function WelcomeCard({ name }) {
  return (
    <div className="card">
      <h2>¡Bienvenido, {name}!</h2>
    </div>
  );
}
\`\`\`
`,
          },
          {
            id: 'les-1-3',
            module_id: 'mod-1',
            title: '03 Componentes y Props',
            slug: '03-componentes-y-props',
            description: 'Creación de componentes funcionales y paso de propiedades unidireccionales.',
            type: 'video',
            video_url: 'https://www.youtube.com/watch?v=kVeOpcw4GWY',
            duration: '25 min',
            order_index: 3,
          },
        ],
      },
      {
        id: 'mod-2',
        course_id: 'course-1',
        title: 'Módulo 2 — Estado y Hooks',
        description: 'Controla la interactividad con useState, eventos y formularios controlados.',
        order_index: 2,
        lessons: [
          {
            id: 'les-2-1',
            module_id: 'mod-2',
            title: '04 useState: Manejo de Estado',
            slug: '04-usestate-manejo-de-estado',
            description: 'Comprende el hook más fundamental de React.',
            type: 'video',
            video_url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
            duration: '30 min',
            order_index: 1,
          },
          {
            id: 'les-2-2',
            module_id: 'mod-2',
            title: '05 Manejo de Eventos',
            slug: '05-manejo-de-eventos',
            description: 'Synthetic events, onClick, onChange y buenas prácticas.',
            type: 'article',
            duration: '20 min',
            order_index: 2,
            content: `# Manejo de Eventos en React

React utiliza Synthetic Events para asegurar compatibilidad en todos los navegadores.

\`\`\`jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicks: {count}
    </button>
  );
}
\`\`\`
`,
          },
          {
            id: 'les-2-3',
            module_id: 'mod-2',
            title: '06 Formularios y Controlled Components',
            slug: '06-formularios-controlled-components',
            description: 'Inputs controlados, validación y manejo de submit.',
            type: 'video',
            video_url: 'https://www.youtube.com/watch?v=7Vo_VCcWupQ',
            duration: '35 min',
            order_index: 3,
          },
        ],
      },
      {
        id: 'mod-3',
        course_id: 'course-1',
        title: 'Módulo 3 — Proyecto y Certificación',
        description: 'Construye la aplicación final y realiza la evaluación para certificarte.',
        order_index: 3,
        lessons: [
          {
            id: 'les-3-1',
            module_id: 'mod-3',
            title: '07 Construcción del Proyecto Final',
            slug: '07-construccion-proyecto-final',
            description: 'Integración completa de componentes, hooks y llamadas a APIs REST.',
            type: 'video',
            video_url: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
            duration: '45 min',
            order_index: 1,
          },
          {
            id: 'les-3-2',
            module_id: 'mod-3',
            title: '08 Quiz y Evaluación Final',
            slug: '08-quiz-evaluacion-final',
            description: 'Demuestra tus conocimientos para obtener tu certificado oficial.',
            type: 'quiz',
            quiz_id: 'quiz-react-1',
            duration: '20 min',
            order_index: 2,
          },
        ],
      },
    ],
  };

  courseService.seedCourse(reactCourse);

  // 5. Quiz with SECURE correct answers stored on server
  const reactQuiz = {
    id: 'quiz-react-1',
    lesson_id: 'les-3-2',
    course_id: 'course-1',
    title: 'Evaluación de Certificación: React desde Cero',
    passing_score: 70,
    questions: [
      {
        id: 'q-1',
        question: '¿Cuál hook permite manejar estado local en un componente funcional de React?',
        options: [
          { id: 'opt-1-1', option_text: 'useEffect', is_correct: false },
          { id: 'opt-1-2', option_text: 'useState', is_correct: true },
          { id: 'opt-1-3', option_text: 'useMemo', is_correct: false },
          { id: 'opt-1-4', option_text: 'useRef', is_correct: false },
        ],
      },
      {
        id: 'q-2',
        question: '¿Qué es React?',
        options: [
          { id: 'opt-2-1', option_text: 'Un framework backend para Node.js', is_correct: false },
          { id: 'opt-2-2', option_text: 'Una librería JavaScript declarativa para interfaces de usuario', is_correct: true },
          { id: 'opt-2-3', option_text: 'Un motor de base de datos relacional', is_correct: false },
          { id: 'opt-2-4', option_text: 'Un sistema operativo para servidores', is_correct: false },
        ],
      },
      {
        id: 'q-3',
        question: '¿Cómo se pasan datos de un componente padre a un componente hijo en React?',
        options: [
          { id: 'opt-3-1', option_text: 'A través de Props (Propiedades)', is_correct: true },
          { id: 'opt-3-2', option_text: 'Mediante variables globales en window', is_correct: false },
          { id: 'opt-3-3', option_text: 'Modificando directamente el DOM real', is_correct: false },
          { id: 'opt-3-4', option_text: 'No es posible pasar datos entre componentes', is_correct: false },
        ],
      },
      {
        id: 'q-4',
        question: '¿Para qué sirve el hook useEffect?',
        options: [
          { id: 'opt-4-1', option_text: 'Para ejecutar efectos secundarios (peticiones API, timers, suscripciones)', is_correct: true },
          { id: 'opt-4-2', option_text: 'Para estilizar elementos con CSS únicamente', is_correct: false },
          { id: 'opt-4-3', option_text: 'Para crear bases de datos en memoria', is_correct: false },
          { id: 'opt-4-4', option_text: 'Para reiniciar la máquina del cliente', is_correct: false },
        ],
      },
      {
        id: 'q-5',
        question: '¿Qué ventaja principal ofrece el Virtual DOM en React?',
        options: [
          { id: 'opt-5-1', option_text: 'Calcula diferencias en memoria y actualiza sólo los nodos modificados en el DOM real', is_correct: true },
          { id: 'opt-5-2', option_text: 'Reemplaza completamente HTML y CSS por código binario', is_correct: false },
          { id: 'opt-5-3', option_text: 'Ejecuta consultas SQL en el navegador', is_correct: false },
          { id: 'opt-5-4', option_text: 'Aumenta el consumo de memoria en 500%', is_correct: false },
        ],
      },
    ],
  };

  quizService.seedQuiz(reactQuiz);

  // 6. Sample Initial Enrollment & Progress for demo student
  enrollmentService.seedEnrollment({
    id: 'enr-1',
    user_id: 'user-student-1',
    course_id: 'course-1',
    status: 'active',
    enrolled_at: '2026-02-01T10:00:00Z',
    completed_at: null,
  });

  ['les-1-1', 'les-1-2', 'les-1-3', 'les-2-1', 'les-2-2', 'les-2-3'].forEach((lesId) => {
    progressService.seedProgress({
      id: `prog-${lesId}`,
      user_id: 'user-student-1',
      lesson_id: lesId,
      completed: true,
      completed_at: new Date().toISOString(),
    });
  });

  console.log('✅ [Seed] Initial dataset seeded successfully into backend services.');
}

// Standalone execution: node src/db/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedInitialData().then(() => {
    console.log('🎉 Seed completed.');
    process.exit(0);
  });
}
