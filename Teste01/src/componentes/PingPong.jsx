// importa o React e utiliza o useState, useEffect, useRef - effec e ref - para manipular canva
import React, { useRef, useEffect, useState } from "react";

function PingPong() {
    // Constantes (variaveis?)
    const mesaLargura = 720; 
    const mesaAltura = 480; 
    const mesaLinha = 4; // Largura da linha central da mesa
    const raqueteLargura = 10; // Largura das raquetes
    const raqueteAltura = 80; // Altura das raquetes
    const raqueteDistanciaBordaE = 5; // Distância da raquete esquerda da borda
    const raqueteDistanciaBordaD = mesaLargura - (raqueteLargura + raqueteDistanciaBordaE); // Distância da raquete direita da borda
    const bolaRaio = 10; // Raio da bola

    // Devo pesquisar mais do que se trata essas constantes por utilizarem [] e useState
    const [raqueteEsquerdaY, setRaqueteEsquerdaY] = useState((mesaAltura - raqueteAltura) / 2); // Posição Y inicial da raquete esquerda
    const [raqueteDireitaY, setRaqueteDireitaY] = useState((mesaAltura - raqueteAltura) / 2); // Posição Y inicial da raquete direita
    const [bolaPosicaoX, setbolaPosicaoX] = useState(mesaLargura / 2); // Posição X inicial da bola
    const [bolaPosicaoY, setbolaPosicaoY] = useState(mesaAltura / 2); // Posição Y inicial da bola
    const [bolaVelocidadeX, setbolaVelocidadeX] = useState(-2); // Velocidade inicial da bola no eixo X
    const [bolaVelocidadeY, setbolaVelocidadeY] = useState(2); // Velocidade inicial da bola no eixo Y
    const [pontosEsquerda, setPontosEsquerda] = useState(0); // Pontuação do jogador esquerdo
    const [pontosDireita, setPontosDireita] = useState(0); // Pontuação do jogador direito

    // useRef utilizado para manipular o canvas, semelhante ao getElementById, mas pq não usar o getElementById? e pq null?
    const canvamesa = useRef(null); // Referência ao elemento canvas

    // Função para reiniciar a bola
    const reiniciarBola = (lado) => {
        // Reseta a posição da bola
        setbolaPosicaoX(mesaLargura / 2); // Centraliza a bola no eixo X
        setbolaPosicaoY(mesaAltura / 2); // Centraliza a bola no eixo Y
        // Reseta a velocidade da bola
        setbolaVelocidadeX(lado === "esquerda" ? -2 : 2); // Define a direção da bola com base no lado que marcou ponto
        setbolaVelocidadeY(2); // Reseta a velocidade da bola no eixo Y
    };

    // useEffect utilizado para manipular a movimentação da bola
    useEffect(() => {
        // Função para atualizar a posição da bola
        const updatePosition = () => {
            // Atualiza a posição da bola
            setbolaPosicaoX((prevbolaPosicaoX) => {
                // Calcula a nova posição da bola, oq é e pq let?
                let novabolaPosicaoX = prevbolaPosicaoX + bolaVelocidadeX; // Calcula a nova posição X da bola

                // Verifica se a bola bateu na raquete esquerda
                if (
                    // if - se a (bola bateu na raquete esquerda)
                    novabolaPosicaoX - bolaRaio < raqueteDistanciaBordaE + raqueteLargura &&
                    // calculo maluco para verificar se a bola bateu na raquete esquerda
                    bolaPosicaoY > raqueteEsquerdaY &&
                    bolaPosicaoY < raqueteEsquerdaY + raqueteAltura
                ) {
                    setbolaVelocidadeX(-bolaVelocidadeX); // Inverte a direção da bola no eixo X

                    // Adiciona efeito de "spin" baseado na posição de colisão na raquete esquerda
                    const raqueteCentroY = raqueteEsquerdaY + raqueteAltura / 2; // Calcula o centro da raquete esquerda
                    const diferencaY = bolaPosicaoY - raqueteCentroY; // Calcula a diferença entre a posição Y da bola e o centro da raquete

                    // Aplica efeito de "spin" somente nas extremidades da raquete
                    if (Math.abs(diferencaY) > raqueteAltura / 8) {
                        setbolaVelocidadeY((prevbolaVelocidadeY) => prevbolaVelocidadeY + diferencaY * 0.02); // Ajusta a velocidade Y da bola para um efeito mais sutil
                    }
                } else if (
                    novabolaPosicaoX + bolaRaio > raqueteDistanciaBordaD &&
                    bolaPosicaoY > raqueteDireitaY &&
                    bolaPosicaoY < raqueteDireitaY + raqueteAltura
                ) {
                    setbolaVelocidadeX(-bolaVelocidadeX); // Inverte a direção da bola no eixo X
                }

                // Verifica se a bola passou pelas raquetes
                if (novabolaPosicaoX + bolaRaio > mesaLargura) {
                    setPontosEsquerda(pontosEsquerda + 1); // Incrementa a pontuação do jogador esquerdo
                    reiniciarBola("esquerda"); // Reinicia a bola para o jogador esquerdo
                } else if (novabolaPosicaoX - bolaRaio < 0) {
                    setPontosDireita(pontosDireita + 1); // Incrementa a pontuação do jogador direito
                    reiniciarBola("direita"); // Reinicia a bola para o jogador direito
                }

                return novabolaPosicaoX; // Retorna a nova posição X da bola
            });
            setbolaPosicaoY((prevbolaPosicaoY) => {
                let novabolaPosicaoY = prevbolaPosicaoY + bolaVelocidadeY; // Calcula a nova posição Y da bola
                if (novabolaPosicaoY + bolaRaio > mesaAltura || novabolaPosicaoY - bolaRaio < 0) {
                    setbolaVelocidadeY(-bolaVelocidadeY); // Inverte a direção da bola no eixo Y se bater nas bordas superior ou inferior
                }
                return novabolaPosicaoY; // Retorna a nova posição Y da bola
            });
        };

        const intervalId = setInterval(updatePosition, 5); // Define um intervalo para atualizar a posição da bola
        return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado
    }, [bolaVelocidadeX, bolaVelocidadeY, bolaRaio, mesaLargura, mesaAltura, bolaPosicaoY, raqueteAltura, pontosEsquerda, pontosDireita]);

    // movimentação da raquete direita (bot)
    useEffect(() => {
        const updateRaqueteDireita = () => {
            setRaqueteDireitaY((prevRaqueteDireitaY) => {
                let novaRaqueteDireitaY = prevRaqueteDireitaY;
                const velocidadeBot = 1 + pontosEsquerda * 0.35; // Aumenta a velocidade conforme os pontos do jogador esquerdo aumentam

                if (bolaPosicaoY > prevRaqueteDireitaY + raqueteAltura / 2) {
                    novaRaqueteDireitaY = prevRaqueteDireitaY + velocidadeBot; // Move a raquete direita para baixo
                } else if (bolaPosicaoY < prevRaqueteDireitaY + raqueteAltura / 2) {
                    novaRaqueteDireitaY = prevRaqueteDireitaY - velocidadeBot; // Move a raquete direita para cima
                }

                if (novaRaqueteDireitaY < 0) {
                    novaRaqueteDireitaY = 0; // Limita a raquete para não sair da borda superior
                } else if (novaRaqueteDireitaY + raqueteAltura > mesaAltura) {
                    novaRaqueteDireitaY = mesaAltura - raqueteAltura; // Limita a raquete para não sair da borda inferior
                }
                return novaRaqueteDireitaY; // Retorna a nova posição Y da raquete direita
            });
        };
        const intervalID = setInterval(updateRaqueteDireita, 5); // Define um intervalo para atualizar a posição da raquete direita
        return () => clearInterval(intervalID); // Limpa o intervalo quando o componente é desmontado
    }, [bolaVelocidadeX, bolaVelocidadeY, bolaRaio, mesaLargura, mesaAltura, bolaPosicaoY, raqueteAltura]);

    // movimentação da raquete esquerda (player)
    useEffect(() => {
        const handleMouseMove = (event) => {
            const rect = canvamesa.current.getBoundingClientRect(); // Obtém as dimensões do canvas
            const mouseY = event.clientY - rect.top; // Calcula a posição Y do mouse relativa ao canvas
            // Limita a raquete à mesa
            let novaRaqueteEsquerdaY = mouseY - raqueteAltura / 2; // Calcula a nova posição Y da raquete esquerda
            if (novaRaqueteEsquerdaY < 0) {
                novaRaqueteEsquerdaY = 0; // Limita a raquete para não sair da borda superior
            } else if (novaRaqueteEsquerdaY + raqueteAltura > mesaAltura) {
                novaRaqueteEsquerdaY = mesaAltura - raqueteAltura; // Limita a raquete para não sair da borda inferior
            }
            setRaqueteEsquerdaY(novaRaqueteEsquerdaY); // Atualiza a posição Y da raquete esquerda
        };
        window.addEventListener("mousemove", handleMouseMove); // Adiciona um ouvinte de evento para o movimento do mouse
        return () => {
            window.removeEventListener("mousemove", handleMouseMove); // Remove o ouvinte de evento quando o componente é desmontado
        };
    }, [raqueteAltura]);

    useEffect(() => {
        const mesa = canvamesa.current; // Obtém a referência ao canvas
        const conteudo = mesa.getContext("2d"); // Obtém o contexto 2D do canvas
        const draw = () => {
            // Limpa o canvas
            conteudo.clearRect(0, 0, mesaLargura, mesaAltura); // Limpa o canvas

            // Desenha a mesa
            conteudo.fillStyle = "#FFFFFF"; // Define a cor de preenchimento
            conteudo.fillRect(0, 0, mesaLargura, mesaAltura); // Desenha o retângulo da mesa

            // Desenha a linha
            conteudo.fillStyle = "#000000"; // Define a cor de preenchimento
            conteudo.fillRect((mesaLargura - mesaLinha) / 2, 0, mesaLinha, mesaAltura); // Desenha a linha central

            // Desenha a raquete
            conteudo.fillStyle = "#000000"; // Define a cor de preenchimento
            conteudo.fillRect(raqueteDistanciaBordaE, raqueteEsquerdaY, raqueteLargura, raqueteAltura); // Desenha a raquete esquerda
            conteudo.fillRect(raqueteDistanciaBordaD, raqueteDireitaY, raqueteLargura, raqueteAltura); // Desenha a raquete direita

            // Desenha a bola
            conteudo.beginPath(); // Inicia um novo caminho
            conteudo.fillStyle = "#000000"; // Define a cor de preenchimento
            conteudo.arc(bolaPosicaoX, bolaPosicaoY, bolaRaio, 0, 2 * Math.PI); // Desenha a bola
            conteudo.fill(); // Preenche a bola
            conteudo.closePath(); // Fecha o caminho

            // Desenha a pontuação
            conteudo.font = "20px Comics Sans Ms"; // Define a fonte
            conteudo.fillText(`Player Esquerda: ${pontosEsquerda}`, 20, 20); // Desenha a pontuação do jogador esquerdo
            conteudo.fillText(`Player Direita: ${pontosDireita}`, mesaLargura - 150, 20); // Desenha a pontuação do jogador direito
        };
        draw(); // Chama a função de desenho
    }, [raqueteEsquerdaY, raqueteDireitaY, bolaPosicaoX, bolaPosicaoY, pontosEsquerda, pontosDireita]);

    return (
        <div>
            <canvas ref={canvamesa} width={mesaLargura} height={mesaAltura} /> {/* Renderiza o canvas */}
        </div>
    );
}

export default PingPong; //