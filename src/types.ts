export interface ShoppingItem {
  id: string;
  name: string;
  estimatedPrice: number;
  category: string;
  subCategory?: string;
  bought: boolean;
  imageUrl?: string;
  size?: string; // e.g., "G", "M", "GG", "38"
  quantity?: number;
  priority?: 'high' | 'medium' | 'low';
  status?: 'buy' | 'bought' | 'postponed';
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  type: 'today' | 'pending';
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  time: string; // e.g. "07:00"
  activity: string;
  completed: boolean;
}

export interface StudyHistory {
  id: string;
  date: string;
  duration: string; // e.g. "1h 30m"
  note: string;
}

export interface StudySubject {
  id: string;
  name: string;
  grade: string; // e.g. "8.5" or "A"
  contentsStudied: string;
  progress: number; // 0 to 100
  history: StudyHistory[];
  topicsCurrent?: string[];          // O que estou estudando agora (Topic I am studying)
  topicsAlreadyStudied?: string[];   // Tópicos já estudados (Topics I have already studied)
  topicsStudyLater?: string[];       // Tópicos para estudar depois (Topics I will study later)
}

export interface SchoolSubject {
  id: string;
  name: string;
  grade: string; // e.g. "9.0"
  scheduleTime: string; // e.g. "08:00 - 10:00"
  scheduleDay: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'anime';
  status: 'watching' | 'completed' | 'backlog';
  progress: string; // e.g. "T2 Cap 3" or "3/12 eps"
  rating: number; // 1-5
  notes: string;
  imageUrl?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  notes?: string;
  imageUrl?: string;
}

export interface MusicArtist {
  id: string;
  name: string;
  genre: string;
  notes?: string;
  imageUrl?: string;
}

export interface MusicState {
  tracks: MusicTrack[];
  artists: MusicArtist[];
  currentVibe: string;
  vibePhase: string;
}

export interface BibleReflection {
  id: string;
  date: string;
  passage: string; // e.g., "Gênesis 12:1-3"
  reflection: string;
}

export interface BibleHistoryLog {
  id: string;
  date: string;
  book: string;
  chaptersRead: string; // e.g. "Cap. 1 a 3"
}

export interface BookReadingProgress {
  name: string;
  totalChapters: number;
  chaptersRead: number;
}

export interface BibleState {
  currentBook: string;
  plan: 'sequential' | 'chronological';
  bookProgress: { [key: string]: number }; // bookName -> chaptersRead
  reflections: BibleReflection[];
  history: BibleHistoryLog[];
}

export interface Reminder {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
  date?: string; // custom date
  time?: string; // custom time
  color?: string; // custom color
  category?: string; // custom category
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
}

export interface FinanceTransaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: 'personal' | 'work' | 'stationery';
  date: string; // YYYY-MM-DD
}

export interface CalendarMarkedDay {
  date: string; // YYYY-MM-DD
  color: string; // E.g., hex code or colour name
  text?: string;
  category?: string; // e.g. Trabalho, Escola, Igreja, Academia, Pessoal
  time?: string; // e.g. "14:00"
  notes?: string; // Observação
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'; // Repetição
  important?: boolean; // Importante
}

export interface NoteEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color?: string;
  pinned?: boolean;
  favorite?: boolean;
  folder?: string;
  tags?: string[];
  lastEditedAt?: string;
  attachments?: { name: string; url: string; size?: string }[];
  history?: { timestamp: string; content: string; title: string }[];
}

export interface CreativityProject {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'paused';
  createdAt: string;
  notes?: string;
  category?: string;
  links?: string[];
  favorite?: boolean;
  tags?: string[];
}

export interface ExerciseHistoryLog {
  id: string;
  date: string;
  weight: number;
  sets: number;
  reps: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string; // e.g. Peito, Costas, Pernas, Ombros, Braços, Cardiorespiratório
  sets: number;
  reps: string;
  weight: number; // in kg
  restTime: string; // e.g. "1m", "45s"
  notes?: string;
  history?: ExerciseHistoryLog[];
}

