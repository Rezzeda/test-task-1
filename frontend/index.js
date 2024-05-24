//переменные

const url = `http://[::1]:3000/`;
let usersData = [];

const searchResult = document.querySelector('.search-result');

const popups = document.querySelectorAll('.popup');
const popup = document.querySelector('.popup');
const popupClose = document.querySelector('.popup__close');
const closeButtons = document.querySelectorAll('.popup__btn_action_close')

const popupTitle = document.querySelector('.popup__title');
const popupContent = document.querySelector('.popup__content');
const phoneItem = popupContent.querySelector('.popup__phone');
const emailItem = popupContent.querySelector('.popup__email');
const dateItem = popupContent.querySelector('.popup__date');
const positionItem = popupContent.querySelector('.popup__position');
const departmentItem = popupContent.querySelector('.popup__department');

//создание карточки по шаблону
function createCard(data) {
    const template = document.getElementById('card-template').content.cloneNode(true);
    template.querySelector('.card__name').textContent = data.name;
    template.querySelector('.card__phone .card__text').textContent = data.phone;
    template.querySelector('.card__email .card__text').textContent = data.email;

    const cardElement = template.querySelector('.card');
    cardElement.addEventListener('click', () => {
        getUser(data.name);
    });

    return template;
}

//отрисовка карточки
function renderCards(data) {
    searchResult.innerHTML = '';
    data.forEach(item => {
        const card = createCard(item);
        searchResult.appendChild(card);
    });
}

//фильтруем карточки по запросу
function filterUsers(query) {
    const filteredData = usersData.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase())
    );
    renderCards(filteredData);
}

//получаем список людей с сервера
function getData() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            usersData = data;
            renderCards(usersData);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

//фильтруем по мере введения пользователем имени
document.querySelector('.search-input').addEventListener('input', (event) => {
    const query = event.target.value;
    filterUsers(query);
});

//Открытие модального окна
function openPopup (item) {
    item.classList.add('popup_opened');
    document.addEventListener('keydown', handleEscKey);
}

// Функция закрытия модального окна
function closePopup(item) {
    item.classList.remove('popup_opened');
    document.removeEventListener('keydown', handleEscKey);
}

// Функция обработки события клавиатуры
function handleEscKey(event) {
    if (event.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_opened');
        if (openedPopup) {
            closePopup(openedPopup);
        }
    }
}

// функция закрытия попапа по нажатию на крестик
closeButtons.forEach((item) => {
    item.addEventListener('click', (evt) => {
        const popupClosest = evt.target.closest('.popup');
        closePopup(popupClosest);
    });
});

//получаем нужную карточку по имени
function getUser(userName) {
    fetch(`${url}?term=${encodeURIComponent(userName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Response error');
            }
            return response.json();
        })
        .then(user => {
            // console.log(user);
            openPopupWithData(user[0]);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

//открытие модального окна с данными
function openPopupWithData(user) {
    popupTitle.textContent = user.name;
    phoneItem.textContent = user.phone;
    emailItem.textContent = user.email;
    dateItem.textContent = user.hire_date;
    positionItem.textContent = user.position_name;
    departmentItem.textContent = user.department;

    openPopup(popup);
}

// Закрытие модального окна при нажатии на оверлей
popups.forEach((item) => {
    item.addEventListener('click', (evt) => {
        if(evt.target.classList.contains('popup')) {
            closePopup(evt.target);
        }
    });
});

getData();