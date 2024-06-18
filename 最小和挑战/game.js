let n, k, a;

function showRules() {
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('rules-container').style.display = 'block';
}

function startGame() {
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
}

function backToMain() {
    document.getElementById('rules-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'flex';
}

function generateRandomArray(n) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
}

function displayArrayAndK(a, k) {
    const aDisplay = document.getElementById('a-display');
    aDisplay.innerHTML = '';
    a.forEach(num => {
        const numBox = document.createElement('div');
        numBox.className = 'number-box';
        numBox.textContent = num;
        aDisplay.appendChild(numBox);
    });
    document.getElementById('k-display').textContent = k;
}

function calculateMinSum(n, k, a) {
    let sum = a.reduce((acc, val) => acc + val, 0);
    const dp = Array.from({ length: n }, () => Array(k + 1).fill(0));
    const f = Array.from({ length: n }, () => Array(k + 1).fill(0));

    for (let i = 0; i < n; i++) {
        let minn = a[i];
        for (let j = i - 1; j >= 0 && i - j <= k; j--) {
            minn = Math.min(minn, a[j]);
            for (let l = j; l <= i; l++) {
                dp[i][i - j] += a[l] - minn;
            }
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 1; j <= k; j++) {
            if (i > 0) f[i][j] = f[i - 1][j];
        }
        for (let j = 1; j <= k && i - j >= 0; j++) {
            f[i][j] = Math.max(dp[i][j], f[i][j]);
            for (let l = j; i - l >= 0 && l <= k; l++) {
                if (i - j > 0) {
                    f[i][l] = Math.max(dp[i][j] + f[i - j - 1][l - j], f[i][l]);
                }
            }
        }
    }

    let maxn = 0;
    for (let i = 1; i <= k; i++) {
        maxn = Math.max(maxn, f[n - 1][i]);
    }

    return sum - maxn;
}

function generateQuestion() {
    n = parseInt(document.getElementById('length-input').value);
    if (isNaN(n) || n < 3 || n > 10) {
        alert('请输入3到10之间的整数');
        return;
    }
    k = Math.floor(Math.random() * Math.floor(n / 2)) + 1;
    a = generateRandomArray(n);
    displayArrayAndK(a, k);
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('result-display').textContent = '';
    document.getElementById('sum-input').value = '';
}

function refreshQuestion() {
    generateQuestion();
}

function submitResult() {
    const sumInput = document.getElementById('sum-input').value;
    const calculatedSum = calculateMinSum(n, k, a);

    if (Number(sumInput) === calculatedSum) {
        document.getElementById('result-display').textContent = '恭喜你,回答正确！';
    } else {
        document.getElementById('result-display').textContent = `回答错误！正确的最小总和是 ${calculatedSum}。`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    backToMain();
});