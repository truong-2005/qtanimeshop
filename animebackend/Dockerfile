# Build stage
FROM maven:3-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/animebackend-0.0.1-SNAPSHOT.jar animebackend.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","animebackend.jar"]
