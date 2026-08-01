import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  Plus, 
  Search, 
  ArrowLeft, 
  CheckSquare, 
  Clock, 
  Sparkles, 
  FileText, 
  Tag, 
  Link as LinkIcon, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Calendar, 
  User, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  Download, 
  X, 
  Target, 
  Paperclip, 
  Video, 
  Film, 
  Tv, 
  Award, 
  BarChart2, 
  Layers, 
  Hash, 
  ListTodo, 
  Info,
  Check
} from 'lucide-react';
import { 
  ProjectItem, 
  ProjectWorkspaceData, 
  ProjectIdea, 
  ProjectTask, 
  ProjectContentItem, 
  ProjectDoc, 
  ProjectGoal, 
  ProjectFile 
} from '../types';

interface ProjectsSectionProps {
  onBackToDashboard?: () => void;
}

// Initial default projects as requested by user
const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-yt-channels',
    name: 'Canais do YouTube',
    icon: '📺',
    category: 'Mídia & Conteúdo',
    description: 'Gestão dos meus canais do YouTube e produção de vídeos',
    hasSubprojects: true,
    createdAt: new Date().toISOString(),
    subprojects: [
      {
        id: 'yt-games',
        name: 'Canal de Games',
        icon: '🎮',
        category: 'YouTube',
        description: 'Gameplays, reviews, notícias de e-sports e detonados',
        hasSubprojects: false,
        createdAt: new Date().toISOString(),
        workspace: createEmptyWorkspace()
      },
      {
        id: 'yt-historia',
        name: 'Canal de História',
        icon: '📚',
        category: 'YouTube',
        description: 'Documentários, fatos históricos e biografias',
        hasSubprojects: false,
        createdAt: new Date().toISOString(),
        workspace: createEmptyWorkspace()
      },
      {
        id: 'yt-animais',
        name: 'Canal de Animais',
        icon: '🐾',
        category: 'YouTube',
        description: 'Curiosidades sobre o reino animal, vida selvagem e pets',
        hasSubprojects: false,
        createdAt: new Date().toISOString(),
        workspace: createEmptyWorkspace()
      },
      {
        id: 'yt-filmes',
        name: 'Canal de Filmes',
        icon: '🎬',
        category: 'YouTube',
        description: 'Análises de cinema, críticas de séries e easter eggs',
        hasSubprojects: false,
        createdAt: new Date().toISOString(),
        workspace: createEmptyWorkspace()
      },
      {
        id: 'yt-curiosidades',
        name: 'Canal de Curiosidades',
        icon: '📖',
        category: 'YouTube',
        description: 'Fatos impressionantes, mistérios e ciência do dia a dia',
        hasSubprojects: false,
        createdAt: new Date().toISOString(),
        workspace: createEmptyWorkspace()
      }
    ]
  },
  {
    id: 'proj-loja-online',
    name: 'Loja Online',
    icon: '👕',
    category: 'E-commerce',
    description: 'Gestão de catálogo, vendas e fornecedores da marca de roupas',
    hasSubprojects: false,
    createdAt: new Date().toISOString(),
    workspace: createEmptyWorkspace()
  },
  {
    id: 'proj-aulas-ingles',
    name: 'Aulas de Inglês',
    icon: '🎓',
    category: 'Educação',
    description: 'Material didático, alunos, cronograma e planos de aula',
    hasSubprojects: false,
    createdAt: new Date().toISOString(),
    workspace: createEmptyWorkspace()
  },
  {
    id: 'proj-produtos-digitais',
    name: 'Produtos Digitais',
    icon: '📦',
    category: 'Digital',
    description: 'E-books, cursos online e infoprodutos em lançamento',
    hasSubprojects: false,
    createdAt: new Date().toISOString(),
    workspace: createEmptyWorkspace()
  }
];

function createEmptyWorkspace(): ProjectWorkspaceData {
  return {
    status: 'em_andamento',
    ideas: [],
    tasks: [],
    content: [],
    organization: [],
    goals: [],
    files: []
  };
}

