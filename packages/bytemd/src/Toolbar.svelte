<script>
  export let cm;

  function handleDec(decorator) {
    if (cm.somethingSelected()) {
      cm.replaceSelection(decorator + cm.getSelection() + decorator);
    } else {
      const { anchor, head } = cm.findWordAt(cm.getCursor());
      const word = cm.getRange(anchor, head);
      cm.replaceRange(decorator + word + decorator, anchor, head);
    }
    cm.focus();
  }
  function handleBold() {
    return handleDec('**');
  }
  function handleItalic() {
    return handleDec('*');
  }
  function handleBlockquote() {}
</script>

<style>
  div {
    display: flex;
    padding: 10px;
    border: 1px solid #eee;
  }
</style>

<div>
  <button on:click={handleBold}>bold</button>
  <button on:click={handleItalic}>italic</button>
  <button on:click={handleBlockquote}>blockquote</button>
</div>
