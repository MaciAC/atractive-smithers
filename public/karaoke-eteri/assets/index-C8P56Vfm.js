(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r);
  new MutationObserver((r) => {
    for (const i of r)
      if (i.type === "childList")
        for (const o of i.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && s(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(r) {
    const i = {};
    return (
      r.integrity && (i.integrity = r.integrity),
      r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : r.crossOrigin === "anonymous"
        ? (i.credentials = "omit")
        : (i.credentials = "same-origin"),
      i
    );
  }
  function s(r) {
    if (r.ep) return;
    r.ep = !0;
    const i = n(r);
    fetch(r.href, i);
  }
})();
/**
 * @vue/shared v3.4.15
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function Zn(e, t) {
  const n = new Set(e.split(","));
  return t ? (s) => n.has(s.toLowerCase()) : (s) => n.has(s);
}
const G = {},
  dt = [],
  ye = () => {},
  Ei = () => !1,
  fn = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  Qn = (e) => e.startsWith("onUpdate:"),
  ie = Object.assign,
  es = (e, t) => {
    const n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
  },
  Si = Object.prototype.hasOwnProperty,
  H = (e, t) => Si.call(e, t),
  T = Array.isArray,
  ht = (e) => Nt(e) === "[object Map]",
  dn = (e) => Nt(e) === "[object Set]",
  Es = (e) => Nt(e) === "[object Date]",
  F = (e) => typeof e == "function",
  te = (e) => typeof e == "string",
  We = (e) => typeof e == "symbol",
  z = (e) => e !== null && typeof e == "object",
  dr = (e) => (z(e) || F(e)) && F(e.then) && F(e.catch),
  hr = Object.prototype.toString,
  Nt = (e) => hr.call(e),
  Ti = (e) => Nt(e).slice(8, -1),
  pr = (e) => Nt(e) === "[object Object]",
  ts = (e) =>
    te(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  Gt = Zn(
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  ),
  hn = (e) => {
    const t = Object.create(null);
    return (n) => t[n] || (t[n] = e(n));
  },
  Li = /-(\w)/g,
  _t = hn((e) => e.replace(Li, (t, n) => (n ? n.toUpperCase() : ""))),
  Ai = /\B([A-Z])/g,
  wt = hn((e) => e.replace(Ai, "-$1").toLowerCase()),
  gr = hn((e) => e.charAt(0).toUpperCase() + e.slice(1)),
  Sn = hn((e) => (e ? `on${gr(e)}` : "")),
  ze = (e, t) => !Object.is(e, t),
  Jt = (e, t) => {
    for (let n = 0; n < e.length; n++) e[n](t);
  },
  en = (e, t, n) => {
    Object.defineProperty(e, t, { configurable: !0, enumerable: !1, value: n });
  },
  Fn = (e) => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t;
  },
  Ii = (e) => {
    const t = te(e) ? Number(e) : NaN;
    return isNaN(t) ? e : t;
  };
let Ss;
const mr = () =>
  Ss ||
  (Ss =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
      ? self
      : typeof window < "u"
      ? window
      : typeof global < "u"
      ? global
      : {});
function ns(e) {
  if (T(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n],
        r = te(s) ? Ri(s) : ns(s);
      if (r) for (const i in r) t[i] = r[i];
    }
    return t;
  } else if (te(e) || z(e)) return e;
}
const Oi = /;(?![^(]*\))/g,
  Pi = /:([^]+)/,
  Mi = /\/\*[^]*?\*\//g;
function Ri(e) {
  const t = {};
  return (
    e
      .replace(Mi, "")
      .split(Oi)
      .forEach((n) => {
        if (n) {
          const s = n.split(Pi);
          s.length > 1 && (t[s[0].trim()] = s[1].trim());
        }
      }),
    t
  );
}
function bt(e) {
  let t = "";
  if (te(e)) t = e;
  else if (T(e))
    for (let n = 0; n < e.length; n++) {
      const s = bt(e[n]);
      s && (t += s + " ");
    }
  else if (z(e)) for (const n in e) e[n] && (t += n + " ");
  return t.trim();
}
const Ni =
    "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  Fi = Zn(Ni);
function _r(e) {
  return !!e || e === "";
}
function ji(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++) n = pn(e[s], t[s]);
  return n;
}
function pn(e, t) {
  if (e === t) return !0;
  let n = Es(e),
    s = Es(t);
  if (n || s) return n && s ? e.getTime() === t.getTime() : !1;
  if (((n = We(e)), (s = We(t)), n || s)) return e === t;
  if (((n = T(e)), (s = T(t)), n || s)) return n && s ? ji(e, t) : !1;
  if (((n = z(e)), (s = z(t)), n || s)) {
    if (!n || !s) return !1;
    const r = Object.keys(e).length,
      i = Object.keys(t).length;
    if (r !== i) return !1;
    for (const o in e) {
      const l = e.hasOwnProperty(o),
        a = t.hasOwnProperty(o);
      if ((l && !a) || (!l && a) || !pn(e[o], t[o])) return !1;
    }
  }
  return String(e) === String(t);
}
function br(e, t) {
  return e.findIndex((n) => pn(n, t));
}
const jn = (e) =>
    te(e)
      ? e
      : e == null
      ? ""
      : T(e) || (z(e) && (e.toString === hr || !F(e.toString)))
      ? JSON.stringify(e, vr, 2)
      : String(e),
  vr = (e, t) =>
    t && t.__v_isRef
      ? vr(e, t.value)
      : ht(t)
      ? {
          [`Map(${t.size})`]: [...t.entries()].reduce(
            (n, [s, r], i) => ((n[Tn(s, i) + " =>"] = r), n),
            {}
          ),
        }
      : dn(t)
      ? { [`Set(${t.size})`]: [...t.values()].map((n) => Tn(n)) }
      : We(t)
      ? Tn(t)
      : z(t) && !T(t) && !pr(t)
      ? String(t)
      : t,
  Tn = (e, t = "") => {
    var n;
    return We(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
  };
/**
 * @vue/reactivity v3.4.15
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let we;
class Vi {
  constructor(t = !1) {
    (this.detached = t),
      (this._active = !0),
      (this.effects = []),
      (this.cleanups = []),
      (this.parent = we),
      !t && we && (this.index = (we.scopes || (we.scopes = [])).push(this) - 1);
  }
  get active() {
    return this._active;
  }
  run(t) {
    if (this._active) {
      const n = we;
      try {
        return (we = this), t();
      } finally {
        we = n;
      }
    }
  }
  on() {
    we = this;
  }
  off() {
    we = this.parent;
  }
  stop(t) {
    if (this._active) {
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++) this.effects[n].stop();
      for (n = 0, s = this.cleanups.length; n < s; n++) this.cleanups[n]();
      if (this.scopes)
        for (n = 0, s = this.scopes.length; n < s; n++) this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r &&
          r !== this &&
          ((this.parent.scopes[this.index] = r), (r.index = this.index));
      }
      (this.parent = void 0), (this._active = !1);
    }
  }
}
function Hi(e, t = we) {
  t && t.active && t.effects.push(e);
}
function Ui() {
  return we;
}
let tt;
class ss {
  constructor(t, n, s, r) {
    (this.fn = t),
      (this.trigger = n),
      (this.scheduler = s),
      (this.active = !0),
      (this.deps = []),
      (this._dirtyLevel = 2),
      (this._trackId = 0),
      (this._runnings = 0),
      (this._shouldSchedule = !1),
      (this._depsLength = 0),
      Hi(this, r);
  }
  get dirty() {
    if (this._dirtyLevel === 1) {
      ot();
      for (let t = 0; t < this._depsLength; t++) {
        const n = this.deps[t];
        if (n.computed && (Bi(n.computed), this._dirtyLevel >= 2)) break;
      }
      this._dirtyLevel < 2 && (this._dirtyLevel = 0), lt();
    }
    return this._dirtyLevel >= 2;
  }
  set dirty(t) {
    this._dirtyLevel = t ? 2 : 0;
  }
  run() {
    if (((this._dirtyLevel = 0), !this.active)) return this.fn();
    let t = Ke,
      n = tt;
    try {
      return (Ke = !0), (tt = this), this._runnings++, Ts(this), this.fn();
    } finally {
      Ls(this), this._runnings--, (tt = n), (Ke = t);
    }
  }
  stop() {
    var t;
    this.active &&
      (Ts(this),
      Ls(this),
      (t = this.onStop) == null || t.call(this),
      (this.active = !1));
  }
}
function Bi(e) {
  return e.value;
}
function Ts(e) {
  e._trackId++, (e._depsLength = 0);
}
function Ls(e) {
  if (e.deps && e.deps.length > e._depsLength) {
    for (let t = e._depsLength; t < e.deps.length; t++) yr(e.deps[t], e);
    e.deps.length = e._depsLength;
  }
}
function yr(e, t) {
  const n = e.get(t);
  n !== void 0 &&
    t._trackId !== n &&
    (e.delete(t), e.size === 0 && e.cleanup());
}
let Ke = !0,
  Vn = 0;
const xr = [];
function ot() {
  xr.push(Ke), (Ke = !1);
}
function lt() {
  const e = xr.pop();
  Ke = e === void 0 ? !0 : e;
}
function rs() {
  Vn++;
}
function is() {
  for (Vn--; !Vn && Hn.length; ) Hn.shift()();
}
function Cr(e, t, n) {
  if (t.get(e) !== e._trackId) {
    t.set(e, e._trackId);
    const s = e.deps[e._depsLength];
    s !== t ? (s && yr(s, e), (e.deps[e._depsLength++] = t)) : e._depsLength++;
  }
}
const Hn = [];
function wr(e, t, n) {
  rs();
  for (const s of e.keys())
    if (s._dirtyLevel < t && e.get(s) === s._trackId) {
      const r = s._dirtyLevel;
      (s._dirtyLevel = t), r === 0 && ((s._shouldSchedule = !0), s.trigger());
    }
  $r(e), is();
}
function $r(e) {
  for (const t of e.keys())
    t.scheduler &&
      t._shouldSchedule &&
      (!t._runnings || t.allowRecurse) &&
      e.get(t) === t._trackId &&
      ((t._shouldSchedule = !1), Hn.push(t.scheduler));
}
const Er = (e, t) => {
    const n = new Map();
    return (n.cleanup = e), (n.computed = t), n;
  },
  Un = new WeakMap(),
  nt = Symbol(""),
  Bn = Symbol("");
function ge(e, t, n) {
  if (Ke && tt) {
    let s = Un.get(e);
    s || Un.set(e, (s = new Map()));
    let r = s.get(n);
    r || s.set(n, (r = Er(() => s.delete(n)))), Cr(tt, r);
  }
}
function Re(e, t, n, s, r, i) {
  const o = Un.get(e);
  if (!o) return;
  let l = [];
  if (t === "clear") l = [...o.values()];
  else if (n === "length" && T(e)) {
    const a = Number(s);
    o.forEach((f, d) => {
      (d === "length" || (!We(d) && d >= a)) && l.push(f);
    });
  } else
    switch ((n !== void 0 && l.push(o.get(n)), t)) {
      case "add":
        T(e)
          ? ts(n) && l.push(o.get("length"))
          : (l.push(o.get(nt)), ht(e) && l.push(o.get(Bn)));
        break;
      case "delete":
        T(e) || (l.push(o.get(nt)), ht(e) && l.push(o.get(Bn)));
        break;
      case "set":
        ht(e) && l.push(o.get(nt));
        break;
    }
  rs();
  for (const a of l) a && wr(a, 2);
  is();
}
const Di = Zn("__proto__,__v_isRef,__isVue"),
  Sr = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((e) => e !== "arguments" && e !== "caller")
      .map((e) => Symbol[e])
      .filter(We)
  ),
  As = Ki();
function Ki() {
  const e = {};
  return (
    ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
      e[t] = function (...n) {
        const s = U(this);
        for (let i = 0, o = this.length; i < o; i++) ge(s, "get", i + "");
        const r = s[t](...n);
        return r === -1 || r === !1 ? s[t](...n.map(U)) : r;
      };
    }),
    ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
      e[t] = function (...n) {
        ot(), rs();
        const s = U(this)[t].apply(this, n);
        return is(), lt(), s;
      };
    }),
    e
  );
}
function ki(e) {
  const t = U(this);
  return ge(t, "has", e), t.hasOwnProperty(e);
}
class Tr {
  constructor(t = !1, n = !1) {
    (this._isReadonly = t), (this._shallow = n);
  }
  get(t, n, s) {
    const r = this._isReadonly,
      i = this._shallow;
    if (n === "__v_isReactive") return !r;
    if (n === "__v_isReadonly") return r;
    if (n === "__v_isShallow") return i;
    if (n === "__v_raw")
      return s === (r ? (i ? so : Or) : i ? Ir : Ar).get(t) ||
        Object.getPrototypeOf(t) === Object.getPrototypeOf(s)
        ? t
        : void 0;
    const o = T(t);
    if (!r) {
      if (o && H(As, n)) return Reflect.get(As, n, s);
      if (n === "hasOwnProperty") return ki;
    }
    const l = Reflect.get(t, n, s);
    return (We(n) ? Sr.has(n) : Di(n)) || (r || ge(t, "get", n), i)
      ? l
      : me(l)
      ? o && ts(n)
        ? l
        : l.value
      : z(l)
      ? r
        ? Pr(l)
        : cs(l)
      : l;
  }
}
class Lr extends Tr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    if (!this._shallow) {
      const a = vt(i);
      if (
        (!tn(s) && !vt(s) && ((i = U(i)), (s = U(s))), !T(t) && me(i) && !me(s))
      )
        return a ? !1 : ((i.value = s), !0);
    }
    const o = T(t) && ts(n) ? Number(n) < t.length : H(t, n),
      l = Reflect.set(t, n, s, r);
    return (
      t === U(r) && (o ? ze(s, i) && Re(t, "set", n, s) : Re(t, "add", n, s)), l
    );
  }
  deleteProperty(t, n) {
    const s = H(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && Re(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!We(n) || !Sr.has(n)) && ge(t, "has", n), s;
  }
  ownKeys(t) {
    return ge(t, "iterate", T(t) ? "length" : nt), Reflect.ownKeys(t);
  }
}
class Wi extends Tr {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const zi = new Lr(),
  qi = new Wi(),
  Gi = new Lr(!0),
  os = (e) => e,
  gn = (e) => Reflect.getPrototypeOf(e);
function Ut(e, t, n = !1, s = !1) {
  e = e.__v_raw;
  const r = U(e),
    i = U(t);
  n || (ze(t, i) && ge(r, "get", t), ge(r, "get", i));
  const { has: o } = gn(r),
    l = s ? os : n ? us : Ot;
  if (o.call(r, t)) return l(e.get(t));
  if (o.call(r, i)) return l(e.get(i));
  e !== r && e.get(t);
}
function Bt(e, t = !1) {
  const n = this.__v_raw,
    s = U(n),
    r = U(e);
  return (
    t || (ze(e, r) && ge(s, "has", e), ge(s, "has", r)),
    e === r ? n.has(e) : n.has(e) || n.has(r)
  );
}
function Dt(e, t = !1) {
  return (
    (e = e.__v_raw), !t && ge(U(e), "iterate", nt), Reflect.get(e, "size", e)
  );
}
function Is(e) {
  e = U(e);
  const t = U(this);
  return gn(t).has.call(t, e) || (t.add(e), Re(t, "add", e, e)), this;
}
function Os(e, t) {
  t = U(t);
  const n = U(this),
    { has: s, get: r } = gn(n);
  let i = s.call(n, e);
  i || ((e = U(e)), (i = s.call(n, e)));
  const o = r.call(n, e);
  return (
    n.set(e, t), i ? ze(t, o) && Re(n, "set", e, t) : Re(n, "add", e, t), this
  );
}
function Ps(e) {
  const t = U(this),
    { has: n, get: s } = gn(t);
  let r = n.call(t, e);
  r || ((e = U(e)), (r = n.call(t, e))), s && s.call(t, e);
  const i = t.delete(e);
  return r && Re(t, "delete", e, void 0), i;
}
function Ms() {
  const e = U(this),
    t = e.size !== 0,
    n = e.clear();
  return t && Re(e, "clear", void 0, void 0), n;
}
function Kt(e, t) {
  return function (s, r) {
    const i = this,
      o = i.__v_raw,
      l = U(o),
      a = t ? os : e ? us : Ot;
    return (
      !e && ge(l, "iterate", nt), o.forEach((f, d) => s.call(r, a(f), a(d), i))
    );
  };
}
function kt(e, t, n) {
  return function (...s) {
    const r = this.__v_raw,
      i = U(r),
      o = ht(i),
      l = e === "entries" || (e === Symbol.iterator && o),
      a = e === "keys" && o,
      f = r[e](...s),
      d = n ? os : t ? us : Ot;
    return (
      !t && ge(i, "iterate", a ? Bn : nt),
      {
        next() {
          const { value: _, done: x } = f.next();
          return x
            ? { value: _, done: x }
            : { value: l ? [d(_[0]), d(_[1])] : d(_), done: x };
        },
        [Symbol.iterator]() {
          return this;
        },
      }
    );
  };
}
function je(e) {
  return function (...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Ji() {
  const e = {
      get(i) {
        return Ut(this, i);
      },
      get size() {
        return Dt(this);
      },
      has: Bt,
      add: Is,
      set: Os,
      delete: Ps,
      clear: Ms,
      forEach: Kt(!1, !1),
    },
    t = {
      get(i) {
        return Ut(this, i, !1, !0);
      },
      get size() {
        return Dt(this);
      },
      has: Bt,
      add: Is,
      set: Os,
      delete: Ps,
      clear: Ms,
      forEach: Kt(!1, !0),
    },
    n = {
      get(i) {
        return Ut(this, i, !0);
      },
      get size() {
        return Dt(this, !0);
      },
      has(i) {
        return Bt.call(this, i, !0);
      },
      add: je("add"),
      set: je("set"),
      delete: je("delete"),
      clear: je("clear"),
      forEach: Kt(!0, !1),
    },
    s = {
      get(i) {
        return Ut(this, i, !0, !0);
      },
      get size() {
        return Dt(this, !0);
      },
      has(i) {
        return Bt.call(this, i, !0);
      },
      add: je("add"),
      set: je("set"),
      delete: je("delete"),
      clear: je("clear"),
      forEach: Kt(!0, !0),
    };
  return (
    ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
      (e[i] = kt(i, !1, !1)),
        (n[i] = kt(i, !0, !1)),
        (t[i] = kt(i, !1, !0)),
        (s[i] = kt(i, !0, !0));
    }),
    [e, n, t, s]
  );
}
const [Yi, Xi, Zi, Qi] = Ji();
function ls(e, t) {
  const n = t ? (e ? Qi : Zi) : e ? Xi : Yi;
  return (s, r, i) =>
    r === "__v_isReactive"
      ? !e
      : r === "__v_isReadonly"
      ? e
      : r === "__v_raw"
      ? s
      : Reflect.get(H(n, r) && r in s ? n : s, r, i);
}
const eo = { get: ls(!1, !1) },
  to = { get: ls(!1, !0) },
  no = { get: ls(!0, !1) },
  Ar = new WeakMap(),
  Ir = new WeakMap(),
  Or = new WeakMap(),
  so = new WeakMap();
function ro(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function io(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ro(Ti(e));
}
function cs(e) {
  return vt(e) ? e : as(e, !1, zi, eo, Ar);
}
function oo(e) {
  return as(e, !1, Gi, to, Ir);
}
function Pr(e) {
  return as(e, !0, qi, no, Or);
}
function as(e, t, n, s, r) {
  if (!z(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
  const i = r.get(e);
  if (i) return i;
  const o = io(e);
  if (o === 0) return e;
  const l = new Proxy(e, o === 2 ? s : n);
  return r.set(e, l), l;
}
function pt(e) {
  return vt(e) ? pt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function vt(e) {
  return !!(e && e.__v_isReadonly);
}
function tn(e) {
  return !!(e && e.__v_isShallow);
}
function Mr(e) {
  return pt(e) || vt(e);
}
function U(e) {
  const t = e && e.__v_raw;
  return t ? U(t) : e;
}
function Rr(e) {
  return en(e, "__v_skip", !0), e;
}
const Ot = (e) => (z(e) ? cs(e) : e),
  us = (e) => (z(e) ? Pr(e) : e);
class Nr {
  constructor(t, n, s, r) {
    (this._setter = n),
      (this.dep = void 0),
      (this.__v_isRef = !0),
      (this.__v_isReadonly = !1),
      (this.effect = new ss(
        () => t(this._value),
        () => Yt(this, 1),
        () => this.dep && $r(this.dep)
      )),
      (this.effect.computed = this),
      (this.effect.active = this._cacheable = !r),
      (this.__v_isReadonly = s);
  }
  get value() {
    const t = U(this);
    return (
      (!t._cacheable || t.effect.dirty) &&
        ze(t._value, (t._value = t.effect.run())) &&
        Yt(t, 2),
      Fr(t),
      t.effect._dirtyLevel >= 1 && Yt(t, 1),
      t._value
    );
  }
  set value(t) {
    this._setter(t);
  }
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(t) {
    this.effect.dirty = t;
  }
}
function lo(e, t, n = !1) {
  let s, r;
  const i = F(e);
  return (
    i ? ((s = e), (r = ye)) : ((s = e.get), (r = e.set)),
    new Nr(s, r, i || !r, n)
  );
}
function Fr(e) {
  Ke &&
    tt &&
    ((e = U(e)),
    Cr(
      tt,
      e.dep ||
        (e.dep = Er(() => (e.dep = void 0), e instanceof Nr ? e : void 0))
    ));
}
function Yt(e, t = 2, n) {
  e = U(e);
  const s = e.dep;
  s && wr(s, t);
}
function me(e) {
  return !!(e && e.__v_isRef === !0);
}
function Pe(e) {
  return co(e, !1);
}
function co(e, t) {
  return me(e) ? e : new ao(e, t);
}
class ao {
  constructor(t, n) {
    (this.__v_isShallow = n),
      (this.dep = void 0),
      (this.__v_isRef = !0),
      (this._rawValue = n ? t : U(t)),
      (this._value = n ? t : Ot(t));
  }
  get value() {
    return Fr(this), this._value;
  }
  set value(t) {
    const n = this.__v_isShallow || tn(t) || vt(t);
    (t = n ? t : U(t)),
      ze(t, this._rawValue) &&
        ((this._rawValue = t), (this._value = n ? t : Ot(t)), Yt(this, 2));
  }
}
function uo(e) {
  return me(e) ? e.value : e;
}
const fo = {
  get: (e, t, n) => uo(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return me(r) && !me(n) ? ((r.value = n), !0) : Reflect.set(e, t, n, s);
  },
};
function jr(e) {
  return pt(e) ? e : new Proxy(e, fo);
}
/**
 * @vue/runtime-core v3.4.15
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function ke(e, t, n, s) {
  let r;
  try {
    r = s ? e(...s) : e();
  } catch (i) {
    mn(i, t, n);
  }
  return r;
}
function xe(e, t, n, s) {
  if (F(e)) {
    const i = ke(e, t, n, s);
    return (
      i &&
        dr(i) &&
        i.catch((o) => {
          mn(o, t, n);
        }),
      i
    );
  }
  const r = [];
  for (let i = 0; i < e.length; i++) r.push(xe(e[i], t, n, s));
  return r;
}
function mn(e, t, n, s = !0) {
  const r = t ? t.vnode : null;
  if (t) {
    let i = t.parent;
    const o = t.proxy,
      l = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; i; ) {
      const f = i.ec;
      if (f) {
        for (let d = 0; d < f.length; d++) if (f[d](e, o, l) === !1) return;
      }
      i = i.parent;
    }
    const a = t.appContext.config.errorHandler;
    if (a) {
      ke(a, null, 10, [e, o, l]);
      return;
    }
  }
  ho(e, n, r, s);
}
function ho(e, t, n, s = !0) {
  console.error(e);
}
let Pt = !1,
  Dn = !1;
const le = [];
let Ie = 0;
const gt = [];
let Ue = null,
  Ze = 0;
const Vr = Promise.resolve();
let fs = null;
function po(e) {
  const t = fs || Vr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function go(e) {
  let t = Ie + 1,
    n = le.length;
  for (; t < n; ) {
    const s = (t + n) >>> 1,
      r = le[s],
      i = Mt(r);
    i < e || (i === e && r.pre) ? (t = s + 1) : (n = s);
  }
  return t;
}
function ds(e) {
  (!le.length || !le.includes(e, Pt && e.allowRecurse ? Ie + 1 : Ie)) &&
    (e.id == null ? le.push(e) : le.splice(go(e.id), 0, e), Hr());
}
function Hr() {
  !Pt && !Dn && ((Dn = !0), (fs = Vr.then(Br)));
}
function mo(e) {
  const t = le.indexOf(e);
  t > Ie && le.splice(t, 1);
}
function _o(e) {
  T(e)
    ? gt.push(...e)
    : (!Ue || !Ue.includes(e, e.allowRecurse ? Ze + 1 : Ze)) && gt.push(e),
    Hr();
}
function Rs(e, t, n = Pt ? Ie + 1 : 0) {
  for (; n < le.length; n++) {
    const s = le[n];
    if (s && s.pre) {
      if (e && s.id !== e.uid) continue;
      le.splice(n, 1), n--, s();
    }
  }
}
function Ur(e) {
  if (gt.length) {
    const t = [...new Set(gt)].sort((n, s) => Mt(n) - Mt(s));
    if (((gt.length = 0), Ue)) {
      Ue.push(...t);
      return;
    }
    for (Ue = t, Ze = 0; Ze < Ue.length; Ze++) Ue[Ze]();
    (Ue = null), (Ze = 0);
  }
}
const Mt = (e) => (e.id == null ? 1 / 0 : e.id),
  bo = (e, t) => {
    const n = Mt(e) - Mt(t);
    if (n === 0) {
      if (e.pre && !t.pre) return -1;
      if (t.pre && !e.pre) return 1;
    }
    return n;
  };
function Br(e) {
  (Dn = !1), (Pt = !0), le.sort(bo);
  try {
    for (Ie = 0; Ie < le.length; Ie++) {
      const t = le[Ie];
      t && t.active !== !1 && ke(t, null, 14);
    }
  } finally {
    (Ie = 0),
      (le.length = 0),
      Ur(),
      (Pt = !1),
      (fs = null),
      (le.length || gt.length) && Br();
  }
}
function vo(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || G;
  let r = n;
  const i = t.startsWith("update:"),
    o = i && t.slice(7);
  if (o && o in s) {
    const d = `${o === "modelValue" ? "model" : o}Modifiers`,
      { number: _, trim: x } = s[d] || G;
    x && (r = n.map((S) => (te(S) ? S.trim() : S))), _ && (r = n.map(Fn));
  }
  let l,
    a = s[(l = Sn(t))] || s[(l = Sn(_t(t)))];
  !a && i && (a = s[(l = Sn(wt(t)))]), a && xe(a, e, 6, r);
  const f = s[l + "Once"];
  if (f) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[l]) return;
    (e.emitted[l] = !0), xe(f, e, 6, r);
  }
}
function Dr(e, t, n = !1) {
  const s = t.emitsCache,
    r = s.get(e);
  if (r !== void 0) return r;
  const i = e.emits;
  let o = {},
    l = !1;
  if (!F(e)) {
    const a = (f) => {
      const d = Dr(f, t, !0);
      d && ((l = !0), ie(o, d));
    };
    !n && t.mixins.length && t.mixins.forEach(a),
      e.extends && a(e.extends),
      e.mixins && e.mixins.forEach(a);
  }
  return !i && !l
    ? (z(e) && s.set(e, null), null)
    : (T(i) ? i.forEach((a) => (o[a] = null)) : ie(o, i),
      z(e) && s.set(e, o),
      o);
}
function _n(e, t) {
  return !e || !fn(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, "")),
      H(e, t[0].toLowerCase() + t.slice(1)) || H(e, wt(t)) || H(e, t));
}
let pe = null,
  bn = null;
function nn(e) {
  const t = pe;
  return (pe = e), (bn = (e && e.type.__scopeId) || null), t;
}
function yo(e) {
  bn = e;
}
function xo() {
  bn = null;
}
function Kr(e, t = pe, n) {
  if (!t || e._n) return e;
  const s = (...r) => {
    s._d && Ws(-1);
    const i = nn(t);
    let o;
    try {
      o = e(...r);
    } finally {
      nn(i), s._d && Ws(1);
    }
    return o;
  };
  return (s._n = !0), (s._c = !0), (s._d = !0), s;
}
function Ns(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    props: i,
    propsOptions: [o],
    slots: l,
    attrs: a,
    emit: f,
    render: d,
    renderCache: _,
    data: x,
    setupState: S,
    ctx: B,
    inheritAttrs: R,
  } = e;
  let L, N;
  const se = nn(e);
  try {
    if (n.shapeFlag & 4) {
      const k = r || s,
        Q = k;
      (L = Ae(d.call(Q, k, _, i, S, x, B))), (N = a);
    } else {
      const k = t;
      (L = Ae(
        k.length > 1 ? k(i, { attrs: a, slots: l, emit: f }) : k(i, null)
      )),
        (N = t.props ? a : Co(a));
    }
  } catch (k) {
    (It.length = 0), mn(k, e, 1), (L = Ee(yt));
  }
  let D = L;
  if (N && R !== !1) {
    const k = Object.keys(N),
      { shapeFlag: Q } = D;
    k.length && Q & 7 && (o && k.some(Qn) && (N = wo(N, o)), (D = it(D, N)));
  }
  return (
    n.dirs && ((D = it(D)), (D.dirs = D.dirs ? D.dirs.concat(n.dirs) : n.dirs)),
    n.transition && (D.transition = n.transition),
    (L = D),
    nn(se),
    L
  );
}
const Co = (e) => {
    let t;
    for (const n in e)
      (n === "class" || n === "style" || fn(n)) && ((t || (t = {}))[n] = e[n]);
    return t;
  },
  wo = (e, t) => {
    const n = {};
    for (const s in e) (!Qn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
    return n;
  };
function $o(e, t, n) {
  const { props: s, children: r, component: i } = e,
    { props: o, children: l, patchFlag: a } = t,
    f = i.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (n && a >= 0) {
    if (a & 1024) return !0;
    if (a & 16) return s ? Fs(s, o, f) : !!o;
    if (a & 8) {
      const d = t.dynamicProps;
      for (let _ = 0; _ < d.length; _++) {
        const x = d[_];
        if (o[x] !== s[x] && !_n(f, x)) return !0;
      }
    }
  } else
    return (r || l) && (!l || !l.$stable)
      ? !0
      : s === o
      ? !1
      : s
      ? o
        ? Fs(s, o, f)
        : !0
      : !!o;
  return !1;
}
function Fs(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (t[i] !== e[i] && !_n(n, i)) return !0;
  }
  return !1;
}
function Eo({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if ((s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e))
      ((e = t.vnode).el = n), (t = t.parent);
    else break;
  }
}
const So = Symbol.for("v-ndc"),
  To = (e) => e.__isSuspense;
function Lo(e, t) {
  t && t.pendingBranch
    ? T(e)
      ? t.effects.push(...e)
      : t.effects.push(e)
    : _o(e);
}
const Ao = Symbol.for("v-scx"),
  Io = () => Zt(Ao),
  Wt = {};
function Ln(e, t, n) {
  return kr(e, t, n);
}
function kr(
  e,
  t,
  { immediate: n, deep: s, flush: r, once: i, onTrack: o, onTrigger: l } = G
) {
  if (t && i) {
    const j = t;
    t = (...ae) => {
      j(...ae), Q();
    };
  }
  const a = ce,
    f = (j) => (s === !0 ? j : et(j, s === !1 ? 1 : void 0));
  let d,
    _ = !1,
    x = !1;
  if (
    (me(e)
      ? ((d = () => e.value), (_ = tn(e)))
      : pt(e)
      ? ((d = () => f(e)), (_ = !0))
      : T(e)
      ? ((x = !0),
        (_ = e.some((j) => pt(j) || tn(j))),
        (d = () =>
          e.map((j) => {
            if (me(j)) return j.value;
            if (pt(j)) return f(j);
            if (F(j)) return ke(j, a, 2);
          })))
      : F(e)
      ? t
        ? (d = () => ke(e, a, 2))
        : (d = () => (S && S(), xe(e, a, 3, [B])))
      : (d = ye),
    t && s)
  ) {
    const j = d;
    d = () => et(j());
  }
  let S,
    B = (j) => {
      S = D.onStop = () => {
        ke(j, a, 4), (S = D.onStop = void 0);
      };
    },
    R;
  if (Cn)
    if (
      ((B = ye),
      t ? n && xe(t, a, 3, [d(), x ? [] : void 0, B]) : d(),
      r === "sync")
    ) {
      const j = Io();
      R = j.__watcherHandles || (j.__watcherHandles = []);
    } else return ye;
  let L = x ? new Array(e.length).fill(Wt) : Wt;
  const N = () => {
    if (!(!D.active || !D.dirty))
      if (t) {
        const j = D.run();
        (s || _ || (x ? j.some((ae, O) => ze(ae, L[O])) : ze(j, L))) &&
          (S && S(),
          xe(t, a, 3, [j, L === Wt ? void 0 : x && L[0] === Wt ? [] : L, B]),
          (L = j));
      } else D.run();
  };
  N.allowRecurse = !!t;
  let se;
  r === "sync"
    ? (se = N)
    : r === "post"
    ? (se = () => de(N, a && a.suspense))
    : ((N.pre = !0), a && (N.id = a.uid), (se = () => ds(N)));
  const D = new ss(d, ye, se),
    k = Ui(),
    Q = () => {
      D.stop(), k && es(k.effects, D);
    };
  return (
    t
      ? n
        ? N()
        : (L = D.run())
      : r === "post"
      ? de(D.run.bind(D), a && a.suspense)
      : D.run(),
    R && R.push(Q),
    Q
  );
}
function Oo(e, t, n) {
  const s = this.proxy,
    r = te(e) ? (e.includes(".") ? Wr(s, e) : () => s[e]) : e.bind(s, s);
  let i;
  F(t) ? (i = t) : ((i = t.handler), (n = t));
  const o = Ft(this),
    l = kr(r, i.bind(s), n);
  return o(), l;
}
function Wr(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++) s = s[n[r]];
    return s;
  };
}
function et(e, t, n = 0, s) {
  if (!z(e) || e.__v_skip) return e;
  if (t && t > 0) {
    if (n >= t) return e;
    n++;
  }
  if (((s = s || new Set()), s.has(e))) return e;
  if ((s.add(e), me(e))) et(e.value, t, n, s);
  else if (T(e)) for (let r = 0; r < e.length; r++) et(e[r], t, n, s);
  else if (dn(e) || ht(e))
    e.forEach((r) => {
      et(r, t, n, s);
    });
  else if (pr(e)) for (const r in e) et(e[r], t, n, s);
  return e;
}
function zt(e, t) {
  if (pe === null) return e;
  const n = wn(pe) || pe.proxy,
    s = e.dirs || (e.dirs = []);
  for (let r = 0; r < t.length; r++) {
    let [i, o, l, a = G] = t[r];
    i &&
      (F(i) && (i = { mounted: i, updated: i }),
      i.deep && et(o),
      s.push({
        dir: i,
        instance: n,
        value: o,
        oldValue: void 0,
        arg: l,
        modifiers: a,
      }));
  }
  return e;
}
function Je(e, t, n, s) {
  const r = e.dirs,
    i = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    i && (l.oldValue = i[o].value);
    let a = l.dir[s];
    a && (ot(), xe(a, n, 8, [e.el, l, e, t]), lt());
  }
}
const at = Symbol("_leaveCb"),
  qt = Symbol("_enterCb");
function Po() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: new Map(),
  };
  return (
    hs(() => {
      e.isMounted = !0;
    }),
    ps(() => {
      e.isUnmounting = !0;
    }),
    e
  );
}
const ve = [Function, Array],
  Mo = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: ve,
    onEnter: ve,
    onAfterEnter: ve,
    onEnterCancelled: ve,
    onBeforeLeave: ve,
    onLeave: ve,
    onAfterLeave: ve,
    onLeaveCancelled: ve,
    onBeforeAppear: ve,
    onAppear: ve,
    onAfterAppear: ve,
    onAppearCancelled: ve,
  };
function Ro(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || ((s = Object.create(null)), n.set(t.type, s)), s;
}
function Kn(e, t, n, s) {
  const {
      appear: r,
      mode: i,
      persisted: o = !1,
      onBeforeEnter: l,
      onEnter: a,
      onAfterEnter: f,
      onEnterCancelled: d,
      onBeforeLeave: _,
      onLeave: x,
      onAfterLeave: S,
      onLeaveCancelled: B,
      onBeforeAppear: R,
      onAppear: L,
      onAfterAppear: N,
      onAppearCancelled: se,
    } = t,
    D = String(e.key),
    k = Ro(n, e),
    Q = (O, ee) => {
      O && xe(O, s, 9, ee);
    },
    j = (O, ee) => {
      const q = ee[1];
      Q(O, ee),
        T(O) ? O.every((oe) => oe.length <= 1) && q() : O.length <= 1 && q();
    },
    ae = {
      mode: i,
      persisted: o,
      beforeEnter(O) {
        let ee = l;
        if (!n.isMounted)
          if (r) ee = R || l;
          else return;
        O[at] && O[at](!0);
        const q = k[D];
        q && ut(e, q) && q.el[at] && q.el[at](), Q(ee, [O]);
      },
      enter(O) {
        let ee = a,
          q = f,
          oe = d;
        if (!n.isMounted)
          if (r) (ee = L || a), (q = N || f), (oe = se || d);
          else return;
        let $ = !1;
        const J = (O[qt] = (_e) => {
          $ ||
            (($ = !0),
            _e ? Q(oe, [O]) : Q(q, [O]),
            ae.delayedLeave && ae.delayedLeave(),
            (O[qt] = void 0));
        });
        ee ? j(ee, [O, J]) : J();
      },
      leave(O, ee) {
        const q = String(e.key);
        if ((O[qt] && O[qt](!0), n.isUnmounting)) return ee();
        Q(_, [O]);
        let oe = !1;
        const $ = (O[at] = (J) => {
          oe ||
            ((oe = !0),
            ee(),
            J ? Q(B, [O]) : Q(S, [O]),
            (O[at] = void 0),
            k[q] === e && delete k[q]);
        });
        (k[q] = e), x ? j(x, [O, $]) : $();
      },
      clone(O) {
        return Kn(O, t, n, s);
      },
    };
  return ae;
}
function kn(e, t) {
  e.shapeFlag & 6 && e.component
    ? kn(e.component.subTree, t)
    : e.shapeFlag & 128
    ? ((e.ssContent.transition = t.clone(e.ssContent)),
      (e.ssFallback.transition = t.clone(e.ssFallback)))
    : (e.transition = t);
}
function zr(e, t = !1, n) {
  let s = [],
    r = 0;
  for (let i = 0; i < e.length; i++) {
    let o = e[i];
    const l = n == null ? o.key : String(n) + String(o.key != null ? o.key : i);
    o.type === he
      ? (o.patchFlag & 128 && r++, (s = s.concat(zr(o.children, t, l))))
      : (t || o.type !== yt) && s.push(l != null ? it(o, { key: l }) : o);
  }
  if (r > 1) for (let i = 0; i < s.length; i++) s[i].patchFlag = -2;
  return s;
}
const Xt = (e) => !!e.type.__asyncLoader,
  qr = (e) => e.type.__isKeepAlive;
function No(e, t) {
  Gr(e, "a", t);
}
function Fo(e, t) {
  Gr(e, "da", t);
}
function Gr(e, t, n = ce) {
  const s =
    e.__wdc ||
    (e.__wdc = () => {
      let r = n;
      for (; r; ) {
        if (r.isDeactivated) return;
        r = r.parent;
      }
      return e();
    });
  if ((vn(t, s, n), n)) {
    let r = n.parent;
    for (; r && r.parent; )
      qr(r.parent.vnode) && jo(s, t, n, r), (r = r.parent);
  }
}
function jo(e, t, n, s) {
  const r = vn(t, e, s, !0);
  Yr(() => {
    es(s[t], r);
  }, n);
}
function vn(e, t, n = ce, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []),
      i =
        t.__weh ||
        (t.__weh = (...o) => {
          if (n.isUnmounted) return;
          ot();
          const l = Ft(n),
            a = xe(t, n, e, o);
          return l(), lt(), a;
        });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const Fe =
    (e) =>
    (t, n = ce) =>
      (!Cn || e === "sp") && vn(e, (...s) => t(...s), n),
  Vo = Fe("bm"),
  hs = Fe("m"),
  Ho = Fe("bu"),
  Jr = Fe("u"),
  ps = Fe("bum"),
  Yr = Fe("um"),
  Uo = Fe("sp"),
  Bo = Fe("rtg"),
  Do = Fe("rtc");
function Ko(e, t = ce) {
  vn("ec", e, t);
}
function Xr(e, t, n, s) {
  let r;
  const i = n;
  if (T(e) || te(e)) {
    r = new Array(e.length);
    for (let o = 0, l = e.length; o < l; o++) r[o] = t(e[o], o, void 0, i);
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let o = 0; o < e; o++) r[o] = t(o + 1, o, void 0, i);
  } else if (z(e))
    if (e[Symbol.iterator]) r = Array.from(e, (o, l) => t(o, l, void 0, i));
    else {
      const o = Object.keys(e);
      r = new Array(o.length);
      for (let l = 0, a = o.length; l < a; l++) {
        const f = o[l];
        r[l] = t(e[f], f, l, i);
      }
    }
  else r = [];
  return r;
}
const Wn = (e) => (e ? (ai(e) ? wn(e) || e.proxy : Wn(e.parent)) : null),
  At = ie(Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Wn(e.parent),
    $root: (e) => Wn(e.root),
    $emit: (e) => e.emit,
    $options: (e) => Qr(e),
    $forceUpdate: (e) =>
      e.f ||
      (e.f = () => {
        (e.effect.dirty = !0), ds(e.update);
      }),
    $nextTick: (e) => e.n || (e.n = po.bind(e.proxy)),
    $watch: (e) => Oo.bind(e),
  }),
  An = (e, t) => e !== G && !e.__isScriptSetup && H(e, t),
  ko = {
    get({ _: e }, t) {
      const {
        ctx: n,
        setupState: s,
        data: r,
        props: i,
        accessCache: o,
        type: l,
        appContext: a,
      } = e;
      let f;
      if (t[0] !== "$") {
        const S = o[t];
        if (S !== void 0)
          switch (S) {
            case 1:
              return s[t];
            case 2:
              return r[t];
            case 4:
              return n[t];
            case 3:
              return i[t];
          }
        else {
          if (An(s, t)) return (o[t] = 1), s[t];
          if (r !== G && H(r, t)) return (o[t] = 2), r[t];
          if ((f = e.propsOptions[0]) && H(f, t)) return (o[t] = 3), i[t];
          if (n !== G && H(n, t)) return (o[t] = 4), n[t];
          zn && (o[t] = 0);
        }
      }
      const d = At[t];
      let _, x;
      if (d) return t === "$attrs" && ge(e, "get", t), d(e);
      if ((_ = l.__cssModules) && (_ = _[t])) return _;
      if (n !== G && H(n, t)) return (o[t] = 4), n[t];
      if (((x = a.config.globalProperties), H(x, t))) return x[t];
    },
    set({ _: e }, t, n) {
      const { data: s, setupState: r, ctx: i } = e;
      return An(r, t)
        ? ((r[t] = n), !0)
        : s !== G && H(s, t)
        ? ((s[t] = n), !0)
        : H(e.props, t) || (t[0] === "$" && t.slice(1) in e)
        ? !1
        : ((i[t] = n), !0);
    },
    has(
      {
        _: {
          data: e,
          setupState: t,
          accessCache: n,
          ctx: s,
          appContext: r,
          propsOptions: i,
        },
      },
      o
    ) {
      let l;
      return (
        !!n[o] ||
        (e !== G && H(e, o)) ||
        An(t, o) ||
        ((l = i[0]) && H(l, o)) ||
        H(s, o) ||
        H(At, o) ||
        H(r.config.globalProperties, o)
      );
    },
    defineProperty(e, t, n) {
      return (
        n.get != null
          ? (e._.accessCache[t] = 0)
          : H(n, "value") && this.set(e, t, n.value, null),
        Reflect.defineProperty(e, t, n)
      );
    },
  };
function js(e) {
  return T(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e;
}
let zn = !0;
function Wo(e) {
  const t = Qr(e),
    n = e.proxy,
    s = e.ctx;
  (zn = !1), t.beforeCreate && Vs(t.beforeCreate, e, "bc");
  const {
    data: r,
    computed: i,
    methods: o,
    watch: l,
    provide: a,
    inject: f,
    created: d,
    beforeMount: _,
    mounted: x,
    beforeUpdate: S,
    updated: B,
    activated: R,
    deactivated: L,
    beforeDestroy: N,
    beforeUnmount: se,
    destroyed: D,
    unmounted: k,
    render: Q,
    renderTracked: j,
    renderTriggered: ae,
    errorCaptured: O,
    serverPrefetch: ee,
    expose: q,
    inheritAttrs: oe,
    components: $,
    directives: J,
    filters: _e,
  } = t;
  if ((f && zo(f, s, null), o))
    for (const Y in o) {
      const W = o[Y];
      F(W) && (s[Y] = W.bind(n));
    }
  if (r) {
    const Y = r.call(n, n);
    z(Y) && (e.data = cs(Y));
  }
  if (((zn = !0), i))
    for (const Y in i) {
      const W = i[Y],
        qe = F(W) ? W.bind(n, n) : F(W.get) ? W.get.bind(n, n) : ye,
        Vt = !F(W) && F(W.set) ? W.set.bind(n) : ye,
        Ge = El({ get: qe, set: Vt });
      Object.defineProperty(s, Y, {
        enumerable: !0,
        configurable: !0,
        get: () => Ge.value,
        set: (Se) => (Ge.value = Se),
      });
    }
  if (l) for (const Y in l) Zr(l[Y], s, n, Y);
  if (a) {
    const Y = F(a) ? a.call(n) : a;
    Reflect.ownKeys(Y).forEach((W) => {
      Zo(W, Y[W]);
    });
  }
  d && Vs(d, e, "c");
  function re(Y, W) {
    T(W) ? W.forEach((qe) => Y(qe.bind(n))) : W && Y(W.bind(n));
  }
  if (
    (re(Vo, _),
    re(hs, x),
    re(Ho, S),
    re(Jr, B),
    re(No, R),
    re(Fo, L),
    re(Ko, O),
    re(Do, j),
    re(Bo, ae),
    re(ps, se),
    re(Yr, k),
    re(Uo, ee),
    T(q))
  )
    if (q.length) {
      const Y = e.exposed || (e.exposed = {});
      q.forEach((W) => {
        Object.defineProperty(Y, W, {
          get: () => n[W],
          set: (qe) => (n[W] = qe),
        });
      });
    } else e.exposed || (e.exposed = {});
  Q && e.render === ye && (e.render = Q),
    oe != null && (e.inheritAttrs = oe),
    $ && (e.components = $),
    J && (e.directives = J);
}
function zo(e, t, n = ye) {
  T(e) && (e = qn(e));
  for (const s in e) {
    const r = e[s];
    let i;
    z(r)
      ? "default" in r
        ? (i = Zt(r.from || s, r.default, !0))
        : (i = Zt(r.from || s))
      : (i = Zt(r)),
      me(i)
        ? Object.defineProperty(t, s, {
            enumerable: !0,
            configurable: !0,
            get: () => i.value,
            set: (o) => (i.value = o),
          })
        : (t[s] = i);
  }
}
function Vs(e, t, n) {
  xe(T(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Zr(e, t, n, s) {
  const r = s.includes(".") ? Wr(n, s) : () => n[s];
  if (te(e)) {
    const i = t[e];
    F(i) && Ln(r, i);
  } else if (F(e)) Ln(r, e.bind(n));
  else if (z(e))
    if (T(e)) e.forEach((i) => Zr(i, t, n, s));
    else {
      const i = F(e.handler) ? e.handler.bind(n) : t[e.handler];
      F(i) && Ln(r, i, e);
    }
}
function Qr(e) {
  const t = e.type,
    { mixins: n, extends: s } = t,
    {
      mixins: r,
      optionsCache: i,
      config: { optionMergeStrategies: o },
    } = e.appContext,
    l = i.get(t);
  let a;
  return (
    l
      ? (a = l)
      : !r.length && !n && !s
      ? (a = t)
      : ((a = {}), r.length && r.forEach((f) => sn(a, f, o, !0)), sn(a, t, o)),
    z(t) && i.set(t, a),
    a
  );
}
function sn(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && sn(e, i, n, !0), r && r.forEach((o) => sn(e, o, n, !0));
  for (const o in t)
    if (!(s && o === "expose")) {
      const l = qo[o] || (n && n[o]);
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const qo = {
  data: Hs,
  props: Us,
  emits: Us,
  methods: Lt,
  computed: Lt,
  beforeCreate: fe,
  created: fe,
  beforeMount: fe,
  mounted: fe,
  beforeUpdate: fe,
  updated: fe,
  beforeDestroy: fe,
  beforeUnmount: fe,
  destroyed: fe,
  unmounted: fe,
  activated: fe,
  deactivated: fe,
  errorCaptured: fe,
  serverPrefetch: fe,
  components: Lt,
  directives: Lt,
  watch: Jo,
  provide: Hs,
  inject: Go,
};
function Hs(e, t) {
  return t
    ? e
      ? function () {
          return ie(
            F(e) ? e.call(this, this) : e,
            F(t) ? t.call(this, this) : t
          );
        }
      : t
    : e;
}
function Go(e, t) {
  return Lt(qn(e), qn(t));
}
function qn(e) {
  if (T(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
    return t;
  }
  return e;
}
function fe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Lt(e, t) {
  return e ? ie(Object.create(null), e, t) : t;
}
function Us(e, t) {
  return e
    ? T(e) && T(t)
      ? [...new Set([...e, ...t])]
      : ie(Object.create(null), js(e), js(t ?? {}))
    : t;
}
function Jo(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ie(Object.create(null), e);
  for (const s in t) n[s] = fe(e[s], t[s]);
  return n;
}
function ei() {
  return {
    app: null,
    config: {
      isNativeTag: Ei,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}
let Yo = 0;
function Xo(e, t) {
  return function (s, r = null) {
    F(s) || (s = ie({}, s)), r != null && !z(r) && (r = null);
    const i = ei(),
      o = new WeakSet();
    let l = !1;
    const a = (i.app = {
      _uid: Yo++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: Sl,
      get config() {
        return i.config;
      },
      set config(f) {},
      use(f, ...d) {
        return (
          o.has(f) ||
            (f && F(f.install)
              ? (o.add(f), f.install(a, ...d))
              : F(f) && (o.add(f), f(a, ...d))),
          a
        );
      },
      mixin(f) {
        return i.mixins.includes(f) || i.mixins.push(f), a;
      },
      component(f, d) {
        return d ? ((i.components[f] = d), a) : i.components[f];
      },
      directive(f, d) {
        return d ? ((i.directives[f] = d), a) : i.directives[f];
      },
      mount(f, d, _) {
        if (!l) {
          const x = Ee(s, r);
          return (
            (x.appContext = i),
            _ === !0 ? (_ = "svg") : _ === !1 && (_ = void 0),
            e(x, f, _),
            (l = !0),
            (a._container = f),
            (f.__vue_app__ = a),
            wn(x.component) || x.component.proxy
          );
        }
      },
      unmount() {
        l && (e(null, a._container), delete a._container.__vue_app__);
      },
      provide(f, d) {
        return (i.provides[f] = d), a;
      },
      runWithContext(f) {
        rn = a;
        try {
          return f();
        } finally {
          rn = null;
        }
      },
    });
    return a;
  };
}
let rn = null;
function Zo(e, t) {
  if (ce) {
    let n = ce.provides;
    const s = ce.parent && ce.parent.provides;
    s === n && (n = ce.provides = Object.create(s)), (n[e] = t);
  }
}
function Zt(e, t, n = !1) {
  const s = ce || pe;
  if (s || rn) {
    const r = s
      ? s.parent == null
        ? s.vnode.appContext && s.vnode.appContext.provides
        : s.parent.provides
      : rn._context.provides;
    if (r && e in r) return r[e];
    if (arguments.length > 1) return n && F(t) ? t.call(s && s.proxy) : t;
  }
}
function Qo(e, t, n, s = !1) {
  const r = {},
    i = {};
  en(i, xn, 1), (e.propsDefaults = Object.create(null)), ti(e, t, r, i);
  for (const o in e.propsOptions[0]) o in r || (r[o] = void 0);
  n ? (e.props = s ? r : oo(r)) : e.type.props ? (e.props = r) : (e.props = i),
    (e.attrs = i);
}
function el(e, t, n, s) {
  const {
      props: r,
      attrs: i,
      vnode: { patchFlag: o },
    } = e,
    l = U(r),
    [a] = e.propsOptions;
  let f = !1;
  if ((s || o > 0) && !(o & 16)) {
    if (o & 8) {
      const d = e.vnode.dynamicProps;
      for (let _ = 0; _ < d.length; _++) {
        let x = d[_];
        if (_n(e.emitsOptions, x)) continue;
        const S = t[x];
        if (a)
          if (H(i, x)) S !== i[x] && ((i[x] = S), (f = !0));
          else {
            const B = _t(x);
            r[B] = Gn(a, l, B, S, e, !1);
          }
        else S !== i[x] && ((i[x] = S), (f = !0));
      }
    }
  } else {
    ti(e, t, r, i) && (f = !0);
    let d;
    for (const _ in l)
      (!t || (!H(t, _) && ((d = wt(_)) === _ || !H(t, d)))) &&
        (a
          ? n &&
            (n[_] !== void 0 || n[d] !== void 0) &&
            (r[_] = Gn(a, l, _, void 0, e, !0))
          : delete r[_]);
    if (i !== l) for (const _ in i) (!t || !H(t, _)) && (delete i[_], (f = !0));
  }
  f && Re(e, "set", "$attrs");
}
function ti(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let o = !1,
    l;
  if (t)
    for (let a in t) {
      if (Gt(a)) continue;
      const f = t[a];
      let d;
      r && H(r, (d = _t(a)))
        ? !i || !i.includes(d)
          ? (n[d] = f)
          : ((l || (l = {}))[d] = f)
        : _n(e.emitsOptions, a) ||
          ((!(a in s) || f !== s[a]) && ((s[a] = f), (o = !0)));
    }
  if (i) {
    const a = U(n),
      f = l || G;
    for (let d = 0; d < i.length; d++) {
      const _ = i[d];
      n[_] = Gn(r, a, _, f[_], e, !H(f, _));
    }
  }
  return o;
}
function Gn(e, t, n, s, r, i) {
  const o = e[n];
  if (o != null) {
    const l = H(o, "default");
    if (l && s === void 0) {
      const a = o.default;
      if (o.type !== Function && !o.skipFactory && F(a)) {
        const { propsDefaults: f } = r;
        if (n in f) s = f[n];
        else {
          const d = Ft(r);
          (s = f[n] = a.call(null, t)), d();
        }
      } else s = a;
    }
    o[0] &&
      (i && !l ? (s = !1) : o[1] && (s === "" || s === wt(n)) && (s = !0));
  }
  return s;
}
function ni(e, t, n = !1) {
  const s = t.propsCache,
    r = s.get(e);
  if (r) return r;
  const i = e.props,
    o = {},
    l = [];
  let a = !1;
  if (!F(e)) {
    const d = (_) => {
      a = !0;
      const [x, S] = ni(_, t, !0);
      ie(o, x), S && l.push(...S);
    };
    !n && t.mixins.length && t.mixins.forEach(d),
      e.extends && d(e.extends),
      e.mixins && e.mixins.forEach(d);
  }
  if (!i && !a) return z(e) && s.set(e, dt), dt;
  if (T(i))
    for (let d = 0; d < i.length; d++) {
      const _ = _t(i[d]);
      Bs(_) && (o[_] = G);
    }
  else if (i)
    for (const d in i) {
      const _ = _t(d);
      if (Bs(_)) {
        const x = i[d],
          S = (o[_] = T(x) || F(x) ? { type: x } : ie({}, x));
        if (S) {
          const B = ks(Boolean, S.type),
            R = ks(String, S.type);
          (S[0] = B > -1),
            (S[1] = R < 0 || B < R),
            (B > -1 || H(S, "default")) && l.push(_);
        }
      }
    }
  const f = [o, l];
  return z(e) && s.set(e, f), f;
}
function Bs(e) {
  return e[0] !== "$";
}
function Ds(e) {
  const t = e && e.toString().match(/^\s*(function|class) (\w+)/);
  return t ? t[2] : e === null ? "null" : "";
}
function Ks(e, t) {
  return Ds(e) === Ds(t);
}
function ks(e, t) {
  return T(t) ? t.findIndex((n) => Ks(n, e)) : F(t) && Ks(t, e) ? 0 : -1;
}
const si = (e) => e[0] === "_" || e === "$stable",
  gs = (e) => (T(e) ? e.map(Ae) : [Ae(e)]),
  tl = (e, t, n) => {
    if (t._n) return t;
    const s = Kr((...r) => gs(t(...r)), n);
    return (s._c = !1), s;
  },
  ri = (e, t, n) => {
    const s = e._ctx;
    for (const r in e) {
      if (si(r)) continue;
      const i = e[r];
      if (F(i)) t[r] = tl(r, i, s);
      else if (i != null) {
        const o = gs(i);
        t[r] = () => o;
      }
    }
  },
  ii = (e, t) => {
    const n = gs(t);
    e.slots.default = () => n;
  },
  nl = (e, t) => {
    if (e.vnode.shapeFlag & 32) {
      const n = t._;
      n ? ((e.slots = U(t)), en(t, "_", n)) : ri(t, (e.slots = {}));
    } else (e.slots = {}), t && ii(e, t);
    en(e.slots, xn, 1);
  },
  sl = (e, t, n) => {
    const { vnode: s, slots: r } = e;
    let i = !0,
      o = G;
    if (s.shapeFlag & 32) {
      const l = t._;
      l
        ? n && l === 1
          ? (i = !1)
          : (ie(r, t), !n && l === 1 && delete r._)
        : ((i = !t.$stable), ri(t, r)),
        (o = t);
    } else t && (ii(e, t), (o = { default: 1 }));
    if (i) for (const l in r) !si(l) && o[l] == null && delete r[l];
  };
function Jn(e, t, n, s, r = !1) {
  if (T(e)) {
    e.forEach((x, S) => Jn(x, t && (T(t) ? t[S] : t), n, s, r));
    return;
  }
  if (Xt(s) && !r) return;
  const i = s.shapeFlag & 4 ? wn(s.component) || s.component.proxy : s.el,
    o = r ? null : i,
    { i: l, r: a } = e,
    f = t && t.r,
    d = l.refs === G ? (l.refs = {}) : l.refs,
    _ = l.setupState;
  if (
    (f != null &&
      f !== a &&
      (te(f)
        ? ((d[f] = null), H(_, f) && (_[f] = null))
        : me(f) && (f.value = null)),
    F(a))
  )
    ke(a, l, 12, [o, d]);
  else {
    const x = te(a),
      S = me(a),
      B = e.f;
    if (x || S) {
      const R = () => {
        if (B) {
          const L = x ? (H(_, a) ? _[a] : d[a]) : a.value;
          r
            ? T(L) && es(L, i)
            : T(L)
            ? L.includes(i) || L.push(i)
            : x
            ? ((d[a] = [i]), H(_, a) && (_[a] = d[a]))
            : ((a.value = [i]), e.k && (d[e.k] = a.value));
        } else
          x
            ? ((d[a] = o), H(_, a) && (_[a] = o))
            : S && ((a.value = o), e.k && (d[e.k] = o));
      };
      r || B ? R() : ((R.id = -1), de(R, n));
    }
  }
}
const de = Lo;
function rl(e) {
  return il(e);
}
function il(e, t) {
  const n = mr();
  n.__VUE__ = !0;
  const {
      insert: s,
      remove: r,
      patchProp: i,
      createElement: o,
      createText: l,
      createComment: a,
      setText: f,
      setElementText: d,
      parentNode: _,
      nextSibling: x,
      setScopeId: S = ye,
      insertStaticContent: B,
    } = e,
    R = (
      c,
      u,
      h,
      p = null,
      g = null,
      v = null,
      C = void 0,
      b = null,
      y = !!u.dynamicChildren
    ) => {
      if (c === u) return;
      c && !ut(c, u) && ((p = Ht(c)), Se(c, g, v, !0), (c = null)),
        u.patchFlag === -2 && ((y = !1), (u.dynamicChildren = null));
      const { type: m, ref: w, shapeFlag: A } = u;
      switch (m) {
        case yn:
          L(c, u, h, p);
          break;
        case yt:
          N(c, u, h, p);
          break;
        case On:
          c == null && se(u, h, p, C);
          break;
        case he:
          $(c, u, h, p, g, v, C, b, y);
          break;
        default:
          A & 1
            ? Q(c, u, h, p, g, v, C, b, y)
            : A & 6
            ? J(c, u, h, p, g, v, C, b, y)
            : (A & 64 || A & 128) && m.process(c, u, h, p, g, v, C, b, y, Et);
      }
      w != null && g && Jn(w, c && c.ref, v, u || c, !u);
    },
    L = (c, u, h, p) => {
      if (c == null) s((u.el = l(u.children)), h, p);
      else {
        const g = (u.el = c.el);
        u.children !== c.children && f(g, u.children);
      }
    },
    N = (c, u, h, p) => {
      c == null ? s((u.el = a(u.children || "")), h, p) : (u.el = c.el);
    },
    se = (c, u, h, p) => {
      [c.el, c.anchor] = B(c.children, u, h, p, c.el, c.anchor);
    },
    D = ({ el: c, anchor: u }, h, p) => {
      let g;
      for (; c && c !== u; ) (g = x(c)), s(c, h, p), (c = g);
      s(u, h, p);
    },
    k = ({ el: c, anchor: u }) => {
      let h;
      for (; c && c !== u; ) (h = x(c)), r(c), (c = h);
      r(u);
    },
    Q = (c, u, h, p, g, v, C, b, y) => {
      u.type === "svg" ? (C = "svg") : u.type === "math" && (C = "mathml"),
        c == null ? j(u, h, p, g, v, C, b, y) : ee(c, u, g, v, C, b, y);
    },
    j = (c, u, h, p, g, v, C, b) => {
      let y, m;
      const { props: w, shapeFlag: A, transition: E, dirs: I } = c;
      if (
        ((y = c.el = o(c.type, v, w && w.is, w)),
        A & 8
          ? d(y, c.children)
          : A & 16 && O(c.children, y, null, p, g, In(c, v), C, b),
        I && Je(c, null, p, "created"),
        ae(y, c, c.scopeId, C, p),
        w)
      ) {
        for (const K in w)
          K !== "value" &&
            !Gt(K) &&
            i(y, K, null, w[K], v, c.children, p, g, Oe);
        "value" in w && i(y, "value", null, w.value, v),
          (m = w.onVnodeBeforeMount) && Le(m, p, c);
      }
      I && Je(c, null, p, "beforeMount");
      const V = ol(g, E);
      V && E.beforeEnter(y),
        s(y, u, h),
        ((m = w && w.onVnodeMounted) || V || I) &&
          de(() => {
            m && Le(m, p, c), V && E.enter(y), I && Je(c, null, p, "mounted");
          }, g);
    },
    ae = (c, u, h, p, g) => {
      if ((h && S(c, h), p)) for (let v = 0; v < p.length; v++) S(c, p[v]);
      if (g) {
        let v = g.subTree;
        if (u === v) {
          const C = g.vnode;
          ae(c, C, C.scopeId, C.slotScopeIds, g.parent);
        }
      }
    },
    O = (c, u, h, p, g, v, C, b, y = 0) => {
      for (let m = y; m < c.length; m++) {
        const w = (c[m] = b ? Be(c[m]) : Ae(c[m]));
        R(null, w, u, h, p, g, v, C, b);
      }
    },
    ee = (c, u, h, p, g, v, C) => {
      const b = (u.el = c.el);
      let { patchFlag: y, dynamicChildren: m, dirs: w } = u;
      y |= c.patchFlag & 16;
      const A = c.props || G,
        E = u.props || G;
      let I;
      if (
        (h && Ye(h, !1),
        (I = E.onVnodeBeforeUpdate) && Le(I, h, u, c),
        w && Je(u, c, h, "beforeUpdate"),
        h && Ye(h, !0),
        m
          ? q(c.dynamicChildren, m, b, h, p, In(u, g), v)
          : C || W(c, u, b, null, h, p, In(u, g), v, !1),
        y > 0)
      ) {
        if (y & 16) oe(b, u, A, E, h, p, g);
        else if (
          (y & 2 && A.class !== E.class && i(b, "class", null, E.class, g),
          y & 4 && i(b, "style", A.style, E.style, g),
          y & 8)
        ) {
          const V = u.dynamicProps;
          for (let K = 0; K < V.length; K++) {
            const X = V[K],
              ue = A[X],
              Ce = E[X];
            (Ce !== ue || X === "value") &&
              i(b, X, ue, Ce, g, c.children, h, p, Oe);
          }
        }
        y & 1 && c.children !== u.children && d(b, u.children);
      } else !C && m == null && oe(b, u, A, E, h, p, g);
      ((I = E.onVnodeUpdated) || w) &&
        de(() => {
          I && Le(I, h, u, c), w && Je(u, c, h, "updated");
        }, p);
    },
    q = (c, u, h, p, g, v, C) => {
      for (let b = 0; b < u.length; b++) {
        const y = c[b],
          m = u[b],
          w =
            y.el && (y.type === he || !ut(y, m) || y.shapeFlag & 70)
              ? _(y.el)
              : h;
        R(y, m, w, null, p, g, v, C, !0);
      }
    },
    oe = (c, u, h, p, g, v, C) => {
      if (h !== p) {
        if (h !== G)
          for (const b in h)
            !Gt(b) && !(b in p) && i(c, b, h[b], null, C, u.children, g, v, Oe);
        for (const b in p) {
          if (Gt(b)) continue;
          const y = p[b],
            m = h[b];
          y !== m && b !== "value" && i(c, b, m, y, C, u.children, g, v, Oe);
        }
        "value" in p && i(c, "value", h.value, p.value, C);
      }
    },
    $ = (c, u, h, p, g, v, C, b, y) => {
      const m = (u.el = c ? c.el : l("")),
        w = (u.anchor = c ? c.anchor : l(""));
      let { patchFlag: A, dynamicChildren: E, slotScopeIds: I } = u;
      I && (b = b ? b.concat(I) : I),
        c == null
          ? (s(m, h, p), s(w, h, p), O(u.children || [], h, w, g, v, C, b, y))
          : A > 0 && A & 64 && E && c.dynamicChildren
          ? (q(c.dynamicChildren, E, h, g, v, C, b),
            (u.key != null || (g && u === g.subTree)) && oi(c, u, !0))
          : W(c, u, h, w, g, v, C, b, y);
    },
    J = (c, u, h, p, g, v, C, b, y) => {
      (u.slotScopeIds = b),
        c == null
          ? u.shapeFlag & 512
            ? g.ctx.activate(u, h, p, C, y)
            : _e(u, h, p, g, v, C, y)
          : $t(c, u, y);
    },
    _e = (c, u, h, p, g, v, C) => {
      const b = (c.component = bl(c, p, g));
      if ((qr(c) && (b.ctx.renderer = Et), yl(b), b.asyncDep)) {
        if ((g && g.registerDep(b, re), !c.el)) {
          const y = (b.subTree = Ee(yt));
          N(null, y, u, h);
        }
      } else re(b, c, u, h, g, v, C);
    },
    $t = (c, u, h) => {
      const p = (u.component = c.component);
      if ($o(c, u, h))
        if (p.asyncDep && !p.asyncResolved) {
          Y(p, u, h);
          return;
        } else (p.next = u), mo(p.update), (p.effect.dirty = !0), p.update();
      else (u.el = c.el), (p.vnode = u);
    },
    re = (c, u, h, p, g, v, C) => {
      const b = () => {
          if (c.isMounted) {
            let { next: w, bu: A, u: E, parent: I, vnode: V } = c;
            {
              const ct = li(c);
              if (ct) {
                w && ((w.el = V.el), Y(c, w, C)),
                  ct.asyncDep.then(() => {
                    c.isUnmounted || b();
                  });
                return;
              }
            }
            let K = w,
              X;
            Ye(c, !1),
              w ? ((w.el = V.el), Y(c, w, C)) : (w = V),
              A && Jt(A),
              (X = w.props && w.props.onVnodeBeforeUpdate) && Le(X, I, w, V),
              Ye(c, !0);
            const ue = Ns(c),
              Ce = c.subTree;
            (c.subTree = ue),
              R(Ce, ue, _(Ce.el), Ht(Ce), c, g, v),
              (w.el = ue.el),
              K === null && Eo(c, ue.el),
              E && de(E, g),
              (X = w.props && w.props.onVnodeUpdated) &&
                de(() => Le(X, I, w, V), g);
          } else {
            let w;
            const { el: A, props: E } = u,
              { bm: I, m: V, parent: K } = c,
              X = Xt(u);
            Ye(c, !1),
              I && Jt(I),
              !X && (w = E && E.onVnodeBeforeMount) && Le(w, K, u),
              Ye(c, !0);
            {
              const ue = (c.subTree = Ns(c));
              R(null, ue, h, p, c, g, v), (u.el = ue.el);
            }
            if ((V && de(V, g), !X && (w = E && E.onVnodeMounted))) {
              const ue = u;
              de(() => Le(w, K, ue), g);
            }
            (u.shapeFlag & 256 ||
              (K && Xt(K.vnode) && K.vnode.shapeFlag & 256)) &&
              c.a &&
              de(c.a, g),
              (c.isMounted = !0),
              (u = h = p = null);
          }
        },
        y = (c.effect = new ss(b, ye, () => ds(m), c.scope)),
        m = (c.update = () => {
          y.dirty && y.run();
        });
      (m.id = c.uid), Ye(c, !0), m();
    },
    Y = (c, u, h) => {
      u.component = c;
      const p = c.vnode.props;
      (c.vnode = u),
        (c.next = null),
        el(c, u.props, p, h),
        sl(c, u.children, h),
        ot(),
        Rs(c),
        lt();
    },
    W = (c, u, h, p, g, v, C, b, y = !1) => {
      const m = c && c.children,
        w = c ? c.shapeFlag : 0,
        A = u.children,
        { patchFlag: E, shapeFlag: I } = u;
      if (E > 0) {
        if (E & 128) {
          Vt(m, A, h, p, g, v, C, b, y);
          return;
        } else if (E & 256) {
          qe(m, A, h, p, g, v, C, b, y);
          return;
        }
      }
      I & 8
        ? (w & 16 && Oe(m, g, v), A !== m && d(h, A))
        : w & 16
        ? I & 16
          ? Vt(m, A, h, p, g, v, C, b, y)
          : Oe(m, g, v, !0)
        : (w & 8 && d(h, ""), I & 16 && O(A, h, p, g, v, C, b, y));
    },
    qe = (c, u, h, p, g, v, C, b, y) => {
      (c = c || dt), (u = u || dt);
      const m = c.length,
        w = u.length,
        A = Math.min(m, w);
      let E;
      for (E = 0; E < A; E++) {
        const I = (u[E] = y ? Be(u[E]) : Ae(u[E]));
        R(c[E], I, h, null, g, v, C, b, y);
      }
      m > w ? Oe(c, g, v, !0, !1, A) : O(u, h, p, g, v, C, b, y, A);
    },
    Vt = (c, u, h, p, g, v, C, b, y) => {
      let m = 0;
      const w = u.length;
      let A = c.length - 1,
        E = w - 1;
      for (; m <= A && m <= E; ) {
        const I = c[m],
          V = (u[m] = y ? Be(u[m]) : Ae(u[m]));
        if (ut(I, V)) R(I, V, h, null, g, v, C, b, y);
        else break;
        m++;
      }
      for (; m <= A && m <= E; ) {
        const I = c[A],
          V = (u[E] = y ? Be(u[E]) : Ae(u[E]));
        if (ut(I, V)) R(I, V, h, null, g, v, C, b, y);
        else break;
        A--, E--;
      }
      if (m > A) {
        if (m <= E) {
          const I = E + 1,
            V = I < w ? u[I].el : p;
          for (; m <= E; )
            R(null, (u[m] = y ? Be(u[m]) : Ae(u[m])), h, V, g, v, C, b, y), m++;
        }
      } else if (m > E) for (; m <= A; ) Se(c[m], g, v, !0), m++;
      else {
        const I = m,
          V = m,
          K = new Map();
        for (m = V; m <= E; m++) {
          const be = (u[m] = y ? Be(u[m]) : Ae(u[m]));
          be.key != null && K.set(be.key, m);
        }
        let X,
          ue = 0;
        const Ce = E - V + 1;
        let ct = !1,
          Cs = 0;
        const St = new Array(Ce);
        for (m = 0; m < Ce; m++) St[m] = 0;
        for (m = I; m <= A; m++) {
          const be = c[m];
          if (ue >= Ce) {
            Se(be, g, v, !0);
            continue;
          }
          let Te;
          if (be.key != null) Te = K.get(be.key);
          else
            for (X = V; X <= E; X++)
              if (St[X - V] === 0 && ut(be, u[X])) {
                Te = X;
                break;
              }
          Te === void 0
            ? Se(be, g, v, !0)
            : ((St[Te - V] = m + 1),
              Te >= Cs ? (Cs = Te) : (ct = !0),
              R(be, u[Te], h, null, g, v, C, b, y),
              ue++);
        }
        const ws = ct ? ll(St) : dt;
        for (X = ws.length - 1, m = Ce - 1; m >= 0; m--) {
          const be = V + m,
            Te = u[be],
            $s = be + 1 < w ? u[be + 1].el : p;
          St[m] === 0
            ? R(null, Te, h, $s, g, v, C, b, y)
            : ct && (X < 0 || m !== ws[X] ? Ge(Te, h, $s, 2) : X--);
        }
      }
    },
    Ge = (c, u, h, p, g = null) => {
      const { el: v, type: C, transition: b, children: y, shapeFlag: m } = c;
      if (m & 6) {
        Ge(c.component.subTree, u, h, p);
        return;
      }
      if (m & 128) {
        c.suspense.move(u, h, p);
        return;
      }
      if (m & 64) {
        C.move(c, u, h, Et);
        return;
      }
      if (C === he) {
        s(v, u, h);
        for (let A = 0; A < y.length; A++) Ge(y[A], u, h, p);
        s(c.anchor, u, h);
        return;
      }
      if (C === On) {
        D(c, u, h);
        return;
      }
      if (p !== 2 && m & 1 && b)
        if (p === 0) b.beforeEnter(v), s(v, u, h), de(() => b.enter(v), g);
        else {
          const { leave: A, delayLeave: E, afterLeave: I } = b,
            V = () => s(v, u, h),
            K = () => {
              A(v, () => {
                V(), I && I();
              });
            };
          E ? E(v, V, K) : K();
        }
      else s(v, u, h);
    },
    Se = (c, u, h, p = !1, g = !1) => {
      const {
        type: v,
        props: C,
        ref: b,
        children: y,
        dynamicChildren: m,
        shapeFlag: w,
        patchFlag: A,
        dirs: E,
      } = c;
      if ((b != null && Jn(b, null, h, c, !0), w & 256)) {
        u.ctx.deactivate(c);
        return;
      }
      const I = w & 1 && E,
        V = !Xt(c);
      let K;
      if ((V && (K = C && C.onVnodeBeforeUnmount) && Le(K, u, c), w & 6))
        $i(c.component, h, p);
      else {
        if (w & 128) {
          c.suspense.unmount(h, p);
          return;
        }
        I && Je(c, null, u, "beforeUnmount"),
          w & 64
            ? c.type.remove(c, u, h, g, Et, p)
            : m && (v !== he || (A > 0 && A & 64))
            ? Oe(m, u, h, !1, !0)
            : ((v === he && A & 384) || (!g && w & 16)) && Oe(y, u, h),
          p && ys(c);
      }
      ((V && (K = C && C.onVnodeUnmounted)) || I) &&
        de(() => {
          K && Le(K, u, c), I && Je(c, null, u, "unmounted");
        }, h);
    },
    ys = (c) => {
      const { type: u, el: h, anchor: p, transition: g } = c;
      if (u === he) {
        wi(h, p);
        return;
      }
      if (u === On) {
        k(c);
        return;
      }
      const v = () => {
        r(h), g && !g.persisted && g.afterLeave && g.afterLeave();
      };
      if (c.shapeFlag & 1 && g && !g.persisted) {
        const { leave: C, delayLeave: b } = g,
          y = () => C(h, v);
        b ? b(c.el, v, y) : y();
      } else v();
    },
    wi = (c, u) => {
      let h;
      for (; c !== u; ) (h = x(c)), r(c), (c = h);
      r(u);
    },
    $i = (c, u, h) => {
      const { bum: p, scope: g, update: v, subTree: C, um: b } = c;
      p && Jt(p),
        g.stop(),
        v && ((v.active = !1), Se(C, c, u, h)),
        b && de(b, u),
        de(() => {
          c.isUnmounted = !0;
        }, u),
        u &&
          u.pendingBranch &&
          !u.isUnmounted &&
          c.asyncDep &&
          !c.asyncResolved &&
          c.suspenseId === u.pendingId &&
          (u.deps--, u.deps === 0 && u.resolve());
    },
    Oe = (c, u, h, p = !1, g = !1, v = 0) => {
      for (let C = v; C < c.length; C++) Se(c[C], u, h, p, g);
    },
    Ht = (c) =>
      c.shapeFlag & 6
        ? Ht(c.component.subTree)
        : c.shapeFlag & 128
        ? c.suspense.next()
        : x(c.anchor || c.el);
  let En = !1;
  const xs = (c, u, h) => {
      c == null
        ? u._vnode && Se(u._vnode, null, null, !0)
        : R(u._vnode || null, c, u, null, null, null, h),
        En || ((En = !0), Rs(), Ur(), (En = !1)),
        (u._vnode = c);
    },
    Et = {
      p: R,
      um: Se,
      m: Ge,
      r: ys,
      mt: _e,
      mc: O,
      pc: W,
      pbc: q,
      n: Ht,
      o: e,
    };
  return { render: xs, hydrate: void 0, createApp: Xo(xs) };
}
function In({ type: e, props: t }, n) {
  return (n === "svg" && e === "foreignObject") ||
    (n === "mathml" &&
      e === "annotation-xml" &&
      t &&
      t.encoding &&
      t.encoding.includes("html"))
    ? void 0
    : n;
}
function Ye({ effect: e, update: t }, n) {
  e.allowRecurse = t.allowRecurse = n;
}
function ol(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function oi(e, t, n = !1) {
  const s = e.children,
    r = t.children;
  if (T(s) && T(r))
    for (let i = 0; i < s.length; i++) {
      const o = s[i];
      let l = r[i];
      l.shapeFlag & 1 &&
        !l.dynamicChildren &&
        ((l.patchFlag <= 0 || l.patchFlag === 32) &&
          ((l = r[i] = Be(r[i])), (l.el = o.el)),
        n || oi(o, l)),
        l.type === yn && (l.el = o.el);
    }
}
function ll(e) {
  const t = e.slice(),
    n = [0];
  let s, r, i, o, l;
  const a = e.length;
  for (s = 0; s < a; s++) {
    const f = e[s];
    if (f !== 0) {
      if (((r = n[n.length - 1]), e[r] < f)) {
        (t[s] = r), n.push(s);
        continue;
      }
      for (i = 0, o = n.length - 1; i < o; )
        (l = (i + o) >> 1), e[n[l]] < f ? (i = l + 1) : (o = l);
      f < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), (n[i] = s));
    }
  }
  for (i = n.length, o = n[i - 1]; i-- > 0; ) (n[i] = o), (o = t[o]);
  return n;
}
function li(e) {
  const t = e.subTree.component;
  if (t) return t.asyncDep && !t.asyncResolved ? t : li(t);
}
const cl = (e) => e.__isTeleport,
  he = Symbol.for("v-fgt"),
  yn = Symbol.for("v-txt"),
  yt = Symbol.for("v-cmt"),
  On = Symbol.for("v-stc"),
  It = [];
let $e = null;
function st(e = !1) {
  It.push(($e = e ? null : []));
}
function al() {
  It.pop(), ($e = It[It.length - 1] || null);
}
let Rt = 1;
function Ws(e) {
  Rt += e;
}
function ul(e) {
  return (
    (e.dynamicChildren = Rt > 0 ? $e || dt : null),
    al(),
    Rt > 0 && $e && $e.push(e),
    e
  );
}
function rt(e, t, n, s, r, i) {
  return ul(Z(e, t, n, s, r, i, !0));
}
function fl(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function ut(e, t) {
  return e.type === t.type && e.key === t.key;
}
const xn = "__vInternal",
  ci = ({ key: e }) => e ?? null,
  Qt = ({ ref: e, ref_key: t, ref_for: n }) => (
    typeof e == "number" && (e = "" + e),
    e != null
      ? te(e) || me(e) || F(e)
        ? { i: pe, r: e, k: t, f: !!n }
        : e
      : null
  );
function Z(
  e,
  t = null,
  n = null,
  s = 0,
  r = null,
  i = e === he ? 0 : 1,
  o = !1,
  l = !1
) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && ci(t),
    ref: t && Qt(t),
    scopeId: bn,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: pe,
  };
  return (
    l
      ? (ms(a, n), i & 128 && e.normalize(a))
      : n && (a.shapeFlag |= te(n) ? 8 : 16),
    Rt > 0 &&
      !o &&
      $e &&
      (a.patchFlag > 0 || i & 6) &&
      a.patchFlag !== 32 &&
      $e.push(a),
    a
  );
}
const Ee = dl;
function dl(e, t = null, n = null, s = 0, r = null, i = !1) {
  if (((!e || e === So) && (e = yt), fl(e))) {
    const l = it(e, t, !0);
    return (
      n && ms(l, n),
      Rt > 0 &&
        !i &&
        $e &&
        (l.shapeFlag & 6 ? ($e[$e.indexOf(e)] = l) : $e.push(l)),
      (l.patchFlag |= -2),
      l
    );
  }
  if (($l(e) && (e = e.__vccOpts), t)) {
    t = hl(t);
    let { class: l, style: a } = t;
    l && !te(l) && (t.class = bt(l)),
      z(a) && (Mr(a) && !T(a) && (a = ie({}, a)), (t.style = ns(a)));
  }
  const o = te(e) ? 1 : To(e) ? 128 : cl(e) ? 64 : z(e) ? 4 : F(e) ? 2 : 0;
  return Z(e, t, n, s, r, o, i, !0);
}
function hl(e) {
  return e ? (Mr(e) || xn in e ? ie({}, e) : e) : null;
}
function it(e, t, n = !1) {
  const { props: s, ref: r, patchFlag: i, children: o } = e,
    l = t ? gl(s || {}, t) : s;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: l,
    key: l && ci(l),
    ref:
      t && t.ref ? (n && r ? (T(r) ? r.concat(Qt(t)) : [r, Qt(t)]) : Qt(t)) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: o,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    patchFlag: t && e.type !== he ? (i === -1 ? 16 : i | 16) : i,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && it(e.ssContent),
    ssFallback: e.ssFallback && it(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
  };
}
function pl(e = " ", t = 0) {
  return Ee(yn, null, e, t);
}
function Ae(e) {
  return e == null || typeof e == "boolean"
    ? Ee(yt)
    : T(e)
    ? Ee(he, null, e.slice())
    : typeof e == "object"
    ? Be(e)
    : Ee(yn, null, String(e));
}
function Be(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : it(e);
}
function ms(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null) t = null;
  else if (T(t)) n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), ms(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !(xn in t)
        ? (t._ctx = pe)
        : r === 3 &&
          pe &&
          (pe.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
    }
  else
    F(t)
      ? ((t = { default: t, _ctx: pe }), (n = 32))
      : ((t = String(t)), s & 64 ? ((n = 16), (t = [pl(t)])) : (n = 8));
  (e.children = t), (e.shapeFlag |= n);
}
function gl(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = bt([t.class, s.class]));
      else if (r === "style") t.style = ns([t.style, s.style]);
      else if (fn(r)) {
        const i = t[r],
          o = s[r];
        o &&
          i !== o &&
          !(T(i) && i.includes(o)) &&
          (t[r] = i ? [].concat(i, o) : o);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function Le(e, t, n, s = null) {
  xe(e, t, 7, [n, s]);
}
const ml = ei();
let _l = 0;
function bl(e, t, n) {
  const s = e.type,
    r = (t ? t.appContext : e.appContext) || ml,
    i = {
      uid: _l++,
      vnode: e,
      type: s,
      parent: t,
      appContext: r,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      scope: new Vi(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(r.provides),
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: ni(s, r),
      emitsOptions: Dr(s, r),
      emit: null,
      emitted: null,
      propsDefaults: G,
      inheritAttrs: s.inheritAttrs,
      ctx: G,
      data: G,
      props: G,
      attrs: G,
      slots: G,
      refs: G,
      setupState: G,
      setupContext: null,
      attrsProxy: null,
      slotsProxy: null,
      suspense: n,
      suspenseId: n ? n.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null,
    };
  return (
    (i.ctx = { _: i }),
    (i.root = t ? t.root : i),
    (i.emit = vo.bind(null, i)),
    e.ce && e.ce(i),
    i
  );
}
let ce = null;
const vl = () => ce || pe;
let on, Yn;
{
  const e = mr(),
    t = (n, s) => {
      let r;
      return (
        (r = e[n]) || (r = e[n] = []),
        r.push(s),
        (i) => {
          r.length > 1 ? r.forEach((o) => o(i)) : r[0](i);
        }
      );
    };
  (on = t("__VUE_INSTANCE_SETTERS__", (n) => (ce = n))),
    (Yn = t("__VUE_SSR_SETTERS__", (n) => (Cn = n)));
}
const Ft = (e) => {
    const t = ce;
    return (
      on(e),
      e.scope.on(),
      () => {
        e.scope.off(), on(t);
      }
    );
  },
  zs = () => {
    ce && ce.scope.off(), on(null);
  };
function ai(e) {
  return e.vnode.shapeFlag & 4;
}
let Cn = !1;
function yl(e, t = !1) {
  t && Yn(t);
  const { props: n, children: s } = e.vnode,
    r = ai(e);
  Qo(e, n, r, t), nl(e, s);
  const i = r ? xl(e, t) : void 0;
  return t && Yn(!1), i;
}
function xl(e, t) {
  const n = e.type;
  (e.accessCache = Object.create(null)), (e.proxy = Rr(new Proxy(e.ctx, ko)));
  const { setup: s } = n;
  if (s) {
    const r = (e.setupContext = s.length > 1 ? wl(e) : null),
      i = Ft(e);
    ot();
    const o = ke(s, e, 0, [e.props, r]);
    if ((lt(), i(), dr(o))) {
      if ((o.then(zs, zs), t))
        return o
          .then((l) => {
            qs(e, l);
          })
          .catch((l) => {
            mn(l, e, 0);
          });
      e.asyncDep = o;
    } else qs(e, o);
  } else ui(e);
}
function qs(e, t, n) {
  F(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : z(t) && (e.setupState = jr(t)),
    ui(e);
}
function ui(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || ye);
  {
    const r = Ft(e);
    ot();
    try {
      Wo(e);
    } finally {
      lt(), r();
    }
  }
}
function Cl(e) {
  return (
    e.attrsProxy ||
    (e.attrsProxy = new Proxy(e.attrs, {
      get(t, n) {
        return ge(e, "get", "$attrs"), t[n];
      },
    }))
  );
}
function wl(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    get attrs() {
      return Cl(e);
    },
    slots: e.slots,
    emit: e.emit,
    expose: t,
  };
}
function wn(e) {
  if (e.exposed)
    return (
      e.exposeProxy ||
      (e.exposeProxy = new Proxy(jr(Rr(e.exposed)), {
        get(t, n) {
          if (n in t) return t[n];
          if (n in At) return At[n](e);
        },
        has(t, n) {
          return n in t || n in At;
        },
      }))
    );
}
function $l(e) {
  return F(e) && "__vccOpts" in e;
}
const El = (e, t) => lo(e, t, Cn),
  Sl = "3.4.15";
/**
 * @vue/runtime-dom v3.4.15
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ const Tl = "http://www.w3.org/2000/svg",
  Ll = "http://www.w3.org/1998/Math/MathML",
  De = typeof document < "u" ? document : null,
  Gs = De && De.createElement("template"),
  Al = {
    insert: (e, t, n) => {
      t.insertBefore(e, n || null);
    },
    remove: (e) => {
      const t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, n, s) => {
      const r =
        t === "svg"
          ? De.createElementNS(Tl, e)
          : t === "mathml"
          ? De.createElementNS(Ll, e)
          : De.createElement(e, n ? { is: n } : void 0);
      return (
        e === "select" &&
          s &&
          s.multiple != null &&
          r.setAttribute("multiple", s.multiple),
        r
      );
    },
    createText: (e) => De.createTextNode(e),
    createComment: (e) => De.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: (e) => e.parentNode,
    nextSibling: (e) => e.nextSibling,
    querySelector: (e) => De.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, "");
    },
    insertStaticContent(e, t, n, s, r, i) {
      const o = n ? n.previousSibling : t.lastChild;
      if (r && (r === i || r.nextSibling))
        for (
          ;
          t.insertBefore(r.cloneNode(!0), n),
            !(r === i || !(r = r.nextSibling));

        );
      else {
        Gs.innerHTML =
          s === "svg"
            ? `<svg>${e}</svg>`
            : s === "mathml"
            ? `<math>${e}</math>`
            : e;
        const l = Gs.content;
        if (s === "svg" || s === "mathml") {
          const a = l.firstChild;
          for (; a.firstChild; ) l.appendChild(a.firstChild);
          l.removeChild(a);
        }
        t.insertBefore(l, n);
      }
      return [
        o ? o.nextSibling : t.firstChild,
        n ? n.previousSibling : t.lastChild,
      ];
    },
  },
  Ve = "transition",
  Tt = "animation",
  xt = Symbol("_vtc"),
  fi = {
    name: String,
    type: String,
    css: { type: Boolean, default: !0 },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String,
  },
  Il = ie({}, Mo, fi),
  Xe = (e, t = []) => {
    T(e) ? e.forEach((n) => n(...t)) : e && e(...t);
  },
  Js = (e) => (e ? (T(e) ? e.some((t) => t.length > 1) : e.length > 1) : !1);
function Ol(e) {
  const t = {};
  for (const $ in e) $ in fi || (t[$] = e[$]);
  if (e.css === !1) return t;
  const {
      name: n = "v",
      type: s,
      duration: r,
      enterFromClass: i = `${n}-enter-from`,
      enterActiveClass: o = `${n}-enter-active`,
      enterToClass: l = `${n}-enter-to`,
      appearFromClass: a = i,
      appearActiveClass: f = o,
      appearToClass: d = l,
      leaveFromClass: _ = `${n}-leave-from`,
      leaveActiveClass: x = `${n}-leave-active`,
      leaveToClass: S = `${n}-leave-to`,
    } = e,
    B = Pl(r),
    R = B && B[0],
    L = B && B[1],
    {
      onBeforeEnter: N,
      onEnter: se,
      onEnterCancelled: D,
      onLeave: k,
      onLeaveCancelled: Q,
      onBeforeAppear: j = N,
      onAppear: ae = se,
      onAppearCancelled: O = D,
    } = t,
    ee = ($, J, _e) => {
      He($, J ? d : l), He($, J ? f : o), _e && _e();
    },
    q = ($, J) => {
      ($._isLeaving = !1), He($, _), He($, S), He($, x), J && J();
    },
    oe = ($) => (J, _e) => {
      const $t = $ ? ae : se,
        re = () => ee(J, $, _e);
      Xe($t, [J, re]),
        Ys(() => {
          He(J, $ ? a : i), Me(J, $ ? d : l), Js($t) || Xs(J, s, R, re);
        });
    };
  return ie(t, {
    onBeforeEnter($) {
      Xe(N, [$]), Me($, i), Me($, o);
    },
    onBeforeAppear($) {
      Xe(j, [$]), Me($, a), Me($, f);
    },
    onEnter: oe(!1),
    onAppear: oe(!0),
    onLeave($, J) {
      $._isLeaving = !0;
      const _e = () => q($, J);
      Me($, _),
        hi(),
        Me($, x),
        Ys(() => {
          $._isLeaving && (He($, _), Me($, S), Js(k) || Xs($, s, L, _e));
        }),
        Xe(k, [$, _e]);
    },
    onEnterCancelled($) {
      ee($, !1), Xe(D, [$]);
    },
    onAppearCancelled($) {
      ee($, !0), Xe(O, [$]);
    },
    onLeaveCancelled($) {
      q($), Xe(Q, [$]);
    },
  });
}
function Pl(e) {
  if (e == null) return null;
  if (z(e)) return [Pn(e.enter), Pn(e.leave)];
  {
    const t = Pn(e);
    return [t, t];
  }
}
function Pn(e) {
  return Ii(e);
}
function Me(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)),
    (e[xt] || (e[xt] = new Set())).add(t);
}
function He(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[xt];
  n && (n.delete(t), n.size || (e[xt] = void 0));
}
function Ys(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Ml = 0;
function Xs(e, t, n, s) {
  const r = (e._endId = ++Ml),
    i = () => {
      r === e._endId && s();
    };
  if (n) return setTimeout(i, n);
  const { type: o, timeout: l, propCount: a } = di(e, t);
  if (!o) return s();
  const f = o + "end";
  let d = 0;
  const _ = () => {
      e.removeEventListener(f, x), i();
    },
    x = (S) => {
      S.target === e && ++d >= a && _();
    };
  setTimeout(() => {
    d < a && _();
  }, l + 1),
    e.addEventListener(f, x);
}
function di(e, t) {
  const n = window.getComputedStyle(e),
    s = (B) => (n[B] || "").split(", "),
    r = s(`${Ve}Delay`),
    i = s(`${Ve}Duration`),
    o = Zs(r, i),
    l = s(`${Tt}Delay`),
    a = s(`${Tt}Duration`),
    f = Zs(l, a);
  let d = null,
    _ = 0,
    x = 0;
  t === Ve
    ? o > 0 && ((d = Ve), (_ = o), (x = i.length))
    : t === Tt
    ? f > 0 && ((d = Tt), (_ = f), (x = a.length))
    : ((_ = Math.max(o, f)),
      (d = _ > 0 ? (o > f ? Ve : Tt) : null),
      (x = d ? (d === Ve ? i.length : a.length) : 0));
  const S =
    d === Ve && /\b(transform|all)(,|$)/.test(s(`${Ve}Property`).toString());
  return { type: d, timeout: _, propCount: x, hasTransform: S };
}
function Zs(e, t) {
  for (; e.length < t.length; ) e = e.concat(e);
  return Math.max(...t.map((n, s) => Qs(n) + Qs(e[s])));
}
function Qs(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function hi() {
  return document.body.offsetHeight;
}
function Rl(e, t, n) {
  const s = e[xt];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")),
    t == null
      ? e.removeAttribute("class")
      : n
      ? e.setAttribute("class", t)
      : (e.className = t);
}
const Nl = Symbol("_vod"),
  Fl = Symbol("");
function jl(e, t, n) {
  const s = e.style,
    r = s.display,
    i = te(n);
  if (n && !i) {
    if (t && !te(t)) for (const o in t) n[o] == null && Xn(s, o, "");
    for (const o in n) Xn(s, o, n[o]);
  } else if (i) {
    if (t !== n) {
      const o = s[Fl];
      o && (n += ";" + o), (s.cssText = n);
    }
  } else t && e.removeAttribute("style");
  Nl in e && (s.display = r);
}
const er = /\s*!important$/;
function Xn(e, t, n) {
  if (T(n)) n.forEach((s) => Xn(e, t, s));
  else if ((n == null && (n = ""), t.startsWith("--"))) e.setProperty(t, n);
  else {
    const s = Vl(e, t);
    er.test(n)
      ? e.setProperty(wt(s), n.replace(er, ""), "important")
      : (e[s] = n);
  }
}
const tr = ["Webkit", "Moz", "ms"],
  Mn = {};
function Vl(e, t) {
  const n = Mn[t];
  if (n) return n;
  let s = _t(t);
  if (s !== "filter" && s in e) return (Mn[t] = s);
  s = gr(s);
  for (let r = 0; r < tr.length; r++) {
    const i = tr[r] + s;
    if (i in e) return (Mn[t] = i);
  }
  return t;
}
const nr = "http://www.w3.org/1999/xlink";
function Hl(e, t, n, s, r) {
  if (s && t.startsWith("xlink:"))
    n == null
      ? e.removeAttributeNS(nr, t.slice(6, t.length))
      : e.setAttributeNS(nr, t, n);
  else {
    const i = Fi(t);
    n == null || (i && !_r(n))
      ? e.removeAttribute(t)
      : e.setAttribute(t, i ? "" : n);
  }
}
function Ul(e, t, n, s, r, i, o) {
  if (t === "innerHTML" || t === "textContent") {
    s && o(s, r, i), (e[t] = n ?? "");
    return;
  }
  const l = e.tagName;
  if (t === "value" && l !== "PROGRESS" && !l.includes("-")) {
    e._value = n;
    const f = l === "OPTION" ? e.getAttribute("value") : e.value,
      d = n ?? "";
    f !== d && (e.value = d), n == null && e.removeAttribute(t);
    return;
  }
  let a = !1;
  if (n === "" || n == null) {
    const f = typeof e[t];
    f === "boolean"
      ? (n = _r(n))
      : n == null && f === "string"
      ? ((n = ""), (a = !0))
      : f === "number" && ((n = 0), (a = !0));
  }
  try {
    e[t] = n;
  } catch {}
  a && e.removeAttribute(t);
}
function Qe(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Bl(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const sr = Symbol("_vei");
function Dl(e, t, n, s, r = null) {
  const i = e[sr] || (e[sr] = {}),
    o = i[t];
  if (s && o) o.value = s;
  else {
    const [l, a] = Kl(t);
    if (s) {
      const f = (i[t] = zl(s, r));
      Qe(e, l, f, a);
    } else o && (Bl(e, l, o, a), (i[t] = void 0));
  }
}
const rr = /(?:Once|Passive|Capture)$/;
function Kl(e) {
  let t;
  if (rr.test(e)) {
    t = {};
    let s;
    for (; (s = e.match(rr)); )
      (e = e.slice(0, e.length - s[0].length)), (t[s[0].toLowerCase()] = !0);
  }
  return [e[2] === ":" ? e.slice(3) : wt(e.slice(2)), t];
}
let Rn = 0;
const kl = Promise.resolve(),
  Wl = () => Rn || (kl.then(() => (Rn = 0)), (Rn = Date.now()));
function zl(e, t) {
  const n = (s) => {
    if (!s._vts) s._vts = Date.now();
    else if (s._vts <= n.attached) return;
    xe(ql(s, n.value), t, 5, [s]);
  };
  return (n.value = e), (n.attached = Wl()), n;
}
function ql(e, t) {
  if (T(t)) {
    const n = e.stopImmediatePropagation;
    return (
      (e.stopImmediatePropagation = () => {
        n.call(e), (e._stopped = !0);
      }),
      t.map((s) => (r) => !r._stopped && s && s(r))
    );
  } else return t;
}
const ir = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  Gl = (e, t, n, s, r, i, o, l, a) => {
    const f = r === "svg";
    t === "class"
      ? Rl(e, s, f)
      : t === "style"
      ? jl(e, n, s)
      : fn(t)
      ? Qn(t) || Dl(e, t, n, s, o)
      : (
          t[0] === "."
            ? ((t = t.slice(1)), !0)
            : t[0] === "^"
            ? ((t = t.slice(1)), !1)
            : Jl(e, t, s, f)
        )
      ? Ul(e, t, s, i, o, l, a)
      : (t === "true-value"
          ? (e._trueValue = s)
          : t === "false-value" && (e._falseValue = s),
        Hl(e, t, s, f));
  };
function Jl(e, t, n, s) {
  if (s)
    return !!(
      t === "innerHTML" ||
      t === "textContent" ||
      (t in e && ir(t) && F(n))
    );
  if (
    t === "spellcheck" ||
    t === "draggable" ||
    t === "translate" ||
    t === "form" ||
    (t === "list" && e.tagName === "INPUT") ||
    (t === "type" && e.tagName === "TEXTAREA")
  )
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return ir(t) && te(n) ? !1 : t in e;
}
const pi = new WeakMap(),
  gi = new WeakMap(),
  ln = Symbol("_moveCb"),
  or = Symbol("_enterCb"),
  mi = {
    name: "TransitionGroup",
    props: ie({}, Il, { tag: String, moveClass: String }),
    setup(e, { slots: t }) {
      const n = vl(),
        s = Po();
      let r, i;
      return (
        Jr(() => {
          if (!r.length) return;
          const o = e.moveClass || `${e.name || "v"}-move`;
          if (!tc(r[0].el, n.vnode.el, o)) return;
          r.forEach(Zl), r.forEach(Ql);
          const l = r.filter(ec);
          hi(),
            l.forEach((a) => {
              const f = a.el,
                d = f.style;
              Me(f, o),
                (d.transform = d.webkitTransform = d.transitionDuration = "");
              const _ = (f[ln] = (x) => {
                (x && x.target !== f) ||
                  ((!x || /transform$/.test(x.propertyName)) &&
                    (f.removeEventListener("transitionend", _),
                    (f[ln] = null),
                    He(f, o)));
              });
              f.addEventListener("transitionend", _);
            });
        }),
        () => {
          const o = U(e),
            l = Ol(o);
          let a = o.tag || he;
          (r = i), (i = t.default ? zr(t.default()) : []);
          for (let f = 0; f < i.length; f++) {
            const d = i[f];
            d.key != null && kn(d, Kn(d, l, s, n));
          }
          if (r)
            for (let f = 0; f < r.length; f++) {
              const d = r[f];
              kn(d, Kn(d, l, s, n)), pi.set(d, d.el.getBoundingClientRect());
            }
          return Ee(a, null, i);
        }
      );
    },
  },
  Yl = (e) => delete e.mode;
mi.props;
const Xl = mi;
function Zl(e) {
  const t = e.el;
  t[ln] && t[ln](), t[or] && t[or]();
}
function Ql(e) {
  gi.set(e, e.el.getBoundingClientRect());
}
function ec(e) {
  const t = pi.get(e),
    n = gi.get(e),
    s = t.left - n.left,
    r = t.top - n.top;
  if (s || r) {
    const i = e.el.style;
    return (
      (i.transform = i.webkitTransform = `translate(${s}px,${r}px)`),
      (i.transitionDuration = "0s"),
      e
    );
  }
}
function tc(e, t, n) {
  const s = e.cloneNode(),
    r = e[xt];
  r &&
    r.forEach((l) => {
      l.split(/\s+/).forEach((a) => a && s.classList.remove(a));
    }),
    n.split(/\s+/).forEach((l) => l && s.classList.add(l)),
    (s.style.display = "none");
  const i = t.nodeType === 1 ? t : t.parentNode;
  i.appendChild(s);
  const { hasTransform: o } = di(s);
  return i.removeChild(s), o;
}
const cn = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return T(t) ? (n) => Jt(t, n) : t;
};
function nc(e) {
  e.target.composing = !0;
}
function lr(e) {
  const t = e.target;
  t.composing && ((t.composing = !1), t.dispatchEvent(new Event("input")));
}
const mt = Symbol("_assign"),
  Nn = {
    created(e, { modifiers: { lazy: t, trim: n, number: s } }, r) {
      e[mt] = cn(r);
      const i = s || (r.props && r.props.type === "number");
      Qe(e, t ? "change" : "input", (o) => {
        if (o.target.composing) return;
        let l = e.value;
        n && (l = l.trim()), i && (l = Fn(l)), e[mt](l);
      }),
        n &&
          Qe(e, "change", () => {
            e.value = e.value.trim();
          }),
        t ||
          (Qe(e, "compositionstart", nc),
          Qe(e, "compositionend", lr),
          Qe(e, "change", lr));
    },
    mounted(e, { value: t }) {
      e.value = t ?? "";
    },
    beforeUpdate(
      e,
      { value: t, modifiers: { lazy: n, trim: s, number: r } },
      i
    ) {
      if (((e[mt] = cn(i)), e.composing)) return;
      const o = r || e.type === "number" ? Fn(e.value) : e.value,
        l = t ?? "";
      o !== l &&
        ((document.activeElement === e &&
          e.type !== "range" &&
          (n || (s && e.value.trim() === l))) ||
          (e.value = l));
    },
  },
  sc = {
    deep: !0,
    created(e, t, n) {
      (e[mt] = cn(n)),
        Qe(e, "change", () => {
          const s = e._modelValue,
            r = rc(e),
            i = e.checked,
            o = e[mt];
          if (T(s)) {
            const l = br(s, r),
              a = l !== -1;
            if (i && !a) o(s.concat(r));
            else if (!i && a) {
              const f = [...s];
              f.splice(l, 1), o(f);
            }
          } else if (dn(s)) {
            const l = new Set(s);
            i ? l.add(r) : l.delete(r), o(l);
          } else o(_i(e, i));
        });
    },
    mounted: cr,
    beforeUpdate(e, t, n) {
      (e[mt] = cn(n)), cr(e, t, n);
    },
  };
function cr(e, { value: t, oldValue: n }, s) {
  (e._modelValue = t),
    T(t)
      ? (e.checked = br(t, s.props.value) > -1)
      : dn(t)
      ? (e.checked = t.has(s.props.value))
      : t !== n && (e.checked = pn(t, _i(e, !0)));
}
function rc(e) {
  return "_value" in e ? e._value : e.value;
}
function _i(e, t) {
  const n = t ? "_trueValue" : "_falseValue";
  return n in e ? e[n] : t;
}
const ic = ie({ patchProp: Gl }, Al);
let ar;
function oc() {
  return ar || (ar = rl(ic));
}
const lc = (...e) => {
  const t = oc().createApp(...e),
    { mount: n } = t;
  return (
    (t.mount = (s) => {
      const r = ac(s);
      if (!r) return;
      const i = t._component;
      !F(i) && !i.render && !i.template && (i.template = r.innerHTML),
        (r.innerHTML = "");
      const o = n(r, !1, cc(r));
      return (
        r instanceof Element &&
          (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")),
        o
      );
    }),
    t
  );
};
function cc(e) {
  if (e instanceof SVGElement) return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function ac(e) {
  return te(e) ? document.querySelector(e) : e;
}
const M = (e) => e[Math.floor(Math.random() * e.length)],
  P = (e) => !!e && Math.random() <= e,
  bi = (e) => !!["a", "e", "i", "o", "u"].find((t) => t === e),
  uc = (e, t) =>
    e
      .split("")
      .map(
        (n) => (
          P(t || 0.2) &&
            bi(n) &&
            (P(0.2)
              ? ((n = n.replace("a", "aaaaa")),
                (n = n.replace("e", "eeeee")),
                (n = n.replace("i", "iiiii")),
                (n = n.replace("o", "ooooo")),
                (n = n.replace("u", "uuuuu")))
              : ((n = n.replace("a", "aaa")),
                (n = n.replace("e", "eee")),
                (n = n.replace("i", "iii")),
                (n = n.replace("o", "ooo")),
                (n = n.replace("u", "uuu")))),
          n
        )
      )
      .join(""),
  ft = (e) => e[0].toUpperCase() + e.slice(1),
  _s = (e, t) => {
    const n = e.__vccOpts || e;
    for (const [s, r] of t) n[s] = r;
    return n;
  },
  fc = {
    __name: "Oc",
    props: ["oc", "iscurrent", "index", "fancy"],
    setup(e) {
      const t = e,
        n = (o, l) => {
          if (o.length === 0 || l === 0) return "";
          const a = o.length % l;
          return a === 2
            ? "weird-character-1"
            : a === 3
            ? "weird-character-2"
            : a === 5
            ? "weird-character-3"
            : "";
        },
        s = (o, l) =>
          o.length === 0 || l === 0 ? "" : o.length % l === 7 ? "bigger" : "",
        r = (o, l) => (t.fancy ? `${n(o, l)} ${s(o, l)}` : ""),
        i = (o, l) =>
          `oc ${o ? "current" : ""} ${l < 4 ? "old" : ""} ${
            l < 2 ? "veryold" : ""
          } ${t.fancy ? "fancy" : ""}`;
      return (o, l) => (
        st(),
        rt(
          "div",
          { class: bt(i(t.iscurrent, t.index)) },
          [
            (st(!0),
            rt(
              he,
              null,
              Xr(
                t.oc.split(""),
                (a, f) => (
                  st(),
                  rt("span", { key: a + f, class: bt(r(t.oc, f)) }, jn(a), 3)
                )
              ),
              128
            )),
          ],
          2
        )
      );
    },
  },
  dc = _s(fc, [["__scopeId", "data-v-8e5dd2b6"]]),
  hc = [
    "Johnny",
    "Pau",
    "Jerry",
    "Jimbo",
    "Lola",
    "Mary",
    "Groucho",
    "Michel",
    "Pippi",
    "Bob",
    "Bobby",
    "Jeanette",
    "Popola",
    "Fruko",
    "Pep",
    "Lilo",
    "Pere",
    "Jofre",
  ],
  pc = [
    "Ramírez",
    "Messi",
    "Watson",
    "Casals",
    "Fiji",
    "Deng",
    "Claxton",
    "Maldini",
    "Gleason",
    "Takahashi",
    "Wilson",
    "Temitope",
    "Stilton",
    "Barilla",
    "Ventura",
    "Cugat",
    "Durka",
    "Llanos",
  ];
class vi {
  constructor() {}
  static lastLetterIs(t, n) {
    return t[t.length - 1] === n;
  }
  static lastLettersAre(t, n) {
    return t[t.length - 1] === n[1] && t[t.length - 2] === n[0];
  }
  static removeLastLetters(t, n) {
    return t.substring(0, t.length - n);
  }
  static pluralize(t) {
    if (t.number !== "p") return t.root;
    if (this.lastLettersAre(t.root, "ca") && t.gender === "f")
      return `${this.removeLastLetters(t.root, 2)}ques`;
    if (this.lastLettersAre(t.root, "ga") && t.gender === "f")
      return `${this.removeLastLetters(t.root, 2)}gues`;
    if (this.lastLetterIs(t.root, "c") && t.gender === "f")
      return `${this.removeLastLetters(t.root, 1)}ques`;
    if (this.lastLetterIs(t.root, "s")) {
      const n = t.root.replace("òs", "os");
      return t.gender === "f" ? `${n}es` : `${n}os`;
    }
    return this.lastLetterIs(t.root, "a")
      ? `${this.removeLastLetters(t.root, 1)}es`
      : this.lastLetterIs(t.root, "x")
      ? `${this.removeLastLetters(t.root, 1)}es`
      : this.lastLetterIs(t.root, "à")
      ? `${this.removeLastLetters(t.root, 1)}ans`
      : `${t.root}s`;
  }
}
class an {
  constructor(t, n, s) {
    (this._root = t), (this._gender = n), (this._number = s);
  }
  print() {
    return vi.pluralize(this);
  }
  get gender() {
    return this._gender;
  }
  get number() {
    return this._number;
  }
  get root() {
    return this._root;
  }
  setNumber(t) {
    this._number = t;
  }
  static get(t, n) {
    let s = M(ne);
    for (s.setNumber(n || "s"); t && s.gender !== t; ) s = M(ne);
    return s;
  }
}
const ne = [
  "gas|m",
  "jofre|m",
  "funkopop|m",
  "manglar|m",
  "comboi|m",
  "obelisc|m",
  "gabufa|f",
  "gabufa ranupi|m",
  "ñocla|f",
  "flow|m",
  "piti|m",
  "vaper|m",
  "swing|m",
  "superilla|f",
  "budellin|m",
  "mami|f",
  "skibidi|m",
  "humà|m",
  "clec clec boing|m",
  "golem|m",
  "kefta|f",
  "mambo|m",
  "plic ploc|m",
  "boing|m",
  "herba|f",
  "blon|m",
  "monster|m",
  "catarsi|f",
  "jumanji|m",
  "hominid|m",
  "fibló|m",
  "mosca|f",
  "babu gorman|m",
  "babu nyepi|m",
  "maragda|f",
  "manicura|f",
  "prisma|m",
  "tetrahedre|m",
  "piràmide|f",
  "mandolina|f",
  "gòndola|f",
  "semen|m",
  "casa|f",
  "closca|f",
  "mandarina|f",
  "crisàlida|f",
  "esfera|f",
  "cúpula|f",
  "membrana|f",
  "batuta|f",
  "fruita|f",
  "amistat|f",
  "ànima|f",
  "catifa|f",
  "meritxell|f",
  "grasa|f",
  "joguina|f",
  "tulipa|f",
  "carrousel|m",
  "gofre|m",
  "mantega|f",
  "galibo|m",
  "Micralax|m",
  "dreamtime|m",
  "Benadryl|m",
  "bitter kas|m",
  "marbre|m",
  "talaiot|m",
  "motoret|m",
  "melindro|m",
  "melindret|m",
  "popola|f",
  "dongle|m",
  "gamba|f",
  "sémola|f",
  "civada|f",
  "molsa|f",
  "dogma|m",
  "catedral|f",
].map((e) => new an(e.split("|")[0], e.split("|")[1], "s"));
class Ct {
  constructor(t) {
    this.word = t;
  }
  get firstLetterIsVocal() {
    return !!["a", "e", "i", "o", "u", "h", "A", "E", "I", "O", "U", "H"].find(
      (t) => t === this.word.root[0]
    );
  }
  get article() {
    return this.firstLetterIsVocal &&
      this.word.gender === "m" &&
      this.word.number === "s"
      ? "l'"
      : this.word.gender === "m" && this.word.number === "s"
      ? "el "
      : this.word.gender === "m" && this.word.number === "p"
      ? "els "
      : this.word.gender === "f" && this.word.number === "s"
      ? "la "
      : this.word.gender === "f" && this.word.number === "p"
      ? "les "
      : "-";
  }
  print() {
    return this.article;
  }
}
class un {
  constructor(t) {
    this._root = t;
  }
  get root() {
    return this._root;
  }
  static getRandom() {
    const t = M(hc),
      n = M(pc);
    let s = "";
    if (P(0.3)) {
      let r = M(ne);
      r.setNumber("s");
      const i = new Ct(r);
      s = `${t} ${n} "${ft(i.print())} ${ft(r.print())}"`;
    } else if (P(0.3)) {
      let r = M(ne);
      r.setNumber("s");
      const i = new Ct(r);
      s = `${t} "${ft(i.print())} ${ft(r.print())}" ${n}`;
    } else s = `${t} ${n}`;
    return new un(s);
  }
}
class gc {
  constructor(t, n, s) {
    (this._fullRoot = t), (this._gender = n), (this._number = s);
  }
  print() {
    return vi.pluralize(this);
  }
  setGender(t) {
    this._gender = t;
  }
  setNumber(t) {
    this._number = t;
  }
  get root() {
    const [t, n] = this._fullRoot.split("|");
    return `${this._gender === "f" ? n : t}`;
  }
  get gender() {
    return this._gender;
  }
  get number() {
    return this._number;
  }
}
const yi = [
    "indomable|indomable",
    "indòmit|indòmita",
    "eteri|etérea",
    "gaseòs|gaseosa",
    "enigmàtic|enigmatica",
    "liminal|liminal",
    "geològic|geologica",
    "afable|afable",
    "letàrgic|letargica",
    "llànguid|llanguida",
    "macarrònic|macarrònica",
    "lloable|lloable",
    "meravellòs|meravellosa",
    "etern|eterna",
    "antic|antiga",
    "petit|petita",
    "esbelt|esbelta",
    "letal|letal",
    "elegant|elegante",
    "nyigui nyogui|nyigui nyogui",
    "feréstec|feréstega",
    "estimat|estimada",
    "bomba|bomba",
    "simfònic|simfònica",
    "sincrètic|sincrètica",
    "sinàptic|sinàptica",
    "semàntic|semàntica",
    "cromàtic|cromàtica",
    "logarìtmic|logarìtmica",
    "botànic|botànica",
    "farcit|farcida",
  ].map((e) => new gc(e)),
  Ne = [
    "🪐|m",
    "🍕|f",
    "🎁|m",
    "🚗|m",
    "👄|f",
    "🕷|f",
    "🍋|f",
    "🐖|m",
    "🎀|m",
    "🚁|m",
    "🍔|f",
    "👟|f",
    "🐟|m",
    "👼|m",
    "🍬|m",
    "👁|m",
    "🌝|f",
  ].map((e) => new an(e.split("|")[0], e.split("|")[1], "s"));
class bs {
  constructor(t) {
    (this.emojis = t), this.generate();
  }
  generate() {
    const t = M(["s", "p"]);
    let n = M(ne);
    this.emojis && P(this.emojis / 100) && (n = M(Ne)), n.setNumber(t);
    const s = M(yi);
    s.setGender(n.gender), s.setNumber(t);
    const r = new Ct(s);
    if (((this.value = `${r.print()}${s.print()} ${n.print()}`), P(0.2))) {
      let i;
      for (
        i = M(ne), this.emojis && P(this.emojis / 100) && (i = M(Ne));
        n.root === i.root;

      )
        (i = M(ne)), this.emojis && P(this.emojis / 100) && (i = M(Ne));
      this.value += ` de ${i.print()}`;
    }
  }
  print() {
    return this.value;
  }
}
class mc {
  constructor() {
    this.generate();
  }
  generate() {
    let t = "La cançó";
    P(0.2) && (t = "La balada"),
      P(0.1) && (t = "El rap"),
      P(0.1) && (t = "La bachata"),
      P(0.1) && (t = "La habanera"),
      P(0.1) && (t = "La sardana"),
      P(0.1) && (t = "L'himne");
    let n = `${t} de ${new bs().print()}`;
    (n = n.replace("de els", "dels")),
      (n = n.replace("de el", "del")),
      (n = n.replace("de l'", "del ")),
      (this.value = `${n}`);
  }
  print() {
    return this.value;
  }
}
let _c = class {
  constructor(t) {
    (this.emojis = t), this.generate();
  }
  generate() {
    let t = M(ne);
    t.setNumber("s");
    let n = M(["mou", "mou", "regala'm", "questiona't", "goza"]),
      s;
    (s = M(ne)), this.emojis && P(this.emojis / 100) && (s = M(Ne));
    const r = new Ct(s);
    this.value = `${t.print()}, ${n} ${r.print()} ${s.print()}`;
  }
  print() {
    return this.value;
  }
};
class bc {
  constructor(t) {
    (this.emojis = t), this.generate();
  }
  generate() {
    let t = M(ne);
    this.emojis && P(this.emojis / 100) && (t = M(Ne)),
      t.setNumber(M(["p", "s"]));
    const n = new Ct(t),
      r = M([
        "fotent amb",
        "actiu amb",
        "activant",
        "respecta",
        "investiga",
        "balla amb",
      ]);
    this.value = `${r} ${n.print()} ${t.print()}`;
  }
  print() {
    return this.value;
  }
}
const vc = [
  "al Pumarejo",
  "a la cova",
  "a Zona Franca",
  "a Montjuïc",
  "a la casa dels Cundits",
  "a Besalú",
  "al festival Cruïlla",
  "al festival Primavera Sound",
  "al festival Sònar",
  "al convoi eteri",
  "a Macba",
  "al CCCB",
  "a plaça castilla",
];
class $n {
  constructor(t) {
    this._root = t;
  }
  get root() {
    return this._root;
  }
  static getRandom() {
    return new $n(M(vc));
  }
}
class xi {
  constructor(t) {
    (this.emojis = t), this.generate();
  }
  getVerb() {
    let t = "fumo";
    return (
      P(0.1) && (t = "xuclo"),
      P(0.1) && (t = "esnifo"),
      P(0.1) && (t = "volco"),
      P(0.1) && (t = `amb tu ${t}`),
      P(0.1) && (t = `per això ${t}`),
      P(0.1) && (t = `per tu ${t}`),
      t
    );
  }
  generate() {
    const t = M(["s", "p"]);
    let n = M(ne);
    this.emojis && P(this.emojis / 100) && (n = M(Ne)), n.setNumber(t);
    let s = M(ne);
    for (
      this.emojis && P(this.emojis / 100) && (s = M(Ne));
      n.root === s.root;

    )
      (s = M(ne)), this.emojis && P(this.emojis / 100) && (s = M(Ne));
    s.setNumber("s");
    let r = this.getVerb();
    (this.value = `${r} ${n.print()} de ${s.print()}`),
      P(0.1) && (this.value += ` ${$n.getRandom().root}`);
  }
  print() {
    return this.value;
  }
}
class vs {
  constructor() {
    this.generate();
  }
  generate() {
    const t = M(ne);
    let n = M(ne);
    for (; t.root === n.root; ) n = M(ne);
    const r = P(0.4) ? "..." : "";
    if (
      ((this.value = `${t.root}${r}`),
      P(0.1)
        ? (this.value = `${this.value} ${t.root}?`)
        : P(0.3)
        ? (this.value = `${this.value} ${n.root}?`)
        : P(0.3) && (this.value = `${this.value} ${n.root}!`),
      P(0.1))
    )
      this.value = `${t.root} i ${n.root}${r}`;
    else if (P(0.1)) this.value = `${t.root} amb ${n.root}${r}`;
    else if (P(0.2)) {
      const o = bi(n.root[0]) ? "d'" : "de ";
      this.value = `${t.root} ${o}${n.root}${r}`;
    }
    if (P(0.1)) {
      const i = new vs();
      this.value = `${this.value} (${i.print()})`;
    }
    if (this.value.indexOf(" ") < 0) {
      const i = M(["...", "?", "!"]);
      this.value = `${t.root}${i}`;
    }
  }
  print() {
    return this.value;
  }
}
class yc {
  constructor(t) {
    (this.emojis = t), this.generate();
  }
  getDr() {
    let t = "",
      n;
    return (
      P(0.2) && (t = M(["Venerable", "Respectable", "Intrèpid"])),
      P(0.1)
        ? (n = "Inspector")
        : P(0.1)
        ? (n = "Professor")
        : P(0.1)
        ? (n = "Venerable")
        : (n = "Dr."),
      `${t} ${n}`
    );
  }
  generate() {
    const t = new bs(this.emojis);
    let n = M(ne);
    this.emojis && P(this.emojis / 100) && (n = M(Ne)), n.setNumber("s");
    const s = M(yi);
    s.setGender(n.gender),
      s.setNumber("s"),
      (this.value = `${t.print()} del ${this.getDr()} ${ft(n.print())} ${ft(
        s.print()
      )}`);
  }
  print() {
    return this.value;
  }
}
class xc {
  constructor() {
    this.generate();
  }
  generate() {
    let t = M(ne);
    t.setNumber("s");
    const n = t.gender === "m" ? "del" : "de la";
    let s = M(ne);
    s.setNumber("s"),
      (this.value = `vivim a la era ${n} ${t.print()} de ${s.print()}`),
      P(0.3) &&
        (this.value = `vivim a la era ${n} ${t.print()} i ${new Ct(
          s
        ).print()} ${s.print()}`);
  }
  print() {
    return this.value;
  }
}
class Cc {
  constructor() {
    this.generate();
  }
  generate() {
    (this.value = `miro cap ${$n.getRandom().root}`),
      P(0.5) && (this.value = `${this.value} i ${new xi().print()}`);
  }
  print() {
    return this.value;
  }
}
class wc {
  constructor() {
    this.generate();
  }
  generate() {
    let t = an.get("f"),
      n = an.get();
    this.value = `me haré una ${t.print()} con tu ${n.print()}`;
  }
  print() {
    return this.value;
  }
}
class ur {
  static get(t, n) {
    const s = M([
      "enigm",
      "enigmdr",
      "fumo",
      "mamimou",
      "nofollo",
      "vivimalaera",
      "paraula",
      "paraula",
      "miro",
      "cami",
    ]);
    let r = "";
    switch (s) {
      case "enigm":
        r = new bs(t).print();
        break;
      case "enigmdr":
        r = new yc(t).print();
        break;
      case "fumo":
        r = new xi(t).print();
        break;
      case "mamimou":
        r = new _c(t).print();
        break;
      case "nofollo":
        r = new bc(t).print();
        break;
      case "paraula":
        r = new vs().print();
        break;
      case "vivimalaera":
        r = new xc().print();
        break;
      case "miro":
        r = new Cc().print();
        break;
      case "cami":
        r = new wc().print();
        break;
    }
    return (
      (r = uc(r, n)),
      (r = r.replace("l' ", "l'")),
      (r = r.replace("L' ", "L'")),
      r
    );
  }
}
const fr = 6;
let $c = class Ci {
  constructor() {
    this.init();
  }
  init() {
    (this._artist1 = un.getRandom()),
      (this._artist2 = un.getRandom()),
      (this._title = new mc().print()),
      (this._lines = []);
    for (let t = 0; t < fr; t++) this._lines.push(Ci.emptyLine());
    this._counter = 0;
  }
  static emptyLine() {
    return { value: " ", id: Math.random() };
  }
  get artist1() {
    return this._artist1;
  }
  get artist2() {
    return this._artist2;
  }
  get title() {
    return this._title;
  }
  getTitle() {
    return this._title;
  }
  getLines() {
    return this._lines;
  }
  lineUntil(t) {
    return this._counter <= t;
  }
  getSection() {
    return this.lineUntil(2)
      ? `[Intro: ${this.artist1.root} & ${this.artist2.root}]`
      : this.lineUntil(8)
      ? `[Verse 1: ${this.artist2.root}]`
      : this.lineUntil(12)
      ? `[Chorus : ${this.artist2.root}]`
      : this.lineUntil(18)
      ? `[Verse 2: ${this.artist2.root}]`
      : this.lineUntil(22)
      ? `[Chorus : ${this.artist2.root}]`
      : this.lineUntil(24)
      ? `[Bridge: ${this.artist1.root} & ${this.artist2.root}]`
      : this.lineUntil(30)
      ? `[Verse 3: ${this.artist2.root}]`
      : this.lineUntil(34)
      ? `[Outro: ${this.artist2.root}]`
      : "";
  }
  newLine(t, n) {
    if (this._counter > 34) {
      this.init();
      return;
    }
    this._lines.length > fr && this._lines.shift();
    let s = ur.get(t, n);
    if (this._lineLength)
      for (; s.length !== this._lineLength; ) s = ur.get(t, n);
    this._lines.push({ value: s, id: Math.random() }), (this._counter += 1);
  }
};
const jt = (e) => (yo("data-v-65947315"), (e = e()), xo(), e),
  Ec = { id: "song-header" },
  Sc = { id: "song-section" },
  Tc = { id: "main-body" },
  Lc = jt(() => Z("div", { id: "notes", class: "wiggle" }, "♫", -1)),
  Ac = { id: "swing" },
  Ic = { class: "slidecontainer" },
  Oc = jt(() => Z("div", { class: "element-title" }, "speed...", -1)),
  Pc = { class: "slidecontainer" },
  Mc = jt(() => Z("div", { class: "element-title" }, "emojis...", -1)),
  Rc = { class: "slidecontainer" },
  Nc = jt(() => Z("div", { class: "element-title" }, "vocals...", -1)),
  Fc = { class: "slidecontainer" },
  jc = jt(() => Z("div", { class: "element-title" }, "fancy...", -1)),
  Vc = { class: "resetcontainer" },
  Hc = {
    __name: "Song",
    setup(e) {
      const t = Pe(null),
        n = Pe(0),
        s = Pe(1e-7),
        r = Pe(null),
        i = Pe(!1),
        o = Pe(50),
        l = Pe(0),
        a = Pe(1e-7),
        f = Pe(!1),
        d = (R) => {
          var L;
          n.value = parseInt((L = R.currentTarget) == null ? void 0 : L.value);
        },
        _ = (R) => {
          var L;
          s.value =
            parseInt((L = R.currentTarget) == null ? void 0 : L.value) / 100;
        };
      hs(() => {
        r.value = setInterval(() => {
          t.value.newLine(n.value, s.value);
        }, 5e3);
      }),
        ps(() => {
          clearInterval(r.value);
        });
      const x = (R) => {
          var L;
          clearInterval(r.value),
            (r.value = setInterval(() => {
              t.value.newLine(n.value, s.value);
            }, parseInt((L = R.currentTarget) == null ? void 0 : L.value) * 100));
        },
        S = (R) => {
          var N;
          const L = (N = R.currentTarget) == null ? void 0 : N.checked;
          i.value = L;
        },
        B = () => (i.value ? "fancy-lines-container" : "");
      return (
        (t.value = new $c()),
        (R, L) => (
          st(),
          rt(
            he,
            null,
            [
              Z("div", Ec, jn(t.value.getTitle()), 1),
              Z("div", Sc, jn(t.value.getSection()), 1),
              Z("div", Tc, [
                Z(
                  "div",
                  { id: "lines-container", class: bt(B()) },
                  [
                    Lc,
                    Ee(
                      Xl,
                      { id: "lines", name: "list", tag: "ul" },
                      {
                        default: Kr(() => [
                          (st(!0),
                          rt(
                            he,
                            null,
                            Xr(
                              t.value.getLines(),
                              (N, se) => (
                                st(),
                                rt("li", { key: N.id }, [
                                  Ee(
                                    dc,
                                    {
                                      oc: N.value,
                                      index: se,
                                      iscurrent: se === 6,
                                      fancy: i.value,
                                    },
                                    null,
                                    8,
                                    ["oc", "index", "iscurrent", "fancy"]
                                  ),
                                ])
                              )
                            ),
                            128
                          )),
                        ]),
                        _: 1,
                      }
                    ),
                  ],
                  2
                ),
                Z("div", Ac, [
                  Z("div", Ic, [
                    Oc,
                    zt(
                      Z(
                        "input",
                        {
                          type: "range",
                          min: "1",
                          max: "70",
                          value: "0",
                          class: "slider rtl",
                          id: "speed",
                          "onUpdate:modelValue":
                            L[0] || (L[0] = (N) => (o.value = N)),
                          onChange: x,
                        },
                        null,
                        544
                      ),
                      [[Nn, o.value]]
                    ),
                  ]),
                  Z("div", Pc, [
                    Mc,
                    zt(
                      Z(
                        "input",
                        {
                          type: "range",
                          min: "0",
                          max: "100",
                          value: "50",
                          class: "slider",
                          id: "emojis",
                          "onUpdate:modelValue":
                            L[1] || (L[1] = (N) => (l.value = N)),
                          onChange: d,
                        },
                        null,
                        544
                      ),
                      [[Nn, l.value]]
                    ),
                  ]),
                  Z("div", Rc, [
                    Nc,
                    zt(
                      Z(
                        "input",
                        {
                          type: "range",
                          min: "1",
                          max: "100",
                          value: "50",
                          class: "slider",
                          id: "vocals",
                          "onUpdate:modelValue":
                            L[2] || (L[2] = (N) => (a.value = N)),
                          onChange: _,
                        },
                        null,
                        544
                      ),
                      [[Nn, a.value]]
                    ),
                  ]),
                  Z("div", Fc, [
                    jc,
                    zt(
                      Z(
                        "input",
                        {
                          type: "checkbox",
                          class: "checkbox",
                          id: "fancy",
                          "onUpdate:modelValue":
                            L[3] || (L[3] = (N) => (f.value = N)),
                          onChange: S,
                        },
                        null,
                        544
                      ),
                      [[sc, f.value]]
                    ),
                  ]),
                  Z("div", Vc, [
                    Z(
                      "button",
                      {
                        onClick:
                          L[4] ||
                          (L[4] = (...N) => t.value.init && t.value.init(...N)),
                        id: "reset-button",
                      },
                      " Reset... "
                    ),
                  ]),
                ]),
              ]),
            ],
            64
          )
        )
      );
    },
  },
  Uc = _s(Hc, [["__scopeId", "data-v-65947315"]]),
  Bc = { class: "wrapper" },
  Dc = {
    __name: "App",
    setup(e) {
      return (t, n) => (st(), rt("body", null, [Z("div", Bc, [Ee(Uc)])]));
    },
  },
  Kc = _s(Dc, [["__scopeId", "data-v-dc262369"]]);
lc(Kc).mount("#app");
