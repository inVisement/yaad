
# yaad
yet another api documentation

This js library:
- converts your markdown to a beautiful webpage
- makes your page expandable when clicking on h1-h4 (configurable)
- adds api-fetcher to your documentation to test and fetch api calls by clicking on links

I often struggle with easy documentation of APIs that we develop, so I developed this little helper. If you embrace eXtreme Programming, this library helps you to focus on your code and markdown. 

Example: this repo's pages (https://invisement.github.io/yaad/src/) are created by itself with no jenkin, static generator. Just following the below. 

## how to install

following example shows how to use:

index.html:
```html

<!doctype html>
<html lang="en">

<head>
	
	<meta charset="utf-8"/>
	<title>yaad</title>
	<meta name="description" content="yet another api documentation">
	<meta name="viewport" content="width=device-width, initial-scale=1"> <!-- optional: to make your page responsive and mobile-friendly -->

</head>

<body>
	<main>
		<api-fetcher></api-fetcher> <!--- necessary to initiate api fetcher --->

		<mark-down src="./test/to-do.md"></mark-down> <!--- src point to your markdown file --->
		<mark-down src="./README.md" class="language-js"></mark-down> <!--- optionally you can add language for syntax highlighting --->
		
	</main>
</body>

<!-- optional: to change default js variables -->
<script>
	const expandableSelector = 'main'
</script>

<!-- necessary to include following css and js files -->
<link rel="stylesheet" href = "https://cdn.jsdelivr.net/gh/invisement/yaad/src/index.css"> 
<script type="module">
	import {initiate} from "https://cdn.jsdelivr.net/gh/invisement/yaad/src/index.js"
	initiate() // you can overwrite defualt values like initiate({expandableSelector: 'main'})
</script>


<!-- optional: to change default css variables such as theme-->
<style>
	:root{
		--hue: 320; /*320 is the hue of magenta color*/
	}
</style>

</html>

```

The above link uses jsdelivr to link to this library. Alternatively, you can save the content of `src/` to your static directory and link from your own static directoy. Alternatively (and better way), you can link to static pages:
- https://invisement.github.io/yaad/src/index.js
- https://invisement.github.io/yaad/src/index.css
which are cdn and can handle huge loads.


## Tweek css options
If you like to have a different style and look, change css variables in your `<style>` tag. Below is the default values:

```html
<style>
:root{
	--hue: 240;
	--saturation: 75%;

	--font-size: calc(0.5em + 1vmin);
	--main-font: 'sans-serif';
	--max-width: 55em;
	--line-height: 2em;
	--code-font: 'monospace';
	--input-width: 8em;
}
</style>
```

## Tweek js options
You do not need to tweek js options but you can provide your own query selectors:

```html
<script type="module">
	import {initiate} from "https://cdn.jsdelivr.net/gh/invisement/yaad/src/index.js"
	initiate({
		markdownSelector: 'mark-down',
		expandableSelector: 'mark-down', //for example change it 'main'
		apiSelector: 'code', // for example change it to 'main code'
	})
</script>
```

## how to use
When clicking on API links, it will open `API Fetcher` dialog modal.

To specify an API call in your markdown use the following format:

`method1,method2 base-url/url-path/with-variables-like/{this-variable}/and-others?query-parameters=default?body-parameters=default`

<mark>Try it by clicking on below example links</mark>

example1: `GET,POST /api/endpoints/{endpoint}?user=&size=10&output?pass:password=&file:file=&complete=true`
example2: `GET /api/endpoints/{endpoint}??pass:password=&file:file=&complete=true`
example3: `POST /apis/{api}/endpoints/?user&size=10&output=`
not example: `some code that is not api call and won't trigger api fetcher`

For query parameters and body parameters:
- `variable=&next-var...` means `""` is the default value for `variable`
- `variable&next-var...` means `variable` is required and has no default value
- example: `POST /apis/{api}/endpoints/?user=&size=10&output=`
	- default value of size is `10`
	- default value of output is empty string
	- `user` has no default value and input is required


## future features
- [X] add how to use and how to install
- [ ] add demo website
- [ ] add header options to api calls
- [ ] add minify for js and css files

