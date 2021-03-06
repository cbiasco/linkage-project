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
var tempAC = true;
var tempMult = 0;
var temp = 9;
var light = 10;
var lightNum = 0;
var lightType = .08;
var lightTime = 0;
var list = [];
for (var i = 0; i < 11; i++)
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
		element.innerHTML = rounded(output);
	else if (element !== null)
		element.innerHTML = 0;
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
			list[shower] = 0.6447564*value;
			return list[shower];
			
		case "hairdryer":
			list[hairdryer] = ((1.5/60)*5)*value;
			return list[hairdryer];
			
		case "coffee":
			list[coffee] = .12*value;
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
			list[breakfast] = list[breakfast];
			return list[breakfast];
			
		case "fridge":
			list[fridge] = 1.5*value;
			return list[fridge];
			
		case "temp":
			tempAC = (value == 1) ? true : false;
			if (tempAC)
				change("radio", "AC");
			else
				change("radio", "heating");
			change("text", "tempControl");
			return list[temp];
		case "AC":
			if (!tempAC)
				return list[temp];
			if (value == 0)
				tempMult = 0;
			else if (value == 1)
				tempMult = .03;
			else if (value == 2)
				tempMult = 1;
			else if (value == 3)
				tempMult = 3;
			change("text", "tempControl");
			return list[temp];
		case "heating":
			if (tempAC)
				return list[temp];
			if (value == 0)
				tempMult = 0;
			else if (value == 1)
				tempMult = 1.5;
			else if (value == 2)
				tempMult = 2.93;
			else if (value == 3)
				tempMult = 10.5;
			change("text", "tempControl");
			return list[temp];
		case "tempControl":
			list[temp] = tempMult*value;
			return list[temp];
			
		case "washer":
			if (value == 0)
				list[washer] = 0;
			else if (value == 1)
				list[washer] = (1.15/7)*washType;
			else if (value == 2)
				list[washer] = (1.15/7)*2*washType;
			else if (value == 3)
				list[washer] = 1.15*washType;
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
			
		case "light":
			if (value == 0)
				lightType = .08;
			else if (value == 1)
				lightType = .02;
			else if (value == 2)
				lightType = .3;
			list[light] = lightNum*lightType*lightTime;
			return list[light];
		case "lightNum":
			lightNum = value;
			change("radio", "light");
			return list[light];
		case "lightTime":
			lightTime = value;
			change("radio", "light");
			return list[light];
			
		case "tv":
			list[tv] = .2*value;
			return list[tv];
			
		case "laptop":
			laptop = (value == 1) ? true : false;
			return list[laptopTime];
		case "laptopTime":
			list[laptopTime] = value*.04;
			change("radio", "laptop");
			return list[laptopTime];
			
		case "desktop":
			desktop = (value == 1) ? true : false;
			return list[desktopTime];
		case "desktopTime":
			list[desktopTime] = value*.12;
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
	document.getElementById("total").innerHTML = rounded(sum);
	document.getElementById("CO2").innerHTML = rounded(sum*1.29);
}


function reset() {
	var form = document.getElementById("activities");
	form.reset();
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		change(inputs[i].type, inputs[i].name);
	}
	document.getElementById("total").innerHTML = 0;
	document.getElementById("CO2").innerHTML = 0;
}

function rounded(num) {
	return Math.round(100 * num)/100;
}