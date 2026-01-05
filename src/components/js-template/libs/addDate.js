export default function addDate() {
  function addLeadingZero(d) {
    return d < 10 ? '0' + d : d;
  }

  function gettingDay() {
    let day;
    if (document.documentElement.lang === 'ru') {
      const days = [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
      ];
      day = days[new Date().getDay() - 1];
    } else {
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      day = days[new Date().getDay()];
    }
    return day;
  }

  function gettingMonth() {
    let month;

    if (document.documentElement.lang === 'ru') {
      const months = [
        'Января',
        'Февраля',
        'Марта',
        'Апреля',
        'Мая',
        'Июня',
        'Июля',
        'Августа',
        'Сентября',
        'Октября',
        'Ноября',
        'Декабря',
      ];
      month = months[new Date().getMonth()];
    } else {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      month = months[new Date().getMonth()];
    }
    return month;
  }

  function getUserTime(t = new Date()) {
    let Y = t.getFullYear(),
      //M = addLeadingZero(t.getMonth() + 1),//to display in numeric format
      M = gettingMonth(),
      D = addLeadingZero(t.getDate()),
      d = gettingDay(),
      h = addLeadingZero(t.getHours()),
      m = addLeadingZero(t.getMinutes()),
      s = addLeadingZero(t.getSeconds());

    if (document.documentElement.lang === 'ru') {
      return `Дата: ${D} ${M} ${Y} ${h}:${m}:${s} ${d}`; //Дата:
    }
    return `Date: ${D} ${M} ${Y} ${h}:${m}:${s} ${d}`; //Date: ${d}
  }

  function updateDate() {
    const el = document.querySelector('.date');
    if (el) {
      el.textContent = getUserTime(); // insert the block class where today's date should be displayed <div class="date"></div>
    }
  }

  updateDate();
  setInterval(updateDate, 1000);
}
