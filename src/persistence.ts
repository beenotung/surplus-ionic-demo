import S from 's-js';
import { Message, AppModel } from './models';

const LOCAL_STORAGE_KEY = 'messages-surplus';

export function LocalStoragePersistence(model : AppModel) {
    // load stored messages on init
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) model.messages(JSON.parse(stored).messages.map((t : any) => Message(t.text, t.timestamp)));

    // store JSONized messages whenever they change
    S(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(model));
    });
}
