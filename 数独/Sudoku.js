class GenerateSudoku {
    constructor(difficulty = 3) {
        this.difficulty = difficulty;  // high = 5; middle = 4; low = 3
    }

    // 随机排列数组
    random(arr) {
        let rand = [];
        let len = arr.length;
        for (let i = 0; i < arr.length; i++) {
            let index = Math.floor(Math.random() * len);
            rand.push(arr[index]);
            arr[index] = arr[--len];
        }
        return rand;
    }

    // 特定组合的随机数组
    random2() {
        let arry1 = this.random([1, 4, 7]);
        let arry2 = this.random([3, 6, 9]);
        let arry3 = this.random([2, 5, 8]);

        let arry = new Array(9);
        if (Math.floor(Math.random() * 2) === 1) {
            for (let i = 0; i < 3; i++) {
                arry[i] = arry1[i];
                arry[3 + i] = arry2[i];
                arry[6 + i] = arry3[i];
            }
        } else {
            for (let i = 0; i < 3; i++) {
                arry[i] = arry1[i];
                arry[3 + i] = arry3[i];
                arry[6 + i] = arry2[i];
            }
        }
        return arry;
    }

    // 由随机数组生成的棋盘
    board() {
        let arry = Array.from({ length: 9 }, () => Array(9).fill(0));
        let rand1 = this.random([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let rand2 = this.random2();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let k = (j + rand2[i]) % 9;
                arry[i][k] = rand1[j];
            }
        }

        let swap1 = this.random([0, 1, 2]);
        let swap2 = this.random([3, 4, 5]);
        let swap3 = this.random([6, 7, 8]);
        let swap = new Array(9);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                swap[j] = swap1[j];
                swap[j + 3] = swap2[j];
                swap[j + 6] = swap3[j];
            }
        }

        let arry2 = Array.from({ length: 9 }, () => Array(9).fill(0));
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                arry2[i][j] = arry[j][i];
            }
        }

        let tmp = Array.from({ length: 9 }, () => Array(9).fill(0));
        // 倒置后交换位置
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                tmp[i][j] = arry2[swap[i]][j];
            }
        }
        return tmp;
    }

    // 随机赋值0
    randomBlank(arry) {
        let index = this.random([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        let blank = Math.floor(Math.random() * this.difficulty) + 2;
        for (let i = 0; i < blank; i++) {
            arry[index[i]] = 0;
        }
    }
}

class Sudoku {
    constructor(difficulty) {
        this.difficulty = difficulty;
        const generator = new GenerateSudoku(difficulty);
        this.board = generator.board();
        this.solution = JSON.parse(JSON.stringify(this.board));
        this.removeNumbers(generator);
    }

    removeNumbers(generator) {
        for (let row of this.board) {
            generator.randomBlank(row);
        }
    }

    isCorrect(i, j) {
        i = Number(i);
        j = Number(j);
        // console.log(this.board[i][j],this.solution[i][j] )
        if (this.board[i][j] === this.solution[i][j])
            return true;
        let x = Math.floor(i / 3);
        let y = Math.floor(j / 3);
        for (let l = x * 3; l < x * 3 + 3; l++) {
            for (let r = y * 3; r < y * 3 + 3; r++) {
                if (i === l && r === j)
                    continue;
                if (this.board[i][j] === this.board[l][r]) {
                    console.log(i, j, l, r);
                    console.log(typeof i, typeof j, typeof l, typeof r);
                    console.log(this.board[i][j], this.board[l][r]);
                    console.log(1);
                    return false;
                }
            }
        }
        for (let w = 0; w < 9; w++) {
            if (w != i && this.board[i][j] === this.board[w][j]) {
                console.log(1);
                return false;
            }
            if (w != j && this.board[i][j] === this.board[i][w]) {
                console.log(1);
                return false;
            }
        }
        return true;
    }

    isComplete() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}
// 获取模态窗口元素
const winModal = document.getElementById("win-modal");
const closeButton = document.querySelector(".close-button");

// 显示模态窗口
function showWinModal() {
    winModal.style.display = "block";
}

// 关闭模态窗口
function closeWinModal() {
    winModal.style.display = "none";
}

// 关闭按钮点击事件
closeButton.addEventListener("click", closeWinModal);

document.getElementById('start').addEventListener('click', () => {
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const game = new Sudoku(difficulty);

    const boardContainer = document.getElementById('sudoku-board');
    boardContainer.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = '1';
            cell.value = game.board[i][j] === 0 ? '' : game.board[i][j];
            cell.classList.add('sudoku-cell');
            cell.dataset.row = i;
            cell.dataset.col = j;

            // 如果是程序提供的数字，则改变颜色
            if (game.board[i][j] !== 0) {
                cell.classList.add('fixed');
                cell.readOnly = true;  // 禁止修改程序提供的数字
            }

            const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            let box = document.querySelector(`.sudoku-box[data-box='${boxIndex}']`);
            if (!box) {
                box = document.createElement('div');
                box.className = 'sudoku-box';
                box.dataset.box = boxIndex;
                boardContainer.appendChild(box);
            }
            box.appendChild(cell);
        }
    }
    // 隐藏初始控件
    document.querySelector('.controls').style.display = 'none';
    document.getElementById('hint').style.display = 'inline';
    document.getElementById('solution').style.display = 'inline';
    document.querySelectorAll('#sudoku-board input').forEach(cell => {
        cell.addEventListener('input', (e) => {
            const { row, col } = e.target.dataset;
            const value = parseInt(e.target.value) || 0;
            game.board[row][col] = value;

            if (e.target.value === '') {
                e.target.style.backgroundColor = 'white';
            } else if (!game.isCorrect(row, col)) {
                e.target.style.backgroundColor = 'red';
            } else {
                e.target.style.backgroundColor = 'white';
                if (game.isComplete()) {
                    showWinModal();
                }
            }
        });

        cell.addEventListener('mouseenter', (e) => {
            const value = e.target.value;
            if (value) {
                document.querySelectorAll('#sudoku-board input').forEach(c => {
                    if (c.value === value) {
                        c.classList.add('highlight');
                    }
                });
            }
        });

        cell.addEventListener('mouseleave', (e) => {
            document.querySelectorAll('#sudoku-board input').forEach(c => {
                c.classList.remove('highlight');
            });
        });
    });

    document.getElementById('hint').addEventListener('click', () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (game.board[i][j] !== game.solution[i][j]) {
                    document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).value = game.solution[i][j];
                    game.board[i][j] = game.solution[i][j];
                    return;
                }
            }
        }
    });

    document.getElementById('solution').addEventListener('click', () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                document.querySelector(`input[data-row="${i}"][data-col="${j}"]`).value = game.solution[i][j];
                game.board[i][j] = game.solution[i][j];
            }
        }
    });
});
