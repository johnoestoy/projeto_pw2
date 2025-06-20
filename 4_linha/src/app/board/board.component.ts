import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  //Criar o board, matriz 6x7 preenchida com null
  board: (null | 'red' | 'yellow')[][] = Array(6).fill(null).map(() => Array(7).fill(null));
  //escolher o jogador de maneira aleatoria
  currentPlayer: 'red' | 'yellow' = Math.random() > 0.5 ? 'red' : 'yellow';
  gameOver = false;

  dropPiece(col: number): void {
    if (this.gameOver) return;

    for (let row = 5; row >= 0; row--) {
      if (!this.board[row][col]) {
        this.board[row][col] = this.currentPlayer;
        this.checkGameState(row, col);
        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        break;
      }
    }
  }

  private checkGameState(row: number, col: number): void {
    const directions = [
      { dr: 0, dc: 1 },   // Horizontal
      { dr: 1, dc: 0 },   // Vertical
      { dr: 1, dc: 1 },   // Diagonal principal
      { dr: 1, dc: -1 },  // Diagonal secundária
    ];
    const player = this.board[row][col];

    for (let { dr, dc } of directions) {
      let count = 1;

      // Checa para frente
      let r = row + dr;
      let c = col + dc;
      while (this.isValid(r, c) && this.board[r][c] === player) {
        count++;
        r += dr;
        c += dc;
      }

      // Checa para trás
      r = row - dr;
      c = col - dc;
      while (this.isValid(r, c) && this.board[r][c] === player) {
        count++;
        r -= dr;
        c -= dc;
      }

      if (count >= 4) {
        this.gameOver = true;
        setTimeout(() => {
          alert(`Vitória de ${player === 'red' ? 'vermelho' : 'amarelo'}!`);
        }, 100);
        return;
      }
    }

    // Checa empate (tabuleiro cheio)
    if (this.board.flat().every(cell => cell !== null)) {
      this.gameOver = true;
      setTimeout(() => {
        alert('Empate!');
      }, 100);
    }
  }

  // Função auxiliar para checar se a posição existe no tabuleiro
  private isValid(row: number, col: number): boolean {
    return row >= 0 && row < 6 && col >= 0 && col < 7;
  }


  newGame(): void {
    this.board = Array(6).fill(null).map(() => Array(7).fill(null));
    this.currentPlayer = Math.random() > 0.5 ? 'red' : 'yellow';
    this.gameOver = false;
  }
}
