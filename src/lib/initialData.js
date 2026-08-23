// Initial default mock data structured exactly like Supabase tables
export const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Desarrollo',
    slug: 'desarrollo',
    description: 'Aprende frontend, backend, frameworks modernos y desarrollo web fullstack.',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    icon: 'Code2',
    courses_count: 3,
  },
  {
    id: 'cat-2',
    name: 'Diseño',
    slug: 'diseno',
    description: 'Domina UI/UX, Figma, sistemas de diseño y prototipado profesional.',
    image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    icon: 'Palette',
    courses_count: 1,
  },
  {
    id: 'cat-3',
    name: 'Negocios',
    slug: 'negocios',
    description: 'Estrategias de emprendimiento, finanzas, modelos de negocio y liderazgo.',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    icon: 'Briefcase',
    courses_count: 1,
  },
  {
    id: 'cat-4',
    name: 'Marketing',
    slug: 'marketing',
    description: 'Growth hacking, SEO, redes sociales, embudos de venta y copywriting.',
    image_url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=600&auto=format&fit=crop&q=80',
    icon: 'Megaphone',
    courses_count: 1,
  },
  {
    id: 'cat-5',
    name: 'Inteligencia Artificial',
    slug: 'ia',
    description: 'Machine Learning, LLMs, prompt engineering y automatización con IA.',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    icon: 'Brain',
    courses_count: 1,
  },
  {
    id: 'cat-6',
    name: 'Productividad',
    slug: 'productividad',
    description: 'Gestión de proyectos, hábitos efectivos, Notion, metodologías ágiles y foco.',
    image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80',
    icon: 'TrendingUp',
    courses_count: 1,
  },
];

