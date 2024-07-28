import { Injectable } from '@angular/core';
import {UserDTO} from "../dtos/userDTO";

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {


  public addUserToNewsletter(user: UserDTO): boolean {
    if (this.isUserValidAndUnset(user)) {
      return true;
    }
    return false;
  }

  private isUserValidAndUnset(user: UserDTO): void {
    console.log("validateForUpdate", user);
    const validationErrors: string[] = [];

    // Namenslänge überprüfen
    if (user.name.length <= 0 || user.name.length > 40) {
      validationErrors.push("Username must be between 1 and 40 characters.");
    }

    // Überprüfen, ob die E-Mail-Adresse ein gültiges Format hat
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      validationErrors.push("Invalid email format.");
    }

    // Wenn die Fehlerliste nicht leer ist, eine ValidationException werfen
    if (validationErrors.length > 0) {
      throw new ValidationException("Validation of user for update failed", validationErrors);
    }
}
