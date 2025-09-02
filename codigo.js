// Constantes para a movimentação.
const UP  = {x: 0, y: -1}
const DOWN = {x: 0, y: 1} 
const RIGHT = {x: 1, y:0}
const LEFT = {x: -1, y:0}

//Constantes que armazenam os sons.
const somdosapo = document.getElementById("somdosapo")
const somdesplash = document.getElementById("somdesplash")
const somdecolisão = document.getElementById("somdecolisão")

// Passo = 25; -> tamanho da distância percorrida pelo sapo por tecla pressionada.

/* Constante que armazena as informações iniciais dos elementos em tela. */
const initialState = () => ({
    // Status inicial do jogo
    GameStatus: "jogando", 
    sapo: {
        x: 600/2 - 25, // Centralizado na largura do canvas de 600px.
        y: 400 - 50,     // Perto da base do canvas de 400px.
        largura: 50,
        altura: 50,
        cor: "#09d53fff"
    },
    carro1: {
        x: -50,
        y: 60,
        largura: 90,
        altura: 50,
        velocidade: 4,
        cor: '#c0392b'
    },
    carro3:{
        x: -400,
        y: 60,
        largura: 90,
        altura: 50,
        velocidade: 4,
        cor: "#c0992b"
    },
    carro2: {
        x: 650,  
        y: 270, 
        largura: 100, 
        altura: 50, 
        velocidade: -2.5, 
        cor: '#8e44ad'
    },
    lago: { 
        x: -200,
        y: 120,
        largura: 850,
        altura: 135, 
        cor: '#338dabff',
    },
    tronco1:{
        x: -150,
        y: 120,
        largura: 140,
        altura: 45,
        velocidade: 1.5,
        cor: "#58381cff"
    },
    tronco2:{
        x: 800,
        y: 165,
        largura: 180,
        altura: 45,
        velocidade: -1.5,
        cor: "#58381cff"
    },
    tronco3:{
        x: -300,
        y:210,
        largura:100,
        altura: 45,
        velocidade: 1.5,
        cor: "#58381cff"
    }
})


// Função pura que calcula o próximo estado do sapo.
const moversapo = (estado, direcao) => {
    const novoestado = {
        ...estado, // Uso do spread para não modificar o original.
        sapo: {
            ...estado.sapo, // Copia todas as informações do estado prévio.
            x: estado.sapo.x + direcao.x * 25, // Atualiza o x.
            y: estado.sapo.y + direcao.y * 25, // Atualiza o y.
        }
    }
    return novoestado
}


/* Função que faz os carros se moverem por tempo indefinido, copiando as informações contidas em seus
registros e, em seguida, modificando estas de acordo com as seguintes lógicas: */
const movercarros = (estado) => {

    /* Para os carros que se movem da esquerda para direita - Se a soma da posição x 
    com a velocidade (positiva) ultrapassar o limite direito do canva(600), a função
    retorna como posição um valor negativo para que a figura surja antes da tela, conferindo
    maior fluidez ao movimento, do contrário, a função retorna apenas a soma da posição e sua velocidade. */

    const proxCarro1 = { // Constante que guarda a próxima posição do carro1.
        ...estado.carro1,
        x: (estado.carro1.x + estado.carro1.velocidade > 600) ? -estado.carro1.largura - 5 : estado.carro1.x + estado.carro1.velocidade
    }

    const proxCarro3 = { // Constante que guarda a próxima posição do carro3.
        ...estado.carro3,
        x: (estado.carro3.x + estado.carro3.velocidade > 600) ? -estado.carro3.largura - 5 : estado.carro3.x + estado.carro3.velocidade
    }

     /* Para o carros que se movem da direita pra esquerda - Se a soma da posição x com a velociade
    (negativa) ultrapassar o limite esquerdo do canva (0), a função retorna um valor maior que 600 para
    que a figura surja depois da tela, conferindo, assim, maior fluidez ao movimento, do contrário, a
    função retorna apenas a soma da posição com a velocidade. */

    const proxCarro2 = { // Constante que guarda a próxima posição do carro2.
        ...estado.carro2,
        x: (estado.carro2.x + estado.carro2.velocidade < -estado.carro2.largura) ? 605 : estado.carro2.x + estado.carro2.velocidade
    }

    return { // Retorna um novo objeto de estado com a cópia do sapo e todos os carros atualizados.
        ...estado,
        carro1: proxCarro1,
        carro2: proxCarro2,
        carro3: proxCarro3
    }
}

