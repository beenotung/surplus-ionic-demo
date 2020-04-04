import S from 's-js';
import { Message, AppModel, returnType } from './models';

export type AppCtrl = typeof appCtrlType; const appCtrlType = returnType(AppCtrl);
export function AppCtrl({ messages } : AppModel) {
    const
        newMessage  = S.value(''),
        all       = messages.map(MessageCtrl),
		isEmpty = all.length === 0;

    return {
    	newMessage,
		all,
    	isEmpty,
		handleKeyDown,
        create,
    };

    function formatTimestamp(time:number){
    	return new Date(time).toLocaleString()
	}

	function create() {
		var message = newMessage().trim();
		if (message) {
			newMessage("");
			messages.unshift(Message(message));
		}
	}

	function handleKeyDown(e:KeyboardEvent) {
    	if(e.key === 'Enter'){
    		create()
		}
	}

    function MessageCtrl(todo : Message) {
        const text = S.value(S.sample(todo.text));
        const timestamp = S.value(formatTimestamp(S.sample(todo.timestamp)))
		S.on(todo.timestamp,()=>timestamp(formatTimestamp(S.sample(todo.timestamp))));
        return {
            text,
			timestamp,
            remove      : () => messages.remove(todo),
        };
    }
}
