import * as Surplus from 'surplus';

Surplus;
import {Style, VNodeKeys} from './json-common';

/**
 * can be customized by consumer
 * */
export let formatter = {
	date: (date: Date) => date.toLocaleString(),
	number: (number: number) => number.toLocaleString(),
};

function renderNode(node: Node) {
// TODO
	return node
}

/**
 * supported data type:
 *   + string
 *   + number
 *   + timestamp (in number)
 *   + bigint
 *   + boolean
 *   + function
 *   + symbol
 *   + undefined
 *   + null
 *   + Date
 *   + Set
 *   + Map
 *   + Array
 *   + VNode
 *   + object
 * */
export const JsonView = (props: {
	data: any,
	name?: string
	style?: Style
	/**
	 * override the style on supplied VNode (in data) or not
	 * */
	overrideStyle?: boolean
	/**
	 * treat supplied VNode as raw json object or not
	 *   if true:  will render as raw json
	 *   if false: will render as Node
	 * */
	preserveNode?: boolean,
}): Node => {
	if(!props.style){
		props.style={}
	}

	function str(string: string) {
		return <span style={props.style}>{string}</span>;
	}

	const res: string | Node = (() => {
		const data = props.data;
		const type = typeof data;
		switch (type) {
			case 'string':
				return data;
			case 'number': {
				const name = (props.name || '').toLocaleLowerCase();
				if (name.includes('time') || name.includes('date')) {
					return formatter.date(new Date(data));
				}
				return formatter.number(data);
			}
			case 'boolean':
				return data ? 'yes' : 'no';
			case 'function':
				return data.toString();
			case 'symbol':
				return data.toString();
			case 'undefined':
				return 'undefined';
			case 'object':
				if (data === null) {
					return 'null';
				}
				if (data instanceof Date) {
					return formatter.date(data);
				}
				if (data instanceof Set) {
					return <ul style={props.style}>{Array.from(data).map(x => <li>
						<JsonView {...props} data={x}/>
					</li>)}</ul>;
				}
				if (data instanceof Map) {
					return <table style={props.style}>
						<tbody>{Array.from(data.entries()).map(([key, value]) => <tr>
							<td><JsonView {...props} data={key}/></td>
							<td>=></td>
							<td><JsonView {...props} data={value} name={key}/></td>
						</tr>)}</tbody>
					</table>;
				}
				if (Array.isArray(data)) {
					return <ol style={props.style}>{data.map(x => <li>
						<JsonView {...props} data={x}/>
					</li>)}</ol>;
				}
				if (!props.preserveNode && data instanceof Node) {
					if (props.overrideStyle && props.style && data instanceof HTMLElement) {
						Object.entries(props.style).forEach(([key, value]) => {
							(data.style as any)[key] = value
						})
					}
					return data;
				}
				return <table style={props.style}>{
					Object.entries(data).map(([key, value]) => <tr>
						<td>{str(key)}:</td>
						<td><JsonView {...props} data={value} name={key}/></td>
					</tr>)
				}</table>;
			default: {
				if (type === "bigint") {
					return data.toLocaleString();
				}
				const x: never = type;
				console.error('unknown data type:', x);
				return JSON.stringify(x);
			}
		}
	})();
	return typeof res === 'string' ? str(res) : res;
};

