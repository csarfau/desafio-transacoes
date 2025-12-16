# Desafio Técnico - API de Transações

![CI Pipeline](https://github.com/csarfau/desafio-transacoes/actions/workflows/ci.yml/badge.svg)
API RESTful para recebimento de transações e cálculo de estatísticas em tempo real. Desenvolvida com **NestJS** seguindo os princípios de **Clean Architecture** e **SOLID**.

---

## Tecnologias & Ferramentas

O projeto foi construído utilizando as seguintes práticas do ecossistema Node.js:

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Gerenciador de Pacotes:** PNPM
- **Arquitetura:** Clean Architecture (Domain, Application, Infrastructure)
- **Qualidade de Código:** ESLint e Prettier
- **Testes:** Jest (Unitários e E2E/Integração)
- **Documentação:** Swagger (OpenAPI 3.0)
- **Logs:** Winston (Logs estruturados em JSON)
- **Containerização:** Docker e Docker Compose (Multi-stage build)
- **Segurança:** Helmet e Throttler (Rate Limiting)

---

## Funcionalidades & Requisitos Atendidos

### 1. Endpoints da API

- **`POST /transactions`**: Recebe transações, valida tipos, garante que a data não é futura e o valor não é negativo. Retorna `201`, `400` ou `422`.
- **`DELETE /transactions`**: Limpa todos os dados em memória. Retorna `200`.
- **`GET /statistics`**: Retorna estatísticas (soma, média, min, max, count) das transações dos **últimos 60 segundos**. Algoritmo otimizado O(N).
- **`GET /health`**: Healthcheck para monitoramento.

### 2. Destaques Técnicos

- [x] **Tratamento Global de Erros:** Utilização de `ExceptionFilter` para centralizar logs e padronizar respostas de erro.
- [x] **Logs Estruturados:** Logs em formato JSON (Winston) prontos para ingestão em ferramentas como Datadog ou CloudWatch.
- [x] **Validação Rigorosa:** Uso de DTOs com `class-validator` e validações de domínio isoladas.
- [x] **Rate Limiting:** Proteção contra abuso de requisições.
- [x] **Docker Otimizado:** Build em estágios para gerar imagens leves, utilizando `pnpm` e `corepack`.

---

## Como Executar o Projeto

### Opção 1: Via Docker (Recomendado)

Para rodar a aplicação isolada sem instalar dependências na máquina:

```bash
# Sobe a aplicação e o healthcheck
docker compose up --build
```

A API estará disponível em: `http://localhost:3000`

### Opção 2: Localmente

Certifique-se de ter o Node.js (v18+) e o PNPM instalados.

```bash
# 1. Habilitar pnpm
corepack enable

# 2. Instalar dependências
pnpm install

# 3. Rodar em modo de desenvolvimento
pnpm start:dev
```

---

## Documentação (Swagger)

A documentação interativa da API é gerada automaticamente. Com a aplicação rodando, acesse:

**[http://localhost:3000/api](http://localhost:3000/api)**

Lá você pode testar todos os endpoints diretamente pelo navegador.

---

## Testes Automatizados

O projeto possui cobertura de testes para garantir a confiabilidade das regras de negócio e da API.

```bash
# Rodar Testes Unitários (Foco nos Use Cases e Regras de Negócio)
pnpm test

# Rodar Testes E2E (Simula requisições HTTP reais e valida o fluxo completo)
pnpm run test:e2e

# Verificar Cobertura de Testes
pnpm run test:cov
```
