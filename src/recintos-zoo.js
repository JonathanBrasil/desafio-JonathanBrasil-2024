class RecintosZoo {

    constructor() {
        // Lista de animais e atributos
        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };

        // Lista de recintos
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] }
        ];
    }

    //Função analisaRecinto recebe a str do tipo do animal e a sua quantidade. 
    analisaRecintos(animal, quantidade) {

        //Converte a entrada para maiusculas para ficar compatível com a lista de animais
        let tipoAnimal = animal.toUpperCase()


        //Verificação se a espécie ou a quantidade é inválida e retorna a mensagem de erro.
        if (!this.animais[tipoAnimal]) {
            return { erro: "Animal inválido" };
        }
        //Se o tipo da quantidade for diferente de um número OU for menor ou igual a 0, ou for número decimal, retorna erro...
        if (typeof quantidade !== 'number' || quantidade <= 0 || quantidade % 1 !== 0) {
            return { erro: "Quantidade inválida" };
        }

        const { tamanho, biomas, carnivoro } = this.animais[tipoAnimal]; //Selecionar os atributos da espécie.
        const recintosViaveis = []; //array vazia para colocar a resposta com os recintos viáveis

        // Verificar cada recinto
        this.recintos.forEach((recinto) => {
            const espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => {
                return total + animal.quantidade * this.animais[animal.especie].tamanho;
            }, 0);

            // Verificar bioma compatível
            if (!biomas.includes(recinto.bioma) && recinto.bioma !== 'savana e rio') {
                return;
            }

            // Verificar espaço disponível
            let espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

            // Verificar regras específicas de convivência
            if (carnivoro && recinto.animaisExistentes.length > 0) {
                const conviventes = recinto.animaisExistentes.some(animal => animal.especie !== tipoAnimal);
                if (conviventes) return;
            }

            // Verificar se o recinto tem carnívoros
            const carnívorosExistentes = recinto.animaisExistentes.some(animal => this.animais[animal.especie].carnivoro);
            if (carnívorosExistentes && !carnivoro) {
                return;
            }

            // Verificar hipopótamos
            if (tipoAnimal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
                return;
            }

            // Verificar regra dos macacos
            if (tipoAnimal === 'MACACO' && recinto.animaisExistentes.length === 0 && quantidade < 2) {
                return;
            }

            // Verificar se o espaço comporta o novo lote (com espaço extra, se for mais de uma espécie)
            const outrasEspecies = recinto.animaisExistentes.some(animal => animal.especie !== tipoAnimal);
            if (outrasEspecies) {
                espacoDisponivel -= 1; // Espaço extra para múltiplas espécies
            }

            if (espacoDisponivel >= quantidade * tamanho) {
                const espacoLivre = espacoDisponivel - (quantidade * tamanho);
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
            }
        });

        // Retornar recintos viáveis ou erro se não houver
        return recintosViaveis.length > 0 ? { recintosViaveis } : { erro: "Não há recinto viável" };
    }

}

export { RecintosZoo };

const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos('MACACO', 2)); //ok
console.log(zoo.analisaRecintos('Unicornio', 2)); //animal invalido
console.log(zoo.analisaRecintos('macaco', 1.2)); //qtd invalida
console.log(zoo.analisaRecintos('macaco', 10)); // sem espaco livre
console.log(zoo.analisaRecintos('Crocodilo', 1)); // ok
