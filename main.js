let enemy = document.getElementsByClassName('enemy');
let enemy_fight = document.getElementsByClassName('enemy_fight');
let locationLand = prompt("На какую локацию хотите отправиться? " + getLocations());
let oldLevel;
let modalObj = Object.create(Modal);


// МАССИВ УРОВНЕЙ

let levelArr = [0, 10, 100, 250, 500, 1000, 2500, 5000, 10000];

function getLocations() {
	let enemysLocation = getEnemys().split(',');
	let locations = "";

	for(let i = 0; i < enemysLocation.length; i++) {
		if (i == enemysLocation.length - 1) locations += enemysLocation[i].split('=')[0] + '.';
		else locations += enemysLocation[i].split('=')[0] + ', ';
	}

	return locations;
}

function checkLocation(locationName) {
	let enemysLocation = getEnemys().split(',');

	for(let i = 0; i < enemysLocation.length; i++) {
		if(enemysLocation[i].split('=')[0] == locationName) return true;
	}

	return false;
}

//получить текущего героя: конструктор игры (получаем либо создаем нового)
function getCurrentHero(name) {
	let heroes = localStorage.getItem('heroes');

	if (heroes === null){
		localStorage.setItem('heroes', name);
		localStorage.setItem('levels', name+'=0');
		localStorage.setItem('exp', name+'=0');
		localStorage.setItem('money', name+'=10000');
		localStorage.setItem('army', name+'=10000');
	}
	else {
		heroesArr = heroes.split(',');
		let newHero = true;
		for (let i = 0; i < heroesArr.length; i++) {
			if (name == heroesArr[i]) newHero = false;
		}
		if (newHero){
			let levels = localStorage.getItem('levels');
			let exp = localStorage.getItem('exp');
			let money = localStorage.getItem('money');
			let army = localStorage.getItem('army');
			localStorage.setItem('heroes', heroes + ',' + name);
			localStorage.setItem('levels', levels + ',' + name+'=0');
			localStorage.setItem('exp', exp + ',' + name+'=0');
			localStorage.setItem('army', army + ',' + name+'=10000');
			localStorage.setItem('money', money + ',' + name+'=10000');
		}
	}

	return {"name": name, "level": parseInt(getHeroInfoData(name, 'levels')), "exp": parseInt(getHeroInfoData(name, 'exp')), "army": parseInt(getHeroInfoData(name, 'army')), "money": parseInt(getHeroInfoData(name, 'money')),};
}

//получить иноформацию о герое по ключу
function getHeroInfoData(heroName, keyName) {
	console.log(keyName);
	let dataSetInfo = localStorage.getItem(keyName).split(',');
	for (let i = 0; i < dataSetInfo.length; i++) {
		let dataSetInfoItem = dataSetInfo[i].split('=');
		if(dataSetInfoItem[0] == heroName){
			console.log(dataSetInfoItem[1]);
			return dataSetInfoItem[1];
		}
	}
}

//получить разницу в опытах героя для отображения прогресс бара
function getHeroDifferenceExpForProgress(hero) {
	let exp = hero.exp;
	let minMaxArr = [];
	for (let i = 0; i < levelArr.length; i++) {
		if (exp >= levelArr[i]) {
			minMaxArr[0] = levelArr[i];
			minMaxArr[1] = levelArr[i+1];
		}
	}
	return minMaxArr;
}

function getAllHeroes() {

}

function getAllHeroesWithData(key = null) {
	if (key === null) return localStorage.getItem('heroes').split(',');
	return localStorage.getItem(key).split(',');
}

function setProgressExpValue(exp) {
	level.value = level.value + exp;
}

function setProgressSizeMinMax(hero) {
	let minMaxArr = getHeroDifferenceExpForProgress(hero);
	level.max = minMaxArr[1]-minMaxArr[0];
	level.value = hero.exp - minMaxArr[0];
}
 
//в setTextLevelValue setTextExpValue setTextArmyValue не объявленные переменные означают 
//DOM элементы, где название переменной соответствует id атрибуту у тега html
function setTextLevelValue(level) {
	let heroLevelArr = hero_level.textContent.split('№');
	heroLevelArr[1] = level;
	hero_level.textContent = heroLevelArr.join('№');
}

