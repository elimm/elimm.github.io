"use strict";!function(n,e){var t=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:n;return Array.prototype.slice.call(t.querySelectorAll(e))};(function(){var r=function(){return e.pageYOffset||n.documentElement.scrollTop},o=function(n,e){return"-"+Math.floor(n*e)+"px"},a=t("#header")[0],i=a.clientHeight;return function(){return e.addEventListener("scroll",function(){var n=r();n>i||(a.style.backgroundPositionY=o(n,2)+", "+o(n,.25))})}})()(),function(n){return new Promise(function(e){var t=new XMLHttpRequest;t.responseType="json",t.addEventListener("load",function(){return 200===t.status&&t.response?e(t.response):[]}),t.open("GET",n),t.send()})}("/list.json").then(function(n){return Promise.all(n.map(function(n){return new Promise(function(e){var t=new Image;t.src=n.thumbnail,t.alt=n.title+" screenshot",t.className="work__img",t.addEventListener("load",function(){n.image=t,e(n)})})}))}).then(function(e){var r=t("#work__wrap")[0];e.sort(function(){return Math.floor(3*Math.random())-1}).forEach(function(e){var t=n.createElement("div"),o=n.createElement("a");t.className="work__item",o.href=e.link,o.className="work__link",o.target="_blank",o.textContent=e.title,t.appendChild(e.image),t.appendChild(o),r.appendChild(t)})})}(document,window);