import Butter from 'buttercms';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ButtercmssdkService {
  constructor(private router: Router) {
  }

  getButterCMS() {
    const butterCmsPreview =
      process.env.NG_APP_ANGULAR_BUTTER_CMS_PREVIEW === undefined ? true :
      !(process.env.NG_APP_ANGULAR_BUTTER_CMS_PREVIEW === 'false' ||
      process.env.NG_APP_ANGULAR_BUTTER_CMS_PREVIEW === '0');
    return Butter(process.env.NG_APP_ANGULAR_BUTTER_CMS_API_KEY, butterCmsPreview);
  }

  navigateToNotFound() {
    this.router.navigate(['404']);
  }

}
