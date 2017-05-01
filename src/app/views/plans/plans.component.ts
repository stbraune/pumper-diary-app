import { Component } from '@angular/core';
import {
  ModalController,
  ToastController
} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Plan } from '../../model';

import { PlansService } from '../../services';

import { PlanEditComponent } from './plan-edit';

@Component({
  selector: 'plans',
  templateUrl: './plans.component.html'
})
export class PlansComponent {
  public constructor(
    private translateService: TranslateService,
    private modalController: ModalController,
    private toastController: ToastController,
    private plansService: PlansService,
  ) {
  }

  public getPlans() {
    return this.plansService.getPlans();
  }

  public planSelected(plan: Plan): void {
    let planEditModal = this.modalController.create(PlanEditComponent, {
      data: JSON.parse(JSON.stringify(plan))
    });
    planEditModal.onDidDismiss((result) => {
      if (result && result.success) {
        this.plansService.updatePlan(result.data).subscribe((result) => {
          console.log('plan saved');
        }, (error) => {
          Observable.forkJoin(
            this.translateService.get('save-plan-failed'),
            this.translateService.get('close')
          ).subscribe((texts) => {
            this.toastController.create({
              message: texts[0],
              showCloseButton: true,
              closeButtonText: texts[1]
            }).present();
          });
        });
      }
    });
    planEditModal.present();
  }

  public addPlanClicked($event: any): void {
    let newPlan: Plan = {
      id: 0,
      title: '',
      description: '',
      goals: []
    };
    let planEditModal = this.modalController.create(PlanEditComponent, {
      data: newPlan
    });
    planEditModal.onDidDismiss((result) => {
      if (result && result.success) {
        this.plansService.createPlan(newPlan).subscribe((result) => {
          console.log('plan saved');
        }, (error) => {
          Observable.forkJoin(
            this.translateService.get('save-plan-failed'),
            this.translateService.get('close')
          ).subscribe((texts) => {
            this.toastController.create({
              message: texts[0],
              showCloseButton: true,
              closeButtonText: texts[1]
            }).present();
          });
        });
      }
    });
    planEditModal.present();
  }
}
