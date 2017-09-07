import { Component } from '@angular/core';
import {
  ModalController,
  ToastController,
  AlertController
} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Plan } from '../../model';

import { PlansService, ToastService } from '../../services';

import { PlanEditComponent } from './plan-edit';

@Component({
  selector: 'plans',
  templateUrl: './plans.component.html'
})
export class PlansComponent {
  public plans: Plan[] = [];

  public constructor(
    private translateService: TranslateService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastService: ToastService,
    private plansService: PlansService,
  ) {
  }

  public ionViewDidLoad(): void {
    this.loadPlans();
  }

  private loadPlans() {
    this.plansService.getPlans().subscribe((plans) => {
      this.plans = plans;
    });
  }

  public planSelected(plan: Plan): void {
    const copy = JSON.parse(JSON.stringify(plan));
    this.translateService.get([copy.title, copy.description]).subscribe((texts) => {
      copy.title = texts[copy.title];
      copy.description = texts[copy.description];

      let planEditModal = this.modalController.create(PlanEditComponent, {
        data: copy
      });
      planEditModal.onDidDismiss((result) => {
        if (result && result.success) {
          this.updatePlan(result.data);
        }
      });
      planEditModal.present();
    });
  }

  public confirmDeletePlan(plan: Plan): void {
    this.translateService.get(['plan-delete.title', 'plan-delete.prompt', 'yes', 'no'])
      .subscribe((texts) => {
        const alert = this.alertController.create({
          title: texts['plan-delete.title'],
          message: texts['plan-delete.prompt'],
          buttons: [
            {
              text: texts['no'],
              role: 'cancel'
            },
            {
              text: texts['yes'],
              handler: () => {
                this.deletePlan(plan);
              }
            }
          ]
        });
        alert.present();
      });
  }

  public addPlanClicked($event: any): void {
    let newPlan: Plan = {
      title: '',
      description: '',
      goals: []
    };
    let planEditModal = this.modalController.create(PlanEditComponent, {
      data: newPlan
    });
    planEditModal.onDidDismiss((result) => {
      if (result && result.success) {
        this.createPlan(result.data);
      }
    });
    planEditModal.present();
  }

  private createPlan(plan: Plan): void {
    this.plansService.postPlan(plan).subscribe((result) => {
      this.plans.push(result);
      this.toastService.showSuccessToast('save-plan-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('save-plan-failed', error);
    });
  }

  private updatePlan(plan: Plan): void {
    this.plansService.putPlan(plan).subscribe((result) => {
      const index = this.plans.findIndex((p) => p._id === plan._id);
      if (index !== -1) {
        this.plans.splice(index, 1, result);
      }
      this.toastService.showSuccessToast('save-plan-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('save-plan-failed', error);
    });
  }

  private deletePlan(plan: Plan): void {
    this.plansService.removePlan(plan).subscribe((result) => {
      const index = this.plans.indexOf(plan);
      if (index !== -1) {
        this.plans.splice(index, 1);
      }
      this.toastService.showSuccessToast('delete-plan-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('delete-plan-failed', error);
    })
  }
}
