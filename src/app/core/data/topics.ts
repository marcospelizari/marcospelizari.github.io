import { Level, Topic, TopicGroup } from '../models/topic.model';

export const LEVEL_LABELS: Record<Level, string> = {
  essencial: 'Essentials',
  intermediario: 'Intermediate',
  avancado: 'Advanced',
};

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    label: 'Backend',
    icon: 'coffee',
    topics: [
    // Learning order: language -> OOP -> data structures -> build -> data -> framework -> API design -> messaging
      {
        slug: 'fundamentos-java',
        label: 'Java Fundamentals',
        files: { essencial: 'essencial/fundamentos-java.json', intermediario: 'intermediario/fundamentos-java-intermediario.json', avancado: 'avancado/fundamentos-java-avancado.json' },
      },
      {
        slug: 'orientacao-objetos',
        label: 'Object-Oriented Programming',
        files: { essencial: 'essencial/orientacao-objetos.json', intermediario: 'intermediario/orientacao-objetos-intermediario.json', avancado: 'avancado/orientacao-objetos-avancado.json' },
      },
      {
        slug: 'data-structures',
        label: 'Data Structures & Algorithms',
        files: { essencial: 'essencial/data-structures.json', intermediario: 'intermediario/data-structures-intermediario.json' },
      },
      {
        slug: 'build-tools',
        label: 'Build Tools (Maven & Gradle)',
        files: { essencial: 'essencial/build-tools.json', intermediario: 'intermediario/build-tools-intermediario.json' },
      },
      {
        slug: 'banco-dados',
        label: 'Databases',
        files: { essencial: 'essencial/banco-dados.json', intermediario: 'intermediario/banco-dados-intermediario.json', avancado: 'avancado/banco-dados-avancado.json' },
      },
      {
        slug: 'spring-boot',
        label: 'Spring Boot',
        files: { essencial: 'essencial/spring-boot.json', intermediario: 'intermediario/spring-boot-intermediario.json', avancado: 'avancado/spring-boot-avancado.json' },
      },
      {
        slug: 'api-webservices',
        label: 'APIs & Web Services',
        files: { essencial: 'essencial/api-webservices.json', intermediario: 'intermediario/api-webservices-intermediario.json', avancado: 'avancado/api-webservices-avancado.json' },
      },
      {
        slug: 'messaging',
        label: 'Messaging (Kafka & RabbitMQ)',
        files: { intermediario: 'intermediario/messaging-intermediario.json', avancado: 'avancado/messaging-avancado.json' },
      },
    ],
  },
  {
    label: 'DevOps & Infra',
    icon: 'dns',
    // Learning order: Linux -> networking -> Git -> Docker -> Kubernetes -> CI/CD (uses all three) -> observability
    topics: [
      {
        slug: 'linux',
        label: 'Linux & the Terminal',
        files: { essencial: 'essencial/linux.json' },
      },
      {
        slug: 'networking',
        label: 'Networking',
        files: { essencial: 'essencial/networking.json', intermediario: 'intermediario/networking-intermediario.json' },
      },
      {
        slug: 'controle-versao',
        label: 'Version Control (Git)',
        files: { essencial: 'essencial/controle-versao.json', intermediario: 'intermediario/controle-versao-intermediario.json', avancado: 'avancado/controle-versao-avancado.json' },
      },
      {
        slug: 'docker-devops',
        label: 'Docker & DevOps',
        files: { essencial: 'essencial/docker-devops.json', intermediario: 'intermediario/docker-devops-intermediario.json', avancado: 'avancado/docker-devops-avancado.json' },
      },
      {
        slug: 'kubernetes',
        label: 'Kubernetes & kubectl',
        files: { essencial: 'essencial/kubernetes.json', intermediario: 'intermediario/kubernetes-intermediario.json', avancado: 'avancado/kubernetes-avancado.json' },
      },
      {
        slug: 'ci-cd',
        label: 'CI/CD',
        files: { essencial: 'essencial/ci-cd.json', intermediario: 'intermediario/ci-cd-intermediario.json', avancado: 'avancado/ci-cd-avancado.json' },
      },
      {
        slug: 'observabilidade',
        label: 'Observability',
        files: { intermediario: 'intermediario/observabilidade-intermediario.json', avancado: 'avancado/observabilidade-avancado.json' },
      },
    ],
  },
  {
    label: 'Architecture',
    icon: 'account_tree',
    topics: [
      {
        slug: 'arquitetura-sistema',
        label: 'System Architecture',
        files: { essencial: 'essencial/arquitetura-sistema.json', intermediario: 'intermediario/arquitetura-sistema-intermediario.json', avancado: 'avancado/arquitetura-sistema-avancado.json' },
      },
      {
        slug: 'performance-otimizacao',
        label: 'Performance & Optimization',
        files: { avancado: 'avancado/performance-otimizacao.json' },
      },
    ],
  },
  {
    label: 'Quality',
    icon: 'verified',
    topics: [
      {
        slug: 'testes',
        label: 'Automated Testing',
        files: { essencial: 'essencial/testes.json', intermediario: 'intermediario/testes-intermediario.json', avancado: 'avancado/testes-avancado.json' },
      },
      {
        slug: 'debugging',
        label: 'Debugging',
        files: { essencial: 'essencial/debugging.json' },
      },
      {
        slug: 'seguranca',
        label: 'Application Security',
        files: { essencial: 'essencial/seguranca.json', avancado: 'avancado/seguranca-avancado.json' },
      },
      {
        slug: 'boas-praticas',
        label: 'Best Practices & Clean Code',
        files: { essencial: 'essencial/boas-praticas.json' },
      },
    ],
  },
];

const ALL_TOPICS = TOPIC_GROUPS.flatMap((group) => group.topics.map((topic) => ({ group, topic })));

export function findTopic(slug: string): { group: TopicGroup; topic: Topic; next?: Topic } | undefined {
  const index = ALL_TOPICS.findIndex((entry) => entry.topic.slug === slug);
  if (index < 0) return undefined;
  return { ...ALL_TOPICS[index], next: ALL_TOPICS[index + 1]?.topic };
}

/** The topic's lowest level that has content (levels are ordered as in LEVEL_LABELS). */
export function firstLevel(topic: Topic): Level {
  return (Object.keys(LEVEL_LABELS) as Level[]).find((level) => topic.files[level])!;
}

/** Every topic/level pair that has a JSON file, in sidebar order. */
export const TOPIC_FILES = TOPIC_GROUPS.flatMap((group) =>
  group.topics.flatMap((topic) =>
    (Object.keys(LEVEL_LABELS) as Level[])
      .filter((level) => topic.files[level])
      .map((level) => ({ group, topic, level, file: topic.files[level]! })),
  ),
);
