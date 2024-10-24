import { _decorator, Component, instantiate, Node, Prefab, Vec3, input, Input, KeyCode, Label, find, assetManager, resources, EventTarget } from 'cc';
import { DiceController } from './DiceController';
import { dicePoints } from './UI/dicePoints';
import { AudioController } from './AudioController';
export const eventTarget = new EventTarget();


const { ccclass, property, integer } = _decorator;

@ccclass('GameLogic')
export class GameLogic extends Component {

    @property(dicePoints)
    pointsLabel?: dicePoints = null!;

    private dices: DiceController[] = [];
    private isRolling: boolean = false;

    private dicePrefabName: string = null!;
    private rollAudio: AudioController = null;

    private diceCount: number = 5;

    private static instance: GameLogic = null!;
    private static defaultDice: string = 'diceRegularWhite';

    public static init(audioController: AudioController) {
        GameLogic.instance.loadDicePrefab(this.defaultDice);
        GameLogic.instance.rollAudio = audioController;
    }

    public static changeDice(dicePrefabName: string) {
        if (!GameLogic.instance) return;

        const instance = GameLogic.instance;
        instance.destroyDices();
        instance.loadDicePrefab(dicePrefabName);
    }

    public static rollAllDice() {
        if (!GameLogic.instance || GameLogic.instance.isRolling) return;

        const instance = GameLogic.instance;
        instance.rollAudio.playOnShot();
        instance.isRolling = true;
        instance.dices.forEach(dice => dice.roll());
        instance.schedule(instance.checkAllDiceStopped, 0.1);
    }

    private loadDicePrefab(dicePath: string) {
        resources.load('prefabs/dices/' + dicePath, Prefab, (err, prefab) => {
            if (err) {
                console.log('load dice prefab error');
                console.error(err);
                return;
            }
            this.initDices(prefab);
        });
    }

    private initDices(dicePrefab: Prefab) {
        for (let i = 0; i < this.diceCount; i++) {
            const diceNode = instantiate(dicePrefab);
            this.node.addChild(diceNode);

            // Generate random position within a 5x5x5 space
            const randomX = Math.random() * 5 - 2.5;
            const randomY = Math.random() * 5;
            const randomZ = Math.random() * 5 - 2.5;
            diceNode.setPosition(new Vec3(randomX, randomY, randomZ));

            // Generate random rotation
            const randomRotX = Math.random() * 360;
            const randomRotY = Math.random() * 360;
            const randomRotZ = Math.random() * 360;
            diceNode.setRotationFromEuler(randomRotX, randomRotY, randomRotZ);

            const dice = diceNode.getComponent(DiceController);
            if (dice) {
                this.dices.push(dice);
            }
        }
    }

    private destroyDices() {
        this.dices.forEach(dice => dice.node.destroy());
        this.dices = [];
    }

    onLoad() {
        GameLogic.instance = this;
    }

    onDestroy() {
        GameLogic.instance = null;
    }

    private checkAllDiceStopped() {
        const allStopped = this.dices.every(dice => dice.checkIfStopped());
        if (allStopped) {
            this.isRolling = false;
            this.unschedule(this.checkAllDiceStopped);
            this.onAllDiceStopped();
        }
    }

    private onAllDiceStopped(): number[] {
        const results = this.dices.map(dice => dice.determineFaceUp()).sort();
        // 触发事件，传递结果
        eventTarget.emit('diceRollComplete', results);
        return results;
    }

    // 添加静态方法来监听事件
    public static onDiceRollComplete(callback: (results: number[]) => void) {
        eventTarget.on('diceRollComplete', callback);
    }

    // 添加静态方法来移除监听
    public static offDiceRollComplete(callback: (results: number[]) => void) {
        eventTarget.off('diceRollComplete', callback);
    }
}
