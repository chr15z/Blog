import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from './components/notFound/notFound.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {NgOptimizedImage} from "@angular/common";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import { AutoCompleteModule } from 'primeng/autocomplete';
import {AboutMeComponent} from "./components/aboutMe/aboutMe.component";
import {SudokuComponent} from "./components/projects/pSudoku/sudoku.component";
import {ContactComponent} from "./components/contact/contact.component";
import {MyJourneyComponent} from "./components/projects/pMyJourney/myJourney.component";
import {TicketLineComponent} from "./components/projects/pTicketLine/ticketLine.component";
import {BoxMentalistComponent} from "./components/projects/pBoxMentalist/boxMentalist.component";



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    AboutMeComponent,
    SudokuComponent,
    ContactComponent,
    TicketLineComponent,
    MyJourneyComponent,
    BoxMentalistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgOptimizedImage,
    BsDropdownModule.forRoot(),
    AutoCompleteModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
