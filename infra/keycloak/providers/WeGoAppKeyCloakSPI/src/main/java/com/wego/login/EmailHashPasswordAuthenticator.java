package com.wego.login;

import jakarta.ws.rs.core.MultivaluedMap;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.services.messages.Messages;
import org.keycloak.models.UserCredentialModel;

import java.util.List;

public class EmailHashPasswordAuthenticator implements Authenticator {

    private static final String ATTR_EMAIL_HASH = "emailHash";

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        context.challenge(context.form().createLoginUsernamePassword());
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        MultivaluedMap<String, String> form = context.getHttpRequest().getDecodedFormParameters();

        String password = form.getFirst("password");
        String emailHash = form.getFirst("emailHash");

        password = password == null ? "" : password.trim();
        emailHash = emailHash == null ? "" : emailHash.trim();

        if (emailHash.isEmpty() || password.isEmpty()) {
            context.failureChallenge(
                    AuthenticationFlowError.INVALID_CREDENTIALS,
                    context.form()
                            .setError(Messages.INVALID_USER)
                            .createLoginUsernamePassword()
            );
            return;
        }

        RealmModel realm = context.getRealm();
        List<UserModel> matches = context.getSession()
                .users()
                .searchForUserByUserAttributeStream(realm, ATTR_EMAIL_HASH, emailHash)
                .limit(2)
                .toList();

        if (matches.size() != 1) {
            context.failureChallenge(
                    AuthenticationFlowError.INVALID_CREDENTIALS,
                    context.form()
                            .setError(Messages.INVALID_USER)
                            .createLoginUsernamePassword()
            );
            return;
        }
        UserModel user = matches.getFirst();

        boolean matched = context.getSession().users().getUserCredentialManager(user).isValid(UserCredentialModel.password(password));

        if(!matched){
            context.failureChallenge(
                    AuthenticationFlowError.INVALID_CREDENTIALS,
                    context.form().setError(Messages.INVALID_USER).createLoginUsernamePassword()
            );
            return;
        }

        context.setUser(user);
        context.success();
    }

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        return true;
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {
    }

    @Override
    public void close() {
    }
}