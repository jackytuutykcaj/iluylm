import { useEffect, useState } from 'react'
import Phaser from "phaser";
import styles from './Game.module.css'
import GameChat from './GameChat'

function Game({socket}) {
    useEffect(() => {
        var config = {
            type: Phaser.AUTO,
            width: '100%',
            height: '100%',
            scene: {
                preload: preload,
                create: create
            },
            parent: 'game',
            backgroundColor: '#FFFFFF'
        }
        var game = new Phaser.Game(config)
    }, [])

    function preload() {
        this.load.image('o', 'assets/o.png')
        this.load.image('x', 'assets/x.png')
    }

    function create() {
        var graphics = this.add.graphics();
        var w = this.scale.width;
        var h = this.scale.height;
        drawBoard(graphics, this.scale.width, this.scale.height)

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x > 0 && pointer.x < w * 0.33) {
                if (pointer.y < h * 0.33) {
                    socket.emit('click', 1)
                }
                if (pointer.y > h * 0.33 && pointer.y < h * 0.66) {
                    socket.emit('click', 4)
                }
                if (pointer.y > h * 0.66) {
                    socket.emit('click', 7)
                }
            }
            if (pointer.x > w * 0.33 && pointer.x < w * 0.66) {
                if (pointer.y < h * 0.33) {
                    socket.emit('click', 2)
                }
                if (pointer.y > h * 0.33 && pointer.y < h * 0.66) {
                    socket.emit('click', 5)
                }
                if (pointer.y > h * 0.66) {
                    socket.emit('click', 8)
                }
            }
            if (pointer.x > w * 0.66) {
                if (pointer.y < h * 0.33) {
                    socket.emit('click', 3)
                }
                if (pointer.y > h * 0.33 && pointer.y < h * 0.66) {
                    socket.emit('click', 6)
                }
                if (pointer.y > h * 0.66) {
                    socket.emit('click', 9)
                }
            }
        })
        socket.on('place', (area, piece) => {
            var x, y
            var w = this.scale.width;
            var h = this.scale.height;
            switch (area) {
                case 1:
                    x = w * 0.33 / 2;
                    y = h * 0.33 / 2;
                    break;
                case 2:
                    x = (w * 0.33 / 2) + ((w * 0.33));
                    y = h * 0.33 / 2;
                    break;
                case 3:
                    x = (w * 0.33 / 2) + ((w * 0.33) * 2);
                    y = h * 0.33 / 2;
                    break;
                case 4:
                    x = w * 0.33 / 2;
                    y = (h * 0.33 / 2) + (h * 0.33);
                    break;
                case 5:
                    x = (w * 0.33 / 2) + ((w * 0.33));
                    y = (h * 0.33 / 2) + (h * 0.33);
                    break;
                case 6:
                    x = (w * 0.33 / 2) + ((w * 0.33) * 2);
                    y = (h * 0.33 / 2) + (h * 0.33);
                    break;
                case 7:
                    x = w * 0.33 / 2;
                    y = (h * 0.33 / 2) + (h * 0.33 * 2);
                    break;
                case 8:
                    x = (w * 0.33 / 2) + ((w * 0.33));
                    y = (h * 0.33 / 2) + (h * 0.33 * 2);
                    break;
                case 9:
                    x = (w * 0.33 / 2) + ((w * 0.33) * 2);
                    y = (h * 0.33 / 2) + (h * 0.33 * 2);
                    break;
            }
            this.add.image(x, y, piece).setScale(0.2)
        })
    }

    function drawBoard(graphics, w, h) {
        graphics.lineStyle(10, 0x000000, 1);

        graphics.lineBetween(w * 0.33, 0, w * 0.33, h);
        graphics.lineBetween(w * 0.66, 0, w * 0.66, h);
        graphics.lineBetween(0, h * 0.33, w, h * 0.33);
        graphics.lineBetween(0, h * 0.66, w, h * 0.66);
    }

    return (
        <div className={styles.TicTacToe} id='TicTacToe'>
            <div id='game' style={{float: 'left', height: '100%', width: '100%'}} />
        </div>
    )
}

export default Game