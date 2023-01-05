import { CryptoService } from './../../services/crypto-service.service';
import { createReducer, on, Store } from '@ngrx/store';
import { LocaStorageService } from 'src/app/services/loca-storage-service.service';
import { setRoom, setSession, setTheme, setUser, stateType } from './session.actions';

export const initialState: stateType = {
    theme: 'light',
    room: undefined,
    user: undefined
};

const cryptoService = new CryptoService();
const locaStorageService = new LocaStorageService(cryptoService);

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
        locaStorageService.set('session-key', action.user);
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