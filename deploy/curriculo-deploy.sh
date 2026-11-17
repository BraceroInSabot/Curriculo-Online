#!/usr/bin/env bash
#
# Deploy do Currículo Online no servidor.
#
# Instalado em /usr/local/bin/curriculo-deploy e executado pelo usuário `deploy`:
#   - pelo GitHub Actions, via SSH, com a chave restrita a este comando
#     (forced command no ~/.ssh/authorized_keys — veja docs/PRODUCAO.md);
#   - ou à mão:  curriculo-deploy deploy sha256:<digest>
#
# Aceita apenas "deploy sha256:<64 caracteres hex>". Qualquer outra coisa é
# recusada, então a chave do GitHub não serve para abrir um shell no servidor.
#
# O que faz: atualiza o clone do repositório (código do Terraform), aplica o
# Terraform com a imagem pedida e espera os pods novos ficarem prontos.

set -euo pipefail

REPO_DIR="${CURRICULO_REPO_DIR:-$HOME/Curriculo-Online}"
IMAGE_REPO="ghcr.io/braceroinsabot/curriculo-online"
BRANCH="master"

log() { printf '[curriculo-deploy] %s\n' "$*"; }
fail() { printf '[curriculo-deploy] ERRO: %s\n' "$*" >&2; exit 1; }

# Via SSH com forced command, o comando enviado chega em SSH_ORIGINAL_COMMAND.
# À mão, chega como argumentos.
request="${SSH_ORIGINAL_COMMAND:-$*}"

if [[ ! "$request" =~ ^deploy[[:space:]]+(sha256:[a-f0-9]{64})$ ]]; then
  fail "uso: deploy sha256:<digest com 64 caracteres hexadecimais>"
fi
digest="${BASH_REMATCH[1]}"
image="${IMAGE_REPO}@${digest}"

# Um deploy por vez (dois pushes seguidos esperam na fila).
exec 9>"$HOME/.curriculo-deploy.lock"
flock --wait 600 9 || fail "outro deploy está em andamento há mais de 10 minutos"

cd "$REPO_DIR" || fail "repositório não encontrado em $REPO_DIR"

log "Atualizando o repositório ($BRANCH)…"
git fetch --quiet origin "$BRANCH"
# --ff-only: se alguém editou arquivos versionados direto no servidor, o deploy
# para em vez de sobrescrever (ou misturar) as mudanças.
git merge --ff-only --quiet "origin/$BRANCH" \
  || fail "o clone em $REPO_DIR tem mudanças locais; resolva antes (git status)"
log "Commit: $(git rev-parse --short HEAD)"

log "Aplicando o Terraform com $image"
terraform -chdir=infra init -input=false -no-color >/dev/null
terraform -chdir=infra apply -input=false -auto-approve -no-color \
  -var "image=${image}"

# Guarda a última imagem publicada, útil para rodar o Terraform à mão depois:
#   terraform -chdir=infra plan -var "image=$(cat ~/.curriculo-image)"
printf '%s\n' "$image" > "$HOME/.curriculo-image"

log "Deploy concluído: $image"
