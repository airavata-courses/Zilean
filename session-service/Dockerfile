FROM openjdk:latest
ADD target/SessionService-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 5004
ENTRYPOINT ["java","-jar","/app.jar"]