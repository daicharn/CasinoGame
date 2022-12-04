//1種類のトランプにおける最大枚数
const TRUMP_MAX = 13;
//トランプの柄の種類
const TRUMP_PATTERN_TYPE = {
    normal: 0
}
//トランプのマークの種類
const TRUMP_MARK_TYPE = {
    diamond: 0,
    heart: 1,
    spade: 2,
    clover: 3,
    joker: 4
}

class ScriptCore{
    //指定したトランプの画像のパスを生成
    static generateTrumpImagePath(type, pattern, num){
        let trump_images_path = "../trump_images/";
        //指定されたタイプおよび柄が一覧にあり、かつ数値が1～13であること
        if(Object.values(TRUMP_PATTERN_TYPE).includes(type) && Object.values(TRUMP_MARK_TYPE).includes(pattern) && num >= 1 && num <= TRUMP_MAX){
            let type_key = Object.keys(TRUMP_PATTERN_TYPE)[type];
            //ジョーカーだった場合
            if(pattern == TRUMP_MARK_TYPE.joker){
                return trump_images_path + type_key + "/joker.png";
            }
            //普通の柄の場合
            else{
                let pattern_key = Object.keys(TRUMP_MARK_TYPE)[pattern];
                let num_zerofill = String(num).padStart(3, '0');
    
                return trump_images_path + type_key + "/" + pattern_key + "/" + num_zerofill + ".png";
            }
        }
    }
    //指定したトランプの裏面の画像のパスを生成
    static generateTrumpBackImagePath(type){
        let trump_images_path = "../trump_images/";
        if(Object.values(TRUMP_PATTERN_TYPE).includes(type)){
            let type_key = Object.keys(TRUMP_PATTERN_TYPE)[type];
            return trump_images_path + type_key + "/back.png";
        }
    }
    //トランプの山札の配列を生成（シャッフル済み）
    static generateTrumpYamafuda(){
        return ScriptUtil.shuffle_array(Array.from({length: TRUMP_MAX * 4 + 1}, (_, i) => [Math.floor(i / TRUMP_MAX), i % TRUMP_MAX + 1]));
    }
}