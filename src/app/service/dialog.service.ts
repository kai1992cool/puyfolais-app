import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog,private router: Router) { }

  openConfirmationDialog(message: string, redirection: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: message
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl(redirection);
    });
  }
}
