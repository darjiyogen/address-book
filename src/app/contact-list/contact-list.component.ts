import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/model';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  public contactList: Array<Contact> = [];
  public selectedContact?: Contact;
  public search?:string;

  constructor(private contactService:ContactService ) { 
    // Refresh list
    this.contactService.getRefresh().subscribe(()=>{
      this.getContacts();
    });
    // Set selected contact as active one
    this.contactService.getActiveContact().subscribe((contact) => {
      this.selectedContact = contact;
    });
  }

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(search:string = ""){
    this.contactList = this.contactService.get(search);
  }

  // Filer contact list by first or last name
  onFilterContact(){
    this.getContacts(this.search);
  }

  // Set detail page based on selected contact
  onClickContact(contact: Contact){
    this.selectedContact = contact;
    this.contactService.setActiveContact(contact);
  }
}
