import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { BsModalRef } from 'ngx-bootstrap';

import { Agent } from '@agents/models';

@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html',
  styleUrls: ['./edit-agent.component.scss']
})
export class EditAgentComponent implements OnInit {
  agent: Agent;
  name: string;
  tag: string = '';
  attributes:string[];
  result: Subject<{ name: string, attributes: string[] }> = new Subject();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    if(!this.attributes){
      this.attributes = []
    }
  }

  saveTag(){
    this.attributes.push(this.tag)
    this.tag = '';
  }

  deleteTag(tagIndex){
    this.attributes.splice(tagIndex,1)
  }

  onConfirm() {
    const attributes = this.attributes.map(o => {
      if (typeof (o) === 'string') {
        return o;
      }
    });
    this.result.next({ name: this.name, attributes });
    this.onClose();
  }

  onClose() {
    this.bsModalRef.hide();
  }

}
