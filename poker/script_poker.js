//ポーカーの手札の枚数
const TEFUDA_NUM = 5;
//BETの最大数
const BET_MAX = 10;
//役に関連するものの定義
const ROLES_INFO = {
    royalstraightflush: {value : 0, coin: 100, name: "ロイヤルストレートフラッシュ"},
    fivecard: {value : 1, coin: 50, name: "ファイブカード"},
    straightflush: {value : 2, coin: 20, name: "ストレートフラッシュ"},
    fourcard: {value : 3, coin: 10, name: "フォーカード"},
    fullhouse: {value : 4, coin: 5, name: "フルハウス"},
    flush: {value : 5, coin: 4, name: "フラッシュ"},
    straight: {value : 6, coin: 3, name: "ストレート"},
    threecard: {value : 7, coin: 1, name: "スリーカード"},
    twopair: {value : 8, coin: 1, name: "ツーペア"}
}
//山札の配列（合計53枚）
let yamafuda_array = ScriptCore.generateTrumpYamafuda();
//手札の配列
let tefuda_array = [];
//手札を変更するかしないかのフラグ
let tefuda_change_flgs = new Array(5).fill(true);
//BETの回数
let bet_count = 0;
//成立した役の種類を記憶
let role_complete_type = -1;

//アニメーション用のオブジェクト
//役のラベル用
let animate_label_objs = new Array(Object.keys(ROLES_INFO).length).fill(null);
let animate_value_objs = new Array(Object.keys(ROLES_INFO).length).fill(null);
//手札の画像用
let animate_tefuda_objs = new Array(TEFUDA_NUM).fill(null);

//手札の基盤を作成
for(let i = 0; i < TEFUDA_NUM; i++){
    let tefuda_div = document.createElement('div');
    tefuda_div.className = "tefuda_div";
    tefuda_div.id = "tefuda_div_" + String(i + 1);
    let tefuda_img_div = document.createElement('div'); 
    tefuda_img_div.className = "tefuda_img_div";
    let tefuda_img = document.createElement('img');
    let tefuda_img_back = document.createElement('img');
    tefuda_img_back.className = "tefuda_img_back";
    tefuda_img_back.src = ScriptCore.generateTrumpBackImagePath(TRUMP_PATTERN_TYPE.normal);
    tefuda_img.className = "tefuda_img";
    tefuda_img_div.appendChild(tefuda_img);
    tefuda_img_div.appendChild(tefuda_img_back);
    let tefuda_btn = document.createElement('div');
    tefuda_btn.className = "tefuda_btn";
    tefuda_btn.innerText = "かえる";
    tefuda_div.appendChild(tefuda_img_div);
    tefuda_div.appendChild(tefuda_btn);
    document.getElementById('tefuda_block_div').appendChild(tefuda_div);
}

//役一覧のコインの額をBET額に応じて変更
function changeRoleCoinsValue(bet_amount){
    let roles_coin_value = Array.from(document.getElementsByClassName('role_coin_value'));
    roles_coin_value.forEach((role_coin_value, i) => {
        role_coin_value.innerText = ROLES_INFO[Object.keys(ROLES_INFO)[i]].coin * bet_amount;
    });
}

//BET決定ボタンが有効な時、マウスを当てた時のイベント
function eventBtnBetMouseOver(){
    let btn_enter = document.getElementById('btn_enter');
    btn_enter.style.backgroundColor = "rgba(20, 20, 20, 0.8)";
}
//BET決定ボタンが有効な時、マウスを離した時のイベント
function eventBtnBetMouseLeave(){
    let btn_enter = document.getElementById('btn_enter');
    btn_enter.style.backgroundColor = "rgba(43, 43, 43, 0.8)";
}

//掛け金の増減ボタンのイベント登録
let buttons_bet_control = Array.from(document.getElementsByClassName('btn_bet_control'));
buttons_bet_control.forEach((btn_bet_control, i) => {
    btn_bet_control.addEventListener("click", () =>{
        //コインの倍率の値を保持するリストボックス
        let select_multiplier = document.getElementById('select_multiplier');
        //BETの量を表示するボックス
        let bet_win_value = document.getElementById('bet_win_value');
        //決定ボタンのボックス
        let btn_enter = document.getElementById('btn_enter');
        //マイナスボタンが押された時
        if(i == 0){
            //BET回数が0でなければ減らす処理
            if(bet_count > 0){
                bet_count--;
            }
        }
        //プラスボタンが押された時
        else{
            //BET回数が最大の10でなければ増やす処理
            if(bet_count < BET_MAX){
                bet_count++;
            }
        }
        //BETの量をボックスに反映
        let bet_amount = bet_count * select_multiplier.value;
        bet_win_value.innerText = bet_amount;
        //役一覧のコインの額をBET額に応じて変更
        changeRoleCoinsValue(bet_amount);
        //BET回数が0になったらコインの倍率の値を変更可能にする
        if(bet_count == 0){
            select_multiplier.disabled = false;
            //ボタンの色の変更
            btn_enter.style.backgroundColor = "rgba(161, 161, 161, 0.8)";
            //マウスが乗っかった時のイベントを削除
            btn_enter.removeEventListener('mouseover', eventBtnBetMouseOver);
            //マウスが離れたときのイベントを削除
            btn_enter.removeEventListener('mouseleave', eventBtnBetMouseLeave);
        }
        //BET回数が1になったらコインの倍率の値を変更不可にする（決定ボタンの色を変化）
        else if(bet_count == 1){
            select_multiplier.disabled = true;
            //ボタンの色の変更
            btn_enter.style.backgroundColor = "rgba(43, 43, 43, 0.8)";
            //マウスが乗っかった時のイベントを登録
            btn_enter.addEventListener('mouseover', eventBtnBetMouseOver);
            //マウスが離れたときのイベントを登録
            btn_enter.addEventListener('mouseleave', eventBtnBetMouseLeave);
        }
    });
});

