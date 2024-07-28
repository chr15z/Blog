import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  private dropdownState = new BehaviorSubject<boolean>(false);
  isDropdownOpen$ = this.dropdownState.asObservable();

  setDropdownState(state: boolean) {
    this.dropdownState.next(state);
  }
}
