'use strict';

let nodes = Array.prototype.filter.call(document.querySelectorAll('a'), (item)=>{
	if(item.textContent == '') return false;
	if(item.textContent == '找公司') return false;
	if(item.href.indexOf('#') >= 0) return false;
	if(item.href.indexOf('/jobbank/custjob/index.php?') >= 0) return true;
	if(item.href.indexOf('/cust_job/introduce.cfm?') >= 0) return true;
	
	return false;
});

let cpNames = nodes
	.map((item) => item.textContent)
	.filter((item,i,a) => i==a.indexOf(item))
;

chrome.runtime.sendMessage(
	{getCompanyRecords:{
		companyNames:cpNames,
	}},
	(result) => {
		/**
		example of result
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
		if(result === null) {
			return;
		}
		
		nodes.forEach((node)=>{
			if(node.querySelector('.netAyukawayenLabor_icon')) return;
			
			let cpRecord = result[node.textContent];
			
			let count = 0;
			let title = '';
			
			for(let k in cpRecord) {
				count += cpRecord[k].length;
				title += k+'\n' + cpRecord[k].reduce((result, item) => (result + '  '+item.條款+'：'+item.內容+' ('+item.日期+')\n'), '');
			}

			let iconNode = Dom.createElement('span', {
				'class':`netAyukawayenLabor_icon v_${count}`,
				'title': title||'未發現違反勞基法記錄',
			}, count);
			
			node.appendChild(iconNode);
		});
	}
);
