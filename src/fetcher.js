

import Vue from 'https://unpkg.com/vue@2.6.0/dist/vue.esm.browser.min.js';


const apiFetcherDialog = `
<modal id="api-fetcher" v-if="display">
<h1>API Fetcher</h1>
<form id="path">
	<select name="selectedMethod">
		<option v-for="method,i in methods" v-bind:selected="i===0">{{method}} </option>
	</select>
	<label v-for="item in path">
		{{item.label}}
		<input v-if="item.input" 
			v-bind:name="item.label" 
			v-bind:type="item.type || 'text'" 
			v-bind:placeholder="item.input"
			required
		>
	</label>
</form>
<form id="query">
	<fieldset>
		<legend>Query Parameters</legend>                
		<label v-for="item in query">
			{{item.label}}
			<input 
				v-bind:name="item.label" 
				v-bind:type="item.type || 'text'" 
				v-model="item.input" 
				v-bind:required="item.required"
			>
		</label>

	</fieldset>
</form>
<form id='body'>
	<fieldset>
		<legend>Request Body</legend>
		<label v-for="item in body">
			{{item.label}} 
			<input v-bind:name="item.label" v-model="item.input" v-bind:type="item.type || 'text'" v-bind:required="item.required">
		</label>
	</fieldset>
</form>
	<!--fieldset>
		<legend >Format</legend>
		<label v-for="format,i in formats">
			{{format}}
			<input v-model="selectedFormat" v-bind:checked="i===0" type="radio">
		</label>
	</fieldset-->
<menu>
	<button type="button" @click="fetchResult()">Submit</button>
	<button @click="close">Close</button>
</menu>
<mark>Open console (ctr+shift+J) to interact and see the <code>result</code></mark>
</modal>`


const apiFetcher = new Vue({
	el: 'api-fetcher',
	template: apiFetcherDialog,
	data: function(){
		return{
			display: false,
			data_attributes: {
				is_api: false,
				methods: "",
				api: "",
				path_string: "",
				query_string: "",
				body_string: "",
			},
		}
	},
	computed: {
		methods: function() {
			return this.data_attributes.methods.split(',')
		},
		path: function() {
			// split by curly brackets, push {label, input} to path
			let path=[]
			let pathParts = this.data_attributes.path_string.split(/{|}/).filter(x=>x!="")
			for (let i=0; i<pathParts.length; i += 2) {
				let label = pathParts[i]
				let input = pathParts[i+1]
				path.push({label, input})
			} 
			return path
		},
		query: function() {
			let query = []
			if (this.data_attributes.query_string) {
				// parse query params
				let requiredParams = this.data_attributes.query_string.split('&').filter(x=>x.endsWith('=')).map(x=>x.slice(0,-1))
				
				for (let [label_,input] of new URLSearchParams(this.data_attributes.query_string)) {
					let [label, type] = label_.split(':',2)
					query.push({
						label,
						type,
						input,
						required: requiredParams.includes(label)
					})
				}
			}
			return query
		},
		body: function() {
			let body = []
			if (this.data_attributes.body_string) {
				// parse body params
				let requiredParams = this.data_attributes.body_string.split('&').filter(x=>x.endsWith('=')).map(x=>x.slice(0,-1))
		
				for (let [label_,input] of new URLSearchParams(this.data_attributes.body_string)) {
					let [label, type] = label_.split(':',2)
					body.push({
						label,
						type,
						input,
						required: requiredParams.includes(label)
					})
				}
			}
			return body
		
		},
		apiResult: async function() {
			let res = await this.fetch(this.api.methods, this.url)
			
			let result = await res.json().catch(err=>res.text()).catch(err=>{
				downloadResult(res)
				return
			})
			if (!res) return
			window.apiResult = result
			console.table(result)
		},
	},
	methods: {
		async fetch() {
			// extract method from path form
			let pathForm = this.$el.querySelector("#path")
			let formData = new FormData(pathForm)
			let method = formData.get('selectedMethod')
			// extract path from path form
			formData.delete('selectedMethod')
			let path = ""
			for (let [label,input] of formData.entries()) {
				path += label+input
			}
			// extract query
			let query = new URLSearchParams(
				new FormData(
					this.$el.querySelector('#query')
				)
			).toString()
			// fetch data
			let res = await fetch(`${path}?${query}`, {
				method: method,
				headers: {
			    	'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: ['GET', 'HEAD'].includes(method)? undefined:new FormData(this.$el.querySelector('#body'))
			})
			console.log(res)
			return res
		},	
		async downloadResult(res) {
			// combine blob and <a> tag to download results
			let blob = await res.blob()
			let ext = blob.type.split('/').slice(-1)[0]
			let file = window.URL.createObjectURL(blob);
			let link = document.createElement("a");
			link.href = file;
			link.download = "apiResult."+ext;
			link.click();
			URL.revokeObjectURL(link.href)	
		},
		async fetchResult() {
			let res = await this.fetch()
			
			res = await res.json().catch(err=>res.text()).catch(err=>{
				downloadResult(res)
				return
			})
			if (!res) return

			console.table(res)

		},
		close() {
			this.display = false
		},
		open(data_attributes) {
			this.data_attributes = data_attributes
			this.display = true
		}
	}
})


export function parseFetcher(el, baseUrl=window.location.origin){
	const apiStarters = ['http', '/'] 
	const METHODS = ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'HEAD', 'OPTIONS']
	const content = el.textContent
	
	// extract methods
	const methodIndex = content.search(/ |[/]|http/)
	const methods = methodIndex==0 ? 'GET' : content.slice(0, methodIndex).toUpperCase()
	var api = content.slice(methodIndex).trim()

	const is_api = methods.split(',').every(method => METHODS.includes(method)) && apiStarters.some(starter => api.startsWith(starter))
	
	if (!is_api) return

	api = api.startsWith('http') ? api : baseUrl+api
	let [path_string, query_string, body_string] = api.split('?')
	
	// assign to el's data attributes
	const data_attributes = {is_api, methods, api, path_string, query_string, body_string} 
	for (let attr in data_attributes) {
		el.dataset[attr] = data_attributes[attr]
	} 

	el.style.border = "thin outset"

	el.addEventListener('click', () => {
		apiFetcher.open(el.dataset)
	})
	
}

