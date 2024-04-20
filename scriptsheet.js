function renderOverview(){
	for(i1=0;i1<loans.length;i1++){
		var accountsSum=0
		var transfersSum=0
		var colour
		for(i2=0;i2<loans[i1].accounts.length;i2++){
			transfersSum=0
			for(i3=0;i3<loans[i1].accounts[i2].transfers.length;i3++){
				transfersSum=transfersSum+loans[i1].accounts[i2].transfers[i3][1]
			}
			accountsSum=accountsSum+transfersSum
		}
		if(accountsSum>=0){
			colour=`green`
		}else{
			colour=`red`
		}
		document.getElementById(`loans`).innerHTML+=`<details name="counterparty"><summary>`+loans[i1].counterparty+` <span class="`+colour+`">`+accountsSum.toFixed(2)+`</span></summary><div id="`+loans[i1].counterparty+` Accounts" class="accounts"></div></summary>`
		for(i2=0;i2<loans[i1].accounts.length;i2++){
			transfersSum=0
			for(i3=0;i3<loans[i1].accounts[i2].transfers.length;i3++){
				transfersSum=transfersSum+loans[i1].accounts[i2].transfers[i3][1]
			}
			if(transfersSum>=0){
				colour=`green`
			}else{
				colour=`red`
			}
			document.getElementById(loans[i1].counterparty+` Accounts`).innerHTML+=`<details name="account"><summary>`+loans[i1].accounts[i2].title+` <span class="`+colour+`">`+transfersSum.toFixed(2)+`</span></summary><table id="`+loans[i1].counterparty+` `+loans[i1].accounts[i2].title+` Transfers" class="transfers"></table></details>`
			for(i3=0;i3<loans[i1].accounts[i2].transfers.length;i3++){
				if((loans[i1].accounts[i2].transfers[i3][1]/Math.abs(loans[i1].accounts[i2].transfers[i3][1]))>=0){
					colour=`green`
				}else{
					colour=`red`
				}
				document.getElementById(loans[i1].counterparty+` `+loans[i1].accounts[i2].title+` Transfers`).innerHTML+=`<tr><td>`+loans[i1].accounts[i2].transfers[i3][0].join(`-`)+`</td><td class="`+colour+`">`+loans[i1].accounts[i2].transfers[i3][1].toFixed(2)+`</td></tr>`
			}
		}
	}
}