export class Personagem {
    public id: string;
    public nome: string;
    public forca: string;
    public destreza: string;
    public velocidade: string;
    public resistencia: string;
    public inteligencia: string;
    public foto: string;

    constructor(obj?: Partial<Personagem>) {
        if (obj) {
            this.id = obj.id;
            this.nome = obj.nome;
            this.forca = obj.forca;
            this.destreza = obj.destreza;
            this.velocidade = obj.velocidade;
            this.resistencia = obj.resistencia;
            this.inteligencia = obj.inteligencia;
            this.foto = obj.foto;
        }
    }

    toString() {
        return `{
            "id": "${this.id}",
            "nome": "${this.nome}",
            "forca": "${this.forca}",
            "destreza": "${this.destreza}",
            "velocidade": "${this.velocidade}",
            "resistencia": "${this.resistencia}",
            "inteligencia": "${this.inteligencia}",
            "foto": "${this.foto}"
        }`;
    }

    toFirestore() {
        return {
            id: this.id,
            nome: this.nome,
            forca: this.forca,
            destreza: this.destreza,
            velocidade: this.velocidade,
            resistencia: this.resistencia,
            inteligencia: this.inteligencia,
            foto: this.foto
        };
    }
}
