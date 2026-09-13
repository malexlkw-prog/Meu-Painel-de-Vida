export interface RedeProjectIdentity {
  name: string;
  year: number;
  theme: string;
  themeVerseRef: string;
  themeVerseText: string;
  periodStart: string; // "06/02/2027"
  periodEnd: string; // "04/12/2027"
  purpose: string;
  pillars: string[];
}

export interface MeetingStructureStep {
  id: string;
  order: number;
  title: string;
  description: string;
}

export interface CycleWeek {
  id: string;
  date: string; // e.g. "06/02/2027"
  theme: string;
  description?: string;
  readings?: string;
  completed?: boolean;
}

export interface RedeCycle {
  id: string;
  number: number;
  name: string;
  period: string;
  duration: string;
  objective: string;
  weeks: CycleWeek[];
  notes?: string;
}

export interface SpecialEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  plannedActivities: string[];
  schedule?: string[];
  tasks?: string[];
  materials?: string[];
  food?: string[];
  budget?: number;
  ideas?: string;
  responsible?: string;
  details?: Record<string, any>;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  responsibility: string;
  contact?: string;
  notes?: string;
}

export type ParticipantFunnelStage = 
  | 'convidado' 
  | 'primeiro_contato' 
  | 'participou' 
  | 'retornou' 
  | 'alcancado' 
  | 'integrado';

export interface RedeParticipant {
  id: string;
  name: string;
  age?: number;
  guardian?: string; // Responsável
  contact?: string;
  entryDate?: string;
  howDidTheyKnow?: string; // Como conheceu a Rede
  eventsAttended?: string[];
  status: ParticipantFunnelStage;
  invitedBy?: string;
  shirtSize?: string;
  paymentsStatus?: string;
  teamAssigned?: string;
  frequency?: string;
  notes?: string;
}

export type RedeFinanceCategory = 
  | 'Camisas'
  | 'Alimentação'
  | 'Passeios'
  | 'Transporte'
  | 'Materiais'
  | 'Decoração'
  | 'Brindes'
  | 'Gincanas'
  | 'Cinema'
  | 'Noite com Deus'
  | 'Confraternização'
  | 'Outros';

export interface RedeFinanceItem {
  id: string;
  item: string;
  category: RedeFinanceCategory;
  eventRelated?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  responsible?: string;
  status: 'planejado' | 'confirmado' | 'pago';
  notes?: string;
}

export interface ShirtPriceCategory {
  id: string;
  categoryName: string; // 'Adolescente' | 'Líder' | 'Convidado' | 'Igreja' | 'Subsídio' | 'Outro'
  quantity: number;
  pricePerPerson: number;
}

export interface RedeShirtPlanning {
  model: string;
  color: string;
  printDescription: string;
  supplier: string;
  estimatedQuantity: number;
  unitCost: number;
  shippingCost: number;
  additionalCosts: number;
  orderDeadline: string;
  priceCategories: ShirtPriceCategory[];
  notes?: string;
}

export interface RedeMealItem {
  id: string;
  event?: string;
  eventRelated?: string;
  item: string;
  quantity: number;
  unit: string; // 'unidades', 'kg', 'pacotes', 'litros'
  estimatedUnitPrice?: number;
  estimatedUnitCost?: number;
  totalCost: number;
  category: 'Lanches' | 'Bebidas' | 'Doces' | 'Salgados' | 'Pipoca' | 'Refeições' | 'Outros';
  responsible?: string;
  notes?: string;
}

export interface RedeTripPlanning {
  destination: string;
  date: string;
  destinationOptions: string[];
  estimatedPeople: number;
  ticketPerPerson: number;
  transportTotalCost: number;
  foodTotalCost: number;
  otherCosts: number;
  plannedFeePerPerson: number;
  notes?: string;
}

export interface RedeMaterialItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  eventRelated?: string;
  estimatedPrice: number;
  purchased: boolean;
  notes?: string;
}

export interface RedeTaskItem {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  responsible?: string;
  eventRelated?: string;
  status: 'A fazer' | 'Em andamento' | 'Concluído';
  checklist?: { id: string; text: string; done: boolean }[];
  notes?: string;
}

export type NoteCategory = 
  | 'Ideia' 
  | 'Decisão' 
  | 'Sugestão' 
  | 'Pesquisa' 
  | 'Conversa' 
  | 'Observação'
  | 'Ideias'
  | 'Decisões tomadas'
  | 'Sugestões'
  | 'Pesquisas'
  | 'Conversas com pais'
  | 'Observações';

export interface RedeNoteIdea {
  id: string;
  title: string;
  category: NoteCategory;
  content: string;
  createdAt?: string;
  date?: string;
  tags?: string[];
}

export interface RedeAdolescentesData {
  identity: RedeProjectIdentity;
  reachGoal: number; // 10
  meetingStructure: MeetingStructureStep[];
  cycles: RedeCycle[];
  specialEvents: SpecialEvent[];
  team: TeamMember[];
  participants: RedeParticipant[];
  finance: RedeFinanceItem[];
  shirts: RedeShirtPlanning;
  meals: RedeMealItem[];
  trip: RedeTripPlanning;
  materials: RedeMaterialItem[];
  tasks: RedeTaskItem[];
  notes: RedeNoteIdea[];
}

// Convenience Aliases
export type MealPlanItem = RedeMealItem;
export type MealCategory = 'Lanches' | 'Bebidas' | 'Doces' | 'Salgados' | 'Pipoca' | 'Refeições' | 'Outros';

export type ShirtPlan = RedeShirtPlanning;
export type TripPlan = RedeTripPlanning;
export type MaterialItem = RedeMaterialItem;

export type RedePlanningTask = RedeTaskItem;
export type TaskPriority = 'Baixa' | 'Média' | 'Alta';
export type TaskStatus = 'A fazer' | 'Em andamento' | 'Concluído';

export type RedeProjectNote = RedeNoteIdea;

