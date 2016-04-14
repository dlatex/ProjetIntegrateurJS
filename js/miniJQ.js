//var JQ = require('miniJQ.js');

var draggedNode;

function L3M_data(L) {
    this.L = L;
}

/*
function L3M(selecteur) {
    var L = document.queryselectorAll(selecteur);
    return L3M_data(L);
}
*/

L3M_data.prototype = {
    constructor: L3M_data,
    each: function (fct) {
        for (var i = 0; i < this.L.length; i++) {
            fct.call(this.L.item(i));
        }
        return this;
    },
    html: function (str_html) {
        return this.each(function () {
            this.innerHTML = str_html;
        });
    },
    click: function (callback) {
        return this.each(function () {
            this.onclick = callback;
        });
    },
    appendHTML: function(str){
        return this.each(function(){
            this.innerHTML+=str;
        });
    },
    draggable: function(config){
        return this.each(function(){
            this.setAttribute('draggable', 'true');
            this.ondragstart = function(e){
                draggedNode = e.currentTarget;
                e.stopPropagation();
                e.dataTransfert.setData("text", draggedNode);
            };

	  this.ondragenter=function(e){e.preventDefault();
	  };

	   this.ondraover=function(e){
	  };

         this.ondrop=function(e){
               e.stopPropagation();
	       config.drop.call(e.currentTarget,e,draggedNode);
	 };
            this.ondragend = function(e){
                draggedNode = null;
                e.stopPropagation();
            };
        });
    }
};        



