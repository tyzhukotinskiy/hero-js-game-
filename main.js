let enemy = document.getElementsByClassName('enemy');
let oldLevel;


// МАССИВ УРОВНЕЙ

let levelArr = [0, 10, 100, 250, 500, 1000, 2500, 5000, 10000];


//hero_name.textContent = prompt('Введите имя героя...');


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

function getHeroInfoData(heroName, keyName) {
	let dataSetInfo = localStorage.getItem(keyName).split(',');
	for (let i = 0; i < dataSetInfo.length; i++) {
		let dataSetInfoItem = dataSetInfo[i].split('=');
		if(dataSetInfoItem[0] == heroName) return dataSetInfoItem[1];
	}
}

function getAllHeroes() {

}

function getAllHeroesWithData(key = null) {
	if (key === null) return localStorage.getItem('heroes').split(',');
	return localStorage.getItem(key).split(',');
}

function setProgressExpValue(exp) {
	level.value = exp;
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
	//console.log(heroes);

	for (let i = 0; i < heroes.length; i++) {
		let item = heroes[i].split('=');
		heroesArr.push({name: item[0], exp: item[1]});
	}

	heroesArr.sort(function (a, b) {
		return b.exp - a.exp;
	});

	for (let i = 0; i < hero_rank.length; i++) {
		hero_rank[i].textContent = heroesArr[i].name + ' - ' + heroesArr[i].exp + ' опыта;';
	}

	console.log(heroesArr);
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
	}
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
}
//localStorage.clear();
//let hero = getCurrentHero(hero_name);











let t = setInterval(function () {
for (let i = 0; i < enemy.length; i++) {
	enemy[i].onclick = function (e) {
		//level.value += (e.target.dataset.id * 3);

		let enemyArr = document.getElementsByClassName('enemy');
		let o = enemyArr[enemyArr.length - 1];
		let lastEnemyId = ++o.dataset.id;
		
		p = document.createElement("p");
		p.textContent = "Враг №"+lastEnemyId;
		p.className = "enemy";
		p.dataset.id = lastEnemyId;
		enemys.appendChild(p);

		enemys.removeChild(e.target);

		setExp(5, heroInfo);
		setProgressExpValue(parseInt(heroInfo.exp));
		setTextExpValue(heroInfo.exp);
		setTextLevelValue(heroInfo.level);
		setTextToLevelValue(heroInfo.exp, heroInfo.level);
		checkNewLevel(heroInfo.level);
		console.log(heroInfo);


		saveHero(heroInfo);

		setTextRankValue();
	}
}

}, 10);