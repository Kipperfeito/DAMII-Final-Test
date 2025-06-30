export class Produto{
    public id:       string;
    public descricao:string;
    public preco:    string;
    public estoque:  string;
    public foto:     string;

    constructor(obj?: Partial<Produto>){
        if (obj){
            this.id         = obj.id
            this.descricao  = obj.descricao
            this.preco      = obj.preco
            this.estoque    = obj.estoque
            this.foto       = obj.foto
        }
    }

    toString(){
        const objeto=`{
            "id":       "${this.id}",
            "descricao":"${this.descricao}",
            "preco":    "${this.preco}",
            "estoque":  "${this.estoque}",
            "foto":     "${this.foto}"
        }`
        return objeto
    }

    toFirestore(){
        const produto={
            id:       this.id,
            descricao:this.descricao,
            preco:    this.preco,
            estoque:  this.estoque,
            foto:     this.foto
        }
        return produto
    }

}