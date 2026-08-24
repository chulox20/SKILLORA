import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './database.js';
import { hashPassword } from '../utils/password.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedInitialData() {
  console.log('🌱 [Seed] Initializing PostgreSQL database tables and seeds...');

  try {
    // 1. Execute schema.sql to ensure all 13 tables & indexes exist
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await query(schemaSql);
      console.log('✅ [Seed] Database schema and tables verified.');
    }

    // 2. Demo Users
    const adminHash = await hashPassword('adminpassword');
    const studentHash = await hashPassword('password123');

    await query(
      `INSERT INTO users (id, full_name, email, password_hash, avatar_url, role, phone, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role`,
      [
        'user-admin-1',
        'Administrador Skillora',
        'admin@skillora.edu',
        adminHash,
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        'admin',
        '+1 (555) 999-0000',
        'Director de contenidos y curador académico en Skillora.',
      ]
    );

    await query(
      `INSERT INTO users (id, full_name, email, password_hash, avatar_url, role, phone, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role`,
      [
        'user-student-1',
        'Jesús Figueroa',
        'estudiante@skillora.edu',
        studentHash,
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        'student',
        '+1 (555) 234-5678',
        'Estudiante apasionado por el desarrollo web y React.',
      ]
    );

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

    for (const cat of categories) {
      await query(
        `INSERT INTO categories (id, name, slug, description, image_url, icon)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name,
             slug = EXCLUDED.slug,
             description = EXCLUDED.description,
             image_url = EXCLUDED.image_url,
             icon = EXCLUDED.icon`,
        [cat.id, cat.name, cat.slug, cat.description, cat.image_url, cat.icon]
      );
    }

    // 4. Main Course: React desde cero
    const reactCourse = {
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
      rating: 4.90,
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
    };

    await query(
      `INSERT INTO courses (id, category_id, category_name, title, slug, short_description, description, thumbnail_url, level, duration, rating, reviews_count, students_count, status, objectives, requirements, instructor)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       ON CONFLICT (id) DO UPDATE
       SET title = EXCLUDED.title,
           slug = EXCLUDED.slug,
           short_description = EXCLUDED.short_description,
           description = EXCLUDED.description,
           thumbnail_url = EXCLUDED.thumbnail_url`,
      [
        reactCourse.id,
        reactCourse.category_id,
        reactCourse.category_name,
        reactCourse.title,
        reactCourse.slug,
        reactCourse.short_description,
        reactCourse.description,
        reactCourse.thumbnail_url,
        reactCourse.level,
        reactCourse.duration,
        reactCourse.rating,
        reactCourse.reviews_count,
        reactCourse.students_count,
        reactCourse.status,
        JSON.stringify(reactCourse.objectives),
        JSON.stringify(reactCourse.requirements),
        JSON.stringify(reactCourse.instructor),
      ]
    );

    // 5. Modules & Lessons
    const modules = [
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
            content: 'En esta primera lección cubrimos la arquitectura de React y configuramos nuestro entorno.',
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
            content: '# ¿Qué es React y el Virtual DOM?\n\nReact es una librería de JavaScript declarativa y eficiente para construir interfaces de usuario.',
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
            content: '# Manejo de Eventos en React\n\nReact utiliza Synthetic Events para asegurar compatibilidad en todos los navegadores.',
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
    ];

    for (const mod of modules) {
      await query(
        `INSERT INTO course_modules (id, course_id, title, description, order_index)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE
         SET title = EXCLUDED.title,
             description = EXCLUDED.description`,
        [mod.id, mod.course_id, mod.title, mod.description, mod.order_index]
      );

      for (const les of mod.lessons) {
        await query(
          `INSERT INTO lessons (id, module_id, title, slug, description, type, content, video_url, duration, order_index, quiz_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO UPDATE
           SET title = EXCLUDED.title,
               slug = EXCLUDED.slug,
               type = EXCLUDED.type,
               video_url = EXCLUDED.video_url,
               content = EXCLUDED.content,
               quiz_id = EXCLUDED.quiz_id`,
          [
            les.id,
            les.module_id,
            les.title,
            les.slug,
            les.description || '',
            les.type,
            les.content || '',
            les.video_url || '',
            les.duration || '15 min',
            les.order_index,
            les.quiz_id || null,
          ]
        );
      }
    }

    // 6. Quiz with secure is_correct answers
    await query(
      `INSERT INTO quizzes (id, lesson_id, course_id, title, passing_score)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE
       SET title = EXCLUDED.title,
           passing_score = EXCLUDED.passing_score`,
      ['quiz-react-1', 'les-3-2', 'course-1', 'Evaluación de Certificación: React desde Cero', 70]
    );

    const questions = [
      {
        id: 'q-1',
        question: '¿Cuál hook permite manejar estado local en un componente funcional de React?',
        options: [
          { id: 'opt-1-1', text: 'useEffect', is_correct: false },
          { id: 'opt-1-2', text: 'useState', is_correct: true },
          { id: 'opt-1-3', text: 'useMemo', is_correct: false },
          { id: 'opt-1-4', text: 'useRef', is_correct: false },
        ],
      },
      {
        id: 'q-2',
        question: '¿Qué es React?',
        options: [
          { id: 'opt-2-1', text: 'Un framework backend para Node.js', is_correct: false },
          { id: 'opt-2-2', text: 'Una librería JavaScript declarativa para interfaces de usuario', is_correct: true },
          { id: 'opt-2-3', text: 'Un motor de base de datos relacional', is_correct: false },
          { id: 'opt-2-4', text: 'Un sistema operativo para servidores', is_correct: false },
        ],
      },
      {
        id: 'q-3',
        question: '¿Cómo se pasan datos de un componente padre a un componente hijo en React?',
        options: [
          { id: 'opt-3-1', text: 'A través de Props (Propiedades)', is_correct: true },
          { id: 'opt-3-2', text: 'Mediante variables globales en window', is_correct: false },
          { id: 'opt-3-3', text: 'Modificando directamente el DOM real', is_correct: false },
          { id: 'opt-3-4', text: 'No es posible pasar datos entre componentes', is_correct: false },
        ],
      },
      {
        id: 'q-4',
        question: '¿Para qué sirve el hook useEffect?',
        options: [
          { id: 'opt-4-1', text: 'Para ejecutar efectos secundarios (peticiones API, timers, suscripciones)', is_correct: true },
          { id: 'opt-4-2', text: 'Para estilizar elementos con CSS únicamente', is_correct: false },
          { id: 'opt-4-3', text: 'Para crear bases de datos en memoria', is_correct: false },
          { id: 'opt-4-4', text: 'Para reiniciar la máquina del cliente', is_correct: false },
        ],
      },
      {
        id: 'q-5',
        question: '¿Qué ventaja principal ofrece el Virtual DOM en React?',
        options: [
          { id: 'opt-5-1', text: 'Calcula diferencias en memoria y actualiza sólo los nodos modificados en el DOM real', is_correct: true },
          { id: 'opt-5-2', text: 'Reemplaza completamente HTML y CSS por código binario', is_correct: false },
          { id: 'opt-5-3', text: 'Ejecuta consultas SQL en el navegador', is_correct: false },
          { id: 'opt-5-4', text: 'Aumenta el consumo de memoria en 500%', is_correct: false },
        ],
      },
    ];

    for (const [qIdx, q] of questions.entries()) {
      await query(
        `INSERT INTO quiz_questions (id, quiz_id, question, order_index)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET question = EXCLUDED.question`,
        [q, 'quiz-react-1', q.question, qIdx + 1]
      );

      for (const [optIdx, opt] of q.options.entries()) {
        await query(
          `INSERT INTO quiz_options (id, question_id, option_text, is_correct, order_index)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET option_text = EXCLUDED.option_text, is_correct = EXCLUDED.is_correct`,
          [opt.id, q.id, opt.text, opt.is_correct, optIdx + 1]
        );
      }
    }

    // 7. Enrollment & Progress for demo student
    await query(
      `INSERT INTO enrollments (id, user_id, course_id, status, enrolled_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, course_id) DO NOTHING`,
      ['enr-1', 'user-student-1', 'course-1', 'active']
    );

    const initialLessonProgress = ['les-1-1', 'les-1-2', 'les-1-3', 'les-2-1', 'les-2-2', 'les-2-3'];
    for (const lesId of initialLessonProgress) {
      await query(
        `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, completed_at)
         VALUES ($1, $2, $3, true, NOW())
         ON CONFLICT (user_id, lesson_id) DO NOTHING`,
        [`prog-${lesId}`, 'user-student-1', lesId]
      );
    }

    console.log('✅ [Seed] Database tables and initial seed dataset configured successfully.');
  } catch (err) {
    console.error('⚠️ [Seed Note]', err.message);
  }
}

// Standalone execution: node src/db/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedInitialData().then(() => {
    console.log('🎉 Seed process finished.');
    process.exit(0);
  });
}
