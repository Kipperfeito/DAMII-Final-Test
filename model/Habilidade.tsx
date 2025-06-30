export class Habilidade {
    public id: string;
    public nome: string;
    public dano: number;
    public custoMana: number;
    public nivel: number;

    constructor(obj?: Partial<Habilidade>) {
        if (obj) {
            this.id = obj.id || '';
            this.nome = obj.nome || '';
            this.dano = obj.dano;
            this.custoMana = obj.custoMana;
            this.nivel = obj.nivel;
        }
    }

    toString() {
        return `{
            "id": "${this.id}",
            "nome": "${this.nome}",
            "dano": ${this.dano},
            "custoMana": ${this.custoMana},
            "nivel": ${this.nivel}
        }`;
    }

    toFirestore() {
        return {
            id: this.id,
            nome: this.nome,
            dano: this.dano,
            custoMana: this.custoMana,
            nivel: this.nivel
        };
    }
}
