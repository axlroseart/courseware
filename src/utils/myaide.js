/*!
 * myaide JavaScript Library
 * 
 *@author snow.he
 *
 * 
 */
/* eslint-disable */

var MYAIDE = { REVISION: '1.0.0' };
if (typeof define === 'function' && define.amd) {
	define('myaide', MYAIDE);
} else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
	module.exports = MYAIDE;
}
export default MYAIDE;
if (Number.EPSILON == undefined) {
	Number.EPSILON = Math.pow(2, -52);
}

if (!Date.now) {
	Date.now = function now() {
		return new Date().getTime();
	};
}

if (Object.assign === undefined) {
	(function () {
		Object.assign = function (target) {
			'use strict';
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert undefined or null to object');
			}
			var output = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source !== undefined && source !== null) {
					for (var nextKey in source) {
						if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
							output[nextKey] = source[nextKey];
						}
					}
				}
			}
			return output;
		};
	})();
}
if (!Math.sign) {
	Math.sign = function (x) {
		x = +x;
		if (x === 0 || isNaN(x)) {
			return Number(x);
		}
		return x > 0 ? 1 : -1;
	};
}

if (!Array.isArray) {
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}
if (!Array.prototype.fill) {
	Object.defineProperty(Array.prototype, 'fill', {
		value: function (value) {
			if (this == null) {
				throw new TypeError('this is null or not defined');
			}
			var O = Object(this);
			var len = O.length >>> 0;
			var start = arguments[1];
			var relativeStart = start >> 0;
			var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
			var end = arguments[2];
			var relativeEnd = end === undefined ? len : end >> 0;
			var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
			while (k < final) {
				O[k] = value;
				k++;
			}
			return O;
		}
	});
}
if (!"localStorage" in window) {
	window.localStorage = {
		getItem: function (sKey) {
			if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
			return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		},
		key: function (nKeyId) {
			return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
		},
		setItem: function (sKey, sValue) {
			if (!sKey) { return; }
			document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
			this.length = document.cookie.match(/\=/g).length;
		},
		length: 0,
		removeItem: function (sKey) {
			if (!sKey || !this.hasOwnProperty(sKey)) { return; }
			document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
			this.length--;
		},
		hasOwnProperty: function (sKey) {
			return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		}
	};
	try { window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length; } catch (e) { }
}
if (Function.prototype.name === undefined) {
	Object.defineProperty(Function.prototype, 'name', {
		get: function () {
			return this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
		}
	});
}

Object.assign(MYAIDE, {
	pointer: null,
	init: function (_parameters) {
		var parameters = _parameters || {};
		MYAIDE.OSInfo.updataOsInfo();
		MYAIDE.WorkInfo.initWorkInfo(parameters);

		MYAIDE.pointer = new MYAIDE.Pointer(parameters.canvas, parameters.render);
		MYAIDE.pointer.initPointer();
		MYAIDE.Audio = new MYAIDE.AudioClass();
		MYAIDE.Resizer.init();
	}
});
MYAIDE.WorkInfo = {
	scale: 1,
	canvas: null,
	canvasLeft: 0,
	canvasTop: 0,
	pWidth: 1024,
	pHeight: 768,
	initWorkInfo: function (_parameters) {
		this.pWidth = _parameters.width;
		this.pHeight = _parameters.height;
		this.canvas = _parameters.canvas;
		this.canvasLeft = _parameters.canvas.offsetLeft;
		this.canvasTop = _parameters.canvas.offsetTop;
	}
};

