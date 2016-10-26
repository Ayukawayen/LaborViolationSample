var Dom = {
	createElement: function(tagName, attributes, childnodes) {
		let node = document.createElement(tagName);
		if(!(typeof(attributes) === 'undefined')) {
			for(let k in attributes) {
				node.setAttribute(k, attributes[k]);
			}
		}
		if(!(typeof(childnodes) === 'undefined')) {
			(childnodes instanceof Array ? childnodes : [childnodes]).forEach((item)=>{
				node.appendChild(item instanceof Element ? item : document.createTextNode(item.toString()));
			});
		}
		return node;
	},
};