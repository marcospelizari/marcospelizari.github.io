import { Subsection } from '../models/study-content.model';
import { detectLanguage, matchesQuery, parseRichText } from './content.utils';

describe('detectLanguage', () => {
  it.each([
    ['git init   # Inicia um novo repositório\ngit status', 'bash'],
    ['public class App {\n  void run() {}\n}', 'java'],
    ['@Service\nclass PedidoService {}', 'java'],
    ['SELECT nome FROM usuarios WHERE idade > 18;', 'sql'],
    ['FROM maven:3.9 AS build\nRUN mvn package', 'docker'],
    ['name: CI\non: [push]\njobs:\n  build:\n    steps:\n      - uses: actions/checkout@v4', 'yaml'],
    ['// pom.xml\n<plugin>\n  <groupId>org.jacoco</groupId>\n</plugin>', 'markup'],
    ['{"level":"INFO","msg":"pedido criado"}', 'json'],
    ['PUT /v2/pedidos/123', 'plaintext'],
    ['pwd                     # where am I?\nls -la', 'bash'],
    ['$ curl -v https://api.example.com/health\n*   Trying 93.184.216.34:443...', 'bash'],
    ['#!/usr/bin/env bash\nset -euo pipefail', 'bash'],
    ['# Full tree\nmvn dependency:tree', 'bash'],
    ['@Bean\nRestClient client() {}\n\n$ ./mvnw test', 'java'],
  ])('%s -> %s', (code, language) => {
    expect(detectLanguage(code)).toBe(language);
  });
});

describe('matchesQuery', () => {
  const subsection: Subsection = {
    subtitle: 'Controle de Versão',
    description: 'Básico',
    examples: [{ title: 'Explicação', explanation: 'Use branches.', code: 'git rebase main' }],
  };

  it('matches every subsection on an empty query', () => {
    expect(matchesQuery(subsection, '  ')).toBe(true);
  });

  it('ignores case and accents', () => {
    expect(matchesQuery(subsection, 'VERSAO')).toBe(true);
  });

  it('searches code and explanations', () => {
    expect(matchesQuery(subsection, 'rebase')).toBe(true);
    expect(matchesQuery(subsection, 'docker')).toBe(false);
  });
});

describe('parseRichText', () => {
  it('splits paragraphs on blank lines', () => {
    expect(parseRichText('Um.\n\nDois.\n  \nTrês.').length).toBe(3);
  });

  it('marks `code` and **bold** segments', () => {
    expect(parseRichText('**Problema:** use `COMMIT` agora')).toEqual([
      [
        { kind: 'bold', value: 'Problema:' },
        { kind: 'text', value: ' use ' },
        { kind: 'code', value: 'COMMIT' },
        { kind: 'text', value: ' agora' },
      ],
    ]);
  });

  it('leaves unmatched markers as text', () => {
    expect(parseRichText('permitir /public/** e `aberto')).toEqual([
      [{ kind: 'text', value: 'permitir /public/** e `aberto' }],
    ]);
  });
});
