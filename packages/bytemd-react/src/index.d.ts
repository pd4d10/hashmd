import { Component } from 'react';
import * as bytemd from 'bytemd';
export declare class Viewer extends Component<bytemd.ViewerProps> {
    private container;
    private setContainer;
    constructor(props: Readonly<bytemd.ViewerProps>);
    componentDidMount(): void;
    render(): import("react").DetailedReactHTMLElement<import("react").HTMLAttributes<HTMLElement>, HTMLElement>;
}
export declare class Editor extends Component<bytemd.EditorProps> {
    private container;
    private setContainer;
    constructor(props: Readonly<bytemd.EditorProps>);
    componentDidMount(): void;
    render(): import("react").DetailedReactHTMLElement<import("react").HTMLAttributes<HTMLElement>, HTMLElement>;
}
