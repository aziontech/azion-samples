import { NgModule } from '@angular/core';
import { COMPONENTS, IMPORTS, SERVICES } from '.';
import { AppComponent } from './app.component';
import {Location, PathLocationStrategy} from '@angular/common';

const _orig_prepareExternalUrl = PathLocationStrategy.prototype.prepareExternalUrl;

PathLocationStrategy.prototype.prepareExternalUrl = function(internal) {
  const url = _orig_prepareExternalUrl.call(this, internal);

  if (url === '') {
    return url;
  }
  if (url.includes('search/?') && url.endsWith('%2F')) {
    return url.slice(0, -3);
  }
  if (url.includes('search?')) {
    return url.replace('search?', 'search/?');
  }
  if (url.endsWith('/')) {
    return url;
  }
  return url + '/';
};

Location.stripTrailingSlash = function (url) {
  const match = url.match(/#|\?|$/);
  const pathEndIdx = match && match.index || url.length;
  const droppedSlashIdx = pathEndIdx - (url[pathEndIdx - 1] === '/' ? 1 : 0);
  const first = url.slice(0, droppedSlashIdx);
  const last = url.slice(pathEndIdx);

  return first + '/' + last;
};

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...IMPORTS
  ],
  providers: [
    ...SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
