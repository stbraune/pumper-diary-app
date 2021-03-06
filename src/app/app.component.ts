import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';

import { WorkoutCardsComponent } from './views/workout-cards';
import { WorkoutHistoryComponent } from './views/workout-history';
import { PlansComponent } from './views/plans';
import { ExercisesComponent } from './views/exercises';

@Component({
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;

  rootPage = WorkoutCardsComponent;
  pages: Array<{title: string, component: any}> = [
    { title: 'menu.workouts.title', component: WorkoutCardsComponent },
    { title: 'menu.workout-history.title', component: WorkoutHistoryComponent },
    { title: 'menu.plans.title', component: PlansComponent },
    { title: 'menu.exercises.title', component: ExercisesComponent }
  ];

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private translateService: TranslateService,
    private menu: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // TODO https://stackoverflow.com/questions/41373774/how-to-handle-back-button-on-ionic-2
      // this.platform.registerBackButtonAction(() => {
      //   const activeView = this.nav.getActive();
      //   if (!activeView) {
      //     return;
      //   }

      //   if (this.nav.canGoBack()) {
      //     console.log('going back');
      //     this.nav.pop();
      //   } else if (activeView.instance.handleBackButton) {
      //     console.log('asking the instance');
      //     activeView.instance.handleBackButton();
      //   } else {
      //     console.log('go to first');
      //     this.nav.parent.select(0);
      //   }
      // });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let userLang = navigator.language.split('-')[0];
      userLang = /(en|de|bg)/gi.test(userLang) ? userLang : this.platform.lang();

      this.translateService.setDefaultLang('en');
      this.translateService.use(userLang);

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
