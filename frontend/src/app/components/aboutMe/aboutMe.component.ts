import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-notFound',
  templateUrl: './aboutMe.html',
  styleUrls: ['./aboutMe.component.scss']
})
export class AboutMeComponent implements OnInit {

  constructor() { }

  roles: string[] = [
    'I am a developer.',
    'I am a student.',
    'Check out my CV.',
  ];
  currentRoleIndex: number = 0;
  currentRole: string = this.roles[0];

  ngOnInit(): void {
    this.startRoleRotation();
  }

  startRoleRotation(): void {
    setInterval(() => {
      this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
      this.currentRole = this.roles[this.currentRoleIndex];
    }, 2000);
  }

}
