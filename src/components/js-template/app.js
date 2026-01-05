'use strict';

import pageNavigation from './modules/pageNavigation';
import headerFon from '../components/header/headerFon';
import Header from './../components/header/Header';
import ScrollUpButton from '../components/scrollUpButton/ScrollUpButton';
import scroller from './../components/scroller/scroller';
import Popup from './../components/popup/popup';
import shop from '../shop/shop';

window.addEventListener('DOMContentLoaded', () => {
  pageNavigation();
  headerFon();
  new Header();
  new ScrollUpButton();
  new Popup();
  scroller();
  shop();
});
