import { SvelteComponentTyped } from 'svelte';
import { EditorProps } from './types';
declare const __propDef: {
    props: EditorProps;
    events: {
        change: CustomEvent<{value: string}>
    };
    slots: {};
};
export declare type OutConnectorProps = typeof __propDef.props;
export declare type OutConnectorEvents = typeof __propDef.events;
export declare type OutConnectorSlots = typeof __propDef.slots;
export default class OutConnector extends SvelteComponentTyped<OutConnectorProps, OutConnectorEvents, OutConnectorSlots> {
}
export {};