MYAIDE.OSInfo = {
	MYAIDE_revision: MYAIDE.REVISION,
	os: navigator.userAgent.toUpperCase().indexOf("WINDOWS", 0) > -1 ? "MS Windows" : (navigator.userAgent.toUpperCase().indexOf("MAC", 0) > -1 ? "Apple mac" : (navigator.userAgent.toUpperCase().indexOf("LINUX", 0) > -1 ? "Lunix" : (navigator.userAgent.toUpperCase().indexOf("X11", 0) > -1 ? "Unix" : "unknown"))),
	browser: null,
	onLine: navigator.onLine,
	language: navigator.language,
	canvasAble: !!window.CanvasRenderingContext2D,
	file: !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob,
	fileSystem: !!window.requestFileSystem || !!window.webkitRequestFileSystem,
	webgl: function () { try { return !!window.WebGLRenderingContext && !!document.createElement("canvas").getContext("experimental-webgl") } catch (a) { return !1 } }(),
	worker: !!window.Worker,
	cookieEnabled: navigator.cookieEnabled,
	msPointerable: null,
	touchable: null,
	maxTouchPoints: !!window.navigator.maxTouchPoints ? window.navigator.maxTouchPoints : 0,
	isSurface: false,
	localStorage: false,
	requestAnimationFrameAble: false,
	updataOsInfo: function () {
		try { this.msPointerable = window.navigator.msPointerEnabled ? true : false; } catch (e) { this.msPointerable = false; }
		try { this.touchable = ("ontouchstart" in document && !MYAIDE.Common.isPC()) ? true : false; } catch (e) { this.touchable = false; }
		try { this.isSurface = ("ontouchstart" in document && MYAIDE.Common.isPC()) ? true : false } catch (e) { }
		try { this.localStorage = 'localStorage' in window && window['localStorage'] !== null; } catch (e) { this.localStorage = false; }
		this.browser = MYAIDE.Common.getBrowser();

		if (!window.requestAnimationFrame) {
			if (window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame || window.msRequestAnimationFrame) {
				window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame || window.msRequestAnimationFrame;
				this.requestAnimationFrameAble = true;
			}
		} else {
			this.requestAnimationFrameAble = true;
		}
		MYAIDE.Tween.countAbility = this.touchable ? 2 : 1;
		MYAIDE.Common.trace("OS info test over.");
	}
};
MYAIDE.PreloadStyle = {
	cacheStyle: function () { },
	staticStyle: function (ctx, _percent) {
		var x = MYAIDE.WorkInfo.pWidth / 2,
			y = MYAIDE.WorkInfo.pHeight / 2;
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, x * 2, y * 2);
		ctx.beginPath();
		ctx.fillStyle = "#fff";
		ctx.globalAlpha = 0.5;
		ctx.arc(x, y, 80, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		var perc = _percent;
		ctx.globalAlpha = 0.5 + perc * 0.5;
		ctx.moveTo(x, y);
		ctx.arc(x, y, 80, 0, perc / 50 * Math.PI);
		ctx.fillStyle = "#fff";
		ctx.fill();
		ctx.beginPath();
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#000";
		ctx.arc(x, y, 60, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "#fff";
		ctx.font = "32px Arial";
		ctx.textAlign = "center";
		ctx.fillText(_percent + "%", x, y + 10, 80, 40);
	}
};
MYAIDE.Preload = {
	fileData: {},
	onloadData: [],
	fileList: [],
	startTimer: 0,
	waitTime: 60000,
	progress: 100,
	showType: "staticStyle",
	callback: function () { },
	loadingFile: function (_file, _showFunc, _callbacks, _waitTime) {
		if (arguments.length < 1) return;
		this.startTimer = new Date().getTime();
		for (var i = 0, len = _file.length; i < len; i++) {
			var nowFile = _file[i];
			if (!nowFile["type"]) {
				var path = nowFile["path"] ? nowFile.path : nowFile.url;
				var ext = MYAIDE.Common.getExtension(path);
				switch (ext) {
					case "txt":
						nowFile.type = "text";
						nowFile.path = path;
						break;
					case "js":
						nowFile.type = "js";
						nowFile.path = path;
						break;
					case "mp3":
					case "ogg":
					case "wav":
					case "m4a":
						nowFile.type = "audio";
						nowFile.url = path;
						break;
					case "mp4":
						nowFile.type = "video";
						break;
					default:
						nowFile.type = "img";
						nowFile.path = path;
				}
			}
			var name = MYAIDE.Math.generateUUID();
			if (nowFile["name"]) {
				if (this.fileList.indexOf(nowFile.name) < 0) {
					name = nowFile.name;
				} else {
					console.error("MYAIDE.Preload file's name repeat:" + nowFile.name);
					return;
				}
			}
			switch (nowFile.type) {
				case "text":
					break;
				case "js":
					var ele = document.createElement("script");
					ele.onload = this.fileOnload;
					ele.src = nowFile.path;
					var addStatus = nowFile.add !== undefined ? nowFile.add : "true";
					if (addStatus) {
						document.querySelector("head").appendChild(ele);
					}
					var nFile = { type: nowFile.type, path: nowFile.path, data: ele };
					this.fileData[name] = nFile;
					this.fileList.push(name);
					break;
				case "audio":
					MYAIDE.Audio.createAudio([nowFile]);
					break;
				case "img":
					var ele = new Image();
					ele.onload = this.fileOnload;
					ele.src = nowFile.path;
					var nFile = { type: nowFile.type, path: nowFile.path, data: ele };
					this.fileData[name] = nFile;
					this.fileList.push(name);
					break;
				case "video":
					var ele = document.createElement("video");
					ele.src = nowFile.path;
					break;
			}
		}
		if (typeof _showFunc == "function") {
			var n = MYAIDE.PreloadStyle.cacheStyle = _showFunc;
			this.showType = "cacheStyle";
		} else {
			this.showType = _showFunc !== undefined ? _showFunc : "staticStyle";
		}
		this.callback = _callbacks !== undefined ? _callbacks : function () { };
		this.waitTime = _waitTime;
	},
	fileOnload: function () {
		var self = MYAIDE.Preload;
		self.onloadData.push(this);
	},
	updateProgress: function (ctx) {
		var maxf = this.fileList.length,
			nowf = this.onloadData.length;
		var userTime = new Date().getTime() - this.startTimer;
		this.progress = parseInt(nowf / maxf * 100);
		if (nowf >= maxf || userTime >= this.waitTime) {
			this.progress = 100;
			this.callback(this.fileData);
		}
		MYAIDE.PreloadStyle[this.showType].call(this, ctx, this.progress);
	},
	addShowType: function (name, _func) {
		if (!MYAIDE.PreloadStyle[name]) {
			MYAIDE.PreloadStyle[name] = _func;
		} else {
			console.error("MYAIDE.Preload.addShowType: name repeat.");
		}
	},
	getFile: function (_name) {
		if (_name) {
			return this.fileData[_name] ? this.fileData[_name].data : null;
		} else {
			return null;
		}
	},
	getFileByUrl: function (url) {
		for (var i in this.fileData) {
			if (this.fileData[i].path == url) {
				return this.fileData[i].data;
			}
		}
		return null;
	}
};


MYAIDE.Loader = {
	ajax: function (options) {
		options = options || {};
		options.type = (options.type || "GET").toUpperCase();
		options.dataType = options.dataType || "json";
		options.contentType = options.contentType || "application/json";
		var params = options.data;
		if (typeof params != "string") {
			params = JSON.stringify(params);
		}
		if (window.XMLHttpRequest) {
			var xhr = new XMLHttpRequest();
		} else {
			var xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
		xhr.overrideMimeType('text/plain');
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				var status = xhr.status;
				if (status >= 200 && status < 300) {
					options.success && options.success(xhr.responseText, xhr.responseXML);
				} else {
					options.fail && options.fail(status);
				}
			}
		};
		if (options.type.toUpperCase() == "GET") {
			xhr.open("GET", options.url + "?" + params, true);
			xhr.send(null);
		} else if (options.type.toUpperCase() == "POST") {
			xhr.open("POST", options.url, true);
			xhr.setRequestHeader("Content-Type", options.contentType);
			xhr.send(params);
		}
	},
	jsonp: function (_options) {
		var options = _options || {};
		var url = options.url !== undefined ? options.url : "",
			nScript = document.createElement("script"),
			nHead = document.getElementsByTagName('head')[0],
			waitTime = options.time !== undefined ? options.time : 15000,
			callbacks = ("MYAIDE_JSONP_" + Math.random()).replace(".", "");
		window[callbacks] = function (data) {
			nHead.removeChild(nScript);
			clearTimeout(nScript.timer);
			window[callbacks] = null;
			options.success && options.success(data);
		};
		nScript.timer = setTimeout(function () {
			window[callbacks] = null;
			nHead.removeChild(nScript);
			options.fail && options.fail({ error: true, message: "request timeout." });
		}, waitTime);

		nHead.appendChild(nScript);
		nScript.src = url;
	},
	loadAniImg: function (_target, _str, _aniNumber, _firstNumber, _imgType) {
		var fn = _firstNumber == undefined ? 0 : _firstNumber;
		var imgType = _imgType == undefined ? "png" : _imgType;
		for (var i = 0; i < _aniNumber; i++) {
			var n = fn + i,
				img = new Image();
			img.src = _str + n + "." + imgType;
			_target.push(img);
		}
	},
	loadScript: function (url, callback) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		if (script.readyState) {
			script.onreadystatechange = function () {
				if (script.readyState == "loaded" ||
					script.readyState == "complete") {
					script.onreadystatechange = null;
					callback != undefined ? callback() : "";
				}
			};
		} else {
			script.onload = function () {
				callback != undefined ? callback() : "";
			};
		};
		script.src = url;
		document.querySelector('head').appendChild(script);
	}
};
MYAIDE.Regular = {
	isEmail: function (str) {
		var exp = /^\w+@\w+.\w+$/;
		return exp.test(str);
	},
	isIdCardNo: function (num) {
		num = num.toUpperCase();
		if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) return false;
		var len = num.length, re;
		if (len == 15) {
			re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
			var arrSplit = num.match(re), dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]), bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
			if (!bGoodDay) {
				return false;
			} else {
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2), arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'), nTemp = 0, i;
				num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
				for (i = 0; i < 17; i++) {
					nTemp += num.substr(i, 1) * arrInt[i];
				}
				num += arrCh[nTemp % 11];
				return num;
			}
		}
		if (len == 18) {
			re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
			var arrSplit = num.match(re), dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]), bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
			if (!bGoodDay) {
				return false;
			} else {
				var valnum, arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2), arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'), nTemp = 0, i;
				for (i = 0; i < 17; i++) {
					nTemp += num.substr(i, 1) * arrInt[i];
				}
				valnum = arrCh[nTemp % 11];
				if (valnum != num.substr(17, 1)) {
					return false;
				}
				return num;
			}
		}
		return false;
	},
	isPhoneNumber: function (num) {
		var exp = /^1[3-9]\d{9}$/;
		return exp.test(num);
	},
	isIP: function (str) {
		var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
		return exp.test(str);
	}
};
MYAIDE.Position = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
};
MYAIDE.Position.prototype = {
	constructor: MYAIDE.Position,
	set: function (x, y) {
		this.x = x;
		this.y = y;

		return this;
	},
	setScalar: function (scalar) {
		this.x = scalar;
		this.y = scalar;

		return this;
	},
	setX: function (x) {
		this.x = x;

		return this;
	},
	setY: function (y) {
		this.y = y;

		return this;
	},
	clone: function () {
		return new this.constructor(this.x, this.y);
	},
	cloneReverse: function () {
		return new this.constructor(this.y, this.x);
	},
	cloneReverseY: function () {
		return new this.constructor(-this.y, this.x);
	},
	cloneReverseX: function () {
		return new this.constructor(this.y, -this.x);
	},
	cloneReverseXY: function () {
		return new this.constructor(-this.y, -this.x);
	},
	cloneReverseReciprocal: function () {
		return new this.constructor(1 / this.y, 1 / this.x);
	},
	cloneReciprocal: function () {
		return new this.constructor(1 / this.x, 1 / this.y);
	},
	cloneAver: function () {
		var l = Math.sqrt(this.x * this.x + this.y * this.y);
		return new this.constructor(this.x / l, this.y / l);
	},
	copy: function (v) {
		this.x = v.x;
		this.y = v.y;

		return this;
	},
	add: function (v) {
		this.x += v.x;
		this.y += v.y;

		return this;
	},
	addScalar: function (scalar) {
		this.x += scalar;
		this.y += scalar;

		return this;
	},
	min: function (v) {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		return this;
	},
	max: function (v) {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);

		return this;
	},
	dot: function (a, b) {
		return a.x * b.x + a.y * b.y;
	},
	cross: function (a, b) {
		return a.x * b.y - a.y * b.x;
	},
	distance: function (a, b) {
		var x = a.x - b.x;
		var y = a.y - b.y;
		return Math.sqrt(x * x + y * y);
	},
	getMinMax: function (vecs, axis) {
		var min_o = this.dot(vecs[0], axis);
		var max_o = this.dot(vecs[0], axis);
		var min_i = 0;
		var max_i = 0;
		for (var i = 1; i < vecs.length; i++) {
			var this_o = this.dot(vecs[i], axis);
			if (min_o > this_o) {
				min_o = this_o;
				min_i = i;
			}
			if (max_o < this_o) {
				max_o = this_o;
				max_i = i;
			}
		}
		var r = { "min_o": min_o, "min_i": min_i, "max_o": max_o, "max_i": max_i };
		return r;
	}

};
MYAIDE.Matrix2 = function () {
	this.elements = new Array(
		0, 0, 1
	);
	this.fixed = 2;
	if (arguments.length > 0) {
		MYAIDE.Common.trace("MYAIDE.Matrix2:use .set() onstead matrix2");
	}
};
MYAIDE.Matrix2.prototype = {
	constructor: MYAIDE.Matrix2,
	set: function (n11, n21) {

		var te = this.elements;
		te[0] = n11;
		te[1] = n21;

		return this;

	},
	get: function () {
		return [this.elements[0], this.elements[1]];
	},
	add: function (e1, e2) {
		var te = this.elements;
		te[0] += e1;
		te[1] += e2;
		return this;
	},
	reduce: function (e1, e2) {
		var te = this.elements;
		te[0] -= e1;
		te[1] -= e2;

		return this;
	},
	getElement: function () {
		return MYAIDE.Common.arrayCopy(this.elements);
	},
	setFixed: function (n) {
		if (!isNaN(n)) {
			if (n >= 0) {
				this.fixed = n;
			}
		}
	},
	fromArray: function (array) {
		this.set(array[0], array[1], array[2]);
		return this;
	},
	clone: function () {

		return new this.constructor().fromArray(this.elements);

	},

	copy: function (m) {

		var me = m.elements;
		this.set(me[0], me[1]);
		return this;

	},

	rotate: function (_a, _sx, _sy) {
		if (isNaN(_a)) return;
		var a = _a !== undefined ? _a : 0,
			sx = _sx !== undefined ? _sx : 0,
			sy = _sy !== undefined ? _sy : 0;
		var te = this.elements;
		a = MYAIDE.Math.degToRad(a);

		var T = [1, 0, 0, 0, 1, 0, 0, 0, 1],
			R = [1, 0, 0, 0, 1, 0, 0, 0, 1],
			rT = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		T[2] = -sx; T[5] = -sy;
		R[0] = Math.cos(a); R[1] = Math.sin(a);
		R[3] = -Math.sin(a); R[4] = Math.cos(a);
		rT[2] = sx; rT[5] = sy;

		var Tte = [te[0] + T[2], te[1] + T[5], 1];
		var Rte = [Tte[0] * R[0] + Tte[1] * R[1], Tte[0] * R[3] + Tte[1] * R[4], 1];
		var rTte = [Rte[0] + rT[2], Rte[1] + rT[5], 1];

		for (var i = 0, len = rTte.length; i < len; i++) {
			rTte[i] = parseFloat(rTte[i].toFixed(this.fixed));
		}
		this.fromArray(rTte);

		return this;
	},

	scale: function (_scalerX, _scalerY, _sx, _sy) {
		var scalerX = _scalerX !== undefined ? _scalerX : 1,
			scalerY = _scalerY !== undefined ? _scalerY : 1,
			sx = _sx !== undefined ? _sx : 0,
			sy = _sy !== undefined ? _sy : 0;
		var te = this.elements;

		var T = [1, 0, 0, 0, 1, 0, 0, 0, 1],
			S = [1, 0, 0, 0, 1, 0, 0, 0, 1],
			rT = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		T[2] = -sx; T[5] = -sy;
		S[0] = scalerX; S[4] = scalerY;
		rT[2] = sx; rT[5] = sy;

		var Tte = [te[0] + T[2], te[1] + T[5], 1];
		var Rte = [Tte[0] * S[0] + Tte[1] * S[1], Tte[0] * S[3] + Tte[1] * S[4], 1];
		var rTte = [Rte[0] + rT[2], Rte[1] + rT[5], 1];

		for (var i = 0, len = rTte.length; i < len; i++) {
			if (MYAIDE.Math.getPointLength(rTte[i]) > this.fixed)
				rTte[i] = rTte[i].toFixed(this.fixed);
		}

		this.fromArray(rTte);

		return this.float();
	},
	parseInt: function () {
		var te = this.elements;
		for (var i = 0, len = te.length; i < len; i++) {
			te[i] = parseInt(te[i]);
		}
		return this;
	},
	float: function () {
		var te = this.elements;
		for (var i = 0, len = te.length; i < len; i++) {
			te[i] = parseFloat(te[i]);
		}
		return this;
	},
	identity: function () {
		var te = this.elements;
		te[0] = 0; te[1] = 0; te[2] = 1;

		return this;
	}
};
MYAIDE.Matrix3 = function () {
	this.elements = new Array(
		1, 0, 0,
		0, 1, 0,
		0, 0, 1
	);
	if (arguments.length > 0) {
		MYAIDE.Common.trace("MYAIDE.Matrix3 use .set() onstead matrix3.");
	}
};
MYAIDE.Matrix3.prototype = {
	constructor: MYAIDE.Matrix3,
	set: function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {

		te = this.elements;
		te[0] = n11; te[1] = n12; te[2] = n13;
		te[3] = n21; te[4] = n22; te[5] = n23;
		te[6] = n31; te[7] = n32; te[8] = n33;

		return this;
	},
	clone: function () {

		return new this.constructor().fromArray(this.elements);
	},
	copy: function (m) {

		var me = m.elements;

		this.set(me[0], me[3], me[6],
			me[1], me[4], me[7],
			me[2], me[5], me[8]);
		return this;
	},
	multiplyScalar: function (s) {

		var te = this.elements;

		te[0] *= s; te[3] *= s; te[6] *= s;
		te[1] *= s; te[4] *= s; te[7] *= s;
		te[2] *= s; te[5] *= s; te[8] *= s;

		return this;

	},
	multiplyMatrices: function (a) {
		return this.multiplyArray(a.elements);
	},
	multiplyArray: function (arr) {
		var te = this.elements;
		var a11 = te[0], a12 = te[1], a13 = te[2];
		var a21 = te[3], a22 = te[4], a23 = te[5];
		var a31 = te[6], a32 = te[7], a33 = te[8];

		var b11 = arr[0], b12 = arr[1], b13 = arr[2];
		var b21 = arr[3], b22 = arr[4], b23 = arr[5];
		var b31 = arr[6], b32 = arr[7], b33 = arr[8];

		te[0] = a11 * b11 + a12 * b21 + a13 * b31;
		te[1] = a11 * b12 + a12 * b22 + a13 * b32;
		te[2] = a11 * b13 + a12 * b23 + a13 * b33;

		te[3] = a21 * b11 + a22 * b21 + a23 * b31;
		te[4] = a21 * b12 + a22 * b22 + a23 * b32;
		te[5] = a21 * b13 + a22 * b23 + a23 * b33;

		te[6] = a31 * b11 + a32 * b21 + a33 * b31;
		te[7] = a31 * b12 + a32 * b22 + a33 * b32;
		te[8] = a31 * b13 + a32 * b23 + a33 * b33;

		return this;
	},
	arrayMultiply: function (arr) {
		var te = this.elements;

		var a11 = arr[0], a12 = arr[1], a13 = arr[2];
		var a21 = arr[3], a22 = arr[4], a23 = arr[5];
		var a31 = arr[6], a32 = arr[7], a33 = arr[8];

		var b11 = te[0], b12 = te[1], b13 = te[2];
		var b21 = te[3], b22 = te[4], b23 = te[5];
		var b31 = te[6], b32 = te[7], b33 = te[8];

		te[0] = a11 * b11 + a12 * b21 + a13 * b31;
		te[1] = a11 * b12 + a12 * b22 + a13 * b32;
		te[2] = a11 * b13 + a12 * b23 + a13 * b33;

		te[3] = a21 * b11 + a22 * b21 + a23 * b31;
		te[4] = a21 * b12 + a22 * b22 + a23 * b32;
		te[5] = a21 * b13 + a22 * b23 + a23 * b33;

		te[6] = a31 * b11 + a32 * b21 + a33 * b31;
		te[7] = a31 * b12 + a32 * b22 + a33 * b32;
		te[8] = a31 * b13 + a32 * b23 + a33 * b33;

		return this;
	},
	toArray: function (array, offset) {

		if (array === undefined) array = [];
		if (offset === undefined) offset = 0;

		var te = this.elements;

		array[offset] = te[0];
		array[offset + 1] = te[1];
		array[offset + 2] = te[2];

		array[offset + 3] = te[3];
		array[offset + 4] = te[4];
		array[offset + 5] = te[5];

		array[offset + 6] = te[6];
		array[offset + 7] = te[7];
		array[offset + 8] = te[8];

		return array;

	},
	fromArray: function (array) {
		var te = this.elements;
		te[0] = array[0];
		te[1] = array[1];
		te[2] = array[2];
		te[3] = array[3];
		te[4] = array[4];
		te[5] = array[5];
		te[6] = array[6];
		te[7] = array[7];
		te[8] = array[8];

		return this;
	},
	transform: function (sx, rx, ry, sy, px, py) {
		var te = this.elements;
		this.scale(sx, sy);
		this.translate(px, py);
		/*
				te[2] += te[0] * px;
				te[5] += te[4] * py;
				te[0] *= sx;
				te[4] *= sy;*/
		return this;
	},
	scale: function (sx, sy) {
		var S = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		S[0] = sx;
		S[4] = sy;
		this.multiplyArray(S);
		return this;
	},
	translate: function (x, y) {
		var T = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		T[2] = x; T[5] = y;
		this.multiplyArray(T);
		return this;
	},
	rotate: function (_a) {
		var a = MYAIDE.Math.degToRad(_a);
		var c = Math.cos(a),
			s = Math.sin(a);

		var R = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		R[0] = c; R[1] = -s;
		R[3] = s; R[4] = c;

		this.multiplyArray(R);
		return this;
	},
	identity: function () {
		var te = this.elements;
		te[0] = 1; te[1] = 0; te[2] = 0;
		te[3] = 0; te[4] = 1; te[5] = 0;
		te[6] = 0; te[7] = 0; te[8] = 1;

		return this;
	}
};
MYAIDE.Common = {
	trace: function (_target, _type) {
		var type = _type == undefined ? "log" : _type;
		switch (type) {
			case "log": console.log(_target); break;
			case "warn": console.warn(_target); break;
			case "error": console.error(_target); break;
		}
	},
	traceDebug: function () {
		var output = document.getElementById("monkeyTraceOutput");
		if (!output) {
			var maxWidth = window.innerWidth, maxHeight = window.innerHeight;
			var ele = document.createElement("div");
			ele.style.position = "absolute";
			ele.style.left = ele.style.top = "0px";
			ele.style.border = "2px solid #8DAED8";
			ele.style.background = "#D5E4F2";
			ele.id = "monkeyTraceDebugElm";

			var btn = document.createElement("div"),
				scaleBtn = document.createElement("button"),
				closeBtn = document.createElement("button"),
				delBtn = document.createElement("button");
			btn.style.width = maxWidth * 0.4 + "px";
			scaleBtn.style.width = closeBtn.style.width = delBtn.style.width = "30px";
			scaleBtn.style.height = closeBtn.style.height = delBtn.style.height = "20px";
			scaleBtn.style.float = closeBtn.style.float = delBtn.style.float = "right";
			scaleBtn.style.marginRight = closeBtn.style.marginRight = delBtn.style.marginRight = "1px";
			scaleBtn.innerHTML = "-";
			closeBtn.innerHTML = "×";
			delBtn.innerHTML = "←";
			btn.appendChild(closeBtn);
			btn.appendChild(delBtn);
			btn.appendChild(scaleBtn);
			ele.appendChild(btn);
			MYAIDE.MouseEvent.addEvent(scaleBtn, "mousedown", function (e) {
				e.preventDefault && e.preventDefault();
				if (output.style.display == "none") {
					scaleBtn.innerHTML = "-";
					output.style.display = "block";
				} else {
					scaleBtn.innerHTML = "□";
					output.style.display = "none";
				}
				e.stopPropagation && e.stopPropagation();
			}, true);
			MYAIDE.MouseEvent.addEvent(closeBtn, "mousedown", function (e) {
				e.preventDefault && e.preventDefault();
				ele.style.display = "none";
				e.stopPropagation && e.stopPropagation();
			}, true);
			MYAIDE.MouseEvent.addEvent(delBtn, "mousedown", function (e) {
				e.preventDefault && e.preventDefault();
				output.value = "";
				e.stopPropagation && e.stopPropagation();
			}, true);

			var mouseData = [0, 0];
			MYAIDE.MouseEvent.addEvent(ele, "mousedown", function (e) {
				e.preventDefault && e.preventDefault();
				var emouse = MYAIDE.Common.getMouse(e);
				mouseData = [emouse.x, emouse.y];
				MYAIDE.MouseEvent.addEvent(document.body, "mousemove", eleMove);
				MYAIDE.MouseEvent.addEvent(document.body, "mouseup", eleUp);
			}, false);

			function eleMove(e) {
				e.preventDefault && e.preventDefault();
				var nMouse = MYAIDE.Common.getMouse(e);
				var dx = nMouse.x - mouseData[0],
					dy = nMouse.y - mouseData[1];
				var nx = parseInt(ele.style.left) + dx,
					ny = parseInt(ele.style.top) + dy;
				ele.style.left = nx + "px";
				ele.style.top = ny + "px";
				mouseData = [nMouse.x, nMouse.y];
			}
			function eleUp(e) {
				MYAIDE.MouseEvent.removeEvent(document.body, "mousemove", eleMove);
				MYAIDE.MouseEvent.removeEvent(document.body, "mouseup", eleUp);
			}
			output = document.createElement("textarea");
			output.id = "monkeyTraceOutput";
			output.style.width = maxWidth * 0.4 + "px";
			output.style.height = "200px";
			MYAIDE.MouseEvent.addEvent(output, "mousedown", function (e) {
				e.stopPropagation && e.stopPropagation();
			})
			ele.appendChild(output);
			document.body.appendChild(ele);
		}
		document.getElementById("monkeyTraceDebugElm").style.display = "block";
		var val = output.value;
		for (var i = 0; i < arguments.length; i++) {
			val = val + arguments[i] + "\r\n";
		}
		output.value = val;
		output.scrollTop = output.scrollHeight;
	},
	getMouse: function (e) {
		var px, py;
		if (MYAIDE.OSInfo.isSurface) {
			if (e.pageX) {
				px = e.pageX;
				py = e.pageY;
			} else {
				px = e.touches[0].pageX;
				py = e.touches[0].pageY;
			}
		} else
			if (MYAIDE.OSInfo.touchable) {
				px = e.touches[0].pageX;
				py = e.touches[0].pageY;
			} else {
				px = e.pageX;
				py = e.pageY;
			}
		return { x: px, y: py };
	},
	openFile: function (_func) {
		var ele = document.createElement("input");
		ele.type = "file";
		ele.addEventListener("change", function () {
			_func.call(this, ele.files[0], ele.files[0].name);
			ele = null;
		});
		ele.click();
	},
	$get: function (_selector) {
		if (_selector.slice(0, 1) == "#") {
			if (document.querySelector) {
				return document.querySelectorAll(_selector);
			} else
				if (document.getElementById) {
					return document.getElementById(_selector.slice(1));
				}
		} else {
			if (document.querySelectorAll) {
				return document.querySelectorAll(_selector);
			} else {
				return [];
			}
		}
	},
	addOnloadEvent: function (func) {
		var oldOnload = window.onload;
		if (typeof window.onload != "function") {
			window.onload = func;
		} else {
			window.onload = function () {
				oldOnload();
				func();
			};
		}
	},
	RGBToHex: function (rgb) {
		var regexp = /[0-9]{0,3}/g;
		var re = rgb.match(regexp);
		var hexColor = "#"; var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
		for (var i = 0; i < re.length; i++) {
			var r = null, c = re[i], l = c;
			var hexAr = [];
			while (c > 16) {
				r = c % 16;
				c = (c / 16) >> 0;
				hexAr.push(hex[r]);
			}
			hexAr.push(hex[c]);
			if (l < 16 && l != "") {
				hexAr.push(0)
			}
			hexColor += hexAr.reverse().join('');
		}
		return hexColor;
	},
	HexToRGB: function (hex) {
		var sColor = hex.toLowerCase();
		if (sColor && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(sColor)) {
			if (sColor.length === 4) {
				var sColorNew = "#";
				for (var i = 1; i < 4; i += 1) {
					sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
				}
				sColor = sColorNew;
			}
			//处理六位的颜色值
			var sColorChange = [];
			for (var i = 1; i < 7; i += 2) {
				sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
			}
			return "RGB(" + sColorChange.join(",") + ")";
		} else {
			return sColor;
		}
	},
	getExtension: function (path) {
		if (typeof path != "string") {
			return null;
		}
		var pArr = path.split(".");
		var ext = pArr.length > 0 ? pArr[pArr.length - 1] : null;
		return ext;
	},
	getURLParam: function (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)', "ig").exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	},
	supportCanvas: function () {
		var status = true;
		try {
			var test = document.createElement("canvas");
		} catch (e) {
			status = false;
		}
		return status;
	},
	getBrowserInfo: function () {
		var agent = navigator.userAgent.toLowerCase();

		var regStr_ie = /msie [\d.]+;/gi;
		var regStr_ff = /firefox\/[\d.]+/gi;
		var regStr_chrome = /chrome\/[\d.]+/gi;
		var regStr_saf = /safari\/[\d.]+/gi;

		if (agent.indexOf("msie") > 0) {
			return agent.match(regStr_ie);
		}

		if (agent.indexOf("firefox") > 0) {
			return agent.match(regStr_ff);
		}

		if (agent.indexOf("chrome") > 0) {
			return agent.match(regStr_chrome);
		}

		if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
			return agent.match(regStr_saf);
		}
	},
	getBrowser: function () {
		var OsObject = "";
		if (navigator.userAgent.indexOf("MSIE") > 0 || navigator.userAgent.indexOf("Media") > 0) {
			OsObject = "IE";
		} else
			if (navigator.userAgent.indexOf("Firefox") > 0) {
				OsObject = "Firefox";
			} else
				if (navigator.userAgent.indexOf("Chrome") > 0) {
					OsObject = "Chrome";
				} else
					if (navigator.userAgent.indexOf("Oprea") > 0) {
						OsObject = "Oprea";
					} else
						if (navigator.userAgent.indexOf("Safari") > 0) {
							OsObject = "Safari";
						} else {
							OsObject = "some anther";
						}
		return OsObject;
	},
	contralSize: function (obj, fw, fh) {
		var scaleX = 1, scaleY = 1, scale = 1;
		var nowLeft = 0, nowTop = 0;
		var winWidth = 1024, winHeight = 768;
		if (window.innerWidth) winWidth = window.innerWidth; else if ((document.body) && (document.body.clientWidth)) winWidth = document.body.clientWidth;
		if (window.innerHeight) winHeight = window.innerHeight; else if ((document.body) && (document.body.clientHeight)) winHeight = document.body.clientHeight;
		scaleX = winWidth / fw;
		scaleY = winHeight / fh;
		scale = scaleX < scaleY ? scaleX : scaleY;
		nowLeft = (winWidth - fw) / 2;
		nowTop = 0 - (1 - scale) * fh / 2;
		return { scale: scale, left: nowLeft, top: nowTop };
	},
	PointInPoly: function (pt, poly) {
		for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
			((poly[i][1] <= pt.y && pt.y < poly[j][1]) || (poly[j][1] <= pt.y && pt.y < poly[i][1]))
				&& (pt.x < (poly[j][0] - poly[i][0]) * (pt.y - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
				&& (c = !c);
		return c;

	},
	PointInOrOnPoly: function (pt, poly) {
		for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
			if (MYAIDE.Math.getDistancePointToSegment(poly[j][0], poly[j][1], poly[i][0], poly[i][1], pt.x, pt.y) == 0) {
				return true;
			} else {
				((poly[i][1] <= pt.y && pt.y < poly[j][1]) || (poly[j][1] <= pt.y && pt.y < poly[i][1]))
					&& (pt.x > (poly[j][0] - poly[i][0]) * (pt.y - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
					&& (c = !c);
			}
		}
		return c;
	},
	hitPolygon: function (list, x, y) {
		var c = 0, p0 = list[0], b0x = (x <= p0[0]), b0y = (y <= p0[1]), i, l, p1, b1x, b1y;
		for (i = 1, l = list.length; i < l + 1; i++) {
			p1 = list[i % l];
			b1x = (x <= p1[0]);
			b1y = (y <= p1[1]);
			if (b0y != b1y) {
				if (b0x == b1x) {
					if (b0x) {
						c += (b0y ? -1 : 1);
					}
				} else {
					if (x <= (p0[0] + (p1[0] - p0[0]) * (y - p0[1]) / (p1[1] - p0[1]))) {
						c += (b0y ? -1 : 1);
					}
				}
			}
			p0 = p1;
			b0x = b1x;
			b0y = b1y;
		}
		return 0 != c;
	},
	hitTestPolygon: function (p1, p2) {
		var i, j, l, listA, normals, vecs, list = [[p1, [], []], [p2, [], []]];
		var tp = new MYAIDE.Position();
		for (j = 0; j < list.length; j++) {
			listA = list[j][0], normals = list[j][1];
			for (i = 0, l = listA.length; i < l; i++) {
				list[j][2].push(new MYAIDE.Position(listA[i][0], listA[i][1]));
				if (i < l - 1) {
					normals.push((new MYAIDE.Position(listA[i + 1][0] - listA[i][0], listA[i + 1][1] - listA[i][1])).cloneReverseY());
				}
			}
			normals.push((new MYAIDE.Position(listA[0][0] - listA[l - 1][0], listA[0][1] - listA[l - 1][1])).cloneReverseY());
		}
		for (j = 0; j < list.length; j++) {
			normals = list[j][1];
			for (i = 0, l = normals.length; i < l; i++) {
				var r1 = tp.getMinMax(list[0][2], normals[i]);
				var r2 = tp.getMinMax(list[1][2], normals[i]);
				if (r1.max_o < r2.min_o || r1.min_o > r2.max_o) {
					return false;
				}
			}
		}
		return true;
	},
	hitTestPolygonArc: function (vs, arc) {
		if (MYAIDE.Common.hitPolygon(vs, arc[0], arc[1])) {
			return true;
		}
		var tp = new MYAIDE.Position();
		var i, j, l, p1, p2, v1, v2, ext, inn, l2;
		for (i = 0, l = vs.length; i < l; i++) {
			j = i < l - 1 ? i + 1 : 0;
			p1 = vs[i], p2 = vs[j];
			v1 = new MYAIDE.Position(arc[0] - p1[0], arc[1] - p1[1]), v2 = new MYAIDE.Position(p2[0] - p1[0], p2[1] - p1[1]);
			l2 = v2.cloneAver();
			inn = tp.dot(v1, l2);
			if (inn <= 0) {
				if (v1.x * v1.x + v1.y * v1.y < arc[3]) {
					return true;
				}
			} else if (inn * inn < v2.x * v2.x + v2.y * v2.y) {
				ext = tp.cross(v1, l2);
				if (ext * ext < arc[3]) {
					return true;
				}
			}
		}
		return false;
	},
	rankZindex: function (obj1, obj2) {
		return obj1.zIndex - obj2.zIndex;
	},
	rankScene: function (arr) {
		var len = arr.length, i, j, tmp;
		for (i = len - 1; i >= 1; i--) {
			for (j = 0; j <= i - 1; j++) {
				if (arr[j].zIndex > arr[j + 1].zIndex) {
					tmp = arr[j + 1];
					arr[j + 1] = arr[j];
					arr[j] = tmp;
				}
			}
		}
		return arr;
	},
	arrayCopy: function (source) {
		if (Array.isArray(source)) {
			var arr = new Array();
			for (var i = 0, len = source.length; i < len; i++) {
				if (Array.isArray(source[i])) {
					arr[i] = MYAIDE.Common.arrayCopy(source[i]);
				} else {
					arr[i] = source[i];
				}
			}
			return arr;
		} else {
			console.log("arraycopy目标必须为Array");
		}
	},
	sortBubble: function (array) {
		var len = array.length, i, j, tmp;
		for (i = len - 1; i >= 1; i--) {
			for (j = 0; j <= i - 1; j++) {
				if (array[j] > array[j + 1]) {
					tmp = array[j + 1];
					array[j + 1] = array[j];
					array[j] = tmp;
				}
			}
		}
		return array;
	},
	sortQuick: function (array) {
		var low = 0, high = array.length - 1;
		var sort = function (low, high) {
			if (low >= high) return;
			var key = array[low],
				tmplow = low,
				tmphigh = high;
			while (low < high) {
				while (low < high && key <= array[high]) {
					--high;
				}
				array[low] = array[high];
				while (low < high && array[low] <= key) {
					++low;
				}
				array[high] = array[low];
				if (low == tmplow) {
					sort(++low, tmphigh);
					return;
				}
			}
			array[low] = key;
			sort(tmplow, low - 1);
			sort(high + 1, tmphigh);
		};
		sort(low, high);
		return array;
	},
	sortInsert: function (array) {
		var i = 1, j, len = array.length, key;
		for (; i < len; i++) {
			j = i;
			key = array[j];
			while (--j > -1) {
				if (array[j] > key) {
					array[j + 1] = array[j];
				} else {
					break;
				}
			}
			array[j + 1] = key;
		}
		return array;
	},
	getAddress: function (_callbacks, _options) {
		var options = _options !== undefined ? _options : { timeout: 10000, enableHighAccuracy: true };
		navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionFail, options);
		var end = { status: false, lng: 0, lat: 0, error: null };
		function getPositionSuccess(position) {
			end.status = true;
			end.lng = position.coords.longitude;
			end.lat = position.coords.latitude;
			_callbacks(end);
		};
		function getPositionFail(error) {
			end.error = error;
			_callbacks(end);
		};
	},
	isPC: function () {
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	}
};

MYAIDE.Clock = function (autoStart) {

	this.autoStart = (autoStart !== undefined) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;

	this.running = false;

};

MYAIDE.Clock.prototype = {

	constructor: MYAIDE.Clock,

	start: function () {

		try {
			this.startTime = (performance || Date).now();
		} catch (e) {
			this.startTime = (new Date()).getTime();
		}

		this.oldTime = this.startTime;
		this.running = true;

	},

	stop: function () {

		this.getElapsedTime();
		this.running = false;

	},
	getElapsedTime: function () {

		this.getDelta();
		return this.elapsedTime;

	},
	getDelta: function () {

		var diff = 0;

		if (this.autoStart && !this.running) {

			this.start();

		}

		if (this.running) {

			try {
				var newTime = (performance || Date).now();
			} catch (e) {
				var newTime = (new Date()).getTime();
			}

			diff = (newTime - this.oldTime) / 1000;
			this.oldTime = newTime;

			this.elapsedTime += diff;

		}

		return diff;

	},
	resetClock: function () {
		this.startTime = 0;
		this.oldTime = 0;
		this.elapsedTime = 0;

		this.running = false;
	}
};

MYAIDE.Sint = {
	status: true,
	sListener: [],
	nTime: (new Date()).getTime(),
	add: function (_name, _func, _timer) {
		if (typeof _func != "function" || typeof _name != "string" || isNaN(_timer)) {
			console.warn("MYAIDE.Sint.add:arguments error.");
			return;
		}
		var obj = {
			name: _name,
			runFunc: _func,
			timer: _timer,
			status: 0,
			sTime: (new Date()).getTime(),
			rTime: 0
		};
		this.sListener.push(obj);
		return _name;
	},
	runSint: function () {
		this.status = true;
	},
	stopSint: function () {
		this.status = false;
	},
	runAll: function () {
		for (var i = 0, len = this.sListener.length; i < len; i++) {
			this.sListener[i].status = 0;
		}
	},
	stopAll: function () {
		for (var i = 0, len = this.sListener.length; i < len; i++) {
			this.sListener[i].status = 2;
		}
	},
	pauseAll: function () {
		for (var i = 0, len = this.sListener.length; i < len; i++) {
			this.sListener[i].status = 1;
		}
	},
	run: function (_name, _res) {
		this.changeStatus(_name, 0, _res);

	},
	stop: function (_name) {
		this.changeStatus(_name, 2);
	},
	pause: function (_name) {
		this.changeStatus(_name, 1);
	},
	refresh: function () {
		this.status = true;
		this.sListener = [];
	},
	changeStatus: function (_name, _status, _res) {
		if (new Array(0, 1, 2).indexOf(_status) < 0) return;
		var res = _res == undefined ? false : _res;
		for (var i = 0, len = this.sListener.length; i < len; i++) {
			if (this.sListener[i].name == _name) {
				if (res) this.sListener[i].sTime = this.nTime;
				this.sListener[i].status = _status;
				break;
			}
		}
	},
	changeAttribute: function (_name, attr, value) {
		if (attr == "status") {
			this.changeStatus(_name, value);
		} else {
			for (var i = 0, len = this.sListener.length; i < len; i++) {
				if (this.sListener[i].name == _name) {
					this.sListener[i][attr] = value;
					break;
				}
			}
		}
	},
	spint: function (timer) {
		this.nTime = timer;
		if (this.sListener.length < 1) return;
		var spliceArr = [];
		for (var i = -1, p; p = this.sListener[++i];) {
			if (p.status == 0) {
				p.rTime = this.nTime - p.sTime;
				if (p.rTime >= p.timer) {
					p.rTime = p.rTime % p.timer;
					p.sTime = this.nTime;
					p.runFunc.call(this);
				}
			} else
				if (p.status == 2) {
					spliceArr.push(i);
				}
		}
		if (spliceArr.length > 0) {
			for (var k = spliceArr.length - 1; k >= 0; k--) {
				this.sListener.splice(spliceArr[k], 1);
			}
		}
	}

};

MYAIDE.Cookie = {
	cookieSign: "MYAIDE.Cookie.sign.",
	setCookie: function (_name, _str) {
		_str = JSON.stringify(_str);
		try {
			localStorage.setItem(MYAIDE.Cookie.cookieSign + _name, _str);
		} catch (e) {

		}
	},
	getCookie: function (_name) {
		if (localStorage.getItem(MYAIDE.Cookie.cookieSign + _name)) {
			return JSON.parse(localStorage.getItem(MYAIDE.Cookie.cookieSign + _name));
		} else {
			return null;
		}
	},
	clearCookie: function (_name) {
		localStorage.removeItem(MYAIDE.Cookie.cookieSign + _name);
	}
};

MYAIDE.Math = {
	DEG2RAD: Math.PI / 180,
	RAD2DEG: 180 / Math.PI,
	usePI: 3.1415926535897932384626433832795,
	numberCode: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
	radix16Code: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"],
	letterCode: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],

	generateUUID: function () {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = new Array(36);
		var rnd = 0, r;
		for (var i = 0; i < 36; i++) {
			if (i === 8 || i === 13 || i === 18 || i === 23) {
				uuid[i] = '-';
			} else if (i === 14) {
				uuid[i] = '4';
			} else {
				if (rnd <= 0x02)
					rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
				r = rnd & 0xf;
				rnd = rnd >> 4;
				uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
			}
		}
		return uuid.join('');
	},
	getNumberCaptchas: function (_len) {
		var len = _len || 4;
		var captchas = [], code;
		for (var i = 0; i < len; i++) {
			code = MYAIDE.Math.numberCode[parseInt(Math.random() * MYAIDE.Math.numberCode.length)];
			captchas.push(code);
		}
		return captchas.join("");
	},
	getRadix16Captchas: function (_len) {
		var len = _len || 4;
		var captchas = [], code;
		for (var i = 0; i < len; i++) {
			code = MYAIDE.Math.radix16Code[parseInt(Math.random() * MYAIDE.Math.radix16Code.length)];
			captchas.push(code);
		}
		return captchas.join("");
	},
	getLetterCaptchas: function (_len) {
		var len = _len || 4;
		var captchas = [], code;
		for (var i = 0; i < len; i++) {
			code = MYAIDE.Math.letterCode[parseInt(Math.random() * MYAIDE.Math.letterCode.length)];
			captchas.push(code);
		}
		return captchas.join("");
	},
	planarPolygonAreaMeters: function (points) {
		var a = 0;
		for (var i = 0, len = points.length; i < len; i++) {
			var j = (i + 1) % len;
			var ax = points[i][0],
				ay = points[i][1];
			var bx = points[j][0],
				by = points[j][1];
			a += ax * by - ay * bx;
		}
		return Math.abs(a / 2);
	},
	segmentsIntr: function (a, b, c, d) {
		var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
		var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
		if (area_abc * area_abd >= 0) {
			return false;
		}
		var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
		var area_cdb = area_cda + area_abc - area_abd;
		if (area_cda * area_cdb >= 0) {
			return false;
		}
		var t = area_cda / (area_abd - area_abc);
		var dx = t * (b.x - a.x),
			dy = t * (b.y - a.y);
		return { x: a.x + dx, y: a.y + dy };
	},
	ClockwiseSortPoints: function (_polygonArr) {
		var center = [],
			x = 0,
			y = 0;
		for (var i = 0; i < _polygonArr.length; i++) {
			x += _polygonArr[i][0];
			y += _polygonArr[i][1];
		}
		center[0] = parseInt(x / _polygonArr.length);
		center[1] = parseInt(y / _polygonArr.length);
		for (var i = 0; i < _polygonArr.length - 1; i++) {
			for (var j = 0; j < _polygonArr.length - i - 1; j++) {
				if (MYAIDE.Math.pointCmp(_polygonArr[j], _polygonArr[j + 1], center)) {
					var tempPoint = [];
					tempPoint[0] = _polygonArr[j][0];
					tempPoint[1] = _polygonArr[j][1];
					_polygonArr[j][0] = _polygonArr[j + 1][0];
					_polygonArr[j][1] = _polygonArr[j + 1][1];
					_polygonArr[j + 1][0] = tempPoint[0];
					_polygonArr[j + 1][1] = tempPoint[1];
				}
			}
		}
		return _polygonArr;
	},
	pointCmp: function (_p1, _p2, _center) {
		var det = (_p1[0] - _center[0]) * (_p2[1] - _center[1]) - (_p2[0] - _center[0]) * (_p1[1] - _center[1]);
		if (det < 0) {
			return true;
		}
		if (det > 0) {
			return false;
		}
		var d1 = (_p1[0] - _center[0]) * (_p1[0] - _center[0]) + (_p1[1] - _center[1]) * (_p1[1] - _center[1]);
		var d2 = (_p2[0] - _center[0]) * (_p2[0] - _center[0]) + (_p2[1] - _center[1]) * (_p2[1] - _center[1]);
		return d1 > d2;
	},
	polyIsRectangle: function (arr) {
		var status = false;
		if (arr.length == 4) {
			var xArr = [],
				yArr = [];
			for (var i = 0; i < arr.length; i++) {
				var x = arr[i][0], y = arr[i][0];
				if (xArr.indexOf(x) == -1) {
					xArr.push(x);
				}
				if (yArr.indexOf(y) == -1) {
					yArr.push(y);
				}
			}
			if (xArr.length == 2 && yArr.length == 2) {
				status = true;
			}
		}
		return status;
	},
	getPolygonClip: function (arr1, arr2) {
		if (arr1.length < 3 || arr2.length < 3) return [];
		var trigger = [];
		var pt = { x: 0, y: 0 };

		for (var i = arr1.length - 1; i >= 0; i--) {
			pt.x = arr1[i][0];
			pt.y = arr1[i][1];
			if (MYAIDE.Common.PointInOrOnPoly(pt, arr2)) {
				trigger.push([arr1[i][0], arr1[i][1]]);
			}
		}
		for (var j = arr2.length - 1; j >= 0; j--) {
			pt.x = arr2[j][0];
			pt.y = arr2[j][1];
			if (MYAIDE.Common.PointInOrOnPoly(pt, arr1)) {
				trigger.push([arr2[j][0], arr2[j][1]]);
			}
		}
		var sp1 = { x: 0, y: 0 },
			sp2 = { x: 0, y: 0 },
			ep1 = { x: 0, y: 0 },
			ep2 = { x: 0, y: 0 };

		for (var m = arr1.length - 1; m >= 0; m--) {
			sp1.x = arr1[m][0];
			sp1.y = arr1[m][1];
			var snext = m > 0 ? m - 1 : arr1.length - 1;
			sp2.x = arr1[snext][0];
			sp2.y = arr1[snext][1];
			for (var n = arr2.length - 1; n >= 0; n--) {
				ep1.x = arr2[n][0];
				ep1.y = arr2[n][1];
				var enext = n > 0 ? n - 1 : arr2.length - 1;
				ep2.x = arr2[enext][0];
				ep2.y = arr2[enext][1];
				var res = MYAIDE.Math.segmentsIntr(sp1, sp2, ep1, ep2);
				if (res) {
					trigger.push([res.x, res.y]);
				}
			}
		}
		var nTrigger = [], nList = [];
		for (var k = 0; k < trigger.length; k++) {
			var nStr = trigger[k][0] + "&" + trigger[k][1];
			if (nList.indexOf(nStr) == -1) {
				nTrigger.push(trigger[k]);
				nList.push(nStr);
			}
		}

		trigger = MYAIDE.Math.ClockwiseSortPoints(nTrigger);
		return trigger;
	},
	getRectangleClip: function (arr1, arr2) {
		if (arr1.length != 4 || arr2.length != 4) return [];
		var obj1 = { sX: arr1[0][0], sY: arr1[0][1], eX: arr1[0][0], eY: arr1[0][1] },
			obj2 = { sX: arr2[0][0], sY: arr2[0][1], eX: arr2[0][0], eY: arr2[0][1] };
		for (var i = arr1.length - 1; i > 0; i--) {
			arr1[i][0] < obj1.sX ? obj1.sX = arr1[i][0] : (arr1[i][0] > obj1.eX ? obj1.eX = arr1[i][0] : "");
			arr1[i][1] < obj1.sY ? obj1.sY = arr1[i][1] : (arr1[i][1] > obj1.eY ? obj1.eY = arr1[i][1] : "");
			arr2[i][0] < obj2.sX ? obj2.sX = arr2[i][0] : (arr2[i][0] > obj2.eX ? obj2.eX = arr2[i][0] : "");
			arr2[i][1] < obj2.sY ? obj2.sY = arr2[i][1] : (arr2[i][1] > obj2.eY ? obj2.eY = arr2[i][1] : "");
		}
		var endObj = {
			sX: obj1.sX > obj2.sX ? obj1.sX : obj2.sX,
			sY: obj1.sY > obj2.sY ? obj1.sY : obj2.sY,
			eX: obj1.eX < obj2.eX ? obj1.eX : obj2.eX,
			eY: obj1.eY < obj2.eY ? obj1.eY : obj2.eY
		};
		if (endObj.sX >= endObj.eX || endObj.sY >= endObj.eY) {
			return [];
		} else {
			return [[endObj.sX, endObj.sY], [endObj.sX, endObj.eY], [endObj.eX, endObj.eY], [endObj.eX, endObj.sY]];
		}
	},
	countVectorRange: function (a, b) {
		var vectorMo = MYAIDE.Math.add(MYAIDE.Math.mul(a[0], b[0]), MYAIDE.Math.mul(a[1], b[1]));
		var vectorJ = Math.sqrt(MYAIDE.Math.mul(MYAIDE.Math.add(Math.pow(a[0], 2), Math.pow(b[0], 2)), MYAIDE.Math.add(Math.pow(a[1], 2), Math.pow(b[1], 2))));
		return Math.acos(vectorMo / vectorJ) / Math.PI * 180;
	},
	getThreePointAngle: function (centreX, centreY, sx, sy, ex, ey) {
		var a = MYAIDE.Math.getPowDistancePointToPoint(sx, sy, ex, ey),
			b = MYAIDE.Math.getPowDistancePointToPoint(centreX, centreY, ex, ey),
			c = MYAIDE.Math.getPowDistancePointToPoint(centreX, centreY, sx, sy),
			cosA = (b + c - a) / (2 * Math.sqrt(b) * Math.sqrt(c));
		cosA > 1 ? cosA = 1 : (cosA < -1 ? cosA = -1 : "");
		var ang = Math.acos(cosA) * 180 / Math.PI;
		return ang;
	},
	getPowDistancePointToPoint: function (x1, y1, x2, y2) {
		return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
	},
	getDistancePointToLine: function (x1, y1, x2, y2, x, y) {
		var d = 0;
		var up = (y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1;
		var down = Math.sqrt((y1 - y2) * (y1 - y2) + (x2 - x1) * (x2 - x1));
		d = Math.abs(up / down);
		return d;
	},
	getDistancePointToSegment: function (x1, y1, x2, y2, x, y) {
		var cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
		if (cross <= 0)
			return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));

		var d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
		if (cross >= d2)
			return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));

		var ang = MYAIDE.Math.getThreePointAngle(x1, y1, x2, y2, x, y);
		if (ang % 360 == 0) {
			return 0;
		}
		return MYAIDE.Math.getDistancePointToLine(x1, y1, x2, y2, x, y);
	},
	getDirection: function (_x0, _y0, _x1, _y1, _x2, _y2) {
		var status = false;
		if (_x0 == _x1) {
			status = _y0 > _y1 ? (_x2 > _x0 ? true : false) : (_x2 > _x0 ? false : true);
		} else
			if (_y0 == _y1) {
				status = _x0 > _x1 ? (_y2 > _y0 ? false : true) : (_y2 > _y0 ? true : false);
			} else {
				var m_y = (_y2 - _y0) / (_y1 - _y0),
					m_x = (_x2 - _x0) / (_x1 - _x0);
				if ((_y1 > _y0 && _x1 < _x0) || (_y1 < _y0 && _x1 > _x0)) {
					status = m_y > m_x ? false : true;
				} else {
					status = m_y > m_x ? true : false;
				}
			}
		return status;
	},
	getChangeAngle: function (centreX, centreY, sx, sy, ex, ey) {
		var ang = MYAIDE.Math.getThreePointAngle(centreX, centreY, sx, sy, ex, ey);
		var status = MYAIDE.Math.getDirection(centreX, centreY, sx, sy, ex, ey);
		ang = status ? ang : -ang;
		return ang;
	},
	findPolygonCenter: function (list) {
		if (list.length < 6) return { "pointX": 0, "pointY": 0 };
		var obj = {};
		obj.minX = list[0], obj.maxX = list[0],
			obj.minY = list[1], obj.maxY = list[1];
		for (var i = 2; i < list.length; i += 2) {
			if (list[i] > obj.maxX) {
				obj.maxX = list[i];
			}
			if (list[i] < obj.minX) {
				obj.minX = list[i];
			}
			if (list[i + 1] > obj.maxY) {
				obj.maxY = list[i + 1];
			}
			if (list[i + 1] < obj.minY) {
				obj.minY = list[i + 1];
			}
		}
		obj.pointX = obj.minX + (obj.maxX - obj.minX) / 2;
		obj.pointY = obj.minY + (obj.maxY - obj.minY) / 2;
		return obj;
	},
	setCallAngle: function (_di1x, _di1y, _di2x, _di2y) {
		var b1 = _di2x - _di1x, b2 = _di2y - _di1y;
		var plusX = -(_di2x - _di1x) / Math.abs(_di2x - _di1x);
		var plusY = -(_di2y - _di1y) / Math.abs(_di2y - _di1y);
		var Angle = 0;
		b1 > 0 && b2 > 0 ? Angle = Math.atan(b2 / b1) / Math.PI * 180 : "";
		b1 < 0 && b2 > 0 ? Angle = Math.atan(b2 / b1) / Math.PI * 180 + 180 : "";
		b1 < 0 && b2 < 0 ? Angle = Math.atan(b2 / b1) / Math.PI * 180 + 180 : "";
		b1 > 0 && b2 < 0 ? Angle = Math.atan(b2 / b1) / Math.PI * 180 + 360 : "";
		b1 != 0 && b2 == 0 ? Angle = (plusX + 1) * 90 : "";
		b1 == 0 && b2 != 0 ? Angle = (plusY + 2) * 90 : "";
		isNaN(Angle) ? Angle = 0 : "";
		Angle = Angle >= 180 ? Angle % 180 : Angle;
		return Angle;
	},
	isParallel: function (dot1, dot2, dot3, dot4) {
		var status = false;
		var angle1 = MYAIDE.Math.setCallAngle(dot1.x, dot1.y, dot2.x, dot2.y),
			angle2 = MYAIDE.Math.setCallAngle(dot3.x, dot3.y, dot4.x, dot4.y);
		if (angle1 == angle2) {
			var angle3 = MYAIDE.Math.setCallAngle(dot1.x, dot1.y, dot3.x, dot3.y),
				angle4 = MYAIDE.Math.setCallAngle(dot2.x, dot2.y, dot4.x, dot4.y);
			if (angle3 != angle4) {
				status = true;
			}
		}
		return status;
	},
	randomArray: function (list) {
		var arr = [];
		for (var i = 0, l = list.length; i < l; i++) {
			var num = Math.floor(Math.random() * (list.length));
			arr[i] = list[num];
			list.splice(num, 1);
		}
		return arr;
	},
	getPositionX: function (ele) {
		return ele.parent == null ? ele.position.x : parseInt(MYAIDE.Math.getPositionX(ele.parent)) + parseInt(ele.position.x);
	},
	getPositionY: function (ele) {
		return ele.parent == null ? ele.position.y : parseInt(MYAIDE.Math.getPositionY(ele.parent)) + parseInt(ele.position.y);
	},
	getOverflow: function (ele) {
		return ele.parent == null ? ele.overflow : (ele.overflow == "inherit" ? MYAIDE.Math.getOverflow(ele.parent) : ele.overflow);
	},
	getPositionWithScaleX: function (ele) {
		return ele.scale.x == 1 ? ele.position.x : ele.position.x * ele.scale.x;
	},
	getPositionWithScaleY: function (ele) {
		return ele.scale.y == 1 ? ele.position.y : ele.position.y * ele.scale.y;
	},
	getPageX: function (ele) {
		return ele.parentNode == document ? ele.offsetLeft : parseInt(MYAIDE.Math.getPageX(ele.parentNode)) + parseInt(ele.offsetLeft);
	},
	getPageY: function (ele) {
		return ele.parentNode == document ? ele.offsetTop : parseInt(MYAIDE.Math.getPageY(ele.parentNode)) + parseInt(ele.offsetTop);
	},
	getRotate: function (ele) {
		return ele.parent == null ? ele.rotate : parseInt(MYAIDE.Math.getRotate(ele.parent)) + parseInt(ele.rotate);
	},
	getScaleX: function (ele) {
		return ele.parent == null ? ele.scale.x : MYAIDE.Math.getScaleX(ele.parent) * ele.scale.x;
	},
	getScaleY: function (ele) {
		return ele.parent == null ? ele.scale.y : MYAIDE.Math.getScaleY(ele.parent) * ele.scale.y;
	},
	getPosition: function (object) {
		var position = { x: 0, y: 0 };
		position.x = MYAIDE.Math.getPositionX(object);
		position.y = MYAIDE.Math.getPositionY(object);
		return position;
	},
	getScale: function (object) {
		var scale = { x: 1, y: 1 };
		scale.x = MYAIDE.Math.getScaleX(object);
		scale.y = MYAIDE.Math.getScaleY(object);
		return scale;
	},
	clamp: function (value, min, max) {
		return Math.max(min, Math.min(max, value));
	},
	degToRad: function (degrees) {
		return degrees * MYAIDE.Math.DEG2RAD;
	},
	radToDeg: function (radians) {
		return radians * MYAIDE.Math.RAD2DEG;
	},
	randFloat: function (min, max) {
		return min + Math.random() * (max - min);
	},
	randInt: function (min, max) {
		return min + Math.floor(Math.random() * (max - min + 1));
	},
	getTrueLength: function (str) {
		var len = str.length, truelen = 0;
		for (var x = 0; x < len; x++) {
			if (str.charCodeAt(x) > 128) {
				truelen += 2;
			} else {
				truelen += 1;
			}
		}
		return truelen;
	},
	add: function (_num1, _num2) {
		var num1 = _num1.toString(), num2 = _num2.toString();
		var fruitData = 0;
		num1 = num1.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num1, true) : num1;
		num2 = num2.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num2, true) : num2;
		var pointLen1 = this.getPointLength(num1),
			pointLen2 = this.getPointLength(num2);
		var maxPointLen = pointLen1 > pointLen2 ? pointLen1 : pointLen2;
		if (pointLen1 > 0 || pointLen2 > 0) {
			fruitData = parseFloat(num1) + parseFloat(num2);
			fruitData = fruitData.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(fruitData, true) : fruitData;
			var fruitPointLength = this.getPointLength(fruitData);
			fruitData = fruitPointLength > maxPointLen ? this.toFixed(fruitData, maxPointLen) : fruitData;
		} else {
			fruitData = parseInt(num1) + parseInt(num2);
		}
		fruitData = Number(fruitData);
		return fruitData;
	},
	sub: function (_num1, _num2) {
		var num1 = _num1.toString(), num2 = _num2.toString();
		var fruitData = 0;
		num1 = num1.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num1, true) : num1;
		num2 = num2.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num2, true) : num2;
		var pointLen1 = this.getPointLength(num1),
			pointLen2 = this.getPointLength(num2);
		var maxPointLen = pointLen1 > pointLen2 ? pointLen1 : pointLen2;
		if (pointLen1 > 0 || pointLen2 > 0) {
			var fruitData = parseFloat(num1) - parseFloat(num2);
			fruitData = fruitData.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(fruitData, true) : fruitData;
			var fruitPointLength = this.getPointLength(fruitData);
			fruitData = fruitPointLength > maxPointLen ? this.toFixed(fruitData, maxPointLen) : fruitData;
		} else {
			fruitData = parseInt(num1) - parseInt(num2);
		}
		fruitData = Number(fruitData);
		return fruitData;
	},
	mul: function (_num1, _num2) {
		var num1 = _num1.toString(), num2 = _num2.toString();
		var fruitData = 0;
		num1 = num1.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num1, true) : num1;
		num2 = num2.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num2, true) : num2;
		var pointLen1 = this.getPointLength(num1),
			pointLen2 = this.getPointLength(num2);
		var maxPointLen = pointLen1 > pointLen2 ? pointLen1 : pointLen2;

		if (pointLen1 > 0 || pointLen2 > 0) {
			var fruitData = parseFloat(num1) * parseFloat(num2);
			fruitData = fruitData.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(fruitData, true) : fruitData;
			var fruitPointLength = this.getPointLength(fruitData);
			fruitData = fruitPointLength > maxPointLen ? this.toFixed(fruitData, maxPointLen) : fruitData;
		} else {
			fruitData = parseInt(num1) * parseInt(num2);
		}
		fruitData = fruitData.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(fruitData, true) : fruitData;
		fruitData = Number(fruitData);
		return fruitData;
	},
	div: function (_num1, _num2) {
		var num1 = _num1.toString(), num2 = _num2.toString();
		var de1 = 0, de2 = 0, int1, int2;
		var returnData = 0;
		var n1Status = false, n2Status = false;
		num1 = num1.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num1, true) : num1;
		num2 = num2.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num2, true) : num2;
		if (num1.charAt(0) == "-") {
			n1Status = true;
			num1 = num1.slice(1);
		}
		if (num2.charAt(0) == "-") {
			n2Status = true;
			num2 = num2.slice(1);
		}
		de1 = this.getPointLength(num1);
		de2 = this.getPointLength(num2);

		int1 = Math.Number(num1.toString().replace(".", ""));
		int2 = Math.Number(num2.toString().replace(".", ""));
		returnData = int1 / int2;
		returnData = returnData.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(returnData, true) : returnData;
		if (Math.abs(de2 - de1) > 0) {
			returnData = de1 > de2 ? this.moveDecimalPoint(returnData, Math.abs(de1 - de2), "left") : this.moveDecimalPoint(returnData, Math.abs(de1 - de2), "right");
		}
		returnData = returnData.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(returnData, true) : returnData;

		if ((n1Status && !n2Status) || (!n1Status && n2Status)) {
			returnData = "-" + returnData;
		}
		returnData = Number(returnData);
		return returnData;
	},
	red: function (_num1, _num2) {
		var num1 = _num1.toString(), num2 = _num2.toString();
		var ret = { num1: 0, num2: 0 },
			numStatus = { numStatus1: true, numStatus2: true },
			minNumber = 1;
		num1 = num1.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num1, true) : num1;
		num2 = num2.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num2, true) : num2;
		if (this.getPointLength(num1) > 0 || this.getPointLength(num2) > 0) {
			return ret;
		}
		if (parseFloat(num1) < 0) {
			numStatus.numStatus1 = false;
			num1 = Math.abs(num1);
		}
		if (parseFloat(num2) < 0) {
			numStatus.numStatus2 = false;
			num2 = Math.abs(num2);
		}
		minNumber = this.getMaxApp(num1, num2);
		ret.num1 = this.div(num1, minNumber);
		ret.num2 = this.div(num2, minNumber);

		if (numStatus.numStatus1 == false && (numStatus.numStatus1 != numStatus.numStatus2)) {
			ret.num1 = numStatus.numStatus1 ? ret.num1 : "-" + ret.num1;
			ret.num2 = numStatus.numStatus2 ? ret.num2 : "-" + ret.num2;
		}
		return ret;
	},
	toFixed: function (_data, _len) {
		var data = _data.toString(), maxLength = _len;
		var pointLength = this.getPointLength(data);
		if (pointLength > maxLength) {
			if (data.indexOf(".") > -1) {
				data = Math.round(data * Math.pow(10, maxLength)) / Math.pow(10, maxLength).toString();
			}
		}
		return data;
	},
	getMaxApp: function (_num1, _num2) {
		var num1 = _num1.toString(), num2 = _num2.toString();
		var returnData = 0;
		num1 = num1.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num1, true) : num1;
		num2 = num2.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num2, true) : num2;

		if ((num1.toString().indexOf(".") == -1 && !isNaN(num1)) || (num2.toString().indexOf(".") == -1 && !isNaN(num2))) {
			if (num1 % num2 == 0) {
				returnData = num2;
			} else {
				returnData = arguments.callee(num2, num1 % num2);
			}
		}
		returnData = returnData.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(returnData, true) : returnData;
		return returnData;
	},
	getMinApp: function (_num1, _num2) {
		var num1 = _num1, num2 = _num2;
		var returnData = 0, maxApp = 1;
		var x, y;
		num1 = num1.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num1, true) : num1;
		num2 = num2.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(num2, true) : num2;

		if ((num1.toString().indexOf(".") == -1 && !isNaN(num1)) || (num2.toString().indexOf(".") == -1 && !isNaN(num2))) {
			maxApp = this.getMaxApp(num1, num2);

			x = this.div(num1, maxApp);
			y = this.div(num1, maxApp);
			returnData = this.mul(this.mul(x, y), maxApp);
		}
		returnData = returnData.toString().indexOf("e") > -1 ? this.setScientificNotationToDecimal(returnData, true) : returnData;
		return returnData;
	},
	getPointLength: function (_data) {
		var data = _data.toString();
		var len = (data.length - data.indexOf(".") - 1) == data.length ? 0 : (data.length - data.indexOf(".") - 1);
		return len;
	},
	getQuantityOfStr: function (_str, _little) {
		var str = _str.toString(), little = _little.toString();
		var quantity = 0;
		var len = little.length, num;
		num = str.indexOf(little);
		while (num > -1) {
			quantity++;
			num = str.indexOf(little, num + len);
		}
		return quantity;
	},
	delLastAct: function (_data) {
		var str = _data.toString();
		var midStr = "";
		if (str.indexOf(".") > -1) {
			midStr = str.charAt(str.length - 1);
			while (midStr == "0") {
				str = str.slice(0, str.length - 1);
				midStr = str.charAt(str.length - 1);
			}
			if (str.charAt(str.length - 1) == ".") {
				str = str.slice(0, str.length - 1);
			}
		}
		return str;
	},

	moveDecimalPoint: function (_data, _num, _boo) {
		var data = _data.toString(), number = _num, boo = _boo == "right" ? "right" : "left";
		var x, y;
		if (number < 0) return data;
		x = data.indexOf(".");
		if (x == -1) {
			data = data + ".0";
		}
		x = data.indexOf(".");
		if (boo == "right") {
			if (parseInt(data.length - x - 1) < number) {
				for (var i = data.length - x - 1; i <= number; i++) {
					data = data + "0";
				}
			}
		}
		if (boo == "left") {
			if (x - 1 < number) {
				for (var i = x; i <= number; i++) {
					data = "0" + data;
				}
			}
		}
		x = data.indexOf(".");
		if (boo == "right") {
			if (data.length - x - 1 <= number) {
				data = data.slice(0, x) + data.slice(x + 1);
			} else {
				data = data.slice(0, x) + data.slice(x + 1);
				data = data.slice(0, x + number) + "." + data.slice(x + number);
			}
		}
		if (boo == "left") {
			data = data.slice(0, x) + data.slice(x + 1);
			data = data.slice(0, x - number) + "." + data.slice(x - number);
		}

		if (data > 1) {
			var fir = data.toString().charAt(0);
			while (fir == 0) {
				data = data.toString().slice(1);
				fir = data.toString().charAt(0);
			}
		}
		if (data > 0 && data < 1) {
			var sec = data.toString().charAt(1);
			while (sec == 0) {
				data = data.toString().charAt(0) + data.toString().slice(2);
				sec = data.toString().charAt(1);
			}
		}

		return data;
	},

	setScientificNotationToDecimal: function (_num, _boo) {

		var number = _num.toString(), boo = _boo == false ? false : true;
		var isPlus = true;

		if (number.charAt(0) == "-") {
			isPlus = false;
			number = number.slice(1);
		}

		if (boo == true) {
			if (number.indexOf("e") > -1) {
				var n = number.indexOf("e");
				var num = number.slice(0, n);
				var num2 = number.slice(n + 1);

				if (num2 < 0) {
					number = this.moveDecimalPoint(num, Math.abs(num2), "left");
				} else {
					number = this.moveDecimalPoint(num, Math.abs(num2), "right");
				}
			}

		} else {

		}
		if (isPlus) {
			number = number.toString();
		} else {
			number = "-" + number;
		}

		return number;

	}
};

