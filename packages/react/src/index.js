import { createElement, Component } from 'react';
import * as bytemd from 'bytemd';

export class Viewer extends Component {
  constructor() {
    super();
    this.container = null;
    this.setContainer = e => {
      this.container = e;
    };
  }
  componentDidMount() {
    new bytemd.Viewer({
      target: this.container,
      props: this.props
    });
  }
  render() {
    return createElement('div', {
      ref: this.setContainer
    });
  }
}

export class Editor extends Component {
  constructor() {
    this.container = null;
    this.setContainer = e => {
      this.container = e;
    };
  }
  componentDidMount() {
    new bytemd.Editor({
      target: this.container,
      props: this.props
    });
  }
  render() {
    return createElement('div', {
      ref: this.setContainer
    });
  }
}
