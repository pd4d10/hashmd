import en from './locales/en.json'
import * as icons from '@icon-park/svg'
import type { BytemdPlugin, BytemdEditorContext } from 'bytemd'
import selectFiles from 'select-files'

type Locale = {
  zip: string
  zipTitle: string
}

export interface BytemdPluginZipOptions {
  locale?: Partial<Locale>
  uploadZip?: (file: File) => Promise<string | undefined>
}

export default function zipUpload({
  locale: _locale = {},
  uploadZip
}: BytemdPluginZipOptions = {}): BytemdPlugin {
  const locale = { ...en, ..._locale } as Locale

  return {
    actions: [
      {
        title: locale.zip,
        icon: icons.Zip({}),
        cheatsheet: `![${locale.zip}](${locale.zipTitle})`,
        handler: uploadZip
          ? {
              type: 'action',
              async click(ctx: BytemdEditorContext) {
                const files = await selectFiles({
                  accept: 'aplication/zip',
                  multiple: false,
                })
                if (files?.length) {
                  await handleZipUpload(ctx, uploadZip, files[0])
                }
              },
            }
          : undefined,
      },
    ],
  }
}

export async function handleZipUpload(
  { editor, appendBlock, codemirror }: BytemdEditorContext,
  uploadZip: NonNullable<BytemdPluginZipOptions['uploadZip']>,
  file: File
) {
  const res = await uploadZip(file)
  const pos = appendBlock(`[${file.name}](${res})`)
  editor.setSelection(pos, codemirror.Pos(pos.line + 1, 0))
  editor.focus()
}
