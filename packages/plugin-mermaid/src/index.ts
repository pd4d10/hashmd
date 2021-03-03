import type { BytemdPlugin } from 'bytemd';
import type { Mermaid } from 'mermaid';
import type mermaidAPI from 'mermaid/mermaidAPI';
import { icons } from './icons';
import en from './locales/en.json';

export interface BytemdPluginMermaidOptions extends mermaidAPI.Config {
  locale?: typeof en;
}

export default function mermaid({
  locale = en,
  ...mermaidConfig
}: BytemdPluginMermaidOptions = {}): BytemdPlugin {
  let m: Mermaid;

  return {
    viewerEffect({ markdownBody }) {
      (async () => {
        const els = markdownBody.querySelectorAll<HTMLElement>(
          'pre>code.language-mermaid'
        );
        if (els.length === 0) return;

        if (!m) {
          m = await import('mermaid').then((c) => c.default);
          if (mermaidConfig) {
            m.initialize(mermaidConfig);
          }
        }

        els.forEach((el, i) => {
          const pre = el.parentElement!;
          const source = el.innerText;

          const container = document.createElement('div');
          container.classList.add('bytemd-mermaid');
          container.style.lineHeight = 'initial'; // reset line-height
          pre.replaceWith(container);

          try {
            m.render(
              `bytemd-mermaid-${Date.now()}-${i}`,
              source,
              (svgCode) => {
                container.innerHTML = svgCode;
              },
              // @ts-ignore
              container
            );
          } catch (err) {
            // console.error(err);
          }
        });
      })();
    },
    action: {
      title: locale.mermaid,
      icon: icons.mermaid,
      handler: [
        {
          title: locale.flowchart,
          code: `graph TD
Start --> Stop`,
        },
        {
          title: locale.sequence,
          code: `sequenceDiagram
Alice->>John: Hello John, how are you?
John-->>Alice: Great!
Alice-)John: See you later!`,
        },
        {
          title: locale.class,
          code: `classDiagram
Animal <|-- Duck
Animal <|-- Fish
Animal <|-- Zebra
Animal : +int age
Animal : +String gender
Animal: +isMammal()
Animal: +mate()
class Duck{
    +String beakColor
    +swim()
    +quack()
}
class Fish{
    -int sizeInFeet
    -canEat()
}
class Zebra{
    +bool is_wild
    +run()
}`,
        },
        {
          title: locale.state,
          code: `stateDiagram-v2
[*] --> Still
Still --> [*]

Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]`,
        },
        {
          title: locale.er,
          code: `erDiagram
CUSTOMER ||--o{ ORDER : places
ORDER ||--|{ LINE-ITEM : contains
CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
        },
        {
          title: locale.uj,
          code: `journey
title My working day
section Go to work
  Make tea: 5: Me
  Go upstairs: 3: Me
  Do work: 1: Me, Cat
section Go home
  Go downstairs: 5: Me
  Sit down: 5: Me`,
        },
        {
          title: locale.gantt,
          code: `gantt
title A Gantt Diagram
dateFormat  YYYY-MM-DD
section Section
A task           :a1, 2014-01-01, 30d
Another task     :after a1  , 20d
section Another
Task in sec      :2014-01-12  , 12d
another task      : 24d`,
        },
        {
          title: locale.pie,
          code: `pie title Pets adopted by volunteers
"Dogs" : 386
"Cats" : 85
"Rats" : 15`,
        },
      ].map(({ title, code }) => ({
        title,
        handler({ editor, appendBlock }) {
          const { line } = appendBlock('```mermaid\n' + code + '\n```');
          editor.setSelection(
            { line: line + 1, ch: 0 },
            { line: line + code.split('\n').length, ch: Infinity }
          );
          editor.focus();
        },
      })),
      ...locale,
    },
  };
}
