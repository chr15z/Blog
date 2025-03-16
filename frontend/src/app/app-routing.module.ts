import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from "./components/notFound/notFound.component";
import {AboutMeComponent} from "./components/aboutMe/aboutMe.component";
import {SudokuComponent} from "./components/sudoku/sudoku.component";
import {ContactComponent} from "./components/contact/contact.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'notFound', component: NotFoundComponent},
  {path: 'aboutMe', component: AboutMeComponent},
  {path: 'sudoku', component: SudokuComponent},
  {path: 'contact', component: ContactComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
