import { Component, OnInit } from '@angular/core';
import { HomePageSectionDTO } from '../../dtos/homePageSectionDTO';

@Component({
  selector: 'app-ticketLine',
  templateUrl: './ticketLine.component.html',
  styleUrls: ['./ticketLine.component.scss']
})
export class TicketLineComponent implements OnInit {
  images?: string[];

  constructor() {
        this.images = [
          "assets/images/sepm/sepm1.png",
          "assets/images/sepm/sepm2.png",
          "assets/images/sepm/sepm3.png",
          "assets/images/sepm/sepm4.png",
          "assets/images/sepm/sepm5.png",
          "assets/images/sepm/sepm6.png",
          "assets/images/sepm/sepm7.png",
          "assets/images/sepm/sepm8.png",
          "assets/images/sepm/sepm9.png",
          "assets/images/sepm/sepm10.png",
          "assets/images/sepm/sepm11.png",
          "assets/images/sepm/sepm12.png",
          "assets/images/sepm/sepm13.png",
          "assets/images/sepm/sepm14.png",
          "assets/images/sepm/sepm15.png",
          "assets/images/sepm/sepm16.png",
          "assets/images/sepm/sepm17.png",
        ];
  }

  ngOnInit() {}
}
