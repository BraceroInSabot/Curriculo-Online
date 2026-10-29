/**
 * ✏️ ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR PARA ATUALIZAR O CURRÍCULO.
 *
 * Datas no formato "AAAA-MM". Deixe `end` como `null` para um período atual.
 * Os dados brutos são convertidos em entidades de domínio pelo ResumeMapper.
 */

export interface RawPeriod {
  start: string;
  end: string | null;
}

export interface RawResume {
  profile: {
    fullName: string;
    shortName: string;
    headline: string;
    tagline: string;
    location: string;
    avatarUrl: string;
    about: string[];
    roles: string[];
    contacts: { kind: 'email' | 'linkedin' | 'github' | 'kaggle' | 'website'; label: string; url: string }[];
  };
  experiences: {
    id: string;
    role: string;
    organization: string;
    location: string;
    period: RawPeriod;
    summary: string;
    highlights: string[];
  }[];
  education: {
    id: string;
    course: string;
    institution: string;
    level: 'Graduação' | 'Pós-graduação' | 'Curso livre';
    period: RawPeriod;
  }[];
  skillGroups: { category: string; skills: string[] }[];
  projects: {
    id: string;
    name: string;
    category: string;
    description: string;
    stack: string[];
    repositoryUrl: string;
    liveUrl?: string;
    featured: boolean;
  }[];
}

const GITHUB_USER = 'BraceroInSabot';
const repo = (name: string) => `https://github.com/${GITHUB_USER}/${name}`;

export const resumeData: RawResume = {
  profile: {
    fullName: 'Guilherme Bracero Gonzales',
    shortName: 'Guilherme Bracero',
    headline: 'Professor de educação técnica & desenvolvedor Python / React',
    tagline: 'Código limpo dentro e fora da sala de aula.',
    location: 'Jales, SP',
    // Foto em public/foto-perfil.jpg (quadrada ou vertical, rosto centralizado).
    // Se o arquivo não existir, uma ilustração provisória é exibida.
    avatarUrl: './foto-perfil.jpg',
    about: [
      'Sou desenvolvedor de software em Jales/SP, formado em Análise e Desenvolvimento de Sistemas pela Fatec Jales e pós-graduando em Arquitetura de Software na FIAP. Construo aplicações com Python, Django e React, sempre buscando código limpo e bem arquitetado.',
      'Desde 2026 também atuo como professor de educação técnica na rede estadual de São Paulo. Antes da sala de aula, atendi revendedores no suporte N2 do InovaFarma, na Precisão Sistemas, e comecei na área de TI como estagiário na Prefeitura de Jales.',
    ],
    // Papéis que se alternam no topo da página, depois de "sou" (o primeiro aparece ao carregar).
    roles: [' desenvolvedor', 'professor'],
    contacts: [
      { kind: 'email', label: 'guibragon@gmail.com', url: 'mailto:guibragon@gmail.com' },
      { kind: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/guilherme-bracero/' },
      { kind: 'github', label: 'GitHub', url: `https://github.com/${GITHUB_USER}` },
      { kind: 'kaggle', label: 'Kaggle', url: 'https://www.kaggle.com/guilhermebracero' },
    ],
  },

  experiences: [
    {
      id: 'professor-paeet',
      role: 'Professor de Educação Técnica (PAEET)',
      organization: 'Rede Estadual de Ensino de São Paulo',
      location: 'Jales, SP',
      period: { start: '2026-02', end: null },
      summary: 'Docência em componentes de educação técnica na rede estadual paulista.',
      highlights: [],
    },
    {
      id: 'precisao-sistemas',
      role: 'Analista de Suporte ao Revendedor (N2)',
      organization: 'Precisão Sistemas',
      location: 'Jales, SP',
      period: { start: '2024-06', end: '2025-10' },
      summary: 'Suporte de segundo nível aos revendedores do InovaFarma, sistema de gestão para farmácias.',
      highlights: [],
    },
    {
      id: 'prefeitura-jales',
      role: 'Estagiário de TI',
      organization: 'Prefeitura Municipal de Jales',
      location: 'Jales, SP',
      period: { start: '2023-12', end: '2024-06' },
      summary: 'Estágio na área de Tecnologia da Informação da prefeitura.',
      highlights: [],
    },
  ],

  education: [
    {
      id: 'fiap-arquitetura',
      course: 'Arquitetura de Software',
      institution: 'FIAP',
      level: 'Pós-graduação',
      period: { start: '2026-04', end: '2027-04' },
    },
    {
      id: 'fatec-ads',
      course: 'Análise e Desenvolvimento de Sistemas',
      institution: 'Fatec Jales',
      level: 'Graduação',
      period: { start: '2023-02', end: '2025-12' },
    },
  ],

  skillGroups: [
    { category: 'Back-end', skills: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'MySQL'] },
    { category: 'Front-end', skills: ['React', 'TypeScript', 'JavaScript', 'React Native', 'Tailwind CSS', 'HTML & CSS'] },
    { category: 'Arquitetura', skills: ['Clean Architecture', 'SOLID', 'DDD', 'APIs REST'] },
    { category: 'Dados & DevOps', skills: ['Jupyter', 'NumPy', 'ETL', 'Docker', 'Git'] },
  ],

  projects: [
    {
      id: 'arquivia',
      name: 'ArquiVia',
      category: 'Full-stack',
      description:
        'Aplicação web de gestão de documentos com recuperação inteligente de informação.',
      stack: ['React', 'Tailwind', 'Django', 'PostgreSQL', 'Docker'],
      repositoryUrl: repo('ArquiVia'),
      liveUrl: 'https://www.arquivia.bracero.com.br/',
      featured: true,
    },
    {
      id: 'arquivia-mobile',
      name: 'ArquiVia Mobile',
      category: 'Mobile',
      description: 'Versão mobile do ArquiVia, desenvolvida para a disciplina de Programação Linear.',
      stack: ['React Native', 'TypeScript', 'Firebase'],
      repositoryUrl: repo('ArquiVia-Mobile'),
      featured: true,
    },
    {
      id: 'engenharia-de-dados',
      name: 'Engenharia de Dados',
      category: 'Dados',
      description:
        'Coleção de projetos de engenharia de dados — alguns aplicados no mercado de trabalho.',
      stack: ['Python', 'Jupyter', 'ETL'],
      repositoryUrl: repo('Engenharia-de-Dados'),
      featured: true,
    },
    {
      id: 'matlinear',
      name: 'MatLinear',
      category: 'Web',
      description: 'Sistema de maximização e minimização no estilo Solver.',
      stack: ['Python', 'Django', 'NumPy'],
      repositoryUrl: repo('MatLinear'),
      featured: false,
    },
    {
      id: 'departments-employees',
      name: 'Departamentos & Funcionários',
      category: 'Full-stack',
      description: 'CRUD de departamentos e funcionários com API REST.',
      stack: ['React', 'Django REST Framework'],
      repositoryUrl: repo('Departments-and-Employees-CRUD'),
      featured: false,
    },
  ],
};