//コインの値を取得する
function getCoinValue(){
    return Number(document.getElementById('coin_value').innerText);
}
//コインの値を設定する
function setCoinValue(value){
    document.getElementById('coin_value').innerText = value;
}
//BET/WINの値を取得する
function getBetWinValue(){
    return Number(document.getElementById('bet_win_value').innerText);
}
//BET/WINの値を設定する
function setBetWinValue(value){
    document.getElementById('bet_win_value').innerText = value;
}

//掛け金設定に関する項目の表示、非表示を切り替える
function toggleVisibleBetSetting(flg){
    if(flg){
        document.getElementById('bet_setting_div').style.visibility = "visible";
    }
    else{
        document.getElementById('bet_setting_div').style.visibility = "hidden";
    }
}

//掛け金の決定ボタンがクリックされた時の処理を登録
document.getElementById('btn_enter').addEventListener("click", async() =>{
    //コインの量
    let coin_value = getCoinValue();
    //BETの量
    let bet_value = getBetWinValue();
    //BETが0の場合、メッセージを出力して終了
    if(bet_value <= 0){
        alert("コインを賭けてください。");
        return;
    }
    //コインが足りない場合、メッセージを出力して終了
    if(coin_value < bet_value){
        alert("コインが足りません。");
        return;
    }
    //コインが足りた場合はコインからBETを引いた額をコインに反映する
    setCoinValue(coin_value - bet_value);

    //掛け金設定に関する項目を非表示にする
    toggleVisibleBetSetting(false);

    //山札からカードを5枚引く
    drawFiveCardFromYamafuda();
    //手札をソートする
    sortTefudaArray(tefuda_array);
    //5枚引いた手札の画像を挿入
    insertFiveTefudaImages();

    //手札の裏の画像
    let tefuda_imgs_back = document.getElementsByClassName('tefuda_img_back');
    //手札のアニメーション
    for(let i = 0; i < tefuda_array.length; i++) {
        //手札の裏を見える状態にする
        tefuda_imgs_back[i].style.visibility = "visible";
        //手札を上から下に動かすアニメーション
        let duration_time = 200;
        upDownTefudaImageAnimation(i + 1, duration_time);
        //上下に動かす時間分待機
        await ScriptUtil.sleep(duration_time);
        //手札を表示
        Array.from(document.getElementsByClassName('tefuda_img'))[i].style.visibility = "visible";
        //手札をひっくり返すアニメーション
        turnTefudaImageAnimation(i + 1);
        //手札の裏を見えない状態にする
        tefuda_imgs_back[i].style.visibility = "hidden";
    }

    //1秒程度待機
    await ScriptUtil.sleep(1000);
    //手札の裏の回転をリセットする
    resetTurnTefudaImageBack();
    //手札のボタンと配るボタンを表示
    toggleVisibleTefudaButtons(true);
    toggleVisibleFlipButton(true);

    //役の判定を行う
    let roles_result = judgeRoles(tefuda_array);
    //役が成立した場合
    if(roles_result != undefined){
        //役のラベルを光らせる
        lightRoleLabel(roles_result[0], true);
        //役に該当する手札の画像を光らせる
        roles_result[1].forEach(x => ShiningTefudaImage(x + 1));
        //成立した役の記憶
        role_complete_type = roles_result[0];
    }
});

//手札の画像を上から下に動かすアニメーション
function upDownTefudaImageAnimation(num, duration_time){
    //1から5で指定
    if(num > 0 && num <= TEFUDA_NUM){
        //手札の画像の要素
        let tefuda_img_div = document.getElementsByClassName('tefuda_img_div')[num - 1];
        let keyframes_moving = [{transform: "translateY(-700px)"}, {transform: "translateY(0)"}];
        let leyframes_setting = {duration: duration_time};
        tefuda_img_div.animate(keyframes_moving, leyframes_setting);
    }
}

