import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/switchMap';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { AgentsService } from '../agents.service';
import { Agent, Group } from '@agents/models';
import {AgentsGroupUpsertFilterComponent} from '@agents/groups/agents-group-upsert-filter/agents-group-upsert-filter.component';

@Component({
  selector: 'app-agents-list',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.scss']
})
export class AgentsListComponent implements OnInit, OnDestroy {
  agentsStatus: any;
  agentsStatusReq: any;
  agents: [Agent];
  selectedAgent: Agent;
  agentsReq: any;
  updateReq: any;
  items: any[];
  selectedGroupSubscription: Subscription;
  selectedGroup: Group;
  constants : boolean = true;


  constructor(private agentsService: AgentsService,private modalService: BsModalService) {
  }

  ngOnInit() {

    this.agentsReq = this.agentsService.list().subscribe(agents => {
      this.agents = agents;
    });

    this.agentsService.getSelectedGroupAsObservable().subscribe((group) => {
      this.selectedGroup = group
    })

    this.agentsService.getUpdateGroupAsObservable().subscribe((group) => {
      this.selectedGroup = group
    })
    

    this.selectedGroupSubscription = this.agentsService
      .getSelectedGroupAsObservable()
      .subscribe(group => {
        this.selectedGroup = group;
        this.constants = true;
      });

    // get agents status to pass

    this.agentsStatusReq = Observable
      .timer(0, 5000)
      .switchMap(() => this.agentsService.status())
      .subscribe(statuses => {
        this.agentsStatus = statuses;
      });

    this.items = [
      { label: 'View', icon: 'fa-search', command: (event) => console.log('!') },
      { label: 'Delete', icon: 'fa-close', command: (event) => console.log('@') }
    ];
  }

  ngOnDestroy() {
    if (this.agentsReq) {
      this.agentsReq.unsubscribe();
    }
    if (this.updateReq) {
      this.updateReq.unsubscribe();
    }
    if (this.agentsStatusReq) {
      this.agentsStatusReq.unsubscribe();
    }
  }

  
  addNewFilterParam(group:Group){
    const modal = this.modalService.show(AgentsGroupUpsertFilterComponent);
    modal.content.edit = false;
    modal.content.result
      .take(1)
      .subscribe(filters => {
        group.filters.push(filters)
        this.agentsService.updateGroupToServer(group).subscribe((group) => {
          this.agentsService.updateGroup(group)
        })
      });
  }


  onSelectAgent(agent) {
    this.selectedAgent = agent;
  }

  dragStart($event, agent) {
    this.agentsService.dragStart(agent);
  }

  removeAgentFromGroup(agentId: string, groupId: string) {
    this.agentsService.removeAgentFromGroup(agentId, groupId)
      .take(1)
      .subscribe(group => {
        this.agentsService.updateGroup(group);
      });
  }

  showAgents(){
    this.constants = true;
  }
  showFilters(){
    this.constants = false;
  }
}
