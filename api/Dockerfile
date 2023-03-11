FROM eclipse-temurin:latest
COPY build/libs/ftt-0.0.1-SNAPSHOT.jar ftt.0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "/ftt.0.0.1-SNAPSHOT.jar"]