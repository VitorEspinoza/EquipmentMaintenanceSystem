package br.com.backend.backend.Enums;

import java.util.List;
import java.util.Map;

public enum EnMaintenanceRequestState {
    OPEN, QUOTED, REJECTED, APPROVED, REDIRECTED, FIXED, PAID, COMPLETED;

    private static final Map<EnMaintenanceRequestState, List<EnMaintenanceRequestState>> VALID_TRANSITIONS;

    static {
        VALID_TRANSITIONS = Map.of(
                OPEN, List.of(QUOTED),
                QUOTED, List.of(REJECTED, APPROVED),
                REJECTED, List.of(APPROVED),
                APPROVED, List.of(FIXED, REDIRECTED),
                REDIRECTED, List.of(REDIRECTED, FIXED),
                FIXED, List.of(PAID),
                PAID, List.of(COMPLETED),
                COMPLETED, List.of()
        );
    }
    public boolean canTransitionTo(EnMaintenanceRequestState newState) {
        return VALID_TRANSITIONS.getOrDefault(this, List.of()).contains(newState);
    }
}