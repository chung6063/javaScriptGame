
    let player;
    let selectedJob = null;
    let currentFloor = 1;
    let currentEnemy = null;
    let playerGold = 0; // 플레이어 초기 골드

    const enemyStats = [
    {name: "슬라임", hp: 30, atk: 3, def: 1},
    ];

    const jobs = {
    warrior: {hp: 100, atk: 5, def: 5, speed: 3, gold: 0, items: []},
    thief: {hp: 100, atk: 5, def: 3, speed: 7, gold: 0, items: []},
    archer: {hp: 100, atk: 7, def: 3, speed: 5, gold: 0, items: []},
    wizard: {hp: 100, atk: 10, def: 1, speed: 1, gold: 0, items: []}
};

    const logDiv = document.getElementById("log");

    // 아이템 정의
    const shopItems = [
    { name: '철 헬멧', type: 'head', price: 100, image: '/image/helmet.png', atk: 0, def: 5, hp: 0 },
    { name: '가죽 갑옷', type: 'armor', price: 200, image: '/image/armor.png', atk: 0, def: 10, hp: 0 },
    { name: '장검', type: 'weapon', price: 300, image: './image/sword.png', atk: 20, def: 0, hp: 0 },
    { name: '포션', type: 'potion', price: 50, image: '/image/potion.png', atk: 0, def: 0, hp: 50 }
    ];


    // 인벤토리와 장비 상태를 저장
    const inventory = Array(20).fill(null); // 최대 20개의 아이템

    // 장착한 아이템을 저장할 배열 (각각의 슬롯에 아이템을 장착)
    let equippedItems = {
    head: null,
    armor: null,
    weapon: null,
    potion: null
};

    let selectedInventoryIndex = null; // 현재 선택된 인벤토리 아이템

    // 몬스터 상태 업데이트 함수
    function updateEnemyStats() {
    if (currentEnemy) {
    document.getElementById("monster-name").textContent = currentEnemy.name;
    document.getElementById("monster-hp").textContent = currentEnemy.hp;
    document.getElementById("monster-attack").textContent = currentEnemy.atk;
    document.getElementById("monster-defense").textContent = currentEnemy.def;
}
}

    function statusUpdate(){
    const selectedJobDetails = jobs[selectedJob];

    // 직업 정보 업데이트
    document.getElementById("health").textContent = selectedJobDetails.hp;
    document.getElementById("attack").textContent = selectedJobDetails.atk;
    document.getElementById("defense").textContent = selectedJobDetails.def;
    document.getElementById("speed").textContent = selectedJobDetails.speed;
    document.getElementById("gold").textContent = selectedJobDetails.gold;
}

    function gameBattle() {
    if (!player) {
    log("먼저 직업을 선택해주세요!");
    return;
}

    // 적 생성
    currentEnemy = generateEnemy(currentFloor);
    log(`적이 나타났습니다: ${currentEnemy.name}! `);

    // 몬스터 상태 업데이트
    updateEnemyStats();

    // 배틀 시작
    battleLoop();
}

    function battleLoop() {
    let isPlayerTurn = true;  // 플레이어의 공격이 먼저 시작

    const interval = setInterval(function() {
    const characterImage = document.getElementById("selectedCharacterImage");
    const monsterImage = document.getElementById("monster-image");

    if (isPlayerTurn) {
    // 플레이어가 공격할 때 애니메이션
    characterImage.classList.add("character-attacking");
    // 플레이어가 적을 공격
    attackEnemy();

    // 몬스터 상태 업데이트
    updateEnemyStats();

    // 애니메이션 끝난 후 클래스 제거
    setTimeout(function() {
    characterImage.classList.remove("character-attacking");
}, 500); // 애니메이션 지속 시간에 맞춰 제거

    // 적이 죽었는지 확인
    if (currentEnemy.hp <= 0) {
    log(`${currentEnemy.name}을(를) 처치했습니다!`);

    // 플레이어의 골드 증가
    jobs[selectedJob].gold += 50;  // 선택된 직업의 골드도 증가시킴

    statusUpdate();

    log(`골드가 증가했습니다!`);



    clearInterval(interval);  // 전투 종료
    document.getElementById("nextFloorButton").style.display = "block";  // 다음 층으로 이동 버튼 활성화
    document.getElementById("gameBattleButton").style.display = "none";  // "진행하기" 버튼 숨기기
    return;
}

    // 슬라임이 공격할 차례
    isPlayerTurn = false;
} else {
    // 슬라임이 공격할 때 애니메이션
    monsterImage.classList.add("slime-attacking");
    // 적이 플레이어를 공격
    attackPlayer();

    // 애니메이션 끝난 후 클래스 제거
    setTimeout(function() {
    monsterImage.classList.remove("slime-attacking");
}, 500); // 애니메이션 지속 시간에 맞춰 제거

    // 플레이어가 죽었는지 확인
    if (player.hp <= 0) {
    log("당신은 패배했습니다. 게임 오버!");
    clearInterval(interval);  // 전투 종료
    return;
}

    // 플레이어의 공격 차례로 변경
    isPlayerTurn = true;
}

    // 전투 후 상태 업데이트
    statusUpdate();

}, 700); // 1초 간격으로 공격 진행
}

    function attackEnemy() {
    const playerDamage = Math.max(0, player.atk - currentEnemy.def);
    currentEnemy.hp -= playerDamage;
    log(`당신이 ${currentEnemy.name}에게 ${playerDamage}의 데미지를 입혔습니다! `);
}

    function attackPlayer() {
    const enemyDamage = Math.max(0, currentEnemy.atk - player.def);
    player.hp -= enemyDamage;
    log(`${currentEnemy.name}이(가) 당신에게 ${enemyDamage}의 데미지를 입혔습니다! `);
}

    function nextFloor() {
    currentFloor++;
    log(`축하합니다! ${currentFloor}층으로 이동합니다.`);
    document.getElementById("gameBattleButton").style.display = "block";
    document.getElementById("nextFloorButton").style.display = "none";
}

    function generateEnemy(floor) {
    const index = Math.min(floor - 1, enemyStats.length - 1);
    const baseEnemy = enemyStats[index];
    return {
    ...baseEnemy,
    hp: baseEnemy.hp + floor * 5,
    atk: baseEnemy.atk + floor,
    def: baseEnemy.def + Math.floor(floor / 2)
};
}

    function log(message) {
    logDiv.innerHTML += `<p>${message}</p>`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

    function gameStart() {
    document.getElementById("gameStartButton").style.display = "none";
    document.getElementById("jobBackGround").style.display = "block";
    document.getElementById("log").style.display = "block";
    log("게임을 시작합니다. 직업을 선택해주세요!");
}

    function selectJob(job) {
    selectedJob = job;
    const selectedJobDetails = jobs[job];  // 선택된 직업의 세부 정보를 가져옵니다.

    // 직업 선택 완료 버튼 표시
    document.getElementById("confirmSelectionButton").style.display = "block";

    // 직업 정보 업데이트
    document.getElementById("job").textContent = job;
    document.getElementById("health").textContent = selectedJobDetails.hp;
    document.getElementById("attack").textContent = selectedJobDetails.atk;
    document.getElementById("defense").textContent = selectedJobDetails.def;
    document.getElementById("speed").textContent = selectedJobDetails.speed;
    document.getElementById("gold").textContent = selectedJobDetails.gold;

}

    function confirmJobSelection() {
    if (!selectedJob) {
    log("직업을 선택해주세요!");
    return;
}

    player = jobs[selectedJob];
    const characterSrc = `/image/${selectedJob}.png`;

    // 캐릭터 선택 화면 숨기기
    document.getElementById("jobBackGround").style.display = "none";

    //선택완료 버튼 숨기기
    document.getElementById("confirmSelectionButton").style.display = "none";

    let characterImage = document.getElementById("selectedCharacterImage");

    characterImage.src = characterSrc;

    log(`직업 선택 완료: ${selectedJob}로 게임을 시작합니다.`);
    document.getElementById("gameBattleButton").style.display = "block";
    document.getElementById("selectedCharacterImage").style.display = "block";
    document.getElementById("monster-image").style.display = "block";
}

    // 인벤토리에 아이템 추가
    function initializeInventory() {
    updateInventoryUI();
}

    // 인벤토리 UI 업데이트
    function updateInventoryUI() {
    inventory.forEach((item, index) => {
        const slot = document.getElementById(`inventory-item-${index}`);
        if (item) {
            slot.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
        } else {
            slot.innerHTML = '';
        }
    });
}

    // 장비창 UI 업데이트
    function updateEquipmentUI() {
    Object.keys(equipment).forEach(slot => {
        const equipmentSlot = document.getElementById(`${slot}-slot`);
        const item = equipment[slot];
        if (item) {
            equipmentSlot.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
        } else {
            equipmentSlot.innerHTML = slot === 'head' ? '머리' : slot === 'armor' ? '갑옷' : '무기';
        }
    });
}

    // 인벤토리 아이템 선택
    function selectInventoryItem(index) {
    if (inventory[index]) {
    selectedInventoryIndex = index;

    // 모든 슬롯에서 선택 제거 후 현재 슬롯 강조
    document.querySelectorAll('.inventory-item').forEach(item => item.classList.remove('selected'));
    document.getElementById(`inventory-item-${index}`).classList.add('selected');

    // 장착 가능한 슬롯 강조
    highlightEquipableSlots(inventory[index].type);
} else {
    alert('빈 슬롯입니다.');
}
}

    // 장착 가능한 슬롯 강조
    function highlightEquipableSlots(type) {
    updateEquipmentUI(); // 기존 강조 제거

    const slotId = type === 'head' ? 'head-slot' : type === 'armor' ? 'armor-slot' : 'weapon-slot';
    const slotElement = document.getElementById(slotId);
    if (slotElement) {
    slotElement.classList.add('highlight');
}
}

    // 아이템 장착
    function equipItem(slot) {
    if (selectedInventoryIndex === null || !inventory[selectedInventoryIndex]) {
    alert('선택한 아이템이 없습니다.');
    return;
}

    const selectedItem = inventory[selectedInventoryIndex];
    if (selectedItem.type !== slot) {
    alert(`${slot}에 장착할 수 없는 아이템입니다.`);
    return;
}

    // 기존 장비를 인벤토리로 이동
    if (equipment[slot]) {
    inventory[selectedInventoryIndex] = equipment[slot];
} else {
    inventory[selectedInventoryIndex] = null;
}

    // 선택한 아이템을 장비로 이동
    equipment[slot] = selectedItem;
    selectedInventoryIndex = null;

    updateInventoryUI();
    updateEquipmentUI();
}

    // 아이템 구매 함수
    function buyItem(index) {
    const item = shopItems[index];

    // 선택한 직업의 골드 확인
    const selectedJobDetails = jobs[selectedJob];

    // 골드가 충분한지 확인
    if (selectedJobDetails.gold >= item.price) {
    // 인벤토리에 빈 슬롯이 있는지 확인
    const emptySlot = inventory.findIndex(slot => slot === null);

    if (emptySlot !== -1) {
    // 아이템을 인벤토리 슬롯에 추가
    inventory[emptySlot] = item;

    // 직업의 골드를 차감
    selectedJobDetails.gold -= item.price;

    // 아이템의 효과를 직업 스탯에 반영
    applyItemStats(item);

    // 인벤토리 UI 갱신
    updateInventoryUI();

    // 아이템 구매 완료 알림
    alert(`${item.name}을(를) 구매했습니다!`);

    // 상태 업데이트 (골드 표시 반영)
    statusUpdate();
} else {
    alert('인벤토리가 가득 찼습니다.');
}
} else {
    alert('골드가 부족합니다.');
}
}

    // 아이템 효과를 직업 스탯에 반영하는 함수
    function applyItemStats(item) {
    const selectedJobDetails = jobs[selectedJob];

    // 아이템 종류에 따른 스탯 적용
    if (item.type === 'weapon') {
    selectedJobDetails.atk += item.atk;  // 무기: 공격력 증가
} else if (item.type === 'armor') {
    selectedJobDetails.def += item.def;  // 갑옷: 방어력 증가
} else if (item.type === 'head') {
    selectedJobDetails.def += item.def;  // 헬멧: 방어력 증가
} else if (item.type === 'potion') {
    selectedJobDetails.hp += item.hp;  // 포션: 체력 회복
}
}

    initializeInventory();

    function usePotion() {
    const potion = equippedItems.potion;
    if (potion) {
    selectedJobDetails.hp += potion.hp;
    alert(`포션을 사용하여 체력이 ${potion.hp}만큼 회복되었습니다!`);
    // 포션 사용 후, 인벤토리에서 포션을 제거
    equippedItems.potion = null;
    statusUpdate();  // 스탯 업데이트
} else {
    alert('포션이 없습니다!');
}
}
    // 아이템 장착 함수
    function equipItem(index) {
    const item = inventory[index];  // 인벤토리에서 아이템을 가져옴
    const selectedJobDetails = jobs[selectedJob];  // 선택한 직업의 정보 가져오기

    // 아이템 장착
    if (item) {
    if (item.type === 'weapon') {
    // 무기 장착 시 공격력 증가
    selectedJobDetails.atk += item.atk;
} else if (item.type === 'armor' || item.type === 'head') {
    // 갑옷 또는 헬멧 장착 시 방어력 증가
    selectedJobDetails.def += item.def;
} else if (item.type === 'potion') {
    // 포션 사용 시 체력 회복
    selectedJobDetails.hp += item.hp;
}

    // 장착한 아이템을 인벤토리에서 제거
    inventory[index] = null;

    // 상태 업데이트
    statusUpdate();
    updateInventoryUI();  // 인벤토리 UI 갱신
    alert(`${item.name}을(를) 장착했습니다!`);
} else {
    alert('장착할 아이템이 없습니다.');
}
}
