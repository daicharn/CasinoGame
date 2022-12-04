class ScriptUtil{
    //通常の配列のコピーを生成する
    static copyArray(array){
        let new_array = new Array(array.length);
        for(let i = 0; i < array.length; i++){
            new_array[i] = array[i].slice();
        }
        return new_array;
    }
    
    //配列が連続した値（数値）であるかどうか判定する
    static isArrayStraight(array_arg){
        return array_arg.every((x, i, array) => {
            if(i == array.length - 1){
                return true;
            }
            else{
                return x + 1 == array[i + 1];
            }
        });
    }

    //配列をシャッフルする
    static shuffle_array(array){
        for(let i = array.length - 1; i >= 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    //配列から指定した個数を取り出した組み合わせを生成する
    static getArrayCombination(nums, k){
        let result = [];
        if(nums.length < k){
            return [];
        }
        if(k === 1){
            for(let i = 0; i < nums.length; i++){
                result[i] = [nums[i]];
            }
        }
        else{
            for(let i = 0; i < nums.length - k + 1; i++){
                let row = this.getArrayCombination(nums.slice(i + 1), k - 1);
                for(let j = 0; j < row.length; j++){
                    result.push([nums[i]].concat(row[j]));
                }
            }
        }

        return result;
    }
}