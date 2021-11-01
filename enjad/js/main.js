window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }

  // 英語のみを表現する正規表現
  const re_english_only = /^[0-9a-zA-Z\.\,\-\s\/]+$/;

  const $input = $("#input");
  const $results = $("#results");

  /**
   * input入力ハンドラ
   */
  $input.on("input", function(e) {
    // console.log("input e", e);
    const val = e.target.value;
    const isEnglish = isEnglishOnly(val);
    const results = getResults(val ? val.trim() : "", isEnglish);
    setResultsToEl(results, val, isEnglish);
  });

  /**
   * Check whether txt is an english sentense or not.
   * @param  {String}  txt
   * @return {Boolean} true: It's English!
   */
  function isEnglishOnly(txt) {
    if (!txt) return false;
    return re_english_only.test(txt);
  }

  function setResultsToEl(results, input, isEnglish = true) {
    // once, clear the results.
    $results.html("");
    // loop results:
    for (let len = results.length, i = 0; i < len; i++) {
      const { en, ja } = results[i];
      const $result = $('<div class="result" style="margin-top: 4px;"></div>');
      // make styled text:
      const txt = '<code>' + en + "</code> " + ja;
      $result.html(txt);
      $results.append($result);
      if (!isEnglish)
        markText($result[0], input);
    }
  }

  function getResults(input, isEnglish = true) {
    const max_limit = 50;
    let count = 0;
    const ret = [];
    const arr = window.ejdic;
    let re;
    if (isEnglish) {
      // 英文の場合は前方一致検索
      re = new RegExp("^" + input, "i");
    } else {
      // 日本語の場合はあいまい検索
      re = new RegExp(input, "i");
    }

    for (let len = arr.length, i = 0; i < len; i++) {
      const item = arr[i];
      if (re.test(item[isEnglish ? "en" : "ja"])) {
        ret.push(item);
        count += 1;
        if (count >= max_limit) break;
      }
    }
    return ret;
  }

  /**
   * マッチテキストにマーカーを引く(markタグを付与)
   * @param {HTMLElement} node - 親要素
   * @param {String} word - 検索文字列
   *  空文字列をセットするとマーカーが除去されます。
   */
  function markText(node, word) {
    if (node instanceof HTMLElement !== true) {
      return console.warn("markText: node must be an HTMLElement");
    }
    if (!word || typeof word !== "string") return;
    _markText(node, new RegExp(word, "g"), function(node, match, offset) {
      const mark = document.createElement("mark");
      // mark.className = "search-term";
      mark.textContent = match;
      return mark;
    });

    // @see: https://stackoverflow.com/a/29301739
    function _markText(node, regex, callback, excludeElements) {
      excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
      let child = node.firstChild;
      while (child) {
        switch (child.nodeType) {
          case 1:
            {
              if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
                break;
              _markText(child, regex, callback, excludeElements);
              break;
            }
          case 3:
            {
              let bk = 0;
              child.data.replace(regex, function(all) {
                let args = [].slice.call(arguments),
                  offset = args[args.length - 2],
                  newTextNode = child.splitText(offset + bk),
                  tag;
                bk -= child.data.length + all.length;
                newTextNode.data = newTextNode.data.substr(all.length);
                tag = callback.apply(window, [child].concat(args));
                child.parentNode.insertBefore(tag, newTextNode);
                child = newTextNode;
              });
              regex.lastIndex = 0;
              break;
            }
        }
        child = child.nextSibling;
      }
      return node;
    }
  }
  /**
   * 指定された要素からマーカーを除去(markタグを外す)
   * @param {HTMLElement} node - ノード
   */
  function unmarkText(node) {
    if (node instanceof HTMLElement !== true) {
      console.warn("unmarkText: node must be an HTMLElement.");
      return;
    }
    const items = node.querySelectorAll("mark");
    for (let len = items.length, i = 0; i < len; i++) {
      const node = items[i];
      if (node.nodeName === "MARK" || node.nodeName === "mark") {
        const pn = node.parentNode;
        _unmarkText(node);
        // NOTE: タグの付与でバラけてしまったTextNodeをまとめたりする:
        pn.normalize();
      }
    }

    function _unmarkText(node) {
      const txtn = document.createTextNode(node.textContent);
      node.parentNode.replaceChild(txtn, node);
    }
  }

}