MYAIDE.Tween = {
	status: false,
	iDuration: 50,
	listNumber: 0,
	taskList: [],
	_tween: {
		Linear: function (t, b, c, d) {
			return c * t / d + b;
		},
		easeInQuad: function (t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		easeOutQuad: function (t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInOutQuad: function (t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		easeInCubic: function (t, b, c, d) {
			return c * (t /= d) * t * t + b;
		},
		easeOutCubic: function (t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		},
		easeInOutCubic: function (t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		},
		easeInQuart: function (t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		},
		easeOutQuart: function (t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		easeInOutQuart: function (t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},
		easeInQuint: function (t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		},
		easeOutQuint: function (t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		easeInOutQuint: function (t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		easeInSine: function (t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		easeOutSine: function (t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		easeInOutSine: function (t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		},
		easeInExpo: function (t, b, c, d) {
			return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		},
		easeOutExpo: function (t, b, c, d) {
			return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		easeInOutExpo: function (t, b, c, d) {
			if (t == 0) return b;
			if (t == d) return b + c;
			if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function (t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		},
		easeOutCirc: function (t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		},
		easeInOutCirc: function (t, b, c, d) {
			if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		},
		easeInElastic: function (t, b, c, d, a, p) {
			if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
			if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
			else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		easeOutElastic: function (t, b, c, d, a, p) {
			if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
			if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
			else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
		},
		easeInOutElastic: function (t, b, c, d, a, p) {
			if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
			if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
			else var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		},
		easeInBack: function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		easeOutBack: function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		easeInOutBack: function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		easeInBounce: function (t, b, c, d) {
			return c - self._tween.easeOutBounce(d - t, 0, c, d) + b;
		},
		easeOutBounce: function (t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			} else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
			} else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
			} else {
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
			}
		},
		easeInOutBounce: function (t, b, c, d) {
			if (t < d / 2) return self._tween.easeInBounce(t * 2, 0, c, d) * .5 + b;
			else return self._tween.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
		}
	},
	stopAll: function () {
		MYAIDE.Tween.status = false;
		MYAIDE.Tween.taskList = [];
	},
	pauseAll: function () {
		MYAIDE.Tween.status = false;
	},
	stop: function (name) {
		var self = MYAIDE.Tween;
		for (var i = 0; i < self.taskList.length; i++) {
			if (self.taskList[i][0] == name) {
				self.taskList[i][9] = 2;
				break;
			}
		}
	},
	pause: function (name) {
		var self = MYAIDE.Tween;
		for (var i = 0; i < self.taskList.length; i++) {
			if (self.taskList[i][0] == name) {
				self.taskList[i][9] = 1;
				break;
			}
		}
	},
	run: function (name) {
		var self = MYAIDE.Tween;
		for (var i = 0; i < self.taskList.length; i++) {
			if (self.taskList[i][0] == name) {
				self.taskList[i][9] = 0;
				break;
			}
		}
		self.status = true;
	},
	runAll: function () {
		var self = MYAIDE.Tween;
		for (var i = 0; i < self.taskList.length; i++) {
			self.taskList[i][9] = 0;
			self.taskList[i][10] = (new Date()).getTime();
		}
		self.status = true;
	},
	getProgress: function (name) {
		var pro = 0, self = MYAIDE.Tween;
		for (var i = 0, len = self.taskList.length; i < len; i++) {
			if (self.taskList[i][0] == name) {
				pro = (self.taskList[i][4] / self.taskList[i][5]).toFixed(2);
				break;
			}
		}
		return pro;
	},
	add: function () {
		this.canvasAni.apply(this, arguments);
	},
	canvasAni: function () {
		var self = MYAIDE.Tween;
		if (!self.status) self.status = true;
		var start = 0, name = "tweenList_" + self.listNumber;
		self.listNumber++;
		if (typeof arguments[0] == "string") {
			start = 1;
			name = arguments[0];
		}
		if (arguments.length < 2) {
			console.warn("MYAIDE.Tween.canvasAni is a function must more than 2 arguments.");
			return;
		}
		var beginData = arguments[start],
			endData = arguments[start + 1],
			easeType = arguments[start + 2] || "Linear",
			duration = arguments[start + 3] || 1000,
			updataFunc = arguments[start + 4] ? arguments[start + 4] : function () { },
			blackFunc = arguments[start + 5] ? arguments[start + 5] : function () { };

		var fun = self._tween[easeType];
		var t = 0,
			nowDuration = self.iDuration,
			d = parseInt(duration / nowDuration);
		var list = [];
		for (var i in endData) {
			list.push(i);
		}
		var aniData = {}, blackData = {}, changeData = {};
		for (var j in list) {
			var str = list[j];
			aniData[str] = beginData[str] ? beginData[str] : 0;
			blackData[str] = endData[str] == undefined ? aniData[str] : self.getBlackData(aniData[str], endData[str], false);
			changeData[str] = parseFloat(blackData[str]) - parseFloat(aniData[str]);
		}
		var timed = (new Date()).getTime();
		var tweenData = [name, aniData, changeData, blackData, t, d, easeType, updataFunc, blackFunc, 0, timed];
		self.taskList.push(tweenData);
		return name;
	},
	tweenRun: function (timer) {
		if (this.taskList.length <= 0) return;
		var endTween = [], uTime = 0;
		for (var i = 0, len = this.taskList.length; i < len; i++) {
			var tweenData = this.taskList[i];
			if (tweenData[9] == 0) {
				var uTime = timer - tweenData[10];
				if (uTime > this.iDuration) {
					tweenData[10] = timer - uTime % this.iDuration;
				} else {
					continue;
				}
				if (tweenData[4] < tweenData[5]) {
					tweenData[4]++;
					var data = {};
					var fun = this._tween[tweenData[6]];
					for (var j in tweenData[2]) {
						data[j] = fun(tweenData[4], tweenData[1][j], tweenData[2][j], tweenData[5]);
					}
					tweenData[7](data);
				} else {
					tweenData[7](tweenData[3]);
					tweenData[8]();
					endTween.push(i);
				}
			} else
				if (tweenData[9] == 2) {
					endTween.push(i);
				}
		}
		if (endTween.length > 0) {
			for (var k = endTween.length - 1; k >= 0; k--) {
				this.taskList.splice(endTween[k], 1);
			}
		}
	},
	getBlackData: function (_now, _dataStr, _boo) {
		var now = _now,
			dataStr = _dataStr.toString(),
			boo = _boo == false ? false : true;
		var returnStr = now;
		var n = dataStr.indexOf("=");
		if (n == 1) {
			var mathStr = dataStr.slice(0, 1),
				numStr = dataStr.slice(2);
			now = _boo ? parseInt(now) : parseFloat(now);
			numStr = _boo ? parseInt(numStr) : parseFloat(numStr);
			switch (mathStr) {
				case "+": returnStr = now + numStr; break;
				case "-": returnStr = now - numStr; break;
			}
		} else
			if (n == 0) {
				returnStr = _boo ? parseInt(dataStr) : parseFloat(dataStr);
			} else
				if (n < 0) {
					returnStr = _boo ? parseInt(dataStr) : parseFloat(dataStr)
				}
		return returnStr;
	}
};

MYAIDE.Renderer = function (parameters) {
	parameters = parameters || {};
	var initStatus = false;

	var _canvas = parameters.canvas !== undefined ? parameters.canvas : (function () { MYAIDE.Common.trace("canvas指定失败", "error"); initStatus = true; })();

	if (initStatus) return;

	this.type = "CanvasRenderer";

	var _context = parameters.context !== undefined ? parameters.context : _canvas.getContext("2d"),
		_alpha = parameters.alpha !== undefined ? parameters.alpha : false,
		_depth = parameters.depth !== undefined ? parameters.depth : true,
		parentElm = parameters.parent !== undefined ? parameters.parent : document.body;

	this.canvas = _canvas;
	this.ctx = _context;

	this.backBuffer = document.createElement("canvas");
	this.backBufferCtx = this.backBuffer.getContext("2d");

	var width_default = parseInt(_canvas.width) || parseInt(_canvas.offsetWidth) || 1024,
		height_default = parseInt(_canvas.height) || parseInt(_canvas.offsetHeight) || 768;

	this.backBuffer.width = parameters.width !== undefined ? parameters.width : width_default;
	this.backBuffer.height = parameters.height !== undefined ? parameters.height : height_default;
	this.canvas.width = parameters.width !== undefined ? parameters.width : width_default;
	this.canvas.height = parameters.height !== undefined ? parameters.height : height_default;
	this.ftp = parameters.ftp !== undefined ? parameters.ftp : 60;
	this.ftpFixed = false;
	this.fps = 0;
	this.lastFrame;
	this.nowFrame;
	this.pauseStatus = false;
	this.runStatus = false;
	this.autoClear = true;
	this.color = parameters.color !== undefined ? parameters.color : "#000000";
	this.colorStatus = parameters.color !== undefined ? true : false;
	this.sceneElm = [];
	this.sint;
	MYAIDE.init({ width: width_default, height: height_default, canvas: this.canvas, render: this });
	MYAIDE.Common.trace("MYAIDE.Renderer : " + MYAIDE.REVISION);
};
MYAIDE.Renderer.prototype = {
	constructor: MYAIDE.Renderer,
	getCanvas: function () {
		return this.canvas;
	},
	getCanvasData: function () {
		return {
			width: this.canvas.width,
			height: this.canvas.height
		}
	},
	getBackBuffer: function () {
		return this.backBuffer;
	},
	changeWidth: function (w) {
		this.backBuffer.width = w;
		this.canvas.width = w;
	},
	changeHeight: function (h) {
		this.backBuffer.height = h;
		this.canvas.height = h;
	},
	getCanvasDataURL: function (_type, _encoderOptions, x, y, w, h) {
		var type = _type || "image/jpeg",
			encoderOptions = _encoderOptions || 0.5;
		if (arguments.length < 3) {
			return this.canvas.toDataURL(type, encoderOptions);
		} else {
			var imageData = this.ctx.getImageData(x, y, w, h);
			var tempCanvas = document.createElement("canvas");
			tempCanvas.width = w;
			tempCanvas.height = h;
			tempCanvas.getContext("2d").putImageData(imageData, 0, 0);
			var fDatauri = tempCanvas.toDataURL(type, encoderOptions);
			return fDatauri;
		}
	},
	add: function (object) {
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				this.add(arguments[i]);
			}
			return this;
		}
		if (object === this) {
			console.error("Render.add: object can't be added as a child of itself.", object);
		} else {
			this.sceneElm.push(object);
		}
		return this;
	},
	remove: function (object) {
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				this.remove(arguments[i]);
			}
		}
		var index = this.sceneElm.indexOf(object);
		if (index !== - 1) {
			this.sceneElm.splice(index, 1);
		}
	},
	delAllScene: function () {
		this.sceneElm.splice(0, this.sceneElm.length);
	},
	getScene: function (_name) {
		if (_name === undefined) return null;
		for (var i = 0; i < this.sceneElm.length; i++) {
			if (this.sceneElm[i].name == _name) {
				return this.sceneElm[i];
			}
		}
	},
	getSceneIndex: function (_name) {
		return this.getScene(_name).zIndex;
	},
	showScene: function () {
		var sceneArr = [];
		for (var i = 0; i < arguments.length; i++) {
			sceneArr.push(arguments[i]);
		}
		for (var j = 0; j < this.sceneElm.length; j++) {
			if (sceneArr.indexOf(this.sceneElm[j].name) > -1) {
				this.sceneElm[j].visible = true;
			}
		}
	},
	hideScene: function () {
		var sceneArr = [];
		for (var i = 0; i < arguments.length; i++) {
			sceneArr.push(arguments[i]);
		}
		for (var j = 0; j < this.sceneElm.length; j++) {
			if (sceneArr.indexOf(this.sceneElm[j].name) > -1) {
				this.sceneElm[j].visible = false;
			}
		}
	},
	showSceneAndHide: function () {
		var sceneArr = [];
		for (var i = 0; i < arguments.length; i++) {
			sceneArr.push(arguments[i]);
		}
		for (var j = 0; j < this.sceneElm.length; j++) {
			if (sceneArr.indexOf(this.sceneElm[j].name) > -1) {
				this.sceneElm[j].visible = true;
			} else {
				this.sceneElm[j].visible = false;
			}
		}
	},
	hideSceneAndShow: function () {
		var sceneArr = [];
		for (var i = 0; i < arguments.length; i++) {
			sceneArr.push(arguments[i]);
		}
		for (var j = 0; j < this.sceneElm.length; j++) {
			if (sceneArr.indexOf(this.sceneElm[j].name) > -1) {
				this.sceneElm[j].visible = false;
			} else {
				this.sceneElm[j].visible = true;
			}
		}
	},
	begin: function () {
		if (this.runStatus) {
			return;
		}
		var self = this;
		this.lastFrame = new Date().getTime();
		if (MYAIDE.OSInfo.requestAnimationFrameAble) {
			window.requestAnimationFrame(renderRun);
			this.runStatus = true;
		} else {
			this.sint = setInterval((function (progra) {
				return function () {
					if (!progra.pauseStatus) {
						progra.render();
					}
				}
			})(this), 1000 / this.ftp);
			this.runStatus = true;
		}
		function renderRun(t) {
			if(self.runStatus){
				window.requestAnimationFrame(renderRun);
				if (!self.pauseStatus) {
					self.render(t);
				}
			}
		}
	},
	pause: function () {
		if (this.pauseStatus) {
			this.pauseStatus = false;
			this.fps = 0;
		} else {
			this.pauseStatus = true;
		}
	},
	stop: function () {
		if(MYAIDE.OSInfo.requestAnimationFrameAble){
			this.runStatus = false
		}else{
			clearInterval(this.sint);
			this.runStatus = false
		}
	},
	render: function (t) {
		var bufferCtx = this.backBufferCtx,
			ctx = this.ctx,
			parent = MYAIDE;

		if (this.autoClear) {
			bufferCtx.clearRect(0, 0, this.backBuffer.width, this.backBuffer.height);
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
		if (this.colorStatus) {
			bufferCtx.save();
			bufferCtx.fillStyle = this.color;
			bufferCtx.fillRect(0, 0, this.backBuffer.width, this.backBuffer.height);
			bufferCtx.restore();
		}
		this.nowFrame = new Date().getTime();
		this.fps = parseInt(1000 / (this.nowFrame - this.lastFrame) > 1000 ? 1000 : 1000 / (this.nowFrame - this.lastFrame));
		this.lastFrame = this.nowFrame;
		if (parent.Preload.progress < 100) {
			parent.Preload.updateProgress(bufferCtx);
		} else {
			MYAIDE.Common.rankScene(this.sceneElm);
			for (var i in this.sceneElm) {
				this.renderDraw(this.sceneElm[i]);
			}
		}

		ctx.drawImage(this.backBuffer, 0, 0);
		if (parent.Tween.status) parent.Tween.tweenRun(this.nowFrame);
		if (parent.Sint.status) parent.Sint.spint(this.nowFrame);
		if (parent.Audio.listenStatus) parent.Audio.listenerLoad();

	},
	getFtp: function () {
		return this.ftp;
	},
	setFtp: function (_ftp) {
		if (this.ftpFixed) {
			return;
		}
		if (_ftp > 0) {
			this.ftp = _ftp;
			this.stop();
			this.begin();
		}
	},
	getFPS: function () {
		return this.fps;
	},
	renderDraw: function (_object) {
		if (!_object) return;
		if (!_object.visible) return;
		if (_object.renderDraw) {
			switch (_object.type) {
				case "Scene":
					this.renderDrawObject(_object);
					break;
				case "Animal":
					this.renderDrawObject(_object);
					break;
				case "Button":
					this.renderDrawButton(_object);
					break;
				case "IntervalAnimation":
					this.renderDrawAnimation(_object);
					break;
				case "AnyIntervalAnimation":
					this.renderDrawAnyAnimation(_object);
					break;
				case "SameGraphAnimation":
					this.renderDrawSameGrapAnimation(_object);
					break;
				case "Text":
					this.renderDrawText(_object);
					break;
				default:
					break;
			}
		}
		if (_object.isDrawFunc) {
			this.backBufferCtx.save();
			this.backBufferCtx.globalAlpha *= _object.alpha;
			_object.draw(this.backBuffer, this.backBufferCtx, this);
			this.backBufferCtx.restore();
		}
		_object.countMotionFuncs();
		MYAIDE.Common.rankScene(_object.children);
	},
	renderDrawImageObject: function (_object, showImage) {
		var bufferCtx = this.backBufferCtx;
		bufferCtx.transform(_object.scale.x, 0, 0, _object.scale.y, _object.position.x, _object.position.y);
		bufferCtx.globalAlpha *= _object.alpha;


		if (_object.rotate != 0) {
			bufferCtx.translate(_object.rotatePoint.x, _object.rotatePoint.y);
			bufferCtx.rotate(_object.rotate * Math.PI / 180);
			bufferCtx.translate(-_object.rotatePoint.x, -_object.rotatePoint.y);
		}


		var w = _object.special.width,
			h = _object.special.height;
		if (!!showImage) {
			w = !!_object.special.width ? _object.special.width : showImage.width,
				h = !!_object.special.height ? _object.special.height : showImage.height;
			var proto = {
				sPosition: _object.sPosition,
				alpha: _object.alpha,
				special: {
					width: w,
					height: h
				}
			};
			this.renderDrawImage(showImage, proto);
		}
		var overflow = _object.overflow == "hidden" ? "hidden" : (_object.overflow == "inherit" ? MYAIDE.Math.getOverflow(_object) : "visible");
		if (overflow == "hidden") {
			bufferCtx.beginPath();
			bufferCtx.rect(0, 0, w, h);
			bufferCtx.clip();
		}


	},
	renderDrawObject: function (_object) {
		if (_object.visible) {
			this.backBufferCtx.save();
			this.renderDrawImageObject(_object, _object.background);

			if (_object.children.length > 0) {
				for (var i = 0, len = _object.children.length; i < len; i++) {
					this.renderDraw(_object.children[i]);
				}
			}

			this.backBufferCtx.restore();
		}
	},
	renderDrawButton: function (_btnElm) {
		if (_btnElm.visible) {
			this.backBufferCtx.save();

			if (_btnElm.choiceSwitch && _btnElm.choiceStatus) {
				_btnElm.showImg = _btnElm.choiceImg;
			} else {
				if (_btnElm.status == "up") {
					_btnElm.showImg = _btnElm.upImg;
				} else
					if (_btnElm.status == "down") {
						_btnElm.showImg = _btnElm.downImg;
					} else
						if (_btnElm.status == "move") {
							_btnElm.showImg = _btnElm.moveImg;
						} else
							if (_btnElm.status == "disable") {
								_btnElm.showImg = _btnElm.disableImg;
							}
			}

			this.renderDrawImageObject(_btnElm, _btnElm.showImg);

			if (_btnElm.children.length > 0) {
				for (var i = 0, len = _btnElm.children.length; i < len; i++) {
					this.renderDraw(_btnElm.children[i]);
				}
			}
			this.backBufferCtx.restore();
		}
	},
	renderDrawAnimation: function (_animation) {
		if (_animation.visible) {
			if (!_animation.pause) {
				_animation.spins.call(_animation);
			}

			this.backBufferCtx.save();

			var showFrame = _animation.frameArray[_animation.currentFrame];

			this.renderDrawImageObject(_animation, showFrame);

			if (_animation.children.length > 0) {
				for (var i = 0, len = _animation.children.length; i < len; i++) {
					this.renderDraw(_animation.children[i]);
				}
			}

			this.backBufferCtx.restore();
		}
	},
	renderDrawAnyAnimation: function (_anyAnimation) {
		if (_anyAnimation.visible) {
			if (!_anyAnimation.pause) {
				_anyAnimation.spins.call(_anyAnimation);
			}

			this.backBufferCtx.save();

			var showFrame = _anyAnimation.frameArray[_anyAnimation.currentFrameIndex][_anyAnimation.currentFrame];
			this.renderDrawImageObject(_anyAnimation, showFrame);

			if (_anyAnimation.children.length > 0) {
				for (var i = 0, len = _anyAnimation.children.length; i < len; i++) {
					this.renderDraw(_anyAnimation.children[i]);
				}
			}

			this.backBufferCtx.restore();
		}
	},
	renderDrawSameGrapAnimation: function (_animation) {
		if (_animation.visible) {
			var bufferCtx = this.backBufferCtx;
			if (!_animation.pause) {
				_animation.spins.call(_animation);
			}

			bufferCtx.save();

			bufferCtx.transform(_animation.scale.x, 0, 0, _animation.scale.y, _animation.position.x, _animation.position.y);
			bufferCtx.globalAlpha *= _animation.alpha;
			var w = !!_animation.special.width ? _animation.special.width : showFrame.width,
				h = !!_animation.special.height ? _animation.special.height : showFrame.height;
			var overflow = _animation.overflow == "hidden" ? "hidden" : (_animation.overflow == "inherit" ? MYAIDE.Math.getOverflow(_animation) : "visible");
			if (overflow == "hidden") {
				bufferCtx.beginPath();
				bufferCtx.rect(0, 0, w, h);
				bufferCtx.clip();
			}
			if (_animation.rotate != 0) {
				bufferCtx.translate(_animation.rotatePoint.x, _animation.rotatePoint.y);
				bufferCtx.rotate(_animation.rotate * Math.PI / 180);
				bufferCtx.translate(-_animation.rotatePoint.x, -_animation.rotatePoint.y);
			}

			var drawPosition = {
				x: _animation.positionStatic.x + _animation.currentFrame % _animation.column * _animation.positionInterval.x,
				y: _animation.positionStatic.y + parseInt(_animation.currentFrame / _animation.column) * _animation.positionInterval.y
			};

			var proto = {
				alpha: _animation.alpha,
				sPosition: drawPosition,
				special: {
					width: w,
					height: h
				}
			};
			this.renderDrawImage(_animation.frameImg, proto);

			if (_animation.children.length > 0) {
				for (var i = 0, len = _animation.children.length; i < len; i++) {
					this.renderDraw(_animation.children[i]);
				}
			}

			bufferCtx.restore();
		}
	},
	renderDrawText: function (_text) {
		if (_text.visible) {
			var bufferCtx = this.backBufferCtx;
			bufferCtx.save();
			bufferCtx.transform(_text.scale.x, 0, 0, _text.scale.y, _text.position.x, _text.position.y);
			bufferCtx.globalAlpha *= _text.alpha;
			var width = !!_text.wordWrap ? _text.Width : _text.special.width;
			var height = !!_text.special.height ? _text.lineHeight : 18;
			var lineWidth = !!_text.special.lineWidth ? _text.lineWidth : 1;
			var position = { x: 0, y: height };
			if (_text.wordWrap) {
				position.x = _text.textAlign == "left" ? 0 : (_text.textAlign == "center" ? width / 2 : width);
			}

			if (_text.rotate != 0) {
				bufferCtx.translate(_text.rotatePoint.x, _text.rotatePoint.y);
				bufferCtx.rotate(_text.rotate * Math.PI / 180);
				bufferCtx.translate(-_text.rotatePoint.x, -_text.rotatePoint.y);
			}
			var proto = {
				txt: _text.textStr,
				position: position,
				alpha: _text.alpha,
				special: { width: width, height: height },
				textAlign: _text.textAlign,
				font: _text.font,
				lineWidth: lineWidth,
				font: _text.font,
				fontSize: _text.fontSize,
				fontFamily: _text.fontFamily,
				fillStyle: _text.fillStyle,
				strokeStyle: _text.strokeStyle,
				fillType: _text.fillType,
				shadow: _text.shadow,
				shadowColor: _text.shadowColor,
				shadowOffsetX: _text.shadowOffsetX,
				shadowOffsetY: _text.shadowOffsetY,
				shadowBlur: _text.shadowBlur
			};

			if (_text.textStr != null) {
				var hiddenHeight = height, hiddenWidth = width;
				if (_text.wordWrap) {
					var count = _text.indent == false ? 0 : 4;
					number = parseInt(_text.lineWidth / _text.fontSize) * 2;
					var txtLength = _text.textStr.length,
						txtArray = _text.textStr.split("");
					hiddenWidth = _text.lineWidth;
					var text = "", line = 0;
					for (var i = 0; i <= txtLength; i++) {
						if (count >= number) {
							if (line == 0 && _text.indent) {
								proto.position = { x: position.x + 2 * _text.fontSize, y: proto.position.y };

							} else {
								proto.position = { x: position.x, y: proto.position.y };
							}
							proto.txt = text;
							this.renderDrawTextFunc(proto);
							proto.position.y = proto.position.y + _text.lineHeight;
							text = "";
							count = 0;
							line++;
						}
						if (i == txtLength) {
							proto.txt = text;
							if (line == 0 && _text.indent) {
								proto.position = { x: position.x + 2 * _text.fontSize, y: proto.position.y };

							} else {
								proto.position = { x: position.x, y: proto.position.y };
							}
							this.renderDrawTextFunc(proto);
							break;
						}
						var str = txtArray[0];
						var text = text + str;
						count += MYAIDE.Math.getTrueLength(str);
						txtArray.shift();
					}
					hiddenHeight = line * _text.lineHeight + (line + 1) * height;
				} else {
					this.renderDrawTextFunc(proto);
				}
				var overflow = _text.overflow == "hidden" ? "hidden" : (_text.overflow == "inherit" ? MYAIDE.Math.getOverflow(_text) : "visible");
				if (overflow == "hidden") {
					bufferCtx.beginPath();
					bufferCtx.rect(0, 0, hiddenWidth, hiddenHeight);
					bufferCtx.clip();
				}
			}

			if (_text.children.length > 0) {
				for (var i = 0, len = _text.children.length; i < len; i++) {
					this.renderDraw(_text.children[i]);
				}
			}
			bufferCtx.restore();
		}
	},
	renderDrawImage: function (_img, _parameters) {
		var bufferCtx = this.backBufferCtx;
		bufferCtx.save();
		var parameters = _parameters || {};
		var position = parameters.position !== undefined ? parameters.position : { x: 0, y: 0 },
			sPosition = parameters.sPosition !== undefined ? parameters.sPosition : { x: 0, y: 0 },
			alpha = parameters.alpha !== undefined ? parameters.alpha : 1,
			special = parameters.special !== undefined ? parameters.special : { width: _img.width, height: _img.height },
			showSpecial = parameters.showSpecial !== undefined ? parameters.showSpecial : special,
			rotate = parameters.rotate !== undefined ? parameters.rotate : 0,
			rotatePoint = parameters.rotatePoint !== undefined ? parameters.rotatePoint : position;

		if (rotate != 0) {
			bufferCtx.translate(rotatePoint.x, rotatePoint.y);
			bufferCtx.rotate(rotate * Math.PI / 180);
			bufferCtx.translate(-rotatePoint.x, -rotatePoint.y);
		}
		if (sPosition.x != 0 || sPosition.y != 0) {
			sPosition.x < 0 ? sPosition.x = 0 : "";
			sPosition.y < 0 ? sPosition.y = 0 : "";
			special.width = special.width == _img.width ? _img.width - sPosition.x : special.width;
			special.height = special.height == _img.height ? _img.height - sPosition.y : special.height;
		}
		bufferCtx.drawImage(_img, sPosition.x, sPosition.y, special.width, special.height, position.x, position.y, showSpecial.width, showSpecial.height);
		bufferCtx.restore();
	},
	renderDrawTextFunc: function (_parameters) {
		var bufferCtx = this.backBufferCtx;
		bufferCtx.save();
		var parameters = _parameters || {};
		var position = parameters.position !== undefined ? parameters.position : { x: 0, y: 0 },
			alpha = parameters.alpha !== undefined ? parameters.alpha : 1,
			rotate = parameters.rotate !== undefined ? parameters.rotate : 0,
			rotatePoint = parameters.rotatePoint !== undefined ? parameters.rotatePoint : position,
			special = parameters.special !== undefined ? parameters.special : { width: 100, height: 100 },
			textStr = parameters.txt !== undefined ? parameters.txt : "",
			textAlign = parameters.textAlign !== undefined ? parameters.textAlign : "left",
			font = parameters.font !== undefined ? parameters.font : null,
			lineWidth = parameters.lineWidth !== undefined ? parameters.lineWidth : 1,
			fontSize = parameters.fontSize !== undefined ? parameters.fontSize : 18,
			fontFamily = parameters.fontFamily !== undefined ? parameters.fontFamily : "Arial",
			fillStyle = parameters.fillStyle !== undefined ? parameters.fillStyle : "#000",
			strokeStyle = parameters.strokeStyle !== undefined ? parameters.strokeStyle : fillStyle,
			fillType = parameters.fillType !== undefined ? parameters.fillType : "fillText",
			shadow = parameters.shadow !== undefined ? parameters.shadow : false,
			shadowColor = parameters.shadowColor !== undefined ? parameters.shadowColor : "#000",
			shadowOffsetX = parameters.shadowOffsetX !== undefined ? parameters.shadowOffsetX : 0,
			shadowOffsetY = parameters.shadowOffsetY !== undefined ? parameters.shadowOffsetY : 0,
			shadowBlur = parameters.shadowBlur !== undefined ? parameters.shadowBlur : 0,
			textBaseline = parameters.textBaseline !== undefined ? parameters.textBaseline : "alphabetic";

		if (!!!textStr) {
			bufferCtx.restore();
			return;
		}

		bufferCtx.lineWidth = lineWidth;
		bufferCtx.textBaseline = textBaseline;
		bufferCtx.font = fontSize + "px " + fontFamily;
		if (font) {
			bufferCtx.font = font;
		}
		bufferCtx.fillStyle = fillStyle;
		bufferCtx.strokeStyle = strokeStyle;
		bufferCtx.textAlign = textAlign;
		if (shadow) {
			bufferCtx.shadowColor = shadowColor;
			bufferCtx.shadowOffsetX = shadowOffsetX;
			bufferCtx.shadowOffsetY = shadowOffsetY;
			bufferCtx.shadowBlur = shadowBlur;
		}

		if (fillType == "fillText") {
			bufferCtx.fillText(textStr, position.x, position.y, special.width);
		} else {
			bufferCtx.strokeText(textStr, position.x, position.y, special.width);
		}


		bufferCtx.restore();
	},
	drawLines: function (_parameters) {
		var bufferCtx = this.backBufferCtx;
		bufferCtx.save();
		var parameters = _parameters || {};

		var alpha = parameters.alpha !== undefined ? parameters.alpha : 1,
			rotate = parameters.rotate !== undefined ? parameters.rotate : 0,
			rotatePoint = parameters.rotatePoint !== undefined ? parameters.rotatePoint : { x: 0, y: 0 },
			strokeStyle = parameters.strokeStyle !== undefined ? parameters.strokeStyle : "#000",
			lineCap = parameters.lineCap !== undefined ? parameters.lineCap : "butt",
			lineWidth = parameters.lineWidth !== undefined ? parameters.lineWidth : 1,
			fillStatus = parameters.fillStatus !== undefined ? parameters.fillStatus : false,
			fillStyle = parameters.fillStyle !== undefined ? parameters.fillStyle : "#000",
			closeStatus = parameters.closeStatus !== undefined ? parameters.closeStatus : true,
			graphVertexs = parameters.graphVertexs !== undefined ? parameters.graphVertexs : [],
			strokeStatus = parameters.strokeStatus !== undefined ? parameters.strokeStatus : true;
		lineDash = parameters.lineDash !== undefined ? parameters.lineDash : [],
			shadow = parameters.shadow !== undefined ? parameters.shadow : true,
			shadowColor = parameters.shadowColor !== undefined ? parameters.shadowColor : "#000",
			shadowOffsetX = parameters.shadowOffsetX !== undefined ? parameters.shadowOffsetX : 0,
			shadowOffsetY = parameters.shadowOffsetY !== undefined ? parameters.shadowOffsetY : 0,
			shadowBlur = parameters.shadowBlur !== undefined ? parameters.shadowBlur : 0,
			globalCompositeOperation = parameters.globalCompositeOperation !== undefined ? parameters.globalCompositeOperation : "source-over";

		if (shadow) {
			bufferCtx.shadowColor = shadowColor;
			bufferCtx.shadowOffsetX = shadowOffsetX;
			bufferCtx.shadowOffsetY = shadowOffsetY;
			bufferCtx.shadowBlur = shadowBlur;
		}
		bufferCtx.lineCap = lineCap;
		bufferCtx.lineWidth = lineWidth;
		bufferCtx.globalCompositeOperation = globalCompositeOperation;

		bufferCtx.beginPath();
		if (lineDash.length > 0) bufferCtx.setLineDash(lineDash);
		for (var i = 0, len = graphVertexs.length; i < len; i++) {
			if (i > 0) {
				bufferCtx.lineTo(graphVertexs[i][0] - 0.5, graphVertexs[i][1] - 0.5);
			} else {
				bufferCtx.moveTo(graphVertexs[i][0] - 0.5, graphVertexs[i][1] - 0.5);
			}
		}
		if (closeStatus) {
			bufferCtx.closePath();
		}
		if (fillStatus) {
			bufferCtx.fillStyle = fillStyle;
			bufferCtx.fill();
		}
		if (strokeStatus) {
			bufferCtx.strokeStyle = strokeStyle;
			bufferCtx.stroke();
		}


		bufferCtx.restore();

	},


	drawPoints: function (_parameters) {
		var bufferCtx = this.backBufferCtx;
		bufferCtx.save();
		var parameters = _parameters || {};

		var alpha = parameters.alpha !== undefined ? parameters.alpha : 1,
			rotate = parameters.rotate !== undefined ? parameters.rotate : 0,
			rotatePoint = parameters.rotatePoint !== undefined ? parameters.rotatePoint : position,
			strokeStyle = parameters.strokeStyle !== undefined ? parameters.strokeStyle : "#000",
			lineCap = parameters.lineCap !== undefined ? parameters.lineCap : "butt",
			lineWidth = parameters.lineWidth !== undefined ? parameters.lineWidth : 1,
			fillStatus = parameters.fillStatus !== undefined ? parameters.fillStatus : false,
			fillStyle = parameters.fillStyle !== undefined ? parameters.fillStyle : "#000",
			closeStatus = parameters.closeStatus !== undefined ? parameters.closeStatus : true,
			graphVertexs = parameters.graphVertexs !== undefined ? parameters.graphVertexs : [],
			shadow = parameters.shadow !== undefined ? parameters.shadow : true,
			shadowColor = parameters.shadowColor !== undefined ? parameters.shadowColor : "#000",
			shadowOffsetX = parameters.shadowOffsetX !== undefined ? parameters.shadowOffsetX : 0,
			shadowOffsetY = parameters.shadowOffsetY !== undefined ? parameters.shadowOffsetY : 0,
			shadowBlur = parameters.shadowBlur !== undefined ? parameters.shadowBlur : 0,
			strokeStatus = parameters.strokeStatus !== undefined ? parameters.strokeStatus : true;

		if (shadow) {
			bufferCtx.shadowColor = shadowColor;
			bufferCtx.shadowOffsetX = shadowOffsetX;
			bufferCtx.shadowOffsetY = shadowOffsetY;
			bufferCtx.shadowBlur = shadowBlur;
		}
		bufferCtx.lineCap = lineCap;
		bufferCtx.lineWidth = lineWidth;
		if (rotate != 0) {
			bufferCtx.translate(rotatePoint.x, rotatePoint.y);
			bufferCtx.rotate(rotate * Math.PI / 180);
			bufferCtx.translate(-rotatePoint.x, -rotatePoint.y);
		}

		bufferCtx.beginPath();
		for (var i = 0, len = graphVertexs.length; i < len; i++) {
			if (i > 0) {
				bufferCtx.lineTo(graphVertexs[i][0] - 0.5, graphVertexs[i][1] - 0.5);
			} else {
				bufferCtx.moveTo(graphVertexs[i][0] - 0.5, graphVertexs[i][1] - 0.5);
			}
		}
		if (closeStatus) {
			bufferCtx.closePath();
		}
		if (fillStatus) {
			this.fillStyle = fillStyle;
			bufferCtx.fill();
		}
		if (strokeStatus) {
			bufferCtx.strokeStyle = strokeStyle;
			bufferCtx.stroke();
		}


		bufferCtx.restore();
	}
};

MYAIDE.DeviceListener = {
	listener: {},
	hisAlpha: null,
	turnThreshold: 1,
	tiltThreshold: 1,
	shakeThreshold: 2000,
	timer: 0,
	hisAcceleration: { x: 0, y: 0, z: 0 },
	start: function () {
		window.addEventListener('deviceorientation', this.handleOrientation);
		window.addEventListener("devicemotion", this.handleMotion);

	},
	finish: function () {
		window.removeEventListener('deviceorientation', this.handleOrientation);
		window.removeEventListener("devicemotion", this.handleMotion);
	},
	addListener: function (eventType, fnHandler) {
		if (typeof fnHandler !== "function") {
			console.error("MYAIDE.EventListener.addListener parameter fnHandler must a function.");
			return;
		}
		if (this.listener === undefined)
			this.listener = {};
		if (this.listener[eventType] === undefined) {
			this.listener[eventType] = [];
		}
		if (this.listener[eventType].indexOf(fnHandler) === -1) {
			this.listener[eventType].push(fnHandler);
		}
	},
	removeListener: function (eventType, fnHandler) {
		if (this.listener === undefined) return;
		var listenerArray = this.listener[eventType];
		if (listenerArray !== undefined) {
			var index = listenerArray.indexOf(fnHandler);
			if (index !== -1) {
				listenerArray.splice(index, 1);
			}
		}
	},
	touchListener: function (_type, _arr) {
		var type = _type;
		var listenerArray = this.listener[type];
		if (listenerArray !== undefined) {
			for (var i = 0, len = listenerArray.length; i < len; i++) {
				listenerArray[i].apply(this, _arr);
			}
		}
	},
	hasListener: function (eventType, fnHandler) {
		if (this.listener === undefined)
			return false;
		if (this.listener[eventType] !== undefined && this.listener[eventType].indexOf(fnHandler) !== - 1) {
			return true;
		}
		return false;
	},
	handleOrientation: function (event) {
		var absolute = event.absolute,
			alpha = event.alpha,
			beta = event.beta,
			gamma = event.gamma;
		var orientation = window.orientation ? window.orientation : 0;
		var self = MYAIDE.DeviceListener;
		self.touchListener("deviceorientation", [event]);
		if (!isNaN(beta) && !isNaN(gamma)) {
			var sx, sy, nx, ny;
			if (beta > 0) {
				sy = beta > 90 ? 180 - beta : beta;
			} else {
				sy = beta < -90 ? -180 - beta : beta;
			}
			sx = gamma;
			switch (orientation) {
				case 0:
					nx = sx;
					ny = sy;
					break;
				case 90:
					nx = sy;
					ny = -sx;
					break;
				case 180:
					nx = -sx;
					ny = -sy;
					break;
				case -90:
					nx = -sy;
					ny = sx;
					break;
			}
			var argumentArr = [event, nx, ny];
			if (Math.abs(nx) > self.tiltThreshold || Math.abs(ny) > self.tiltThreshold) {
				self.touchListener("tilt", argumentArr);
			}
			if (nx > 0) {
				self.touchListener("righttilt", argumentArr);
			} else {
				self.touchListener("lefttilt", argumentArr);
			}
			if (ny > 0) {
				self.touchListener("downtilt", argumentArr);
			} else {
				self.touchListener("uptilt", argumentArr);
			}
		}
		if (!isNaN(alpha)) {
			if (self.hisAlpha == null) {
				self.hisAlpha = alpha;
			} else {
				var difAlpha = alpha - self.hisAlpha;
				var turnArgument = [event, alpha, difAlpha];
				if (Math.abs(difAlpha) > self.turnThreshold) {
					if (difAlpha > 0) {
						self.touchListener("ccwturn", turnArgument);
						self.touchListener("turn", turnArgument);
					} else
						if (difAlpha < 0) {
							self.touchListener("cwturn", turnArgument);
							self.touchListener("turn", turnArgument);
						}
					self.hisAlpha = alpha;
				}
			}
		}

	},
	handleMotion: function (event) {
		var self = MYAIDE.DeviceListener;
		var curTime = new Date().getTime();
		self.touchListener("devicemotion", [event]);
		if ((curTime - self.timer) > 100) {
			var acceleration = event.accelerationIncludingGravity;
			var difTime = curTime - self.timer;
			var speed = Math.abs(acceleration.x + acceleration.y + acceleration.z - self.hisAcceleration.x - self.hisAcceleration.y - self.hisAcceleration.z) / difTime * 10000;
			self.hisAcceleration.x = acceleration.x;
			self.hisAcceleration.y = acceleration.y;
			self.hisAcceleration.z = acceleration.z;
			if (speed > self.shakeThreshold) {
				self.touchListener("shake", [event, self.hisAcceleration]);
			}
			self.timer = curTime;
		}
	}
};
MYAIDE.EventSimulator = {
	event: { target: null, type: null, bubbles: true, cancelable: true, view: document.defaultView, detail: 0, screenX: 0, screenY: 0, clientX: 0, clientY: 0, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, relatedTarget: null },
	keyboard: { target: window, type: "keydown", bubbles: true, cancelable: true, view: document.defaultView, key: null, location: 1, modifiers: "", repeat: 0 },
	dispatchEvent: function (_parameters) {
		var self = this;
		var parameters = _parameters || {};
		var nEvent = Object.assign(self.event, parameters);
		if (nEvent.target != null) {
			var event = document.createEvent("MouseEvent");
			event.initMouseEvent(nEvent.type, nEvent.bubbles, nEvent.cancelable, nEvent.view, nEvent.detail, nEvent.screenX, nEvent.screenY, nEvent.clientX, nEvent.clientY, nEvent.ctrlKey, nEvent.altKey, nEvent.shiftKey, nEvent.shiftKey, nEvent.button, nEvent.relatedTarget);
			nEvent.target.dispatchEvent(event);
		}
	},
	dispatchKeyboard: function (_parameters) {
		var self = this;
		var parameters = _parameters || {};
		var nKeyboard = Object.assign(self.keyboard, parameters);
		if (document.implementation.hasFeature("KeyboardEvents", "3.0")) {
			var event = document.createEvent("KeyboardEvent");
			event.initKeyboardEvent(nKeyboard.type, nKeyboard.bubbles, nKeyboard.cancelable, nKeyboard.view, nKeyboard.key, nKeyboard.location, nKeyboard.modifiers, nKeyboard.repeat);
			nKeyboard.target.dispatchEvent(event);
		}
	}
};
MYAIDE.MouseEvent = {
	addEvent: function (_target, eventType, fnHandler, useCapture) {
		useCapture == undefined ? useCapture = true : "";
		var oEventType = null;
		if (MYAIDE.OSInfo.msPointerable) {
			switch (eventType) {
				case "mousedown":
					eventType = "MSPointerDown";
					break;
				case "mousemove":
					eventType = "MSPointerMove";
					break;
				case "mouseup":
					eventType = "MSPointerUp";
					break;
				case "mouseover":
					eventType = "MSPointerOver";
					break;
				case "mouseout":
					eventType = "MSPointerOut";
					break;
			}
		} else if (MYAIDE.OSInfo.touchable) {
			switch (eventType) {
				case "mousedown":
					eventType = "touchstart";
					break;
				case "mousemove":
					eventType = "touchmove";
					break;
				case "mouseup":
					eventType = "touchend";
					break;
				case "mouseover":
					eventType = "";
					break;
				case "mouseout":
					eventType = "";
					break;
			}
		}
		if (MYAIDE.OSInfo.isSurface) {
			switch (eventType) {
				case "mousedown":
					oEventType = "touchstart";
					break;
				case "mousemove":
					oEventType = "touchmove";
					break;
				case "mouseup":
					oEventType = "touchend";
					break;
				case "mouseover":
					oEventType = "";
					break;
				case "mouseout":
					oEventType = "";
					break;
			}
		}
		if (eventType == "") {
			return;
		}
		if (_target.addEventListener) {
			_target.addEventListener(eventType, fnHandler, useCapture);
		} else if (_target.attachEvent) {
			_target.attachEvent("on" + eventType, fnHandler);
		} else {
			_target["on" + eventType] = fnHandler;
		}
		if (!!oEventType) {
			if (_target.addEventListener) {
				_target.addEventListener(oEventType, fnHandler, useCapture);
			} else if (_target.attachEvent) {
				_target.attachEvent("on" + oEventType, fnHandler);
			} else {
				_target["on" + oEventType] = fnHandler;
			}
		}
	},
	removeEvent: function (_target, eventType, fnHandler, useCapture) {
		useCapture == undefined ? useCapture = true : "";
		var oEventType = null;
		if (MYAIDE.OSInfo.msPointerable) {
			switch (eventType) {
				case "mousedown":
					eventType = "MSPointerDown";
					break;
				case "mousemove":
					eventType = "MSPointerMove";
					break;
				case "mouseup":
					eventType = "MSPointerUp";
					break;
				case "mouseover":
					eventType = "MSPointerOver";
					break;
				case "mouseout":
					eventType = "MSPointerOut";
					break;
			}
		} else if (MYAIDE.OSInfo.touchable) {
			switch (eventType) {
				case "mousedown":
					eventType = "touchstart";
					break;
				case "mousemove":
					eventType = "touchmove";
					break;
				case "mouseup":
					eventType = "touchend";
					break;
				case "mouseover":
					eventType = "";
					break;
				case "mouseout":
					eventType = "";
					break;
			}
		}
		if (MYAIDE.OSInfo.isSurface) {
			switch (eventType) {
				case "mousedown":
					oEventType = "touchstart";
					break;
				case "mousemove":
					oEventType = "touchmove";
					break;
				case "mouseup":
					oEventType = "touchend";
					break;
				case "mouseover":
					oEventType = "";
					break;
				case "mouseout":
					oEventType = "";
					break;
			}
		}

		if (_target.removeEventListener) {
			_target.removeEventListener(eventType, fnHandler, useCapture);
		} else if (_target.detachEvent) {
			_target.detachEvent("on" + eventType, fnHandler);
		} else {
			_target["on" + eventType] = null;
		}
		if (!!oEventType) {
			if (_target.removeEventListener) {
				_target.removeEventListener(oEventType, fnHandler, useCapture);
			} else if (_target.detachEvent) {
				_target.detachEvent("on" + oEventType, fnHandler);
			} else {
				_target["on" + oEventType] = null;
			}
		}
	},
	getEvent: function (_target) {
		console.warn("暂时不支持事件查询");
		return;
		if (window.event) {
			return _target.formatEvent(window.event);
		} else {
			return _target.getEvent.caller.arguments[0]
		}
	}
};
MYAIDE.EventListener = function () { };
Object.assign(MYAIDE.EventListener.prototype, {
	addListener: function (type, _func, _useCapture) {
		if (typeof _func !== "function") {
			console.error("MYAIDE.EventListener.addListener parameter _func must a function.");
			return;
		}
		var useCapture = _useCapture !== undefined ? _useCapture : true;
		var listener;
		if (useCapture) {
			if (this.captureListener === undefined) {
				this.captureListener = {};
			}
			listener = this.captureListener;
		} else {
			if (this.bubblesListener === undefined) {
				this.bubblesListener = {};
			}
			listener = this.bubblesListener;
		}
		if (listener[type] === undefined) {
			listener[type] = [];
		}
		if (listener[type].indexOf(_func) === -1) {
			listener[type].push(_func);
		}
	},
	removeListener: function (type, _func, _useCapture) {
		var useCapture = _useCapture !== undefined ? _useCapture : true;
		var listener;
		if (useCapture) {
			if (this.captureListener === undefined) {
				return;
			}
			listener = this.captureListener;
		} else {
			if (this.bubblesListener === undefined) {
				return;
			}
			listener = this.bubblesListener;
		}

		var listenerArray = listener[type];
		if (listenerArray !== undefined) {
			var index = listenerArray.indexOf(_func);
			if (index !== -1) {
				listenerArray.splice(index, 1);
			}
		}
	},
	hasListener: function (type, _func, _useCapture) {
		var useCapture = _useCapture !== undefined ? _useCapture : true;
		var listener = useCapture ? this.captureListener : this.bubblesListener;

		if (listener === undefined)
			return false;

		if (listener[type] !== undefined && listener[type].indexOf(_func) !== - 1) {
			return true;
		}

		return false;
	}
});

MYAIDE.Signal = function () {
	this.active = true;
	this.disableList = [];
};
MYAIDE.Signal.prototype = {
	constructor: MYAIDE.Signal,
	_registerListener: function (type, _func) {
		if (this.listener === undefined)
			this.listener = {};

		if (this.listener[type] === undefined) {
			this.listener[type] = [];
		}

		if (this.listener[type].indexOf(_func) === -1) {
			this.listener[type].push(_func);
		}
	},
	_removeListener: function (type, _func) {
		if (this.listener === undefined) return;
		var listenerArray = this.listener[type];
		if (listenerArray !== undefined) {
			var index = listenerArray.indexOf(_func);
			if (index !== -1) {
				listenerArray.splice(index, 1);
			}
		}
	},
	add: function (_type, listener) {
		if (_type === undefined) {
			throw new Error("MYAIDE.Signal.add:_type is undefined.");
			return;
		}
		if (typeof listener !== "function") {
			throw new Error("MYAIDE.Signal.add:listener is not function. ");
			return;
		}
		this._registerListener(_type, listener);
	},
	remove: function (_type, listener) {
		if (_type === undefined) {
			throw new Error("MYAIDE.Signal.remove:_type is undefined.");
			return;
		}
		if (typeof listener !== "function") {
			throw new Error("listener is not function. ");
			return;
		}
		this._removeListener(type, listener);
	},
	publish: function (_type) {
		if (_type === undefined) {
			throw new Error("MYAIDE.Signal.publish:_type is undefined.");
			return;
		}
		if (!this.active || this.disableList.indexOf(_type) > -1) return;
		var param = [];
		if (arguments.length > 1) {
			for (var i = 1, p; p = arguments[i++];) {
				param.push(p);
			}
		}
		var listenerArray = this.listener[_type];
		if (listenerArray !== undefined) {
			listenerArray.forEach(function (listener) {
				listener.apply(this, param);
			});
		}
	},
	disable: function () {
		if (arguments.length < 1) return;
		for (var i = 0, o; o = arguments[i++];) {
			this.disableList.push(o);
		}
	},
	enable: function () {
		if (arguments.length < 1) return;
		for (var i = 0; i < arguments.length; i++) {
			var o = arguments[i],
				index = this.disableList.indexOf(o);
			if (index > -1) {
				this.disableList.splice(index, 1);
			}
		}
	}
};
MYAIDE.Resizer = {
	targetList: [],
	osTarget: -1,
	pause: false,
	init: function () {
		window.addEventListener("resize", this.sizeFunc);
	},
	add: function (elm, _isOs) {
		var isOs = _isOs !== undefined ? _isOs : false;
		var obj = {
			elm: elm,
			width: elm.offsetWidth,
			height: elm.offsetHeight,
			left: elm.offsetLeft,
			top: elm.offsetTop
		};
		this.targetList.push(obj);
		if (isOs) {
			this.osTarget = this.targetList.length - 1;
		}
		this.sizeFunc();
		setTimeout(this.sizeFunc, 100);
	},
	remove: function (elm) {
		for (var i = 0; i < this.targetList.length; i++) {
			var obj = this.targetList[i];
			if (obj.elm == elm) {
				this.targetList.splice(i, 1);
				this.osTarget = this.osTarget == i ? -1 : (this.osTarget > i ? this.osTarget - 1 : this.osTarget);
			}
		}
	},
	sizeFunc: function () {
		var self = MYAIDE.Resizer;
		if (!self.pause) {
			for (var i = 0; i < self.targetList.length; i++) {
				var obj = self.targetList[i];
				var data = self.contralSize(obj.elm, obj.width, obj.height);
				MYAIDE.Labeler.setTransform(obj.elm, "scale(" + data.scale + ")");
				obj.elm.style.left = data.left + "px";
				obj.elm.style.top = data.top + "px";
				if (i == self.osTarget) {
					MYAIDE.WorkInfo.scale = data.scale;
				}
			}
		}
	},
	contralSize: function (obj, fw, fh) {
		var result = { scale: 1, left: 0, top: 0 };
		var parent = obj.parentElement || document.body;
		var pWidth = parent.offsetWidth, pHeight = parent.offsetHeight;
		if (parent == document.body) {
			if (window.innerWidth) pWidth = window.innerWidth; else if ((document.body) && (document.body.clientWidth)) pWidth = document.body.clientWidth;
			if (window.innerHeight) pHeight = window.innerHeight; else if ((document.body) && (document.body.clientHeight)) pHeight = document.body.clientHeight;
		}
		var scaleX = pWidth / fw,
			scaleY = pHeight / fh;
		result.scale = scaleX < scaleY ? scaleX : scaleY;
		result.left = (pWidth - fw) / 2,
			result.top = result.scale * fh / 2 - fh / 2;
		return result;
	}
}

MYAIDE.Pointer = function (_target, _render) {
	var self = this;
	this.target = _target || document.body;
	this.medoData = "canvas|static";
	this.medo = "canvas";
	this.cursor = "default";
	this.superCursorStatus = false;
	this.superCursor = "default";
	this.cursorStatus = false;
	this.pX = 0;
	this.pY = 0;
	this.historyMouse = [0, 0];
	this.targetRender = _render !== undefined ? _render : null;
	this.propagation = true;
	this.mouseListener = {};
	this.matrix2 = new MYAIDE.Matrix2();
	this.matrix3 = new MYAIDE.Matrix3();
	this.eventMatrixStack = [];
	this.eventMouseList = [];
	this.eventListHistory = [];
	this.eventRotateMatrix = new MYAIDE.Matrix3();
	this.initPointer = function () {
		MYAIDE.MouseEvent.addEvent(this.target, "mousemove", this.canvasMouseMoveFunc, false);
		MYAIDE.MouseEvent.addEvent(this.target, "mousedown", this.canvasMouseDownFunc, false);
		MYAIDE.MouseEvent.addEvent(this.target, "mouseup", this.canvasMouseUpFunc, false);

	};
};
MYAIDE.Pointer.prototype = {
	constructor: MYAIDE.Pointer,
	setSuperCursor: function (_type) {
		this.superCursorStatus = true;
		this.superCursor = _type;
	},
	removeSuperCursor: function () {
		this.superCursorStatus = false;
	},
	setCursor: function (_type) {
		if (this.superCursorStatus) {
			this.cursor = this.superCursor;
		} else {
			this.cursor = _type;
		}
		this.target.style.cursor = this.cursor;
	},
	updateOffset: function () {
		MYAIDE.WorkInfo.canvasLeft = MYAIDE.Math.getPageX(this.target) + MYAIDE.WorkInfo.pWidth / 2 * (1 - MYAIDE.WorkInfo.scale);
		MYAIDE.WorkInfo.canvasTop = MYAIDE.Math.getPageY(this.target) + MYAIDE.WorkInfo.pHeight / 2 * (1 - MYAIDE.WorkInfo.scale);
	},
	updataMouse: function (e) {
		var e = e || window.event;
		this.updateOffset();
		var workInfo = MYAIDE.WorkInfo;
		var px, py, cLeft = workInfo.canvasLeft,
			cTop = workInfo.canvasTop;
		if (MYAIDE.OSInfo.isSurface) {
			if (e.pageX) {
				px = e.pageX - cLeft;
				py = e.pageY - cTop;
			} else {
				px = e.touches[0].pageX - cLeft;
				py = e.touches[0].pageY - cTop;
			}
		} else
			if (MYAIDE.OSInfo.touchable) {
				px = e.touches[0].pageX - cLeft;
				py = e.touches[0].pageY - cTop;
			} else {
				px = e.pageX - cLeft;
				py = e.pageY - cTop;
			}
		this.historyMouse[0] = this.pX;
		this.historyMouse[1] = this.pY;
		this.pX = parseInt(px / workInfo.scale);
		this.pY = parseInt(py / workInfo.scale);

	},
	notMove: function () {
		if (this.pX == this.historyMouse[0] && this.pY == this.historyMouse[1]) {
			return true;
		} else {
			return false;
		}
	},
	resetBtnStatus: function () {
		for (var i = 0, len = this.targetRender.sceneElm.length; i < len; i++) {
			this.traverseBtn(this.targetRender.sceneElm[i]);
		}
	},
	traverseBtn: function (_btn) {
		if (_btn.type == "Button") {
			_btn.setStatus("up", false);
		}
		if (_btn.children.length > 0) {
			for (var i = _btn.children.length - 1; i >= 0; i--) {
				this.traverseBtn(_btn.children[i]);
			}
		}
	},
	traverseEventPath: function () {
		var eventList = [];
		this.eventMouseList = [];
		for (var i = this.targetRender.sceneElm.length - 1; i >= 0; i--) {
			this.matrix3.identity();
			this.eventRotateMatrix.identity();
			var reStatus = this.getEventTarget(this.targetRender.sceneElm[i]);
			if (reStatus) break;
		}

		return eventList;
	},
	getEventTarget: function (_scene) {
		this.saveEventStack();
		this.eventMouseList.push(_scene);;
		var status = false;
		if (!_scene.visible || _scene.ghost) {
			this.restoreEventStack();
			this.eventMouseList.pop();
			return status;
		}

		var fx = _scene.position.x * this.matrix3.elements[0],
			fy = _scene.position.y * this.matrix3.elements[4];

		this.eventRotateMatrix.translate(fx, fy);

		this.matrix3.transform(_scene.scale.x, 0, 0, _scene.scale.y, _scene.position.x, _scene.position.y);

		if (_scene.rotate != 0) {
			var spx = _scene.rotatePoint.x * this.matrix3.elements[0],
				spy = _scene.rotatePoint.y * this.matrix3.elements[4];
			this.eventRotateMatrix.translate(spx, spy);
			this.eventRotateMatrix.rotate(_scene.rotate);
			this.eventRotateMatrix.translate(-spx, -spy);
		}

		var x = this.matrix3.elements[2],
			y = this.matrix3.elements[5],
			sx = this.matrix3.elements[0],
			sy = this.matrix3.elements[4];

		var triggerArr = [], nowTrigger = [];
		if (_scene.pathStatus) {
			status = _scene.isPointInPath(this.pX - x, this.pY - y);
			_scene.cacheTrigger = [];
		} else {
			var point = new MYAIDE.Position(this.pX, this.pY);
			if (_scene.triggerStatus) {
				for (var i = 0, len = _scene.trigger.length; i < len; i++) {
					this.matrix2.identity();
					this.matrix2.set(_scene.trigger[i][0], _scene.trigger[i][1]);
					this.matrix2.scale(sx, sy);
					triggerArr.push([this.matrix2.elements[0], this.matrix2.elements[1]]);
				}
			} else {
				var p = _scene.getTriggerSpecial();
				if (p.width == 0 || p.height == 0) {
					triggerArr = [];
				} else {
					var w = p.width * sx,
						h = p.height * sy;
					triggerArr = [[0, 0], [w, 0], [w, h], [0, h]];
				}
			}
			for (var j = 0, len = triggerArr.length; j < len; j++) {
				var np = this.getRotatePoint(triggerArr[j][0], triggerArr[j][1]);
				nowTrigger.push([np[0], np[1]]);
			}

			var pTrigger = _scene.parent == null ? [0] : this.getParentTrigger(_scene.parent);
			if (pTrigger.length == 1 && pTrigger[0] == 0) {

			} else
				if (pTrigger.length == 0) {
					nowTrigger = [];
				} else {
					nowTrigger = MYAIDE.Math.getPolygonClip(pTrigger, nowTrigger);
				}
			_scene.cacheTrigger = nowTrigger;
			status = MYAIDE.Common.PointInPoly(point, nowTrigger);
		}
		if (_scene.children.length > 0) {
			for (var i = _scene.children.length - 1; i >= 0; i--) {
				var cStatus = this.getEventTarget(_scene.children[i]);
				if (cStatus) {
					status = true;
					break;
				}
			}
		}

		this.restoreEventStack();
		if (!status) {
			this.eventMouseList.pop();
		}
		return status;
	},
	getRotatePoint: function (x, y) {
		var arr = this.eventRotateMatrix.elements;

		var a11 = arr[0], a12 = arr[1], a13 = arr[2];
		var a21 = arr[3], a22 = arr[4], a23 = arr[5];

		var a = a11 * x + a12 * y + a13,
			b = a21 * x + a22 * y + a23;

		return [a, b];
	},
	countRotateMatrix: function (tx, ty, _a) {
		var a = MYAIDE.Math.degToRad(_a);
		var c = Math.cos(a),
			s = Math.sin(a);
		var matrix = [c, -s, (1 - c) * tx + ty * s,
			s, c, (1 - c) * ty - tx * s,
			0, 0, 1];
		return matrix;
	},
	saveEventStack: function () {
		var obj = {
			matrix: JSON.stringify(this.matrix3.elements),
			rotateMatrix: JSON.stringify(this.eventRotateMatrix.elements)
		};
		this.eventMatrixStack.push(obj);
	},
	restoreEventStack: function () {
		var obj = this.eventMatrixStack.pop();
		if (obj) {
			this.matrix3.fromArray(JSON.parse(obj.matrix));
			this.eventRotateMatrix.fromArray(JSON.parse(obj.rotateMatrix));
		}
	},
	getParentTrigger: function (ele) {
		if (!ele || ele.parent == null) {
			return [0];
		} else {
			var ofl = ele.overflow;
			if (ofl == "inherit") {
				ofl = MYAIDE.Math.getOverflow(ele.parent);
			}
			if (ofl == "hidden") {
				return ele.cacheTrigger;
			} else {
				return MYAIDE.pointer.getParentTrigger(ele.parent);
			}
		}
	},
	createMouseEvent: function (_type, pathList) {
		var mEvent = {
			status: this.cursorStatus,
			x: this.pX,
			y: this.pY,
			target: pathList[pathList.length - 1],
			path: pathList,
			type: _type
		};
		switch (_type) {
			case "mousedown":
			case "mousemove":
			case "mouseup":
				mEvent.fromElement = null;
				mEvent.toElement = mEvent.target;
				break;
			case "mouseover":
				mEvent.toElement = mEvent.target;
				mEvent.fromElement = this.eventListHistory.length ? this.eventListHistory[this.eventListHistory.length - 1] : undefined;
				break;
			case "mouseout":
				mEvent.fromElement = mEvent.target;
				break;
		}
		return mEvent;
	},
	shuntEvent: function (e, _eventType, _publishType) {
		var eventType = _eventType,
			publishType = _publishType == undefined ? eventType : _publishType;

		var mEvent = this.createMouseEvent(eventType, this.eventMouseList);
		var tEvent = this.createMouseEvent("mouseout", this.eventListHistory);
		var useCursor = eventType == "mousemove" ? true : false;
		if (mEvent.target != tEvent.target) {
			if (this.eventListHistory.length > 0) {
				tEvent.toElement = mEvent.target;
				this.publishEvent(this.eventListHistory, "out", tEvent, e);
			}
			if (this.eventMouseList.length > 0) {
				var oEvent = this.createMouseEvent(eventType, this.eventMouseList);
				this.publishEvent(this.eventMouseList, "over", oEvent, e);
			}
		}
		if (this.eventMouseList.length) this.publishEvent(this.eventMouseList, publishType, mEvent, e, useCursor);
		this.mouseListenerUI(eventType, mEvent, e);
		this.eventListHistory = this.eventMouseList;
	},
	publishEvent: function (list, type, mEvent, mouseEvent, _useCursor) {
		var len = list.length,
			useCursor = _useCursor == undefined ? false : _useCursor;
		this.propagation = true;
		for (var i = 0, j = 0; j >= 0; i++ < len - 1 ? j = i : j--) {
			var n = len - 1 - i;
			if (this.propagation) {
				if (list[j].listenerStatus) list[j].setStatus(type, true, mouseEvent, mEvent, n);
			} else {
				break;
			}
		}
		if (useCursor) {
			var cursor = len > 0 && list[len - 1].listenerStatus ? list[len - 1].mouseEnabled : false;
			if (cursor) {
				this.cursorStatus = true;
				this.setCursor("pointer");
			} else {
				this.cursorStatus = false;
				this.setCursor("auto");
			}
		}
	},
	stopPropagation: function () {
		this.propagation = false;
	},
	canvasMouseMoveFunc: function (e) {
		var e = e || window.event;
		e.preventDefault && e.preventDefault();
		var self = MYAIDE.pointer;
		self.updataMouse(e);
		if (self.notMove()) return;
		self.resetBtnStatus();
		self.traverseEventPath();
		self.shuntEvent(e, "mousemove", "move");
	},
	canvasMouseDownFunc: function (e) {
		var e = e || window.event;
		e.preventDefault && e.preventDefault();
		var self = MYAIDE.pointer;
		self.updataMouse(e);
		self.resetBtnStatus();
		self.traverseEventPath();
		self.shuntEvent(e, "mousedown", "down");
	},
	canvasMouseUpFunc: function (e) {
		var e = e || window.event;
		if (e.preventDefault) e.preventDefault();
		var self = MYAIDE.pointer;
		//self.updataMouse(e);
		self.resetBtnStatus();
		self.traverseEventPath();
		self.shuntEvent(e, "mouseup", "up");
	},
	addMouseListener: function (_type, _func) {
		if (this.mouseListener === undefined) {
			this.mouseListener = {};
		}
		if (this.mouseListener[_type] === undefined) {
			this.mouseListener[_type] = [];
		}
		if (this.mouseListener[_type].indexOf(_func) === -1) {
			this.mouseListener[_type].push(_func);
		}
	},
	removeMouseListener: function (_type, _func) {
		if (this.mouseListener === undefined)
			return;
		var mouseListenerArray = this.mouseListener[_type];
		if (mouseListenerArray !== undefined) {
			var index = mouseListenerArray.indexOf(_func);
			if (index !== -1) {
				mouseListenerArray.splice(index, 1);
			}
		}
	},
	mouseListenerUI: function (_type, data, _e) {
		var type = _type;
		var listenerArray = this.mouseListener[type];
		if (listenerArray !== undefined) {
			for (var i = 0, len = listenerArray.length; i < len; i++) {
				listenerArray[i].call(this, _e, data);
			}
		}
	}

};

MYAIDE.AudioClass = function () {

	this.type = "Audio";

	this.name = "Audio";
	this.uuid = MYAIDE.Math.generateUUID();

	this.audioList = [];
	this.audios = {};
	this.audioAttr = {};

	this.listenLoadList = [];
	this.Interval = null;
	this.listenStatus = false;

	this.staticFunc = function () { };
	this.staticEndFunc = function () { };
	this.endInterval = false;
	this.volume = 0.8;
};
MYAIDE.AudioClass.prototype = {
	constructor: MYAIDE.AudioClass,
	createAudio: function (_options) {
		var self = this;
		if (Array.isArray(_options)) {
			for (var i = 0; i < _options.length; i++) {
				self.createAudio(_options[i]);
			}
			return;
		}
		var name, url;
		if (_options.name === undefined || _options.url === undefined) {
			console.warn("请指定音频的name & url.");
			return;
		}
		name = _options.name;
		if (self.isCheck(name)) return;
		url = _options.url;
		autoPlay = _options.autoPlay !== undefined ? _options.autoPlay : false;
		loops = _options.loops !== undefined ? _options.loops : 1;
		volume = _options.volume !== undefined ? _options.volume : self.volume;

		var n_Audio = new Audio();
		var onloadFunc = _options.onLoad !== undefined ? _options.onLoad : self.staticFunc,
			endedFunc = _options.ended !== undefined ? _options.ended : self.staticEndFunc;
		var progressOption = {
			audio: n_Audio,
			name: name
		};

		this.audioList.push(name);
		this.audios[name] = n_Audio;
		this.audioAttr[name] = {
			currentLoop: 0,
			playLoop: loops,
			status: "stop",
			autoPlay: autoPlay,
			endFunc: endedFunc,
			onLoad: onloadFunc,
			isOnload: false,
			volume: volume
		};
		n_Audio.loop = false;
		n_Audio.setAttribute("name", name);
		n_Audio.addEventListener("progress", function () {
			self.addListenLoad(progressOption);
		});
		n_Audio.addEventListener("ended", self.audioPlayEnd);

		n_Audio.src = url;
		n_Audio.load();

		n_Audio.volume = volume;
	},
	getFileFormat: function (_name) {
		var name = _name,
			format = "";
		var l = 1;
		var begin = name.length - l;
		while (begin > 0 && name.charAt(begin) != ".") {
			l++;
			begin = name.length - l;
		}

		format = name.slice(begin + 1);
		return format;
	},
	getAudioDuration: function (_name) {
		var name = _name, self = MYAIDE.Audio;
		if (self.audios[name] == undefined) return 0;
		return self.audios[name].duration;
	},
	audioPlayEnd: function () {
		var name = this.getAttribute("name");
		var self = MYAIDE.Audio;
		self.audioAttr[name].currentLoop++;
		if (self.audioAttr[name].currentLoop >= self.audioAttr[name].playLoop) {
			self.audioAttr[name].endFunc.call(self, name);
		} else {
			self.stop(name);
			this.currentTime = 0;
			this.play();
		}
	},
	addListenLoad: function (_audioData) {
		var self = this;
		self.listenStatus = true;
		this.listenLoadList.push(_audioData);
	},
	listenerLoad: function () {
		if (this.listenLoadList.length <= 0) {
			this.listenStatus = false;
			return;
		}
		var loadedList = [];
		for (var i = 0, len = this.listenLoadList.length; i < len; i++) {
			try {
				var jd = (this.listenLoadList[i].audio.buffered.end(0) - this.listenLoadList[i].audio.buffered.start(0)) / this.listenLoadList[i].audio.duration;
			} catch (e) { var jd = 0; }
			this.listenLoadList[i].jd = jd;
			if (jd >= 1) {
				loadedList.push(i);
				if (!this.audioAttr[this.listenLoadList[i].name].isOnload) {
					this.audioAttr[this.listenLoadList[i].name].onLoad.call(this, this.listenLoadList[i].name);
					this.audioAttr[this.listenLoadList[i].name].isOnload = true;
				}
			}
		}
		for (var j = loadedList.length - 1; j >= 0; j--) {
			this.listenLoadList.splice(loadedList[j], 1);
		}
	},
	isCheck: function (_name) {
		var index = this.audioList.indexOf(_name);
		if (index >= 0) {
			return true;
		} else {
			return false;
		}
	},
	getVolume: function (_name) {
		if (arguments.length > 0) {
			return this.audioAttr[_name].volume;
		} else {
			return this.volume;
		}
	},
	setVolume: function (_volume, _name) {
		if (arguments.length > 0) {
			if (isNaN(arguments[0]))
				return;
		} else {
			return;
		}
		if (arguments.length == 2) {
			this.audios[_name].volume = _volume;
			return;
		} else
			if (arguments.length == 1) {
				for (var i = 0; i < this.audioList.length; i++) {
					this.audios[this.audioList[i]].volume = _volume;
				}
			} else
				if (arguments.length > 2) {
					for (var i = 1; i < arguments.length; i++) {
						this.audios[arguments[i]].volume = _volume;
						this.audioAttr[arguments[i]].volume = _volume;
					}
				}

	},
	play: function (_name, _options) {
		if (!this.isCheck(_name)) {
			console.error("not find " + _name);
			return;
		}
		if (_options !== undefined) {
			var endedFunc = _options.ended !== undefined ? _options.ended : this.staticFunc;
			this.audioAttr[_name].endFunc = endedFunc;
		}
		this.audioAttr[_name].currentLoop = 0;
		this.audios[_name].play();
	},
	pause: function (_name) {
		if (!this.isCheck(_name)) {
			console.error("not find " + _name);
			return;
		}
		this.audios[_name].pause();
	},
	pauseAll: function () {
		for (var i = 0; i < this.audioList.length; i++) {
			this.audios[this.audioList[i]].pause();
		}
	},
	stop: function (_name) {
		if (!this.isCheck(_name)) {
			console.error("not find " + _name);
			return;
		}
		this.audios[_name].pause();
		this.audios[_name].currentTime = 0;
	},
	stopAll: function () {
		for (var i = 0; i < this.audioList.length; i++) {
			this.audios[this.audioList[i]].pause();
			this.audios[this.audioList[i]].currentTime = 0;
		}
	},
	resume: function (_name) {
		if (!this.isCheck(_name)) {
			console.error("not find " + _name);
			return;
		}
		if (this.audios[_name].paused) {
			this.audios[_name].play();
		}
	},
	hasAudio: function (_name) {
		var index = this.audioList.indexOf(_name);
		return index;
	}

};

MYAIDE.Labeler = {
	clone: function (ele, boo) {
		var boo = _boo != undefined ? _boo : false;
		return ele.cloneNode(boo);
	},
	copy: function (ele, boo) {
		var boo = _boo != undefined ? _boo : false;
		return ele.cloneNode(boo);
	},
	createElm: function (_options) {
		var options = _options || {};
		var type = options.type !== undefined ? options.type : "div";
		var elm = document.createElement(type);
		for (var i in options) {
			if (i == "width" || i == "height" || i == "left" || i == "top") {
				elm.style[i] = parseFloat(options[i]) + "px";
			} else
				if (i == "type") {

				} else
					if (i == "display" || i == "zIndex" || i == "display") {
						elm.style[i] = options[i];
					} else
						if (i == "attr") {
							for (var j in options[i]) {
								elm.setAttribute(j, options[i][j]);
							}
						} else
							if (i == "className") {
								elm.className = options[i];
							} else {
								elm.style[i] = options[i];
							}

		}
		return elm;
	},
	createImage: function () {
		var imgArray = [];
		for (var i = 0; i < arguments.length; i++) {
			var img = new Image();
			img.src = arguments[i];
			imgArray.push(img);
		}
		return imgArray;
	},
	hide: function (_elm, _timer, _callbacks) {
		if (Array.isArray(_elm)) {
			for (var i = 0; i < _elm.length; i++) {
				if (!_elm.style) {
					continue;
				}
				this.hide(_elm[i], _timer, _callbacks);
			}
		} else {
			if (!_elm.style) {
				return;
			}
			var callbacks = _callbacks !== undefined ? _callbacks : function () { };
			if (_timer !== undefined) {
				MYAIDE.Tween.canvasAni({ opa: 100 }, { opa: 0 }, "Linear", _timer, updataOpa, callbacks);
			} else {
				_elm.style.display = "none";
			}
			function updataOpa(_data) {
				if (_data.opa === undefined) return;
				MYAIDE.Labeler.setOpacity(_elm, _data.opa / 100);
			}
		}

	},
	hideAnimal: function (_elm, _timer, _callbacks) {
		if (Array.isArray(_elm)) {
			for (var i = 0; i < _elm.length; i++) {
				if (!_elm.alpha) {
					continue;
				}
				this.hideAnimal(_elm[i], _timer, _callbacks);
			}
		} else {
			if (!_elm.alpha) {
				return;
			}
			var callbacks = _callbacks !== undefined ? _callbacks : function () { };
			if (_timer !== undefined) {
				_elm.alpha = 1;
				MYAIDE.Tween.canvasAni({ alpha: 100 }, { alpha: 0 }, "Linear", _timer, updataAlpha, callbacks);
			} else {
				_elm.alpha = 0;
			}
			function updataAlpha(_data) {
				if (_data.alpha === undefined)
					return;
				_elm.alpha = _data.alpha / 100;
			}

		}
	},
	show: function (_elm, _timer, _callbacks) {
		if (Array.isArray(_elm)) {
			for (var i = 0; i < _elm.length; i++) {
				if (!_elm.style) {
					continue;
				}
				this.show(_elm[i], _timer, _callbacks);
			}
		} else {
			if (!_elm.style) {
				return;
			}
			var callbacks = _callbacks !== undefined ? _callbacks : function () { };
			if (_timer !== undefined) {
				MYAIDE.Labeler.setOpacity(0);
				_elm.style.display = "block";
				MYAIDE.Tween.canvasAni({ opa: 0 }, { opa: 100 }, "Linear", _timer, updataOpa, callbacks);
			} else {
				_elm.style.display = "block";
			}
			function updataOpa(_data) {
				if (_data.opa === undefined) return;
				MYAIDE.Labeler.setOpacity(_elm, _data.opa / 100);
			}
		}
	},
	showAnimal: function (_elm, _timer, _callbacks) {
		if (Array.isArray(_elm)) {
			for (var i = 0; i < _elm.length; i++) {
				if (!_elm.alpha) {
					continue;
				}
				this.showAnimal(_elm[i], _timer, _callbacks);
			}
		} else {
			if (_elm.alpha === undefined) {
				return;
			}
			var callbacks = _callbacks !== undefined ? _callbacks : function () { };
			if (_timer !== undefined) {
				_elm.alpha = 0;
				MYAIDE.Tween.canvasAni({ alpha: 0 }, { alpha: 100 }, "Linear", _timer, updataAlpha, callbacks);
			} else {
				_elm.alpha = 1;
			}
			function updataAlpha(_data) {
				if (_data.alpha === undefined)
					return;
				_elm.alpha = _data.alpha / 100;
			}

		}
	},
	setTransform: function (_obj, _attr) {
		if (_obj !== undefined && _attr !== undefined) {
			_obj.style.transform = _attr;
			_obj.style.mozTransform = _attr;
			_obj.style.webkitTransform = _attr;
			_obj.style.oTransform = _attr;
		}

	},
	setOpacity: function (_obj, _attr) {
		if (_obj !== undefined && _attr !== undefined) {
			var attr = MYAIDE.Math.clamp(_attr, 0, 1);
			_obj.filter = "alpha(opacity=" + attr * 100 + ")";
			_obj.style.mozOpacity = attr;
			_obj.style.khtmlOpacity = attr;
			_obj.style.opacity = attr;
		}

	},
	gotoHref: function (url, _boo) {
		var boo = _boo !== undefined ? _boo : false;
		if (boo) {
			window.open(url);
		} else {
			window.location.href = url;
		}
	}
}


MYAIDE.Animal = function (_parameters) {
	var parameters = _parameters || {};
	var self = this;

	this.type = 'Animal';

	this.alpha = parameters.alpha !== undefined ? parameters.alpha : 1;
	this.pause = false;
	this.name = parameters.name !== undefined ? parameters.name : "";
	this.uuid = MYAIDE.Math.generateUUID();

	var x = parameters.x !== undefined ? parameters.x : 0,
		y = parameters.y !== undefined ? parameters.y : 0,
		sx = parameters.sx !== undefined ? parameters.sx : 0,
		sy = parameters.sy !== undefined ? parameters.sy : 0,
		ws = parameters.width !== undefined ? true : false,
		hs = parameters.height !== undefined ? true : false;
	this.position = new MYAIDE.Position(x, y);
	this.sPosition = new MYAIDE.Position(sx, sy);
	this.zIndex = parameters.zIndex !== undefined ? parameters.zIndex : 0;
	this.special = {
		width: parameters.width !== undefined ? parameters.width : 0,
		height: parameters.height !== undefined ? parameters.height : 0
	};
	this.background = null;
	this.backgroundStatus = false;
	if (!!parameters.background && typeof (parameters.background) == "string") {
		var pfile = MYAIDE.Preload.getFileByUrl(parameters.background);
		if (pfile) {
			this.background = pfile;
			this.backgroundStatus = true;
			!ws ? self.special.width = self.background.width : "";
			!hs ? self.special.height = self.background.height : "";
		} else {
			this.background = new Image();
			this.background.onload = function () {
				self.backgroundStatus = true;
				!ws ? self.special.width = self.background.width : "";
				!hs ? self.special.height = self.background.height : "";
			}
			this.background.src = parameters.background;
		}
	}

	this.parent = null;
	this.children = [];
	this.selfAttr = {};
	this.captureListener = {};
	this.bubblesListener = {};
	this.listenerStatus = parameters.listenerStatus !== undefined ? parameters.listenerStatus : false;
	this.trigger = parameters.trigger !== undefined ? parameters.trigger : [];
	this.triggerStatus = parameters.trigger !== undefined ? true : false;
	this.cacheTrigger = [];
	this.pathStatus = false;
	this.motionFuncs = [];
	this.scale = new MYAIDE.Position(1, 1);
	this.rotate = parameters.rotate !== undefined ? parameters.rotate : 0;

	this.overflow = parameters.overflow !== undefined ? parameters.overflow : "visible";
	this.rotatePoint = new MYAIDE.Position(0, 0);
	this.visible = parameters.visible !== undefined ? parameters.visible : true;
	this.ghost = parameters.ghost !== undefined ? parameters.ghost : false;
	this.isDrawFunc = false;
	this.renderDraw = true;
	this.mouseEnabled = true;
	this.buttonMode = true;
};
MYAIDE.Animal.prototype = Object.assign(MYAIDE.EventListener.prototype, {
	constructor: MYAIDE.Animal,
	setTrigger: function (_arr) {
		if (Array.isArray(_arr)) {
			this.trigger = _arr;
			this.triggerStatus = true;
		}
	},
	removeTrigger: function () {
		this.trigger = [];
		this.triggerStatus = false;
	},
	setStatus: function (_status, _boo, _e, _data, _stage) {
		var boo = _boo == undefined ? true : _boo;
		var stage = _stage !== undefined ? _stage : 0;
		if (boo) {
			if (stage > 0) {
				this.setListener(_status, _e, _data, true);
			} else
				if (stage < 0) {
					this.setListener(_status, _e, _data, false);
				} else {
					this.setListener(_status, _e, _data, true);
					this.setListener(_status, _e, _data, false);
				}
		}
	},
	getTriggerSpecial: function () {
		var w = this.special.width,
			h = this.special.height;
		return { width: w, height: h };
	},
	setListener: function (_type, _e, _data, _useCapture) {
		var useCapture = _useCapture == undefined ? true : _useCapture;
		var listener = useCapture ? this.captureListener : this.bubblesListener;
		if (this.buttonMode) {
			var type = null;
			switch (_type) {
				case "down":
					type = "mousedown";
					break;
				case "move":
					type = "mousemove";
					break;
				case "up":
					type = "mouseup";
					break;
				case "disable":
					type = "disable";
					break;
				case "out":
					type = "mouseout";
					break;
				case "over":
					type = "mouseover";
					break;
				default:
					type = _type;
			}
			if (listener === undefined) return;
			var listenerArray = listener[type];
			if (listenerArray !== undefined) {
				for (var i = 0; i < listenerArray.length; i++) {
					listenerArray[i].call(this, _e, _data);
				}
			}
		}
	},
	setAttr: function (_name, _attr) {
		this.selfAttr[_name] = _attr;
	},
	getAttr: function (_name) {
		return this.selfAttr[_name];
	},
	getName: function () {
		return this.name;
	},
	getChildren: function (_name) {
		var target = null;
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].name == _name) {
				target = this.children[i];
				break;
			}
		}
		return target;
	},
	add: function (object) {
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				this.add(arguments[i]);
			}
			return this;
		}
		if (object === this) {
			console.error("MYAIDE.Scene.add: object can't be added as a child of itself.", object);
			return this;
		}
		object.parent = this;
		this.children.push(object);
		return this;
	},
	remove: function (object) {
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				this.remove(arguments[i]);
			}
		}
		var index = this.children.indexOf(object);
		if (index !== - 1) {
			this.children.splice(index, 1);
		}
	},
	getObjectByUUID: function (id) {
		return this.getObjectByProperty('uuid', id);
	},
	getObjectByName: function (name) {
		return this.getObjectByProperty('name', name);
	},
	getObjectByProperty: function (name, value) {
		if (this[name] === value) return this;
		for (var i = 0, l = this.children.length; i < l; i++) {
			var child = this.children[i];
			var object = child.getObjectByProperty(name, value);
			if (object !== undefined) {
				return object;
			}
		}
		return undefined;
	},
	removeAll: function () {
		this.children.splice(0, this.children.length);
	},
	clone: function () {
		return new this.constructor().copy(this);
	},
	copy: function (source, recursive) {
		if (recursive === undefined) recursive = true;
		this.name = source.name;
		this.position.copy(source.position);
		this.sPosition.copy(source.sPosition);
		this.special.width = source.special.width;
		this.special.height = source.special.height;
		this.listenerStatus = source.listenerStatus;

		this.visible = source.visible;
		this.isDrawFunc = this.isDrawFunc;
		this.renderDraw = this.renderDraw;
		this.scale.copy(source.scale);
		this.rotate = source.rotate;
		this.rotatePoint.copy(source.rotatePoint);
		this.zIndex = source.zIndex;
		this.background = source.background;
		this.backgroundStatus = source.backgroundStatus;
		this.alpha = source.alpha;

		this.motionFuncs = source.motionFuncs;
		if (recursive) {
			for (var i = 0; i < source.children.length; i++) {
				var child = source.children[i];
				this.add(child.clone());
			}
		}
		return this;
	},
	copyMotionFuncs: function (source) {
		var motionFuncs = [];
		for (var i in source) {
			motionFuncs[i] = source[i];
		}
		return motionFuncs;
	},
	getObjectByProperty: function (name, value) {
		if (this[name] === value) return this;
		for (var i = 0, l = this.children.length; i < l; i++) {
			var child = this.children[i];
			var object = child.getObjectByProperty(name, value);
			if (object !== undefined) {
				return object;
			}
		}
		return undefined;
	},
	changeAlpha: function (_alpha) {
		var alpha = MYAIDE.Math.clamp(_alpha, 0, 1);
		this.alpha = alpha;
	},
	setPosition: function (x, y) {
		this.position.set(x, y);
	},
	setRotate: function (_n) {
		if (!isNaN(_n)) {
			this.rotate = _n;
		}
	},
	setRotatePoint: function (x, y) {
		this.rotatePoint.set(x, y);
	},
	addMotionFunc: function (name, _func) {
		if (_func === this) {
			console.error("MYAIDE.animal.add: object can't be added as a child of itself.", _func);
			return this;
		}
		if (typeof (_func) == "function") {
			this.motionFuncs[name] = _func;
		} else {
			console.error("MYAIDE.animal.add:object.motionFuncs must be added as a function", _func)
		}
	},
	removeMotionFunc: function (name) {
		this.motionFuncs[name] = null;
	},
	countMotionFuncs: function () {
		for (var i in this.motionFuncs) {
			if (this.motionFuncs[i] == null)
				continue;
			this.motionFuncs[i].call(this);
		}
	},
	draw: function (canvas, ctx) {
		ctx.save();
		ctx.restore();
	}
});

