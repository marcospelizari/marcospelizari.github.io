import { Level, Topic, TopicGroup } from '../models/topic.model';

export const LEVEL_LABELS: Record<Level, string> = {
  essencial: 'Essencial',
  avancado: 'Avançado',
};

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    label: 'Backend',
    icon: 'coffee',
    topics: [
      {
        slug: 'fundamentos-java',
        label: 'Fundamentos Java',
        files: { essencial: 'essencial/fundamentos-java.json', avancado: 'avancado/fundamentos-java-avancado.json' },
      },
      {
        slug: 'orientacao-objetos',
        label: 'Orientação a Objetos',
        files: { essencial: 'essencial/orientacao-objetos.json', avancado: 'avancado/orientacao-objetos-avancado.json' },
      },
      {
        slug: 'spring-boot',
        label: 'Spring Boot',
        files: { essencial: 'essencial/spring-boot.json', avancado: 'avancado/spring-boot-avancado.json' },
      },
      {
        slug: 'api-webservices',
        label: 'API & Web Services',
        files: { essencial: 'essencial/api-webservices.json', avancado: 'avancado/api-webservices-avancado.json' },
      },
      {
        slug: 'banco-dados',
        label: 'Banco de Dados',
        files: { essencial: 'essencial/banco-dados.json', avancado: 'avancado/banco-dados-avancado.json' },
      },
    ],
  },
  {
    label: 'DevOps & Infra',
    icon: 'dns',
    topics: [
      {
        slug: 'docker-devops',
        label: 'Docker & DevOps',
        files: { essencial: 'essencial/docker-devops.json', avancado: 'avancado/docker-devops-avancado.json' },
      },
      {
        slug: 'ci-cd',
        label: 'CI/CD',
        files: { essencial: 'essencial/ci-cd.json', avancado: 'avancado/ci-cd-avancado.json' },
      },
      {
        slug: 'controle-versao',
        label: 'Controle de Versão (Git)',
        files: { essencial: 'essencial/controle-versao.json', avancado: 'avancado/controle-versao-avancado.json' },
      },
      {
        slug: 'observabilidade',
        label: 'Observabilidade',
        files: { avancado: 'avancado/observabilidade-avancado.json' },
      },
    ],
  },
  {
    label: 'Arquitetura',
    icon: 'account_tree',
    topics: [
      {
        slug: 'arquitetura-sistema',
        label: 'Arquitetura de Sistemas',
        files: { essencial: 'essencial/arquitetura-sistema.json', avancado: 'avancado/arquitetura-sistema-avancado.json' },
      },
      {
        slug: 'performance-otimizacao',
        label: 'Performance & Otimização',
        files: { avancado: 'avancado/performance-otimizacao.json' },
      },
    ],
  },
  {
    label: 'Qualidade',
    icon: 'verified',
    topics: [
      {
        slug: 'testes',
        label: 'Testes Automatizados',
        files: { essencial: 'essencial/testes.json', avancado: 'avancado/testes-avancado.json' },
      },
      {
        slug: 'boas-praticas',
        label: 'Boas Práticas & Clean Code',
        files: { essencial: 'essencial/boas-praticas.json' },
      },
    ],
  },
];

export const DEFAULT_TOPIC = 'fundamentos-java';

const ALL_TOPICS = TOPIC_GROUPS.flatMap((group) => group.topics.map((topic) => ({ group, topic })));

export function findTopic(slug: string): { group: TopicGroup; topic: Topic; next?: Topic } | undefined {
  const index = ALL_TOPICS.findIndex((entry) => entry.topic.slug === slug);
  if (index < 0) return undefined;
  return { ...ALL_TOPICS[index], next: ALL_TOPICS[index + 1]?.topic };
}

export function firstLevel(topic: Topic): Level {
  return topic.files.essencial ? 'essencial' : 'avancado';
}
