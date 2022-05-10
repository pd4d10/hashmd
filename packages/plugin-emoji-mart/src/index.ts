import type { BytemdPlugin } from 'bytemd'
import { EmotionHappy } from '@icon-park/svg'

export default function gemoji(): BytemdPlugin {
  return {
    actions: [
      {
        icon: EmotionHappy({}),
        title: 'Emoji',
        handler: {
          type: 'action',
          async click(ctx) {
            // @ts-ignore
            const { Picker } = await import('emoji-mart')

            const x = new Picker({
              data: async () => {
                const response = await fetch(
                  'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
                )

                return response.json()
              },
            })
            console.log(x)
          },
        },
      },
    ],
  }
}
