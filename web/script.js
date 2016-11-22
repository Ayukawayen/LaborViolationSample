'use strict';

document.querySelector('#searchBar .query').addEventListener('input', (ev)=>{
	search(document.querySelector('#searchBar .query').value);
});
document.querySelector('#searchBar .clear').addEventListener('click', (ev)=>{
	document.querySelector('#searchBar .query').value = '';
	search('');
	document.querySelector('#searchBar .query').focus();
});
document.querySelector('#searchBar .query').focus();


function search(name) {
	if(!name) {
		putSearchResult(null);
		return;
	}
	
	let result = getCompanyRecords(name);
	
	if(!result) {
		setTimeout(search, 500, name);
		return;
	}
	
	putSearchResult(result);
};

function putSearchResult(cpRecords) {
	let oldNode = document.querySelector('#searchResult');
	if(oldNode) {
		oldNode.parentNode.removeChild(oldNode);
	}
	
	if(!cpRecords) return;
	
	let cntCompany = cpRecords.length;
	let cntRecord = cpRecords.reduce((result,item)=>(result+item.records.length), 0);
	
	document.body.insertBefore(Dom.createElement('div', {'id':'searchResult'}, [
		Dom.createElement('header', {}, [
			Dom.createElement('span', {'class':'summary'}, `共 ${cntCompany}家${cntRecord}項 搜尋結果`),
			Dom.createElement('a', {'class':'close'}, [
				Dom.createElement('span', {}, '全收合'),
			]),
			Dom.createElement('a', {'class':'open'}, [
				Dom.createElement('span', {}, '全展開'),
			]),
		]),
		Dom.createElement('ul', {'class':'resultList'}, cpRecords.map((cpRecord)=>{
			let node = Dom.createElement('li', {}, [
				Dom.createElement('header', {}, [
					Dom.createElement('a', {'class':'hide', title:'從結果中移除'}, '✕'),
					Dom.createElement('h3', {}, `${cpRecord.name} (${cpRecord.records.length})`),
				]),
				Dom.createElement('ul', {'class':'recordList'}, cpRecord.records.map((record)=>(
					Dom.createElement('li', {}, [
						Dom.createElement('span', {'class':'條款'}, record.條款),
						Dom.createElement('span', {'class':'內容'}, record.內容),
						Dom.createElement('span', {'class':'主管'}, record.工作表),
						Dom.createElement('span', {'class':'文號'}, record.文號),
						Dom.createElement('span', {'class':'日期'}, record.日期),
					])
				))),
			]);
			
			node.querySelector('.hide').addEventListener('click', onCompanyHideClick.bind(node));
			node.querySelector('h3').addEventListener('click', onCompanyTitleClick.bind(node));
			
			return node;
		})),
	]), document.querySelector('#searchBar').nextSibling);
	
	document.querySelector('#searchResult >header .open').addEventListener('click', ()=>{
		document.querySelectorAll('.resultList >li').forEach((cpNode)=>{
			cpNode.classList.add('opened');
		});
	});
	document.querySelector('#searchResult >header .close').addEventListener('click', ()=>{
		document.querySelectorAll('.resultList >li').forEach((cpNode)=>{
			cpNode.classList.remove('opened');
		});
	});
};


function onCompanyHideClick() {
	this.classList.add('hidden');
}
function onCompanyTitleClick() {
	if(this.classList.contains('opened')) {
		this.classList.remove('opened');
	}
	else {
		this.classList.add('opened');
	}
}
