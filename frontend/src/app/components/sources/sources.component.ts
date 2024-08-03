import { Component, OnInit, AfterViewInit } from '@angular/core';
import {DropdownService} from "../../services/dropdown.service";

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit, AfterViewInit {

  isDropdownOpen = false;
  activeTabId = 0;
  tabs = [
    { id: 0, title: 'Icons', content: 'Font Awesome is a widely-used icon toolkit and font library, providing scalable vector icons customizable with CSS. Launched in 2012, it offers a comprehensive collection of icons, including social media logos and UI elements. The icons\' scalability ensures they remain sharp at any size, making them ideal for responsive design. Customizable with CSS, Font Awesome icons can easily match a website\'s aesthetics. Available via CDN or download, the library is user-friendly and includes accessibility features. The Pro version adds even more icons and advanced features for those needing extra functionality', imgUrl: 'assets/images/icons.png' },
    { id: 1, title: 'Templates', content: 'CodePen is an online community and platform for testing and showcasing HTML, CSS, and JavaScript code snippets. Launched in 2012 by Alex Vazquez, Tim Sabat, and Chris Coyier, it allows developers to create and share code in an interactive environment. CodePen\'s live preview feature helps users see changes in real time, making it an excellent tool for learning and experimentation. It supports a wide range of libraries and preprocessors, enhancing development flexibility. Users can explore and fork pens created by others, fostering collaboration and inspiration. The platform also offers a Pro version with additional features like asset hosting and live view synchronization.', imgUrl: 'assets/images/template.png' },
    { id: 2, title: 'Pictures', content: 'Pixabay is a free resource for high-quality images, videos, and music, available for both personal and commercial use. Launched in 2010, it offers a vast collection of media contributed by photographers and creators worldwide. All content is released under a Creative Commons license, ensuring it\'s free of copyright restrictions. The platform\'s easy-to-use search and filter tools help users find the perfect media quickly. Pixabay also features a community where users can share and engage with content. For enhanced functionality, there’s a premium option with additional features and support.', imgUrl: 'assets/images/img.png' },
    { id: 3, title: 'Inspiration', content: 'Youtube CONTENT', imgUrl: 'assets/images/youtube.png' }
  ];
  constructor(private dropdownService: DropdownService) { }

  ngOnInit(): void {
    this.dropdownService.isDropdownOpen$.subscribe(state => {
      this.isDropdownOpen = state;
    });
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
