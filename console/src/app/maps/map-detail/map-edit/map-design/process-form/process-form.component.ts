import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Process, Action, ActionParam, ProcessViewWrapper } from '@maps/models';
import { Plugin } from '@plugins/models/plugin.model';
import { PluginMethod } from '@plugins/models/plugin-method.model';
import { PluginMethodParam } from '@plugins/models/plugin-method-param.model';
import { SocketService } from '@shared/socket.service';
import { PluginsService } from '@plugins/plugins.service';
import { MapDesignService } from '@maps/map-detail/map-edit/map-design.service';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConfirmComponent } from '@shared/confirm/confirm.component';
import {FLOW_CONTROL_TYPES, COORDINATION_TYPES}  from '@maps/constants'

@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss']
})
export class ProcessFormComponent implements OnInit, OnDestroy {
  @Input('processViewWrapper') processViewWrapper: ProcessViewWrapper;
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  formValueChangeSubscription: Subscription;
  processUpdateSubscription: Subscription;
  processForm: FormGroup;
  action: boolean = false;
  index: number;
  methods: object = {};
  bsModalRef: BsModalRef;
  selectedMethod: PluginMethod;
  FLOW_CONTROL_TYPES  = FLOW_CONTROL_TYPES;
  COORDINATION_TYPES = COORDINATION_TYPES;

  constructor(
    private socketService: SocketService,
    private pluginsService: PluginsService,
    private mapDesignService: MapDesignService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    if (!this.processViewWrapper.process) {
      this.closePane();
      return;
    }
    this.processForm = Process.getFormGroup(this.processViewWrapper.process);

    this.processUpdateSubscription = this.mapDesignService
      .getUpdateProcessAsObservable()
      .filter(process => process.uuid === this.processViewWrapper.process.uuid)
      .subscribe(process => {
        this.processForm.get('coordination').setValue(process.coordination);
      });

    // this.process = new Process(this.process);

    this.generateAutocompleteParams();
    if (this.processViewWrapper.process.actions) {
      this.processViewWrapper.process.actions.forEach((action, actionIndex) => {
        const actionControl = <FormArray>this.processForm.controls['actions'];
        actionControl.push(this.initActionController(action));
        
        let pluginMethod = this.processViewWrapper.plugin.methods.find(o => o.name === action.method)
        if (pluginMethod && pluginMethod.params && pluginMethod.params.length > 0) {
          pluginMethod.params.forEach(pluginParam => {
            let actionParam = action.params.find(p => p.name == pluginParam.name)
            actionControl.controls[actionIndex]['controls'].params.push(PluginMethodParam.getFormGroup( pluginParam ,actionParam));
          });
        }
      });
    }


    // subscribe to changes in form
    this.formValueChangeSubscription = this.processForm.valueChanges
      .debounceTime(300)
      .pipe(distinctUntilChanged())
      .filter(formvalue => this.processForm.valid)
      .subscribe(formValue => {
        this.saved.emit(this.processForm.value);
      });
  }

  ngOnDestroy(): void {
    if (this.processUpdateSubscription) {
      this.processUpdateSubscription.unsubscribe();
    }
    if (this.formValueChangeSubscription) {
      this.formValueChangeSubscription.unsubscribe();
    }
  }

  /**
   * if the plugin has autocomplete method it generates them
   */
  generateAutocompleteParams() {
    if (!this.processViewWrapper.plugin) return;
    Observable.from(this.processViewWrapper.plugin.methods)
      .filter(method => this.methodHaveParamType(method, 'autocomplete')) // check if has autocomplete
      .flatMap(method => {
        return Observable.forkJoin(
          Observable.of(method), // the method
          this.pluginsService.generatePluginMethodsParams(this.processViewWrapper.plugin._id, method.name) // generated params
        );
      })
      .map(data => {
        data[1].forEach(param => {
          data[0].params[
            data[0].params.findIndex(o => o.name === param.name)
          ] = param;
        });
        return data[0];
      })
      .subscribe(method => {
        this.processViewWrapper.plugin.methods[
          this.processViewWrapper.plugin.methods.findIndex(o => o.name === method.name)
        ] = method;
        this.addToMethodContext(method);
      });

    Observable.from(this.processViewWrapper.plugin.methods)
      .filter(method => this.methodHaveParamType(method, 'options'))
      .subscribe(method => {
        this.addToMethodContext(method);
      });
  }

  addToMethodContext(method) {
    this.methods[method.name] = method;
  }

  methodHaveParamType(method: PluginMethod, type: string): boolean {
    return method.params.findIndex(p => p.type === type) > -1;
  }


  runAction(action){
    if(this.processViewWrapper.plugin){
      return action();
    }
    else{
      this.bsModalRef = this.modalService.show(ConfirmComponent);
      this.bsModalRef.content.title = 'Plugin missing'
      this.bsModalRef.content.message = `This process uses the plugin ${this.processViewWrapper.process.used_plugin.name} which have been removed.\nPlease reinstall the plugin to enable editing.`;
      this.bsModalRef.content.cancel = null;
      this.bsModalRef.content.confirm = 'Confirm'
    }
  }

  /**
   * Add a new action to process
   */
  addNewAction() {
    this.runAction(()=>{
      const actionControl = <FormArray>this.processForm.controls['actions'];
      actionControl.push(this.initActionController());
      this.editAction(actionControl.length - 1); // switch to edit the new action
    })
  }

  backToProcessView() {
    this.action = false;
    this.index = null;
    this.selectedMethod = null;
  }

  /**
   * Removing an action at index
   * @param {number} index
   */
  removeAction(index: number) {
    (<FormArray>this.processForm.controls['actions']).removeAt(index);
  }

  /**
   * Setting editing as action
   * @param {number} index
   */
  editAction(index: number) {
      this.runAction(()=>{
        this.action = true;
        this.index = index;
        
      })
  }

  /**
   * Returning a FormGroup with process action fields
   * @param action
   * @returns {FormGroup}
   */
  initActionController(action?: Action): FormGroup {
    return Action.getFormGroup(action);
  }

  /**
   * Called from the template once user changes a method
   */
  onSelectMethod() {
    const methodName = this.processForm.value.actions[this.index].method;
    const action = this.processForm.controls['actions']['controls'][this.index];
    this.selectedMethod = this.processViewWrapper.plugin.methods.find(o => o.name === methodName);
    this.clearFormArray(action.controls.params);
    if (!this.selectedMethod) {
      this.socketService.setNotification({
        title: 'OH OH',
        message: 'Unexpected error, please try again.'
      });
      return;
    }
    this.selectedMethod.params.forEach(param => {
      action.controls.params.push(PluginMethodParam.getFormGroup(param));
    })
  }


  /**
   * Emitting close event
   */
  closePane() {
    this.close.emit();
  }

  /**
   * Emitting delete event
   */
  deleteProcess() {
    this.delete.emit();
  }

  /**
   * Emitting form change when mouse up event happened over action
   * @param event
   */
  onMouseUp(event) {
    setTimeout(() => {
      this.processForm.controls.actions.updateValueAndValidity();
    }, 0);
  }

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
}
