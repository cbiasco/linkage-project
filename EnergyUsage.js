var shower = 0;
var hairdryer = 1;
var breakfast = 2;
var list = [];
for (var i = 0; i < 3; i++)
	list[i] = 0;

function change(type, name) {
	var inputs = document.getElementsByName(name);
	var output = 0;
	switch (type) {
		case "radio":
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].checked)
					output += equation(name, inputs[i].value);
			}
			break;
		case "box":
			output += equation(name, inputs[0].value);
			break;
		default:
			return;
	}
	
 	document.getElementById("T_" + name).innerHTML = output + " kWh/hr";
	updateTotal();
}

function equation(name, value) {
	switch (name) {
		case "shower":
			list[shower] = 1*value;
			return list[shower];
			break;
		case "hairdryer":
			list[hairdryer] = 15*value;
			return list[hairdryer];
			break;
		case "breakfast":
			list[breakfast] = 30*value;
			return list[breakfast];
			break;
		default:
			return 0;
	}
}

function updateTotal() {
	var sum = 0;
	for (var i = 0; i < list.length; i++)
		sum += list[i];
	document.getElementById("total").innerHTML = sum + " kWh/hr";
}

function reset() {
	var form = document.getElementById("activities");
	form.reset();
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		change(inputs[i].type, inputs[i].name);
	}
	document.getElementById("total").innerHTML = "0 kWh/hr";
}