import { SvelteComponentTyped } from 'svelte';
import type { VFile, Root, ViewerProps } from './helpers';
declare const __propDef: {
    props: ViewerProps;
    events: {
        hast: CustomEvent<{
            hast: Root;
            file: VFile;
        }>;
    };
    slots: {};
};
export declare type OutConnectorProps = typeof __propDef.props;
export declare type OutConnectorEvents = typeof __propDef.events;
export declare type OutConnectorSlots = typeof __propDef.slots;
export default class OutConnector extends SvelteComponentTyped<OutConnectorProps, OutConnectorEvents, OutConnectorSlots> {
}
export {};
