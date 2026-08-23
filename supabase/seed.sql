-- ==============================================================================
-- SKILLORA — Seed Data (PostgreSQL / Supabase)
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
('11111111-1111-1111-1111-111111111101', 'Desarrollo', 'desarrollo', 'Aprende frontend, backend, frameworks modernos y desarrollo web fullstack.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111102', 'Diseño', 'diseno', 'Domina UI/UX, Figma, sistemas de diseño y prototipado profesional.', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111103', 'Negocios', 'negocios', 'Estrategias de emprendimiento, finanzas, modelos de negocio y liderazgo.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111104', 'Marketing', 'marketing', 'Growth hacking, SEO, redes sociales, embudos de venta y copywriting.', 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=600&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111105', 'Inteligencia Artificial', 'ia', 'Machine Learning, LLMs, prompt engineering y automatización con IA.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'),
('11111111-1111-1111-1111-111111111106', 'Productividad', 'productividad', 'Gestión de proyectos, hábitos efectivos, Notion, metodologías ágiles y foco.', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Courses
INSERT INTO public.courses (id, category_id, title, slug, short_description, description, thumbnail_url, level, duration, status) VALUES
(
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    'React desde cero',
    'react-desde-cero',
    'Domina React 19 construyendo aplicaciones interactivas y proyectos reales paso a paso.',
    'Aprende los fundamentos y conceptos avanzados de React. Comprende el Virtual DOM, domina los Hooks fundamentales (useState, useEffect, useMemo, useRef), gestiona el estado global y construye una aplicación completa lista para producción.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    'beginner',
    '6h 30m',
    'published'
),
(
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111102',
    'UI/UX Design con Figma',
    'ui-ux-design-con-figma',
    'Crea interfaces visuales increíbles, design systems escalables y prototipos interactivos.',
    'Domina Figma desde el nivel básico hasta el diseño de sistemas complejos. Aprende auto-layout, componentes con variantes, tokens de diseño y cómo preparar tus entregables para desarrolladores.',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    'intermediate',
    '8h 15m',
    'published'
),
(
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111105',
    'Inteligencia Artificial para Desarrolladores',
    'ia-para-desarrolladores',
    'Integra modelos de lenguaje (LLMs), embeddings, agentes inteligentes y APIs de IA en tus proyectos.',
    'Explora el ecosistema de IA moderna. Aprende a consumir APIs de Gemini y OpenAI, crear flujos RAG (Retrieval-Augmented Generation), vector databases y construir agentes autónomos que resuelven problemas del mundo real.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    'intermediate',
    '5h 45m',
    'published'
),
(
    '22222222-2222-2222-2222-222222222204',
    '11111111-1111-1111-1111-111111111104',
    'Marketing Digital & Growth Hacking',
    'marketing-digital-growth',
    'Estrategias de adquisición de usuarios, retención, embudos de conversión y analítica avanzada.',
    'Aprende cómo escalar productos digitales. Domina SEO técnico, campañas de alto ROI en redes, optimización de tasa de conversión (CRO) y métricas clave como CAC y LTV.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    'beginner',
    '4h 20m',
    'published'
),
(
    '22222222-2222-2222-2222-222222222205',
    '11111111-1111-1111-1111-111111111101',
    'JavaScript Moderno (ES2024+)',
    'javascript-moderno',
    'Profundiza en JavaScript asíncrono, closures, prototipos y las características más modernas del lenguaje.',
    'Lleva tu JavaScript al siguiente nivel. Domina Promises, Async/Await, Web APIs, Event Loop, Clean Code y patrones de diseño esenciales para el desarrollo profesional.',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
    'beginner',
    '7h 10m',
    'published'
),
(
    '22222222-2222-2222-2222-222222222206',
    '11111111-1111-1111-1111-111111111106',
    'Productividad y Gestión Ágil con Scrum',
    'productividad-gestion-agil',
    'Organiza tu tiempo, lidera sprints eficientes y optimiza la entrega de proyectos con metodologías ágiles.',
    'Descubre cómo trabajar con alta eficiencia sin burnout. Aprende marcos como Scrum y Kanban, priorización con matrices Eisenhower/MoSCoW y automatización de flujos de trabajo.',
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
    'beginner',
    '3h 15m',
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Course Modules for "React desde cero"
INSERT INTO public.course_modules (id, course_id, title, description, order_index) VALUES
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'Módulo 1 — Fundamentos', 'Aprende qué es React, cómo funciona JSX y la creación de tus primeros componentes.', 1),
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'Módulo 2 — Estado y Hooks', 'Controla la interactividad con useState, efectos secundarios con useEffect y manejo de formularios.', 2),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 'Módulo 3 — Proyecto y Evaluación Final', 'Construye la aplicación final integrando todos los conocimientos y aprueba la evaluación.', 3)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Lessons for "React desde cero"
INSERT INTO public.lessons (id, module_id, title, slug, description, type, content, video_url, duration, order_index) VALUES
(
    '44444444-4444-4444-4444-444444444401',
    '33333333-3333-3333-3333-333333333301',
    '01 Introducción a React',
    '01-introduccion-a-react',
    'Bienvenida al curso y visión general de lo que construirás.',
    'video',
    'En esta primera lección comprenderás el ecosistema de React, su filosofía basada en componentes y cómo transformó la industria del desarrollo web.',
    'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    '15 min',
    1
),
(
    '44444444-4444-4444-4444-444444444402',
    '33333333-3333-3333-3333-333333333301',
    '02 ¿Qué es React y el Virtual DOM?',
    '02-que-es-react-virtual-dom',
    'Comprende cómo React optimiza el renderizado mediante el Virtual DOM y la reconciliación.',
    'article',
    '# ¿Qué es React y el Virtual DOM?

React es una **librería JavaScript declarativa y eficiente** para construir interfaces de usuario interactivas.

### 🚀 Principales Características
1. **Basado en Componentes**: Divide la interfaz en piezas independientes y reutilizables.
2. **Declarativo**: Describes cómo debe lucir la UI en cualquier momento dado y React se encarga de actualizar el DOM.
3. **Virtual DOM**: Una representación en memoria del DOM real que permite calcular la diferencia (*diffing*) y aplicar únicamente los cambios necesarios.

```jsx
function WelcomeCard({ name }) {
  return (
    <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl">
      <h2 className="text-xl font-bold text-brand-900">¡Hola, {name}!</h2>
      <p className="text-slate-600">Bienvenido a Skillora.</p>
    </div>
  );
}
```',
    NULL,
    '20 min',
    2
),
(
    '44444444-4444-4444-4444-444444444403',
    '33333333-3333-3333-3333-333333333301',
    '03 Componentes y Props',
    '03-componentes-y-props',
    'Creación de componentes funcionales y paso de propiedades.',
    'video',
    'Aprende a pasar datos unidireccionalmente mediante props, destructuración y tipado seguro.',
    'https://www.youtube.com/watch?v=kVeOpcw4GWY',
    '25 min',
    3
),
(
    '44444444-4444-4444-4444-444444444404',
    '33333333-3333-3333-3333-333333333302',
    '04 useState: Manejo de Estado Local',
    '04-usestate-manejo-de-estado',
    'Comprende el hook más fundamental de React para dar interactividad a tus componentes.',
    'video',
    'Aprende cómo funciona el hook useState, por qué el estado es inmutable y cómo actualizar estados basados en el valor previo.',
    'https://www.youtube.com/watch?v=O6P86uwfdR0',
    '30 min',
    4
),
(
    '44444444-4444-4444-4444-444444444405',
    '33333333-3333-3333-3333-333333333302',
    '05 Manejo de Eventos en React',
    '05-manejo-de-eventos',
    'Eventos sintéticos, onClick, onChange y buenas prácticas.',
    'article',
    '# Manejo de Eventos en React

En React, el manejo de eventos es muy similar al de los elementos del DOM estándar, pero con sintaxis camelCase y pasando una función como controlador.

### Ejemplo Práctico:
```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  const handleIncrement = (e) => {
    e.preventDefault();
    setCount(prev => prev + 1);
  };

  return (
    <button onClick={handleIncrement} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
      Clicks: {count}
    </button>
  );
}
```',
    NULL,
    '20 min',
    5
),
(
    '44444444-4444-4444-4444-444444444406',
    '33333333-3333-3333-3333-333333333302',
    '06 Formularios y Controlled Components',
    '06-formularios-controlled-components',
    'Creación de formularios robustos con estado controlado y validación.',
    'video',
    'Aprende a capturar entradas de texto, selects, checkboxes y manejar el submit de formularios.',
    'https://www.youtube.com/watch?v=7Vo_VCcWupQ',
    '35 min',
    6
),
(
    '44444444-4444-4444-4444-444444444407',
    '33333333-3333-3333-3333-333333333303',
    '07 Construcción del Proyecto Final',
    '07-construccion-proyecto-final',
    'Integración completa de componentes, hooks y llamadas a APIs.',
    'video',
    'Desarrolla paso a paso una aplicación completa poniendo en práctica todos los conceptos del curso.',
    'https://www.youtube.com/watch?v=SqcY0GlETPk',
    '45 min',
    7
),
(
    '44444444-4444-4444-4444-444444444408',
    '33333333-3333-3333-3333-333333333303',
    '08 Quiz y Evaluación Final de Certificación',
    '08-quiz-evaluacion-final',
    'Demuestra tus conocimientos en React para obtener tu certificado oficial.',
    'quiz',
    'Pon a prueba tus conocimientos para obtener tu certificado oficial de Skillora. Necesitas al menos un 70% para aprobar.',
    NULL,
    '20 min',
    8
)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Quiz for Lesson 08
INSERT INTO public.quizzes (id, lesson_id, title, passing_score) VALUES
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444408', 'Evaluación de Certificación: React desde Cero', 70)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Quiz Questions & Options
-- Question 1
INSERT INTO public.quiz_questions (id, quiz_id, question, order_index) VALUES
('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555501', '¿Cuál hook permite manejar estado local en un componente funcional de React?', 1),
('66666666-6666-6666-6666-666666666602', '55555555-5555-5555-5555-555555555501', '¿Qué es React?', 2),
('66666666-6666-6666-6666-666666666603', '55555555-5555-5555-5555-555555555501', '¿Cómo se pasan datos de un componente padre a un componente hijo en React?', 3),
('66666666-6666-6666-6666-666666666604', '55555555-5555-5555-5555-555555555501', '¿Para qué sirve el hook useEffect?', 4),
('66666666-6666-6666-6666-666666666605', '55555555-5555-5555-5555-555555555501', '¿Qué ventaja principal ofrece el Virtual DOM en React?', 5)
ON CONFLICT (id) DO NOTHING;

