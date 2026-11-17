# syntax=docker/dockerfile:1
#
# Imagem de produção do Currículo Online.
#
#   Estágio 1 (build)   : Node instala dependências e gera o build estático (dist/).
#   Estágio 2 (runtime) : nginx sem root serve só os arquivos estáticos.
#
# A imagem final não tem Node, npm, código-fonte nem node_modules — apenas o nginx
# e o conteúdo de dist/. Feita para rodar dentro de um pod Kubernetes com:
#   runAsNonRoot, readOnlyRootFilesystem (com /tmp em emptyDir) e sem capabilities.

############################
# Estágio 1 — build
############################
# --platform=$BUILDPLATFORM: o build do site roda na arquitetura da máquina de CI
# (rápido, sem emulação). O resultado é HTML/CSS/JS, igual para amd64 e arm64.
FROM --platform=$BUILDPLATFORM node:22-alpine AS build

WORKDIR /app

# Copia só os manifestos primeiro: enquanto package*.json não mudar, o Docker
# reaproveita a camada do `npm ci` e o build fica bem mais rápido.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

COPY . .
RUN npm run build

############################
# Estágio 2 — runtime
############################
# nginx oficial, variante "unprivileged": roda como UID 101 e escuta na 8080
# (portas < 1024 exigiriam root ou a capability NET_BIND_SERVICE).
FROM nginxinc/nginx-unprivileged:1.31-alpine AS runtime

# Configuração própria (substitui a padrão da imagem).
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf

# Somente o resultado do build.
COPY --from=build /app/dist /usr/share/nginx/html

# UID numérico explícito: o Kubernetes só consegue validar `runAsNonRoot: true`
# quando o usuário da imagem é numérico.
USER 101

EXPOSE 8080

# O nginx encerra com SIGQUIT de forma graciosa (termina as requisições em curso).
STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