MYAIDE.Scene = function (_parameters) {
	var parameters = _parameters || {};
	var self = this;
	MYAIDE.Animal.call(this, parameters);
	this.type = "Scene";
	this.mouseEnabled = false;
	this.buttonMode = false;
};
MYAIDE.Scene.prototype = Object.assign(Object.create(MYAIDE.Animal.prototype), {
	constructor: MYAIDE.Scene
});

MYAIDE.Button = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Animal.call(this, parameters);

	this.type = "Button";
	this.upImg = parameters.upImg !== undefined ? parameters.upImg : new Image();
	this.moveImg = parameters.moveImg !== undefined ? parameters.moveImg : this.upImg;
	this.downImg = parameters.downImg !== undefined ? parameters.downImg : this.upImg;
	this.disableImg = parameters.disableImg !== undefined ? parameters.disableImg : this.upImg;
	this.choiceSwitch = parameters.choiceSwitch !== undefined ? parameters.choiceSwitch : false;
	this.choiceStatus = false;
	this.choiceImg = parameters.choiceImg !== undefined ? parameters.choiceImg : this.upImg;
	this.listenerStatus = true;
	this.status = "up";

	this.showImg = this.upImg;

	this.isDrawFunc = false;
	this.renderDraw = true;
	this.mouseEnabled = true;
	this.buttonMode = true;
};
MYAIDE.Button.prototype = Object.assign(Object.create(MYAIDE.Animal.prototype), {
	constructor: MYAIDE.Button,
	getTriggerSpecial: function () {
		var w = !this.special.width ? this.showImg.width : this.special.width,
			h = !this.special.height ? this.showImg.height : this.special.height;
		return { width: w, height: h };
	},
	getStatus: function () {
		return this.status;
	},
	setStatus: function (_status, _boo, _e, _data, _stage) {
		var boo = _boo == undefined ? true : _boo;
		var stage = _stage !== undefined ? _stage : 0;
		if (this.mouseEnabled) {
			this.status = _status;
		}
		if (boo) {
			if (stage > 0) {
				this.setListener(_status, _e, _data, true);
			} else
				if (stage < 0) {
					this.setListener(_status, _e, _data, false);
				} else {
					this.setListener(_status, _e, _data, true);
					this.setListener(_status, _e, _data, false);
				}
		}
		if (_status == "down" && this.choiceSwitch) {
			if (this.choiceStatus) {
				this.choiceStatus = false;
			} else {
				this.choiceStatus = true;
			}
		}

	},
	getChoiceStatus: function () {
		return this.choiceStatus;
	},
	draw: function (canvas, ctx) {
		if (!this.visible) return;
		ctx.save();
		ctx.globalAlpha *= this.alpha;
		if (this.status == "up") {
			this.showImg = this.upImg;
		} else
			if (this.status == "down") {
				this.showImg = this.downImg;
			} else
				if (this.status == "move") {
					this.showImg = this.moveImg;
				} else
					if (this.status == "disable") {
						this.showImg = this.disableImg;
					}
		ctx.drawImage(this.showImg, 0, 0, this.showImg.width, this.showImg.height, this.position.x, this.position.y, this.showImg.width, this.showImg.height);
		ctx.restore();
	}
});

