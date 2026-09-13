import React, { useState, useEffect } from 'react';
import { 
  Folder, Plus, Search, ChevronRight, ArrowLeft, Trash2, Edit3, 
  CheckSquare, Lightbulb, FileText, Target, Paperclip, Video, 
  Sparkles, ExternalLink, ShieldCheck, Tag, Calendar, User, 
  Check, Clock, AlertCircle, LayoutGrid, List, Layers, Star
} from 'lucide-react';
import { ProjectItem, ProjectIdea, ProjectTask, ProjectContentItem, ProjectDoc, ProjectGoal, ProjectFile } from '../types';

interface ProjectsSectionProps {
  onBackToDashboard?: () => void;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'yt-channel',
    name: 'Canal do YouTube',
    icon: 'Video',
    category: 'Criação de Conteúdo',
    description: 'Roteiros, edições e cronograma de postagens para o YouTube.',
    createdAt: new Date().toISOString(),
    workspace: {
      status: 'em_andamento',
      ideas: [
        {
          id: 'idea-1',
          title: 'Vídeo: Como organizar sua rotina do zero',
          description: 'Tutorial completo passando pelo cronograma diário e tarefas no painel.',
          priority: 'alta',
          tags: ['produtividade', 'youtube'],
          createdAt: new Date().toISOString()
        }
      ],
      tasks: [
        {
          id: 'task-1',
          title: 'Gravar take inicial de apresentação',
          priority: 'alta',
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'task-2',
          title: 'Criar capa / thumbnail em alta resolução',
          priority: 'média',
          completed: true,
          createdAt: new Date().toISOString()
        }
      ],
      content: [
        {
          id: 'content-1',
          title: 'Guia Definitivo de Organização Pessoal',
          status: 'em_andamento',
          type: 'video',
          hashtags: ['#produtividade', '#rotina', '#foco'],
          createdAt: new Date().toISOString()
        }
      ],
      organization: [
        {
          id: 'doc-1',
          title: 'Diretrizes da Identidade Visual',
          category: 'referencia',
          content: 'Cores principais: Indigo, Emerald e Dark Slate. Fontes sans-serif.',
          createdAt: new Date().toISOString()
        }
      ],
      goals: [
        {
          id: 'goal-1',
          name: 'Alcançar 1.000 inscritos',
          currentValue: 450,
          targetValue: 1000,
          unit: 'inscritos',
          status: 'em_andamento',
          createdAt: new Date().toISOString()
        }
      ],
      files: []
    }
  },
  {
    id: 'games-dev',
    name: 'Desenvolvimento de Games',
    icon: 'Sparkles',
    category: 'Tecnologia',
    description: 'Ideias de jogos, mecânicas, assets e progresso de dev.',
    createdAt: new Date().toISOString(),
    workspace: {
      status: 'planejamento',
      ideas: [],
      tasks: [],
      content: [],
      organization: [],
      goals: [],
      files: []
    }
  },
  {
    id: 'stories-writing',
    name: 'Livros & Histórias',
    icon: 'FileText',
    category: 'Escrita',
    description: 'Enredos, personagens, capítulos e ideias de publicação.',
    createdAt: new Date().toISOString(),
    workspace: {
      status: 'em_andamento',
      ideas: [],
      tasks: [],
      content: [],
      organization: [],
      goals: [],
      files: []
    }
  },
  {
    id: 'software-apps',
    name: 'Softwares & Aplicativos',
    icon: 'Folder',
    category: 'Desenvolvimento',
    description: 'Projetos de software, recursos, APIs e melhorias.',
    createdAt: new Date().toISOString(),
    workspace: {
      status: 'em_andamento',
      ideas: [],
      tasks: [],
      content: [],
      organization: [],
      goals: [],
      files: []
    }
  }
];

