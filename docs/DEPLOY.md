# CI/CD, container e deploy

Este guia explica o que cada peça faz, como ligar tudo e o que o pod do Kubernetes
precisa ter para rodar a imagem.

## 1. Visão geral

```
 você faz push / abre PR
          │
          ▼
┌─────────────────────── GitHub Actions (.github/workflows/ci-cd.yml) ───────────────────────┐
│                                                                                            │
│  job "qualidade"            job "imagem"                                                   │
│  ─────────────────          ───────────────────────────────────────────────────────────    │
│  npm ci                     docker build (amd64) ─► smoke test ─► scan Trivy ─┐            │
│  typecheck          ──►     (container read-only,  (healthz, CSP,  (HIGH/      │            │
│  testes (Vitest)            sem root, igual pod)    404, UID 101)  CRITICAL)   │            │
│  build                                                                         ▼            │
│                                                  só em push na master ou tag v*:            │
│                                                  build amd64+arm64 ─► push no GHCR          │
└────────────────────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
 ghcr.io/braceroinsabot/curriculo-online:sha-abc1234   (+ :latest, + :1.2.3 em releases)
          │
          ▼   (próxima etapa, quando o cluster existir — seção 6)
 Kubernetes: Deployment ─► Pod ─► container nginx :8080 ◄── Service ◄── Ingress (HTTPS)
```

- **CI (integração contínua):** todo PR e todo push passam pelos testes e pela
  validação da imagem. Se algo quebrar, o PR fica vermelho e nada é publicado.
- **CD (entrega contínua):** a cada push na `master`, a imagem validada é publicada
  no GitHub Container Registry (GHCR). O deploy no cluster entra depois (seção 6).

### Quando cada coisa roda

| Evento                       | Testes | Imagem testada + scan | Publica no GHCR | Tags publicadas                    |
|------------------------------|:------:|:---------------------:|:---------------:|------------------------------------|
| Pull request para `master`   |   ✅   |          ✅           |        —        | —                                  |
| Push na `master`             |   ✅   |          ✅           |       ✅        | `sha-<commit>`, `latest`           |
| Tag `v1.2.3`                 |   ✅   |          ✅           |       ✅        | `sha-<commit>`, `1.2.3`, `1.2`     |
| Manual (botão "Run workflow")|   ✅   |          ✅           |       ✅        | conforme a branch escolhida        |

## 2. Arquivos

| Arquivo                                  | Para que serve |
|------------------------------------------|----------------|
| `Dockerfile`                             | Build em 2 estágios: Node gera o `dist/`, a imagem final só tem nginx + `dist/`. |
| `docker/nginx/nginx.conf`                | nginx ajustado para container: 1 worker, tudo que escreve vai para `/tmp`, logs JSON no stdout. |
| `docker/nginx/default.conf`              | O site: `/healthz`, cache por tipo de arquivo, 404 para caminho inexistente. |
| `docker/nginx/security-headers.conf`     | Cabeçalhos de segurança (CSP, X-Frame-Options…) incluídos em todas as respostas. |
| `.dockerignore`                          | Mantém `node_modules`, `.git` e afins fora do build. |
| `compose.yaml`                           | Roda a imagem localmente com as mesmas restrições do pod. |
| `.nvmrc`                                 | Versão do Node (22) usada no CI. Mantenha igual à do `Dockerfile`. |
| `.github/workflows/ci-cd.yml`            | O pipeline. |
| `.github/dependabot.yml`                 | PRs semanais atualizando npm, actions e imagens base. |
| `.gitattributes`                         | Força fim de linha LF nos arquivos que rodam no Linux (você está no Windows). |

### Decisões que importam para o Kubernetes

- **Porta 8080 e usuário 101 (sem root).** A imagem base `nginx-unprivileged` já
  nasce assim; o pod pode usar `runAsNonRoot: true`.
- **Sistema de arquivos somente-leitura.** O nginx só escreve em `/tmp`
  (pid e temporários). No pod, `/tmp` vira um volume `emptyDir`.
- **`/healthz`** responde `200 ok` para as sondas de readiness e liveness, e não
  aparece nos logs.
- **Logs em JSON no stdout/stderr**, que é o que o Kubernetes coleta.
- **1 worker do nginx.** Para mais capacidade, aumente réplicas (ou use HPA).
- **Sem TLS dentro do container.** HTTPS e HSTS ficam no Ingress/Gateway.
- **Multi-arquitetura (amd64 + arm64).** Roda tanto em nós x86 quanto ARM
  (que costumam ser mais baratos na nuvem).