/*Seguindo a mesma lógica da função para mover carros: */
const moverObjetosLago = (estado) => {
    const proxTronco1 = { // Constante que guarda a próxima posição do tronco1
        ...estado.tronco1,
        x: (estado.tronco1.x + estado.tronco1.velocidade > 600) ? -estado.tronco1.largura - 5 : estado.tronco1.x + estado.tronco1.velocidade
    }

    const proxTronco2 = { // Constante que guarda a próxima posição do tronco2
        ...estado.tronco2,
        x: (estado.tronco2.x + estado.tronco2.velocidade < -estado.tronco2.largura) ? 605 : estado.tronco2.x + estado.tronco2.velocidade
    }

    const proxTronco3 = {// Constante que guarda a próxima posição do tronco3
        ...estado.tronco3,
        x: (estado.tronco3.x + estado.tronco3.velocidade > 600) ? -estado.tronco3.largura - 5 : estado.tronco3.x + estado.tronco3.velocidade
    }

    return { // Retorna um novo objeto de estado com a cópia do sapo e todos os troncos atualizados.
        ...estado,
        tronco1: proxTronco1,
        tronco2: proxTronco2,
        tronco3: proxTronco3
    }
}

// Função pura que verifica se dois retângulos (objetos do jogo) colidiram
const colidiu = (objeto, sapo) => {
    /* A função retorna um resultado com '!', pois verifica se os retângulos NÃO COLIDIRAM, 
    logo, caso colidam, ela retorna true */
    return !(
        objeto.x + objeto.largura < sapo.x || // O objeto está completamente à esquerda do sapo
        objeto.x > sapo.x + sapo.largura || // O objeto está completamente à direita do sapo
        objeto.y + objeto.altura  < sapo.y || // O objeto está completamente acima do sapo
        objeto.y > sapo.y + sapo.altura // O objeto está completamente abaixo do sapo
    )
}

// Verifica se o sapo chegou à borda superior do Canvas (vitória)
const finalizou = (sapo) => sapo.y <= 0

// Obtenção dos elementos HTML e interação com o DOM.
const canvas = document.querySelector('#frogger')
const ctx = canvas.getContext('2d')
let estadoatual = initialState()

// Função que define como os elementos do jogo, enquanto este estiver ativo, serão desenhados.
function draw(){
    // Primeiramente limpamos a tela.
    ctx.fillStyle ='#eff1f3'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Desenhando os carros.
    ctx.fillStyle = estadoatual.carro1.cor;
    ctx.fillRect(estadoatual.carro1.x, estadoatual.carro1.y, estadoatual.carro1.largura, estadoatual.carro1.altura)

    ctx.fillStyle = estadoatual.carro2.cor;
    ctx.fillRect(estadoatual.carro2.x, estadoatual.carro2.y, estadoatual.carro2.largura, estadoatual.carro2.altura)

    ctx.fillStyle = estadoatual.carro3.cor;
    ctx.fillRect(estadoatual.carro3.x, estadoatual.carro3.y, estadoatual.carro3.largura, estadoatual.carro3.altura)

    // Desenhando o lago.
    const lago = estadoatual.lago
    ctx.fillStyle = lago.cor;
    ctx.fillRect(lago.x, lago.y, lago.largura, lago.altura )

    //Desenhando os troncos.
    ctx.fillStyle = estadoatual.tronco1.cor;
    ctx.fillRect(estadoatual.tronco1.x, estadoatual.tronco1.y, estadoatual.tronco1.largura, estadoatual.tronco1.altura)

    ctx.fillStyle = estadoatual.tronco2.cor;
    ctx.fillRect(estadoatual.tronco2.x, estadoatual.tronco2.y, estadoatual.tronco2.largura, estadoatual.tronco2.altura)

    ctx.fillStyle = estadoatual.tronco3.cor;
    ctx.fillRect(estadoatual.tronco3.x, estadoatual.tronco3.y, estadoatual.tronco3.largura, estadoatual.tronco3.altura)

    //Desenhando o sapo.
    ctx.fillStyle = estadoatual.sapo.cor
    ctx.fillRect(estadoatual.sapo.x, estadoatual.sapo.y, estadoatual.sapo.largura, estadoatual.sapo.altura)

}

