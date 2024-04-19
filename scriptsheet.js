function renderOverview(){
	for(i1=0;i1<loans.length;i1++){
		document.getElementById(`main`).innerHTML+=loans[i1].counterparty+`<br><div id="`+loans[i1].counterparty+` Accounts" class="accounts"></div>`
		for(i2=0;i2<loans[i1].accounts.length;i2++){
			document.getElementById(loans[i1].counterparty+` Accounts`).innerHTML+=loans[i1].accounts[i2].title+`<br><div id="`+loans[i1].counterparty+` `+loans[i1].accounts[i2].title+` Transfers" class="transfers"></div>`
			for(i3=0;i3<loans[i1].accounts[i2].transfers.length;i3++){
				document.getElementById(loans[i1].counterparty+` `+loans[i1].accounts[i2].title+` Transfers`).innerHTML+=loans[i1].accounts[i2].transfers[i3][0].join(`-`)+` | `+loans[i1].accounts[i2].transfers[i3][1]+`<br>`
			}
		}
	}
}