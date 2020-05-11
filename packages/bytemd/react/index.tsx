import React, { RefObject } from 'react';
import * as bytemd from '../src';
import { SvelteComponent } from 'svelte';

class SvelteWrapper<
  P extends Record<string, unknown> = {}
> extends React.Component<
  P & {
    component: typeof SvelteComponent;
    onMount?: (instance: SvelteComponent) => void;
  }
> {
  private container: RefObject<HTMLDivElement> = React.createRef();
  private instance?: SvelteComponent;

  componentDidMount() {
    const { component: Component, onMount } = this.props;

    this.instance = new Component({
      target: this.container.current!,
      props: this.props,
    });

    if (onMount) {
      onMount(this.instance);
    }
  }

  componentDidUpdate() {
    this.instance!.$set(this.props);
  }

  componentWillUnmount() {
    this.instance!.$destroy();
  }

  render() {
    return <div ref={this.container} />;
  }
}

export interface EditorProps extends bytemd.EditorProps {
  onChange?(value: string): void;
}

export const Editor: React.FC<EditorProps> = (props) => (
  <SvelteWrapper
    {...props}
    onMount={(instance) => {
      instance.$on('change', (e: any) => {
        if (props.onChange) {
          props.onChange(e.detail.value);
        }
      });
    }}
    component={bytemd.Editor}
  />
);

export interface ViewerProps extends bytemd.ViewerProps {}

export const Viewer: React.FC<ViewerProps> = (props) => (
  <SvelteWrapper {...props} component={bytemd.Viewer} />
);
