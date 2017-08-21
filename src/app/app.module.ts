import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import {
  PlansService,
  ExercisesService,
  MeasurementsService,
  UnitConverterService,
  ScoreCalculatorService
} from './services';

import {
  NumericUpDownSmallComponent,
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
  ExerciseEditComponent
} from './views/exercises';

@NgModule({
  declarations: [
    AppComponent,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,

    NumericUpDownSmallComponent,
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
    ExerciseEditComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
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
    AppComponent,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,

    NumericUpDownSmallComponent,
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
    UnitConverterService,
    ScoreCalculatorService,

    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {}
