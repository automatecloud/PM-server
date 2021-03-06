import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Process } from '@maps/models';

@Injectable()
export class MapDesignService {
  private updateProcessSubject: Subject<Process> = new Subject();
  public dropped: Subject<any> = new Subject<any>();
  public onDrop: boolean;
  public tabOpen: boolean;

  constructor() { }

  drop(x, y, cell) {
    this.dropped.next({ x: x, y: y, cell: cell });
  }

  getDrop(): Observable<{ x: number, y: number, cell: any }> {
    return this.dropped.asObservable();
  }

  updateProcess(process: Process) {
    this.updateProcessSubject.next(process);
  }

  getUpdateProcessAsObservable(): Observable<Process> {
    return this.updateProcessSubject.asObservable();
  }

}
