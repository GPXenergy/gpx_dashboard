import { Component, OnInit } from '@angular/core';
import { AuthService } from '@gpx/services/auth.service';
import { User } from '@gpx/models/user.model';

@Component({
  selector: 'setup-guide-view',
  templateUrl: './setup-view.component.html',
  styleUrls: ['./setup-view.component.scss'],
})
export class SetupViewComponent implements OnInit {
  user: User;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.authService.user.then(user => {
      this.user = user;
    }).catch(e => {
      // Well this is awkward
    });
  }

}
