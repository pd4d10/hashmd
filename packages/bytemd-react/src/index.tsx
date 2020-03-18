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
      props
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

export const Editor: React.FC<bytemd.EditorProps> = props => (
  <SvelteComponent this={bytemd.Editor} {...props} />
);

export const Viewer: React.FC<bytemd.ViewerProps> = props => (
  <SvelteComponent this={bytemd.Viewer} {...props} />
);
