import { Component, OnInit, AfterViewInit } from '@angular/core';
import {BlurService} from "../../services/blur.service";

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit, AfterViewInit {

  activeTabId = 0;
  tabs = [
    { id: 0, title: 'Icons', button: 'Visit Font Awesome', url:'https://fontawesome.com/',
      content: 'Font Awesome is a widely-used icon toolkit and font library, providing scalable vector icons customizable with CSS. Launched in 2012, it offers a comprehensive collection of icons, including social media logos and UI elements. \nThe icons\' scalability ensures they remain sharp at any size, making them ideal for responsive design. Customizable with CSS, Font Awesome icons can easily match a website\'s aesthetics. Available via CDN or download, the library is user-friendly and includes accessibility features. The Pro version adds even more icons and advanced features for those needing extra functionality', imgUrl: 'assets/images/icons.png'},
    { id: 1, title: 'Templates', button: 'Visit CodePen', url:'https://codepen.io/',
      content: 'CodePen is an online community and platform for testing and showcasing HTML, CSS, and JavaScript code snippets. Launched in 2012 by Alex Vazquez, Tim Sabat, and Chris Coyier, it allows developers to create and share code in an interactive environment. CodePen\'s live preview feature helps users see changes in real time, making it an excellent tool for learning and experimentation. It supports a wide range of libraries and preprocessors, enhancing development flexibility. Users can explore and fork pens created by others, fostering collaboration and inspiration. The platform also offers a Pro version with additional features like asset hosting and live view synchronization.', imgUrl: 'assets/images/template.png' },
    { id: 2, title: 'Pictures', button: 'Visit Pixaby', url:'https://pixabay.com/',
      content: 'Pixabay is a free resource for high-quality images, videos, and music, available for both personal and commercial use. Launched in 2010, it offers a vast collection of media contributed by photographers and creators worldwide. All content is released under a Creative Commons license, ensuring it\'s free of copyright restrictions. The platform\'s easy-to-use search and filter tools help users find the perfect media quickly. Pixabay also features a community where users can share and engage with content. For enhanced functionality, there’s a premium option with additional features and support.', imgUrl: 'assets/images/img.png' },
    { id: 3, title: 'Inspiration', button: 'Visit Youtube', url:'https://youtube.com/',
      content: 'YouTube is certainly not new to anyone, and it’s well known that the platform hosts countless content creators across almost every imaginable field—including coding. During my computer science studies, I developed an interest in web development, and one particular video inspired me to dive deeper into front-end design and creating clean websites. The video, titled "The Easiest Way to Build Websites," is from a YouTube channel called Sajid. Although I haven\'t explored much more from this channel, that video was a major source of inspiration for me.\nIn addition to Sajid, there are many other excellent coding channels worth checking out, such as Script Raccoon, freeCodeCamp, Kevin Chromik, and others.', imgUrl: 'assets/images/youtube.png' }
  ];
  constructor() { }

  ngOnInit(): void {
  }
  setActiveTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngAfterViewInit(): void {
    'use strict';
    const tabs = document.querySelectorAll('[data-id]');
    const contents = document.querySelectorAll('[data-content]');
    let id = 0;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs[id].classList.remove('active');
        tab.classList.add('active');
        id = Number(tab.getAttribute('data-id'));
        contents.forEach(box => {
          box.classList.add('hide');
          if (Number(box.getAttribute('data-content')) === id) {
            box.classList.remove('hide');
            box.classList.add('show');
          }
        });
      });
    });
  }
}
