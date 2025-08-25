// constantes para a movimentação
const UP  = {x: 0, y: -1}
const DOWN = {x: 0, y: 1}
const RIGHT = {x: 1, y:0}
const LEFT = {x: -1, y:0}

// passo = 25; -> tamanho da distância percorrida pelo sapo por tecla pressionada

/* Constante que armazena as informações iniciais dos elementos em tela.*/
const initialState = () => ({
    sapo: {
        x: 600/2 - 25, // centralizado na largura do canvas de 600px
        y: 400 - 50,     // perto da base do canvas de 400px
        largura: 50,
        altura: 50,
    },
    carro1: {
        x: -50,
        y: 60,
        largura: 80,
        altura: 50,
        velocidade: 4,
        cor: '#c0392b'
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
        x: 0,
        y: 120,
        largura: 600,
        altura: 140, 
        cor: '#add8e6',
    },
});
// função pura que calcula o próximo estado do sapo
const moversapo = (estado, direcao) => {
    const novoestado = {
        ...estado, // uso do spread para não modificar o original
        sapo: {
            ...estado.sapo, // copia todas as informações do estado prévio
            x: estado.sapo.x + direcao.x * 25, // atualiza o x
            y: estado.sapo.y + direcao.y * 25, // atualiza o y
        }
    };
    return novoestado
};

/*Função que faz um obstaculo se mover horizontalmente por tempo indefinido*/
const movercarros = (estado) => {
    const proxCarro1 = {
        ...estado.carro1,
        x: (estado.carro1.x + estado.carro1.velocidade > 600) ? -estado.carro1.largura - 5 : estado.carro1.x + estado.carro1.velocidade,
    };

    // Calcula a próxima posição do carro 2
    const proxCarro2 = {
        ...estado.carro2,
        x: (estado.carro2.x + estado.carro2.velocidade < -estado.carro2.largura) ? 605 : estado.carro2.x + estado.carro2.velocidade,
    };

    // Retorna um novo objeto de estado com a cópia do sapo e todos os carros atualizados
    return {
        ...estado,
        carro1: proxCarro1,
        carro2: proxCarro2,
    };
};

const colidiu = (objeto, sapo) => {
    return !(
        objeto.x + objeto.largura < sapo.x ||
        objeto.x > sapo.x + sapo.largura ||
        objeto.y + objeto.altura  < sapo.y ||
        objeto.y > sapo.y + sapo.altura
    )
};

const finalizou = (sapo) => sapo.y <= 0

// obtenção dos elementos HTML e interação com o DOM
const canvas = document.querySelector('#frogger')
const ctx = canvas.getContext('2d')

const sapoimg = new Image()
sapoimg.src = "imagens/sapo.png" //carregamento de imagens

let estadoatual = initialState()

function draw(){
    // primeiramente limpamos a tela
    ctx.fillStyle ='#eff1f3'

    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // desenhando os carros 
    ctx.fillStyle = estadoatual.carro1.cor;
    ctx.fillRect(estadoatual.carro1.x, estadoatual.carro1.y, estadoatual.carro1.largura, estadoatual.carro1.altura)

    ctx.fillStyle = estadoatual.carro2.cor;
    ctx.fillRect(estadoatual.carro2.x, estadoatual.carro2.y, estadoatual.carro2.largura, estadoatual.carro2.altura)

    // agora desenhamos o sapo utilizando os dados novos
    if(sapoimg.complete){
        const sapo = estadoatual.sapo
        ctx.drawImage(sapoimg, sapo.x, sapo.y, sapo.largura, sapo.altura)
    }
    // desenhando o lago 
    const lago = estadoatual.lago;
    ctx.fillStyle = lago.cor;
    ctx.fillRect(lago.x, lago.y, lago.largura, lago.altura );
}

// utilização do 'requestAnimationFrame' para otimizar a animação
function gameloop(){
    let proximoestado = movercarros(estadoatual)
    const frog = proximoestado.sapo
    if(colidiu(frog, proximoestado.carro1) || // verifica se ocorreu a colisão entre o sapo e os carros ou o lago
       colidiu(frog, proximoestado.carro2) ||
       colidiu(frog, proximoestado.lago) 
    ) proximoestado = initialState() // Caso haja colisão, resetamos o jogo
    estadoatual = proximoestado
    draw()
    window.requestAnimationFrame(gameloop)
}

window.addEventListener('keydown', e => {
    /*o paradigma funcional não admite a utilização de variáveis, entretanto,
    para que um elemento possa se movimentar livremente pela tela, suas coordenadas
    não podem ser fixas, e, assim, constantes. Nesse caso, demonstra-se imprescindível
    o uso de uma variável. */
    let proximoestado = estadoatual
    // obter a nova posição do sapo
    switch(e.key){
        /*quando alguma seta é pressionada, o programa detecta se as coordenadas do sapo, considerando suas dimensões,
        estão em algum limite do canva, caso estejam, será retornada a mesma posição, do contrário, a função moversapo
        é executada.*/
        case 'ArrowUp':
            proximoestado = (estadoatual.sapo.y > 0) ? moversapo(estadoatual, UP) : estadoatual
            break;
        case 'ArrowDown':
            proximoestado = (estadoatual.sapo.y < (400 - estadoatual.sapo.altura)) ? moversapo(estadoatual, DOWN) : estadoatual
            break;
        case 'ArrowLeft':
            proximoestado = (estadoatual.sapo.x > 0) ? moversapo(estadoatual, LEFT) : estadoatual
            break;
        case 'ArrowRight':
            proximoestado = (estadoatual.sapo.x < (600 - estadoatual.sapo.largura)) ? moversapo(estadoatual, RIGHT) : estadoatual
            break;
    }   
    if(finalizou(proximoestado.sapo)){
        console.log("Você venceu. Resetando...")
        proximoestado = initialState();
    }
    estadoatual = proximoestado;
})

sapoimg.onload = () => {
    window.requestAnimationFrame(gameloop);
} //o jogo se inicia quando a imagem do sapo for carregada
