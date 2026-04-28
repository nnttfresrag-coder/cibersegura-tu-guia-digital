/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CiberSegura: Tu Guía de Supervivencia Digital
 * Proyecto educativo para 1.º de Bachillerato (TDA)
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Fingerprint, 
  EyeOff, 
  Download, 
  UserX, 
  MessageSquareWarning, 
  Globe, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  Home,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- TIPOS DE DATOS ---

type Screen = 'home' | 'menu' | 'topic' | 'quiz' | 'results';

interface Topic {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  definition: string;
  alerts: string[];
  example: string;
  prevention: string;
  challenge: {
    question: string;
    options: string[];
    correctIndex: number;
    feedback: string;
  };
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

// --- CONTENIDO EDUCATIVO ---

const TOPICS: Topic[] = [
  {
    id: 'phishing',
    title: 'Phishing',
    icon: <AlertTriangle className="w-8 h-8" />,
    color: 'bg-blue-500',
    definition: 'Es una técnica de engaño donde los atacantes se hacen pasar por empresas o personas de confianza para robar tus datos (claves, tarjetas).',
    alerts: [
      'Remitentes extraños o dominios mal escritos.',
      'Sentido de urgencia ("¡Tu cuenta se cerrará en 1 hora!").',
      'Faltas de ortografía o saludos genéricos.'
    ],
    example: 'Recibes un correo de "Instagran-Support" diciendo que alguien intentó entrar en tu cuenta y debes pulsar un link para "verificar" tu identidad.',
    prevention: 'Nunca pulses links desde correos. Entra directamente a la app oficial si tienes dudas.',
    challenge: {
      question: 'Te llega un SMS de "Correos" pidiendo 1,50€ para entregar un paquete. El enlace es bit.ly/pago-correos. ¿Qué haces?',
      options: ['Pago rápido para que llegue el paquete.', 'Borro el mensaje y no pulso el link.', 'Pulsar para ver si es verdad.'],
      correctIndex: 1,
      feedback: '¡Correcto! Las empresas oficiales no usan acortadores como bit.ly para pagos sensibles.'
    }
  },
  {
    id: 'passwords',
    title: 'Contraseñas y 2FA',
    icon: <Lock className="w-8 h-8" />,
    color: 'bg-purple-500',
    definition: 'Las contraseñas son la llave de tu vida digital. El Doble Factor (2FA) añade un "portero" extra a esa llave.',
    alerts: [
      'Usar la misma contraseña en todo.',
      'Contraseñas cortas o con nombres de familiares/mascotas.',
      'No tener activado el 2FA en cuentas críticas.'
    ],
    example: 'Tu contraseña es "Lucas2008". Un hacker usa un programa de fuerza bruta y la adivina en segundos porque es muy común.',
    prevention: 'Usa frases largas, símbolos y, sobre todo, activa la verificación en dos pasos (SMS o Apps de autenticador).',
    challenge: {
      question: '¿Cuál de estas es la opción más segura?',
      options: ['Contraseña compleja sin 2FA.', 'Contraseña media con 2FA activo.', 'Usar mi fecha de nacimiento.'],
      correctIndex: 1,
      feedback: '¡Exacto! El 2FA suele ser más importante que la propia contraseña, ya que detiene el 99% de los robos de cuenta.'
    }
  },
  {
    id: 'privacy',
    title: 'Privacidad y Huella',
    icon: <Fingerprint className="w-8 h-8" />,
    color: 'bg-indigo-500',
    definition: 'La huella digital es el rastro que dejas en internet para siempre. La privacidad es el control sobre quién ve ese rastro.',
    alerts: [
      'Perfil público donde cualquiera ve dónde vives.',
      'Publicar fotos de billetes de avión o ubicaciones en tiempo real.',
      'Etiquetar a amigos sin su consentimiento.'
    ],
    example: 'Dentro de 5 años buscas trabajo, y el jefe ve fotos tuyas de bachillerato que preferirías que no estuvieran ahí.',
    prevention: 'Pon tus perfiles en privado. Antes de publicar, piensa: "¿Querría que mi abuela o mi futuro jefe vieran esto?".',
    challenge: {
      question: 'Un "amigo de un amigo" te sigue y pide que le pases el horario de clase. ¿Qué haces?',
      options: ['Se lo paso, es solo un horario.', 'Le pregunto quién es y no le doy datos.', 'Publico el horario en mis historias.'],
      correctIndex: 1,
      feedback: '¡Bien! El horario dice exactamente dónde estarás cada hora del día. Información peligrosa en manos de extraños.'
    }
  },
  {
    id: 'permissions',
    title: 'Permisos de Apps',
    icon: <EyeOff className="w-8 h-8" />,
    color: 'bg-emerald-500',
    definition: 'Son las autorizaciones que das a una aplicación para usar partes de tu móvil como la cámara, el micro o los contactos.',
    alerts: [
      'Una app de "calculadora" pide acceso a tus contactos y ubicación.',
      'Apps instaladas desde fuera de la Play Store/App Store.',
      'Permisos de "siempre activo" para el micrófono.'
    ],
    example: 'Instalas una linterna gratuita y, sin saberlo, le has dado permiso para leer tus mensajes privados y mandarlos a una base de datos.',
    prevention: 'Revisa periódicamente los permisos en Ajustes > Privacidad. Si no tiene sentido, deniégalo.',
    challenge: {
      question: 'Instalas un juego de coches y te pide acceso a tu Cámara. ¿Aceptas?',
      options: ['Sí, seguro es para algo del juego.', 'No, un juego de coches no necesita mi cámara.', 'Aceptar solo una vez.'],
      correctIndex: 1,
      feedback: '¡Buen ojo! Muchos juegos gratuitos recopilan datos biométricos para venderlos o espiarte.'
    }
  },
  {
    id: 'malware',
    title: 'Malware y Descargas',
    icon: <Download className="w-8 h-8" />,
    color: 'bg-red-500',
    definition: 'Programas diseñados para dañar, espiar o secuestrar tu dispositivo. Incluye virus, troyanos y ransomware.',
    alerts: [
      'Botones de "Descargar" gigantes en webs de streaming.',
      'Archivos .exe o .apk compartidos por Discord o WhatsApp.',
      'Tu móvil va lento y la batería dura sospechosamente poco.'
    ],
    example: 'Bajas un "mod" pirata para un juego. Al instalarlo, tu pantalla se bloquea y pide un rescate económico (Ransomware).',
    prevention: 'Solo descarga de sitios oficiales. Ten siempre el sistema operativo actualizado.',
    challenge: {
      question: 'Ves una web que ofrece pavos de Fortnite gratis si descargas una utilidad. ¿Qué haces?',
      options: ['La bajo, necesito esos pavos.', 'Escaneo el archivo con un antivirus raro.', 'Ignorarlo, nadie regala dinero gratis en internet.'],
      correctIndex: 2,
      feedback: '¡Exacto! El "gratis" en internet suele ocultar que el producto eres tú o tus datos.'
    }
  },
  {
    id: 'impersonation',
    title: 'Suplantación',
    icon: <UserX className="w-8 h-8" />,
    color: 'bg-orange-500',
    definition: 'Cuando alguien crea un perfil falso con tu nombre y fotos para engañar a tus amigos o dañar tu reputación.',
    alerts: [
      'Cuentas que te siguen con tu mismo nombre pero una letra cambiada.',
      'Amigos que te preguntan: "¿Por qué me has mandado este mensaje raro?".',
      'Desaparición de acceso a tu propia cuenta.'
    ],
    example: 'Alguien crea un "Tik-Tok" igual al tuyo y empieza a insultar a tus profes para meterte en líos.',
    prevention: 'Reporta inmediatamente la cuenta falsa. Avisa a tu entorno por otros canales para que no caigan en engaños.',
    challenge: {
      question: 'Descubres una cuenta de Instagram nueva con tus fotos pero que no eres tú. ¿Qué haces?',
      options: ['Le escribo para insultarle.', 'La ignoro si no publica nada malo.', 'Denuncio la cuenta a la plataforma y aviso a mis amigos.'],
      correctIndex: 2,
      feedback: '¡Correcto! Actuar rápido es clave para que la red social borre el perfil antes de que haga daño.'
    }
  },
  {
    id: 'cyberbullying',
    title: 'Ciberacoso',
    icon: <MessageSquareWarning className="w-8 h-8" />,
    color: 'bg-rose-500',
    definition: 'Acoso o intimidación por medios digitales de forma repetida. Incluye difundir rumores, fotos privadas o insultos.',
    alerts: [
      'Grupos de clase creados solo para reírse de alguien.',
      'Hacer el vacío digital a un compañero.',
      'Amenazas por mensajes privados.'
    ],
    example: 'Se difunde un montaje de un compañero en el grupo de WhatsApp. Todos se ríen y nadie dice nada por miedo.',
    prevention: 'No seas espectador pasivo. No compartas contenido humillante. Pide ayuda a un adulto de confianza.',
    challenge: {
      question: 'Ves que en un grupo están insultando a un compañero que acaba de irse de clase. ¿Qué haces?',
      options: ['Me salgo del grupo.', 'Digo que no me parece bien y apoyo al compañero.', 'Me río un poco para no quedar mal.'],
      correctIndex: 1,
      feedback: '¡Valentía digital! Detener el acoso requiere que alguien rompa el silencio.'
    }
  },
  {
    id: 'disinformation',
    title: 'Desinformación',
    icon: <Globe className="w-8 h-8" />,
    color: 'bg-cyan-500',
    definition: 'Noticias falsas (Fake News) diseñadas para manipular la opinión pública o causar pánico.',
    alerts: [
      'Titulares exagerados o "clickbait".',
      'Fuentes que no existen o webs con URLs extrañas.',
      'La noticia no aparece en ningún medio serio.'
    ],
    example: 'Se viraliza un audio de WhatsApp diciendo que mañana se cancelan las clases por una alerta de seguridad ficticia.',
    prevention: 'Verifica siempre en al menos dos medios fiables. Antes de compartir, comprueba la fuente.',
    challenge: {
      question: 'Te llega una noticia que dice que han hackeado los resultados de la selectividad. Solo sale en un blog llamado "NoticiasTop100". ¿Te lo crees?',
      options: ['Sí, los blogs suelen decir la verdad.', 'Dudo y busco en el BOE o periódicos oficiales.', 'Lo comparto rápido para avisar.'],
      correctIndex: 1,
      feedback: '¡Muy bien! Ante noticias de impacto, siempre hay que buscar fuentes oficiales.'
    }
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "¿Qué es el Phishing?",
    options: ["Un virus que borra archivos", "Suplantación para robar datos", "Recibir mucha publicidad"],
    correctIndex: 1
  },
  {
    question: "¿Qué significa las siglas 2FA?",
    options: ["2 Fallos de Autenticación", "Doble Factor de Autenticación", "2 Fotos de Avatar"],
    correctIndex: 1
  },
  {
    question: "Si tu perfil de redes sociales es 'Público'...",
    options: ["Solo tus amigos ven tus fotos", "Cualquiera en internet puede verse", "Solo se ve tu nombre"],
    correctIndex: 1
  },
  {
    question: "¿Qué debes hacer si ves ciberacoso?",
    options: ["Compartirlo para que se sepa", "No intervenir", "Apoyar a la víctima y pedir ayuda"],
    correctIndex: 2
  },
  {
    question: "¿Por qué es peligrosa una linterna que pide acceso a tus contactos?",
    options: ["Porque no funcionará bien", "Porque robará datos innecesarios", "Porque gasta mucha batería"],
    correctIndex: 1
  },
  {
    question: "Un ransomware es un malware que...",
    options: ["Te manda muchos anuncios", "Secuestra tus datos y pide dinero", "Acelera tu conexión"],
    correctIndex: 1
  },
  {
    question: "¿Cómo verificas una noticia sospechosa?",
    options: ["Mirando cuántos likes tiene", "Buscando en otras fuentes fiables", "Preguntando en un grupo de WhatsApp"],
    correctIndex: 1
  },
  {
    question: "¿Qué es la Huella Digital?",
    options: ["Tu huella dactilar real", "El rastro que dejas en internet", "Una marca de móvil"],
    correctIndex: 1
  }
];

// --- COMPONENTES ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [score, setScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [challengeAnswered, setChallengeAnswered] = useState<number | null>(null);

