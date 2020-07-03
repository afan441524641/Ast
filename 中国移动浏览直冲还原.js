/*https://flow.clientaccess.10086.cn/leadeon-flow-touch/pages/flow/payFlow.html*/
var t = (this, function () {
  var e = e || function (e, t) {
    var n = {},
    r = n.lib = {},
    i = r.Base = function () {
      function e() {}
      return {
        extend: function (t) {
          e.prototype = this;
          var n = new e();
          return t && n.mixIn(t),
          n.hasOwnProperty("init") || (n.init = function () {
            n.$super.init.apply(this, arguments);
          }),

          n.init.prototype = n,
          n.$super = this,
          n;
        },
        create: function () {
          var e = this.extend();
          return e.init.apply(e, arguments),
          e;
        },
        init: function () {},
        mixIn: function (e) {
          for (var t in e)
          e.hasOwnProperty(t) && (this[t] = e[t]);
          e.hasOwnProperty("toString") && (this.toString = e.toString);
        },
        clone: function () {
          return this.init.prototype.extend(this);
        } };

    }(),
    o = r.WordArray = i.extend({
      init: function (e, n) {
        e = this.words = e || [],
        n != t ? this.sigBytes = n : this.sigBytes = 4 * e.length;
      },
      toString: function (e) {
        return (e || s).stringify(this);
      },
      concat: function (e) {
        var t = this.words,
        n = e.words,
        r = this.sigBytes,
        i = e.sigBytes;
        if (this.clamp(),
        r % 4)
        for (var o = 0; o < i; o++) {
          var a = n[o >>> 2] >>> 24 - o % 4 * 8 & 255;
          t[r + o >>> 2] |= a << 24 - (r + o) % 4 * 8;
        } else

        for (var o = 0; o < i; o += 4)
        t[r + o >>> 2] = n[o >>> 2];
        return this.sigBytes += i,
        this;
      },
      clamp: function () {
        var t = this.words,
        n = this.sigBytes;
        t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8,
        t.length = e.ceil(n / 4);
      },
      clone: function () {
        var e = i.clone.call(this);
        return e.words = this.words.slice(0),
        e;
      },
      random: function (t) {
        for (var n, r = [], i = function (t) {
          var t = t,
          n = 987654321,
          r = 4294967295;
          return function () {
            n = 36969 * (65535 & n) + (n >> 16) & r,
            t = 18e3 * (65535 & t) + (t >> 16) & r;
            var i = (n << 16) + t & r;
            return i /= 4294967296,
            i += .5,
            i * (e.random() > .5 ? 1 : -1);
          };
        }, a = 0; a < t; a += 4) {
          var s = i(4294967296 * (n || e.random()));
          n = 987654071 * s(),
          r.push(4294967296 * s() | 0);
        }
        return new o.init(r, t);
      } }),

    a = n.enc = {},
    s = a.Hex = {
      stringify: function (e) {
        for (var t = e.words, n = e.sigBytes, r = [], i = 0; i < n; i++) {
          var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
          r.push((o >>> 4).toString(16)),
          r.push((15 & o).toString(16));
        }
        return r.join("");
      },
      parse: function (e) {
        for (var t = e.length, n = [], r = 0; r < t; r += 2)
        n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - r % 8 * 4;
        return new o.init(n, t / 2);
      } },

    c = a.Latin1 = {
      stringify: function (e) {
        for (var t = e.words, n = e.sigBytes, r = [], i = 0; i < n; i++) {
          var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
          r.push(String.fromCharCode(o));
        }
        return r.join("");
      },
      parse: function (e) {
        for (var t = e.length, n = [], r = 0; r < t; r++)
        n[r >>> 2] |= (255 & e.charCodeAt(r)) << 24 - r % 4 * 8;
        return new o.init(n, t);
      } },

    l = a.Utf8 = {
      stringify: function (e) {
        try {
          return decodeURIComponent(escape(c.stringify(e)));
        } catch (t) {
          throw new Error("Malformed UTF-8 data");
        }
      },
      parse: function (e) {
        return c.parse(unescape(encodeURIComponent(e)));
      } },

    u = r.BufferedBlockAlgorithm = i.extend({
      reset: function () {
        this._data = new o.init(),
        this._nDataBytes = 0;
      },
      _append: function (e) {
        "string" == typeof e && (e = l.parse(e)),
        this._data.concat(e),
        this._nDataBytes += e.sigBytes;
      },
      _process: function (t) {
        var n = this._data,
        r = n.words,
        i = n.sigBytes,
        a = this.blockSize,
        s = 4 * a,
        c = i / s;
        c = t ? e.ceil(c) : e.max((0 | c) - this._minBufferSize, 0);
        var l = c * a,
        u = e.min(4 * l, i);
        if (l) {
          for (var f = 0; f < l; f += a)
          this._doProcessBlock(r, f);
          var d = r.splice(0, l);
          n.sigBytes -= u;
        }
        return new o.init(d, u);
      },
      clone: function () {
        var e = i.clone.call(this);
        return e._data = this._data.clone(),
        e;
      },
      _minBufferSize: 0 }),

    f = (r.Hasher = u.extend({
      cfg: i.extend(),
      init: function (e) {
        this.cfg = this.cfg.extend(e),
        this.reset();
      },
      reset: function () {
        u.reset.call(this),
        this._doReset();
      },
      update: function (e) {
        return this._append(e),
        this._process(),
        this;
      },
      finalize: function (e) {
        e && this._append(e);
        var t = this._doFinalize();
        return t;
      },
      blockSize: 16,
      _createHelper: function (e) {
        return function (t, n) {
          return new e.init(n).finalize(t);
        };
      },
      _createHmacHelper: function (e) {
        return function (t, n) {
          return new f.HMAC.init(e, n).finalize(t);
        };
      } }),

    n.algo = {});
    return n;
  }(Math);
  return function () {
    var t = e,
    n = t.lib,
    r = n.WordArray,
    i = t.enc;
    i.Base64 = {
      stringify: function (e) {
        var t = e.words,
        n = e.sigBytes,
        r = this._map;
        e.clamp();
        for (var i = [], o = 0; o < n; o += 3)
        for (var a = t[o >>> 2] >>> 24 - o % 4 * 8 & 255, s = t[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255, c = t[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, l = a << 16 | s << 8 | c, u = 0; u < 4 && o + .75 * u < n; u++)
        i.push(r.charAt(l >>> 6 * (3 - u) & 63));
        var f = r.charAt(64);
        if (f)
        for (; i.length % 4;)
        i.push(f);
        return i.join("");
      },
      parse: function (e) {
        var t = e.length,
        n = this._map,
        i = n.charAt(64);
        if (i) {
          var o = e.indexOf(i);
          o != -1 && (t = o);
        }
        for (var a = [], s = 0, c = 0; c < t; c++)
        if (c % 4) {
          var l = n.indexOf(e.charAt(c - 1)) << c % 4 * 2,
          u = n.indexOf(e.charAt(c)) >>> 6 - c % 4 * 2,
          f = l | u;
          a[s >>> 2] |= f << 24 - s % 4 * 8,
          s++;
        }
        return r.create(a, s);
      },
      _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };

  }(),
  function (t) {
    function n(e, t, n, r, i, o, a) {
      var s = e + (t & n | ~t & r) + i + a;
      return (s << o | s >>> 32 - o) + t;
    }
    function r(e, t, n, r, i, o, a) {
      var s = e + (t & r | n & ~r) + i + a;
      return (s << o | s >>> 32 - o) + t;
    }
    function i(e, t, n, r, i, o, a) {
      var s = e + (t ^ n ^ r) + i + a;
      return (s << o | s >>> 32 - o) + t;
    }
    function o(e, t, n, r, i, o, a) {
      var s = e + (n ^ (t | ~r)) + i + a;
      return (s << o | s >>> 32 - o) + t;
    }
    var a = e,
    s = a.lib,
    c = s.WordArray,
    l = s.Hasher,
    u = a.algo,
    f = [];
    !function () {
      for (var e = 0; e < 64; e++)
      f[e] = 4294967296 * t.abs(t.sin(e + 1)) | 0;
    }();
    var d = u.MD5 = l.extend({
      _doReset: function () {
        this._hash = new c.init([1732584193, 4023233417, 2562383102, 271733878]);
      },
      _doProcessBlock: function (e, t) {
        for (var a = 0; a < 16; a++) {
          var s = t + a,
          c = e[s];
          e[s] = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8);
        }
        var l = this._hash.words,
        u = e[t + 0],
        d = e[t + 1],
        h = e[t + 2],
        p = e[t + 3],
        v = e[t + 4],
        g = e[t + 5],
        y = e[t + 6],
        m = e[t + 7],
        b = e[t + 8],
        x = e[t + 9],
        w = e[t + 10],
        _ = e[t + 11],
        k = e[t + 12],
        C = e[t + 13],
        T = e[t + 14],
        S = e[t + 15],
        E = l[0],
        B = l[1],
        N = l[2],
        A = l[3];
        E = n(E, B, N, A, u, 7, f[0]),
        A = n(A, E, B, N, d, 12, f[1]),
        N = n(N, A, E, B, h, 17, f[2]),
        B = n(B, N, A, E, p, 22, f[3]),
        E = n(E, B, N, A, v, 7, f[4]),
        A = n(A, E, B, N, g, 12, f[5]),
        N = n(N, A, E, B, y, 17, f[6]),
        B = n(B, N, A, E, m, 22, f[7]),
        E = n(E, B, N, A, b, 7, f[8]),
        A = n(A, E, B, N, x, 12, f[9]),
        N = n(N, A, E, B, w, 17, f[10]),
        B = n(B, N, A, E, _, 22, f[11]),
        E = n(E, B, N, A, k, 7, f[12]),
        A = n(A, E, B, N, C, 12, f[13]),
        N = n(N, A, E, B, T, 17, f[14]),
        B = n(B, N, A, E, S, 22, f[15]),
        E = r(E, B, N, A, d, 5, f[16]),
        A = r(A, E, B, N, y, 9, f[17]),
        N = r(N, A, E, B, _, 14, f[18]),
        B = r(B, N, A, E, u, 20, f[19]),
        E = r(E, B, N, A, g, 5, f[20]),
        A = r(A, E, B, N, w, 9, f[21]),
        N = r(N, A, E, B, S, 14, f[22]),
        B = r(B, N, A, E, v, 20, f[23]),
        E = r(E, B, N, A, x, 5, f[24]),
        A = r(A, E, B, N, T, 9, f[25]),
        N = r(N, A, E, B, p, 14, f[26]),
        B = r(B, N, A, E, b, 20, f[27]),
        E = r(E, B, N, A, C, 5, f[28]),
        A = r(A, E, B, N, h, 9, f[29]),
        N = r(N, A, E, B, m, 14, f[30]),
        B = r(B, N, A, E, k, 20, f[31]),
        E = i(E, B, N, A, g, 4, f[32]),
        A = i(A, E, B, N, b, 11, f[33]),
        N = i(N, A, E, B, _, 16, f[34]),
        B = i(B, N, A, E, T, 23, f[35]),
        E = i(E, B, N, A, d, 4, f[36]),
        A = i(A, E, B, N, v, 11, f[37]),
        N = i(N, A, E, B, m, 16, f[38]),
        B = i(B, N, A, E, w, 23, f[39]),
        E = i(E, B, N, A, C, 4, f[40]),
        A = i(A, E, B, N, u, 11, f[41]),
        N = i(N, A, E, B, p, 16, f[42]),
        B = i(B, N, A, E, y, 23, f[43]),
        E = i(E, B, N, A, x, 4, f[44]),
        A = i(A, E, B, N, k, 11, f[45]),
        N = i(N, A, E, B, S, 16, f[46]),
        B = i(B, N, A, E, h, 23, f[47]),
        E = o(E, B, N, A, u, 6, f[48]),
        A = o(A, E, B, N, m, 10, f[49]),
        N = o(N, A, E, B, T, 15, f[50]),
        B = o(B, N, A, E, g, 21, f[51]),
        E = o(E, B, N, A, k, 6, f[52]),
        A = o(A, E, B, N, p, 10, f[53]),
        N = o(N, A, E, B, w, 15, f[54]),
        B = o(B, N, A, E, d, 21, f[55]),
        E = o(E, B, N, A, b, 6, f[56]),
        A = o(A, E, B, N, S, 10, f[57]),
        N = o(N, A, E, B, y, 15, f[58]),
        B = o(B, N, A, E, C, 21, f[59]),
        E = o(E, B, N, A, v, 6, f[60]),
        A = o(A, E, B, N, _, 10, f[61]),
        N = o(N, A, E, B, h, 15, f[62]),
        B = o(B, N, A, E, x, 21, f[63]),
        l[0] = l[0] + E | 0,
        l[1] = l[1] + B | 0,
        l[2] = l[2] + N | 0,
        l[3] = l[3] + A | 0;
      },
      _doFinalize: function () {
        var e = this._data,
        n = e.words,
        r = 8 * this._nDataBytes,
        i = 8 * e.sigBytes;
        n[i >>> 5] |= 128 << 24 - i % 32;
        var o = t.floor(r / 4294967296),
        a = r;
        n[(i + 64 >>> 9 << 4) + 15] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
        n[(i + 64 >>> 9 << 4) + 14] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
        e.sigBytes = 4 * (n.length + 1),
        this._process();
        for (var s = this._hash, c = s.words, l = 0; l < 4; l++) {
          var u = c[l];
          c[l] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8);
        }
        return s;
      },
      clone: function () {
        var e = l.clone.call(this);
        return e._hash = this._hash.clone(),
        e;
      } });

    a.MD5 = l._createHelper(d),
    a.HmacMD5 = l._createHmacHelper(d);
  }(Math),
  function () {
    var t = e,
    n = t.lib,
    r = n.WordArray,
    i = n.Hasher,
    o = t.algo,
    a = [],
    s = o.SHA1 = i.extend({
      _doReset: function () {
        this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
      },
      _doProcessBlock: function (e, t) {
        for (var n = this._hash.words, r = n[0], i = n[1], o = n[2], s = n[3], c = n[4], l = 0; l < 80; l++) {
          if (l < 16)
          a[l] = 0 | e[t + l];else
          {
            var u = a[l - 3] ^ a[l - 8] ^ a[l - 14] ^ a[l - 16];
            a[l] = u << 1 | u >>> 31;
          }
          var f = (r << 5 | r >>> 27) + c + a[l];
          f += l < 20 ? (i & o | ~i & s) + 1518500249 : l < 40 ? (i ^ o ^ s) + 1859775393 : l < 60 ? (i & o | i & s | o & s) - 1894007588 : (i ^ o ^ s) - 899497514,
          c = s,
          s = o,
          o = i << 30 | i >>> 2,
          i = r,
          r = f;
        }
        n[0] = n[0] + r | 0,
        n[1] = n[1] + i | 0,
        n[2] = n[2] + o | 0,
        n[3] = n[3] + s | 0,
        n[4] = n[4] + c | 0;
      },
      _doFinalize: function () {
        var e = this._data,
        t = e.words,
        n = 8 * this._nDataBytes,
        r = 8 * e.sigBytes;
        return t[r >>> 5] |= 128 << 24 - r % 32,
        t[(r + 64 >>> 9 << 4) + 14] = Math.floor(n / 4294967296),
        t[(r + 64 >>> 9 << 4) + 15] = n,
        e.sigBytes = 4 * t.length,
        this._process(),
        this._hash;
      },
      clone: function () {
        var e = i.clone.call(this);
        return e._hash = this._hash.clone(),
        e;
      } });

    t.SHA1 = i._createHelper(s),
    t.HmacSHA1 = i._createHmacHelper(s);
  }(),
  function (t) {
    var n = e,
    r = n.lib,
    i = r.WordArray,
    o = r.Hasher,
    a = n.algo,
    s = [],
    c = [];
    !function () {
      function e(e) {
        for (var n = t.sqrt(e), r = 2; r <= n; r++)
        if (!(e % r))
        return !1;
        return !0;
      }
      function n(e) {
        return 4294967296 * (e - (0 | e)) | 0;
      }
      for (var r = 2, i = 0; i < 64;)
      e(r) && (i < 8 && (s[i] = n(t.pow(r, .5))),
      c[i] = n(t.pow(r, 1 / 3)),
      i++),
      r++;
    }();
    var l = [],
    u = a.SHA256 = o.extend({
      _doReset: function () {
        this._hash = new i.init(s.slice(0));
      },
      _doProcessBlock: function (e, t) {
        for (var n = this._hash.words, r = n[0], i = n[1], o = n[2], a = n[3], s = n[4], u = n[5], f = n[6], d = n[7], h = 0; h < 64; h++) {
          if (h < 16)
          l[h] = 0 | e[t + h];else
          {
            var p = l[h - 15],
            v = (p << 25 | p >>> 7) ^ (p << 14 | p >>> 18) ^ p >>> 3,
            g = l[h - 2],
            y = (g << 15 | g >>> 17) ^ (g << 13 | g >>> 19) ^ g >>> 10;
            l[h] = v + l[h - 7] + y + l[h - 16];
          }
          var m = s & u ^ ~s & f,
          b = r & i ^ r & o ^ i & o,
          x = (r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22),
          w = (s << 26 | s >>> 6) ^ (s << 21 | s >>> 11) ^ (s << 7 | s >>> 25),
          _ = d + w + m + c[h] + l[h],
          k = x + b;
          d = f,
          f = u,
          u = s,
          s = a + _ | 0,
          a = o,
          o = i,
          i = r,
          r = _ + k | 0;
        }
        n[0] = n[0] + r | 0,
        n[1] = n[1] + i | 0,
        n[2] = n[2] + o | 0,
        n[3] = n[3] + a | 0,
        n[4] = n[4] + s | 0,
        n[5] = n[5] + u | 0,
        n[6] = n[6] + f | 0,
        n[7] = n[7] + d | 0;
      },
      _doFinalize: function () {
        var e = this._data,
        n = e.words,
        r = 8 * this._nDataBytes,
        i = 8 * e.sigBytes;
        return n[i >>> 5] |= 128 << 24 - i % 32,
        n[(i + 64 >>> 9 << 4) + 14] = t.floor(r / 4294967296),
        n[(i + 64 >>> 9 << 4) + 15] = r,
        e.sigBytes = 4 * n.length,
        this._process(),
        this._hash;
      },
      clone: function () {
        var e = o.clone.call(this);
        return e._hash = this._hash.clone(),
        e;
      } });

    n.SHA256 = o._createHelper(u),
    n.HmacSHA256 = o._createHmacHelper(u);
  }(Math),
  function () {
    function t(e) {
      return e << 8 & 4278255360 | e >>> 8 & 16711935;
    }
    var n = e,
    r = n.lib,
    i = r.WordArray,
    o = n.enc;
    o.Utf16 = o.Utf16BE = {
      stringify: function (e) {
        for (var t = e.words, n = e.sigBytes, r = [], i = 0; i < n; i += 2) {
          var o = t[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
          r.push(String.fromCharCode(o));
        }
        return r.join("");
      },
      parse: function (e) {
        for (var t = e.length, n = [], r = 0; r < t; r++)
        n[r >>> 1] |= e.charCodeAt(r) << 16 - r % 2 * 16;
        return i.create(n, 2 * t);
      } };

    o.Utf16LE = {
      stringify: function (e) {
        for (var n = e.words, r = e.sigBytes, i = [], o = 0; o < r; o += 2) {
          var a = t(n[o >>> 2] >>> 16 - o % 4 * 8 & 65535);
          i.push(String.fromCharCode(a));
        }
        return i.join("");
      },
      parse: function (e) {
        for (var n = e.length, r = [], o = 0; o < n; o++)
        r[o >>> 1] |= t(e.charCodeAt(o) << 16 - o % 2 * 16);
        return i.create(r, 2 * n);
      } };

  }(),
  function () {
    if ("function" == typeof ArrayBuffer) {
      var t = e,
      n = t.lib,
      r = n.WordArray,
      i = r.init,
      o = r.init = function (e) {
        if (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
        (e instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array) && (e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength)),
        e instanceof Uint8Array) {
          for (var t = e.byteLength, n = [], r = 0; r < t; r++)
          n[r >>> 2] |= e[r] << 24 - r % 4 * 8;
          i.call(this, n, t);
        } else
        i.apply(this, arguments);
      };

      o.prototype = r;
    }
  }(),
  function (t) {
    function n(e, t, n) {
      return e ^ t ^ n;
    }
    function r(e, t, n) {
      return e & t | ~e & n;
    }
    function i(e, t, n) {
      return (e | ~t) ^ n;
    }
    function o(e, t, n) {
      return e & n | t & ~n;
    }
    function a(e, t, n) {
      return e ^ (t | ~n);
    }
    function s(e, t) {
      return e << t | e >>> 32 - t;
    }
    var c = e,
    l = c.lib,
    u = l.WordArray,
    f = l.Hasher,
    d = c.algo,
    h = u.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]),
    p = u.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]),
    v = u.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]),
    g = u.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]),
    y = u.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),
    m = u.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),
    b = d.RIPEMD160 = f.extend({
      _doReset: function () {
        this._hash = u.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
      },
      _doProcessBlock: function (e, t) {
        for (var c = 0; c < 16; c++) {
          var l = t + c,
          u = e[l];
          e[l] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8);
        }
        var f,d,b,x,w,_,k,C,T,S,E = this._hash.words,B = y.words,N = m.words,A = h.words,H = p.words,D = v.words,j = g.words;
        _ = f = E[0],
        k = d = E[1],
        C = b = E[2],
        T = x = E[3],
        S = w = E[4];
        for (var L, c = 0; c < 80; c += 1)
        L = f + e[t + A[c]] | 0,
        L += c < 16 ? n(d, b, x) + B[0] : c < 32 ? r(d, b, x) + B[1] : c < 48 ? i(d, b, x) + B[2] : c < 64 ? o(d, b, x) + B[3] : a(d, b, x) + B[4],
        L = 0 | L,
        L = s(L, D[c]),
        L = L + w | 0,
        f = w,
        w = x,
        x = s(b, 10),
        b = d,
        d = L,
        L = _ + e[t + H[c]] | 0,
        L += c < 16 ? a(k, C, T) + N[0] : c < 32 ? o(k, C, T) + N[1] : c < 48 ? i(k, C, T) + N[2] : c < 64 ? r(k, C, T) + N[3] : n(k, C, T) + N[4],
        L = 0 | L,
        L = s(L, j[c]),
        L = L + S | 0,
        _ = S,
        S = T,
        T = s(C, 10),
        C = k,
        k = L;
        L = E[1] + b + T | 0,
        E[1] = E[2] + x + S | 0,
        E[2] = E[3] + w + _ | 0,
        E[3] = E[4] + f + k | 0,
        E[4] = E[0] + d + C | 0,
        E[0] = L;
      },
      _doFinalize: function () {
        var e = this._data,
        t = e.words,
        n = 8 * this._nDataBytes,
        r = 8 * e.sigBytes;
        t[r >>> 5] |= 128 << 24 - r % 32,
        t[(r + 64 >>> 9 << 4) + 14] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8),
        e.sigBytes = 4 * (t.length + 1),
        this._process();
        for (var i = this._hash, o = i.words, a = 0; a < 5; a++) {
          var s = o[a];
          o[a] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
        }
        return i;
      },
      clone: function () {
        var e = f.clone.call(this);
        return e._hash = this._hash.clone(),
        e;
      } });

    c.RIPEMD160 = f._createHelper(b),
    c.HmacRIPEMD160 = f._createHmacHelper(b);
  }(Math),
  function () {
    var t = e,
    n = t.lib,
    r = n.Base,
    i = t.enc,
    o = i.Utf8,
    a = t.algo;
    a.HMAC = r.extend({
      init: function (e, t) {
        e = this._hasher = new e.init(),
        "string" == typeof t && (t = o.parse(t));
        var n = e.blockSize,
        r = 4 * n;
        t.sigBytes > r && (t = e.finalize(t)),
        t.clamp();
        for (var i = this._oKey = t.clone(), a = this._iKey = t.clone(), s = i.words, c = a.words, l = 0; l < n; l++)
        s[l] ^= 1549556828,
        c[l] ^= 909522486;
        i.sigBytes = a.sigBytes = r,
        this.reset();
      },
      reset: function () {
        var e = this._hasher;
        e.reset(),
        e.update(this._iKey);
      },
      update: function (e) {
        return this._hasher.update(e),
        this;
      },
      finalize: function (e) {
        var t = this._hasher,
        n = t.finalize(e);
        t.reset();
        var r = t.finalize(this._oKey.clone().concat(n));
        return r;
      } });

  }(),
  function () {
    var t = e,
    n = t.lib,
    r = n.Base,
    i = n.WordArray,
    o = t.algo,
    a = o.SHA1,
    s = o.HMAC,
    c = o.PBKDF2 = r.extend({
      cfg: r.extend({
        keySize: 4,
        hasher: a,
        iterations: 1 }),

      init: function (e) {
        this.cfg = this.cfg.extend(e);
      },
      compute: function (e, t) {
        for (var n = this.cfg, r = s.create(n.hasher, e), o = i.create(), a = i.create([1]), c = o.words, l = a.words, u = n.keySize, f = n.iterations; c.length < u;) {
          var d = r.update(t).finalize(a);
          r.reset();
          for (var h = d.words, p = h.length, v = d, g = 1; g < f; g++) {
            v = r.finalize(v),
            r.reset();
            for (var y = v.words, m = 0; m < p; m++)
            h[m] ^= y[m];
          }
          o.concat(d),
          l[0]++;
        }
        return o.sigBytes = 4 * u,
        o;
      } });

    t.PBKDF2 = function (e, t, n) {
      return c.create(n).compute(e, t);
    };
  }(),
  function () {
    var t = e,
    n = t.lib,
    r = n.Base,
    i = n.WordArray,
    o = t.algo,
    a = o.MD5,
    s = o.EvpKDF = r.extend({
      cfg: r.extend({
        keySize: 4,
        hasher: a,
        iterations: 1 }),

      init: function (e) {
        this.cfg = this.cfg.extend(e);
      },
      compute: function (e, t) {
        for (var n = this.cfg, r = n.hasher.create(), o = i.create(), a = o.words, s = n.keySize, c = n.iterations; a.length < s;) {
          l && r.update(l);
          var l = r.update(e).finalize(t);
          r.reset();
          for (var u = 1; u < c; u++)
          l = r.finalize(l),
          r.reset();
          o.concat(l);
        }
        return o.sigBytes = 4 * s,
        o;
      } });

    t.EvpKDF = function (e, t, n) {
      return s.create(n).compute(e, t);
    };
  }(),
  function () {
    var t = e,
    n = t.lib,
    r = n.WordArray,
    i = t.algo,
    o = i.SHA256,
    a = i.SHA224 = o.extend({
      _doReset: function () {
        this._hash = new r.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);
      },
      _doFinalize: function () {
        var e = o._doFinalize.call(this);
        return e.sigBytes -= 4,
        e;
      } });

    t.SHA224 = o._createHelper(a),
    t.HmacSHA224 = o._createHmacHelper(a);
  }(),
  function (t) {
    var n = e,
    r = n.lib,
    i = r.Base,
    o = r.WordArray,
    a = n.x64 = {};
    a.Word = i.extend({
      init: function (e, t) {
        this.high = e,
        this.low = t;
      } }),

    a.WordArray = i.extend({
      init: function (e, n) {
        e = this.words = e || [],
        n != t ? this.sigBytes = n : this.sigBytes = 8 * e.length;
      },
      toX32: function () {
        for (var e = this.words, t = e.length, n = [], r = 0; r < t; r++) {
          var i = e[r];
          n.push(i.high),
          n.push(i.low);
        }
        return o.create(n, this.sigBytes);
      },
      clone: function () {
        for (var e = i.clone.call(this), t = e.words = this.words.slice(0), n = t.length, r = 0; r < n; r++)
        t[r] = t[r].clone();
        return e;
      } });

  }(),
  function (t) {
    var n = e,
    r = n.lib,
    i = r.WordArray,
    o = r.Hasher,
    a = n.x64,
    s = a.Word,
    c = n.algo,
    l = [],
    u = [],
    f = [];
    !function () {
      for (var e = 1, t = 0, n = 0; n < 24; n++) {
        l[e + 5 * t] = (n + 1) * (n + 2) / 2 % 64;
        var r = t % 5,
        i = (2 * e + 3 * t) % 5;
        e = r,
        t = i;
      }
      for (var e = 0; e < 5; e++)
      for (var t = 0; t < 5; t++)
      u[e + 5 * t] = t + (2 * e + 3 * t) % 5 * 5;
      for (var o = 1, a = 0; a < 24; a++) {
        for (var c = 0, d = 0, h = 0; h < 7; h++) {
          if (1 & o) {
            var p = (1 << h) - 1;
            p < 32 ? d ^= 1 << p : c ^= 1 << p - 32;
          }
          128 & o ? o = o << 1 ^ 113 : o <<= 1;
        }
        f[a] = s.create(c, d);
      }
    }();
    var d = [];
    !function () {
      for (var e = 0; e < 25; e++)
      d[e] = s.create();
    }();
    var h = c.SHA3 = o.extend({
      cfg: o.cfg.extend({
        outputLength: 512 }),

      _doReset: function () {
        for (var e = this._state = [], t = 0; t < 25; t++)
        e[t] = new s.init();
        this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
      },
      _doProcessBlock: function (e, t) {
        for (var n = this._state, r = this.blockSize / 2, i = 0; i < r; i++) {
          var o = e[t + 2 * i],
          a = e[t + 2 * i + 1];
          o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
          a = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8);
          var s = n[i];
          s.high ^= a,
          s.low ^= o;
        }
        for (var c = 0; c < 24; c++) {
          for (var h = 0; h < 5; h++) {
            for (var p = 0, v = 0, g = 0; g < 5; g++) {
              var s = n[h + 5 * g];
              p ^= s.high,
              v ^= s.low;
            }
            var y = d[h];
            y.high = p,
            y.low = v;
          }
          for (var h = 0; h < 5; h++)
          for (var m = d[(h + 4) % 5], b = d[(h + 1) % 5], x = b.high, w = b.low, p = m.high ^ (x << 1 | w >>> 31), v = m.low ^ (w << 1 | x >>> 31), g = 0; g < 5; g++) {
            var s = n[h + 5 * g];
            s.high ^= p,
            s.low ^= v;
          }
          for (var _ = 1; _ < 25; _++) {
            var s = n[_],
            k = s.high,
            C = s.low,
            T = l[_];
            if (T < 32)
            var p = k << T | C >>> 32 - T,
            v = C << T | k >>> 32 - T;else

            var p = C << T - 32 | k >>> 64 - T,
            v = k << T - 32 | C >>> 64 - T;
            var S = d[u[_]];
            S.high = p,
            S.low = v;
          }
          var E = d[0],
          B = n[0];
          E.high = B.high,
          E.low = B.low;
          for (var h = 0; h < 5; h++)
          for (var g = 0; g < 5; g++) {
            var _ = h + 5 * g,
            s = n[_],
            N = d[_],
            A = d[(h + 1) % 5 + 5 * g],
            H = d[(h + 2) % 5 + 5 * g];
            s.high = N.high ^ ~A.high & H.high,
            s.low = N.low ^ ~A.low & H.low;
          }
          var s = n[0],
          D = f[c];
          s.high ^= D.high,
          s.low ^= D.low;
        }
      },
      _doFinalize: function () {
        var e = this._data,
        n = e.words,
        r = (8 * this._nDataBytes,
        8 * e.sigBytes),
        o = 32 * this.blockSize;
        n[r >>> 5] |= 1 << 24 - r % 32,
        n[(t.ceil((r + 1) / o) * o >>> 5) - 1] |= 128,
        e.sigBytes = 4 * n.length,
        this._process();
        for (var a = this._state, s = this.cfg.outputLength / 8, c = s / 8, l = [], u = 0; u < c; u++) {
          var f = a[u],
          d = f.high,
          h = f.low;
          d = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8),
          h = 16711935 & (h << 8 | h >>> 24) | 4278255360 & (h << 24 | h >>> 8),
          l.push(h),
          l.push(d);
        }
        return new i.init(l, s);
      },
      clone: function () {
        for (var e = o.clone.call(this), t = e._state = this._state.slice(0), n = 0; n < 25; n++)
        t[n] = t[n].clone();
        return e;
      } });

    n.SHA3 = o._createHelper(h),
    n.HmacSHA3 = o._createHmacHelper(h);
  }(Math),
  function () {
    function t() {
      return a.create.apply(a, arguments);
    }
    var n = e,
    r = n.lib,
    i = r.Hasher,
    o = n.x64,
    a = o.Word,
    s = o.WordArray,
    c = n.algo,
    l = [t(1116352408, 3609767458), t(1899447441, 602891725), t(3049323471, 3964484399), t(3921009573, 2173295548), t(961987163, 4081628472), t(1508970993, 3053834265), t(2453635748, 2937671579), t(2870763221, 3664609560), t(3624381080, 2734883394), t(310598401, 1164996542), t(607225278, 1323610764), t(1426881987, 3590304994), t(1925078388, 4068182383), t(2162078206, 991336113), t(2614888103, 633803317), t(3248222580, 3479774868), t(3835390401, 2666613458), t(4022224774, 944711139), t(264347078, 2341262773), t(604807628, 2007800933), t(770255983, 1495990901), t(1249150122, 1856431235), t(1555081692, 3175218132), t(1996064986, 2198950837), t(2554220882, 3999719339), t(2821834349, 766784016), t(2952996808, 2566594879), t(3210313671, 3203337956), t(3336571891, 1034457026), t(3584528711, 2466948901), t(113926993, 3758326383), t(338241895, 168717936), t(666307205, 1188179964), t(773529912, 1546045734), t(1294757372, 1522805485), t(1396182291, 2643833823), t(1695183700, 2343527390), t(1986661051, 1014477480), t(2177026350, 1206759142), t(2456956037, 344077627), t(2730485921, 1290863460), t(2820302411, 3158454273), t(3259730800, 3505952657), t(3345764771, 106217008), t(3516065817, 3606008344), t(3600352804, 1432725776), t(4094571909, 1467031594), t(275423344, 851169720), t(430227734, 3100823752), t(506948616, 1363258195), t(659060556, 3750685593), t(883997877, 3785050280), t(958139571, 3318307427), t(1322822218, 3812723403), t(1537002063, 2003034995), t(1747873779, 3602036899), t(1955562222, 1575990012), t(2024104815, 1125592928), t(2227730452, 2716904306), t(2361852424, 442776044), t(2428436474, 593698344), t(2756734187, 3733110249), t(3204031479, 2999351573), t(3329325298, 3815920427), t(3391569614, 3928383900), t(3515267271, 566280711), t(3940187606, 3454069534), t(4118630271, 4000239992), t(116418474, 1914138554), t(174292421, 2731055270), t(289380356, 3203993006), t(460393269, 320620315), t(685471733, 587496836), t(852142971, 1086792851), t(1017036298, 365543100), t(1126000580, 2618297676), t(1288033470, 3409855158), t(1501505948, 4234509866), t(1607167915, 987167468), t(1816402316, 1246189591)],
    u = [];
    !function () {
      for (var e = 0; e < 80; e++)
      u[e] = t();
    }();
    var f = c.SHA512 = i.extend({
      _doReset: function () {
        this._hash = new s.init([new a.init(1779033703, 4089235720), new a.init(3144134277, 2227873595), new a.init(1013904242, 4271175723), new a.init(2773480762, 1595750129), new a.init(1359893119, 2917565137), new a.init(2600822924, 725511199), new a.init(528734635, 4215389547), new a.init(1541459225, 327033209)]);
      },
      _doProcessBlock: function (e, t) {
        for (var n = this._hash.words, r = n[0], i = n[1], o = n[2], a = n[3], s = n[4], c = n[5], f = n[6], d = n[7], h = r.high, p = r.low, v = i.high, g = i.low, y = o.high, m = o.low, b = a.high, x = a.low, w = s.high, _ = s.low, k = c.high, C = c.low, T = f.high, S = f.low, E = d.high, B = d.low, N = h, A = p, H = v, D = g, j = y, L = m, M = b, z = x, F = w, R = _, O = k, P = C, q = T, W = S, I = E, $ = B, X = 0; X < 80; X++) {
          var U = u[X];
          if (X < 16)
          var K = U.high = 0 | e[t + 2 * X],
          V = U.low = 0 | e[t + 2 * X + 1];else
          {
            var Y = u[X - 15],
            G = Y.high,
            J = Y.low,
            Q = (G >>> 1 | J << 31) ^ (G >>> 8 | J << 24) ^ G >>> 7,
            Z = (J >>> 1 | G << 31) ^ (J >>> 8 | G << 24) ^ (J >>> 7 | G << 25),
            ee = u[X - 2],
            te = ee.high,
            ne = ee.low,
            re = (te >>> 19 | ne << 13) ^ (te << 3 | ne >>> 29) ^ te >>> 6,
            ie = (ne >>> 19 | te << 13) ^ (ne << 3 | te >>> 29) ^ (ne >>> 6 | te << 26),
            oe = u[X - 7],
            ae = oe.high,
            se = oe.low,
            ce = u[X - 16],
            le = ce.high,
            ue = ce.low,
            V = Z + se,
            K = Q + ae + (V >>> 0 < Z >>> 0 ? 1 : 0),
            V = V + ie,
            K = K + re + (V >>> 0 < ie >>> 0 ? 1 : 0),
            V = V + ue,
            K = K + le + (V >>> 0 < ue >>> 0 ? 1 : 0);
            U.high = K,
            U.low = V;
          }
          var fe = F & O ^ ~F & q,
          de = R & P ^ ~R & W,
          he = N & H ^ N & j ^ H & j,
          pe = A & D ^ A & L ^ D & L,
          ve = (N >>> 28 | A << 4) ^ (N << 30 | A >>> 2) ^ (N << 25 | A >>> 7),
          ge = (A >>> 28 | N << 4) ^ (A << 30 | N >>> 2) ^ (A << 25 | N >>> 7),
          ye = (F >>> 14 | R << 18) ^ (F >>> 18 | R << 14) ^ (F << 23 | R >>> 9),
          me = (R >>> 14 | F << 18) ^ (R >>> 18 | F << 14) ^ (R << 23 | F >>> 9),
          be = l[X],
          xe = be.high,
          we = be.low,
          _e = $ + me,
          ke = I + ye + (_e >>> 0 < $ >>> 0 ? 1 : 0),
          _e = _e + de,
          ke = ke + fe + (_e >>> 0 < de >>> 0 ? 1 : 0),
          _e = _e + we,
          ke = ke + xe + (_e >>> 0 < we >>> 0 ? 1 : 0),
          _e = _e + V,
          ke = ke + K + (_e >>> 0 < V >>> 0 ? 1 : 0),
          Ce = ge + pe,
          Te = ve + he + (Ce >>> 0 < ge >>> 0 ? 1 : 0);
          I = q,
          $ = W,
          q = O,
          W = P,
          O = F,
          P = R,
          R = z + _e | 0,
          F = M + ke + (R >>> 0 < z >>> 0 ? 1 : 0) | 0,
          M = j,
          z = L,
          j = H,
          L = D,
          H = N,
          D = A,
          A = _e + Ce | 0,
          N = ke + Te + (A >>> 0 < _e >>> 0 ? 1 : 0) | 0;
        }
        p = r.low = p + A,
        r.high = h + N + (p >>> 0 < A >>> 0 ? 1 : 0),
        g = i.low = g + D,
        i.high = v + H + (g >>> 0 < D >>> 0 ? 1 : 0),
        m = o.low = m + L,
        o.high = y + j + (m >>> 0 < L >>> 0 ? 1 : 0),
        x = a.low = x + z,
        a.high = b + M + (x >>> 0 < z >>> 0 ? 1 : 0),
        _ = s.low = _ + R,
        s.high = w + F + (_ >>> 0 < R >>> 0 ? 1 : 0),
        C = c.low = C + P,
        c.high = k + O + (C >>> 0 < P >>> 0 ? 1 : 0),
        S = f.low = S + W,
        f.high = T + q + (S >>> 0 < W >>> 0 ? 1 : 0),
        B = d.low = B + $,
        d.high = E + I + (B >>> 0 < $ >>> 0 ? 1 : 0);
      },
      _doFinalize: function () {
        var e = this._data,
        t = e.words,
        n = 8 * this._nDataBytes,
        r = 8 * e.sigBytes;
        t[r >>> 5] |= 128 << 24 - r % 32,
        t[(r + 128 >>> 10 << 5) + 30] = Math.floor(n / 4294967296),
        t[(r + 128 >>> 10 << 5) + 31] = n,
        e.sigBytes = 4 * t.length,
        this._process();
        var i = this._hash.toX32();
        return i;
      },
      clone: function () {
        var e = i.clone.call(this);
        return e._hash = this._hash.clone(),
        e;
      },
      blockSize: 32 });

    n.SHA512 = i._createHelper(f),
    n.HmacSHA512 = i._createHmacHelper(f);
  }(),
  function () {
    var t = e,
    n = t.x64,
    r = n.Word,
    i = n.WordArray,
    o = t.algo,
    a = o.SHA512,
    s = o.SHA384 = a.extend({
      _doReset: function () {
        this._hash = new i.init([new r.init(3418070365, 3238371032), new r.init(1654270250, 914150663), new r.init(2438529370, 812702999), new r.init(355462360, 4144912697), new r.init(1731405415, 4290775857), new r.init(2394180231, 1750603025), new r.init(3675008525, 1694076839), new r.init(1203062813, 3204075428)]);
      },
      _doFinalize: function () {
        var e = a._doFinalize.call(this);
        return e.sigBytes -= 16,
        e;
      } });

    t.SHA384 = a._createHelper(s),
    t.HmacSHA384 = a._createHmacHelper(s);
  }(),
  e.lib.Cipher || function (t) {
    var n = e,
    r = n.lib,
    i = r.Base,
    o = r.WordArray,
    a = r.BufferedBlockAlgorithm,
    s = n.enc,
    c = (s.Utf8,
    s.Base64),
    l = n.algo,
    u = l.EvpKDF,
    f = r.Cipher = a.extend({
      cfg: i.extend(),
      createEncryptor: function (e, t) {
        return this.create(this._ENC_XFORM_MODE, e, t);
      },
      createDecryptor: function (e, t) {
        return this.create(this._DEC_XFORM_MODE, e, t);
      },
      init: function (e, t, n) {
        this.cfg = this.cfg.extend(n),
        this._xformMode = e,
        this._key = t,
        this.reset();
      },
      reset: function () {
        a.reset.call(this),
        this._doReset();
      },
      process: function (e) {
        return this._append(e),
        this._process();
      },
      finalize: function (e) {
        e && this._append(e);
        var t = this._doFinalize();
        return t;
      },
      keySize: 4,
      ivSize: 4,
      _ENC_XFORM_MODE: 1,
      _DEC_XFORM_MODE: 2,
      _createHelper: function () {
        function e(e) {
          return "string" == typeof e ? k : x;
        }
        return function (t) {
          return {
            encrypt: function (n, r, i) {
              return e(r).encrypt(t, n, r, i);
            },
            decrypt: function (n, r, i) {
              return e(r).decrypt(t, n, r, i);
            } };

        };
      }() }),

    d = (r.StreamCipher = f.extend({
      _doFinalize: function () {
        var e = this._process(!0);
        return e;
      },
      blockSize: 1 }),

    n.mode = {}),
    h = r.BlockCipherMode = i.extend({
      createEncryptor: function (e, t) {
        return this.Encryptor.create(e, t);
      },
      createDecryptor: function (e, t) {
        return this.Decryptor.create(e, t);
      },
      init: function (e, t) {
        this._cipher = e,
        this._iv = t;
      } }),

    p = d.CBC = function () {
      function e(e, n, r) {
        var i = this._iv;
        if (i) {
          var o = i;
          this._iv = t;
        } else
        var o = this._prevBlock;
        for (var a = 0; a < r; a++)
        e[n + a] ^= o[a];
      }
      var n = h.extend();
      return n.Encryptor = n.extend({
        processBlock: function (t, n) {
          var r = this._cipher,
          i = r.blockSize;
          e.call(this, t, n, i),
          r.encryptBlock(t, n),
          this._prevBlock = t.slice(n, n + i);
        } }),

      n.Decryptor = n.extend({
        processBlock: function (t, n) {
          var r = this._cipher,
          i = r.blockSize,
          o = t.slice(n, n + i);
          r.decryptBlock(t, n),
          e.call(this, t, n, i),
          this._prevBlock = o;
        } }),

      n;
    }(),
    v = n.pad = {},
    g = v.Pkcs7 = {
      pad: function (e, t) {
        for (var n = 4 * t, r = n - e.sigBytes % n, i = r << 24 | r << 16 | r << 8 | r, a = [], s = 0; s < r; s += 4)
        a.push(i);
        var c = o.create(a, r);
        e.concat(c);
      },
      unpad: function (e) {
        var t = 255 & e.words[e.sigBytes - 1 >>> 2];
        e.sigBytes -= t;
      } },

    y = (r.BlockCipher = f.extend({
      cfg: f.cfg.extend({
        mode: p,
        padding: g }),

      reset: function () {
        f.reset.call(this);
        var e = this.cfg,
        t = e.iv,
        n = e.mode;
        if (this._xformMode == this._ENC_XFORM_MODE)
        var r = n.createEncryptor;else
        {
          var r = n.createDecryptor;
          this._minBufferSize = 1;
        }
        this._mode = r.call(n, this, t && t.words);
      },
      _doProcessBlock: function (e, t) {
        this._mode.processBlock(e, t);
      },
      _doFinalize: function () {
        var e = this.cfg.padding;
        if (this._xformMode == this._ENC_XFORM_MODE) {
          e.pad(this._data, this.blockSize);
          var t = this._process(!0);
        } else {
          var t = this._process(!0);
          e.unpad(t);
        }
        return t;
      },
      blockSize: 4 }),

    r.CipherParams = i.extend({
      init: function (e) {
        this.mixIn(e);
      },
      toString: function (e) {
        return (e || this.formatter).stringify(this);
      } })),

    m = n.format = {},
    b = m.OpenSSL = {
      stringify: function (e) {
        var t = e.ciphertext,
        n = e.salt;
        if (n)
        var r = o.create([1398893684, 1701076831]).concat(n).concat(t);else

        var r = t;
        return r.toString(c);
      },
      parse: function (e) {
        var t = c.parse(e),
        n = t.words;
        if (1398893684 == n[0] && 1701076831 == n[1]) {
          var r = o.create(n.slice(2, 4));
          n.splice(0, 4),
          t.sigBytes -= 16;
        }
        return y.create({
          ciphertext: t,
          salt: r });

      } },

    x = r.SerializableCipher = i.extend({
      cfg: i.extend({
        format: b }),

      encrypt: function (e, t, n, r) {
        r = this.cfg.extend(r);
        var i = e.createEncryptor(n, r),
        o = i.finalize(t),
        a = i.cfg;
        return y.create({
          ciphertext: o,
          key: n,
          iv: a.iv,
          algorithm: e,
          mode: a.mode,
          padding: a.padding,
          blockSize: e.blockSize,
          formatter: r.format });

      },
      decrypt: function (e, t, n, r) {
        r = this.cfg.extend(r),
        t = this._parse(t, r.format);
        var i = e.createDecryptor(n, r).finalize(t.ciphertext);
        return i;
      },
      _parse: function (e, t) {
        return "string" == typeof e ? t.parse(e, this) : e;
      } }),

    w = n.kdf = {},
    _ = w.OpenSSL = {
      execute: function (e, t, n, r) {
        r || (r = o.random(8));
        var i = u.create({
          keySize: t + n }).
        compute(e, r),
        a = o.create(i.words.slice(t), 4 * n);
        return i.sigBytes = 4 * t,
        y.create({
          key: i,
          iv: a,
          salt: r });

      } },

    k = r.PasswordBasedCipher = x.extend({
      cfg: x.cfg.extend({
        kdf: _ }),

      encrypt: function (e, t, n, r) {
        r = this.cfg.extend(r);
        var i = r.kdf.execute(n, e.keySize, e.ivSize);
        r.iv = i.iv;
        var o = x.encrypt.call(this, e, t, i.key, r);
        return o.mixIn(i),
        o;
      },
      decrypt: function (e, t, n, r) {
        r = this.cfg.extend(r),
        t = this._parse(t, r.format);
        var i = r.kdf.execute(n, e.keySize, e.ivSize, t.salt);
        r.iv = i.iv;
        var o = x.decrypt.call(this, e, t, i.key, r);
        return o;
      } });

  }(),
  e.mode.CFB = function () {
    function t(e, t, n, r) {
      var i = this._iv;
      if (i) {
        var o = i.slice(0);
        this._iv = void 0;
      } else
      var o = this._prevBlock;
      r.encryptBlock(o, 0);
      for (var a = 0; a < n; a++)
      e[t + a] ^= o[a];
    }
    var n = e.lib.BlockCipherMode.extend();
    return n.Encryptor = n.extend({
      processBlock: function (e, n) {
        var r = this._cipher,
        i = r.blockSize;
        t.call(this, e, n, i, r),
        this._prevBlock = e.slice(n, n + i);
      } }),

    n.Decryptor = n.extend({
      processBlock: function (e, n) {
        var r = this._cipher,
        i = r.blockSize,
        o = e.slice(n, n + i);
        t.call(this, e, n, i, r),
        this._prevBlock = o;
      } }),

    n;
  }(),
  e.mode.ECB = function () {
    var t = e.lib.BlockCipherMode.extend();
    return t.Encryptor = t.extend({
      processBlock: function (e, t) {
        this._cipher.encryptBlock(e, t);
      } }),

    t.Decryptor = t.extend({
      processBlock: function (e, t) {
        this._cipher.decryptBlock(e, t);
      } }),

    t;
  }(),
  e.pad.AnsiX923 = {
    pad: function (e, t) {
      var n = e.sigBytes,
      r = 4 * t,
      i = r - n % r,
      o = n + i - 1;
      e.clamp(),
      e.words[o >>> 2] |= i << 24 - o % 4 * 8,
      e.sigBytes += i;
    },
    unpad: function (e) {
      var t = 255 & e.words[e.sigBytes - 1 >>> 2];
      e.sigBytes -= t;
    } },

  e.pad.Iso10126 = {
    pad: function (t, n) {
      var r = 4 * n,
      i = r - t.sigBytes % r;
      t.concat(e.lib.WordArray.random(i - 1)).concat(e.lib.WordArray.create([i << 24], 1));
    },
    unpad: function (e) {
      var t = 255 & e.words[e.sigBytes - 1 >>> 2];
      e.sigBytes -= t;
    } },

  e.pad.Iso97971 = {
    pad: function (t, n) {
      t.concat(e.lib.WordArray.create([2147483648], 1)),
      e.pad.ZeroPadding.pad(t, n);
    },
    unpad: function (t) {
      e.pad.ZeroPadding.unpad(t),
      t.sigBytes--;
    } },

  e.mode.OFB = function () {
    var t = e.lib.BlockCipherMode.extend(),
    n = t.Encryptor = t.extend({
      processBlock: function (e, t) {
        var n = this._cipher,
        r = n.blockSize,
        i = this._iv,
        o = this._keystream;
        i && (o = this._keystream = i.slice(0),
        this._iv = void 0),
        n.encryptBlock(o, 0);
        for (var a = 0; a < r; a++)
        e[t + a] ^= o[a];
      } });

    return t.Decryptor = n,
    t;
  }(),
  e.pad.NoPadding = {
    pad: function () {},
    unpad: function () {} },

  function (t) {
    var n = e,
    r = n.lib,
    i = r.CipherParams,
    o = n.enc,
    a = o.Hex,
    s = n.format;
    s.Hex = {
      stringify: function (e) {
        return e.ciphertext.toString(a);
      },
      parse: function (e) {
        var t = a.parse(e);
        return i.create({
          ciphertext: t });

      } };

  }(),
  function () {
    var t = e,
    n = t.lib,
    r = n.BlockCipher,
    i = t.algo,
    o = [],
    a = [],
    s = [],
    c = [],
    l = [],
    u = [],
    f = [],
    d = [],
    h = [],
    p = [];
    !function () {
      for (var e = [], t = 0; t < 256; t++)
      t < 128 ? e[t] = t << 1 : e[t] = t << 1 ^ 283;
      for (var n = 0, r = 0, t = 0; t < 256; t++) {
        var i = r ^ r << 1 ^ r << 2 ^ r << 3 ^ r << 4;
        i = i >>> 8 ^ 255 & i ^ 99,
        o[n] = i,
        a[i] = n;
        var v = e[n],
        g = e[v],
        y = e[g],
        m = 257 * e[i] ^ 16843008 * i;
        s[n] = m << 24 | m >>> 8,
        c[n] = m << 16 | m >>> 16,
        l[n] = m << 8 | m >>> 24,
        u[n] = m;
        var m = 16843009 * y ^ 65537 * g ^ 257 * v ^ 16843008 * n;
        f[i] = m << 24 | m >>> 8,
        d[i] = m << 16 | m >>> 16,
        h[i] = m << 8 | m >>> 24,
        p[i] = m,
        n ? (n = v ^ e[e[e[y ^ v]]],
        r ^= e[e[r]]) : n = r = 1;
      }
    }();
    var v = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
    g = i.AES = r.extend({
      _doReset: function () {
        for (var e = this._key, t = e.words, n = e.sigBytes / 4, r = this._nRounds = n + 6, i = 4 * (r + 1), a = this._keySchedule = [], s = 0; s < i; s++)
        if (s < n)
        a[s] = t[s];else
        {
          var c = a[s - 1];
          s % n ? n > 6 && s % n == 4 && (c = o[c >>> 24] << 24 | o[c >>> 16 & 255] << 16 | o[c >>> 8 & 255] << 8 | o[255 & c]) : (c = c << 8 | c >>> 24,
          c = o[c >>> 24] << 24 | o[c >>> 16 & 255] << 16 | o[c >>> 8 & 255] << 8 | o[255 & c],
          c ^= v[s / n | 0] << 24),
          a[s] = a[s - n] ^ c;
        }
        for (var l = this._invKeySchedule = [], u = 0; u < i; u++) {
          var s = i - u;
          if (u % 4)
          var c = a[s];else

          var c = a[s - 4];
          u < 4 || s <= 4 ? l[u] = c : l[u] = f[o[c >>> 24]] ^ d[o[c >>> 16 & 255]] ^ h[o[c >>> 8 & 255]] ^ p[o[255 & c]];
        }
      },
      encryptBlock: function (e, t) {
        this._doCryptBlock(e, t, this._keySchedule, s, c, l, u, o);
      },
      decryptBlock: function (e, t) {
        var n = e[t + 1];
        e[t + 1] = e[t + 3],
        e[t + 3] = n,
        this._doCryptBlock(e, t, this._invKeySchedule, f, d, h, p, a);
        var n = e[t + 1];
        e[t + 1] = e[t + 3],
        e[t + 3] = n;
      },
      _doCryptBlock: function (e, t, n, r, i, o, a, s) {
        for (var c = this._nRounds, l = e[t] ^ n[0], u = e[t + 1] ^ n[1], f = e[t + 2] ^ n[2], d = e[t + 3] ^ n[3], h = 4, p = 1; p < c; p++) {
          var v = r[l >>> 24] ^ i[u >>> 16 & 255] ^ o[f >>> 8 & 255] ^ a[255 & d] ^ n[h++],
          g = r[u >>> 24] ^ i[f >>> 16 & 255] ^ o[d >>> 8 & 255] ^ a[255 & l] ^ n[h++],
          y = r[f >>> 24] ^ i[d >>> 16 & 255] ^ o[l >>> 8 & 255] ^ a[255 & u] ^ n[h++],
          m = r[d >>> 24] ^ i[l >>> 16 & 255] ^ o[u >>> 8 & 255] ^ a[255 & f] ^ n[h++];
          l = v,
          u = g,
          f = y,
          d = m;
        }
        var v = (s[l >>> 24] << 24 | s[u >>> 16 & 255] << 16 | s[f >>> 8 & 255] << 8 | s[255 & d]) ^ n[h++],
        g = (s[u >>> 24] << 24 | s[f >>> 16 & 255] << 16 | s[d >>> 8 & 255] << 8 | s[255 & l]) ^ n[h++],
        y = (s[f >>> 24] << 24 | s[d >>> 16 & 255] << 16 | s[l >>> 8 & 255] << 8 | s[255 & u]) ^ n[h++],
        m = (s[d >>> 24] << 24 | s[l >>> 16 & 255] << 16 | s[u >>> 8 & 255] << 8 | s[255 & f]) ^ n[h++];
        e[t] = v,
        e[t + 1] = g,
        e[t + 2] = y,
        e[t + 3] = m;
      },
      keySize: 8 });

    t.AES = r._createHelper(g);
  }(),
  function () {
    function t(e, t) {
      var n = (this._lBlock >>> e ^ this._rBlock) & t;
      this._rBlock ^= n,
      this._lBlock ^= n << e;
    }
    function n(e, t) {
      var n = (this._rBlock >>> e ^ this._lBlock) & t;
      this._lBlock ^= n,
      this._rBlock ^= n << e;
    }
    var r = e,
    i = r.lib,
    o = i.WordArray,
    a = i.BlockCipher,
    s = r.algo,
    c = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],
    l = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],
    u = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
    f = [{
      0: 8421888,
      268435456: 32768,
      536870912: 8421378,
      805306368: 2,
      1073741824: 512,
      1342177280: 8421890,
      1610612736: 8389122,
      1879048192: 8388608,
      2147483648: 514,
      2415919104: 8389120,
      2684354560: 33280,
      2952790016: 8421376,
      3221225472: 32770,
      3489660928: 8388610,
      3758096384: 0,
      4026531840: 33282,
      134217728: 0,
      402653184: 8421890,
      671088640: 33282,
      939524096: 32768,
      1207959552: 8421888,
      1476395008: 512,
      1744830464: 8421378,
      2013265920: 2,
      2281701376: 8389120,
      2550136832: 33280,
      2818572288: 8421376,
      3087007744: 8389122,
      3355443200: 8388610,
      3623878656: 32770,
      3892314112: 514,
      4160749568: 8388608,
      1: 32768,
      268435457: 2,
      536870913: 8421888,
      805306369: 8388608,
      1073741825: 8421378,
      1342177281: 33280,
      1610612737: 512,
      1879048193: 8389122,
      2147483649: 8421890,
      2415919105: 8421376,
      2684354561: 8388610,
      2952790017: 33282,
      3221225473: 514,
      3489660929: 8389120,
      3758096385: 32770,
      4026531841: 0,
      134217729: 8421890,
      402653185: 8421376,
      671088641: 8388608,
      939524097: 512,
      1207959553: 32768,
      1476395009: 8388610,
      1744830465: 2,
      2013265921: 33282,
      2281701377: 32770,
      2550136833: 8389122,
      2818572289: 514,
      3087007745: 8421888,
      3355443201: 8389120,
      3623878657: 0,
      3892314113: 33280,
      4160749569: 8421378 },
    {
      0: 1074282512,
      16777216: 16384,
      33554432: 524288,
      50331648: 1074266128,
      67108864: 1073741840,
      83886080: 1074282496,
      100663296: 1073758208,
      117440512: 16,
      134217728: 540672,
      150994944: 1073758224,
      167772160: 1073741824,
      184549376: 540688,
      201326592: 524304,
      218103808: 0,
      234881024: 16400,
      251658240: 1074266112,
      8388608: 1073758208,
      25165824: 540688,
      41943040: 16,
      58720256: 1073758224,
      75497472: 1074282512,
      92274688: 1073741824,
      109051904: 524288,
      125829120: 1074266128,
      142606336: 524304,
      159383552: 0,
      176160768: 16384,
      192937984: 1074266112,
      209715200: 1073741840,
      226492416: 540672,
      243269632: 1074282496,
      260046848: 16400,
      268435456: 0,
      285212672: 1074266128,
      301989888: 1073758224,
      318767104: 1074282496,
      335544320: 1074266112,
      352321536: 16,
      369098752: 540688,
      385875968: 16384,
      402653184: 16400,
      419430400: 524288,
      436207616: 524304,
      452984832: 1073741840,
      469762048: 540672,
      486539264: 1073758208,
      503316480: 1073741824,
      520093696: 1074282512,
      276824064: 540688,
      293601280: 524288,
      310378496: 1074266112,
      327155712: 16384,
      343932928: 1073758208,
      360710144: 1074282512,
      377487360: 16,
      394264576: 1073741824,
      411041792: 1074282496,
      427819008: 1073741840,
      444596224: 1073758224,
      461373440: 524304,
      478150656: 0,
      494927872: 16400,
      511705088: 1074266128,
      528482304: 540672 },
    {
      0: 260,
      1048576: 0,
      2097152: 67109120,
      3145728: 65796,
      4194304: 65540,
      5242880: 67108868,
      6291456: 67174660,
      7340032: 67174400,
      8388608: 67108864,
      9437184: 67174656,
      10485760: 65792,
      11534336: 67174404,
      12582912: 67109124,
      13631488: 65536,
      14680064: 4,
      15728640: 256,
      524288: 67174656,
      1572864: 67174404,
      2621440: 0,
      3670016: 67109120,
      4718592: 67108868,
      5767168: 65536,
      6815744: 65540,
      7864320: 260,
      8912896: 4,
      9961472: 256,
      11010048: 67174400,
      12058624: 65796,
      13107200: 65792,
      14155776: 67109124,
      15204352: 67174660,
      16252928: 67108864,
      16777216: 67174656,
      17825792: 65540,
      18874368: 65536,
      19922944: 67109120,
      20971520: 256,
      22020096: 67174660,
      23068672: 67108868,
      24117248: 0,
      25165824: 67109124,
      26214400: 67108864,
      27262976: 4,
      28311552: 65792,
      29360128: 67174400,
      30408704: 260,
      31457280: 65796,
      32505856: 67174404,
      17301504: 67108864,
      18350080: 260,
      19398656: 67174656,
      20447232: 0,
      21495808: 65540,
      22544384: 67109120,
      23592960: 256,
      24641536: 67174404,
      25690112: 65536,
      26738688: 67174660,
      27787264: 65796,
      28835840: 67108868,
      29884416: 67109124,
      30932992: 67174400,
      31981568: 4,
      33030144: 65792 },
    {
      0: 2151682048,
      65536: 2147487808,
      131072: 4198464,
      196608: 2151677952,
      262144: 0,
      327680: 4198400,
      393216: 2147483712,
      458752: 4194368,
      524288: 2147483648,
      589824: 4194304,
      655360: 64,
      720896: 2147487744,
      786432: 2151678016,
      851968: 4160,
      917504: 4096,
      983040: 2151682112,
      32768: 2147487808,
      98304: 64,
      163840: 2151678016,
      229376: 2147487744,
      294912: 4198400,
      360448: 2151682112,
      425984: 0,
      491520: 2151677952,
      557056: 4096,
      622592: 2151682048,
      688128: 4194304,
      753664: 4160,
      819200: 2147483648,
      884736: 4194368,
      950272: 4198464,
      1015808: 2147483712,
      1048576: 4194368,
      1114112: 4198400,
      1179648: 2147483712,
      1245184: 0,
      1310720: 4160,
      1376256: 2151678016,
      1441792: 2151682048,
      1507328: 2147487808,
      1572864: 2151682112,
      1638400: 2147483648,
      1703936: 2151677952,
      1769472: 4198464,
      1835008: 2147487744,
      1900544: 4194304,
      1966080: 64,
      2031616: 4096,
      1081344: 2151677952,
      1146880: 2151682112,
      1212416: 0,
      1277952: 4198400,
      1343488: 4194368,
      1409024: 2147483648,
      1474560: 2147487808,
      1540096: 64,
      1605632: 2147483712,
      1671168: 4096,
      1736704: 2147487744,
      1802240: 2151678016,
      1867776: 4160,
      1933312: 2151682048,
      1998848: 4194304,
      2064384: 4198464 },
    {
      0: 128,
      4096: 17039360,
      8192: 262144,
      12288: 536870912,
      16384: 537133184,
      20480: 16777344,
      24576: 553648256,
      28672: 262272,
      32768: 16777216,
      36864: 537133056,
      40960: 536871040,
      45056: 553910400,
      49152: 553910272,
      53248: 0,
      57344: 17039488,
      61440: 553648128,
      2048: 17039488,
      6144: 553648256,
      10240: 128,
      14336: 17039360,
      18432: 262144,
      22528: 537133184,
      26624: 553910272,
      30720: 536870912,
      34816: 537133056,
      38912: 0,
      43008: 553910400,
      47104: 16777344,
      51200: 536871040,
      55296: 553648128,
      59392: 16777216,
      63488: 262272,
      65536: 262144,
      69632: 128,
      73728: 536870912,
      77824: 553648256,
      81920: 16777344,
      86016: 553910272,
      90112: 537133184,
      94208: 16777216,
      98304: 553910400,
      102400: 553648128,
      106496: 17039360,
      110592: 537133056,
      114688: 262272,
      118784: 536871040,
      122880: 0,
      126976: 17039488,
      67584: 553648256,
      71680: 16777216,
      75776: 17039360,
      79872: 537133184,
      83968: 536870912,
      88064: 17039488,
      92160: 128,
      96256: 553910272,
      100352: 262272,
      104448: 553910400,
      108544: 0,
      112640: 553648128,
      116736: 16777344,
      120832: 262144,
      124928: 537133056,
      129024: 536871040 },
    {
      0: 268435464,
      256: 8192,
      512: 270532608,
      768: 270540808,
      1024: 268443648,
      1280: 2097152,
      1536: 2097160,
      1792: 268435456,
      2048: 0,
      2304: 268443656,
      2560: 2105344,
      2816: 8,
      3072: 270532616,
      3328: 2105352,
      3584: 8200,
      3840: 270540800,
      128: 270532608,
      384: 270540808,
      640: 8,
      896: 2097152,
      1152: 2105352,
      1408: 268435464,
      1664: 268443648,
      1920: 8200,
      2176: 2097160,
      2432: 8192,
      2688: 268443656,
      2944: 270532616,
      3200: 0,
      3456: 270540800,
      3712: 2105344,
      3968: 268435456,
      4096: 268443648,
      4352: 270532616,
      4608: 270540808,
      4864: 8200,
      5120: 2097152,
      5376: 268435456,
      5632: 268435464,
      5888: 2105344,
      6144: 2105352,
      6400: 0,
      6656: 8,
      6912: 270532608,
      7168: 8192,
      7424: 268443656,
      7680: 270540800,
      7936: 2097160,
      4224: 8,
      4480: 2105344,
      4736: 2097152,
      4992: 268435464,
      5248: 268443648,
      5504: 8200,
      5760: 270540808,
      6016: 270532608,
      6272: 270540800,
      6528: 270532616,
      6784: 8192,
      7040: 2105352,
      7296: 2097160,
      7552: 0,
      7808: 268435456,
      8064: 268443656 },
    {
      0: 1048576,
      16: 33555457,
      32: 1024,
      48: 1049601,
      64: 34604033,
      80: 0,
      96: 1,
      112: 34603009,
      128: 33555456,
      144: 1048577,
      160: 33554433,
      176: 34604032,
      192: 34603008,
      208: 1025,
      224: 1049600,
      240: 33554432,
      8: 34603009,
      24: 0,
      40: 33555457,
      56: 34604032,
      72: 1048576,
      88: 33554433,
      104: 33554432,
      120: 1025,
      136: 1049601,
      152: 33555456,
      168: 34603008,
      184: 1048577,
      200: 1024,
      216: 34604033,
      232: 1,
      248: 1049600,
      256: 33554432,
      272: 1048576,
      288: 33555457,
      304: 34603009,
      320: 1048577,
      336: 33555456,
      352: 34604032,
      368: 1049601,
      384: 1025,
      400: 34604033,
      416: 1049600,
      432: 1,
      448: 0,
      464: 34603008,
      480: 33554433,
      496: 1024,
      264: 1049600,
      280: 33555457,
      296: 34603009,
      312: 1,
      328: 33554432,
      344: 1048576,
      360: 1025,
      376: 34604032,
      392: 33554433,
      408: 34603008,
      424: 0,
      440: 34604033,
      456: 1049601,
      472: 1024,
      488: 33555456,
      504: 1048577 },
    {
      0: 134219808,
      1: 131072,
      2: 134217728,
      3: 32,
      4: 131104,
      5: 134350880,
      6: 134350848,
      7: 2048,
      8: 134348800,
      9: 134219776,
      10: 133120,
      11: 134348832,
      12: 2080,
      13: 0,
      14: 134217760,
      15: 133152,
      2147483648: 2048,
      2147483649: 134350880,
      2147483650: 134219808,
      2147483651: 134217728,
      2147483652: 134348800,
      2147483653: 133120,
      2147483654: 133152,
      2147483655: 32,
      2147483656: 134217760,
      2147483657: 2080,
      2147483658: 131104,
      2147483659: 134350848,
      2147483660: 0,
      2147483661: 134348832,
      2147483662: 134219776,
      2147483663: 131072,
      16: 133152,
      17: 134350848,
      18: 32,
      19: 2048,
      20: 134219776,
      21: 134217760,
      22: 134348832,
      23: 131072,
      24: 0,
      25: 131104,
      26: 134348800,
      27: 134219808,
      28: 134350880,
      29: 133120,
      30: 2080,
      31: 134217728,
      2147483664: 131072,
      2147483665: 2048,
      2147483666: 134348832,
      2147483667: 133152,
      2147483668: 32,
      2147483669: 134348800,
      2147483670: 134217728,
      2147483671: 134219808,
      2147483672: 134350880,
      2147483673: 134217760,
      2147483674: 134219776,
      2147483675: 0,
      2147483676: 133120,
      2147483677: 2080,
      2147483678: 131104,
      2147483679: 134350848 }],

    d = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],
    h = s.DES = a.extend({
      _doReset: function () {
        for (var e = this._key, t = e.words, n = [], r = 0; r < 56; r++) {
          var i = c[r] - 1;
          n[r] = t[i >>> 5] >>> 31 - i % 32 & 1;
        }
        for (var o = this._subKeys = [], a = 0; a < 16; a++) {
          for (var s = o[a] = [], f = u[a], r = 0; r < 24; r++)
          s[r / 6 | 0] |= n[(l[r] - 1 + f) % 28] << 31 - r % 6,
          s[4 + (r / 6 | 0)] |= n[28 + (l[r + 24] - 1 + f) % 28] << 31 - r % 6;
          s[0] = s[0] << 1 | s[0] >>> 31;
          for (var r = 1; r < 7; r++)
          s[r] = s[r] >>> 4 * (r - 1) + 3;
          s[7] = s[7] << 5 | s[7] >>> 27;
        }
        for (var d = this._invSubKeys = [], r = 0; r < 16; r++)
        d[r] = o[15 - r];
      },
      encryptBlock: function (e, t) {
        this._doCryptBlock(e, t, this._subKeys);
      },
      decryptBlock: function (e, t) {
        this._doCryptBlock(e, t, this._invSubKeys);
      },
      _doCryptBlock: function (e, r, i) {
        this._lBlock = e[r],
        this._rBlock = e[r + 1],
        t.call(this, 4, 252645135),
        t.call(this, 16, 65535),
        n.call(this, 2, 858993459),
        n.call(this, 8, 16711935),
        t.call(this, 1, 1431655765);
        for (var o = 0; o < 16; o++) {
          for (var a = i[o], s = this._lBlock, c = this._rBlock, l = 0, u = 0; u < 8; u++)
          l |= f[u][((c ^ a[u]) & d[u]) >>> 0];
          this._lBlock = c,
          this._rBlock = s ^ l;
        }
        var h = this._lBlock;
        this._lBlock = this._rBlock,
        this._rBlock = h,
        t.call(this, 1, 1431655765),
        n.call(this, 8, 16711935),
        n.call(this, 2, 858993459),
        t.call(this, 16, 65535),
        t.call(this, 4, 252645135),
        e[r] = this._lBlock,
        e[r + 1] = this._rBlock;
      },
      keySize: 2,
      ivSize: 2,
      blockSize: 2 });

    r.DES = a._createHelper(h);
    var p = s.TripleDES = a.extend({
      _doReset: function () {
        var e = this._key,
        t = e.words;
        this._des1 = h.createEncryptor(o.create(t.slice(0, 2))),
        this._des2 = h.createEncryptor(o.create(t.slice(2, 4))),
        this._des3 = h.createEncryptor(o.create(t.slice(4, 6)));
      },
      encryptBlock: function (e, t) {
        this._des1.encryptBlock(e, t),
        this._des2.decryptBlock(e, t),
        this._des3.encryptBlock(e, t);
      },
      decryptBlock: function (e, t) {
        this._des3.decryptBlock(e, t),
        this._des2.encryptBlock(e, t),
        this._des1.decryptBlock(e, t);
      },
      keySize: 6,
      ivSize: 2,
      blockSize: 2 });

    r.TripleDES = a._createHelper(p);
  }(),
  function () {
    function t() {
      for (var e = this._S, t = this._i, n = this._j, r = 0, i = 0; i < 4; i++) {
        t = (t + 1) % 256,
        n = (n + e[t]) % 256;
        var o = e[t];
        e[t] = e[n],
        e[n] = o,
        r |= e[(e[t] + e[n]) % 256] << 24 - 8 * i;
      }
      return this._i = t,
      this._j = n,
      r;
    }
    var n = e,
    r = n.lib,
    i = r.StreamCipher,
    o = n.algo,
    a = o.RC4 = i.extend({
      _doReset: function () {
        for (var e = this._key, t = e.words, n = e.sigBytes, r = this._S = [], i = 0; i < 256; i++)
        r[i] = i;
        for (var i = 0, o = 0; i < 256; i++) {
          var a = i % n,
          s = t[a >>> 2] >>> 24 - a % 4 * 8 & 255;
          o = (o + r[i] + s) % 256;
          var c = r[i];
          r[i] = r[o],
          r[o] = c;
        }
        this._i = this._j = 0;
      },
      _doProcessBlock: function (e, n) {
        e[n] ^= t.call(this);
      },
      keySize: 8,
      ivSize: 0 });

    n.RC4 = i._createHelper(a);
    var s = o.RC4Drop = a.extend({
      cfg: a.cfg.extend({
        drop: 192 }),

      _doReset: function () {
        a._doReset.call(this);
        for (var e = this.cfg.drop; e > 0; e--)
        t.call(this);
      } });

    n.RC4Drop = i._createHelper(s);
  }(),
  e.mode.CTRGladman = function () {
    function t(e) {
      if (255 === (e >> 24 & 255)) {
        var t = e >> 16 & 255,
        n = e >> 8 & 255,
        r = 255 & e;
        255 === t ? (t = 0,
        255 === n ? (n = 0,
        255 === r ? r = 0 : ++r) : ++n) : ++t,
        e = 0,
        e += t << 16,
        e += n << 8,
        e += r;
      } else
      e += 1 << 24;
      return e;
    }
    function n(e) {
      return 0 === (e[0] = t(e[0])) && (e[1] = t(e[1])),
      e;
    }
    var r = e.lib.BlockCipherMode.extend(),
    i = r.Encryptor = r.extend({
      processBlock: function (e, t) {
        var r = this._cipher,
        i = r.blockSize,
        o = this._iv,
        a = this._counter;
        o && (a = this._counter = o.slice(0),
        this._iv = void 0),
        n(a);
        var s = a.slice(0);
        r.encryptBlock(s, 0);
        for (var c = 0; c < i; c++)
        e[t + c] ^= s[c];
      } });

    return r.Decryptor = i,
    r;
  }(),
  function () {
    function t() {
      for (var e = this._X, t = this._C, n = 0; n < 8; n++)
      s[n] = t[n];
      t[0] = t[0] + 1295307597 + this._b | 0,
      t[1] = t[1] + 3545052371 + (t[0] >>> 0 < s[0] >>> 0 ? 1 : 0) | 0,
      t[2] = t[2] + 886263092 + (t[1] >>> 0 < s[1] >>> 0 ? 1 : 0) | 0,
      t[3] = t[3] + 1295307597 + (t[2] >>> 0 < s[2] >>> 0 ? 1 : 0) | 0,
      t[4] = t[4] + 3545052371 + (t[3] >>> 0 < s[3] >>> 0 ? 1 : 0) | 0,
      t[5] = t[5] + 886263092 + (t[4] >>> 0 < s[4] >>> 0 ? 1 : 0) | 0,
      t[6] = t[6] + 1295307597 + (t[5] >>> 0 < s[5] >>> 0 ? 1 : 0) | 0,
      t[7] = t[7] + 3545052371 + (t[6] >>> 0 < s[6] >>> 0 ? 1 : 0) | 0,
      this._b = t[7] >>> 0 < s[7] >>> 0 ? 1 : 0;
      for (var n = 0; n < 8; n++) {
        var r = e[n] + t[n],
        i = 65535 & r,
        o = r >>> 16,
        a = ((i * i >>> 17) + i * o >>> 15) + o * o,
        l = ((4294901760 & r) * r | 0) + ((65535 & r) * r | 0);
        c[n] = a ^ l;
      }
      e[0] = c[0] + (c[7] << 16 | c[7] >>> 16) + (c[6] << 16 | c[6] >>> 16) | 0,
      e[1] = c[1] + (c[0] << 8 | c[0] >>> 24) + c[7] | 0,
      e[2] = c[2] + (c[1] << 16 | c[1] >>> 16) + (c[0] << 16 | c[0] >>> 16) | 0,
      e[3] = c[3] + (c[2] << 8 | c[2] >>> 24) + c[1] | 0,
      e[4] = c[4] + (c[3] << 16 | c[3] >>> 16) + (c[2] << 16 | c[2] >>> 16) | 0,
      e[5] = c[5] + (c[4] << 8 | c[4] >>> 24) + c[3] | 0,
      e[6] = c[6] + (c[5] << 16 | c[5] >>> 16) + (c[4] << 16 | c[4] >>> 16) | 0,
      e[7] = c[7] + (c[6] << 8 | c[6] >>> 24) + c[5] | 0;
    }
    var n = e,
    r = n.lib,
    i = r.StreamCipher,
    o = n.algo,
    a = [],
    s = [],
    c = [],
    l = o.Rabbit = i.extend({
      _doReset: function () {
        for (var e = this._key.words, n = this.cfg.iv, r = 0; r < 4; r++)
        e[r] = 16711935 & (e[r] << 8 | e[r] >>> 24) | 4278255360 & (e[r] << 24 | e[r] >>> 8);
        var i = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16],
        o = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]];
        this._b = 0;
        for (var r = 0; r < 4; r++)
        t.call(this);
        for (var r = 0; r < 8; r++)
        o[r] ^= i[r + 4 & 7];
        if (n) {
          var a = n.words,
          s = a[0],
          c = a[1],
          l = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
          u = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8),
          f = l >>> 16 | 4294901760 & u,
          d = u << 16 | 65535 & l;
          o[0] ^= l,
          o[1] ^= f,
          o[2] ^= u,
          o[3] ^= d,
          o[4] ^= l,
          o[5] ^= f,
          o[6] ^= u,
          o[7] ^= d;
          for (var r = 0; r < 4; r++)
          t.call(this);
        }
      },
      _doProcessBlock: function (e, n) {
        var r = this._X;
        t.call(this),
        a[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16,
        a[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16,
        a[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16,
        a[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;
        for (var i = 0; i < 4; i++)
        a[i] = 16711935 & (a[i] << 8 | a[i] >>> 24) | 4278255360 & (a[i] << 24 | a[i] >>> 8),
        e[n + i] ^= a[i];
      },
      blockSize: 4,
      ivSize: 2 });

    n.Rabbit = i._createHelper(l);
  }(),
  e.mode.CTR = function () {
    var t = e.lib.BlockCipherMode.extend(),
    n = t.Encryptor = t.extend({
      processBlock: function (e, t) {
        var n = this._cipher,
        r = n.blockSize,
        i = this._iv,
        o = this._counter;
        i && (o = this._counter = i.slice(0),
        this._iv = void 0);
        var a = o.slice(0);
        n.encryptBlock(a, 0),
        o[r - 1] = o[r - 1] + 1 | 0;
        for (var s = 0; s < r; s++)
        e[t + s] ^= a[s];
      } });

    return t.Decryptor = n,
    t;
  }(),
  function () {
    function t() {
      for (var e = this._X, t = this._C, n = 0; n < 8; n++)
      s[n] = t[n];
      t[0] = t[0] + 1295307597 + this._b | 0,
      t[1] = t[1] + 3545052371 + (t[0] >>> 0 < s[0] >>> 0 ? 1 : 0) | 0,
      t[2] = t[2] + 886263092 + (t[1] >>> 0 < s[1] >>> 0 ? 1 : 0) | 0,
      t[3] = t[3] + 1295307597 + (t[2] >>> 0 < s[2] >>> 0 ? 1 : 0) | 0,
      t[4] = t[4] + 3545052371 + (t[3] >>> 0 < s[3] >>> 0 ? 1 : 0) | 0,
      t[5] = t[5] + 886263092 + (t[4] >>> 0 < s[4] >>> 0 ? 1 : 0) | 0,
      t[6] = t[6] + 1295307597 + (t[5] >>> 0 < s[5] >>> 0 ? 1 : 0) | 0,
      t[7] = t[7] + 3545052371 + (t[6] >>> 0 < s[6] >>> 0 ? 1 : 0) | 0,
      this._b = t[7] >>> 0 < s[7] >>> 0 ? 1 : 0;
      for (var n = 0; n < 8; n++) {
        var r = e[n] + t[n],
        i = 65535 & r,
        o = r >>> 16,
        a = ((i * i >>> 17) + i * o >>> 15) + o * o,
        l = ((4294901760 & r) * r | 0) + ((65535 & r) * r | 0);
        c[n] = a ^ l;
      }
      e[0] = c[0] + (c[7] << 16 | c[7] >>> 16) + (c[6] << 16 | c[6] >>> 16) | 0,
      e[1] = c[1] + (c[0] << 8 | c[0] >>> 24) + c[7] | 0,
      e[2] = c[2] + (c[1] << 16 | c[1] >>> 16) + (c[0] << 16 | c[0] >>> 16) | 0,
      e[3] = c[3] + (c[2] << 8 | c[2] >>> 24) + c[1] | 0,
      e[4] = c[4] + (c[3] << 16 | c[3] >>> 16) + (c[2] << 16 | c[2] >>> 16) | 0,
      e[5] = c[5] + (c[4] << 8 | c[4] >>> 24) + c[3] | 0,
      e[6] = c[6] + (c[5] << 16 | c[5] >>> 16) + (c[4] << 16 | c[4] >>> 16) | 0,
      e[7] = c[7] + (c[6] << 8 | c[6] >>> 24) + c[5] | 0;
    }
    var n = e,
    r = n.lib,
    i = r.StreamCipher,
    o = n.algo,
    a = [],
    s = [],
    c = [],
    l = o.RabbitLegacy = i.extend({
      _doReset: function () {
        var e = this._key.words,
        n = this.cfg.iv,
        r = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16],
        i = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]];
        this._b = 0;
        for (var o = 0; o < 4; o++)
        t.call(this);
        for (var o = 0; o < 8; o++)
        i[o] ^= r[o + 4 & 7];
        if (n) {
          var a = n.words,
          s = a[0],
          c = a[1],
          l = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
          u = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8),
          f = l >>> 16 | 4294901760 & u,
          d = u << 16 | 65535 & l;
          i[0] ^= l,
          i[1] ^= f,
          i[2] ^= u,
          i[3] ^= d,
          i[4] ^= l,
          i[5] ^= f,
          i[6] ^= u,
          i[7] ^= d;
          for (var o = 0; o < 4; o++)
          t.call(this);
        }
      },
      _doProcessBlock: function (e, n) {
        var r = this._X;
        t.call(this),
        a[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16,
        a[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16,
        a[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16,
        a[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;
        for (var i = 0; i < 4; i++)
        a[i] = 16711935 & (a[i] << 8 | a[i] >>> 24) | 4278255360 & (a[i] << 24 | a[i] >>> 8),
        e[n + i] ^= a[i];
      },
      blockSize: 4,
      ivSize: 2 });

    n.RabbitLegacy = i._createHelper(l);
  }(),
  e.pad.ZeroPadding = {
    pad: function (e, t) {
      var n = 4 * t;
      e.clamp(),
      e.sigBytes += n - (e.sigBytes % n || n);
    },
    unpad: function (e) {
      for (var t = e.words, n = e.sigBytes - 1; !(t[n >>> 2] >>> 24 - n % 4 * 8 & 255);)
      n--;
      e.sigBytes = n + 1;
    } },

  e;
});
CryptoJS = t();
var _0x3525 = [".ptgood,.discount,.dis,.disthree,.cardwenter", ".ptgood,.discount,.disthree,.cardshow,.zkenter", ".act-content", "myCardList_usable", ".cardshow", ".disthree,.cardwenter", ".zkenter,.ptgood,.discount,.disthree", "pcardCash", ".stockNum", "activestock", "stockNumtype", "data-startTime", "data-endTime", "data-activebo", ".lizk", ".exclusivewali", ".litit", "width", "auto", ".zkenter", ".zkcount", "#hbg", "marketlist", "#days", "#characters", "#recommends", "recommend", "goodsData", "productType", "tpl", "innerHTML", "register", "chartgoodsName", "#conn", "#conn_ta", "marketlist2", "请输入手机号码", "showPrice", "#months", "#hours", "data-soldout", "activewo", "actselloutbo", "border", "markb2", "appendTo", " div", "#f6f6f6", "<img class='zkz zk ' src='../../images/flow/qiang3_03.png' />", "data-producttypes", "#paySwitchc", "huoquzhekou", "#day", "#month", ".mon-table", "onepxT", "#hour", "#character", "#recommend", "添加之后的商品列表", "activityList", "1、中国移动各品牌实名制用户购买的流量均为国内2/3/4G全网通用流量，流量到账后立即生效，流量资源一次性充入用户账户，用户不得取消，无法办理退款；<br/>", "2、流量直充产品所含流量资源当月有效，月底清零；<br/>", "3、可重复购买，同时购买多个流量直充产品时叠加生效;<br/>", "4、购买的流量不可多终端共享，不可转赠至其他移动用户。", "#warm_con", ".paySwitch ul li", "none", "fadeIn", "800", "block", "1、 中国移动各品牌实名制用户购买的流量均为国内2/3/4G全网通用流量，流量到账后立即生效；<br/>", "2、费用一次性收取，流量资源一次性提供给客户。流量自生效时刻起24小时内有效，流量使用完毕或时间到达后均失效。流量资源一次性充入用户账户，用户不得取消，无法办理退款；<br/>", "#listkk", "#rBtn,.btnBack", "recommendData", "floorSize", "floorList", "productTypes", "999,", "sort", "compare", "sortNo", ".overseas", "getgoodsData", "publishChannel", "goodsids", "#character ul li", "0.62533rem", "0.128rem", "2.15rem", "0.855333rem 0 !important", "hide", "nextAll", ".sp", ".activewo", "not", ".dis,.discount,.disthree", ".ptgood", ".cardwenter", "position", "#listk", "#listkk,#liuBtn,#warmcld,#warm_con,#triangle,.warm-ct", "#login_tc", "dayprice", "activeproductid", "payFlowCallback", "902073", "seventhree", "902074", "FHW/touch/goods/recommendGoodsList", "retDesc", "sevenfour", "linethron", ".inventory,.zkq,.totalNums", "../../images/flow/three_03.png", ".zkthreimg1", "../../images/flow/three_06.png", "../../images/flow/threezx_03.png", ".threprice,.threesale", ".threprice", ".zkh", "#333333", " 0.64rem", ".underway", "抢购中", "#00a4ff", ".grab", "0.426667rem", ".discnum", "url(../../images/flow/discount.png)", "100% 100%", "url(../../images/flow/clock.png)", ".clock", "../../images/flow/clock.png", ".at-price", "0.64rem", ".act-price", "line-through", ".zkbj", "url(../../images/flow/zkprice_03.png)", "url(../../images/flow/pritwo_03.png)", ".exclusivecon", "url(../../images/flow/zxyou_03.png)", ".zkzt", "no-repeat", ".zkq,.inventory", ".threeconl img", "../../images/flow/threeh_03.png", "../../images/flow/threeh_06.png", ".zkthreimgzx", ".onprice", "已售罄", "margin-top", "0.87rem", "url(../../images/flow/dis-gray.png)", "url(../../images/flow/cloth-gray.png)", ".totalNums", "1px solid #ff8700", ".zk", "../../images/flow/qiang3_03.png", "skewing", "../../images/flow/qiang2_03.png", "<img class='zkz zk ' src='../../images/flow/qiang2_03.png' />", "Deferred", "FHW/touch/goods/discountStock", "resolve", "data-marketid", "商品的副标题", "prev", "zkb", "点击到其他商品product", "点击折扣定位的商品的折扣价product", "#recommend,#month,#day,#hour,#character", "firstPruductPrice", "#666666", "#fc2401", "markbday", ".ptgood,.discount,.dis,.disthree,.cardshow,.cardwenter,.zkenter", ".disribao", "去流量钱包", "daywact", "1907_CQLLHB_MO_P_BHAD99", "1907_CQLLHB_MO_O_BYAD5", "confirmPlug", "流量购买后将存入流量钱包，使用时可提取到通信账户，剩余流量可在流量钱包中查询，季末流量将失效清零", "leadeon-flow-touch-test", "https://app.10086.cn/activity-test/transit/flowwallet.html?WT.ac_id=", "https://app.10086.cn/activity/transit/flowwallet.html?WT.ac_id=", "立即充值", "actselloutbo2", "setWebtrends", "wb_llcz_y_", "wb_llcz_r_", "wb_llcz_xs_", "100%", "substr", " .mon-con", "1px solid #e9e9e9", "display", "but_accessData", "立即登录", "尊敬的用户，由于您未登录，流量充值后将无法查询充值订单，是否继续？", "oneclick", "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=", ".discount,.dis,.disthree,.zkenter", "functionOfClicks", "CF02411", "body", "clicklist", ".cancel", ".usecount", ".cardshow,.zkenter", "登录查看", "0.363rem", "0.624rem", ".flr", "click", "-400px", "#login_h", "#login_dl", "https://flow.clientaccess.10086.cn/SessionServer-orange/loginOutSSO", "https://login.10086.cn/logout.action?channelID=12016&backUrl=", "invoke", "sendAppMessage", "640", "send_msg", "err_msg", "shareTimeline", "timeline", "shareWeibo", "leadeon-flow-touch", "leadeon-flow-touch/images/flow/share.png", "使用#中国移动手机营业厅#流量直充，即充即用，告别流量饥荒，点击充值！", "流量直充", "WeixinJSBridgeReady", "menu:share:timeline", "menu:share:weibo", "userAgent", "toLowerCase", "match", "#enter_khd,#oBtn,.unpaid-see", ".register", ".safari", "wxshare", "#enter_khd", "?taskID=", "?productType=", "pullAppDownload", "#oBtn", "v2.0/pages/mall/order/orderlist.html?tab=0", ".unpaid-see", ".unpaid-prompt", "cmcc", ".turnoff", "FHW/payFlowStatic/payFlow", "payFlow", "#hovering", "FHW/touch/order/orderList", "totalCount", "#hoveringcolse", "hoveringdate", "#rightFlr, .chongD", "visit", "safari", "slideToggle", "#warmt", "toggleClass", "open-close", "open-close2", ".input_tex", "onInput", "keyup", "value", "event", "selectionEnd", "formatMobile", "setSelectionRange", "#rSupp", ".payTypec", "data-available", "data-accountrule", "data-nominalvalue2", "fid", "data-fid", "batchid", "data-batchid", "sid", "data-sid", "data-producttype", "data-fuid", "span", "wb_llcz_ljcz", "newcardbo", "resultCode", "cardverify", "createOrder2", "resultCode2", "原价购买", "尊敬的用户您好，", "errorDesc", "，您可按照原价购买，是否继续？", "xpaycard", ".discount,.dis,.disthree", "FHW/touch/reminder/getReminder", "style", ".warm-ct", "height", "7.253333rem", "reminder", "getNormalString", "<span>", "<span><br/>", "#warmcld,#triangle,#warm_con", "FHW/touch/user/validate", "#rBtn,.warm-ct,.btnBack", "#listk,#listkk", "912075", "#0085cf", "310004", "您输入的号码非移动手机号码，请您重新输入", "#bbbbbb", "floor", "o2oNum", "orderCode", "payPrice", "paidOrder", "902076", "activegray", "抱歉，活动商品已被抢空，商品已恢复原价，可继续原价购买", ".zkq", "../../images/flow/threezxh_03.png", "url(../../images/flow/zkpriceh_03.png)", ".saletwo", "url(../../images/flow/pritwoh_03.png)", "url(../../images/flow/zxyouh_03.png)", "0.707rem 0.596rem", "922025", "922026", "912082", ".dialog-plug .d-btn", "查看订单", "gopay", "922009", "922024", "922010", "去支付", "922011", "922012", "922023", "912086", "查看活动", "fixed", ".dialog-plug", "尊敬的用户您好，该活动商品仅限为登录手机号充值。", "请使用手机号码登录购买活动商品，只有为本机充值才可享受优惠哦！", "pages", "pages/flow/orderSucc.html?productTraffic=", "&payPrice=", "payUrl", "FHW/touch/tagInfo/getTagInfo", "ifChangeLogo", "readonly", ".input", ".china-app,#liuBtn,#chongD", "ah0551", "logo-index", "#logo-index", ".china-app,#liuBtn,#chongD,.logo", "FHW/touch/goods/getOperationAdv", "0,1", "flowData", "operationAdvList1", "operationAdvList2", "operationAdvList", "advType", "#messzcon", ".searched", "http://www.10086.cn/roaming/identify/?WT.ac=WAP000GJMY_IDENTIFY_M_LLZC", ".location-list .item", "actionUrl", "bussType", "loginType", "ssoUrlAddr", "paramList", "getParamListUrl", "&TransactionID=", "登录跳转地址：", "UID", "&UID=", "jumpuid", "provinceCode", "&provinceCode=", "cityCode", "&cityCode=", "telNo", "#testhd", "tagChang", "showNumHis", "AssistantInfo", "o2oQu", "仅支持移动号码充值", ".cardwenter,.zkenter", "SHE/myCardList/list", "flowbo", "cardTicketList", "myCardList", "912093", "cardnone", "cardnone2", "clearCookie", "FHW/touch/cardInfo/getCardInfo", "busiData", "totleNum", "pcardPasswd", "cardnone3", "flowbo2", "0.597rem", "data-cardticketname", "data-cardticketuserange", "data-usedes", "data-useendtime", ".cardrtitui", "<span>全国</span>", "<span>本地</span>", ".cardrroleui", ".cardtimeui1", ".cardtimeui2", "newcard", "available", ".usecount span", "apply", "getElementById", "conList3", "nominalValue2", "cardtime", "#cardlist", ".paymentcard", "../../images/flow/dzkj_03.png", "cardshowui", ".dis,.discount,.disthree,.cardwenter", ".li_", "#li_", "data-loginused", ".zkenter,.cardshow", "暂无优惠券", ".cardjt,.cardcount", "加载中", "0.586rem", ".cardshow,.cardwenter", ".typecard", "addEventListener", "touchmove", "小时包", "constructor", "counter", "debu", "gger", "call", "action", "stateObject", "function *\\( *\\)", "\\+\\+ *(?:_0x(?:[a-f0-9]){4,6}|(?:\\b|\\d)[a-z0-9]{1,4}(?:\\b|\\d))", "init", "test", "chain", "input", "000000000", "99999999", "【全国】存入流量钱包，随兑随用，季末清零", "3元1GB", "000000", "SUCCESS", "2,3", "172", "LTceshi积分", "【全国】即时生效，当月有效，支持2G/3G/4G", "123456", "30M", "LT123", "123ceshi ", "150M", "154", "500M", "1,2", "#rClear", "addClass", "hidden", "leadeon", "flowapp", "pages/flow/payFlow.html", "cardtakbo", "productId", "flowNum", "?provice=", "&version=", "&st=", "&sp=", "&productType=", "?tag=", "&cardurl=", "&marketId=", "&taskID=", "location", "channel", "0705", "clientType", "cookie", "CmLocation", "jumpprovince", "split", "jumpcitys", "telNum", "is_login", "null", "#reqInit", "reqInits", "html,body", "css", "relative", "#rightFlr", "hiddens", "loginS", "numLogin", "showLoadPlug", "myCardLista", "cardnone4", "start", "toastPlug", "优惠券加载异常，可直接充值或重新加载", "removeClass", ".cardcount", "html", "重新加载", "color", ".cardjt", "src", "../../images/flow/lodlose.png", "0.512rem", "getMyCardList2", "text", "#login_x", "getTime", "https://login.10086.cn/SSOCheck.action?channelID=12016&backUrl=", "href", "JSESSIONID", "length", "substring", "replace", "localStorage", "getItem", "hisPhone", "trim", "splice", "setItem", "remFormatNum", "getHisStorage", "push", "reverse", "#rNum", "empty", "'><p class='his-num'>", "</p><img class='i-clear' src='../../images/flow/clear.png'><div class='clear'></div></li>", "numJY", "getRecommend", "payFlow_con", "getProvinceTwo", "#His .his-li", "unbind", "fastClick", "attr", "clearNum", "showClear", "judgeNumLength", "show", "stopPropagation", "preventDefault", "#His .i-clear", "parent", ".his-li", "remove", "trigger", "focus", "showHis", "#His li", "class", "#His", "forEach", "val", "hiddClear", "log", "blur", "checkNumber", "#rBtn", "disable", "仅支持移动号码充值 ", "2px", "#999999", "retCode", "sessionFailurePrompt", "flow.clientaccess.10086.cn", ".10086.cn", "reload", "ajax", "post", "hostport", "DA/local/getLocal", "getAjaxData", "jsons", "json", "unenable", "sessionCheck", "provinceName", "rspBody", "provice", "closeLoadPlug", "showDialogPlug", "请求无法受理，请稍后再试!", "知道了", "find", ".mon-con", "each", "#777777", "data-productid", "data-producttraffic", "indexOf", "data-discountcnt", "hover", "siblings", "mon-sel", "bor-all", "markb", "#recommend,#month,#day,#character", "#recommend,#month,#hour,#character", "#recommend,#day,#hour,#character", "#recommend,#month,#day,#hour", "#month,#day,#hour,#character", ".ptgood2", "hasClass", "#FF7F00", "changelist", "999", "warmTip", "data-goodsid", "orderMyCardList", "cardgoodid", "true", "FHW/touch/goods/discountListStock", "marketList", "stockArr", "marketId", "stockNum", "totalNum", "totalNumtype", ".list", "children", "get", "img", "../../images/flow/sel.png", "undefined", "round", "floating", "toFixed", "toString", "lastIndexOf", "ceil", "data-discounttype", "data-cashprice", "pcardBusiRelList", "goodsIds", "goodsList", "detailList", "goodsId", "discount", "discountCnt", "cashPrice", "discountType", "disCountPrice", "accountRule", ".noactive2>span", "cashprice*disPrice", "cardgoodsid", "无优惠并且url携带卡券参数，档位商品的价格1111", "firstPrice", "无优惠并且url携带卡券参数，档位商品的价格2222", "无优惠并且url不携带卡券参数，档位商品的价格", "month", "recomendType", "day", "hour", "character", " > ul > li > div", ".type", ".type,.cancel", "#ffffff", "data-futit", ".inmeEffect", "margin-left", "-0.3rem", ".recommondTitle", ".sj", "styleType", "' data-discountType='", "' data-activebo='", "activebo", "' data-endTime='", "endTime", "isBlackAndWhiteList", "' data-marketId='", "<div class='litit'>", "marketName", "</div>", "<div class='lizk2'><div class='zkpritwo'></div><p class='ppzk2'>", "折</p></div><div class='exclusivecon2 exclusivewali hidden'></div><div class='bloclear'></div>", "<div class='lizk'></div><div class='exclusivecon2 exclusivewali hidden'></div><div class='bloclear'></div>", "<p class='liftit ellipsis'>", "</p>", "</div><div class='liprice'>", "元</div>", "</div><img class='payType zx-unsel' src='../../images/flow/unsel.png'></li>", "offerList", "<li class='onepx onepxB type only' data-marketrule='", "' data-startTime='", "startTime", "' data-amount='", "' data-style='", "'><div class='zklic'><div class='lileft'>", "marketRule", "append", ".dzkjt", "<div class='cancel onepx onepxT'>取消</div>", "#payments", "jinzhi", "absolute", "stop", "animate", "../../images/flow/unsel.png", "data-marketrule", "data-isBlackAndWhiteList", "data-discountCnt", "discountzk", "data-marketId", "data-amount", "data-discountType", ".ptgood,.dis,.disthree,.cardshow,.zkenter", ".discount,.cardwenter", "card_style", ".discb", ".dis,.cardwenter", ".threecon", ".zkthre span", ".ptgood,.discount,.dis,.cardshow,.zkenter", ".exclusivewa", ".zkq2", "原价：", "orderpric", ".noactive span", "false", "stockBuss", "join", "goodsIdl", "stockList", "marketIdx", ".ptgood,.dis,.discount,.disthree,.cardwenter", ".discount .inmeEffect", ".flwx .zkstconl", "flex", "column", "center", "inline"];
(function (_0x3491ea, _0x84631b) {
  var _0x542fb5 = function (_0x2b8590) {
    while (--_0x2b8590) {
      _0x3491ea["push"](_0x3491ea["shift"]());
    }
  };
  _0x542fb5(++_0x84631b);
})(_0x3525, 0x1cd);
var _0x1c9a = function (_0x5b0024, _0x39314e) {
  _0x5b0024 = _0x5b0024 - 0x0;
  var _0x3c2bb6 = _0x3525[_0x5b0024];
  return _0x3c2bb6;
};
var _0x32580a = function () {
  var _0x3a3d6c = true;
  return function (_0x189b0e, _0x4f6a22) {
    var _0x3414e9 = _0x3a3d6c ? function () {
      if (_0x4f6a22) {
        var _0x1b33fc = _0x4f6a22["apply"](_0x189b0e, arguments);
        _0x4f6a22 = null;
        return _0x1b33fc;
      }
    } :
    function () {};

    _0x3a3d6c = false;
    return _0x3414e9;
  };

}();
(function () {
  _0x32580a(this, function () {
    var _0x58d2af = new RegExp("function *\\( *\\)");
    var _0x26c8c4 = new RegExp("\\+\\+ *(?:_0x(?:[a-f0-9]){4,6}|(?:\\b|\\d)[a-z0-9]{1,4}(?:\\b|\\d))", "i");
    var _0x132eec = _0x4a30a6("init");
    if (!_0x58d2af["test"](_0x132eec + "chain") || !_0x26c8c4["test"](_0x132eec + "input")) {
      _0x132eec("0");
    } else {
      _0x4a30a6 = function () {};
      _0x4a30a6();
    }
  })();
})();
var payFlow = {
  "jsons": {
    "cid": "0",
    "en": "0",
    "token": "0",
    "sn": "0",
    "version": "0",
    "st": "0",
    "sv": "0",
    "sp": "0" },

  "numLogin": "",
  "numJY": "",
  "actselloutbo": !0x1,
  "actselloutbo2": !0x1,
  "stockNum": "",
  "stockNumtype": 0x0,
  "totalNumtype": 0x0,
  "provice": "",
  "o2oNum": "",
  "o2oQu": "",
  "marketIdx": "",
  "discountzk": "",
  "activeproductid": "000000000",
  "firstPruductPrice": !0x0,
  "orderpric": "",
  "cardnone": !0x1,
  "cardnone3": !0x1,
  "cardnone4": !0x1,
  "cardnone2": !0x1,
  "goodsids": [],
  "goodsData": {},
  "firstPrice": [],
  "cardtakbo": !0x1,
  "cardgoodid": "",
  "xpaycard": !0x1,
  "disCountPrice": "",
  "sid": "",
  "fid": "",
  "batchid": "",
  "resultCode": !0x1,
  "resultCode2": !0x1,
  "newcardbo": "",
  "errorDesc": "",
  "marketList": "",
  "goodsIdl": "",
  "changelist": !0x1,
  "card_style": "",
  "channel": "",
  "clientType": "",
  "myCardList": "",
  "myCardLista": "",
  "flowbo": !0x1,
  "flowbo2": !0x1,
  "myCardList_usable": !0x1,
  "loginS": 0x0,
  "jinzhi": 0x0,
  "recommendData": {},
  "offerList": "",
  "daywact": "",
  "jumpprovince": "",
  "jumpcitys": "",
  "jumpuid": "",
  "flowData": {
    "operationAdvList1": [],
    "operationAdvList2": [] },

  "dayprice": {
    "goodsId": "99999999",
    "goodsName": "日包",
    "goodsSubtitle": "【全国】存入流量钱包，随兑随用，季末清零",
    "goodsDesc": "【全国】存入流量钱包，随兑随用，季末清零",
    "productId": "99999999",
    "productType": "2",
    "productTraffic": "3元1GB",
    "exchangeType": "99999999",
    "cashPrice": 0x5f5e0ff,
    "pointsPrice": 0x5f5e0ff,
    "dayprice": !0x0,
    "discount": [{
      "exchangeType": 0x5f5e0ff,
      "marketId": 0x5f5e0ff,
      "styleType": 0x5f5e0ff,
      "marketName": "99999999",
      "marketRule": "99999999",
      "priority": 0x5f5e0ff,
      "startTime": "99999999",
      "endTime": "99999999",
      "discountCnt": 0x5f5e0ff,
      "soldOut": 0x5f5e0ff,
      "discountType": 0x5f5e0ff }] },


  "cardgoodsid": "",
  "staticData": {
    "retCode": "000000",
    "retDesc": "SUCCESS",
    "rspBody": {
      "totalSize": 0x6,
      "productTypes": "2,3",
      "goodsList": [{
        "productType": "3",
        "detailList": [{
          "goodsId": "172",
          "goodsName": "LTceshi积分",
          "goodsSubtitle": "【全国】即时生效，当月有效，支持2G/3G/4G",
          "goodsDesc": "123456",
          "productId": "8",
          "productType": "3",
          "productTraffic": "30M",
          "exchangeType": "1,2",
          "cashPrice": 0x1f4,
          "pointsPrice": 0x64,
          "discount": [] },
        {
          "goodsId": "154",
          "goodsName": "LT123",
          "goodsSubtitle": "【全国】即时生效，当月有效，支持2G/3G/4G",
          "goodsDesc": "123ceshi ",
          "productId": "8",
          "productType": "3",
          "productTraffic": "70M",
          "exchangeType": "1",
          "cashPrice": 0x3e8,
          "pointsPrice": 0x0,
          "discount": [] },
        {
          "goodsId": "172",
          "goodsName": "LTceshi积分",
          "goodsSubtitle": "【全国】即时生效，当月有效，支持2G/3G/4G",
          "goodsDesc": "123456",
          "productId": "8",
          "productType": "3",
          "productTraffic": "150M",
          "exchangeType": "1,2",
          "cashPrice": 0x7d0,
          "pointsPrice": 0x64,
          "discount": [] },
        {
          "goodsId": "154",
          "goodsName": "LT123",
          "goodsSubtitle": "【全国】即时生效，当月有效，支持2G/3G/4G",
          "goodsDesc": "123ceshi ",
          "productId": "8",
          "productType": "3",
          "productTraffic": "500M",
          "exchangeType": "1",
          "pointsPrice": 0x0,
          "discount": [] },
        {
          "goodsId": "172",
          "goodsName": "LTceshi积分",
          "goodsSubtitle": "【全国】即时生效，当月有效，支持2G/3G/4G",
          "goodsDesc": "123456",
          "productId": "8",
          "productType": "3",
          "productTraffic": "1G",
          "exchangeType": "1,2",
          "pointsPrice": 0x64,
          "discount": [] },
        {
          "goodsId": "154",
          "goodsName": "LT123",
          "goodsSubtitle": "【全国】即时生效，当月有效，支持2G/3G/4G",
          "goodsDesc": "123ceshi ",
          "productId": "8",
          "productType": "3",
          "productTraffic": "2G",
          "exchangeType": "1",
          "pointsPrice": 0x0,
          "discount": [] }] },

      {
        "productType": "2",
        "detailList": [{
          "goodsId": "172",
          "goodsName": "LTceshi积分",
          "goodsSubtitle": "【全国】即时生效，当月有效，支持2G/3G/4G",
          "goodsDesc": "123456",
          "productId": "8",
          "productType": "3",
          "productTraffic": "500M",
          "exchangeType": "1,2",
          "cashPrice": 0x3e8,
          "pointsPrice": 0x64,
          "discount": [] },
        {
          "goodsId": "154",
          "goodsName": "LT123",
          "goodsSubtitle": "【全国】即时生效，当月有效，支持2G/3G/4G",
          "goodsDesc": "123ceshi ",
          "productId": "8",
          "productType": "3",
          "productTraffic": "1G",
          "exchangeType": "1",
          "cashPrice": 0x5dc,
          "pointsPrice": 0x0,
          "discount": [] }] }] } },




  "hiddClear": function () {
    $("#rClear")["removeClass"]("show")["addClass"]("hidden");
  },
  "showClear": function () {
    $("#rClear")["removeClass"]("hidden")["addClass"]("show");
  },
  "vertionPad": function () {
    if (Device["os"]["leadeon"]) {
      var _0x283f00 = publicClient["flowapp"] + "pages/flow/payFlow.html",
      _0x37229a = "",
      _0x9f9548 = "";
      cardUrl ? payFlow["cardtakbo"] ? (_0x37229a = productIdUrl,
      _0x9f9548 = "productId") : (_0x37229a = traficFlow,
      _0x9f9548 = "flowNum") : (_0x37229a = productIdUrl,
      _0x9f9548 = "productId"),
      proviceewm && cityewm && version && st && sp ? (_0x283f00 += "?provice=" + proviceewm + "&city=" + cityewm + "&version=" + version + "&st=" + st + "&sp=" + sp,
      o2oNumurl && rydtype && _0x37229a ? urls = _0x283f00 + "&taskID=" + o2oNumurl + "&productType=" + rydtype + "&" + _0x9f9548 + "=" + _0x37229a : rydtype && _0x37229a ? urls = _0x283f00 + "&productType=" + rydtype + "&" + _0x9f9548 + "=" + _0x37229a : o2oNumurl ? urls = _0x283f00 + "&taskID=" + o2oNumurl : urls = _0x283f00) : (_0x283f00 += "?tag=" + tag + "&mobileNo=" + mobileNo + "&cardurl=" + cardUrl + "&marketId=" + marketIdUrl,
      o2oNumurl && rydtype && _0x37229a ? urls = _0x283f00 + "&taskID=" + o2oNumurl + "&productType=" + rydtype + "&" + _0x9f9548 + "=" + _0x37229a : rydtype && _0x37229a ? urls = _0x283f00 + "&productType=" + rydtype + "&" + _0x9f9548 + "=" + _0x37229a : o2oNumurl ? urls = _0x283f00 + "&taskID=" + o2oNumurl : urls = _0x283f00),
      window["location"]["href"] = urls;
    } else {
      if (payFlow["channel"] = "0705",
      payFlow["clientType"] = "2",
      $["cookie"]("CmLocation") && (payFlow["jumpprovince"] = $["cookie"]("CmLocation")["split"]("|")[0x0],
      payFlow["jumpcitys"] = $["cookie"]("CmLocation")["split"]("|")[0x1]),
      $["cookie"]("JSESSIONID") && $["cookie"]("telNum") && $["cookie"]("is_login") && ("null" == $["cookie"]("LC") || $["cookie"]("c") == $["cookie"]("LC")))
      $("#reqInit")["removeClass"]("reqInit")["addClass"]("reqInits"),
      $("html,body")["css"]("position", "relative"),
      $("#rightFlr")["addClass"]("hiddens"),
      payFlow["loginS"] = 0x1,
      payFlow["numLogin"] = $["cookie"]("telNum"),
      payFlow["jumpuid"] = $["cookie"]("c"),
      payFlow["numLogin"] && publicClient["showLoadPlug"](),
      setTimeout(function () {
        "" != payFlow["myCardLista"] || "" != payFlow["myCardList"] || payFlow["cardnone4"] || payFlow["cardnone3"] || (payFlow["start"](payFlow["numLogin"], tag),
        publicClient["toastPlug"]("优惠券加载异常，可直接充值或重新加载", 0xbb8),
        $(".zkenter,.cardshow")["addClass"]("hidden"),
        $(".cardwenter")["removeClass"]("hidden"),
        $(".cardcount")["html"]("重新加载")["css"]("color", "#00a4ff"),
        $(".cardjt")["attr"]("src", "../../images/flow/lodlose.png"),
        $(".cardjt")["css"]({
          "width": "0.597rem",
          "height": "0.512rem",
          "top": "0.586rem" }));

      }, 0x1388),
      payFlow["getMyCardList2"](),
      $("#login_h")["removeClass"]("hidden")["text"](payFlow["numLogin"]),
      $("#login_x")["removeClass"]("hidden"),
      $("#login_dl")["addClass"]("hidden");else
      if ($["cookie"]("is_login") && $["cookie"]("is_login") || $["cookie"]("is_login") && $["cookie"]("is_login") && $["cookie"]("c") != $["cookie"]("LC")) {
        var _0x8f700f = new Date()["getTime"]();
        window["location"]["href"] = "https://login.10086.cn/SSOCheck.action?channelID=12016&backUrl=" + encodeURIComponent(window["location"]["href"]) + "&timestamp=" + _0x8f700f;
      } else
      $["cookie"]("JSESSIONID", "", {
        "expires": -0x1,
        "path": "/" }),

      $["cookie"]("telNum", "", {
        "expires": -0x1,
        "path": "/" });

      payFlow["numLogin"] || (publicClient["closeLoadPlug"](),
      payFlow["start"](payFlow["numLogin"], tag));
    }
  },
  "sub11PhoneNum": function (_0x23e527) {
    return _0x23e527 = payFlow["remFormatNum"](_0x23e527),
    _0x23e527["length"] >= 0xb ? _0x23e527 = _0x23e527["substring"](_0x23e527["length"] - 0xb, _0x23e527["length"]) : _0x23e527;
  },
  "remFormatNum": function (_0x315ed1) {
    return /[ ]/["test"](_0x315ed1) ? _0x315ed1["replace"](/[ ]/g, "") : _0x315ed1;
  },
  "getHisStorage": function () {
    if (window["localStorage"]) {
      var _0x45f15e = localStorage["getItem"]("hisPhone");
      if (null != _0x45f15e && "" != _0x45f15e["trim"]()) {
        var _0x220970 = _0x45f15e["split"]("-");
        if (_0x220970["length"] > 0x2) {
          for (var _0x2016a1 = _0x220970["length"] - 0x2, _0x256748 = 0x0; _0x256748 < _0x2016a1; _0x256748++)
          _0x220970["splice"](0x0, 0x1);
          for (var _0x256748 = 0x0; _0x256748 < _0x220970["length"]; _0x256748++)
          _0x45f15e = 0x0 == _0x256748 ? _0x220970[_0x256748] : _0x45f15e + "-" + _0x220970[_0x256748];
          localStorage["setItem"]("hisPhone", _0x45f15e);
        }
        return _0x220970["reverse"](),
        _0x220970;
      }
      return null;
    }
    return null;
  },
  "setHisStorage": function (_0x12688a) {
    var _0x12688a = payFlow["remFormatNum"](_0x12688a);
    if (window["localStorage"]) {
      var _0x4fcc19 = "",
      _0x7cd361 = payFlow["getHisStorage"]();
      if (null != _0x7cd361 && 0x0 < _0x7cd361["length"]) {
        for (var _0x5e5c37 = new Array(), _0x3d86f3 = 0x0; _0x3d86f3 < _0x7cd361["length"]; _0x3d86f3++)
        _0x7cd361[_0x3d86f3] != _0x12688a && _0x5e5c37["push"](_0x7cd361[_0x3d86f3]);
        _0x5e5c37["reverse"](),
        _0x5e5c37["push"](_0x12688a),
        _0x4fcc19 = _0x5e5c37["join"]("-");
      } else
      _0x4fcc19 = _0x12688a;
      localStorage["setItem"]("hisPhone", _0x4fcc19);
    }
  },
  "clearNum": function () {
    $("#rNum")["empty"](),
    $("#rSupp")["empty"]();
  },
  "showNumHis": function () {
    var _0x100e29 = payFlow["getHisStorage"]();
    if (null != _0x100e29 && 0x0 != _0x100e29["length"]) {
      for (var _0x5c6524 = "", _0x48aebf = "", _0x4fca65 = 0x0; _0x4fca65 < _0x100e29["length"]; _0x4fca65++)
      _0x100e29[_0x4fca65] = _0x100e29[_0x4fca65]["substring"](0x0, 0x3) + " " + _0x100e29[_0x4fca65]["substring"](0x3, 0x7) + " " + _0x100e29[_0x4fca65]["substring"](0x7, 0xb),
      _0x48aebf = _0x48aebf + "<li class='his-li onepx' data-num='" + _0x100e29[_0x4fca65] + "'><p class='his-num'>" + _0x100e29[_0x4fca65] + "</p><img class='i-clear' src='../../images/flow/clear.png'><div class='clear'></div></li>";
      $("#rNum")["val"](_0x100e29[0x0]),
      telnum || payFlow["numLogin"] || mobileNo || (payFlow["numJY"] = payFlow["remFormatNum"](_0x100e29[0x0]),
      payFlow["getRecommend"](payFlow["numJY"]),
      payFlow["payFlow_con"](payFlow["numJY"]),
      payFlow["getProvinceTwo"](payFlow["numJY"])),
      $("#His")["html"](_0x48aebf),
      $("#His .his-li")["unbind"](),
      $("#His .his-li")["fastClick"](function (_0x100e29) {
        publicClient["showLoadPlug"](),
        _0x5c6524 = $(this)["attr"]("data-num"),
        $("#rNum")["val"](_0x5c6524),
        payFlow["clearNum"](),
        payFlow["showClear"](),
        _0x5c6524 = payFlow["remFormatNum"](_0x5c6524),
        payFlow["judgeNumLength"](_0x5c6524),
        $("#His")["removeClass"]("show")["addClass"]("hidden"),
        _0x100e29["stopPropagation"](),
        _0x100e29["preventDefault"]();
      }),
      $("#His .i-clear")["unbind"](),
      $("#His .i-clear")["fastClick"](function (_0x100e29) {
        $(this)["parent"](".his-li")["remove"](),
        window["localStorage"] && localStorage["setItem"]("hisPhone", ""),
        $("#rNum")["trigger"]("focus"),
        payFlow["showHis"](),
        _0x100e29["stopPropagation"](),
        _0x100e29["preventDefault"]();
      });
    }
  },
  "showHis": function () {
    window["setTimeout"](function () {
      void 0x0 != $("#His li")["attr"]("class") ? $("#His")["removeClass"]("hidden")["addClass"]("show") : $("#His")["removeClass"]("show")["addClass"]("hidden");
    }, 0x0);
  },
  "getNum": function (_0xdb3465, _0x2eae97) {
    var _0x39776d = $["trim"](_0xdb3465);
    return _0x39776d = _0x39776d["replace"](/[^\d]/g, "");
  },
  "formatMobile": function (_0x212c16) {
    var _0x30a4a5 = (_0x212c16 + "")["split"](""),
    _0x3a78c9 = "";
    return _0x30a4a5["forEach"](function (_0x212c16, _0x30a4a5) {
      (0x3 === _0x30a4a5 || 0x7 === _0x30a4a5) && (_0x3a78c9 += " "),
      _0x3a78c9 += _0x212c16;
    }),
    _0x3a78c9;
  },
  "onInput": function () {
    var _0x533cea = $("#rNum")["val"]();
    if (0x0 == _0x533cea["length"] ? payFlow["hiddClear"]() : payFlow["showClear"](),
    null != _0x533cea && "" != _0x533cea) {
      var _0x219f78 = payFlow["remFormatNum"](_0x533cea);
      if (/^[0-9]*$/["test"](_0x219f78))
      ;else
      {
        _0x219f78 = _0x219f78["replace"](/\D/g, "");
        var _0xefb7b = payFlow["remFormatNum"](_0x219f78);
        $("#rNum")["val"](_0xefb7b);
      }
      payFlow["judgeNumLength"](_0x219f78);
    }
  },
  "judgeNumLength": function (_0x383027) {
    if (console["log"]("judgeNumLength"),
    _0x383027 = payFlow["remFormatNum"](_0x383027),
    0xb == _0x383027["length"]) {
      $("#rNum")["trigger"]("blur"),
      payFlow["clearNum"](),
      publicClient["showLoadPlug"](),
      _0x383027 = _0x383027["substring"](0x0, 0x3) + " " + _0x383027["substring"](0x3, 0x7) + " " + _0x383027["substring"](0x7, 0xb),
      $("#rNum")["val"](_0x383027);
      var _0x14dd7d = payFlow["remFormatNum"](_0x383027);
      payFlow["getProvinceTwo"](_0x14dd7d),
      payFlow["checkNumber"](_0x14dd7d);
    } else
    $("#rBtn")["addClass"]("disable");
  },
  "unenable": function (_0x11ac80, _0x32a8f2) {
    var _0x3d55db = $("#rSupp");
    0x0 == _0x32a8f2 || "" == _0x11ac80 && (_0x11ac80 = "仅支持移动号码充值 "),
    _0x3d55db["css"]({
      "padding-left": "2px",
      "color": "#999999" }),

    _0x3d55db["html"](_0x11ac80);
  },
  "sessionCheck": function (_0x25d792) {
    /^4\d{5}$/["test"](_0x25d792["retCode"]) ? payFlow["clearCookie"]() : publicClient["sessionFailurePrompt"](_0x25d792, "知道了");
  },
  "clearCookie": function () {
    for (var _0x505c80 = document["cookie"]["split"]("; "), _0x188809 = 0x0; _0x188809 < _0x505c80["length"]; _0x188809++) {
      var _0x47df4c = _0x505c80[_0x188809]["split"]("=");
      $["cookie"](_0x47df4c[0x0], "", {
        "expires": -0x1,
        "path": "/" }),

      $["cookie"](_0x47df4c[0x0], "", {
        "expires": -0x1,
        "path": "/",
        "domain": "flow.clientaccess.10086.cn" }),

      "is_login" != _0x47df4c[0x0] && "c" != _0x47df4c[0x0] && $["cookie"](_0x47df4c[0x0], "", {
        "expires": -0x1,
        "path": "/",
        "domain": ".10086.cn" });

    }
    window["location"]["reload"]();
  },
  "getProvinceTwo": function (_0x1e23f6) {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "DA/local/getLocal",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "cellNum": _0x1e23f6 }),

      "dataType": "json",
      "timeout": 0x7530,
      "success": function (_0x1e23f6) {
        "000000" != _0x1e23f6["retCode"] ? (payFlow["unenable"]("", 0x1),
        $("#rBtn")["addClass"]("disable"),
        payFlow["sessionCheck"](_0x1e23f6)) : _0x1e23f6["rspBody"]["provinceName"] ? (payFlow["provice"] = _0x1e23f6["rspBody"]["provinceName"],
        payFlow["unenable"](payFlow["provice"] + "移动 ", 0x0),
        $("#rBtn")["removeClass"]("disable")) : (payFlow["unenable"]("", 0x1),
        $("#rBtn")["addClass"]("disable"));
      },
      "error": function (_0x1e23f6, _0x4b7e5e, _0x410f78) {
        publicClient["closeLoadPlug"](),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "huoquzhekou": function (_0x346831, _0x4cb2ba, _0x4aa32e, _0x53d9f3, _0x1f50dc) {
    var _0x576075 = "",
    _0x27b7c6 = "",
    _0x36a913 = "";
    $(_0x346831)["find"](".mon-con")["each"](function () {
      $("p", $(".mon-con"))["css"]("color", "#777777"),
      _0x36a913 = $(this)["attr"]("data-productid");
      var _0x2329fa = "",
      _0x5d60b3 = "",
      _0x47e585 = "";
      _0x2329fa = $(this)["attr"]("data-producttraffic"),
      _0x2329fa = _0x2329fa["indexOf"]("G") > -0x1 ? 0x400 * Number(_0x2329fa["substring"](0x0, _0x2329fa["indexOf"]("G"))) : Number(_0x2329fa["substring"](0x0, _0x2329fa["indexOf"]("M"))),
      cardUrl ? payFlow["cardtakbo"] ? (_0x5d60b3 = productIdUrl,
      _0x47e585 = _0x36a913) : (traficFlow = Number(traficFlow),
      _0x5d60b3 = traficFlow,
      _0x47e585 = _0x2329fa) : (_0x5d60b3 = productIdUrl,
      _0x47e585 = _0x36a913),
      _0x47e585 == _0x5d60b3 ? (_0x27b7c6 = $(this)["attr"]("data-discountcnt"),
      $(_0x346831 + "s")["addClass"]("hover")["siblings"]()["removeClass"]("hover"),
      $(_0x346831)["removeClass"]("hidden"),
      $(".mon-con")["removeClass"]("mon-sel")["addClass"]("bor-all"),
      $(".mon-con")["removeClass"]("markb"),
      $(this)["removeClass"]("bor-all")["addClass"]("mon-sel"),
      $(this)["addClass"]("markb"),
      "1" == rydtype ? $("#recommend,#month,#day,#character")["addClass"]("hidden") : "2" == rydtype ? $("#recommend,#month,#hour,#character")["addClass"]("hidden") : "3" == rydtype ? $("#recommend,#day,#hour,#character")["addClass"]("hidden") : "4" == rydtype ? $("#recommend,#month,#day,#hour")["addClass"]("hidden") : $("#month,#day,#hour,#character")["addClass"]("hidden"),
      _0x27b7c6 || ($(".ptgood")["removeClass"]("hidden"),
      $(".ptgood2")["addClass"]("hidden")),
      $(this)["hasClass"]("mon-sel") && (_0x576075 = $(this)["attr"]("data-goodsid"),
      $("p", $(this))["css"]("color", "#FF7F00")),
      payFlow["changelist"] || "999" == _0x1f50dc || payFlow["warmTip"](_0x4cb2ba, rydtype, _0x4aa32e, _0x53d9f3)) : $(this)["hasClass"]("mon-sel") && (_0x576075 = $(this)["attr"]("data-goodsid"),
      $("p", $(this))["css"]("color", "#FF7F00"));
    }),
    payFlow["cardtakbo"] ? payFlow["orderMyCardList"](payFlow["cardgoodid"], "true") : payFlow["orderMyCardList"](_0x576075, "true");
  },
  "stockList": function () {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/goods/discountListStock",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "goodsId": payFlow["goodsIdl"],
        "marketIds": payFlow["marketList"],
        "channel": payFlow["channel"] }),

      "dataType": "json",
      "timeout": 0x7530,
      "async": !0x1,
      "success": function (_0x2228dc) {
        if ("000000" == _0x2228dc["retCode"]) {
          var _0x16c52e = payFlow["marketList"]["split"](","),
          _0x5cb85b = "";
          if (_0x2228dc["rspBody"]) {
            for (var _0x554c0f = !0x0, _0x40e96a = 0x0; _0x40e96a < _0x16c52e["length"]; _0x40e96a++)
            for (var _0x89d958 = 0x0; _0x89d958 < _0x2228dc["rspBody"]["stockArr"]["length"]; _0x89d958++)
            _0x16c52e[_0x40e96a] == _0x2228dc["rspBody"]["stockArr"][_0x89d958]["marketId"] && (_0x5cb85b = _0x2228dc["rspBody"]["stockArr"][_0x89d958]["stockNum"],
            totalNum = _0x2228dc["rspBody"]["stockArr"][_0x89d958]["totalNum"],
            0x0 != _0x5cb85b && _0x554c0f ? (payFlow["stockNumtype"] = _0x5cb85b,
            payFlow["totalNumtype"] = totalNum,
            _0x554c0f = !0x1,
            $("img", $(".list")["children"]("li")["get"](_0x40e96a + 0x1))["attr"]("src", "../../images/flow/sel.png")) : $("img", $(".list")["children"]("li")["get"](_0x40e96a + 0x1))["attr"]("src", "../../images/flow/unsel.png"));
            _0x554c0f && (payFlow["stockNumtype"] = _0x2228dc["rspBody"]["stockArr"][0x0]["stockNum"],
            payFlow["totalNumtype"] = _0x2228dc["rspBody"]["stockArr"][0x0]["totalNum"],
            $("img", $(".list")["children"]("li")["get"](0x1))["attr"]("src", "../../images/flow/sel.png"));
          }
        } else
        payFlow["sessionCheck"](_0x2228dc);
        publicClient["closeLoadPlug"]();
      },
      "error": function () {
        publicClient["closeLoadPlug"](),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "marketlist2": function (_0x5c95ec, _0x239516) {
    function _0x1ac102(_0x5c95ec, _0x239516) {
      return "0" == _0x5c95ec || "" == _0x5c95ec || void 0x0 == _0x5c95ec || "undefined" == _0x5c95ec || null == _0x5c95ec ? (_0x239516 = Math["round"]((0x64 * _0x239516)["toFixed"](0x2)) / 0x64,
      _0x239516 = publicClient["floating"](_0x239516)) : "1" == _0x5c95ec ? (_0x239516 = _0x239516["toFixed"](0x3),
      _0x239516 = _0x239516["toString"](),
      _0x239516 = _0x239516["substring"](0x0, _0x239516["lastIndexOf"](".") + 0x3),
      _0x239516 = publicClient["floating"](_0x239516)) : "2" == _0x5c95ec && (_0x239516 = Math["ceil"]((0x64 * _0x239516)["toFixed"](0x2)) / 0x64),
      _0x239516;
    }
    var _0x470099 = _0x5c95ec,
    _0x49d292 = _0x5c95ec["attr"]("data-cashprice") / 0x64,
    _0x16e3fb = _0x5c95ec["attr"]("data-discountCnt"),
    _0x3a8c76 = _0x5c95ec["attr"]("data-accountrule"),
    _0x13899a = (_0x5c95ec["attr"]("data-discounttype"),
    _0x5c95ec["attr"]("data-cashprice")),
    _0x2083e0 = 0xa * _0x49d292 * (_0x16e3fb / 0x64) * 0xa / 0x64;
    _0x2083e0 = _0x1ac102(_0x3a8c76, _0x2083e0);
    for (var _0x3b9901 = _0x5c95ec["attr"]("data-goodsid"), _0x604545 = !0x1, _0x534666 = 0x0; _0x534666 < payFlow["myCardLista"]["length"]; _0x534666++)
    payFlow["myCardLista"][_0x534666]["pcardBusiRelList"][0x0]["goodsIds"]["indexOf"](_0x3b9901) > -0x1 && (_0x604545 = !0x0);
    for (var _0xc33ccd = "", _0x463372 = 0x0; _0x463372 < _0x239516["rspBody"]["goodsList"]["length"]; _0x463372++)
    for (var _0x4971dc = 0x0; _0x4971dc < _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"]["length"]; _0x4971dc++)
    if (_0x3b9901 == _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["goodsId"] && _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"])
    if (0x0 != _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"]["length"]) {
      if (cardUrl)
      _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"][0x0]["discountCnt"] ? (_0xc33ccd = _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"][0x0]["discountCnt"] / 0x64 * (_0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["cashPrice"] / 0x64),
      0x2 == _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"][0x0]["discountType"] && (_0xc33ccd = (_0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"][0x0]["discountCnt"] / 0x64)["toFixed"](0x2)["toString"]())) : _0xc33ccd = payFlow["disCountPrice"] * (_0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["cashPrice"] / 0x64),
      _0xc33ccd = _0x1ac102("", _0xc33ccd),
      console["log"](payFlow["disCountPrice"], _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["cashPrice"], _0xc33ccd, "有优惠或url携带卡券参数，档位商品的价格222");else
      {
        _0xc33ccd = _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"][0x0]["discountCnt"] / 0x64 * (_0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["cashPrice"] / 0x64);
        var _0x37c378 = _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"][0x0]["accountRule"];
        _0xc33ccd = _0x1ac102(_0x37c378, _0xc33ccd),
        0x2 == _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"][0x0]["discountType"] && (_0xc33ccd = (_0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["discount"][0x0]["discountCnt"] / 0x64)["toFixed"](0x2)["toString"]()),
        console["log"](_0xc33ccd, "有优惠或url不携带卡券参数，档位商品的价格22");
      }
      $(".noactive span", _0x470099)["text"](_0xc33ccd + "元");
    } else {
      if (cardUrl) {
        if (payFlow["firstPruductPrice"] && payFlow["numLogin"]) {
          var _0x1c37b2 = $(".mon-con")["eq"](0x0)["attr"]("data-goodsid"),
          _0x13899a = $(".mon-con")["eq"](0x0)["attr"]("data-cashprice"),
          _0x114def = "";
          firstPri = [];
          for (var _0x534666 = 0x0; _0x534666 < payFlow["myCardLista"]["length"]; _0x534666++)
          payFlow["myCardLista"][_0x534666]["pcardBusiRelList"][0x0]["goodsIds"]["indexOf"](_0x1c37b2) > -0x1 && firstPri["push"](_0x534666);
          firstPri["length"] > 0x0 && (_0x114def = _0x13899a / 0x64 * payFlow["myCardLista"][firstPri[0x0]]["pcardCash"],
          _0x114def = _0x1ac102("0", _0x114def),
          $(".mon-con")["eq"](0x0)["find"](".noactive2>span")["html"](_0x114def + "元"),
          console["log"](_0x13899a, _0x114def, "cashprice*disPrice"));
        }
        _0x3b9901 == payFlow["cardgoodsid"] ? (_0xc33ccd = payFlow["disCountPrice"] * _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["cashPrice"] / 0x64,
        _0xc33ccd = _0x1ac102("", _0xc33ccd),
        console["log"](_0xc33ccd, "无优惠并且url携带卡券参数，档位商品的价格1111")) : _0x604545 && payFlow["firstPrice"]["length"] > 0x0 ? (_0xc33ccd = payFlow["disCountPrice"] * _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["cashPrice"] / 0x64,
        0x1 != payFlow["disCountPrice"] && (_0xc33ccd = _0x1ac102("", _0xc33ccd)),
        console["log"](payFlow["disCountPrice"], _0xc33ccd, "无优惠并且url携带卡券参数，档位商品的价格2222")) : (_0xc33ccd = _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["cashPrice"] / 0x64,
        console["log"](_0xc33ccd, "无优惠并且url携带卡券参数，档位商品的价格3333"));
      } else
      _0xc33ccd = _0x239516["rspBody"]["goodsList"][_0x463372]["detailList"][_0x4971dc]["cashPrice"] / 0x64;
      console["log"](_0xc33ccd, "无优惠并且url不携带卡券参数，档位商品的价格"),
      $(".noactive2 span", _0x470099)["text"](_0xc33ccd + "元");
    }
  },
  "marketlist": function (_0x5bccc5, _0x425db0, _0x2424ea, _0x5bc27e) {
    var _0x21ae83 = "";
    "month" == _0x425db0 ? (_0x21ae83 = 0x3,
    payFlow["recomendType"] = 0x3) : "day" == _0x425db0 ? (_0x21ae83 = 0x2,
    payFlow["recomendType"] = 0x2) : "hour" == _0x425db0 ? (_0x21ae83 = 0x1,
    payFlow["recomendType"] = 0x1) : "character" == _0x425db0 ? (_0x21ae83 = 0x4,
    payFlow["recomendType"] = 0x4) : (_0x21ae83 = 0x3e7,
    payFlow["recomendType"] = 0x3e7),
    _0x5bccc5["hasClass"]("hover") && $("#" + _0x425db0 + " > ul > li > div")["each"](function (_0x5bccc5) {
      function _0x425db0(_0x5bccc5, _0x425db0) {
        return "0" == _0x5bccc5 ? (_0x425db0 = _0x425db0["toFixed"](0x3),
        _0x425db0 = Math["round"]((0x64 * _0x425db0)["toFixed"](0x2)) / 0x64,
        _0x425db0 = publicClient["floating"](_0x425db0)) : "1" == _0x5bccc5 ? (_0x425db0 = _0x425db0["toFixed"](0x3),
        _0x425db0 = _0x425db0["toString"](),
        _0x425db0 = _0x425db0["substring"](0x0, _0x425db0["lastIndexOf"](".") + 0x3),
        _0x425db0 = publicClient["floating"](_0x425db0)) : "2" == _0x5bccc5 ? (_0x425db0 = _0x425db0["toFixed"](0x3),
        _0x425db0 = Math["ceil"]((0x64 * _0x425db0)["toFixed"](0x2)) / 0x64,
        _0x425db0 = _0x425db0["toFixed"](0x2),
        _0x425db0 = publicClient["floating"](_0x425db0)) : void 0x0 != _0x5bccc5 && "undefined" != _0x5bccc5 && null != _0x5bccc5 || (_0x425db0 = _0x425db0["toFixed"](0x2),
        _0x425db0 = publicClient["floating"](_0x425db0)),
        _0x425db0;
      }
      if ($(this)["hasClass"]("mon-sel")) {
        var _0x5bc27e = $(this)["attr"]("data-discountcnt"),
        _0x28ff76 = $(this);
        $(".type") && $(".type,.cancel")["remove"](),
        _0x595e62 || (_0x595e62 = $(this)["attr"]("data-goodsid"));
        var _0x2d541c = "",
        _0x4478c2 = new Array(),
        _0x4d8ef2 = "";
        $(this)["hasClass"]("activewo") ? $("p", $(this))["css"]("color", "#ffffff") : $("p", $(this))["css"]("color", "#FF7F00");
        var _0x4e804c = $(this)["attr"]("data-futit");
        _0x4e804c["indexOf"]("【") >= 0x0 ? $(".inmeEffect")["css"]("margin-left", "-0.3rem") : $(".inmeEffect")["css"]("margin-left", "0"),
        0x3e7 == _0x21ae83 ? ($(this)["parent"]()["parent"]()["siblings"]()["find"](".recommondTitle")["text"](""),
        $(this)["parent"]()["parent"]()["prev"]()["find"](".recommondTitle")["text"](_0x4e804c)) : $(".inmeEffect")["text"](_0x4e804c);
        var _0x595e62 = ($(this)["attr"]("data-marketid"),
        $(this)["attr"]("data-goodsid")),
        _0x59d87e = $(".sj", $(this))["find"]("span")["text"]();
        if (0x3e7 != _0x21ae83) {
          for (var _0x5bccc5 = 0x0; _0x5bccc5 < _0x2424ea["rspBody"]["goodsList"]["length"]; _0x5bccc5++)
          if (_0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["productType"] == _0x21ae83)
          for (var _0x481fd0 = 0x0; _0x481fd0 < _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"]["length"]; _0x481fd0++)
          if (_0x595e62 == _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["goodsId"] && 0x0 != _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"]["length"])
          for (var _0x2a9689 = 0x0; _0x2a9689 < _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"]["length"]; _0x2a9689++) {
            _0x4d8ef2 = _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["styleType"];
            var _0x5bc27e = _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["discountCnt"],
            _0x32a4e3 = _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["cashPrice"] / 0x64 * (_0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["discountCnt"] / 0x64),
            _0x49ed31 = _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["accountRule"];
            _0x32a4e3 = _0x425db0(_0x49ed31, _0x32a4e3);
            var _0x57549d = (_0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["discountCnt"] / 0xa)["toFixed"](0x2);
            0x0 == _0x57549d["substring"](_0x57549d["lastIndexOf"](".") + 0x1) ? _0x57549d = _0x57549d["substring"](0x0, _0x57549d["lastIndexOf"](".") + 0x0) : 0x0 == _0x57549d["substring"](_0x57549d["lastIndexOf"](".") + 0x2) && (_0x57549d = _0x57549d["substring"](0x0, _0x57549d["lastIndexOf"](".") + 0x2));
            var _0x5dcca3 = "";
            _0x5dcca3 = "<li class='onepx onepxB type only' data-marketrule='" + _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["marketRule"] + "' data-discountType='" + _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["discountType"] + "' data-activebo='" + _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["activebo"] + "' data-startTime='" + _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["startTime"] + "' data-endTime='" + _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["endTime"] + "' data-isBlackAndWhiteList='" + _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["isBlackAndWhiteList"] + "' data-amount='" + _0x49ed31 + "' data-marketId='" + _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["marketId"] + "' data-style='" + _0x4d8ef2 + "' data-discountCnt='" + _0x5bc27e + "'><div class='zklic'><div class='lileft'>",
            _0x5dcca3 += "<div class='litit'>" + _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["marketName"] + "</div>",
            _0x5dcca3 += 0x1 == _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["discountType"] ? "<div class='lizk2'><div class='zkpritwo'></div><p class='ppzk2'>" + _0x57549d + "折</p></div><div class='exclusivecon2 exclusivewali hidden'></div><div class='bloclear'></div>" : "<div class='lizk'></div><div class='exclusivecon2 exclusivewali hidden'></div><div class='bloclear'></div>",
            _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["marketRule"] && (_0x5dcca3 += "<p class='liftit ellipsis'>" + _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["marketRule"] + "</p>"),
            _0x5dcca3 += 0x1 == _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["discountType"] ? "</div><div class='liprice'>" + _0x32a4e3 + "元</div>" : "</div><div class='liprice'>" + (_0x5bc27e / 0x64)["toFixed"](0x2)["toString"]() + "元</div>",
            _0x5dcca3 += "</div><img class='payType zx-unsel' src='../../images/flow/unsel.png'></li>",
            $(".list")["append"](_0x5dcca3),
            _0x2d541c = _0x2424ea["rspBody"]["goodsList"][_0x5bccc5]["detailList"][_0x481fd0]["discount"][_0x2a9689]["marketId"],
            _0x4478c2["push"](_0x2d541c);
          }
          payFlow["offerList"] = $(".list li.only")["length"],
          0x1 == payFlow["offerList"] && $(".dzkjt")["addClass"]("hidden");
        } else {
          for (var _0xe18c3d = 0x0; _0xe18c3d < _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"]["length"]; _0xe18c3d++)
          for (var _0x49553f = 0x0; _0x49553f < _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"]["length"]; _0x49553f++)
          if (_0x595e62 == _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["goodsId"] && _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"] && 0x0 != _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"]["length"])
          for (var _0x2a9689 = 0x0; _0x2a9689 < _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"]["length"]; _0x2a9689++) {
            _0x4d8ef2 = _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["styleType"];
            var _0x5bc27e = _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["discountCnt"],
            _0x32a4e3 = _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["cashPrice"] / 0x64 * (_0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["discountCnt"] / 0x64),
            _0x49ed31 = _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["accountRule"];
            _0x32a4e3 = _0x425db0(_0x49ed31, _0x32a4e3);
            var _0x57549d = (_0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["discountCnt"] / 0xa)["toFixed"](0x2);
            0x0 == _0x57549d["substring"](_0x57549d["lastIndexOf"](".") + 0x1) ? _0x57549d = _0x57549d["substring"](0x0, _0x57549d["lastIndexOf"](".") + 0x0) : 0x0 == _0x57549d["substring"](_0x57549d["lastIndexOf"](".") + 0x2) && (_0x57549d = _0x57549d["substring"](0x0, _0x57549d["lastIndexOf"](".") + 0x2));
            var _0x5dcca3 = "";
            _0x5dcca3 = "<li class='onepx onepxB type only' data-marketrule='" + _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["marketRule"] + "' data-discountType='" + _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["discountType"] + "' data-activebo='" + _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["activebo"] + "' data-startTime='" + _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["startTime"] + "' data-endTime='" + _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["endTime"] + "' data-isBlackAndWhiteList='" + _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["isBlackAndWhiteList"] + "' data-amount='" + _0x49ed31 + "' data-marketId='" + _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["marketId"] + "' data-style='" + _0x4d8ef2 + "' data-discountCnt='" + _0x5bc27e + "'><div class='zklic'><div class='lileft'>",
            _0x5dcca3 += "<div class='litit'>" + _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["marketName"] + "</div>",
            _0x5dcca3 += 0x1 == _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["discountType"] ? "<div class='lizk2'><div class='zkpritwo'></div><p class='ppzk2'>" + _0x57549d + "折</p></div><div class='exclusivecon2 exclusivewali hidden'></div><div class='bloclear'></div>" : "<div class='lizk'></div><div class='exclusivecon2 exclusivewali hidden'></div><div class='bloclear'></div>",
            _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["marketRule"] && (_0x5dcca3 += "<p class='liftit ellipsis'>" + _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["marketRule"] + "</p>"),
            _0x5dcca3 += 0x1 == _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["discountType"] ? "</div><div class='liprice'>" + _0x32a4e3 + "元</div>" : "</div><div class='liprice'>" + (_0x5bc27e / 0x64)["toFixed"](0x2)["toString"]() + "元</div>",
            _0x5dcca3 += "</div><img class='payType zx-unsel' src='../../images/flow/unsel.png'></li>",
            $(".list")["append"](_0x5dcca3),
            _0x2d541c = _0x2424ea["rspBody"]["goodsList"][0x0]["detailList"][_0xe18c3d]["goodsList"][_0x49553f]["discount"][_0x2a9689]["marketId"],
            _0x4478c2["push"](_0x2d541c);
          }
          payFlow["offerList"] = $(".list li.only")["length"],
          0x1 == payFlow["offerList"] && $(".dzkjt")["addClass"]("hidden");
        }
        var _0x19b042 = "<div class='cancel onepx onepxT'>取消</div>";
        $("#payments")["append"](_0x19b042),
        $(".type")["each"](function () {
          $(this)["unbind"](),
          $(this)["fastClick"](function () {
            payFlow["jinzhi"] = 0x1,
            $("body")["css"]({
              "position": "absolute" }),

            setTimeout(function () {
              $("#payments")["addClass"]("hidden"),
              $("#hbg")["addClass"]("hidden");
            }, 0xc8),
            $("#payments")["stop"]()["animate"]({
              "bottom": "-400px" }),

            $("img", this)["attr"]("src", "../../images/flow/sel.png")["end"]()["siblings"]()["find"]("img")["attr"]("src", "../../images/flow/unsel.png"),
            $(".payTypec")["attr"]("src", "../../images/flow/unsel.png");
            var _0x5bccc5 = $(this)["attr"]("data-style"),
            _0x5bc27e = $(this)["attr"]("data-marketrule"),
            _0x21ae83 = $(this)["attr"]("data-isBlackAndWhiteList"),
            _0x2d541c = $(this)["attr"]("data-discountCnt");
            payFlow["discountzk"] = _0x2d541c;
            var _0x4478c2 = $(this)["attr"]("data-marketId");
            payFlow["marketIdx"] = _0x4478c2;
            var _0x4d8ef2 = $(this)["attr"]("data-amount"),
            _0x4e804c = $(this)["attr"]("data-startTime"),
            _0x481fd0 = $(this)["attr"]("data-endTime"),
            _0x2a9689 = $(this)["attr"]("data-discountType");
            0x1 == _0x5bccc5 ? ($(".ptgood,.dis,.disthree,.cardshow,.zkenter")["addClass"]("hidden"),
            $(".discount,.cardwenter")["removeClass"]("hidden"),
            payFlow["card_style"] = 0x1) : 0x2 == _0x5bccc5 ? (_0x5bc27e ? $(".discb")["removeClass"]("hidden") : $(".discb")["addClass"]("hidden"),
            $(".ptgood,.discount,.disthree,.cardshow,.zkenter")["addClass"]("hidden"),
            $(".dis,.cardwenter")["removeClass"]("hidden"),
            $(".act-content")["text"]("")["append"]("<img src='../../images/flow/cloth.png' alt=''>" + _0x5bc27e),
            payFlow["card_style"] = 0x2) : 0x3 == _0x5bccc5 && (_0x4e804c = _0x4e804c["substring"](0x5, 0xa),
            _0x481fd0 = _0x481fd0["substring"](0x5, 0xa),
            _0x5bc27e ? $(".threecon")["removeClass"]("hidden") : $(".threecon")["addClass"]("hidden"),
            $(".zkthre span")["text"]("")["text"](_0x4e804c + "至" + _0x481fd0),
            $(".ptgood,.discount,.dis,.cardshow,.zkenter")["addClass"]("hidden"),
            $(".disthree,.cardwenter")["removeClass"]("hidden"),
            $(".threecon")["text"]("")["text"](_0x5bc27e),
            payFlow["card_style"] = 0x3),
            _0x21ae83 && 0x0 != _0x21ae83 ? $(".exclusivewa")["removeClass"]("hidden") : $(".exclusivewa")["addClass"]("hidden");
            var _0x32a4e3 = _0x59d87e["indexOf"]("元"),
            _0x49ed31 = _0x59d87e["substring"](0x0, _0x32a4e3),
            _0x57549d = _0x49ed31 * (_0x2d541c / 0x64);
            _0x49ed31 = publicClient["floating"](_0x49ed31),
            _0x57549d = _0x425db0(_0x4d8ef2, _0x57549d),
            _0x2d541c = (_0x2d541c / 0xa)["toFixed"](0x2),
            0x0 == _0x2d541c["substring"](_0x2d541c["lastIndexOf"](".") + 0x1) ? _0x2d541c = _0x2d541c["substring"](0x0, _0x2d541c["lastIndexOf"](".") + 0x0) : 0x0 == _0x2d541c["substring"](_0x2d541c["lastIndexOf"](".") + 0x2) && (_0x2d541c = _0x2d541c["substring"](0x0, _0x2d541c["lastIndexOf"](".") + 0x2)),
            $(".zkq2")["text"]("原价：" + _0x49ed31 + "元"),
            0x2 == _0x2a9689 ? (payFlow["orderpric"] = parseFloat(payFlow["discountzk"]),
            $(".noactive span", $(this))["text"]((payFlow["discountzk"] / 0x64)["toFixed"](0x2)["toString"]() + "元")) : (payFlow["orderpric"] = 0x64 * _0x57549d,
            payFlow["orderpric"] = payFlow["orderpric"]["toFixed"](0x0),
            $(".noactive span", $(this))["text"](_0x57549d + "元"));
            var _0x5dcca3 = "false";
            payFlow["stockBuss"](_0x595e62, _0x4478c2, _0x2424ea, _0x5dcca3, _0x28ff76);
          });
        }),
        payFlow["marketList"] = _0x4478c2["join"](","),
        payFlow["goodsIdl"] = _0x595e62,
        $(this)["attr"]("data-discountCnt") ? payFlow["stockList"]() : payFlow["card_style"] = "",
        $(".type")["each"](function (_0x5bccc5) {
          function _0x5bc27e(_0x5bccc5, _0x425db0) {
            _0x4478c2 = _0x5bccc5["attr"]("data-style"),
            _0x4d8ef2 = _0x5bccc5["attr"]("data-marketrule"),
            _0x4e804c = _0x5bccc5["attr"]("data-discountCnt"),
            payFlow["discountzk"] = _0x4e804c,
            _0x595e62 = _0x5bccc5["attr"]("data-marketId"),
            payFlow["marketIdx"] = _0x595e62,
            _0x481fd0 = _0x5bccc5["attr"]("data-amount");
            var _0x2424ea = _0x5bccc5["attr"]("data-isBlackAndWhiteList");
            return _0x5dcca3 = _0x5bccc5["attr"]("data-discountType"),
            _0x2424ea && 0x0 != _0x2424ea ? $(".exclusivewa")["removeClass"]("hidden") : $(".exclusivewa")["addClass"]("hidden"),
            0x1 == _0x4478c2 ? (cardUrl ? payFlow["myCardList_usable"] ? ($("img", $(".type"))["attr"]("src", "../../images/flow/unsel.png"),
            $(".cardshow")["removeClass"]("hidden"),
            $(".ptgood,.dis,.discount,.disthree,.cardwenter")["addClass"]("hidden")) : ($(".discount,.cardwenter")["removeClass"]("hidden"),
            $(".zkenter,.ptgood,.dis,.disthree")["addClass"]("hidden")) : ($(".ptgood,.dis,.disthree,.cardshow,.zkenter")["addClass"]("hidden"),
            $(".discount,.cardwenter")["removeClass"]("hidden"),
            0x3e7 == _0x21ae83 ? ($(".discount .inmeEffect")["addClass"]("hidden"),
            $(".flwx .zkstconl")["css"]({
              "display": "flex",
              "flex-direction": "column",
              "justify-content": "center" })) : (
            $(".discount .inmeEffect")["removeClass"]("hidden"),
            $(".flwx .zkstconl")["css"]({
              "display": "inline" }))),

            payFlow["card_style"] = 0x1,
            _0x2d541c(_0x425db0),
            !0x1) : 0x2 == _0x4478c2 ? (cardUrl ? payFlow["myCardList_usable"] ? ($("img", $(".type"))["attr"]("src", "../../images/flow/unsel.png"),
            $(".cardshow")["removeClass"]("hidden"),
            $(".ptgood,.discount,.dis,.disthree,.cardwenter")["addClass"]("hidden")) : ($(".dis,.cardwenter")["removeClass"]("hidden"),
            $(".zkenter,.ptgood,.discount,.disthree")["addClass"]("hidden")) : (_0x4d8ef2 ? $(".discb")["removeClass"]("hidden") : $(".discb")["addClass"]("hidden"),
            $(".ptgood,.discount,.disthree,.cardshow,.zkenter")["addClass"]("hidden"),
            $(".dis,.cardwenter")["removeClass"]("hidden"),
            $(".act-content")["text"]("")["append"]("<img src='../../images/flow/cloth.png' alt=''>" + _0x4d8ef2)),
            payFlow["card_style"] = 0x2,
            _0x2d541c(_0x425db0),
            !0x1) : 0x3 == _0x4478c2 ? (cardUrl ? payFlow["myCardList_usable"] ? ($("img", $(".type"))["attr"]("src", "../../images/flow/unsel.png"),
            $(".cardshow")["removeClass"]("hidden"),
            $(".ptgood,.discount,.dis,.disthree,.cardwenter")["addClass"]("hidden")) : ($(".disthree,.cardwenter")["removeClass"]("hidden"),
            $(".zkenter,.ptgood,.discount,.disthree")["addClass"]("hidden")) : (_0x32a4e3 = _0x32a4e3["substring"](0x5, 0xa),
            _0x49ed31 = _0x49ed31["substring"](0x5, 0xa),
            $(".zkthre span")["text"]("")["text"](_0x32a4e3 + "至" + _0x49ed31),
            _0x4d8ef2 ? $(".threecon")["removeClass"]("hidden") : $(".threecon")["addClass"]("hidden"),
            $(".ptgood,.discount,.disthree,.cardshow,.zkenter")["addClass"]("hidden"),
            $(".disthree,.cardwenter")["removeClass"]("hidden"),
            $(".threecon")["text"]("")["text"](_0x4d8ef2)),
            payFlow["card_style"] = 0x3,
            _0x2d541c(_0x425db0),
            !0x1) : void 0x0;
          }
          function _0x2d541c(_0x5bccc5) {
            var _0x5bc27e = (_0x59d87e["indexOf"]("元"),
            _0x5bccc5["attr"]("data-cashprice") / 0x64),
            _0x21ae83 = _0x5bc27e * (_0x4e804c / 0x64);
            if (_0x21ae83 = _0x425db0(_0x481fd0, _0x21ae83),
            _0x4e804c = (_0x4e804c / 0xa)["toFixed"](0x2),
            0x0 == _0x4e804c["substring"](_0x4e804c["lastIndexOf"](".") + 0x1) ? _0x4e804c = _0x4e804c["substring"](0x0, _0x4e804c["lastIndexOf"](".") + 0x0) : 0x0 == _0x4e804c["substring"](_0x4e804c["lastIndexOf"](".") + 0x2) && (_0x4e804c = _0x4e804c["substring"](0x0, _0x4e804c["lastIndexOf"](".") + 0x2)),
            $(".zkq2")["text"]("原价：" + _0x5bc27e + "元"),
            0x2 == _0x5dcca3 ? (payFlow["orderpric"] = parseFloat(payFlow["discountzk"]),
            $(".noactive span", _0x5bccc5)["text"]((payFlow["discountzk"] / 0x64)["toFixed"](0x2)["toString"]() + "元")) : (payFlow["orderpric"] = 0x64 * _0x21ae83,
            payFlow["orderpric"] = payFlow["orderpric"]["toFixed"](0x0),
            _0x21ae83 = _0x5bc27e * payFlow["disCountPrice"]),
            cardUrl && !$(".cardshow")["hasClass"]("hidden")) {
              if (!payFlow["disCountPrice"]) {
                var _0x28ff76 = $(".mon-con")["eq"](0x0)["attr"]("data-goodsid");
                payFlow["firstPrice"] = [];
                for (var _0x2d541c = 0x0; _0x2d541c < payFlow["myCardLista"]["length"]; _0x2d541c++)
                payFlow["myCardLista"][_0x2d541c]["pcardBusiRelList"][0x0]["goodsIds"]["indexOf"](_0x28ff76) > -0x1 && payFlow["firstPrice"]["push"](_0x2d541c);
                payFlow["firstPrice"]["length"] > 0x0 && (payFlow["disCountPrice"] = payFlow["myCardLista"][payFlow["firstPrice"][0x0]]["pcardCash"]);
              }
              _0x21ae83 = payFlow["disCountPrice"] ? _0x5bc27e * payFlow["disCountPrice"] : _0x5bc27e,
              payFlow["disCountPrice"] && (_0x21ae83 = _0x425db0("0", _0x21ae83)),
              console["log"](_0x5bc27e, payFlow["disCountPrice"], _0x21ae83, "zk"),
              $(".noactive span", _0x5bccc5)["text"](_0x21ae83 + "元");
            }
            payFlow["totalNumtype"] == -0x1 ? ($(".totalNums")["addClass"]("hidden"),
            $(".stockNum")["text"]("充足"),
            payFlow["activestock"]("false", "true", _0x2424ea, _0x5bccc5)) : (payFlow["stockNumtype"] > 0x2710 ? $(".stockNum")["text"]("充足") : $(".stockNum")["text"]("紧张"),
            payFlow["stockNumtype"] > 0x0 ? payFlow["activestock"]("false", "true", _0x2424ea, _0x5bccc5) : payFlow["activestock"]("false", "false", _0x2424ea, _0x5bccc5));
          }
          var _0x4478c2 = "",
          _0x4d8ef2 = "",
          _0x4e804c = "",
          _0x595e62 = "",
          _0x481fd0 = "",
          _0x2a9689 = $(this)["attr"]("data-isBlackAndWhiteList"),
          _0x32a4e3 = $(this)["attr"]("data-startTime"),
          _0x49ed31 = $(this)["attr"]("data-endTime"),
          _0x57549d = $(this)["attr"]("data-activebo"),
          _0x5dcca3 = "";
          if ("true" == _0x57549d && $(".lizk", $(this))["addClass"]("hidden"),
          _0x2a9689 && 0x0 != _0x2a9689 ? ($(".exclusivewali", $(this))["removeClass"]("hidden"),
          $(".litit", $(this))["text"]()["length"] >= 0x6 && $(".litit", $(this))["addClass"]("ellipsis")["css"]("width", "4.8rem")) : ($(".exclusivewali", $(this))["addClass"]("hidden"),
          $(".litit", $(this))["removeClass"]("ellipsis")["css"]("width", "auto")),
          marketIdUrl) {
            if (_0x595e62 = $(this)["attr"]("data-marketId"),
            _0x595e62 == marketIdUrl) {
              if ($("img", $(".list")["children"]("li"))["attr"]("src", "../../images/flow/unsel.png"),
              $("img", $(".list")["children"]("li")["get"](_0x5bccc5 + 0x1))["attr"]("src", "../../images/flow/sel.png"),
              "../../images/flow/sel.png" == $("img", $(this))["attr"]("src")) {
                var _0xe18c3d = $(this);
                _0x5bc27e(_0xe18c3d, _0x28ff76);
              }
            } else if ("../../images/flow/sel.png" == $("img", $(this))["attr"]("src")) {
              var _0xe18c3d = $(this);
              _0x5bc27e(_0xe18c3d, _0x28ff76);
            }
          } else if ("../../images/flow/sel.png" == $("img", $(this))["attr"]("src")) {
            var _0xe18c3d = $(this);
            _0x5bc27e(_0xe18c3d, _0x28ff76);
          }
        }),
        "" == payFlow["card_style"] ? $(".zkenter")["addClass"]("hidden") : $(".zkcount")["text"]($(".type")["length"]),
        $("#payments")["hasClass"]("hidden") || $("#hbg")["removeClass"]("hidden");
      }
    });
  },
  "activityList": function (_0x324b1a, _0x325abe) {
    payFlow["marketlist"]($("#months"), "month", _0x324b1a, _0x325abe),
    payFlow["marketlist"]($("#days"), "day", _0x324b1a, _0x325abe),
    payFlow["marketlist"]($("#hours"), "hour", _0x324b1a, _0x325abe),
    payFlow["marketlist"]($("#characters"), "character", _0x324b1a, _0x325abe),
    payFlow["marketlist"]($("#recommends"), "recommend", _0x324b1a, _0x325abe);
  },
  "getgoodsData": function (_0x3c8192) {
    payFlow["goodsData"]["goodsId"] = [],
    payFlow["goodsData"]["productType"] = [],
    payFlow["goodsData"]["productId"] = [];
    for (var _0x18aead = 0x0; _0x18aead < _0x3c8192["rspBody"]["goodsList"]["length"]; _0x18aead++)
    if ("999" != _0x3c8192["rspBody"]["goodsList"][_0x18aead]["productType"])
    for (var _0x5a3896 = 0x0; _0x5a3896 < _0x3c8192["rspBody"]["goodsList"][_0x18aead]["detailList"]["length"]; _0x5a3896++)
    payFlow["goodsData"]["goodsId"]["push"](_0x3c8192["rspBody"]["goodsList"][_0x18aead]["detailList"][_0x5a3896]["goodsId"]),
    payFlow["goodsData"]["productType"]["push"](_0x3c8192["rspBody"]["goodsList"][_0x18aead]["detailList"][_0x5a3896]["productType"]),
    payFlow["goodsData"]["productId"]["push"](_0x3c8192["rspBody"]["goodsList"][_0x18aead]["detailList"][_0x5a3896]["productId"]);else

    for (var _0x5a3896 = 0x0; _0x5a3896 < _0x3c8192["rspBody"]["goodsList"][_0x18aead]["detailList"]["length"]; _0x5a3896++)
    for (var _0x2eb6f0 = 0x0; _0x2eb6f0 < _0x3c8192["rspBody"]["goodsList"][_0x18aead]["detailList"][_0x5a3896]["goodsList"]["length"]; _0x2eb6f0++)
    payFlow["goodsData"]["goodsId"]["push"](_0x3c8192["rspBody"]["goodsList"][_0x18aead]["detailList"][_0x5a3896]["goodsList"][_0x2eb6f0]["goodsId"]),
    payFlow["goodsData"]["productType"]["push"](_0x3c8192["rspBody"]["goodsList"][_0x18aead]["detailList"][_0x5a3896]["goodsList"][_0x2eb6f0]["productType"]),
    payFlow["goodsData"]["productId"]["push"](_0x3c8192["rspBody"]["goodsList"][_0x18aead]["detailList"][_0x5a3896]["goodsList"][_0x2eb6f0]["productId"]);
  },
  "payFlowCallback": function (_0x23fff3, _0x5002c3, _0x4111f5, _0x365f33) {
    function _0x3803a5() {
      var _0x3803a5 = document["getElementById"]("tpl")["innerHTML"];
      juicer["register"]("judge", payFlow["judge"]),
      juicer["register"]("chartgoodsName", payFlow["chartgoodsName"]);
      var _0x4ebcb7 = juicer(_0x3803a5, _0x23fff3["rspBody"]);
      if ($("#conn") && $("#conn")["remove"](),
      $("#conn_ta")["append"](_0x4ebcb7),
      $("#recommend,#month,#day,#hour,#character")["find"](".mon-con")["each"](function () {
        var _0x5002c3 = $(this)["attr"]("data-cashprice");
        _0x5002c3 /= 0x64,
        $(".sj>span", $(this))["text"](_0x5002c3 + "元"),
        payFlow["marketlist2"]($(this), _0x23fff3);
      }),
      _0x5002c3 || _0x4111f5 && _0x365f33) {
        payFlow["init"](_0x5002c3, _0x4111f5, _0x365f33, _0x23fff3),
        "请输入手机号码" == $("#rNum")["val"]() ? $("#rBtn")["addClass"]("disable") : $("#rBtn")["removeClass"]("disable"),
        payFlow["showPrice"]($("#recommends"), "recommend", _0x23fff3),
        payFlow["showPrice"]($("#months"), "month", _0x23fff3),
        payFlow["showPrice"]($("#days"), "day", _0x23fff3),
        payFlow["showPrice"]($("#hours"), "hour", _0x23fff3),
        payFlow["showPrice"]($("#characters"), "character", _0x23fff3);
        for (var _0x52455d = 0x0; _0x52455d < _0x23fff3["rspBody"]["goodsList"]["length"]; _0x52455d++)
        for (var _0x5b10dc = 0x0; _0x5b10dc < _0x23fff3["rspBody"]["goodsList"][_0x52455d]["detailList"]["length"]; _0x5b10dc++)
        if (_0x23fff3["rspBody"]["goodsList"][_0x52455d]["detailList"][_0x5b10dc]["productId"] == payFlow["activeproductid"]) {
          var _0x1329c6 = _0x23fff3["rspBody"]["goodsList"][_0x52455d]["detailList"][_0x5b10dc]["productType"],
          _0x4a9450 = "";
          _0x4a9450 = 0x3 == _0x1329c6 ? "month" : 0x2 == _0x1329c6 ? "day" : 0x1 == _0x1329c6 ? "hour" : 0x4 == _0x1329c6 ? "character" : "recommend",
          $("#" + _0x4a9450 + " > ul > li > div")["each"](function (_0x23fff3) {
            if ($(this)["attr"]("data-productid") == payFlow["activeproductid"]) {
              var _0x5002c3 = $(this)["attr"]("data-soldout");
              $(this)["addClass"]("activewo"),
              0x1 == _0x5002c3 ? (payFlow["actselloutbo"] = !0x0,
              $("p", $(this))["css"]("color", "#bbbbbb"),
              $(this)["css"]("border", "1px solid #f6f6f6"),
              $(this)["removeClass"]("markb"),
              $(this)["removeClass"]("markb2"),
              $("<img class='zkz zk ' src='../../images/flow/qiang2_03.png' />")["appendTo"]($("#" + _0x4a9450 + " div")["eq"](_0x23fff3)),
              $("#" + _0x4a9450 + " div")["eq"](_0x23fff3)["css"]({
                "background-color": "#f6f6f6" })) : (
              payFlow["actselloutbo"] = !0x1,
              $(this)["removeClass"]("markb"),
              0x0 == _0x23fff3 ? $(this)["addClass"]("markb2") : $(this)["removeClass"]("markb2"),
              $("p", $(this))["css"]("color", "#ffffff"),
              $(this)["css"]("border", "1px solid #ff8700"),
              $("<img class='zkz zk ' src='../../images/flow/qiang3_03.png' />")["appendTo"]($("#" + _0x4a9450 + " div")["eq"](_0x23fff3)),
              $("#" + _0x4a9450 + " div")["eq"](_0x23fff3)["css"]({
                "background-color": "#ff8700" }));

            }
          });
        }
        var _0x1329c6 = "";
        $("#months")["hasClass"]("hover") ? _0x1329c6 = "3" : $("#days")["hasClass"]("hover") ? _0x1329c6 = "2" : $("#hours")["hasClass"]("hover") ? _0x1329c6 = "1" : $("#characters")["hasClass"]("hover") ? _0x1329c6 = "4" : $("#recommends")["hasClass"]("hover") && (_0x1329c6 = "999");
        var _0x33dc4b = "",
        _0x1315c0 = "";
        _0x1315c0 = cardUrl ? payFlow["cardtakbo"] ? productIdUrl : traficFlow : productIdUrl,
        _0x1315c0 && rydtype || cardUrl && payFlow["cardtakbo"] ? (_0x33dc4b = $(".paySwitch ul li")["attr"]("data-producttypes"),
        0x1 == _0x33dc4b["length"] ? ($("#paySwitchc")["addClass"]("hidden"),
        _0x33dc4b != rydtype ? payFlow["changelist"] || "999" == _0x1329c6 || payFlow["warmTip"](_0x5002c3, _0x33dc4b, _0x4111f5, _0x365f33) : "2" == rydtype ? payFlow["huoquzhekou"]("#day", _0x5002c3, _0x4111f5, _0x365f33, "2") : "3" == rydtype ? payFlow["huoquzhekou"]("#month", _0x5002c3, _0x4111f5, _0x365f33, "3") : "1" == rydtype ? payFlow["huoquzhekou"]("#hour", _0x5002c3, _0x4111f5, _0x365f33, "1") : "4" == rydtype ? payFlow["huoquzhekou"]("#character", _0x5002c3, _0x4111f5, _0x365f33, "4") : payFlow["huoquzhekou"]("#recommend", _0x5002c3, _0x4111f5, _0x365f33, "999")) : ($(".mon-table")["removeClass"]("onepxT"),
        _0x33dc4b["indexOf"](rydtype) > -0x1 && ("2" == rydtype ? payFlow["huoquzhekou"]("#day", _0x5002c3, _0x4111f5, _0x365f33, "2") : "3" == rydtype ? payFlow["huoquzhekou"]("#month", _0x5002c3, _0x4111f5, _0x365f33, "3") : "1" == rydtype ? payFlow["huoquzhekou"]("#hour", _0x5002c3, _0x4111f5, _0x365f33, "1") : "4" == rydtype ? payFlow["huoquzhekou"]("#character", _0x5002c3, _0x4111f5, _0x365f33, "4") : payFlow["huoquzhekou"]("#recommend", _0x5002c3, _0x4111f5, _0x365f33, "999")))) : payFlow["changelist"] || "999" == _0x1329c6 || payFlow["warmTip"](_0x5002c3, _0x1329c6, _0x4111f5, _0x365f33),
        console["log"](_0x23fff3, "添加之后的商品列表"),
        payFlow["activityList"](_0x23fff3);
      } else {
        $("#months")["addClass"]("hover"),
        $("#rBtn")["addClass"]("disable"),
        $(".mon-con")["removeClass"]("mon-sel")["addClass"]("bor-all"),
        $(".mon-con")["removeClass"]("markb");
        var _0x4ebcb7 = "1、中国移动各品牌实名制用户购买的流量均为国内2/3/4G全网通用流量，流量到账后立即生效，流量资源一次性充入用户账户，用户不得取消，无法办理退款；<br/>";
        _0x4ebcb7 += "2、流量直充产品所含流量资源当月有效，月底清零；<br/>",
        _0x4ebcb7 += "3、可重复购买，同时购买多个流量直充产品时叠加生效;<br/>",
        _0x4ebcb7 += "4、购买的流量不可多终端共享，不可转赠至其他移动用户。",
        $("#warm_con")["html"](_0x4ebcb7),
        $(".paySwitch ul li")["unbind"](),
        $(".paySwitch ul li")["fastClick"](function (_0x23fff3) {
          if ($(this)["addClass"]("hover")["siblings"]()["removeClass"]("hover"),
          $(".mon-table")["css"]("display", "none"),
          $(".mon-table")["eq"]($(".paySwitch ul li")["index"](this))["fadeIn"]("800")["css"]("display", "block"),
          $("#months")["hasClass"]("hover")) {
            var _0x5002c3 = "1、中国移动各品牌实名制用户购买的流量均为国内2/3/4G全网通用流量，流量到账后立即生效，流量资源一次性充入用户账户，用户不得取消，无法办理退款；<br/>";
            _0x5002c3 += "2、流量直充产品所含流量资源当月有效，月底清零；<br/>",
            _0x5002c3 += "3、可重复购买，同时购买多个流量直充产品时叠加生效;<br/>",
            _0x5002c3 += "4、购买的流量不可多终端共享，不可转赠至其他移动用户。",
            $("#warm_con")["html"](_0x5002c3);
          } else if ($("#days")["hasClass"]("hover")) {
            var _0x5002c3 = "1、 中国移动各品牌实名制用户购买的流量均为国内2/3/4G全网通用流量，流量到账后立即生效；<br/>";
            _0x5002c3 += "2、费用一次性收取，流量资源一次性提供给客户。流量自生效时刻起24小时内有效，流量使用完毕或时间到达后均失效。流量资源一次性充入用户账户，用户不得取消，无法办理退款；<br/>",
            _0x5002c3 += "3、可重复订购，同时订购多个时叠加生效，每个流量直充日包独立核算起止时间;<br/>",
            _0x5002c3 += "4、购买的流量不可多终端共享，不可转赠至其他移动用户。",
            $("#warm_con")["html"](_0x5002c3);
          }
        });
      }
    }
    if (0x0 == _0x23fff3["rspBody"]["totalSize"])
    $("#conn") && $("#conn")["remove"](),
    $("#listkk")["removeClass"]("hidden"),
    $("#liuBtn,#listk,#warmcld,#warm_con,#triangle,.warm-ct")["addClass"]("hidden"),
    $("#rBtn,.btnBack")["addClass"]("hidden");else
    {
      if (console["log"](payFlow["recommendData"], "payFlow.recommendData"),
      payFlow["recommendData"]["floorSize"] > 0x0 && payFlow["recommendData"]["floorList"]["length"] >= 0x1 && (_0x23fff3["rspBody"]["productTypes"] = "999," + _0x23fff3["rspBody"]["productTypes"],
      payFlow["recommendData"] = {
        "productType": "999",
        "detailList": payFlow["recommendData"]["floorList"]["sort"](payFlow["compare"]("sortNo")) },

      _0x23fff3["rspBody"]["goodsList"]["unshift"](payFlow["recommendData"])),
      $(".overseas")["removeClass"]("hidden"),
      cardUrl && payFlow["goodsids"]["length"] > 0x0) {
        payFlow["getgoodsData"](_0x23fff3);
        for (var _0x490d11 = !0x0, _0x5f2df3 = !0x1, _0x54d67b = 0x0; _0x54d67b < payFlow["myCardLista"]["length"]; _0x54d67b++)
        if (payFlow["myCardLista"][_0x54d67b]["pcardBusiRelList"] && payFlow["myCardLista"][_0x54d67b]["pcardBusiRelList"]["length"] > 0x0)
        for (var _0x34788c = payFlow["myCardLista"][_0x54d67b]["pcardPasswd"], _0x39c32e = 0x0; _0x39c32e < payFlow["myCardLista"][_0x54d67b]["pcardBusiRelList"]["length"]; _0x39c32e++)
        for (var _0x9e61bf = payFlow["myCardLista"][_0x54d67b]["pcardBusiRelList"][_0x39c32e]["publishChannel"]["split"](","), _0x1cbf1f = 0x0; _0x1cbf1f < _0x9e61bf["length"]; _0x1cbf1f++)
        "0705" == _0x9e61bf[_0x1cbf1f] && cardUrl == _0x34788c && (_0x5f2df3 = !0x0);
        for (var _0x5c670a = 0x0; _0x5c670a < payFlow["goodsids"]["length"]; _0x5c670a++)
        for (var _0x42f608 = 0x0; _0x42f608 < payFlow["goodsData"]["goodsId"]["length"]; _0x42f608++)
        payFlow["goodsids"][_0x5c670a] == payFlow["goodsData"]["goodsId"][_0x42f608] && _0x490d11 && _0x5f2df3 && (payFlow["cardgoodsid"] = payFlow["goodsData"]["goodsId"][_0x42f608],
        _0x490d11 = !0x1,
        payFlow["cardgoodid"] = payFlow["goodsData"]["goodsId"][_0x42f608],
        rydtype = payFlow["goodsData"]["productType"][_0x42f608],
        productIdUrl = payFlow["goodsData"]["productId"][_0x42f608],
        payFlow["cardtakbo"] = !0x0,
        _0x3803a5());
        _0x490d11 && (_0x490d11 = !0x1,
        _0x3803a5());
      } else
      _0x3803a5();
      for (var _0x54d67b = 0x0; _0x54d67b < _0x23fff3["rspBody"]["goodsList"]["length"]; _0x54d67b++)
      if ("4" == _0x23fff3["rspBody"]["goodsList"][_0x54d67b]["productType"] && _0x23fff3["rspBody"]["goodsList"][_0x54d67b]["detailList"]["length"] > 0x6) {
        var _0xe86bcd = "";
        _0xe86bcd = $("#character ul li")["eq"](0x5)["html"](),
        $("#character ul li")["eq"](0x5)["html"]("")["html"]("更多")["css"]({
          "fontSize": "0.62533rem",
          "color": "#666666",
          "border": "1px solid #e9e9e9",
          "borderRadius": "0.128rem",
          "height": "2.15rem",
          "lineHeight": "2.15rem",
          "padding": "0.855333rem 0 !important" }),

        $("#character ul li")["eq"](0x5)["nextAll"]()["hide"](),
        $("#character ul li")["eq"](0x5)["unbind"](),
        $("#character ul li")["eq"](0x5)["fastClick"](function (_0x5002c3) {
          $("#character ul li")["eq"](0x5)["nextAll"]()["fadeIn"](),
          $("#character ul li")["eq"](0x5)["html"](_0xe86bcd)["css"]({
            "border": "none",
            "borderRadius": "none",
            "height": "auto",
            "lineHeight": "0.838rem",
            "padding": "0" }),

          $("#character ul li")["eq"](0x5)["find"](".mon-con")["fastClick"](function (_0x5002c3) {
            var _0x4111f5 = $(this)["attr"]("data-discountCnt");
            _0x4111f5 && publicClient["showLoadPlug"](),
            payFlow["cardtakbo"] = !0x1;
            var _0x365f33 = $(this)["attr"]("data-fuid"),
            _0x3803a5 = $(this)["attr"]("data-goodsid"),
            _0x4111f5 = $(this)["attr"]("data-discountcnt"),
            _0x490d11 = $(this)["attr"]("data-futit");
            $(".inmeEffect")["text"](_0x490d11),
            $(".sp", $(".mon-con")["not"](".activewo"))["css"]("color", "#666666"),
            $(".sj", $(".mon-con")["not"](".activewo"))["css"]("color", "#999999"),
            $(".mon-con", $("#" + _0x365f33))["removeClass"]("mon-sel")["addClass"]("bor-all"),
            $(this)["removeClass"]("bor-all")["addClass"]("mon-sel"),
            $(".mon-con", $("#" + _0x365f33))["removeClass"]("markb"),
            $(this)["addClass"]("markb"),
            $(".mon-con", $("#" + _0x365f33))["removeClass"]("zkb"),
            $("p", $(this))["css"]("color", "#FF7F00"),
            $(".dis,.discount,.disthree")["addClass"]("hidden"),
            _0x4111f5 || ($(".ptgood")["removeClass"]("hidden"),
            cardUrl || ($(".zkenter")["addClass"]("hidden"),
            $(".cardwenter")["removeClass"]("hidden"))),
            payFlow["orderMyCardList"](_0x3803a5, "false"),
            setTimeout(function () {
              payFlow["activityList"](_0x23fff3, _0x3803a5);
            }, 0x1e);
          });
        });
      }
    }
  },
  "seventhree": function (_0x1c8baf) {
    $("#reqInit")["addClass"]("hiddens"),
    $("html,body")["css"]("position", "relative"),
    $("#rBtn,.btnBack")["removeClass"]("hidden"),
    $("#conn") && $("#conn")["remove"](),
    $("#listk")["removeClass"]("hidden"),
    $("#prosj")["html"](_0x1c8baf),
    $("#listkk,#liuBtn,#warmcld,#warm_con,#triangle,.warm-ct")["addClass"]("hidden"),
    $("#rBtn,.btnBack")["addClass"]("hidden");
  },
  "sevenfour": function (_0xbc32ba) {
    $("#reqInit")["addClass"]("hiddens"),
    $("html,body")["css"]("position", "relative"),
    $("#rBtn,.btnBack")["removeClass"]("hidden"),
    $("#conn") && $("#conn")["remove"](),
    $("#listk")["removeClass"]("hidden"),
    $("#listkk,#liuBtn,#warmcld,#warm_con,#triangle,.warm-ct")["addClass"]("hidden"),
    $("#rBtn,.btnBack")["addClass"]("hidden");
  },
  "payFlow_con": function (_0x38c279, _0x680563, _0x3253fe) {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/goods/goodslist",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "provinceCode": _0x680563 ? _0x680563 : "",
        "cityCode": _0x3253fe ? _0x3253fe : "",
        "chargeCell": _0x38c279 ? _0x38c279 : "",
        "payWay": "1",
        "channel": payFlow["channel"] }),

      "dataType": "json",
      "timeout": 0x7530,
      "success": function (_0x32b79f) {
        if (0x1 == payFlow["loginS"] && $("#login_tc")["removeClass"]("hidden"),
        $("#reqInit")["addClass"]("hiddens"),
        $("html,body")["css"]("position", "relative"),
        $("#rBtn,.btnBack")["removeClass"]("hidden"),
        "000000" == _0x32b79f["retCode"]) {
          if (_0x32b79f["rspBody"]) {
            publicClient["closeLoadPlug"](),
            payFlow["getOperationAdv"](_0x38c279, _0x680563, _0x3253fe);
            for (var _0x4950cd = 0x0; _0x4950cd < _0x32b79f["rspBody"]["goodsList"]["length"]; _0x4950cd++)
            0x2 == _0x32b79f["rspBody"]["goodsList"][_0x4950cd]["productType"] && _0x32b79f["rspBody"]["goodsList"][_0x4950cd]["detailList"]["push"](payFlow["dayprice"]);
            for (var _0x4950cd = 0x0; _0x4950cd < _0x32b79f["rspBody"]["goodsList"]["length"]; _0x4950cd++)
            for (var _0xbfde09 = 0x0; _0xbfde09 < _0x32b79f["rspBody"]["goodsList"][_0x4950cd]["detailList"]["length"]; _0xbfde09++)
            if (_0x32b79f["rspBody"]["goodsList"][_0x4950cd]["detailList"][_0xbfde09]["productId"] == payFlow["activeproductid"])
            for (var _0x42fa0f = 0x0; _0x42fa0f < _0x32b79f["rspBody"]["goodsList"][_0x4950cd]["detailList"][_0xbfde09]["discount"]["length"]; _0x42fa0f++)
            0x64 == _0x32b79f["rspBody"]["goodsList"][_0x4950cd]["detailList"][_0xbfde09]["discount"][_0x42fa0f]["discountCnt"] ? _0x32b79f["rspBody"]["goodsList"][_0x4950cd]["detailList"][_0xbfde09]["discount"][_0x42fa0f]["activebo"] = "true" : _0x32b79f["rspBody"]["goodsList"][_0x4950cd]["detailList"][_0xbfde09]["discount"][_0x42fa0f]["activebo"] = "false";
            payFlow["payFlowCallback"](_0x32b79f, _0x38c279, _0x680563, _0x3253fe);
          }
        } else
        "902073" == _0x32b79f["retCode"] ? (payFlow["seventhree"](_0x32b79f["retDesc"]),
        publicClient["closeLoadPlug"]()) : "902074" == _0x32b79f["retCode"] ? (payFlow["sevenfour"](_0x32b79f["retDesc"]),
        publicClient["closeLoadPlug"]()) : payFlow["sessionCheck"](_0x32b79f);
      },
      "error": function () {
        publicClient["closeLoadPlug"](),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "getRecommend": function (_0x30ed40, _0x3dbed7, _0x1ec259) {
    console["log"]("获取推荐商品"),
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/goods/recommendGoodsList",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "provinceCode": _0x3dbed7 ? _0x3dbed7 : "",
        "cityCode": _0x1ec259 ? _0x1ec259 : "",
        "chargeCell": _0x30ed40 ? _0x30ed40 : "",
        "payWay": "1",
        "channel": payFlow["channel"] }),

      "dataType": "json",
      "timeout": 0x7530,
      "async": !0x1,
      "success": function (_0x30ed40) {
        if (0x1 == payFlow["loginS"] && $("#login_tc")["removeClass"]("hidden"),
        $("#reqInit")["addClass"]("hiddens"),
        $("html,body")["css"]("position", "relative"),
        $("#rBtn,.btnBack")["removeClass"]("hidden"),
        "000000" == _0x30ed40["retCode"]) {
          if (_0x30ed40["rspBody"]) {
            if (_0x30ed40["rspBody"]["floorList"])
            for (var _0x3dbed7 = 0x0; _0x3dbed7 < _0x30ed40["rspBody"]["floorList"]["length"]; _0x3dbed7++)
            0x2 == _0x30ed40["rspBody"]["floorList"][_0x3dbed7]["productType"] && _0x30ed40["rspBody"]["floorList"][_0x3dbed7]["goodsList"]["push"](payFlow["dayprice"]);
            payFlow["recommendData"] = _0x30ed40["rspBody"],
            console["log"](payFlow["recommendData"], "9999"),
            publicClient["closeLoadPlug"]();
          }
        } else
        "902073" == _0x30ed40["retCode"] ? (payFlow["seventhree"](_0x30ed40["retDesc"]),
        publicClient["closeLoadPlug"]()) : "902074" == _0x30ed40["retCode"] ? (payFlow["sevenfour"](_0x30ed40["retDesc"]),
        publicClient["closeLoadPlug"]()) : payFlow["sessionCheck"](_0x30ed40);
      },
      "error": function () {
        publicClient["closeLoadPlug"](),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "activestock": function (_0xfa8f7b, _0x4d69d4, _0x4bd4e1, _0x464f00) {
    if ("true" == _0x4d69d4)
    $(".sj", _0x464f00)["addClass"]("linethron"),
    $(".onprice")["addClass"]("hidden"),
    $(".inventory,.zkq,.totalNums")["removeClass"]("hidden"),
    $(".threeconl img")["attr"]("src", "../../images/flow/three_03.png"),
    $(".zkthreimg1")["attr"]("src", "../../images/flow/three_06.png"),
    $(".zkthreimgzx")["attr"]("src", "../../images/flow/threezx_03.png"),
    $(".threprice,.threesale")["css"]({
      "color": "#333333" }),

    $(".threprice")["css"]({
      "text-decoration": "none" }),

    $(".zkh")["css"]({
      "color": "#333333",
      "font-size": " 0.64rem",
      "text-decoration": "none" }),

    $(".underway")["text"]("抢购中")["css"]({
      "color": "#00a4ff" }),

    $(".grab")["css"]("margin-top", "0.426667rem"),
    $(".discnum")["css"]({
      "background": "url(../../images/flow/discount.png)",
      "background-size": "100% 100%" }),

    $(".clock")["css"]({
      "background": "url(../../images/flow/clock.png)",
      "background-size": "100% 100%" }),

    $(".clock")["attr"]("src", "../../images/flow/clock.png"),
    $(".at-price")["css"]({
      "color": "#333333",
      "font-size": "0.64rem",
      "text-decoration": "none" }),

    $(".act-price")["css"]({
      "color": "#999999",
      "font-size": "0.512rem",
      "text-decoration": "line-through" }),

    $(".zkbj")["css"]({
      "background": "url(../../images/flow/zkprice_03.png)",
      "background-size": "100% 100%" }),

    $(".saletwo")["css"]({
      "background": "url(../../images/flow/pritwo_03.png)",
      "background-size": "100% 100%" }),

    $(".exclusivecon")["css"]({
      "background": "url(../../images/flow/zxyou_03.png)",
      "background-size": "100% 100%" }),

    $(".zkzt")["text"]("抢购中")["css"]({
      "background": "url(../../images/flow/clock.png)",
      "background-size": "0.707rem 0.596rem",
      "background-repeat": "no-repeat",
      "color": "#00a4ff" });else

    {
      $(".sj", _0x464f00)["removeClass"]("linethron");
      var _0x5d9699 = $(".zkq")["html"]();
      $(".zkq,.inventory")["addClass"]("hidden"),
      $(".threeconl img")["attr"]("src", "../../images/flow/threeh_03.png"),
      $(".zkthreimg1")["attr"]("src", "../../images/flow/threeh_06.png"),
      $(".zkthreimgzx")["attr"]("src", "../../images/flow/threezxh_03.png"),
      $(".threprice,.threesale")["css"]({
        "color": "#999999" }),

      $(".threprice")["css"]({
        "text-decoration": "line-through" }),

      $(".zkh")["css"]({
        "color": "#999999",
        "font-size": "0.512rem",
        "text-decoration": "line-through" }),

      $(".onprice")["removeClass"]("hidden")["text"](_0x5d9699)["css"]({
        "color": "#333333",
        "font-size": "0.64rem",
        "text-decoration": "none" }),

      $(".underway")["text"]("已售罄")["css"]("color", "#999999"),
      $(".grab")["css"]("margin-top", "0.87rem"),
      $(".discnum")["css"]({
        "background": "url(../../images/flow/dis-gray.png)",
        "background-size": "100% 100%" }),

      $(".clock")["css"]({
        "background": "url(../../images/flow/cloth-gray.png)",
        "background-size": "100% 100%" }),

      $(".clock")["attr"]("src", "../../images/flow/cloth-gray.png"),
      $(".at-price")["css"]({
        "color": "#999999",
        "font-size": "0.64rem",
        "text-decoration": "line-through" }),

      $(".act-price")["css"]({
        "color": "#333333",
        "font-size": "0.512rem",
        "text-decoration": "none" }),

      $(".totalNums")["removeClass"]("hidden"),
      $(".zkbj")["css"]({
        "background": "url(../../images/flow/zkpriceh_03.png)",
        "background-size": "100% 100%" }),

      $(".saletwo")["css"]({
        "background": "url(../../images/flow/pritwoh_03.png)",
        "background-size": "100% 100%" }),

      $(".exclusivecon")["css"]({
        "background": "url(../../images/flow/zxyouh_03.png)",
        "background-size": "100% 100%" }),

      $(".zkzt")["text"]("已售罄")["css"]({
        "background": "url(../../images/flow/cloth-gray.png)",
        "background-size": "0.707rem 0.596rem",
        "background-repeat": "no-repeat",
        "color": "#999999" });

    }
    if ("true" == _0xfa8f7b) {
      _0xfa8f7b = "false";
      for (var _0x4b07bd = 0x0; _0x4b07bd < _0x4bd4e1["rspBody"]["goodsList"]["length"]; _0x4b07bd++)
      for (var _0x573f4 = 0x0; _0x573f4 < _0x4bd4e1["rspBody"]["goodsList"][_0x4b07bd]["detailList"]["length"]; _0x573f4++)
      if (_0x4bd4e1["rspBody"]["goodsList"][_0x4b07bd]["detailList"][_0x573f4]["productId"] == payFlow["activeproductid"]) {
        var _0xb572f2 = _0x4bd4e1["rspBody"]["goodsList"][_0x4b07bd]["detailList"][_0x573f4]["productType"],
        _0x3e4635 = "";
        _0x3e4635 = 0x3 == _0xb572f2 ? "month" : 0x2 == _0xb572f2 ? "day" : 0x1 == _0xb572f2 ? "hour" : 0x4 == _0xb572f2 ? "character" : "recommend",
        $("#" + _0x3e4635 + " > ul > li > div")["each"](function (_0xfa8f7b) {
          $(this)["attr"]("data-productid") == payFlow["activeproductid"] && ("true" == _0x4d69d4 ? (payFlow["actselloutbo"] = !0x1,
          $("p", $(this))["css"]("color", "#ffffff"),
          $(this)["css"]("border", "1px solid #ff8700"),
          $("#" + _0x3e4635 + " div")["eq"](_0xfa8f7b)["find"](".zk")["length"] > 0x0 ? $("#" + _0x3e4635 + " div")["eq"](_0xfa8f7b)["find"](".zk")["attr"]("src", "../../images/flow/qiang3_03.png") : $("<img class='zkz zk ' src='../../images/flow/qiang3_03.png' />")["appendTo"]($("#" + _0x3e4635 + " div")["eq"](_0xfa8f7b)),
          $("#" + _0x3e4635 + " div")["eq"](_0xfa8f7b)["css"]({
            "background-color": "#ff8700" }),

          payFlow["skewing"](0x1, _0x4bd4e1, !0x0, $(this))) : (payFlow["actselloutbo"] = !0x0,
          $("p", $(this))["css"]("color", "#bbbbbb"),
          $(this)["css"]("border", "1px solid #f6f6f6"),
          $("#" + _0x3e4635 + " div")["eq"](_0xfa8f7b)["find"](".zk")["length"] > 0x0 ? $("#" + _0x3e4635 + " div")["eq"](_0xfa8f7b)["find"](".zk")["attr"]("src", "../../images/flow/qiang2_03.png") : $("<img class='zkz zk ' src='../../images/flow/qiang2_03.png' />")["appendTo"]($("#" + _0x3e4635 + " div")["eq"](_0xfa8f7b)),
          $("#" + _0x3e4635 + " div")["eq"](_0xfa8f7b)["css"]({
            "background-color": "#f6f6f6" }),

          0x0 == _0xfa8f7b ? payFlow["skewing"](0x1, _0x4bd4e1) : payFlow["skewing"](0x0, _0x4bd4e1)));
        });
      }
    }
  },
  "stockBuss": function (_0x5431de, _0x56ca14, _0x8a80eb, _0x3a930c, _0x26764e) {
    var _0xb7b1d2 = $["Deferred"]();
    return $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/goods/discountStock",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "goodsId": _0x5431de,
        "marketId": _0x56ca14,
        "channel": payFlow["channel"] }),

      "dataType": "json",
      "async": !0x1,
      "timeout": 0x7530,
      "success": function (_0x5431de) {
        _0xb7b1d2["resolve"](_0x5431de),
        "000000" == _0x5431de["retCode"] ? void 0x0 != _0x5431de["rspBody"] && "" != _0x5431de["rspBody"] && (payFlow["stockNum"] = _0x5431de["rspBody"]["stockNum"],
        _0x5431de["rspBody"]["totalNum"] == -0x1 ? ($(".totalNums")["addClass"]("hidden"),
        $(".stockNum")["text"]("充足"),
        payFlow["activestock"](_0x3a930c, "true", _0x8a80eb, _0x26764e)) : (_0x5431de["rspBody"]["stockNum"] > 0x2710 ? $(".stockNum")["text"]("充足") : $(".stockNum")["text"]("紧张"),
        _0x5431de["rspBody"]["stockNum"] > 0x0 ? payFlow["activestock"](_0x3a930c, "true", _0x8a80eb, _0x26764e) : payFlow["activestock"](_0x3a930c, "false", _0x8a80eb, _0x26764e))) : payFlow["sessionCheck"](_0x5431de),
        publicClient["closeLoadPlug"]();
      },
      "error": function () {
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } }),

    _0xb7b1d2["promise"]();
  },
  "skewing": function (_0x2b0a7a, _0x41d7e6, _0x2affb4, _0x1a2dfa) {
    function _0x1775d5(_0x2b0a7a) {
      $("#" + _0x2b0a7a + " > ul > li > div")["each"](function (_0x2b0a7a) {
        $(this)["attr"]("data-discountCnt") && $(".sj", $(this))["addClass"]("linethron");
      });
    }
    if (_0x2affb4) {
      payFlow["cardtakbo"] = !0x1;
      var _0x1d7c0b = _0x1a2dfa["attr"]("data-discountCnt");
      _0x1775d5($("#months")["hasClass"]("hover") ? "month" : $("#days")["hasClass"]("hover") ? "day" : $("#hours")["hasClass"]("hover") ? "hour" : $("#characters")["hasClass"]("hover") ? "character" : "recommend");
      var _0x45155e = _0x1a2dfa["attr"]("data-fuid"),
      _0x15548a = "";
      _0x1a2dfa["attr"]("data-marketid");
      $(".sp", $(".mon-con")["not"](".activewo"))["css"]("color", "#666666"),
      $(".sj", $(".mon-con")["not"](".activewo"))["css"]("color", "#999999");
      var _0x1bb55d = _0x1a2dfa["attr"]("data-futit");
      _0x15548a = _0x1a2dfa["attr"]("data-goodsid"),
      console["log"](_0x1bb55d, "商品的副标题"),
      $(".mon-con", $("#" + _0x45155e))["removeClass"]("mon-sel")["addClass"]("bor-all"),
      _0x1a2dfa["removeClass"]("bor-all")["addClass"]("mon-sel"),
      $(".mon-con", $("#" + _0x45155e))["removeClass"]("markb"),
      $(".mon-con", $("#" + _0x45155e))["removeClass"]("markb2"),
      $(".mon-con", $("#" + _0x45155e))["removeClass"]("zkb"),
      _0x1a2dfa["hasClass"]("activewo") ? ($("p", _0x1a2dfa)["css"]("color", "#ffffff"),
      _0x1a2dfa["addClass"]("markb2")) : ($("p", _0x1a2dfa)["css"]("color", "#FF7F00"),
      _0x1a2dfa["addClass"]("markb")),
      payFlow["orderMyCardList"](_0x15548a, "false"),
      setTimeout(function () {
        payFlow["activityList"](_0x41d7e6, _0x15548a);
      }, 0x1e),
      _0x1bb55d["indexOf"]("【") >= 0x0 ? $(".inmeEffect")["css"]("margin-left", "-0.3rem") : $(".inmeEffect")["css"]("margin-left", "0"),
      $(".inmeEffect")["text"](_0x1bb55d),
      0x3e7 == payFlow["recomendType"] ? $(this)["parent"]()["parent"]()["prev"]()["find"](".recommondTitle")["text"](_0x1bb55d) : $(".inmeEffect")["text"](_0x1bb55d),
      $(".dis,.discount,.disthree")["addClass"]("hidden"),
      _0x1d7c0b || ($(".ptgood")["removeClass"]("hidden"),
      cardUrl || ($(".zkenter")["addClass"]("hidden"),
      $(".cardwenter")["removeClass"]("hidden")));
    } else {
      payFlow["cardtakbo"] = !0x1;
      var _0x1d7c0b = $("#month,#day,#hour,#character")["find"](".mon-con")["eq"](_0x2b0a7a)["attr"]("data-discountCnt"),
      _0x45155e = $("#month,#day,#hour,#character")["find"](".mon-con")["eq"](_0x2b0a7a)["attr"]("data-fuid"),
      _0x15548a = "";
      $("#month,#day,#hour,#character")["find"](".mon-con")["eq"](_0x2b0a7a)["attr"]("data-marketid");
      $(".sp", $(".mon-con")["not"](".activewo"))["css"]("color", "#666666"),
      $(".sj", $(".mon-con")["not"](".activewo"))["css"]("color", "#999999");
      var _0x1bb55d = $("#month,#day,#hour,#character")["find"](".mon-con")["eq"](_0x2b0a7a)["attr"]("data-futit");
      _0x15548a = $("#month,#day,#hour,#character")["find"](".mon-con")["eq"](_0x2b0a7a)["attr"]("data-goodsid"),
      $(".mon-con", $("#" + _0x45155e))["removeClass"]("mon-sel")["addClass"]("bor-all"),
      $("#month,#day,#hour,#character")["find"](".mon-con")["eq"](_0x2b0a7a)["removeClass"]("bor-all")["addClass"]("mon-sel"),
      $(".mon-con", $("#" + _0x45155e))["removeClass"]("markb"),
      $("#month,#day,#hour,#character")["find"](".mon-con")["eq"](_0x2b0a7a)["addClass"]("markb"),
      $(".mon-con", $("#" + _0x45155e))["removeClass"]("zkb"),
      $("p", $("#recommend,#month,#day,#hour,#character")["find"](".mon-con")["eq"](_0x2b0a7a))["css"]("color", "#FF7F00"),
      payFlow["orderMyCardList"](_0x15548a, "false"),
      setTimeout(function () {
        payFlow["activityList"](_0x41d7e6, _0x15548a);
      }, 0x1e),
      _0x1bb55d["indexOf"]("【") >= 0x0 ? $(".inmeEffect")["css"]("margin-left", "-0.3rem") : $(".inmeEffect")["css"]("margin-left", "0"),
      $(".inmeEffect")["text"](_0x1bb55d),
      $(".dis,.discount,.disthree")["addClass"]("hidden"),
      _0x1d7c0b || ($(".ptgood")["removeClass"]("hidden"),
      cardUrl || ($(".zkenter")["addClass"]("hidden"),
      $(".cardwenter")["removeClass"]("hidden")));
    }
  },
  "init": function (_0x5b38d6, _0x4d1e32, _0x3b31c9, _0x260028) {
    function _0x33aac6(_0x5b38d6, _0x4d1e32, _0x3b31c9) {
      if (cardUrl) {
        payFlow["firstPrice"] = [];
        for (var _0x260028 = 0x0; _0x260028 < payFlow["myCardLista"]["length"]; _0x260028++)
        payFlow["myCardLista"][_0x260028]["pcardBusiRelList"][0x0]["goodsIds"]["indexOf"](_0x4d1e32) > -0x1 && payFlow["firstPrice"]["push"](_0x260028);
        payFlow["firstPrice"]["length"] > 0x0 && (payFlow["disCountPrice"] = payFlow["myCardLista"][payFlow["firstPrice"][0x0]]["pcardCash"],
        console["log"](payFlow["disCountPrice"], "点击折扣券的折扣价")),
        payFlow["marketlist2"](_0x5b38d6, _0x3b31c9),
        console["log"](payFlow["firstPrice"], 0x0 == payFlow["firstPrice"]["length"], "点击到其他商品product");
      } else
      payFlow["disCountPrice"] = 0x1,
      payFlow["marketlist2"](_0x5b38d6, _0x3b31c9),
      console["log"](payFlow["disCountPrice"], "点击折扣定位的商品的折扣价product");
    }
    $("#recommend,#month,#day,#hour,#character")["find"](".mon-con")["unbind"](),
    $("#recommend,#month,#day,#hour,#character")["find"](".mon-con")["fastClick"](function (_0x5b38d6) {
      if (payFlow["firstPruductPrice"] = !0x1,
      !$(this)["hasClass"]("mon-sel")) {
        var _0x4d1e32 = $(this)["attr"]("data-discountCnt"),
        _0x3b31c9 = $(this)["attr"]("data-productid"),
        _0xb99aeb = $(this)["attr"]("data-dayprice"),
        _0x543c5b = $(this)["attr"]("data-futit");
        if (_0xb99aeb)
        $(".ptgood2")["addClass"]("hidden"),
        $(".mon-con")["removeClass"]("mon-sel")["addClass"]("bor-all"),
        $(this)["removeClass"]("bor-all")["addClass"]("mon-sel"),
        $(".mon-con")["removeClass"]("markb"),
        $(".mon-con")["removeClass"]("markb2"),
        $(".sp", $(".mon-con")["not"](".activewo"))["css"]("color", "#666666"),
        $(".sj", $(".mon-con")["not"](".activewo"))["css"]("color", "#999999"),
        $(".mon-con")["removeClass"]("zkb"),
        $("p", $(this))["css"]("color", "#fc2401"),
        $(this)["addClass"]("markbday"),
        $(".ptgood,.discount,.dis,.disthree,.cardshow,.cardwenter,.zkenter")["addClass"]("hidden"),
        $(".disribao")["removeClass"]("hidden"),
        $("#rBtn")["html"]("去流量钱包"),
        $(this)["parent"]()["parent"]()["siblings"]()["find"](".recommondTitle")["text"](""),
        $(this)["parent"]()["parent"]()["prev"]()["find"](".recommondTitle")["text"](_0x543c5b),
        "recommend" == $(this)["parent"]()["parent"]()["parent"]()["attr"]("id") ? payFlow["daywact"] = "1907_CQLLHB_MO_P_BHAD99" : "day" == $(this)["parent"]()["parent"]()["parent"]()["attr"]("id") ? payFlow["daywact"] = "1907_CQLLHB_MO_O_BYAD5" : payFlow["daywact"] = "",
        publicClient["confirmPlug"]("取消", "去流量钱包", "流量购买后将存入流量钱包，使用时可提取到通信账户，剩余流量可在流量钱包中查询，季末流量将失效清零", "", function () {
          var _0x5b38d6 = "";
          _0x5b38d6 = urls["indexOf"]("leadeon-flow-touch-test") >= 0x0 ? "https://app.10086.cn/activity-test/transit/flowwallet.html?WT.ac_id=" + payFlow["daywact"] : "https://app.10086.cn/activity/transit/flowwallet.html?WT.ac_id=" + payFlow["daywact"],
          window["location"]["href"] = _0x5b38d6;
        });else
        {
          if ($(".cardshow")["hasClass"]("hidden") || $(this)["parent"]()["parent"]()["parent"]()["find"](".mon-con")["each"](function () {
            payFlow["disCountPrice"] = 0x1,
            payFlow["marketlist2"]($(this), _0x260028);
          }),
          _0x33aac6($(this), $(this)["attr"]("data-goodsid"), _0x260028),
          _0x4d1e32) {
            var _0x543c5b = $(this)["attr"]("data-futit");
            $(".ptgood2")["removeClass"]("hidden")["html"](_0x543c5b),
            $(".ptgood")["addClass"]("hidden");
          } else
          $(".ptgood2")["addClass"]("hidden");
          if ($(".disribao")["addClass"]("hidden"),
          $("#rBtn")["html"]("立即充值"),
          $(".mon-con")["removeClass"]("markbday"),
          _0x3b31c9 == payFlow["activeproductid"] && !_0x4d1e32 && payFlow["actselloutbo"] || _0x3b31c9 == payFlow["activeproductid"] && _0x4d1e32 && payFlow["actselloutbo"] || _0x3b31c9 == payFlow["activeproductid"] && _0x4d1e32 && payFlow["actselloutbo2"] && payFlow["actselloutbo"])
          ;else
          {
            var _0x462755 = $(this)["attr"]("data-goodsid"),
            _0x3d9f56 = $(this)["attr"]("data-marketid");
            if (_0x3b31c9 == payFlow["activeproductid"] && _0x4d1e32 && payFlow["actselloutbo2"] && !payFlow["actselloutbo"] || _0x3b31c9 == payFlow["activeproductid"] && _0x4d1e32 && !payFlow["actselloutbo"] && !payFlow["actselloutbo2"]) {
              var _0x306efd = "true";
              payFlow["stockBuss"](_0x462755, _0x3d9f56, _0x260028, _0x306efd);
            } else
            payFlow["skewing"](0x1, _0x260028, !0x0, $(this));
          }
        }
      }
    }),
    $("#month")["find"](".mon-con")["fastClick"](function () {
      var _0x5b38d6 = $(this)["attr"]("data-producttraffic"),
      _0x4d1e32 = $(this)["attr"]("data-goodsid");
      publicClient["setWebtrends"](payFlow["jsons"], "wb_llcz_y_" + _0x5b38d6, {
        "WT.si_n": _0x4d1e32 });

    }),
    $("#day")["find"](".mon-con")["fastClick"](function () {
      var _0x5b38d6 = $(this)["attr"]("data-producttraffic"),
      _0x4d1e32 = $(this)["attr"]("data-goodsid");
      publicClient["setWebtrends"](payFlow["jsons"], "wb_llcz_r_" + _0x5b38d6, {
        "WT.si_n": _0x4d1e32 });

    }),
    $("#hour")["find"](".mon-con")["fastClick"](function () {
      var _0x5b38d6 = $(this)["attr"]("data-producttraffic"),
      _0x4d1e32 = $(this)["attr"]("data-goodsid");
      publicClient["setWebtrends"](payFlow["jsons"], "wb_llcz_xs_" + _0x5b38d6, {
        "WT.si_n": _0x4d1e32 });

    }),
    $(".paySwitch ul li")["each"](function () {
      var _0x142c0f = $(this)["attr"]("data-producttypes");
      console["log"](_0x142c0f, "productTypes"),
      _0x142c0f["indexOf"]("999") > -0x1 ? ($("#recommends")["addClass"]("hover")["siblings"]()["removeClass"]("hover"),
      $(".oBtn-wrap")["css"]("width", "100%")) : _0x142c0f["indexOf"]("3") > -0x1 ? ($("#months")["addClass"]("hover")["siblings"]()["removeClass"]("hover"),
      ("0" == payFlow["recommendData"]["floorSize"] || payFlow["recommendData"]) && $("#month")["removeClass"]("hidden")) : _0x142c0f["indexOf"]("2") > -0x1 ? ($("#days")["addClass"]("hover")["siblings"]()["removeClass"]("hover"),
      $("#day")["removeClass"]("hidden")) : _0x142c0f["indexOf"]("1") > -0x1 ? ($("#hours")["addClass"]("hover")["siblings"]()["removeClass"]("hover"),
      $("#hour")["removeClass"]("hidden")) : _0x142c0f["indexOf"]("4") > -0x1 && ($("#characters")["addClass"]("hover")["siblings"]()["removeClass"]("hover"),
      $("#character")["removeClass"]("hidden")),
      0x1 == _0x142c0f["length"] ? ($("#paySwitchc")["addClass"]("hidden"),
      $(".mon-table")["removeClass"]("hidden")) : $(".mon-table")["removeClass"]("onepxT"),
      $(this)["unbind"](),
      $(this)["fastClick"](function (_0x142c0f) {
        function _0x2a90b2(_0x5b38d6, _0x4d1e32) {
          var _0x3b31c9 = "";
          _0x5b38d6["hasClass"]("hover") && $("#" + _0x4d1e32 + " > ul > li > div")["each"](function (_0x5b38d6) {
            $(this)["hasClass"]("mon-sel") && (_0x3b31c9 = $(this)["attr"]("data-goodsid"));
          }),
          payFlow["marketlist"](_0x5b38d6, _0x4d1e32, _0x260028, _0x3b31c9);
        }
        payFlow["firstPruductPrice"] = !0x1,
        $(".cardshow")["hasClass"]("hidden") || $("#recommend,#month,#day,#hour,#character")["find"](".mon-con")["each"](function () {
          payFlow["disCountPrice"] = 0x1,
          payFlow["marketlist2"]($(this), _0x260028);
        });
        var _0x4213ba = $(this)["attr"]("id")["substr"](0x0, $(this)["attr"]("id")["length"] - 0x1),
        _0x1e73af = $("#" + _0x4213ba + " .mon-con")["eq"](0x0)["attr"]("data-goodsid");
        $("#" + _0x4213ba + " .mon-con")["each"](function (_0x5b38d6, _0x4d1e32) {
          0x0 == _0x5b38d6 && _0x33aac6($(this), _0x1e73af, _0x260028);
        }),
        $(".disribao")["addClass"]("hidden"),
        $("#rBtn")["html"]("立即充值"),
        $(".mon-con")["removeClass"]("markbday"),
        console["log"]("点击li"),
        publicClient["showLoadPlug"]();
        for (var _0x342478 = 0x0; _0x342478 < _0x260028["rspBody"]["goodsList"]["length"]; _0x342478++)
        "4" == _0x260028["rspBody"]["goodsList"][_0x342478]["productType"] && _0x260028["rspBody"]["goodsList"][_0x342478]["detailList"]["length"] > 0x6 && ($("#character ul li")["eq"](0x5)["html"]("")["html"]("更多")["css"]({
          "fontSize": "0.62533rem",
          "color": "#666666",
          "border": "1px solid #e9e9e9",
          "borderRadius": "0.128rem",
          "height": "2.15rem",
          "lineHeight": "2.15rem",
          "padding": "0.855333rem 0 !important" }),

        $("#character ul li")["eq"](0x5)["nextAll"]()["hide"]());
        payFlow["cardtakbo"] = !0x1,
        $(this)["addClass"]("hover")["siblings"]()["removeClass"]("hover"),
        $(".mon-table")["css"]("display", "none")["removeClass"]("hidden")["eq"]($(".paySwitch ul li")["index"](this))["css"]("display", "block"),
        payFlow["showPrice"]($("#recommends"), "recommend", _0x260028),
        payFlow["showPrice"]($("#months"), "month", _0x260028),
        payFlow["showPrice"]($("#days"), "day", _0x260028),
        payFlow["showPrice"]($("#hours"), "hour", _0x260028),
        payFlow["showPrice"]($("#characters"), "character", _0x260028);
        var _0x5cff2f = "";
        setTimeout(function () {
          $("#months")["hasClass"]("hover") ? (_0x5cff2f = "3",
          _0x2a90b2($("#months"), "month")) : $("#days")["hasClass"]("hover") ? (_0x5cff2f = "2",
          _0x2a90b2($("#days"), "day")) : $("#hours")["hasClass"]("hover") ? (_0x5cff2f = "1",
          _0x2a90b2($("#hours"), "hour")) : $("#characters")["hasClass"]("hover") ? (_0x5cff2f = "4",
          _0x2a90b2($("#characters"), "character")) : $("#recommends")["hasClass"]("hover") && (_0x5cff2f = "999",
          $(".oBtn-wrap")["css"]("width", "100%"),
          _0x2a90b2($("#recommends"), "recommend")),
          payFlow["changelist"] || "999" == _0x5cff2f ? ($("#warmcld,#triangle,#warm_con")["addClass"]("hidden"),
          publicClient["closeLoadPlug"]()) : payFlow["warmTip"](_0x5b38d6, _0x5cff2f, _0x4d1e32, _0x3b31c9);
        }, 0x1e);
      });
    }),
    $("#rBtn")["unbind"](),
    $("#rBtn")["on"]("click", function (_0x4d1e32) {
      if ("立即充值" == $("#rBtn")["html"]()) {
        if (!$(this)["hasClass"]("disable") && $(this)["hasClass"]("oneclick")) {
          $("#rBtn")["removeClass"]("oneclick"),
          console["log"]("立即充值");
          var _0x3b31c9 = "",
          _0x33aac6 = "",
          _0x312c6b = "",
          _0x2190e7 = "",
          _0x1c96c6 = "",
          _0x52cffb = "",
          _0x14f909 = "",
          _0x4cb5a4 = "",
          _0x190438 = "";
          payFlow["numLogin"] ? (payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#months"), "month", _0x260028),
          payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#days"), "day", _0x260028),
          payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#hours"), "hour", _0x260028),
          payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#characters"), "character", _0x260028),
          payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#recommends"), "recommend", _0x260028)) : publicClient["confirmPlug"]("立即登录", "继续", "尊敬的用户，由于您未登录，流量充值后将无法查询充值订单，是否继续？", function () {
            $("#rBtn")["addClass"]("oneclick");
            var _0x5b38d6 = window["location"]["href"];
            window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(_0x5b38d6);
          }, function () {
            payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#months"), "month", _0x260028),
            payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#days"), "day", _0x260028),
            payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#hours"), "hour", _0x260028),
            payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#characters"), "character", _0x260028),
            payFlow["but_accessData"](_0x190438, _0x4cb5a4, _0x3b31c9, _0x33aac6, _0x312c6b, _0x2190e7, _0x1c96c6, _0x52cffb, _0x14f909, _0x5b38d6, $("#recommends"), "recommend", _0x260028);
          });
        }
      } else {
        var _0x69c38a = "";
        _0x69c38a = urls["indexOf"]("leadeon-flow-touch-test") >= 0x0 ? "https://app.10086.cn/activity-test/transit/flowwallet.html?WT.ac_id=" + payFlow["daywact"] : "https://app.10086.cn/activity/transit/flowwallet.html?WT.ac_id=" + payFlow["daywact"],
        window["location"]["href"] = _0x69c38a;
      }
    }),
    $(".discount,.dis,.disthree,.zkenter")["each"](function () {
      $(this)["unbind"](),
      $(this)["fastClick"](function () {
        payFlow["offerList"] > 0x1 && (payFlow["jinzhi"] = 0x0,
        $("#hbg")["removeClass"]("hidden"),
        $("#payments")["removeClass"]("hidden")["stop"]()["animate"]({
          "bottom": "0" }),

        publicClient["functionOfClicks"]("CF02411", payFlow["jsons"]),
        $("body")["css"]({
          "position": "fixed",
          "top": "0" }));

      });
    }),
    payFlow["clicklist"](document, "#payments"),
    payFlow["clicklist"](".cancel", "#payments"),
    payFlow["clicklist"]("#hbg", "#cardlist"),
    $(".usecount")["addClass"]("hidden"),
    payFlow["numLogin"] || ($(".cardwenter")["removeClass"]("hidden"),
    $(".cardshow,.zkenter")["addClass"]("hidden"),
    $(".cardcount")["html"]("登录查看")["css"]("color", "#999999"),
    $(".cardjt")["css"]({
      "width": "0.363rem",
      "height": "0.597rem",
      "top": "0.624rem" }),

    $(".flr", $(".cardwenter"))["unbind"](),
    $(".flr", $(".cardwenter"))["fastClick"](function (_0x5b38d6) {
      window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(urls);
    }));
  },
  "clicklist": function (_0x5314e3, _0x1686e2) {
    $(_0x5314e3)["click"](function () {
      setTimeout(function () {
        $(_0x1686e2)["addClass"]("hidden"),
        $("#hbg")["addClass"]("hidden"),
        payFlow["jinzhi"] = 0x1;
      }, 0xc8),
      $(_0x1686e2)["stop"]()["animate"]({
        "bottom": "-400px" }),

      $("body")["css"]({
        "position": "absolute" });

    });
  },
  "popup": function () {
    $("#login_dl")["on"]("click", function (_0xbc6ffd) {
      var _0x5295fd = window["location"]["href"];
      window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(_0x5295fd);
    }),
    $("#login_tc")["on"]("click", function (_0x4ced70) {
      $("#login_h")["addClass"]("hidden"),
      $("#login_x")["addClass"]("hidden"),
      $("#login_dl")["removeClass"]("hidden"),
      $("#login_tc")["addClass"]("hidden"),
      $["ajax"]({
        "type": "get",
        "url": "https://flow.clientaccess.10086.cn/SessionServer-orange/loginOutSSO",
        "data": "?",
        "timeout": 0x7530,
        "dataType": "json",
        "success": function (_0x4ced70) {
          window["location"]["href"] = "https://login.10086.cn/logout.action?channelID=12016&backUrl=" + encodeURIComponent(window["location"]["href"]);
        },
        "error": function () {} });

    });
  },
  "wxshare": function () {
    function _0x8fef3() {
      WeixinJSBridge["invoke"]("sendAppMessage", {
        "appid": _0x404ac6,
        "img_url": _0x54a0ce,
        "img_width": "640",
        "img_height": "640",
        "link": _0x1aa413,
        "desc": _0x50bdac,
        "title": _0x11f640 },
      function (_0x8fef3) {
        _report("send_msg", _0x8fef3["err_msg"]);
      });
    }
    function _0x3ef61b() {
      WeixinJSBridge["invoke"]("shareTimeline", {
        "img_url": _0x54a0ce,
        "img_width": "640",
        "img_height": "640",
        "link": _0x1aa413,
        "desc": _0x50bdac,
        "title": _0x11f640 },
      function (_0x8fef3) {
        _report("timeline", _0x8fef3["err_msg"]);
      });
    }
    function _0x5aec85() {
      WeixinJSBridge["invoke"]("shareWeibo", {
        "content": _0x50bdac,
        "url": _0x1aa413 },
      function (_0x8fef3) {
        _report("weibo", _0x8fef3["err_msg"]);
      });
    }
    var _0x54a0ce = window["location"]["href"]["substring"](0x0, window["location"]["href"]["indexOf"]("leadeon-flow-touch")) + "leadeon-flow-touch/images/flow/share.png",
    _0x1aa413 = window["location"]["href"],
    _0x50bdac = "使用#中国移动手机营业厅#流量直充，即充即用，告别流量饥荒，点击充值！",
    _0x11f640 = "流量直充",
    _0x404ac6 = "";
    document["addEventListener"]("WeixinJSBridgeReady", function () {
      WeixinJSBridge["on"]("menu:share:appmessage", function (_0x3ef61b) {
        _0x8fef3();
      }),
      WeixinJSBridge["on"]("menu:share:timeline", function (_0x8fef3) {
        _0x3ef61b();
      }),
      WeixinJSBridge["on"]("menu:share:weibo", function (_0x8fef3) {
        _0x5aec85();
      });
    }, !0x1);
  },
  "safari": function () {
    var _0x5734a7 = navigator["userAgent"]["toLowerCase"]();
    Device["os"]["wx"] || "weibo" == _0x5734a7["match"](/WeiBo/i) ? ($("#enter_khd,#oBtn,.unpaid-see")["unbind"](),
    $("#enter_khd,#oBtn,.unpaid-see")["fastClick"](function (_0x5734a7) {
      $(".register")["removeClass"]("hidden")["addClass"]("show"),
      $(".safari")["removeClass"]("hidden")["addClass"]("show");
    }),
    $(".register")["bind"]("click", function (_0x5734a7) {
      $(".register")["addClass"]("hidden")["removeClass"]("show"),
      $(".safari")["addClass"]("hidden")["removeClass"]("show");
    }),
    payFlow["wxshare"]()) : ($("#enter_khd")["unbind"](),
    $("#enter_khd")["fastClick"](function (_0x5734a7) {
      var _0x2026a3 = publicClient["flowapp"] + "pages/flow/payFlow.html",
      _0x5e1c24 = "",
      _0x35598c = "";
      cardUrl ? payFlow["cardtakbo"] ? (_0x5e1c24 = productIdUrl,
      _0x35598c = "productId") : (_0x5e1c24 = traficFlow,
      _0x35598c = "flowNum") : (_0x5e1c24 = productIdUrl,
      _0x35598c = "productId"),
      o2oNumurl && rydtype && _0x5e1c24 ? urls = _0x2026a3 + "?taskID=" + o2oNumurl + "&productType=" + rydtype + "&" + _0x35598c + "=" + _0x5e1c24 : rydtype && _0x5e1c24 ? urls = _0x2026a3 + "?productType=" + rydtype + "&" + _0x35598c + "=" + _0x5e1c24 : o2oNumurl ? urls = _0x2026a3 + "?taskID=" + o2oNumurl : urls = _0x2026a3,
      publicClient["pullAppDownload"](urls);
    }),
    payFlow["numLogin"] ? ($("#oBtn")["unbind"](),
    $("#oBtn")["fastClick"](function (_0x5734a7) {
      var _0x1ddeed = publicClient["cmcc"] + "v2.0/pages/mall/order/orderlist.html?tab=0";
      publicClient["pullAppDownload"](_0x1ddeed);
    }),
    $(".unpaid-see")["unbind"](),
    $(".unpaid-see")["fastClick"](function () {
      $(".unpaid-prompt")["addClass"]("hidden");
      var _0x5734a7 = publicClient["cmcc"] + "v2.0/pages/mall/order/orderlist.html?tab=0";
      publicClient["pullAppDownload"](_0x5734a7);
    })) : ($("#oBtn")["unbind"](),
    $("#oBtn")["fastClick"](function (_0x5734a7) {
      var _0x2b9617 = window["location"]["href"];
      window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(_0x2b9617);
    }))),
    $(".turnoff")["unbind"](),
    $(".turnoff")["fastClick"](function (_0x5734a7) {
      $(".china-app")["addClass"]("hidden");
    });
  },
  "gopay": function () {
    var _0x1ebfd8 = navigator["userAgent"]["toLowerCase"]();
    if (Device["os"]["wx"] || "weibo" == _0x1ebfd8["match"](/WeiBo/i))
    $(".register")["removeClass"]("hidden")["addClass"]("show"),
    $(".safari")["removeClass"]("hidden")["addClass"]("show");else
    if (payFlow["numLogin"]) {
      var _0x4799b8 = publicClient["cmcc"] + "v2.0/pages/mall/order/orderlist.html?tab=0";
      publicClient["pullAppDownload"](_0x4799b8);
    } else {
      var _0x4799b8 = window["location"]["href"];
      window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(_0x4799b8);
    }
  },
  "visit": function () {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/payFlowStatic/payFlow",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "channel": "0705",
        "pageTag": "payFlow" }),

      "dataType": "json",
      "timeout": 0x7530,
      "success": function (_0x47324d) {},
      "error": function (_0xda4211, _0x3d37d4, _0x4fae18) {} });

  },
  "hoveringdate": function () {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "SHD/marketing/getSystemDate",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {}),
      "dataType": "json",
      "timeout": 0x7530,
      "async": !0x1,
      "success": function (_0x1d11fb) {
        if ("000000" == _0x1d11fb["retCode"]) {
          if (_0x1d11fb["rspBody"]) {
            var _0x3491b7 = _0x1d11fb["rspBody"]["date"],
            _0x16e880 = "",
            _0x2ab7fd = "",
            _0x67b0f5 = "";
            _0x16e880 = _0x3491b7["substring"](0x0, 0x4),
            _0x2ab7fd = _0x3491b7["substring"](0x5, 0x7),
            _0x67b0f5 = _0x3491b7["substring"](0x8, 0xa),
            0x7e3 == _0x16e880 ? $("#hovering")["removeClass"]("hidden") : $("#hovering")["addClass"]("hidden");
          }
        } else
        payFlow["sessionCheck"](_0x1d11fb);
      },
      "error": function () {
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "checkUnpay": function (_0x2645a1) {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/order/orderList",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "userNum": _0x2645a1,
        "orderType": "1",
        "isCoupon": 0x1,
        "orderStatus": "0",
        "reqMonth": 0x1 }),

      "dataType": "json",
      "timeout": 0x7530,
      "success": function (_0x2645a1) {
        "000000" == _0x2645a1["retCode"] ? _0x2645a1["rspBody"] && 0x0 != _0x2645a1["rspBody"]["totalCount"] && $(".unpaid-prompt")["removeClass"]("hidden") : payFlow["sessionCheck"](_0x2645a1);
      },
      "error": function (_0x2645a1, _0x21b28c, _0x5f0120) {
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "initq": function () {
    $(".unpaid-cancel")["click"](function () {
      $(".unpaid-prompt")["addClass"]("hidden");
    }),
    $("#hoveringcolse")["unbind"](),
    $("#hoveringcolse")["fastClick"](function (_0x544b77) {
      $("#hovering")["addClass"]("hidden");
    }),
    payFlow["hoveringdate"](),
    $("#rightFlr, .chongD")["fastClick"](function (_0x1f95ba) {
      var _0x510e82 = window["location"]["href"];
      window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(_0x510e82);
    }),
    payFlow["visit"](),
    payFlow["popup"](),
    payFlow["safari"](),
    $("#warmcld")["unbind"](),
    $("#warmcld")["fastClick"](function (_0xbc8588) {
      $("#warm_con")["slideToggle"](),
      $(".triangle")["slideToggle"](),
      $("#warmt")["toggleClass"]("open-close"),
      $("#warmt")["toggleClass"]("open-close2");
    }),
    $(".input_tex")["unbind"](),
    $(".input_tex")["on"]("click", function (_0x469964) {
      $("#rNum")["focus"]();
    }),
    $("#rNum")["unbind"](),
    $("#rNum")["on"]("input", function () {
      payFlow["onInput"](),
      $("#rBtn")["addClass"]("disable");
    }),
    $("#rNum")["on"]("keyup", function () {
      var _0x3ace19,_0x315a66,_0x2d824d = this,_0x2c610b = payFlow["getNum"](_0x2d824d["value"]),_0x58d441 = _0x2c610b["length"];
      window["event"];
      if (_0x2d824d["setSelectionRange"] && (_0x3ace19 = _0x2d824d["selectionEnd"],
      _0x315a66 = _0x3ace19 === _0x2d824d["value"]["length"]),
      0xc > _0x58d441) {
        if (_0x2d824d["value"] = payFlow["formatMobile"](_0x2c610b),
        0xb === _0x58d441)
        return void _0x2d824d["blur"]();
      } else
      _0x2d824d["value"] = payFlow["formatMobile"](_0x2c610b["substr"](0x0, 0xb)),
      _0x2d824d["blur"]();
      _0x3ace19 && setTimeout(function () {
        _0x315a66 && (_0x3ace19 = _0x2d824d["value"]["length"]),
        _0x2d824d["setSelectionRange"](_0x3ace19, _0x3ace19);
      }, 0x0);
    }),
    $("#rNum")["focus"](function () {
      payFlow["showHis"](),
      payFlow["showClear"]();
      var _0x2535f3 = $(this)["val"]();
      "请输入手机号码" == _0x2535f3 && $(this)["val"]("");
    }),
    $("#rNum")["blur"](function () {
      window["setTimeout"](function () {
        $("#His")["removeClass"]("show")["addClass"]("hidden"),
        payFlow["hiddClear"]();
      }, 0x0);
      var _0x3a1055 = $(this)["val"]();
      if (_0x3a1055 = $["trim"](_0x3a1055),
      "" == _0x3a1055)
      return $(this)["val"]("请输入手机号码"),
      $("#rSupp")["text"]("仅支持移动号码充值")["css"]("color", "#999999"),
      $("#rBtn")["addClass"]("disable"),
      !0x1;
    }),
    $("#rClear")["unbind"](),
    $("#rClear")["fastClick"](function (_0x7f41aa) {
      $("#rNum")["val"]("")["trigger"]("focus"),
      payFlow["showHis"](),
      _0x7f41aa["stopPropagation"](),
      _0x7f41aa["preventDefault"]();
    });
  },
  "cardprice": function (_0x4baac0) {
    return $(".cardshow")["hasClass"]("hidden") || $(".payTypec")["each"](function (_0x4dab02) {
      function _0x59fd48(_0x4baac0, _0x4dab02) {
        return "0" == _0x4baac0 ? (_0x4dab02 = _0x4dab02["toFixed"](0x3),
        _0x4dab02 = Math["round"]((0x64 * _0x4dab02)["toFixed"](0x2)) / 0x64,
        _0x4dab02 = publicClient["floating"](_0x4dab02)) : "1" == _0x4baac0 ? (_0x4dab02 = _0x4dab02["toFixed"](0x3),
        _0x4dab02 = _0x4dab02["toString"](),
        _0x4dab02 = _0x4dab02["substring"](0x0, _0x4dab02["lastIndexOf"](".") + 0x3),
        _0x4dab02 = publicClient["floating"](_0x4dab02)) : "2" == _0x4baac0 ? (_0x4dab02 = _0x4dab02["toFixed"](0x3),
        _0x4dab02 = Math["ceil"]((0x64 * _0x4dab02)["toFixed"](0x2)) / 0x64,
        _0x4dab02 = _0x4dab02["toFixed"](0x2),
        _0x4dab02 = publicClient["floating"](_0x4dab02)) : void 0x0 != _0x4baac0 && "undefined" != _0x4baac0 && null != _0x4baac0 && "" != _0x4baac0 || (_0x4dab02 = _0x4dab02["toFixed"](0x2),
        _0x4dab02 = publicClient["floating"](_0x4dab02)),
        _0x4dab02;
      }
      var _0x5e1b8c = $(this)["attr"]("data-available"),
      _0x366631 = $(this)["attr"]("data-accountrule");
      $(this)["attr"]("data-nominalvalue2");
      "true" == _0x5e1b8c && "../../images/flow/sel.png" == $(this)["attr"]("src") && (payFlow["fid"] = $(this)["attr"]("data-fid"),
      payFlow["batchid"] = $(this)["attr"]("data-batchid"),
      payFlow["sid"] = $(this)["attr"]("data-sid"),
      zk = _0x59fd48(_0x366631, parseFloat(_0x4baac0)),
      orderPrice = zk);
    }),
    orderPrice;
  },
  "but_accessData": function (_0x3835f1, _0x8f1a71, _0x322a58, _0x28cff6, _0x4d0da0, _0xa5cd72, _0x43cb04, _0x3a1f07, _0x5f0239, _0x524a4e, _0x50195c, _0x5c30b6, _0x50500a) {
    var _0x4f5737 = "",
    _0x986a9e = "",
    _0x2173c5 = "";
    _0x50195c["hasClass"]("hover") && ($("#" + _0x5c30b6 + " > ul > li > div")["each"](function (_0xa5cd72) {
      if ($(this)["hasClass"]("mon-sel")) {
        _0x986a9e = $(this),
        _0x322a58 = $(this)["attr"]("data-goodsid"),
        _0x28cff6 = $(this)["attr"]("data-cashprice"),
        _0x43cb04 = $(this)["attr"]("data-marketid"),
        _0x4d0da0 = $(this)["attr"]("data-discountcnt"),
        producttype = $(this)["attr"]("data-producttype"),
        _0x5f0239 = $(this)["attr"]("data-producttraffic"),
        _0x2173c5 = $(this)["attr"]("data-discounttype"),
        _0x8f1a71 = $(this)["attr"]("data-fuid"),
        _0x3835f1 = $(this)["attr"]("data-productid");
        var _0x524a4e = $(".sj", $(this))["find"]("span")["text"](),
        _0x50195c = _0x524a4e["indexOf"]("元"),
        _0x5c30b6 = _0x524a4e["substring"](0x0, _0x50195c);
        publicClient["setWebtrends"](payFlow["jsons"], "wb_llcz_ljcz", {
          "WT.si_n": _0x322a58,
          "WT.si_x": "20" }),

        "month" == _0x8f1a71 ? _0x4f5737 = 0x3 : "day" == _0x8f1a71 ? _0x4f5737 = 0x2 : "hour" == _0x8f1a71 ? _0x4f5737 = 0x1 : "character" == _0x8f1a71 && (_0x4f5737 = 0x4),
        _0x4d0da0 && $(".cardshow")["hasClass"]("hidden") ? (_0x3a1f07 = 0x64 != _0x4d0da0 ? payFlow["orderpric"] : 0x2 == _0x2173c5 ? payFlow["orderpric"] : _0x28cff6,
        payFlow["sid"] = "") : $(".cardshow")["hasClass"]("hidden") ? (_0x3a1f07 = _0x28cff6,
        _0x43cb04 = "",
        payFlow["sid"] = "") : (_0x3a1f07 = 0x64 * payFlow["cardprice"](_0x5c30b6),
        _0x3a1f07 = _0x3a1f07["toFixed"](0x0),
        payFlow["newcardbo"] || payFlow["cardtakbo"] ? payFlow["resultCode"] = !0x0 : payFlow["cardverify"](),
        _0x43cb04 = "");
      }
    }),
    $(".cardshow")["hasClass"]("hidden") ? payFlow["createOrder2"](_0x3835f1, _0x4f5737, payFlow["numLogin"], _0x524a4e, _0x322a58, _0x28cff6, _0x43cb04, _0x3a1f07, _0x5f0239, _0x50500a, _0x986a9e) : payFlow["resultCode"] ? payFlow["createOrder2"](_0x3835f1, _0x4f5737, payFlow["numLogin"], _0x524a4e, _0x322a58, _0x28cff6, _0x43cb04, _0x3a1f07, _0x5f0239, _0x50500a, _0x986a9e) : payFlow["resultCode"] || payFlow["resultCode2"] || publicClient["confirmPlug"]("取消", "原价购买", "尊敬的用户您好，" + payFlow["errorDesc"] + "，您可按照原价购买，是否继续？", function () {
      window["location"]["href"] = urls;
    }, function () {
      payFlow["sid"] = "",
      payFlow["xpaycard"] = !0x0,
      _0x3a1f07 = _0x28cff6,
      _0x43cb04 = "",
      payFlow["createOrder2"](_0x3835f1, _0x4f5737, payFlow["numLogin"], _0x524a4e, _0x322a58, _0x28cff6, _0x43cb04, _0x3a1f07, _0x5f0239, _0x50500a, _0x986a9e);
    }));
  },
  "cardverify": function (_0x11283f, _0x4bc9e1, _0x272591) {
    var _0x530bbe = payFlow["remFormatNum"]($("#rNum")["val"]());
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "SHE/cardUseCheck/info",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "cellNum": payFlow["numLogin"],
        "chargeNum": _0x530bbe,
        "fTicketId": payFlow["fid"],
        "batchId": payFlow["batchid"],
        "channel": payFlow["channel"],
        "sTicketId": payFlow["sid"] }),

      "dataType": "json",
      "timeout": 0x7530,
      "async": !0x1,
      "success": function (_0x11283f) {
        setTimeout(function () {
          $("#rBtn")["addClass"]("oneclick");
        }, 0x7d0),
        "000000" == _0x11283f["retCode"] ? _0x11283f["rspBody"] && (payFlow["errorDesc"] = _0x11283f["rspBody"]["errorDesc"],
        0x0 == _0x11283f["rspBody"]["resultCode"] ? payFlow["resultCode"] = !0x0 : payFlow["resultCode"] = !0x1) : (payFlow["resultCode2"] = !0x0,
        payFlow["sessionCheck"](_0x11283f));
      },
      "error": function () {
        publicClient["closeLoadPlug"](),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "showPrice": function (_0x32fe02, _0xf08042, _0x3ad547) {
    _0x32fe02["hasClass"]("hover") && $("#" + _0xf08042 + " > ul > li > div")["each"](function (_0x32fe02, _0x3ad547) {
      if (0x0 == _0x32fe02) {
        var _0x359cea = "",
        _0x1bdef4 = $(this)["attr"]("data-discountCnt");
        if (_0x1bdef4) {
          var _0x21ea7c = $(this)["attr"]("data-futit");
          $(".ptgood2")["removeClass"]("hidden")["html"](_0x21ea7c),
          $(".ptgood")["addClass"]("hidden");
        } else
        $(".ptgood2")["addClass"]("hidden");
        var _0x42e1cf = $(this)["attr"]("data-soldout"),
        _0xfc14c0 = $(this)["attr"]("data-productid");
        _0xfc14c0 == payFlow["activeproductid"] && _0x1bdef4 && 0x1 == _0x42e1cf ? (_0x359cea = $("#" + _0xf08042 + " > ul > li > div")["eq"](0x1)["attr"]("data-fuid"),
        $(".mon-con", $("#" + _0x359cea))["removeClass"]("mon-sel")["addClass"]("bor-all"),
        $("#" + _0xf08042 + " > ul > li > div")["eq"](0x1)["removeClass"]("bor-all")["addClass"]("mon-sel"),
        $(".mon-con", $("#" + _0x359cea))["removeClass"]("markb"),
        $("#" + _0xf08042 + " > ul > li > div")["eq"](0x1)["addClass"]("markb"),
        $(".mon-con", $("#" + _0x359cea))["removeClass"]("zkb"),
        $("p", $("#" + _0xf08042 + " > ul > li > div")["eq"](0x1))["css"]("color", "#FF7F00"),
        $("#" + _0xf08042 + " > ul > li > div")["eq"](0x1)["hasClass"]("mon-sel") && (_0x1bdef4 = $("#" + _0xf08042 + " > ul > li > div")["eq"](0x1)["attr"]("data-discountcnt"),
        _0x1bdef4 || ($(".ptgood")["removeClass"]("hidden"),
        $(".discount,.dis,.disthree")["addClass"]("hidden")),
        payFlow["orderMyCardList"]($("#" + _0xf08042 + " > ul > li > div")["eq"](0x1)["attr"]("data-goodsid"), "false"))) : (_0x359cea = $(this)["attr"]("data-fuid"),
        $(".mon-con", $("#" + _0x359cea))["removeClass"]("mon-sel")["addClass"]("bor-all"),
        $(this)["removeClass"]("bor-all")["addClass"]("mon-sel"),
        $(".mon-con", $("#" + _0x359cea))["removeClass"]("markb"),
        $(".mon-con", $("#" + _0x359cea))["removeClass"]("markb2"),
        $(".mon-con", $("#" + _0x359cea))["removeClass"]("zkb"),
        $(this)["hasClass"]("activewo") ? ($("p", $(this))["css"]("color", "#ffffff"),
        $(this)["addClass"]("markb2")) : ($("p", $(this))["css"]("color", "#FF7F00"),
        $(this)["addClass"]("markb")),
        $(this)["hasClass"]("mon-sel") && (_0x1bdef4 = $(this)["attr"]("data-discountcnt"),
        _0x1bdef4 || ($(".ptgood")["removeClass"]("hidden"),
        $(".discount,.dis,.disthree")["addClass"]("hidden")),
        payFlow["orderMyCardList"]($(this)["attr"]("data-goodsid"), "false"))),
        $(".sp", $(".mon-con")["not"](".activewo"))["css"]("color", "#666666"),
        $(".sj", $(".mon-con")["not"](".activewo"))["css"]("color", "#999999");
      }
    });
  },
  "warmTip": function (_0x118d00, _0x58e7e0, _0x197217, _0x28f330) {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/reminder/getReminder",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "provinceCode": _0x197217 ? _0x197217 : "",
        "cityCode": _0x28f330 ? _0x28f330 : "",
        "chargeCell": _0x118d00 ? _0x118d00 : "",
        "flowType": _0x58e7e0,
        "exchangeType": "1",
        "channel": payFlow["channel"],
        "clientType": payFlow["clientType"] }),

      "dataType": "json",
      "timeout": 0x7530,
      "success": function (_0x118d00) {
        if (publicClient["closeLoadPlug"](),
        0x1 == payFlow["loginS"] && $("#login_tc")["removeClass"]("hidden"),
        $("#reqInit")["addClass"]("hiddens"),
        $("html,body")["css"]("position", "relative"),
        $("#rBtn,.btnBack")["removeClass"]("hidden"),
        "000000" == _0x118d00["retCode"]) {
          if (_0x118d00["rspBody"]) {
            $("#warm_con")["text"](""),
            $("#warmcld,#triangle,#warm_con")["removeClass"]("hidden");
            var _0x58e7e0 = $("#warm_con")["attr"]("style")["indexOf"]("display");
            _0x58e7e0 != -0x1 && $("#warm_con")["css"]({
              "display": "block" }),

            $(".oBtn-wrap")["css"]("width", "50%"),
            $(".warm-ct")["css"]("height", "7.253333rem");
            var _0x197217 = _0x118d00["rspBody"]["reminder"]["split"]("\r\n");
            _0x118d00["rspBody"]["reminder"] = payFlow["getNormalString"](_0x197217);
            for (var _0x28f330 = _0x118d00["rspBody"]["reminder"]["length"], _0x1be860 = 0x0; _0x1be860 < _0x28f330; _0x1be860++) {
              _0x118d00["rspBody"]["reminder"][_0x1be860] = _0x118d00["rspBody"]["reminder"][_0x1be860]["substring"](0x0, _0x118d00["rspBody"]["reminder"][_0x1be860]["length"] + 0x1);
              var _0x11718e = "<span>" + _0x118d00["rspBody"]["reminder"][_0x1be860] + "<span><br/>";
              $("#warm_con")["append"](_0x11718e);
            }
            $("#payments")["hasClass"]("hidden") || $("#hbg")["removeClass"]("hidden");
          } else {
            $("#warmcld,#triangle,#warm_con")["addClass"]("hidden");
            var _0x58e7e0 = $("#warm_con")["attr"]("style")["indexOf"]("display");
            _0x58e7e0 != -0x1 && $("#warm_con")["css"]({
              "display": "none" }),

            $(".oBtn-wrap")["css"]("width", "100%"),
            $(".warm-ct")["css"]("height", "0");
          }} else

        "902073" == _0x118d00["retCode"] ? (payFlow["seventhree"](_0x118d00["retDesc"]),
        publicClient["closeLoadPlug"]()) : "902074" == _0x118d00["retCode"] && (payFlow["sevenfour"](_0x118d00["retDesc"]),
        publicClient["closeLoadPlug"]());
      },
      "error": function () {
        publicClient["closeLoadPlug"](),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "getNormalString": function (_0x2bac06) {
    for (var _0x1c5caa = 0x0; _0x1c5caa < _0x2bac06["length"]; _0x1c5caa++)
    _0x2bac06[_0x1c5caa] = _0x2bac06[_0x1c5caa]["substring"](0x0, _0x2bac06[_0x1c5caa]["length"]);
    return _0x2bac06;
  },
  "checkNumber": function (_0x19b845, _0x153547, _0x52f67d) {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/user/validate",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "chargeCell": _0x19b845,
        "channel": payFlow["channel"] }),

      "dataType": "json",
      "timeout": 0x7530,
      "success": function (_0x153547) {
        0x1 == payFlow["loginS"] && $("#login_tc")["removeClass"]("hidden"),
        $("#reqInit")["addClass"]("hiddens"),
        $("#rBtn,.btnBack")["removeClass"]("hidden"),
        "000000" == _0x153547["retCode"] ? void 0x0 != _0x153547["rspBody"] && "" != _0x153547["rspBody"] && 0x1 == _0x153547["rspBody"]["statu"] && (payFlow["getRecommend"](_0x19b845),
        $("#rBtn,.warm-ct,.btnBack")["removeClass"]("hidden"),
        $("#listk,#listkk")["addClass"]("hidden"),
        payFlow["payFlow_con"](_0x19b845)) : "902073" == _0x153547["retCode"] ? (payFlow["seventhree"](_0x153547["retDesc"]),
        publicClient["closeLoadPlug"]()) : "902074" == _0x153547["retCode"] ? (payFlow["sevenfour"](_0x153547["retDesc"]),
        publicClient["closeLoadPlug"]()) : "912075" == _0x153547["retCode"] ? ($("#rBtn")["addClass"]("disable"),
        $("#rSupp")["text"](_0x153547["retDesc"])["css"]("color", "#0085cf"),
        publicClient["closeLoadPlug"]()) : "310004" == _0x153547["retCode"] ? ($("#rBtn")["addClass"]("disable"),
        $("#rSupp")["text"]("您输入的号码非移动手机号码，请您重新输入")["css"]("color", "#0085cf"),
        publicClient["closeLoadPlug"]()) : (publicClient["closeLoadPlug"](),
        $("#rBtn")["addClass"]("disable"),
        payFlow["sessionCheck"](_0x153547));
      },
      "error": function (_0x19b845) {
        publicClient["closeLoadPlug"](),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "activegray": function (_0x4d1fb7) {
    for (var _0x3f1226 = 0x0; _0x3f1226 < _0x4d1fb7["rspBody"]["goodsList"]["length"]; _0x3f1226++)
    for (var _0x4016f9 = 0x0; _0x4016f9 < _0x4d1fb7["rspBody"]["goodsList"][_0x3f1226]["detailList"]["length"]; _0x4016f9++)
    if (_0x4d1fb7["rspBody"]["goodsList"][_0x3f1226]["detailList"][_0x4016f9]["productId"] == payFlow["activeproductid"]) {
      var _0x555db3 = _0x4d1fb7["rspBody"]["goodsList"][_0x3f1226]["detailList"][_0x4016f9]["productType"],
      _0x2ef56d = "";
      _0x2ef56d = 0x3 == _0x555db3 ? "month" : 0x2 == _0x555db3 ? "day" : 0x1 == _0x555db3 ? "hour" : 0x4 == _0x555db3 ? "character" : "recommend",
      $("#" + _0x2ef56d + " > ul > li > div")["each"](function (_0x3f1226) {
        $(this)["attr"]("data-productid") == payFlow["activeproductid"] && (payFlow["actselloutbo"] = !0x0,
        $("p", $(this))["css"]("color", "#bbbbbb"),
        $(this)["css"]("border", "1px solid #f6f6f6"),
        $(this)["removeClass"]("markb2"),
        $("#" + _0x2ef56d + " div")["eq"](_0x3f1226)["find"](".zk")["length"] > 0x0 ? $("#" + _0x2ef56d + " div")["eq"](_0x3f1226)["find"](".zk")["attr"]("src", "../../images/flow/qiang2_03.png") : $("<img class='zkz zk ' src='../../images/flow/qiang2_03.png' />")["appendTo"]($("#" + _0x2ef56d + " div")["eq"](_0x3f1226)),
        $("#" + _0x2ef56d + " div")["eq"](_0x3f1226)["css"]({
          "background-color": "#f6f6f6" }),

        0x0 == _0x3f1226 ? payFlow["skewing"](0x1, _0x4d1fb7) : payFlow["skewing"](0x0, _0x4d1fb7));
      });
    }
    publicClient["toastPlug"]("手慢了，商品已经被抢光了", 0xbb8);
  },
  "createOrder2": function (_0x230752, _0xa38b86, _0x2f61b9, _0x35d09d, _0x53c86d, _0x4fa38c, _0x50bef1, _0x1e1ed1, _0x51b0b1, _0x4edba8, _0x20ace8) {
    console["log"](0x3e7),
    publicClient["showLoadPlug"](),
    setTimeout(function () {
      $("#rBtn")["addClass"]("oneclick");
    }, 0x7d0);
    var _0x25d067 = "";
    _0x25d067 = payFlow["xpaycard"] ? "" : payFlow["newcardbo"] && !$(".cardshow")["hasClass"]("hidden") || payFlow["cardtakbo"] && !$(".cardshow")["hasClass"]("hidden") ? "2" : payFlow["newcardbo"] || $(".cardshow")["hasClass"]("hidden") ? "" : "1",
    payFlow["xpaycard"] = !0x1,
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/order/submit",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "chargeCell": _0x35d09d,
        "userNum": _0x2f61b9 ? _0x2f61b9 : "",
        "userType": _0x2f61b9 ? "01" : "",
        "goodsId": _0x53c86d,
        "exchangeType": 0x1,
        "goodsPrice": _0x4fa38c,
        "discountId": _0x50bef1,
        "orderPrice": Math["floor"](_0x1e1ed1),
        "channel": payFlow["channel"],
        "recommendedNumber": payFlow["o2oNum"] ? payFlow["o2oNum"] : "",
        "recommendedChannel": payFlow["o2oQu"] ? payFlow["o2oQu"] : "",
        "cardTicketId": payFlow["sid"] ? payFlow["sid"] : "",
        "cardVersion": _0x25d067,
        "tag": tag }),

      "dataType": "json",
      "acWebstr": !0x0,
      "mcWebstr": !0x0,
      "timeout": 0x7530,
      "success": function (_0x25d067) {
        if ($("#rBtn")["addClass"]("oneclick"),
        publicClient["closeLoadPlug"](),
        payFlow["setHisStorage"](_0x35d09d),
        "000000" == _0x25d067["retCode"]) {
          if (void 0x0 != _0x25d067["rspBody"] && "" != _0x25d067["rspBody"]) {
            var _0x339431 = _0x25d067["rspBody"]["orderCode"],
            _0xb737e6 = _0x25d067["rspBody"]["payPrice"];
            payFlow["paidOrder"](_0xb737e6, _0x35d09d, _0x339431, _0x51b0b1, _0x50bef1);
          }
        } else
        "902076" == _0x25d067["retCode"] ? _0x230752 == payFlow["activeproductid"] ? payFlow["activegray"](_0x4edba8) : publicClient["confirmPlug"]("取消", "原价购买", "抱歉，活动商品已被抢空，商品已恢复原价，可继续原价购买", function () {
          $(".sj", _0x20ace8)["removeClass"]("linethron");
          var _0x230752 = $(".zkq")["html"]();
          $(".zkq,.inventory")["addClass"]("hidden"),
          $(".threeconl img")["attr"]("src", "../../images/flow/threeh_03.png"),
          $(".zkthreimg1")["attr"]("src", "../../images/flow/threeh_06.png"),
          $(".zkthreimgzx")["attr"]("src", "../../images/flow/threezxh_03.png"),
          $(".threprice,.threesale")["css"]({
            "color": "#999999" }),

          $(".threprice")["css"]({
            "text-decoration": "line-through" }),

          $(".zkh")["css"]({
            "color": "#999999",
            "font-size": "0.512rem",
            "text-decoration": "line-through" }),

          $(".onprice")["removeClass"]("hidden")["text"](_0x230752)["css"]({
            "color": "#333333",
            "font-size": "0.64rem",
            "text-decoration": "none" }),

          $(".underway")["text"]("已售罄")["css"]("color", "#999999"),
          $(".grab")["css"]("margin-top", "0.87rem"),
          $(".discnum")["css"]({
            "background": "url(../../images/flow/dis-gray.png)",
            "background-size": "100% 100%" }),

          $(".clock")["css"]({
            "background": "url(../../images/flow/cloth-gray.png)",
            "background-size": "100% 100%" }),

          $(".clock")["attr"]("src", "../../images/flow/cloth-gray.png"),
          $(".at-price")["css"]({
            "color": "#999999",
            "font-size": "0.64rem",
            "text-decoration": "line-through" }),

          $(".act-price")["css"]({
            "color": "#333333",
            "font-size": "0.512rem",
            "text-decoration": "none" }),

          $(".totalNums")["removeClass"]("hidden"),
          $(".zkbj")["css"]({
            "background": "url(../../images/flow/zkpriceh_03.png)",
            "background-size": "100% 100%" }),

          $(".saletwo")["css"]({
            "background": "url(../../images/flow/pritwoh_03.png)",
            "background-size": "100% 100%" }),

          $(".exclusivecon")["css"]({
            "background": "url(../../images/flow/zxyouh_03.png)",
            "background-size": "100% 100%" }),

          $(".zkzt")["text"]("已售罄")["css"]({
            "background": "url(../../images/flow/cloth-gray.png)",
            "background-size": "0.707rem 0.596rem",
            "background-repeat": "no-repeat",
            "color": "#999999" });

        }, function () {
          _0x50bef1 = "",
          _0x1e1ed1 = _0x4fa38c,
          payFlow["createOrder2"](_0x230752, _0xa38b86, _0x2f61b9, _0x35d09d, _0x53c86d, _0x4fa38c, _0x50bef1, _0x1e1ed1, _0x51b0b1, _0x4edba8, _0x20ace8);
        }) : "922025" == _0x25d067["retCode"] || "922026" == _0x25d067["retCode"] ? publicClient["showDialogPlug"](_0x25d067["retDesc"], "知道了") : "922018" == _0x25d067["retCode"] || "912082" == _0x25d067["retCode"] ? (publicClient["showDialogPlug"](_0x25d067["retDesc"], "知道了"),
        $(".dialog-plug .d-btn")["unbind"](),
        $(".dialog-plug .d-btn")["fastClick"](function (_0x230752) {
          window["location"]["href"] = window["location"]["href"];
        })) : "922027" == _0x25d067["retCode"] ? publicClient["confirmPlug"]("取消", "查看订单", "该卡券已存在待支付订单，您可前往<span class='blue'>订单列表</span>完成支付，或<span class='blue'>1小时</span>后卡券自动释放，有效期内可重新使用", "", function () {
          payFlow["gopay"]();
        }, "true") : "922009" == _0x25d067["retCode"] || "922022" == _0x25d067["retCode"] || "922024" == _0x25d067["retCode"] ? _0x230752 == payFlow["activeproductid"] ? payFlow["activegray"](_0x4edba8) : publicClient["confirmPlug"]("取消", "原价购买", _0x25d067["retDesc"], "", function () {
          _0x50bef1 = "",
          _0x1e1ed1 = _0x4fa38c,
          payFlow["createOrder2"](_0x230752, _0xa38b86, _0x2f61b9, _0x35d09d, _0x53c86d, _0x4fa38c, _0x50bef1, _0x1e1ed1, _0x51b0b1, _0x4edba8, _0x20ace8);
        }) : "922010" == _0x25d067["retCode"] ? publicClient["confirmPlug"]("取消", "去支付", _0x25d067["retDesc"], "", function () {
          payFlow["gopay"]();
        }) : "922011" == _0x25d067["retCode"] ? publicClient["showDialogPlug"](_0x25d067["retDesc"], "知道了") : "922012" == _0x25d067["retCode"] || "922023" == _0x25d067["retCode"] || "912086" == _0x25d067["retCode"] ? ("912086" == _0x25d067["retCode"] ? publicClient["showDialogPlug"](_0x25d067["retDesc"], "查看活动") : publicClient["showDialogPlug"](_0x25d067["retDesc"], "其他活动"),
        $(".dialog-plug .d-btn")["unbind"](),
        $(".dialog-plug .d-btn")["fastClick"](function (_0x230752) {
          function _0xa38b86(_0x230752, _0xa38b86) {
            publicClient["showLoadPlug"]();
            var _0x2f61b9 = "";
            _0x230752["hasClass"]("hover") && $("#" + _0xa38b86 + " > ul > li > div")["each"](function (_0x230752) {
              $(this)["hasClass"]("mon-sel") && (_0x2f61b9 = $(this)["attr"]("data-goodsid"),
              discountCnt = $(this)["attr"]("data-discountcnt"),
              _0x53c86d = $(this)["attr"]("data-productType"),
              _0x4fa38c = $(this)["attr"]("data-productid"),
              rydtype = _0x53c86d,
              productIdUrl = _0x4fa38c,
              payFlow["changelist"] = !0x0,
              setTimeout(function () {
                payFlow["payFlow_con"](_0x35d09d);
              }, 0x64),
              payFlow["jinzhi"] = 0x0,
              $("#hbg")["removeClass"]("hidden"),
              $("#payments")["removeClass"]("hidden")["stop"]()["animate"]({
                "bottom": "0" }),

              publicClient["functionOfClicks"]("CF02411", payFlow["jsons"]),
              $("body")["css"]({
                "position": "fixed",
                "top": "0" }));

            });
          }
          var _0x2f61b9 = "",
          _0x53c86d = "",
          _0x4fa38c = "";
          setTimeout(function () {
            $("#months")["hasClass"]("hover") ? (_0x2f61b9 = "3",
            _0xa38b86($("#months"), "month")) : $("#days")["hasClass"]("hover") ? (_0x2f61b9 = "2",
            _0xa38b86($("#days"), "day")) : $("#hours")["hasClass"]("hover") ? (_0x2f61b9 = "1",
            _0xa38b86($("#hours"), "hour")) : $("#characters")["hasClass"]("hover") && (_0x2f61b9 = "4",
            _0xa38b86($("#characters"), "character"));
          }, 0x1e),
          $(".dialog-plug")["remove"](),
          _0x230752["preventDefault"]();
        })) : "902073" == _0x25d067["retCode"] ? payFlow["seventhree"](_0x25d067["retDesc"]) : "902074" == _0x25d067["retCode"] ? payFlow["sevenfour"](_0x25d067["retDesc"]) : "510022" == _0x25d067["retCode"] ? publicClient["confirmPlug"]("返回", "立即登录", "尊敬的用户您好，该活动商品仅限为登录手机号充值。", "", function () {
          window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(urls);
        }) : "510024" == _0x25d067["retCode"] ? publicClient["confirmPlug"]("返回", "立即登录", "请使用手机号码登录购买活动商品，只有为本机充值才可享受优惠哦！", "", function () {
          window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(urls);
        }) : payFlow["sessionCheck"](_0x25d067);
      },
      "error": function () {
        publicClient["closeLoadPlug"](),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "paidOrder": function (_0x3678bc, _0xcf7ce0, _0x3c7474, _0x285685, _0x4c15ca) {
    _0x3678bc /= 0x64,
    publicClient["showLoadPlug"](),
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/pay/beginPayReq",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "gatewayId": "",
        "payWay": "WAP",
        "callbackUrl": window["location"]["href"]["substring"](0x0, window["location"]["href"]["indexOf"]("pages")) + "pages/flow/orderSucc.html?productTraffic=" + _0x285685 + "&loginNum=" + payFlow["numLogin"] + "&num=" + _0xcf7ce0 + "&payPrice=" + _0x3678bc + "&",
        "orderId": _0x3c7474,
        "channel": payFlow["channel"] }),

      "dataType": "json",
      "acWebstr": !0x0,
      "mcWebstr": !0x0,
      "timeout": 0x7530,
      "success": function (_0x3678bc) {
        if (publicClient["closeLoadPlug"](),
        "000000" == _0x3678bc["retCode"]) {
          if (_0x3678bc["rspBody"] && _0x3678bc["rspBody"]["payUrl"]) {
            var _0xcf7ce0 = _0x3678bc["rspBody"]["payUrl"];
            window["location"]["href"] = _0xcf7ce0;
          }
        } else
        "922025" == _0x3678bc["retCode"] || "922026" == _0x3678bc["retCode"] ? publicClient["showDialogPlug"](_0x3678bc["retDesc"], "知道了") : payFlow["sessionCheck"](_0x3678bc);
      },
      "error": function () {
        publicClient["closeLoadPlug"](),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "tagChang": function (_0x12867e) {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/tagInfo/getTagInfo",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "tag": _0x12867e }),

      "dataType": "json",
      "async": !0x1,
      "timeout": 0x7530,
      "success": function (_0x40c552) {
        if ("000000" == _0x40c552["retCode"]) {
          if (_0x40c552["rspBody"]) {
            var _0x27a1d5 = _0x40c552["rspBody"]["ifLockCellNum"],
            _0x5f1a81 = _0x40c552["rspBody"]["ifHiddenDownload"],
            _0x5af38b = _0x40c552["rspBody"]["ifChangeLogo"],
            _0xa1d9c2 = _0x40c552["rspBody"]["pictureUrl"],
            _0x46ffc2 = _0x40c552["rspBody"]["turnUrl"];
            if (_0x27a1d5 && 0x1 == _0x27a1d5 && mobileNo && ($("#rNum")["attr"]("readonly", "readonly"),
            $("#rClear")["css"]("display", "none"),
            $(".input")["css"]("color", "#888888")),
            0x1 == _0x5f1a81 || "yn871" == _0x12867e ? $(".china-app,#liuBtn,#chongD")["addClass"]("hidden") : $(".china-app,#liuBtn,#chongD")["removeClass"]("hidden"),
            "ah0551" == _0x12867e ? $(".logo")["addClass"]("hidden") : $(".logo")["removeClass"]("hidden"),
            _0x5af38b && 0x1 == _0x5af38b && _0xa1d9c2) {
              var _0x1a9bd3 = document["getElementById"]("logo-index");
              _0x1a9bd3["src"] = _0xa1d9c2;
            }
            _0x46ffc2 && $("#logo-index")["fastClick"](function () {
              window["location"]["href"] = _0x46ffc2;
            });
          } else
          $(".china-app,#liuBtn,#chongD,.logo")["removeClass"]("hidden");} else

        $(".china-app,#liuBtn,#chongD,.logo")["removeClass"]("hidden"),
        payFlow["sessionCheck"](_0x40c552);
      },
      "error": function () {
        publicClient["closeLoadPlug"](),
        $(".china-app,#liuBtn,#chongD,.logo")["removeClass"]("hidden"),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "getOperationAdv": function (_0xb0e760, _0x192b2e, _0x3c5e57) {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/goods/getOperationAdv",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "provinceCode": _0x192b2e ? _0x192b2e : "",
        "cityCode": _0x3c5e57 ? _0x3c5e57 : "",
        "chargeCell": _0xb0e760 ? _0xb0e760 : "",
        "advType": "0,1" }),

      "dataType": "json",
      "async": !0x1,
      "timeout": 0x7530,
      "success": function (_0xb0e760) {
        if (payFlow["flowData"]["operationAdvList1"] = [],
        payFlow["flowData"]["operationAdvList2"] = [],
        "000000" == _0xb0e760["retCode"])
        if (_0xb0e760["rspBody"] && _0xb0e760["rspBody"]["operationAdvList"] && _0xb0e760["rspBody"]["operationAdvList"]["length"] > 0x0) {
          for (var _0x192b2e = 0x0; _0x192b2e < _0xb0e760["rspBody"]["operationAdvList"]["length"]; _0x192b2e++)
          0x0 == _0xb0e760["rspBody"]["operationAdvList"][_0x192b2e]["advType"] ? payFlow["flowData"]["operationAdvList1"]["push"](_0xb0e760["rspBody"]["operationAdvList"][_0x192b2e]) : payFlow["flowData"]["operationAdvList2"]["push"](_0xb0e760["rspBody"]["operationAdvList"][_0x192b2e]);
          var _0x3c5e57 = $("#messcon")["html"](),
          _0x1466c5 = juicer(_0x3c5e57, payFlow["flowData"]);
          $("#messzcon")["html"](_0x1466c5),
          $(".searched")["on"]("fastClick", function () {
            window["location"]["href"] = "http://www.10086.cn/roaming/identify/?WT.ac=WAP000GJMY_IDENTIFY_M_LLZC";
          }),
          $(".location-list .item")["unbind"](),
          $(".location-list .item")["on"]("fastClick", function () {
            $thisC = $(this);
            var _0xb0e760 = $thisC["attr"]("actionUrl"),
            _0x192b2e = $thisC["attr"]("bussType");
            0x0 == _0x192b2e ? window["location"]["href"] = _0xb0e760 : 0x1 == _0x192b2e && payFlow["jump"]($thisC);
          });
        } else
        $("#messzcon")["removeClass"]("hidden");
      },
      "error": function () {
        publicClient["closeLoadPlug"](),
        $("#messzcon")["removeClass"]("hidden"),
        publicClient["showDialogPlug"]("请求无法受理，请稍后再试!", "知道了");
      } });

  },
  "jump": function (_0x41a704) {
    var _0x3a76f6 = _0x41a704["attr"]("actionUrl"),
    _0xb3ebcb = (_0x41a704["attr"]("bussType"),
    _0x41a704["attr"]("loginType")),
    _0x41f95d = _0x41a704["attr"]("isSso"),
    _0x4f8443 = _0x41a704["attr"]("ssoUrlAddr"),
    _0x1ec05e = _0x41a704["attr"]("paramList"),
    _0x41b9cf = payFlow["getParamListUrl"](_0x1ec05e, payFlow["numLogin"]),
    _0xa30169 = _0x3a76f6["indexOf"]("?");
    if (0x0 != _0x41f95d && (_0xa30169 == -0x1 ? (_0x3a76f6 += "?",
    _0x41b9cf = _0x41b9cf["substring"](0x1)) : "?" == _0x3a76f6["substring"](_0xa30169) && (_0x41b9cf = _0x41b9cf["substring"](0x1))),
    0x0 == _0xb3ebcb) {
      if (payFlow["numLogin"]) {
        if (0x0 == _0x41f95d) {
          var _0x4a80a0 = new Date()["getTime"]();
          _0x3a76f6 = _0x4f8443 + _0x3a76f6 + _0x41b9cf + "&timestamp=" + _0x4a80a0 + "&TransactionID=" + _0x4a80a0 + _0xb3ebcb,
          console["log"]("sso跳转地址：", _0x3a76f6);
        } else
        _0x3a76f6 += _0x41b9cf,
        console["log"]("登录跳转地址：", _0x3a76f6);} else
      {
        var _0xeb76b4 = window["location"]["href"];
        _0x3a76f6 = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(_0xeb76b4);
      }} else

    0x1 == _0xb3ebcb && (_0x3a76f6 += _0x41b9cf,
    console["log"]("跳转链接", _0x3a76f6));
    window["location"]["href"] = _0x3a76f6;
  },
  "getParamListUrl": function (_0x31dde7, _0x548d27) {
    for (var _0x45b6b5 = _0x31dde7["split"](","), _0x5f57d0 = "", _0x54f43f = _0x45b6b5["length"] - 0x1; _0x54f43f >= 0x0; _0x54f43f--)
    "UID" == _0x45b6b5[_0x54f43f] ? _0x5f57d0 += "&UID=" + payFlow["jumpuid"] : "provinceCode" == _0x45b6b5[_0x54f43f] ? _0x5f57d0 += "&provinceCode=" + payFlow["jumpprovince"] : "cityCode" == _0x45b6b5[_0x54f43f] ? _0x5f57d0 += "&cityCode=" + payFlow["jumpcitys"] : "telNo" == _0x45b6b5[_0x54f43f] && (_0x5f57d0 += "&telNo=" + _0x548d27);
    return console["log"]("参数", _0x5f57d0),
    _0x5f57d0;
  },
  "start": function (_0x3227de, _0x1ee472, _0x1e8776) {
    if (urls["indexOf"]("leadeon-flow-touch-test") >= 0x0 ? $("#testhd")["removeClass"]("hidden") : $("#testhd")["addClass"]("hidden"),
    _0x1ee472 ? payFlow["tagChang"](_0x1ee472) : ($(".china-app,#liuBtn,#chongD,.logo")["removeClass"]("hidden"),
    $("#logo-index")["on"]("click", function () {
      window["location"]["href"] = "https://touch.10086.cn/";
    })),
    $("#rNum")["attr"]("readonly") || payFlow["showNumHis"](),
    o2oNumurl) {
      var _0x422496 = decodeURIComponent(o2oNumurl);
      _0x422496 = publicClient["decryptByDES"](_0x422496, "AssistantInfo"),
      payFlow["o2oNum"] = _0x422496["substring"](_0x422496["length"] - 0xb, _0x422496["length"]),
      payFlow["o2oQu"] = _0x422496["substr"](0x0, _0x422496["lastIndexOf"]("_"));
    }
    if (_0x1e8776)
    publicClient["showLoadPlug"](),
    $("#rNum")["val"](_0x1e8776),
    _0x1e8776 = payFlow["remFormatNum"](_0x1e8776),
    payFlow["getProvinceTwo"](_0x1e8776),
    payFlow["checkNumber"](_0x1e8776);else
    if (mobileNo)
    mobileNo = mobileNo["substring"](0x0, 0x3) + " " + mobileNo["substring"](0x3, 0x7) + " " + mobileNo["substring"](0x7, 0xb),
    $("#rNum")["val"](mobileNo),
    mobileNo = payFlow["remFormatNum"](mobileNo),
    payFlow["getProvinceTwo"](mobileNo),
    payFlow["checkNumber"](mobileNo);else
    if (_0x3227de)
    _0x3227de = _0x3227de["substring"](0x0, 0x3) + " " + _0x3227de["substring"](0x3, 0x7) + " " + _0x3227de["substring"](0x7, 0xb),
    $("#rNum")["val"](_0x3227de),
    _0x3227de = payFlow["remFormatNum"](_0x3227de),
    payFlow["checkUnpay"](_0x3227de),
    payFlow["getProvinceTwo"](_0x3227de),
    payFlow["checkNumber"](_0x3227de);else
    if (proviceUrl && cityUrl) {
      if (payFlow["numJY"])
      ;else
      {
        var _0x5f255b = "";
        $("#rNum")["val"]("请输入手机号码"),
        $("#rSupp")["text"]("仅支持移动号码充值"),
        payFlow["payFlow_con"](_0x5f255b, proviceUrl, cityUrl),
        payFlow["getRecommend"](_0x5f255b, proviceUrl, cityUrl);
      }} else

    $(".flr", $(".cardwenter"))["unbind"](),
    $(".flr", $(".cardwenter"))["fastClick"](function (_0x3227de) {
      window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(urls);
    }),
    payFlow["numJY"] || $(".cardwenter,.zkenter")["addClass"]("hidden");
  },
  "getMyCardList": function (_0x597e59) {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "SHE/myCardList/list",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "cellNum": payFlow["numLogin"],
        "cardType": "1",
        "cardTicketType": "1",
        "channel": payFlow["channel"] }),

      "dataType": "json",
      "timeout": 0x7530,
      "success": function (_0x4f279d) {
        payFlow["flowbo"] || ("000000" == _0x4f279d["retCode"] ? _0x4f279d["rspBody"] && _0x4f279d["rspBody"]["cardTicketList"] && _0x4f279d["rspBody"]["cardTicketList"]["length"] > 0x0 && (payFlow["myCardList"] = _0x4f279d["rspBody"]["cardTicketList"]) : "912093" == _0x4f279d["retCode"] ? ($(".usecount")["addClass"]("hidden"),
        payFlow["cardnone"] = !0x0) : ($(".usecount")["addClass"]("hidden"),
        payFlow["cardnone2"] = !0x0,
        /^4\d{5}$/["test"](_0x4f279d["retCode"]) && payFlow["clearCookie"]()),
        payFlow["getMyCardList2"](_0x597e59));
      },
      "error": function () {
        $(".usecount")["addClass"]("hidden"),
        payFlow["cardnone2"] = !0x0;
      } });

  },
  "getMyCardList2": function (_0x9698b8) {
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "FHW/touch/cardInfo/getCardInfo",
      "data": publicClient["getAjaxData"](payFlow["jsons"], {
        "loginNo": payFlow["numLogin"],
        "cellNum": payFlow["numLogin"],
        "loginType": "0",
        "batchID": "",
        "pageSize": "",
        "pageNum": "" }),

      "dataType": "json",
      "timeout": 0x7530,
      "success": function (_0x136fdd) {
        if ("000000" == _0x136fdd["retCode"]) {
          if (payFlow["flowbo2"] = !0x0,
          _0x136fdd["rspBody"] && _0x136fdd["rspBody"]["busiData"] && 0x0 != _0x136fdd["rspBody"]["totleNum"]) {
            if (cardUrl)
            for (var _0xfb6a0a = 0x0; _0xfb6a0a < _0x136fdd["rspBody"]["busiData"]["length"]; _0xfb6a0a++)
            if (_0x136fdd["rspBody"]["busiData"][_0xfb6a0a]["pcardPasswd"] == cardUrl) {
              payFlow["disCountPrice"] = _0x136fdd["rspBody"]["busiData"][_0xfb6a0a]["pcardCash"];
              for (var _0xe6b915 = 0x0; _0xe6b915 < _0x136fdd["rspBody"]["busiData"][_0xfb6a0a]["pcardBusiRelList"]["length"]; _0xe6b915++)
              for (var _0x2648f6 = _0x136fdd["rspBody"]["busiData"][_0xfb6a0a]["pcardBusiRelList"][_0xe6b915]["goodsIds"]["split"](","), _0x27c088 = 0x0; _0x27c088 < _0x2648f6["length"]; _0x27c088++)
              payFlow["goodsids"]["push"](_0x2648f6[_0x27c088]);
            }
            payFlow["myCardLista"] = _0x136fdd["rspBody"]["busiData"];
          } else
          $(".usecount")["addClass"]("hidden"),
          payFlow["cardnone3"] = !0x0;} else

        $(".usecount")["addClass"]("hidden"),
        payFlow["flowbo2"] = !0x0,
        payFlow["cardnone4"] = !0x0,
        (payFlow["cardnone2"] || payFlow["cardnone4"] && payFlow["cardnone2"] || payFlow["cardnone4"] && "" == payFlow["myCardList"] && !payFlow["cardnone"] || payFlow["cardnone"] && payFlow["cardnone4"]) && ($(".zkenter,.cardshow")["addClass"]("hidden"),
        $(".cardwenter")["removeClass"]("hidden"),
        $(".cardcount")["html"]("重新加载")["css"]("color", "#00a4ff"),
        $(".cardjt")["attr"]("src", "../../images/flow/lodlose.png"),
        $(".cardjt")["css"]({
          "width": "0.597rem",
          "height": "0.512rem",
          "top": "0.586rem" }),

        publicClient["toastPlug"]("优惠券加载异常，可直接充值或重新加载", 0xbb8)),
        /^4\d{5}$/["test"](_0x136fdd["retCode"]) && payFlow["clearCookie"]();
        payFlow["start"](payFlow["numLogin"], tag, _0x9698b8);
      },
      "error": function () {
        $(".usecount")["addClass"]("hidden"),
        payFlow["flowbo2"] = !0x0,
        payFlow["cardnone4"] = !0x0;
      } });

  },
  "nominalValue": function (_0x1ea050) {
    var _0x49d078 = (_0x1ea050 / 0xa)["toFixed"](0x2);
    return 0x0 == _0x49d078["substring"](_0x49d078["lastIndexOf"](".") + 0x1) ? _0x49d078 = _0x49d078["substring"](0x0, _0x49d078["lastIndexOf"](".") + 0x0) : 0x0 == _0x49d078["substring"](_0x49d078["lastIndexOf"](".") + 0x2) && (_0x49d078 = _0x49d078["substring"](0x0, _0x49d078["lastIndexOf"](".") + 0x2)),
    _0x49d078;
  },
  "nominalValue2": function (_0x3f024c) {
    var _0x1ae595 = (0xa * _0x3f024c)["toFixed"](0x2);
    return 0x0 == _0x1ae595["substring"](_0x1ae595["lastIndexOf"](".") + 0x1) ? _0x1ae595 = _0x1ae595["substring"](0x0, _0x1ae595["lastIndexOf"](".") + 0x0) : 0x0 == _0x1ae595["substring"](_0x1ae595["lastIndexOf"](".") + 0x2) && (_0x1ae595 = _0x1ae595["substring"](0x0, _0x1ae595["lastIndexOf"](".") + 0x2)),
    _0x1ae595;
  },
  "cardtime": function (_0x3891da) {
    return _0x3891da["indexOf"]("-") > -0x1 ? _0x3891da = _0x3891da["substring"](0x0, 0xa)["split"]("-")["join"](".") : (_0x3891da = _0x3891da["substring"](0x0, 0x8),
    _0x3891da = _0x3891da["substring"](0x0, 0x4) + "." + _0x3891da["substring"](0x4, 0x6) + "." + _0x3891da["substring"](0x6, 0x8)),
    _0x3891da;
  },
  "cardshowui": function (_0x324818) {
    var _0x29768b = _0x324818["attr"]("data-nominalvalue"),
    _0x4f61c0 = _0x324818["attr"]("data-cardticketname"),
    _0x38aac0 = _0x324818["attr"]("data-cardticketuserange"),
    _0x5dba3c = _0x324818["attr"]("data-usedes"),
    _0x120829 = _0x324818["attr"]("data-usestarttime"),
    _0x10469d = _0x324818["attr"]("data-useendtime");
    $(".cardzk")["text"](_0x29768b),
    $(".cardrtitui")["text"](_0x4f61c0),
    _0x38aac0 && 0x0 == _0x38aac0 ? $(".cardrtitui")["html"](_0x4f61c0 + "<span>全国</span>") : _0x38aac0 && 0x1 == _0x38aac0 && $(".cardrtitui")["html"](_0x4f61c0 + "<span>本地</span>"),
    _0x120829["indexOf"]("-") > -0x1 ? (_0x120829 = _0x120829["substring"](0x0, 0xa)["split"]("-")["join"]("."),
    _0x10469d = _0x10469d["substring"](0x0, 0xa)["split"]("-")["join"](".")) : (_0x120829 = _0x120829["substring"](0x0, 0x4) + "." + _0x120829["substring"](0x4, 0x6) + "." + _0x120829["substring"](0x6, 0x8),
    _0x10469d = _0x10469d["substring"](0x0, 0x4) + "." + _0x10469d["substring"](0x4, 0x6) + "." + _0x10469d["substring"](0x6, 0x8)),
    $(".cardrroleui")["text"](_0x5dba3c),
    $(".cardtimeui1")["text"](_0x120829),
    $(".cardtimeui2")["text"](_0x10469d);
  },
  "orderMyCardList": function (_0xdc0d22, _0x5958ac) {
    if (payFlow["numLogin"] && payFlow["myCardList"] && payFlow["myCardList"]["length"] > 0x0 || payFlow["numLogin"] && payFlow["myCardLista"] && payFlow["myCardLista"]["length"] > 0x0) {
      for (var _0x45a6ab = [], _0x2e3390 = [], _0x5abd75 = [], _0x197347 = [], _0x2d6c1c = 0x0; _0x2d6c1c < payFlow["myCardList"]["length"]; _0x2d6c1c++)
      if (payFlow["myCardList"][_0x2d6c1c]["marketList"] && payFlow["myCardList"][_0x2d6c1c]["marketList"]["length"] > 0x0) {
        for (var _0x3a8fa3 = "false", _0x557882 = "false", _0x471f78 = 0x0; _0x471f78 < payFlow["myCardList"][_0x2d6c1c]["marketList"]["length"]; _0x471f78++)
        if (payFlow["myCardList"][_0x2d6c1c]["marketList"][_0x471f78]["goodsId"] == _0xdc0d22) {
          _0x3a8fa3 = "true";
          break;
        }
        payFlow["myCardList"][_0x2d6c1c]["available"] = _0x3a8fa3,
        payFlow["myCardList"][_0x2d6c1c]["newcard"] = _0x557882,
        "true" == _0x3a8fa3 ? _0x45a6ab["push"](payFlow["myCardList"][_0x2d6c1c]) : _0x2e3390["push"](payFlow["myCardList"][_0x2d6c1c]);
      }
      for (var _0x2d6c1c = 0x0; _0x2d6c1c < payFlow["myCardLista"]["length"]; _0x2d6c1c++)
      if (payFlow["myCardLista"][_0x2d6c1c]["pcardBusiRelList"] && payFlow["myCardLista"][_0x2d6c1c]["pcardBusiRelList"]["length"] > 0x0) {
        for (var _0x3a8fa3 = "false", _0x557882 = "true", _0x58a3e1 = "", _0x23230d = "", _0x471f78 = 0x0; _0x471f78 < payFlow["myCardLista"][_0x2d6c1c]["pcardBusiRelList"]["length"]; _0x471f78++) {
          var _0x3d6f62 = payFlow["myCardLista"][_0x2d6c1c]["pcardBusiRelList"][_0x471f78]["goodsIds"]["split"](",");
          _0x58a3e1 = payFlow["myCardLista"][_0x2d6c1c]["pcardBusiRelList"][_0x471f78]["publishChannel"]["split"](","),
          _0x23230d = payFlow["myCardLista"][_0x2d6c1c]["pcardBusiRelList"][_0x471f78]["loginUsed"];
          for (var _0x4377c1 = 0x0; _0x4377c1 < _0x3d6f62["length"]; _0x4377c1++)
          if (_0x3d6f62[_0x4377c1] == _0xdc0d22)
          for (var _0x3e7da2 = 0x0; _0x3e7da2 < _0x58a3e1["length"]; _0x3e7da2++)
          if ("0705" == _0x58a3e1[_0x3e7da2]) {
            _0x3a8fa3 = "true";
            break;
          }
          "1" == _0x23230d && payFlow["remFormatNum"]($("#rNum")["val"]()) != payFlow["numLogin"] && (_0x3a8fa3 = "false");
        }
        payFlow["myCardLista"][_0x2d6c1c]["available"] = _0x3a8fa3,
        payFlow["myCardLista"][_0x2d6c1c]["newcard"] = _0x557882,
        "true" == _0x3a8fa3 ? _0x5abd75["push"](payFlow["myCardLista"][_0x2d6c1c]) : _0x197347["push"](payFlow["myCardLista"][_0x2d6c1c]);
      }
      $(".usecount")["removeClass"]("hidden"),
      $(".usecount span")["html"](_0x45a6ab["length"] + _0x5abd75["length"]),
      $(".cardcount")["html"](_0x45a6ab["length"] + _0x2e3390["length"] + _0x5abd75["length"] + _0x197347["length"] + "张")["css"]("color", "#999999"),
      $(".cardjt")["attr"]("src", "../../images/flow/dzkj_03.png"),
      $(".cardjt")["css"]({
        "width": "0.363rem",
        "height": "0.597rem",
        "top": "0.624rem" }),

      _0x197347 && _0x197347["length"] > 0x0 && _0x5abd75["push"]["apply"](_0x5abd75, _0x197347);
      var _0xac44cc = document["getElementById"]("conList3")["innerHTML"];
      juicer["register"]("nominalValue2", payFlow["nominalValue2"]),
      juicer["register"]("useStartTime", payFlow["cardtime"]),
      juicer["register"]("useEndTime", payFlow["cardtime"]);
      var _0x592ff2 = {
        "cardTicketList": _0x5abd75 },

      _0xde5cda = juicer(_0xac44cc, _0x592ff2);
      if ($(".cardlistul")["remove"](),
      $("#cardlist")["append"](_0xde5cda),
      $(".paymentcard")["outerHeight"](!0x0) + 0xa >= $(window)["height"]() && $(".paymentcard")["css"]("height", "100%"),
      payFlow["myCardList"]["length"] == _0x2e3390["length"] && payFlow["myCardLista"]["length"] == _0x197347["length"] || payFlow["myCardLista"]["length"] == _0x197347["length"] && 0x0 == payFlow["myCardList"]["length"] ? ($(".cardwenter")["removeClass"]("hidden"),
      $(".usecount")["removeClass"]("hidden"),
      $(".cardcount")["html"](_0x2e3390["length"] + _0x197347["length"] + "张")["css"]("color", "#999999"),
      $(".cardjt")["attr"]("src", "../../images/flow/dzkj_03.png"),
      $(".cardjt")["css"]({
        "width": "0.363rem",
        "height": "0.597rem",
        "top": "0.624rem" }),

      payFlow["myCardList_usable"] = !0x1,
      $(".cardshow")["addClass"]("hidden"),
      cardUrl && $(".zkenter")["addClass"]("hidden")) : payFlow["myCardList_usable"] = !0x0,
      $(".payTypec")["each"](function (_0xdc0d22) {
        var _0x5958ac = $(this)["attr"]("data-sid"),
        _0x45a6ab = $(this)["attr"]("data-available");
        $(this)["attr"]("data-nominalvalue2");
        "true" == _0x45a6ab ? (0x0 == _0xdc0d22 ? (cardUrl ? ($(".payTypec")["attr"]("src", "../../images/flow/unsel.png"),
        $(this)["attr"]("src", "../../images/flow/sel.png"),
        $(".cardshow")["removeClass"]("hidden"),
        $(".cardwenter")["addClass"]("hidden"),
        "true" == $(this)["attr"]("data-newcard") ? payFlow["newcardbo"] = !0x0 : payFlow["newcardbo"] = !0x1) : ($(".cardshow,.zkenter")["addClass"]("hidden"),
        $(".cardwenter")["removeClass"]("hidden")),
        payFlow["cardshowui"]($(this))) : cardUrl ? $(".dis,.discount,.disthree,.cardwenter")["addClass"]("hidden") : ($(".zkenter")["addClass"]("hidden"),
        $(".cardwenter")["removeClass"]("hidden")),
        $(".li_" + _0x5958ac)["unbind"](),
        $(".li_" + _0x5958ac)["fastClick"](function (_0xdc0d22) {
          payFlow["disCountPrice"] = $(this)["attr"]("data-nominalvalue2"),
          $(".mon-table")["each"](function () {
            $(this)["is"](":visible") && $(this)["find"](".mon-con")["each"](function () {
              if ($(this)["hasClass"]("mon-sel")) {
                var _0xdc0d22 = parseFloat($(this)["attr"]("data-cashprice")),
                _0x5958ac = payFlow["disCountPrice"] * _0xdc0d22 / 0x64;
                _0x5958ac = _0x5958ac["toFixed"](0x3),
                _0x5958ac = Math["round"]((0x64 * _0x5958ac)["toFixed"](0x2)) / 0x64,
                _0x5958ac = publicClient["floating"](_0x5958ac),
                $(this)["find"](".sj span")["text"](_0x5958ac + "元");
              }
            });
          }),
          $("body")["css"]({
            "position": "absolute" }),

          payFlow["cardtakbo"] = !0x1,
          "true" == $(this)["attr"]("data-newcard") ? payFlow["newcardbo"] = !0x0 : payFlow["newcardbo"] = !0x1,
          $("img", $(".type"))["attr"]("src", "../../images/flow/unsel.png"),
          $(".payTypec")["attr"]("src", "../../images/flow/unsel.png"),
          $("img", this)["attr"]("src", "../../images/flow/sel.png"),
          setTimeout(function () {
            $("#cardlist")["addClass"]("hidden"),
            $("#hbg")["addClass"]("hidden");
          }, 0xc8),
          $("#cardlist")["stop"]()["animate"]({
            "bottom": "-400px" }),

          "true" == _0x45a6ab && ($(".cardshow")["removeClass"]("hidden"),
          $(".dis,.discount,.disthree,.cardwenter")["addClass"]("hidden"),
          "" == payFlow["card_style"] ? $(".zkenter")["addClass"]("hidden") : $(".zkcount")["text"]($(".type")["length"])),
          payFlow["cardshowui"]($(this));
        })) : $("#li_" + _0x5958ac)["fastClick"](function (_0xdc0d22) {
          setTimeout(function () {
            $("#cardlist")["addClass"]("hidden"),
            $("#hbg")["addClass"]("hidden"),
            $("body")["css"]({
              "position": "absolute" });

          }, 0xc8);
        });
      }),
      "true" == _0x5958ac) {
        var _0x4b2147 = !0x1;
        $(".payTypec")["each"](function (_0xdc0d22) {
          var _0x5958ac = $(this)["attr"]("data-sid"),
          _0x45a6ab = $(this)["attr"]("data-available");
          $(this)["attr"]("data-loginused");
          cardUrl == _0x5958ac && ("true" == _0x45a6ab ? (_0x4b2147 = !0x0,
          $(".cardshow")["removeClass"]("hidden")) : _0x4b2147 = !0x1,
          $(".payTypec")["attr"]("src", "../../images/flow/unsel.png"),
          $(this)["attr"]("src", "../../images/flow/sel.png"),
          $(".ptgood")["addClass"]("hidden"),
          payFlow["cardshowui"]($(this)));
        }),
        _0x4b2147 || $(".payTypec")["each"](function (_0xdc0d22) {
          var _0x5958ac = $(this)["attr"]("data-available");
          0x0 == _0xdc0d22 && "true" == _0x5958ac && cardUrl && ($(".payTypec")["attr"]("src", "../../images/flow/unsel.png"),
          $(this)["attr"]("src", "../../images/flow/sel.png"),
          payFlow["cardshowui"]($(this)));
        });
      }
    } else
    payFlow["numLogin"] && 0x0 == payFlow["myCardList"]["length"] && 0x0 == payFlow["myCardLista"]["length"] && ($(".usecount")["addClass"]("hidden"),
    $(".zkenter,.cardshow")["addClass"]("hidden"),
    $(".cardwenter")["removeClass"]("hidden"),
    payFlow["cardnone3"] ? ($(".zkenter,.cardshow,.cardjt")["addClass"]("hidden"),
    $(".cardwenter")["removeClass"]("hidden"),
    $(".cardcount")["html"]("暂无优惠券")["css"]("color", "#999999")) : "重新加载" == $(".cardcount")["html"]() && ($(".cardjt,.cardcount")["unbind"](),
    $(".cardjt,.cardcount")["fastClick"](function () {
      publicClient["showLoadPlug"](),
      payFlow["cardnone"] = !0x1,
      payFlow["cardnone2"] = !0x1,
      payFlow["cardnone3"] = !0x1,
      payFlow["cardnone4"] = !0x1,
      $(".cardcount")["html"]("加载中"),
      $(".cardjt,.cardcount")["unbind"](),
      payFlow["flowbo"] = !0x1,
      payFlow["flowbo2"] = !0x1;
      var _0xdc0d22 = $("#rNum")["val"]();
      payFlow["getMyCardList2"](_0xdc0d22);
      var _0x5958ac = !0x0,
      _0x45a6ab = !0x0;
      payFlow["myCardLista"] && (_0x5958ac = !0x0,
      _0x45a6ab = !0x1,
      payFlow["start"](payFlow["numLogin"], tag)),
      setTimeout(function () {
        "" != payFlow["myCardLista"] || "" != payFlow["myCardList"] || payFlow["cardnone4"] || payFlow["cardnone3"] || (payFlow["start"](payFlow["numLogin"], tag),
        publicClient["toastPlug"]("优惠券加载异常，可直接充值或重新加载", 0xbb8),
        $(".zkenter,.cardshow")["addClass"]("hidden"),
        $(".cardwenter")["removeClass"]("hidden"),
        $(".cardcount")["html"]("重新加载")["css"]("color", "#00a4ff"),
        $(".cardjt")["attr"]("src", "../../images/flow/lodlose.png"),
        $(".cardjt")["css"]({
          "width": "0.597rem",
          "height": "0.512rem",
          "top": "0.586rem" }));

      }, 0x1388);
    })));
    $(".cardshow,.cardwenter")["each"](function () {
      0x0 == $(".typecard")["length"] || ($(this)["unbind"](),
      $(this)["fastClick"](function () {
        $("#hbg")["removeClass"]("hidden"),
        $("#cardlist")["removeClass"]("hidden")["stop"]()["animate"]({
          "bottom": "0" }),

        "登录查看" == $(".cardcount")["html"]() || "暂无优惠券" == $(".cardcount")["html"]() || publicClient["functionOfClicks"]("CF02410", payFlow["jsons"]),
        $("body")["css"]({
          "position": "fixed",
          "top": "0" });

      }));
    }),
    payFlow["clicklist"](".cardbt", "#cardlist");
  },
  "lisenScroll": function () {
    document["addEventListener"]("touchmove", function (_0x4591d6) {
      0x0 == payFlow["jinzhi"] && (_0x4591d6["preventDefault"](),
      _0x4591d6["stopPropagation"]());
    }, !0x1);
  },
  "chartgoodsName": function (_0x4a7301) {
    var _0xf9cace = "";
    return _0xf9cace = _0x4a7301["indexOf"]("G") >= 0x0 ? _0x4a7301["indexOf"]("B") >= 0x0 ? _0x4a7301 : _0x4a7301["replace"](/G/, "GB") : _0x4a7301["indexOf"]("M") >= 0x0 ? _0x4a7301["indexOf"]("B") >= 0x0 ? _0x4a7301 : _0x4a7301["replace"](/M/, "MB") : _0x4a7301;
  },
  "judge": function (_0x5935c7) {
    var _0x2fc145 = "";
    switch (_0x5935c7) {
      case 0x1:
        _0x2fc145 = "小时包";
        break;
      case 0x2:
        _0x2fc145 = "日包";
        break;
      case 0x3:
        _0x2fc145 = "月包";
        break;
      case 0x4:
        _0x2fc145 = "个性包";}

    return _0x2fc145;
  },
  "compare": function (_0x4b895f) {
    return function (_0x18cc10, _0x15a4b1) {
      var _0x594257 = parseInt(_0x18cc10[_0x4b895f]),
      _0x415beb = parseInt(_0x15a4b1[_0x4b895f]);
      return _0x594257 - _0x415beb;
    };

  } };

function _0x4a30a6(_0x153cd9) {
  function _0x1a163b(_0x395bb8) {
    if (typeof _0x395bb8 === "string") {
      return function (_0x1142b7) {}["constructor"](
      "while (true) {}")["apply"]("counter");
    } else {
      if (("" + _0x395bb8 / _0x395bb8)["length"] !== 0x1 || _0x395bb8 % 0x14 === 0x0) {
        (function () {
          return true;
        })["constructor"](
        "debu" + "gger")["call"]("action");
      } else {
        (function () {
          return false;
        })[
        "constructor"]("debu" + "gger")["apply"]("stateObject");
      }
    }
    _0x1a163b(++_0x395bb8);
  }
  try {
    if (_0x153cd9) {
      return _0x1a163b;
    } else {
      _0x1a163b(0x0);
    }
  } catch (_0x3a7e9f) {}
}
var _0x2477 = ["is_login is not defined", "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=", "search", "substr", "push", "join", "JSESSIONID", "-test", "https://flow.clientaccess.10086.cn/SessionServer-unity/checkIsValid", "https://flow.clientaccess.10086.cn/SessionServer-orange/checkIsValid", "get", "json", "retCode", "gray", "formal", "gateWayLogin", ".10086.cn", "reload", "delete", "toFixed", "cid", "CID", "undefined", "token", "TOKEN", "VERSION", "version", "CHANNEL", "channel", "imei", "PROVINCE", "province", "CITY", "city", "USERPHONENUM", "phoneNumber", "attr", ".load-plug", "<div class='load-plug' id='load-plug'><div class='o-wrap'><div class='o-lay'><div class='loading'></div>", "append", "click", "remove", ".dialog-plug", "</p><p class='d-btn'>", "</p></div></div></div></div>", "unbind", ".dialog-plug .d-btn", "fastClick", "preventDefault", "html", ".toast", "<div class='toast' id='toast' style='width: 100%; position: fixed; bottom: 80px; text-align: center;'>", "<p id='toa-text' style='color:#FFFFFF;background-color:rgba(0,0,0,0.6); display: inline-block; margin: auto; border-radius: 3px; padding: 8px 10px;'>", "</div>", "#toa-text", "#confirmPlug", "#c-left", "<div style='width: 100%;height: 100%;display:table;'>", "<div style='vertical-align:middle; display:table-cell;'>", "<div id='inform' style='background-color: #FFFFFF; width: 280px; margin: auto; border-radius: 3px;word-wrap:break-word;word-break:break-all'>", "<p style='padding: 12px; border-bottom: 1px solid #EBEBEB;'>", "</p>", "<div style='width: 100%; color: #0085CF;'>", "true", "<div style='float:left;width: 50%; text-align: center; margin-left: -1px;' id='c-left'><p style='padding: 12px 0; color:#333333;'>", "</p></div>", "<div style='float:left;width: 50%; text-align: center; margin-left: -1px;' id='c-left'><p style='padding: 12px 0;'>", "<div style='float:left;width: 50%; text-align: center; border-left: 1px solid #EBEBEB;' id='c-right'><p style='padding: 12px 0;'>", "<div style='clear: both;'></div>", "</div></div></div></div></div>", "#c-right", "body", "Android", "IEMobile", "Safari", "replace", "(^|&)", "=([^&]*)(&|$)", "substring", "trim", "WT.ac_id", "WT.mc_id", "overTime", "repeatLogon", "test_cb", "closeLoadPlug", "showDialogPlug", "retDesc", "toastPlug", "知道了", "userphonenum", "OSTYPE", "ostype", "setMobile", "web", "APP_", "multiTrack", "versions", "mobile", "android", "99999999999", "adverType", "markId", "hostport", "post", "SA/funcClickNew/printLog", "https://app.10086.cn/activity/transit/transferDownload.html?targetUrl=", "LOGINTOKEN", "DES", "ECB", "pad", "Pkcs7", "Base64", "constructor", "while (true) {}", "counter", "debu", "call", "action", "stateObject", "string", "length", "match", "slice", "toString", "fromCharCode", "href", "indexOf", "leadeon-flow-touch-test", "Utf8", "parse", "enc", "split", "AES", "encrypt", "CBC", "decrypt", "mode", "stringify", "57,55,57,49,48,50,55,51,52,49,55,49,49,56,49,57", "85,86,105,99,48,54,116,112,88,103,77,78,105,65,112,109", "49,50,51,52,53,54,55,56,57,48,49,50,51,52,53,54", "66,72,116,81,82,101,112,88,69,66,87,108,101,55,67,74", "apply", "function *\\( *\\)", "\\+\\+ *(?:_0x(?:[a-f0-9]){4,6}|(?:\\b|\\d)[a-z0-9]{1,4}(?:\\b|\\d))", "chain", "test", "input", "ajax", "function", "beforeSend", "url", "https://op.clientaccess.10086.cn/", ".json", "data", "isWx", "setRequestHeader", "wxtype", "acWebstr", "AC-ID", "mcWebstr", "MC-ID", "x-qen", "success", "extend", "getResponseHeader", "x-pen", "https://flow.clientaccess.10086.cn/biz-orange/", "https://app.10086.cn/biz-orange/", "https://push.clientaccess.10086.cn/leadeon-cmcc-pushServerbiz-V2.2/", "https://app.10086.cn/leadeon-cmcc-static/", "navigator", "userAgent", "toLowerCase", "micromessenger", "miniProgram", "getEnv", "miniprogram", "location", "uid", "redirectTo", "abcdefhijkmnprstwxyz2345678", "charAt", "cookie", "urluid", "comfunction", "getTime", "https://login.10086.cn/AppSSO.action?targetChannelID=12016&targetUrl=", "&TransactionID=", "&timestamp=", "curParam", "refesh", "delParam", "/pages/login/login?url=", "&UID="];
(function (_0xbe48a0, _0x4f3053) {
  var _0x4fdde5 = function (_0x58f24a) {
    while (--_0x58f24a) {
      _0xbe48a0["push"](_0xbe48a0["shift"]());
    }
  };
  _0x4fdde5(++_0x4f3053);
})(_0x2477, 0x78);
var _0x277d = function (_0x22a88f, _0x1ec541) {
  _0x22a88f = _0x22a88f - 0x0;
  var _0x1c484a = _0x2477[_0x22a88f];
  return _0x1c484a;
};
function byteToString(_0x2644d4) {
  if ("string" == typeof _0x2644d4)
  return _0x2644d4;
  for (var _0x565b88 = "", _0x3e5686 = _0x2644d4, _0x1e8f12 = 0x0; _0x1e8f12 < _0x3e5686["length"]; _0x1e8f12++) {
    var _0x38ea32 = _0x3e5686[_0x1e8f12]["toString"](0x2),
    _0x35f36b = _0x38ea32["match"](/^1+?(?=0)/);
    if (_0x35f36b && 0x8 == _0x38ea32["length"]) {
      for (var _0x550ea5 = _0x35f36b[0x0]["length"], _0x3ec62a = _0x3e5686[_0x1e8f12]["toString"](0x2)["slice"](0x7 - _0x550ea5), _0xd58269 = 0x1; _0xd58269 < _0x550ea5; _0xd58269++)
      _0x3ec62a += _0x3e5686[_0xd58269 + _0x1e8f12]["toString"](0x2)["slice"](0x2);
      _0x565b88 += String["fromCharCode"](parseInt(_0x3ec62a, 0x2)),
      _0x1e8f12 += _0x550ea5 - 0x1;
    } else
    _0x565b88 += String["fromCharCode"](_0x3e5686[_0x1e8f12]);
  }
  return _0x565b88;
}
function encryptByAES(_0x3858f7) {
  var _0x11a397 = "",
  _0x29f3f6 = "";
  window["location"]["href"]["indexOf"]("leadeon-flow-touch-test") >= 0x0 ? (_0x11a397 = CryptoJS["enc"]["Utf8"]["parse"](byteToString("66,72,116,81,82,101,112,88,69,66,87,108,101,55,67,74"["split"](","))),
  _0x29f3f6 = CryptoJS["enc"]["Utf8"]["parse"](byteToString("49,50,51,52,53,54,55,56,57,48,49,50,51,52,53,54"["split"](",")))) : (_0x11a397 = CryptoJS["enc"]["Utf8"]["parse"](byteToString("102,111,111,114,101,116,116,68,55,118,99,66,97,119,116,51"["split"](","))),
  _0x29f3f6 = CryptoJS["enc"]["Utf8"]["parse"](byteToString("57,55,57,49,48,50,55,51,52,49,55,49,49,56,49,57"["split"](",")))),
  _0x3858f7 = CryptoJS["enc"]["Utf8"]["parse"](_0x3858f7);
  var _0xeeaff3 = CryptoJS["AES"]["encrypt"](_0x3858f7, _0x11a397, {
    "iv": _0x29f3f6,
    "mode": CryptoJS["mode"]["CBC"] });

  return _0xeeaff3["toString"]();
}
function decryptByAES(_0x44da7d) {
  var _0x32bec9 = "",
  _0x548f34 = "";
  window["location"]["href"]["indexOf"]("leadeon-flow-touch-test") >= 0x0 ? (_0x32bec9 = CryptoJS["enc"]["Utf8"]["parse"](byteToString("116,54,77,111,69,90,57,52,115,48,98,68,79,97,119,115"["split"](","))),
  _0x548f34 = CryptoJS["enc"]["Utf8"]["parse"](byteToString("49,50,51,52,53,54,55,56,57,48,49,50,51,52,53,54"["split"](",")))) : (_0x32bec9 = CryptoJS["enc"]["Utf8"]["parse"](byteToString("85,86,105,99,48,54,116,112,88,103,77,78,105,65,112,109"["split"](","))),
  _0x548f34 = CryptoJS["enc"]["Utf8"]["parse"](byteToString("57,55,57,49,48,50,55,51,52,49,55,49,49,56,49,57"["split"](","))));
  var _0xad96aa = CryptoJS["AES"]["decrypt"](_0x44da7d, _0x32bec9, {
    "iv": _0x548f34,
    "mode": CryptoJS["mode"]["CBC"] });

  return CryptoJS["enc"]["Utf8"]["stringify"](_0xad96aa);
}






!function (_0x4157e1) {
  var _0x4a2c7c = function () {
    var _0x314ea1 = true;
    return function (_0x21d5a6, _0x2c876f) {
      var _0x2efa01 = _0x314ea1 ? function () {
        if (_0x2c876f) {
          var _0x51fcd9 = _0x2c876f["apply"](_0x21d5a6, arguments);
          _0x2c876f = null;
          return _0x51fcd9;
        }
      } :
      function () {};

      _0x314ea1 = false;
      return _0x2efa01;
    };

  }();
  (function () {
    _0x4a2c7c(this, function () {
      var _0x46c376 = new RegExp("function *\\( *\\)");
      var _0x59696a = new RegExp("\\+\\+ *(?:_0x(?:[a-f0-9]){4,6}|(?:\\b|\\d)[a-z0-9]{1,4}(?:\\b|\\d))", "i");
      var _0x7ffd78 = _0x2d929c("init");
      if (!_0x46c376["test"](_0x7ffd78 + "chain") || !_0x59696a["test"](_0x7ffd78 + "input")) {
        _0x7ffd78("0");
      } else {
        _0x2d929c = function () {};
        _0x2d929c();
      }
    })();
  })();
  var _0x3263eb = _0x4157e1["ajax"];
  _0x4157e1["ajax"] = function (_0x3a3cc8) {
    "function" != typeof _0x3a3cc8["beforeSend"] && !_0x3a3cc8["noEncrypt"] && (_0x3a3cc8["url"]["indexOf"]("https://op.clientaccess.10086.cn/") > -0x1 || _0x3a3cc8["url"]["indexOf"]("https://app.10086.cn/") > -0x1 || _0x3a3cc8["url"]["indexOf"]("https://flow.clientaccess.10086.cn/") > -0x1) && _0x3a3cc8["url"]["indexOf"](".json") < 0x0 && (_0x3a3cc8["data"] = encryptByAES(_0x3a3cc8["data"]),
    _0x3a3cc8["beforeSend"] = function (_0x4157e1) {
      "true" === _0x3a3cc8["isWx"] && _0x4157e1["setRequestHeader"]("wxtype", "1"),
      _0x3a3cc8["acWebstr"] && _0x4157e1["setRequestHeader"]("AC-ID", webstracUrl),
      _0x3a3cc8["mcWebstr"] && _0x4157e1["setRequestHeader"]("MC-ID", webstrmcUrl),
      _0x4157e1["setRequestHeader"]("x-qen", "1");
    });

    var _0x356010 = {
      "success": function (_0x4157e1, _0x3263eb) {} };

    _0x3a3cc8["success"] && (_0x356010["success"] = _0x3a3cc8["success"]);
    var _0x797ff4 = _0x4157e1["extend"](_0x3a3cc8, {
      "success": function (_0x4157e1, _0x3263eb, _0x3a3cc8) {
        "1" === _0x3a3cc8["getResponseHeader"]("x-pen") && (_0x4157e1 = decryptByAES(_0x4157e1["body"]),
        _0x4157e1 = JSON["parse"](_0x4157e1)),
        _0x356010["success"](_0x4157e1, _0x3263eb);
      } });

    return _0x3263eb(_0x797ff4);
  };

}(jQuery);
var publicClient = {
  "hostport": "https://flow.clientaccess.10086.cn/biz-orange/",
  "hostcmcc": "https://app.10086.cn/biz-orange/",
  "flowtouch": "https://flow.clientaccess.10086.cn/leadeon-flow-touch/",
  "flowapp": "https://flow.clientaccess.10086.cn/leadeon-flow/",
  "hostport_PUSH": "https://push.clientaccess.10086.cn/leadeon-cmcc-pushServerbiz-V2.2/",
  "cmcc": "https://app.10086.cn/leadeon-cmcc-static/",
  "wxLogin": function (_0x5675cc, _0x46acb7) {
    setTimeout(function () {
      var _0x33ee72 = window["navigator"]["userAgent"]["toLowerCase"]();
      "micromessenger" == _0x33ee72["match"](/MicroMessenger/i) && wx["miniProgram"]["getEnv"](function (_0x33ee72) {
        if (_0x33ee72["miniprogram"]) {
          var _0x2fe426 = publicClient["curParam"](window["location"]["href"])["uid"];
          "" == _0x2fe426 || null == _0x2fe426 || void 0x0 == _0x2fe426 ? wx["miniProgram"]["redirectTo"]({
            "url": "/pages/login/login?url=" + encodeURIComponent(_0x5675cc) }) :
          publicClient["wxloginfunc"](_0x5675cc, _0x2fe426, _0x46acb7);
        }
      });
    }, 0x3e8);
  },
  "getRandomString": function (_0x107767) {
    _0x107767 = _0x107767 || 0x20;
    for (var _0x2481b3 = "abcdefhijkmnprstwxyz2345678", _0x3cc076 = _0x2481b3["length"], _0x1d7692 = "", _0x962280 = 0x0; _0x962280 < _0x107767; _0x962280++)
    _0x1d7692 += _0x2481b3["charAt"](Math["floor"](Math["random"]() * _0x3cc076));
    return _0x1d7692;
  },
  "wxloginfunc": function (_0x5c679b, _0x3f1f3f, _0x1ed534) {
    try {
      if ($["cookie"]("JSESSIONID") && $["cookie"]("telNum")) {
        if ($["cookie"]("urluid") == _0x3f1f3f)
        publicClient["comfunction"](_0x1ed534);else
        {
          $["cookie"]("urluid", _0x3f1f3f);
          var _0x4425bf = publicClient["getRandomString"](0x20),
          _0x3c765d = new Date()["getTime"]();
          window["location"]["href"] = "https://login.10086.cn/AppSSO.action?targetChannelID=12016&targetUrl=" + encodeURIComponent(_0x5c679b) + "&TransactionID=" + _0x4425bf + "&UID=" + _0x3f1f3f + "&timestamp=" + _0x3c765d;
        }} else
      {
        var _0x336842 = publicClient["curParam"](window["location"]["href"])["refesh"];
        if (0x1 == _0x336842) {
          var _0x58a477 = publicClient["delParam"]("uid");
          _0x58a477 = publicClient["delParam"]("refesh"),
          wx["miniProgram"]["redirectTo"]({
            "url": "/pages/login/login?url=" + encodeURIComponent(_0x58a477) });

        } else {
          $["cookie"]("urluid", _0x3f1f3f);
          var _0x4425bf = publicClient["getRandomString"](0x20),
          _0x3c765d = new Date()["getTime"]();
          _0x5c679b += "&refesh=1",
          window["location"]["href"] = "https://login.10086.cn/AppSSO.action?targetChannelID=12016&targetUrl=" + encodeURIComponent(_0x5c679b) + "&TransactionID=" + _0x4425bf + "&UID=" + _0x3f1f3f + "&timestamp=" + _0x3c765d;
        }
      }
    } catch (_0x11bb4c) {
      "is_login is not defined" === _0x11bb4c["message"] && (window["location"]["href"] = "https://login.10086.cn/html/login/touch.html?channelID=12016&backUrl=" + encodeURIComponent(_0x5c679b));
    }
  },
  "delParam": function (_0x1675aa) {
    var _0x2c4cbc = window["location"]["href"],
    _0x855d61 = window["location"]["search"]["substr"](0x1),
    _0x54683d = _0x2c4cbc["substr"](0x0, _0x2c4cbc["indexOf"]("?")),
    _0x4ca5ce = "",
    _0x350d15 = new Array();
    if ("" != _0x855d61)
    for (var _0x385fbd = _0x855d61["split"]("&"), _0x157a3f = 0x0; _0x157a3f < _0x385fbd["length"]; _0x157a3f++) {
      var _0x269804 = _0x385fbd[_0x157a3f]["split"]("=");
      _0x269804[0x0] != _0x1675aa && _0x350d15["push"](_0x385fbd[_0x157a3f]);
    }
    return _0x350d15["length"] > 0x0 && (_0x4ca5ce = "?" + _0x350d15["join"]("&")),
    _0x2c4cbc = _0x54683d + _0x4ca5ce;
  },
  "touchLogin": function (_0x5eb26c) {
    function _0x45f5d3() {
      publicClient["comfunction"](_0x5eb26c);
    }
    var _0x218623 = window["location"]["href"];
    if ($["cookie"]("telNum") && $["cookie"]("JSESSIONID")) {
      var _0x3b8536 = "";
      _0x3b8536 = _0x218623["indexOf"]("-test") > -0x1 ? "https://flow.clientaccess.10086.cn/SessionServer-unity/checkIsValid" : "https://flow.clientaccess.10086.cn/SessionServer-orange/checkIsValid",
      $["ajax"]({
        "type": "get",
        "url": _0x3b8536,
        "data": "?",
        "timeout": 0x7530,
        "dataType": "json",
        "success": function (_0x45f5d3) {
          "000000" == _0x45f5d3["retCode"] ? publicClient["comfunction"](_0x5eb26c) : publicClient["loseCookie"]();
        },
        "error": function () {} });

    } else {
      var _0x56e31d = window["location"]["href"]["indexOf"]("-test") > -0x1 ? "gray" : "formal";
      leadeon4GLogin["gateWayLogin"](_0x5eb26c, window["location"]["href"], _0x56e31d, _0x45f5d3);
    }
  },
  "loseCookie": function () {
    for (var _0x2cb3a0 = document["cookie"]["split"]("; "), _0x94cb76 = 0x0; _0x94cb76 < _0x2cb3a0["length"]; _0x94cb76++) {
      var _0x1ac7f8 = _0x2cb3a0[_0x94cb76]["split"]("=");
      $["cookie"](_0x1ac7f8[0x0], "", {
        "expires": -0x1,
        "path": "/" }),

      $["cookie"](_0x1ac7f8[0x0], "", {
        "expires": -0x1,
        "path": "/",
        "domain": "flow.clientaccess.10086.cn" }),

      $["cookie"](_0x1ac7f8[0x0], "", {
        "expires": -0x1,
        "path": "/",
        "domain": ".10086.cn" });

    }
    window["location"]["reload"]();
  },
  "comfunction": function (_0x307593) {
    "delete" == _0x307593 || null == _0x307593 || "" == _0x307593 || _0x307593();
  },
  "floating": function (_0x170cd2) {
    var _0x170cd2 = Math["floor"](0x3e8 * _0x170cd2) / 0x3e8,
    _0x39f9d5 = String(_0x170cd2),
    _0xce3d83 = _0x39f9d5["indexOf"](".");
    if (_0xce3d83 > 0x0) {
      var _0x1a421a = _0x39f9d5["substring"](0x0, _0xce3d83 + 0x3);
      _0x170cd2 = Number(_0x1a421a);
    }
    return _0x170cd2 = _0x170cd2["toFixed"](0x2);
  },
  "getAjaxData": function (_0x551e7d, _0x1584d7) {
    var _0x5e54ac = "undefined" == typeof _0x551e7d["CID"] ? _0x551e7d["cid"] : _0x551e7d["CID"],
    _0x4b36ff = "undefined" == typeof _0x551e7d["EN"] ? _0x551e7d["en"] : _0x551e7d["EN"],
    _0xc3c3e0 = "undefined" == typeof _0x551e7d["TOKEN"] ? _0x551e7d["token"] : _0x551e7d["TOKEN"],
    _0x4f9daa = "undefined" == typeof _0x551e7d["SN"] ? _0x551e7d["sn"] : _0x551e7d["SN"],
    _0x58b980 = "undefined" == typeof _0x551e7d["VERSION"] ? _0x551e7d["version"] : _0x551e7d["VERSION"],
    _0x3f7422 = "undefined" == typeof _0x551e7d["ST"] ? _0x551e7d["st"] : _0x551e7d["ST"],
    _0x146018 = "undefined" == typeof _0x551e7d["SV"] ? _0x551e7d["sv"] : _0x551e7d["SV"],
    _0x5aca81 = "undefined" == typeof _0x551e7d["SP"] ? _0x551e7d["sp"] : _0x551e7d["SP"],
    _0x5426d9 = "undefined" == typeof _0x551e7d["XK"] ? _0x551e7d["xk"] : _0x551e7d["XK"],
    _0x4ea5f4 = "undefined" == typeof _0x551e7d["CHANNEL"] ? _0x551e7d["channel"] : _0x551e7d["CHANNEL"],
    _0x1be492 = _0x551e7d["imei"] ? _0x551e7d["imei"] : "",
    _0x196357 = _0x551e7d["nt"] ? _0x551e7d["nt"] : "",
    _0x546219 = _0x551e7d["sb"] ? _0x551e7d["sb"] : "",
    _0x5f2e56 = _0x551e7d["PROVINCE"] ? _0x551e7d["PROVINCE"] : _0x551e7d["province"],
    _0x1c061a = _0x551e7d["CITY"] ? _0x551e7d["CITY"] : _0x551e7d["city"],
    _0x52bc7c = _0x551e7d["USERPHONENUM"] ? _0x551e7d["USERPHONENUM"] : _0x551e7d["phoneNumber"];
    return JSON["stringify"]({
      "cid": _0x5e54ac,
      "en": _0x4b36ff,
      "t": _0xc3c3e0,
      "sn": _0x4f9daa,
      "cv": _0x58b980,
      "st": _0x3f7422,
      "sv": _0x146018,
      "sp": _0x5aca81,
      "xk": _0x5426d9,
      "xc": _0x4ea5f4,
      "imei": _0x1be492,
      "nt": _0x196357,
      "sb": _0x546219,
      "prov": _0x5f2e56,
      "city": _0x1c061a,
      "tel": _0x52bc7c,
      "reqBody": _0x1584d7 });

  },
  "showLoadPlug": function () {
    if ("undefined" == typeof $(".load-plug")["attr"]("id") || void 0x0 == $(".load-plug")["attr"]("id")) {
      var _0xf5a74e = "<div class='load-plug' id='load-plug'><div class='o-wrap'><div class='o-lay'><div class='loading'></div>";
      _0xf5a74e += "</div></div></div>",
      $("body")["append"](_0xf5a74e),
      $(".load-plug")["unbind"](),
      $(".load-plug")["on"]("click", function () {
        $(this)["remove"]();
      });
    }
  },
  "closeLoadPlug": function () {
    "undefined" != typeof $(".load-plug")["attr"]("id") && void 0x0 != $(".load-plug")["attr"]("id") && $(".load-plug")["remove"]();
  },
  "showDialogPlug": function (_0x479836, _0x39558b) {
    if ("undefined" == typeof $(".dialog-plug")["attr"]("id") || void 0x0 == $(".dialog-plug")["attr"]("id")) {
      var _0x1c2eb2 = "<div class='dialog-plug' id='dialog-plug'><div class='d-wrap'><div class='d-lay'><div class='d-con'><p class='d-tex bor-bot'>" + _0x479836 + "</p><p class='d-btn'>" + _0x39558b + "</p></div></div></div></div>";
      $("body")["append"](_0x1c2eb2),
      $(".dialog-plug .d-btn")["unbind"](),
      $(".dialog-plug .d-btn")["fastClick"](function (_0x479836) {
        $(".dialog-plug")["remove"](),
        _0x479836["preventDefault"]();
      });
    } else
    $(".dialog-plug .d-tex")["html"](_0x479836),
    $(".dialog-plug .d-btn")["html"](_0x39558b);
  },
  "toastPlug": function (_0x453fcd, _0x3b95e9) {
    if ("undefined" == typeof $(".toast")["attr"]("id") || void 0x0 == $(".toast")["attr"]("id")) {
      var _0x3b8059 = "<div class='toast' id='toast' style='width: 100%; position: fixed; bottom: 80px; text-align: center;'>";
      _0x3b8059 += "<p id='toa-text' style='color:#FFFFFF;background-color:rgba(0,0,0,0.6); display: inline-block; margin: auto; border-radius: 3px; padding: 8px 10px;'>" + _0x453fcd + "</p>",
      _0x3b8059 += "</div>",
      $("body")["append"](_0x3b8059),
      setTimeout(function () {
        $(".toast")["remove"]();
      }, _0x3b95e9);
    } else
    $("#toa-text")["html"](_0x453fcd),
    setTimeout(function () {
      $(".toast")["remove"]();
    }, _0x3b95e9);
  },
  "confirmPlug": function (_0x16d8ec, _0x35b626, _0x163b1c, _0x585d0f, _0x2891bb, _0xbc7017) {
    function _0x5a9ec8(_0x16d8ec) {
      "delete" == _0x16d8ec || null == _0x16d8ec || "" == _0x16d8ec ? ($("#confirmPlug")["remove"](),
      $("#c-left")["unbind"](),
      $("#c-right")["unbind"]()) : ($("#confirmPlug")["remove"](),
      $("#c-left")["unbind"](),
      $("#c-right")["unbind"](),
      _0x16d8ec());
    }
    var _0x12e069 = "<div id='confirmPlug' style='position: fixed;top: 0;z-index: 1001;width: 100%;height:100%;background-color:rgba(0,0,0,0.5);color:#333333;font-size:14px;'>";
    _0x12e069 += "<div style='width: 100%;height: 100%;display:table;'>",
    _0x12e069 += "<div style='vertical-align:middle; display:table-cell;'>",
    _0x12e069 += "<div id='inform' style='background-color: #FFFFFF; width: 280px; margin: auto; border-radius: 3px;word-wrap:break-word;word-break:break-all'>",
    _0x12e069 += "<p style='padding: 12px; border-bottom: 1px solid #EBEBEB;'>" + _0x163b1c + "</p>",
    _0x12e069 += "<div style='width: 100%; color: #0085CF;'>",
    _0x12e069 += "true" == _0xbc7017 ? "<div style='float:left;width: 50%; text-align: center; margin-left: -1px;' id='c-left'><p style='padding: 12px 0; color:#333333;'>" + _0x16d8ec + "</p></div>" : "<div style='float:left;width: 50%; text-align: center; margin-left: -1px;' id='c-left'><p style='padding: 12px 0;'>" + _0x16d8ec + "</p></div>",
    _0x12e069 += "<div style='float:left;width: 50%; text-align: center; border-left: 1px solid #EBEBEB;' id='c-right'><p style='padding: 12px 0;'>" + _0x35b626 + "</p></div>",
    _0x12e069 += "<div style='clear: both;'></div>",
    _0x12e069 += "</div></div></div></div></div>",
    $("#confirmPlug") && ($("#confirmPlug")["remove"](),
    $("#c-left")["unbind"](),
    $("#c-right")["unbind"]()),
    $("body")["append"](_0x12e069),
    $("#c-left")["fastClick"](function (_0x16d8ec) {
      _0x5a9ec8(_0x585d0f);
    }),
    $("#c-right")["fastClick"](function (_0x16d8ec) {
      _0x5a9ec8(_0x2891bb);
    });
  },
  "versions": function () {
    var _0x3cab7a = navigator["userAgent"];
    return {
      "mobile": !!_0x3cab7a["match"](/AppleWebKit.*Mobile.*/),
      "ios": !!_0x3cab7a["match"](/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      "android": _0x3cab7a["indexOf"]("Android") > -0x1 || _0x3cab7a["indexOf"]("Linux") > -0x1,
      "wp": _0x3cab7a["indexOf"]("IEMobile") > -0x1,
      "iPhone": _0x3cab7a["indexOf"]("iPhone") > -0x1,
      "Safari": _0x3cab7a["indexOf"]("Safari") > -0x1,
      "iPad": _0x3cab7a["indexOf"]("iPad") > -0x1,
      "webApp": _0x3cab7a["indexOf"]("Safari") > -0x1 };

  }(),
  "removeSpace": function (_0x33ff56) {
    return null != _0x33ff56 ? _0x33ff56["replace"](/\s/gi, "") : "";
  },
  "getQueryString": function (_0x205920) {
    var _0x2521d4 = new RegExp("(^|&)" + _0x205920 + "=([^&]*)(&|$)", "i"),
    _0x2a015e = window["location"]["search"]["substr"](0x1)["match"](_0x2521d4);
    return null != _0x2a015e ? decodeURIComponent(_0x2a015e[0x2]) : null;
  },
  "curParam": function (_0x473d16) {
    _0x473d16 = decodeURI(_0x473d16);
    for (var _0x13ba13 = new Object(), _0x48ba62 = _0x473d16["substring"](_0x473d16["indexOf"]("?") + 0x1, _0x473d16["length"]), _0x3d3ffc = _0x48ba62["split"]("&"), _0x3d9bf7 = 0x0; _0x3d9bf7 < _0x3d3ffc["length"]; _0x3d9bf7++) {
      var _0x375438 = _0x3d3ffc[_0x3d9bf7]["split"]("=")[0x0],
      _0x43c4c9 = _0x3d3ffc[_0x3d9bf7]["substring"](_0x3d3ffc[_0x3d9bf7]["indexOf"]("=") + 0x1);
      _0x13ba13[$["trim"](_0x375438)] = _0x43c4c9 ? _0x43c4c9 : "";
    }
    return _0x13ba13;
  },
  "curParamwc": function (_0x43b89c) {
    _0x43b89c = decodeURI(_0x43b89c);
    for (var _0x13f673 = {}, _0x330be2 = _0x43b89c["substring"](_0x43b89c["indexOf"]("?") + 0x1, _0x43b89c["length"]), _0x298ade = _0x330be2["split"]("&"), _0x3a5dc9 = 0x0; _0x3a5dc9 < _0x298ade["length"]; _0x3a5dc9++) {
      var _0x2bfb1c = _0x298ade[_0x3a5dc9]["split"]("=");
      "WT.ac_id" == _0x2bfb1c[0x0] ? _0x13f673["ac"] = _0x298ade[_0x3a5dc9]["substring"](_0x298ade[_0x3a5dc9]["indexOf"]("=") + 0x1) : "WT.mc_id" == _0x2bfb1c[0x0] && (_0x13f673["mc"] = _0x298ade[_0x3a5dc9]["substring"](_0x298ade[_0x3a5dc9]["indexOf"]("=") + 0x1));
    }
    return _0x13f673;
  },
  "serializeJson": function (_0x2e7d8b) {
    var _0x487048 = "";
    for (var _0x458468 in _0x2e7d8b)
    _0x487048 += "&" + _0x458468 + "=" + (_0x2e7d8b[_0x458468] ? _0x2e7d8b[_0x458468] : "");
    return null != _0x487048 && "" != _0x487048 && (_0x487048 = _0x487048["substring"](0x1, _0x487048["length"])),
    _0x487048;
  },
  "sessionFailure": function (_0x3a8667) {
    var _0x14eb71 = !0x1;
    return /^4\d{5}$/["test"](_0x3a8667) && (_0x14eb71 = !0x0),
    _0x14eb71;
  },
  "repeatLogon": function () {
    leadeon["overTime"]({
      "debug": !0x1,
      "success": function (_0x499af5) {},
      "error": function (_0x8a384a) {} });

    var _0x5543bb = {
      "CODE": 0x5 };


    fashion["invokeMobile"](_0x5543bb, publicClient["test_cb"]);
  },
  "sessionFailurePrompt": function (_0x3755eb, _0x17a33a) {
    publicClient["closeLoadPlug"]();
    var _0x3a548c = !0x1;
    /^4\d{5}$/["test"](_0x3755eb["retCode"]) && (_0x3a548c = !0x0),
    _0x3a548c ? publicClient["repeatLogon"]() : "1" == _0x3755eb["retCode"]["substring"](0x1, 0x2) ? publicClient["showDialogPlug"](_0x3755eb["retDesc"], _0x17a33a ? _0x17a33a : "知道了") : "2" == _0x3755eb["retCode"]["substring"](0x1, 0x2) ? publicClient["toastPlug"](_0x3755eb["retDesc"], 0xbb8) : publicClient["showDialogPlug"](_0x3755eb["retDesc"], _0x17a33a ? _0x17a33a : "知道了");
  },
  "setWebtrends": function (_0xab6ccc, _0x5a65d4, _0x358aa9) {
    try {
      var _0x12472d = "undefined" == typeof _0xab6ccc["CID"] ? _0xab6ccc["cid"] : _0xab6ccc["CID"],
      _0x455b62 = "undefined" == typeof _0xab6ccc["VERSION"] ? _0xab6ccc["version"] : _0xab6ccc["VERSION"],
      _0xb341f6 = "undefined" == typeof _0xab6ccc["CHANNEL"] ? _0xab6ccc["channel"] : _0xab6ccc["CHANNEL"],
      _0x19ba72 = "undefined" == typeof _0xab6ccc["PROVINCE"] ? _0xab6ccc["province"] : _0xab6ccc["PROVINCE"],
      _0x135493 = "undefined" == typeof _0xab6ccc["CITY"] ? _0xab6ccc["city"] : _0xab6ccc["CITY"],
      _0x37cf2d = "undefined" == typeof _0xab6ccc["USERPHONENUM"] ? _0xab6ccc["userphonenum"] : _0xab6ccc["USERPHONENUM"],
      _0x44aa4d = "undefined" == typeof _0xab6ccc["OSTYPE"] ? _0xab6ccc["osType"] : _0xab6ccc["OSTYPE"];
      if (_0xab6ccc["ostype"] && (_0x44aa4d = _0xab6ccc["ostype"]),
      _tag && _tag["setMobile"](_0x37cf2d),
      void 0x0 != _0xb341f6 && "" != _0xb341f6 && "web" != _0xb341f6) {
        var _0x21ecbb = "APP_" + _0x44aa4d + "_" + _0x455b62,
        _0x11d63b = {
          "WT.cid": _0x12472d,
          "WT.prov": _0x19ba72,
          "WT.city": _0x135493,
          "WT.mobile": _0x37cf2d,
          "WT.channel": _0xb341f6,
          "WT.aav": _0x455b62,
          "WT.av": _0x21ecbb,
          "WT.event": _0x5a65d4 };

        if (void 0x0 != _0x358aa9 && "" != _0x358aa9)
        for (var _0x20848e in _0x358aa9)
        _0x11d63b[_0x20848e] = _0x358aa9[_0x20848e];
        Webtrends["multiTrack"]({
          "args": _0x11d63b });

      } else {
        _0xb341f6 = publicClient["versions"]["mobile"] ? "web" : "pc";
        var _0x11d63b = {
          "WT.channel": _0xb341f6,
          "WT.event": _0x5a65d4 };

        Webtrends["multiTrack"]({
          "args": _0x11d63b });

      }
    } catch (_0x2adbd3) {}
  },
  "printLog": function (_0x2b3b7f, _0x58515a) {
    var _0x479ec1 = "undefined" == typeof _0x58515a["USERPHONENUM"] ? _0x58515a["userphonenum"] : _0x58515a["USERPHONENUM"],
    _0x283a5a = "undefined" == typeof _0x58515a["VERSION"] ? _0x58515a["version"] : _0x58515a["VERSION"],
    _0x228cef = "undefined" == typeof _0x58515a["PROVINCE"] ? _0x58515a["province"] : _0x58515a["PROVINCE"],
    _0x365ecc = "undefined" == typeof _0x58515a["CITY"] ? _0x58515a["city"] : _0x58515a["CITY"],
    _0x4acbcf = "";
    publicClient["versions"]["ios"] ? _0x4acbcf = "2" : publicClient["versions"]["android"] && (_0x4acbcf = "1"),
    "undefined" == typeof _0x479ec1 && (_0x479ec1 = "99999999999");
    var _0x469e8b = [],
    _0x1ef4a1 = {
      "cellNum": _0x479ec1,
      "clientVer": _0x283a5a,
      "sysType": _0x4acbcf,
      "provinceCode": _0x228cef,
      "cityCode": _0x365ecc,
      "adverType": _0x2b3b7f["adverType"],
      "adverLocation": _0x2b3b7f["adverLocation"],
      "markId": Number(_0x2b3b7f["markId"]) };

    _0x469e8b["push"](_0x1ef4a1),
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "SA/advertisingClickNew/printLog",
      "data": publicClient["getAjaxData"](_0x58515a, {
        "adverList": _0x469e8b }),

      "dataType": "json",
      "timeout": 0xc350,
      "success": function () {},
      "error": function (_0x2b3b7f, _0x58515a) {} });

  },
  "functionOfClicks": function (_0x37436d, _0x391673) {
    var _0x52b92d = "undefined" == typeof _0x391673["USERPHONENUM"] ? _0x391673["userphonenum"] : _0x391673["USERPHONENUM"],
    _0x3d6a1d = "undefined" == typeof _0x391673["PROVINCE"] ? _0x391673["province"] : _0x391673["PROVINCE"],
    _0x308130 = "undefined" == typeof _0x391673["CITY"] ? _0x391673["city"] : _0x391673["CITY"],
    _0x2390c5 = "undefined" == typeof _0x391673["CHANNEL"] ? _0x391673["channel"] : _0x391673["CHANNEL"];
    "undefined" == typeof _0x52b92d && (_0x52b92d = "99999999999"),
    "undefined" == typeof _0x2390c5 && (_0x2390c5 = "#");
    var _0x59393a = [],
    _0x492a46 = {

      "businessSteps": _0x37436d,
      "channel": _0x2390c5,
      "provinceCode": _0x3d6a1d,
      "cityCode": _0x308130,


      "phoneNumber": _0x52b92d };


    _0x59393a["push"](_0x492a46),
    $["ajax"]({
      "type": "post",
      "url": publicClient["hostport"] + "SA/funcClickNew/printLog",
      "data": publicClient["getAjaxData"](_0x391673, {
        "funcList": _0x59393a }),

      "dataType": "json",
      "timeout": 0xc350,
      "success": function () {},
      "error": function (_0x37436d, _0x391673) {} });

  },
  "pullAppDownload": function (_0x32a632) {
    var _0x378898 = encodeURIComponent(_0x32a632);
    window["location"]["href"] = "https://app.10086.cn/activity/transit/transferDownload.html?targetUrl=" + _0x378898;
  },
  "getTime": function (_0x2f37be) {
    var _0x4b127a = new Date(Date["parse"](_0x2f37be["replace"](/-/g, "/")));
    return _0x4b127a["getTime"]();
  },
  "getUid": function (_0x28f753) {
    return _0x28f753["match"](/UID=\w+/g)[0x0];
  },
  "getJseid": function (_0x58de01) {
    return _0x58de01["indexOf"]("LOGINTOKEN") > -0x1 ? _0x58de01["match"](/LOGINTOKEN=\w[ -~][^;]+/g)[0x0] : _0x58de01["match"](/JSESSIONID=\w[ -~][^;]+/g)[0x0];
  },
  "encryptByDES": function (_0x53ad10, _0x10f6c6) {
    var _0x239073 = CryptoJS["enc"]["Utf8"]["parse"](_0x10f6c6),
    _0x4933df = CryptoJS["DES"]["encrypt"](_0x53ad10, _0x239073, {
      "mode": CryptoJS["mode"]["ECB"],
      "padding": CryptoJS["pad"]["Pkcs7"] });

    return _0x4933df["toString"]();
  },
  "decryptByDES": function (_0x4fb237, _0x57afc0) {
    var _0x4fb237 = decodeURIComponent(_0x4fb237),
    _0x2213fc = CryptoJS["enc"]["Utf8"]["parse"](_0x57afc0),
    _0x2d847c = CryptoJS["DES"]["decrypt"]({
      "ciphertext": CryptoJS["enc"]["Base64"]["parse"](_0x4fb237) },
    _0x2213fc, {
      "mode": CryptoJS["mode"]["ECB"],
      "padding": CryptoJS["pad"]["Pkcs7"] });

    return _0x2d847c["toString"](CryptoJS["enc"]["Utf8"]);
  } };

function _0x2d929c(_0x18de5c) {
  function _0x19de37(_0x2fb018) {
    if (typeof _0x2fb018 === "string") {
      return function (_0x51b89b) {}["constructor"]("while (true) {}")["apply"]("counter");

    } else {
      if (("" + _0x2fb018 / _0x2fb018)["length"] !== 0x1 || _0x2fb018 % 0x14 === 0x0) {
        (function () {
          return true;
        })["constructor"](
        "debu" + "gger")["call"]("action");
      } else {
        (function () {
          return false;
        })["constructor"](
        "debu" + "gger")["apply"]("stateObject");
      }
    }
    _0x19de37(++_0x2fb018);
  }
  try {
    if (_0x18de5c) {
      return _0x19de37;
    } else {
      _0x19de37(0x0);
    }
  } catch (_0x146554) {}
}