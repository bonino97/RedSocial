import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit{
    public title:string;
    public user:User;
    public identity;
    public token;
    public status:string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Editar perfil';
        this.user = this._userService.getIdentity();
        this.identity = this.user;
        this.token = this._userService.getToken();
    }

    ngOnInit(){
        console.log('UserEditComponent cargado...');
        console.log(this.user);
    }
    onSubmit(){
        console.log(this.user);
    }
}
