<script context="module">
  // Declare callbacks here to be non-reactive
  const cbsMap = {};
</script>

<script>
  import { onMount, createEventDispatcher, onDestroy, tick } from 'svelte';
  import debounce from 'lodash.debounce';
  import Toolbar from './toolbar.svelte';
  import Viewer from './viewer.svelte';

  export let value = '';
  export let plugins = [];
  export let sanitize = null;
  export let mode = 'split';
  export let previewDebounce = 300;
  export let containerStyle = null;

  let el;
  let viewerValue;
  let textarea;
  let cm;
  let cbs = [];
  let activeTab = 0;
  const id = Date.now();
  const dispatch = createEventDispatcher();

  function setActiveTab(e) {
    activeTab = e.detail.value;
    if (cm && activeTab === 0) {
      tick().then(() => {
        cm.focus();
      });
    }
  }

  function on() {
    cbsMap[id] = plugins.map(
      ({ editorEffect }) => editorEffect && editorEffect(cm, el)
    );
  }
  function off() {
    cbsMap[id] && cbsMap[id].forEach((cb) => cb && cb());
  }
  const updateViewerValue = debounce(() => {
    viewerValue = value;
  }, previewDebounce);

  $: if (cm && value !== cm.getValue()) {
    cm.setValue(value);
  }
  $: if (value != null) updateViewerValue();

  $: if (cm && el && plugins) {
    off();
    tick().then(() => {
      on();
    });
  }
  onMount(async () => {
    const [codemirror] = await Promise.all([
      import('codemirror'),
      import('codemirror/mode/markdown/markdown.js'),
      import('codemirror/addon/display/placeholder.js'),
    ]);
    cm = codemirror.fromTextArea(textarea, {
      mode: 'markdown',
      lineWrapping: true,
      placeholder: 'Start writing...',
    });
    cm.setValue(value);
    cm.on('change', (doc, change) => {
      dispatch('change', { value: cm.getValue() });
    });
    // No need to call `on` because cm instance would change once after init
  });
  onDestroy(off);
</script>

<div class="bytemd" bind:this={el} style={containerStyle}>
  <Toolbar {cm} {mode} {activeTab} on:tab={setActiveTab} />
  <div class="bytemd-body">
    <div
      class="bytemd-editor"
      style={mode === 'tab' && activeTab === 1 ? 'display:none' : undefined}>
      <textarea bind:this={textarea} style="display:none" />
    </div>
    <div
      class="bytemd-preview"
      style={mode === 'tab' && activeTab === 0 ? 'display:none' : undefined}>
      <Viewer value={viewerValue} {plugins} {sanitize} />
    </div>
  </div>
</div>
