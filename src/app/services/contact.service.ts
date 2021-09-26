import { Injectable } from '@angular/core';
import { Contact } from '../models/model';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

const storageName = 'contact_list';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactList: Array<Contact>;
  private contact = new Subject<any>();
  private refreshList = new Subject<any>();

  constructor(private _snackBar: MatSnackBar) {
    this.contactList =
      JSON.parse(localStorage.getItem(storageName) || '[]') || [];
  }

  // Set contact Subject as Active
  setActiveContact(contact: Contact) {
    this.contact.next(contact);
  }

  // Get active contact
  getActiveContact(): Observable<Contact> {
    return this.contact.asObservable();
  }

  // Get list of contacts, apply filter if applicable
  get(name: string = '') {
    // Filter by either first name or last name and sort by first name
    return [...this.contactList]
      .filter(
        (x) =>
          x.firstName.toLowerCase().includes(name) ||
          x.lastName.toLowerCase().includes(name)
      )
      .sort((a, b) => a.firstName.localeCompare(b.firstName));
  }

  // Update contact
  private update() {
    localStorage.setItem(storageName, JSON.stringify(this.contactList));
    this.resetSelection();
    this.refresh();
    return this.get();
  }

  // Add new contact
  post(item: Contact) {
    this.contactList.push({ ...item, id: +new Date()});
    this.showSnackbar('Contact added successfully!');

    return this.update();
  }

  // Update existing contact
  put(item: Contact, changes: Contact) {
    Object.assign(this.contactList[this.findItemIndex(item)], changes);
    this.showSnackbar('Contact updated successfully!');

    return this.update();
  }

  // Delete contact
  delete(item: Contact) {
    const idx = this.contactList.findIndex((x) => x.id === item.id);
    this.contactList.splice(idx, 1);
    this.showSnackbar('Contact deleted successfully!');

    return this.update();
  }

  // Reset on cancel 
  resetSelection() {
    this.setActiveContact({
      id: 0,
      firstName: '',
      lastName: '',
      emails: [],
    } as Contact);
  }

  // Refresh contact list
  refresh() {
    this.refreshList.next();
  }

  getRefresh(): Observable<any> {
    return this.refreshList.asObservable();
  }

  // Helper function to find index
  private findItemIndex(item: Contact) {
    return this.contactList.findIndex(x => x.id === item.id);
  }

  // Helper function to show tostr using snackbar
  private showSnackbar(msg: string) {
    this._snackBar.open(msg, 'Ok', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 5000,
    });
  }
}
