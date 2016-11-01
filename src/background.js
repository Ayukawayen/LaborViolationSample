'use strict';

const apiKey = 'YOUR_API_KEY';

const apiUri = 'https://sheets.googleapis.com/v4/spreadsheets';
const ssId = '1uLR9eFePzLzlnkO1k1yh2-2_TJCOYGGEatGCQOgpz9M';

var isRefreshed = false;
var cpRecords = {};

refresh();

function refresh() {
	let range = "'索引'!A2:E";
	
	let uri = `${apiUri}/${ssId}/values/${range}?key=${apiKey}`;
	
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(this.readyState !== 4) {
			return;
		}
		if(this.status !== 200) {
			return;
		}
		
		let result = JSON.parse(this.responseText);
		let sheetInfos = result.values.map((item) => {
			return {
				name:item[0],
				desc:item[1]||'',
				authority:item[2]||'',
				lastModified:new Date(item[3]||0),
				lastCheck:new Date(item[4]||0),
			}
		});

		onSheetInfosGetted(sheetInfos);
	};
	xhr.open('get', uri);
	xhr.send('');
}

function onSheetInfosGetted(sheetInfos) {
	let uri = `${apiUri}/${ssId}/values:batchGet?key=${apiKey}` + sheetInfos.reduce((result, item)=>{
		return result + `&ranges='${item.name}'!A2:E`;
	}, '');
	
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(this.readyState !== 4) {
			return;
		}
		if(this.status !== 200) {
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
		/**
		example of cpRecords
		{
			"臺中市政府民政局":[
				{
					"工作表":"臺中市",
					"條款":"勞動基準法第32條第2項",
					"內容":"延長勞工工時超過法令規定",
					"文號":"府授勞動字第1050146620號",
					"日期":"2016/07/19"
				},
				...
			],
			"家福股份有限公司":[
				...
			],
			...
		}
		**/
				
		for(let cpName in cpRecords) {
			cpRecords[cpName].sort((a,b) => ((a.日期==b.日期) ? (a.條款>b.條款 ? 1 : -1) : (a.日期>b.日期 ? -1 : 1)));
		}

		isRefreshed = true;
	};
	xhr.open('get', uri);
	xhr.send('');
}

chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		if(request.getCompanyRecords) {
			if(!isRefreshed) {
				sendResponse(null);
				return;
			}
			sendResponse(getCompanyRecords(request.getCompanyRecords));
		}
	}
);

function getCompanyRecords(args) {
	/**
	example of args
	{
		companyNames:[
			"家福股份有限公司",
			"全家福股份有限公司",
			"幸福家生技股份有限公司"
		]
	}
	**/
	let result = {};
	args.companyNames.forEach((cpName)=>{
		result[cpName] = {};
		
		for(let k in cpRecords) {
			if(!isCompanyNameMatch(k, cpName)) continue;
			
			result[cpName][k] = cpRecords[k];
		}
	});
	
	/**
	example of response
	{
		"家福股份有限公司":{
			"家福股份有限公司":[
				{
					"工作表":"宜蘭縣",
					"條款":"勞動基準法第49條",
					"內容":"使女工從事夜間工作不符法定要件",
					"文號":"府勞資字第1050025692號",
					"日期":"2016/08/22"
				},
				...
			],
			"家福股份有限公司 (貝賀名Rami Baitieh)":[
				...
			]
		},
		"全家福股份有限公司":{
			...
		},
		"幸福家生技股份有限公司":{
			...
		}

	}
	**/
	return result;
}


function isCompanyNameMatch(a, b) {
	a = a.replace(/\s+/g, '');
	b = b.replace(/\s+/g, '');
	
	if(a.length <= 0 || b.length <= 0) return false;
	
	if(a.indexOf(b) >= 0) return true;
	if(b.indexOf(a) >= 0) return true;
	
	return false;
}