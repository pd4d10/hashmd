<script>
  import { encode } from 'plantuml-encoder'
  export let value
</script>

<img src={`//www.plantuml.com/plantuml/img/${encode(value)}`} alt="plantuml" />
