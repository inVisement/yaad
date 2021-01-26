

import {apiFetcher, Vue} from "./fetcher.js"

var promises = [...document.querySelectorAll('markdown')]
.map(markdown2html)

Promise.allSettled(promises).then(htmlActions)


const vm = new Vue({
	el: "#vueAppEl",
	components: {
		'api-fetcher': apiFetcher
	}
})


const markedOptions = {
	breaks: true,
	baseUrl: "invisement.com",
	headerIds: false,
	smartLists: true,
	smartyPants: true,
}


async function markdown2html (el) {
	// fetch markdown file from src attribute
	const md = await fetch(el.attributes.src.value).then(md => md.text())
	var html = marked(md, markedOptions)
	// add icon before ul elements to expand on clicks
	el.innerHTML = html.replaceAll("<ul>", '<icon onclick="toggleList(this); style="class: toggle-list;">📫</icon><ul style="display: none;">')

}

function htmlActions() {
	// expand first level lists
	document.querySelectorAll('h2 ~ icon').forEach(ul=>{
		toggleList(ul)
	})

	document.querySelectorAll('code').forEach(vm.$refs.apiFetcher.setupAPI)

}



function toggleList(icon) {
	let ul = icon.nextSibling
	if (ul.style.display=="none") {
		ul.style.display = "block"
		icon.innerHTML = "📭"
	} else {
		ul.style.display = "none"
		icon.innerHTML = "📫"

	}
}
