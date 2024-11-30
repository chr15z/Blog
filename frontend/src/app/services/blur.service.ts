import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlurService {
  private blurState = new BehaviorSubject<boolean>(false);
  isBlurred = this.blurState.asObservable();

  setBlurState(state: boolean) {
    this.blurState.next(state);
  }
}
