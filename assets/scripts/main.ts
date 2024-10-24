import { _decorator, Component, Node } from 'cc';
import { GameLogic } from './GameLogic';
import { uiManager } from "./framework/uiManager";
import { AudioController } from './AudioController';

const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    @property(GameLogic)
    private gameLogic: GameLogic = null!;

    private rollAudio: AudioController = null!;

    start() {
        // 游戏初始化逻辑
        this.addComponent(AudioController);
        this.rollAudio = this.getComponent(AudioController);

        GameLogic.init(this.rollAudio);

        this.showMainUI();
    }

    // 添加其他全局控制方法

    showMainUI()
    {
        uiManager.instance.showDialog('main/mainUI')
    }
}
