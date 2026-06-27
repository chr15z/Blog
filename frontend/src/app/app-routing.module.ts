import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from "./components/notFound/notFound.component";
import {AboutMeComponent} from "./components/aboutMe/aboutMe.component";
import {SudokuComponent} from "./components/projects/pSudoku/sudoku.component";
import {MyJourneyComponent} from "./components/projects/pMyJourney/myJourney.component";
import {ContactComponent} from "./components/contact/contact.component";
import {TicketLineComponent} from "./components/projects/pTicketLine/ticketLine.component";
import {BoxMentalistComponent} from "./components/projects/pBoxMentalist/boxMentalist.component";
import {PHomeDashboardComponent} from "./components/projects/pHomeDashboard/pHomeDashboard.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'notFound', component: NotFoundComponent},
  {path: 'aboutMe', component: AboutMeComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'sudoku', component: SudokuComponent},
  {path: 'myJourney', component: MyJourneyComponent},
  {path: 'ticketLine', component: TicketLineComponent},
  {path: 'boxMentalist', component: BoxMentalistComponent},
  {path: 'homeDashboard', component: PHomeDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
