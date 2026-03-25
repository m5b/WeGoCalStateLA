package com.wego.login;

import jakarta.ws.rs.core.MultivaluedMap;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.jboss.logging.Logger;
import org.keycloak.authentication.FormAction;
import org.keycloak.authentication.FormContext;
import org.keycloak.authentication.ValidationContext;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.FormMessage;
import java.util.List;

public class EmailHashFormAction implements FormAction {
    private KeycloakSession session;
    private static final Logger LOG = Logger.getLogger(EmailHashFormAction.class);

    public EmailHashFormAction(KeycloakSession session){
        this.session = session;
    }

    @Override
    public void buildPage(FormContext formContext, LoginFormsProvider loginFormsProvider) {

    }

    @Override
    public void validate(ValidationContext context) {
        LOG.info("EmailHashFormAction validate called");

        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
        String email = formData.getFirst("email");

        if (email == null || email.isBlank()) {
            LOG.warn("Missing email in registration form");
            context.validationError(formData, List.of(new FormMessage("email", "Missing email")));
            return;
        }

        try {
            String normalizedEmail = email.trim().toLowerCase();
            LOG.info("About to call hash API");

            EmailHashClient client = new EmailHashClient(context.getSession());
            String emailHash = client.fetchEmailHash("http://backend:3000/api/auth/voprf-register", normalizedEmail);

            LOG.info("Hash API returned successfully");
            LOG.info("emailHash = " + emailHash);

            if (emailHash == null || emailHash.isBlank()) {
                LOG.warn("Hash API returned blank emailHash");
                context.validationError(
                        formData,
                        List.of(new FormMessage(null, "Unable to process registration right now"))
                );
                return;
            }

            context.getAuthenticationSession().setAuthNote("emailHash", emailHash);
            LOG.info("Stored emailHash in auth note");
            context.success();
        } catch (Exception e) {
            LOG.error("Hash API call failed", e);
            context.validationError(
                    formData,
                    List.of(new FormMessage(null, "Unable to process registration right now"))
            );
        }
    }

    @Override
    public void success(FormContext formContext) {
        UserModel user = formContext.getUser();
        if (user == null) {
            throw new IllegalStateException("User is null");
        }

        String emailHash = formContext.getAuthenticationSession().getAuthNote("emailHash");
        if (emailHash == null || emailHash.isBlank()) {
            throw new IllegalStateException("Missing email hash");
        }

        user.setSingleAttribute("emailHash", emailHash);
    }

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public boolean configuredFor(KeycloakSession keycloakSession, RealmModel realmModel, UserModel userModel) {
        return false;
    }

    @Override
    public void setRequiredActions(KeycloakSession keycloakSession, RealmModel realmModel, UserModel userModel) {

    }

    @Override
    public void close() {

    }
}