export default function ProjectsSection({ onBackToDashboard }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('painel_projects_data_v2');
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch (e) {
      return DEFAULT_PROJECTS;
    }
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'ideas' | 'tasks' | 'content' | 'organization' | 'goals' | 'files'>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals / Form States
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Items creation inside Workspace
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [newIdeaPriority, setNewIdeaPriority] = useState<'baixa' | 'média' | 'alta'>('média');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'baixa' | 'média' | 'alta'>('média');

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'documento' | 'link' | 'senha_cofre' | 'referencia' | 'contato' | 'recurso'>('documento');

  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState<number>(100);
  const [newGoalUnit, setNewGoalUnit] = useState('unidades');

  useEffect(() => {
    localStorage.setItem('painel_projects_data_v2', JSON.stringify(projects));
  }, [projects]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      category: newProjectCategory.trim() || 'Geral',
      description: newProjectDescription.trim(),
      icon: 'Folder',
      createdAt: new Date().toISOString(),
      workspace: {
        status: 'planejamento',
        ideas: [],
        tasks: [],
        content: [],
        organization: [],
        goals: [],
        files: []
      }
    };

    setProjects(prev => [newProject, ...prev]);
    setNewProjectName('');
    setNewProjectCategory('');
    setNewProjectDescription('');
    setShowAddProjectModal(false);
    setSelectedProjectId(newProject.id);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este projeto e todo o seu conteúdo?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (selectedProjectId === id) {
        setSelectedProjectId(null);
      }
    }
  };

  // Helper to update selected project's workspace
  const updateWorkspace = (updater: (ws: Required<NonNullable<ProjectItem['workspace']>>) => Required<NonNullable<ProjectItem['workspace']>>) => {
    if (!selectedProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedProjectId) return p;
      const currentWs = p.workspace || {
        status: 'em_andamento',
        ideas: [],
        tasks: [],
        content: [],
        organization: [],
        goals: [],
        files: []
      };
      return {
        ...p,
        workspace: updater(currentWs as any)
      };
    }));
  };

  // Ideas handlers
  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle.trim()) return;
    const idea: ProjectIdea = {
      id: `idea-${Date.now()}`,
      title: newIdeaTitle.trim(),
      description: newIdeaDesc.trim(),
      priority: newIdeaPriority,
      createdAt: new Date().toISOString()
    };
    updateWorkspace(ws => ({ ...ws, ideas: [idea, ...(ws.ideas || [])] }));
    setNewIdeaTitle('');
    setNewIdeaDesc('');
  };

  const handleDeleteIdea = (id: string) => {
    updateWorkspace(ws => ({ ...ws, ideas: (ws.ideas || []).filter(i => i.id !== id) }));
  };

  // Tasks handlers
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const task: ProjectTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    updateWorkspace(ws => ({ ...ws, tasks: [task, ...(ws.tasks || [])] }));
    setNewTaskTitle('');
  };

  const handleToggleTask = (id: string) => {
    updateWorkspace(ws => ({
      ...ws,
      tasks: (ws.tasks || []).map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const handleDeleteTask = (id: string) => {
    updateWorkspace(ws => ({ ...ws, tasks: (ws.tasks || []).filter(t => t.id !== id) }));
  };

  // Docs handlers
  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    const doc: ProjectDoc = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      content: newDocContent.trim(),
      category: newDocCategory,
      createdAt: new Date().toISOString()
    };
    updateWorkspace(ws => ({ ...ws, organization: [doc, ...(ws.organization || [])] }));
    setNewDocTitle('');
    setNewDocContent('');
  };

  const handleDeleteDoc = (id: string) => {
    updateWorkspace(ws => ({ ...ws, organization: (ws.organization || []).filter(d => d.id !== id) }));
  };

  // Goals handlers
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;
    const goal: ProjectGoal = {
      id: `goal-${Date.now()}`,
      name: newGoalName.trim(),
      currentValue: 0,
      targetValue: Number(newGoalTarget) || 100,
      unit: newGoalUnit.trim() || 'unidades',
      status: 'em_andamento',
      createdAt: new Date().toISOString()
    };
    updateWorkspace(ws => ({ ...ws, goals: [goal, ...(ws.goals || [])] }));
    setNewGoalName('');
    setNewGoalTarget(100);
  };

  const handleUpdateGoalValue = (id: string, delta: number) => {
    updateWorkspace(ws => ({
      ...ws,
      goals: (ws.goals || []).map(g => {
        if (g.id !== id) return g;
        const newVal = Math.max(0, g.currentValue + delta);
        return {
          ...g,
          currentValue: newVal,
          status: newVal >= g.targetValue ? 'concluida' : 'em_andamento'
        };
      })
    }));
  };

  const handleDeleteGoal = (id: string) => {
    updateWorkspace(ws => ({ ...ws, goals: (ws.goals || []).filter(g => g.id !== id) }));
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 transition-colors"
              title="Voltar ao Dashboard"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Folder className="text-sky-500" size={26} />
              Central de Projetos
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Gerencie seus canais, games, ideias, tarefas e metas em um só lugar
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddProjectModal(true)}
          className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
        >
          <Plus size={16} />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Main Workspace Area */}
      {selectedProject ? (
        /* PROJECT DETAIL WORKSPACE */
        <div className="space-y-6">
          {/* Project Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <button
                onClick={() => setSelectedProjectId(null)}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                &larr; Voltar para Lista de Projetos
              </button>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                {selectedProject.category || 'Geral'}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedProject.name}</h2>
              {selectedProject.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedProject.description}</p>
              )}
            </div>

            {/* Workspace Subtabs Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pt-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveWorkspaceTab('tasks')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
                  activeWorkspaceTab === 'tasks'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <CheckSquare size={15} />
                <span>Kanban & Tarefas ({(selectedProject.workspace?.tasks || []).length})</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('ideas')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
                  activeWorkspaceTab === 'ideas'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Lightbulb size={15} />
                <span>Ideias ({(selectedProject.workspace?.ideas || []).length})</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('organization')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
                  activeWorkspaceTab === 'organization'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileText size={15} />
                <span>Documentos ({(selectedProject.workspace?.organization || []).length})</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('goals')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 whitespace-nowrap ${
                  activeWorkspaceTab === 'goals'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Target size={15} />
                <span>Metas & Progresso ({(selectedProject.workspace?.goals || []).length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: TASKS */}
          {activeWorkspaceTab === 'tasks' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicionar nova tarefa..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 text-slate-800 dark:text-white"
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                >
                  <option value="baixa">Prioridade Baixa</option>
                  <option value="média">Prioridade Média</option>
                  <option value="alta">Prioridade Alta</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer"
                >
                  Adicionar
                </button>
              </form>

              <div className="space-y-2">
                {(selectedProject.workspace?.tasks || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center italic">Nenhuma tarefa criada para este projeto.</p>
                ) : (
                  (selectedProject.workspace?.tasks || []).map(task => (
                    <div
                      key={task.id}
                      className="p-3.5 bg-slate-50/80 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-700 hover:border-sky-500'
                          }`}
                        >
                          {task.completed && <Check size={12} />}
                        </button>
                        <span className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          task.priority === 'alta' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' :
                          task.priority === 'média' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' :
                          'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: IDEAS */}
          {activeWorkspaceTab === 'ideas' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <form onSubmit={handleAddIdea} className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-500" />
                  Registrar Nova Ideia
                </h4>
                <input
                  type="text"
                  placeholder="Título da ideia..."
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800 dark:text-white"
                />
                <textarea
                  placeholder="Detalhes ou descrição da ideia..."
                  value={newIdeaDesc}
                  onChange={(e) => setNewIdeaDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800 dark:text-white resize-none"
                />
                <div className="flex justify-between items-center">
                  <select
                    value={newIdeaPriority}
                    onChange={(e) => setNewIdeaPriority(e.target.value as any)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white"
                  >
                    <option value="baixa">Baixa prioridade</option>
                    <option value="média">Média prioridade</option>
                    <option value="alta">Alta prioridade</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Salvar Ideia
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(selectedProject.workspace?.ideas || []).length === 0 ? (
                  <p className="col-span-2 text-xs text-slate-400 py-6 text-center italic">Nenhuma ideia registrada ainda.</p>
                ) : (
                  (selectedProject.workspace?.ideas || []).map(idea => (
                    <div key={idea.id} className="p-4 bg-slate-50/80 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2 relative group">
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{idea.title}</h5>
                        <button
                          onClick={() => handleDeleteIdea(idea.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {idea.description && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{idea.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeWorkspaceTab === 'organization' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <form onSubmit={handleAddDoc} className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText size={14} className="text-sky-500" />
                  Novo Documento ou Nota
                </h4>
                <input
                  type="text"
                  placeholder="Título do documento..."
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800 dark:text-white"
                />
                <textarea
                  placeholder="Conteúdo, anotações, links ou detalhes..."
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  rows={3}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-sky-500 text-slate-800 dark:text-white resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Salvar Documento
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {(selectedProject.workspace?.organization || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center italic">Nenhum documento salvo.</p>
                ) : (
                  (selectedProject.workspace?.organization || []).map(doc => (
                    <div key={doc.id} className="p-4 bg-slate-50/80 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <h5 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <FileText size={14} className="text-sky-500" />
                          {doc.title}
                        </h5>
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{doc.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GOALS */}
          {activeWorkspaceTab === 'goals' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <form onSubmit={handleAddGoal} className="flex flex-wrap gap-2 items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Nome da meta (ex: Alcançar 10.000 inscritos)..."
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="flex-1 min-w-[200px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Meta Alvo"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                  className="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Unidade (ex: inscritos)"
                  value={newGoalUnit}
                  onChange={(e) => setNewGoalUnit(e.target.value)}
                  className="w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Criar Meta
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(selectedProject.workspace?.goals || []).length === 0 ? (
                  <p className="col-span-2 text-xs text-slate-400 py-6 text-center italic">Nenhuma meta configurada.</p>
                ) : (
                  (selectedProject.workspace?.goals || []).map(goal => {
                    const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) || 0;
                    return (
                      <div key={goal.id} className="p-4 bg-slate-50/80 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-xs font-black text-slate-900 dark:text-white">{goal.name}</h5>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              {goal.currentValue} / {goal.targetValue} {goal.unit}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-sky-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">{pct}% Concluído</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateGoalValue(goal.id, -1)}
                              className="w-6 h-6 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold hover:bg-slate-300 cursor-pointer"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleUpdateGoalValue(goal.id, 1)}
                              className="w-6 h-6 bg-sky-500 text-white rounded-md text-xs font-bold hover:bg-sky-600 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PROJECTS LIST GRID */
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 pl-10 text-xs focus:outline-none focus:border-sky-500 text-slate-800 dark:text-white shadow-sm"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-slate-200/80 dark:border-slate-800">
                <Folder className="mx-auto text-slate-300 dark:text-slate-700 mb-2" size={32} />
                <p className="text-xs text-slate-500 font-medium">Nenhum projeto encontrado.</p>
              </div>
            ) : (
              filteredProjects.map(project => {
                const tasksCount = (project.workspace?.tasks || []).length;
                const completedTasksCount = (project.workspace?.tasks || []).filter(t => t.completed).length;
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl hover:border-sky-500/50 dark:hover:border-sky-500/50 shadow-sm transition-all duration-200 flex flex-col justify-between h-44 cursor-pointer group relative"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-2.5 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/40">
                          {project.category || 'Projeto'}
                        </span>
                        <button
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          title="Excluir projeto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <h3 className="text-base font-black text-slate-900 dark:text-white mt-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {completedTasksCount}/{tasksCount} tarefas concluídas
                      </span>
                      <span className="text-xs font-bold text-sky-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Abrir <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Folder className="text-sky-500" size={20} />
              Novo Projeto
            </h3>

            <form onSubmit={handleAddProject} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Nome do Projeto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Canal do YouTube, Game RPG, Livro..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Criação, Tecnologia, Estudo..."
                  value={newProjectCategory}
                  onChange={(e) => setNewProjectCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Descrição (Opcional)</label>
                <textarea
                  placeholder="Breve resumo do projeto..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
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