//手札をひっくり返すアニメーション
function turnTefudaImageAnimation(num){
    //1から5で指定
    if(num > 0 && num <= TEFUDA_NUM){
        //手札の表の画像
        let tefuda_img = document.getElementsByClassName('tefuda_img')[num - 1];
        //手札の裏の画像
        let tefuda_img_back = document.getElementsByClassName('tefuda_img_back')[num - 1];
        //手札を裏から表にひっくり返すアニメーション
        if(tefuda_img.style.transform == ""){
            tefuda_img.style.transform = "rotateY(360deg)";
        }
        else{
            tefuda_img.style.transform = "";
        }
        tefuda_img_back.style.transform = "rotateY(-180deg)";
    }
}
//手札の裏の回転をリセットする
function resetTurnTefudaImageBack(){
    //手札の裏の画像
    let tefuda_imgs_back = Array.from(document.getElementsByClassName('tefuda_img_back'));
    tefuda_imgs_back.forEach(tefuda_img_back => {
        tefuda_img_back.style.transform = "";
    });
}

//役の名前を画面中央に表示する
async function viewRoleNameCenter(role_index){
    //役の名前を表示する要素
    role_str_center = document.getElementById('role_str_center');
    //役の名前の文字を取得
    role_str = ROLES_INFO[Object.keys(ROLES_INFO)[role_index]].name;
    //役の文字を1文字ずつspanで区切って表示する要素に放り込む
    Array.prototype.forEach.call(role_str, (str) => {
        let elem_span = document.createElement('span');
        elem_span.className = "role_str_span";
        elem_span.innerText = str;
        elem_span.style.display = "inline-block";
        elem_span.style.visibility = "hidden";
        role_str_center.appendChild(elem_span);
    });
    //末尾にビックリマークを追加
    let span_exclamation = document.createElement('span');
    span_exclamation.className = "role_str_span";
    span_exclamation.innerText = "！";
    span_exclamation.style.display = "inline-block";
    span_exclamation.style.visibility = "hidden";
    role_str_center.appendChild(span_exclamation);

    let role_str_spans = Array.from(document.getElementsByClassName('role_str_span'));
    //一文字ずつ下から出現するアニメーション
    for(let i = 0; i < role_str_spans.length; i++){
        let duration_time_1 = 100;
        role_str_spans[i].style.visibility = "visible";
        role_str_spans[i].animate([{transform: "translateY(50px)"}, {transform: "translateY(0)"}], {duration: duration_time_1});
        await ScriptUtil.sleep(duration_time_1);
    }
    //前方へ少し移動して消えるアニメーション
    let duration_time_2 = 200;
    role_str_center.animate([{offset: 0.2, transform: "translateX(-50%) scale(0.9)"}, {offset: 1.0, transform: "translate(-50%, 1px) scale(1.3)"}], {duration: duration_time_2});
    await ScriptUtil.sleep(duration_time_2);
    //span要素を全て削除
    role_str_spans.forEach(role_str_span => role_str_span.remove());
}

//BETラベルを点灯させてWINラベルを消灯する
function lightUpBetLabel(){
    let bet_label = document.getElementById('bet_label');
    let win_label = document.getElementById('win_label');
    //BETラベルを点灯
    bet_label.style.color = "rgb(204, 3, 194)";
    //WINラベルを消灯
    win_label.style.color = "rgb(255, 255, 255)";
    
}
//WINラベルを点灯させてBETラベルを消灯する
function lightUpWinLabel(){
    let bet_label = document.getElementById('bet_label');
    let win_label = document.getElementById('win_label');
    //WINラベルを点灯
    win_label.style.color = "rgb(0, 236, 39)";
    //BETラベルを消灯
    bet_label.style.color = "rgb(255, 255, 255)";
}

//指定の要素内の数値を開始する値から終了する値まで指定の間隔で増減させる
async function countUpDownElemNum(target_div, start, end, increment){
    if(!(start == end)){
        while(start != end){
            //開始の値が終了の値より小さい場合、加算する
            if(start < end){
                start += increment;
            }
            //開始の値が終了の値より大きい場合、減算する
            else{
                start -= increment;
            }
            target_div.innerText = start;
            //10ms待機する
            await ScriptUtil.sleep(10);
        }
    }
}

