import { createElement, Component } from 'react';
import * as bytemd from 'bytemd';

export class Viewer extends Component<bytemd.ViewerProps> {
  private container: HTMLElement | null;
  private setContainer: (e: HTMLElement) => void;

  constructor(props: Readonly<bytemd.ViewerProps>) {
    super(props);
    this.container = null;
    this.setContainer = e => {
      this.container = e;
    };
  }
  componentDidMount() {
    new bytemd.Viewer({
      target: this.container!,
      props: this.props
    });
  }
  render() {
    return createElement('div', {
      ref: this.setContainer
    });
  }
}

export class Editor extends Component<bytemd.EditorProps> {
  private container: HTMLElement | null;
  private setContainer: (e: HTMLElement) => void;

  constructor(props: Readonly<bytemd.EditorProps>) {
    super(props);
    this.container = null;
    this.setContainer = e => {
      this.container = e;
    };
  }
  componentDidMount() {
    new bytemd.Viewer({
      target: this.container!,
      props: this.props
    });
  }
  render() {
    return createElement('div', {
      ref: this.setContainer
    });
  }
}