export default function ProjectsSection({ onBackToDashboard }: ProjectsSectionProps) {
  // Persistence state
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('meu_painel_de_vida_projetos_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Erro ao carregar projetos do LocalStorage', e);
      }
    }
    return INITIAL_PROJECTS;
  });

  // Save to LocalStorage whenever projects state changes
  useEffect(() => {
    localStorage.setItem('meu_painel_de_vida_projetos_v1', JSON.stringify(projects));
  }, [projects]);

  // Navigation levels state
  // selectedProjectId: null = Root view (Main Project Cards)
  // selectedSubprojectId: null = Container Project view (if project has subprojects) or direct workspace
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedSubprojectId, setSelectedSubprojectId] = useState<string | null>(null);

  // Active workspace sub-tab
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<
    'dashboard' | 'ideas' | 'planning' | 'content' | 'organization' | 'goals' | 'files'
  >('dashboard');

  // Modals state
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddSubprojectModalOpen, setIsAddSubprojectModalOpen] = useState(false);

  // Form states for adding new Project
  const [newProjName, setNewProjName] = useState('');
  const [newProjIcon, setNewProjIcon] = useState('📌');
  const [newProjCategory, setNewProjCategory] = useState('Geral');
  const [newProjDescription, setNewProjDescription] = useState('');
  const [newProjHasSubprojects, setNewProjHasSubprojects] = useState(false);

  // Form states for adding new Subproject/Channel
  const [newSubName, setNewSubName] = useState('');
  const [newSubIcon, setNewSubIcon] = useState('🎬');
  const [newSubCategory, setNewSubCategory] = useState('Canal');
  const [newSubDescription, setNewSubDescription] = useState('');

  // Selected current project and subproject objects
  const currentProject = projects.find(p => p.id === selectedProjectId) || null;
  const currentSubproject = currentProject?.subprojects?.find(s => s.id === selectedSubprojectId) || null;

  // Active workspace item (either the subproject or the main project)
  const activeWorkspaceItem = currentSubproject || (currentProject && !currentProject.hasSubprojects ? currentProject : null);
  const activeWorkspaceData: ProjectWorkspaceData = activeWorkspaceItem?.workspace || createEmptyWorkspace();

  // Helper to update active workspace data immutably
  const updateWorkspaceData = (updater: (prev: ProjectWorkspaceData) => ProjectWorkspaceData) => {
    if (!currentProject) return;

    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id !== currentProject.id) return p;

        if (currentProject.hasSubprojects && selectedSubprojectId) {
          // Update subproject
          const updatedSubprojects = (p.subprojects || []).map(sub => {
            if (sub.id !== selectedSubprojectId) return sub;
            const currentWs = sub.workspace || createEmptyWorkspace();
            return {
              ...sub,
              workspace: updater(currentWs)
            };
          });
          return { ...p, subprojects: updatedSubprojects };
        } else {
          // Update direct project
          const currentWs = p.workspace || createEmptyWorkspace();
          return {
            ...p,
            workspace: updater(currentWs)
          };
        }
      });
    });
  };

  // Handler for adding a new root project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newProjName.trim(),
      icon: newProjIcon || '🚀',
      category: newProjCategory.trim() || 'Geral',
      description: newProjDescription.trim(),
      hasSubprojects: newProjHasSubprojects,
      subprojects: newProjHasSubprojects ? [] : undefined,
      workspace: newProjHasSubprojects ? undefined : createEmptyWorkspace(),
      createdAt: new Date().toISOString()
    };

    setProjects(prev => [...prev, newProject]);
    setNewProjName('');
    setNewProjDescription('');
    setIsAddProjectModalOpen(false);
  };

  // Handler for adding a new subproject / channel
  const handleCreateSubproject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !currentProject) return;

    const newSub: ProjectItem = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      icon: newSubIcon || '📺',
      category: newSubCategory.trim() || currentProject.name,
      description: newSubDescription.trim(),
      hasSubprojects: false,
      createdAt: new Date().toISOString(),
      workspace: createEmptyWorkspace()
    };

    setProjects(prev => {
      return prev.map(p => {
        if (p.id !== currentProject.id) return p;
        const existingSubs = p.subprojects || [];
        return {
          ...p,
          subprojects: [...existingSubs, newSub]
        };
      });
    });

    setNewSubName('');
    setNewSubDescription('');
    setIsAddSubprojectModalOpen(false);
  };

  // Common Emojis Picker List
  const EMOJI_OPTIONS = ['📺', '👕', '🎓', '📦', '🎮', '📚', '🐾', '🎬', '📖', '🚀', '💻', '🎨', '🎵', '💡', '🏆', '📌', '💼', '⚡'];

  // =========================================================================
  // VIEW LEVEL 1: ROOT PROJECTS LIST (TELA INICIAL DE PROJETOS)
  // =========================================================================
  if (!selectedProjectId) {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Header Minimalista com Botão de Voltar ao Dashboard */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs">
          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Dashboard</span>
              </button>
            )}
            <div className="p-2.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl">
              <Folder size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Meus Projetos</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Central de organização e gestão profissional</p>
            </div>
          </div>
        </div>

        {/* CARDS DOS PROJETOS (REQ: MOSTRAR APENAS OS CARDS DOS PROJETOS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {projects.map(project => {
            const itemCount = project.hasSubprojects
              ? (project.subprojects?.length || 0)
              : ((project.workspace?.tasks?.length || 0) + (project.workspace?.ideas?.length || 0));

            return (
              <div
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setSelectedSubprojectId(null);
                  setActiveWorkspaceTab('dashboard');
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 rounded-3xl p-6 transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between h-44 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl group-hover:scale-110 transition-transform">
                      {project.icon}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl">
                      {project.category || 'Geral'}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-bold text-slate-400">
                  <span>{project.hasSubprojects ? `${itemCount} canais / subprojetos` : `${itemCount} itens`}</span>
                  <span className="group-hover:translate-x-1 transition-transform text-sky-600 dark:text-sky-400">
                    Acessar →
                  </span>
                </div>
              </div>
            );
          })}

          {/* CARD NOVO PROJETO */}
          <div
            onClick={() => setIsAddProjectModalOpen(true)}
            className="bg-slate-50/60 dark:bg-slate-900/40 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-sky-500 rounded-3xl p-6 transition-all cursor-pointer group flex flex-col items-center justify-center text-center h-44 gap-2"
          >
            <div className="p-3 bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Novo Projeto
            </span>
            <span className="text-[11px] text-slate-400">Adicionar novo projeto personalizado</span>
          </div>
        </div>

        {/* MODAL ADICIONAR PROJETO */}
        {isAddProjectModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scaleIn">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-slate-900 dark:text-white text-base">➕ Criar Novo Projeto</h3>
                <button
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ícone / Emoji</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {EMOJI_OPTIONS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewProjIcon(emoji)}
                        className={`p-2 rounded-xl text-lg cursor-pointer transition-all ${
                          newProjIcon === emoji
                            ? 'bg-sky-100 dark:bg-sky-950 border-2 border-sky-500'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome do Projeto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Empresa X, Loja Virtual, Podcast..."
                    value={newProjName}
                    onChange={e => setNewProjName(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white focus:border-sky-500 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                    <input
                      type="text"
                      placeholder="Ex: Negócios, Mídia..."
                      value={newProjCategory}
                      onChange={e => setNewProjCategory(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white focus:border-sky-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Organização</label>
                    <select
                      value={newProjHasSubprojects ? 'container' : 'direct'}
                      onChange={e => setNewProjHasSubprojects(e.target.value === 'container')}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white focus:border-sky-500 font-semibold cursor-pointer"
                    >
                      <option value="direct">Projeto Direto</option>
                      <option value="container">Múltiplos Subprojetos (Ex: Canais)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    placeholder="Breve resumo dos objetivos deste projeto..."
                    value={newProjDescription}
                    onChange={e => setNewProjDescription(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white focus:border-sky-500 font-semibold resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProjectModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold cursor-pointer hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-600 text-white rounded-2xl font-extrabold cursor-pointer hover:bg-sky-700 shadow-xs"
                  >
                    Criar Projeto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW LEVEL 2: CONTAINER SUBPROJECTS GRID (EX: CANAIS DO YOUTUBE)
  // =========================================================================
  if (currentProject && currentProject.hasSubprojects && !selectedSubprojectId) {
    const subprojects = currentProject.subprojects || [];

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* HEADER COM NAVEGAÇÃO BREADCRUMB */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedProjectId(null)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Voltar aos Projetos</span>
            </button>
            <span className="text-2xl">{currentProject.icon}</span>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{currentProject.name}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentProject.description || 'Selecione ou crie um subprojeto para administrar'}</p>
            </div>
          </div>
        </div>

        {/* CARDS DOS SUBPROJETOS / CANAIS (REQ: MOSTRAR APENAS OS CARDS DOS CANAIS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {subprojects.map(sub => {
            const taskCount = sub.workspace?.tasks?.length || 0;
            const contentCount = sub.workspace?.content?.length || 0;

            return (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSubprojectId(sub.id);
                  setActiveWorkspaceTab('dashboard');
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 rounded-3xl p-6 transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between h-44 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl group-hover:scale-110 transition-transform">
                      {sub.icon}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                      {sub.category || 'Canal'}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                    {sub.name}
                  </h3>
                  {sub.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {sub.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-bold text-slate-400">
                  <span>{contentCount} conteúdos • {taskCount} tarefas</span>
                  <span className="group-hover:translate-x-1 transition-transform text-sky-600 dark:text-sky-400">
                    Abrir Painel →
                  </span>
                </div>
              </div>
            );
          })}

          {/* CARD NOVO SUBPROJETO / NOVO CANAL */}
          <div
            onClick={() => setIsAddSubprojectModalOpen(true)}
            className="bg-slate-50/60 dark:bg-slate-900/40 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-sky-500 rounded-3xl p-6 transition-all cursor-pointer group flex flex-col items-center justify-center text-center h-44 gap-2"
          >
            <div className="p-3 bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Novo Canal / Subprojeto
            </span>
            <span className="text-[11px] text-slate-400">Adicionar novo item a {currentProject.name}</span>
          </div>
        </div>

        {/* MODAL ADICIONAR SUBPROJETO */}
        {isAddSubprojectModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scaleIn">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-slate-900 dark:text-white text-base">➕ Criar em {currentProject.name}</h3>
                <button
                  onClick={() => setIsAddSubprojectModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubproject} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ícone / Emoji</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {['🎮', '📚', '🐾', '🎬', '📖', '💻', '🎨', '🎵', '⚡', '🏆', '📺'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewSubIcon(emoji)}
                        className={`p-2 rounded-xl text-lg cursor-pointer transition-all ${
                          newSubIcon === emoji
                            ? 'bg-sky-100 dark:bg-sky-950 border-2 border-sky-500'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Canal de Tecnologia, Canal de Viagens..."
                    value={newSubName}
                    onChange={e => setNewSubName(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white focus:border-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    placeholder="Objetivo principal deste canal/subprojeto..."
                    value={newSubDescription}
                    onChange={e => setNewSubDescription(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white focus:border-sky-500 font-semibold resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddSubprojectModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold cursor-pointer hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-600 text-white rounded-2xl font-extrabold cursor-pointer hover:bg-sky-700 shadow-xs"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW LEVEL 3: DEDICATED WORKSPACE PANEL FOR A PROJECT / CHANNEL
  // =========================================================================
  if (!activeWorkspaceItem) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* WORKSPACE TOP NAVBAR WITH BREADCRUMB & SUBTABS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentProject?.hasSubprojects) {
                  setSelectedSubprojectId(null);
                } else {
                  setSelectedProjectId(null);
                }
              }}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{currentProject?.hasSubprojects ? `Voltar a ${currentProject.name}` : 'Voltar aos Projetos'}</span>
            </button>

            <span className="text-2xl">{activeWorkspaceItem.icon}</span>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 dark:text-white">{activeWorkspaceItem.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  {activeWorkspaceItem.category || 'Projeto'}
                </span>
              </div>
              {activeWorkspaceItem.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{activeWorkspaceItem.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* NAV SUB-TAB BUTTONS (REQ: Dashboard, Ideias, Planejamento, Conteúdo, Organização, Metas, Arquivos) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
            { id: 'ideas', label: 'Ideias', icon: Sparkles },
            { id: 'planning', label: 'Planejamento', icon: ListTodo },
            { id: 'content', label: 'Conteúdo', icon: Video },
            { id: 'organization', label: 'Organização', icon: Folder },
            { id: 'goals', label: 'Metas', icon: Target },
            { id: 'files', label: 'Arquivos', icon: Paperclip }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeWorkspaceTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkspaceTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sky-600/20 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* SUB-ABA 1: DASHBOARD */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'dashboard' && (
        <ProjectDashboardTab
          data={activeWorkspaceData}
          onNavigate={(tab) => setActiveWorkspaceTab(tab)}
        />
      )}

      {/* =================================================================== */}
      {/* SUB-ABA 2: IDEIAS */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'ideas' && (
        <ProjectIdeasTab
          ideas={activeWorkspaceData.ideas}
          onUpdateIdeas={(newIdeas) => updateWorkspaceData(ws => ({ ...ws, ideas: newIdeas }))}
        />
      )}

      {/* =================================================================== */}
      {/* SUB-ABA 3: PLANEJAMENTO */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'planning' && (
        <ProjectPlanningTab
          tasks={activeWorkspaceData.tasks}
          onUpdateTasks={(newTasks) => updateWorkspaceData(ws => ({ ...ws, tasks: newTasks }))}
        />
      )}

      {/* =================================================================== */}
      {/* SUB-ABA 4: CONTEÚDO */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'content' && (
        <ProjectContentTab
          content={activeWorkspaceData.content}
          onUpdateContent={(newContent) => updateWorkspaceData(ws => ({ ...ws, content: newContent }))}
        />
      )}

      {/* =================================================================== */}
      {/* SUB-ABA 5: ORGANIZAÇÃO */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'organization' && (
        <ProjectOrganizationTab
          docs={activeWorkspaceData.organization}
          onUpdateDocs={(newDocs) => updateWorkspaceData(ws => ({ ...ws, organization: newDocs }))}
        />
      )}

      {/* =================================================================== */}
      {/* SUB-ABA 6: METAS */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'goals' && (
        <ProjectGoalsTab
          goals={activeWorkspaceData.goals}
          onUpdateGoals={(newGoals) => updateWorkspaceData(ws => ({ ...ws, goals: newGoals }))}
        />
      )}

      {/* =================================================================== */}
      {/* SUB-ABA 7: ARQUIVOS */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'files' && (
        <ProjectFilesTab
          files={activeWorkspaceData.files}
          onUpdateFiles={(newFiles) => updateWorkspaceData(ws => ({ ...ws, files: newFiles }))}
        />
      )}
    </div>
  );
}

// ===========================================================================
// SUB-TAB COMPONENTS IMPLEMENTATION
// ===========================================================================

// 1. DASHBOARD COMPONENT
function ProjectDashboardTab({
  data,
  onNavigate
}: {
  data: ProjectWorkspaceData;
  onNavigate: (tab: 'ideas' | 'planning' | 'content' | 'organization' | 'goals' | 'files') => void;
}) {
  const publishedCount = data.content.filter(c => c.status === 'publicado').length;
  const inProgressCount = data.content.filter(c => c.status === 'em_andamento').length;
  const completedGoalsCount = data.goals.filter(g => g.status === 'concluida' || g.currentValue >= g.targetValue).length;
  const pendingTasks = data.tasks.filter(t => !t.completed);

  // Overall progress calculation
  const totalItems = (data.tasks.length || 0) + (data.content.length || 0) + (data.goals.length || 0);
  const doneItems = (data.tasks.filter(t => t.completed).length || 0) + publishedCount + completedGoalsCount;
  const overallProgress = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CARDS METRICAS PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* PROGRESSO GERAL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">📊 Progresso Geral</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{overallProgress}%</span>
            <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-lg">
              {overallProgress === 100 ? 'Concluído' : 'Em Execução'}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-sky-600 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        {/* VÍDEOS / CONTEÚDOS PUBLICADOS */}
        <div
          onClick={() => onNavigate('content')}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-1 cursor-pointer hover:border-emerald-500 transition-all"
        >
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">🟢 Publicados</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{publishedCount}</span>
            <span className="text-xs text-slate-400">conteúdos</span>
          </div>
        </div>

        {/* EM ANDAMENTO */}
        <div
          onClick={() => onNavigate('content')}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-1 cursor-pointer hover:border-amber-500 transition-all"
        >
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">🟡 Em Andamento</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{inProgressCount}</span>
            <span className="text-xs text-slate-400">produzindo</span>
          </div>
        </div>

        {/* METAS CONCLUÍDAS */}
        <div
          onClick={() => onNavigate('goals')}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-1 cursor-pointer hover:border-sky-500 transition-all"
        >
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">🎯 Metas Batidas</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400">{completedGoalsCount} / {data.goals.length}</span>
            <span className="text-xs text-slate-400">alcançadas</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO INFERIOR: PRÓXIMAS TAREFAS & RESUMO GERAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* PRÓXIMAS TAREFAS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ListTodo size={16} className="text-sky-600 dark:text-sky-400" />
              Próximas Tarefas do Planejamento
            </h3>
            <button
              onClick={() => onNavigate('planning')}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              Ver todas →
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-3 text-center">Nenhuma tarefa pendente no momento.</p>
          ) : (
            <div className="space-y-2">
              {pendingTasks.slice(0, 4).map(task => (
                <div key={task.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{task.title}</span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RESUMO DE ARQUIVOS & IDEIAS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            Visão Geral de Recursos
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div
              onClick={() => onNavigate('ideas')}
              className="p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 rounded-2xl cursor-pointer hover:border-amber-400 transition-all space-y-1"
            >
              <span className="text-xl">💡</span>
              <div className="font-black text-slate-900 dark:text-white text-lg">{data.ideas.length}</div>
              <span className="text-slate-500 text-[11px] font-medium">Ideias salvas no cofre</span>
            </div>

            <div
              onClick={() => onNavigate('files')}
              className="p-4 bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/50 dark:border-sky-900/40 rounded-2xl cursor-pointer hover:border-sky-400 transition-all space-y-1"
            >
              <span className="text-xl">📎</span>
              <div className="font-black text-slate-900 dark:text-white text-lg">{data.files.length}</div>
              <span className="text-slate-500 text-[11px] font-medium">Arquivos anexados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. IDEAS COMPONENT
function ProjectIdeasTab({
  ideas,
  onUpdateIdeas
}: {
  ideas: ProjectIdea[];
  onUpdateIdeas: (newIdeas: ProjectIdea[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Geral');
  const [priority, setPriority] = useState<'baixa' | 'média' | 'alta'>('média');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const filtered = ideas.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) || 
    i.description.toLowerCase().includes(search.toLowerCase()) ||
    (i.category && i.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newIdea: ProjectIdea = {
      id: `idea-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'Geral',
      priority,
      notes: notes.trim(),
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [],
      createdAt: new Date().toISOString()
    };

    onUpdateIdeas([newIdea, ...ideas]);
    setTitle('');
    setDescription('');
    setNotes('');
    setTagsInput('');
    setIsOpenModal(false);
  };

  const handleDelete = (id: string) => {
    onUpdateIdeas(ideas.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* BARRA DE PESQUISA & NOVO BOTAO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar ideias por título, descrição ou tag..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium outline-none focus:border-sky-500 text-slate-900 dark:text-white"
          />
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-extrabold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Nova Ideia</span>
        </button>
      </div>

      {/* LISTA DE IDEIAS */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2">
          <span className="text-3xl block">💡</span>
          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Nenhuma ideia encontrada</p>
          <p className="text-xs text-slate-400">Guarde insights, referências e novos conceitos aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(idea => (
            <div key={idea.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs hover:border-sky-400 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                    {idea.category || 'Geral'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                    idea.priority === 'alta' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    idea.priority === 'média' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {idea.priority}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{idea.title}</h4>
                {idea.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{idea.description}</p>
                )}

                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {idea.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">
                  {new Date(idea.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <button
                  onClick={() => handleDelete(idea.id)}
                  className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg cursor-pointer"
                  title="Excluir Ideia"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL ADICIONAR IDEIA */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">💡 Nova Ideia</h3>
              <button onClick={() => setIsOpenModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddIdea} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Título da Ideia *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Vídeo de comparação, Nova estampa..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                  <input
                    type="text"
                    placeholder="Ex: Roteiro, Design..."
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-semibold cursor-pointer"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  placeholder="Detalhes e rascunho da ideia..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-medium resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="youtube, viral, gameplay"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-2xl font-extrabold cursor-pointer hover:bg-sky-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. PLANNING COMPONENT
function ProjectPlanningTab({
  tasks,
  onUpdateTasks
}: {
  tasks: ProjectTask[];
  onUpdateTasks: (newTasks: ProjectTask[]) => void;
}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'média' | 'alta'>('média');
  const [deadline, setDeadline] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      deadline,
      completed: false,
      createdAt: new Date().toISOString()
    };

    onUpdateTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
    setDeadline('');
    setIsOpenModal(false);
  };

  const toggleComplete = (id: string) => {
    onUpdateTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: string) => {
    onUpdateTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base">📋 Planejamento de Atividades</h3>
          <p className="text-xs text-slate-500">Organize prazos e tarefas deste projeto</p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Nova Tarefa</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Nenhuma tarefa cadastrada neste projeto.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map(task => (
              <div key={task.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="p-1 cursor-pointer text-slate-400 hover:text-sky-600 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 size={20} className="text-sky-600 dark:text-sky-400" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>
                  <div>
                    <span className={`font-extrabold text-xs block ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-[11px] text-slate-500 block">{task.description}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {task.deadline && (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {task.deadline}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                    task.priority === 'alta' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    task.priority === 'média' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {task.priority}
                  </span>
                  <button onClick={() => handleDelete(task.id)} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">📋 Nova Tarefa</h3>
              <button onClick={() => setIsOpenModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Título *</label>
                <input
                  type="text"
                  required
                  placeholder="O que precisa ser feito?"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-semibold cursor-pointer"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Prazo</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descrição / Instruções</label>
                <textarea
                  rows={2}
                  placeholder="Observações..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-2xl font-extrabold cursor-pointer hover:bg-sky-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. CONTENT COMPONENT (VÍDEOS, ROTEIROS, THUMBNAILS, STATUS 🟢 Publicado, 🟡 Em andamento, ⚪ Não iniciado)
function ProjectContentTab({
  content,
  onUpdateContent
}: {
  content: ProjectContentItem[];
  onUpdateContent: (newContent: ProjectContentItem[]) => void;
}) {
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activeScriptModal, setActiveScriptModal] = useState<ProjectContentItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [script, setScript] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'publicado' | 'em_andamento' | 'nao_iniciado'>('nao_iniciado');

  const handleAddContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: ProjectContentItem = {
      id: `content-${Date.now()}`,
      title: title.trim(),
      script: script.trim(),
      description: description.trim(),
      status,
      createdAt: new Date().toISOString()
    };

    onUpdateContent([newItem, ...content]);
    setTitle('');
    setScript('');
    setDescription('');
    setIsOpenModal(false);
  };

  const updateStatus = (id: string, newStatus: 'publicado' | 'em_andamento' | 'nao_iniciado') => {
    onUpdateContent(content.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleDelete = (id: string) => {
    onUpdateContent(content.filter(c => c.id !== id));
  };

  const filtered = filterStatus === 'todos' ? content : content.filter(c => c.status === filterStatus);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* FILTER BUTTONS & NEW CONTENT BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'publicado', label: '🟢 Publicados' },
            { id: 'em_andamento', label: '🟡 Em Andamento' },
            { id: 'nao_iniciado', label: '⚪ Não Iniciados' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-extrabold cursor-pointer transition-all ${
                filterStatus === st.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-extrabold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Novo Conteúdo / Vídeo</span>
        </button>
      </div>

      {/* CONTENT GRID */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2">
          <span className="text-3xl block">🎬</span>
          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Nenhum vídeo/conteúdo nesta categoria</p>
          <p className="text-xs text-slate-400">Cadastre roteiros, ideias de thumbnail e pautas de vídeo aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs hover:border-sky-400 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <select
                    value={item.status}
                    onChange={e => updateStatus(item.id, e.target.value as any)}
                    className="text-[11px] font-extrabold rounded-xl px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border-none outline-none cursor-pointer text-slate-900 dark:text-white"
                  >
                    <option value="nao_iniciado">⚪ Não iniciado</option>
                    <option value="em_andamento">🟡 Em andamento</option>
                    <option value="publicado">🟢 Publicado</option>
                  </select>

                  <span className="text-[10px] text-slate-400 font-bold">
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{item.title}</h4>
                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveScriptModal(item)}
                  className="px-3 py-1.5 bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-xl text-xs font-bold hover:bg-sky-100 cursor-pointer flex items-center gap-1.5"
                >
                  <FileText size={13} />
                  <span>{item.script ? 'Ver Roteiro' : '+ Escrever Roteiro'}</span>
                </button>

                <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL ADICIONAR CONTEÚDO */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">🎬 Novo Conteúdo / Vídeo</h3>
              <button onClick={() => setIsOpenModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddContent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Título do Vídeo / Conteúdo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Como configurar o VSCode do zero"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status Inicial</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-semibold cursor-pointer"
                >
                  <option value="nao_iniciado">⚪ Não iniciado</option>
                  <option value="em_andamento">🟡 Em andamento</option>
                  <option value="publicado">🟢 Publicado</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descrição do Vídeo</label>
                <textarea
                  rows={2}
                  placeholder="Descrição para publicar no YouTube / redes..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-medium resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Roteiro / Tópicos</label>
                <textarea
                  rows={4}
                  placeholder="Escreva aqui a introdução, tópicos e gancho do vídeo..."
                  value={script}
                  onChange={e => setScript(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-2xl font-extrabold cursor-pointer hover:bg-sky-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VER / EDITAR ROTEIRO */}
      {activeScriptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">📄 Roteiro: {activeScriptModal.title}</h3>
              <button onClick={() => setActiveScriptModal(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <textarea
              rows={10}
              value={activeScriptModal.script || ''}
              onChange={e => {
                const updatedScript = e.target.value;
                const updatedList = content.map(c => c.id === activeScriptModal.id ? { ...c, script: updatedScript } : c);
                onUpdateContent(updatedList);
                setActiveScriptModal({ ...activeScriptModal, script: updatedScript });
              }}
              placeholder="Digite todo o roteiro, falas, marcações de edição e notas..."
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-900 dark:text-white font-mono text-xs leading-relaxed resize-none"
            />

            <div className="flex justify-end">
              <button
                onClick={() => setActiveScriptModal(null)}
                className="px-5 py-2.5 bg-sky-600 text-white rounded-2xl font-bold text-xs cursor-pointer hover:bg-sky-700"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. ORGANIZATION COMPONENT
function ProjectOrganizationTab({
  docs,
  onUpdateDocs
}: {
  docs: ProjectDoc[];
  onUpdateDocs: (newDocs: ProjectDoc[]) => void;
}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'documento' | 'link' | 'senha_cofre' | 'referencia' | 'contato' | 'recurso'>('documento');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDoc: ProjectDoc = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      category,
      content: content.trim(),
      url: url.trim(),
      createdAt: new Date().toISOString()
    };

    onUpdateDocs([newDoc, ...docs]);
    setTitle('');
    setContent('');
    setUrl('');
    setIsOpenModal(false);
  };

  const handleDelete = (id: string) => {
    onUpdateDocs(docs.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base">📁 Organização & Cofre de Informações</h3>
          <p className="text-xs text-slate-500">Documentos, links úteis, senhas, referências e contatos</p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Novo Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400">
            Nenhum documento ou recurso guardado ainda.
          </div>
        ) : (
          docs.map(doc => (
            <div key={doc.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                  {doc.category.replace('_', ' ')}
                </span>
                <button onClick={() => handleDelete(doc.id)} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>

              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{doc.title}</h4>

              {doc.category === 'senha_cofre' ? (
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-mono">
                    {showSensitive[doc.id] ? doc.content : '••••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowSensitive(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                    className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    {showSensitive[doc.id] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-300">{doc.content}</p>
              )}

              {doc.url && (
                <a
                  href={doc.url.startsWith('http') ? doc.url : `https://${doc.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-1"
                >
                  <ExternalLink size={13} />
                  <span>Acessar Link Externo</span>
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">📁 Novo Registro</h3>
              <button onClick={() => setIsOpenModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDoc} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Título / Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Acesso ao Painel, Guia da Marca..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Registro</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-semibold cursor-pointer"
                >
                  <option value="documento">📄 Documento</option>
                  <option value="link">🔗 Link Útil</option>
                  <option value="senha_cofre">🔐 Senha / Cofre</option>
                  <option value="referencia">📚 Referência</option>
                  <option value="contato">👤 Contato</option>
                  <option value="recurso">🛠️ Recurso Útil</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Conteúdo / Texto</label>
                <textarea
                  rows={3}
                  placeholder="Informações relevantes, texto ou credencial..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-medium resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Link / URL (opcional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-2xl font-extrabold cursor-pointer hover:bg-sky-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 6. GOALS COMPONENT
function ProjectGoalsTab({
  goals,
  onUpdateGoals
}: {
  goals: ProjectGoal[];
  onUpdateGoals: (newGoals: ProjectGoal[]) => void;
}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [targetValue, setTargetValue] = useState<number>(100);
  const [unit, setUnit] = useState('inscritos');
  const [deadline, setDeadline] = useState('');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGoal: ProjectGoal = {
      id: `goal-${Date.now()}`,
      name: name.trim(),
      targetValue: Number(targetValue) || 100,
      currentValue: 0,
      unit: unit.trim() || 'unidades',
      deadline,
      status: 'em_andamento',
      createdAt: new Date().toISOString()
    };

    onUpdateGoals([newGoal, ...goals]);
    setName('');
    setTargetValue(100);
    setDeadline('');
    setIsOpenModal(false);
  };

  const updateGoalValue = (id: string, delta: number) => {
    onUpdateGoals(goals.map(g => {
      if (g.id !== id) return g;
      const val = Math.max(0, g.currentValue + delta);
      const isDone = val >= g.targetValue;
      return {
        ...g,
        currentValue: val,
        status: isDone ? 'concluida' : 'em_andamento'
      };
    }));
  };

  const handleDelete = (id: string) => {
    onUpdateGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base">🎯 Metas do Projeto</h3>
          <p className="text-xs text-slate-500">Defina objetivos mensuráveis e acompanhe o progresso</p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Nova Meta</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400">
            Nenhuma meta cadastrada para este projeto.
          </div>
        ) : (
          goals.map(goal => {
            const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

            return (
              <div key={goal.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{goal.name}</h4>
                  <button onClick={() => handleDelete(goal.id)} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-baseline justify-between text-xs font-bold">
                  <span className="text-slate-500">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-black">{pct}%</span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateGoalValue(goal.id, -1)}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 font-black text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => updateGoalValue(goal.id, 1)}
                      className="px-2.5 py-1 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black text-xs rounded-xl hover:bg-sky-200 cursor-pointer"
                    >
                      +1
                    </button>
                  </div>

                  {goal.deadline && (
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Calendar size={11} /> {goal.deadline}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">🎯 Nova Meta</h3>
              <button onClick={() => setIsOpenModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome da Meta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chegar a 10.000 inscritos"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Meta Numérica</label>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={e => setTargetValue(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unidade</label>
                  <input
                    type="text"
                    placeholder="inscritos, vídeos, R$..."
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Data Limite (opcional)</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-2xl font-extrabold cursor-pointer hover:bg-sky-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 7. FILES COMPONENT
function ProjectFilesTab({
  files,
  onUpdateFiles
}: {
  files: ProjectFile[];
  onUpdateFiles: (newFiles: ProjectFile[]) => void;
}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      name: name.trim(),
      url: url.trim(),
      uploadedAt: new Date().toISOString()
    };

    onUpdateFiles([newFile, ...files]);
    setName('');
    setUrl('');
    setIsOpenModal(false);
  };

  const handleDelete = (id: string) => {
    onUpdateFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base">📎 Arquivos & Anexos</h3>
          <p className="text-xs text-slate-500">Repositório de links e documentos do projeto</p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Anexar Arquivo / Link</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400">
            Nenhum arquivo anexado a este projeto.
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-50 dark:bg-sky-950 text-sky-600 rounded-2xl">
                  <Paperclip size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{file.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block">
                    {new Date(file.uploadedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={file.url.startsWith('http') ? file.url : `https://${file.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-sky-600 hover:text-white cursor-pointer transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => handleDelete(file.id)} className="p-2 text-slate-400 hover:text-rose-500 cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">📎 Anexar Arquivo / Link</h3>
              <button onClick={() => setIsOpenModal(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddFile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome do Arquivo / Recurso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Google Drive com artes, PDF de requisitos..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Link / URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://drive.google.com/..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 outline-none text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-2xl font-extrabold cursor-pointer hover:bg-sky-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
