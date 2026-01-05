export default function tabs() {
  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach((item) => {
      //скрытие всех табов (контента)
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach((item) => {
      //убираем класс активности у кнопок табов
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    //i = 0 === параметр по умолчанию => передаем первый слайд (функция показа таба)
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (e.target === item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });
}
/*
Add in HTML
<div class="tabcontainer">
    <div class="tabheader">
        <ul class="tabheader__items">
            <li class="tabheader__item tabheader__item_active"></li>
            <li class="tabheader__item"></li>
        </ul>
    </div>
    <div class="tabcontent"></div>
    <div class="tabcontent"></div>
</div>
*/
