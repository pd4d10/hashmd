import * as React from 'react';
import * as bytemd from 'bytemd';

class SvelteComponent extends React.Component<any> {
  container: any;
  instance: any;
  div: any;

  constructor(props: any) {
    super(props);

    this.container = React.createRef();
    this.instance = null;
    this.div = React.createElement('div', { ref: this.container });
  }

  componentDidMount() {
    const { this: Constructor, ...props } = this.props;

    this.instance = new Constructor({
      target: this.container.current,
      props,
    });
    this.instance.$on('change', (e: any) => {
      if (this.props.onChange) {
        this.props.onChange(e.detail.value);
      }
    });
  }

  componentDidUpdate() {
    this.instance.$set(this.props);
  }

  componentWillUnmount() {
    this.instance.$destroy();
  }

  render() {
    return this.div;
  }
}

export interface EditorProps extends bytemd.EditorProps {
  onChange?(value: string): void;
}

export const Editor: React.FC<EditorProps> = props => (
  <SvelteComponent this={bytemd.Editor} {...props} />
);

export interface ViewerProps extends bytemd.ViewerProps {}

export const Viewer: React.FC<ViewerProps> = props => (
  <SvelteComponent this={bytemd.Viewer} {...props} />
);
