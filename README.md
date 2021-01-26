
# yaad
yet another api documentation

This js library adds api-fetcher to your documentation to test and fetch api by clicking on links. It also converts .md files to beautiful html pages.


## how to use


```html

	<div id="vueAppEl">
		<api-fetcher ref="apiFetcher"></api-fetcher>
	</div>


<script type="module">
  import {apiFetcher, Vue} from "./fetcher.js"
  
  const vm = new Vue({
  	el: "#vueAppEl",
  	components: {
  		'api-fetcher': apiFetcher
  	}
  })
</script>

```

