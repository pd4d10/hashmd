# @bytemd/plugin-zip

[![npm](https://img.shields.io/npm/v/@bytemd/plugin-zip.svg)](https://npm.im/@bytemd/plugin-zip)

ByteMD plugin to support zip upload.

## Usage

```js
import pluginZip from '@bytemd/plugin-zip'
import pluginZipLocales from '@bytemd/plugin-zip/locales/zh_Hans.json';

import { Editor } from 'bytemd'

  const uploadZip = async (file: File) => {
    // retrun  download url  
    // return await handleZip(file); 
    return ''
  };

new Editor({
  target: document.body,
  props: {
    plugins: [
       pluginZip({ locale: pluginZipLocales, uploadZip }),
      // ... other plugins
    ],
  },
})
```

## License

MIT
