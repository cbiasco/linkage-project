/*
 * Values obtained from:
 * http://www.siliconvalleypower.com/for-residents/save-energy/appliance-energy-use-chart
 * http://www.skidmore.edu/~jthomas/lifestyleproject/energyfacts.html
 */

var shower = 0;
var hairdryer = 1;
var coffee = 2;
var breakfast = 3;
var tv = 4;
var laptop = false;
var laptopTime = 5;
var desktop = false;
var desktopTime = 6;
var fridge = 7;
var washer = 8;
var washType = 2;
var list = [];
for (var i = 0; i < 9; i++)
	list[i] = 0;

function change(type, name) {
	var inputs = document.getElementsByName(name);
	var output = 0;
	switch (type) {
		case "radio":
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].checked)
					output += equation(name, Number(inputs[i].value));
			}
			break;
		case "text":
			if (!isNaN(inputs[0].value))
				output = equation(name, Number(inputs[0].value));
			else
				output = equation(name, 0);
			break;
		default:
			return;
	}
	var element = document.getElementById("T_" + name);
	if (element !== null && qualifies(name))
		element.innerHTML = rounded(output) + " kWh";
	else if (element !== null)
		element.innerHTML = "0 kWh";
	updateTotal();
}

function qualifies(name) {
	switch (name) {
		case "desktop":
			return desktop;
		case "laptop":
			return laptop;
		default:
			return true;
	}
}

function equation(name, value) {
	switch (name) {
		case "shower":
			list[shower] = rounded(0.6447564*value);
			return list[shower];
			
		case "hairdryer":
			list[hairdryer] = rounded(((1.5/60)*5)*value);
			return list[hairdryer];
			
		case "coffee":
			list[coffee] = rounded(.12*value);
			return list[coffee];
			
		case "breakfast":
			if (value == 0) // no appliances
				list[breakfast] = 0;
			else if (value == 1) // microwave
				list[breakfast] = .12;
			else if (value == 2) // toaster
				list[breakfast] = .04;
			else if (value == 3) // stovetop
				list[breakfast] = ((1.5/60)*10);
			else if (value == 4) // oven
				list[breakfast] = ((2.3/60)*15);
			list[breakfast] = rounded(list[breakfast]);
			return list[breakfast];
			
		case "fridge":
			list[fridge] = 1.5*value;
			return list[fridge];
			
		case "washer":
			if (value == 0)
				list[washer] = 0;
			else if (value == 1)
				list[washer] = rounded((1.15/7)*washType);
			else if (value == 2)
				list[washer] = rounded((1.15/7)*2*washType);
			else if (value == 3)
				list[washer] = rounded(1.15*washType);
			list[washer] += (value == 0) ? 0 : 3;
			return list[washer];
		case "washType":
			if (value == 0)
				washType = 1;
			else if (value == 1)
				washType = 2;
			else if (value = 2)
				washType = 5.5;
			change("radio", "washer");
			return list[washer];
			
		case "tv":
			list[tv] = rounded(.2*value);
			return list[tv];
			
		case "laptop":
			laptop = (value == 1) ? true : false;
			return list[laptopTime];
		case "laptopTime":
			list[laptopTime] = rounded(value*.04);
			change("radio", "laptop");
			return list[laptopTime];
			
		case "desktop":
			desktop = (value == 1) ? true : false;
			return list[desktopTime];
		case "desktopTime":
			list[desktopTime] = rounded(value*.12);
			change("radio", "desktop");
			return list[desktopTime];
			
		default:
			return 0;
	}
}

function updateTotal() {
	var sum = 0;
	for (var i = 0; i < list.length; i++) {
		if (i == laptopTime && laptop == false)
			continue;
		else if (i == desktopTime && desktop == false)
			continue;
		sum += list[i];
	}
	document.getElementById("total").innerHTML = rounded(sum) + " kWh";
}

function reset() {
	var form = document.getElementById("activities");
	form.reset();
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		change(inputs[i].type, inputs[i].name);
	}
	document.getElementById("total").innerHTML = "0 kWh";
}

function rounded(num) {
	return Math.round(100 * num)/100;
}