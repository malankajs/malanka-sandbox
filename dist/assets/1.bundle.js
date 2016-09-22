webpackJsonp([1],{

/***/ 90:
/***/ function(module, exports) {

	'use strict';
	
	(function (self) {
	  'use strict';
	
	  if (self.fetch) {
	    return;
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && function () {
	      try {
	        new Blob();
	        return true;
	      } catch (e) {
	        return false;
	      }
	    }(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  };
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name);
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name');
	    }
	    return name.toLowerCase();
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value);
	    }
	    return value;
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function next() {
	        var value = items.shift();
	        return { done: value === undefined, value: value };
	      }
	    };
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function () {
	        return iterator;
	      };
	    }
	
	    return iterator;
	  }
	
	  function Headers(headers) {
	    this.map = {};
	
	    if (headers instanceof Headers) {
	      headers.forEach(function (value, name) {
	        this.append(name, value);
	      }, this);
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function (name) {
	        this.append(name, headers[name]);
	      }, this);
	    }
	  }
	
	  Headers.prototype.append = function (name, value) {
	    name = normalizeName(name);
	    value = normalizeValue(value);
	    var list = this.map[name];
	    if (!list) {
	      list = [];
	      this.map[name] = list;
	    }
	    list.push(value);
	  };
	
	  Headers.prototype['delete'] = function (name) {
	    delete this.map[normalizeName(name)];
	  };
	
	  Headers.prototype.get = function (name) {
	    var values = this.map[normalizeName(name)];
	    return values ? values[0] : null;
	  };
	
	  Headers.prototype.getAll = function (name) {
	    return this.map[normalizeName(name)] || [];
	  };
	
	  Headers.prototype.has = function (name) {
	    return this.map.hasOwnProperty(normalizeName(name));
	  };
	
	  Headers.prototype.set = function (name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)];
	  };
	
	  Headers.prototype.forEach = function (callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function (name) {
	      this.map[name].forEach(function (value) {
	        callback.call(thisArg, value, name, this);
	      }, this);
	    }, this);
	  };
	
	  Headers.prototype.keys = function () {
	    var items = [];
	    this.forEach(function (value, name) {
	      items.push(name);
	    });
	    return iteratorFor(items);
	  };
	
	  Headers.prototype.values = function () {
	    var items = [];
	    this.forEach(function (value) {
	      items.push(value);
	    });
	    return iteratorFor(items);
	  };
	
	  Headers.prototype.entries = function () {
	    var items = [];
	    this.forEach(function (value, name) {
	      items.push([name, value]);
	    });
	    return iteratorFor(items);
	  };
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'));
	    }
	    body.bodyUsed = true;
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function (resolve, reject) {
	      reader.onload = function () {
	        resolve(reader.result);
	      };
	      reader.onerror = function () {
	        reject(reader.error);
	      };
	    });
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    reader.readAsArrayBuffer(blob);
	    return fileReaderReady(reader);
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader();
	    reader.readAsText(blob);
	    return fileReaderReady(reader);
	  }
	
	  function Body() {
	    this.bodyUsed = false;
	
	    this._initBody = function (body) {
	      this._bodyInit = body;
	      if (typeof body === 'string') {
	        this._bodyText = body;
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body;
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body;
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString();
	      } else if (!body) {
	        this._bodyText = '';
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type');
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8');
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type);
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	      }
	    };
	
	    if (support.blob) {
	      this.blob = function () {
	        var rejected = consumed(this);
	        if (rejected) {
	          return rejected;
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob);
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob');
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]));
	        }
	      };
	
	      this.arrayBuffer = function () {
	        return this.blob().then(readBlobAsArrayBuffer);
	      };
	
	      this.text = function () {
	        var rejected = consumed(this);
	        if (rejected) {
	          return rejected;
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob);
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text');
	        } else {
	          return Promise.resolve(this._bodyText);
	        }
	      };
	    } else {
	      this.text = function () {
	        var rejected = consumed(this);
	        return rejected ? rejected : Promise.resolve(this._bodyText);
	      };
	    }
	
	    if (support.formData) {
	      this.formData = function () {
	        return this.text().then(decode);
	      };
	    }
	
	    this.json = function () {
	      return this.text().then(JSON.parse);
	    };
	
	    return this;
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return methods.indexOf(upcased) > -1 ? upcased : method;
	  }
	
	  function Request(input, options) {
	    options = options || {};
	    var body = options.body;
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read');
	      }
	      this.url = input.url;
	      this.credentials = input.credentials;
	      if (!options.headers) {
	        this.headers = new Headers(input.headers);
	      }
	      this.method = input.method;
	      this.mode = input.mode;
	      if (!body) {
	        body = input._bodyInit;
	        input.bodyUsed = true;
	      }
	    } else {
	      this.url = input;
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit';
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers);
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET');
	    this.mode = options.mode || this.mode || null;
	    this.referrer = null;
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests');
	    }
	    this._initBody(body);
	  }
	
	  Request.prototype.clone = function () {
	    return new Request(this);
	  };
	
	  function decode(body) {
	    var form = new FormData();
	    body.trim().split('&').forEach(function (bytes) {
	      if (bytes) {
	        var split = bytes.split('=');
	        var name = split.shift().replace(/\+/g, ' ');
	        var value = split.join('=').replace(/\+/g, ' ');
	        form.append(decodeURIComponent(name), decodeURIComponent(value));
	      }
	    });
	    return form;
	  }
	
	  function headers(xhr) {
	    var head = new Headers();
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n');
	    pairs.forEach(function (header) {
	      var split = header.trim().split(':');
	      var key = split.shift().trim();
	      var value = split.join(':').trim();
	      head.append(key, value);
	    });
	    return head;
	  }
	
	  Body.call(Request.prototype);
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {};
	    }
	
	    this.type = 'default';
	    this.status = options.status;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.statusText = options.statusText;
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
	    this.url = options.url || '';
	    this._initBody(bodyInit);
	  }
	
	  Body.call(Response.prototype);
	
	  Response.prototype.clone = function () {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    });
	  };
	
	  Response.error = function () {
	    var response = new Response(null, { status: 0, statusText: '' });
	    response.type = 'error';
	    return response;
	  };
	
	  var redirectStatuses = [301, 302, 303, 307, 308];
	
	  Response.redirect = function (url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code');
	    }
	
	    return new Response(null, { status: status, headers: { location: url } });
	  };
	
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	
	  self.fetch = function (input, init) {
	    return new Promise(function (resolve, reject) {
	      var request;
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input;
	      } else {
	        request = new Request(input, init);
	      }
	
	      var xhr = new XMLHttpRequest();
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL;
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL');
	        }
	
	        return;
	      }
	
	      xhr.onload = function () {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        };
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options));
	      };
	
	      xhr.onerror = function () {
	        reject(new TypeError('Network request failed'));
	      };
	
	      xhr.ontimeout = function () {
	        reject(new TypeError('Network request failed'));
	      };
	
	      xhr.open(request.method, request.url, true);
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true;
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob';
	      }
	
	      request.headers.forEach(function (value, name) {
	        xhr.setRequestHeader(name, value);
	      });
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	    });
	  };
	  self.fetch.polyfill = true;
	})(typeof self !== 'undefined' ? self : undefined);