//カードを配るボタンがクリックされた時の処理を登録
document.getElementById('btn_flip').addEventListener("click",async() =>{
    //カードを配るボタンを見えなくする
    toggleVisibleFlipButton(false);
    //手札のボタンを見えなくする
    toggleVisibleTefudaButtons(false);

    //手札全て残す場合以外は手札を変える処理を行う
    if(tefuda_change_flgs.some(tefuda_change_flg => tefuda_change_flg)){
        //入れ替える手札を一時的に非表示
        Array.from(document.getElementsByClassName('tefuda_img')).forEach((tefuda_img, i) => {
            if(tefuda_change_flgs[i]){
                tefuda_img.style.visibility = "hidden";
            }
        });

        //手札を変える場所を探す
        for(let i = 0; i < tefuda_change_flgs.length; i++) {
            //変える指定があった手札の変更を行う
            if(tefuda_change_flgs[i]){
                //手札の画像の輝きを止める
                stopShiningTefudaImages();
                //役のラベルの点灯をすべて削除
                Object.keys(ROLES_INFO).forEach((_, i) => lightRoleLabel(i, false));
                
                //山札からカードを一枚引く
                let drawn_card = yamafuda_array.pop();
                //引いたカードを手札に置き換える
                tefuda_array[i] = drawn_card;

                //手札を裏返す（手札の裏用の画像を表示する）
                //手札の裏の画像
                let tefuda_imgs_back = document.getElementsByClassName('tefuda_img_back');
                //手札の裏を見える状態にする
                tefuda_imgs_back[i].style.visibility = "visible";
                //手札を上から下に動かすアニメーション
                let duration_time = 200;
                upDownTefudaImageAnimation(i + 1, duration_time);
                //上下に動かす時間分待機
                await ScriptUtil.sleep(duration_time);
                //一時的に非表示にしていた手札を再度表示
                Array.from(document.getElementsByClassName('tefuda_img'))[i].style.visibility = "visible";
                //手札の画像を置き換える
                insertTargetTefudaImage(i + 1, ScriptCore.generateTrumpImagePath(TRUMP_PATTERN_TYPE.normal, drawn_card[0], drawn_card[1]));
                //手札をひっくり返すアニメーション
                turnTefudaImageAnimation(i + 1);
                //手札の裏を見えない状態にする
                tefuda_imgs_back[i].style.visibility = "hidden";
            }
        }

        //1秒程度待機
        await ScriptUtil.sleep(1000);
        //手札の裏の回転をリセットする
        resetTurnTefudaImageBack();

        //再度役の判定を行う
        let roles_result = judgeRoles(tefuda_array);
        //役が成立した場合
        if(roles_result != undefined){
            //役のラベルを光らせる
            lightRoleLabel(roles_result[0], true);
            //役に該当する手札の画像を光らせる
            roles_result[1].forEach(x => ShiningTefudaImage(x + 1));
            //成立した役の記憶
            role_complete_type = roles_result[0];
        }
        else{
            //役が何もない状態に戻す
            role_complete_type = -1;
        }
    }

    //手札のボタンとフラグを初期化
    initAllTefudaButtons();

    //役が成立している場合
    if(role_complete_type != -1){
        //獲得したコインを表示
        let get_coin_value = Number(Array.from(document.getElementsByClassName('role_coin_value'))[role_complete_type].innerText);
        setBetWinValue(get_coin_value);
        //WINラベルを点灯させる
        lightUpWinLabel();
        //役の名前を画面中央に表示するアニメーション
        await viewRoleNameCenter(role_complete_type);

        //所持コインと獲得コインの入れ替え
        let multiplier_value = Number(document.getElementById('select_multiplier').value);
        let coin_value_div = document.getElementById('coin_value');
        let win_value_div = document.getElementById('bet_win_value');
        let coin_value = Number(coin_value_div.innerText);
        let win_value = Number(win_value_div.innerText);
        //所持コインを増やす
        await countUpDownElemNum(coin_value_div, coin_value, coin_value + win_value, multiplier_value);
        //獲得コインを減らす
        await countUpDownElemNum(win_value_div, win_value, 0, multiplier_value);
    }
    //役が成立していない場合
    else{
        //獲得コインを0枚にする
        let win_value_div = document.getElementById('bet_win_value');
        win_value_div.innerText = "0";
    }

    //再挑戦ボタンを表示
    let btn_retry = document.getElementById('btn_retry');
    btn_retry.style.visibility = "visible";
});

//再挑戦ボタンがクリックされた時の処理を登録
document.getElementById('btn_retry').addEventListener("click",() =>{
    //自分自身を非表示にする
    document.getElementById('btn_retry').style.visibility = "hidden";
    //役のラベルの点灯をすべて削除
    Object.keys(ROLES_INFO).forEach((_, i) => lightRoleLabel(i, false));
    //手札の画像の輝きを止める
    stopShiningTefudaImages();
    //全ての手札の画像をクリアして非表示にする
    clearAllTefudaImages();
    //BETラベルが点灯している状態に戻す
    lightUpBetLabel();
    //一番左の手札に裏返しにしたトランプの画像を設置する
    insertTrampBackImageToTefudaFirst();
    //山札の初期化
    yamafuda_array = ScriptCore.generateTrumpYamafuda();
    //手札の初期化
    tefuda_array = [];
    //BETの額を再設定
    let bet_win_value = document.getElementById('bet_win_value');
    bet_win_value.innerText = Number(document.getElementById('select_multiplier').value) * bet_count;
    //掛け金設定項目を表示する
    bet_setting_div = document.getElementById('bet_setting_div');
    bet_setting_div.style.visibility = "visible";
});

//指定した手札ボタンのフラグを変更
function changeTefudaBtnFlg(i, flg){
    //フラグの変更
    tefuda_change_flgs[i] = flg;
}
//手札ボタンの表示をフラグに応じて変更
function changeTefudaBtnView(tefuda_btn_div, flg){
    //かえるに変更
    if(flg){
        tefuda_btn_div.innerText = "かえる";
        tefuda_btn_div.style.backgroundColor = "rgba(43, 43, 43, 0.8)";
        tefuda_btn_div.style.color = "rgb(255, 255, 255)";
    }
    //のこすに変更
    else{
        tefuda_btn_div.innerText = "のこす";
        tefuda_btn_div.style.backgroundColor = "rgba(255, 251, 8, 0.6)";
        tefuda_btn_div.style.color = "rgb(0, 0, 0)";
    }
}