-- Options for Question 1
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
('77777777-7777-7777-7777-777777777101', '66666666-6666-6666-6666-666666666601', 'useEffect', false, 1),
('77777777-7777-7777-7777-777777777102', '66666666-6666-6666-6666-666666666601', 'useState', true, 2),
('77777777-7777-7777-7777-777777777103', '66666666-6666-6666-6666-666666666601', 'useMemo', false, 3),
('77777777-7777-7777-7777-777777777104', '66666666-6666-6666-6666-666666666601', 'useRef', false, 4),

-- Options for Question 2
('77777777-7777-7777-7777-777777777201', '66666666-6666-6666-6666-666666666602', 'Un framework backend para Node.js', false, 1),
('77777777-7777-7777-7777-777777777202', '66666666-6666-6666-6666-666666666602', 'Una librería JavaScript declarativa para construir interfaces de usuario', true, 2),
('77777777-7777-7777-7777-777777777203', '66666666-6666-6666-6666-666666666602', 'Un motor de base de datos relacional', false, 3),
('77777777-7777-7777-7777-777777777204', '66666666-6666-6666-6666-666666666602', 'Un sistema operativo para servidores web', false, 4),

-- Options for Question 3
('77777777-7777-7777-7777-777777777301', '66666666-6666-6666-6666-666666666603', 'A través de Props (Propiedades)', true, 1),
('77777777-7777-7777-7777-777777777302', '66666666-6666-6666-6666-666666666603', 'Mediante variables globales en window', false, 2),
('77777777-7777-7777-7777-777777777303', '66666666-6666-6666-6666-666666666603', 'Modificando directamente el DOM con document.getElementById', false, 3),
('77777777-7777-7777-7777-777777777304', '66666666-6666-6666-6666-666666666603', 'No es posible pasar datos entre componentes', false, 4),

