import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  @Output() searchChange = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(event) {
    if (event.target.search.value) {
      this.searchChange.emit(event.target.search.value);
    }
  }

}