MYAIDE.IntervalAnimation = function (_parameters) {
	var self = this;
	var parameters = _parameters || {};
	MYAIDE.Animal.call(this, parameters);
	this.type = "IntervalAnimation";

	this.pause = true;
	this.frameArray = parameters.frameArray !== undefined ? parameters.frameArray : [];

	this.direction = parameters.direction !== undefined ? parameters.direction : true;
	this.intervalStatus = parameters.intervalStatus !== undefined ? parameters.intervalStatus : false;
	this.playTime = parameters.playTime !== undefined ? parameters.playTime : 1;
	this.currentPlayTime = 0;

	this.lastFrame = this.frameArray.length > 0 ? this.frameArray.length - 1 : 0;
	this.firstFrame = parameters.firstFrame !== undefined ? parameters.firstFrame : 0;
	this.currentFrame = this.direction == true ? this.firstFrame : this.lastFrame;

	this.cycle = parameters.cycle !== undefined ? parameters.cycle : 100;
	this.clocker = new MYAIDE.Clock();
	this.interval = 0;

	parameters.autoPlay !== undefined ? (!!parameters.autoPlay ? self.pause = false : self.pause = true) : "";
};
MYAIDE.IntervalAnimation.prototype = Object.assign(Object.create(MYAIDE.Animal.prototype), {
	contructor: MYAIDE.IntervalAnimation,
	getTriggerSpecial: function () {
		var w = this.frameArray[this.currentFrame] ? this.frameArray[this.currentFrame].width : 0,
			h = this.frameArray[this.currentFrame] ? this.frameArray[this.currentFrame].height : 0;
		return { width: w, height: h };
	},
	goto: function (_frame) {
		var frame = MYAIDE.Math.clamp(_frame, this.firstFrame, this.lastFrame);
		this.currentFrame = frame;
	},
	gotoAndStop: function (_frame) {
		var frame = MYAIDE.Math.clamp(_frame, this.firstFrame, this.lastFrame);
		this.currentFrame = frame;
		this.pause = true;
	},
	gotoAndPlay: function (_frame) {
		var frame = MYAIDE.Math.clamp(_frame, this.firstFrame, this.lastFrame);
		this.currentFrame = frame;
		this.play();
	},
	gotoEnd: function () {
		this.currentFrame = this.lastFrame;
	},
	gotoNext: function (_n) {
		var nowFrame = this.currentFrame + _n;
		this.currentFrame = MYAIDE.Math.clamp(nowFrame, this.firstFrame, this.lastFrame);
	},
	play: function () {
		this.pause = false;
		this.currentPlayTime = 0;
	},
	stop: function () {
		this.pause = true;
	},
	setPlayTime: function (_n) {
		if (!isNaN(_n)) {
			this.playTime = _n;
		}
	},
	getPlayTime: function () {
		return this.playTime;
	},
	gotoNextInterval: function (_n) {
		var nowFrame = this.currentFrame + _n;

		if (nowFrame >= this.firstFrame && nowFrame <= this.lastFrame) {
			this.currentFrame = nowFrame;
		} else
			if (nowFrame < this.firstFrame) {
				nowFrame = this.lastFrame + 1 + nowFrame;
				while (nowFrame < 0) {
					nowFrame = this.lastFrame + 1 + nowFrame;
				}
				this.currentFrame = nowFrame;
			} else
				if (nowFrame > this.lastFrame) {
					nowFrame = nowFrame % (this.lastFrame + 1) + this.firstFrame;
					this.currentFrame = nowFrame;
				}
		if (!this.intervalStatus) {
			if ((this.direction && nowFrame == this.lastFrame) || (!this.direction && nowFrame == this.firstFrame)) {
				this.currentPlayTime++;
				if (this.currentPlayTime >= this.playTime) {
					this.pause = true;
					nowFrame = this.direction == true ? this.lastFrame : this.firstFrame;
					this.setListener("ended", 0, 0, true);
					this.setListener("ended", 0, 0, false);
				}
			}
		}
	},
	updataClock: function () {
		this.clocker.resetClock();
	},
	spins: function () {
		var runTime = this.clocker.getDelta();
		runTime = runTime * 1000;
		this.interval += runTime;
		if (this.interval >= this.cycle) {
			this.interval = this.interval % this.cycle;
			if (this.direction) {
				this.gotoNextInterval(1);
			} else {
				this.gotoNextInterval(-1);
			}

		}
	}
});

