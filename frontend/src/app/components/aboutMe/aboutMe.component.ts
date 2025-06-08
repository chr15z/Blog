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


  downloadPdf() {
    // URL zur PDF-Datei (entweder lokal oder auf einem Server gehostet)
    const pdfUrl = 'assets/CV.pdf';  // Wenn die Datei lokal im assets-Ordner liegt
    const pdfName = 'CV.pdf';  // Name der herunterzuladenden Datei

    // Erstelle einen unsichtbaren Link und löse den Download aus
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfName;
    link.click();
  }

  showPdf() {
    const pdfUrl = 'assets/CV.pdf';  // Lokale oder externe PDF-Datei

    // Öffne das PDF in einem neuen Tab/Fenster
    window.open(pdfUrl, '_blank');
  }

}
