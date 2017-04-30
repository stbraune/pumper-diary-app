import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, Http } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {
  PlansService,
  ExercisesService,
  MeasurementsService
} from './services';

import {
  MeasurementControlSmallComponent,
  CaloriesControlSmallComponent,
  DistanceControlSmallComponent,
  DurationControlSmallComponent,
  RepetitionsControlSmallComponent,
  WeightControlSmallComponent
} from './views/measurements';

import {
  PlansComponent,
  PlanEditComponent,
  GoalEditComponent,
  EntryPauseComponent,
  EntryActionComponent,
  EntryPopoverMenuComponent
} from './views/plans';

import {
  ExercisesComponent,
  ExerciseAddComponent,
  ExerciseEditComponent
} from './views/exercises';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,

    MeasurementControlSmallComponent,
    CaloriesControlSmallComponent,
    DistanceControlSmallComponent,
    DurationControlSmallComponent,
    RepetitionsControlSmallComponent,
    WeightControlSmallComponent,

    PlansComponent,
    PlanEditComponent,
    GoalEditComponent,
    EntryPauseComponent,
    EntryActionComponent,
    EntryPopoverMenuComponent,

    ExercisesComponent,
    ExerciseAddComponent,
    ExerciseEditComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [ Http ]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,

    MeasurementControlSmallComponent,
    CaloriesControlSmallComponent,
    DistanceControlSmallComponent,
    DurationControlSmallComponent,
    RepetitionsControlSmallComponent,
    WeightControlSmallComponent,

    PlansComponent,
    PlanEditComponent,
    GoalEditComponent,
    EntryPauseComponent,
    EntryActionComponent,
    EntryPopoverMenuComponent,

    ExercisesComponent,
    ExerciseAddComponent,
    ExerciseEditComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Vibration,
    NativeAudio,
    
    PlansService,
    ExercisesService,
    MeasurementsService,

    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
