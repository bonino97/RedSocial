import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';


//COMPONENTES
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { SendedComponent } from './components/sended/sended.component';
import { ReceivedComponent } from './components/received/received.component';
import { MessagesModule } from './messages.module';


const messageRoutes: Routes = [
    {
        path: 'mensajes',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'recibidos', pathMatch: 'full'},
            { path: 'enviar', component:AddComponent},
            { path: 'recibidos', component:ReceivedComponent},
            { path: 'recibidos/:page', component:ReceivedComponent},
            { path: 'enviados', component:SendedComponent},
            { path: 'enviados/:page', component:SendedComponent}
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(messageRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MessagesRoutingModule{}