export const INITIAL_COURSES = [
  {
    id: 'course-1',
    category_id: 'cat-1',
    category_name: 'Desarrollo Web',
    title: 'React desde cero',
    slug: 'react-desde-cero',
    short_description: 'Domina React 19 construyendo aplicaciones interactivas y proyectos reales paso a paso.',
    description: 'Aprende los fundamentos y conceptos avanzados de React. Comprende el Virtual DOM, domina los Hooks fundamentales (useState, useEffect, useMemo, useRef), gestiona el estado global y construye una aplicación completa lista para producción.',
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
      'Proyecto final con despliegue en producción'
    ],
    requirements: [
      'Conocimientos básicos de HTML, CSS y JavaScript (ES6+)',
      'Computadora con Node.js y editor de código (VS Code recomendado)',
      'Ganas de aprender y crear proyectos reales'
    ],
    instructor: {
      name: 'Carlos Mendoza',
      role: 'Senior Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
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
            content: 'En esta lección cubrimos la arquitectura de React, el ecosistema moderno y configuramos nuestro entorno con Vite y Node.js.'
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
            content: `## ¿Qué es React y el Virtual DOM?

React es una librería de JavaScript para construir interfaces de usuario basada en componentes.

### Principios Fundamentales:
1. **Declarativo**: Describes cómo debe lucir la UI para cualquier estado.
2. **Basado en Componentes**: Cada parte de la interfaz es una función reutilizable.
3. **Virtual DOM**: Representación ligera del DOM en memoria para minimizar cambios costosos en el navegador.

\`\`\`jsx
function Greeting({ name }) {
  return (
    <div className="card">
      <h2>¡Hola, {name}!</h2>
      <p>Bienvenido al fascinante mundo de React.</p>
    </div>
  );
}
\`\`\`
`
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
            content: 'Aprende a estructurar componentes modulares, definir props con valores por defecto y pasar funciones callback como props.'
          }
        ]
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
            content: 'El hook useState te permite añadir variables de estado a tus componentes funcionales y desencadenar re-renders al modificarlas.'
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
            content: `## Manejo de Eventos en React

React utiliza un sistema de **Synthetic Events** para garantizar un comportamiento uniforme en todos los navegadores.

### Sintaxis básica:
\`\`\`jsx
function ButtonExample() {
  const handleClick = (e) => {
    e.preventDefault();
    alert('¡Botón presionado!');
  };

  return (
    <button onClick={handleClick} className="btn-primary">
      Haz click aquí
    </button>
  );
}
\`\`\`
`
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
            content: 'Gestiona entradas de texto, textareas, selectors y validaciones sincronizadas con el estado de React.'
          }
        ]
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
            description: 'Integración completa de componentes, hooks y consumo de datos.',
            type: 'video',
            video_url: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
            duration: '45 min',
            order_index: 1,
            content: 'Ensamblaje del proyecto final conectando estado, routing y llamadas asíncronas.'
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
            content: 'Responde correctamente al menos el 70% de las preguntas de la evaluación para graduarte y desbloquear tu certificado oficial.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    category_id: 'cat-2',
    category_name: 'Diseño UI/UX',
    title: 'UI/UX Design con Figma',
    slug: 'ui-ux-design-con-figma',
    short_description: 'Crea interfaces visuales increíbles, design systems escalables y prototipos interactivos.',
    description: 'Domina Figma desde el nivel básico hasta el diseño de sistemas complejos. Aprende auto-layout, componentes con variantes, tokens de diseño y cómo preparar tus entregables para desarrolladores.',
    thumbnail_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    level: 'intermediate',
    duration: '8h 15m',
    rating: 4.95,
    reviews_count: 94,
    students_count: 183,
    status: 'published',
    objectives: [
      'Fundamentos de diseño de interfaces modernas',
      'Auto-Layout avanzado y componentes con variantes',
      'Creación de Design Systems con tokens y estilos globales',
      'Prototipado interactivo y animaciones micro-interactivas'
    ],
    requirements: [
      'Cuenta gratuita de Figma',
      'No se requiere experiencia previa en diseño'
    ],
    instructor: {
      name: 'Sofía Valenzuela',
      role: 'Lead Product Designer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    modules: [
      {
        id: 'mod-2-1',
        course_id: 'course-2',
        title: 'Módulo 1 — Fundamentos de Figma',
        description: 'Entorno de trabajo, frames, vectores y jerarquía visual.',
        order_index: 1,
        lessons: [
          {
            id: 'les-2-1-1',
            module_id: 'mod-2-1',
            title: '01 Introducción a Figma',
            slug: '01-introduccion-a-figma',
            description: 'Tour por la interfaz y herramientas principales.',
            type: 'video',
            video_url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
            duration: '20 min',
            order_index: 1,
            content: 'Aprende los atajos de teclado y la configuración de lienzos en Figma.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    category_id: 'cat-5',
    category_name: 'Inteligencia Artificial',
    title: 'Inteligencia Artificial para Desarrolladores',
    slug: 'ia-para-desarrolladores',
    short_description: 'Integra modelos de lenguaje (LLMs), embeddings, agentes inteligentes y APIs de IA.',
    description: 'Explora el ecosistema de IA moderna. Aprende a consumir APIs de Gemini y OpenAI, crear flujos RAG (Retrieval-Augmented Generation), vector databases y construir agentes autónomos.',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    level: 'advanced',
    duration: '5h 45m',
    rating: 4.92,
    reviews_count: 67,
    students_count: 142,
    status: 'published',
    objectives: [
      'Consumo y optimización de APIs de LLMs (Gemini, Claude, GPT)',
      'Prompt Engineering avanzado y estructuración de respuestas JSON',
      'Arquitecturas RAG y Vector Databases',
      'Desarrollo de agentes con tool calling'
    ],
    requirements: [
      'Conocimiento intermedio de JavaScript / Python',
      'Familiaridad con llamadas HTTP / REST APIs'
    ],
    instructor: {
      name: 'David Arboleda',
      role: 'AI Engineer & Tech Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    modules: [
      {
        id: 'mod-3-1',
        course_id: 'course-3',
        title: 'Módulo 1 — Fundamentos de LLMs',
        description: 'Tokens, temperatura, system prompts y APIs.',
        order_index: 1,
        lessons: [
          {
            id: 'les-3-1-1',
            module_id: 'mod-3-1',
            title: '01 Introducción a Modelos de Lenguaje',
            slug: '01-introduccion-a-modelos-lenguaje',
            description: 'Cómo funcionan los Transformers y las llamadas a API.',
            type: 'video',
            video_url: 'https://www.youtube.com/watch?v=5sLYAQS9sWQ',
            duration: '25 min',
            order_index: 1,
            content: 'Entendiendo la generación probabilística de tokens y parámetros de inferencia.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    category_id: 'cat-4',
    category_name: 'Marketing Digital',
    title: 'Marketing Digital & Growth Hacking',
    slug: 'marketing-digital-growth',
    short_description: 'Estrategias de adquisición de usuarios, retención, embudos de conversión y analítica.',
    description: 'Aprende cómo escalar productos digitales. Domina SEO técnico, campañas de alto ROI en redes, optimización de tasa de conversión (CRO) y métricas clave como CAC y LTV.',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    level: 'beginner',
    duration: '4h 20m',
    rating: 4.85,
    reviews_count: 52,
    students_count: 98,
    status: 'published',
    objectives: [
      'Embudos de adquisición y retención (AARRR Framework)',
      'Fundamentos de SEO y posicionamiento orgánico',
      'Optimización de páginas de aterrizaje para alta conversión',
      'Analítica y experimentación con tests A/B'
    ],
    requirements: ['Interés en negocios digitales y métricas web'],
    instructor: {
      name: 'Mariana Rios',
      role: 'Growth Marketing Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    modules: []
  },
  {
    id: 'course-5',
    category_id: 'cat-1',
    category_name: 'Desarrollo Web',
    title: 'JavaScript Moderno (ES2024+)',
    slug: 'javascript-moderno',
    short_description: 'Profundiza en JavaScript asíncrono, closures, prototipos y características modernas.',
    description: 'Lleva tu JavaScript al siguiente nivel. Domina Promises, Async/Await, Web APIs, Event Loop, Clean Code y patrones de diseño esenciales para el desarrollo profesional.',
    thumbnail_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
    level: 'intermediate',
    duration: '7h 10m',
    rating: 4.93,
    reviews_count: 110,
    students_count: 215,
    status: 'published',
    objectives: [
      'Event Loop, Microtasks y Macrotasks',
      'Manejo robusto de Promises y Async/Await',
      'Closures, Scope y Prototipos',
      'Módulos ES6 y optimizaciones de rendimiento'
    ],
    requirements: ['Conocimiento básico de sintaxis JavaScript'],
    instructor: {
      name: 'Carlos Mendoza',
      role: 'Senior Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    modules: []
  },
  {
    id: 'course-6',
    category_id: 'cat-6',
    category_name: 'Productividad',
    title: 'Productividad y Gestión Ágil con Scrum',
    slug: 'productividad-gestion-agil',
    short_description: 'Organiza tu tiempo, lidera sprints eficientes y optimiza la entrega de proyectos.',
    description: 'Descubre cómo trabajar con alta eficiencia sin burnout. Aprende marcos como Scrum y Kanban, priorización con matrices Eisenhower/MoSCoW y automatización de flujos de trabajo.',
    thumbnail_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
    level: 'beginner',
    duration: '3h 15m',
    rating: 4.88,
    reviews_count: 45,
    students_count: 85,
    status: 'published',
    objectives: [
      'Metodología Scrum: Ceremonias, artefactos y roles',
      'Gestión visual con tableros Kanban',
      'Técnicas de priorización y gestión del tiempo',
      'Herramientas digitales para trabajo en equipo'
    ],
    requirements: ['Deseo de mejorar organización personal y de proyectos'],
    instructor: {
      name: 'Elena Gómez',
      role: 'Agile Coach & Scrum Master',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    modules: []
  }
];

export const INITIAL_QUIZZES = [
  {
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
          { id: 'opt-1-1', text: 'useEffect', is_correct: false },
          { id: 'opt-1-2', text: 'useState', is_correct: true },
          { id: 'opt-1-3', text: 'useMemo', is_correct: false },
          { id: 'opt-1-4', text: 'useRef', is_correct: false }
        ]
      },
      {
        id: 'q-2',
        question: '¿Qué es React?',
        options: [
          { id: 'opt-2-1', text: 'Un framework backend para Node.js', is_correct: false },
          { id: 'opt-2-2', text: 'Una librería JavaScript declarativa para construir interfaces de usuario', is_correct: true },
          { id: 'opt-2-3', text: 'Un motor de base de datos relacional', is_correct: false },
          { id: 'opt-2-4', text: 'Un sistema operativo para servidores web', is_correct: false }
        ]
      },
      {
        id: 'q-3',
        question: '¿Cómo se pasan datos de un componente padre a un componente hijo en React?',
        options: [
          { id: 'opt-3-1', text: 'A través de Props (Propiedades)', is_correct: true },
          { id: 'opt-3-2', text: 'Mediante variables globales en window', is_correct: false },
          { id: 'opt-3-3', text: 'Modificando directamente el DOM con document.getElementById', is_correct: false },
          { id: 'opt-3-4', text: 'No es posible pasar datos entre componentes', is_correct: false }
        ]
      },
      {
        id: 'q-4',
        question: '¿Para qué sirve el hook useEffect?',
        options: [
          { id: 'opt-4-1', text: 'Para ejecutar efectos secundarios (peticiones API, suscripciones, timers)', is_correct: true },
          { id: 'opt-4-2', text: 'Para estilizar elementos con CSS en línea', is_correct: false },
          { id: 'opt-4-3', text: 'Para crear rutas en el navegador exclusivamente', is_correct: false },
          { id: 'opt-4-4', text: 'Para reiniciar la aplicación', is_correct: false }
        ]
      },
      {
        id: 'q-5',
        question: '¿Qué ventaja principal ofrece el Virtual DOM en React?',
        options: [
          { id: 'opt-5-1', text: 'Calcula diferencias en memoria y actualiza sólo los nodos modificados en el DOM real', is_correct: true },
          { id: 'opt-5-2', text: 'Reemplaza completamente la necesidad de HTML y CSS', is_correct: false },
          { id: 'opt-5-3', text: 'Aumenta el consumo de memoria del navegador en un 500%', is_correct: false },
          { id: 'opt-5-4', text: 'Ejecuta código PHP dentro del cliente', is_correct: false }
        ]
      }
    ]
  }
];

export const DEMO_USERS = {
  student: {
    id: 'user-student-1',
    email: 'estudiante@skillora.edu',
    full_name: 'Jesús Figueroa',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    phone: '+1 (555) 234-5678',
    bio: 'Entusiasta del desarrollo web y frontend developer en formación. Apasionado por React, Tailwind y la creación de productos digitales.',
    created_at: '2026-01-15T10:00:00Z'
  },
  admin: {
    id: 'user-admin-1',
    email: 'admin@skillora.edu',
    full_name: 'Administrador Skillora',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    phone: '+1 (555) 999-0000',
    bio: 'Director de contenidos y curador académico en Skillora.',
    created_at: '2025-11-01T08:00:00Z'
  }
};

export const INITIAL_ENROLLMENTS = [
  {
    id: 'enr-1',
    user_id: 'user-student-1',
    course_id: 'course-1',
    enrolled_at: '2026-02-01T14:30:00Z',
    completed_at: null,
    status: 'active'
  }
];

export const INITIAL_PROGRESS = [
  { id: 'prog-1', user_id: 'user-student-1', lesson_id: 'les-1-1', completed: true, completed_at: '2026-02-02T10:00:00Z' },
  { id: 'prog-2', user_id: 'user-student-1', lesson_id: 'les-1-2', completed: true, completed_at: '2026-02-03T11:00:00Z' },
  { id: 'prog-3', user_id: 'user-student-1', lesson_id: 'les-1-3', completed: true, completed_at: '2026-02-04T12:00:00Z' },
  { id: 'prog-4', user_id: 'user-student-1', lesson_id: 'les-2-1', completed: true, completed_at: '2026-02-05T14:00:00Z' },
  { id: 'prog-5', user_id: 'user-student-1', lesson_id: 'les-2-2', completed: true, completed_at: '2026-02-06T15:00:00Z' },
  { id: 'prog-6', user_id: 'user-student-1', lesson_id: 'les-2-3', completed: true, completed_at: '2026-02-07T16:00:00Z' }
];

export const INITIAL_CERTIFICATES = [];