-- Options for Question 4
('77777777-7777-7777-7777-777777777401', '66666666-6666-6666-6666-666666666604', 'Para ejecutar efectos secundarios (peticiones API, suscripciones, timers)', true, 1),
('77777777-7777-7777-7777-777777777402', '66666666-6666-6666-6666-666666666604', 'Para estilizar elementos con CSS en línea', false, 2),
('77777777-7777-7777-7777-777777777403', '66666666-6666-6666-6666-666666666604', 'Para crear rutas en el navegador exclusivamente', false, 3),
('77777777-7777-7777-7777-777777777404', '66666666-6666-6666-6666-666666666604', 'Para reiniciar la aplicación', false, 4),

-- Options for Question 5
('77777777-7777-7777-7777-777777777501', '66666666-6666-6666-6666-666666666605', 'Calcula diferencias en memoria y actualiza sólo los nodos modificados en el DOM real', true, 1),
('77777777-7777-7777-7777-777777777502', '66666666-6666-6666-6666-666666666605', 'Reemplaza completamente la necesidad de HTML y CSS', false, 2),
('77777777-7777-7777-7777-777777777503', '66666666-6666-6666-6666-666666666605', 'Aumenta el consumo de memoria del navegador en un 500%', false, 3),
('77777777-7777-7777-7777-777777777504', '66666666-6666-6666-6666-666666666605', 'Ejecuta código PHP dentro del cliente', false, 4)
ON CONFLICT (id) DO NOTHING;
