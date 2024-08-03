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
    { id: 0, title: 'Icons', content: 'FONT AWESOME CONTENT', imgUrl: 'assets/images/icons.png' },
    { id: 1, title: 'Templates', content: 'Code Pen CONTENT', imgUrl: 'assets/images/template.png' },
    { id: 2, title: 'Pictures', content: 'Pixaby CONTENT', imgUrl: 'assets/images/img.png' },
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
