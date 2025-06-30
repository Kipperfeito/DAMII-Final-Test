export class Usuario{
    public id:      string;
    public nome:    string;
    public email:   string;
    public senha:   string;
    public fone:    string;

    constructor(obj?: Partial<Usuario>){
        if (obj){
            this.id     = obj.id
            this.nome   = obj.nome
            this.email  = obj.email
            this.senha  = obj.senha
            this.fone   = obj.fone
        }
    }

    toString(){
        const objeto=`{
            "id":    "${this.id}",
            "nome":  "${this.nome}",
            "email": "${this.email}",
            "senha": "${this.senha}",
            "fone":  "${this.fone}"
        }`
        return objeto
    }

    toFirestore(){
        const usuario={
            id:     this.id,
            nome:   this.nome,
            email:  this.email,
            senha:  this.senha,
            fone:   this.fone
        }
        return usuario
    }

}