MYAIDE.AnyIntervalAnimation = function (_parameters) {

	var parameters = _parameters || {};

	MYAIDE.IntervalAnimation.call(this, parameters);

	this.type = "AnyIntervalAnimation";

	this.frameArray = parameters.frameArray !== undefined ? parameters.frameArray : [[]];

	this.currentFrameIndex = 0;
	this.firstFrameIndex = 0;
	this.lastFrameIndex = parameters.frameArray.length > 0 ? parameters.frameArray.length - 1 : 0;

	this.currentFrame = 0;
	this.firstFrame = 0;
	this.lastFrame = this.frameArray[this.currentFrameIndex].length > 0 ? this.frameArray[this.currentFrameIndex].length - 1 : 0;

};
MYAIDE.AnyIntervalAnimation.prototype = Object.assign(Object.create(MYAIDE.IntervalAnimation.prototype), {
	contructor: MYAIDE.AnyIntervalAnimation,
	getTriggerSpecial: function () {
		var w = this.frameArray[this.currentFrameIndex][this.currentFrame] ? this.frameArray[this.currentFrameIndex][this.currentFrame].width : 0,
			h = this.frameArray[this.currentFrameIndex][this.currentFrame] ? this.frameArray[this.currentFrameIndex][this.currentFrame].height : 0;
		return { width: w, height: h };
	},
	gotoIndex: function (_frameIndex, _boo) {
		var boo = _boo == undefined ? true : _boo;
		var frameIndex = MYAIDE.Math.clamp(_frameIndex, this.firstFrameIndex, this.lastFrameIndex);
		this.currentFrameIndex = frameIndex;
		this.lastFrame = this.frameArray[this.currentFrameIndex].length > 0 ? this.frameArray[this.currentFrameIndex].length - 1 : 0;
		if (boo) {
			this.currentFrame = this.firstFrame;
		} else {
			this.currentFrame = this.currentFrame > this.lastFrame ? this.lastFrame : this.currentFrame;
		}
	},
	gotoIndexAndStop: function (_frameIndex, _boo) {
		var boo = _boo == undefined ? false : _boo;
		var frameIndex = MYAIDE.Math.clamp(_frameIndex, this.firstFrameIndex, this.lastFrameIndex);
		this.currentFrameIndex = frameIndex;
		this.lastFrame = this.frameArray[this.currentFrameIndex].length > 0 ? this.frameArray[this.currentFrameIndex].length - 1 : 0;
		if (boo) {
			this.currentFrame = this.firstFrame;
		}
		this.pause = true;
	},
	gotoIndexAndPlay: function (_frameIndex, _boo) {
		var boo = _boo == undefined ? false : _boo;
		var frameIndex = MYAIDE.Math.clamp(_frameIndex, this.firstFrameIndex, this.lastFrameIndex);
		this.currentFrameIndex = frameIndex;
		this.lastFrame = this.frameArray[this.currentFrameIndex].length > 0 ? this.frameArray[this.currentFrameIndex].length - 1 : 0;
		if (boo) {
			this.currentFrame = this.firstFrame;
		}

		this.pause = false;
	},
	gotoIndexEnd: function (_boo) {
		var boo = _boo == undefined ? false : _boo;
		this.currentFrame = this.lastFrameIndex;
		this.lastFrame = this.frameArray[this.currentFrameIndex].length > 0 ? this.frameArray[this.currentFrameIndex].length - 1 : 0;
		if (boo) {
			this.currentFrame = this.firstFrame;
		}
	},
	gotoIndexNext: function (_n, _boo) {
		var boo = _boo == undefined ? false : _boo;
		var nowFrameIndex = this.currentFrameIndex + _n;
		this.currentFrameIndex = MYAIDE.Math.clamp(nowFrameIndex, this.firstFrameIndex, this.lastFrameIndex);
		if (boo) {
			this.currentFrame = this.firstFrame;
		}
	},
	gotoIndexInterval: function (_n, _boo) {
		var boo = _boo == undefined ? false : _boo;
		var nowFrameIndex = this.currentFrameIndex + _n;

		if (nowFrameIndex >= this.firstFrame && nowFrameIndex <= this.lastFrame) {
			this.currentFrameIndex = nowFrameIndex;
		} else
			if (nowFrameIndex < this.firstFrame) {
				nowFrameIndex = this.lastFrame + 1 + nowFrameIndex;
				while (nowFrameIndex < 0) {
					nowFrameIndex = this.lastFrame + 1 + nowFrameIndex;
				}
				this.currentFrameIndex = nowFrameIndex;
			} else
				if (nowFrameIndex > this.lastFrame) {
					nowFrameIndex = nowFrameIndex % (this.lastFrame + 1);
					this.currentFrameIndex = nowFrameIndex;
				}
	}
});

MYAIDE.SameGraphAnimation = function (_parameters) {

	parameters = _parameters || {};

	MYAIDE.Animal.call(this, parameters);
	this.type = "SameGraphAnimation";

	this.pause = true;

	this.frameImg = parameters.frameImg !== undefined ? parameters.frameImg : new Image();

	var po_int_x = parameters.posIntervalX !== undefined ? parameters.posIntervalX : 100,
		po_int_y = parameters.posIntervalY !== undefined ? parameters.posIntervalY : 100;
	this.positionInterval = new MYAIDE.Position(po_int_x, po_int_y);

	var po_static_x = parameters.posStaticX !== undefined ? parameters.posStaticX : 0,
		po_static_y = parameters.posStaticY !== undefined ? parameters.posStaticY : 0;
	this.positionStatic = new MYAIDE.Position(po_static_x, po_static_y);

	this.column = parameters.column !== undefined ? parameters.column : 1;

	this.direction = parameters.direction !== undefined ? parameters.direction : true;
	this.intervalStatus = parameters.intervalStatus !== undefined ? parameters.intervalStatus : false;
	this.playTime = parameters.playTime !== undefined ? parameters.playTime : 1;
	this.currentPlayTime = 0;

	this.lastFrame = parameters.lastFrame !== undefined ? parameters.lastFrame : 0;
	this.firstFrame = parameters.firstFrame !== undefined ? parameters.firstFrame : 0;
	this.currentFrame = this.direction == true ? this.firstFrame : this.lastFrame;
	this.cycle = parameters.cycle !== undefined ? parameters.cycle : 200;

	this.clocker = new MYAIDE.Clock();
	this.interval = 0;
};

MYAIDE.SameGraphAnimation.prototype = Object.assign(Object.create(MYAIDE.Animal.prototype), {
	contructor: MYAIDE.SameGraphAnimation,
	goto: function (_frame) {
		var frame = MYAIDE.Math.clamp(_frame, this.firstFrame, this.lastFrame);
		this.currentFrame = frame;
	},
	gotoAndStop: function (_frame) {
		var frame = MYAIDE.Math.clamp(_frame, this.firstFrame, this.lastFrame);
		this.currentFrame = frame;
		this.pause = true;
	},
	gotoAndPlay: function (_frame) {
		var frame = MYAIDE.Math.clamp(_frame, this.firstFrame, this.lastFrame);
		this.currentFrame = frame;
		this.pause = false;
	},
	gotoEnd: function () {
		this.currentFrame = this.lastFrame;
	},
	gotoNext: function (_n) {
		var nowFrame = this.currentFrame + _n;
		this.currentFrame = MYAIDE.Math.clamp(nowFrame, this.firstFrame, this.lastFrame);
	},
	play: function () {
		this.pause = false;
	},
	stop: function () {
		this.pause = true;
	},
	gotoNextInterval: function (_n) {
		var nowFrame = this.currentFrame + _n;
		if (!this.intervalStatus) {
			if ((this.direction && nowFrame == this.lastFrame) || (!this.direction && nowFrame == this.firstFrame)) {
				this.currentPlayTime++;
				if (this.currentPlayTime >= this.playTime) {
					this.pause = true;
					nowFrame = this.direction == true ? this.lastFrame : this.firstFrame;
					if (this.listener !== undefined) {
						var listenerArray = this.listener["ended"];
						if (listenerArray !== undefined) {
							for (var i = 0, len = listenerArray.length; i < len; i++) {
								listenerArray[i].call(this);
							}
						}

					}
				}
			}
		}
		if (nowFrame >= this.firstFrame && nowFrame <= this.lastFrame) {
			this.currentFrame = nowFrame;
		} else
			if (nowFrame < this.firstFrame) {
				nowFrame = this.lastFrame + 1 + nowFrame;
				while (nowFrame < 0) {
					nowFrame = this.lastFrame + 1 + nowFrame;
				}
				this.currentFrame = nowFrame;
			} else
				if (nowFrame > this.lastFrame) {
					nowFrame = nowFrame % (this.lastFrame + 1) + this.firstFrame;
					this.currentFrame = nowFrame;
				}
	},
	updataClock: function () {
		this.clocker.resetClock();
	},
	spins: function () {
		var runTime = this.clocker.getDelta();
		runTime = runTime * 1000;
		this.interval += runTime;
		if (this.interval >= this.cycle) {
			this.interval = this.interval % this.cycle;
			if (this.direction) {
				this.gotoNextInterval(1);
			} else {
				this.gotoNextInterval(-1);
			}

		}
	}
});

MYAIDE.Text = function (_parameters) {
	var parameters = _parameters || {};

	MYAIDE.Animal.call(this, parameters);
	this.type = "Text";

	this.textStr = parameters.txt !== undefined ? parameters.txt : "";

	this.font = parameters.font !== undefined ? parameters.font : null;
	this.fillStyle = parameters.fillStyle !== undefined ? parameters.fillStyle : "#000";
	this.strokeStyle = parameters.strokeStyle !== undefined ? parameters.strokeStyle : this.fillStyle;
	this.fontSize = parameters.fontSize !== undefined ? parameters.fontSize : (!!this.font ? this.getFontSize(this.font) : 10);
	this.fontFamily = parameters.fontFamily !== undefined ? parameters.fontFamily : "sans-serif";
	this.fillType = parameters.fillType !== undefined ? parameters.fillType : "fillText";

	this.textAlign = parameters.textAlign !== undefined ? parameters.textAlign : "left";
	this.textBaseline = parameters.textBaseline !== undefined ? parameters.textBaseline : "alphabetic";
	this.lineHeight = parameters.lineHeight !== undefined ? parameters.lineHeight : this.fontSize;
	var len = !!this.textStr ? this.textStr.length : 1;
	var w = parameters.width !== undefined ? parameters.width : len * this.fontSize + 20,
		h = parameters.height !== undefined ? parameters.height : this.lineHeight;

	this.special = {
		width: w,
		height: h
	};

	this.wordWrap = parameters.wordWrap !== undefined ? parameters.wordWrap : false;
	this.lineWidth = parameters.lineWidth !== undefined ? parameters.lineWidth : 1;
	this.Width = parameters.Width !== undefined ? parameters.Width : this.special.width;


	this.indent = parameters.indent !== undefined ? (this.textAlign != "left" ? false : parameters.indent) : false;

	this.shadow = parameters.shadow !== undefined ? parameters.shadow : false;
	this.shadowColor = parameters.shadowColor !== undefined ? parameters.shadowColor : "#000";
	this.shadowOffsetX = parameters.shadowOffsetX !== undefined ? parameters.shadowOffsetX : 0;
	this.shadowOffsetY = parameters.shadowOffsetY !== undefined ? parameters.shadowOffsetY : 0;
	this.shadowBlur = parameters.shadowBlur !== undefined ? parameters.shadowBlur : 0;

};

MYAIDE.Text.prototype = Object.assign(Object.create(MYAIDE.Animal.prototype), {
	contructor: MYAIDE.Text,
	setText: function (_str) {
		this.textStr = _str.toString();
		this.updata();
	},
	getText: function () {
		return this.textStr;
	},
	showOrHideShadow: function (_boo) {
		if (_boo !== undefined) {
			this.shadow = _boo ? true : false;
		} else {
			this.shadow = this.shadow ? false : true;
		}
	},
	setShadownColor: function (_color) {
		this.shadowColor = _color;
	},
	addText: function (_str) {
		this.textStr += _str;
		this.updata();
	},
	removeText: function () {
		this.textStr = null;
		this.updata();
	},
	updata: function () {
		var len = this.textStr == null ? 1 : this.textStr.length;
		this.special.width = len * this.fontSize + 20;
		if (!this.wordWrap) {
			this.lineWidth = this.special.width;
		}
	},
	getFontSize: function (str) {
		var strArr = str.split(" ");
		var size = 10;
		for (var i = 0; i < strArr.length; i++) {
			if (strArr[i].indexOf("px") >= 0) {
				size = parseInt(strArr[i]);
				size = size ? size : 10;
				break;
			}
			if (strArr[i].indexOf("pt") >= 0) {
				size = parseInt(strArr[i]);
				size = size ? parseInt(size / 3 * 4) : 10;
				break;
			}
		}

		return size;
	}
});
MYAIDE.Input = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Text.call(this, parameters);
	this.type = "Input";
	this.recTypeList = ["text", "password"];
	this.inputType = parameters.inputType !== undefined ? (this.recTypeList.indexOf(parameters.inputType) > -1 ? parameters.inputType : "text") : "text";

	this.passwordStyle = "●";
	this.inputOpenStatus = false;
	this.inputToBox = true;
	this.boxToInput = true;
	var w = parameters.width !== undefined ? parameters.width : 120,
		h = parameters.height !== undefined ? parameters.height : 36;
	this.special = {
		width: w,
		height: h
	};
	this.backgroundColor = parameters.backgroundColor !== undefined ? parameters.backgroundColor : "#fff";
	this.fontSize = parameters.fontSize !== undefined ? parameters.fontSize : (h - 6 > 0 ? h - 6 : 1);
	this.borderWidth = parameters.borderWidth !== undefined ? parameters.borderWidth : 1;
	this.borderDash = parameters.borderDash !== undefined ? parameters.borderDash : [];
	this.borderColor = parameters.borderColor !== undefined ? parameters.borderColor : "#000";
	this.outline = parameters.outline !== undefined ? parameters.outline : "none";

	this.listenerStatus = true;


	this.captureListener = {
		mousedown: [this.sMouseDownFunc],
		oninput: [this.syncInputToBox]
	};
	this.maxLength = parameters.maxLength !== undefined ? parameters.maxLength : 255;

	this.inputBox = document.createElement("input");
	this.inputBox.style.display = "none";
	this.inputBox.onchange = function () {
		self.publishEvent("onchange", true);
		self.publishEvent("onchange", false);
	};
	this.inputBox.oninput = function () {
		self.publishEvent("oninput", true);
		self.publishEvent("oninput", false);
	};
	this.inputBox.onselect = function () {
		self.publishEvent("onselect", true);
		self.publishEvent("onselect", false);
	};

	var self = this;
	this.sMouseOutFunc = function (data) {
		self.inputOpenStatus = false;
		if (self.boxToInput) self.textStr = self.inputBox.value;
		self.inputBox.style.display = "none";
		MYAIDE.pointer.removeMouseListener("mousedown", self.sMouseOutFunc);
		self.onBlur();
	};


	this.useable = parameters.useable !== undefined ? parameters.useable : true;
	this.isDrawFunc = true;
	this.renderDraw = false;
};
MYAIDE.Input.prototype = Object.assign(Object.create(MYAIDE.Text.prototype), MYAIDE.EventListener.prototype, {
	constructor: MYAIDE.Input,
	sMouseDownFunc: function () {
		var self = this;
		if (!this.useable) return;
		this.inputBox.type = this.inputType;
		this.inputBox.style.display = "";
		if (this.inputToBox) this.inputBox.value = this.textStr;
		this.inputBox.style.textAlign = this.textAlign;
		this.inputBox.style.position = "absolute";
		this.inputBox.style.fontSize = this.fontSize + "px";
		this.inputBox.style.width = this.special.width + "px";
		this.inputBox.style.height = this.special.height + "px";
		this.inputBox.style.borderWidth = this.borderWidth + "px";
		this.inputBox.style.borderColor = this.borderColor;
		this.inputBox.style.color = this.fillStyle;
		this.inputBox.style.lineHeight = this.lineHeight + "px";
		this.inputBox.style.background = this.backgroundColor;
		this.inputBox.maxLength = this.maxLength;
		this.inputBox.style.outline = this.outline;

		self.publishEvent("onfocus", true);
		self.publishEvent("onfocus", false);

		var inputLeft = MYAIDE.Math.getPositionX(this),
			inputTop = MYAIDE.Math.getPositionY(this);
		this.inputBox.style.left = inputLeft + "px";
		this.inputBox.style.top = inputTop + "px";
		MYAIDE.WorkInfo.canvas.parentNode.appendChild(this.inputBox);
		this.inputOpenStatus = true;
		this.inputBox.focus();
		setTimeout(function () { MYAIDE.pointer.addMouseListener("mousedown", self.sMouseOutFunc); }, 0);
	},
	syncInputToBox: function () {
		this.textStr = this.inputBox.value;
	},
	publishEvent: function (type, _useCapture) {
		var useCapture = _useCapture !== undefined ? _useCapture : true;
		var listener = useCapture ? this.captureListener : this.bubblesListener;
		var listenerArray = listener[type];
		if (listenerArray !== undefined) {
			for (var i = 0; i < listenerArray.length; i++) {
				listenerArray[i].call(this);
			}
		}
	},
	focus: function () {
		if (this.useable) {
			this.sMouseDownFunc();
		}
	},
	blur: function () {
		this.sMouseOutFunc();
	},
	onBlur: function () {
		this.publishEvent("onblur", true);
		this.publishEvent("onblur", false);
	},
	clear: function () {
		this.textStr = "";
		this.inputBox.value = "";
	},
	setAble: function (_boo) {
		this.useable = !!_boo ? true : false;
	},
	setPasswordStyle: function (_str) {
		this.passwordStyle = _str;
	},
	getPasswordStyle: function () {
		return this.passwordStyle;
	},
	resetPasswordStyle: function () {
		this.passwordStyle = "●";
	},
	addText: function (_str) {
		this.textStr += _str;
	},
	removeText: function () {
		this.textStr = "";
	},
	getValue: function () {
		return this.textStr;
	},
	updata: function () { },
	draw: function (canvas, ctx, renderer) {
		if (this.inputBox.style.display != "none") return;
		ctx.save();
		ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
		if (this.rotate != 0) {
			ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
			ctx.rotate(this.rotate * Math.PI / 180);
			ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
		}
		var width = !!this.special.width ? this.special.width : 100,
			height = !!this.special.height ? this.special.height : 36;

		var graphVertexs = [[0, 0], [width, 0], [width, height], [0, height]];

		var proto = {
			graphVertexs: graphVertexs,
			alpha: this.alpha,
			lineWidth: this.borderWidth,
			lineCap: this.lineCap,
			strokeStatus: true,
			strokeStyle: this.borderColor,
			fillStatus: true,
			fillStyle: this.backgroundColor,
			closeStatus: this.closeStatus,
			lineDash: this.borderDash
		};
		if (this.borderWidth <= 0) {
			proto.strokeStatus = false;
		}
		if (this.backgroundColor == "none") {
			proto.fillStatus = false;
		}
		renderer.drawLines(proto);
		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.clip();
		var textWidth = this.maxLength * this.fontSize;
		if (this.textStr != "") {
			var showText = this.textStr;
			if (this.inputType == "password") {
				showText = new Array(this.textStr.length).fill(this.passwordStyle).join("");
			}
			var textAlign = "left";
			var position = { x: this.borderWidth / 2 + 2, y: height / 2 + this.fontSize / 2 - 2 };
			if (textWidth > MYAIDE.Math.getTrueLength(this.textStr) + 2) {
				textAlign = this.textAlign;
				position = this.textAlign == "left" ? { x: this.borderWidth / 2 + 2, y: height / 2 + this.fontSize / 2 - 2 } : (this.textAlign == "center" ? { x: this.borderWidth / 2 + width / 2, y: height / 2 + this.fontSize / 2 - 2 } : { x: this.borderWidth / 2 + width, y: height / 2 + this.fontSize / 2 - 2 });
			}

			var proto = {
				txt: showText,
				alpha: this.alpha,
				position: position,
				special: { width: textWidth, height: height },
				textAlign: textAlign,
				font: this.font,
				lineWidth: this.lineWidth,
				font: this.font,
				fontSize: this.fontSize,
				fontFamily: this.fontFamily,
				fillStyle: this.fillStyle,
				strokeStyle: this.strokeStyle,
				textBaseline: this.textBaseline,
				fillType: this.fillType,
				shadow: this.shadow,
				shadowColor: this.shadowColor,
				shadowOffsetX: this.shadowOffsetX,
				shadowOffsetY: this.shadowOffsetY,
				shadowBlur: this.shadowBlur
			};
			renderer.renderDrawTextFunc(proto);
		}

		ctx.restore();
	}
});

