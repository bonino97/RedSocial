export class Message {
    constructor(
        public _id:string,
        public text:string,
        public viewed:string,
        public created_at:string,
        public emmiter:string,
        public receiver:string
    ){}
}