//全ての手札ボタンのフラグと表示を初期化
function initAllTefudaButtons(){
    tefuda_change_flgs.forEach((x, i) => {
        changeTefudaBtnFlg(i, true);
        changeTefudaBtnView(document.getElementsByClassName('tefuda_btn')[i], true);
    });
}

//手札の変更フラグボタンのイベント登録
let tefuda_buttons = Array.from(document.getElementsByClassName('tefuda_btn'));
tefuda_buttons.forEach((tefuda_btn, i) => {
    tefuda_btn.addEventListener("click", () =>{
        //フラグがON（かえる）なら
        if(tefuda_change_flgs[i]){
            //フラグを変更
            changeTefudaBtnFlg(i, false);
            //ボタンの表示を変更
            changeTefudaBtnView(tefuda_btn, false);
        }
        //フラグがOFF（のこす）なら
        else{
            changeTefudaBtnFlg(i, true);
            //ボタンの表示を変更
            changeTefudaBtnView(tefuda_btn, true);
        }
    });
});

//山札からカードを5枚引く処理（最初に実行）
function drawFiveCardFromYamafuda(){
    for(let i = 0; i < TEFUDA_NUM; i++){
        //山札からカードを一枚引く
        let yamafuda_draw = yamafuda_array.pop();
        //引いたカードを手札に入れる
        tefuda_array.push(yamafuda_draw);
    }
}
//手札をソートする（柄の種類、番号の順にソート、ジョーカーは一番右に）
function sortTefudaArray(array){
    //手札をソートする（柄の種類、番号の順にソート）
    array.sort((a, b) => a[0] - b[0]);
    array.sort(function(a, b){
        //ジョーカーに関してはソートを行わない
        if([a[0], b[0]].every(x => x != TRUMP_MARK_TYPE.joker)) return a[1] - b[1]
    });
}

//指定した箇所の手札の画像を設定する
function insertTargetTefudaImage(num, path){
    //1から5で指定
    if(num > 0 && num <= TEFUDA_NUM){
        let tefuda_images = document.getElementsByClassName('tefuda_img');
        tefuda_images[num - 1].src = path;
    }
}

//5枚引いた手札の画像を挿入
function insertFiveTefudaImages(){
    let tefuda_images = document.getElementsByClassName('tefuda_img');
    Array.from(tefuda_images).forEach((tefuda_image, i) =>{
        //手札に引いたカードの画像をセットする
        tefuda_image.src = ScriptCore.generateTrumpImagePath(TRUMP_PATTERN_TYPE.normal, tefuda_array[i][0], tefuda_array[i][1]);
    });
}

//一番左の手札に裏返しにしたトランプの画像を設置し、表示状態にする
function insertTrampBackImageToTefudaFirst(){
    let tefuda_images = document.getElementsByClassName('tefuda_img');
    tefuda_images[0].src = ScriptCore.generateTrumpBackImagePath(TRUMP_PATTERN_TYPE.normal);
    tefuda_images[0].style.visibility = "visible";
}

//手札の画像の表示、非表示を切り替える
function toggleVisibleTefudaImages(flg){
    let tefuda_images = document.getElementsByClassName('tefuda_img');
    Array.from(tefuda_images).forEach(tefuda_image =>{
        if(flg){
            tefuda_image.style.visibility = "visible";
        }
        else{
            tefuda_image.style.visibility = "hidden";
        }
    });
}

//手札の画像をすべてクリアして非表示にする
function clearAllTefudaImages(){
    let tefuda_images = document.getElementsByClassName('tefuda_img');
    Array.from(tefuda_images).forEach(tefuda_image => {
        tefuda_image.style.visibility = "hidden";
        tefuda_image.src = "";
    });
}

//手札のボタンの表示、非表示を切り替える
function toggleVisibleTefudaButtons(flg){
    tefuda_buttons.forEach(tefuda_btn => {
        if(flg){
            tefuda_btn.style.visibility = "visible";
        }
        else{
            tefuda_btn.style.visibility = "hidden";
        }

    });
}
//配るボタンの表示、非表示を切り替える
function toggleVisibleFlipButton(flg){
    if(flg){
        document.getElementById('btn_flip').style.visibility = "visible";
    }
    else{
        document.getElementById('btn_flip').style.visibility = "hidden";
    }
}