export interface WorkoutDay {
  id: string; // 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'
  dayName: string; // e.g., "Segunda-feira"
  workoutName: string; // e.g., "Treino A - Peito, Ombro e Tríceps" ou "Descanso"
  exercises: Exercise[];
}

export interface WorkoutGoal {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weight: number; // in kg
  height: number; // in meters (e.g. 1.75)
  imc: number; // weight / (height * height)
  peito?: number;
  braçoEsquerdo?: number;
  braçoDireito?: number;
  cintura?: number;
  abdômen?: number;
  quadril?: number;
  coxaEsquerda?: number;
  coxaDireita?: number;
  panturrilhaEsquerda?: number;
  panturrilhaDireita?: number;
}

export interface EvolutionPhoto {
  id: string;
  date: string;
  imageUrl: string;
  notes?: string;
}

export interface GymCalendarDay {
  date: string; // YYYY-MM-DD
  trained: boolean;
  workoutPlanned?: string;
}

export interface GymState {
  workouts: WorkoutDay[];
  goals: WorkoutGoal[];
  measurements: BodyMeasurement[];
  photos: EvolutionPhoto[];
  calendar: { [date: string]: GymCalendarDay };
  hoursTrainedTotal?: number; // Total hours trained
}

// Church (Igreja) Area interfaces
export interface ChurchEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  ministry: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
}

export interface ChurchCommitment {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface ChurchSpiritualGoal {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  createdAt: string;
  unit: string; // e.g., "dias", "cultos"
}

export interface ChurchStudy {
  id: string;
  title: string;
  category: string;
  date: string;
  verses: string;
  notes: string;
  reflections: string;
  lessons: string;
}

export interface ChurchSermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  theme: string;
  verses: string;
  summary: string;
  lessons: string;
  application: string;
}

export interface ChurchPrayerRequest {
  id: string;
  request: string;
  person: string;
  date: string;
  status: 'praying' | 'answered' | 'archived';
  notes?: string;
}

export interface ChurchMinistry {
  id: string;
  name: string; // Louvor, Mídia, Recepção, Infantil, Evangelismo, Sonoplastia, Outro
  role: string;
  scale: string;
  responsibilities: string;
  nextActivities: string;
}

export interface ChurchIdea {
  id: string;
  title: string;
  description: string;
  category: string; // Ex: Projeto, Evento, Reunião, Comunidade
  status: 'idea' | 'planning' | 'executed';
  votes: number;
  createdAt: string;
  notes?: string;
  date?: string;
  imageUrl?: string;
  tasks?: { id: string; text: string; completed: boolean }[];
}

export interface ChurchState {
  events: ChurchEvent[];
  commitments: ChurchCommitment[];
  goals: ChurchSpiritualGoal[];
  studies: ChurchStudy[];
  sermons: ChurchSermon[];
  prayers: ChurchPrayerRequest[];
  ministries: ChurchMinistry[];
  ideas?: ChurchIdea[];
  bibleReadingStreak?: number;
  cultsAttendedCount?: number;
}

// YouTube Media Area interfaces
export interface SavedVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  channelId?: string;
  publishedAt: string;
  category: 'watch_later' | 'favorites' | 'studies' | 'music' | 'motivation' | 'church' | 'gym' | 'programming' | 'others';
  savedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  watchedAt: string; // ISO date string
  durationWatched?: string;
}

export interface SubscriptionChannel {
  id: string;
  channelId: string;
  title: string;
  thumbnail: string;
  subscriberCount?: string;
}

export interface YouTubeState {
  saved: SavedVideo[];
  history: WatchHistoryItem[];
  subscriptions: SubscriptionChannel[];
  apiKey?: string;
}

export interface PainelData {
  shoppingList: ShoppingItem[];
  tasks: Task[];
  schedule: ScheduleItem[];
  studies: StudySubject[];
  schoolSubjects?: SchoolSubject[]; // Escola tab data
  media: MediaItem[];
  music: MusicState;
  bible: BibleState;
  reminders: Reminder[];
  finance: FinanceTransaction[];
  calendarMarkedDays?: CalendarMarkedDay[];
  notes?: NoteEntry[];
  creativityProjects?: CreativityProject[];
  gym?: GymState; // Gym/Workouts tab data
  church?: ChurchState; // Church tab data
  youtube?: YouTubeState; // YouTube tab data
  queroComprar?: QueroComprarState; // New Wishlist full app module
  catalogs: CatalogsState; // New Catalogs full app module
}

