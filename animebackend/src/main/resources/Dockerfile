FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/animebackend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083

USER 1000:1000

ENTRYPOINT ["java","-jar","app.jar"]
