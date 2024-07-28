function uploadMemory(that){
	loans=[]
	section=``
	var files=event.target.files
	var fileReader=new FileReader()
	fileReader.readAsText(files[0])
	fileReader.onload=function(e){
		eval(e.target.result)
		calculateAdditionalInformation()
	}
}
function calculateAdditionalInformation(){
	for(i1=0;i1<loans.length;i1++){
		var accountsSum=0
		for(i2=0;i2<loans[i1].accounts.length;i2++){
			var transfersSum=0
			for(i3=0;i3<loans[i1].accounts[i2].transfers.length;i3++){
				loans[i1].accounts[i2].transfers[i3].date[1]=String(loans[i1].accounts[i2].transfers[i3].date[1]).padStart(2,`0`)
				loans[i1].accounts[i2].transfers[i3].date[2]=String(loans[i1].accounts[i2].transfers[i3].date[2]).padStart(2,`0`)
				var interest=0
				if(i3>0){
					loans[i1].accounts[i2].transfers[i3].period=Math.round((new Date(loans[i1].accounts[i2].transfers[i3].date.join(`/`))-new Date(loans[i1].accounts[i2].transfers[i3-1].date.join(`/`)))/86400000)
					if(loans[i1].accounts[i2].interestRate){
						interest=parseFloat((transfersSum*(loans[i1].accounts[i2].interestRate*(loans[i1].accounts[i2].transfers[i3].period/365))*-1).toFixed(2))
						loans[i1].accounts[i2].transfers[i3].interest=interest
					}
				}
				transfersSum+=loans[i1].accounts[i2].transfers[i3].transfer+(interest*-1)
			}
			loans[i1].accounts[i2].transfersSum=parseFloat(transfersSum.toFixed(2))
			accountsSum+=transfersSum
		}
		loans[i1].accountsSum=parseFloat(accountsSum.toFixed(2))
	}
	sortArrays()
}
function sortArrays(){
	loans=loans.sort(function(a,b){return a.accountsSum-b.accountsSum})
	for(i1=0;i1<loans.length;i1++){
		loans[i1].accounts=loans[i1].accounts.sort(function(a,b){return a.transfersSum-b.transfersSum})
	}
	renderMenu()
}
var loans=[]
function renderMenu(){
	document.getElementById(`content`).classList.remove(`hidden`)
	if(loans.length){
		renderLoans(``,0)
	}
}
function renderLoans(isOpen,stage,counterpartyIndex,accountIndex){
	var colour
	var contentQueue=``
	if(isOpen){
		stage--
	}
	if(!stage){
		for(i1=0;i1<loans.length;i1++){
			colour=loans[i1].accountsSum>=0?`green`:`red`
			contentQueue+=`
				<details onClick="renderLoans(this.open,1,${i1})" class="${colour}" name="counterparty">
					<summary>
						<span>${loans[i1].counterparty}</span>
					</summary>
					${loans[i1].accountsSum>0?`$${numberWithCommas(loans[i1].accountsSum.toFixed(2))}`:`${loans[i1].accountsSum<0?`-$${numberWithCommas(Math.abs(loans[i1].accountsSum.toFixed(2)))}`:`$0`}`} <span>outstanding</span>
				</details>`
		}
		document.getElementById(`loansCounterparties`).innerHTML=contentQueue
		document.getElementById(`loansAccounts`).innerHTML=``
		document.getElementById(`loansTransfers`).innerHTML=``
	}
	if(stage==1){
		for(i1=0;i1<loans[counterpartyIndex].accounts.length;i1++){
			colour=loans[counterpartyIndex].accounts[i1].transfersSum>=0?`green`:`red`
			contentQueue+=`
				<details onClick="renderLoans(this.open,2,${counterpartyIndex},${i1})" class="${colour}" name="account">
					<summary>
						<span>${loans[counterpartyIndex].accounts[i1].title}</span>
					</summary>
					${loans[counterpartyIndex].accounts[i1].transfersSum>0?`$${numberWithCommas(loans[counterpartyIndex].accounts[i1].transfersSum.toFixed(2))}`:`${loans[counterpartyIndex].accounts[i1].transfersSum<0?`-$${numberWithCommas(Math.abs(loans[counterpartyIndex].accounts[i1].transfersSum.toFixed(2)))}`:`$0`}`} <span>outstanding</span>
					${loans[counterpartyIndex].accounts[i1].interestRate?`<br>${loans[counterpartyIndex].accounts[i1].interestRate*100}% <span>interest per annum</span>`:``}
				</details>`
		}
		document.getElementById(`loansAccounts`).innerHTML=contentQueue
		document.getElementById(`loansTransfers`).innerHTML=``
	}else if(stage==2){
		for(i1=0;i1<loans[counterpartyIndex].accounts[accountIndex].transfers.length;i1++){
			colour=loans[counterpartyIndex].accounts[accountIndex].transfers[i1].transfer>=0?`green`:`red`
			contentQueue+=`
				<details class="${colour}">
					<summary>
						<span>${loans[counterpartyIndex].accounts[accountIndex].transfers[i1].date.join(`-`)}</span>
					</summary>
					${loans[counterpartyIndex].accounts[accountIndex].transfers[i1].transfer.toFixed(2)>0?`+$${numberWithCommas(loans[counterpartyIndex].accounts[accountIndex].transfers[i1].transfer.toFixed(2))}`:`-$${numberWithCommas(Math.abs(loans[counterpartyIndex].accounts[accountIndex].transfers[i1].transfer).toFixed(2))}`}
					${loans[counterpartyIndex].accounts[accountIndex].transfers[i1].period?`<br><span>${loans[counterpartyIndex].accounts[accountIndex].transfers[i1].period} days from last transfer</span>`:``}
					${loans[counterpartyIndex].accounts[accountIndex].interestRate?`<br><span>${loans[counterpartyIndex].accounts[accountIndex].transfers[i1].interest?numberWithCommas(loans[counterpartyIndex].accounts[accountIndex].transfers[i1].interest.toFixed(2)):``}</span>`:``}
				</details>`
		}
		document.getElementById(`loansTransfers`).innerHTML=contentQueue
	}
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,`,`);
}
function downloadMemory() {
    const arrayedDate=new Date().toISOString().replaceAll(`T`,`-`).replaceAll(`:`,`-`).split(`.`)[0].split(`-`)
    const filename=`financials(${arrayedDate[0]}y_${arrayedDate[1]}mo_${arrayedDate[2]}d_${arrayedDate[3]}h_${arrayedDate[4]}mi_${arrayedDate[5]}s).js`
    const content=`loans=${JSON.stringify(loans,null,`\t`)}\n`
    const file=new Blob([content],{type:`text/plain`})
    const link=document.createElement(`a`)
    link.href=URL.createObjectURL(file)
    link.download=filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
}
