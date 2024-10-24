import { _decorator, Component, Node } from 'cc';
import { uiManager } from '../../framework/uiManager';
const { ccclass, property } = _decorator;

@ccclass('shopUI')
export class shopUI extends Component {

    @property(Node)
    leftArrow: Node = null!;

    @property(Node)
    rightArrow: Node = null!;

    @property(Node)
    cancelButon: Node = null!;


    onLeftArrow() {

    }

    onRightArrow() {

    }

    onCancelButton() {
        uiManager._instance.hideDialog('shop/shopUI');
    }

}


