(function (w, d) {
	"use strict";

	function $$(selector, context) {
		context = context || d;
		return Array.prototype.slice.call(context.querySelectorAll(selector));
	}

	function Slider(options) {

		if (!(this instanceof Slider)) {
			return new Slider(options);
		}

		var
			element   = options.element,
			BTN_CLASS = "slider-btn",
			slide     = $$(".slider-img")[0],
			prevBtn,
			nextBtn;

		var 
			disableArrows = (function () {
				var
					disabled;
				
				return function () {
					var
						ndx = Thumb.activeIndex,
						len = Thumb.elements.length - 1;

					if (disabled) {
						disabled.removeAttribute("disabled");
						disabled = null;
					}

					if (ndx === 0) {
						prevBtn.setAttribute("disabled", "true");
						disabled = prevBtn;
					} else if (ndx === len) {
						nextBtn.setAttribute("disabled", "true");
						disabled = nextBtn;
					}
				};
			})();

		function Thumb(element, index) {
			if (!(this instanceof Thumb)) {
				return new Thumb(element, index);
			}
			if (!Thumb.elements) {
				Thumb.elements = [];
			}
			this.title = element.getAttribute("data-slide-title") || "";
			this.info = element.getAttribute("data-slide-info") || "";
			this.href = element.getAttribute("data-slide-href");
			this.element = element;
			this.linkElement = element.children[0];
			this.imgElement = this.linkElement.children[0];
			this.index = index;
			this.imgElement.alt = this.title;
			this.imgElement.title = this.title;
			element.dataset.ndx = index;

			if (element.classList.contains("active")) {
				Thumb.activeElement = this;
				Thumb.activeIndex = this.index;
			}

			Thumb.elements.push(this);
		}

		Thumb.prototype.hover = function (state) {
			if (state) {
				this.element.classList.add("active");
				Thumb.activeElement = this.element;
				Thumb.activeIndex = this.index;
			} else {
				this.element.classList.remove("active");
			}
		};

		function Descript(elem) {
			this.element = elem;
			this._title = $$(".slider-descipt-title", elem)[0];
			this._text = $$(".slider-descipt-text", elem)[0];
		}

		Descript.prototype.setTitle = function (str) {
			this._title.innerHTML = str;
			return this;
		};
		Descript.prototype.setText = function (str) {
			this._text.innerHTML = str;
			return this;
		};

		function init() {
			var
				thumb    = $$("#slider-thumb")[0],
				descript = new Descript($$(".slider-descipt")[0]);

			$$(".thumb-item", thumb).forEach(function (el, i) {
				Thumb(el, i);
			});

			thumb.addEventListener("click", function (e) {
				var
					trgt = e.target,
					item = trgt;

				if (!trgt.classList.contains("thumb-item-img")) {
					return;
				}

				while (item !== this) {
					if (item.classList.contains("thumb-item")) {
						break;
					}
					item = item.parentNode;
				}

				e.preventDefault();

				if (item.classList.contains("active")) {
					return;
				}
				move(item.dataset.ndx, refreshInfo);
			});

			prevBtn = d.createElement("button");
			nextBtn = d.createElement("button");
			prevBtn.className = BTN_CLASS + " " + BTN_CLASS + "-left";
			nextBtn.className = BTN_CLASS + " " + BTN_CLASS + "-right";
			prevBtn.addEventListener("click", function () {
				move(Thumb.activeIndex - 1, refreshInfo);
			});
			nextBtn.addEventListener("click", function () {
				move(Thumb.activeIndex + 1, refreshInfo);
			});
			element.appendChild(prevBtn);
			element.appendChild(nextBtn);
			disableArrows();

			refreshInfo(Thumb.activeElement);

			function refreshInfo(thumb) {
				descript.setTitle(thumb.title)
					.setText(thumb.info);
			}
		}

		function move(pos, callback) {
			var
				els = Thumb.elements,
				ndx = Thumb.activeIndex;

			if (!isAvail(pos)) {
				return;
			}
			els[ndx].hover(false);
			ndx = parseInt(pos, 10);
			els[ndx].hover(true);
			slide.src = els[ndx].href;
			disableArrows();
			if (callback) {
				callback(els[ndx]);
			}
		}

		function isAvail(index) {
			return index >= 0 && index < Thumb.elements.length;
		}

		this.init = init;
		//this.prev = prev;
		//this.next = next;
	}
	
	function Scroller(options) {
		if (!(this instanceof Scroller)) {
			return new Scroller(options);
		}
		
		var
			STEP = options.step || 15,
			DELAY = options.delay || 5,
			CLASS_NAME = "btn-top",
			topBtn = $$("." + CLASS_NAME)[0] || d.createElement("button"),
			t = null;

		topBtn.title = options.title || "Scroll to top";
		topBtn.className = CLASS_NAME;
		topBtn.id = CLASS_NAME;

		function getScroll() {
			return w.pageYOffset || d.documentElement.scrollTop;
		}

		function scroll() {
			if (!getScroll() || t) {
				return;
			}
			t = setInterval(function () {
				if (getScroll() < STEP) {
					w.scrollTo(w.pageXOffset, 0);
					clearInterval(t);
					t = null;
				}
				w.scrollBy(w.pageXOffset, -STEP);
			}, DELAY);
		}

		function showBtn() {
			topBtn.classList.add(CLASS_NAME + "-active");
		}

		function hideBtn() {
			topBtn.classList.remove(CLASS_NAME + "-active");
		}

		topBtn.addEventListener("click", scroll);

		w.addEventListener("scroll", function () {
			getScroll() > 100 ? showBtn() : hideBtn();
		});

		d.body.appendChild(topBtn);
	}
	
	function init() {
		if (d.body.classList.contains("home")) {
			var
				slider = Slider({element: $$(".slider-holder")[0]});
			slider.init();
		}
		var
			upBtn = Scroller({step: 35, delay: 10});
	}
	
	d.readyState == "loading" ? d.addEventListener("DOMContentLoaded", init) : init();
	
}(window, document));