MYAIDE.Select = function (_parameters) {
	var self = this;
	var parameters = _parameters || {};
	MYAIDE.Text.call(this, parameters);
	this.type = "Select";

	this.size = parameters.size !== undefined ? parameters.size : 5;
	this.options = parameters.options !== undefined ? parameters.options : [];
	this.size = this.size > this.options.length ? this.options.length : this.size;
	this.check = parameters.check !== undefined ? parameters.check : 0;

	this.special.width = this.special.width == 0 ? 20 : this.special.width;
	this.special.height = this.special.height == 0 ? 20 : this.special.height;

	this.radius = parameters.radius !== undefined ? parameters.radius : 5;

	this.fontSize = parameters.fontSize !== undefined ? parameters.fontSize : (!!this.font ? this.getFontSize(this.font) : 24);
	this.optionAdd = 2;

	this.background = parameters.background !== undefined ? parameters.background : "#fff";
	this.focusBackground = parameters.focusBackground !== undefined ? parameters.focusBackground : "#1E90FF";
	this.borderColor = parameters.borderColor !== undefined ? parameters.borderColor : "#999999";

	this.dom = new MYAIDE.Animal({ name: this.name, x: this.position.x, y: this.position.y });

	this.selectLayer = new MYAIDE.Animal({ name: "selectLayer", listenerStatus: true, width: this.special.width, height: this.special.height, overflow: "hidden" });
	this.selectBg = new MYAIDE.RectangleRoundGraphics({ fillStyle: this.background, fillStatus: true, strokeStatus: true, strokeStyle: this.borderColor, radius: this.radius, width: this.special.width, height: this.special.height });
	var txtPara = Object.assign(parameters, { x: 5, y: 0, txt: this.options[this.check], lineHeight: this.special.height / 2 + this.fontSize / 3, zIndex: 10, fontSize: this.fontSize, textBaseline: "top" });
	this.selectText = new MYAIDE.Text(txtPara);
	this.selectBtn = new MYAIDE.RegularPolygonGraphics({
		centre: [0, 0], edges: 3, rotate: 60, fillStyle: "#000000", fillStatus: true,
		radius: this.radius, x: this.special.width - 20, y: this.special.height / 2, zIndex: 10
	});

	this.selectLayer.addListener("mousedown", function () {
		if (self.optionLayer.dom.visible) {
			self.publishEvent("onblur", true);
			self.publishEvent("onblur", false);
		} else {
			self.hoverOption(self.check);
			self.publishEvent("onfocus", true);
			self.publishEvent("onfocus", false);

		}

		self.optionLayer.showHide();
	});

	this.selectLayer.add(this.selectBg, this.selectText, this.selectBtn);

	//option
	this.optionDom = new MYAIDE.Animal({ name: "testDom", width: this.special.width, height: this.options.length * (this.fontSize + this.optionAdd) });

	this.optionBg = new MYAIDE.RectangleRoundGraphics({ fillStyle: this.background, fillStatus: true, ghost: true, strokeStatus: true, strokeStyle: this.borderColor, radius: this.radius, width: this.special.width, height: this.options.length * (this.fontSize + this.optionAdd) });
	this.optionList = new MYAIDE.Animal({ width: this.special.width, height: this.options.length * (this.fontSize + this.optionAdd), zIndex: 10 });
	this.optionDom.add(this.optionBg, this.optionList);

	var scrollBtnHeight = (this.size * (this.fontSize + this.optionAdd) - 2 * 20) * this.size / this.options.length;

	this.optionLayer = new MYAIDE.ScrollTool({ y: this.special.height, mc: this.optionDom, width: this.special.width, height: this.size * (this.fontSize + this.optionAdd), fontSize: this.fontSize, scrollBtnHeight: scrollBtnHeight });
	this.updataOption();
	if (this.size >= this.options.length) {
		this.optionLayer.hideBtn();
	} else {
		this.optionLayer.showBtn();
	}
	this.optionLayer.hide();
	this.dom.add(this.selectLayer, this.optionLayer.dom);
}
MYAIDE.Select.prototype = Object.assign(Object.create(MYAIDE.Animal.prototype), {
	constructor: MYAIDE.Select,
	updataOption: function () {
		var self = this;
		this.optionList.removeAll();
		var hoverY = parseInt(this.fontSize / 10) + 1;
		for (var i = 0; i < this.options.length; i++) {
			var y = i * (this.fontSize + this.optionAdd);
			var option = new MYAIDE.Animal({ name: "option_" + i, y: y, width: this.special.width, height: this.fontSize + 3, listenerStatus: true });
			var optionHover = new MYAIDE.RectangleRoundGraphics({ name: "hover", y: hoverY, ghost: true, width: this.special.width, height: this.fontSize, fillStatus: true, strokeStatus: false, fillStyle: this.focusBackground, radius: 2, visible: false });
			var optionHtml = new MYAIDE.Text({ name: "txt", ghost: true, txt: this.options[i], x: 5, y: 0, lineWidth: this.special.height / 2 + this.fontSize / 4, width: this.special.width, fillStyle: "#000000", font: this.fontSize + "px Arial", fontSize: this.fontSize, textAlign: "left", indent: true, zIndex: 10, textBaseline: "top" });
			option.add(optionHover, optionHtml);
			this.optionList.add(option);
			option.setAttr("index", i);
			option.addListener("mousemove", function () {
				var index = this.getAttr("index");
				self.hoverOption(index);
			});
			option.addListener("mousedown", function () {
				var index = this.getAttr("index");
				self.hoverOption(index);
				self.check = index;
				self.selectText.setText(self.optionList.children[index].getChildren("txt").getText());
				self.optionLayer.hide();
				self.publishEvent("onchange", true);
				self.publishEvent("onchange", false);
				self.publishEvent("onblur", true);
				self.publishEvent("onblur", false);
			});
		}
	},
	hoverOption: function (index) {
		for (var i = 0; i < this.optionList.children.length; i++) {
			if (i == index) {
				this.optionList.children[i].getChildren("hover").visible = true;
			} else {
				this.optionList.children[i].getChildren("hover").visible = false;
			}
		}
	},
	changeSize: function (num) {
		var size = MYAIDE.Math.clamp(size, 1, this.options.length);
		this.size = size;
		if (this.size >= this.options.length) {
			this.optionLayer.hideBtn();
		} else {
			this.optionLayer.showBtn();
		}
	},
	getSelectedIndex: function () {
		return this.check;
	},
	setSelectedIndex: function (index) {
		var index = MYAIDE.Math.clamp(index, 0, this.options.length - 1);
		this.check = index;
	},
	getSelectedText: function () {
		return this.options[this.check];
	},
	publishEvent: function (type, _useCapture) {
		var useCapture = _useCapture !== undefined ? _useCapture : true;
		var listener = useCapture ? this.captureListener : this.bubblesListener;
		var listenerArray = listener[type];
		if (listenerArray !== undefined) {
			for (var i = 0; i < listenerArray.length; i++) {
				listenerArray[i].call(this);
			}
		}
	},
});

MYAIDE.ScrollTool = function (_parameters) {
	var self = this;
	var parameters = _parameters || {};
	MYAIDE.Animal.call(this, parameters);
	this.type = "ScrollTool";
	//滚轮宽度
	this.scrollWidth = parameters.scrollWidth !== undefined ? parameters.scrollWidth : 20;
	this.scrollBtnHeight = parameters.scrollBtnHeight !== undefined ? parameters.scrollBtnHeight : this.scrollWidth;
	this.radius = parameters.radius !== undefined ? parameters.radius : 5;

	this.minBtn = this.scrollWidth;
	this.maxBtn = this.special.height - this.scrollWidth - this.scrollBtnHeight;
	this.scrollChange = 0;

	this.mouseData = [0, 0];
	this.scrolling = false;

	this.mc = parameters.mc;
	//滚轮是否在内方向
	this.direction = parameters.direction !== undefined ? parameters.direction : true;

	this.dom = new MYAIDE.Animal({ name: this.name, x: this.position.x, y: this.position.y, width: this.direction ? this.special.width : this.special.width + this.scrollWidth, height: this.special.height, overflow: "hidden" });

	this.scrollLayer = new MYAIDE.RectangleRoundGraphics({ x: this.direction ? this.special.width - this.scrollWidth : this.special.width, y: 0, fillStyle: "#FFFFFF", fillStatus: true, zIndex: this.mc.zIndex + 10, strokeStatus: true, strokeStyle: "#999999", radius: this.radius, width: this.scrollWidth, height: this.special.height });
	this.upBtn = new MYAIDE.RectangleRoundGraphics({ fillStyle: "#FFFFFF", fillStatus: true, listenerStatus: true, strokeStatus: true, strokeStyle: "#999999", radius: this.radius, width: this.scrollWidth, height: this.scrollWidth });
	this.upBtn.add(new MYAIDE.RegularPolygonGraphics({ edges: 3, rotate: 0, fillStatus: true, radius: this.radius, x: this.scrollWidth / 2, y: this.scrollWidth / 2 }));
	this.downBtn = new MYAIDE.RectangleRoundGraphics({ y: this.special.height - this.scrollWidth, fillStyle: "#FFFFFF", fillStatus: true, listenerStatus: true, strokeStatus: true, strokeStyle: "#999999", radius: this.radius, width: this.scrollWidth, height: this.scrollWidth });
	this.downBtn.add(new MYAIDE.RegularPolygonGraphics({ edges: 3, rotate: 60, fillStatus: true, radius: this.radius, x: this.scrollWidth / 2, y: this.scrollWidth / 2 }));
	this.scrollBtn = new MYAIDE.RectangleRoundGraphics({ y: this.scrollWidth, fillStyle: "#C1C1C1", fillStatus: true, listenerStatus: true, strokeStatus: true, strokeStyle: "#999999", radius: this.radius, width: this.scrollWidth, height: this.scrollBtnHeight });

	this.scrollLayer.addMotionFunc("enterframe", function () {
		if (self.scrollChange == 0) return;
		self.changeScrollMC(self.scrollChange);
	});
	this.upBtn.addListener("mousedown", function () {
		self.scrollChange = 1;
	});
	this.downBtn.addListener("mousedown", function () {
		self.scrollChange = -1;
	});
	MYAIDE.pointer.addMouseListener("mouseup", function (e, data) {
		self.scrollChange = 0;
		self.scrolling = false;
	});
	MYAIDE.pointer.addMouseListener("mousemove", function (e, data) {
		if (!self.scrolling) return;
		var dy = data.y - self.mouseData[1];
		self.changeScrollBtn(dy);
		self.mouseData = [data.x, data.y];
	});
	this.scrollBtn.addListener("mousedown", function (e, data) {
		self.scrollChange = 0;
		self.scrolling = true;
		self.mouseData = [data.x, data.y];
	});

	this.scrollLayer.add(this.upBtn, this.downBtn, this.scrollBtn);
	this.dom.add(this.mc, this.scrollLayer);
}
MYAIDE.ScrollTool.prototype = Object.assign(Object.create(MYAIDE.Animal.prototype), {
	constructor: MYAIDE.ScrollTool,
	hideBtn: function () {
		this.scrollLayer.visible = false;
	},
	showBtn: function () {
		this.scrollLayer.visible = true;
	},
	hide: function () {
		this.dom.visible = false;
	},
	show: function () {
		this.dom.visible = true;
	},
	showHide: function () {
		this.dom.visible = !this.dom.visible;
	},
	changeScrollBtn: function (num) {
		if (num == 0) return;
		var py, by = this.scrollBtn.position.y;
		by = by + num;
		by = MYAIDE.Math.clamp(by, this.minBtn, this.maxBtn);
		var progress = (by - this.minBtn) / (this.maxBtn - this.minBtn);

		var maxScroll = this.mc.special.height - this.dom.special.height;
		py = - parseInt(maxScroll * progress);
		py = MYAIDE.Math.clamp(py, this.dom.special.height - this.mc.special.height, 0);

		this.mc.position.y = py;
		this.scrollBtn.position.y = by;
	},
	changeScrollMC: function (num) {
		if (num == 0) return;
		var py = this.mc.position.y, by;

		py = py + num;
		var maxY = 0, minY = this.dom.special.height - this.mc.special.height;
		py = MYAIDE.Math.clamp(py, minY, maxY);

		var progress = 1 - (py - minY) / (maxY - minY);
		by = parseInt((this.maxBtn - this.minBtn) * progress) + this.minBtn;
		by = MYAIDE.Math.clamp(by, this.minBtn, this.maxBtn);

		this.mc.position.y = py;
		this.scrollBtn.position.y = by;
	}
});

MYAIDE.TextArea = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Text.call(this, parameters);
	this.type = "TextArea";

	this.textStr = parameters.txt !== undefined ? [parameters.txt] : [];
	this.showArr = [];
	this.txtChange = true;
	this.inputToBox = true;
	this.boxToInput = true;
	this.showEnd = parameters.showEnd !== undefined ? parameters.showEnd : true;

	this.backgroundColor = parameters.backgroundColor !== undefined ? parameters.backgroundColor : "#fff";
	this.borderWidth = parameters.borderWidth !== undefined ? parameters.borderWidth : 1;
	this.borderDash = parameters.borderDash !== undefined ? parameters.borderDash : [];
	this.borderColor = parameters.borderColor !== undefined ? parameters.borderColor : "#000";

	this.cols = parameters.cols !== undefined ? parameters.cols : -1;
	this.rows = parameters.rows !== undefined ? parameters.rows : -1;

	var w = parameters.width !== undefined ? parameters.width : (this.cols > 0 ? this.cols * (this.fontSize / 2) : 120),
		h = parameters.height !== undefined ? parameters.height : (this.rows > 0 ? this.rows * this.lineHeight : 36);
	this.special = { width: w, height: h };
	this.lineWidth = parameters.lineWidth !== undefined ? parameters.lineWidth : w;
	this.cols < 0 ? this.cols = parseInt(this.lineWidth / (this.fontSize / 2)) : "";
	this.rows < 0 ? this.rows = parseInt(h / this.lineHeight) : "";

	this.listenerStatus = true;
	this.captureListener = {
		mousedown: [this.sMouseDownFunc]
	};
	this.maxLength = parameters.maxLength !== undefined ? parameters.maxLength : 255;
	this.useable = parameters.useable !== undefined ? parameters.useable : true;

	this.inputBox = document.createElement("textarea");

	this.currentScroll = 0;
	this.scrollStatus = false;
	this.resize = false;

	this.isDrawFunc = true;
	this.renderDraw = false;

};
MYAIDE.TextArea.prototype = Object.assign(Object.create(MYAIDE.Text.prototype), {
	constructor: MYAIDE.TextArea,
	sMouseDownFunc: function () {
		var self = this;
		if (!this.useable) return;
		this.inputBox.type = this.inputType;
		this.inputBox.style.display = "";
		if (this.inputToBox) {
			this.inputBox.value = this.textStr.join("\n");
		}
		this.inputBox.style.textAlign = this.textAlign;
		this.inputBox.style.position = "absolute";
		this.inputBox.style.fontSize = this.fontSize + "px";
		this.inputBox.style.width = this.scrollStatus ? (this.special.width + this.fontSize) + "px" : this.special.width + "px";
		this.inputBox.style.padding = "none";
		this.inputBox.style.height = this.special.height + "px";
		this.inputBox.style.borderWidth = this.borderWidth + "px";
		this.inputBox.style.borderColor = this.borderColor;
		this.inputBox.style.color = this.fillStyle;
		this.inputBox.style.lineHeight = this.lineHeight + "px";
		this.inputBox.style.background = this.backgroundColor;
		this.resize ? "" : this.inputBox.style.resize = "none";
		this.inputBox.maxLength = this.maxLength;
		this.inputBox.onchange = function () {
			self.publishEvent("onchange", true);
			self.publishEvent("onchange", false);
		}
		self.publishEvent("onfocus", true);
		self.publishEvent("onfocus", false);

		var inputLeft = MYAIDE.Math.getPositionX(this),
			inputTop = MYAIDE.Math.getPositionY(this);
		this.inputBox.style.left = inputLeft + "px";
		this.inputBox.style.top = inputTop + "px";
		MYAIDE.WorkInfo.canvas.parentNode.appendChild(this.inputBox);
		this.inputOpenStatus = true;
		this.inputBox.focus();
		setTimeout(function () { MYAIDE.pointer.addMouseListener("mousedown", sMouseOutFunc); }, 0);
		function sMouseOutFunc(data) {
			self.inputOpenStatus = false;
			if (self.boxToInput) self.boxToInputFunc();
			self.inputBox.style.display = "none";
			MYAIDE.pointer.removeMouseListener("mousedown", sMouseOutFunc);
			self.onBlur();
		}
	},
	publishEvent: function (type, _useCapture) {
		var useCapture = _useCapture !== undefined ? _useCapture : true;
		var listener = useCapture ? this.captureListener : this.bubblesListener;
		var listenerArray = listener[type];
		if (listenerArray !== undefined) {
			for (var i = 0; i < listenerArray.length; i++) {
				listenerArray[i].call(this);
			}
		}
	},
	focus: function () {
		if (this.useable) {
			this.sMouseDownFunc();
		}
	},
	blur: function () {
		if (!this.inputOpenStatus) return;
		this.inputOpenStatus = false;
		this.textStr = this.inputBox.value;
		this.inputBox.style.display = "none";
		var data = {
			status: false,
			type: 0,
			x: 0,
			y: 0,
			btnList: []
		};
		MYAIDE.pointer.mouseListenerUI("mousedown", data);
		this.onBlur();
	},
	onBlur: function () {
		this.publishEvent("onblur", true);
		this.publishEvent("onblur", false);
	},
	boxToInputFunc: function () {
		var nValue = this.inputBox.value;
		var nArr = nValue.split("\n");
		this.textStr = nArr;
		this.txtChange = true;
	},
	setAble: function (_boo) {
		this.useable = !!_boo ? true : false;
	},
	setText: function (txt) {
		if (Array.isArray(txt)) {
			this.textStr = txt;
		} else {
			this.textStr = [txt];
		}
		this.txtChange = true;
	},
	addText: function (_str) {
		this.textStr.push(_str);
		this.txtChange = true;
	},
	removeText: function () {
		this.textStr = [];
	},
	clear: function () {
		this.textStr = [];
		this.inputBox.value = "";
	},
	countTxtArr: function () {
		var showArr = [];
		for (var i = 0, len = this.textStr.length; i < len; i++) {
			if (MYAIDE.Math.getTrueLength(this.textStr[i]) > this.cols) {
				var nArr = this.textStr[i].split("");
				var nCols = 0, nStr = "";
				for (var j = 0, len2 = nArr.length; j < len2; j++) {
					nStr += nArr[j];
					nCols += MYAIDE.Math.getTrueLength(nArr[j]);
					if (nCols >= this.cols || (j != nArr.length - 1 && nCols + MYAIDE.Math.getTrueLength(nArr[j + 1]) >= this.cols) || j == nArr.length - 1) {
						showArr.push(nStr);
						nStr = "";
						nCols = 0;
					}
				}
			} else {
				showArr.push(this.textStr[i]);
			}
		}
		this.showArr = showArr;
		this.scrollStatus = this.showArr.length > this.rows ? true : false;
		if (this.showEnd) {
			this.currentScroll = this.showArr.length > this.rows ? this.showArr.length - this.rows : 0;
		} else {
			this.currentScroll = 0;
		}
		this.txtChange = false;
	},
	draw: function (canvas, ctx, renderer) {
		ctx.save();
		ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
		if (this.rotate != 0) {
			ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
			ctx.rotate(this.rotate * Math.PI / 180);
			ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
		}
		var width = !!this.special.width ? this.special.width : 100,
			height = !!this.special.height ? this.special.height : 36;

		var graphVertexs = [[0, 0], [width, 0], [width, height], [0, height]];

		var proto = {
			graphVertexs: graphVertexs,
			alpha: this.alpha,
			lineWidth: this.borderWidth,
			lineCap: this.lineCap,
			strokeStatus: true,
			strokeStyle: this.borderColor,
			fillStatus: true,
			fillStyle: this.backgroundColor,
			closeStatus: this.closeStatus,
			lineDash: this.borderDash
		};
		if (this.borderWidth <= 0) {
			proto.strokeStatus = false;
		}
		if (this.backgroundColor == "#fff") {
			proto.fillStatus = false;
		}
		renderer.drawLines(proto);
		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.clip();
		if (this.txtChange) this.countTxtArr();
		if (this.textStr.length > 0) {
			var proto = {
				txt: "",
				alpha: this.alpha,
				position: { x: 0, y: 0 },
				special: { width: width, height: height },
				textAlign: this.textAlign,
				font: this.font,
				lineWidth: this.lineWidth,
				font: this.font,
				fontSize: this.fontSize,
				fontFamily: this.fontFamily,
				fillStyle: this.fillStyle,
				strokeStyle: this.strokeStyle,
				textBaseline: this.textBaseline,
				fillType: this.fillType,
				shadow: this.shadow,
				shadowColor: this.shadowColor,
				shadowOffsetX: this.shadowOffsetX,
				shadowOffsetY: this.shadowOffsetY,
				shadowBlur: this.shadowBlur
			};

			var maxLine = this.rows > this.showArr.length - this.currentScroll ? this.showArr.length : this.rows + this.currentScroll;
			var addY = this.textBaseline == "alphabetic" ? this.fontSize * 0.8 : (this.textBaseline == "hanging" ? parseInt(this.fontSize * 0.2) : (this.textBaseline == "middle" ? parseInt(this.fontSize / 2) : (this.textBaseline == "bottom" ? this.fontSize : 0)));
			proto.position.x = proto.textAlign == "center" ? proto.position.x + width / 2 : (proto.textAlign == "right" ? proto.position.x + width : proto.position.x);
			for (var i = this.currentScroll; i < maxLine; i++) {
				proto.position.y = (i - this.currentScroll) * this.lineHeight + addY;
				proto.txt = this.showArr[i];
				renderer.renderDrawTextFunc(proto);
			}
		}

		if (this.children.length > 0) {
			for (var i = 0, len = this.children.length; i < len; i++) {
				renderer.renderDraw(this.children[i]);
			}
		}
		ctx.restore();
	}
});

MYAIDE.TimeText = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Text.call(this, parameters);

	this.type = "TimeText";

	this.timeDirection = parameters.timeDirection !== undefined ? parameters.timeDirection : true;
	this.startTime = parameters.startTime !== undefined ? parameters.startTime : 0;
	this.currentTime = this.startTime;
	this.endTime = parameters.endTime !== undefined ? parameters.endTime : 100;
	this.endTimeStatus = parameters.endTime !== undefined ? true : false;

	this.clocker = new MYAIDE.Clock();
	this.runTime = 0;
	this.runing = false;
	this.unit = parameters.unit !== undefined ? parameters.unit : 1000;
	this.staticFunc = function (time) { return time; };
	this.showFunc = parameters.showFunc !== undefined ? parameters.showFunc : this.staticFunc;
	this.updataFunc = parameters.updataFunc !== undefined ? parameters.updataFunc : function () { };
	this.callBack = parameters.callBack !== undefined ? parameters.callBack : function () { };

	this.isDrawFunc = true;
	this.renderDraw = false;
};
MYAIDE.TimeText.prototype = Object.assign(Object.create(MYAIDE.Text.prototype), {
	constructor: MYAIDE.TimeText,
	getTimeDirection: function () {
		return this.timeDirection;
	},
	setTimeDirection: function (_boo) {
		var boo = _boo !== undefined ? _boo : true;
		this.timeDirection = boo;
	},
	getCurrentTime: function () {
		return this.currentTime;
	},
	setCurrentTime: function (num) {
		if (!isNaN(num)) {
			this.currentTime = num;
		}
	},
	changeShowFunc: function (_func) {
		if (typeof _func == "function") {
			this.showFunc = _func;
		}
	},
	changeUpdataFunc: function (_func) {
		if (typeof _func == "function") {
			this.updataFunc = _func;
		}
	},
	changeCallBack: function (_func) {
		if (typeof _func == "function") {
			this.callBack = _func;
		}
	},
	getEndTime: function () {
		return this.endTime;
	},
	setEndTime: function (num) {
		if (!isNaN(num)) {
			this.endTime = num;
		}
	},
	play: function () {
		this.clocker.resetClock();
		this.runing = true;
	},
	stop: function () {
		this.runing = false;
	},
	reset: function () {
		this.currentTime = this.startTime;
	},
	updataTime: function () {
		if (this.runing) {
			var goTime = this.clocker.getDelta() * 1000;
			this.runTime += goTime;
			if (this.runTime > this.unit) {
				if (this.timeDirection) {
					this.currentTime++;
				} else {
					this.currentTime--;
				}
				if (this.endTimeStatus) {
					if (this.timeDirection && this.currentTime >= this.endTime) {
						this.callBack(this.currentTime);
						this.runing = false;
					} else
						if (!this.timeDirection && this.currentTime <= this.endTime) {
							this.callBack(this.currentTime);
							this.runing = false;
						} else {
							this.updataFunc(this.currentTime);
						}
				} else {
					this.updataFunc(this.currentTime);
				}
				this.runTime = this.runTime % this.unit;
			}
		}
	},
	draw: function (canvas, ctx, renderer) {
		this.updataTime();
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);

			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}

			var str = this.showFunc(this.currentTime);
			str = str.toString();
			var width = str.length * this.fontSize,
				height = this.special.height == null ? 18 : this.lineHeight;

			var special = { width: width, height: height };

			var proto = {
				txt: str.toString(),
				special: special,
				rotatePoint: this.rotatePoint,
				textAlign: this.textAlign,
				font: this.font,
				fontSize: this.fontSize,
				fontFamily: this.fontFamily,
				fillStyle: this.fillStyle,
				fillType: this.fillType
			};

			renderer.renderDrawTextFunc(proto);

			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}
			ctx.restore();
		}
	}
});
MYAIDE.HtmlText = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Text.call(this, parameters);
	this.type = "HtmlText";

	this.htmlText = parameters.htmlText !== undefined ? parameters.htmlText : "";

	this.styleIndex = 0;
	this.styles = {};

	this.isDrawFunc = true;
	this.renderDraw = false;
}

MYAIDE.HtmlText.prototype = Object.assign(Object.create(MYAIDE.Text.prototype), {
	constructor: MYAIDE.HtmlText,
	setText: function (_str) {
		this.htmlText = _str.toString();
	},
	getText: function () {
		return this.htmlText;
	},
	addText: function (_str) {
		this.htmlText += _str;
	},
	updata: function () { },
	removeText: function () {
		this.htmlText = null;
		this.special.width = this.special.height = 0;
	},
	setStyle: function (styleName, styleObject) {
		if (styleObject == undefined) return;
		this.styleIndex++;
		var arr = styleObject.replace(/(^\{)|(\}$)/g, "").split(";");
		styleObject = {};
		for (var i = 0, len = arr.length; i < len; i++) {
			if (!arr[i]) continue;
			var styleObjects = arr[i].split(":");
			if (!styleObjects[0]) continue;
			styleObject[styleObjects[0]] = styleObjects[1];
		}
		this.styles[styleName] = styleObject;
	},
	getStyle: function (styleName) {
		return this.styles[styleName];
	},
	removeStyle: function (styleName) {
		delete this.styles[styleName];
	},
	removeAllStyle: function () {
		this.styles = {};
	},
	_getStyleSheet: function (textFormat, tabName, attribute, text) {
		var pattern, tf = textFormat.clone();
		if (tabName == "font") {
			var i = 0;
			while (attribute) {
				if (i++ > 4) break;
				pattern = /(([^\s]*?)(\s*)=(\s*)("|')(.*?)\5)*/g;
				var arr = pattern.exec(attribute);
				if (!arr || !arr[0]) break;
				switch (arr[2]) {
					case "face":
						tf.font = arr[6];
						break;
					case "color":
						tf.color = arr[6];
						break;
					case "size":
						tf.size = arr[6];
						break;
				}
				attribute = attribute.replace(arr[0], "").replace(/(^\s*)|(\s*$)|(\n)/g, "");
			}
		} else if (tabName == "b") {
			tf.bold = true;
		} else if (tabName == "u") {
			tf.underline = true;
		} else if (tabName == "i") {
			tf.italic = true;
		} else if (tabName == "p" && this.wordWrap) {
			text = "\n" + text + "\n";
		} else if (this.styles) {
			var sheetObj;
			if (tabName == "span") {
				pattern = /(([^\s]*?)(\s*)=(\s*)("|')(.*?)\5)*/g;
				var arr = pattern.exec(attribute);
				if (arr && arr[0]) {
					switch (arr[2]) {
						case "class":
							sheetObj = this.getStyle("." + arr[6]);
							break;
					}
				}
			} else if (this.getStyle(tabName)) {
				sheetObj = this.getStyle(tabName);
			}
			if (sheetObj) {
				tf.setCss(sheetObj);
			}
		}
		this._getHtmlText(tf, text);
	},
	_getHtmlText: function (tf, text) {
		if (!text) return;
		var tabName, content, start, end, pattern = /<(.*?)(\s*)(.*?)>(.*?)<\/\1>/g, arr = pattern.exec(text);
		if (!arr || !arr[0]) { //匹配不到时，把剩下的内容放入_htmlTexts
			this._htmlTexts.push({
				textFormat: tf.clone(),
				text: text
			});
			return;
		}
		if (arr.index > 0) { //匹配到的内容放入_htmlTexts
			this._htmlTexts.push({
				textFormat: tf.clone(),
				text: text.substring(0, arr.index)
			});
		}
		tabName = arr[1];
		start = arr.index;
		end = start;
		do {
			end = text.indexOf("</" + tabName, end + 1);
			start = text.indexOf("<" + tabName, start + 1);
		} while (start > 0 && start < end);
		content = text.substring(text.indexOf(">", arr.index) + 1, end);
		this._getStyleSheet(tf, tabName, arr[3], content);
		this._getHtmlText(tf, text.substring(end + tabName.length + 3));
	},

	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);

			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}
			var tf = this.TextFormat({ font: this.fontFamily, size: this.fontSize, color: this.strokeStyle });
			this._htmlTexts = [];
			this._htmlText = this.htmlText;
			this._getHtmlText(tf, this.htmlText);

			var xlen = 0;
			var This = this;
			var height = This.lineHeight;
			for (var i in This._htmlTexts) if (This._htmlTexts[i].textFormat && height < parseInt(This._htmlTexts[i].textFormat.size)) height = parseInt(This._htmlTexts[i].textFormat.size);
			this.special.height = height;
			for (var i in This._htmlTexts) {
				(function (i) {
					var tf = This._htmlTexts[i].textFormat;
					if (tf) {
						ctx.save();
						var str = This._htmlTexts[i].text.toString();
						ctx.lineWidth = This.lineWidth;
						ctx.textBaseline = This.textBaseline;
						ctx.font = (!!tf.italic ? "italic " : "") + (!!tf.bold ? "bold " : "") + tf.size + "px " + tf.font;
						ctx.fillStyle = tf.color;
						var width = ctx.measureText(str).width;

						ctx.fillText(str, xlen, height);
						if (tf.underline) {
							var underlineY = { "alphabetic": 0, "top": 1, "bottom": -0.2, "middle": 0.4, "hanging": 0.8 };
							ctx.beginPath();
							ctx.lineWidth = 1;
							ctx.strokeStyle = ctx.fillStyle;
							var uY = height + ctx.measureText("O").width * 1.2 * underlineY[ctx.textBaseline];
							ctx.moveTo(xlen, uY);
							ctx.lineTo(xlen + width, uY);
							ctx.stroke();
						}
						xlen += width;
						ctx.restore();
					}
				})(i);
			}
			this.special.width = xlen;
			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}
			ctx.restore();
		}
	},
	TextFormat: function (_parameters) {
		var parameters = _parameters || {};
		var This = {}, s = this;
		This.font = parameters.font !== undefined ? parameters.font : "Arial";
		This.size = parameters.size !== undefined ? parameters.size : 15;
		This.color = parameters.color !== undefined ? parameters.color : "#000000";
		This.bold = parameters.bold !== undefined ? parameters.bold : false;
		This.italic = parameters.italic !== undefined ? parameters.italic : false;
		This.underline = parameters.underline !== undefined ? parameters.underline : false;

		This.clone = function () {
			var _par = {
				font: This.font,
				size: This.size,
				color: This.color,
				bold: This.bold,
				italic: This.italic,
				underline: This.underline
			}
			return s.TextFormat(_par);
		},
			This.getFontText = function () {
				return (This.italic ? "italic " : "") + (This.bold ? "bold " : "") + This.size + "px " + This.font;
			},
			This.setCss = function (css) {
				for (var k in css) {
					switch (k) {
						case "color":
							This.color = css[k];
							break;
						case "font-family":
							This.font = css[k];
							break;
						case "font-size":
							This.size = css[k];
							break;
						case "font-style":
							This.italic = (css[k] == "italic");
							break;
						case "font-weight":
							This.bold = (css[k] == "bold");
							break;
						case "text-decoration":
							This.underline = (css[k] == "underline");
							break;
					}
				}
			}
		return This;
	}
});
MYAIDE.Graphics = function (_parameters) {

	var parameters = _parameters || {};

	MYAIDE.Animal.call(this, parameters);

	this.type = "Graphics";
	this.graphVertexs = parameters.graphVertexs !== undefined ? parameters.graphVertexs : [];
	this.closeStatus = parameters.closeStatus !== undefined ? parameters.closeStatus : true;
	this.strokeStatus = parameters.strokeStatus !== undefined ? parameters.strokeStatus : true;
	this.strokeStyle = parameters.strokeStyle !== undefined ? parameters.strokeStyle : "#000";
	this.lineWidth = parameters.lineWidth !== undefined ? parameters.lineWidth : 1;
	this.lineCap = parameters.lineCap !== undefined ? parameters.lineCap : "butt";
	this.fillStatus = parameters.fillStatus !== undefined ? parameters.fillStatus : false;
	this.fillStyle = parameters.fillStyle !== undefined ? parameters.fillStyle : "#000";
	this.lineDash = parameters.lineDash !== undefined ? parameters.lineDash : [];

	this.pathStatus = parameters.pathStatus !== undefined ? parameters.pathStatus : false;
	this.pathFunc = parameters.pathFunc !== undefined ? parameters.pathFunc : function () { return false };

	this.gradientStatus = parameters.gradientStatus !== undefined ? parameters.gradientStatus : false;
	this.gradient = parameters.gradient !== undefined ? parameters.gradient : null;

	this.shadow = parameters.shadow !== undefined ? parameters.shadow : false;
	this.shadowColor = parameters.shadowColor !== undefined ? parameters.shadowColor : "#000";
	this.shadowOffsetX = parameters.shadowOffsetX !== undefined ? parameters.shadowOffsetX : 0;
	this.shadowOffsetY = parameters.shadowOffsetY !== undefined ? parameters.shadowOffsetY : 0;
	this.shadowBlur = parameters.shadowBlur !== undefined ? parameters.shadowBlur : 0;

	this.reverseStatus = true;
	this.reverse_X = false;
	this.reverseCenterX = 0;
	this.reverse_Y = false;
	this.reverseCenterY = 0;

	this.isDrawFunc = true;
	this.renderDraw = false;
};

