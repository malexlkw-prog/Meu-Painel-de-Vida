/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Search, 
  Home, 
  ShoppingBag, 
  CheckSquare, 
  Clock, 
  BookOpen, 
  Tv, 
  Music, 
  Book, 
  Bell, 
  DollarSign, 
  Settings, 
  Menu, 
  X,
  Volume2,
  TrendingUp,
  Award,
  Sparkles,
  Calendar,
  FileText,
  Lock,
  Dumbbell,
  Church,
  Youtube,
  Image as ImageIcon,
  Trophy,
  GraduationCap,
  Film,
  ArrowLeft,
  ShoppingCart,
  Gift,
  BarChart3,
  BookMarked,
  Target,
  Activity,
  Play,
  Folder
} from 'lucide-react';
import { PainelData, ShoppingItem, Task, ScheduleItem, StudySubject, StudyHistory, MediaItem, MusicTrack, MusicArtist, Reminder, FinanceTransaction, BibleReflection, BibleHistoryLog, SchoolSubject, CalendarMarkedDay, NoteEntry, CreativityProject, GymState, CatalogsState } from './types';
import { INITIAL_DATA, EMPTY_DATA } from './data/initialData';
import { getGiftReminders } from './utils/dateUtils';
import StationerySuite from './components/StationerySuite';
import SeteTutorial from './components/SeteTutorial';

// Component imports
import OverviewDashboard from './components/OverviewDashboard';
import ShoppingListSection from './components/ShoppingListSection';
import TasksSection from './components/TasksSection';
import ScheduleSection from './components/ScheduleSection';
import StudiesSection, { getInitialSchoolSubjects, getInitialStudies } from './components/StudiesSection';
import MediaSection from './components/MediaSection';
import MusicSection from './components/MusicSection';
import BibleSection from './components/BibleSection';
import RemindersSection from './components/RemindersSection';
import FinanceSection from './components/FinanceSection';
import WishlistSection from './components/WishlistSection';
import QueroComprarSection from './components/QueroComprarSection';
import SalesSection from './components/SalesSection';
import SystemSettingsSection from './components/SystemSettingsSection';
import CalendarSection from './components/CalendarSection';
import NotesSection from './components/NotesSection';
import CreativitySection from './components/CreativitySection';
import LockScreen from './components/LockScreen';
import SeteSection from './components/SeteSection';
import GymSection from './components/GymSection';
import ChurchSection from './components/ChurchSection';
import YouTubeSection from './components/YouTubeSection';
import GallerySection from './components/GallerySection';
import WorldCupSection from './components/WorldCupSection';
import CustomizationDrawer from './components/CustomizationDrawer';
import CatalogsSection, { DEFAULT_CATALOGS_STATE } from './components/CatalogsSection';
import OnboardingWizard from './components/OnboardingWizard';
import AuthScreen from './components/AuthScreen';
import { getAllPhotos, getAlbums } from './utils/galleryDB';

