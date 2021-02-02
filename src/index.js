

import {markdown2html} from "./mark-down.js"
import {makeHeadersExpandable} from "./expandable.js"
import {parseFetcher} from "./fetcher.js"

const markdownSelector = 'mark-down'
const expandableSelector = 'mark-down'
const apiSelector = 'code'


main()


async function main() {

	// apply markdown2html
	let promises =  [...document.querySelectorAll(markdownSelector)]
	.map(markdown2html)

	await Promise.all(promises)

	// apply exapandble
	document.querySelectorAll(expandableSelector).forEach(el => makeHeadersExpandable(el))

	// apply fetcher
	document.querySelectorAll(apiSelector).forEach(code => {
		parseFetcher(code)
	})
	
}


