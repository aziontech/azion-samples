import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  @Input() categories;
  @Output() categoryChange = new EventEmitter();

  constructor() {
  }


  ngOnInit(): void {
  }

  navigateToCategory(slug) {
    this.categoryChange.emit(slug);
  }

}
