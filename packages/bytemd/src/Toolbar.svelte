<script>
  import { handleDec, handleBlockquote, handleLink } from './editor.js'
  export let cm;
</script>

<style>
  div {
    display: flex;
    padding: 4px;
    border: 1px solid #eee;
  }
  span {
    cursor: pointer;
    border: 1px solid transparent;
    margin-left: 6px;
  }
  span path {
    fill: #777;
  }
  span:hover {
    border: 1px solid #aaa;
  }
  svg {
    display: block;
    width: 20px;
    height: 20px;
  }
</style>

<div>
  <span on:click={() => handleDec(cm, '**')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg></span>
  <span on:click={() => handleDec(cm, '*')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg></span>
  <span on:click={() => handleDec(cm, '~~')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg></span>
  <span on:click={() => handleBlockquote(cm)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg></span>
  <span on:click={() => handleLink(cm)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></span>
</div>