function setTextExpValue(exp) {
	let heroExpArr = hero_exp.textContent.split(' ');
	heroExpArr[1] = exp;
	hero_exp.textContent = heroExpArr.join(' ');
}

function setTextArmyValue(army) {
	let heroExpArr = hero_army.textContent.split(' ');
	heroExpArr[1] = army;
	hero_army.textContent = heroExpArr.join(' ');
}

function setTextMoneyValue(money) {
	let heroMoneyArr = hero_money.textContent.split(' ');
	heroMoneyArr[1] = money;
	hero_money.textContent = heroMoneyArr.join(' ');
}

function setTextToLevelValue(exp, level) {
	let heroToLevelArr = to_next_level.textContent.split(':');
	heroToLevelArr[heroToLevelArr.length - 1] = ' ' + levelArr[level+1] - exp;
	to_next_level.textContent = heroToLevelArr.join(':');
}

function setTextRankValue() {
	let heroes = getAllHeroesWithData('exp');
	let heroesArr = [];
	let hero_rank = document.getElementsByClassName('hero_rank');

	for (let i = 0; i < heroes.length; i++) {
		let item = heroes[i].split('=');
		heroesArr.push({name: item[0], exp: item[1]});
	}

	heroesArr.sort(function (a, b) {
		return b.exp - a.exp;
	});

	let countRank = hero_rank.length;
	if (heroesArr.length < countRank) countRank = heroesArr.length;

	for (let i = 0; i < countRank; i++) {
		hero_rank[i].textContent = heroesArr[i].name + ' - ' + heroesArr[i].exp + ' опыта;';
	}
}

function setTextEnemysValue(locationName) {
	let locationEnemys = getEnemys(locationName);
	let valuesArr = locationEnemys.split('=')[1].split('.');
	
	let enemy = document.getElementsByClassName('enemy');

	for(let i = 0; i < enemy.length; i++) {
		enemy[i].innerText = "Враг №" + valuesArr[i].split(':')[0];
		enemy[i].dataset.id = valuesArr[i].split(':')[0];
		enemy[i].dataset.army = valuesArr[i].split(':')[1];
	}
}

function setExp(value, hero) {
	hero.exp += value;
	for (var i = 0; i < levelArr.length; i++) {
		if (hero.exp >= levelArr[i] && hero.exp < levelArr[i+1]) {
			hero.level =  i;
			break;
		}
	}
}

function setArmy(value, hero) {
	hero.army = value;
	console.log(hero);
}

function setMoney(value, hero) {
	hero.money = value;
	console.log(hero);
}

function checkNewLevel(level) {
	if (level != oldLevel) {
		oldLevel = level;
		alert("Поздравляем! Достигнут новый уровень");
		return true;
	}
	return false;
}

//todo: также как существует функция получения любого параметра героя по ключу, нужно сделать чтобы и тут
// можно было сохранять по ключу и не дублировать код
function saveHero(hero) {
	let levels = localStorage.getItem('levels').split(',');
	for (var i = 0; i < levels.length; i++) {
		if (hero.name == levels[i].split('=')[0]) { 
			levels[i] = hero.name+'='+hero.level;
			break;
		}
	}
	let lStr = levels.join(',');
	localStorage.setItem('levels', lStr);

	let exp = localStorage.getItem('exp').split(',');
	for (var i = 0; i < exp.length; i++) {
		if (hero.name == exp[i].split('=')[0]) {
			exp[i] = hero.name+'='+hero.exp;
			break;
		}
	}
	let eStr = exp.join(',');
	localStorage.setItem('exp', eStr);

	let army = localStorage.getItem('army').split(',');
	for (var i = 0; i < army.length; i++) {
		if (hero.name == army[i].split('=')[0]) {
			army[i] = hero.name+'='+hero.army;
			break;
		}
	}
	let aStr = army.join(',');
	localStorage.setItem('army', aStr);

	let money = localStorage.getItem('money').split(',');
	for (var i = 0; i < money.length; i++) {
		if (hero.name == money[i].split('=')[0]) {
			money[i] = hero.name+'='+hero.money;
			break;
		}
	}
	let mStr = money.join(',');
	localStorage.setItem('money', mStr);
}

