'use strict';

const apiKey = 'AIzaSyBWqRdg-282o5dypBBI0qqz8I1MOT5HiZg';

const apiUri = 'https://sheets.googleapis.com/v4/spreadsheets';
const ssId = '1uLR9eFePzLzlnkO1k1yh2-2_TJCOYGGEatGCQOgpz9M';

var isRefreshed = false;
var cpRecords = {};

refresh();

function refresh() {
	let range = "'索引'!A2:D";
	
	let uri = `${apiUri}/${ssId}/values/${range}?key=${apiKey}`;
	
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(this.readyState !== 4) {
			return;
		}
		if(this.status < 200 || this.status >= 400) {
			document.querySelector('#status').textContent = '發生錯誤，請稍後重試。';
			document.querySelector('#status').className = 'error';
			return;
		}
		
		let result = JSON.parse(this.responseText);
		let sheetInfos = result.values.map((item) => {
			return {
				name:item[0],
				desc:item[1]||'',
				lastModified:new Date(item[2]||0),
				lastCheck:new Date(item[3]||0),
			}
		});

		onSheetInfosGetted(sheetInfos);
	};
	xhr.open('get', uri);
	xhr.send('');
}

function onSheetInfosGetted(sheetInfos) {
	let uri = `${apiUri}/${ssId}/values:batchGet?key=${apiKey}` + sheetInfos.reduce((result, item)=>{
		return result + `&ranges='${item.name}'!A1:E`;
	}, '');
	
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(this.readyState !== 4) {
			return;
		}
		if(this.status < 200 || this.status >= 400) {
			document.querySelector('#status').textContent = '發生錯誤，請稍後重試。';
			document.querySelector('#status').className = 'error';
			return;
		}
		
		let result = JSON.parse(this.responseText);

		let regex = /^'(.+)'!/;
		
		cpRecords = {};
		result.valueRanges.forEach((valueRange)=>{
			let 工作表 = regex.exec(valueRange.range)[1];

			valueRange.values.forEach((item)=>{
				cpRecords[item[0]] = cpRecords[item[0]] || [];
				cpRecords[item[0]].push({
					工作表:工作表,
					條款:item[1],
					內容:item[2],
					文號:item[3],
					日期:item[4],
				});
			});
		});
				
		for(let cpName in cpRecords) {
			cpRecords[cpName].sort((a,b) => ((a.日期==b.日期) ? (a.條款>b.條款 ? 1 : -1) : (a.日期>b.日期 ? -1 : 1)));
		}

		isRefreshed = true;
		document.querySelector('#status').textContent = '';
		document.querySelector('#status').className = 'refreshed';
	};
	xhr.open('get', uri);
	xhr.send('');
}

function getCompanyRecords(name) {
	if(!isRefreshed) return null;
	
	let result = [];
	for(let k in cpRecords) {
		if(!isCompanyNameMatch(k, name)) continue;
		
		result.push({
			name:k,
			records:cpRecords[k],
		});
	}
	
	result.sort((a,b)=>{return a.name>b.name ? 1 : -1});

	return result;
}


function isCompanyNameMatch(a, b) {
	a = a.toLowerCase().replace(/\s+/g, '');
	b = b.toLowerCase().replace(/\s+/g, '');
	
	if(a.length <= 0 || b.length <= 0) return false;
	
	if(a.indexOf(b) >= 0) return true;
	if(b.indexOf(a) >= 0) return true;
	
	return false;
}