## 3. Ligando o CI/CD — passo a passo

1. **Envie os arquivos para o GitHub**

   ```bash
   git checkout -b ci/pipeline-e-docker
   git add .
   git commit -m "ci: pipeline GitHub Actions e conteinerização"
   git push -u origin ci/pipeline-e-docker
   ```

   Abra o PR para a `master`. A aba **Actions** (ou a seção de checks do PR) mostra
   os jobs **Qualidade** e **Imagem** rodando. Nesse PR nada é publicado.

2. **Faça o merge.** O push na `master` dispara a publicação. Ao final, o resumo da
   execução mostra o endereço da imagem com o *digest* (`@sha256:…`).

3. **Visibilidade do pacote.** O primeiro push cria o pacote
   `ghcr.io/braceroinsabot/curriculo-online` como **privado**. Escolha uma opção:
   - **Público** (mais simples, e o site já é público): GitHub → seu perfil →
     *Packages* → `curriculo-online` → *Package settings* → *Change visibility*.
   - **Privado:** crie um *Personal Access Token (classic)* só com `read:packages` e,
     no cluster, um `imagePullSecret` (seção 5).

4. **Proteja a `master`** (recomendado). *Settings → Branches → Add rule* (ou
   *Rulesets*): exigir PR e exigir que os checks **Qualidade (tipos, testes, build)**
   e **Imagem (build, smoke test, scan, publicação)** passem antes do merge.

5. **Versões (opcional).** Para marcar uma versão estável:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

   Isso publica também `:1.0.0` e `:1.0`.

### Se o scan do Trivy falhar

O job para **antes** de publicar e lista o pacote vulnerável e a versão que corrige.
Quase sempre a solução é atualizar a imagem base (o Dependabot abre esse PR toda
segunda) ou rodar `docker build --pull` para pegar a versão mais nova da tag.

## 4. Testando a imagem no seu computador

Precisa do Docker Desktop instalado.

```bash
docker compose up --build
# abra http://localhost:8080   (Ctrl+C para parar)
```

O `compose.yaml` aplica as mesmas restrições do pod (somente-leitura, `/tmp` em
memória, sem capabilities). Se funcionar aqui, funciona no cluster.

Sem compose:

```bash
docker build -t curriculo-online:local .
docker run --rm -p 8080:8080 --read-only --tmpfs /tmp --cap-drop ALL curriculo-online:local
```

## 5. O que o pod precisa ter

Exemplo com o provider `kubernetes` do Terraform (o mesmo vale para YAML; os nomes
dos campos mudam de `snake_case` para `camelCase`).

```hcl
variable "image" {
  description = "Imagem com digest, ex.: ghcr.io/braceroinsabot/curriculo-online@sha256:..."
  type        = string
}

resource "kubernetes_deployment_v1" "curriculo" {
  metadata {
    name      = "curriculo-online"
    namespace = "curriculo"
    labels    = { app = "curriculo-online" }
  }

  spec {
    replicas = 2 # 2+ para não cair durante deploy ou troca de nó

    selector {
      match_labels = { app = "curriculo-online" }
    }

    template {
      metadata {
        labels = { app = "curriculo-online" }
      }

      spec {
        automount_service_account_token  = false # o site não fala com a API do K8s
        termination_grace_period_seconds = 30

        security_context {
          run_as_non_root = true
          run_as_user     = 101
          run_as_group    = 101
          seccomp_profile {
            type = "RuntimeDefault"
          }
        }

        # Só se o pacote no GHCR for privado:
        # image_pull_secrets {
        #   name = "ghcr-pull"
        # }

        container {
          name  = "web"
          image = var.image

          port {
            name           = "http"
            container_port = 8080
          }

          resources {
            requests = { cpu = "10m", memory = "16Mi" }
            limits   = { memory = "64Mi" } # sem limite de CPU: evita throttling
          }

          security_context {
            allow_privilege_escalation = false
            read_only_root_filesystem  = true
            capabilities {
              drop = ["ALL"]
            }
          }

          readiness_probe {
            http_get {
              path = "/healthz"
              port = "http"
            }
            period_seconds = 5
          }

          liveness_probe {
            http_get {
              path = "/healthz"
              port = "http"
            }
            period_seconds    = 10
            failure_threshold = 3
          }

          # Dá tempo do Service tirar o pod da rotação antes do nginx encerrar,
          # evitando erros 502 durante o deploy.
          lifecycle {
            pre_stop {
              exec {
                command = ["sleep", "5"]
              }
            }
          }

          volume_mount {
            name       = "tmp"
            mount_path = "/tmp"
          }
        }

        volume {
          name = "tmp"
          empty_dir {
            medium     = "Memory"
            size_limit = "16Mi"
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "curriculo" {
  metadata {
    name      = "curriculo-online"
    namespace = "curriculo"
  }
  spec {
    selector = { app = "curriculo-online" }
    port {
      name        = "http"
      port        = 80
      target_port = "http"
    }
  }
}
```

