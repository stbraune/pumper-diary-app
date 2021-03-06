import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Insomnia } from '@ionic-native/insomnia';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoaderFactory } from './translate-http-loader-factory';

import { AppComponent } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import {
  BeepService,
  DatabaseService,
  DateFormatService,
  PlansService,
  ExercisesService,
  MeasurementsService,
  NotificationService,
  UnitConverterService,
  ScoreCalculatorService,
  ToastService,
  WorkoutsService,
  WorkoutCardsService
} from './services';

import {
  SplitPipe
} from './pipes';

import {
  ProgressBarComponent
} from './views/progress-bar';

import {
  NumericUpDownSmallComponent,
  NumericUpDownLargeComponent,
  MeasurementControlSmallComponent,
  MeasurementControlLargeComponent,
  MeasurementDisplayComponent,
  CaloriesControlSmallComponent,
  CaloriesControlLargeComponent,
  CaloriesDisplayComponent,
  DistanceControlSmallComponent,
  DistanceControlLargeComponent,
  DistanceDisplayComponent,
  DurationControlSmallComponent,
  DurationControlLargeComponent,
  DurationDisplayComponent,
  RepetitionsControlSmallComponent,
  RepetitionsControlLargeComponent,
  RepetitionsDisplayComponent,
  WeightControlSmallComponent,
  WeightControlLargeComponent,
  WeightDisplayComponent,
  ChronometerComponent,
  ChronometerControlComponent
} from './views/measurements';

import {
  WorkoutCardsComponent,
  WorkoutComponent,
  ActionStepComponent,
  PauseStepComponent,
  SlideHostDirective
} from './views/workout-cards';

import {
  WorkoutHistoryComponent,
  WorkoutViewComponent,
  WorkoutEditComponent,
  SetViewComponent,
  SetEditComponent
} from './views/workout-history';

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
    SplitPipe,

    AppComponent,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,

    ProgressBarComponent,

    NumericUpDownSmallComponent,
    NumericUpDownLargeComponent,
    MeasurementControlSmallComponent,
    MeasurementControlLargeComponent,
    MeasurementDisplayComponent,
    CaloriesControlSmallComponent,
    CaloriesControlLargeComponent,
    CaloriesDisplayComponent,
    DistanceControlSmallComponent,
    DistanceControlLargeComponent,
    DistanceDisplayComponent,
    DurationControlSmallComponent,
    DurationControlLargeComponent,
    DurationDisplayComponent,
    RepetitionsControlSmallComponent,
    RepetitionsControlLargeComponent,
    RepetitionsDisplayComponent,
    WeightControlSmallComponent,
    WeightControlLargeComponent,
    WeightDisplayComponent,
    ChronometerComponent,
    ChronometerControlComponent,

    WorkoutCardsComponent,
    WorkoutComponent,
    ActionStepComponent,
    PauseStepComponent,
    SlideHostDirective,

    WorkoutHistoryComponent,
    WorkoutViewComponent,
    WorkoutEditComponent,
    SetViewComponent,
    SetEditComponent,

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
        useFactory: TranslateHttpLoaderFactory,
        deps: [ Http ]
      }
    })
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    AppComponent,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    
    WorkoutCardsComponent,
    WorkoutComponent,
    ActionStepComponent,
    PauseStepComponent,
    
    WorkoutHistoryComponent,
    WorkoutViewComponent,
    WorkoutEditComponent,

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
    Insomnia,
    BackgroundMode,
    LocalNotifications,
    
    BeepService,
    DatabaseService,
    DateFormatService,
    PlansService,
    ExercisesService,
    MeasurementsService,
    NotificationService,
    UnitConverterService,
    ScoreCalculatorService,
    ToastService,
    WorkoutsService,
    WorkoutCardsService,

    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {}
