///Сейчас нормально не отрабатывает переключение прогресс бара между уровнями 
// нужно настроить это и проверить 


let enemy = document.getElementsByClassName('enemy');
let locationLand = "Sea";
let oldLevel;


// МАССИВ УРОВНЕЙ

let levelArr = [0, 10, 100, 250, 500, 1000, 2500, 5000, 10000];


//hero_name.textContent = prompt('Введите имя героя...');

//получить текущего героя: конструктор игры (получаем либо создаем нового)
function getCurrentHero(name) {
	let heroes = localStorage.getItem('heroes');

	if (heroes === null){
		localStorage.setItem('heroes', name);
		localStorage.setItem('levels', name+'=0');
		localStorage.setItem('exp', name+'=0');
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
			localStorage.setItem('heroes', heroes + ',' + name);
			localStorage.setItem('levels', levels + ',' + name+'=0');
			localStorage.setItem('exp', exp + ',' + name+'=0');
		}
	}

	return {"name": name, "level": parseInt(getHeroInfoData(name, 'levels')), "exp": parseInt(getHeroInfoData(name, 'exp'))};
}

//получить иноформацию о герое по ключу
function getHeroInfoData(heroName, keyName) {
	let dataSetInfo = localStorage.getItem(keyName).split(',');
	for (let i = 0; i < dataSetInfo.length; i++) {
		let dataSetInfoItem = dataSetInfo[i].split('=');
		if(dataSetInfoItem[0] == heroName) return dataSetInfoItem[1];
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
		enemy[i].innerText += valuesArr[i];
		enemy[i].dataset.id = valuesArr[i];
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

function checkNewLevel(level) {
	if (level != oldLevel) {
		oldLevel = level;
		alert("Поздравляем! Достигнут новый уровень");
		return true;
	}
	return false;
}

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
}

function getEnemys (locationName = null) {
	let enemys = localStorage.getItem('enemys');

	if (enemys === null) return 'Local=1.2.3.4';
	if (locationName === null) return enemys;

	let enemysArr = enemys.split(',');

	for (let i = 0; i < enemysArr.length; i++) {
		if (enemysArr[i].split('=')[0] == locationName) {
			return enemysArr[i];
		} 
	}
}

function setEnemys (locationName) {
	let storeEnemy = getEnemys();

	let currentLocation = 'Local';

	console.log(storeEnemy);

	let enemysArr = storeEnemy.split(',');
	console.log(enemysArr);
	let currentLocationIndex = 0;

	for (let i = 0; i < enemysArr.length; i++) {
		if (enemysArr[i].split('=')[0] == currentLocation) {
			currentLocationIndex = i;	
			break;
		} 
	}

	console.log(enemysArr[currentLocationIndex]);

	//if (storeEnemy.join(',') == '1,2,3,4') alert(1);

	let enemy = document.getElementsByClassName('enemy');
	let enemyId = [];
	let enemyStr = locationName + '=';

	for (var i = 0; i < enemy.length; i++) {
		enemyId.push(enemy[i].dataset.id);
		if (i == enemy.length - 1) enemyStr += enemy[i].dataset.id;
		else enemyStr += enemy[i].dataset.id + '.';
	}

	enemysArr[currentLocationIndex] = enemyStr;

	localStorage.setItem('enemys', enemysArr.join(','));
}

function addLocation(locationName) {
	let enemys = getEnemys();
	enemys += ',' + locationName + '=1.2.3.4';
	localStorage.setItem('enemys', enemys);
}

///входная точка игры
let hero_name_prompt = prompt("Введите имя героя...");
let heroInfo;
if (hero_name.length == 0 || hero_name === null) location.reload();
else {
	heroInfo = getCurrentHero(hero_name_prompt);
	hero_name.textContent = heroInfo.name;
	hero_level.textContent += heroInfo.level;
	setTextExpValue(heroInfo.exp);
	setTextLevelValue(heroInfo.level);
	setTextToLevelValue(heroInfo.exp, heroInfo.level);
	setTextRankValue();
	oldLevel = heroInfo.level;
	console.log(heroInfo);
	setProgressExpValue(heroInfo.exp);
	setProgressSizeMinMax(heroInfo);
	//setEnemys('Local');
	//addLocation('Local');
	setTextEnemysValue(locationLand);
}

let t = setInterval(function () {
for (let i = 0; i < enemy.length; i++) {
	enemy[i].onclick = function (e) {
		//level.value += (e.target.dataset.id * 3);

		let enemyArr = document.getElementsByClassName('enemy');
		let lastEnemy = enemyArr[enemyArr.length - 1];
		let lastEnemyId = parseInt(lastEnemy.dataset.id)+1;
		
		enemys.removeChild(e.target);

		p = document.createElement("p");
		p.textContent = "Враг №"+lastEnemyId;
		p.className = "enemy";
		p.dataset.id = lastEnemyId;
		enemys.appendChild(p);

		setExp(5, heroInfo);
		setProgressExpValue(5);
		setTextExpValue(heroInfo.exp);
		setTextLevelValue(heroInfo.level);
		setTextToLevelValue(heroInfo.exp, heroInfo.level);
		if (checkNewLevel(heroInfo.level)) {
			console.log('newLevel');
			setProgressSizeMinMax(heroInfo);
		}
		console.log(heroInfo);


		saveHero(heroInfo);

		setEnemys(locationLand);

		setTextRankValue();
	}
}

}, 10);