//ツーペアに合致するインデックスの集合を判定して返す（無い場合は何も返さない）
function getTwoPairindexes(tefuda_ary){
    //手札の柄、番号をインデックス付きの配列として取り出す
    let tefuda_info_array = tefuda_ary.map((x, i) => [x[0], x[1], i]);
    //配列5個から2個を抜き出した全ての組み合わせの配列を生成する
    let tefuda_combination_5c2 = ScriptUtil.getArrayCombination(tefuda_info_array, 2);
    //全ての組み合わせのうち2個の数値が同じものに関してインデックスを取得する（重複させない）
    let pair_indexes = [...new Set(tefuda_combination_5c2.filter((element) => {
        //番号が同じかつどちらもジョーカーでないこと
        if(element[0][1] == element[1][1] && [element[0][0], element[1][0]].every(x => x != TRUMP_MARK_TYPE.joker)){
            return true;
        }
        else{
            return false;
        }
    }).flat().map(x => x[2]))];
    
    return pair_indexes;
}

//スリーカードに合致するインデックスの集合を判定して返す
function getThreeCardIndexes(tefuda_ary){
    //手札の柄、番号をインデックス付きの配列として取り出す
    let tefuda_info_array = tefuda_ary.map((x, i) => [x[0], x[1], i]);
    //配列5個から3個を抜き出した全ての組み合わせの配列を生成する
    let tefuda_combination_5c3 = ScriptUtil.getArrayCombination(tefuda_info_array, 3);
    //全ての組み合わせの中から3個の数値が同じまたは2個+ジョーカーのものを探し、最初に見つかった物のインデックスを所得する
    let three_indexes = tefuda_combination_5c3.find((element) => {
        //要素を柄でソート（ジョーカーを一番右（index:2）にするため）
        element.sort((a, b) => a[0] - b[0]);
        //3つとも番号が同じまたは2つ番号が同じでジョーカーが存在すること
        if((element[0][1] == element[1][1] && element[1][1] == element[2][1]) || (element[0][1] == element[1][1] && element[2][0] == TRUMP_MARK_TYPE.joker)){
            return true;
        }
        else{
            return false;
        }
    });
    
    //組み合わせが見つかった時
    if(three_indexes != undefined){
        return Array.from(three_indexes).map(x => x[2]).sort();
    }
    //何も見つからなかったとき
    else{
        return [];
    }
}

