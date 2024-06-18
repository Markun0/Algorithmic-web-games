var oper = 0;
var sum = 0;
var temp = '';
var btns = document.querySelector('.btn-div').querySelectorAll('button');
var uls = document.getElementById('tower-container').getElementsByClassName('tower-class');
var num = 0;
var ans = 0;

// 在页面加载完成后，提示用户输入汉诺塔的阶数
document.addEventListener('DOMContentLoaded', function () {
    num = prompt('请输入汉诺塔的阶数\n（请输入大于0且小于8的整数）');
    while (num === null || isNaN(num) || num <= 0 || num >= 8) {
        num = prompt('请输入正确的汉诺塔阶数\n（请输入大于0且小于8的整数）');
    }
    num = parseInt(num, 10); // 转换为整数并初始化汉诺塔游戏
    initializeHanoi(num);
});

function initializeHanoi(num) {
    var arr = [];
    var dn = document.getElementById('div-now').getElementsByTagName('li');
    ans = getans(num); // 获取最小步数

    // 初始化汉诺塔的初始状态
    for (var i = 1; i <= num; i++) {
        arr.push(i);
    }
    arr.forEach(function (item, index) {
        var li = document.createElement('li');
        li.textContent = item;

        // 根据盘子大小设置不同的宽度
        var width = 40 + index * 25 + 'px';
        li.style.width = width;

        uls[0].appendChild(li);
    });

    // 设置塔的高度，根据盘子数量动态调整
    var towerHeight = num * 50 + 'px'; // 假设每个盘子的高度为50px
    var towerWidth = 40 + (num - 1) * 25 + 'px';
    for (var i = 0; i < uls.length; i++) {
        uls[i].style.height = towerHeight;
        uls[i].style.width = towerWidth;
    }

    // 更新显示当前状态信息
    dn[1].textContent = 0;
    dn[0].textContent = '';
    dn[2].textContent = ans; // 显示最小步数
}

// 计算最少需要的次数
function getans(n) {
    return Math.pow(2, n) - 1;
}

function getTop(i) {
    var data = uls[i].getElementsByTagName('li');
    if (data.length == 0) {
        alert('错误');
    } else {
        temp = data[0].textContent;
        uls[i].removeChild(uls[i].children[0]);
        document.getElementById('now').textContent = temp;
        oper = 1;
    }
}

function move(i) {
    var data = uls[i].getElementsByTagName('li');
    var t = document.createElement('li');
    var width = 40 + (temp - 1) * 25 + 'px';
    t.style.width = width;
    if (data.length == 0) {
        t.textContent = temp;
        uls[i].appendChild(t);
        sum++;
        document.getElementById('sum').textContent = sum;
        document.getElementById('now').textContent = '';
        oper = 0;
    } else {
        if (parseInt(data[0].textContent) < parseInt(temp)) {
            alert('错误');
        } else {
            t.textContent = temp;
            uls[i].insertBefore(t, uls[i].firstChild);
            sum++;
            document.getElementById('sum').textContent = sum;
            document.getElementById('now').textContent = '';
            oper = 0;
        }
    }
    check(); // 每次移动后检查游戏状态
}

function check() {
    var data = uls[2].getElementsByTagName('li');
    if (data.length === num) {
        setTimeout(function() {
            if (sum === ans) {
                alert('恭喜通关！');
            } else {
                alert('恭喜通关，但并非最速操作');
            }
        }, 100); // 确保移动操作完成后再显示通关提示
    }
}

btns[0].onclick = function() {
    if (oper == 0) {
        getTop(0);
    } else {
        move(0);
    }
};

btns[1].onclick = function() {
    if (oper == 0) {
        getTop(1);
    } else {
        move(1);
    }
};

btns[2].onclick = function() {
    if (oper == 0) {
        getTop(2);
    } else {
        move(2);
    }
};

var tow_a = [];
var tow_b = [];
var tow_c = [];
var sum_min = 0;

var getans = function(n) {
    sum_min = 0; // 重置 sum_min
    tow_a = [];
    tow_b = [];
    tow_c = [];
    built(n);
    moveit(n, 'A', 'B', 'C');
    return sum_min;
};

var built = function(n) {
    for (var i = 1; i <= n; i++) {
        tow_a.push(i);
    }
};

var moveit = function(n, a, b, c) {
    if (n == 1) {
        moveDisk(a, c);
        sum_min++; // 移动一次就增加一次计数
    } else {
        moveit(n - 1, a, c, b);
        moveDisk(a, c);
        sum_min++; // 移动一次就增加一次计数
        moveit(n - 1, b, a, c);
    }
};

var moveDisk = function(from, to) {
    var num;
    if (from == 'A') {
        num = tow_a.pop();
    } else if (from == 'B') {
        num = tow_b.pop();
    } else if (from == 'C') {
        num = tow_c.pop();
    }

    if (to == 'A') {
        tow_a.push(num);
    } else if (to == 'B') {
        tow_b.push(num);
    } else if (to == 'C') {
        tow_c.push(num);
    }
};
