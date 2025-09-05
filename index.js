const item = document.querySelectorAll('.facts__inf');

item.forEach(item => {
    const triger = item.querySelector('.facts__name-box');

    triger.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});


const counterEl = document.querySelector('.welcome__person-count');
let counter = Number(counterEl.textContent);

const btnMinus = document.getElementById('minus');
const btnPlus = document.getElementById('plus');

btnMinus.addEventListener('click', () => {
    if(counter > 1){
        counter--;
        counterEl.textContent = counter;
    }
    if (counter = 1) {
        btnMinus.setAttribute("src", "./img/Minus.svg");
    }
});
btnPlus.addEventListener('click', () => {
    counter++;
    counterEl.textContent = counter;
    if (counter > 1) {
        btnMinus.setAttribute("src", "./img/minus-blue.svg");
    }
});



const cities = [
    "Zermatt",
    "Zurich",
    "Geneva",
    "Bern",
    "Interlaken",
    "Lucerne",
    "Basel"
];

function autoInputCities(inputValue, list, data) {
    inputValue.addEventListener('input', () => {
        const userInput = inputValue.value.toLowerCase();
        list.innerHTML = '';

        if(userInput){
            const filteredList = data.filter(city => city.toLowerCase().includes(userInput));

            filteredList.forEach(city => {
                const li = document.createElement('li');
                li.textContent = city;
                li.addEventListener('click', () => {
                    inputValue.value = city;
                    list.style.display = 'none';
                });
            list.appendChild(li);
            });
            list.style.display = filteredList.length ? 'block' : 'none';
        } else {
            list.style.display = 'none';
        }
    });
}

const calendar = document.getElementById('calendar');

const inputDeparture = document.getElementById('departure');
const departureList = inputDeparture.closest('.welcome__autocomplete').querySelector('.welcome__suggestions');

autoInputCities(inputDeparture, departureList, cities);

const inputArrive = document.getElementById('arrive');
const arriveList = inputArrive.closest('.welcome__autocomplete').querySelector('.welcome__suggestions');

autoInputCities(inputArrive, arriveList, cities);

const departDate = document.getElementById('departDate');
const arriveDate = document.getElementById('arriveDate');

departDate.addEventListener('click', (e) => {
    calendar.classList.toggle('active-calendar');
    e.stopPropagation();
});
calendar.addEventListener('click', (e) => {
    e.stopPropagation();
});
document.addEventListener('click', () => {
    calendar.classList.remove('active-calendar');
});

const oneWay = document.getElementById('one-way');
const roundTrip = document.getElementById('round-trip');
let roundTripRadio = true;

[oneWay, roundTrip].forEach(radio => {
    radio.addEventListener('change', () => {
        if(oneWay.checked){
            arriveDate.disabled = true;
            arriveDate.style.backgroundColor = 'rgba(5, 120, 255, 0.1)';
            arriveDate.value = '';
            roundTripRadio = false;
            
        } else{
            arriveDate.style.backgroundColor = '#fff';
            arriveDate.disabled = false;
            roundTripRadio = true;
        }
    });
});

const resetBtn = document.getElementById('resetBtn');
const applyBtn = document.getElementById('applyBtn');

const monthYear1 = document.getElementById('monthYear1');
const monthYear2 = document.getElementById('monthYear2');

const daysOfMonth1 = document.getElementById('daysOfMonth1');
const daysOfMonth2 = document.getElementById('daysOfMonth2');

const btnPrev = document.querySelector('.calendar__btn-prev');
const btnNext = document.querySelector('.calendar__btn-next');


let startDay = null;
let endDay = null;

let rangeFlag = false;

let currentDate = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function renderMonth(year, month, container, header){
    container.innerHTML = '';

    header.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const startsDay = (firstDay === 0 ? 6 : firstDay - 1);

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for(let i = 0; i < startsDay; i++){
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar__day', 'empty');
        container.appendChild(emptyCell);
    }

    for(let day = 1; day < daysInMonth + 1; day++){
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar__day');
        dayCell.textContent = day;
        const currentDayObj = new Date(year, month, day);
        if(startDay && currentDayObj.getTime() === startDay.getTime()){
            dayCell.classList.add("selected");
        }
        if(endDay && currentDayObj.getTime() === endDay.getTime()){
            dayCell.classList.add("selected");
        }
        if(startDay && endDay && startDay.getTime() < currentDayObj.getTime() && currentDayObj.getTime() < endDay.getTime()){
            dayCell.classList.add("range");
            rangeFlag = true;
        }
        
        dayCell.addEventListener('click', () => selectDay(year, month, day));
        container.appendChild(dayCell);
    }

}

function selectDay(year, month, day){
    const selectedDate = new Date(year, month, day);

    if(!roundTripRadio){
        startDay = selectedDate;
        endDay = null;
        departDate.value = `${startDay.getDate()} ${months[startDay.getMonth()]} ${startDay.getFullYear()}`;
    }else{
        if((!startDay)||(startDay && endDay)){
            startDay = selectedDate;
            endDay = null;
            departDate.value = `${startDay.getDate()} ${months[startDay.getMonth()]} ${startDay.getFullYear()}`;
        } else if(selectedDate.getTime() < startDay.getTime()){
            endDay = startDay;
            startDay = selectedDate;
            arriveDate.value = `${endDay.getDate()} ${months[endDay.getMonth()]} ${endDay.getFullYear()}`;
            departDate.value = `${startDay.getDate()} ${months[startDay.getMonth()]} ${startDay.getFullYear()}`;
        } else{
            endDay = selectedDate;
            arriveDate.value = `${endDay.getDate()} ${months[endDay.getMonth()]} ${endDay.getFullYear()}`;
        }
    } 
    
    
    renderCalendar();
}

function renderCalendar(){
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    renderMonth(year, month, daysOfMonth1, monthYear1);

    const nextMonth = (month + 1) % 12;
    const nextYear = (month === 11 ? year + 1 : year);

    renderMonth(nextYear, nextMonth, daysOfMonth2, monthYear2);
}
renderCalendar();

btnPrev.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});
btnNext.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});
resetBtn.addEventListener('click', () => {
    departDate.value = '';
    arriveDate.value = '';
    endDay = null;
    startDay = null;
    renderCalendar();
});
applyBtn.addEventListener('click', () => {
    calendar.classList.remove('active-calendar');
});

const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');
const img4 = document.getElementById('img4');

const mediaWidth = window.matchMedia("(max-width: 769px)");

function updateLayot(e){
    if(e.matches){
        img2.src = "./img/ing01.jpg";
        img3.src = "./img/ing03.jpg";
        img4.src = "./img/ing05.jpg";
    }
}
updateLayot(mediaWidth);
mediaWidth.addEventListener('change', updateLayot);

const menuHeader = document.getElementById('menuHeader');
const menuContainer = document.querySelector('.header__menu-mobile');

menuHeader.addEventListener('click', (e)=> {
    menuContainer.classList.toggle('active-calendar');
    e.stopPropagation();
    if(menuContainer.classList.contains('active-calendar')){
        menuHeader.src = "./img/close-menu.svg";
    } else{
        menuHeader.src = "./img/Menu.svg";
    }
});