
export {Vue, apiClass, apiFetcher}

import Vue from 'https://unpkg.com/vue@2.6.0/dist/vue.esm.browser.min.js';


const apiClass = 'api'

//export const vm = new Vue({
//	el: '#api-fetcher',

const template = `
<div id="api-fetcher" v-if="display">
<h1>API Fetcher</h1>
<form id="path">
	<select name="selectedMethod">
		<option v-for="method,i in methods" v-bind:selected="i===0">{{method}} </option>
	</select>
	<label v-for="item in path">
		{{item.label}}
		<input 
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
</div>

`


const apiFetcher = Vue.extend({
	template: template,
	data: function(){
		return{
			METHODS: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'HEAD', 'OPTIONS'],
			display: false,
			api: "",
			methods: [],
			pathString: "",
			queryString: "",
			bodyString: "",
		}
	},
	computed: {
		baseUrl: function() {
			return window.baseUrl || window.location.origin
		},
		path: function() {
			// add baseUrl to pathString if needed, split by curly brackets, push {label, input} to path
			let path=[]
			let pathParts = this.pathString.split(/{|}/).filter(x=>x!="")
			for (let i=0; i<pathParts.length; i += 2) {
				let label = pathParts[i]
				let input = pathParts[i+1]
				path.push({label, input})
			} 
			return path
		},
		query: function() {
			let query = []
			if (this.queryString) {
				// parse query params
				let requiredParams = this.queryString.split('&').filter(x=>x.endsWith('=')).map(x=>x.slice(0,-1))
				
				for (let [label_,input] of new URLSearchParams(this.queryString)) {
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
			if (this.bodyString) {
				// parse body params
				let requiredParams = this.bodyString.split('&').filter(x=>x.endsWith('=')).map(x=>x.slice(0,-1))
		
				for (let [label_,input] of new URLSearchParams(this.bodyString)) {
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
			let res = await this.fetch(this.methods, this.url)
			
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
		setupAPI(el){
			// find API calls, and assign .trigger class
			const content = el.textContent
			const methodIndex = content.search(/ |[/]|http/)
			var methods, api;
			// extract methods
			if (methodIndex==0) {//method not found
				methods = 'GET'
			} else {
				methods = content.slice(0, methodIndex).toUpperCase().replace(/\s/g, '').split(',')
				if (! (methods.every(method => this.METHODS.includes(method)))) {
					//console.log('this is not an API call', content)
					return
				}
			}
			// if starts with http or /, it is an api call, assign method and url attributes
			api = content.slice(methodIndex).trim()
			if (api.startsWith('/')) {
				api = this.baseUrl+api
			} else if (!api.startsWith('http')) {
				return
			}

			// config api parameters
			el.classList.add(apiClass)
			el.addEventListener('click', ()=>{
				this.api = api
				this.methods = methods

				let [pathString, queryString, bodyString] = api.split('?')
				this.pathString = pathString.startsWith('http')? pathString : this.baseUrl + pathString 
				this.queryString = queryString
				this.bodyString = bodyString
				this.display = true
			})
		},
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
	}
})
