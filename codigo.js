// constantes para a movimentação
const UP  = {x: 0, y: -1};
const DOWN = {x: 0, y: 1};
const RIGHT = {x: 1, y:0};
const LEFT = {x: -1, y:0};

// Passo = 25; -> tamanho da distância percorrida pelo sapo por tecla pressionada

const initialState = () => ({
    sapo: {
        x: 600 / 2 - 25, // centralizado na largura do canvas de 600px
        y: 400 - 50,     // perto da base do canvas de 400px
        largura: 50,
        altura: 50,
    }
});

const moversapo = (estado, direcao) => {
    const novoestado = {
        ...estado, // uso do spread para não modificar o original
        sapo: {
            ...estado.sapo, // copia todas as informações do estado prévio
            x: estado.sapo.x + direcao.x * 25, // atualiza o x
            y: estado.sapo.y + direcao.y * 25, // atualiza o y
        }
    };
    return novoestado;
};

// obtenção dos elementos HTML e interação com o DOM
const canvas = document.querySelector('#frogger')
const ctx = canvas.getContext('2d')

const sapoimg = new Image();
sapoimg.src = "imagens/sapo.png" //carregamento de imagens

let estadoatual = initialState();

function draw(){
    // primeiramente limpamos a tela
    ctx.fillStyle ='#eff1f3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // agora desenhamos o sapo utilizando os dados novos
    if(sapoimg.complete){
        const sapo = estadoatual.sapo;
        ctx.drawImage(sapoimg, sapo.x, sapo.y, sapo.largura, sapo.altura);
    }
}

// utilização do 'requestAnimationFrame' para otimizar a animação
function gameloop(){
    draw();
    window.requestAnimationFrame(gameloop);
}

window.addEventListener('keydown', e => {
    let proximoestado = estadoatual;
    // obter a nova posição do sapo
    switch(e.key){
        case 'ArrowUp':
            proximoestado = moversapo(estadoatual, UP);
            break;
        case 'ArrowDown':
            proximoestado = moversapo(estadoatual, DOWN);
            break;
        case 'ArrowLeft':
            proximoestado = moversapo(estadoatual, LEFT);
            break;
        case 'ArrowRight':
            proximoestado = moversapo(estadoatual, RIGHT);
            break;
    }
    estadoatual = proximoestado;
})

sapoimg.onload = () => {
    window.requestAnimationFrame(gameloop);
} //o jogo se inicia quando a imagem do sapo for carregada