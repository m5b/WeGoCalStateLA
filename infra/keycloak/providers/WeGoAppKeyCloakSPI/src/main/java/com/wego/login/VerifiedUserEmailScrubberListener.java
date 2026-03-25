package com.wego.login;


import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import java.util.List;

public class VerifiedUserEmailScrubberListener implements EventListenerProvider{
    private final KeycloakSession session;

    public VerifiedUserEmailScrubberListener(KeycloakSession session){
        this.session =session;
    }
    @Override
    public void onEvent(Event event) {
        if (event == null || event.getType() != EventType.VERIFY_EMAIL) {
            return;
        }

        RealmModel realm = session.realms().getRealm(event.getRealmId());
        if (realm == null) {
            return;
        }

        UserModel currentUser = session.users().getUserById(realm, event.getUserId());
        if (currentUser == null) {
            return;
        }

        String emailHash = currentUser.getFirstAttribute("emailHash");
        if (emailHash == null || emailHash.isBlank()) {
            return;
        }

        // find duplicate users by emailHash
        List<UserModel> duplicates = session.users()
                .searchForUserByUserAttributeStream(realm, "emailHash", emailHash)
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .toList();

        //remove older user and call backend for soft delete
        for (UserModel oldUser : duplicates) {
            session.users().removeUser(realm, oldUser);
        }

        currentUser.setEmail("");

    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean b) {

    }

    @Override
    public void close() {

    }
}
