import S, { DataSignal } from 's-js';
import SArray from 's-array';

// our Message model
export const Message = (text: string, timestamp = Date.now()) => ({
    text: jsonable(S.value(text)),
    timestamp: jsonable(S.value(timestamp))
});

export type Message = typeof messageType; const messageType = returnType(Message);

// our main model
export const AppModel = (messages: Message[]) => ({
    messages: jsonable(SArray(messages))
});

export type AppModel = typeof appModelType; const appModelType = returnType(AppModel);

// A couple small utilities

// TypeScript utility: do a little generic pattern matching to extract the return type of any function.
// Lets us name that return type for usage in other function's signatures.
//     const fooReturnType = returnType(Foo);
//     type Foo = typeof fooReturnType;
export function returnType<T>(fn : (...args: any[]) => T) : T {
    return null! as T;
}

// Make any signal jsonable by adding a toJSON method that extracts its value during JSONization
function jsonable<T extends () => any>(s : T) : T  {
    (s as any).toJSON = toJSON;
    return s;
}

function toJSON(this : () => any) {
    var json = this();
    // if the value has it's own toJSON, call it now
    if (json && json.toJSON) json = json.toJSON();
    return json;
}