// Firebase imports
import { auth, db, googleProvider, storage } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const VERSES_OF_THE_DAY = [
  { text: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmos 23:1" },
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "Se Deus é por nós, quem será contra nós?", ref: "Romanos 8:31" },
  { text: "Lâmpada para os meus pés é tua palavra e luz, para o meu caminho.", ref: "Salmos 119:105" },
  { text: "O Senhor guardará a tua entrada e a tua saída, desde agora e para sempre.", ref: "Salmos 121:8" },
  { text: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum.", ref: "Salmos 23:4" },
  { text: "Confie no Senhor de todo o seu coração e não se apóie em seu próprio entendimento.", ref: "Provérbios 3:5" },
  { text: "Escondi a tua palavra no meu coração, para não pecar contra ti.", ref: "Salmos 119:11" },
  { text: "Mil cairão ao teu lado, e dez mil, à tua direita, mas tu não serás atingido.", ref: "Salmos 91:7" },
  { text: "O Senhor é a minha luz e a minha salvação; de quem terei temor?", ref: "Salmos 27:1" },
  { text: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.", ref: "Salmos 91:1" },
  { text: "Sejam fortes e corajosos. Não tenham medo nem fiquem apavorados...", ref: "Deuteronômio 31:6" },
  { text: "Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes...", ref: "Jeremias 33:3" },
  { text: "A alegria do Senhor é a vossa força.", ref: "Neemias 8:10" },
  { text: "Provai e vede que o Senhor é bom; bem-aventurado o homem que nele confia.", ref: "Salmos 34:8" },
  { text: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.", ref: "Salmos 37:5" },
  { text: "Buscar-me-eis e me achareis quando me buscardes de todo o vosso coração.", ref: "Jeremias 29:13" },
  { text: "Não andeis ansiosos por coisa alguma; antes em tudo as vossas petições sejam conhecidas...", ref: "Filipenses 4:6" },
  { text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", ref: "Mateus 11:28" },
  { text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.", ref: "João 14:27" },
  { text: "Os que confiam no Senhor serão como o monte de Sião, que não se abala, mas permanece para sempre.", ref: "Salmos 125:1" },
  { text: "Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.", ref: "1 Pedro 5:7" },
  { text: "Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", ref: "Mateus 6:33" },
  { text: "O próprio Senhor irá à sua frente e estará com você; ele nunca o deixará, nunca o abandonará.", ref: "Deuteronômio 31:8" },
  { text: "Espera pelo Senhor, tem bom ânimo, e ele fortalecerá o teu coração.", ref: "Salmos 27:14" },
  { text: "O Senhor é bom, uma fortaleza no dia da angústia, e conhece os que confiam nele.", ref: "Naum 1:7" },
  { text: "O que vem a mim de maneira nenhuma o lançarei fora.", ref: "João 6:37" },
  { text: "Acheguemo-nos, portanto, confiadamente, junto ao trono da graça...", ref: "Hebreus 4:16" },
  { text: "Porque para Deus nada é impossível.", ref: "Lucas 1:37" },
  { text: "Guardemos firme a confissão da nossa esperança, sem vacilar, pois quem fez a promessa é fiel.", ref: "Hebreus 10:23" },
  { text: "Instrui o menino no caminho em que deve andar, e, até quando for velho, não se desviará dele.", ref: "Provérbios 22:6" }
];

function getDailyVerse() {
  const day = new Date().getDate();
  const index = (day - 1) % VERSES_OF_THE_DAY.length;
  return VERSES_OF_THE_DAY[index];
}

const migrateStudiesData = (parsed: any) => {
  let migrated = false;

  // 1. Migrate school notes, timetable, and disciplines to schoolSubjects if empty
  if (!parsed.schoolSubjects || parsed.schoolSubjects.length === 0) {
    const migratedSubjects: any[] = [];

    // Migrate notes
    const savedNotes = localStorage.getItem('estudos_escola_notas_v1');
    if (savedNotes) {
      try {
        const notesObj = JSON.parse(savedNotes);
        Object.keys(notesObj).forEach(semester => {
          const list = notesObj[semester] || [];
          list.forEach((s: any) => {
            migratedSubjects.push({
              id: s.id || `school-migrated-grade-${Date.now()}-${Math.random()}`,
              name: s.name,
              grade: s.grade,
              faltas: s.faltas,
              peso: s.peso,
              semester: semester,
              type: 'grade',
              scheduleDay: 'Segunda-feira',
              scheduleTime: ''
            });
          });
        });
      } catch (e) {
        console.error("Error parsing local notes", e);
      }
    }

    // Migrate timetable
    const savedTimetable = localStorage.getItem('estudos_escola_horarios_v1');
    if (savedTimetable) {
      try {
        const timetableObj = JSON.parse(savedTimetable);
        Object.keys(timetableObj).forEach(day => {
          const slots = timetableObj[day] || {};
          Object.keys(slots).forEach(slot => {
            const entry = slots[slot];
            if (entry) {
              migratedSubjects.push({
                id: `school-migrated-tt-${Date.now()}-${Math.random()}`,
                name: entry.subject,
                teacher: entry.teacher,
                scheduleTime: entry.time,
                room: entry.room,
                scheduleDay: day,
                slot: slot,
                type: 'timetable'
              });
            }
          });
        });
      } catch (e) {
        console.error("Error parsing local timetable", e);
      }
    }

    // Migrate discipline logs
    const savedDisciplines = localStorage.getItem('estudos_disciplinas_v1');
    if (savedDisciplines) {
      try {
        const disciplinesObj = JSON.parse(savedDisciplines);
        Object.keys(disciplinesObj).forEach(subjectName => {
          const log = disciplinesObj[subjectName];
          if (log) {
            migratedSubjects.push({
              id: `school-migrated-disc-${Date.now()}-${Math.random()}`,
              name: subjectName,
              professor: log.professor,
              conteudos: log.conteudos,
              trabalhos: log.trabalhos,
              atividades: log.atividades,
              provas: log.provas,
              observacoes: log.observacoes,
              type: 'discipline',
              scheduleDay: 'Segunda-feira',
              scheduleTime: ''
            });
          }
        });
      } catch (e) {
        console.error("Error parsing local disciplines", e);
      }
    }

    if (migratedSubjects.length > 0) {
      parsed.schoolSubjects = migratedSubjects;
      migrated = true;
    } else {
      parsed.schoolSubjects = getInitialSchoolSubjects();
    }
  }

  // 2. Migrate personal studies to studies if empty
  if (!parsed.studies || parsed.studies.length === 0) {
    const savedPersonal = localStorage.getItem('estudos_pessoais_v1');
    if (savedPersonal) {
      try {
        const personalObj = JSON.parse(savedPersonal);
        if (Array.isArray(personalObj) && personalObj.length > 0) {
          parsed.studies = personalObj.map((s: any) => ({
            id: s.id,
            name: s.name,
            grade: '',
            contentsByTab: {},
            contentsStudied: '',
            progress: 0,
            history: [],
            contents: s.contents || []
          }));
          migrated = true;
        }
      } catch (e) {
        console.error("Error parsing local personal studies", e);
      }
    }

    if (!parsed.studies || parsed.studies.length === 0) {
      parsed.studies = getInitialStudies();
    }
  }

  // If we migrated, let's delete the old localStorage keys to clean up
  if (migrated) {
    localStorage.removeItem('estudos_escola_notas_v1');
    localStorage.removeItem('estudos_escola_horarios_v1');
    localStorage.removeItem('estudos_disciplinas_v1');
    localStorage.removeItem('estudos_pessoais_v1');
  }
};

// ==========================================
// NEW FIRESTORE MODULAR ARCHITECTURE HELPERS
// ==========================================

const SUBCOLLECTION_MAP: { [key: string]: string } = {
  'shoppingList': 'shoppingList',
  'tasks': 'tasks',
  'schedule': 'schedule',
  'schoolSubjects': 'schoolSubjects',
  'studies': 'studies',
  'media': 'media',
  'reminders': 'reminders',
  'finance': 'finance',
  'calendarMarkedDays': 'calendarMarkedDays',
  'notes': 'notes',
  'creativityProjects': 'creativityProjects',
  
  // Gym sub-keys
  'gym.workouts': 'gymWorkouts',
  'gym.goals': 'gymGoals',
  'gym.measurements': 'gymMeasurements',
  'gym.photos': 'gymPhotos',
  'gym.calendar': 'gymCalendar',
  
  // Church sub-keys
  'church.events': 'churchEvents',
  'church.commitments': 'churchCommitments',
  'church.goals': 'churchGoals',
  'church.studies': 'churchStudies',
  'church.sermons': 'churchSermons',
  'church.prayers': 'churchPrayers',
  'church.ministries': 'churchMinistries',
  'church.ideas': 'churchIdeas',
  
  // YouTube sub-keys
  'youtube.saved': 'youtubeSaved',
  'youtube.history': 'youtubeHistory',
  'youtube.subscriptions': 'youtubeSubscriptions',
  
  // QueroComprar sub-keys
  'queroComprar.items': 'queroComprarItems',
  'queroComprar.people': 'queroComprarPeople',
  
  // Catalogs sub-keys
  'catalogs.songs': 'catalogsSongs',
  'catalogs.repertoires': 'catalogsRepertoires',
  'catalogs.customCatalogs': 'catalogsCustomCatalogs',
  'catalogs.customItems': 'catalogsCustomItems',
  
  // Music sub-keys
  'music.tracks': 'musicTracks',
  'music.artists': 'musicArtists',
  
  // Bible sub-keys
  'bible.reflections': 'bibleReflections',
  'bible.history': 'bibleHistory'
};

const isBase64Image = (str: any): boolean => {
  if (typeof str !== 'string') return false;
  return str.startsWith('data:image/') && str.includes(';base64,');
};

const generateUuid = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const uploadBase64ToStorage = async (uid: string, base64Str: string, moduleName: string, itemId: string): Promise<string> => {
  try {
    const mimeMatch = base64Str.match(/^data:(image\/[a-zA-Z0-9.-]+);base64,/);
    let mimeType = 'image/jpeg';
    let extension = 'jpg';
    if (mimeMatch) {
      mimeType = mimeMatch[1];
      extension = mimeType.split('/')[1] || 'jpg';
    }
    
    const path = `users/${uid}/${moduleName}/${itemId || generateUuid()}_${Date.now()}.${extension}`;
    console.log(`[Storage] Iniciando upload de imagem para: ${path}`);
    const storageRef = ref(storage, path);
    
    await uploadString(storageRef, base64Str, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    console.log(`[Storage] Upload concluído com sucesso. URL pública: ${downloadUrl}`);
    return downloadUrl;
  } catch (err) {
    console.error(`[Storage] Erro no upload de base64 para o modulo ${moduleName}:`, err);
    throw err;
  }
};

const sanitizeAndUploadImages = async (uid: string, obj: any, moduleName: string, itemId: string): Promise<any> => {
  if (obj === null || obj === undefined) return obj;
  
  if (isBase64Image(obj)) {
    return await uploadBase64ToStorage(uid, obj, moduleName, itemId);
  }
  
  if (Array.isArray(obj)) {
    const promises = obj.map((item, index) => sanitizeAndUploadImages(uid, item, moduleName, `${itemId}_arr_${index}`));
    return await Promise.all(promises);
  }
  
  if (typeof obj === 'object') {
    const sanitizedObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        sanitizedObj[key] = await sanitizeAndUploadImages(uid, value, moduleName, itemId || key);
      }
    }
    return sanitizedObj;
  }
  
  return obj;
};

const getValueByPath = (obj: any, path: string): any => {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
};

const setValueByPath = (obj: any, path: string, value: any): any => {
  const parts = path.split('.');
  const newObj = { ...obj };
  let current = newObj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    current[part] = Array.isArray(current[part]) ? [...current[part]] : { ...current[part] };
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
  return newObj;
};

const getPathsNeededForCurrentView = (tab: string, orgSub: string, finSub: string, studiesSub: string, entSub: string): string[] => {
  if (tab === 'dashboard') {
    return ['tasks', 'finance', 'reminders', 'queroComprar.items', 'queroComprar.people'];
  }
  if (tab === 'organizer') {
    if (orgSub === 'tasks') return ['tasks'];
    if (orgSub === 'schedule') return ['schedule'];
    if (orgSub === 'calendar') return ['calendarMarkedDays'];
    if (orgSub === 'reminders') return ['reminders'];
    if (orgSub === 'notes') return ['notes'];
    if (orgSub === 'creativity') return ['creativityProjects'];
  }
  if (tab === 'finance') {
    if (finSub === 'finance') return ['finance'];
    if (finSub === 'shoppingList') return ['shoppingList'];
  }
  if (tab === 'studies') {
    if (studiesSub === 'school') return ['schoolSubjects'];
    if (studiesSub === 'gym') return ['gym.workouts', 'gym.goals', 'gym.measurements', 'gym.photos', 'gym.calendar'];
  }
  if (tab === 'entertainment') {
    if (entSub === 'movies' || entSub === 'series' || entSub === 'animes') return ['media'];
    if (entSub === 'music') return ['music.tracks', 'music.artists'];
    if (entSub === 'youtube') return ['youtube.saved', 'youtube.history', 'youtube.subscriptions'];
  }
  if (tab === 'church') {
    return [
      'church.events',
      'church.commitments',
      'church.goals',
      'church.studies',
      'church.sermons',
      'church.prayers',
      'church.ministries',
      'church.ideas'
    ];
  }
  if (tab === 'bible') {
    return ['bible.reflections', 'bible.history'];
  }
  if (tab === 'wishlist') {
    return ['queroComprar.items', 'queroComprar.people'];
  }
  if (tab === 'catalogs') {
    return ['catalogs.songs', 'catalogs.repertoires', 'catalogs.customCatalogs', 'catalogs.customItems'];
  }
  return [];
};

export default function App() {
  // 1. Core Persistent States
  const [data, setData] = useState<PainelData>(() => {
    const saved = localStorage.getItem('meu_painel_de_vida_db');
    let parsed: any = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar dados do LocalStorage, restaurando padrão.");
      }
    }

    if (!parsed) {
      parsed = { ...EMPTY_DATA };
    }

    if (!parsed.schoolSubjects) {
      parsed.schoolSubjects = [];
    }
    if (!parsed.studies) {
      parsed.studies = [];
    }
    if (!parsed.calendarMarkedDays) {
      parsed.calendarMarkedDays = EMPTY_DATA.calendarMarkedDays || [];
    }
    if (!parsed.notes) {
      parsed.notes = EMPTY_DATA.notes || [];
    }
    if (!parsed.creativityProjects) {
      parsed.creativityProjects = EMPTY_DATA.creativityProjects || [];
    }
    if (!parsed.gym) {
      parsed.gym = EMPTY_DATA.gym;
    }
    if (!parsed.church) {
      parsed.church = EMPTY_DATA.church;
    }
    if (!parsed.youtube) {
      parsed.youtube = EMPTY_DATA.youtube;
    }
    if (!parsed.catalogs || !parsed.catalogs.songs || parsed.catalogs.songs.length === 0) {
      parsed.catalogs = DEFAULT_CATALOGS_STATE;
    }

    // Run studies data migration / fallback initialization
    migrateStudiesData(parsed);

    return parsed;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('meu_painel_de_vida_dark');
    return saved ? saved === 'true' : false;
  });

  // Firebase Auth states
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('meu_painel_de_vida_username') || 'Marcos';
  });
  const [profilePicUrl, setProfilePicUrl] = useState<string>(() => {
    return localStorage.getItem('meu_painel_de_vida_profile_pic') || '';
  });
  const [age, setAge] = useState<string>(() => {
    return localStorage.getItem('lifehub_age') || '';
  });
  const [pin, setPin] = useState<string>(() => {
    return localStorage.getItem('lifehub_pin') || localStorage.getItem('meu_painel_de_vida_pin') || '';
  });
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('lifehub_onboarding_completed') === 'true';
  });
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(() => {
    return localStorage.getItem('lifehub_tutorial_completed') === 'true';
  });
  const [tutorialStepIndex, setTutorialStepIndex] = useState<number>(0);
  const hasLoadedFromServerRef = useRef<boolean>(false);
  const isResettingDataRef = useRef<boolean>(false);

  // New states and refs for Modular Firestore Architecture
  const [isMigrating, setIsMigrating] = useState<boolean>(false);
  const [migrationProgress, setMigrationProgress] = useState<string>('');
  const [loadingModuleData, setLoadingModuleData] = useState<boolean>(false);
  const loadedModulesRef = useRef<{ [key: string]: boolean }>({});
  const lastSavedDataRef = useRef<PainelData | null>(null);

  const sanitizeFirestoreData = (obj: any, path: string = ""): any => {
    if (obj === undefined) {
      console.log(`${path || "root"} = undefined`);
      return null;
    }
    if (obj === null) {
      return null;
    }
    if (Array.isArray(obj)) {
      return obj.map((item, index) => sanitizeFirestoreData(item, `${path}[${index}]`));
    }
    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const val = obj[key];
          const currentPath = path ? `${path}.${key}` : key;
          if (val === undefined) {
            console.log(`${currentPath} = undefined`);
            sanitized[key] = null;
          } else {
            sanitized[key] = sanitizeFirestoreData(val, currentPath);
          }
        }
      }
      return sanitized;
    }
    return obj;
  };

  const isSafeToSaveAppData = async (userId: string, localData: PainelData): Promise<boolean> => {
    console.log("[Data Guard] Iniciando verificação de segurança para salvar appData...");
    console.log("[Data Guard] ID do Usuário:", userId);
    console.log("[Data Guard] isResettingDataRef.current:", isResettingDataRef.current);
    console.log("[Data Guard] hasLoadedFromServerRef.current:", hasLoadedFromServerRef.current);

    if (isResettingDataRef.current) {
      console.log("[Data Guard] Reset de dados local em andamento. Ignorando verificações adicionais.");
      return true;
    }

    if (!hasLoadedFromServerRef.current) {
      console.warn("[Data Guard] Abortando escrita: Carregamento inicial ainda não terminou.");
      return false;
    }

    try {
      const userDocRef = doc(db, 'users_data', userId);
      console.log("[Data Guard] Lendo documento remoto do Firestore antes de validar...");
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        console.log("[Data Guard] Documento não existe no Firestore. Novo usuário detectado. Permitindo gravação.");
        return true;
      }

      const remoteData = docSnap.data();
      const remoteAppData = remoteData?.appData;

      if (!remoteAppData) {
        console.log("[Data Guard] Documento remoto existe mas não contém appData. Permitindo gravação.");
        return true;
      }

      const listsToCheck = [
        'shoppingList',
        'tasks',
        'schedule',
        'studies',
        'media',
        'reminders',
        'finance',
        'notes',
        'creativityProjects',
        'calendarMarkedDays'
      ];

      let localTotalItems = 0;
      let remoteTotalItems = 0;

      for (const key of listsToCheck) {
        // Skip check if the list has not been loaded yet (meaning it is empty locally because of lazy loading, not because it was deleted)
        if (!loadedModulesRef.current[key]) {
          continue;
        }

        const localList = (localData as any)[key];
        const remoteList = remoteAppData[key];

        if (Array.isArray(localList)) {
          localTotalItems += localList.length;
        }
        if (Array.isArray(remoteList)) {
          remoteTotalItems += remoteList.length;
        }
      }

      console.log(`[Data Guard] Estatísticas: Itens locais = ${localTotalItems}, Itens remotos = ${remoteTotalItems}`);

      if (remoteTotalItems > 0 && localTotalItems === 0) {
        console.error(`[Data Guard] ABORTADO: O estado local está vazio, mas o Firestore remoto contém ${remoteTotalItems} itens. Tentativa de sobrescrever dados com objeto vazio impedida.`);
        return false;
      }

      console.log("[Data Guard] Validação concluída. Permitindo gravação no Firestore.");
      return true;
    } catch (e) {
      console.error("[Data Guard] Erro ao validar segurança de gravação do Firestore:", e);
      return false;
    }
  };

  const [sessionUnlocked, setSessionUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('lifehub_unlocked') === 'true';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeOrgSubTab, setActiveOrgSubTab] = useState<'home' | 'tasks' | 'schedule' | 'calendar' | 'reminders' | 'notes' | 'creativity'>('home');
  const [activeFinSubTab, setActiveFinSubTab] = useState<'home' | 'finance' | 'shoppingList' | 'stationery' | 'sales'>('home');
  const [activeStudiesSubTab, setActiveStudiesSubTab] = useState<'home' | 'school' | 'gym'>('home');
  const [activeEntSubTab, setActiveEntSubTab] = useState<'home' | 'movies' | 'series' | 'animes' | 'music' | 'youtube' | 'gallery' | 'copa'>('home');
  const [activeSysSubTab, setActiveSysSubTab] = useState<'profile' | 'customization' | 'security' | 'backup' | 'theme' | 'pin'>('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [tabsVersion, setTabsVersion] = useState(0);

  // Gallery and Album state for Context Manager
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [galleryAlbums, setGalleryAlbums] = useState<any[]>([]);

  useEffect(() => {
    async function loadGalleryData() {
      try {
        const photos = await getAllPhotos();
        const albums = await getAlbums();
        setGalleryPhotos(photos || []);
        setGalleryAlbums(albums || []);
      } catch (err) {
        console.error("Erro ao carregar dados da galeria para o Context Manager:", err);
      }
    }
    if (activeTab === 'sete' || activeEntSubTab === 'gallery') {
      loadGalleryData();
    }
  }, [activeTab, activeEntSubTab]);

  // Context Manager for Sete IA
  const getCompleteSiteData = () => {
    // Calculate accurate metrics and statistics
    const totalTasks = data.tasks?.length || 0;
    const completedTasks = data.tasks?.filter(t => t.completed).length || 0;
    const pendingTasks = totalTasks - completedTasks;

    let totalEarnings = 0;
    let totalExpenses = 0;
    data.finance?.forEach(f => {
      if (f.type === 'income') totalEarnings += f.amount;
      else totalExpenses += f.amount;
    });
    const balance = totalEarnings - totalExpenses;

    const hoursTrainedTotal = data.gym?.hoursTrainedTotal || 0;
    const churchGoalsCompleted = data.church?.goals?.filter(g => g.completed).length || 0;
    const wishlistItemsCount = data.queroComprar?.items?.length || 0;
    const notesCount = data.notes?.length || 0;
    const photosCount = galleryPhotos.length;

    const statistics = {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalEarnings,
      totalExpenses,
      balance,
      hoursTrainedTotal,
      churchGoalsCompleted,
      wishlistItemsCount,
      notesCount,
      photosCount
    };

    // Filter out huge base64 photo data to prevent exceeding Gemini context limit
    const galleryPhotosMeta = galleryPhotos.map(photo => ({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      album: photo.album,
      date: photo.date,
      location: photo.location,
      tags: photo.tags,
      isFavorite: photo.isFavorite,
      size: photo.size
    }));

    let tabsConfig = null;
    try {
      const saved = localStorage.getItem('lifehub_tabs_config');
      if (saved) tabsConfig = JSON.parse(saved);
    } catch (e) {
      console.error("Erro ao ler abas personalizadas para o Context Manager:", e);
    }

    return {
      ...data,

      // Portuguese root keys for console logging and easy Sete IA access
      estudos: data.studies || [],
      escola: data.schoolSubjects || [],
      disciplinas: data.studies || [],
      treino: data.gym || null,
      biblia: data.bible || null,
      igreja: data.church || null,
      galeria: {
        photosCount,
        albumsCount: galleryAlbums.length,
        albumsList: galleryAlbums.map(a => a.name || a.id),
        photos: galleryPhotosMeta
      },
      entretenimento: {
        media: data.media || [],
        music: data.music || null,
        youtube: data.youtube || null
      },
      catalogo: data.catalogs || null,

      // English root keys (ensure arrays are direct to match server expectations)
      studies: data.studies || [],
      schoolSubjects: data.schoolSubjects || [],
      gym: data.gym || null,
      church: data.church || null,
      bible: data.bible || null,
      media: data.media || [],
      youtube: data.youtube || null,
      finance: data.finance || [],
      shoppingList: data.shoppingList || [],
      queroComprar: data.queroComprar || null,
      catalogs: data.catalogs || null,

      // Structured modular context properties
      profile: {
        userName,
        profilePicUrl: profilePicUrl ? "Definida" : "Não definida",
        age,
        pin: pin ? "Definido" : "Não definido",
        user: user ? { uid: user.uid, email: user.email } : null,
        onboardingCompleted,
        tutorialCompleted,
        sessionUnlocked
      },
      dashboard: {
        activeTab,
        activeOrgSubTab,
        activeFinSubTab,
        activeStudiesSubTab,
        activeEntSubTab,
        mobileMenuOpen,
        isCustomizerOpen,
        tabsVersion
      },
      organization: {
        tasks: data.tasks || [],
        schedule: data.schedule || [],
        calendarMarkedDays: data.calendarMarkedDays || [],
        reminders: data.reminders || [],
        notes: data.notes || [],
        creativityProjects: data.creativityProjects || []
      },
      gallery: {
        photosCount,
        albumsCount: galleryAlbums.length,
        albumsList: galleryAlbums.map(a => a.name || a.id),
        photos: galleryPhotosMeta
      },
      entertainment: {
        media: data.media || [],
        music: data.music || null
      },
      catalog: data.catalogs || null,
      settings: {
        darkMode,
        activeSysSubTab
      },
      preferences: {
        tabsConfig,
        sidebarItems: getCustomizedSidebarItems()
      },
      statistics
    };
  };

  // =========================================
  // AUTOMATIC IDEMPOTENT MIGRATION
  // =========================================
  const runIdempotentMigration = async (uid: string, legacyAppData: any) => {
    if (isMigrating) return;
    setIsMigrating(true);
    setMigrationProgress("Iniciando migração segura dos seus dados...");
    console.log("[Migration] Iniciando processo de migração idempotente para o usuário:", uid);

    try {
      // 1. Upload configs/preferences to the main users_data document under appConfigs
      const appConfigs = {
        music: {
          currentVibe: legacyAppData.music?.currentVibe || '',
          vibePhase: legacyAppData.music?.vibePhase || ''
        },
        bible: {
          currentBook: legacyAppData.bible?.currentBook || 'Gênesis',
          plan: legacyAppData.bible?.plan || 'sequential',
          bookProgress: legacyAppData.bible?.bookProgress || {}
        },
        gym: {
          hoursTrainedTotal: legacyAppData.gym?.hoursTrainedTotal || 0
        },
        church: {
          bibleReadingStreak: legacyAppData.church?.bibleReadingStreak || 0,
          cultsAttendedCount: legacyAppData.church?.cultsAttendedCount || 0
        },
        youtube: {
          apiKey: legacyAppData.youtube?.apiKey || ''
        },
        queroComprar: {
          customCategories: legacyAppData.queroComprar?.customCategories || [],
          customCategoriesList: legacyAppData.queroComprar?.customCategoriesList || [],
          customSubCategories: legacyAppData.queroComprar?.customSubCategories || {},
          deletedCategories: legacyAppData.queroComprar?.deletedCategories || [],
          deletedSubCategories: legacyAppData.queroComprar?.deletedSubCategories || {}
        },
        catalogs: {
          songCategories: legacyAppData.catalogs?.songCategories || []
        }
      };

      console.log("[Migration] Atualizando configurações e metadados no documento raiz...");
      const userDocRef = doc(db, 'users_data', uid);
      await setDoc(userDocRef, {
        appConfigs,
        databaseVersion: 'v2',
        migrationStatus: 'in_progress'
      }, { merge: true });

      // 2. Migrate each list into its separate subcollection
      const paths = Object.keys(SUBCOLLECTION_MAP);
      let migratedCount = 0;

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const subcoll = SUBCOLLECTION_MAP[path];
        const rawValue = getValueByPath(legacyAppData, path);

        if (!rawValue) {
          console.log(`[Migration] [${path}] Vazio ou inexistente, pulando.`);
          continue;
        }

        setMigrationProgress(`Migrando módulo ${i + 1} de ${paths.length}: ${subcoll}...`);
        console.log(`[Migration] [${path}] Iniciando migração para subcoleção '${subcoll}'`);

        if (Array.isArray(rawValue)) {
          // Migrate list of items
          for (let index = 0; index < rawValue.length; index++) {
            const item = rawValue[index];
            const itemId = item.id || `item_${index}`;
            const subdocRef = doc(db, 'users_data', uid, subcoll, itemId);

            // Idempotency: Check if already migrated
            const snap = await getDoc(subdocRef);
            if (snap.exists()) {
              console.log(`[Migration] [${path}] Item ${itemId} já existe na subcoleção, pulando para garantir idempotência.`);
              continue;
            }

            // Sanitize images & upload Base64 to Storage
            const sanitizedItem = await sanitizeAndUploadImages(uid, item, subcoll, itemId);
            const firestoreReady = sanitizeFirestoreData(sanitizedItem);
            
            await setDoc(subdocRef, firestoreReady);
            migratedCount++;
          }
        } else if (typeof rawValue === 'object') {
          // Key-Value objects like gym.calendar
          const keys = Object.keys(rawValue);
          for (const key of keys) {
            const item = rawValue[key];
            const subdocRef = doc(db, 'users_data', uid, subcoll, key);

            const snap = await getDoc(subdocRef);
            if (snap.exists()) {
              console.log(`[Migration] [${path}] Chave ${key} já existe na subcoleção, pulando.`);
              continue;
            }

            const sanitizedItem = await sanitizeAndUploadImages(uid, item, subcoll, key);
            const firestoreReady = sanitizeFirestoreData(sanitizedItem);

            await setDoc(subdocRef, firestoreReady);
            migratedCount++;
          }
        }
        console.log(`[Migration] [${path}] Concluído com sucesso.`);
      }

      // 3. Mark migration as fully completed in Firestore
      console.log("[Migration] Todos os documentos foram criados e validados.");
      await setDoc(userDocRef, {
        migrationStatus: 'completed',
        databaseVersion: 'v2'
      }, { merge: true });

      setMigrationProgress(`Migração concluída com sucesso! ${migratedCount} itens migrados para subcoleções independentes.`);
      console.log(`[Migration] Sucesso total! ${migratedCount} documentos migrados com segurança.`);
      
      // Let's reload everything we need for the current view
      loadedModulesRef.current = {};
      const initialPaths = getPathsNeededForCurrentView(activeTab, activeOrgSubTab, activeFinSubTab, activeStudiesSubTab, activeEntSubTab);
      await loadSubcollectionData(uid, initialPaths);
    } catch (err) {
      console.error("[Migration] Erro catastrófico na migração de dados:", err);
      setMigrationProgress("Erro na migração. Recarregue a página para tentar novamente com segurança.");
    } finally {
      setIsMigrating(false);
    }
  };

  // =========================================
  // LAZY LOADING ON DEMAND
  // =========================================
  const loadSubcollectionData = async (uid: string, paths: string[]) => {
    if (!uid || paths.length === 0) return;
    
    // Filter out paths that are already loaded
    const pathsToLoad = paths.filter(p => !loadedModulesRef.current[p]);
    if (pathsToLoad.length === 0) return;

    setLoadingModuleData(true);
    console.log("[LazyLoad] Solicitando carregamento sob demanda para os caminhos:", pathsToLoad);

    try {
      let updatedData = { ...data };

      for (const path of pathsToLoad) {
        const subcoll = SUBCOLLECTION_MAP[path];
        if (!subcoll) continue;

        console.log(`[LazyLoad] Buscando subcoleção: '${subcoll}'`);
        const qSnap = await getDocs(collection(db, 'users_data', uid, subcoll));
        
        // Detect if this path corresponds to a key-value calendar object or a regular array list
        if (path === 'gym.calendar') {
          const calendarObj: any = {};
          qSnap.forEach(subdoc => {
            calendarObj[subdoc.id] = subdoc.data();
          });
          updatedData = setValueByPath(updatedData, path, calendarObj);
        } else {
          const arrayList: any[] = [];
          qSnap.forEach(subdoc => {
            arrayList.push({ id: subdoc.id, ...subdoc.data() });
          });
          updatedData = setValueByPath(updatedData, path, arrayList);
        }

        loadedModulesRef.current[path] = true;
        console.log(`[LazyLoad] '${subcoll}' carregado com sucesso (${qSnap.size} documentos).`);
      }

      setData(updatedData);
      
      // Initialize lastSavedDataRef if empty to start matching delta changes
      if (!lastSavedDataRef.current) {
        lastSavedDataRef.current = JSON.parse(JSON.stringify(updatedData));
      } else {
        // Sync the newly loaded paths into lastSavedDataRef as well so we don't treat them as added items!
        for (const path of pathsToLoad) {
          const currentVal = getValueByPath(updatedData, path);
          lastSavedDataRef.current = setValueByPath(lastSavedDataRef.current, path, JSON.parse(JSON.stringify(currentVal)));
        }
      }
    } catch (err) {
      console.error("[LazyLoad] Erro ao carregar subcoleção sob demanda:", err);
    } finally {
      setLoadingModuleData(false);
    }
  };

  const handleGetLatestSiteData = async () => {
    // 1. Immediately write any pending local changes to Firestore if the user is authenticated
    if (user) {
      try {
        const isSafe = await isSafeToSaveAppData(user.uid, data);
        if (isSafe) {
          const userDocRef = doc(db, 'users_data', user.uid);
          console.log("[setDoc] Iniciando gravação imediata (handleGetLatestSiteData)");
          console.log("[setDoc] Documento:", userDocRef.path);
          console.log("Objeto enviado:", data);
          console.log(JSON.stringify(data, null, 2));
          
          const fullDocData = {
            userName,
            profilePicUrl,
            age,
            pin,
            onboardingCompleted,
            tutorialCompleted,
            appData: data
          };
          
          console.log("[Sanitizer] Iniciando auditoria recursiva de campos undefined para gravação imediata...");
          const sanitizedDocData = sanitizeFirestoreData(fullDocData);
          console.log("[Sanitizer] Auditoria recursiva de campos concluída com sucesso.");
          
          await setDoc(userDocRef, sanitizedDocData, { merge: true });
          console.log("[setDoc] Sincronização imediata forçada com Firestore realizada com sucesso (handleGetLatestSiteData).");
        } else {
          console.warn("[Context Manager] Sincronização imediata forçada abortada para evitar sobrescrever dados do Firestore com estado vazio.");
        }
      } catch (err) {
        console.error("[Context Manager] Erro ao sincronizar forçado com Firestore:", err);
      }
    }

    // 2. Fetch the absolute latest document directly from Firestore
    let latestAppData = data;
    let latestUserName = userName;
    let latestAge = age;
    let latestPin = pin;
    let latestOnboarding = onboardingCompleted;
    let latestTutorial = tutorialCompleted;
    let latestProfilePic = profilePicUrl;

    if (user) {
      try {
        const userDocRef = doc(db, 'users_data', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const fetched = userDocSnap.data();
          if (fetched.appData) {
            latestAppData = fetched.appData;
            // Instantly update local state so the UI stays in sync
            setData(fetched.appData);
          }
          if (fetched.userName) {
            latestUserName = fetched.userName;
            setUserName(fetched.userName);
          }
          if (fetched.age) {
            latestAge = fetched.age;
            setAge(fetched.age);
          }
          if (fetched.pin) {
            latestPin = fetched.pin;
            setPin(fetched.pin);
          }
          // For existing accounts, onboarding and tutorial are always marked completed
          latestOnboarding = true;
          setOnboardingCompleted(true);
          latestTutorial = true;
          setTutorialCompleted(true);
          if (fetched.profilePicUrl) {
            latestProfilePic = fetched.profilePicUrl;
            setProfilePicUrl(fetched.profilePicUrl);
          }
        }
      } catch (err) {
        console.error("[Context Manager] Erro ao buscar último documento do Firestore:", err);
      }
    }

    // 3. Re-read fresh photos and albums from gallery database
    let latestPhotos: any[] = [];
    let latestAlbums: any[] = [];
    try {
      latestPhotos = await getAllPhotos() || [];
      latestAlbums = await getAlbums() || [];
      setGalleryPhotos(latestPhotos);
      setGalleryAlbums(latestAlbums);
    } catch (err) {
      console.error("[Context Manager] Erro ao recarregar dados da galeria:", err);
    }

    // 4. Rebuild the siteData object completely using the absolute latest values
    const totalTasks = latestAppData.tasks?.length || 0;
    const completedTasks = latestAppData.tasks?.filter((t: any) => t.completed).length || 0;
    const pendingTasks = totalTasks - completedTasks;

    let totalEarnings = 0;
    let totalExpenses = 0;
    latestAppData.finance?.forEach((f: any) => {
      if (f.type === 'income') totalEarnings += f.amount;
      else totalExpenses += f.amount;
    });
    const balance = totalEarnings - totalExpenses;

    const hoursTrainedTotal = latestAppData.gym?.hoursTrainedTotal || 0;
    const churchGoalsCompleted = latestAppData.church?.goals?.filter((g: any) => g.completed).length || 0;
    const wishlistItemsCount = latestAppData.queroComprar?.items?.length || 0;
    const notesCount = latestAppData.notes?.length || 0;
    const photosCount = latestPhotos.length;

    const statistics = {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalEarnings,
      totalExpenses,
      balance,
      hoursTrainedTotal,
      churchGoalsCompleted,
      wishlistItemsCount,
      notesCount,
      photosCount
    };

    const galleryPhotosMeta = latestPhotos.map((photo: any) => ({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      album: photo.album,
      date: photo.date,
      location: photo.location,
      tags: photo.tags,
      isFavorite: photo.isFavorite,
      size: photo.size
    }));

    let tabsConfig = null;
    try {
      const saved = localStorage.getItem('lifehub_tabs_config');
      if (saved) tabsConfig = JSON.parse(saved);
    } catch (e) {
      console.error("[Context Manager] Erro ao ler abas personalizadas:", e);
    }

    const reconstructedSiteData = {
      ...latestAppData,

      // Portuguese root keys for console logging and easy Sete IA access
      estudos: latestAppData.studies || [],
      escola: latestAppData.schoolSubjects || [],
      disciplinas: latestAppData.studies || [],
      treino: latestAppData.gym || null,
      biblia: latestAppData.bible || null,
      igreja: latestAppData.church || null,
      galeria: {
        photosCount,
        albumsCount: latestAlbums.length,
        albumsList: latestAlbums.map((a: any) => a.name || a.id),
        photos: galleryPhotosMeta
      },
      entretenimento: {
        media: latestAppData.media || [],
        music: latestAppData.music || null,
        youtube: latestAppData.youtube || null
      },
      catalogo: latestAppData.catalogs || null,

      // English root keys (ensure arrays are direct to match server expectations)
      studies: latestAppData.studies || [],
      schoolSubjects: latestAppData.schoolSubjects || [],
      gym: latestAppData.gym || null,
      church: latestAppData.church || null,
      bible: latestAppData.bible || null,
      media: latestAppData.media || [],
      youtube: latestAppData.youtube || null,
      finance: latestAppData.finance || [],
      shoppingList: latestAppData.shoppingList || [],
      queroComprar: latestAppData.queroComprar || null,
      catalogs: latestAppData.catalogs || null,

      profile: {
        userName: latestUserName,
        profilePicUrl: latestProfilePic ? "Definida" : "Não definida",
        age: latestAge,
        pin: latestPin ? "Definido" : "Não definido",
        user: user ? { uid: user.uid, email: user.email } : null,
        onboardingCompleted: latestOnboarding,
        tutorialCompleted: latestTutorial,
        sessionUnlocked
      },
      dashboard: {
        activeTab,
        activeOrgSubTab,
        activeFinSubTab,
        activeStudiesSubTab,
        activeEntSubTab,
        mobileMenuOpen,
        isCustomizerOpen,
        tabsVersion
      },
      organization: {
        tasks: latestAppData.tasks || [],
        schedule: latestAppData.schedule || [],
        calendarMarkedDays: latestAppData.calendarMarkedDays || [],
        reminders: latestAppData.reminders || [],
        notes: latestAppData.notes || [],
        creativityProjects: latestAppData.creativityProjects || []
      },
      gallery: {
        photosCount,
        albumsCount: latestAlbums.length,
        albumsList: latestAlbums.map((a: any) => a.name || a.id),
        photos: galleryPhotosMeta
      },
      entertainment: {
        media: latestAppData.media || [],
        music: latestAppData.music || null
      },
      catalog: latestAppData.catalogs || null,
      settings: {
        darkMode,
        activeSysSubTab
      },
      preferences: {
        tabsConfig,
        sidebarItems: getCustomizedSidebarItems()
      },
      statistics
    };

    console.log("siteData enviado para Sete:", reconstructedSiteData);
    return reconstructedSiteData;
  };

  // 2. Firebase Authentication State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDocRef = doc(db, 'users_data', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          const savedDbStr = localStorage.getItem('meu_painel_de_vida_db');
          let localDb: PainelData | null = null;
          if (savedDbStr) {
            try {
              localDb = JSON.parse(savedDbStr);
            } catch (e) {
              console.error("Erro ao analisar localDb no Auth Observer", e);
            }
          }

          const hasNoItems = (d: PainelData | null) => {
            if (!d) return true;
            const tasksCount = d.tasks ? d.tasks.length : 0;
            const notesCount = d.notes ? d.notes.length : 0;
            const shoppingCount = d.shoppingList ? d.shoppingList.length : 0;
            const scheduleCount = d.schedule ? d.schedule.length : 0;
            const schoolSubjectsCount = d.schoolSubjects ? d.schoolSubjects.length : 0;
            const studiesCount = d.studies ? d.studies.length : 0;
            return (tasksCount + notesCount + shoppingCount + scheduleCount + schoolSubjectsCount + studiesCount) === 0;
          };
          
          if (userDocSnap.exists()) {
            const fetchedData = userDocSnap.data();
            setUserName(fetchedData.userName || firebaseUser.displayName || 'Usuário');
            setProfilePicUrl(fetchedData.profilePicUrl || firebaseUser.photoURL || '');
            setAge(fetchedData.age || '');
            setPin(fetchedData.pin || '');
            
            setOnboardingCompleted(true);
            setTutorialCompleted(true);
            
            if (fetchedData.onboardingCompleted !== true || fetchedData.tutorialCompleted !== true) {
              try {
                await setDoc(userDocRef, {
                  onboardingCompleted: true,
                  tutorialCompleted: true
                }, { merge: true });
              } catch (e) {
                console.error("Erro ao marcar onboarding/tutorial como concluídos no Firestore:", e);
              }
            }

            // CHECK DATABASE VERSION & TRIGGER MIGRATION OR MODULAR LOAD
            if (fetchedData.databaseVersion === 'v2') {
              console.log("[Auth] Usuário já está na versão v2. Carregando configurações e metadados rápidos...");
              const appConfigs = fetchedData.appConfigs || {};
              
              const baseData = localDb || data || EMPTY_DATA;
              const initialV2State = {
                ...baseData,
                music: {
                  ...baseData.music,
                  currentVibe: appConfigs.music?.currentVibe || baseData.music?.currentVibe || '',
                  vibePhase: appConfigs.music?.vibePhase || baseData.music?.vibePhase || ''
                },
                bible: {
                  ...baseData.bible,
                  currentBook: appConfigs.bible?.currentBook || baseData.bible?.currentBook || 'Gênesis',
                  plan: appConfigs.bible?.plan || baseData.bible?.plan || 'sequential',
                  bookProgress: appConfigs.bible?.bookProgress || baseData.bible?.bookProgress || {}
                },
                gym: {
                  ...baseData.gym,
                  hoursTrainedTotal: appConfigs.gym?.hoursTrainedTotal ?? baseData.gym?.hoursTrainedTotal ?? 0
                },
                church: {
                  ...baseData.church,
                  bibleReadingStreak: appConfigs.church?.bibleReadingStreak ?? baseData.church?.bibleReadingStreak ?? 0,
                  cultsAttendedCount: appConfigs.church?.cultsAttendedCount ?? baseData.church?.cultsAttendedCount ?? 0
                },
                youtube: {
                  ...baseData.youtube,
                  apiKey: appConfigs.youtube?.apiKey || baseData.youtube?.apiKey || ''
                },
                queroComprar: {
                  ...baseData.queroComprar,
                  customCategories: appConfigs.queroComprar?.customCategories || baseData.queroComprar?.customCategories || [],
                  customCategoriesList: appConfigs.queroComprar?.customCategoriesList || baseData.queroComprar?.customCategoriesList || [],
                  customSubCategories: appConfigs.queroComprar?.customSubCategories || baseData.queroComprar?.customSubCategories || {},
                  deletedCategories: appConfigs.queroComprar?.deletedCategories || baseData.queroComprar?.deletedCategories || [],
                  deletedSubCategories: appConfigs.queroComprar?.deletedSubCategories || baseData.queroComprar?.deletedSubCategories || {}
                },
                catalogs: {
                  ...baseData.catalogs,
                  songCategories: appConfigs.catalogs?.songCategories || baseData.catalogs?.songCategories || []
                }
              };
              
              setData(initialV2State);
              loadedModulesRef.current = {};
              hasLoadedFromServerRef.current = true;
            } else {
              // Legacy User - Trigger automatic background migration to subcollections!
              console.log("[Auth] Usuário legado detectado (v1). Iniciando migração incremental idempotente...");
              const legacyAppData = fetchedData.appData || (localDb && !hasNoItems(localDb) ? localDb : EMPTY_DATA);
              hasLoadedFromServerRef.current = true;
              await runIdempotentMigration(firebaseUser.uid, legacyAppData);
            }
          } else {
            // Document does not exist: New user onboarding!
            console.log("[Auth] Usuário não possui documento no Firestore. Criando estrutura v2...");
            const initialUserData = {
              userName: firebaseUser.displayName || 'Usuário',
              profilePicUrl: firebaseUser.photoURL || '',
              age: localStorage.getItem('lifehub_age') || '',
              pin: localStorage.getItem('lifehub_pin') || localStorage.getItem('meu_painel_de_vida_pin') || '',
              onboardingCompleted: localStorage.getItem('lifehub_onboarding_completed') === 'true',
              tutorialCompleted: localStorage.getItem('lifehub_tutorial_completed') === 'true',
              databaseVersion: 'v2',
              migrationStatus: 'completed',
              appConfigs: {},
              statistics: {}
            };
            
            const sanitizedInitialUserData = sanitizeFirestoreData(initialUserData);
            await setDoc(userDocRef, sanitizedInitialUserData);
            
            setUserName(initialUserData.userName);
            setProfilePicUrl(initialUserData.profilePicUrl);
            setAge(initialUserData.age);
            setPin(initialUserData.pin);
            setOnboardingCompleted(initialUserData.onboardingCompleted);
            setTutorialCompleted(initialUserData.tutorialCompleted);
            
            setData(EMPTY_DATA);
            loadedModulesRef.current = {};
            hasLoadedFromServerRef.current = true;

            // If the user has offline offline data in localDb, migrate it!
            if (localDb && !hasNoItems(localDb)) {
              console.log("[Auth] Sincronizando dados locais do localStorage para o novo banco v2...");
              await runIdempotentMigration(firebaseUser.uid, localDb);
            }
          }
        } catch (e) {
          console.error("Erro ao sincronizar dados do Firestore:", e);
        } finally {
          setLoadingAuth(false);
        }
      } else {
        setUser(null);
        setLoadingAuth(false);
        setUserName(localStorage.getItem('meu_painel_de_vida_username') || 'Marcos');
        setProfilePicUrl(localStorage.getItem('meu_painel_de_vida_profile_pic') || '');
        setAge(localStorage.getItem('lifehub_age') || '');
        setPin(localStorage.getItem('lifehub_pin') || localStorage.getItem('meu_painel_de_vida_pin') || '');
        setOnboardingCompleted(localStorage.getItem('lifehub_onboarding_completed') === 'true');
        setTutorialCompleted(localStorage.getItem('lifehub_tutorial_completed') === 'true');
        setSessionUnlocked(false);
        sessionStorage.removeItem('lifehub_unlocked');
        hasLoadedFromServerRef.current = false;
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. Debounced Firestore Cloud Save with Delta/Incremental Syncing
  useEffect(() => {
    if (!user || !hasLoadedFromServerRef.current || isMigrating) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const isSafe = await isSafeToSaveAppData(user.uid, data);
        if (!isSafe) {
          console.warn("[Debounced Sync] Gravação cancelada pelo Data Guard.");
          return;
        }

        console.log("[Debounced Sync] Iniciando sincronização incremental com o Firestore...");

        if (!lastSavedDataRef.current) {
          lastSavedDataRef.current = JSON.parse(JSON.stringify(data));
          return;
        }

        const userDocRef = doc(db, 'users_data', user.uid);
        const paths = Object.keys(SUBCOLLECTION_MAP);
        let writeCount = 0;
        let deleteCount = 0;

        for (const path of paths) {
          if (!loadedModulesRef.current[path]) {
            continue;
          }

          const currentVal = getValueByPath(data, path);
          const prevVal = getValueByPath(lastSavedDataRef.current, path);
          const subcoll = SUBCOLLECTION_MAP[path];

          if (JSON.stringify(currentVal) !== JSON.stringify(prevVal)) {
            console.log(`[Debounced Sync] Detectadas alterações em '${path}' (subcoleção '${subcoll}')`);

            if (path === 'gym.calendar') {
              const currentKeys = Object.keys(currentVal || {});
              const prevKeys = Object.keys(prevVal || {});

              for (const key of currentKeys) {
                if (JSON.stringify(currentVal[key]) !== JSON.stringify(prevVal?.[key])) {
                  const subdocRef = doc(db, 'users_data', user.uid, subcoll, key);
                  const sanitizedItem = await sanitizeAndUploadImages(user.uid, currentVal[key], subcoll, key);
                  const firestoreReady = sanitizeFirestoreData(sanitizedItem);
                  await setDoc(subdocRef, firestoreReady);
                  writeCount++;
                }
              }

              for (const key of prevKeys) {
                if (currentVal[key] === undefined) {
                  const subdocRef = doc(db, 'users_data', user.uid, subcoll, key);
                  await deleteDoc(subdocRef);
                  deleteCount++;
                }
              }
            } else {
              const currentArray = Array.isArray(currentVal) ? currentVal : [];
              const prevArray = Array.isArray(prevVal) ? prevVal : [];

              const currentMap = new Map<string, any>(currentArray.map(item => [item.id, item]));
              const prevMap = new Map<string, any>(prevArray.map(item => [item.id, item]));

              for (const item of currentArray) {
                const prevItem = prevMap.get(item.id);
                if (!prevItem || JSON.stringify(item) !== JSON.stringify(prevItem)) {
                  const itemId = item.id || generateUuid();
                  const subdocRef = doc(db, 'users_data', user.uid, subcoll, itemId);
                  const sanitizedItem = await sanitizeAndUploadImages(user.uid, item, subcoll, itemId);
                  const firestoreReady = sanitizeFirestoreData(sanitizedItem);
                  await setDoc(subdocRef, firestoreReady);
                  writeCount++;
                }
              }

              for (const item of prevArray) {
                if (!currentMap.has(item.id)) {
                  const subdocRef = doc(db, 'users_data', user.uid, subcoll, item.id);
                  await deleteDoc(subdocRef);
                  deleteCount++;
                }
              }
            }
          }
        }

        const appConfigs = {
          music: {
            currentVibe: data.music?.currentVibe || '',
            vibePhase: data.music?.vibePhase || ''
          },
          bible: {
            currentBook: data.bible?.currentBook || 'Gênesis',
            plan: data.bible?.plan || 'sequential',
            bookProgress: data.bible?.bookProgress || {}
          },
          gym: {
            hoursTrainedTotal: data.gym?.hoursTrainedTotal || 0
          },
          church: {
            bibleReadingStreak: data.church?.bibleReadingStreak || 0,
            cultsAttendedCount: data.church?.cultsAttendedCount || 0
          },
          youtube: {
            apiKey: data.youtube?.apiKey || ''
          },
          queroComprar: {
            customCategories: data.queroComprar?.customCategories || [],
            customCategoriesList: data.queroComprar?.customCategoriesList || [],
            customSubCategories: data.queroComprar?.customSubCategories || {},
            deletedCategories: data.queroComprar?.deletedCategories || [],
            deletedSubCategories: data.queroComprar?.deletedSubCategories || {}
          },
          catalogs: {
            songCategories: data.catalogs?.songCategories || []
          }
        };

        const totalTasks = data.tasks?.length || 0;
        const completedTasks = data.tasks?.filter((t: any) => t.completed).length || 0;
        const pendingTasks = totalTasks - completedTasks;

        let totalEarnings = 0;
        let totalExpenses = 0;
        data.finance?.forEach((f: any) => {
          if (f.type === 'income') totalEarnings += f.amount;
          else totalExpenses += f.amount;
        });
        const balance = totalEarnings - totalExpenses;

        const hoursTrainedTotal = data.gym?.hoursTrainedTotal || 0;
        const churchGoalsCompleted = data.church?.goals?.filter((g: any) => g.completed).length || 0;
        const wishlistItemsCount = data.queroComprar?.items?.length || 0;
        const notesCount = data.notes?.length || 0;
        const photosCount = galleryPhotos.length;

        const statistics = {
          totalTasks,
          completedTasks,
          pendingTasks,
          totalEarnings,
          totalExpenses,
          balance,
          hoursTrainedTotal,
          churchGoalsCompleted,
          wishlistItemsCount,
          notesCount,
          photosCount
        };

        console.log("[Debounced Sync] Sincronizando metadados raiz...");
        await setDoc(userDocRef, {
          userName,
          profilePicUrl,
          age,
          pin,
          onboardingCompleted,
          tutorialCompleted,
          appConfigs,
          statistics,
          databaseVersion: 'v2'
        }, { merge: true });

        lastSavedDataRef.current = JSON.parse(JSON.stringify(data));
        console.log(`[Debounced Sync] Sincronização incremental concluída. Salvos: ${writeCount}, Removidos: ${deleteCount}`);
      } catch (err) {
        console.error("[Debounced Sync] Erro na gravação periódica incremental:", err);
      }
    }, 1200);

    return () => clearTimeout(delayDebounceFn);
  }, [data, userName, profilePicUrl, age, pin, onboardingCompleted, tutorialCompleted, user, isMigrating]);

  // 4. On-Demand Lazy Loading on View Change
  useEffect(() => {
    if (!user || !hasLoadedFromServerRef.current || isMigrating) return;
    
    const paths = getPathsNeededForCurrentView(activeTab, activeOrgSubTab, activeFinSubTab, activeStudiesSubTab, activeEntSubTab);
    if (paths.length > 0) {
      loadSubcollectionData(user.uid, paths);
    }
  }, [activeTab, activeOrgSubTab, activeFinSubTab, activeStudiesSubTab, activeEntSubTab, user, isMigrating]);

  // Sync state changes dynamically from custom events (instant reactivity)
  useEffect(() => {
    const handleProfileUpdate = () => {
      const savedUser = localStorage.getItem('meu_painel_de_vida_username');
      if (savedUser) setUserName(savedUser);
      setProfilePicUrl(localStorage.getItem('meu_painel_de_vida_profile_pic') || '');
    };
    const handleTabsUpdate = () => {
      setTabsVersion(v => v + 1);
    };
    const handleAppearanceUpdate = () => {
      // Re-read dark mode from local storage
      const savedDark = localStorage.getItem('meu_painel_de_vida_dark');
      if (savedDark !== null) {
        setDarkMode(savedDark === 'true');
      }
    };
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                setProfilePicUrl(reader.result);
                localStorage.setItem('meu_painel_de_vida_profile_pic', reader.result);
                window.dispatchEvent(new CustomEvent('lifehub_profile_update'));
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('lifehub_profile_update', handleProfileUpdate);
    window.addEventListener('lifehub_sidebar_reorder', handleTabsUpdate);
    window.addEventListener('lifehub_appearance_update', handleAppearanceUpdate);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('lifehub_profile_update', handleProfileUpdate);
      window.removeEventListener('lifehub_sidebar_reorder', handleTabsUpdate);
      window.removeEventListener('lifehub_appearance_update', handleAppearanceUpdate);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const getCustomizedSidebarItems = () => {
    const saved = localStorage.getItem('lifehub_tabs_config');
    const defaultTabs = [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home', color: 'text-indigo-500', hidden: false, pinned: false, order: 0 },
      { id: 'sete', label: 'Sete IA', icon: 'Sparkles', color: 'text-amber-500 font-extrabold animate-pulse', hidden: false, pinned: false, order: 1 },
      { id: 'organization', label: 'Organização', icon: 'Calendar', color: 'text-cyan-500', hidden: false, pinned: false, order: 2 },
      { id: 'finance', label: 'Vida Financeira', icon: 'DollarSign', color: 'text-emerald-500', hidden: false, pinned: false, order: 3 },
      { id: 'quero_comprar', label: '👕 Quero Comprar', icon: 'ShoppingBag', color: 'text-pink-500 font-extrabold', hidden: false, pinned: false, order: 4 },
      { id: 'studies', label: 'Estudos', icon: 'GraduationCap', color: 'text-violet-500', hidden: false, pinned: false, order: 5 },
      { id: 'gym', label: 'Treino', icon: 'Dumbbell', color: 'text-rose-500', hidden: false, pinned: false, order: 5.5 },
      { id: 'bible', label: 'Igreja', icon: 'Book', color: 'text-amber-500', hidden: false, pinned: false, order: 6 },
      { id: 'catalogs', label: 'Catálogos', icon: 'Folder', color: 'text-indigo-500 font-extrabold', hidden: false, pinned: false, order: 6.5 },
      { id: 'entertainment', label: 'Entretenimento', icon: 'Film', color: 'text-pink-500', hidden: false, pinned: false, order: 7 },
      { id: 'system', label: 'Sistema', icon: 'Settings', color: 'text-slate-500', hidden: false, pinned: false, order: 8 }
    ];

    let tabs = defaultTabs;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep only the valid tab configurations in parsed list or use default
          const validIds = new Set(defaultTabs.map(t => t.id));
          const filtered = parsed.filter((p: any) => validIds.has(p.id)).map((p: any) => {
            // Force rename to the user's new tab specifications
            if (p.id === 'gym') p.label = 'Treino';
            if (p.id === 'studies') p.label = 'Estudos';
            if (p.id === 'bible') p.label = 'Igreja';
            return p;
          });
          const parsedIds = new Set(filtered.map((p: any) => p.id));
          const missing = defaultTabs.filter(d => !parsedIds.has(d.id));
          tabs = [...filtered, ...missing];
        }
      } catch (e) {
        console.error("Erro interpretando abas personalizadas", e);
      }
    }

    const visibleTabs = tabs.filter(t => !t.hidden && t.id !== 'system');
    const pinned = visibleTabs.filter(t => t.pinned).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const unpinned = visibleTabs.filter(t => !t.pinned).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return {
      all: visibleTabs,
      pinned,
      unpinned
    };
  };

  const getTabLabel = (id: string, defaultLabel: string) => {
    if (id === 'gym') return 'Treino';
    if (id === 'studies') return 'Estudos';
    if (id === 'bible') return 'Igreja';

    const saved = localStorage.getItem('lifehub_tabs_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const found = parsed.find((t: any) => t.id === id);
          if (found && found.label) return found.label;
        }
      } catch (e) {}
    }
    return defaultLabel;
  };

  const ICON_MAP: Record<string, React.ComponentType<any>> = {
    Home,
    Sparkles,
    ImageIcon,
    Dumbbell,
    ShoppingBag,
    CheckSquare,
    Clock,
    BookOpen,
    Calendar,
    FileText,
    Tv,
    Music,
    Book,
    Church,
    Youtube,
    Bell,
    DollarSign,
    Settings,
    Trophy,
    GraduationCap,
    Film,
    Folder
  };

  const renderSidebarList = (items: any[]) => {
    return items.map((item) => {
      const isSelected = activeTab === item.id;
      const Icon = ICON_MAP[item.icon] || Settings;

      return (
        <button
          key={item.id}
          onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold tracking-wide text-left transition-all duration-300 cursor-pointer ${
            isSelected
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-650 text-white dark:from-white dark:to-white/90 dark:text-slate-950 shadow-md scale-[1.03] border-t border-white/30 dark:border-white/40'
              : 'text-slate-600 dark:text-slate-350 hover:bg-white/35 dark:hover:bg-slate-900/40 hover:scale-[1.01] hover:text-slate-950 dark:hover:text-white border border-transparent hover:border-white/20 dark:hover:border-white/5'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-slate-100/50 dark:bg-slate-800/50'}`}>
            <Icon size={14} className={isSelected ? 'text-white dark:text-indigo-600' : item.color} />
          </div>
          <span>{item.label}</span>
        </button>
      );
    });
  };

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 2. LocalStorage Syncing
  useEffect(() => {
    if (user && !hasLoadedFromServerRef.current) return;

    // Safeguard: do not save EMPTY_DATA unless an explicit reset is happening
    if (isResettingDataRef.current) {
      localStorage.setItem('meu_painel_de_vida_db', JSON.stringify(data));
      return;
    }

    const hasNoItems = (d: PainelData) => {
      const tasksCount = d.tasks ? d.tasks.length : 0;
      const notesCount = d.notes ? d.notes.length : 0;
      const shoppingCount = d.shoppingList ? d.shoppingList.length : 0;
      const scheduleCount = d.schedule ? d.schedule.length : 0;
      const schoolSubjectsCount = d.schoolSubjects ? d.schoolSubjects.length : 0;
      const studiesCount = d.studies ? d.studies.length : 0;
      return (tasksCount + notesCount + shoppingCount + scheduleCount + schoolSubjectsCount + studiesCount) === 0;
    };

    let dataToSave = data;

    if (user) {
      const stored = localStorage.getItem('meu_painel_de_vida_db');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          let merged = { ...data };
          let mergedAny = false;

          const paths = Object.keys(SUBCOLLECTION_MAP);
          for (const path of paths) {
            // Se o módulo NÃO está marcado como carregado do Firestore nesta sessão,
            // preservamos o valor que já estava salvo no localStorage para não sobrescrevê-lo com vazio
            if (!loadedModulesRef.current[path]) {
              const cachedVal = getValueByPath(parsed, path);
              if (cachedVal !== undefined) {
                merged = setValueByPath(merged, path, cachedVal);
                mergedAny = true;
              }
            }
          }

          if (mergedAny) {
            dataToSave = merged;
          }
        } catch (e) {
          console.error("Erro ao fazer merge inteligente para o localStorage:", e);
        }
      }
    }

    if (hasNoItems(dataToSave)) {
      const stored = localStorage.getItem('meu_painel_de_vida_db');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!hasNoItems(parsed)) {
            console.warn("[Data Guard] Impedindo que dados vazios do estado sobrescrevam o cache local do localStorage contendo dados.");
            return;
          }
        } catch (e) {
          console.error("Erro ao analisar local db no Data Guard", e);
        }
      }
    }

    localStorage.setItem('meu_painel_de_vida_db', JSON.stringify(dataToSave));
  }, [data, user]);

  useEffect(() => {
    localStorage.setItem('meu_painel_de_vida_dark', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('meu_painel_de_vida_username', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('meu_painel_de_vida_profile_pic', profilePicUrl);
  }, [profilePicUrl]);

  useEffect(() => {
    localStorage.setItem('lifehub_onboarding_completed', onboardingCompleted.toString());
  }, [onboardingCompleted]);

  useEffect(() => {
    localStorage.setItem('lifehub_tutorial_completed', tutorialCompleted.toString());
  }, [tutorialCompleted]);

  useEffect(() => {
    localStorage.setItem('lifehub_age', age);
  }, [age]);

  useEffect(() => {
    localStorage.setItem('lifehub_pin', pin);
    localStorage.setItem('meu_painel_de_vida_pin', pin);
  }, [pin]);

  // Handle clicking outside global search to close results panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Dynamic Mutations
  
  // Shopping List Section Callbacks
  const addShoppingItem = (item: Omit<ShoppingItem, 'id' | 'bought'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: `shop-${Date.now()}`,
      bought: false
    };
    setData(prev => ({
      ...prev,
      shoppingList: [newItem, ...prev.shoppingList]
    }));
  };

  const toggleShoppingItem = (id: string) => {
    setData(prev => ({
      ...prev,
      shoppingList: prev.shoppingList.map(item => 
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    }));
  };

  const deleteShoppingItem = (id: string) => {
    setData(prev => ({
      ...prev,
      shoppingList: prev.shoppingList.filter(item => item.id !== id)
    }));
  };

  const editShoppingItem = (updated: ShoppingItem) => {
    setData(prev => ({
      ...prev,
      shoppingList: prev.shoppingList.map(item => 
        item.id === updated.id ? updated : item
      )
    }));
  };

  // Todo tasks Section Callbacks
  const addTask = (text: string, type: 'today' | 'pending') => {
    const todayISO = new Date().toISOString().split('T')[0];
    const newTask: Task = {
      id: `task-${Date.now()}`,
      text,
      completed: false,
      type,
      createdAt: todayISO
    };
    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
  };

  const toggleTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  // Schedule / Cronograma Section Callbacks
  const addScheduleBlock = (time: string, activity: string) => {
    const newBlock: ScheduleItem = {
      id: `sch-${Date.now()}`,
      time,
      activity,
      completed: false
    };
    setData(prev => ({
      ...prev,
      schedule: [...prev.schedule, newBlock]
    }));
  };

  const updateScheduleBlock = (updated: ScheduleItem) => {
    setData(prev => ({
      ...prev,
      schedule: prev.schedule.map(s => s.id === updated.id ? updated : s)
    }));
  };

  const deleteScheduleBlock = (id: string) => {
    setData(prev => ({
      ...prev,
      schedule: prev.schedule.filter(s => s.id !== id)
    }));
  };

  // Study tracker Section Callbacks
  const addStudySubject = (subject: Omit<StudySubject, 'id' | 'history'>) => {
    const newSubject: StudySubject = {
      ...subject,
      id: `study-${Date.now()}`,
      history: []
    };
    setData(prev => ({
      ...prev,
      studies: [newSubject, ...prev.studies]
    }));
  };

  const updateStudySubject = (updated: StudySubject) => {
    setData(prev => ({
      ...prev,
      studies: prev.studies.map(s => s.id === updated.id ? updated : s)
    }));
  };

  const deleteStudySubject = (id: string) => {
    setData(prev => ({
      ...prev,
      studies: prev.studies.filter(s => s.id !== id)
    }));
  };

  const addSchoolSubject = (subject: Omit<SchoolSubject, 'id'>) => {
    const newSubject: SchoolSubject = {
      ...subject,
      id: `school-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      schoolSubjects: [newSubject, ...(prev.schoolSubjects || [])]
    }));
  };

  const updateSchoolSubject = (updated: SchoolSubject) => {
    setData(prev => ({
      ...prev,
      schoolSubjects: (prev.schoolSubjects || []).map(s => s.id === updated.id ? updated : s)
    }));
  };

  const deleteSchoolSubject = (id: string) => {
    setData(prev => ({
      ...prev,
      schoolSubjects: (prev.schoolSubjects || []).filter(s => s.id !== id)
    }));
  };

  const addStudyHistory = (subjectId: string, historyItem: Omit<StudyHistory, 'id'>) => {
    const newHistory: StudyHistory = {
      ...historyItem,
      id: `h-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      studies: prev.studies.map(s => 
        s.id === subjectId 
          ? { ...s, history: [newHistory, ...s.history] } 
          : s
      )
    }));
  };

  const deleteStudyHistory = (subjectId: string, historyId: string) => {
    setData(prev => ({
      ...prev,
      studies: prev.studies.map(s => 
        s.id === subjectId 
          ? { ...s, history: s.history.filter(h => h.id !== historyId) } 
          : s
      )
    }));
  };

  // Media / Entertainment Section Callbacks
  const addMediaItem = (item: Omit<MediaItem, 'id'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      media: [newItem, ...prev.media]
    }));
  };

  const updateMediaItem = (updated: MediaItem) => {
    setData(prev => ({
      ...prev,
      media: prev.media.map(m => m.id === updated.id ? updated : m)
    }));
  };

  const deleteMediaItem = (id: string) => {
    setData(prev => ({
      ...prev,
      media: prev.media.filter(m => m.id !== id)
    }));
  };

  // Music Section Callbacks
  const addMusicTrack = (track: Omit<MusicTrack, 'id'>) => {
    const newTrack: MusicTrack = {
      ...track,
      id: `track-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      music: {
        ...prev.music,
        tracks: [newTrack, ...prev.music.tracks]
      }
    }));
  };

  const deleteMusicTrack = (id: string) => {
    setData(prev => ({
      ...prev,
      music: {
        ...prev.music,
        tracks: prev.music.tracks.filter(t => t.id !== id)
      }
    }));
  };

  const addMusicArtist = (artist: Omit<MusicArtist, 'id'>) => {
    const newArtist: MusicArtist = {
      ...artist,
      id: `art-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      music: {
        ...prev.music,
        artists: [newArtist, ...prev.music.artists]
      }
    }));
  };

  const deleteMusicArtist = (id: string) => {
    setData(prev => ({
      ...prev,
      music: {
        ...prev.music,
        artists: prev.music.artists.filter(a => a.id !== id)
      }
    }));
  };

  const updateMusicMetadata = (metadata: { currentVibe?: string, vibePhase?: string }) => {
    setData(prev => ({
      ...prev,
      music: {
        ...prev.music,
        currentVibe: metadata.currentVibe ?? prev.music.currentVibe,
        vibePhase: metadata.vibePhase ?? prev.music.vibePhase
      }
    }));
  };

  const updateMusicTrack = (updated: MusicTrack) => {
    setData(prev => ({
      ...prev,
      music: {
        ...prev.music,
        tracks: prev.music.tracks.map(t => t.id === updated.id ? updated : t)
      }
    }));
  };

  const updateMusicArtist = (updated: MusicArtist) => {
    setData(prev => ({
      ...prev,
      music: {
        ...prev.music,
        artists: prev.music.artists.map(a => a.id === updated.id ? updated : a)
      }
    }));
  };

  // Bible Tracker / Spiritual Planner Callbacks
  const setBibleCurrentBook = (bookName: string) => {
    setData(prev => ({
      ...prev,
      bible: {
        ...prev.bible,
        currentBook: bookName
      }
    }));
  };

  const setBiblePlan = (plan: 'sequential' | 'chronological') => {
    setData(prev => ({
      ...prev,
      bible: {
        ...prev.bible,
        plan
      }
    }));
  };

  const updateBibleBookProgress = (bookName: string, chaptersRead: number) => {
    setData(prev => ({
      ...prev,
      bible: {
        ...prev.bible,
        bookProgress: {
          ...prev.bible.bookProgress,
          [bookName]: chaptersRead
        }
      }
    }));
  };

  const addBibleReflection = (passage: string, reflection: string) => {
    const todayISO = new Date().toISOString().split('T')[0];
    const newRef: BibleReflection = {
      id: `ref-${Date.now()}`,
      date: todayISO,
      passage,
      reflection
    };
    setData(prev => ({
      ...prev,
      bible: {
        ...prev.bible,
        reflections: [newRef, ...prev.bible.reflections]
      }
    }));
  };

  const deleteBibleReflection = (id: string) => {
    setData(prev => ({
      ...prev,
      bible: {
        ...prev.bible,
        reflections: prev.bible.reflections.filter(r => r.id !== id)
      }
    }));
  };

  const addBibleReadingLog = (book: string, chaptersRead: string) => {
    const todayISO = new Date().toISOString().split('T')[0];
    const newLog: BibleHistoryLog = {
      id: `bh-${Date.now()}`,
      date: todayISO,
      book,
      chaptersRead
    };
    setData(prev => ({
      ...prev,
      bible: {
        ...prev.bible,
        history: [newLog, ...prev.bible.history]
      }
    }));
  };

  // Reminders Sticky Notes Callbacks
  const addReminder = (text: string, priority: 'high' | 'medium' | 'low') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      text,
      priority,
      completed: false,
      createdAt: todayStr
    };
    setData(prev => ({
      ...prev,
      reminders: [newReminder, ...prev.reminders]
    }));
  };

  const toggleReminder = (id: string) => {
    setData(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
    }));
  };

  const deleteReminder = (id: string) => {
    setData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id)
    }));
  };

  const updateReminder = (updated: Reminder) => {
    setData(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === updated.id ? updated : r)
    }));
  };

  // Finances control Section Callbacks
  const addFinanceTransaction = (trans: Omit<FinanceTransaction, 'id'>) => {
    const newTransaction: FinanceTransaction = {
      ...trans,
      id: `fin-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      finance: [newTransaction, ...prev.finance]
    }));
  };

  const deleteFinanceTransaction = (id: string) => {
    setData(prev => ({
      ...prev,
      finance: prev.finance.filter(t => t.id !== id)
    }));
  };

  const updateFinanceTransaction = (updated: FinanceTransaction) => {
    setData(prev => ({
      ...prev,
      finance: prev.finance.map(t => t.id === updated.id ? updated : t)
    }));
  };

  // Calendar Marked Days Callbacks
  const markCalendarDay = (markedDay: CalendarMarkedDay) => {
    setData(prev => {
      const currentDays = prev.calendarMarkedDays || [];
      const filtered = currentDays.filter(d => d.date !== markedDay.date);
      return {
        ...prev,
        calendarMarkedDays: [...filtered, markedDay]
      };
    });
  };

  const unmarkCalendarDay = (date: string) => {
    setData(prev => ({
      ...prev,
      calendarMarkedDays: (prev.calendarMarkedDays || []).filter(d => d.date !== date)
    }));
  };

  // Notes Callbacks
  const addNote = (note: Omit<NoteEntry, 'id' | 'createdAt'>) => {
    const newNote: NoteEntry = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      notes: [newNote, ...(prev.notes || [])]
    }));
  };

  const updateNote = (updatedNote: NoteEntry) => {
    setData(prev => ({
      ...prev,
      notes: (prev.notes || []).map(n => n.id === updatedNote.id ? updatedNote : n)
    }));
  };

  const deleteNote = (id: string) => {
    setData(prev => ({
      ...prev,
      notes: (prev.notes || []).filter(n => n.id !== id)
    }));
  };

  // Creativity Projects Callbacks
  const addCreativeProject = (project: Omit<CreativityProject, 'id' | 'createdAt'>) => {
    const newProj: CreativityProject = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      creativityProjects: [newProj, ...(prev.creativityProjects || [])]
    }));
  };

  const updateCreativeProject = (updatedProj: CreativityProject) => {
    setData(prev => ({
      ...prev,
      creativityProjects: (prev.creativityProjects || []).map(p => p.id === updatedProj.id ? updatedProj : p)
    }));
  };

  const deleteCreativeProject = (id: string) => {
    setData(prev => ({
      ...prev,
      creativityProjects: (prev.creativityProjects || []).filter(p => p.id !== id)
    }));
  };

  // 4. Global Multi-Module System Backups / Import triggers
  const importFullBackup = (newData: PainelData) => {
    setData(newData);
  };

  const resetToFactoryDefaults = () => {
    isResettingDataRef.current = true;
    setData(EMPTY_DATA);
    setTimeout(() => {
      isResettingDataRef.current = false;
    }, 3000);
  };

  const handleUpdateGymState = (updater: (prev: GymState) => GymState) => {
    setData(prev => {
      const currentGym = prev.gym || { workouts: [], goals: [], measurements: [], photos: [], calendar: {}, hoursTrainedTotal: 0 };
      const updatedGym = updater(currentGym);
      return {
        ...prev,
        gym: updatedGym
      };
    });
  };

  const handleApplySeteActions = (actions: any[]) => {
    if (!actions || !Array.isArray(actions)) return;
    
    actions.forEach(action => {
      const { type, payload } = action;
      if (!payload) return;
      
      console.log(`[Sete Action Applied] Applying action: ${type}`, payload);
      
      switch (type) {
        case 'add_shopping': {
          addShoppingItem({
            name: payload.name || 'Sem nome',
            estimatedPrice: Number(payload.estimatedPrice) || 0,
            category: payload.category || 'others',
            subCategory: 'others',
            size: payload.size || ''
          });
          break;
        }
        case 'add_media': {
          addMediaItem({
            title: payload.title || 'Sem título',
            type: payload.mediaType || 'movie',
            status: payload.status || 'planning',
            progress: 'Pendente',
            rating: Number(payload.rating) || 0,
            notes: payload.notes || 'Adicionado por Sete 🐑'
          });
          break;
        }
        case 'add_task': {
          addTask(
            payload.text || 'Tarefa s/ título',
            payload.taskType || 'today'
          );
          break;
        }
        case 'add_note': {
          addNote({
            title: payload.title || 'Nota Fofa',
            content: payload.content || '',
            color: payload.color || 'bg-amber-50 dark:bg-amber-950/20 text-indigo-950 dark:text-indigo-150 border-amber-200'
          });
          break;
        }
        case 'add_gym_goal': {
          setData(prev => {
            const currentGym = prev.gym || { workouts: [], goals: [], measurements: [], photos: [], calendar: {}, hoursTrainedTotal: 0 };
            const goals = currentGym.goals || [];
            const newG = {
              id: `goal-${Date.now()}`,
              title: payload.title || 'Meta s/ nome',
              completed: false,
              createdAt: new Date().toISOString().split('T')[0]
            };
            return {
              ...prev,
              gym: {
                ...currentGym,
                goals: [...goals, newG]
              }
            };
          });
          break;
        }
        default:
          console.warn(`[Sete Action] Tipo de ação desconhecido: ${type}`);
      }
    });
  };

  const clearAllData = () => {
    isResettingDataRef.current = true;
    setData({
      shoppingList: [],
      tasks: [],
      schedule: [],
      studies: [],
      media: [],
      music: { tracks: [], artists: [], currentVibe: '', vibePhase: '' },
      bible: { currentBook: 'Gênesis', plan: 'sequential', bookProgress: {}, reflections: [], history: [] },
      reminders: [],
      finance: [],
      calendarMarkedDays: [],
      notes: [],
      creativityProjects: []
    });
    setTimeout(() => {
      isResettingDataRef.current = false;
    }, 3000);
  };

  const handleLockApp = () => {
    setSessionUnlocked(false);
    sessionStorage.removeItem('lifehub_unlocked');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  const handleRestartOnboarding = () => {
    setOnboardingCompleted(false);
  };

  // 5. Global Search across ALL sections helper
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: Array<{ id: string, label: string, module: string, tab: string }> = [];

    // Search shopping items
    data.shoppingList.forEach(item => {
      if (item.name.toLowerCase().includes(query)) {
        results.push({ id: item.id, label: `🛍️ Compras: ${item.name}`, module: 'Compras', tab: 'shoppingList' });
      }
    });

    // Search tasks
    data.tasks.forEach(t => {
      if (t.text.toLowerCase().includes(query)) {
        results.push({ id: t.id, label: `📋 Tarefa: ${t.text}`, module: 'Tarefas', tab: 'tasks' });
      }
    });

    // Search schedule
    data.schedule.forEach(s => {
      if (s.activity.toLowerCase().includes(query)) {
        results.push({ id: s.id, label: `⏰ Cronograma: [${s.time}] ${s.activity}`, module: 'Cronograma', tab: 'schedule' });
      }
    });

    // Search study subjects
    data.studies.forEach(s => {
      if (s.name.toLowerCase().includes(query) || s.contentsStudied.toLowerCase().includes(query)) {
        results.push({ id: s.id, label: `🎓 Estudos: ${s.name}`, module: 'Estudos', tab: 'studies' });
      }
    });

    // Search movies/anime mídias
    data.media.forEach(m => {
      if (m.title.toLowerCase().includes(query) || m.notes.toLowerCase().includes(query)) {
        results.push({ id: m.id, label: `📺 Filme/Anime: ${m.title}`, module: 'Mídias', tab: 'media' });
      }
    });

    // Search music
    data.music.tracks.forEach(track => {
      if (track.title.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query)) {
        results.push({ id: track.id, label: `🎵 Música: ${track.title} - ${track.artist}`, module: 'Música', tab: 'music' });
      }
    });

    // Search reminders sticky notes
    data.reminders.forEach(r => {
      if (r.text.toLowerCase().includes(query)) {
        results.push({ id: r.id, label: `🔔 Lembrete: ${r.text}`, module: 'Lembretes', tab: 'reminders' });
      }
    });

    // Search cash flow transactions description
    data.finance.forEach(f => {
      if (f.description.toLowerCase().includes(query)) {
        results.push({ id: f.id, label: `💰 Finanças: ${f.description} (R$ ${f.amount})`, module: 'Financeiro', tab: 'finance' });
      }
    });

    // Search Notes
    (data.notes || []).forEach(n => {
      if (n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)) {
        results.push({ id: n.id, label: `📝 Nota: ${n.title}`, module: 'Notas', tab: 'notes' });
      }
    });

    // Search Projects
    (data.creativityProjects || []).forEach(p => {
      if (p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
        results.push({ id: p.id, label: `🎨 Projeto: ${p.title}`, module: 'Criatividade', tab: 'creativity' });
      }
    });

    // Search Church Events, Commitments or Studies
    if (data.church) {
      (data.church.events || []).forEach(e => {
        if (e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query)) {
          results.push({ id: e.id, label: `⛪ Igreja Evento: ${e.title}`, module: 'Igreja', tab: 'church' });
        }
      });
      (data.church.studies || []).forEach(st => {
        if (st.theme.toLowerCase().includes(query) || st.notes.toLowerCase().includes(query)) {
          results.push({ id: st.id, label: `⛪ Estudo Teologia: ${st.theme}`, module: 'Igreja', tab: 'church' });
        }
      });
    }

    // Search YouTube Saved Videos
    if (data.youtube && data.youtube.saved) {
      data.youtube.saved.forEach(sv => {
        if (sv.title.toLowerCase().includes(query) || sv.channelTitle.toLowerCase().includes(query)) {
          results.push({ id: sv.id, label: `▶️ Mídia Vídeo: ${sv.title}`, module: 'Mídias YT', tab: 'youtube' });
        }
      });
    }

    return results.slice(0, 8); // return top 8 hits
  };

  const matchingSuggestions = getSearchResults();

  // Sidebar list of navigation categories
  const sidebarNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-indigo-500' },
    { id: 'sete', label: 'Sete (Assistente IA)', icon: Sparkles, color: 'text-amber-500 font-black animate-pulse' },
    { id: 'gallery', label: 'Galeria Pessoal', icon: ImageIcon, color: 'text-sky-500 font-extrabold' },
    { id: 'gym', label: 'Treino', icon: Dumbbell, color: 'text-orange-500' },
    { id: 'shoppingList', label: 'Lista de Compras', icon: ShoppingBag, color: 'text-rose-500' },
    { id: 'quero_comprar', label: '👕 Quero Comprar', icon: ShoppingBag, color: 'text-pink-500 font-extrabold' },
    { id: 'tasks', label: 'Tarefas do Dia', icon: CheckSquare, color: 'text-indigo-400' },
    { id: 'schedule', label: 'Cronograma Diário', icon: Clock, color: 'text-cyan-500' },
    { id: 'studies', label: 'Estudos', icon: BookOpen, color: 'text-violet-500' },
    { id: 'calendar', label: 'Calendário', icon: Calendar, color: 'text-violet-500' },
    { id: 'notes', label: 'Notas', icon: FileText, color: 'text-amber-500' },
    { id: 'creativity', label: 'Criatividade', icon: Sparkles, color: 'text-pink-500' },
    { id: 'media', label: 'Mídias (Filmes / Animes)', icon: Tv, color: 'text-emerald-500' },
    { id: 'music', label: 'Músicas & Artistas', icon: Music, color: 'text-pink-500' },
    { id: 'bible', label: 'Igreja', icon: Book, color: 'text-amber-500' },
    { id: 'catalogs', label: 'Catálogos', icon: Folder, color: 'text-indigo-500 font-extrabold' },
    { id: 'church', label: 'Vida na Igreja', icon: Church, color: 'text-rose-600' },
    { id: 'youtube', label: 'Central de Mídia', icon: Youtube, color: 'text-red-500' },
    { id: 'reminders', label: 'Lembretes & Alertas', icon: Bell, color: 'text-amber-400 animate-pulse' },
    { id: 'finance', label: 'Controle Financeiro', icon: DollarSign, color: 'text-emerald-400' },
    { id: 'settings', label: 'Sistema & Segurança', icon: Settings, color: 'text-slate-500' }
  ];

  const handleSearchResultClick = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const renderTutorialOverlay = () => {
    if (!onboardingCompleted || tutorialCompleted || !user) return null;
    return (
      <SeteTutorial 
        currentStepIndex={tutorialStepIndex}
        onStepIndexChange={setTutorialStepIndex}
        onStepChange={(tabId) => {
          setActiveTab(tabId);
          if (tabId === 'organization') {
            setActiveOrgSubTab('home');
          } else if (tabId === 'finance') {
            setActiveFinSubTab('home');
          } else if (tabId === 'studies') {
            setActiveStudiesSubTab('home');
          } else if (tabId === 'entertainment') {
            setActiveEntSubTab('home');
          }
        }}
        onComplete={async () => {
          setTutorialCompleted(true);
          setTutorialStepIndex(0);
          setActiveTab('dashboard');
          try {
            const userDocRef = doc(db, 'users_data', user.uid);
            console.log("[setDoc] Iniciando gravação de conclusão do tutorial");
            console.log("[setDoc] Documento:", userDocRef.path);
            console.log("[setDoc] Dados enviados:", { tutorialCompleted: true });
            await setDoc(userDocRef, {
              tutorialCompleted: true
            }, { merge: true });
            console.log("[setDoc] Conclusão do tutorial persistida com sucesso.");
          } catch (err) {
            console.error("Erro ao salvar progresso do tutorial:", err);
          }
        }}
      />
    );
  };

  // 1. Loading State Gate
  if (loadingAuth) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-100 z-50">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest font-black text-slate-400 animate-pulse">Sincronizando Painel de Vida...</p>
      </div>
    );
  }

  // 1.5. Database Migration State Gate
  if (isMigrating) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-100 z-50">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-6" />
        <p className="text-sm uppercase tracking-widest font-black text-emerald-400 mb-2">Atualizando banco de dados...</p>
        <p className="text-xs text-slate-400 text-center max-w-md px-4 font-mono">{migrationProgress}</p>
      </div>
    );
  }

  // 2. Auth State Gate (User must log in or sign up first)
  if (!user) {
    return <AuthScreen onSuccess={() => setActiveTab('dashboard')} />;
  }

  // 3. Onboarding Wizard Gate (Trigger for brand new users)
  if (!onboardingCompleted) {
    return (
      <OnboardingWizard 
        initialName={userName || user.displayName || ''}
        onComplete={(profile) => {
          setUserName(profile.name);
          if (profile.photo) setProfilePicUrl(profile.photo);
          setAge(profile.age);
          setPin(profile.pin);
          setOnboardingCompleted(true);
          setSessionUnlocked(true);
          sessionStorage.setItem('lifehub_unlocked', 'true');
        }} 
        onSignOut={handleSignOut}
      />
    );
  }

  // 4. Session Lock Screen Gate (If PIN is set but session is still locked)
  if (pin && !sessionUnlocked) {
    const isGoogle = user.providerData?.some((p: any) => p.providerId === 'google.com');

    const handleResetPinWithPassword = async (password: string): Promise<boolean> => {
      if (!user || !user.email) return false;
      try {
        await signInWithEmailAndPassword(auth, user.email, password);
        return true;
      } catch (err) {
        console.error("Erro na re-autenticação do PIN:", err);
        return false;
      }
    };

    return (
      <LockScreen 
        correctPin={pin} 
        onUnlock={() => {
          setSessionUnlocked(true);
          sessionStorage.setItem('lifehub_unlocked', 'true');
        }} 
        onResetPinWithPassword={handleResetPinWithPassword}
        onSignOut={handleSignOut}
        isGoogleUser={isGoogle}
      />
    );
  }

  if (activeTab === 'sete') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
        <SeteSection 
          data={data} 
          onApplyActions={handleApplySeteActions} 
          onCloseSete={() => setActiveTab('dashboard')} 
          siteData={getCompleteSiteData()}
          getLatestSiteData={handleGetLatestSiteData}
        />
        {renderTutorialOverlay()}
      </div>
    );
  }

  if (activeTab === 'quero_comprar') {
    return (
      <div className="h-screen w-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col">
        <QueroComprarSection 
          data={data}
          onUpdateData={(newData) => setData(newData)}
          onClose={() => setActiveTab('dashboard')}
        />
        {renderTutorialOverlay()}
      </div>
    );
  }

  if (activeTab === 'notes') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
        <NotesSection 
          notes={data.notes || []} 
          onAddNote={addNote} 
          onUpdateNote={updateNote} 
          onDeleteNote={deleteNote} 
          onCloseNotes={() => setActiveTab('organization')} 
        />
        {renderTutorialOverlay()}
      </div>
    );
  }

  if (activeTab === 'creativity') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
        <CreativitySection 
          projects={data.creativityProjects || []} 
          onAddProject={addCreativeProject} 
          onUpdateProject={updateCreativeProject} 
          onDeleteProject={deleteCreativeProject} 
          onCloseCreativity={() => setActiveTab('organization')} 
        />
        {renderTutorialOverlay()}
      </div>
    );
  }

  if (activeTab === 'bible') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
        <BibleSection 
          bibleState={data.bible}
          onSetCurrentBook={setBibleCurrentBook}
          onSetReadingPlan={setBiblePlan}
          onUpdateBookProgress={updateBibleBookProgress}
          onAddReflection={addBibleReflection}
          onDeleteReflection={deleteBibleReflection}
          onAddReadingLog={addBibleReadingLog}
          churchData={data.church}
          onUpdateChurch={(updated) => setData(prev => ({ ...prev, church: updated }))}
          onChooseTab={setActiveTab}
        />
        {renderTutorialOverlay()}
      </div>
    );
  }

  /* 100% FULL-SCREEN APPLICATION INTERCEPT FOR ORGANIZATION */
  if (activeTab === 'organization') {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-[#070b19] flex flex-col overflow-y-auto">
        {/* Module Header Bar */}
        <div className="max-w-7xl mx-auto w-full px-4 pt-6 pb-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-left w-full relative flex flex-col md:flex-row md:items-center justify-between">
            <button 
              onClick={() => {
                if (activeOrgSubTab === 'home') {
                  setActiveTab('dashboard');
                } else {
                  setActiveOrgSubTab('home');
                }
              }}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-2xs transition-all hover:translate-x-[-2px] self-start"
            >
              <ArrowLeft size={13} className="text-slate-500 group-hover:text-slate-750 dark:group-hover:text-white transition-colors" />
              <span>{activeOrgSubTab === 'home' ? 'Voltar ao Dashboard' : 'Voltar às Opções'}</span>
            </button>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center flex-1 md:absolute md:left-1/2 md:-translate-x-1/2">📅 {getTabLabel('organization', 'Módulo Organização')}</h1>

            {/* Premium Apple-Style Subtabs Navigation Bar removed to avoid redundant subtabs navigation bar at the top */}
          </div>
        </div>

        {/* Content Section */}
        {activeOrgSubTab === 'home' ? (
          <div className="flex flex-col items-center justify-center p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-6">
              
              {/* Minhas Tarefas */}
              <button 
                onClick={() => setActiveOrgSubTab('tasks')} 
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-indigo-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><CheckSquare size={20} /></div>
                  <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                    {data.tasks.filter(t => !t.completed).length} Pendentes
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors">Minhas Tarefas</h3>
              </button>

              {/* Cronograma Diário */}
              <button 
                onClick={() => setActiveOrgSubTab('schedule')} 
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-teal-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-teal-500/10 text-teal-500 rounded-xl"><Clock size={20} /></div>
                  <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                    {data.schedule.length} Blocos
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-teal-500 transition-colors">Cronograma Diário</h3>
              </button>

              {/* Calendário Mensal */}
              <button 
                onClick={() => setActiveOrgSubTab('calendar')} 
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-blue-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Calendar size={20} /></div>
                  <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                    Calendário
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">Calendário Mensal</h3>
              </button>

              {/* Lembretes & Alertas */}
              <button 
                onClick={() => setActiveOrgSubTab('reminders')} 
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-rose-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl"><Bell size={20} /></div>
                  <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                    {data.reminders.length} Itens
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-rose-500 transition-colors">Lembretes & Alertas</h3>
              </button>

              {/* Minhas Notas */}
              <button 
                onClick={() => {
                  setActiveOrgSubTab('notes');
                  setActiveTab('notes');
                }} 
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-cyan-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl"><FileText size={20} /></div>
                  <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                    {data.notes?.length || 0} Notas
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-cyan-500 transition-colors">Minhas Notas</h3>
              </button>

              {/* Criatividade */}
              <button 
                onClick={() => {
                  setActiveOrgSubTab('creativity');
                  setActiveTab('creativity');
                }} 
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-violet-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl"><Sparkles size={20} /></div>
                  <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                    Projetos
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-violet-500 transition-colors">Criatividade</h3>
              </button>

            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto w-full px-4 py-4 md:px-8 flex-1">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200/60 dark:border-slate-800/85 rounded-3xl p-6 shadow-xs">
              {activeOrgSubTab === 'tasks' && <TasksSection tasks={data.tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} />}
              {activeOrgSubTab === 'schedule' && <ScheduleSection schedule={data.schedule} onAdd={addScheduleBlock} onUpdate={updateScheduleBlock} onDelete={deleteScheduleBlock} />}
              {activeOrgSubTab === 'calendar' && <CalendarSection markedDays={data.calendarMarkedDays || []} onMarkDay={markCalendarDay} onUnmarkDay={unmarkCalendarDay} />}
              {activeOrgSubTab === 'reminders' && <RemindersSection reminders={[...data.reminders, ...getGiftReminders(data)]} onAdd={addReminder} onToggle={toggleReminder} onDelete={deleteReminder} onUpdate={updateReminder} />}
            </div>
          </div>
        )}
        {renderTutorialOverlay()}
      </div>
    );
  }

  /* 100% FULL-SCREEN APPLICATION INTERCEPT FOR FINANCE */
  if (activeTab === 'finance') {
    const currentSub = activeFinSubTab === 'home' ? 'finance' : activeFinSubTab;

    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-[#070b19] flex flex-col overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-4 pt-6 pb-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <button 
              onClick={() => {
                setActiveFinSubTab('home');
                setActiveTab('dashboard');
              }}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-2xs transition-all hover:translate-x-[-2px]"
            >
              <ArrowLeft size={13} className="text-slate-500 group-hover:text-slate-755 dark:group-hover:text-white transition-colors" />
              <span>&larr; Voltar ao Dashboard</span>
            </button>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5">💰 {getTabLabel('finance', 'Vida Financeira')}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-100/90 dark:bg-slate-900/80 p-2 rounded-2xl md:rounded-full border border-slate-200/60 dark:border-slate-800 shadow-sm backdrop-blur-md w-full md:w-auto justify-center">
            <button 
              onClick={() => setActiveFinSubTab('finance')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-bold text-xs tracking-tight transition-all active:scale-95 duration-150 ${
                currentSub === 'finance' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-350 shadow-xs border border-emerald-100 dark:border-emerald-900/55 scale-[1.03]' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/30'
              }`}
            >
              <DollarSign size={18} />
              <span>Controle Financeiro</span>
            </button>

            <button 
              onClick={() => setActiveFinSubTab('shoppingList')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-bold text-xs tracking-tight transition-all active:scale-95 duration-150 ${
                currentSub === 'shoppingList' 
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-350 shadow-xs border border-teal-100 dark:border-teal-900/55 scale-[1.03]' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/30'
              }`}
            >
              <ShoppingCart size={18} />
              <span>Lista de Compras</span>
            </button>

            <button 
              onClick={() => setActiveFinSubTab('stationery')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-bold text-xs tracking-tight transition-all active:scale-95 duration-150 ${
                currentSub === 'stationery' 
                  ? 'bg-lime-50 dark:bg-lime-950/40 text-lime-600 dark:text-lime-350 shadow-xs border border-lime-100 dark:border-lime-900/55 scale-[1.03]' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/30'
              }`}
            >
              <BookOpen size={18} />
              <span>Papelaria</span>
            </button>

            <button 
              onClick={() => setActiveFinSubTab('sales')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-bold text-xs tracking-tight transition-all active:scale-95 duration-150 ${
                currentSub === 'sales' 
                  ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-350 shadow-xs border border-green-100 dark:border-green-900/55 scale-[1.03]' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/30'
              }`}
            >
              <BarChart3 size={18} />
              <span>Histórico de Vendas</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 py-4 md:px-8 flex-1">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200/60 dark:border-slate-800/85 rounded-3xl p-6 shadow-xs">
            {currentSub === 'finance' && <FinanceSection finance={data.finance} onAdd={addFinanceTransaction} onDelete={deleteFinanceTransaction} onUpdate={updateFinanceTransaction} />}
            {currentSub === 'shoppingList' && (
              <ShoppingListSection 
                shoppingList={data.shoppingList} 
                onAdd={addShoppingItem} 
                onToggle={toggleShoppingItem} 
                onDelete={deleteShoppingItem} 
                onEdit={editShoppingItem}
              />
            )}
            {currentSub === 'stationery' && (
              <StationerySuite 
                transactions={data.finance}
                onAddTransaction={(type, description, amount, category) => {
                  addFinanceTransaction({
                    type,
                    description,
                    amount,
                    category,
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                onDeleteTransaction={deleteFinanceTransaction}
                mode="papelaria"
              />
            )}
            {currentSub === 'sales' && (
              <StationerySuite 
                transactions={data.finance}
                onAddTransaction={(type, description, amount, category) => {
                  addFinanceTransaction({
                    type,
                    description,
                    amount,
                    category,
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                onDeleteTransaction={deleteFinanceTransaction}
                mode="sales"
              />
            )}
          </div>
        </div>
        {renderTutorialOverlay()}
      </div>
    );
  }

  /* 100% FULL-SCREEN APPLICATION INTERCEPT FOR STUDIES */
  if (activeTab === 'studies') {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-[#070b19] flex flex-col overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-4 pt-6 pb-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <button 
              onClick={() => {
                setActiveTab('dashboard');
              }}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-755 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-2xs transition-all hover:translate-x-[-2px]"
            >
              <ArrowLeft size={13} className="text-slate-500 group-hover:text-slate-755 dark:group-hover:text-white transition-colors" />
              <span>&larr; Voltar ao Dashboard</span>
            </button>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5">📚 {getTabLabel('studies', 'Estudos')}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 py-4 md:px-8 flex-1">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200/60 dark:border-slate-800/85 rounded-3xl p-6 shadow-xs">
            <StudiesSection 
              studies={data.studies}
              schoolSubjects={data.schoolSubjects || []}
              onAddSubject={addStudySubject}
              onUpdateSubject={updateStudySubject}
              onDeleteSubject={deleteStudySubject}
              onAddHistory={addStudyHistory}
              onDeleteHistory={deleteStudyHistory}
              onAddSchoolSubject={addSchoolSubject}
              onUpdateSchoolSubject={updateSchoolSubject}
              onDeleteSchoolSubject={deleteSchoolSubject}
            />
          </div>
        </div>
        {renderTutorialOverlay()}
      </div>
    );
  }

  /* 100% FULL-SCREEN APPLICATION INTERCEPT FOR ENTERTAINMENT */
  if (activeTab === 'entertainment') {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-[#070b19] flex flex-col overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-4 pt-6 pb-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-left w-full relative flex flex-col md:flex-row md:items-center justify-between">
            <button 
              onClick={() => {
                if (activeEntSubTab === 'home') {
                  setActiveTab('dashboard');
                } else {
                  setActiveEntSubTab('home');
                }
              }}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-2xs transition-all hover:translate-x-[-2px] self-start"
            >
              <ArrowLeft size={13} className="text-slate-500 group-hover:text-slate-755 dark:group-hover:text-white transition-colors" />
              <span>{activeEntSubTab === 'home' ? 'Voltar ao Dashboard' : 'Voltar às Opções'}</span>
            </button>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center flex-1 md:absolute md:left-1/2 md:-translate-x-1/2">🎬 {getTabLabel('entertainment', 'Central de Entretenimento')}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 py-4 md:px-8 flex-1">
          {activeEntSubTab === 'home' ? (
            <div className="flex flex-col items-center justify-center p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-6">
                
                {/* Filmes */}
                <button 
                  onClick={() => setActiveEntSubTab('movies')} 
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-red-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Film size={20} /></div>
                    <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                      {data.media?.filter(m => m.type === 'movie').length || 0} Itens
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-red-500 transition-colors">Filmes</h3>
                </button>

                {/* Séries */}
                <button 
                  onClick={() => setActiveEntSubTab('series')} 
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-blue-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Tv size={20} /></div>
                    <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                      {data.media?.filter(m => m.type === 'series').length || 0} Itens
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">Séries</h3>
                </button>

                {/* Animes */}
                <button 
                  onClick={() => setActiveEntSubTab('animes')} 
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-purple-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Sparkles size={20} /></div>
                    <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                      {data.media?.filter(m => m.type === 'anime').length || 0} Itens
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-purple-500 transition-colors">Animes</h3>
                </button>

                {/* Músicas */}
                <button 
                  onClick={() => setActiveEntSubTab('music')} 
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-green-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Music size={20} /></div>
                    <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">
                      {data.music?.tracks?.length || 0} Trilhas
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-green-500 transition-colors">Músicas</h3>
                </button>

                {/* Galeria */}
                <button 
                  onClick={() => setActiveEntSubTab('gallery')} 
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl text-left hover:border-pink-500 transition-all flex flex-col justify-between h-36 relative overflow-hidden group shadow-xs cursor-pointer"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl"><ImageIcon size={20} /></div>
                    <span className="text-[10px] font-black bg-slate-150 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono text-slate-600 dark:text-slate-300">Galeria</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white group-hover:text-pink-500 transition-colors">Galeria</h3>
                </button>

              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200/60 dark:border-slate-800/85 rounded-3xl p-6 shadow-xs relative">
              <div className="mb-4 flex justify-between items-center border-b dark:border-slate-800 pb-3">
                <button 
                  onClick={() => setActiveEntSubTab('home')} 
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-[10px] font-black transition-all flex items-center gap-1 border dark:border-slate-700 shadow-3xs cursor-pointer"
                >
                  <ArrowLeft size={11} className="text-pink-500 font-black" />
                  <span>Voltar às Opções</span>
                </button>
                <span className="text-xs font-black uppercase text-pink-500 tracking-wider">
                  {activeEntSubTab === 'movies' && 'Filmes'}
                  {activeEntSubTab === 'series' && 'Séries'}
                  {activeEntSubTab === 'animes' && 'Animes'}
                  {activeEntSubTab === 'music' && 'Músicas'}
                  {activeEntSubTab === 'gallery' && 'Galeria'}
                </span>
              </div>

              {activeEntSubTab === 'movies' && (
                <MediaSection 
                  media={data.media || []} 
                  defaultType="movie" 
                  onAdd={addMediaItem} 
                  onUpdate={updateMediaItem} 
                  onDelete={deleteMediaItem} 
                />
              )}
              {activeEntSubTab === 'series' && (
                <MediaSection 
                  media={data.media || []} 
                  defaultType="series" 
                  onAdd={addMediaItem} 
                  onUpdate={updateMediaItem} 
                  onDelete={deleteMediaItem} 
                />
              )}
              {activeEntSubTab === 'animes' && (
                <MediaSection 
                  media={data.media || []} 
                  defaultType="anime" 
                  onAdd={addMediaItem} 
                  onUpdate={updateMediaItem} 
                  onDelete={deleteMediaItem} 
                />
              )}
              {activeEntSubTab === 'music' && (
                <MusicSection 
                  music={data.music}
                  onAddTrack={addMusicTrack}
                  onDeleteTrack={deleteMusicTrack}
                  onAddArtist={addMusicArtist}
                  onDeleteArtist={deleteMusicArtist}
                  onUpdateMetadata={updateMusicMetadata}
                  onUpdateTrack={updateMusicTrack}
                  onUpdateArtist={updateMusicArtist}
                />
              )}
              {activeEntSubTab === 'gallery' && <GallerySection />}
            </div>
          )}
        </div>
        {renderTutorialOverlay()}
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans antialiased text-slate-850 dark:text-slate-100 transition-colors duration-300 bg-slate-50 dark:bg-[#070b19] flex flex-col relative overflow-hidden">
      
      {/* Dynamic Module Loading Indicator */}
      {loadingModuleData && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 bg-indigo-600/95 backdrop-blur-md text-white rounded-2xl shadow-xl border border-indigo-500/50 text-xs font-semibold animate-bounce">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Carregando dados no Firestore...</span>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
      
      {/* Top Universal Navbar Header (Dark mode toggler, brand and global search) */}
      <header className="sticky top-0 z-30 bg-white/40 dark:bg-[#080f26]/50 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 shadow-sm px-4 py-3 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Brand Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 px-1.5 border dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden text-slate-600 dark:text-slate-300"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-3">
              {/* Opção para colocar foto de perfil lá no canto superior esquerdo */}
              <div className="relative group/avatar w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-600 dark:border-indigo-500 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                {profilePicUrl ? (
                  <img 
                    src={profilePicUrl} 
                    alt="Marcos" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={() => setProfilePicUrl('')}
                  />
                ) : (
                  <span className="text-sm font-extrabold text-indigo-650 dark:text-indigo-400">M</span>
                )}
                {/* Full overlay for file upload */}
                <label className="absolute inset-0 bg-indigo-650/90 text-white text-[8px] font-bold text-center flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity">
                  <span>Subir</span>
                  <span className="text-[6px] opacity-75 hidden md:block">Ctrl+V</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            setProfilePicUrl(reader.result);
                            localStorage.setItem('meu_painel_de_vida_profile_pic', reader.result);
                            window.dispatchEvent(new CustomEvent('lifehub_profile_update'));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div 
                onClick={() => setActiveTab('dashboard')}
                className="cursor-pointer hover:opacity-85 select-none"
              >
                <span className="text-sm md:text-base font-display font-bold text-slate-900 dark:text-white block tracking-tight leading-4">
                  {userName}
                </span>
              </div>
            </div>
          </div>

          {/* Global Search Bar (Busca global no site) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-sm md:max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchResults(true)}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                placeholder="Fazer busca global em todo painel de vida..."
                className="w-full bg-slate-100/85 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 focus:border-indigo-500 rounded-xl p-2 pl-9 text-xs focus:outline-none dark:text-white"
              />
            </div>

            {/* Results Floating overlay panel list */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute top-[100%] mt-1.5 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50 overflow-hidden max-h-[300px]">
                <h4 className="text-[10px] text-slate-400 uppercase font-bold px-2 py-1 select-none">Resultados Globais Encontrados:</h4>
                <div className="space-y-0.5">
                  {matchingSuggestions.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => handleSearchResultClick(res.tab)}
                      className="p-2 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer text-xs font-medium dark:text-white flex items-center justify-between"
                    >
                      <span className="truncate pr-4">{res.label}</span>
                      <span className="text-[9px] uppercase font-bold bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                        {res.module}
                      </span>
                    </div>
                  ))}

                  {matchingSuggestions.length === 0 && (
                    <p className="text-xs text-slate-400 p-3 text-center">Nenhum resultado corresponde à busca.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light toggle switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 border border-slate-200/50 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
              title={darkMode ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
            >
              {darkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>


            {/* Quick Greeting */}
            <span className="text-xs font-medium text-slate-400 hidden lg:inline">
              Oi, <span className="text-slate-900 dark:text-white font-bold">{userName}</span>
            </span>
          </div>

        </div>
      </header>

      {/* Main Structural responsive double-column layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex relative">
        
        {/* Left Sidebar Menu for Desktop */}
        <aside className="w-64 border-r border-slate-200/60 dark:border-slate-800 p-5 shrink-0 hidden md:block space-y-6">
          
          <div className="space-y-4">
            {(() => {
              const { pinned, unpinned } = getCustomizedSidebarItems();
              return (
                <>
                  {pinned.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[12px] font-black text-amber-500 px-2 block">★</span>
                      <nav className="space-y-0.5">
                        {renderSidebarList(pinned)}
                      </nav>
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 px-2 block">Navegação Geral</span>
                    <nav className="space-y-0.5">
                      {renderSidebarList(unpinned)}
                    </nav>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-850 p-3.5 text-center bg-slate-50 dark:bg-slate-900/45 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-500 block mb-1.5">📖 Versículo do Dia:</span>
            <p className="text-[11px] leading-relaxed font-semibold text-slate-800 dark:text-slate-200">
              "{getDailyVerse().text}"
            </p>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block mt-1">
              — {getDailyVerse().ref}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-left cursor-pointer transition-colors ${
                activeTab === 'system'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950/20 active:scale-95'
              }`}
            >
              <Settings size={15} className={`${activeTab === 'system' ? 'text-white' : 'text-slate-500'} shrink-0`} />
              <span>Sistema</span>
            </button>
          </div>
        </aside>

        {/* Mobile Slide Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black z-40 md:hidden"
              />
              
              {/* Drawer Container */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-250 dark:border-slate-800 z-50 p-5 space-y-6 md:hidden overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="font-bold font-display text-slate-900 dark:text-white">Meu Painel de Vida</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:opacity-70 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const { pinned, unpinned } = getCustomizedSidebarItems();
                    return (
                      <>
                        {pinned.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[12px] font-black text-amber-500 px-2 block">★</span>
                            <nav className="space-y-0.5">
                              {renderSidebarList(pinned)}
                            </nav>
                          </div>
                        )}
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 px-2 block">Navegação Geral</span>
                          <nav className="space-y-0.5">
                            {renderSidebarList(unpinned)}
                          </nav>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 p-3.5 text-center bg-slate-50 dark:bg-slate-900/45 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-500 block mb-1.5">📖 Versículo do Dia:</span>
                  <p className="text-[11px] leading-relaxed font-semibold text-slate-800 dark:text-slate-200">
                    "{getDailyVerse().text}"
                  </p>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block mt-1">
                    — {getDailyVerse().ref}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('system');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                      activeTab === 'system'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950/20 active:scale-95'
                    }`}
                  >
                    <Settings size={16} className={`${activeTab === 'system' ? 'text-white' : 'text-slate-500'} shrink-0`} />
                    <span>Sistema</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Dynamic Context Workspace Render container */}
        <main className={`flex-1 overflow-x-hidden ${
          activeTab === 'sete' 
            ? 'p-2 md:p-4 lg:p-6 h-[calc(100vh-65px)] overflow-y-hidden flex flex-col' 
            : 'p-4 md:p-6 lg:p-8 min-h-[calc(100vh-65px)]'
        }`}>
          
          {/* Active section dispatcher router */}
          <div className={activeTab === 'sete' ? 'flex-1 flex flex-col min-h-0' : 'relative space-y-6 text-left'}>
            
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <OverviewDashboard 
                data={data} 
                setActiveTab={setActiveTab} 
                setActiveOrgSubTab={setActiveOrgSubTab}
                setActiveFinSubTab={setActiveFinSubTab}
                setActiveStudiesSubTab={setActiveStudiesSubTab}
                setActiveEntSubTab={setActiveEntSubTab}
                userName={userName}
                setUserName={setUserName}
              />
            )}

            {/* 2. SETE IA */}
            {activeTab === 'sete' && (
              <SeteSection 
                data={data} 
                onApplyActions={handleApplySeteActions} 
                siteData={getCompleteSiteData()} 
                getLatestSiteData={handleGetLatestSiteData}
              />
            )}

            {/* 3. ORGANIZAÇÃO */}
            {activeTab === 'organization' && (
              <div className="w-full space-y-6">
                {activeOrgSubTab === 'home' ? (
                  <div className="space-y-8">
                    {/* Header bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 dark:border-slate-800">
                      <div className="space-y-1.5 text-left">
                        <button 
                          onClick={() => setActiveTab('dashboard')}
                          className="bg-slate-105 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 text-slate-800 dark:text-white border dark:border-slate-700/60 shadow-3xs mb-2"
                        >
                          <span className="text-cyan-500 font-extrabold">&larr;</span>
                          <span>Voltar ao Dashboard</span>
                        </button>
                        <h1 className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">📅 {getTabLabel('organization', 'Módulo Organização')}</h1>
                      </div>
                    </div>

                    {/* Smartphone Screen Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* 1. Tarefas */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveOrgSubTab('tasks')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-indigo-500/50 dark:hover:border-indigo-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="hidden sm:block absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-indigo-100/30 dark:border-indigo-500/10">
                            <CheckSquare size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-100/20 dark:border-indigo-500/5">
                            {data.tasks.filter(t => !t.completed).length} pendentes
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Minhas Tarefas</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Gerencie seus afazeres, prazos e prioridades diárias.</p>
                        </div>
                      </motion.button>

                      {/* 2. Cronograma */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveOrgSubTab('schedule')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="hidden sm:block absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-emerald-100/30 dark:border-emerald-500/10">
                            <Clock size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-100/20 dark:border-emerald-500/5">
                            {data.schedule.length} blocos
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Cronograma Diário</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Organize o seu dia a dia em blocos de compromissos.</p>
                        </div>
                      </motion.button>

                      {/* 3. Calendário */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveOrgSubTab('calendar')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-blue-500/50 dark:hover:border-blue-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="hidden sm:block absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-blue-100/30 dark:border-blue-500/10">
                            <Calendar size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-100/20 dark:border-blue-500/5">
                            {data.calendarMarkedDays?.length || 0} marcados
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Calendário Mensal</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Acompanhe datas comemorativas, compromissos e eventos do mês.</p>
                        </div>
                      </motion.button>

                      {/* 4. Lembretes */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveOrgSubTab('reminders')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-rose-500/50 dark:hover:border-rose-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="hidden sm:block absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-rose-50 dark:bg-rose-955/20 text-rose-550 dark:text-rose-455 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-rose-100/30 dark:border-rose-500/10">
                            <Bell size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-100/20 dark:border-rose-500/5">
                            {data.reminders.length} ativos
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Lembretes & Alertas</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Configure lembretes para não esquecer de compromissos importantes.</p>
                        </div>
                      </motion.button>

                      {/* 5. Notas */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveTab('notes')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-amber-500/50 dark:hover:border-amber-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="hidden sm:block absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-amber-100/30 dark:border-amber-500/10">
                            <FileText size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-955/40 px-2.5 py-1 rounded-full border border-amber-100/20 dark:border-amber-500/5">
                            {data.notes?.length || 0} notas
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Minhas Notas</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Anote insights, rascunhos rápidos ou devocionais.</p>
                        </div>
                      </motion.button>

                      {/* 6. Criatividade */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveTab('creativity')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-pink-500/50 dark:hover:border-pink-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="hidden sm:block absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-pink-50 dark:bg-pink-955/20 text-pink-600 dark:text-pink-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-pink-100/30 dark:border-pink-500/10">
                            <Sparkles size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-pink-600 dark:text-pink-400 bg-pink-50/80 dark:bg-pink-955/40 px-2.5 py-1 rounded-full border border-pink-100/20 dark:border-pink-500/5">
                            {data.creativityProjects?.length || 0} projetos
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Criatividade</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Acompanhe projetos pessoais, insights e ideias criativas.</p>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Back Navigator bar */}
                    <div className="flex items-center gap-3 bg-slate-100/55 dark:bg-slate-900/50 p-2.5 rounded-2xl border dark:border-slate-800">
                      <button 
                        onClick={() => setActiveOrgSubTab('home')}
                        className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 text-slate-800 dark:text-white border dark:border-slate-700/60 shadow-3xs hover:scale-[1.02]"
                      >
                        <span className="text-cyan-500 font-extrabold">&larr;</span>
                        <span>Voltar para Organização</span>
                      </button>
                      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
                      <span className="text-xs font-extrabold uppercase text-slate-450 tracking-wider">
                        Ativo: {activeOrgSubTab === 'tasks' ? '📝 Tarefas' : activeOrgSubTab === 'schedule' ? '⏰ Cronograma' : activeOrgSubTab === 'calendar' ? '📅 Calendário' : activeOrgSubTab === 'reminders' ? '🔔 Lembretes' : activeOrgSubTab === 'notes' ? '📝 Notas' : '🎨 Criatividade / Projetos'}
                      </span>
                    </div>

                    <div className="w-full">
                      {activeOrgSubTab === 'tasks' && <TasksSection tasks={data.tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} />}
                      {activeOrgSubTab === 'schedule' && <ScheduleSection schedule={data.schedule} onAdd={addScheduleBlock} onUpdate={updateScheduleBlock} onDelete={deleteScheduleBlock} />}
                      {activeOrgSubTab === 'calendar' && <CalendarSection markedDays={data.calendarMarkedDays || []} onMarkDay={markCalendarDay} onUnmarkDay={unmarkCalendarDay} />}
                      {activeOrgSubTab === 'reminders' && <RemindersSection reminders={[...data.reminders, ...getGiftReminders(data)]} onAdd={addReminder} onToggle={toggleReminder} onDelete={deleteReminder} onUpdate={updateReminder} />}
                      {activeOrgSubTab === 'notes' && <NotesSection notes={data.notes || []} onAddNote={addNote} onUpdateNote={updateNote} onDeleteNote={deleteNote} />}
                      {activeOrgSubTab === 'creativity' && <CreativitySection projects={data.creativityProjects || []} onAddProject={addCreativeProject} onUpdateProject={updateCreativeProject} onDeleteProject={deleteCreativeProject} />}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. VIDA FINANCEIRA */}
            {activeTab === 'finance' && (
              <div className="w-full space-y-6">
                {activeFinSubTab === 'home' ? (
                  <div className="space-y-8">
                    {/* Header bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 dark:border-slate-800">
                      <div className="space-y-1.5 text-left">
                        <button 
                          onClick={() => setActiveTab('dashboard')}
                          className="bg-slate-105 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 text-slate-800 dark:text-white border dark:border-slate-700/60 shadow-3xs mb-2"
                        >
                          <span className="text-amber-500 font-extrabold">&larr;</span>
                          <span>Voltar ao Dashboard</span>
                        </button>
                        <h1 className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">💵 {getTabLabel('finance', 'Módulo Financeiro')}</h1>
                      </div>
                    </div>

                    {/* Smartphone Screen Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* 1. Controle Financeiro */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveFinSubTab('finance')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-emerald-100/30 dark:border-emerald-500/10">
                            <DollarSign size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-100/20 dark:border-emerald-500/5">
                            Saldo: R$ {(data.finance.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) - data.finance.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)).toFixed(0)}
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Controle Financeiro</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Acompanhe receitas, despesas e seu fluxo de caixa consolidado.</p>
                        </div>
                      </motion.button>

                      {/* 2. Lista de Compras */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveFinSubTab('shoppingList')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-indigo-500/50 dark:hover:border-indigo-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-indigo-100/30 dark:border-indigo-500/10">
                            <ShoppingBag size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-100/20 dark:border-indigo-500/5">
                            {data.shoppingList.filter(s => !s.bought).length} pendentes
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Lista de Compras</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Gerencie itens do mercado e compras de casa pendentes.</p>
                        </div>
                      </motion.button>

                      {/* 3. Papelaria */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveFinSubTab('stationery')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-amber-500/50 dark:hover:border-amber-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-amber-100/30 dark:border-amber-500/10">
                            <FileText size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-955/40 px-2.5 py-1 rounded-full border border-amber-100/20 dark:border-amber-500/5">
                            R$ {data.finance.filter(t => t.category === 'stationery').reduce((acc, t) => acc + t.amount, 0).toFixed(0)} total
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Papelaria</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Controle de insumos, materiais de escritório e papelaria escolar.</p>
                        </div>
                      </motion.button>

                      {/* 5. Histórico de Vendas */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveFinSubTab('sales')}
                        className="relative p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-blue-500/50 dark:hover:border-blue-500/50 flex flex-col justify-between h-44 overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-blue-100/30 dark:border-blue-500/10">
                            <TrendingUp size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-100/20 dark:border-blue-500/5">
                            R$ {data.finance.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0).toFixed(0)} rec.
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Histórico de Vendas</h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">Acompanhe faturamentos e rendimentos das vendas realizadas.</p>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Back Navigator bar */}
                    <div className="flex items-center gap-3 bg-slate-100/55 dark:bg-slate-900/50 p-2.5 rounded-2xl border dark:border-slate-800">
                      <button 
                        onClick={() => setActiveFinSubTab('home')}
                        className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 text-slate-800 dark:text-white border dark:border-slate-700/60 shadow-3xs hover:scale-[1.02]"
                      >
                        <span className="text-emerald-500 font-extrabold">&larr;</span>
                        <span>Voltar para Vida Financeira</span>
                      </button>
                      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
                      <span className="text-xs font-extrabold uppercase text-slate-450 tracking-wider">
                        Ativo: {activeFinSubTab === 'finance' ? '💵 Controle Financeiro' : activeFinSubTab === 'shoppingList' ? '🛒 Lista de Compras' : activeFinSubTab === 'stationery' ? '🏪 Papelaria' : '📈 Histórico de Vendas'}
                      </span>
                    </div>

                    <div className="w-full">
                      {activeFinSubTab === 'finance' && <FinanceSection finance={data.finance} onAdd={addFinanceTransaction} onDelete={deleteFinanceTransaction} onUpdate={updateFinanceTransaction} />}
                      {activeFinSubTab === 'shoppingList' && (
                        <ShoppingListSection 
                          shoppingList={data.shoppingList}
                          onAdd={addShoppingItem}
                          onToggle={toggleShoppingItem}
                          onDelete={deleteShoppingItem}
                          onEdit={editShoppingItem}
                        />
                      )}
                      {activeFinSubTab === 'stationery' && (
                        <StationerySuite 
                          transactions={data.finance}
                          onAddTransaction={(type, description, amount, category) => {
                            addFinanceTransaction({
                              type,
                              description,
                              amount,
                              category,
                              date: new Date().toISOString().split('T')[0]
                            });
                          }}
                          onDeleteTransaction={deleteFinanceTransaction}
                          mode="papelaria"
                        />
                      )}
                      {activeFinSubTab === 'sales' && (
                        <StationerySuite 
                          transactions={data.finance}
                          onAddTransaction={(type, description, amount, category) => {
                            addFinanceTransaction({
                              type,
                              description,
                              amount,
                              category,
                              date: new Date().toISOString().split('T')[0]
                            });
                          }}
                          onDeleteTransaction={deleteFinanceTransaction}
                          mode="sales"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. ESTUDOS */}
            {activeTab === 'studies' && (
              <div className="w-full">
                <StudiesSection 
                  studies={data.studies}
                  schoolSubjects={data.schoolSubjects || []}
                  onAddSubject={addStudySubject}
                  onUpdateSubject={updateStudySubject}
                  onDeleteSubject={deleteStudySubject}
                  onAddHistory={addStudyHistory}
                  onDeleteHistory={deleteStudyHistory}
                  onAddSchoolSubject={addSchoolSubject}
                  onUpdateSchoolSubject={updateSchoolSubject}
                  onDeleteSchoolSubject={deleteSchoolSubject}
                />
              </div>
            )}

            {/* 6. BÍBLIA & IGREJA (MAXIMUM PRIORITY - COMPLETELY REBUILT) */}
            {activeTab === 'bible' && (
              <BibleSection 
                bibleState={data.bible}
                onSetCurrentBook={setBibleCurrentBook}
                onSetReadingPlan={setBiblePlan}
                onUpdateBookProgress={updateBibleBookProgress}
                onAddReflection={addBibleReflection}
                onDeleteReflection={deleteBibleReflection}
                onAddReadingLog={addBibleReadingLog}
                churchData={data.church}
                onUpdateChurch={(updated) => setData(prev => ({ ...prev, church: updated }))}
                onChooseTab={setActiveTab}
              />
            )}

            {/* NEW: CATÁLOGOS MODULE */}
            {activeTab === 'catalogs' && (
              <div className="w-full">
                <CatalogsSection
                  catalogsState={data.catalogs}
                  onUpdateCatalogs={(updater) => setData(prev => ({ ...prev, catalogs: typeof updater === 'function' ? updater(prev.catalogs || DEFAULT_CATALOGS_STATE) : updater }))}
                />
              </div>
            )}

            {/* GYM / TREINO TAB */}
            {activeTab === 'gym' && (
              <div className="w-full">
                <GymSection 
                  gymData={data.gym}
                  onUpdateGym={handleUpdateGymState}
                />
              </div>
            )}

            {/* 7. ENTERTAINMENT & GALERIAS */}
            {activeTab === 'entertainment' && (
              <div className="w-full space-y-6">
                {activeEntSubTab === 'home' ? (
                  <div className="space-y-8">
                    {/* Header bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 dark:border-slate-800">
                      <div className="space-y-1.5 text-left">
                        <button 
                          onClick={() => setActiveTab('dashboard')}
                          className="bg-slate-105 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-755 px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 text-slate-800 dark:text-white border dark:border-slate-700/60 shadow-3xs mb-2"
                        >
                          <span className="text-amber-500 font-extrabold">&larr;</span>
                          <span>Voltar ao Dashboard</span>
                        </button>
                        <h1 className="text-2xl font-black tracking-tight text-pink-600 dark:text-pink-400">🎬 {getTabLabel('entertainment', 'Central de Entretenimento')}</h1>
                      </div>
                    </div>

                    {/* Smartphone Screen Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* 1. Filmes */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveEntSubTab('movies')}
                        className="p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-rose-500/50 dark:hover:border-rose-500/50 flex flex-col justify-between h-36 relative overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-rose-100/30 dark:border-rose-500/10">
                            <Film size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-100/20 dark:border-rose-500/5">
                            {(data.media || []).filter(i => i.type === 'movie').length} filmes
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Filmes</h3>
                        </div>
                      </motion.button>

                      {/* 2. Séries */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveEntSubTab('series')}
                        className="p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-violet-500/50 dark:hover:border-violet-500/50 flex flex-col justify-between h-36 relative overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-violet-100/30 dark:border-violet-500/10">
                            <Tv size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-violet-950/40 px-2.5 py-1 rounded-full border border-violet-100/20 dark:border-violet-500/5">
                            {(data.media || []).filter(i => i.type === 'series').length} séries
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Séries</h3>
                        </div>
                      </motion.button>

                      {/* 3. Animes */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveEntSubTab('animes')}
                        className="p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-red-500/50 dark:hover:border-red-500/50 flex flex-col justify-between h-36 relative overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-red-50 dark:bg-red-955/20 text-red-650 dark:text-red-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-red-100/30 dark:border-red-500/10">
                            <Sparkles size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-red-600 dark:text-red-450 bg-red-50/80 dark:bg-red-955/40 px-2.5 py-1 rounded-full border border-red-100/20 dark:border-red-500/5">
                            {(data.media || []).filter(i => i.type === 'anime').length} animes
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Animes</h3>
                        </div>
                      </motion.button>

                      {/* 4. Músicas */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveEntSubTab('music')}
                        className="p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-teal-500/50 dark:hover:border-teal-500/50 flex flex-col justify-between h-36 relative overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-teal-100/30 dark:border-teal-500/10">
                            <Music size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-teal-650 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-100/20 dark:border-teal-500/5">
                            {(data.music?.tracks || []).length} faixas
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Músicas</h3>
                        </div>
                      </motion.button>

                      {/* 5. Galeria */}
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveEntSubTab('gallery')}
                        className="p-6 text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-all duration-300 shadow-xs hover:border-sky-500/50 dark:hover:border-sky-500/50 flex flex-col justify-between h-36 relative overflow-hidden group cursor-pointer w-full"
                      >
                        <div className="w-full flex items-start justify-between">
                          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-550 dark:text-sky-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-sky-100/30 dark:border-sky-500/10">
                            <ImageIcon size={22} />
                          </div>
                          <span className="text-[10px] font-bold tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-100/20 dark:border-sky-500/5">
                            Galeria
                          </span>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Galeria</h3>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Back Navigator bar */}
                    <div className="flex items-center gap-3 bg-slate-100/55 dark:bg-slate-900/50 p-2.5 rounded-2xl border dark:border-slate-800">
                      <button 
                        onClick={() => setActiveEntSubTab('home')}
                        className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 text-slate-800 dark:text-white border dark:border-slate-700/60 shadow-3xs hover:scale-[1.02]"
                      >
                        <span className="text-pink-500 font-extrabold">&larr;</span>
                        <span>Voltar para Entretenimento</span>
                      </button>
                      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
                      <span className="text-xs font-extrabold uppercase text-slate-450 tracking-wider">
                        Ativo: {activeEntSubTab === 'movies' ? '🎬 Filmes' : activeEntSubTab === 'series' ? '📺 Séries' : activeEntSubTab === 'animes' ? '👺 Animes' : activeEntSubTab === 'music' ? '🎵 Músicas' : activeEntSubTab === 'gallery' ? '🖼️ Galeria' : 'Entretenimento'}
                      </span>
                    </div>

                    <div className="w-full">
                      {activeEntSubTab === 'movies' && (
                        <MediaSection 
                          media={(data.media || []).filter(i => i.type === 'movie')}
                          onAdd={addMediaItem}
                          onUpdate={updateMediaItem}
                          onDelete={deleteMediaItem}
                        />
                      )}
                      {activeEntSubTab === 'series' && (
                        <MediaSection 
                          media={(data.media || []).filter(i => i.type === 'series')}
                          onAdd={addMediaItem}
                          onUpdate={updateMediaItem}
                          onDelete={deleteMediaItem}
                        />
                      )}
                      {activeEntSubTab === 'animes' && (
                        <MediaSection 
                          media={(data.media || []).filter(i => i.type === 'anime')}
                          onAdd={addMediaItem}
                          onUpdate={updateMediaItem}
                          onDelete={deleteMediaItem}
                        />
                      )}
                      {activeEntSubTab === 'music' && (
                        <MusicSection 
                          music={data.music}
                          onAddTrack={addMusicTrack}
                          onDeleteTrack={deleteMusicTrack}
                          onAddArtist={addMusicArtist}
                          onDeleteArtist={deleteMusicArtist}
                          onUpdateMetadata={updateMusicMetadata}
                          onUpdateTrack={updateMusicTrack}
                          onUpdateArtist={updateMusicArtist}
                        />
                      )}
                      {activeEntSubTab === 'gallery' && <GallerySection />}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 8. SISTEMA & CONFIGURAÇÃO */}
            {activeTab === 'system' && (
              <div className="w-full space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 text-slate-800 dark:text-white"
                    >
                      <span className="text-amber-500 font-extrabold text-sm">←</span>
                      <span>Voltar ao Dashboard</span>
                    </button>
                    <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
                    <div>
                      <h2 className="text-[10px] font-black uppercase text-slate-400">Módulo Ativo</h2>
                      <p className="text-sm font-black text-slate-700 dark:text-stone-300">⚙️ Sistema & Configurações</p>
                    </div>
                  </div>
                </div>

                <SystemSettingsSection 
                  data={data}
                  onImport={importFullBackup}
                  onResetToDefaults={resetToFactoryDefaults}
                  onClearAll={clearAllData}
                  userName={userName}
                  setUserName={setUserName}
                  profilePicUrl={profilePicUrl}
                  setProfilePicUrl={setProfilePicUrl}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  onLockApp={handleLockApp}
                  onSignOut={handleSignOut}
                  onRestartOnboarding={handleRestartOnboarding}
                  currentUserEmail={user?.email || ''}
                  onRestartTutorial={async () => {
                    setTutorialCompleted(false);
                    setTutorialStepIndex(0);
                    if (user) {
                      try {
                        const userDocRef = doc(db, 'users_data', user.uid);
                        console.log("[setDoc] Iniciando gravação de reinício do tutorial");
                        console.log("[setDoc] Documento:", userDocRef.path);
                        console.log("[setDoc] Dados enviados:", { tutorialCompleted: false });
                        await setDoc(userDocRef, {
                          tutorialCompleted: false
                        }, { merge: true });
                        console.log("[setDoc] Reinício do tutorial persistido com sucesso.");
                      } catch (err) {
                        console.error("Erro ao reiniciar tutorial no Firestore:", err);
                      }
                    }
                  }}
                />
              </div>
            )}

          </div>
        </main>

      </div>

      <CustomizationDrawer
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setTabsVersion(prev => prev + 1);
        }}
        data={data}
        onImport={(newData) => {
          setData(newData);
          localStorage.setItem('meu_painel_de_vida_db', JSON.stringify(newData));
        }}
        onResetToDefaults={resetToFactoryDefaults}
        onClearAll={clearAllData}
        userName={userName}
        setUserName={setUserName}
        profilePicUrl={profilePicUrl}
        setProfilePicUrl={setProfilePicUrl}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Minimalistic Page Footer */}
      <footer className="shrink-0 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 text-center py-4 text-slate-400 text-xs">
        © 2026 Meu Painel de Vida • Todos os direitos reservados. Projeto local 100% persistivo offline.
      </footer>
      </div>
      {renderTutorialOverlay()}
    </div>
  );
}
