//MODULOS.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';

//RUTAS
import { MessagesRoutingModule } from './messages-routing.module';

//COMPONENTES
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { SendedComponent } from './components/sended/sended.component';
import { ReceivedComponent } from './components/received/received.component';


@NgModule({
    declarations: [
        MainComponent,
        AddComponent,
        SendedComponent,
        ReceivedComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MessagesRoutingModule,
        MomentModule
    ],
    exports:[
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SendedComponent
    ],
    providers: []
})

export class MessagesModule{}