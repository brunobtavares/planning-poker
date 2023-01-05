import { IRoom } from './../../interfaces/IRoom';
import { createAction, props } from '@ngrx/store';
import { IUser } from 'src/app/interfaces/IUser';

export type stateType = {
    theme?: 'light' | 'dark';
    room?: IRoom;
    user?: IUser;
}

export const setSession = createAction('[Session Component] SetSession', props<stateType>());
export const setTheme = createAction('[Session Component] SetTheme', props<{ theme: 'light' | 'dark' }>());
export const setUser = createAction('[Session Component] SetUser', props<{ user?: IUser }>());
export const setRoom = createAction('[Session Component] SetRoom', props<{ room?: IRoom }>());