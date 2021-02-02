


export function makeHeadersExpandable(el, headers=['H2', 'H3', 'H4'], openDepth=5) {
	const allHeaders = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
	
	let openDetailsCloner = document.createElement('details')
	openDetailsCloner.setAttribute('open', true)

	let closeDetailsCloner = document.createElement('details')

	let summaryCloner = document.createElement('summary')

	headers.forEach ((header,i) => {
		header = header.toUpperCase()
		let topHeaders = allHeaders.filter(h => h<=header)

		el.querySelectorAll(header).forEach( headerEl => { // enclose with details tag

			let details = i<openDepth ? openDetailsCloner.cloneNode() : closeDetailsCloner.cloneNode()
			headerEl.parentNode.insertBefore(details, headerEl)
			
			let summary = summaryCloner.cloneNode()
			summary.appendChild(headerEl)
			
			let currentNode= summary;
			while (currentNode && !topHeaders.includes(currentNode.nodeName)) {
				details.appendChild(currentNode)
				currentNode = details.nextSibling
			}
		})
	})

}
