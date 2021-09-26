import { Component } from '@angular/core';
import { Contact } from './models/model';
import { ContactService } from './services/contact.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Address Book';
  constructor(private contactService:ContactService){

  }

  // Add new contact button click
  onAddClick() {
    this.contactService.setActiveContact({} as Contact)
  }
}
