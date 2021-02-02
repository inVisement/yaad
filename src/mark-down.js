/*
convert markdown to html
*/

import marked from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"


const markedOptions = {
	breaks: true,
	headerIds: false,
	smartLists: true,
	smartyPants: true,
}



export async function markdown2html (markdown, options={}) {
	// fetch markdown file from src attribute
	const md = await fetch(markdown.attributes.src.value)
	.then(md => md.text())

	markdown.innerHTML = marked(md, {...markedOptions, ...options})
	
}



