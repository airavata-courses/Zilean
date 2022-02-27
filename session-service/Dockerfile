FROM maven:latest as builder

WORKDIR /usr/app

COPY ./ ./

RUN mvn -f pom.xml -X clean install


# Step 2

FROM openjdk:17.0.1

WORKDIR /usr/app

COPY --from=builder ./usr/app/target ./

CMD ["java", "-jar", "SessionService-0.0.1-SNAPSHOT.jar"]
