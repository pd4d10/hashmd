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
