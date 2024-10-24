import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;
import { eventTarget, GameLogic } from '../GameLogic';
import { uiManager } from '../framework/uiManager';
import { dicePoints } from '../UI/dicePoints';

@ccclass('mainUI')
export class mainUI extends Component {

    @property(dicePoints)
    scoreLabel: dicePoints = null!;

    @property(Node)
    rollButton: Node = null!;

    @property(Node)
    openShopButton: Node = null!;

    @property(Node)
    lockButton: Node = null!;

    private isRolling: boolean = false;
    private isWhite: boolean = true;

    onLoad() {
        // 添加事件监听
        eventTarget.on('diceRollComplete', this.onDiceRollComplete, this);
    }

    onDestroy() {
        // 移除事件监听
        eventTarget.off('diceRollComplete', this.onDiceRollComplete, this);
    }

    onRollButton() {
        this.rollButton.active = false;
        this.openShopButton.active = false;
        GameLogic.rollAllDice();
        this.isRolling = true;
    }

    onLockButton() {
        if (this.isRolling)
            return;

        if (this.rollButton.active === false) {
            this.rollButton.active = true;
            this.openShopButton.active = true;
        }
        else {
            this.rollButton.active = false;
            this.openShopButton.active = false;
        }
    }

    onOpenShopButton() {
        // uiManager._instance.showDialog('shop/shopUI');
        if (this.isRolling)
            return;
        if (this.isWhite) {
            GameLogic.changeDice('diceRegularBlack');
            this.isWhite = false;
        }
        else {
            GameLogic.changeDice('diceRegularWhite');
            this.isWhite = true;
        }
    }

    onDiceRollComplete(results: number[]) {
        console.log('Dice roll results:', results);
        // 在这里处理骰子结果
        // 例如，更新 UI 显示
        this.updateScoreDisplay(results);
        this.rollButton.active = true;
        this.openShopButton.active = true;
        this.isRolling = false;
    }

    private updateScoreDisplay(results: number[]) {
        // 根据结果更新分数显示
        // 这里假设 scoreLabel 是一个 dicePoints 组件，有一个 updatePoints 方法
        this.scoreLabel.setText('结果为' + results);
    }
}


