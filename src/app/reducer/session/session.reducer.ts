import { createReducer, on } from '@ngrx/store';
import { setRoom, setSession, setTheme, setUser, stateType } from './session.actions';



export const initialState: stateType = {
    theme: 'light',
    room: undefined,
    user: undefined
};

export const sessionReducer = createReducer(
    initialState,
    on(setSession, (state: stateType, action: stateType) => action),
    on(setTheme, (state: stateType, action: stateType) => {
        return {
            ...state,
            theme: action.theme
        };
    }),
    on(setUser, (state: stateType, action: stateType) => {
        return {
            ...state,
            user: action.user
        };
    }),
    on(setRoom, (state: stateType, action: stateType) => {
        return {
            ...state,
            room: action.room
        };
    }),
);