  // Ir al inicio al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, activeTopic]);

  const startQuiz = () => {
    setScore(0);
    setQuizIndex(0);
    setScreen('quiz');
  };

  const handleQuizAnswer = (index: number) => {
    if (index === QUIZ_QUESTIONS[quizIndex].correctIndex) {
      setScore(s => s + 1);
    }
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(q => q + 1);
    } else {
      setScreen('results');
    }
  };

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6"
    >
      <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30">
        <ShieldCheck className="w-14 h-14 text-white" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
        Ciber<span className="text-blue-600">Segura</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-md mb-10">
        Domina tu vida digital. Aprende a reconocer los peligros de la red y conviértete en un experto en ciberseguridad.
      </p>
      <button 
        onClick={() => setScreen('menu')}
        className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95"
      >
        COMENZAR APRENDIZAJE <ChevronRight className="w-5 h-5" />
      </button>
      <p className="mt-8 text-xs font-medium text-slate-400 uppercase tracking-widest">
        Bachillerato · Materia TDA
      </p>
    </motion.div>
  );

  const renderMenu = () => (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Módulos Críticos</h2>
          <p className="text-slate-500">Selecciona un tema para empezar a entrenar.</p>
        </div>
        <button 
          onClick={startQuiz}
          className="hidden md:flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
        >
          QUIZ FINAL
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TOPICS.map((topic, i) => (
          <motion.button
            key={topic.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => {
              setActiveTopic(topic);
              setChallengeAnswered(null);
              setScreen('topic');
            }}
            className="group relative h-48 bg-white border border-slate-200 rounded-3xl p-6 text-left shadow-sm hover:shadow-xl transition-all hover:border-transparent overflow-hidden"
          >
            <div className={`w-12 h-12 rounded-2xl ${topic.color} flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
              {topic.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{topic.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2">Aprende a protegerte del {topic.title.toLowerCase()} y más.</p>
            <div className={`absolute bottom-0 left-0 h-1 ${topic.color} w-0 group-hover:w-full transition-all duration-300`} />
          </motion.button>
        ))}
      </div>

      <button 
        onClick={startQuiz}
        className="w-full mt-10 md:hidden flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg"
      >
        <ShieldCheck className="w-5 h-5" /> HACER EL QUIZ FINAL
      </button>
    </div>
  );

  const renderTopic = () => {
    if (!activeTopic) return null;
    return (
      <div className="px-6 py-10 max-w-4xl mx-auto pb-24">
        <button 
          onClick={() => setScreen('menu')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> VOLVER AL MENÚ
        </button>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div className={`${activeTopic.color} p-10 text-white`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                {activeTopic.icon}
              </div>
              <h2 className="text-4xl font-black">{activeTopic.title}</h2>
            </div>
            <p className="text-xl opacity-90 font-medium italic">"{activeTopic.definition}"</p>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div>
                <h4 className="flex items-center gap-2 text-slate-900 font-black text-lg mb-4 uppercase tracking-wider">
                  <AlertTriangle className="text-amber-500 w-5 h-5" /> Señales de Alerta
                </h4>
                <ul className="space-y-3">
                  {activeTopic.alerts.map((alert, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-slate-900 font-black text-lg mb-4 uppercase tracking-wider">
                  <Info className="text-blue-500 w-5 h-5" /> Ejemplo Cercano
                </h4>
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-slate-600 italic">
                  "{activeTopic.example}"
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl mb-12">
              <h4 className="text-blue-900 font-bold mb-2">Recomendación Pro</h4>
              <p className="text-blue-800">{activeTopic.prevention}</p>
            </div>

            {/* RETO INTERACTIVO */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                <ShieldCheck className="text-emerald-400" /> RETO DE DECISIÓN
              </h3>
              <p className="text-lg mb-8 leading-relaxed">{activeTopic.challenge.question}</p>
              
              <div className="space-y-3">
                {activeTopic.challenge.options.map((option, i) => (
                  <button
                    key={i}
                    disabled={challengeAnswered !== null}
                    onClick={() => setChallengeAnswered(i)}
                    className={`
                      w-full p-5 rounded-2xl text-left font-bold transition-all flex justify-between items-center group
                      ${challengeAnswered === null ? 'bg-white/10 hover:bg-white/20 border border-white/10' : 
                        i === activeTopic.challenge.correctIndex ? 'bg-emerald-500 text-white' : 
                        challengeAnswered === i ? 'bg-red-500 text-white' : 'bg-white/5 opacity-40'}
                    `}
                  >
                    {option}
                    {challengeAnswered === i && (
                      i === activeTopic.challenge.correctIndex ? <CheckCircle2 /> : <XCircle />
                    )}
                  </button>
                ))}
              </div>

              {challengeAnswered !== null && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-6 p-5 rounded-2xl flex items-center gap-4 ${challengeAnswered === activeTopic.challenge.correctIndex ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}
                >
                  <p className="font-medium">{activeTopic.challenge.feedback}</p>
                </motion.div>
              )}
            </div>

            <div className="mt-10 flex justify-center">
               <button 
                onClick={() => setScreen('menu')}
                className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3"
              >
                HE TERMINADO ESTE TEMA <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderQuiz = () => {
    const q = QUIZ_QUESTIONS[quizIndex];
    const progress = ((quizIndex) / QUIZ_QUESTIONS.length) * 100;

    return (
      <div className="px-6 py-10 max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Evaluación Final</span>
            <span className="text-slate-900 font-black">{quizIndex + 1} / {QUIZ_QUESTIONS.length}</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>

        <motion.div 
          key={quizIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100"
        >
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-10 leading-tight">
            {q.question}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleQuizAnswer(i)}
                className="w-full p-6 bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-transparent rounded-2xl text-left font-bold transition-all text-slate-800 group"
              >
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-lg bg-slate-200 group-hover:bg-white/20 flex items-center justify-center text-sm">
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderResults = () => {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    let message = "";
    let sub = "";

    if (percentage === 100) {
      message = "¡CIBER-MAESTRO!";
      sub = "Tienes un escudo digital impenetrable. Estás listo para navegar seguro.";
    } else if (percentage >= 70) {
      message = "¡BUEN TRABAJO!";
      sub = "Conoces los peligros básicos, pero no bajes la guardia.";
    } else {
      message = "NECESITAS REFORZAR";
      sub = "Internet puede ser un lugar peligroso. Repasa los módulos de nuevo.";
    }

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6"
      >
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-2xl ${score > 5 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          <span className="text-4xl font-black">{score}/{QUIZ_QUESTIONS.length}</span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">{message}</h2>
        <p className="text-lg text-slate-600 max-w-sm mb-12">{sub}</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setScreen('menu')}
            className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
          >
            REPASAR TEMARIOS
          </button>
          <button 
            onClick={() => setScreen('home')}
            className="px-10 py-4 border-2 border-slate-900 text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Home className="w-5 h-5" /> IR AL INICIO
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* HEADER / NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('home')}>
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span className="font-black text-xl tracking-tight">CiberSegura</span>
          </div>
          {screen !== 'home' && (
            <button 
              onClick={() => setScreen('home')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 text-slate-500" />
            </button>
          )}
        </div>
      </nav>

      {/* ESPACIADOR NAVBAR */}
      <div className="h-16" />

      {/* CONTENIDO PRINCIPAL */}
      <main>
        <AnimatePresence mode="wait">
          {screen === 'home' && renderHome()}
          {screen === 'menu' && renderMenu()}
          {screen === 'topic' && renderTopic()}
          {screen === 'quiz' && renderQuiz()}
          {screen === 'results' && renderResults()}
        </AnimatePresence>
      </main>

      {/* FOOTER EDUCATIVO */}
      <footer className="mt-20 py-10 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm font-medium">
            © 2026 CiberSegura · Bachillerato de TDA
          </div>
          <div className="flex gap-6">
             <a href="#" className="text-slate-400 hover:text-slate-900 text-sm font-bold uppercase transition-colors">Guía del Alumno</a>
             <a href="#" className="text-slate-400 hover:text-slate-900 text-sm font-bold uppercase transition-colors">Materiales Extra</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
