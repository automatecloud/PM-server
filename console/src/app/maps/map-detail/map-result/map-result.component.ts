import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapsService } from '../../maps.service';
import { Map } from '../../models/map.model';
import { Subscription } from 'rxjs/Subscription';
import { MapResult } from '../../models/execution-result.model';

@Component({
  selector: 'app-map-result',
  templateUrl: './map-result.component.html',
  styleUrls: ['./map-result.component.scss']
})
export class MapResultComponent implements OnInit, OnDestroy {
  map: Map;
  mapSubscription: Subscription;
  executionListReq: any;
  executionsList: MapResult[];
  selectedExecution: MapResult;
  selectedExecutionReq: any;
  executionLogsReq: any;
  selectedExecutionLogs: any[];
  selectedAgent: string = 'aggregated';
  selectedProcess: any;
  agProcessesStatus: [{ name: string, value: number }];
  result: any;
  colorScheme = {
    domain: ['#42bc76', '#f85555', '#ebb936']
  };

  constructor(private mapsService: MapsService) {
  }

  ngOnInit() {
    this.mapSubscription = this.mapsService.getCurrentMap().subscribe(map => {
      if (!map) {
        return;
      }
      this.map = map;
      this.getExecutionList();
    });
  }

  ngOnDestroy() {
    this.mapSubscription.unsubscribe();
    this.executionListReq.unsubscribe();
  }

  changeAgent() {
    let agentResult = this.selectedExecution.agentsResults.find((o) => {
      return o.agent === this.selectedAgent;
    });
    if (!agentResult) {
      this.result = this.selectedExecution.agentsResults;
    } else {
      this.result = [agentResult];
    }
  }

  getExecutionList() {
    this.executionListReq = this.mapsService.executionResults(this.map.id).subscribe(executions => {
      this.executionsList = executions;
    });
  }

  selectExecution(executionId) {
    this.selectedProcess = null;
    this.selectedExecutionReq = this.mapsService.executionResultDetail(this.map.id, executionId).subscribe(result => {
      this.selectedExecution = result;
      this.changeAgent();
      this.executionLogsReq = this.mapsService.logsList(this.map.id, this.selectedExecution.runId).subscribe(logs => {
        this.selectedExecutionLogs = logs;
      });
      let processes = [];
      result.agentsResults.forEach(agent => {
        processes = [...processes, ...agent.processes];
      });
      this.aggregateProcessesStatus(processes);
    });

  }

  aggregateProcessesStatus(processes) {
    let ag = processes.reduce((total, current) => {
      total[current.status].value = (total[current.status].value || 0) + 1;
      return total;
    }, {
      success: { name: 'success', value: 0 },
      error: { name: 'error', value: 0 },
      partial: { name: 'partial', value: 0 }
    });
    let result = Object.keys(ag).map((key) => {
      return ag[key];
    });
    this.agProcessesStatus = <[{ name: string, value: number }]>result;
    console.log(this.agProcessesStatus);
  }

  selectProcess(process) {
    this.selectedProcess = process;
  }

}