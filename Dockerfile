# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

ARG GEMINI_API_KEY
ARG OPENAI_API_KEY
ARG TAVILY_API_KEY

ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV TAVILY_API_KEY=${TAVILY_API_KEY}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage for Cloud Run
FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
