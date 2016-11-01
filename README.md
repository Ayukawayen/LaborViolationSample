# 違反勞動法令事業單位試算表使用說明

## 背景

之前[求職小幫手](https://jobhelper.g0v.ronny.tw/)使用人工方式整理違反勞基法的名單，但人工整理很花時間，已有一段時間沒有更新資料(寫這篇文章時(2016/10/26)已近五個月未更新)。

於是寫了一支程式自動擷取解析主管機關公告網頁上的資料。
雖然處理xls(x)和pdf檔有困難，但至少可以處理HTML格式。
當然解析品質沒有人工處理的好，不過聊勝於無。

目前程式自動擷取解析的網頁如下：
[臺北市](http://bola.gov.taipei/ct.asp?xItem=94627869&ctNode=76327&mp=116003)、
[桃園市](http://lhrb.tycg.gov.tw/home.jsp?id=373&mcustomize=onemessages_view.jsp&dataserno=201509090001)、
[臺中市](http://www.labor.taichung.gov.tw/ct.asp?xItem=55333&ctNode=23053&mp=117010)、
[臺南市](http://www.tainan.gov.tw/labor/page.asp?nsub=M2A400)、
[高雄市](http://labor.kcg.gov.tw/IllegalList.aspx?appname=IllegalList)、
[彰化縣](http://labor.chcg.gov.tw/07other/other01_con.asp?topsn=3197&data_id=14138)、
[宜蘭縣](http://labor.e-land.gov.tw/cp.aspx?n=A727524B27DA3181)、
[澎湖縣](http://www.penghu.gov.tw/society/home.jsp?contlink=content/20130222113242.jsp)、
[中科園區](http://www.ctsp.gov.tw/chinese/01news/10statistics_view.aspx?v=1&fr=529&sn=1198)。

解析後的資料儲存於Google試算表。

----------------------------------------------

## Google試算表

+ **試算表連結**: <https://docs.google.com/spreadsheets/d/1uLR9eFePzLzlnkO1k1yh2-2_TJCOYGGEatGCQOgpz9M>

+ **試算表ID**: `1uLR9eFePzLzlnkO1k1yh2-2_TJCOYGGEatGCQOgpz9M`

### 工作表資料結構

+ **索引工作表**: 記載各資料集的狀態。首列為標題列。
  + 欄A: 工作表名稱。工作表的名稱及對應網頁之網址。
  + 欄B: 工作表內容說明。
  + 欄C: 主管機關。
  + 欄D: 上次變更時間。ISO 8601格式。上一次工作表內容有所變動的時間。
  + 欄E: 上次檢查時間。ISO 8601格式。系統上一次檢查網頁的時間。
  + 欄F: ETag0。*僅供系統內部使用*
  + 欄G: ETag。*僅供系統內部使用*
  
+ **各資料集工作表**: 記載單一資料集內的違法資料列表。
  + 欄A: 事業單位名稱。
  + 欄B: 違反法令條款。
  + 欄C: 違反法規內容。
  + 欄D: 處分書文號。
  + 欄E: 處分日期。YYYY/MM/DD格式。
  + 欄F: 處分書ID。*僅供系統內部使用*


### 試算表資料內容讀取方法

試算表設定為所有人均可檢視，所以只要提供任何一個Google帳戶的OAuth Token或APIKey便可透過Google Sheets API讀取。
 
Google Sheets API說明文件:
+ Sample of Basic Reading: <https://developers.google.com/sheets/samples/reading>
+ REST API Reference: <https://developers.google.com/sheets/reference/rest/>

----------------------------------------------

## 範例程式碼

Chrome/Firefox Extension *(Javascript)*

在 104.com.tw 網頁上的公司連結顯示違法記錄數量及內容。

#### background.js

#### content.js
