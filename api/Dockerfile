FROM eclipse-temurin:latest AS runtime
ENV ARTIFACT_NAME=ftt-0.0.1-SNAPSHOT.jar
ENV APP_HOME=/usr/app

WORKDIR $APP_HOME
ADD build/libs/$ARTIFACT_NAME $APP_HOME/$ARTIFACT_NAME

EXPOSE 8080
ENTRYPOINT java -Dspring.profiles.active=docker -jar $APP_HOME/$ARTIFACT_NAME