/***/ }

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vbWFsYW5rYS9+L3doYXR3Zy1mZXRjaC9mZXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsRUFBQyxVQUFTLElBQVQsRUFBZTtBQUNkOztBQUVBLE9BQUksS0FBSyxLQUFULEVBQWdCO0FBQ2Q7QUFDRDs7QUFFRCxPQUFJLFVBQVU7QUFDWixtQkFBYyxxQkFBcUIsSUFEdkI7QUFFWixlQUFVLFlBQVksSUFBWixJQUFvQixjQUFjLE1BRmhDO0FBR1osV0FBTSxnQkFBZ0IsSUFBaEIsSUFBd0IsVUFBVSxJQUFsQyxJQUEyQyxZQUFXO0FBQzFELFdBQUk7QUFDRixhQUFJLElBQUo7QUFDQSxnQkFBTyxJQUFQO0FBQ0QsUUFIRCxDQUdFLE9BQU0sQ0FBTixFQUFTO0FBQ1QsZ0JBQU8sS0FBUDtBQUNEO0FBQ0YsTUFQK0MsRUFIcEM7QUFXWixlQUFVLGNBQWMsSUFYWjtBQVlaLGtCQUFhLGlCQUFpQjtBQVpsQixJQUFkOztBQWVBLFlBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QjtBQUMzQixTQUFJLE9BQU8sSUFBUCxLQUFnQixRQUFwQixFQUE4QjtBQUM1QixjQUFPLE9BQU8sSUFBUCxDQUFQO0FBQ0Q7QUFDRCxTQUFJLDZCQUE2QixJQUE3QixDQUFrQyxJQUFsQyxDQUFKLEVBQTZDO0FBQzNDLGFBQU0sSUFBSSxTQUFKLENBQWMsd0NBQWQsQ0FBTjtBQUNEO0FBQ0QsWUFBTyxLQUFLLFdBQUwsRUFBUDtBQUNEOztBQUVELFlBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQjtBQUM3QixTQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUM3QixlQUFRLE9BQU8sS0FBUCxDQUFSO0FBQ0Q7QUFDRCxZQUFPLEtBQVA7QUFDRDs7QUFFRDtBQUNBLFlBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QjtBQUMxQixTQUFJLFdBQVc7QUFDYixhQUFNLGdCQUFXO0FBQ2YsYUFBSSxRQUFRLE1BQU0sS0FBTixFQUFaO0FBQ0EsZ0JBQU8sRUFBQyxNQUFNLFVBQVUsU0FBakIsRUFBNEIsT0FBTyxLQUFuQyxFQUFQO0FBQ0Q7QUFKWSxNQUFmOztBQU9BLFNBQUksUUFBUSxRQUFaLEVBQXNCO0FBQ3BCLGdCQUFTLE9BQU8sUUFBaEIsSUFBNEIsWUFBVztBQUNyQyxnQkFBTyxRQUFQO0FBQ0QsUUFGRDtBQUdEOztBQUVELFlBQU8sUUFBUDtBQUNEOztBQUVELFlBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQjtBQUN4QixVQUFLLEdBQUwsR0FBVyxFQUFYOztBQUVBLFNBQUksbUJBQW1CLE9BQXZCLEVBQWdDO0FBQzlCLGVBQVEsT0FBUixDQUFnQixVQUFTLEtBQVQsRUFBZ0IsSUFBaEIsRUFBc0I7QUFDcEMsY0FBSyxNQUFMLENBQVksSUFBWixFQUFrQixLQUFsQjtBQUNELFFBRkQsRUFFRyxJQUZIO0FBSUQsTUFMRCxNQUtPLElBQUksT0FBSixFQUFhO0FBQ2xCLGNBQU8sbUJBQVAsQ0FBMkIsT0FBM0IsRUFBb0MsT0FBcEMsQ0FBNEMsVUFBUyxJQUFULEVBQWU7QUFDekQsY0FBSyxNQUFMLENBQVksSUFBWixFQUFrQixRQUFRLElBQVIsQ0FBbEI7QUFDRCxRQUZELEVBRUcsSUFGSDtBQUdEO0FBQ0Y7O0FBRUQsV0FBUSxTQUFSLENBQWtCLE1BQWxCLEdBQTJCLFVBQVMsSUFBVCxFQUFlLEtBQWYsRUFBc0I7QUFDL0MsWUFBTyxjQUFjLElBQWQsQ0FBUDtBQUNBLGFBQVEsZUFBZSxLQUFmLENBQVI7QUFDQSxTQUFJLE9BQU8sS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFYO0FBQ0EsU0FBSSxDQUFDLElBQUwsRUFBVztBQUNULGNBQU8sRUFBUDtBQUNBLFlBQUssR0FBTCxDQUFTLElBQVQsSUFBaUIsSUFBakI7QUFDRDtBQUNELFVBQUssSUFBTCxDQUFVLEtBQVY7QUFDRCxJQVREOztBQVdBLFdBQVEsU0FBUixDQUFrQixRQUFsQixJQUE4QixVQUFTLElBQVQsRUFBZTtBQUMzQyxZQUFPLEtBQUssR0FBTCxDQUFTLGNBQWMsSUFBZCxDQUFULENBQVA7QUFDRCxJQUZEOztBQUlBLFdBQVEsU0FBUixDQUFrQixHQUFsQixHQUF3QixVQUFTLElBQVQsRUFBZTtBQUNyQyxTQUFJLFNBQVMsS0FBSyxHQUFMLENBQVMsY0FBYyxJQUFkLENBQVQsQ0FBYjtBQUNBLFlBQU8sU0FBUyxPQUFPLENBQVAsQ0FBVCxHQUFxQixJQUE1QjtBQUNELElBSEQ7O0FBS0EsV0FBUSxTQUFSLENBQWtCLE1BQWxCLEdBQTJCLFVBQVMsSUFBVCxFQUFlO0FBQ3hDLFlBQU8sS0FBSyxHQUFMLENBQVMsY0FBYyxJQUFkLENBQVQsS0FBaUMsRUFBeEM7QUFDRCxJQUZEOztBQUlBLFdBQVEsU0FBUixDQUFrQixHQUFsQixHQUF3QixVQUFTLElBQVQsRUFBZTtBQUNyQyxZQUFPLEtBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsY0FBYyxJQUFkLENBQXhCLENBQVA7QUFDRCxJQUZEOztBQUlBLFdBQVEsU0FBUixDQUFrQixHQUFsQixHQUF3QixVQUFTLElBQVQsRUFBZSxLQUFmLEVBQXNCO0FBQzVDLFVBQUssR0FBTCxDQUFTLGNBQWMsSUFBZCxDQUFULElBQWdDLENBQUMsZUFBZSxLQUFmLENBQUQsQ0FBaEM7QUFDRCxJQUZEOztBQUlBLFdBQVEsU0FBUixDQUFrQixPQUFsQixHQUE0QixVQUFTLFFBQVQsRUFBbUIsT0FBbkIsRUFBNEI7QUFDdEQsWUFBTyxtQkFBUCxDQUEyQixLQUFLLEdBQWhDLEVBQXFDLE9BQXJDLENBQTZDLFVBQVMsSUFBVCxFQUFlO0FBQzFELFlBQUssR0FBTCxDQUFTLElBQVQsRUFBZSxPQUFmLENBQXVCLFVBQVMsS0FBVCxFQUFnQjtBQUNyQyxrQkFBUyxJQUFULENBQWMsT0FBZCxFQUF1QixLQUF2QixFQUE4QixJQUE5QixFQUFvQyxJQUFwQztBQUNELFFBRkQsRUFFRyxJQUZIO0FBR0QsTUFKRCxFQUlHLElBSkg7QUFLRCxJQU5EOztBQVFBLFdBQVEsU0FBUixDQUFrQixJQUFsQixHQUF5QixZQUFXO0FBQ2xDLFNBQUksUUFBUSxFQUFaO0FBQ0EsVUFBSyxPQUFMLENBQWEsVUFBUyxLQUFULEVBQWdCLElBQWhCLEVBQXNCO0FBQUUsYUFBTSxJQUFOLENBQVcsSUFBWDtBQUFrQixNQUF2RDtBQUNBLFlBQU8sWUFBWSxLQUFaLENBQVA7QUFDRCxJQUpEOztBQU1BLFdBQVEsU0FBUixDQUFrQixNQUFsQixHQUEyQixZQUFXO0FBQ3BDLFNBQUksUUFBUSxFQUFaO0FBQ0EsVUFBSyxPQUFMLENBQWEsVUFBUyxLQUFULEVBQWdCO0FBQUUsYUFBTSxJQUFOLENBQVcsS0FBWDtBQUFtQixNQUFsRDtBQUNBLFlBQU8sWUFBWSxLQUFaLENBQVA7QUFDRCxJQUpEOztBQU1BLFdBQVEsU0FBUixDQUFrQixPQUFsQixHQUE0QixZQUFXO0FBQ3JDLFNBQUksUUFBUSxFQUFaO0FBQ0EsVUFBSyxPQUFMLENBQWEsVUFBUyxLQUFULEVBQWdCLElBQWhCLEVBQXNCO0FBQUUsYUFBTSxJQUFOLENBQVcsQ0FBQyxJQUFELEVBQU8sS0FBUCxDQUFYO0FBQTJCLE1BQWhFO0FBQ0EsWUFBTyxZQUFZLEtBQVosQ0FBUDtBQUNELElBSkQ7O0FBTUEsT0FBSSxRQUFRLFFBQVosRUFBc0I7QUFDcEIsYUFBUSxTQUFSLENBQWtCLE9BQU8sUUFBekIsSUFBcUMsUUFBUSxTQUFSLENBQWtCLE9BQXZEO0FBQ0Q7O0FBRUQsWUFBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCO0FBQ3RCLFNBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCLGNBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxTQUFKLENBQWMsY0FBZCxDQUFmLENBQVA7QUFDRDtBQUNELFVBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNEOztBQUVELFlBQVMsZUFBVCxDQUF5QixNQUF6QixFQUFpQztBQUMvQixZQUFPLElBQUksT0FBSixDQUFZLFVBQVMsT0FBVCxFQUFrQixNQUFsQixFQUEwQjtBQUMzQyxjQUFPLE1BQVAsR0FBZ0IsWUFBVztBQUN6QixpQkFBUSxPQUFPLE1BQWY7QUFDRCxRQUZEO0FBR0EsY0FBTyxPQUFQLEdBQWlCLFlBQVc7QUFDMUIsZ0JBQU8sT0FBTyxLQUFkO0FBQ0QsUUFGRDtBQUdELE1BUE0sQ0FBUDtBQVFEOztBQUVELFlBQVMscUJBQVQsQ0FBK0IsSUFBL0IsRUFBcUM7QUFDbkMsU0FBSSxTQUFTLElBQUksVUFBSixFQUFiO0FBQ0EsWUFBTyxpQkFBUCxDQUF5QixJQUF6QjtBQUNBLFlBQU8sZ0JBQWdCLE1BQWhCLENBQVA7QUFDRDs7QUFFRCxZQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEI7QUFDNUIsU0FBSSxTQUFTLElBQUksVUFBSixFQUFiO0FBQ0EsWUFBTyxVQUFQLENBQWtCLElBQWxCO0FBQ0EsWUFBTyxnQkFBZ0IsTUFBaEIsQ0FBUDtBQUNEOztBQUVELFlBQVMsSUFBVCxHQUFnQjtBQUNkLFVBQUssUUFBTCxHQUFnQixLQUFoQjs7QUFFQSxVQUFLLFNBQUwsR0FBaUIsVUFBUyxJQUFULEVBQWU7QUFDOUIsWUFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsV0FBSSxPQUFPLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDNUIsY0FBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0QsUUFGRCxNQUVPLElBQUksUUFBUSxJQUFSLElBQWdCLEtBQUssU0FBTCxDQUFlLGFBQWYsQ0FBNkIsSUFBN0IsQ0FBcEIsRUFBd0Q7QUFDN0QsY0FBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0QsUUFGTSxNQUVBLElBQUksUUFBUSxRQUFSLElBQW9CLFNBQVMsU0FBVCxDQUFtQixhQUFuQixDQUFpQyxJQUFqQyxDQUF4QixFQUFnRTtBQUNyRSxjQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDRCxRQUZNLE1BRUEsSUFBSSxRQUFRLFlBQVIsSUFBd0IsZ0JBQWdCLFNBQWhCLENBQTBCLGFBQTFCLENBQXdDLElBQXhDLENBQTVCLEVBQTJFO0FBQ2hGLGNBQUssU0FBTCxHQUFpQixLQUFLLFFBQUwsRUFBakI7QUFDRCxRQUZNLE1BRUEsSUFBSSxDQUFDLElBQUwsRUFBVztBQUNoQixjQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDRCxRQUZNLE1BRUEsSUFBSSxRQUFRLFdBQVIsSUFBdUIsWUFBWSxTQUFaLENBQXNCLGFBQXRCLENBQW9DLElBQXBDLENBQTNCLEVBQXNFO0FBQzNFO0FBQ0E7QUFDRCxRQUhNLE1BR0E7QUFDTCxlQUFNLElBQUksS0FBSixDQUFVLDJCQUFWLENBQU47QUFDRDs7QUFFRCxXQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixjQUFqQixDQUFMLEVBQXVDO0FBQ3JDLGFBQUksT0FBTyxJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQzVCLGdCQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLGNBQWpCLEVBQWlDLDBCQUFqQztBQUNELFVBRkQsTUFFTyxJQUFJLEtBQUssU0FBTCxJQUFrQixLQUFLLFNBQUwsQ0FBZSxJQUFyQyxFQUEyQztBQUNoRCxnQkFBSyxPQUFMLENBQWEsR0FBYixDQUFpQixjQUFqQixFQUFpQyxLQUFLLFNBQUwsQ0FBZSxJQUFoRDtBQUNELFVBRk0sTUFFQSxJQUFJLFFBQVEsWUFBUixJQUF3QixnQkFBZ0IsU0FBaEIsQ0FBMEIsYUFBMUIsQ0FBd0MsSUFBeEMsQ0FBNUIsRUFBMkU7QUFDaEYsZ0JBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsY0FBakIsRUFBaUMsaURBQWpDO0FBQ0Q7QUFDRjtBQUNGLE1BNUJEOztBQThCQSxTQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNoQixZQUFLLElBQUwsR0FBWSxZQUFXO0FBQ3JCLGFBQUksV0FBVyxTQUFTLElBQVQsQ0FBZjtBQUNBLGFBQUksUUFBSixFQUFjO0FBQ1osa0JBQU8sUUFBUDtBQUNEOztBQUVELGFBQUksS0FBSyxTQUFULEVBQW9CO0FBQ2xCLGtCQUFPLFFBQVEsT0FBUixDQUFnQixLQUFLLFNBQXJCLENBQVA7QUFDRCxVQUZELE1BRU8sSUFBSSxLQUFLLGFBQVQsRUFBd0I7QUFDN0IsaUJBQU0sSUFBSSxLQUFKLENBQVUsc0NBQVYsQ0FBTjtBQUNELFVBRk0sTUFFQTtBQUNMLGtCQUFPLFFBQVEsT0FBUixDQUFnQixJQUFJLElBQUosQ0FBUyxDQUFDLEtBQUssU0FBTixDQUFULENBQWhCLENBQVA7QUFDRDtBQUNGLFFBYkQ7O0FBZUEsWUFBSyxXQUFMLEdBQW1CLFlBQVc7QUFDNUIsZ0JBQU8sS0FBSyxJQUFMLEdBQVksSUFBWixDQUFpQixxQkFBakIsQ0FBUDtBQUNELFFBRkQ7O0FBSUEsWUFBSyxJQUFMLEdBQVksWUFBVztBQUNyQixhQUFJLFdBQVcsU0FBUyxJQUFULENBQWY7QUFDQSxhQUFJLFFBQUosRUFBYztBQUNaLGtCQUFPLFFBQVA7QUFDRDs7QUFFRCxhQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixrQkFBTyxlQUFlLEtBQUssU0FBcEIsQ0FBUDtBQUNELFVBRkQsTUFFTyxJQUFJLEtBQUssYUFBVCxFQUF3QjtBQUM3QixpQkFBTSxJQUFJLEtBQUosQ0FBVSxzQ0FBVixDQUFOO0FBQ0QsVUFGTSxNQUVBO0FBQ0wsa0JBQU8sUUFBUSxPQUFSLENBQWdCLEtBQUssU0FBckIsQ0FBUDtBQUNEO0FBQ0YsUUFiRDtBQWNELE1BbENELE1Ba0NPO0FBQ0wsWUFBSyxJQUFMLEdBQVksWUFBVztBQUNyQixhQUFJLFdBQVcsU0FBUyxJQUFULENBQWY7QUFDQSxnQkFBTyxXQUFXLFFBQVgsR0FBc0IsUUFBUSxPQUFSLENBQWdCLEtBQUssU0FBckIsQ0FBN0I7QUFDRCxRQUhEO0FBSUQ7O0FBRUQsU0FBSSxRQUFRLFFBQVosRUFBc0I7QUFDcEIsWUFBSyxRQUFMLEdBQWdCLFlBQVc7QUFDekIsZ0JBQU8sS0FBSyxJQUFMLEdBQVksSUFBWixDQUFpQixNQUFqQixDQUFQO0FBQ0QsUUFGRDtBQUdEOztBQUVELFVBQUssSUFBTCxHQUFZLFlBQVc7QUFDckIsY0FBTyxLQUFLLElBQUwsR0FBWSxJQUFaLENBQWlCLEtBQUssS0FBdEIsQ0FBUDtBQUNELE1BRkQ7O0FBSUEsWUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxPQUFJLFVBQVUsQ0FBQyxRQUFELEVBQVcsS0FBWCxFQUFrQixNQUFsQixFQUEwQixTQUExQixFQUFxQyxNQUFyQyxFQUE2QyxLQUE3QyxDQUFkOztBQUVBLFlBQVMsZUFBVCxDQUF5QixNQUF6QixFQUFpQztBQUMvQixTQUFJLFVBQVUsT0FBTyxXQUFQLEVBQWQ7QUFDQSxZQUFRLFFBQVEsT0FBUixDQUFnQixPQUFoQixJQUEyQixDQUFDLENBQTdCLEdBQWtDLE9BQWxDLEdBQTRDLE1BQW5EO0FBQ0Q7O0FBRUQsWUFBUyxPQUFULENBQWlCLEtBQWpCLEVBQXdCLE9BQXhCLEVBQWlDO0FBQy9CLGVBQVUsV0FBVyxFQUFyQjtBQUNBLFNBQUksT0FBTyxRQUFRLElBQW5CO0FBQ0EsU0FBSSxRQUFRLFNBQVIsQ0FBa0IsYUFBbEIsQ0FBZ0MsS0FBaEMsQ0FBSixFQUE0QztBQUMxQyxXQUFJLE1BQU0sUUFBVixFQUFvQjtBQUNsQixlQUFNLElBQUksU0FBSixDQUFjLGNBQWQsQ0FBTjtBQUNEO0FBQ0QsWUFBSyxHQUFMLEdBQVcsTUFBTSxHQUFqQjtBQUNBLFlBQUssV0FBTCxHQUFtQixNQUFNLFdBQXpCO0FBQ0EsV0FBSSxDQUFDLFFBQVEsT0FBYixFQUFzQjtBQUNwQixjQUFLLE9BQUwsR0FBZSxJQUFJLE9BQUosQ0FBWSxNQUFNLE9BQWxCLENBQWY7QUFDRDtBQUNELFlBQUssTUFBTCxHQUFjLE1BQU0sTUFBcEI7QUFDQSxZQUFLLElBQUwsR0FBWSxNQUFNLElBQWxCO0FBQ0EsV0FBSSxDQUFDLElBQUwsRUFBVztBQUNULGdCQUFPLE1BQU0sU0FBYjtBQUNBLGVBQU0sUUFBTixHQUFpQixJQUFqQjtBQUNEO0FBQ0YsTUFmRCxNQWVPO0FBQ0wsWUFBSyxHQUFMLEdBQVcsS0FBWDtBQUNEOztBQUVELFVBQUssV0FBTCxHQUFtQixRQUFRLFdBQVIsSUFBdUIsS0FBSyxXQUE1QixJQUEyQyxNQUE5RDtBQUNBLFNBQUksUUFBUSxPQUFSLElBQW1CLENBQUMsS0FBSyxPQUE3QixFQUFzQztBQUNwQyxZQUFLLE9BQUwsR0FBZSxJQUFJLE9BQUosQ0FBWSxRQUFRLE9BQXBCLENBQWY7QUFDRDtBQUNELFVBQUssTUFBTCxHQUFjLGdCQUFnQixRQUFRLE1BQVIsSUFBa0IsS0FBSyxNQUF2QixJQUFpQyxLQUFqRCxDQUFkO0FBQ0EsVUFBSyxJQUFMLEdBQVksUUFBUSxJQUFSLElBQWdCLEtBQUssSUFBckIsSUFBNkIsSUFBekM7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsSUFBaEI7O0FBRUEsU0FBSSxDQUFDLEtBQUssTUFBTCxLQUFnQixLQUFoQixJQUF5QixLQUFLLE1BQUwsS0FBZ0IsTUFBMUMsS0FBcUQsSUFBekQsRUFBK0Q7QUFDN0QsYUFBTSxJQUFJLFNBQUosQ0FBYywyQ0FBZCxDQUFOO0FBQ0Q7QUFDRCxVQUFLLFNBQUwsQ0FBZSxJQUFmO0FBQ0Q7O0FBRUQsV0FBUSxTQUFSLENBQWtCLEtBQWxCLEdBQTBCLFlBQVc7QUFDbkMsWUFBTyxJQUFJLE9BQUosQ0FBWSxJQUFaLENBQVA7QUFDRCxJQUZEOztBQUlBLFlBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtBQUNwQixTQUFJLE9BQU8sSUFBSSxRQUFKLEVBQVg7QUFDQSxVQUFLLElBQUwsR0FBWSxLQUFaLENBQWtCLEdBQWxCLEVBQXVCLE9BQXZCLENBQStCLFVBQVMsS0FBVCxFQUFnQjtBQUM3QyxXQUFJLEtBQUosRUFBVztBQUNULGFBQUksUUFBUSxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQVo7QUFDQSxhQUFJLE9BQU8sTUFBTSxLQUFOLEdBQWMsT0FBZCxDQUFzQixLQUF0QixFQUE2QixHQUE3QixDQUFYO0FBQ0EsYUFBSSxRQUFRLE1BQU0sSUFBTixDQUFXLEdBQVgsRUFBZ0IsT0FBaEIsQ0FBd0IsS0FBeEIsRUFBK0IsR0FBL0IsQ0FBWjtBQUNBLGNBQUssTUFBTCxDQUFZLG1CQUFtQixJQUFuQixDQUFaLEVBQXNDLG1CQUFtQixLQUFuQixDQUF0QztBQUNEO0FBQ0YsTUFQRDtBQVFBLFlBQU8sSUFBUDtBQUNEOztBQUVELFlBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQjtBQUNwQixTQUFJLE9BQU8sSUFBSSxPQUFKLEVBQVg7QUFDQSxTQUFJLFFBQVEsQ0FBQyxJQUFJLHFCQUFKLE1BQStCLEVBQWhDLEVBQW9DLElBQXBDLEdBQTJDLEtBQTNDLENBQWlELElBQWpELENBQVo7QUFDQSxXQUFNLE9BQU4sQ0FBYyxVQUFTLE1BQVQsRUFBaUI7QUFDN0IsV0FBSSxRQUFRLE9BQU8sSUFBUCxHQUFjLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBWjtBQUNBLFdBQUksTUFBTSxNQUFNLEtBQU4sR0FBYyxJQUFkLEVBQVY7QUFDQSxXQUFJLFFBQVEsTUFBTSxJQUFOLENBQVcsR0FBWCxFQUFnQixJQUFoQixFQUFaO0FBQ0EsWUFBSyxNQUFMLENBQVksR0FBWixFQUFpQixLQUFqQjtBQUNELE1BTEQ7QUFNQSxZQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFLLElBQUwsQ0FBVSxRQUFRLFNBQWxCOztBQUVBLFlBQVMsUUFBVCxDQUFrQixRQUFsQixFQUE0QixPQUE1QixFQUFxQztBQUNuQyxTQUFJLENBQUMsT0FBTCxFQUFjO0FBQ1osaUJBQVUsRUFBVjtBQUNEOztBQUVELFVBQUssSUFBTCxHQUFZLFNBQVo7QUFDQSxVQUFLLE1BQUwsR0FBYyxRQUFRLE1BQXRCO0FBQ0EsVUFBSyxFQUFMLEdBQVUsS0FBSyxNQUFMLElBQWUsR0FBZixJQUFzQixLQUFLLE1BQUwsR0FBYyxHQUE5QztBQUNBLFVBQUssVUFBTCxHQUFrQixRQUFRLFVBQTFCO0FBQ0EsVUFBSyxPQUFMLEdBQWUsUUFBUSxPQUFSLFlBQTJCLE9BQTNCLEdBQXFDLFFBQVEsT0FBN0MsR0FBdUQsSUFBSSxPQUFKLENBQVksUUFBUSxPQUFwQixDQUF0RTtBQUNBLFVBQUssR0FBTCxHQUFXLFFBQVEsR0FBUixJQUFlLEVBQTFCO0FBQ0EsVUFBSyxTQUFMLENBQWUsUUFBZjtBQUNEOztBQUVELFFBQUssSUFBTCxDQUFVLFNBQVMsU0FBbkI7O0FBRUEsWUFBUyxTQUFULENBQW1CLEtBQW5CLEdBQTJCLFlBQVc7QUFDcEMsWUFBTyxJQUFJLFFBQUosQ0FBYSxLQUFLLFNBQWxCLEVBQTZCO0FBQ2xDLGVBQVEsS0FBSyxNQURxQjtBQUVsQyxtQkFBWSxLQUFLLFVBRmlCO0FBR2xDLGdCQUFTLElBQUksT0FBSixDQUFZLEtBQUssT0FBakIsQ0FIeUI7QUFJbEMsWUFBSyxLQUFLO0FBSndCLE1BQTdCLENBQVA7QUFNRCxJQVBEOztBQVNBLFlBQVMsS0FBVCxHQUFpQixZQUFXO0FBQzFCLFNBQUksV0FBVyxJQUFJLFFBQUosQ0FBYSxJQUFiLEVBQW1CLEVBQUMsUUFBUSxDQUFULEVBQVksWUFBWSxFQUF4QixFQUFuQixDQUFmO0FBQ0EsY0FBUyxJQUFULEdBQWdCLE9BQWhCO0FBQ0EsWUFBTyxRQUFQO0FBQ0QsSUFKRDs7QUFNQSxPQUFJLG1CQUFtQixDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixDQUF2Qjs7QUFFQSxZQUFTLFFBQVQsR0FBb0IsVUFBUyxHQUFULEVBQWMsTUFBZCxFQUFzQjtBQUN4QyxTQUFJLGlCQUFpQixPQUFqQixDQUF5QixNQUF6QixNQUFxQyxDQUFDLENBQTFDLEVBQTZDO0FBQzNDLGFBQU0sSUFBSSxVQUFKLENBQWUscUJBQWYsQ0FBTjtBQUNEOztBQUVELFlBQU8sSUFBSSxRQUFKLENBQWEsSUFBYixFQUFtQixFQUFDLFFBQVEsTUFBVCxFQUFpQixTQUFTLEVBQUMsVUFBVSxHQUFYLEVBQTFCLEVBQW5CLENBQVA7QUFDRCxJQU5EOztBQVFBLFFBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxRQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsUUFBSyxRQUFMLEdBQWdCLFFBQWhCOztBQUVBLFFBQUssS0FBTCxHQUFhLFVBQVMsS0FBVCxFQUFnQixJQUFoQixFQUFzQjtBQUNqQyxZQUFPLElBQUksT0FBSixDQUFZLFVBQVMsT0FBVCxFQUFrQixNQUFsQixFQUEwQjtBQUMzQyxXQUFJLE9BQUo7QUFDQSxXQUFJLFFBQVEsU0FBUixDQUFrQixhQUFsQixDQUFnQyxLQUFoQyxLQUEwQyxDQUFDLElBQS9DLEVBQXFEO0FBQ25ELG1CQUFVLEtBQVY7QUFDRCxRQUZELE1BRU87QUFDTCxtQkFBVSxJQUFJLE9BQUosQ0FBWSxLQUFaLEVBQW1CLElBQW5CLENBQVY7QUFDRDs7QUFFRCxXQUFJLE1BQU0sSUFBSSxjQUFKLEVBQVY7O0FBRUEsZ0JBQVMsV0FBVCxHQUF1QjtBQUNyQixhQUFJLGlCQUFpQixHQUFyQixFQUEwQjtBQUN4QixrQkFBTyxJQUFJLFdBQVg7QUFDRDs7QUFFRDtBQUNBLGFBQUksbUJBQW1CLElBQW5CLENBQXdCLElBQUkscUJBQUosRUFBeEIsQ0FBSixFQUEwRDtBQUN4RCxrQkFBTyxJQUFJLGlCQUFKLENBQXNCLGVBQXRCLENBQVA7QUFDRDs7QUFFRDtBQUNEOztBQUVELFdBQUksTUFBSixHQUFhLFlBQVc7QUFDdEIsYUFBSSxVQUFVO0FBQ1osbUJBQVEsSUFBSSxNQURBO0FBRVosdUJBQVksSUFBSSxVQUZKO0FBR1osb0JBQVMsUUFBUSxHQUFSLENBSEc7QUFJWixnQkFBSztBQUpPLFVBQWQ7QUFNQSxhQUFJLE9BQU8sY0FBYyxHQUFkLEdBQW9CLElBQUksUUFBeEIsR0FBbUMsSUFBSSxZQUFsRDtBQUNBLGlCQUFRLElBQUksUUFBSixDQUFhLElBQWIsRUFBbUIsT0FBbkIsQ0FBUjtBQUNELFFBVEQ7O0FBV0EsV0FBSSxPQUFKLEdBQWMsWUFBVztBQUN2QixnQkFBTyxJQUFJLFNBQUosQ0FBYyx3QkFBZCxDQUFQO0FBQ0QsUUFGRDs7QUFJQSxXQUFJLFNBQUosR0FBZ0IsWUFBVztBQUN6QixnQkFBTyxJQUFJLFNBQUosQ0FBYyx3QkFBZCxDQUFQO0FBQ0QsUUFGRDs7QUFJQSxXQUFJLElBQUosQ0FBUyxRQUFRLE1BQWpCLEVBQXlCLFFBQVEsR0FBakMsRUFBc0MsSUFBdEM7O0FBRUEsV0FBSSxRQUFRLFdBQVIsS0FBd0IsU0FBNUIsRUFBdUM7QUFDckMsYUFBSSxlQUFKLEdBQXNCLElBQXRCO0FBQ0Q7O0FBRUQsV0FBSSxrQkFBa0IsR0FBbEIsSUFBeUIsUUFBUSxJQUFyQyxFQUEyQztBQUN6QyxhQUFJLFlBQUosR0FBbUIsTUFBbkI7QUFDRDs7QUFFRCxlQUFRLE9BQVIsQ0FBZ0IsT0FBaEIsQ0FBd0IsVUFBUyxLQUFULEVBQWdCLElBQWhCLEVBQXNCO0FBQzVDLGFBQUksZ0JBQUosQ0FBcUIsSUFBckIsRUFBMkIsS0FBM0I7QUFDRCxRQUZEOztBQUlBLFdBQUksSUFBSixDQUFTLE9BQU8sUUFBUSxTQUFmLEtBQTZCLFdBQTdCLEdBQTJDLElBQTNDLEdBQWtELFFBQVEsU0FBbkU7QUFDRCxNQXpETSxDQUFQO0FBMERELElBM0REO0FBNERBLFFBQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsSUFBdEI7QUFDRCxFQWhiRCxFQWdiRyxPQUFPLElBQVAsS0FBZ0IsV0FBaEIsR0FBOEIsSUFBOUIsWUFoYkgsRSIsImZpbGUiOiIxLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihzZWxmKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBpZiAoc2VsZi5mZXRjaCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6ICdGaWxlUmVhZGVyJyBpbiBzZWxmICYmICdCbG9iJyBpbiBzZWxmICYmIChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG5ldyBCbG9iKClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KSgpLFxuICAgIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIHNlbGYsXG4gICAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gc2VsZlxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTmFtZShuYW1lKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICAgIH1cbiAgICBpZiAoL1teYS16MC05XFwtIyQlJicqKy5cXF5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgICB9XG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbiAgZnVuY3Rpb24gaXRlcmF0b3JGb3IoaXRlbXMpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSB7XG4gICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlbXMuc2hpZnQoKVxuICAgICAgICByZXR1cm4ge2RvbmU6IHZhbHVlID09PSB1bmRlZmluZWQsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlcmF0b3JcbiAgfVxuXG4gIGZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMubWFwID0ge31cblxuICAgIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgICAgfSwgdGhpcylcblxuICAgIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICAgIHZhciBsaXN0ID0gdGhpcy5tYXBbbmFtZV1cbiAgICBpZiAoIWxpc3QpIHtcbiAgICAgIGxpc3QgPSBbXVxuICAgICAgdGhpcy5tYXBbbmFtZV0gPSBsaXN0XG4gICAgfVxuICAgIGxpc3QucHVzaCh2YWx1ZSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgdmFsdWVzID0gdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgICByZXR1cm4gdmFsdWVzID8gdmFsdWVzWzBdIDogbnVsbFxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSB8fCBbXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IFtub3JtYWxpemVWYWx1ZSh2YWx1ZSldXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLm1hcCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLm1hcFtuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsdWUsIG5hbWUsIHRoaXMpXG4gICAgICB9LCB0aGlzKVxuICAgIH0sIHRoaXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChuYW1lKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IGl0ZW1zLnB1c2godmFsdWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICAgIH1cbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgICByZXR1cm4gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpXG4gICAgcmV0dXJuIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIH1cblxuICBmdW5jdGlvbiBCb2R5KCkge1xuICAgIHRoaXMuYm9keVVzZWQgPSBmYWxzZVxuXG4gICAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgICB9IGVsc2UgaWYgKCFib2R5KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAvLyBPbmx5IHN1cHBvcnQgQXJyYXlCdWZmZXJzIGZvciBQT1NUIG1ldGhvZC5cbiAgICAgICAgLy8gUmVjZWl2aW5nIEFycmF5QnVmZmVycyBoYXBwZW5zIHZpYSBCbG9icywgaW5zdGVhZC5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZEJsb2JBc1RleHQodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIHRleHQnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIHJldHVybiByZWplY3RlZCA/IHJlamVjdGVkIDogUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuICAgIGlmIChSZXF1ZXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGlucHV0KSkge1xuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICAgIGlmICghYm9keSkge1xuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IGlucHV0XG4gICAgfVxuXG4gICAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnb21pdCdcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB9XG4gICAgdGhpcy5tZXRob2QgPSBub3JtYWxpemVNZXRob2Qob3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCcpXG4gICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gICAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgICB9XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keSlcbiAgfVxuXG4gIFJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMpXG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgICBib2R5LnRyaW0oKS5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGZvcm1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhlYWRlcnMoeGhyKSB7XG4gICAgdmFyIGhlYWQgPSBuZXcgSGVhZGVycygpXG4gICAgdmFyIHBhaXJzID0gKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJykudHJpbSgpLnNwbGl0KCdcXG4nKVxuICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICB2YXIgc3BsaXQgPSBoZWFkZXIudHJpbSgpLnNwbGl0KCc6JylcbiAgICAgIHZhciBrZXkgPSBzcGxpdC5zaGlmdCgpLnRyaW0oKVxuICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignOicpLnRyaW0oKVxuICAgICAgaGVhZC5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICB9KVxuICAgIHJldHVybiBoZWFkXG4gIH1cblxuICBCb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbiAgZnVuY3Rpb24gUmVzcG9uc2UoYm9keUluaXQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cblxuICAgIHRoaXMudHlwZSA9ICdkZWZhdWx0J1xuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXNcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gb3B0aW9ucy5zdGF0dXNUZXh0XG4gICAgdGhpcy5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycyA/IG9wdGlvbnMuaGVhZGVycyA6IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsIHx8ICcnXG4gICAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG4gIH1cblxuICBCb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKVxuXG4gIFJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgICAgdXJsOiB0aGlzLnVybFxuICAgIH0pXG4gIH1cblxuICBSZXNwb25zZS5lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG4gIFJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG4gIH1cblxuICBzZWxmLkhlYWRlcnMgPSBIZWFkZXJzXG4gIHNlbGYuUmVxdWVzdCA9IFJlcXVlc3RcbiAgc2VsZi5SZXNwb25zZSA9IFJlc3BvbnNlXG5cbiAgc2VsZi5mZXRjaCA9IGZ1bmN0aW9uKGlucHV0LCBpbml0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlcXVlc3RcbiAgICAgIGlmIChSZXF1ZXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGlucHV0KSAmJiAhaW5pdCkge1xuICAgICAgICByZXF1ZXN0ID0gaW5wdXRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChpbnB1dCwgaW5pdClcbiAgICAgIH1cblxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlVVJMKCkge1xuICAgICAgICBpZiAoJ3Jlc3BvbnNlVVJMJyBpbiB4aHIpIHtcbiAgICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVVJMXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdm9pZCBzZWN1cml0eSB3YXJuaW5ncyBvbiBnZXRSZXNwb25zZUhlYWRlciB3aGVuIG5vdCBhbGxvd2VkIGJ5IENPUlNcbiAgICAgICAgaWYgKC9eWC1SZXF1ZXN0LVVSTDovbS50ZXN0KHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpIHtcbiAgICAgICAgICByZXR1cm4geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlcXVlc3QtVVJMJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzKHhociksXG4gICAgICAgICAgdXJsOiByZXNwb25zZVVSTCgpXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHRcbiAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9wZW4ocmVxdWVzdC5tZXRob2QsIHJlcXVlc3QudXJsLCB0cnVlKVxuXG4gICAgICBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ2luY2x1ZGUnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICAgIH1cblxuICAgICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgICB9KVxuXG4gICAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICAgIH0pXG4gIH1cbiAgc2VsZi5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4uL21hbGFua2Evfi93aGF0d2ctZmV0Y2gvZmV0Y2guanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9