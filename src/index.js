

import {markdown2html} from "./mark-down.js"
import {makeHeadersExpandable} from "./expandable.js"
import {parseFetcher} from "./fetcher.js"

const defaultOptions = {
	markdownSelector: 'mark-down',
	expandableSelector: 'mark-down',
	apiSelector: 'code',
}

export async function initiate(options) {
	options = {...defaultOptions, ...options}

	// apply markdown2html
	let promises =  [...document.querySelectorAll(options.markdownSelector)]
	.map(markdown2html)

	await Promise.all(promises)

	// apply exapandble
	document.querySelectorAll(options.expandableSelector).forEach(el => makeHeadersExpandable(el))

	// apply fetcher
	document.querySelectorAll(options.apiSelector).forEach(code => {
		parseFetcher(code)
	})
	
}