//Função que define como a tela de Game Over será desenhada.
function drawgameover(){
    //Desenha uma tela semi-transparente
    ctx.fillStyle = 'rgba(95, 91, 91, 1)'
    ctx.fillRect (0, 0, canvas.width, canvas.height)

    //Configura e desenha o texto
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center' //Centraliza o texto horizontalmente
    ctx.font = '48px sans-serif'
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = '24px sans-serif'
    ctx.fillText('pressione ESPAÇO para continuar', canvas.width / 2, canvas.height / 2 + 20);
}

//Seguindo a mesma lógica do desenho da tela de GAME OVER, faremos, então, uma tela de vitória.
function drawvitoria(){
    //Desenha uma tela semi-transparente
    ctx.fillStyle = 'rgba(192, 189, 32, 0.8)'
    ctx.fillRect (0, 0, canvas.width, canvas.height)

    //Configura e desenha o texto
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center' //Centraliza o texto horizontalmente
    ctx.font = '48px sans-serif'
    ctx.fillText('VOCÊ VENCEU!! (•◡•) ', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = '24px sans-serif'
    ctx.fillText('Pressione ESPAÇO para jogar novamente!', canvas.width / 2, canvas.height / 2 + 20);
}


/* Utilização do 'requestAnimationFrame' para otimizar a animação.
o jogo prosseguirá normalmente enquanto o "GameStatus" for "jogando", porém
sempre que ocorrer uma colisão indesejada, o "jogando" é substituido por
"gameover", que logo mais será usado para resetar o jogo.*/
function gameloop(){
    // A lógica do jogo só é executada se o status for "jogando".
    if (estadoatual.GameStatus === "jogando"){
    // Primeiro calcula o próximo estado movendo carros e troncos.
    let proximoestado = movercarros(estadoatual)
    proximoestado = moverObjetosLago(proximoestado)
    const sapo = proximoestado.sapo;
    
    /*Se a função "finalizou" for disparada o status do jogo muda para "ganhou", que
    posteriormente será usado para resetar o jogo e mostrar a tela de vitória. */
    if (finalizou(proximoestado.sapo)){
                proximoestado = {...proximoestado, GameStatus: "ganhou"} 
            }

    if (
        colidiu(sapo, proximoestado.carro1) ||
        colidiu(sapo, proximoestado.carro2) ||
        colidiu(sapo, proximoestado.carro3)
    ) {
        /* Caso o movimento seja realmente efetuado, ou seja, se a posição do sapo mudou, o som designado para este é disparado.
        Porém, é preciso destacar que, por essência, ".play()", não é funcional, pois inevitavelmente precisa da atuação de agentes
        fora do seu escopo, o que a torna impura. Por outro lado, esta também é a única maneira simples e com a menor quantidade
        de efeitos colaterais de se adicionar sons ao código.  (!) */
        somdecolisão.play() //(!)
        proximoestado = {...proximoestado, GameStatus: "gameover"}
    } else { 
        /* Se o sapo colidir com a área do lago, será averiguado se ele também colide com algum tronco, se colidir, o sapo está
        seguro, do contrário, o jogo reseta.
        Quando o sapo colidir com o tronco, ele é "arrastado", assim, também começa a ser afetado pela velocidade deste. */
        if (colidiu(sapo, proximoestado.lago)) {
            if( 
                /* Se os troncos fizerem o sapo sair da tela delimitada pelo canva, o jogo também reseta,
            tendo em vista que, assim, o sapo cairia na água. */
                proximoestado.sapo.x > - proximoestado.sapo.largura && 
                proximoestado.sapo.x < 600
            ){
            // Se o sapo está no lago, verifica se colidiu com um tronco.
            if (colidiu(sapo,proximoestado.tronco1)) {
                // Se estiver no tronco 1, o sapo anda com ele, e a mesma lógica para os outros troncos.
                proximoestado = {
                    ...proximoestado,
                    sapo:{ 
                        ...sapo, 
                        x: sapo.x + proximoestado.tronco1.velocidade }
                    }
                } else {
                    if (colidiu(sapo,proximoestado.tronco2)) {
                        proximoestado = {
                            ...proximoestado,
                            sapo:{ 
                                ...sapo, 
                                x: sapo.x + proximoestado.tronco2.velocidade }
                            }
                        } else { 
                            if (colidiu(sapo,proximoestado.tronco3)) {
                                proximoestado = {
                                    ...proximoestado,
                                    sapo:{ 
                                        ...sapo, 
                                        x: sapo.x + proximoestado.tronco3.velocidade }
                                }
                             } else {
                                // Se está no lago, mas não em um tronco, o player perdeu.
                                somdesplash.play() //(!)
                                proximoestado = {...proximoestado, GameStatus: "gameover"}
                        }
                    }   
                }
            } else {
                // Se o sapo é levado para fora da tela por um tronco, o jogo também acaba.  
                somdesplash.play() //(!)
                proximoestado = {...proximoestado, GameStatus: "gameover"}
            }
        }
    }
    // Atualiza o estado do jogo 
    estadoatual = proximoestado;
}

//Se o jogador perder, será exibida a tela de Game Over, se o jogador vencer, será exibida a tela de vitória.
    if (estadoatual.GameStatus === "gameover"){
        drawgameover()
                } else {
                    if (estadoatual.GameStatus === "ganhou"){
                        drawvitoria()
                    } else {
                    draw()
                    }
                }
                
    window.requestAnimationFrame(gameloop);

}

// Implementação de um "ouvinte" para o teclado.
window.addEventListener('keydown', e => {
    // Se o jogo acabou a única tecla que nos interessa é o espaço.
    if (estadoatual.GameStatus === 'gameover'){
                if (e.key === ' '){
                    estadoatual = initialState(); // reinicia o jogo
                    proximoestado = {...proximoestado, GameStatus: "jogando"}
                }
                return // sai da função para não processar as setas 
            }
    if (estadoatual.GameStatus === 'ganhou'){
                if (e.key === ' '){
                    estadoatual = initialState(); // reinicia o jogo
                    proximoestado = {...proximoestado, GameStatus: "jogando"}
                }
                return // sai da função para não processar as setas 
            }
     /* Para evitar que o jogador apenas segure uma tecla e finalize o jogo, optamos por limitar a movimentação,
 agora, mesmo que o jogador segure alguma tecla, o evento sera executado apenas uma vez. Para isso, usamos
 da propriedade repeat do event, que detecta se uma tecla foi pressionada ou segurada, assim, quando a tecla
  for segurada, ela não retornará nada além do primeiro passo. */
    if (estadoatual.GameStatus === 'jogando'){
    if (e.repeat) {return}

    else{
        /* O paradigma funcional não admite a utilização de variáveis, entretanto,
        para que um elemento possa se movimentar livremente pela tela, suas coordenadas
        não podem ser fixas, e, assim, constantes. Nesse caso, demonstra-se imprescindível
        o uso de uma variável. */
        let proximoestado = estadoatual
        // Obter a nova posição do sapo.
        switch(e.key){
            /* Quando alguma seta é pressionada, o programa detecta se as coordenadas do sapo, considerando suas dimensões,
            estão em algum limite do canva, caso estejam, será retornada a mesma posição, do contrário, a função moversapo
            é executada. */
            case 'ArrowUp':
                proximoestado = (estadoatual.sapo.y > 0) ? moversapo(estadoatual, UP) : estadoatual
                break
            case 'ArrowDown':
                proximoestado = (estadoatual.sapo.y < (400 - estadoatual.sapo.altura)) ? moversapo(estadoatual, DOWN) : estadoatual
                break
            case 'ArrowLeft':
                proximoestado = (estadoatual.sapo.x > 0) ? moversapo(estadoatual, LEFT) : estadoatual
                break
            case 'ArrowRight':
                proximoestado = (estadoatual.sapo.x < (600 - estadoatual.sapo.largura)) ? moversapo(estadoatual, RIGHT) : estadoatual
                break
        }
        // Se o sapo se mover, o som do pulo toca.
        if ((proximoestado.sapo.x !== estadoatual.sapo.x) ||
            (proximoestado.sapo.y !== estadoatual.sapo.y)){
                somdosapo.play() // (!)
            }

        else{
        // Se o sapo chegou ao final, o jogo é reiniciado.
        if(finalizou(proximoestado.sapo)){
            console.log("Você venceu. Resetando...")
            proximoestado = initialState();
        }}
        // Atualiza o estado do jogo com a nova posição do sapo. 
        estadoatual = proximoestado;
        }
    }
})
// Primeiro início do jogo.
gameloop()