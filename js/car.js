document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });

  // Получаем ссылки на элементы с помощью классов
const button = document.querySelector('.b2');
const v1 = document.querySelector('.v1');
const v2 = document.querySelector('.v2');

// Назначаем обработчик события при клике на кнопку
button.addEventListener('click', function() {
  // Скрываем div с классом v1
  v1.style.display = 'none';
  // Показываем div с классом v2
  v2.style.display = 'block';
});

        // Получение ссылки на холст и его контекст
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

// Установка размеров холста
canvas.width = 800;
canvas.height = 600;

// Создание объектов изображений для главной машины и соперника
var playerCarImage = new Image();
playerCarImage.src = "img/car2.png";

var opponentCarImage = new Image();
opponentCarImage.src = "img/car3.png";

// Параметры игры
var playerCarX = canvas.width / 2; // Позиция главной машины по оси X
var playerCarY = canvas.height - 100; // Позиция главной машины по оси Y
var playerCarWidth = 60;
var playerCarHeight = 100;
var playerCarSpeed = 15; // Скорость главной машины

var opponentCars = []; // Массив для хранения соперников
var minOpponentCount = 3; // Минимальное количество соперников

// Флаги управления
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;

// Обработчики событий нажатия клавиш
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Обработчик нажатия клавиши
function keyDownHandler(event) {
    if (event.keyCode == 37) {
        moveLeft = true;
    } else if (event.keyCode == 39) {
        moveRight = true;
    } else if (event.keyCode == 38) {
        moveUp = true;
    } else if (event.keyCode == 40) {
        moveDown = true;
    }
}

// Обработчик отпускания клавиши
function keyUpHandler(event) {
    if (event.keyCode == 37) {
        moveLeft = false;
    } else if (event.keyCode == 39) {
        moveRight = false;
    } else if (event.keyCode == 38) {
        moveUp = false;
    } else if (event.keyCode == 40) {
        moveDown = false;
    }
}

// Функция отрисовки кадра
function draw() {
    // Очистка холста
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка главной машины
    context.drawImage(playerCarImage, playerCarX, playerCarY, playerCarWidth, playerCarHeight);

    // Отрисовка соперников
    for (var i = 0; i < opponentCars.length; i++) {
        var opponentCar = opponentCars[i];
        context.drawImage(opponentCarImage, opponentCar.x, opponentCar.y, playerCarWidth, playerCarHeight);
    }
}

// Функция обновления игры
function update() {
    
    // Обновление позиции главной машины
    if (moveLeft && playerCarX > 0) {
        playerCarX -= playerCarSpeed;
    } else if (moveRight && playerCarX + playerCarWidth < canvas.width) {
        playerCarX += playerCarSpeed;
    }

    if (moveUp && playerCarY > 0) {
        playerCarY -= playerCarSpeed;
    } else if (moveDown && playerCarY + playerCarHeight < canvas.height) {
        playerCarY += playerCarSpeed;
    }

    // Обновление позиции соперников
    for (var i = 0; i < opponentCars.length; i++) {
        var opponentCar = opponentCars[i];
        opponentCar.y += playerCarSpeed;

        // Проверка столкновения соперника с главной машиной
        if (checkCollision(playerCarX, playerCarY, playerCarWidth, playerCarHeight, opponentCar.x, opponentCar.y, playerCarWidth, playerCarHeight)) {
            gameOver();
            return;
        }

        // Проверка, достиг ли соперник нижней границы экрана
        if (opponentCar.y > canvas.height) {
            // Удаление соперника из массива
            opponentCars.splice(i, 1);
            i--;
        }
    }

    // Добавление новых соперников
    while (opponentCars.length < minOpponentCount) {
        var newOpponentCar = {
            x: Math.random() * (canvas.width - playerCarWidth),
            y: -Math.random() * canvas.height // Появляется за пределами экрана
        };
        opponentCars.push(newOpponentCar);
    }

    // Вызов функции отрисовки
    draw();
}

// Функция проверки столкновений
function checkCollision(x1, y1, width1, height1, x2, y2, width2, height2) {
    if (x1 < x2 + width2 &&
        x1 + width1 > x2 &&
        y1 < y2 + height2 &&
        y1 + height1 > y2) {
        return true;
    }

    return false;
}

// Функция игрового цикла
function gameLoop() {
    update();

    // Запуск игрового цикла
    requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();