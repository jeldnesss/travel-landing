"use strict";

var item = document.querySelectorAll('.facts__inf');
item.forEach(function (item) {
  var triger = item.querySelector('.facts__name-box');
  triger.addEventListener('click', function () {
    item.classList.toggle('active');
  });
});
var counterEl = document.querySelector('.welcome__person-count');
var counter = Number(counterEl.textContent);
var btnMinus = document.getElementById('minus');
var btnPlus = document.getElementById('plus');
btnMinus.addEventListener('click', function () {
  if (counter > 1) {
    counter--;
    counterEl.textContent = counter;
  }

  if (counter = 1) {
    btnMinus.setAttribute("src", "./img/Minus.svg");
  }
});
btnPlus.addEventListener('click', function () {
  counter++;
  counterEl.textContent = counter;

  if (counter > 1) {
    btnMinus.setAttribute("src", "./img/minus-blue.svg");
  }
});
var cities = ["Zermatt", "Zurich", "Geneva", "Bern", "Interlaken", "Lucerne", "Basel"];

function autoInputCities(inputValue, list, data) {
  inputValue.addEventListener('input', function () {
    var userInput = inputValue.value.toLowerCase();
    list.innerHTML = '';

    if (userInput) {
      var filteredList = data.filter(function (city) {
        return city.toLowerCase().includes(userInput);
      });
      filteredList.forEach(function (city) {
        var li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', function () {
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

var calendar = document.getElementById('calendar');
var inputDeparture = document.getElementById('departure');
var departureList = inputDeparture.closest('.welcome__autocomplete').querySelector('.welcome__suggestions');
autoInputCities(inputDeparture, departureList, cities);
var inputArrive = document.getElementById('arrive');
var arriveList = inputArrive.closest('.welcome__autocomplete').querySelector('.welcome__suggestions');
autoInputCities(inputArrive, arriveList, cities);
var departDate = document.getElementById('departDate');
var arriveDate = document.getElementById('arriveDate');
departDate.addEventListener('click', function (e) {
  calendar.classList.toggle('active-calendar');
  e.stopPropagation();
});
calendar.addEventListener('click', function (e) {
  e.stopPropagation();
});
document.addEventListener('click', function () {
  calendar.classList.remove('active-calendar');
});
var oneWay = document.getElementById('one-way');
var roundTrip = document.getElementById('round-trip');
var roundTripRadio = true;
[oneWay, roundTrip].forEach(function (radio) {
  radio.addEventListener('change', function () {
    if (oneWay.checked) {
      arriveDate.disabled = true;
      arriveDate.style.backgroundColor = 'rgba(5, 120, 255, 0.1)';
      arriveDate.value = '';
      roundTripRadio = false;
    } else {
      arriveDate.style.backgroundColor = '#fff';
      arriveDate.disabled = false;
      roundTripRadio = true;
    }
  });
});
var resetBtn = document.getElementById('resetBtn');
var applyBtn = document.getElementById('applyBtn');
var monthYear1 = document.getElementById('monthYear1');
var monthYear2 = document.getElementById('monthYear2');
var daysOfMonth1 = document.getElementById('daysOfMonth1');
var daysOfMonth2 = document.getElementById('daysOfMonth2');
var btnPrev = document.querySelector('.calendar__btn-prev');
var btnNext = document.querySelector('.calendar__btn-next');
var startDay = null;
var endDay = null;
var rangeFlag = false;
var currentDate = new Date();
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function renderMonth(year, month, container, header) {
  container.innerHTML = '';
  header.textContent = "".concat(months[month], " ").concat(year);
  var firstDay = new Date(year, month, 1).getDay();
  var startsDay = firstDay === 0 ? 6 : firstDay - 1;
  var daysInMonth = new Date(year, month + 1, 0).getDate();

  for (var i = 0; i < startsDay; i++) {
    var emptyCell = document.createElement('div');
    emptyCell.classList.add('calendar__day', 'empty');
    container.appendChild(emptyCell);
  }

  var _loop = function _loop(day) {
    var dayCell = document.createElement('div');
    dayCell.classList.add('calendar__day');
    dayCell.textContent = day;
    var currentDayObj = new Date(year, month, day);

    if (startDay && currentDayObj.getTime() === startDay.getTime()) {
      dayCell.classList.add("selected");
    }

    if (endDay && currentDayObj.getTime() === endDay.getTime()) {
      dayCell.classList.add("selected");
    }

    if (startDay && endDay && startDay.getTime() < currentDayObj.getTime() && currentDayObj.getTime() < endDay.getTime()) {
      dayCell.classList.add("range");
      rangeFlag = true;
    }

    dayCell.addEventListener('click', function () {
      return selectDay(year, month, day);
    });
    container.appendChild(dayCell);
  };

  for (var day = 1; day < daysInMonth + 1; day++) {
    _loop(day);
  }
}

function selectDay(year, month, day) {
  var selectedDate = new Date(year, month, day);

  if (!roundTripRadio) {
    startDay = selectedDate;
    endDay = null;
    departDate.value = "".concat(startDay.getDate(), " ").concat(months[startDay.getMonth()], " ").concat(startDay.getFullYear());
  } else {
    if (!startDay || startDay && endDay) {
      startDay = selectedDate;
      endDay = null;
      departDate.value = "".concat(startDay.getDate(), " ").concat(months[startDay.getMonth()], " ").concat(startDay.getFullYear());
    } else if (selectedDate.getTime() < startDay.getTime()) {
      endDay = startDay;
      startDay = selectedDate;
      arriveDate.value = "".concat(endDay.getDate(), " ").concat(months[endDay.getMonth()], " ").concat(endDay.getFullYear());
      departDate.value = "".concat(startDay.getDate(), " ").concat(months[startDay.getMonth()], " ").concat(startDay.getFullYear());
    } else {
      endDay = selectedDate;
      arriveDate.value = "".concat(endDay.getDate(), " ").concat(months[endDay.getMonth()], " ").concat(endDay.getFullYear());
    }
  }

  renderCalendar();
}

function renderCalendar() {
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth();
  renderMonth(year, month, daysOfMonth1, monthYear1);
  var nextMonth = (month + 1) % 12;
  var nextYear = month === 11 ? year + 1 : year;
  renderMonth(nextYear, nextMonth, daysOfMonth2, monthYear2);
}

renderCalendar();
btnPrev.addEventListener('click', function () {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
btnNext.addEventListener('click', function () {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});
resetBtn.addEventListener('click', function () {
  departDate.value = '';
  arriveDate.value = '';
  endDay = null;
  startDay = null;
  renderCalendar();
});
applyBtn.addEventListener('click', function () {
  calendar.classList.remove('active-calendar');
});
var img2 = document.getElementById('img2');
var img3 = document.getElementById('img3');
var img4 = document.getElementById('img4');
var mediaWidth = window.matchMedia("(max-width: 769px)");

function updateLayot(e) {
  if (e.matches) {
    img2.src = "./img/ing01.jpg";
    img3.src = "./img/ing03.jpg";
    img4.src = "./img/ing05.jpg";
  }
}

updateLayot(mediaWidth);
mediaWidth.addEventListener('change', updateLayot);
var menuHeader = document.getElementById('menuHeader');
var menuContainer = document.querySelector('.header__menu-mobile');
menuHeader.addEventListener('click', function (e) {
  menuContainer.classList.toggle('active-calendar');
  e.stopPropagation();

  if (menuContainer.classList.contains('active-calendar')) {
    menuHeader.src = "./img/close-menu.svg";
  } else {
    menuHeader.src = "./img/Menu.svg";
  }
});