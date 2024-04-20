function renderOverview(){
	for(i1=0;i1<loans.length;i1++){
		document.getElementById(`loans`).innerHTML+=`<details name="counterparty"><summary>`+loans[i1].counterparty+`</summary><div id="`+loans[i1].counterparty+` Accounts" class="accounts"></div></summary>`
		for(i2=0;i2<loans[i1].accounts.length;i2++){
			document.getElementById(loans[i1].counterparty+` Accounts`).innerHTML+=`<details name="account"><summary>`+loans[i1].accounts[i2].title+`</summary><table id="`+loans[i1].counterparty+` `+loans[i1].accounts[i2].title+` Transfers" class="transfers"></table></details>`
			for(i3=0;i3<loans[i1].accounts[i2].transfers.length;i3++){
				var colour
				if((loans[i1].accounts[i2].transfers[i3][1]/Math.abs(loans[i1].accounts[i2].transfers[i3][1]))>0){
					colour=`green`
				}else{
					colour=`red`
				}
				document.getElementById(loans[i1].counterparty+` `+loans[i1].accounts[i2].title+` Transfers`).innerHTML+=`<tr><td>`+loans[i1].accounts[i2].transfers[i3][0].join(`-`)+`</td><td class="`+colour+`">`+(Math.round(loans[i1].accounts[i2].transfers[i3][1]*100)/100).toFixed(2)+`</td></tr>`
			}
		}
	}
}