MYAIDE.Graphics.prototype = Object.assign(Object.create(MYAIDE.Animal.prototype), {
	constructor: MYAIDE.Graphics,
	setGraphVertexs: function (graphVertexs) {
		if (Array.isArray(graphVertexs)) {
			this.graphVertexs = graphVertexs;
		}
	},
	getGraphVertexs: function () {
		return this.graphVertexs;
	},
	isPointInPath: function (x, y) {
		var status = false;
		status = this.pathFunc(x, y);
		return status;
	},
	setPathFunc: function (_func) {
		if (typeof _func == "function") {
			this.pathFunc = _func;
		}
	},
	setLineDash: function (_arr) {
		if (Array.isArray(_arr)) {
			this.lineDash = _arr;
		}
	},
	resetLineDash: function () {
		this.lineDash.splice(0, this.lineDash.length);
	},
	setCloseStatus: function (_boo) {
		if (_boo) {
			this.closeStatus = true;
		} else {
			this.closeStatus = false;
		}
	},
	getCloseStatus: function () {
		return this.closeStatus;
	},
	setFillStyle: function (_style) {
		this.fillStyle = _style !== undefined ? _style : "#000";
	},
	getFillStyle: function () {
		return this.fillStyle;
	},
	setStrokeStyle: function (_style) {
		this.strokeStyle = _style !== undefined ? _style : "#000";
	},
	getStrokeStyle: function () {
		return this.strokeStyle;
	},
	getScalePoints: function (points) {
		return this.getCenterPoint(points);
	},
	getCenterPoint: function (_points) {
		var points = _points || this.graphVertexs;
		var pointX = [0, 0],
			pointY = [0, 0];

		for (var i = 0, len = points.length; i < len; i++) {
			pointX[0] += points[i][0];
			pointY[0] += points[i][1];
			pointX[1] += 1;
			pointY[1] += 1;
		}
		return [parseInt(pointX[0] / pointX[1]), parseInt(pointY[0] / pointY[1])];
	},
	reverseX: function (centerX) {
		if (!this.reverseStatus || !this.reverse_X) return;
		var centerPointX = centerX !== undefined ? centerX : this.getCenterPoint(this.graphVertexs)[0];
		centerPointX = centerPointX * 2;
		for (var i = 0; i < this.graphVertexs.length; i++) {
			this.graphVertexs[i][0] = centerPointX - this.graphVertexs[i][0];
		}
	},
	reverseY: function (centerY) {
		if (!this.reverseStatus || !this.reverse_Y) return;
		var centerPointY = centerY !== undefined ? centerY : this.getCenterPoint(this.graphVertexs)[1];
		centerPointY = centerPointY * 2;
		for (var i = 0; i < this.graphVertexs.length; i++) {
			this.graphVertexs[i][1] = centerPointY - this.graphVertexs[i][1];
		}
	},
	reverse: function (x, y) {
		if (!this.reverseStatus) return;
		var centerX = x !== undefined ? x : this.getCenterPoint(this.graphVertexs)[0],
			centerY = y !== undefined ? y : this.getCenterPoint(this.graphVertexs)[1];
		centerX = centerX * 2;
		centerY = centerY * 2;
		for (var i = 0; i < this.graphVertexs.length; i++) {
			if (this.reverse_X)
				this.graphVertexs[i][0] = centerX - this.graphVertexs[i][0];
			if (this.reverse_Y)
				this.graphVertexs[i][1] = centerY - this.graphVertexs[i][1];
		}
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();

			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}
			if (this.graphVertexs.length > 0) {
				var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
				var proto = {
					graphVertexs: this.graphVertexs,
					alpha: this.alpha,
					lineWidth: this.lineWidth,
					lineCap: this.lineCap,
					strokeStatus: this.strokeStatus,
					strokeStyle: this.strokeStyle,
					fillStatus: this.fillStatus,
					fillStyle: nowFillStyle,
					closeStatus: this.closeStatus,
					lineDash: this.lineDash,
					shadow: this.shadow,
					shadowColor: this.shadowColor,
					shadowOffsetX: this.shadowOffsetX,
					shadowOffsetY: this.shadowOffsetY,
					shadowBlur: this.shadowBlur
				}

				renderer.drawLines(proto);
			}

			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}

			renderer.backBufferCtx.restore();
		}

	}
});

MYAIDE.GridHelper = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Animal.call(this, parameters);

	this.type = "GridHelper";

	this.lineWidth = 1;

	this.size = parameters.size !== undefined ? parameters.size : 300;
	this.step = parameters.step !== undefined ? parameters.step : 50;

	this.axisColor = parameters.axisColor !== undefined ? parameters.axisColor : "#000";
	this.gridColor = parameters.gridColor !== undefined ? parameters.gridColor : "#000";

	this.shadow = parameters.shadow !== undefined ? parameters.shadow : false;
	this.shadowColor = parameters.shadowColor !== undefined ? parameters.shadowColor : "#000";
	this.shadowOffsetX = parameters.shadowOffsetX !== undefined ? parameters.shadowOffsetX : 0;
	this.shadowOffsetY = parameters.shadowOffsetY !== undefined ? parameters.shadowOffsetY : 0;
	this.shadowBlur = parameters.shadowBlur !== undefined ? parameters.shadowBlur : 0;

	this.isDrawFunc = true;
	this.renderDraw = false;
};
MYAIDE.GridHelper.prototype = Object.assign(Object.create(MYAIDE.Animal.prototype), {
	constructor: MYAIDE.GridHelper,
	draw: function (canvas, ctx, render) {
		if (this.visible) {
			ctx.save();
			ctx.transform(1, 0, 0, 1, this.position.x, this.position.y);
			ctx.globalAlpha *= this.alpha;
			if (this.shadow) {
				ctx.shadowColor = this.shadowColor;
				ctx.shadowOffsetX = this.shadowOffsetX;
				ctx.shadowOffsetY = this.shadowOffsetY;
				ctx.shadowBlur = this.shadowBlur;
			}
			var sx = 0, x = 0, dx = 0,
				sy = 0, y = 0, dy = 0;
			if (this.axisColor != this.gridColor) {
				ctx.beginPath();
				ctx.strokeStyle = this.axisColor;
				ctx.moveTo(sx - 0.5, y - this.size);
				ctx.lineTo(sx - 0.5, y + this.size);

				ctx.moveTo(-sx - 0.5, y - this.size);
				ctx.lineTo(-sx - 0.5, y + this.size);

				ctx.moveTo(x - this.size, sy - 0.5);
				ctx.lineTo(x + this.size, sy - 0.5);

				ctx.moveTo(x - this.size, -sy - 0.5);
				ctx.lineTo(x + this.size, -sy - 0.5);

				sx += this.step;
				sy += this.step;

				ctx.stroke();
				ctx.closePath();
			}

			ctx.strokeStyle = this.gridColor;
			ctx.beginPath();
			while (sx <= this.size) {
				ctx.moveTo(sx - 0.5, y - this.size);
				ctx.lineTo(sx - 0.5, y + this.size);

				ctx.moveTo(-sx - 0.5, y - this.size);
				ctx.lineTo(-sx - 0.5, y + this.size);

				ctx.moveTo(x - this.size, sy - 0.5);
				ctx.lineTo(x + this.size, sy - 0.5);

				ctx.moveTo(x - this.size, -sy - 0.5);
				ctx.lineTo(x + this.size, -sy - 0.5);

				sx += this.step;
				sy += this.step;
			}

			ctx.stroke();
			ctx.closePath();
			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}

			ctx.restore();
		}
	}
});

MYAIDE.CircularGraphics = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Graphics.call(this, parameters);

	this.type = "CircularGraphics";
	this.centre = parameters.centre !== undefined ? parameters.centre : [0, 0];
	this.radius = parameters.radius !== undefined ? parameters.radius : 10;

};
MYAIDE.CircularGraphics.prototype = Object.assign(Object.create(MYAIDE.Graphics.prototype), {
	constructor: MYAIDE.CircularGraphics,
	setCentre: function (_centre) {
		if (Array.isArray(_centre)) {
			this.centre = _centre;
		}
	},
	getCentre: function () {
		return this.centre;
	},
	setRadius: function (_radius) {
		if (!isNaN(_radius)) {
			this.radius = _radius;
		}
	},
	getRadius: function (_radius) {
		return this.radius;
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}

			ctx.globalAlpha *= this.alpha;
			ctx.lineCap = this.lineCap;
			ctx.lineWidth = this.lineWidth;
			if (this.shadow) {
				ctx.shadowColor = this.shadowColor;
				ctx.shadowOffsetX = this.shadowOffsetX;
				ctx.shadowOffsetY = this.shadowOffsetY;
				ctx.shadowBlur = this.shadowBlur;
			}
			ctx.beginPath();
			ctx.arc(this.centre[0], this.centre[1], this.radius, 0, Math.PI * 2, false);
			ctx.closePath();
			if (this.fillStatus) {
				var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
				ctx.fillStyle = nowFillStyle;
				ctx.fill();
			}
			if (this.strokeStatus) {
				ctx.strokeStyle = this.strokeStyle;
				ctx.stroke();
			}

			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}

			ctx.restore();
		}
	}
});

MYAIDE.ArcGraphics = function (_parameters) {
	var parameters = _parameters || {};

	MYAIDE.Graphics.call(this, parameters);

	this.type = "ArcGraphics";

	this.start = parameters.start !== undefined ? parameters.start : 0;
	this.startAngle = MYAIDE.Math.degToRad(this.start);

	this.end = parameters.end !== undefined ? parameters.end : 360;
	this.endAngle = MYAIDE.Math.degToRad(this.end);

	this.centre = parameters.centre !== undefined ? parameters.centre : [0, 0];

	this.radius = parameters.radius !== undefined ? parameters.radius : 100;

	this.rotatePoint = new MYAIDE.Position(this.centre[0], this.centre[1]);
};
MYAIDE.ArcGraphics.prototype = Object.assign(Object.create(MYAIDE.Graphics.prototype), {
	contructor: MYAIDE.ArcGraphics,
	setCentre: function (_centre) {
		if (Array.isArray(_centre)) {
			this.centre = _centre;
		}
	},
	getCentre: function () {
		return this.centre;
	},
	setRadius: function (_radius) {
		if (!isNaN(_radius)) {
			this.radius = _radius;
		}
	},
	getRadius: function (_radius) {
		return this.radius;
	},
	setStart: function (_start) {
		this.start = _start;
		this.updataAngle();
	},
	getStart: function () {
		return this.startAngle;
	},
	setEnd: function (_end) {
		this.end = _end;
		this.updataAngle();
	},
	getEnd: function () {
		return this.endAngle;
	},
	updataAngle: function () {
		this.startAngle = MYAIDE.Math.degToRad(this.start);
		this.endAngle = MYAIDE.Math.degToRad(this.end);
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);

			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}

			ctx.globalAlpha *= this.alpha;
			ctx.lineCap = this.lineCap;
			ctx.lineWidth = this.lineWidth;
			if (this.shadow) {
				ctx.shadowColor = this.shadowColor;
				ctx.shadowOffsetX = this.shadowOffsetX;
				ctx.shadowOffsetY = this.shadowOffsetY;
				ctx.shadowBlur = this.shadowBlur;
			}
			ctx.beginPath();
			ctx.strokeStyle = this.strokeStyle;
			ctx.arc(this.centre[0], this.centre[1], this.radius, this.startAngle, this.endAngle, false);

			if (this.fillStatus) {
				var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
				ctx.fillStyle = nowFillStyle;
				ctx.fill();
			}
			if (this.strokeStatus) {
				ctx.stroke();
			}

			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}

			ctx.restore();
		}
	}
});

MYAIDE.SectorGraphics = function (_parameters) {
	var parameters = _parameters || {};

	MYAIDE.CircularGraphics.call(this, parameters);

	this.type = "SectorGraphics";

	this.angle = parameters.angle !== undefined ? parameters.angle : 60;

	this.lineDash = parameters.lineDash !== undefined ? parameters.lineDash : [];
	this.rotatePoint = parameters.rotatePoint !== undefined ? this.rotatePoint.set(parameters.rotatePoint[0], parameters.rotatePoint[1]) : this.rotatePoint.set(this.centre[0], this.centre[1]);
	this.closeStatus = true;

	this.matrix2 = new MYAIDE.Matrix2();
};
MYAIDE.SectorGraphics.prototype = Object.assign(Object.create(MYAIDE.CircularGraphics.prototype), {
	constructor: MYAIDE.SectorGraphics,
	setStartAngle: function (_startAngle) {
		this.startAngle = _startAngle;
	},
	getStartAngle: function () {
		return this.startAngle;
	},
	setEndAngle: function (_endAngle) {
		this.endAngle = _endAngle;
	},
	getEndAngle: function () {
		return this.endAngle;
	},
	setRotate: function (_rotate) {
		if (_rotate) {
			this.rotate = _rotate;
			this.startAngle += _rotate;
			this.endAngle += _rotate;
		}
	},
	getRotate: function () {
		return this.rotate;
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);

			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}
			if (this.shadow) {
				ctx.shadowColor = this.shadowColor;
				ctx.shadowOffsetX = this.shadowOffsetX;
				ctx.shadowOffsetY = this.shadowOffsetY;
				ctx.shadowBlur = this.shadowBlur;
			}
			ctx.globalAlpha *= this.alpha;
			ctx.lineCap = this.lineCap;
			ctx.lineWidth = this.lineWidth;
			ctx.strokeStyle = this.strokeStyle;
			ctx.setLineDash(this.lineDash);

			this.matrix2.set(this.centre[0] + this.radius, this.centre[1]);
			this.matrix2.rotate(-this.angle, this.centre[0], this.centre[1]);
			ctx.beginPath();
			ctx.moveTo(this.matrix2.elements[0] - 0.5, this.matrix2.elements[1] - 0.5);
			ctx.lineTo(this.centre[0] - 0.5, this.centre[1] - 0.5);
			ctx.lineTo(this.centre[0] + this.radius - 0.5, this.centre[1] - 0.5);
			ctx.arc(this.centre[0], this.centre[1], this.radius, 0, this.angle / 180 * Math.PI, false);

			if (this.strokeStatus) {
				ctx.stroke();
			}
			if (this.fillStatus) {
				var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
				ctx.fillStyle = nowFillStyle;
				ctx.fill();
			}

			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}
			ctx.restore();
		}
	}
});

MYAIDE.RectangleGraphics = function (_parameters) {
	var parameters = _parameters || {};

	MYAIDE.Graphics.call(this, parameters);

	this.type = "RectangleGraphics";

};
MYAIDE.RectangleGraphics.prototype = Object.assign(Object.create(MYAIDE.Graphics.prototype), {
	constructor: MYAIDE.RectangleGraphics,
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}
			var width = !!this.special.width ? this.special.width : 100,
				height = !!this.special.height ? this.special.height : 100;

			var graphVertexs = [[0, 0], [width, 0], [width, height], [0, height]];
			var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
			var proto = {
				graphVertexs: graphVertexs,
				alpha: this.alpha,
				lineWidth: this.lineWidth,
				lineCap: this.lineCap,
				strokeStatus: this.strokeStatus,
				strokeStyle: this.strokeStyle,
				fillStatus: this.fillStatus,
				fillStyle: nowFillStyle,
				closeStatus: this.closeStatus,
				lineDash: this.lineDash,
				shadow: this.shadow,
				shadowColor: this.shadowColor,
				shadowOffsetX: this.shadowOffsetX,
				shadowOffsetY: this.shadowOffsetY,
				shadowBlur: this.shadowBlur
			};
			renderer.drawLines(proto);

			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}

			ctx.restore();
		}
	}
});

MYAIDE.LineGraphics = function (_parameters) {
	var parameters = _parameters || {};

	MYAIDE.Graphics.call(this, parameters);

	this.type = "LineGraphics";

	this.startPoint = parameters.startPoint !== undefined ? parameters.startPoint : [0, 0];

	this.endPoint = parameters.endPoint !== undefined ? parameters.endPoint : [100, 100];

	this.rotatePoint = new MYAIDE.Position(this.startPoint[0], this.startPoint[1]);

	this.closeStatus = parameters.closeStatus !== undefined ? parameters.closeStatus : false;
};
MYAIDE.LineGraphics.prototype = Object.assign(Object.create(MYAIDE.Graphics.prototype), {
	contructor: MYAIDE.LineGraphics,
	setStartPoint: function (_startPoint) {
		if (Array.isArray(_startPoint)) {
			this.startPoint = _startPoint;
		}
	},
	getStartPoint: function () {
		return this.startPoint;
	},
	setEndPoint: function (_endPoint) {
		if (Array.isArray(_endPoint)) {
			this.endPoint = _endPoint;
		}
	},
	getEndPoint: function () {
		return this.endPoint;
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);

			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}

			var graphVertexs = [this.startPoint, this.endPoint];
			var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
			var proto = {
				graphVertexs: graphVertexs,
				alpha: this.alpha,
				lineWidth: this.lineWidth,
				lineCap: this.lineCap,
				strokeStatus: this.strokeStatus,
				strokeStyle: this.strokeStyle,
				fillStatus: this.fillStatus,
				fillStyle: nowFillStyle,
				closeStatus: this.closeStatus,
				lineDash: this.lineDash,
				shadow: this.shadow,
				shadowColor: this.shadowColor,
				shadowOffsetX: this.shadowOffsetX,
				shadowOffsetY: this.shadowOffsetY,
				shadowBlur: this.shadowBlur
			};

			renderer.drawLines(proto);

			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}
			ctx.restore();
		}
	}
});

MYAIDE.MathFunctionGraphics = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Graphics.call(this, parameters);

	this.type = "MathFunctionGraphics";

	this.mathFunc = parameters.mathFunc !== undefined ? parameters.mathFunc : function (x) { return x };

	this.min = parameters.min !== undefined ? parameters.min : 0;
	this.max = parameters.max !== undefined ? parameters.max : 100;

	this.max < this.min ? this.max = this.min : "";
	this.XYStatus = parameters.XYStatus !== undefined ? parameters.XYStatus : true;

	this.closeStatus = false;
};
MYAIDE.MathFunctionGraphics.prototype = Object.assign(Object.create(MYAIDE.Graphics.prototype), {
	constructor: MYAIDE.MathFunctionGraphics,
	getMathFunc: function () {
		return this.mathFunc;
	},
	setMathFunc: function (_mathFunc) {
		if (typeof (_mathFunc) == "function") {
			this.mathfunc = _mathFunc;
		} else {
			MYAIDE.Math.trace("MYAIDE.MathFunctionGraphics.mathFunc must a function.")
		}
	},
	setMin: function (_min) {
		this.min = _min;
	},
	getMin: function () {
		return this.min;
	},
	setMax: function (_max) {
		this.max = _max;
	},
	getMax: function () {
		return this.max;
	},
	isClickMe: function (x, y) {
		var b, e, status = false;
		if (this.XYStatus) {
			b = x;
			e = y;
		} else {
			b = y;
			e = x;
		}
		if (this.min <= b && this.max >= b) {
			var ne = this.mathFunc(b);
			if (e == ne) {
				status = true;
			}
		}
		return status;
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);

			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}

			var nowGraphPoints = [];
			for (var b = this.min, len = this.max; b <= len; b += 0.5) {
				var e = this.mathFunc(b);
				if (this.XYStatus) {
					nowGraphPoints.push([b, e]);
				} else {
					nowGraphPoints.push([e, b]);
				}
			}
			var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
			var proto = {
				graphVertexs: nowGraphPoints,
				alpha: this.alpha,
				lineWidth: this.lineWidth,
				lineCap: this.lineCap,
				strokeStatus: this.strokeStatus,
				strokeStyle: this.strokeStyle,
				fillStatus: this.fillStatus,
				fillStyle: nowFillStyle,
				closeStatus: this.closeStatus,
				lineDash: this.lineDash,
				shadow: this.shadow,
				shadowColor: this.shadowColor,
				shadowOffsetX: this.shadowOffsetX,
				shadowOffsetY: this.shadowOffsetY,
				shadowBlur: this.shadowBlur
			};

			renderer.drawLines(proto);

			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}

			ctx.restore();
		}
	}
});

MYAIDE.RegularPolygonGraphics = function (_parameters) {
	var parameters = _parameters || {};

	MYAIDE.Graphics.call(this, parameters);

	this.type = "RegularPolygonGraphics";
	this.centre = parameters.centre !== undefined ? parameters.centre : [0, 0];
	this.rotatePoint = parameters.rotatePoint !== undefined ? this.rotatePoint.set(parameters.rotatePoint[0], parameters.rotatePoint[1]) : this.rotatePoint.set(this.centre[0], this.centre[1]);
	this.radius = parameters.radius !== undefined ? parameters.radius : 100;
	this.edges = parameters.edges !== undefined && parameters.edges >= 3 ? parameters.edges : 3;
	this.interiorAngle = (this.edges - 2) * 180 / this.edges;
};
MYAIDE.RegularPolygonGraphics.prototype = Object.assign(Object.create(MYAIDE.Graphics.prototype), {
	contructor: MYAIDE.RegularPolygonGraphics,
	setCentre: function (_centre) {
		if (Array.isArray(_centre))
			this.centre = _centre;
	},
	getCentre: function () {
		return this.centre;
	},
	setRadius: function (_radius) {
		if (!isNaN(_radius))
			this.radius = _radius;
	},
	getRadius: function (_radius) {
		return this.radius;
	},
	setEdges: function (_edges) {
		if (!isNaN(_edges) && _edges >= 3) {
			this.edges = _edges;
			this.interiorAngle = (this.edges - 2) * 180 / this.edges;
		}
	},
	getEdges: function (_edges) {
		return this.edges;
	},
	setApothem: function (_apothem) {
		this.apothem = Math.cos(MYAIDE.Math.degToRad(180 / this.edges)) * this.radius;
	},
	getApothem: function () {
		return this.apothem;
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);

			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}

			this.setApothem();
			var firstPoint = [this.centre[0], this.centre[1] - this.radius];
			if (this.edges % 2 == 0)
				firstPoint = [this.centre[0] + (Math.sin(MYAIDE.Math.degToRad(180 / this.edges)) * this.radius), this.centre[1] - this.apothem];
			var pointArr = []; pointArr.push(firstPoint);
			var mat = new MYAIDE.Matrix2();
			for (var i = 0, len = this.edges - 1; i < len; i++) {
				mat.set(pointArr[pointArr.length - 1][0], pointArr[pointArr.length - 1][1]);
				mat.rotate(360 / this.edges, this.centre[0], this.centre[1]);
				pointArr.push([mat.elements[0], mat.elements[1]]);
			}
			var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
			var proto = {
				graphVertexs: pointArr,
				alpha: this.alpha,
				lineWidth: this.lineWidth,
				lineCap: this.lineCap,
				strokeStatus: this.strokeStatus,
				strokeStyle: this.strokeStyle,
				fillStatus: this.fillStatus,
				fillStyle: nowFillStyle,
				closeStatus: this.closeStatus,
				lineDash: this.lineDash,
				shadow: this.shadow,
				shadowColor: this.shadowColor,
				shadowOffsetX: this.shadowOffsetX,
				shadowOffsetY: this.shadowOffsetY,
				shadowBlur: this.shadowBlur
			};
			renderer.drawLines(proto);

			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}

			ctx.restore();
		}
	}
});

MYAIDE.BezierGraphics = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Graphics.call(this, parameters);

	this.type = "BezierGraphics";

	this.startPoint = parameters.startPoint !== undefined ? parameters.startPoint : [0, 0];
	this.controlPoint = parameters.controlPoint !== undefined ? parameters.controlPoint : [0, 0];
	this.finishingPoint = parameters.finishingPoint !== undefined ? parameters.finishingPoint : [0, 0];
};

MYAIDE.BezierGraphics.prototype = Object.assign(Object.create(MYAIDE.Graphics.prototype), {
	contructor: MYAIDE.BezierGraphics,
	setStartPoint: function (_startPoint) {
		this.startPoint = _startPoint;
	},
	getStartPoint: function () {
		return this.startPoint;
	},
	setControlPoint: function (_controlPoint) {
		this.controlPoint = _controlPoint;
	},
	getControlPoint: function () {
		return this.controlPoint;
	},
	setFinishingPoint: function (_finishingPoint) {
		this.finishingPoint = _finishingPoint;
	},
	getFinishingPoint: function () {
		return this.finishingPoint;
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);

			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}
			if (this.shadow) {
				ctx.shadowColor = this.shadowColor;
				ctx.shadowOffsetX = this.shadowOffsetX;
				ctx.shadowOffsetY = this.shadowOffsetY;
				ctx.shadowBlur = this.shadowBlur;
			}
			ctx.globalAlpha *= this.alpha;
			ctx.lineCap = this.lineCap;
			ctx.lineWidth = this.lineWidth;
			ctx.beginPath();
			ctx.strokeStyle = this.strokeStyle;

			ctx.moveTo(this.startPoint[0], this.startPoint[1]);
			if (this.controlPoint.length == 2) {
				ctx.quadraticCurveTo(this.controlPoint[0], this.controlPoint[1], this.finishingPoint[0], this.finishingPoint[1]);
			} else {
				ctx.bezierCurveTo(this.controlPoint[0], this.controlPoint[1],
					this.controlPoint[2], this.controlPoint[3],
					this.finishingPoint[0], this.finishingPoint[1]);
			}

			if (this.fillStatus) {
				var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
				ctx.fillStyle = nowFillStyle;
				ctx.fill();
			}
			if (this.strokeStatus) {
				ctx.stroke();
			}
			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}
			ctx.restore();
		}
	}
});
MYAIDE.RectangleRoundGraphics = function (_parameters) {
	var parameters = _parameters || {};

	MYAIDE.Graphics.call(this, parameters);

	this.type = "RectangleRoundGraphics";

	this.radius = parameters.radius !== undefined ? parameters.radius : 0;
};
MYAIDE.RectangleRoundGraphics.prototype = Object.assign(Object.create(MYAIDE.Graphics.prototype), {
	constructor: MYAIDE.RectangleRoundGraphics,
	setRadius: function (_radius) {
		if (!isNaN(_radius))
			this.radius = _radius;
	},
	getRadius: function (_radius) {
		return this.radius;
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}

			var width = !!this.special.width ? this.special.width : 100,
				height = !!this.special.height ? this.special.height : 100;
			if (this.shadow) {
				ctx.shadowColor = this.shadowColor;
				ctx.shadowOffsetX = this.shadowOffsetX;
				ctx.shadowOffsetY = this.shadowOffsetY;
				ctx.shadowBlur = this.shadowBlur;
			}
			ctx.globalAlpha *= this.alpha;
			ctx.lineCap = this.lineCap;
			ctx.lineWidth = this.lineWidth;
			ctx.beginPath();
			ctx.strokeStyle = this.strokeStyle;

			ctx.moveTo(this.radius, 0);
			ctx.lineTo(width - this.radius, 0);
			ctx.arcTo(width, 0, width, this.radius, this.radius);
			ctx.lineTo(width, height - this.radius);
			ctx.arcTo(width, height, width - this.radius, height, this.radius);
			ctx.lineTo(this.radius, height);
			ctx.arcTo(0, height, 0, height - this.radius, this.radius);
			ctx.lineTo(0, this.radius);
			ctx.arcTo(0, 0, this.radius, 0, this.radius);
			ctx.closePath();

			if (this.fillStatus) {
				ctx.fillStyle = this.fillStyle;
				ctx.fill();
			}
			if (this.strokeStatus) {
				ctx.stroke();
			}
			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}
			ctx.restore();

		}
	}
});

MYAIDE.EllipseGraphics = function (_parameters) {
	var parameters = _parameters || {};
	MYAIDE.Graphics.call(this, parameters);
	this.type = "EllipseGraphics";
}
MYAIDE.EllipseGraphics.prototype = Object.assign(Object.create(MYAIDE.Graphics.prototype), {
	constructor: MYAIDE.EllipseGraphics,
	getCentre: function () {
		var width = !!this.special.width ? this.special.width : 100,
			height = !!this.special.height ? this.special.height : 100;
		return { x: width / 2, y: height / 2 };
	},
	draw: function (canvas, ctx, renderer) {
		if (this.visible) {
			ctx.save();
			ctx.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
			if (this.rotate != 0) {
				ctx.translate(this.rotatePoint.x, this.rotatePoint.y);
				ctx.rotate(this.rotate * Math.PI / 180);
				ctx.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}
			var width = !!this.special.width ? this.special.width : 100,
				height = !!this.special.height ? this.special.height : 100;
			if (this.shadow) {
				ctx.shadowColor = this.shadowColor;
				ctx.shadowOffsetX = this.shadowOffsetX;
				ctx.shadowOffsetY = this.shadowOffsetY;
				ctx.shadowBlur = this.shadowBlur;
			}
			ctx.globalAlpha *= this.alpha;
			ctx.lineCap = this.lineCap;
			ctx.lineWidth = this.lineWidth;
			ctx.strokeStyle = this.strokeStyle;
			ctx.beginPath();
			var k = Math.sqrt(1 / 3),
				x = 0,
				y = 0,
				w = width,
				h = height,
				ox = (w / 2) * k,
				oy = (h / 2) * k,
				xe = x + w,
				ye = y + h,
				xm = x + w / 2,
				ym = y + h / 2;

			ctx.moveTo(x, ym);
			ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
			if (this.fillStatus) {
				var nowFillStyle = this.gradientStatus ? (this.gradient != null ? this.gradient : this.fillStyle) : this.fillStyle;
				ctx.fillStyle = nowFillStyle;
				ctx.fill();
			}
			if (this.strokeStatus) {
				ctx.stroke();
			}
			if (this.children.length > 0) {
				for (var i = 0, len = this.children.length; i < len; i++) {
					renderer.renderDraw(this.children[i]);
				}
			}
			ctx.restore();
		}
	}
});

MYAIDE.Algorithm = {

};