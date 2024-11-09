// ==UserScript==
// @name         MHRise:Sunbreak スキルシミュ(泣)
// @namespace    https://mhrise.wiki-db.com/sim/
// @version      2024-11-08
// @description  Extension for Skill Simulator
// @author       You
// @match        https://mhrise.wiki-db.com/sim/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // 合計を計算して表示する関数
    function calculateAndAppendSum() {
        // 対象の<table>を取得
        const table = document.getElementById('results-table');

        // デバッグ用のコードなので、不要
        // if (!table) {
        //     console.warn("指定したテーブルが見つかりません");
        //     return;
        // }

        // <tbody>の2つ目以降をループ
        const tbodies = table.querySelectorAll('tbody');
        for (let i = 1; i < tbodies.length; i++) { // 最初の<tbody>は見出しなのでスキップ
            const tbody = tbodies[i];
            const rows = tbody.querySelectorAll('tr');

            // 各<tbody>内の2番目の<tr>を対象にする
            if (rows.length > 1) {
                const secondRow = rows[1];
                const spans = secondRow.querySelectorAll('td > span');

                // 2番目から6番目の<span>に、各属性耐性値が保管されているためそれらを取得して合算
                let sum = 0;
                for (let j = 1; j < 6; j++) {
                    const value = parseInt(spans[j].textContent);
                    if (!isNaN(value)) {
                        // 属性耐性が50を超えた場合、変換されないため、切り捨て
                        // 龍気変換や激昂、そのほか属性耐性を入れる場合、切り捨ての上限値が下がるため、ここの値を適宜調整すること
                        if (value > 50) {
                            value = 50;
                        }
                        sum += value;
                    }
                }

                // 合計を新しい<span>タグにして追加
                const newSpan = document.createElement('span');
                newSpan.style.width = '4ex';
                newSpan.textContent = sum;
                newSpan.style.display = 'inline-block';
                secondRow.querySelector('td').prepend(newSpan);
            }
        }
    }

    // 監視対象の要素を取得
    const targetDiv = document.querySelector("#ui > div > div");
    console.log(targetDiv);

    // デバッグ用のコードなので、不要
    // if (!targetDiv) {
    //     console.warn("指定した要素（ui）が見つかりません");
    //     return;
    // }

    // progress-stripedクラスの存在状態を追跡するためのフラグ
    let hasProgressStriped = targetDiv.querySelector('.progress-striped') !== null;

    // MutationObserverの設定
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            // 子ノードの追加や削除の変動をチェック
            if (mutation.type === 'childList') {
                // 現在のprogress-stripedクラスの要素の有無をチェック
                const currentHasProgressStriped = targetDiv.querySelector('.progress-striped') !== null;

                // 状態が変わった場合に処理を実行
                if (!currentHasProgressStriped && hasProgressStriped) {
                    // progress-stripedクラスが削除された場合
                    calculateAndAppendSum();

                    // デバッグ用のコードなので、不要
                    // console.log("検索完了");
                }

                // フラグを更新
                hasProgressStriped = currentHasProgressStriped;
            }
        });
    });

    // `targetDiv`内の子要素の変動を監視
    observer.observe(targetDiv, { childList: true, subtree: true });

})();