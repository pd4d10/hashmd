<script>
  import { encode } from 'plantuml-encoder'
  export let node
</script>

<img src={`//www.plantuml.com/plantuml/img/${encode(node.value)}`} alt="plantuml" />