//ロイヤルストレートの判定
function isRoyalStraight(tefuda_ary){
    //ジョーカーがあるかどうか
    let jokey_flg = tefuda_ary.some(x => x[0] == TRUMP_MARK_TYPE.joker);
    //手札の番号の配列を生成（ジョーカーは排除して、ソートする）
    //通常の配列の長さは5だがジョーカーがある場合は4になる
    let tefuda_num_array = tefuda_ary.filter(x => x[0] != TRUMP_MARK_TYPE.joker).map(x => x[1]).sort((a, b) => a - b);
    //エースまたはK(13)の少なくともどちらかが存在すること
    if(tefuda_num_array.includes(1) || tefuda_num_array.includes(13)){
        //エースがある場合、取り除く
        tefuda_num_array = tefuda_num_array.filter(x => x != 1);
        //エースを除いた時点で長さが4の時
        if(tefuda_num_array.length == 4){
            //配列の先頭が10かつ連続した値であればtrueを返す
            if(tefuda_num_array[0] == 10 && ScriptUtil.isArrayStraight(tefuda_num_array)){
                return true;
            }
        }
        //長さが3かつジョーカーがある場合（エースとジョーカーの両方があった場合）
        else if(tefuda_num_array.length == 3 && jokey_flg){
            //先頭が10または11で連続した値であればtrueを返す
            if((tefuda_num_array[0] == 10 || tefuda_num_array[0] == 11) && ScriptUtil.isArrayStraight(tefuda_num_array)){
                return true;
            }
            //左から2番目、右から2番目の2つを左隣より1大きい数字で埋めた配列を生成してそれぞれ判定する
            else{
                for(let i = 0; i < tefuda_num_array.length - 1; i++){
                    //手札の番号の配列をコピー
                    let tefuda_num_array_copy = tefuda_num_array.slice();
                    tefuda_num_array_copy.splice(i + 1, 0, tefuda_num_array[i] + 1);
                    //先頭が10かつ連続した値であればtrueを返す
                    if(tefuda_num_array_copy[0] == 10 && ScriptUtil.isArrayStraight(tefuda_num_array_copy)){
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

//ストレートであるかどうか
function isStraight(tefuda_ary){
    //手札の番号の配列を生成（ジョーカーは排除して、ソートする）
    //通常の配列の長さは5だがジョーカーがある場合は4になる
    let tefuda_num_array = tefuda_ary.filter(x => x[0] != TRUMP_MARK_TYPE.joker).map(x => x[1]).sort((a, b) => a - b);
    //ジョーカーの有無関係なしで連続した値であればtrueを返す
    if(ScriptUtil.isArrayStraight(tefuda_num_array)){
        return true;
    }
    //ジョーカーがある場合
    if(tefuda_num_array.length == 4){
        //左から2番目、真ん中、右から2番目の3つを左隣より1大きい数字で埋めた配列を生成してそれぞれ判定する
        for(let i = 0; i < tefuda_num_array.length - 1; i++){
            //手札の番号の配列をコピー
            let tefuda_num_array_copy = tefuda_num_array.slice();
            tefuda_num_array_copy.splice(i + 1, 0, tefuda_num_array[i] + 1);
            if(ScriptUtil.isArrayStraight(tefuda_num_array_copy)){
                return true;
            }
        }
    }
    //ロイヤルストレートに合致する場合もストレートとして扱う
    if(isRoyalStraight(tefuda_ary)){
        return true;
    }

    return false;
}

//フラッシュであるかどうか
function isFlush(tefuda_ary){
    //手札の柄の配列（重複を除く）を生成（ジョーカーは排除）
    let tefuda_mark_array = [...new Set(tefuda_ary.filter(x => x[0] != TRUMP_MARK_TYPE.joker).map(x => x[0]))];
    //手札の柄の重複がなければ（配列の長さが1）trueを返す
    if(tefuda_mark_array.length == 1){
        return true;
    }

    return false;
}

//フォーカードに合致するインデックスの集合を判定して返す
function getFourCardIndexes(tefuda_ary){
    //手札の柄、番号をインデックス付きの配列として取り出す
    let tefuda_info_array = tefuda_ary.map((x, i) => [x[0], x[1], i]);
    //配列5個から4個を抜き出した全ての組み合わせの配列を生成する
    let tefuda_combination_5c4 = ScriptUtil.getArrayCombination(tefuda_info_array, 4);
    //全ての組み合わせの中から4個の数値が同じまたは3個+ジョーカーのものを探し、最初に見つかった物のインデックスを所得する
    let four_indexes = tefuda_combination_5c4.find((element) => {
        //要素を柄でソート（ジョーカーを一番右（index:3）にするため）
        element.sort((a, b) => a[0] - b[0]);
        //4つとも番号が同じまたは3つ番号が同じでジョーカーが存在すること
        if(([element[0][1],element[1][1],element[2][1],element[3][1]].every((x,_,array) => x == array[0]) || (element[0][1] == element[1][1] && element[1][1] == element[2][1] && element[3][0] == TRUMP_MARK_TYPE.joker))){
            return true;
        }
        else{
            return false;
        }
    });
    
    //組み合わせが見つかった時
    if(four_indexes != undefined){
        return Array.from(four_indexes).map(x => x[2]).sort();
    }
    //何も見つからなかったとき
    else{
        return [];
    }
}

//ファイブカードであるかどうか
function isFiveCard(tefuda_ary){
    const JOKER = 100;
    //手札の番号の配列（重複を除く）を生成（ジョーカーを除外しない）
    let tefuda_num_array = [...new Set(tefuda_ary.map(x => {
            if(x[0] != TRUMP_MARK_TYPE.joker){
                return x[1];
            }
            else{
                return JOKER;
            }
        }))];
    //ジョーカーを含んでいるかつ他の番号が一つしかない場合trueを返す
    if(tefuda_num_array.includes(JOKER) && tefuda_num_array.length == 2){
        return true;
    }

    return false;
}


//役の判定により様々な情報を得る
function judgeRoles(tefuda_ary){
    //全ての手札に該当する役専用のインデックス
    let index_all = [0, 1, 2, 3, 4];
    //ツーペアに該当するインデックス
    let twopair_index = getTwoPairindexes(tefuda_ary);
    //スリーカードに該当するインデックス
    let threecard_index = getThreeCardIndexes(tefuda_ary);
    //ストレートであるかどうか
    let straight_flg = isStraight(tefuda_ary);
    //ロイヤルストレートであるかどうか
    let royalstraight_flg = isRoyalStraight(tefuda_ary);
    //フラッシュであるかどうか
    let flush_flg = isFlush(tefuda_ary);
    //フォーカードに該当するインデックス
    let fourcard_index = getFourCardIndexes(tefuda_ary);
    //ファイブカードであるかどうか
    let fivecard_flg = isFiveCard(tefuda_ary);

    //役の判定
    //ロイヤルストレートフラッシュ
    if(royalstraight_flg && flush_flg){
        return [ROLES_INFO.royalstraightflush.value, index_all];
    }
    //ファイブカード
    else if(fivecard_flg){
        return [ROLES_INFO.fivecard.value, index_all];
    }
    //ストレートフラッシュ
    else if(straight_flg && flush_flg){
        return [ROLES_INFO.straightflush.value, index_all];
    }
    //フォーカード
    else if(fourcard_index.length == 4){
        return [ROLES_INFO.fourcard.value, fourcard_index];
    }
    //フルハウス
    else if(threecard_index.length == 3 && twopair_index.length >= 4){
        return [ROLES_INFO.fullhouse.value, index_all];
    }
    //フラッシュ
    else if(flush_flg){
        return [ROLES_INFO.flush.value, index_all];
    }
    //ストレート
    else if(straight_flg){
        return [ROLES_INFO.straight.value, index_all];
    }
    //スリーカード
    else if(threecard_index.length == 3){
        return [ROLES_INFO.threecard.value, threecard_index];
    }
    //ツーペア
    else if(twopair_index.length == 4){
        return [ROLES_INFO.twopair.value, twopair_index];
    }
}

//指定した役のラベルを光らせる
function lightRoleLabel(role_index, flg){
    let role_labels = document.getElementsByClassName('role_label');
    let role_values = document.getElementsByClassName('role_coin_value');
    //flgがtrueなら光らせる
    if(flg){
        //文字の色を変える
        role_labels[role_index].style.color = "rgb(0, 0, 0)";
        role_values[role_index].style.color = "rgb(0, 0, 0)";
        //文字のバックをアニメーション化する
        let keyflame_animation = {background: ["rgb(255, 255, 255)", "rgb(170, 170, 170)"]};
        let keyflame_options = {iterations: Infinity, direction: "alternate", duration: 1000};
        //返り値はアニメーションを消すのに必要なため受け取っておく
        animate_label_objs[role_index] = role_labels[role_index].animate(keyflame_animation, keyflame_options);
        animate_value_objs[role_index] = role_values[role_index].animate(keyflame_animation, keyflame_options);
    }
    //falseなら普通に戻す
    else{
        //文字の色を元に戻す
        role_labels[role_index].style.color = "rgb(255, 255, 255)";
        role_values[role_index].style.color = "rgb(255, 255, 255)";
        //オブジェクトがnullでないかチェック
        if(animate_label_objs[role_index] != null && animate_value_objs[role_index] != null){
            animate_label_objs[role_index].cancel();
            animate_value_objs[role_index].cancel();
        }
    }

}

//指定した手札の画像を輝かせる
function ShiningTefudaImage(tefuda_num){
    //1から5であれば処理を行う
    if(tefuda_num > 0 && tefuda_num <= TEFUDA_NUM){
        let tefuda_images = document.getElementsByClassName('tefuda_img');
        //疑似的に輝くオブジェクトを作成する
        let tefuda_image_after = document.createElement('div');
        tefuda_image_after.className = "tefuda_images_after";
        tefuda_image_after.style.content = "";
        tefuda_image_after.style.display = "block";
        tefuda_image_after.style.width = "30px";
        tefuda_image_after.style.height = "100%";
        tefuda_image_after.style.position = "absolute";
        tefuda_image_after.style.left = "0";
        tefuda_image_after.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        tefuda_image_after.style.opacity = "0";
        tefuda_image_after.style.transform = "rotate(135deg)";
        let keyframes_shining = [{offset: 0.0, transform: "scale(0) rotate(135deg)", opacity: 0},
                                 {offset: 0.5, transform: "scale(4) rotate(135deg)", opacity: 1},
                                 {offset: 1.0, transform:"scale(50) rotate(135deg)", opacity: 0}
        ];
        let keyflame_options = {iterations: Infinity, duration: 1500};
        tefuda_image_after.animate(keyframes_shining, keyflame_options);
        tefuda_images[tefuda_num - 1].after(tefuda_image_after);
    }
}

//手札の画像の輝きを止める
function stopShiningTefudaImages(){
    let tefuda_images_after = Array.from(document.getElementsByClassName('tefuda_images_after'));
    tefuda_images_after.forEach(tefuda_image_after => tefuda_image_after.remove());
}

//一番左の手札に裏返しにしたトランプの画像を設置する
insertTrampBackImageToTefudaFirst();

///////////////////
//以下、テスト関数
///////////////////

//手札を好きなものにするテスト関数
function testChangeTargetTefuda(num_tefuda, type, pattern, num_card){
    //1から5で指定
    if(num_tefuda > 0 && num_tefuda <= TEFUDA_NUM){
        //手札の配列を変更
        tefuda_array[num_tefuda - 1] = [pattern, num_card];
        //手札の画像を変更
        insertTargetTefudaImage(num_tefuda, ScriptCore.generateTrumpImagePath(type, pattern, num_card));
    }
}

//手札の出力テスト（指定回数）
function testTefudaOutput(num, low_roles_hidden){
    for(let i = 0; i < num; i++){
        let trump_mark_array = ["d", "h", "s", "c", "j"];
        let result_str = "";
        let yamafuda_array_test = ScriptCore.generateTrumpYamafuda();
        let tefuda_array_test = [];
        for(let i = 0; i < TEFUDA_NUM; i++){
            //山札からカードを一枚引く
            let yamafuda_draw = yamafuda_array_test.pop();
            //引いたカードを手札に入れる
            tefuda_array_test.push(yamafuda_draw);
        }
        sortTefudaArray(tefuda_array_test);
    
        let roles_result_test = judgeRoles(tefuda_array_test);

        tefuda_array_test.forEach(x => result_str += trump_mark_array[x[0]] + x[1] + " ");

        if(roles_result_test != undefined){
            result_str += Object.keys(ROLES_INFO)[roles_result_test[0]];
            if(low_roles_hidden){
                if(roles_result_test[0] < 3){
                    console.log(result_str);
                }
            }
            else{
                console.log(result_str);
            }
            
        }
        /*
        else{
            result_str += "役なし";
            console.log(result_str);
        }
        */
    }
}


