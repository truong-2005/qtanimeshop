FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/animebackend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083

USER 1000:1000

ENTRYPOINT ["java", "-jar", "app.jar"]