function getEnemys (locationName = null) {
	let enemys = localStorage.getItem('enemys');

	if (enemys === null) return 'Local=1:2.2:4.3:6.4:8';
	if (locationName === null) return enemys;

	let enemysArr = enemys.split(',');

	for (let i = 0; i < enemysArr.length; i++) {
		if (enemysArr[i].split('=')[0] == locationName) {
			return enemysArr[i];
		} 
	}
}


function getLocationEnemyIndex(enemysArr, locationName) {
	let currentLocation = locationLand;

	//console.log(enemysArr);

	for (let i = 0; i < enemysArr.length; i++)
		if (enemysArr[i].split('=')[0] == currentLocation) {
			console.log(enemysArr[i]);
			return i;
		} 
}

////1 - сначала получаем врагов по имени локации на которой находимся
////2 - делим полученную строку из локалСторэдж на массив по локациям
////3 - зная имя настоящей локации, получаем ее индекс и далее работаем с ее врагами  
/// 4 - обновленную строку записываем в локалСторэдж и закидываем в браузер
/// Обновление происходит посредством того, что из верстки получаем html код, который уже обновился
/// достаем из него нужную инфу по дата атрибутам и записываем в массив.

function setEnemys (locationName) {
	let enemysArr = getEnemys().split(',');

	currentLocationIndex = getLocationEnemyIndex(enemysArr, locationName);

	let enemy = document.getElementsByClassName('enemy');
	let enemyId = [];
	let enemyStr = locationName + '=';

	for (var i = 0; i < enemy.length; i++) {
		enemyId.push(enemy[i].dataset.id);
		if (i == enemy.length - 1) enemyStr += enemy[i].dataset.id+':'+enemy[i].dataset.army;
		else enemyStr += enemy[i].dataset.id +':'+enemy[i].dataset.army + '.';
	}

	enemysArr[currentLocationIndex] = enemyStr;
	//console.log('arr');
	//console.log(enemysArr);

	localStorage.setItem('enemys', enemysArr.join(','));
}

//еще не успел войти в коммит а стал рудиментом(
//надеюсь этой функции еще будет применение
function setEnemyArmy(locationName) {
	let enemysArr = getEnemys().split(',');

	currentLocationIndex = getLocationEnemyIndex(enemysArr, locationName);

	console.log(enemysArr[currentLocationIndex]);
	console.log(1234567);

	let enemy = document.getElementsByClassName('enemy');

	let enemysArrValue = enemysArr[currentLocationIndex].split('=')[1].split('.');

	console.log('толпы врагов!');
	console.log(enemysArrValue);
	
	for(let i = 0; i < enemysArrValue.length; i++) {
		console.log(enemysArrValue[i]);
		if (enemysArrValue[i].indexOf(':') == -1){
			enemysArrValue[i] += ':'+ parseInt(Math.random() * (12 - 2) + 2);
		}
		console.log(enemysArrValue[i]);
		console.log('---------');
	}

	let str = locationName + '=' + enemysArrValue.join('.');

	enemysArr[currentLocationIndex] = str;

	localStorage.setItem('enemys', enemysArr.join(','));
}

function addLocation(locationName) {
	let enemys = getEnemys();
	enemys += ',' + locationName + '=1:1.2:4.3:9.4:16';
	localStorage.setItem('enemys', enemys);
}

function showEnemyInfo() {
	let enemyInfo = document.getElementsByClassName('enemy_info');

	for(let i = 0; i < enemyInfo.length; i++) {
		enemyInfo[i].onclick = function (e) {
			let enemyItem = e.target.parentElement.children[0];
			let enemyInfoStr = 'Враг №'+enemyItem.dataset.id + '; Имеет армию: ' + enemyItem.dataset.army;
			console.log(enemyInfoStr);
			modalObj.showEnemyInfo(enemyInfoStr);
		}
	}
}

// описываем весь процесс сражения
function fight(enemyObj, hero) {
	let enemyArmy = enemyObj.children[0].dataset.army;
	let heroArmy = getHeroInfoData(hero_name.textContent, 'army');

	let resultArmy = heroArmy - enemyArmy;
	console.log('РЕЗУЛЬТАТ ПОСЛЕ БОЯ = ' + resultArmy);

	if (resultArmy > 0) {
		setArmy(resultArmy, hero);
		enemys.removeChild(enemyObj);
		return true;
	} else{
		setArmy(0, hero);
		alert('Вы проиграли!!! Идите в магазин и купите армии, перед тем как вновь вступить в сражение!');
		return false;
	}
}

