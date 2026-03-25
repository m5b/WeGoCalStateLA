package com.wego.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.keycloak.models.KeycloakSession;


import com.fasterxml.jackson.databind.JsonNode;
import org.keycloak.http.simple.SimpleHttp;

import java.util.Map;

public final class EmailHashClient {

    private final KeycloakSession session;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EmailHashClient(KeycloakSession session) {
        this.session = session;
    }

    public String fetchEmailHash(String url, String email) {
        try {
            Map<String, String> payload = Map.of("email", email);

            String responseBody = SimpleHttp
                    .create(session)
                    .doPost(url)
                    .header("Content-Type", "application/json")
                    .json(payload)
                    .asString();

            JsonNode json = objectMapper.readTree(responseBody);

            String status = json.path("status").asText(null);
            String emailHash = json.path("data").path("emailHash").asText(null);

            if (!"success".equalsIgnoreCase(status)) {
                throw new RuntimeException("Hash API returned non-success status. body=" + responseBody);
            }

            if (emailHash == null || emailHash.isBlank()) {
                throw new RuntimeException("Hash API response missing emailHash. body=" + responseBody);
            }

            return emailHash;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch email hash", e);
        }
    }
}