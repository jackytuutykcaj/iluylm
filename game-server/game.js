const Timer = require("easytimer.js").Timer;

class game {
    constructor(id, host, minPlayers, maxPlayers, players, playerid, playernames, full, io) {
        this.id = id;
        this.host = host;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
        this.players = players;
        this.playerid = playerid;
        this.playernames = playernames;
        this.full = full;
        this.io = io;
        this.roundStartTimer = new Timer();
        this.roundOverTimer = new Timer();
        this.roundStartTimer.addEventListener('targetAchieved', () => {
            this.io.to(this.id).emit('start game');
            this.startGame();
        })
        this.roundStartTimer.addEventListener('secondsUpdated', () => {
            this.io.to(this.id).emit('time left', this.roundStartTimer.getTimeValues().seconds)
        })
        this.roundOverTimer.addEventListener('targetAchieved', () => {
            this.io.to(this.id).emit('go to room');
        })
        this.board = [null, null, null,
            null, null, null,
            null, null, null]
        this.turn = 1;
    }

    startTimer() {
        this.roundStartTimer.start({ countdown: true, startValues: { seconds: 10 } })
    }

    stopTimer() {
        this.roundStartTimer.stop();
        this.io.to(this.id).emit('reset timer')
    }

    updateBoard(area, XorO, index) {
        if (this.board[area - 1] == null) {
            if (index == 0 && this.turn == 1) {
                this.io.to(this.id).emit('place', area, 'x')
                this.board[area - 1] = XorO
                this.checkWin(XorO, index)
            }
            if(index == 1 && this.turn == -1){
                this.io.to(this.id).emit('place', area, 'o')
                this.board[area - 1] = XorO
                this.checkWin(XorO, index)
            }
        }
    }

    checkWin(XorO, index) {
        var win = value => value == XorO;
        var col1 = [this.board[0], this.board[3], this.board[6]]
        var col2 = [this.board[1], this.board[4], this.board[7]]
        var col3 = [this.board[2], this.board[5], this.board[8]]
        var diag1 = [this.board[0], this.board[4], this.board[8]]
        var diag2 = [this.board[3], this.board[4], this.board[6]]
        if (this.board.slice(0, 3).every(win) ||
            this.board.slice(3, 6).every(win) ||
            this.board.slice(6, 9).every(win) ||
            col1.every(win) ||
            col2.every(win) ||
            col3.every(win) ||
            diag1.every(win) ||
            diag2.every(win)) {
            this.io.to(this.id).emit('winner', this.playernames[index])
            this.board = [null, null, null,
                null, null, null,
                null, null, null]
            this.roundOverTimer.start({ countdown: true, startValues: { seconds: 5 } })
            this.turn = this.turn * -1;
        }else{
            this.whoseTurn();
        }
    }

    startGame() {
        this.io.to(this.id).emit('start game');
        if(this.turn == 1){
            this.io.to(this.id).emit('turn', this.playernames[0])
        }else{
            this.io.to(this.id).emit('turn', this.playernames[1])
        }
    }

    whoseTurn(){
        this.turn = this.turn * -1;
        if(this.turn == 1){
            this.io.to(this.id).emit('turn', this.playernames[0])
        }else{
            this.io.to(this.id).emit('turn', this.playernames[1])
        }
    }
}

module.exports = game;