**Na frente do Service** vai o Ingress (ou Gateway API) com o domínio e o certificado
TLS (por exemplo, cert-manager + Let's Encrypt). Ligue o **HSTS** lá. Atenção: o
projeto *ingress-nginx* foi aposentado em 2026; para cluster novo, prefira Gateway API,
Traefik ou o controller do seu provedor de nuvem.

**Use sempre o digest** (`@sha256:…`) ou a tag `sha-<commit>` no deploy, nunca
`latest`: assim você sabe exatamente qual versão está no ar e o rollback é trocar
o valor de volta.

Se o pacote for privado, o segredo de pull:

```bash
kubectl -n curriculo create secret docker-registry ghcr-pull \
  --docker-server=ghcr.io \
  --docker-username=BraceroInSabot \
  --docker-password=<TOKEN_COM_read:packages>
```

(Ou com Terraform, um `kubernetes_secret_v1` do tipo `kubernetes.io/dockerconfigjson`
com o token vindo de uma variável sensível — nunca commitado.)

## 6. Ligando o deploy (quando o cluster existir)

Hoje o pipeline termina publicando a imagem. Para o deploy automático há três
caminhos comuns:

| Opção | Como funciona | Quando escolher |
|---|---|---|
| **A. Terraform no pipeline** | Um job `deploy` roda `terraform apply -var image=…@digest`. | Uma ferramenta só; bom para começar. |
| **B. `kubectl set image`** | O job troca a imagem do Deployment existente. | Infra no Terraform, app atualizado direto. |
| **C. GitOps (Argo CD ou Flux)** | O pipeline grava o digest num repositório; o Argo CD, dentro do cluster, aplica. | O padrão de mercado em Kubernetes; o cluster não expõe credenciais ao GitHub. |

Para um projeto pessoal, **A** é o caminho mais curto e **C** é o que mais ensina
(e o que vagas de DevOps/plataforma pedem). Esboço da opção A, para colar no final
do `ci-cd.yml`:

```yaml
  deploy:
    name: Deploy (produção)
    needs: imagem
    if: github.ref == 'refs/heads/master'
    runs-on: ubuntu-latest
    # Crie em Settings → Environments. Dá para exigir aprovação manual
    # e guardar os segredos do cluster/nuvem só para este ambiente.
    environment: producao
    permissions:
      contents: read
      id-token: write # login na nuvem via OIDC, sem chave fixa guardada no GitHub
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      # Fixe por SHA também (veja o comentário no topo do workflow).
      - uses: hashicorp/setup-terraform@<SHA> # vX.Y.Z
      # ... autenticação no provedor de nuvem (OIDC) ...
      - run: terraform -chdir=infra init
      - run: >
          terraform -chdir=infra apply -auto-approve
          -var "image=ghcr.io/braceroinsabot/curriculo-online@${{ needs.imagem.outputs.digest }}"
```

O job `imagem` já expõe o `digest` como saída (`needs.imagem.outputs.digest`), então
não é preciso mexer nele.

## 7. Checklist antes de ir para produção

- [ ] Pipeline verde na `master` e imagem visível em *Packages*.
- [ ] Visibilidade do pacote decidida (público ou `imagePullSecret`).
- [ ] Deployment com `securityContext`, sondas, `/tmp` em `emptyDir` e `preStop`.
- [ ] Ingress/Gateway com TLS válido e HSTS.
- [ ] Deploy usando digest ou `sha-<commit>`, nunca `latest`.
- [ ] Branch `master` protegida exigindo os checks.
- [ ] Se o site passar a carregar algo de outro domínio (analytics, imagens, API),
      liberar o domínio na CSP em `docker/nginx/security-headers.conf`.