//разгрузить немного интервалл
function addNewEnemy(lastEnemyId) {
	divEnemy = document.createElement("div");
	divEnemy.className = 'd-flex';
	p = document.createElement("p");
	i = document.createElement("i");
	iSwords = document.createElement("i");
	i.className = 'fas fa-info enemy_info';
	iSwords.className = 'far fa-swords enemy_fight';
	p.innerText = 'Враг №'+lastEnemyId;
	p.className = "enemy";
	p.dataset.id = lastEnemyId;
	p.dataset.army = parseInt(Math.random() * (12 - 2) + 2);

	divEnemy.appendChild(p);
	divEnemy.appendChild(i);
	divEnemy.appendChild(iSwords);

	enemys.appendChild(divEnemy);
}


///входная точка игры
let hero_name_prompt = prompt("Введите имя героя...");
let heroInfo;
if (hero_name_prompt.length == 0 || hero_name_prompt === null) location.reload();
else if (!checkLocation(locationLand)) location.reload();
else {
	// главная переменная которая символизирует героя, и при любом изменении его параметра и смежных
	// таких как опыт или армия используем только эту переменную передавая ее в исполняемую функцию
	heroInfo = getCurrentHero(hero_name_prompt);
	hero_name.textContent = heroInfo.name;
	hero_level.textContent += heroInfo.level;
	location_name.textContent = locationLand;
	let locations = getLocations().split(',');
	console.log(locations);

	for (let i = 0; i < locations.length; i++) {
		let option = document.createElement('option');

		let locName = locations[i];
		locName = locName.replace(/[.]/g, '');
		option.textContent = locName.trim();

		if (locationLand == option.textContent) option.selected = true;
		location_option.appendChild(option);
	}

	location_option.onchange = function () {
		console.log(this.value);
		locationLand = this.value;
		setTextEnemysValue(this.value);
	}

	buy_army.onclick = function () {
		let difference = 10000 - heroInfo.army;
		heroInfo.money -= difference;
		console.log("Купили армию: " + heroInfo.money);
		heroInfo.army = 10000;
		saveHero(heroInfo);
		setTextArmyValue(heroInfo.army);
		setTextMoneyValue(heroInfo.money);
	}

	setTextExpValue(heroInfo.exp);
	setTextArmyValue(heroInfo.army);
	setTextMoneyValue(heroInfo.money);
	setTextLevelValue(heroInfo.level);

	setTextToLevelValue(heroInfo.exp, heroInfo.level);
	setTextRankValue();
	oldLevel = heroInfo.level;
	console.log(heroInfo);
	setProgressExpValue(heroInfo.exp);
	setProgressSizeMinMax(heroInfo);
	//setEnemys('Local');
	//addLocation('Air');
	setTextEnemysValue(locationLand);
	showEnemyInfo();

}

let t = setInterval(function () {
for (let i = 0; i < enemy.length; i++) {
	enemy_fight[i].onclick = function (e) {
		//level.value += (e.target.dataset.id * 3);

		let enemyArr = document.getElementsByClassName('enemy');
		let lastEnemy = enemyArr[enemyArr.length - 1];
		let lastEnemyId = parseInt(lastEnemy.dataset.id)+1;

		let enemyObj = e.target.parentElement;

		let fightResult = fight(enemyObj, heroInfo);

		if (fightResult) {
			addNewEnemy(lastEnemyId);
			setExp(5, heroInfo);
			setProgressExpValue(5);
			setTextExpValue(heroInfo.exp);
		}

		setTextArmyValue(heroInfo.army);
		setTextLevelValue(heroInfo.level);
		setTextToLevelValue(heroInfo.exp, heroInfo.level);
		if (checkNewLevel(heroInfo.level)) {
			console.log('newLevel');
			setProgressSizeMinMax(heroInfo);
		}
		console.log(heroInfo);

		saveHero(heroInfo);

		console.log(heroInfo);

		setEnemys(locationLand);

		showEnemyInfo();

		setTextRankValue();
	}
}

}, 10);