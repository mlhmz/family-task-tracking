FROM eclipse-temurin:latest AS build-stage
RUN mkdir -p /ftt
WORKDIR /ftt
COPY . .
RUN ./gradlew bootJar

FROM eclipse-temurin:latest AS runtime
COPY --from=build-stage /ftt/build/libs/*.jar ./ftt.jar
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "./ftt.jar"]