// Wishlist Full Module interfaces
export interface CustomCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface SpecialDate {
  id: string;
  label: string;
  date: string; // YYYY-MM-DD or MM-DD
  type: 'birthday' | 'christmas' | 'mothers_day' | 'fathers_day' | 'valentines' | 'wedding' | 'graduation' | 'other';
}

export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  store?: string;
  link?: string;
  dateAdded: string;
  priority: 'high' | 'medium' | 'low';
  desireLevel: number; // 1 to 5
  size?: string;
  color?: string;
  notes?: string;
  status: 'want' | 'buying' | 'bought' | 'cancelled';
  category: string; // Key of category (e.g. 'clothes', 'shoes', 'accessories', 'caps', 'bags', 'electronics', 'games', 'personal', 'professional', 'gifts', 'favorites', 'all', or custom category id)
  subCategory?: string; // Optional subcategory (e.g. 'Camisas', 'Camisas de Futebol', etc.)
  imageUrl?: string;
  isFavorite: boolean;
  giftPersonId?: string; // Links to GiftPerson if category is 'gifts'
  professionalType?: string; // e.g. 'Impressoras', 'Computadores', etc.
  personalType?: string; // e.g. 'Perfumes', 'Relógios', etc.
  
  // Gift Scheduling additions
  occasion?: string; // e.g. 'Aniversário', 'Natal', or Custom
  giftDate?: string; // YYYY-MM-DD
  giftStatus?: 'planned' | 'buying' | 'bought' | 'delivered'; // Status do presente
}

export interface GiftPerson {
  id: string;
  name: string;
  age?: number;
  birthday?: string;
  imageUrl?: string;
  relationship?: string;
  notes?: string;
  specialDates?: SpecialDate[];
}

export interface QueroComprarState {
  items: WishlistItem[];
  people: GiftPerson[];
  customCategories?: CustomCategory[];
  customCategoriesList?: CustomCategory[];
  customSubCategories?: { [categoryKey: string]: string[] };
}

// Gallery (Galeria) Area interfaces
export interface GalleryPhoto {
  id: string;
  title: string;
  description: string;
  album: string;       // Album ID or name
  date: string;        // ISO string YYYY-MM-DD
  location?: string;
  tags: string[];      // Array of tag names
  isFavorite: boolean;
  base64Data: string;  // The image content
  size: number;        // Bytes size
  fileName: string;
  createdAt: string;   // ISO string timestamp
  deletedAt: string | null;  // ISO string when thrown in trash list
}

export interface CatalogFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'link' | 'rating' | 'select';
  options?: string[];
  isRequired?: boolean;
}

export interface CustomCatalogItem {
  id: string;
  catalogId: string;
  name: string;
  categories: string[];
  isFavorite: boolean;
  fieldValues: { [fieldId: string]: any };
  imageUrl?: string; // base64 photo
  notes?: string;
  createdAt: string;
}

export interface CustomCatalog {
  id: string;
  name: string;
  icon: string;
  fields: CatalogFieldDefinition[];
  categories: string[];
  isDefault?: boolean;
}

export interface ChurchSong {
  id: string;
  name: string;
  artist: string; // Cantor ou Banda
  composer?: string; // Compositor
  key?: string; // Tom
  capo?: string; // Capotraste
  youtubeUrl?: string; // Link do YouTube
  notes?: string;
  categories: string[];
  isFavorite: boolean;
  createdAt: string;
}

export interface SongRepertoire {
  id: string;
  name: string;
  songIds: string[];
  createdAt: string;
}

export interface CatalogsState {
  songs: ChurchSong[];
  songCategories: string[];
  repertoires: SongRepertoire[];
  customCatalogs: CustomCatalog[];
  customItems: CustomCatalogItem[];
}

