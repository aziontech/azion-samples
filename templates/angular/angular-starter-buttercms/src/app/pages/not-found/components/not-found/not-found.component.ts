import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.error('Your Butter token might be set to an invalid value. Please verify your token is correct.');
  }

}
