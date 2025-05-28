package br.com.backend.backend.Exceptions.Custom;

import br.com.backend.backend.Enums.EnMaintenanceRequestState;

public class InvalidStateTransitionException extends RuntimeException {
    public InvalidStateTransitionException(EnMaintenanceRequestState fromState,
                                           EnMaintenanceRequestState toState) {
        super(String.format("Invalid transition from %s to %s", fromState, toState));
    }
}