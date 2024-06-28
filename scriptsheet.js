function calculateAdditionalInformation(){
	console.log(loans)
	var date1
	var date2
	var dayDiff
	for(i1=0;i1<loans.length;i1++){
		var accountsSum=0
		var accountsInterest=0
		for(i2=0;i2<loans[i1].accounts.length;i2++){
			var transfersSum=0
			var transfersInterest=0
			for(i3=0;i3<loans[i1].accounts[i2].transfers.length;i3++){
				if(loans[i1].accounts[i2].transfers[i3-1]){
					date1=new Date(loans[i1].accounts[i2].transfers[i3-1][0].join(`/`))
					date2=new Date(loans[i1].accounts[i2].transfers[i3][0].join(`/`))
					dayDiff=Math.round((date2.getTime()-date1.getTime())/(1000*3600*24))
					loans[i1].accounts[i2].transfers[i3].push(dayDiff)
					if(loans[i1].accounts[i2].interest){
						loans[i1].accounts[i2].transfers[i3].push(((loans[i1].accounts[i2].interest/365)*transfersSum)*dayDiff)
						transfersInterest=transfersInterest+loans[i1].accounts[i2].transfers[i3][3]
					}
				}
				transfersSum=transfersSum+loans[i1].accounts[i2].transfers[i3][1]
			}
			loans[i1].accounts[i2].transfersSum=transfersSum+transfersInterest
			accountsSum=accountsSum+transfersSum
			accountsInterest=accountsInterest+transfersInterest
		}
		loans[i1].accountsSum=accountsSum+accountsInterest
	}
	renderOverview()
}
var loans=[]
function renderOverview(){
	for(i1=0;i1<loans.length;i1++){
		var state=`open`
		var colour
		if(loans[i1].accountsSum==0){
			state=`closed`
			colour=`hidden`
		}else if(loans[i1].accountsSum>0){
			colour=`green`
		}else{
			colour=`red`
		}
		document.getElementById(`loans`).innerHTML+=`<details name="counterparty"><summary class="`+state+`">`+loans[i1].counterparty+` <span class="`+colour+`">`+loans[i1].accountsSum.toFixed(2)+`</span></summary><div id="`+loans[i1].counterparty+` Accounts" class="accounts"></div></summary>`
		for(i2=0;i2<loans[i1].accounts.length;i2++){
			if(loans[i1].accounts[i2].transfersSum==0){
				state=`closed`
				colour=`hidden`
			}else if(loans[i1].accounts[i2].transfersSum>0){
				colour=`green`
			}else{
				colour=`red`
			}
			if(loans[i1].accounts[i2].interest){
				document.getElementById(loans[i1].counterparty+` Accounts`).innerHTML+=`<details name="account"><summary class="`+state+`">`+loans[i1].accounts[i2].title+` <span class="`+colour+`">`+loans[i1].accounts[i2].transfersSum.toFixed(2)+`</span> at `+loans[i1].accounts[i2].interest*100+`% interest per year</summary><table class="`+state+`" id="`+loans[i1].counterparty+` `+loans[i1].accounts[i2].title+` Transfers" class="transfers"></table></details>`
			}else{
				document.getElementById(loans[i1].counterparty+` Accounts`).innerHTML+=`<details name="account"><summary class="`+state+`">`+loans[i1].accounts[i2].title+` <span class="`+colour+`">`+loans[i1].accounts[i2].transfersSum.toFixed(2)+`</span></summary><table class="`+state+`" id="`+loans[i1].counterparty+` `+loans[i1].accounts[i2].title+` Transfers" class="transfers"></table></details>`
			}
			for(i3=0;i3<loans[i1].accounts[i2].transfers.length;i3++){
				if(loans[i1].accounts[i2].transfers[i3][1]>0){
					colour=`green`
				}else{
					colour=`red`
				}
				var daysFormatted=``
				if(loans[i1].accounts[i2].transfers[i3][2]){
					daysFormatted=loans[i1].accounts[i2].transfers[i3][2]+` days`
				}
				document.getElementById(loans[i1].counterparty+` `+loans[i1].accounts[i2].title+` Transfers`).innerHTML+=`<tr><td>`+loans[i1].accounts[i2].transfers[i3][0].join(`-`)+`</td><td class="`+colour+` detail">`+loans[i1].accounts[i2].transfers[i3][1].toFixed(2)+`</td><td class="detail">`+daysFormatted+`</td></tr>`
			}
		}
	}
}
var loansMemory
function printMemory(){
	loansMemory=`loans\n`
	for(i1=0;i1<loans.length;i1++){
		// print counterparty and comment for outstanding balance
		loansMemory+=` \t`+String(loans[i1].accountsSum.toFixed(2)*-1).replace(/\B(?=(\d{3})+(?!\d))/g,`,`)+` outstanding`+`\nc\t`+loans[i1].counterparty+`\n`
		for(i2=0;i2<loans[i1].accounts.length;i2++){
			// print account and comment for outstanding balance
			loansMemory+=` \t\t`+String(loans[i1].accounts[i2].transfersSum.toFixed(2)*-1).replace(/\B(?=(\d{3})+(?!\d))/g,`,`)+` outstanding`+`\na\t\t`+loans[i1].accounts[i2].title+` | `+loans[i1].accounts[i2].interestRate+`\n`
			for(i3=0;i3<loans[i1].accounts[i2].transfers.length;i3++){
				if(loans[i1].accounts[i2].transfers[i3][2]){
					// print comment for days period between transfers
					loansMemory+=` \t\t\t`+loans[i1].accounts[i2].transfers[i3][2]+` days period\n`
				}
				// print transfer
				loansMemory+=`t\t\t\t`+loans[i1].accounts[i2].transfers[i3][0][0]+`-`+loans[i1].accounts[i2].transfers[i3][0][1]+`-`+loans[i1].accounts[i2].transfers[i3][0][2]+` | `+loans[i1].accounts[i2].transfers[i3][1]+`\n`
			}
		}
	}
}
function downloadMemory(){
	printMemory()
	var date=new Date()
	var filename=`financial memory (`+date.getUTCFullYear()+`-`+String(date.getUTCMonth()+1).padStart(2,`0`)+`-`+String(date.getUTCDate()).padStart(2,`0`)+`).txt`
	const dateParseGuide=`(yyyy-mm-dd)`.padStart(29).padStart(31,` \t`)
	var file=new File(
		// content
		[` \t`+filename+`\n`+dateParseGuide+`\n`+loansMemory],
		// filename
		filename,
		// filetype
		{type:`text/plain`}
	)
	const link=document.createElement('a')
	const url=URL.createObjectURL(file)
	link.href=url
	link.download=file.name
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	window.URL.revokeObjectURL(url)
}
function uploadMemory(that){
	loans=[]
	section=``
	var files=event.target.files
	var fileReader=new FileReader()
	fileReader.readAsText(files[0])
	fileReader.onload=function(e){
		var output=e.target.result
		lines=output.split(`\n`)
		for(i1=0;i1<lines.length;i1++){
			// test for comment
			if(lines[i1].startsWith(` `))continue
			// loans specific line tests
			if(section==`loans`){
				// parse counterparty
				if(lines[i1].startsWith(`c`))loans.push({counterparty:lines[i1].replace(`c\t`,``),accounts:[]})
				// parse account
				if(lines[i1].startsWith(`a`))loans[loans.length-1].accounts.push({title:lines[i1].replace(`a\t\t`,``).split(` | `)[0],transfers:[],interestRate:parseFloat(lines[i1].replace(`a\t\t`,``).split(` | `)[1])})
				// parse transfer
				if(lines[i1].startsWith(`t`))loans[loans.length-1].accounts[loans[loans.length-1].accounts.length-1].transfers.push([lines[i1].replace(`t\t\t\t`,``).split(` | `)[0].split(`-`).map(Number),parseFloat(lines[i1].replace(`t\t\t\t`,``).split(` | `)[1])])
			}
			// tests for section
			if(lines[i1].startsWith(`loans`))section=`loans`
		}
		calculateAdditionalInformation()
	}
}