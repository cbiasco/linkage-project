function calculateEnergy() {
	var inputs = document.getElementsByTagName("input");
	var total = 0;
	
	for (var i = 0; i < inputs.length; i++) {
		var name = inputs[i].name;
		switch (name) {
			case "shower":
				total += Number(inputs[i].value);
				break;
			case "hair-dryer":
				if (inputs[i].checked)
					total += Number(inputs[i].value)*20;
				break;
			case "breakfast":
				if (inputs[i].checked)
					total += Number(inputs[i].value)*30;
				break;
			default:;
		}
	}
	alert(total);
}