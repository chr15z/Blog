import { Injectable } from '@angular/core';
import {UserDTO} from "../dtos/userDTO";
import { ValidationException } from '../exception/ValidationException';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
   currentUsers: UserDTO[] = [];

  public addUserToNewsletter(user: UserDTO): void {
    if (this.isUserValidAndUnset(user)) {
      this.currentUsers.push(user);
    }

  }

  private isUserValidAndUnset(user: UserDTO): boolean {
    console.log("validateForUpdate", user);
    const validationErrors: string[] = [];

    if (user.name.length <= 0 || user.name.length > 40) {
      validationErrors.push("- Username must be between 1 and 40 characters long.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      validationErrors.push("- Invalid email format.");
    }

    const userAlreadyExists = this.currentUsers.some(existingUser => existingUser.email === user.email);
    if (userAlreadyExists) {
      validationErrors.push("- User is already part of the newsletter.");
    }

    if (validationErrors.length > 0) {
      throw new ValidationException("Validation of user for update failed", validationErrors);
    } else {
      return true;
    }

  }
}
