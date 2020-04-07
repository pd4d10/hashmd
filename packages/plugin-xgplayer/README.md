# @bytemd/plugin-xgplayer

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-xgplayer.svg)](https://npm.im/@bytemd/plugin-xgplayer)

[bytemd](https://github.com/bytedance/bytemd) plugin to support `<video>` with [xgplayer](https://github.com/bytedance/xgplayer)

## Usage

```js
import { Editor } from 'bytemd';
import xgplayer from '@bytemd/plugin-xgplayer';

new Editor({
  target: document.body,
  props: {
    plugins: [
      xgplayer(),
      // ... other plugins
    ],
  },
});
```

### Options

```js
xgplayer({
  // Specify tag name, default: video
  tagName: 'my-awesome-video',

  // See http://h5player.bytedance.com/en/config/#optional-configuration
  playerOptions: {},
  onClickIcon(cm) {
    // Toolbar icon click event
  },
});
```

## Example

```md
<video src="https://example.com/video.mp4" poster="https://example.com/poster.png" width="720" height="480"></video>
```

## License

MIT
