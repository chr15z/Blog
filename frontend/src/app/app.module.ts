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
import {httpInterceptorProviders} from './interceptors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {NgOptimizedImage} from "@angular/common";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import { AutoCompleteModule } from 'primeng/autocomplete';
import {AboutMeComponent} from "./components/aboutMe/aboutMe.component";
import {SudokuComponent} from "./components/pSudoku/sudoku.component";
import {ContactComponent} from "./components/contact/contact.component";
import {MyJourneyComponent} from "./components/pMyJourney/myJourney.component";
import {TicketLineComponent} from "./components/pTicketLine/ticketLine.component";
import {FootballComponent} from "./components/football/football.component";



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
    FootballComponent
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
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
