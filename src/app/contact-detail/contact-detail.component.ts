import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../models/model';
import { ContactService } from '../services/contact.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss'],
})
export class ContactDetailComponent implements OnInit {
  @ViewChild('contactForm', { static: false }) contactForm?: NgForm;
  @ViewChild('emailForm', { static: false }) emailForm?: NgForm;

  public contact: Contact = {
    id: 0,
    firstName: '',
    lastName: '',
    emails: [],
    favorite: false,
  } as Contact;

  public newEmail: string = '';

  constructor(private contactService: ContactService, private dialog: MatDialog) {
    // When click on contact from sidebar set detail page
    this.contactService.getActiveContact().subscribe((contact) => {
      this.contact = { ...contact };
      this.newEmail = '';
    });
  }

  ngOnInit(): void {}

  // Save contact
  onSaveContact() {
    // Check if contact is edit or new contact based on Id field
    if (this.contact.id) {
      this.contactService.put(this.contact, this.contact);
    } else {
      this.contactService.post(this.contact);
    }
    this.contactForm?.resetForm();
  }

  // Cancel active selection as well as reset form
  onCancelContact() {
    this.contactService.resetSelection();
    this.contactForm?.resetForm();
    this.emailForm?.resetForm();
    this.newEmail = '';
  }

  // Delete contact
  onDeleteContact() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure want to delete the contact?',
        buttonText: {
          ok: 'Save',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        if (this.contact.id) {
          this.contactService.delete(this.contact);
        }
      }
    });
  }

  // Add new email to new or existing contact
  onAddEmail() {
    if (!this.contact.emails) this.contact.emails = [];
    this.contact.emails.push(this.newEmail || '');
    this.emailForm?.resetForm();
    this.newEmail = '';
  }

  // Delete email
  onDeleteEmail(index: number) {
    this.contact.emails.splice(index, 1);
  }
}
