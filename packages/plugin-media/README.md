# @bytemd/plugin-media

[bytemd](https://github.com/bytedance/bytemd) plugin to support `<video>` and `<audio>` tags

## Usage

```js
import { Editor } from 'bytemd';
import media from '@bytemd/plugin-media';

new Editor({
  target: document.body,
  props: {
    plugins: [
      media(),
      // ... other plugins
    ],
  },
});
```

### Options

```js
media({
  video: {
    defaultAttrs: {}, // Extra video attributes, default: { control: true }
    onClickIcon: (cm) {
      // Customize toolbar icon click event
      // Default behavior: insert a `video` tag
    }
  },
  audio: {
    defaultAttrs: {}, // Extra audio attributes, default: { control: true }
    onClickIcon: (cm) {
      // Customize toolbar icon click event
      // Default behavior: insert a `audio` tag
    }
  },
});
```

## Example

```md
<video src="https://example.com/video.mp4" poster="https://example.com/poster.png" width="720" height="480"></video>

<audio src="https://example.com/audio.mp3"></audio>
```

## License

MIT
