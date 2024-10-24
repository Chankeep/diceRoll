import { _decorator, Prefab, Node, error, instantiate, find, resources } from "cc";
const { ccclass } = _decorator;

@ccclass("resourceUtil")
export class resourceUtil {
    public static getUIPrefabRes(prefabPath: string, cb?: (err: Error | null, asset?: Prefab) => void) {
        console.log('获取UI prefab资源地址：' + "prefabs/UI/" + prefabPath)
        resources.load("prefabs/UI/" + prefabPath, Prefab, (err, res) => {
            if (err) {
                error(err.message || err);
                if (cb) {
                    cb(err, res);
                }

                return;
            }

            if (cb) {
                cb(err, res);
            }
        });
    }

    public static createUI(path: string, cb?: (err: Error | null, node?: Node) => void, parent?: Node | null) {
        this.getUIPrefabRes(path, (err: Error | null, prefab?: Prefab) => {
            if (err) return;
            const node = instantiate(prefab!);
            node.setPosition(0, 0, 0);
            if (!parent) {
                parent = find("Canvas");
            }

            parent!.addChild(node);
            if (cb) {
                cb(null, node);
            }
        });
    }

}
