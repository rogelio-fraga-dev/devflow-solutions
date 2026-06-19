# ==================================================
# DevFlow Solutions — Backend (Spring Boot 4 + Java 21)
# ==================================================
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copia arquivos do Maven Wrapper e pom.xml primeiro (cache de dependências)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Garante permissão de execução no wrapper
RUN chmod +x mvnw

# Baixa dependências (cache layer)
RUN ./mvnw dependency:go-offline -B

# Copia o código-fonte e compila
COPY src src
RUN ./mvnw package -DskipTests -B

# --- Imagem de produção ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
