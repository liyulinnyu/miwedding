selectTextHandler = (e) => {
    const selection = window.getSelection();
    if (selection.isCollapsed || selection.toString().trim() === '') {
        // no select
        return;
    }

    let arr = selection.toString().split('\n').filter(item => item.trim() !== '');
    if (!arr || arr.length === 0) {
         return;
    }

    // save the selection text
    this.selectedText = arr;

    const container = this.customContentEl.current;
    let all_p_ele = container.querySelectorAll('p');

    if (arr.length === 1 && selection.anchorNode !== selection.focusNode) {
        selection.toString().split('\n').forEach(item => {
            if (item.trim()) {
                
            }
        });
    }

    let current_top = 0;

    if (arr.length === 1) {
        let anchorNode = selection.anchorNode.parentNode.tagName === 'P' ? 
                            selection.anchorNode : selection.anchorNode.parentNode;
        let focusNode = selection.focusNode.parentNode.tagName === 'P' ?
                            selection.focusNode : selection.focusNode.parentNode;

        // get the p index, so only need one node
        let current_p_ele = [...all_p_ele].filter((item,index) => {
            if (anchorNode.parentNode.tagName === 'P') {
                if (item === anchorNode.parentNode) {
                    this.first_p_index = index;
                    return true;
                }
                return false;
            } else if (anchorNode.parentNode.tagName === 'STRONG') {
                if (item === anchorNode.parentNode) {
                    this.first_p_index = index;
                    return true;
                }
                return false;
            }
            return false;
        })[0];

        // get offset for both nodes
        let anchorOffset = selection.anchorOffset;
        let focusOffset = selection.focusOffset;
        let temp = anchorNode.previousSibling;

        while (temp) {
            anchorOffset += temp.innerText ? temp.innerText.length : temp.length;
            
            temp = temp.previousSibling;
        }

        temp = focusNode.previousSibling;
        while (temp) {
            focusOffset += temp.innerText ? temp.innerText.length : temp.length;

            temp = temp.previousSibling;
        }

        this.first_text_offset =  anchorOffset < focusOffset ? anchorOffset : focusOffset;
        current_top = current_p_ele.getBoundingClientRect().top + document.documentElement.scrollTop;
    } else if(arr.length >= 2) {
        // get the first and the last one
        let first_p_ele = null,
            last_p_ele = null;
        
        all_p_ele.forEach((item, index) => {
            if (item === selection.anchorNode.parentNode) {
                first_p_ele = item;
                this.first_p_index = index;
                this.first_text_offset = selection.anchorOffset;
            } else if (item === selection.focusNode.parentNode) {
                last_p_ele = item;
                this.last_p_index = index;
                this.last_text_offset = selection.focusOffset;
            }
        })
        
        // swap
        if (first_p_ele.innerHTML.slice(selection.anchorOffset) !== arr[0]) {
            [last_p_ele, first_p_ele] = [first_p_ele, last_p_ele];
            [this.last_p_index, this.first_p_index] = [this.first_p_index, this.last_p_index];
            [this.last_text_offset, this.first_text_offset] = [this.first_text_offset, this.last_text_offset];
        }

        current_top = first_p_ele.getBoundingClientRect().top + document.documentElement.scrollTop;
    }

    this.setState({
        showTextStyleContainer: true
    }, () => {
        this.textStyleButtonContainerEl.current.style.top = current_top - 60 + 'px';
        this.textStyleButtonContainerEl.current.focus();
    });

}


changeTextStyleHandler = (e) => {
    // get the operation
    const op = e.target.innerHTML;
    
    const container = this.customContentEl.current;
    let all_p_ele = container.querySelectorAll('p');

    let arr = this.selectedText;

    let strong_arr = [];
    
    if (arr.length === 1) {
        // get the p index, so only need one node
        let current_p_ele = null;
        [...all_p_ele].map((item,index) => {
            if (index === this.first_p_index) {
                current_p_ele = item;
            }
        });

        let cur_html = '';
        let offset = this.first_text_offset;
        let text = arr[0];
        let num = 0;
        [...current_p_ele.childNodes].forEach(item => {

            
            let tagName = item.tagName;
            let str = tagName ? item.innerText.toString() : item.textContent + '';

            if (offset >= num + str.length || offset < num) {
                // not in this children, continue;
                let substr = '';
                if (tagName) {
                    substr = `<${tagName}>${str}</${tagName}>`;
                } else {
                    substr = str;
                }
                cur_html += substr;
            } else if (offset === num && text.length >= str.length) {
                offset += str.length;
                text = text.slice(str.length);
                cur_html += `<strong>${str}</strong>`;
            } else if (offset >= num && offset < num + str.length && text.length <= str.length ) {
                // children contains this text
                let substr = '';

                substr = `${0 === offset - num ? '':str.slice(0, offset - num)}<strong>${str.slice(offset - num, offset - num + text.length)}</strong>${str.slice(offset - num + text.length)}`;

                if (tagName) {
                    substr = `<${tagName}>${substr}</${tagName}>`
                }

                text = '';
                cur_html += substr;
            } else if (offset > num && offset < num + str.length && text.length > str.length) {
                // children contain a part of text(from the beginning)
                let substr = '';
                substr = `${str.slice(0, offset - num)}<strong>${str.slice(offset-num)}</strong>`;
                if (tagName) {
                    substr = `<${tagName}>${substr}</${tagName}>`
                }
                text = text.slice(str.length - (offset - num));
                offset = num + str.length;
                cur_html += substr;
            } 
            num += str.length;
        });

        // add the innerHTML
        current_p_ele.innerHTML = cur_html;

        cur_html = '';

        [...current_p_ele.childNodes].reduce((pre, cur, index, array) => {
        
            let pre_text = pre.tagName ? pre.innerText.toString() : pre.textContent + '';
            let cur_text = cur.tagName ? cur.innerText.toString() : cur.textContent + '';
        
            if (pre.tagName === cur.tagName) {
                let temp = pre_text + cur_text;
                let new_node = null;
                if (pre.tagName) {
                    new_node = document.createElement(pre.tagName);
                    new_node.innerHTML = temp;
                } else {
                    new_node = document.createTextNode(temp);
                }

                if (index === array.length - 1) {
                    cur_html += `<${pre.tagName}>${temp}</${pre.tagName}>`;
                }

                return new_node;
            } else {
                // not the same, add it to cur_html;
                if (pre.tagName) {
                    cur_html += `<${pre.tagName}>${pre_text}</${pre.tagName}>`;
                } else {
                    cur_html += pre_text;
                }
                if (index === array.length - 1) {
                    // last one
                    if (cur.tagName) {
                        cur_html += `<${cur.tagName}>${cur_text}</${cur.tagName}>`;
                    } else {
                        cur_html += cur_text;
                    }
                }
                return cur;
            }
        });

        // add the innerHTML
        current_p_ele.innerHTML = cur_html;
        
    } else {

    }

    this.closeTextStyleContainerHandler();
}