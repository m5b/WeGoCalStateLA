FROM maven:3.9.8-eclipse-temurin-21 AS spi-build
WORKDIR /build
COPY providers/WeGoAppKeyCloakSPI/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B
COPY providers/WeGoAppKeyCloakSPI/ ./
RUN mvn clean package -Dmaven.test.skip=true

FROM node:20 AS theme-build
WORKDIR /build
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
COPY providers/keycloakify-mui-starter/package.json ./
COPY providers/keycloakify-mui-starter/package-lock.json ./
RUN npm ci
COPY providers/keycloakify-mui-starter/ ./
RUN npm run build-keycloak-theme



FROM quay.io/keycloak/keycloak:26.5.6
COPY --from=spi-build /build/target/*.jar /opt/keycloak/providers/
COPY --from=theme-build /build/dist_keycloak/*.jar /opt/keycloak/providers/
COPY import/ /opt/keycloak/data/import/
RUN /opt/keycloak/bin/kc.sh build
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]