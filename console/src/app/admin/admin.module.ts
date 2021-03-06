import { AgentsComponent } from '@agents/agents/agents.component';
import { GroupsComponent } from '@agents/groups/groups.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { AgentsListComponent } from '@agents/agents-list/agents-list.component';
import { PluginUploadComponent } from '@plugins/plugin-upload/plugin-upload.component';
import { PluginsListComponent } from '@plugins/plugins-list/plugins-list.component';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { InputPopupComponent } from '@agents/groups/input-popup/input-popup.component';
import { EditAgentComponent } from '@agents/edit-agent/edit-agent.component';
import {AgentsGroupUpsertComponent} from '@agents/agents-group-upsert/agents-group-upsertcomponent';
import {ConstantAgentsListComponent} from '@agents/agents-list/constant-agents-list/constant-agents-list.component';
import {AgentsGroupUpsertFilterComponent} from '@agents/groups/agents-group-upsert-filter/agents-group-upsert-filter.component';
import {AgentsGroupFiltersListComponent} from '@agents/groups/agents-group-filters-list/agents-group-filters-list.component'
import { VaultComponent } from '../vault/vault/vault.component'
import  { UpsertVaultItemsComponent} from '../vault/upsert-vault-items/upsert-vault-items.component'
import {PluginSettingsComponent} from '@plugins/plugin-settings/plugin-settings.component'


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    TooltipModule,
    AccordionModule,
    SharedModule
  ],
  declarations: [
    AdminComponent,
    PluginUploadComponent,
    PluginsListComponent,
    PluginSettingsComponent,
    AgentsListComponent,
    AgentsComponent,
    GroupsComponent,
    InputPopupComponent,
    EditAgentComponent,
    AgentsGroupUpsertComponent,
    ConstantAgentsListComponent,
    AgentsGroupUpsertFilterComponent,
    AgentsGroupFiltersListComponent,
    VaultComponent,
    UpsertVaultItemsComponent
  ],
  entryComponents: [PluginUploadComponent, InputPopupComponent, EditAgentComponent, AgentsGroupUpsertComponent,AgentsGroupUpsertFilterComponent, UpsertVaultItemsComponent]
})
export class AdminModule { }
