#!/usr/bin/env node

// output-es/runtime.js
function* range(lo, hi) {
  for (let i = lo; i < hi; i++) {
    yield i;
  }
}
function fail() {
  throw new Error("Failed pattern match");
}
function intDiv(x, y) {
  if (y > 0)
    return Math.floor(x / y);
  if (y < 0)
    return -Math.floor(x / -y);
  return 0;
}

// output-es/Data.Function/index.js
var $$const = (a) => (v) => a;
var applyFlipped = (x) => (f) => f(x);

// output-es/Control.Semigroupoid/index.js
var semigroupoidFn = { compose: (f) => (g) => (x) => f(g(x)) };

// output-es/Type.Proxy/index.js
var $$$Proxy = () => ({});
var $$Proxy = /* @__PURE__ */ $$$Proxy();

// output-es/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output-es/Data.Functor/index.js
var functorArray = { map: arrayMap };

// output-es/Control.Apply/index.js
var identity = (x) => x;

// output-es/Control.Bind/foreign.js
var arrayBind = function(arr) {
  return function(f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

// output-es/Control.Bind/index.js
var identity2 = (x) => x;

// output-es/Record.Unsafe/foreign.js
var unsafeGet = function(label) {
  return function(rec) {
    return rec[label];
  };
};
var unsafeSet = function(label) {
  return function(value) {
    return function(rec) {
      var copy = {};
      for (var key in rec) {
        if ({}.hasOwnProperty.call(rec, key)) {
          copy[key] = rec[key];
        }
      }
      copy[label] = value;
      return copy;
    };
  };
};
var unsafeDelete = function(label) {
  return function(rec) {
    var copy = {};
    for (var key in rec) {
      if (key !== label && {}.hasOwnProperty.call(rec, key)) {
        copy[key] = rec[key];
      }
    }
    return copy;
  };
};

// output-es/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};
var showNumberImpl = function(n) {
  var str = n.toString();
  return isNaN(str + ".0") ? str : str + ".0";
};
var showCharImpl = function(c) {
  var code = c.charCodeAt(0);
  if (code < 32 || code === 127) {
    switch (c) {
      case "\x07":
        return "'\\a'";
      case "\b":
        return "'\\b'";
      case "\f":
        return "'\\f'";
      case "\n":
        return "'\\n'";
      case "\r":
        return "'\\r'";
      case "	":
        return "'\\t'";
      case "\v":
        return "'\\v'";
    }
    return "'\\" + code.toString(10) + "'";
  }
  return c === "'" || c === "\\" ? "'\\" + c + "'" : "'" + c + "'";
};
var showStringImpl = function(s) {
  var l = s.length;
  return '"' + s.replace(
    /[\0-\x1F\x7F"\\]/g,
    // eslint-disable-line no-control-regex
    function(c, i) {
      switch (c) {
        case '"':
        case "\\":
          return "\\" + c;
        case "\x07":
          return "\\a";
        case "\b":
          return "\\b";
        case "\f":
          return "\\f";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case "	":
          return "\\t";
        case "\v":
          return "\\v";
      }
      var k = i + 1;
      var empty2 = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
      return "\\" + c.charCodeAt(0).toString(10) + empty2;
    }
  ) + '"';
};
var showArrayImpl = function(f) {
  return function(xs) {
    var ss = [];
    for (var i = 0, l = xs.length; i < l; i++) {
      ss[i] = f(xs[i]);
    }
    return "[" + ss.join(",") + "]";
  };
};

// output-es/Data.Show/index.js
var showInt = { show: showIntImpl };

// output-es/Data.Ordering/index.js
var $Ordering = (tag) => tag;
var LT = /* @__PURE__ */ $Ordering(
  0
  /* LT */
);
var GT = /* @__PURE__ */ $Ordering(
  1
  /* GT */
);
var EQ = /* @__PURE__ */ $Ordering(
  2
  /* EQ */
);

// output-es/Data.Maybe/index.js
var $Maybe = (tag, _1) => ({ tag, _1 });
var Nothing = /* @__PURE__ */ $Maybe(
  0
  /* Nothing */
);
var Just = (value0) => $Maybe(1, value0);
var monoidMaybe = (dictSemigroup) => {
  const semigroupMaybe1 = {
    append: (v) => (v1) => {
      if (v.tag === 0) {
        return v1;
      }
      if (v1.tag === 0) {
        return v;
      }
      if (v.tag === 1 && v1.tag === 1) {
        return $Maybe(1, dictSemigroup.append(v._1)(v1._1));
      }
      fail();
    }
  };
  return { mempty: Nothing, Semigroup0: () => semigroupMaybe1 };
};
var isNothing = (v2) => {
  if (v2.tag === 0) {
    return true;
  }
  if (v2.tag === 1) {
    return false;
  }
  fail();
};
var isJust = (v2) => {
  if (v2.tag === 0) {
    return false;
  }
  if (v2.tag === 1) {
    return true;
  }
  fail();
};
var functorMaybe = {
  map: (v) => (v1) => {
    if (v1.tag === 1) {
      return $Maybe(1, v(v1._1));
    }
    return Nothing;
  }
};
var applyMaybe = {
  apply: (v) => (v1) => {
    if (v.tag === 1) {
      if (v1.tag === 1) {
        return $Maybe(1, v._1(v1._1));
      }
      return Nothing;
    }
    if (v.tag === 0) {
      return Nothing;
    }
    fail();
  },
  Functor0: () => functorMaybe
};

// output-es/Data.Either/index.js
var $Either = (tag, _1) => ({ tag, _1 });
var Left = (value0) => $Either(0, value0);
var Right = (value0) => $Either(1, value0);
var functorEither = {
  map: (f) => (m) => {
    if (m.tag === 0) {
      return $Either(0, m._1);
    }
    if (m.tag === 1) {
      return $Either(1, f(m._1));
    }
    fail();
  }
};
var applyEither = {
  apply: (v) => (v1) => {
    if (v.tag === 0) {
      return $Either(0, v._1);
    }
    if (v.tag === 1) {
      if (v1.tag === 0) {
        return $Either(0, v1._1);
      }
      if (v1.tag === 1) {
        return $Either(1, v._1(v1._1));
      }
    }
    fail();
  },
  Functor0: () => functorEither
};
var bindEither = {
  bind: (v2) => {
    if (v2.tag === 0) {
      const $0 = v2._1;
      return (v) => $Either(0, $0);
    }
    if (v2.tag === 1) {
      const $0 = v2._1;
      return (f) => f($0);
    }
    fail();
  },
  Apply0: () => applyEither
};
var applicativeEither = { pure: Right, Apply0: () => applyEither };

// output-es/Data.Identity/index.js
var Identity = (x) => x;
var functorIdentity = { map: (f) => (m) => f(m) };
var applyIdentity = { apply: (v) => (v1) => v(v1), Functor0: () => functorIdentity };
var bindIdentity = { bind: (v) => (f) => f(v), Apply0: () => applyIdentity };
var applicativeIdentity = { pure: Identity, Apply0: () => applyIdentity };
var monadIdentity = { Applicative0: () => applicativeIdentity, Bind1: () => bindIdentity };

// output-es/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
var bindE = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};
var untilE = function(f) {
  return function() {
    while (!f())
      ;
  };
};

// output-es/Effect/index.js
var monadEffect = { Applicative0: () => applicativeEffect, Bind1: () => bindEffect };
var bindEffect = { bind: bindE, Apply0: () => applyEffect };
var applyEffect = {
  apply: (f) => (a) => () => {
    const f$p = f();
    const a$p = a();
    return applicativeEffect.pure(f$p(a$p))();
  },
  Functor0: () => functorEffect
};
var applicativeEffect = { pure: pureE, Apply0: () => applyEffect };
var functorEffect = {
  map: (f) => (a) => () => {
    const a$p = a();
    return f(a$p);
  }
};

// output-es/Control.Monad.Rec.Class/index.js
var $Step = (tag, _1) => ({ tag, _1 });
var Loop = (value0) => $Step(0, value0);
var monadRecIdentity = {
  tailRecM: (f) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === 0) {
          go$a0 = f(v._1);
          continue;
        }
        if (v.tag === 1) {
          go$c = false;
          go$r = v._1;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return (x) => go(f(x));
  },
  Monad0: () => monadIdentity
};
var monadRecEffect = {
  tailRecM: (f) => (a) => {
    const $0 = f(a);
    return () => {
      const $1 = $0();
      let r = $1;
      untilE(() => {
        const v = r;
        if (v.tag === 0) {
          const e = f(v._1)();
          r = e;
          return false;
        }
        if (v.tag === 1) {
          return true;
        }
        fail();
      })();
      const a$p = r;
      if (a$p.tag === 1) {
        return a$p._1;
      }
      fail();
    };
  },
  Monad0: () => monadEffect
};

// output-es/Control.Monad.ST.Internal/foreign.js
var map_ = function(f) {
  return function(a) {
    return function() {
      return f(a());
    };
  };
};
var pure_ = function(a) {
  return function() {
    return a;
  };
};
var bind_ = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};

// output-es/Control.Monad.ST.Internal/index.js
var functorST = { map: map_ };
var monadST = { Applicative0: () => applicativeST, Bind1: () => bindST };
var bindST = { bind: bind_, Apply0: () => applyST };
var applyST = {
  apply: (f) => (a) => () => {
    const f$p = f();
    const a$p = a();
    return applicativeST.pure(f$p(a$p))();
  },
  Functor0: () => functorST
};
var applicativeST = { pure: pure_, Apply0: () => applyST };

// output-es/Control.Monad.ST.Uncurried/foreign.js
var runSTFn2 = function runSTFn22(fn) {
  return function(a) {
    return function(b) {
      return function() {
        return fn(a, b);
      };
    };
  };
};

// output-es/Data.Array.ST/foreign.js
var pushAllImpl = function(as, xs) {
  return xs.push.apply(xs, as);
};
var sortByImpl = function() {
  function mergeFromTo(compare3, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to);
    i = from;
    j = mid;
    k = from;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare3(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare3, fromOrdering, xs) {
    if (xs.length < 2)
      return xs;
    mergeFromTo(compare3, fromOrdering, xs, xs.slice(0), 0, xs.length);
    return xs;
  };
}();

// output-es/Data.Array.ST/index.js
var push = (a) => runSTFn2(pushAllImpl)([a]);

// output-es/Data.Array.ST.Iterator/index.js
var $Iterator = (_1, _2) => ({ _1, _2 });
var pushWhile = (p) => (iter) => (array) => () => {
  let $$break = false;
  const $0 = iter._2;
  while ((() => {
    const $1 = $$break;
    return !$1;
  })()) {
    const i = $0.value;
    const mx = iter._1(i);
    if (mx.tag === 1 && p(mx._1)) {
      array.push(mx._1);
      iter._2.value;
      const $1 = iter._2.value;
      iter._2.value = $1 + 1 | 0;
      continue;
    }
    $$break = true;
  }
};
var iterate = (iter) => (f) => () => {
  let $$break = false;
  const $0 = iter._2;
  while ((() => {
    const $1 = $$break;
    return !$1;
  })()) {
    const i = $0.value;
    const $1 = $0.value;
    $0.value = $1 + 1 | 0;
    const mx = iter._1(i);
    if (mx.tag === 1) {
      f(mx._1)();
      continue;
    }
    if (mx.tag === 0) {
      $$break = true;
      continue;
    }
    fail();
  }
};

// output-es/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init2) {
    return function(xs) {
      var acc = init2;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init2) {
    return function(xs) {
      var acc = init2;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output-es/Data.Foldable/index.js
var identity3 = (x) => x;
var traverse_ = (dictApplicative) => {
  const $0 = dictApplicative.Apply0();
  return (dictFoldable) => (f) => dictFoldable.foldr((x) => {
    const $1 = f(x);
    return (b) => $0.apply($0.Functor0().map((v) => identity)($1))(b);
  })(dictApplicative.pure());
};
var for_ = (dictApplicative) => {
  const traverse_1 = traverse_(dictApplicative);
  return (dictFoldable) => {
    const $0 = traverse_1(dictFoldable);
    return (b) => (a) => $0(a)(b);
  };
};
var maximumBy = (dictFoldable) => (cmp) => dictFoldable.foldl((v) => (v1) => {
  if (v.tag === 0) {
    return $Maybe(1, v1);
  }
  if (v.tag === 1) {
    return $Maybe(1, cmp(v._1)(v1) === 1 ? v._1 : v1);
  }
  fail();
})(Nothing);
var foldableMaybe = {
  foldr: (v) => (v1) => (v2) => {
    if (v2.tag === 0) {
      return v1;
    }
    if (v2.tag === 1) {
      return v(v2._1)(v1);
    }
    fail();
  },
  foldl: (v) => (v1) => (v2) => {
    if (v2.tag === 0) {
      return v1;
    }
    if (v2.tag === 1) {
      return v(v1)(v2._1);
    }
    fail();
  },
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (v) => (v1) => {
      if (v1.tag === 0) {
        return mempty;
      }
      if (v1.tag === 1) {
        return v(v1._1);
      }
      fail();
    };
  }
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => foldableArray.foldr((x) => (acc) => dictMonoid.Semigroup0().append(f(x))(acc))(mempty);
  }
};

// output-es/Data.Tuple/index.js
var $Tuple = (_1, _2) => ({ _1, _2 });
var Tuple = (value0) => (value1) => $Tuple(value0, value1);
var snd = (v) => v._2;
var fst = (v) => v._1;

// output-es/Data.FunctorWithIndex/foreign.js
var mapWithIndexArray = function(f) {
  return function(xs) {
    var l = xs.length;
    var result = Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(i)(xs[i]);
    }
    return result;
  };
};

// output-es/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqIntImpl = refEq;
var eqCharImpl = refEq;
var eqStringImpl = refEq;
var eqArrayImpl = function(f) {
  return function(xs) {
    return function(ys) {
      if (xs.length !== ys.length)
        return false;
      for (var i = 0; i < xs.length; i++) {
        if (!f(xs[i])(ys[i]))
          return false;
      }
      return true;
    };
  };
};

// output-es/Data.Eq/index.js
var eqString = { eq: eqStringImpl };
var eqInt = { eq: eqIntImpl };
var eqChar = { eq: eqCharImpl };

// output-es/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq2) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq2 : gt;
        };
      };
    };
  };
};
var ordIntImpl = unsafeCompareImpl;
var ordStringImpl = unsafeCompareImpl;
var ordArrayImpl = function(f) {
  return function(xs) {
    return function(ys) {
      var i = 0;
      var xlen = xs.length;
      var ylen = ys.length;
      while (i < xlen && i < ylen) {
        var x = xs[i];
        var y = ys[i];
        var o = f(x)(y);
        if (o !== 0) {
          return o;
        }
        i++;
      }
      if (xlen === ylen) {
        return 0;
      } else if (xlen > ylen) {
        return -1;
      } else {
        return 1;
      }
    };
  };
};

// output-es/Data.Ord/index.js
var ordString = { compare: /* @__PURE__ */ ordStringImpl(LT)(EQ)(GT), Eq0: () => eqString };
var ordInt = { compare: /* @__PURE__ */ ordIntImpl(LT)(EQ)(GT), Eq0: () => eqInt };
var ordArray = (dictOrd) => {
  const eqArray = { eq: eqArrayImpl(dictOrd.Eq0().eq) };
  return {
    compare: (xs) => (ys) => ordInt.compare(0)(ordArrayImpl((x) => (y) => {
      const v = dictOrd.compare(x)(y);
      if (v === 2) {
        return 0;
      }
      if (v === 0) {
        return 1;
      }
      if (v === 1) {
        return -1;
      }
      fail();
    })(xs)(ys)),
    Eq0: () => eqArray
  };
};

// output-es/Data.Traversable/foreign.js
var traverseArrayImpl = function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat22(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply) {
    return function(map) {
      return function(pure) {
        return function(f) {
          return function(array) {
            function go(bot, top) {
              switch (top - bot) {
                case 0:
                  return pure([]);
                case 1:
                  return map(array1)(f(array[bot]));
                case 2:
                  return apply(map(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply(apply(map(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top - bot) / 4) * 2;
                  return apply(map(concat22)(go(bot, pivot)))(go(pivot, top));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output-es/Data.Traversable/index.js
var identity4 = (x) => x;
var traversableMaybe = {
  traverse: (dictApplicative) => (v) => (v1) => {
    if (v1.tag === 0) {
      return dictApplicative.pure(Nothing);
    }
    if (v1.tag === 1) {
      return dictApplicative.Apply0().Functor0().map(Just)(v(v1._1));
    }
    fail();
  },
  sequence: (dictApplicative) => (v) => {
    if (v.tag === 0) {
      return dictApplicative.pure(Nothing);
    }
    if (v.tag === 1) {
      return dictApplicative.Apply0().Functor0().map(Just)(v._1);
    }
    fail();
  },
  Functor0: () => functorMaybe,
  Foldable1: () => foldableMaybe
};
var traversableArray = {
  traverse: (dictApplicative) => {
    const Apply0 = dictApplicative.Apply0();
    return traverseArrayImpl(Apply0.apply)(Apply0.Functor0().map)(dictApplicative.pure);
  },
  sequence: (dictApplicative) => traversableArray.traverse(dictApplicative)(identity4),
  Functor0: () => functorArray,
  Foldable1: () => foldableArray
};

// output-es/Data.Array/foreign.js
var rangeImpl = function(start, end) {
  var step = start > end ? -1 : 1;
  var result = new Array(step * (end - start) + 1);
  var i = start, n = 0;
  while (i !== end) {
    result[n++] = i;
    i += step;
  }
  result[n] = i;
  return result;
};
var replicateFill = function(count, value) {
  if (count < 1) {
    return [];
  }
  var result = new Array(count);
  return result.fill(value);
};
var replicatePolyfill = function(count, value) {
  var result = [];
  var n = 0;
  for (var i = 0; i < count; i++) {
    result[n++] = value;
  }
  return result;
};
var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons2(head, tail) {
    this.head = head;
    this.tail = tail;
  }
  var emptyList = {};
  function curryCons(head) {
    return function(tail) {
      return new Cons2(head, tail);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr, xs) {
    return listToArray(foldr(curryCons)(emptyList)(xs));
  };
}();
var unconsImpl = function(empty2, next, xs) {
  return xs.length === 0 ? empty2({}) : next(xs[0])(xs.slice(1));
};
var findMapImpl = function(nothing, isJust2, f, xs) {
  for (var i = 0; i < xs.length; i++) {
    var result = f(xs[i]);
    if (isJust2(result))
      return result;
  }
  return nothing;
};
var findIndexImpl = function(just, nothing, f, xs) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (f(xs[i]))
      return just(i);
  }
  return nothing;
};
var reverse = function(l) {
  return l.slice().reverse();
};
var filterImpl = function(f, xs) {
  return xs.filter(f);
};
var sortByImpl2 = function() {
  function mergeFromTo(compare3, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to);
    i = from;
    j = mid;
    k = from;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare3(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare3, fromOrdering, xs) {
    var out;
    if (xs.length < 2)
      return xs;
    out = xs.slice(0);
    mergeFromTo(compare3, fromOrdering, out, xs.slice(0), 0, xs.length);
    return out;
  };
}();
var sliceImpl = function(s, e, l) {
  return l.slice(s, e);
};
var zipWithImpl = function(f, xs, ys) {
  var l = xs.length < ys.length ? xs.length : ys.length;
  var result = new Array(l);
  for (var i = 0; i < l; i++) {
    result[i] = f(xs[i])(ys[i]);
  }
  return result;
};
var anyImpl = function(p, xs) {
  var len = xs.length;
  for (var i = 0; i < len; i++) {
    if (p(xs[i]))
      return true;
  }
  return false;
};
var allImpl = function(p, xs) {
  var len = xs.length;
  for (var i = 0; i < len; i++) {
    if (!p(xs[i]))
      return false;
  }
  return true;
};

// output-es/Data.Array/index.js
var intercalate1 = (dictMonoid) => {
  const $0 = dictMonoid.Semigroup0();
  const mempty = dictMonoid.mempty;
  return (sep2) => (xs) => foldlArray((v) => (v1) => {
    if (v.init) {
      return { init: false, acc: v1 };
    }
    return { init: false, acc: $0.append(v.acc)($0.append(sep2)(v1)) };
  })({ init: true, acc: mempty })(xs).acc;
};
var sortBy = (comp) => ($0) => sortByImpl2(
  comp,
  (v) => {
    if (v === 1) {
      return 1;
    }
    if (v === 2) {
      return 0;
    }
    if (v === 0) {
      return -1;
    }
    fail();
  },
  $0
);
var sortWith = (dictOrd) => (f) => sortBy((x) => (y) => dictOrd.compare(f(x))(f(y)));
var snoc = (xs) => (x) => (() => {
  const $0 = push(x);
  return () => {
    const result = [...xs];
    $0(result)();
    return result;
  };
})()();
var intersperse = (a) => (arr) => {
  const v = arr.length;
  if (v < 2) {
    return arr;
  }
  const out = [];
  out.push(arr[0]);
  for (const idx of range(1, v)) {
    out.push(a);
    out.push(arr[idx]);
  }
  return out;
};
var last = (xs) => {
  const $0 = xs.length - 1 | 0;
  if ($0 >= 0 && $0 < xs.length) {
    return $Maybe(1, xs[$0]);
  }
  return Nothing;
};
var unsnoc = (xs) => applyMaybe.apply(xs.length === 0 ? Nothing : $Maybe(
  1,
  (() => {
    const $0 = sliceImpl(0, xs.length - 1 | 0, xs);
    return (v1) => ({ init: $0, last: v1 });
  })()
))(last(xs));
var nubBy = (comp) => (xs) => {
  const indexedAndSorted = sortBy((x) => (y) => comp(x._2)(y._2))(mapWithIndexArray(Tuple)(xs));
  if (0 < indexedAndSorted.length) {
    return arrayMap(snd)(sortWith(ordInt)(fst)((() => {
      const result = [indexedAndSorted[0]];
      for (const v1 of indexedAndSorted) {
        const $0 = comp((() => {
          const $02 = last(result);
          if ($02.tag === 1) {
            return $02._1._2;
          }
          fail();
        })())(v1._2);
        if ($0 === 0 || $0 === 1 || $0 !== 2) {
          result.push(v1);
        }
      }
      return result;
    })()));
  }
  return [];
};
var nub = (dictOrd) => nubBy(dictOrd.compare);
var groupBy = (op) => (xs) => {
  const result = [];
  const $0 = { value: 0 };
  const iter = $Iterator(
    (v) => {
      if (v >= 0 && v < xs.length) {
        return $Maybe(1, xs[v]);
      }
      return Nothing;
    },
    $0
  );
  iterate(iter)((x) => () => {
    const sub1 = [];
    sub1.push(x);
    pushWhile(op(x))(iter)(sub1)();
    result.push(sub1);
  })();
  return result;
};
var find = (f) => (xs) => {
  const $0 = findIndexImpl(Just, Nothing, f, xs);
  if ($0.tag === 1) {
    return $Maybe(1, xs[$0._1]);
  }
  return Nothing;
};
var elem = (dictEq) => (a) => (arr) => {
  const $0 = findIndexImpl(Just, Nothing, (v) => dictEq.eq(v)(a), arr);
  if ($0.tag === 0) {
    return false;
  }
  if ($0.tag === 1) {
    return true;
  }
  fail();
};
var concatMap = (b) => (a) => arrayBind(a)(b);
var mapMaybe = (f) => concatMap((x) => {
  const $0 = f(x);
  if ($0.tag === 0) {
    return [];
  }
  if ($0.tag === 1) {
    return [$0._1];
  }
  fail();
});
var catMaybes = /* @__PURE__ */ mapMaybe((x) => x);

// output-es/Data.Semigroup/foreign.js
var concatString = function(s1) {
  return function(s2) {
    return s1 + s2;
  };
};
var concatArray = function(xs) {
  return function(ys) {
    if (xs.length === 0)
      return ys;
    if (ys.length === 0)
      return xs;
    return xs.concat(ys);
  };
};

// output-es/Data.Semigroup/index.js
var semigroupUnit = { append: (v) => (v1) => {
} };
var semigroupString = { append: concatString };
var semigroupArray = { append: concatArray };

// output-es/Data.Semigroup.Foldable/index.js
var identity5 = (x) => x;

// output-es/Data.Unfoldable1/foreign.js
var unfoldr1ArrayImpl = function(isNothing2) {
  return function(fromJust3) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var tuple = f(value);
              result.push(fst2(tuple));
              var maybe = snd2(tuple);
              if (isNothing2(maybe))
                return result;
              value = fromJust3(maybe);
            }
          };
        };
      };
    };
  };
};

// output-es/Data.Unfoldable1/index.js
var fromJust = (v) => {
  if (v.tag === 1) {
    return v._1;
  }
  fail();
};
var unfoldable1Array = { unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust)(fst)(snd) };

// output-es/Data.Array.NonEmpty.Internal/foreign.js
var foldr1Impl = function(f, xs) {
  var acc = xs[xs.length - 1];
  for (var i = xs.length - 2; i >= 0; i--) {
    acc = f(xs[i])(acc);
  }
  return acc;
};
var foldl1Impl = function(f, xs) {
  var acc = xs[0];
  var len = xs.length;
  for (var i = 1; i < len; i++) {
    acc = f(acc)(xs[i]);
  }
  return acc;
};
var traverse1Impl = function() {
  function Cont(fn) {
    this.fn = fn;
  }
  var emptyList = {};
  var ConsCell = function(head, tail) {
    this.head = head;
    this.tail = tail;
  };
  function finalCell(head) {
    return new ConsCell(head, emptyList);
  }
  function consList(x) {
    return function(xs) {
      return new ConsCell(x, xs);
    };
  }
  function listToArray(list) {
    var arr = [];
    var xs = list;
    while (xs !== emptyList) {
      arr.push(xs.head);
      xs = xs.tail;
    }
    return arr;
  }
  return function(apply, map, f) {
    var buildFrom = function(x, ys) {
      return apply(map(consList)(f(x)))(ys);
    };
    var go = function(acc, currentLen, xs) {
      if (currentLen === 0) {
        return acc;
      } else {
        var last2 = xs[currentLen - 1];
        return new Cont(function() {
          var built = go(buildFrom(last2, acc), currentLen - 1, xs);
          return built;
        });
      }
    };
    return function(array) {
      var acc = map(finalCell)(f(array[array.length - 1]));
      var result = go(acc, array.length - 1, array);
      while (result instanceof Cont) {
        result = result.fn();
      }
      return map(listToArray)(result);
    };
  };
}();

// output-es/Data.Array.NonEmpty.Internal/index.js
var foldable1NonEmptyArray = {
  foldMap1: (dictSemigroup) => {
    const append = dictSemigroup.append;
    return (f) => {
      const $0 = arrayMap(f);
      const $1 = foldable1NonEmptyArray.foldl1(append);
      return (x) => $1($0(x));
    };
  },
  foldr1: ($0) => ($1) => foldr1Impl($0, $1),
  foldl1: ($0) => ($1) => foldl1Impl($0, $1),
  Foldable0: () => foldableArray
};

// output-es/Data.Number/foreign.js
var infinity = Infinity;
var isFiniteImpl = isFinite;
var floor = Math.floor;

// output-es/Data.Int/foreign.js
var fromNumberImpl = function(just) {
  return function(nothing) {
    return function(n) {
      return (n | 0) === n ? just(n) : nothing;
    };
  };
};
var toNumber = function(n) {
  return n;
};
var fromStringAsImpl = function(just) {
  return function(nothing) {
    return function(radix) {
      var digits;
      if (radix < 11) {
        digits = "[0-" + (radix - 1).toString() + "]";
      } else if (radix === 11) {
        digits = "[0-9a]";
      } else {
        digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
      }
      var pattern = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
      return function(s) {
        if (pattern.test(s)) {
          var i = parseInt(s, radix);
          return (i | 0) === i ? just(i) : nothing;
        } else {
          return nothing;
        }
      };
    };
  };
};

// output-es/Data.Int/index.js
var fromStringAs = /* @__PURE__ */ fromStringAsImpl(Just)(Nothing);
var fromString = /* @__PURE__ */ fromStringAs(10);
var fromNumber = /* @__PURE__ */ fromNumberImpl(Just)(Nothing);
var unsafeClamp = (x) => {
  if (!isFiniteImpl(x)) {
    return 0;
  }
  if (x >= toNumber(2147483647)) {
    return 2147483647;
  }
  if (x <= toNumber(-2147483648)) {
    return -2147483648;
  }
  const $0 = fromNumber(x);
  if ($0.tag === 0) {
    return 0;
  }
  if ($0.tag === 1) {
    return $0._1;
  }
  fail();
};

// output-es/Data.NonEmpty/index.js
var $NonEmpty = (_1, _2) => ({ _1, _2 });

// output-es/Data.List.Types/index.js
var $List = (tag, _1, _2) => ({ tag, _1, _2 });
var Nil = /* @__PURE__ */ $List(
  0
  /* Nil */
);
var Cons = (value0) => (value1) => $List(1, value0, value1);
var listMap = (f) => {
  const chunkedRevMap = (chunkedRevMap$a0$copy) => (chunkedRevMap$a1$copy) => {
    let chunkedRevMap$a0 = chunkedRevMap$a0$copy, chunkedRevMap$a1 = chunkedRevMap$a1$copy, chunkedRevMap$c = true, chunkedRevMap$r;
    while (chunkedRevMap$c) {
      const v = chunkedRevMap$a0, v1 = chunkedRevMap$a1;
      if (v1.tag === 1 && v1._2.tag === 1 && v1._2._2.tag === 1) {
        chunkedRevMap$a0 = $List(1, v1, v);
        chunkedRevMap$a1 = v1._2._2._2;
        continue;
      }
      const reverseUnrolledMap = (reverseUnrolledMap$a0$copy) => (reverseUnrolledMap$a1$copy) => {
        let reverseUnrolledMap$a0 = reverseUnrolledMap$a0$copy, reverseUnrolledMap$a1 = reverseUnrolledMap$a1$copy, reverseUnrolledMap$c = true, reverseUnrolledMap$r;
        while (reverseUnrolledMap$c) {
          const v2 = reverseUnrolledMap$a0, v3 = reverseUnrolledMap$a1;
          if (v2.tag === 1 && v2._1.tag === 1 && v2._1._2.tag === 1 && v2._1._2._2.tag === 1) {
            reverseUnrolledMap$a0 = v2._2;
            reverseUnrolledMap$a1 = $List(1, f(v2._1._1), $List(1, f(v2._1._2._1), $List(1, f(v2._1._2._2._1), v3)));
            continue;
          }
          reverseUnrolledMap$c = false;
          reverseUnrolledMap$r = v3;
        }
        return reverseUnrolledMap$r;
      };
      chunkedRevMap$c = false;
      chunkedRevMap$r = reverseUnrolledMap(v)((() => {
        if (v1.tag === 1) {
          if (v1._2.tag === 1) {
            if (v1._2._2.tag === 0) {
              return $List(1, f(v1._1), $List(1, f(v1._2._1), Nil));
            }
            return Nil;
          }
          if (v1._2.tag === 0) {
            return $List(1, f(v1._1), Nil);
          }
        }
        return Nil;
      })());
    }
    return chunkedRevMap$r;
  };
  return chunkedRevMap(Nil);
};
var foldableList = {
  foldr: (f) => (b) => {
    const $0 = foldableList.foldl((b$1) => (a) => f(a)(b$1))(b);
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0, v1 = go$a1;
        if (v1.tag === 0) {
          go$c = false;
          go$r = v;
          continue;
        }
        if (v1.tag === 1) {
          go$a0 = $List(1, v1._1, v);
          go$a1 = v1._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    const $1 = go(Nil);
    return (x) => $0($1(x));
  },
  foldl: (f) => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const b = go$a0, v = go$a1;
        if (v.tag === 0) {
          go$c = false;
          go$r = b;
          continue;
        }
        if (v.tag === 1) {
          go$a0 = f(b)(v._1);
          go$a1 = v._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go;
  },
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => foldableList.foldl((acc) => {
      const $0 = dictMonoid.Semigroup0().append(acc);
      return (x) => $0(f(x));
    })(mempty);
  }
};

// output-es/Data.List/index.js
var toUnfoldable = (dictUnfoldable) => dictUnfoldable.unfoldr((xs) => {
  if (xs.tag === 0) {
    return Nothing;
  }
  if (xs.tag === 1) {
    return $Maybe(1, $Tuple(xs._1, xs._2));
  }
  fail();
});
var reverse2 = /* @__PURE__ */ (() => {
  const go = (go$a0$copy) => (go$a1$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0, v1 = go$a1;
      if (v1.tag === 0) {
        go$c = false;
        go$r = v;
        continue;
      }
      if (v1.tag === 1) {
        go$a0 = $List(1, v1._1, v);
        go$a1 = v1._2;
        continue;
      }
      fail();
    }
    return go$r;
  };
  return go(Nil);
})();
var manyRec = (dictMonadRec) => (dictAlternative) => {
  const Alt0 = dictAlternative.Plus1().Alt0();
  const $0 = dictAlternative.Applicative0();
  return (p) => dictMonadRec.tailRecM((acc) => dictMonadRec.Monad0().Bind1().bind(Alt0.alt(Alt0.Functor0().map(Loop)(p))($0.pure($Step(
    1,
    void 0
  ))))((aa) => $0.pure((() => {
    if (aa.tag === 0) {
      return $Step(0, $List(1, aa._1, acc));
    }
    if (aa.tag === 1) {
      return $Step(1, reverse2(acc));
    }
    fail();
  })())))(Nil);
};
var some = (dictAlternative) => (dictLazy) => (v) => dictAlternative.Applicative0().Apply0().apply(dictAlternative.Plus1().Alt0().Functor0().map(Cons)(v))(dictLazy.defer((v1) => many(dictAlternative)(dictLazy)(v)));
var many = (dictAlternative) => (dictLazy) => (v) => dictAlternative.Plus1().Alt0().alt(some(dictAlternative)(dictLazy)(v))(dictAlternative.Applicative0().pure(Nil));

// output-es/Data.EuclideanRing/foreign.js
var intMod = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    var yy = Math.abs(y);
    return (x % yy + yy) % yy;
  };
};

// output-es/Data.Monoid/index.js
var monoidUnit = { mempty: void 0, Semigroup0: () => semigroupUnit };
var monoidString = { mempty: "", Semigroup0: () => semigroupString };
var monoidArray = { mempty: [], Semigroup0: () => semigroupArray };
var monoidRecord = () => (dictMonoidRecord) => {
  const semigroupRecord1 = { append: dictMonoidRecord.SemigroupRecord0().appendRecord($$Proxy) };
  return { mempty: dictMonoidRecord.memptyRecord($$Proxy), Semigroup0: () => semigroupRecord1 };
};
var power = (dictMonoid) => {
  const mempty1 = dictMonoid.mempty;
  const $0 = dictMonoid.Semigroup0();
  return (x) => {
    const go = (p) => {
      if (p <= 0) {
        return mempty1;
      }
      if (p === 1) {
        return x;
      }
      if (intMod(p)(2) === 0) {
        const x$p2 = go(intDiv(p, 2));
        return $0.append(x$p2)(x$p2);
      }
      const x$p = go(intDiv(p, 2));
      return $0.append(x$p)($0.append(x$p)(x));
    };
    return go;
  };
};

// output-es/Data.Bounded/foreign.js
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output-es/Data.Enum/foreign.js
function toCharCode(c) {
  return c.charCodeAt(0);
}
function fromCharCode(c) {
  return String.fromCharCode(c);
}

// output-es/Data.String.Unsafe/foreign.js
var charAt = function(i) {
  return function(s) {
    if (i >= 0 && i < s.length)
      return s.charAt(i);
    throw new Error("Data.String.Unsafe.charAt: Invalid index.");
  };
};

// output-es/Data.String.CodeUnits/foreign.js
var fromCharArray = function(a) {
  return a.join("");
};
var toCharArray = function(s) {
  return s.split("");
};
var singleton = function(c) {
  return c;
};
var length2 = function(s) {
  return s.length;
};
var _indexOf = function(just) {
  return function(nothing) {
    return function(x) {
      return function(s) {
        var i = s.indexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};
var _lastIndexOf = function(just) {
  return function(nothing) {
    return function(x) {
      return function(s) {
        var i = s.lastIndexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};
var take = function(n) {
  return function(s) {
    return s.substr(0, n);
  };
};
var drop = function(n) {
  return function(s) {
    return s.substring(n);
  };
};
var slice = function(b) {
  return function(e) {
    return function(s) {
      return s.slice(b, e);
    };
  };
};
var splitAt = function(i) {
  return function(s) {
    return { before: s.substring(0, i), after: s.substring(i) };
  };
};

// output-es/Data.String.CodeUnits/index.js
var stripSuffix = (v) => (str) => {
  const v1 = splitAt(length2(str) - length2(v) | 0)(str);
  if (v1.after === v) {
    return $Maybe(1, v1.before);
  }
  return Nothing;
};
var stripPrefix = (v) => (str) => {
  const v1 = splitAt(length2(v))(str);
  if (v1.before === v) {
    return $Maybe(1, v1.after);
  }
  return Nothing;
};
var lastIndexOf = /* @__PURE__ */ _lastIndexOf(Just)(Nothing);
var indexOf = /* @__PURE__ */ _indexOf(Just)(Nothing);
var contains = (pat) => {
  const $0 = indexOf(pat);
  return (x) => {
    const $1 = $0(x);
    if ($1.tag === 0) {
      return false;
    }
    if ($1.tag === 1) {
      return true;
    }
    fail();
  };
};

// output-es/Data.String.Common/foreign.js
var split = function(sep2) {
  return function(s) {
    return s.split(sep2);
  };
};
var toLower = function(s) {
  return s.toLowerCase();
};
var toUpper = function(s) {
  return s.toUpperCase();
};
var trim = function(s) {
  return s.trim();
};
var joinWith = function(s) {
  return function(xs) {
    return xs.join(s);
  };
};

// output-es/Data.Unfoldable/foreign.js
var unfoldrArrayImpl = function(isNothing2) {
  return function(fromJust3) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var maybe = f(value);
              if (isNothing2(maybe))
                return result;
              var tuple = fromJust3(maybe);
              result.push(fst2(tuple));
              value = snd2(tuple);
            }
          };
        };
      };
    };
  };
};

// output-es/Data.Unfoldable/index.js
var fromJust2 = (v) => {
  if (v.tag === 1) {
    return v._1;
  }
  fail();
};
var unfoldableArray = {
  unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust2)(fst)(snd),
  Unfoldable10: () => unfoldable1Array
};

// output-es/Data.String.CodePoints/foreign.js
var hasArrayFrom = typeof Array.from === "function";
var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
var hasCodePointAt = typeof String.prototype.codePointAt === "function";
var _unsafeCodePointAt0 = function(fallback) {
  return hasCodePointAt ? function(str) {
    return str.codePointAt(0);
  } : fallback;
};
var _codePointAt = function(fallback) {
  return function(Just2) {
    return function(Nothing2) {
      return function(unsafeCodePointAt02) {
        return function(index) {
          return function(str) {
            var length3 = str.length;
            if (index < 0 || index >= length3)
              return Nothing2;
            if (hasStringIterator) {
              var iter = str[Symbol.iterator]();
              for (var i = index; ; --i) {
                var o = iter.next();
                if (o.done)
                  return Nothing2;
                if (i === 0)
                  return Just2(unsafeCodePointAt02(o.value));
              }
            }
            return fallback(index)(str);
          };
        };
      };
    };
  };
};
var _singleton = function(fallback) {
  return hasFromCodePoint ? String.fromCodePoint : fallback;
};
var _take = function(fallback) {
  return function(n) {
    if (hasStringIterator) {
      return function(str) {
        var accum = "";
        var iter = str[Symbol.iterator]();
        for (var i = 0; i < n; ++i) {
          var o = iter.next();
          if (o.done)
            return accum;
          accum += o.value;
        }
        return accum;
      };
    }
    return fallback(n);
  };
};
var _toCodePointArray = function(fallback) {
  return function(unsafeCodePointAt02) {
    if (hasArrayFrom) {
      return function(str) {
        return Array.from(str, unsafeCodePointAt02);
      };
    }
    return fallback;
  };
};

// output-es/Data.String.CodePoints/index.js
var uncons = (s) => {
  const v = length2(s);
  if (v === 0) {
    return Nothing;
  }
  if (v === 1) {
    return $Maybe(1, { head: toCharCode(charAt(0)(s)), tail: "" });
  }
  const cu1 = toCharCode(charAt(1)(s));
  const cu0 = toCharCode(charAt(0)(s));
  if (55296 <= cu0 && cu0 <= 56319 && 56320 <= cu1 && cu1 <= 57343) {
    return $Maybe(1, { head: (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0, tail: drop(2)(s) });
  }
  return $Maybe(1, { head: cu0, tail: drop(1)(s) });
};
var unconsButWithTuple = (s) => {
  const $0 = uncons(s);
  if ($0.tag === 1) {
    return $Maybe(1, $Tuple($0._1.head, $0._1.tail));
  }
  return Nothing;
};
var toCodePointArrayFallback = (s) => unfoldableArray.unfoldr(unconsButWithTuple)(s);
var unsafeCodePointAt0Fallback = (s) => {
  const cu0 = toCharCode(charAt(0)(s));
  if (55296 <= cu0 && cu0 <= 56319 && length2(s) > 1) {
    const cu1 = toCharCode(charAt(1)(s));
    if (56320 <= cu1 && cu1 <= 57343) {
      return (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0;
    }
  }
  return cu0;
};
var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
var lastIndexOf2 = (p) => (s) => {
  const $0 = lastIndexOf(p)(s);
  if ($0.tag === 1) {
    return $Maybe(1, toCodePointArray(take($0._1)(s)).length);
  }
  return Nothing;
};
var indexOf2 = (p) => (s) => {
  const $0 = indexOf(p)(s);
  if ($0.tag === 1) {
    return $Maybe(1, toCodePointArray(take($0._1)(s)).length);
  }
  return Nothing;
};
var fromCharCode2 = (x) => singleton((() => {
  if (x >= 0 && x <= 65535) {
    return fromCharCode(x);
  }
  if (x < 0) {
    return "\0";
  }
  return "￿";
})());
var singletonFallback = (v) => {
  if (v <= 65535) {
    return fromCharCode2(v);
  }
  return fromCharCode2(intDiv(v - 65536 | 0, 1024) + 55296 | 0) + fromCharCode2(intMod(v - 65536 | 0)(1024) + 56320 | 0);
};
var singleton2 = /* @__PURE__ */ _singleton(singletonFallback);
var takeFallback = (v) => (v1) => {
  if (v < 1) {
    return "";
  }
  const v2 = uncons(v1);
  if (v2.tag === 1) {
    return singleton2(v2._1.head) + takeFallback(v - 1 | 0)(v2._1.tail);
  }
  return v1;
};
var take2 = /* @__PURE__ */ _take(takeFallback);
var splitAt2 = (i) => (s) => {
  const before = take2(i)(s);
  return { before, after: drop(length2(before))(s) };
};
var codePointAtFallback = (codePointAtFallback$a0$copy) => (codePointAtFallback$a1$copy) => {
  let codePointAtFallback$a0 = codePointAtFallback$a0$copy, codePointAtFallback$a1 = codePointAtFallback$a1$copy, codePointAtFallback$c = true, codePointAtFallback$r;
  while (codePointAtFallback$c) {
    const n = codePointAtFallback$a0, s = codePointAtFallback$a1;
    const v = uncons(s);
    if (v.tag === 1) {
      if (n === 0) {
        codePointAtFallback$c = false;
        codePointAtFallback$r = $Maybe(1, v._1.head);
        continue;
      }
      codePointAtFallback$a0 = n - 1 | 0;
      codePointAtFallback$a1 = v._1.tail;
      continue;
    }
    codePointAtFallback$c = false;
    codePointAtFallback$r = Nothing;
  }
  return codePointAtFallback$r;
};
var codePointAt = (v) => (v1) => {
  if (v < 0) {
    return Nothing;
  }
  if (v === 0) {
    if (v1 === "") {
      return Nothing;
    }
    return $Maybe(1, unsafeCodePointAt0(v1));
  }
  return _codePointAt(codePointAtFallback)(Just)(Nothing)(unsafeCodePointAt0)(v)(v1);
};

// output-es/ArgParse.Basic/index.js
var $ArgError = (_1, _2) => ({ _1, _2 });
var $ArgErrorMsg = (tag, _1) => ({ tag, _1 });
var $ArgHelp = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
var $ArgParser = (_1, _2) => ({ _1, _2 });
var $ArgResult = (tag, _1, _2) => ({ tag, _1, _2 });
var $HelpClass = (tag, _1) => ({ tag, _1 });
var $HelpFmt = (tag, _1) => ({ tag, _1 });
var intercalate = /* @__PURE__ */ intercalate1(monoidString);
var power2 = /* @__PURE__ */ power(monoidString);
var max2 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v === 0) {
    return y;
  }
  if (v === 2) {
    return x;
  }
  if (v === 1) {
    return x;
  }
  fail();
};
var eq = /* @__PURE__ */ eqArrayImpl(eqStringImpl);
var compare = /* @__PURE__ */ (() => ordArray(ordString).compare)();
var intercalate12 = /* @__PURE__ */ intercalate1(monoidArray);
var fromFoldable = /* @__PURE__ */ foldrArray(Cons)(Nil);
var ExpectedFlag = /* @__PURE__ */ $ArgErrorMsg(
  0
  /* ExpectedFlag */
);
var ExpectedArgValue = /* @__PURE__ */ $ArgErrorMsg(
  1
  /* ExpectedArgValue */
);
var ExpectedArg = /* @__PURE__ */ $ArgErrorMsg(
  3
  /* ExpectedArg */
);
var DuplicateArg = /* @__PURE__ */ $ArgErrorMsg(
  4
  /* DuplicateArg */
);
var ShowHelp = /* @__PURE__ */ $ArgErrorMsg(
  7
  /* ShowHelp */
);
var ArgError = (value0) => (value1) => $ArgError(value0, value1);
var ArgFail = /* @__PURE__ */ $ArgResult(
  2
  /* ArgFail */
);
var unformat = (doc) => (unf) => (v) => {
  const go = (v1) => ({
    step: (stk) => (args) => {
      const v2 = v1.step(stk)(args);
      if (v2.tag === 0) {
        if (v2._1._1.tag === 1) {
          return $ArgResult(0, $ArgError($List(1, $ArgHelp(2, doc, v._1), v2._1._1._2), v2._1._2));
        }
        return $ArgResult(0, v2._1);
      }
      if (v2.tag === 1) {
        return $ArgResult(1, go(v2._1), v2._2);
      }
      if (v2.tag === 2) {
        return ArgFail;
      }
      fail();
    },
    done: (stk) => {
      const $0 = v1.done($List(1, $ArgHelp(2, doc, v._1), stk));
      return (() => {
        if ($0.tag === 0) {
          const $1 = $0._1;
          return (v$1) => $Either(0, $1);
        }
        if ($0.tag === 1) {
          const $1 = $0._1;
          return (f) => f($1);
        }
        fail();
      })()((value) => {
        const $1 = ArgError($List(1, $ArgHelp(2, doc, v._1), stk));
        const $2 = unf(value);
        if ($2.tag === 0) {
          return $Either(0, $1($ArgErrorMsg(5, $2._1)));
        }
        if ($2.tag === 1) {
          return $Either(1, $2._1);
        }
        fail();
      });
    },
    saturated: v1.saturated
  });
  return $ArgParser($ArgHelp(2, doc, v._1), go(v._2));
};
var semigroupHelp = {
  append: (v) => (v1) => {
    if (v.tag === 3) {
      if (v1.tag === 3) {
        return $ArgHelp(3, [...v._1, ...v1._1]);
      }
      return $ArgHelp(3, snoc(v._1)(v1));
    }
    if (v1.tag === 3) {
      return $ArgHelp(3, [v, ...v1._1]);
    }
    return $ArgHelp(3, [v, v1]);
  }
};
var printHelpTable$p = (stk) => (v) => {
  if (v.tag === 0) {
    const names = intercalate(",")(v._1);
    if (stk.tag === 1 && stk._1.tag === 2) {
      return [$Tuple($HelpClass(0, v._1), [$HelpFmt(4, names + " " + stk._1._1), $HelpFmt(4, v._2)])];
    }
    return [$Tuple($HelpClass(0, v._1), [$HelpFmt(4, names), $HelpFmt(4, v._2)])];
  }
  if (v.tag === 1) {
    if (stk.tag === 1 && stk._1.tag === 2) {
      return [$Tuple($HelpClass(1, stk._1._1), [$HelpFmt(4, stk._1._1), $HelpFmt(4, v._1)])];
    }
    return [$Tuple($HelpClass(1, "ANY"), [$HelpFmt(4, "ANY"), $HelpFmt(4, v._1)])];
  }
  if (v.tag === 6) {
    return [$Tuple($HelpClass(1, "--"), [$HelpFmt(4, "--"), $HelpFmt(4, v._1)])];
  }
  if (v.tag === 5) {
    return [$Tuple($HelpClass(2, v._1), [$HelpFmt(4, intercalate(",")(v._1)), $HelpFmt(4, v._2)])];
  }
  if (v.tag === 2) {
    return printHelpTable$p($List(1, $ArgHelp(2, v._1, v._2), stk))(v._2);
  }
  if (v.tag === 4) {
    return arrayBind(v._2)(printHelpTable$p(stk));
  }
  if (v.tag === 3) {
    return arrayBind(v._1)(printHelpTable$p(stk));
  }
  fail();
};
var parserHelp = (v) => v._1;
var parseArgs$p = (parseArgs$p$a0$copy) => (parseArgs$p$a1$copy) => (parseArgs$p$a2$copy) => {
  let parseArgs$p$a0 = parseArgs$p$a0$copy, parseArgs$p$a1 = parseArgs$p$a1$copy, parseArgs$p$a2 = parseArgs$p$a2$copy, parseArgs$p$c = true, parseArgs$p$r;
  while (parseArgs$p$c) {
    const v = parseArgs$p$a0, stk = parseArgs$p$a1, args = parseArgs$p$a2;
    const v1 = v.step(stk)(args);
    if (v1.tag === 0) {
      parseArgs$p$c = false;
      parseArgs$p$r = $Either(0, v1._1);
      continue;
    }
    if (v1.tag === 1) {
      parseArgs$p$a0 = v1._1;
      parseArgs$p$a1 = stk;
      parseArgs$p$a2 = v1._2;
      continue;
    }
    if (v1.tag === 2) {
      if (args.tag === 0) {
        parseArgs$p$c = false;
        parseArgs$p$r = v.done(stk);
        continue;
      }
      if (args.tag === 1) {
        parseArgs$p$c = false;
        parseArgs$p$r = $Either(0, $ArgError(stk, $ArgErrorMsg(6, args._1)));
        continue;
      }
    }
    fail();
  }
  return parseArgs$p$r;
};
var parseArgs = (dictFoldable) => {
  const fromFoldable1 = dictFoldable.foldr(Cons)(Nil);
  return (cmd) => (doc) => (v) => (x) => parseArgs$p(v._2)($List(1, $ArgHelp(5, [cmd], doc, v._1), Nil))(fromFoldable1(x));
};
var joinColumns = (width) => (sep2) => (leftLines) => (rightLines) => {
  const go = (left) => (right) => {
    const len = toCodePointArray(left).length;
    if (len < width) {
      return left + power2(" ")(width - len | 0) + sep2 + right;
    }
    if (len > width) {
      return take2(width)(left) + sep2 + right;
    }
    return left + sep2 + right;
  };
  const diff = leftLines.length - rightLines.length | 0;
  if (diff < 0) {
    return zipWithImpl(go, [...leftLines, ...replicateImpl(diff >= 0 ? diff : -diff, "")], rightLines);
  }
  return zipWithImpl(go, leftLines, [...rightLines, ...replicateImpl(diff, "")]);
};
var renderDocLines = (ind) => (v) => {
  if (v.tag === 0) {
    return arrayBind(intersperse([""])(filterImpl((x) => x.length !== 0, arrayMap(renderDocLines(ind))(v._1))))(identity2);
  }
  if (v.tag === 1) {
    return arrayBind(v._1)(renderDocLines(ind));
  }
  if (v.tag === 4) {
    return arrayMap(($0) => ind + $0)(split("\n")(v._1));
  }
  if (v.tag === 3) {
    return renderDocLines(ind + "    ")(v._1);
  }
  if (v.tag === 2) {
    return printTableLines(ind)(v._1);
  }
  fail();
};
var printTableLines = (ind) => (rows) => {
  const rows$p = arrayMap(arrayMap(renderDocLines("")))(rows);
  const colWidths = arrayMap((ix) => foldrArray((() => {
    const $0 = foldrArray((x) => max2(toCodePointArray(x).length))(0);
    return (x) => {
      if (ix >= 0 && ix < x.length) {
        return max2($0(x[ix]));
      }
      return max2($0([]));
    };
  })())(0)(rows$p))(rangeImpl(0, foldrArray((x) => max2(x.length))(0)(rows) - 1 | 0));
  return arrayBind(rows$p)((cols) => {
    const $0 = zipWithImpl(Tuple, colWidths, cols);
    if ($0.length > 0) {
      return arrayMap(($1) => ind + $1)(foldr1Impl(
        (v1) => {
          const $1 = v1._2;
          const $2 = v1._1;
          return (v2) => $Tuple($2 + v2._1 | 0, joinColumns($2)("    ")($1)(v2._2));
        },
        $0
      )._2);
    }
    return [];
  });
};
var renderDoc = /* @__PURE__ */ (() => {
  const $0 = intercalate("\n");
  return (x) => $0(renderDocLines("")(x));
})();
var functorArgResult = {
  map: (f) => (m) => {
    if (m.tag === 0) {
      return $ArgResult(0, m._1);
    }
    if (m.tag === 1) {
      return $ArgResult(1, f(m._1), m._2);
    }
    if (m.tag === 2) {
      return ArgFail;
    }
    fail();
  }
};
var functorArgFold = {
  map: (f) => (m) => ({
    step: (() => {
      const $0 = semigroupoidFn.compose(functorArgResult.map(functorArgFold.map(f)));
      return (x) => $0(m.step(x));
    })(),
    done: (x) => {
      const $0 = m.done(x);
      if ($0.tag === 0) {
        return $Either(0, $0._1);
      }
      if ($0.tag === 1) {
        return $Either(1, f($0._1));
      }
      fail();
    },
    saturated: m.saturated
  })
};
var functorArgParser = { map: (f) => (m) => $ArgParser(m._1, functorArgFold.map(f)(m._2)) };
var flag$p = (names) => (v) => {
  if (v.tag === 1 && elem(eqString)(v._1)(names)) {
    return $ArgResult(1, void 0, v._2);
  }
  return ArgFail;
};
var flagHelp = /* @__PURE__ */ (() => {
  const name2 = ["--help", "-h"];
  return $ArgParser(
    $ArgHelp(0, name2, "Show this help message."),
    {
      step: (stk) => (args) => {
        const v = flag$p(name2)(args);
        if (v.tag === 0) {
          return $ArgResult(0, v._1);
        }
        if (v.tag === 2) {
          return ArgFail;
        }
        if (v.tag === 1) {
          return $ArgResult(0, $ArgError(stk, ShowHelp));
        }
        fail();
      },
      done: (v) => $Either(1, void 0),
      saturated: true
    }
  );
})();
var flagInfo = (name2) => (doc) => (info2) => $ArgParser(
  $ArgHelp(0, name2, doc),
  {
    step: (stk) => (args) => {
      const v = flag$p(name2)(args);
      if (v.tag === 0) {
        return $ArgResult(0, v._1);
      }
      if (v.tag === 2) {
        return ArgFail;
      }
      if (v.tag === 1) {
        return $ArgResult(0, $ArgError($List(1, $ArgHelp(0, name2, doc), stk), $ArgErrorMsg(8, info2)));
      }
      fail();
    },
    done: (v) => $Either(1, void 0),
    saturated: true
  }
);
var failDup = (help) => (errMsg) => (v) => ({
  step: (stk) => (args) => {
    const v1 = v.step(stk)(args);
    if (v1.tag === 0) {
      return $ArgResult(0, v1._1);
    }
    if (v1.tag === 2) {
      return ArgFail;
    }
    if (v1.tag === 1) {
      return $ArgResult(0, $ArgError($List(1, help, stk), errMsg));
    }
    fail();
  },
  done: v.done,
  saturated: true
});
var flag = (name2) => (doc) => {
  const step = (v) => {
    const $0 = functorArgResult.map((value) => failDup($ArgHelp(0, name2, doc))(DuplicateArg)({
      step,
      done: (v$1) => $Either(1, value),
      saturated: true
    }));
    return (x) => $0(flag$p(name2)(x));
  };
  return $ArgParser(
    $ArgHelp(0, name2, doc),
    {
      step,
      done: (stk) => $Either(0, $ArgError($List(1, $ArgHelp(0, name2, doc), stk), ExpectedFlag)),
      saturated: false
    }
  );
};
var eqHelpClass = {
  eq: (x) => (y) => {
    if (x.tag === 0) {
      return y.tag === 0 && eq(x._1)(y._1);
    }
    if (x.tag === 1) {
      return y.tag === 1 && x._1 === y._1;
    }
    return x.tag === 2 && y.tag === 2 && eq(x._1)(y._1);
  }
};
var ordHelpClass = {
  compare: (x) => (y) => {
    if (x.tag === 0) {
      if (y.tag === 0) {
        return compare(x._1)(y._1);
      }
      return LT;
    }
    if (y.tag === 0) {
      return GT;
    }
    if (x.tag === 1) {
      if (y.tag === 1) {
        return ordString.compare(x._1)(y._1);
      }
      return LT;
    }
    if (y.tag === 1) {
      return GT;
    }
    if (x.tag === 2 && y.tag === 2) {
      return compare(x._1)(y._1);
    }
    fail();
  },
  Eq0: () => eqHelpClass
};
var printHelpTable = (stk) => {
  const $0 = sortBy((x) => (y) => ordHelpClass.compare(x._1)(y._1));
  const $1 = groupBy((x) => (y) => {
    if (x._1.tag === 0) {
      return y._1.tag === 0;
    }
    if (x._1.tag === 1) {
      return y._1.tag === 1;
    }
    return x._1.tag === 2 && y._1.tag === 2;
  });
  const $2 = arrayMap(arrayMap(snd));
  const $3 = intercalate12([[$HelpFmt(4, "")]]);
  return (x) => $3($2($1($0(printHelpTable$p(stk)(x)))));
};
var printHelp$p = (stk) => (v) => {
  if (v.tag === 2) {
    return printHelp$p($List(1, $ArgHelp(2, v._1, v._2), stk))(v._2);
  }
  if (v.tag === 5) {
    return $HelpFmt(
      0,
      [
        $HelpFmt(1, [$HelpFmt(4, intercalate(",")(v._1)), $HelpFmt(3, $HelpFmt(4, v._2))]),
        $HelpFmt(3, printHelp$p(stk)(v._3))
      ]
    );
  }
  return $HelpFmt(2, printHelpTable(stk)(v));
};
var printArgError = (v) => {
  const $0 = v._1;
  const getCmd = (getCmd$a0$copy) => (getCmd$a1$copy) => (getCmd$a2$copy) => (getCmd$a3$copy) => {
    let getCmd$a0 = getCmd$a0$copy, getCmd$a1 = getCmd$a1$copy, getCmd$a2 = getCmd$a2$copy, getCmd$a3 = getCmd$a3$copy, getCmd$c = true, getCmd$r;
    while (getCmd$c) {
      const cmd = getCmd$a0, desc = getCmd$a1, help = getCmd$a2, v1 = getCmd$a3;
      if (v1.tag === 0) {
        getCmd$c = false;
        getCmd$r = { cmd, desc, help };
        continue;
      }
      if (v1.tag === 1) {
        if (v1._1.tag === 5) {
          getCmd$a0 = $List(1, v1._1._1, cmd);
          getCmd$a1 = desc.tag === 0 ? $Maybe(1, v1._1._2) : desc;
          getCmd$a2 = help.tag === 0 ? $Maybe(1, v1._1._3) : help;
          getCmd$a3 = v1._2;
          continue;
        }
        if (v1._1.tag === 0) {
          getCmd$a0 = $List(1, v1._1._1, cmd);
          getCmd$a1 = Nothing;
          getCmd$a2 = $Maybe(1, $ArgHelp(0, v1._1._1, v1._1._2));
          getCmd$a3 = v1._2;
          continue;
        }
        if (v1._1.tag === 1) {
          getCmd$a0 = cmd;
          getCmd$a1 = Nothing;
          getCmd$a2 = $Maybe(1, $ArgHelp(1, v1._1._1));
          getCmd$a3 = v1._2;
          continue;
        }
        if (v1._1.tag === 2) {
          getCmd$a0 = cmd;
          getCmd$a1 = desc;
          getCmd$a2 = help;
          getCmd$a3 = $List(1, v1._1._2, v1._2);
          continue;
        }
        getCmd$a0 = cmd;
        getCmd$a1 = desc;
        getCmd$a2 = help;
        getCmd$a3 = v1._2;
        continue;
      }
      fail();
    }
    return getCmd$r;
  };
  const printArgError$p = (err) => {
    const v1 = getCmd(Nil)(Nothing)(Nothing)($0);
    return $HelpFmt(
      1,
      [
        $HelpFmt(
          4,
          (() => {
            const go = (go$a0$copy) => (go$a1$copy) => {
              let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
              while (go$c) {
                const b = go$a0, v$1 = go$a1;
                if (v$1.tag === 0) {
                  go$c = false;
                  go$r = b;
                  continue;
                }
                if (v$1.tag === 1) {
                  go$a0 = b.init ? { init: false, acc: v$1._1 } : { init: false, acc: b.acc + " " + v$1._1 };
                  go$a1 = v$1._2;
                  continue;
                }
                fail();
              }
              return go$r;
            };
            return go({ init: true, acc: "" })(listMap(intercalate(","))(v1.cmd)).acc;
          })()
        ),
        $HelpFmt(
          3,
          $HelpFmt(
            0,
            [
              err,
              (() => {
                if (v1.desc.tag === 0) {
                  return $HelpFmt(1, []);
                }
                if (v1.desc.tag === 1) {
                  return $HelpFmt(4, v1.desc._1);
                }
                fail();
              })(),
              (() => {
                if (v1.help.tag === 0) {
                  return $HelpFmt(1, []);
                }
                if (v1.help.tag === 1) {
                  return printHelp$p($0)(v1.help._1);
                }
                fail();
              })()
            ]
          )
        )
      ]
    );
  };
  return renderDoc((() => {
    if (v._2.tag === 0) {
      return printArgError$p($HelpFmt(4, "Expected flag."));
    }
    if (v._2.tag === 1) {
      if ($0.tag === 1 && $0._1.tag === 2) {
        return printArgError$p($HelpFmt(4, "Expected " + $0._1._1 + "."));
      }
      return printArgError$p($HelpFmt(4, "Expected argument value."));
    }
    if (v._2.tag === 3) {
      if ($0.tag === 1) {
        if ($0._1.tag === 2) {
          return printArgError$p($HelpFmt(4, "Expected " + $0._1._1 + "."));
        }
        if ($0._1.tag === 4) {
          return printArgError$p($HelpFmt(4, "Expected " + $0._1._1 + "."));
        }
      }
      return printArgError$p($HelpFmt(4, "Expected argument."));
    }
    if (v._2.tag === 2) {
      return printArgError$p($HelpFmt(4, "Expected rest arguments."));
    }
    if (v._2.tag === 4) {
      if ($0.tag === 1 && $0._1.tag === 4) {
        return printArgError$p($HelpFmt(4, "Duplicate " + $0._1._1 + "."));
      }
      return printArgError$p($HelpFmt(4, "Duplicate argument."));
    }
    if (v._2.tag === 5) {
      return printArgError$p($HelpFmt(4, v._2._1));
    }
    if (v._2.tag === 7) {
      return printArgError$p($HelpFmt(1, []));
    }
    if (v._2.tag === 8) {
      return $HelpFmt(4, v._2._1);
    }
    if (v._2.tag === 6) {
      return printArgError$p($HelpFmt(1, [$HelpFmt(4, "Unexpected argument:"), $HelpFmt(3, $HelpFmt(4, v._2._1))]));
    }
    fail();
  })());
};
var optional = (x) => {
  const $0 = functorArgFold.map(Just)(x._2);
  return $ArgParser(
    x._1,
    {
      step: $0.step,
      done: (x$1) => {
        const $1 = $0.done(x$1);
        if ($1.tag === 0) {
          return $Either(1, Nothing);
        }
        if ($1.tag === 1) {
          return $Either(1, $1._1);
        }
        fail();
      },
      saturated: true
    }
  );
};
var choose = (name2) => (parsers) => {
  const help = $ArgHelp(4, name2, arrayMap(parserHelp)(parsers));
  const go2 = (stk) => (args) => (acc) => (v) => {
    if (v.tag === 1) {
      const v1 = v._1.step(stk)(args);
      if (v1.tag === 0) {
        return $ArgResult(0, v1._1);
      }
      if (v1.tag === 2) {
        return go2(stk)(args)($List(1, v._1, acc))(v._2);
      }
      if (v1.tag === 1) {
        if (v1._1.saturated) {
          return $ArgResult(
            1,
            failDup(help)(DuplicateArg)({
              step: go1(foldableList.foldr(Cons)($List(1, v1._1, v._2))(acc)),
              done: v1._1.done,
              saturated: true
            }),
            v1._2
          );
        }
        return $ArgResult(
          1,
          { step: (stk$p) => (args$p$p) => go2(stk$p)(args$p$p)(acc)($List(1, v1._1, v._2)), done: v1._1.done, saturated: false },
          v1._2
        );
      }
      fail();
    }
    if (v.tag === 0) {
      return ArgFail;
    }
    fail();
  };
  const go1 = (parsers$p) => (stk) => (args) => go2(stk)(args)(Nil)(parsers$p);
  return $ArgParser(
    help,
    {
      step: go1(fromFoldable(arrayMap((v) => v._2)(parsers))),
      done: (stk) => $Either(0, $ArgError($List(1, help, stk), ExpectedArg)),
      saturated: false
    }
  );
};
var $$boolean = (x) => {
  const $0 = functorArgFold.map((v) => true)(x._2);
  return $ArgParser(
    x._1,
    {
      step: $0.step,
      done: (x$1) => {
        const $1 = $0.done(x$1);
        if ($1.tag === 0) {
          return $Either(1, false);
        }
        if ($1.tag === 1) {
          return $Either(1, $1._1);
        }
        fail();
      },
      saturated: true
    }
  );
};
var argument$p = (stk) => (names) => (v) => {
  if (v.tag === 1) {
    const $0 = v._1;
    const $1 = findMapImpl(Nothing, isJust, (x) => stripPrefix(x)($0), names);
    if ($1.tag === 1) {
      if (take(1)($1._1) === "=") {
        return $ArgResult(1, drop(1)($1._1), v._2);
      }
      if ($1._1 === "") {
        if (v._2.tag === 1) {
          return $ArgResult(1, v._2._1, v._2._2);
        }
        return $ArgResult(0, $ArgError(stk, ExpectedArgValue));
      }
    }
  }
  return ArgFail;
};
var argument = (name2) => (doc) => {
  const step = (stk) => {
    const $0 = functorArgResult.map((value) => failDup($ArgHelp(0, name2, doc))(DuplicateArg)({
      step,
      done: (v) => $Either(1, value),
      saturated: true
    }));
    return (x) => $0(argument$p($List(1, $ArgHelp(0, name2, doc), stk))(name2)(x));
  };
  return $ArgParser(
    $ArgHelp(0, name2, doc),
    {
      step,
      done: (stk) => $Either(0, $ArgError($List(1, $ArgHelp(0, name2, doc), stk), ExpectedArg)),
      saturated: false
    }
  );
};
var applyArgFold = {
  apply: (v) => (v1) => ({
    step: (stk) => (args) => {
      const v2 = v.step(stk)(args);
      if (v2.tag === 0) {
        return $ArgResult(0, v2._1);
      }
      if (v2.tag === 1) {
        return $ArgResult(1, applyArgFold.apply(v2._1)(v1), v2._2);
      }
      if (v2.tag === 2) {
        const v3 = v1.step(stk)(args);
        if (v3.tag === 0) {
          return $ArgResult(0, v3._1);
        }
        if (v3.tag === 1) {
          return $ArgResult(1, applyArgFold.apply(v)(v3._1), v3._2);
        }
        if (v3.tag === 2) {
          return ArgFail;
        }
      }
      fail();
    },
    done: (stk) => {
      const $0 = v.done(stk);
      const $1 = v1.done(stk);
      if ($0.tag === 0) {
        return $Either(0, $0._1);
      }
      if ($0.tag === 1) {
        if ($1.tag === 0) {
          return $Either(0, $1._1);
        }
        if ($1.tag === 1) {
          return $Either(1, $0._1($1._1));
        }
      }
      fail();
    },
    saturated: v.saturated && v1.saturated
  }),
  Functor0: () => functorArgFold
};
var applyParser = { apply: (v) => (v1) => $ArgParser(semigroupHelp.append(v._1)(v1._1), applyArgFold.apply(v._2)(v1._2)), Functor0: () => functorArgParser };
var command = (name2) => (doc) => (v) => {
  const $0 = v._2;
  return $ArgParser(
    $ArgHelp(5, name2, doc, v._1),
    {
      step: (stk) => (args) => {
        const v2 = flag$p(name2)(args);
        if (v2.tag === 0) {
          return $ArgResult(0, v2._1);
        }
        if (v2.tag === 2) {
          return ArgFail;
        }
        if (v2.tag === 1) {
          const v3 = parseArgs$p($0)($List(1, $ArgHelp(5, name2, doc, v._1), stk))(v2._2);
          if (v3.tag === 0) {
            return $ArgResult(0, v3._1);
          }
          if (v3.tag === 1) {
            const $1 = v3._1;
            return $ArgResult(1, { step: (v$1) => (v1) => ArgFail, done: (v$1) => $Either(1, $1), saturated: true }, Nil);
          }
        }
        fail();
      },
      done: $0.done,
      saturated: false
    }
  );
};

// output-es/Data.CodePoint.Unicode.Internal/index.js
var $UnicodeCategory = (tag) => tag;
var NUMCAT_LU = /* @__PURE__ */ $UnicodeCategory(
  0
  /* NUMCAT_LU */
);
var NUMCAT_LL = /* @__PURE__ */ $UnicodeCategory(
  1
  /* NUMCAT_LL */
);
var NUMCAT_LT = /* @__PURE__ */ $UnicodeCategory(
  2
  /* NUMCAT_LT */
);
var NUMCAT_MN = /* @__PURE__ */ $UnicodeCategory(
  5
  /* NUMCAT_MN */
);
var NUMCAT_NL = /* @__PURE__ */ $UnicodeCategory(
  9
  /* NUMCAT_NL */
);
var NUMCAT_SO = /* @__PURE__ */ $UnicodeCategory(
  21
  /* NUMCAT_SO */
);
var NUMCAT_CN = /* @__PURE__ */ $UnicodeCategory(
  29
  /* NUMCAT_CN */
);
var rule170 = { category: 8192, unicodeCat: NUMCAT_SO, possible: 1, updist: 0, lowdist: 26, titledist: 0 };
var rule171 = { category: 8192, unicodeCat: NUMCAT_SO, possible: 1, updist: -26, lowdist: 0, titledist: -26 };
var rule168 = { category: 16777216, unicodeCat: NUMCAT_NL, possible: 1, updist: 0, lowdist: 16, titledist: 0 };
var rule169 = { category: 16777216, unicodeCat: NUMCAT_NL, possible: 1, updist: -16, lowdist: 0, titledist: -16 };
var rule93 = { category: 2097152, unicodeCat: NUMCAT_MN, possible: 1, updist: 84, lowdist: 0, titledist: 84 };
var nullrule = { category: 512, unicodeCat: NUMCAT_CN, possible: 0, updist: 0, lowdist: 0, titledist: 0 };
var rule104 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 8, titledist: 0 };
var rule115 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -60, titledist: 0 };
var rule117 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -7, titledist: 0 };
var rule118 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 80, titledist: 0 };
var rule120 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 15, titledist: 0 };
var rule122 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 48, titledist: 0 };
var rule125 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 7264, titledist: 0 };
var rule127 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 38864, titledist: 0 };
var rule137 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -3008, titledist: 0 };
var rule142 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -7615, titledist: 0 };
var rule144 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -8, titledist: 0 };
var rule153 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -74, titledist: 0 };
var rule156 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -86, titledist: 0 };
var rule157 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -100, titledist: 0 };
var rule158 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -112, titledist: 0 };
var rule159 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -128, titledist: 0 };
var rule160 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -126, titledist: 0 };
var rule163 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -7517, titledist: 0 };
var rule164 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -8383, titledist: 0 };
var rule165 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -8262, titledist: 0 };
var rule166 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 28, titledist: 0 };
var rule172 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -10743, titledist: 0 };
var rule173 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -3814, titledist: 0 };
var rule174 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -10727, titledist: 0 };
var rule177 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -10780, titledist: 0 };
var rule178 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -10749, titledist: 0 };
var rule179 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -10783, titledist: 0 };
var rule180 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -10782, titledist: 0 };
var rule181 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -10815, titledist: 0 };
var rule183 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -35332, titledist: 0 };
var rule184 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -42280, titledist: 0 };
var rule186 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -42308, titledist: 0 };
var rule187 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -42319, titledist: 0 };
var rule188 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -42315, titledist: 0 };
var rule189 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -42305, titledist: 0 };
var rule190 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -42258, titledist: 0 };
var rule191 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -42282, titledist: 0 };
var rule192 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -42261, titledist: 0 };
var rule193 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 928, titledist: 0 };
var rule194 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -48, titledist: 0 };
var rule195 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -42307, titledist: 0 };
var rule196 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -35384, titledist: 0 };
var rule201 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 40, titledist: 0 };
var rule203 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 34, titledist: 0 };
var rule22 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 1, titledist: 0 };
var rule24 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -199, titledist: 0 };
var rule26 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -121, titledist: 0 };
var rule29 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 210, titledist: 0 };
var rule30 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 206, titledist: 0 };
var rule31 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 205, titledist: 0 };
var rule32 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 79, titledist: 0 };
var rule33 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 202, titledist: 0 };
var rule34 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 203, titledist: 0 };
var rule35 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 207, titledist: 0 };
var rule37 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 211, titledist: 0 };
var rule38 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 209, titledist: 0 };
var rule40 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 213, titledist: 0 };
var rule42 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 214, titledist: 0 };
var rule43 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 218, titledist: 0 };
var rule44 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 217, titledist: 0 };
var rule45 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 219, titledist: 0 };
var rule47 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 2, titledist: 1 };
var rule51 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -97, titledist: 0 };
var rule52 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -56, titledist: 0 };
var rule53 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -130, titledist: 0 };
var rule54 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 10795, titledist: 0 };
var rule55 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -163, titledist: 0 };
var rule56 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 10792, titledist: 0 };
var rule58 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: -195, titledist: 0 };
var rule59 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 69, titledist: 0 };
var rule60 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 71, titledist: 0 };
var rule9 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 32, titledist: 0 };
var rule94 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 116, titledist: 0 };
var rule95 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 38, titledist: 0 };
var rule96 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 37, titledist: 0 };
var rule97 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 64, titledist: 0 };
var rule98 = { category: 512, unicodeCat: NUMCAT_LU, possible: 1, updist: 0, lowdist: 63, titledist: 0 };
var rule151 = { category: 524288, unicodeCat: NUMCAT_LT, possible: 1, updist: 0, lowdist: -8, titledist: 0 };
var rule154 = { category: 524288, unicodeCat: NUMCAT_LT, possible: 1, updist: 0, lowdist: -9, titledist: 0 };
var rule48 = { category: 524288, unicodeCat: NUMCAT_LT, possible: 1, updist: -1, lowdist: 1, titledist: 0 };
var rule100 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -37, lowdist: 0, titledist: -37 };
var rule101 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -31, lowdist: 0, titledist: -31 };
var rule102 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -64, lowdist: 0, titledist: -64 };
var rule103 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -63, lowdist: 0, titledist: -63 };
var rule105 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -62, lowdist: 0, titledist: -62 };
var rule106 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -57, lowdist: 0, titledist: -57 };
var rule108 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -47, lowdist: 0, titledist: -47 };
var rule109 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -54, lowdist: 0, titledist: -54 };
var rule110 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -8, lowdist: 0, titledist: -8 };
var rule111 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -86, lowdist: 0, titledist: -86 };
var rule112 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -80, lowdist: 0, titledist: -80 };
var rule113 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 7, lowdist: 0, titledist: 7 };
var rule114 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -116, lowdist: 0, titledist: -116 };
var rule116 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -96, lowdist: 0, titledist: -96 };
var rule12 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -32, lowdist: 0, titledist: -32 };
var rule121 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -15, lowdist: 0, titledist: -15 };
var rule123 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -48, lowdist: 0, titledist: -48 };
var rule126 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 3008, lowdist: 0, titledist: 0 };
var rule129 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -6254, lowdist: 0, titledist: -6254 };
var rule130 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -6253, lowdist: 0, titledist: -6253 };
var rule131 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -6244, lowdist: 0, titledist: -6244 };
var rule132 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -6242, lowdist: 0, titledist: -6242 };
var rule133 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -6243, lowdist: 0, titledist: -6243 };
var rule134 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -6236, lowdist: 0, titledist: -6236 };
var rule135 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -6181, lowdist: 0, titledist: -6181 };
var rule136 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 35266, lowdist: 0, titledist: 35266 };
var rule138 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 35332, lowdist: 0, titledist: 35332 };
var rule139 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 3814, lowdist: 0, titledist: 3814 };
var rule140 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 35384, lowdist: 0, titledist: 35384 };
var rule141 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -59, lowdist: 0, titledist: -59 };
var rule143 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 8, lowdist: 0, titledist: 8 };
var rule145 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 74, lowdist: 0, titledist: 74 };
var rule146 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 86, lowdist: 0, titledist: 86 };
var rule147 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 100, lowdist: 0, titledist: 100 };
var rule148 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 128, lowdist: 0, titledist: 128 };
var rule149 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 112, lowdist: 0, titledist: 112 };
var rule150 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 126, lowdist: 0, titledist: 126 };
var rule152 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 9, lowdist: 0, titledist: 9 };
var rule155 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -7205, lowdist: 0, titledist: -7205 };
var rule167 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -28, lowdist: 0, titledist: -28 };
var rule175 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -10795, lowdist: 0, titledist: -10795 };
var rule176 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -10792, lowdist: 0, titledist: -10792 };
var rule18 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 743, lowdist: 0, titledist: 743 };
var rule182 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -7264, lowdist: 0, titledist: -7264 };
var rule185 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 48, lowdist: 0, titledist: 48 };
var rule197 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -928, lowdist: 0, titledist: -928 };
var rule198 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -38864, lowdist: 0, titledist: -38864 };
var rule202 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -40, lowdist: 0, titledist: -40 };
var rule204 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -34, lowdist: 0, titledist: -34 };
var rule21 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 121, lowdist: 0, titledist: 121 };
var rule23 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -1, lowdist: 0, titledist: -1 };
var rule25 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -232, lowdist: 0, titledist: -232 };
var rule27 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -300, lowdist: 0, titledist: -300 };
var rule28 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 195, lowdist: 0, titledist: 195 };
var rule36 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 97, lowdist: 0, titledist: 97 };
var rule39 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 163, lowdist: 0, titledist: 163 };
var rule41 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 130, lowdist: 0, titledist: 130 };
var rule46 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 56, lowdist: 0, titledist: 56 };
var rule49 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -2, lowdist: 0, titledist: -1 };
var rule50 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -79, lowdist: 0, titledist: -79 };
var rule57 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 10815, lowdist: 0, titledist: 10815 };
var rule61 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 10783, lowdist: 0, titledist: 10783 };
var rule62 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 10780, lowdist: 0, titledist: 10780 };
var rule63 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 10782, lowdist: 0, titledist: 10782 };
var rule64 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -210, lowdist: 0, titledist: -210 };
var rule65 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -206, lowdist: 0, titledist: -206 };
var rule66 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -205, lowdist: 0, titledist: -205 };
var rule67 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -202, lowdist: 0, titledist: -202 };
var rule68 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -203, lowdist: 0, titledist: -203 };
var rule69 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 42319, lowdist: 0, titledist: 42319 };
var rule70 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 42315, lowdist: 0, titledist: 42315 };
var rule71 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -207, lowdist: 0, titledist: -207 };
var rule72 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 42280, lowdist: 0, titledist: 42280 };
var rule73 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 42308, lowdist: 0, titledist: 42308 };
var rule74 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -209, lowdist: 0, titledist: -209 };
var rule75 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -211, lowdist: 0, titledist: -211 };
var rule76 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 10743, lowdist: 0, titledist: 10743 };
var rule77 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 42305, lowdist: 0, titledist: 42305 };
var rule78 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 10749, lowdist: 0, titledist: 10749 };
var rule79 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -213, lowdist: 0, titledist: -213 };
var rule80 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -214, lowdist: 0, titledist: -214 };
var rule81 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 10727, lowdist: 0, titledist: 10727 };
var rule82 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -218, lowdist: 0, titledist: -218 };
var rule83 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 42307, lowdist: 0, titledist: 42307 };
var rule84 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 42282, lowdist: 0, titledist: 42282 };
var rule85 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -69, lowdist: 0, titledist: -69 };
var rule86 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -217, lowdist: 0, titledist: -217 };
var rule87 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -71, lowdist: 0, titledist: -71 };
var rule88 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -219, lowdist: 0, titledist: -219 };
var rule89 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 42261, lowdist: 0, titledist: 42261 };
var rule90 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: 42258, lowdist: 0, titledist: 42258 };
var rule99 = { category: 4096, unicodeCat: NUMCAT_LL, possible: 1, updist: -38, lowdist: 0, titledist: -38 };
var convchars = [
  { start: 65, length: 26, convRule: rule9 },
  { start: 97, length: 26, convRule: rule12 },
  { start: 181, length: 1, convRule: rule18 },
  { start: 192, length: 23, convRule: rule9 },
  { start: 216, length: 7, convRule: rule9 },
  { start: 224, length: 23, convRule: rule12 },
  { start: 248, length: 7, convRule: rule12 },
  { start: 255, length: 1, convRule: rule21 },
  { start: 256, length: 1, convRule: rule22 },
  { start: 257, length: 1, convRule: rule23 },
  { start: 258, length: 1, convRule: rule22 },
  { start: 259, length: 1, convRule: rule23 },
  { start: 260, length: 1, convRule: rule22 },
  { start: 261, length: 1, convRule: rule23 },
  { start: 262, length: 1, convRule: rule22 },
  { start: 263, length: 1, convRule: rule23 },
  { start: 264, length: 1, convRule: rule22 },
  { start: 265, length: 1, convRule: rule23 },
  { start: 266, length: 1, convRule: rule22 },
  { start: 267, length: 1, convRule: rule23 },
  { start: 268, length: 1, convRule: rule22 },
  { start: 269, length: 1, convRule: rule23 },
  { start: 270, length: 1, convRule: rule22 },
  { start: 271, length: 1, convRule: rule23 },
  { start: 272, length: 1, convRule: rule22 },
  { start: 273, length: 1, convRule: rule23 },
  { start: 274, length: 1, convRule: rule22 },
  { start: 275, length: 1, convRule: rule23 },
  { start: 276, length: 1, convRule: rule22 },
  { start: 277, length: 1, convRule: rule23 },
  { start: 278, length: 1, convRule: rule22 },
  { start: 279, length: 1, convRule: rule23 },
  { start: 280, length: 1, convRule: rule22 },
  { start: 281, length: 1, convRule: rule23 },
  { start: 282, length: 1, convRule: rule22 },
  { start: 283, length: 1, convRule: rule23 },
  { start: 284, length: 1, convRule: rule22 },
  { start: 285, length: 1, convRule: rule23 },
  { start: 286, length: 1, convRule: rule22 },
  { start: 287, length: 1, convRule: rule23 },
  { start: 288, length: 1, convRule: rule22 },
  { start: 289, length: 1, convRule: rule23 },
  { start: 290, length: 1, convRule: rule22 },
  { start: 291, length: 1, convRule: rule23 },
  { start: 292, length: 1, convRule: rule22 },
  { start: 293, length: 1, convRule: rule23 },
  { start: 294, length: 1, convRule: rule22 },
  { start: 295, length: 1, convRule: rule23 },
  { start: 296, length: 1, convRule: rule22 },
  { start: 297, length: 1, convRule: rule23 },
  { start: 298, length: 1, convRule: rule22 },
  { start: 299, length: 1, convRule: rule23 },
  { start: 300, length: 1, convRule: rule22 },
  { start: 301, length: 1, convRule: rule23 },
  { start: 302, length: 1, convRule: rule22 },
  { start: 303, length: 1, convRule: rule23 },
  { start: 304, length: 1, convRule: rule24 },
  { start: 305, length: 1, convRule: rule25 },
  { start: 306, length: 1, convRule: rule22 },
  { start: 307, length: 1, convRule: rule23 },
  { start: 308, length: 1, convRule: rule22 },
  { start: 309, length: 1, convRule: rule23 },
  { start: 310, length: 1, convRule: rule22 },
  { start: 311, length: 1, convRule: rule23 },
  { start: 313, length: 1, convRule: rule22 },
  { start: 314, length: 1, convRule: rule23 },
  { start: 315, length: 1, convRule: rule22 },
  { start: 316, length: 1, convRule: rule23 },
  { start: 317, length: 1, convRule: rule22 },
  { start: 318, length: 1, convRule: rule23 },
  { start: 319, length: 1, convRule: rule22 },
  { start: 320, length: 1, convRule: rule23 },
  { start: 321, length: 1, convRule: rule22 },
  { start: 322, length: 1, convRule: rule23 },
  { start: 323, length: 1, convRule: rule22 },
  { start: 324, length: 1, convRule: rule23 },
  { start: 325, length: 1, convRule: rule22 },
  { start: 326, length: 1, convRule: rule23 },
  { start: 327, length: 1, convRule: rule22 },
  { start: 328, length: 1, convRule: rule23 },
  { start: 330, length: 1, convRule: rule22 },
  { start: 331, length: 1, convRule: rule23 },
  { start: 332, length: 1, convRule: rule22 },
  { start: 333, length: 1, convRule: rule23 },
  { start: 334, length: 1, convRule: rule22 },
  { start: 335, length: 1, convRule: rule23 },
  { start: 336, length: 1, convRule: rule22 },
  { start: 337, length: 1, convRule: rule23 },
  { start: 338, length: 1, convRule: rule22 },
  { start: 339, length: 1, convRule: rule23 },
  { start: 340, length: 1, convRule: rule22 },
  { start: 341, length: 1, convRule: rule23 },
  { start: 342, length: 1, convRule: rule22 },
  { start: 343, length: 1, convRule: rule23 },
  { start: 344, length: 1, convRule: rule22 },
  { start: 345, length: 1, convRule: rule23 },
  { start: 346, length: 1, convRule: rule22 },
  { start: 347, length: 1, convRule: rule23 },
  { start: 348, length: 1, convRule: rule22 },
  { start: 349, length: 1, convRule: rule23 },
  { start: 350, length: 1, convRule: rule22 },
  { start: 351, length: 1, convRule: rule23 },
  { start: 352, length: 1, convRule: rule22 },
  { start: 353, length: 1, convRule: rule23 },
  { start: 354, length: 1, convRule: rule22 },
  { start: 355, length: 1, convRule: rule23 },
  { start: 356, length: 1, convRule: rule22 },
  { start: 357, length: 1, convRule: rule23 },
  { start: 358, length: 1, convRule: rule22 },
  { start: 359, length: 1, convRule: rule23 },
  { start: 360, length: 1, convRule: rule22 },
  { start: 361, length: 1, convRule: rule23 },
  { start: 362, length: 1, convRule: rule22 },
  { start: 363, length: 1, convRule: rule23 },
  { start: 364, length: 1, convRule: rule22 },
  { start: 365, length: 1, convRule: rule23 },
  { start: 366, length: 1, convRule: rule22 },
  { start: 367, length: 1, convRule: rule23 },
  { start: 368, length: 1, convRule: rule22 },
  { start: 369, length: 1, convRule: rule23 },
  { start: 370, length: 1, convRule: rule22 },
  { start: 371, length: 1, convRule: rule23 },
  { start: 372, length: 1, convRule: rule22 },
  { start: 373, length: 1, convRule: rule23 },
  { start: 374, length: 1, convRule: rule22 },
  { start: 375, length: 1, convRule: rule23 },
  { start: 376, length: 1, convRule: rule26 },
  { start: 377, length: 1, convRule: rule22 },
  { start: 378, length: 1, convRule: rule23 },
  { start: 379, length: 1, convRule: rule22 },
  { start: 380, length: 1, convRule: rule23 },
  { start: 381, length: 1, convRule: rule22 },
  { start: 382, length: 1, convRule: rule23 },
  { start: 383, length: 1, convRule: rule27 },
  { start: 384, length: 1, convRule: rule28 },
  { start: 385, length: 1, convRule: rule29 },
  { start: 386, length: 1, convRule: rule22 },
  { start: 387, length: 1, convRule: rule23 },
  { start: 388, length: 1, convRule: rule22 },
  { start: 389, length: 1, convRule: rule23 },
  { start: 390, length: 1, convRule: rule30 },
  { start: 391, length: 1, convRule: rule22 },
  { start: 392, length: 1, convRule: rule23 },
  { start: 393, length: 2, convRule: rule31 },
  { start: 395, length: 1, convRule: rule22 },
  { start: 396, length: 1, convRule: rule23 },
  { start: 398, length: 1, convRule: rule32 },
  { start: 399, length: 1, convRule: rule33 },
  { start: 400, length: 1, convRule: rule34 },
  { start: 401, length: 1, convRule: rule22 },
  { start: 402, length: 1, convRule: rule23 },
  { start: 403, length: 1, convRule: rule31 },
  { start: 404, length: 1, convRule: rule35 },
  { start: 405, length: 1, convRule: rule36 },
  { start: 406, length: 1, convRule: rule37 },
  { start: 407, length: 1, convRule: rule38 },
  { start: 408, length: 1, convRule: rule22 },
  { start: 409, length: 1, convRule: rule23 },
  { start: 410, length: 1, convRule: rule39 },
  { start: 412, length: 1, convRule: rule37 },
  { start: 413, length: 1, convRule: rule40 },
  { start: 414, length: 1, convRule: rule41 },
  { start: 415, length: 1, convRule: rule42 },
  { start: 416, length: 1, convRule: rule22 },
  { start: 417, length: 1, convRule: rule23 },
  { start: 418, length: 1, convRule: rule22 },
  { start: 419, length: 1, convRule: rule23 },
  { start: 420, length: 1, convRule: rule22 },
  { start: 421, length: 1, convRule: rule23 },
  { start: 422, length: 1, convRule: rule43 },
  { start: 423, length: 1, convRule: rule22 },
  { start: 424, length: 1, convRule: rule23 },
  { start: 425, length: 1, convRule: rule43 },
  { start: 428, length: 1, convRule: rule22 },
  { start: 429, length: 1, convRule: rule23 },
  { start: 430, length: 1, convRule: rule43 },
  { start: 431, length: 1, convRule: rule22 },
  { start: 432, length: 1, convRule: rule23 },
  { start: 433, length: 2, convRule: rule44 },
  { start: 435, length: 1, convRule: rule22 },
  { start: 436, length: 1, convRule: rule23 },
  { start: 437, length: 1, convRule: rule22 },
  { start: 438, length: 1, convRule: rule23 },
  { start: 439, length: 1, convRule: rule45 },
  { start: 440, length: 1, convRule: rule22 },
  { start: 441, length: 1, convRule: rule23 },
  { start: 444, length: 1, convRule: rule22 },
  { start: 445, length: 1, convRule: rule23 },
  { start: 447, length: 1, convRule: rule46 },
  { start: 452, length: 1, convRule: rule47 },
  { start: 453, length: 1, convRule: rule48 },
  { start: 454, length: 1, convRule: rule49 },
  { start: 455, length: 1, convRule: rule47 },
  { start: 456, length: 1, convRule: rule48 },
  { start: 457, length: 1, convRule: rule49 },
  { start: 458, length: 1, convRule: rule47 },
  { start: 459, length: 1, convRule: rule48 },
  { start: 460, length: 1, convRule: rule49 },
  { start: 461, length: 1, convRule: rule22 },
  { start: 462, length: 1, convRule: rule23 },
  { start: 463, length: 1, convRule: rule22 },
  { start: 464, length: 1, convRule: rule23 },
  { start: 465, length: 1, convRule: rule22 },
  { start: 466, length: 1, convRule: rule23 },
  { start: 467, length: 1, convRule: rule22 },
  { start: 468, length: 1, convRule: rule23 },
  { start: 469, length: 1, convRule: rule22 },
  { start: 470, length: 1, convRule: rule23 },
  { start: 471, length: 1, convRule: rule22 },
  { start: 472, length: 1, convRule: rule23 },
  { start: 473, length: 1, convRule: rule22 },
  { start: 474, length: 1, convRule: rule23 },
  { start: 475, length: 1, convRule: rule22 },
  { start: 476, length: 1, convRule: rule23 },
  { start: 477, length: 1, convRule: rule50 },
  { start: 478, length: 1, convRule: rule22 },
  { start: 479, length: 1, convRule: rule23 },
  { start: 480, length: 1, convRule: rule22 },
  { start: 481, length: 1, convRule: rule23 },
  { start: 482, length: 1, convRule: rule22 },
  { start: 483, length: 1, convRule: rule23 },
  { start: 484, length: 1, convRule: rule22 },
  { start: 485, length: 1, convRule: rule23 },
  { start: 486, length: 1, convRule: rule22 },
  { start: 487, length: 1, convRule: rule23 },
  { start: 488, length: 1, convRule: rule22 },
  { start: 489, length: 1, convRule: rule23 },
  { start: 490, length: 1, convRule: rule22 },
  { start: 491, length: 1, convRule: rule23 },
  { start: 492, length: 1, convRule: rule22 },
  { start: 493, length: 1, convRule: rule23 },
  { start: 494, length: 1, convRule: rule22 },
  { start: 495, length: 1, convRule: rule23 },
  { start: 497, length: 1, convRule: rule47 },
  { start: 498, length: 1, convRule: rule48 },
  { start: 499, length: 1, convRule: rule49 },
  { start: 500, length: 1, convRule: rule22 },
  { start: 501, length: 1, convRule: rule23 },
  { start: 502, length: 1, convRule: rule51 },
  { start: 503, length: 1, convRule: rule52 },
  { start: 504, length: 1, convRule: rule22 },
  { start: 505, length: 1, convRule: rule23 },
  { start: 506, length: 1, convRule: rule22 },
  { start: 507, length: 1, convRule: rule23 },
  { start: 508, length: 1, convRule: rule22 },
  { start: 509, length: 1, convRule: rule23 },
  { start: 510, length: 1, convRule: rule22 },
  { start: 511, length: 1, convRule: rule23 },
  { start: 512, length: 1, convRule: rule22 },
  { start: 513, length: 1, convRule: rule23 },
  { start: 514, length: 1, convRule: rule22 },
  { start: 515, length: 1, convRule: rule23 },
  { start: 516, length: 1, convRule: rule22 },
  { start: 517, length: 1, convRule: rule23 },
  { start: 518, length: 1, convRule: rule22 },
  { start: 519, length: 1, convRule: rule23 },
  { start: 520, length: 1, convRule: rule22 },
  { start: 521, length: 1, convRule: rule23 },
  { start: 522, length: 1, convRule: rule22 },
  { start: 523, length: 1, convRule: rule23 },
  { start: 524, length: 1, convRule: rule22 },
  { start: 525, length: 1, convRule: rule23 },
  { start: 526, length: 1, convRule: rule22 },
  { start: 527, length: 1, convRule: rule23 },
  { start: 528, length: 1, convRule: rule22 },
  { start: 529, length: 1, convRule: rule23 },
  { start: 530, length: 1, convRule: rule22 },
  { start: 531, length: 1, convRule: rule23 },
  { start: 532, length: 1, convRule: rule22 },
  { start: 533, length: 1, convRule: rule23 },
  { start: 534, length: 1, convRule: rule22 },
  { start: 535, length: 1, convRule: rule23 },
  { start: 536, length: 1, convRule: rule22 },
  { start: 537, length: 1, convRule: rule23 },
  { start: 538, length: 1, convRule: rule22 },
  { start: 539, length: 1, convRule: rule23 },
  { start: 540, length: 1, convRule: rule22 },
  { start: 541, length: 1, convRule: rule23 },
  { start: 542, length: 1, convRule: rule22 },
  { start: 543, length: 1, convRule: rule23 },
  { start: 544, length: 1, convRule: rule53 },
  { start: 546, length: 1, convRule: rule22 },
  { start: 547, length: 1, convRule: rule23 },
  { start: 548, length: 1, convRule: rule22 },
  { start: 549, length: 1, convRule: rule23 },
  { start: 550, length: 1, convRule: rule22 },
  { start: 551, length: 1, convRule: rule23 },
  { start: 552, length: 1, convRule: rule22 },
  { start: 553, length: 1, convRule: rule23 },
  { start: 554, length: 1, convRule: rule22 },
  { start: 555, length: 1, convRule: rule23 },
  { start: 556, length: 1, convRule: rule22 },
  { start: 557, length: 1, convRule: rule23 },
  { start: 558, length: 1, convRule: rule22 },
  { start: 559, length: 1, convRule: rule23 },
  { start: 560, length: 1, convRule: rule22 },
  { start: 561, length: 1, convRule: rule23 },
  { start: 562, length: 1, convRule: rule22 },
  { start: 563, length: 1, convRule: rule23 },
  { start: 570, length: 1, convRule: rule54 },
  { start: 571, length: 1, convRule: rule22 },
  { start: 572, length: 1, convRule: rule23 },
  { start: 573, length: 1, convRule: rule55 },
  { start: 574, length: 1, convRule: rule56 },
  { start: 575, length: 2, convRule: rule57 },
  { start: 577, length: 1, convRule: rule22 },
  { start: 578, length: 1, convRule: rule23 },
  { start: 579, length: 1, convRule: rule58 },
  { start: 580, length: 1, convRule: rule59 },
  { start: 581, length: 1, convRule: rule60 },
  { start: 582, length: 1, convRule: rule22 },
  { start: 583, length: 1, convRule: rule23 },
  { start: 584, length: 1, convRule: rule22 },
  { start: 585, length: 1, convRule: rule23 },
  { start: 586, length: 1, convRule: rule22 },
  { start: 587, length: 1, convRule: rule23 },
  { start: 588, length: 1, convRule: rule22 },
  { start: 589, length: 1, convRule: rule23 },
  { start: 590, length: 1, convRule: rule22 },
  { start: 591, length: 1, convRule: rule23 },
  { start: 592, length: 1, convRule: rule61 },
  { start: 593, length: 1, convRule: rule62 },
  { start: 594, length: 1, convRule: rule63 },
  { start: 595, length: 1, convRule: rule64 },
  { start: 596, length: 1, convRule: rule65 },
  { start: 598, length: 2, convRule: rule66 },
  { start: 601, length: 1, convRule: rule67 },
  { start: 603, length: 1, convRule: rule68 },
  { start: 604, length: 1, convRule: rule69 },
  { start: 608, length: 1, convRule: rule66 },
  { start: 609, length: 1, convRule: rule70 },
  { start: 611, length: 1, convRule: rule71 },
  { start: 613, length: 1, convRule: rule72 },
  { start: 614, length: 1, convRule: rule73 },
  { start: 616, length: 1, convRule: rule74 },
  { start: 617, length: 1, convRule: rule75 },
  { start: 618, length: 1, convRule: rule73 },
  { start: 619, length: 1, convRule: rule76 },
  { start: 620, length: 1, convRule: rule77 },
  { start: 623, length: 1, convRule: rule75 },
  { start: 625, length: 1, convRule: rule78 },
  { start: 626, length: 1, convRule: rule79 },
  { start: 629, length: 1, convRule: rule80 },
  { start: 637, length: 1, convRule: rule81 },
  { start: 640, length: 1, convRule: rule82 },
  { start: 642, length: 1, convRule: rule83 },
  { start: 643, length: 1, convRule: rule82 },
  { start: 647, length: 1, convRule: rule84 },
  { start: 648, length: 1, convRule: rule82 },
  { start: 649, length: 1, convRule: rule85 },
  { start: 650, length: 2, convRule: rule86 },
  { start: 652, length: 1, convRule: rule87 },
  { start: 658, length: 1, convRule: rule88 },
  { start: 669, length: 1, convRule: rule89 },
  { start: 670, length: 1, convRule: rule90 },
  { start: 837, length: 1, convRule: rule93 },
  { start: 880, length: 1, convRule: rule22 },
  { start: 881, length: 1, convRule: rule23 },
  { start: 882, length: 1, convRule: rule22 },
  { start: 883, length: 1, convRule: rule23 },
  { start: 886, length: 1, convRule: rule22 },
  { start: 887, length: 1, convRule: rule23 },
  { start: 891, length: 3, convRule: rule41 },
  { start: 895, length: 1, convRule: rule94 },
  { start: 902, length: 1, convRule: rule95 },
  { start: 904, length: 3, convRule: rule96 },
  { start: 908, length: 1, convRule: rule97 },
  { start: 910, length: 2, convRule: rule98 },
  { start: 913, length: 17, convRule: rule9 },
  { start: 931, length: 9, convRule: rule9 },
  { start: 940, length: 1, convRule: rule99 },
  { start: 941, length: 3, convRule: rule100 },
  { start: 945, length: 17, convRule: rule12 },
  { start: 962, length: 1, convRule: rule101 },
  { start: 963, length: 9, convRule: rule12 },
  { start: 972, length: 1, convRule: rule102 },
  { start: 973, length: 2, convRule: rule103 },
  { start: 975, length: 1, convRule: rule104 },
  { start: 976, length: 1, convRule: rule105 },
  { start: 977, length: 1, convRule: rule106 },
  { start: 981, length: 1, convRule: rule108 },
  { start: 982, length: 1, convRule: rule109 },
  { start: 983, length: 1, convRule: rule110 },
  { start: 984, length: 1, convRule: rule22 },
  { start: 985, length: 1, convRule: rule23 },
  { start: 986, length: 1, convRule: rule22 },
  { start: 987, length: 1, convRule: rule23 },
  { start: 988, length: 1, convRule: rule22 },
  { start: 989, length: 1, convRule: rule23 },
  { start: 990, length: 1, convRule: rule22 },
  { start: 991, length: 1, convRule: rule23 },
  { start: 992, length: 1, convRule: rule22 },
  { start: 993, length: 1, convRule: rule23 },
  { start: 994, length: 1, convRule: rule22 },
  { start: 995, length: 1, convRule: rule23 },
  { start: 996, length: 1, convRule: rule22 },
  { start: 997, length: 1, convRule: rule23 },
  { start: 998, length: 1, convRule: rule22 },
  { start: 999, length: 1, convRule: rule23 },
  { start: 1e3, length: 1, convRule: rule22 },
  { start: 1001, length: 1, convRule: rule23 },
  { start: 1002, length: 1, convRule: rule22 },
  { start: 1003, length: 1, convRule: rule23 },
  { start: 1004, length: 1, convRule: rule22 },
  { start: 1005, length: 1, convRule: rule23 },
  { start: 1006, length: 1, convRule: rule22 },
  { start: 1007, length: 1, convRule: rule23 },
  { start: 1008, length: 1, convRule: rule111 },
  { start: 1009, length: 1, convRule: rule112 },
  { start: 1010, length: 1, convRule: rule113 },
  { start: 1011, length: 1, convRule: rule114 },
  { start: 1012, length: 1, convRule: rule115 },
  { start: 1013, length: 1, convRule: rule116 },
  { start: 1015, length: 1, convRule: rule22 },
  { start: 1016, length: 1, convRule: rule23 },
  { start: 1017, length: 1, convRule: rule117 },
  { start: 1018, length: 1, convRule: rule22 },
  { start: 1019, length: 1, convRule: rule23 },
  { start: 1021, length: 3, convRule: rule53 },
  { start: 1024, length: 16, convRule: rule118 },
  { start: 1040, length: 32, convRule: rule9 },
  { start: 1072, length: 32, convRule: rule12 },
  { start: 1104, length: 16, convRule: rule112 },
  { start: 1120, length: 1, convRule: rule22 },
  { start: 1121, length: 1, convRule: rule23 },
  { start: 1122, length: 1, convRule: rule22 },
  { start: 1123, length: 1, convRule: rule23 },
  { start: 1124, length: 1, convRule: rule22 },
  { start: 1125, length: 1, convRule: rule23 },
  { start: 1126, length: 1, convRule: rule22 },
  { start: 1127, length: 1, convRule: rule23 },
  { start: 1128, length: 1, convRule: rule22 },
  { start: 1129, length: 1, convRule: rule23 },
  { start: 1130, length: 1, convRule: rule22 },
  { start: 1131, length: 1, convRule: rule23 },
  { start: 1132, length: 1, convRule: rule22 },
  { start: 1133, length: 1, convRule: rule23 },
  { start: 1134, length: 1, convRule: rule22 },
  { start: 1135, length: 1, convRule: rule23 },
  { start: 1136, length: 1, convRule: rule22 },
  { start: 1137, length: 1, convRule: rule23 },
  { start: 1138, length: 1, convRule: rule22 },
  { start: 1139, length: 1, convRule: rule23 },
  { start: 1140, length: 1, convRule: rule22 },
  { start: 1141, length: 1, convRule: rule23 },
  { start: 1142, length: 1, convRule: rule22 },
  { start: 1143, length: 1, convRule: rule23 },
  { start: 1144, length: 1, convRule: rule22 },
  { start: 1145, length: 1, convRule: rule23 },
  { start: 1146, length: 1, convRule: rule22 },
  { start: 1147, length: 1, convRule: rule23 },
  { start: 1148, length: 1, convRule: rule22 },
  { start: 1149, length: 1, convRule: rule23 },
  { start: 1150, length: 1, convRule: rule22 },
  { start: 1151, length: 1, convRule: rule23 },
  { start: 1152, length: 1, convRule: rule22 },
  { start: 1153, length: 1, convRule: rule23 },
  { start: 1162, length: 1, convRule: rule22 },
  { start: 1163, length: 1, convRule: rule23 },
  { start: 1164, length: 1, convRule: rule22 },
  { start: 1165, length: 1, convRule: rule23 },
  { start: 1166, length: 1, convRule: rule22 },
  { start: 1167, length: 1, convRule: rule23 },
  { start: 1168, length: 1, convRule: rule22 },
  { start: 1169, length: 1, convRule: rule23 },
  { start: 1170, length: 1, convRule: rule22 },
  { start: 1171, length: 1, convRule: rule23 },
  { start: 1172, length: 1, convRule: rule22 },
  { start: 1173, length: 1, convRule: rule23 },
  { start: 1174, length: 1, convRule: rule22 },
  { start: 1175, length: 1, convRule: rule23 },
  { start: 1176, length: 1, convRule: rule22 },
  { start: 1177, length: 1, convRule: rule23 },
  { start: 1178, length: 1, convRule: rule22 },
  { start: 1179, length: 1, convRule: rule23 },
  { start: 1180, length: 1, convRule: rule22 },
  { start: 1181, length: 1, convRule: rule23 },
  { start: 1182, length: 1, convRule: rule22 },
  { start: 1183, length: 1, convRule: rule23 },
  { start: 1184, length: 1, convRule: rule22 },
  { start: 1185, length: 1, convRule: rule23 },
  { start: 1186, length: 1, convRule: rule22 },
  { start: 1187, length: 1, convRule: rule23 },
  { start: 1188, length: 1, convRule: rule22 },
  { start: 1189, length: 1, convRule: rule23 },
  { start: 1190, length: 1, convRule: rule22 },
  { start: 1191, length: 1, convRule: rule23 },
  { start: 1192, length: 1, convRule: rule22 },
  { start: 1193, length: 1, convRule: rule23 },
  { start: 1194, length: 1, convRule: rule22 },
  { start: 1195, length: 1, convRule: rule23 },
  { start: 1196, length: 1, convRule: rule22 },
  { start: 1197, length: 1, convRule: rule23 },
  { start: 1198, length: 1, convRule: rule22 },
  { start: 1199, length: 1, convRule: rule23 },
  { start: 1200, length: 1, convRule: rule22 },
  { start: 1201, length: 1, convRule: rule23 },
  { start: 1202, length: 1, convRule: rule22 },
  { start: 1203, length: 1, convRule: rule23 },
  { start: 1204, length: 1, convRule: rule22 },
  { start: 1205, length: 1, convRule: rule23 },
  { start: 1206, length: 1, convRule: rule22 },
  { start: 1207, length: 1, convRule: rule23 },
  { start: 1208, length: 1, convRule: rule22 },
  { start: 1209, length: 1, convRule: rule23 },
  { start: 1210, length: 1, convRule: rule22 },
  { start: 1211, length: 1, convRule: rule23 },
  { start: 1212, length: 1, convRule: rule22 },
  { start: 1213, length: 1, convRule: rule23 },
  { start: 1214, length: 1, convRule: rule22 },
  { start: 1215, length: 1, convRule: rule23 },
  { start: 1216, length: 1, convRule: rule120 },
  { start: 1217, length: 1, convRule: rule22 },
  { start: 1218, length: 1, convRule: rule23 },
  { start: 1219, length: 1, convRule: rule22 },
  { start: 1220, length: 1, convRule: rule23 },
  { start: 1221, length: 1, convRule: rule22 },
  { start: 1222, length: 1, convRule: rule23 },
  { start: 1223, length: 1, convRule: rule22 },
  { start: 1224, length: 1, convRule: rule23 },
  { start: 1225, length: 1, convRule: rule22 },
  { start: 1226, length: 1, convRule: rule23 },
  { start: 1227, length: 1, convRule: rule22 },
  { start: 1228, length: 1, convRule: rule23 },
  { start: 1229, length: 1, convRule: rule22 },
  { start: 1230, length: 1, convRule: rule23 },
  { start: 1231, length: 1, convRule: rule121 },
  { start: 1232, length: 1, convRule: rule22 },
  { start: 1233, length: 1, convRule: rule23 },
  { start: 1234, length: 1, convRule: rule22 },
  { start: 1235, length: 1, convRule: rule23 },
  { start: 1236, length: 1, convRule: rule22 },
  { start: 1237, length: 1, convRule: rule23 },
  { start: 1238, length: 1, convRule: rule22 },
  { start: 1239, length: 1, convRule: rule23 },
  { start: 1240, length: 1, convRule: rule22 },
  { start: 1241, length: 1, convRule: rule23 },
  { start: 1242, length: 1, convRule: rule22 },
  { start: 1243, length: 1, convRule: rule23 },
  { start: 1244, length: 1, convRule: rule22 },
  { start: 1245, length: 1, convRule: rule23 },
  { start: 1246, length: 1, convRule: rule22 },
  { start: 1247, length: 1, convRule: rule23 },
  { start: 1248, length: 1, convRule: rule22 },
  { start: 1249, length: 1, convRule: rule23 },
  { start: 1250, length: 1, convRule: rule22 },
  { start: 1251, length: 1, convRule: rule23 },
  { start: 1252, length: 1, convRule: rule22 },
  { start: 1253, length: 1, convRule: rule23 },
  { start: 1254, length: 1, convRule: rule22 },
  { start: 1255, length: 1, convRule: rule23 },
  { start: 1256, length: 1, convRule: rule22 },
  { start: 1257, length: 1, convRule: rule23 },
  { start: 1258, length: 1, convRule: rule22 },
  { start: 1259, length: 1, convRule: rule23 },
  { start: 1260, length: 1, convRule: rule22 },
  { start: 1261, length: 1, convRule: rule23 },
  { start: 1262, length: 1, convRule: rule22 },
  { start: 1263, length: 1, convRule: rule23 },
  { start: 1264, length: 1, convRule: rule22 },
  { start: 1265, length: 1, convRule: rule23 },
  { start: 1266, length: 1, convRule: rule22 },
  { start: 1267, length: 1, convRule: rule23 },
  { start: 1268, length: 1, convRule: rule22 },
  { start: 1269, length: 1, convRule: rule23 },
  { start: 1270, length: 1, convRule: rule22 },
  { start: 1271, length: 1, convRule: rule23 },
  { start: 1272, length: 1, convRule: rule22 },
  { start: 1273, length: 1, convRule: rule23 },
  { start: 1274, length: 1, convRule: rule22 },
  { start: 1275, length: 1, convRule: rule23 },
  { start: 1276, length: 1, convRule: rule22 },
  { start: 1277, length: 1, convRule: rule23 },
  { start: 1278, length: 1, convRule: rule22 },
  { start: 1279, length: 1, convRule: rule23 },
  { start: 1280, length: 1, convRule: rule22 },
  { start: 1281, length: 1, convRule: rule23 },
  { start: 1282, length: 1, convRule: rule22 },
  { start: 1283, length: 1, convRule: rule23 },
  { start: 1284, length: 1, convRule: rule22 },
  { start: 1285, length: 1, convRule: rule23 },
  { start: 1286, length: 1, convRule: rule22 },
  { start: 1287, length: 1, convRule: rule23 },
  { start: 1288, length: 1, convRule: rule22 },
  { start: 1289, length: 1, convRule: rule23 },
  { start: 1290, length: 1, convRule: rule22 },
  { start: 1291, length: 1, convRule: rule23 },
  { start: 1292, length: 1, convRule: rule22 },
  { start: 1293, length: 1, convRule: rule23 },
  { start: 1294, length: 1, convRule: rule22 },
  { start: 1295, length: 1, convRule: rule23 },
  { start: 1296, length: 1, convRule: rule22 },
  { start: 1297, length: 1, convRule: rule23 },
  { start: 1298, length: 1, convRule: rule22 },
  { start: 1299, length: 1, convRule: rule23 },
  { start: 1300, length: 1, convRule: rule22 },
  { start: 1301, length: 1, convRule: rule23 },
  { start: 1302, length: 1, convRule: rule22 },
  { start: 1303, length: 1, convRule: rule23 },
  { start: 1304, length: 1, convRule: rule22 },
  { start: 1305, length: 1, convRule: rule23 },
  { start: 1306, length: 1, convRule: rule22 },
  { start: 1307, length: 1, convRule: rule23 },
  { start: 1308, length: 1, convRule: rule22 },
  { start: 1309, length: 1, convRule: rule23 },
  { start: 1310, length: 1, convRule: rule22 },
  { start: 1311, length: 1, convRule: rule23 },
  { start: 1312, length: 1, convRule: rule22 },
  { start: 1313, length: 1, convRule: rule23 },
  { start: 1314, length: 1, convRule: rule22 },
  { start: 1315, length: 1, convRule: rule23 },
  { start: 1316, length: 1, convRule: rule22 },
  { start: 1317, length: 1, convRule: rule23 },
  { start: 1318, length: 1, convRule: rule22 },
  { start: 1319, length: 1, convRule: rule23 },
  { start: 1320, length: 1, convRule: rule22 },
  { start: 1321, length: 1, convRule: rule23 },
  { start: 1322, length: 1, convRule: rule22 },
  { start: 1323, length: 1, convRule: rule23 },
  { start: 1324, length: 1, convRule: rule22 },
  { start: 1325, length: 1, convRule: rule23 },
  { start: 1326, length: 1, convRule: rule22 },
  { start: 1327, length: 1, convRule: rule23 },
  { start: 1329, length: 38, convRule: rule122 },
  { start: 1377, length: 38, convRule: rule123 },
  { start: 4256, length: 38, convRule: rule125 },
  { start: 4295, length: 1, convRule: rule125 },
  { start: 4301, length: 1, convRule: rule125 },
  { start: 4304, length: 43, convRule: rule126 },
  { start: 4349, length: 3, convRule: rule126 },
  { start: 5024, length: 80, convRule: rule127 },
  { start: 5104, length: 6, convRule: rule104 },
  { start: 5112, length: 6, convRule: rule110 },
  { start: 7296, length: 1, convRule: rule129 },
  { start: 7297, length: 1, convRule: rule130 },
  { start: 7298, length: 1, convRule: rule131 },
  { start: 7299, length: 2, convRule: rule132 },
  { start: 7301, length: 1, convRule: rule133 },
  { start: 7302, length: 1, convRule: rule134 },
  { start: 7303, length: 1, convRule: rule135 },
  { start: 7304, length: 1, convRule: rule136 },
  { start: 7312, length: 43, convRule: rule137 },
  { start: 7357, length: 3, convRule: rule137 },
  { start: 7545, length: 1, convRule: rule138 },
  { start: 7549, length: 1, convRule: rule139 },
  { start: 7566, length: 1, convRule: rule140 },
  { start: 7680, length: 1, convRule: rule22 },
  { start: 7681, length: 1, convRule: rule23 },
  { start: 7682, length: 1, convRule: rule22 },
  { start: 7683, length: 1, convRule: rule23 },
  { start: 7684, length: 1, convRule: rule22 },
  { start: 7685, length: 1, convRule: rule23 },
  { start: 7686, length: 1, convRule: rule22 },
  { start: 7687, length: 1, convRule: rule23 },
  { start: 7688, length: 1, convRule: rule22 },
  { start: 7689, length: 1, convRule: rule23 },
  { start: 7690, length: 1, convRule: rule22 },
  { start: 7691, length: 1, convRule: rule23 },
  { start: 7692, length: 1, convRule: rule22 },
  { start: 7693, length: 1, convRule: rule23 },
  { start: 7694, length: 1, convRule: rule22 },
  { start: 7695, length: 1, convRule: rule23 },
  { start: 7696, length: 1, convRule: rule22 },
  { start: 7697, length: 1, convRule: rule23 },
  { start: 7698, length: 1, convRule: rule22 },
  { start: 7699, length: 1, convRule: rule23 },
  { start: 7700, length: 1, convRule: rule22 },
  { start: 7701, length: 1, convRule: rule23 },
  { start: 7702, length: 1, convRule: rule22 },
  { start: 7703, length: 1, convRule: rule23 },
  { start: 7704, length: 1, convRule: rule22 },
  { start: 7705, length: 1, convRule: rule23 },
  { start: 7706, length: 1, convRule: rule22 },
  { start: 7707, length: 1, convRule: rule23 },
  { start: 7708, length: 1, convRule: rule22 },
  { start: 7709, length: 1, convRule: rule23 },
  { start: 7710, length: 1, convRule: rule22 },
  { start: 7711, length: 1, convRule: rule23 },
  { start: 7712, length: 1, convRule: rule22 },
  { start: 7713, length: 1, convRule: rule23 },
  { start: 7714, length: 1, convRule: rule22 },
  { start: 7715, length: 1, convRule: rule23 },
  { start: 7716, length: 1, convRule: rule22 },
  { start: 7717, length: 1, convRule: rule23 },
  { start: 7718, length: 1, convRule: rule22 },
  { start: 7719, length: 1, convRule: rule23 },
  { start: 7720, length: 1, convRule: rule22 },
  { start: 7721, length: 1, convRule: rule23 },
  { start: 7722, length: 1, convRule: rule22 },
  { start: 7723, length: 1, convRule: rule23 },
  { start: 7724, length: 1, convRule: rule22 },
  { start: 7725, length: 1, convRule: rule23 },
  { start: 7726, length: 1, convRule: rule22 },
  { start: 7727, length: 1, convRule: rule23 },
  { start: 7728, length: 1, convRule: rule22 },
  { start: 7729, length: 1, convRule: rule23 },
  { start: 7730, length: 1, convRule: rule22 },
  { start: 7731, length: 1, convRule: rule23 },
  { start: 7732, length: 1, convRule: rule22 },
  { start: 7733, length: 1, convRule: rule23 },
  { start: 7734, length: 1, convRule: rule22 },
  { start: 7735, length: 1, convRule: rule23 },
  { start: 7736, length: 1, convRule: rule22 },
  { start: 7737, length: 1, convRule: rule23 },
  { start: 7738, length: 1, convRule: rule22 },
  { start: 7739, length: 1, convRule: rule23 },
  { start: 7740, length: 1, convRule: rule22 },
  { start: 7741, length: 1, convRule: rule23 },
  { start: 7742, length: 1, convRule: rule22 },
  { start: 7743, length: 1, convRule: rule23 },
  { start: 7744, length: 1, convRule: rule22 },
  { start: 7745, length: 1, convRule: rule23 },
  { start: 7746, length: 1, convRule: rule22 },
  { start: 7747, length: 1, convRule: rule23 },
  { start: 7748, length: 1, convRule: rule22 },
  { start: 7749, length: 1, convRule: rule23 },
  { start: 7750, length: 1, convRule: rule22 },
  { start: 7751, length: 1, convRule: rule23 },
  { start: 7752, length: 1, convRule: rule22 },
  { start: 7753, length: 1, convRule: rule23 },
  { start: 7754, length: 1, convRule: rule22 },
  { start: 7755, length: 1, convRule: rule23 },
  { start: 7756, length: 1, convRule: rule22 },
  { start: 7757, length: 1, convRule: rule23 },
  { start: 7758, length: 1, convRule: rule22 },
  { start: 7759, length: 1, convRule: rule23 },
  { start: 7760, length: 1, convRule: rule22 },
  { start: 7761, length: 1, convRule: rule23 },
  { start: 7762, length: 1, convRule: rule22 },
  { start: 7763, length: 1, convRule: rule23 },
  { start: 7764, length: 1, convRule: rule22 },
  { start: 7765, length: 1, convRule: rule23 },
  { start: 7766, length: 1, convRule: rule22 },
  { start: 7767, length: 1, convRule: rule23 },
  { start: 7768, length: 1, convRule: rule22 },
  { start: 7769, length: 1, convRule: rule23 },
  { start: 7770, length: 1, convRule: rule22 },
  { start: 7771, length: 1, convRule: rule23 },
  { start: 7772, length: 1, convRule: rule22 },
  { start: 7773, length: 1, convRule: rule23 },
  { start: 7774, length: 1, convRule: rule22 },
  { start: 7775, length: 1, convRule: rule23 },
  { start: 7776, length: 1, convRule: rule22 },
  { start: 7777, length: 1, convRule: rule23 },
  { start: 7778, length: 1, convRule: rule22 },
  { start: 7779, length: 1, convRule: rule23 },
  { start: 7780, length: 1, convRule: rule22 },
  { start: 7781, length: 1, convRule: rule23 },
  { start: 7782, length: 1, convRule: rule22 },
  { start: 7783, length: 1, convRule: rule23 },
  { start: 7784, length: 1, convRule: rule22 },
  { start: 7785, length: 1, convRule: rule23 },
  { start: 7786, length: 1, convRule: rule22 },
  { start: 7787, length: 1, convRule: rule23 },
  { start: 7788, length: 1, convRule: rule22 },
  { start: 7789, length: 1, convRule: rule23 },
  { start: 7790, length: 1, convRule: rule22 },
  { start: 7791, length: 1, convRule: rule23 },
  { start: 7792, length: 1, convRule: rule22 },
  { start: 7793, length: 1, convRule: rule23 },
  { start: 7794, length: 1, convRule: rule22 },
  { start: 7795, length: 1, convRule: rule23 },
  { start: 7796, length: 1, convRule: rule22 },
  { start: 7797, length: 1, convRule: rule23 },
  { start: 7798, length: 1, convRule: rule22 },
  { start: 7799, length: 1, convRule: rule23 },
  { start: 7800, length: 1, convRule: rule22 },
  { start: 7801, length: 1, convRule: rule23 },
  { start: 7802, length: 1, convRule: rule22 },
  { start: 7803, length: 1, convRule: rule23 },
  { start: 7804, length: 1, convRule: rule22 },
  { start: 7805, length: 1, convRule: rule23 },
  { start: 7806, length: 1, convRule: rule22 },
  { start: 7807, length: 1, convRule: rule23 },
  { start: 7808, length: 1, convRule: rule22 },
  { start: 7809, length: 1, convRule: rule23 },
  { start: 7810, length: 1, convRule: rule22 },
  { start: 7811, length: 1, convRule: rule23 },
  { start: 7812, length: 1, convRule: rule22 },
  { start: 7813, length: 1, convRule: rule23 },
  { start: 7814, length: 1, convRule: rule22 },
  { start: 7815, length: 1, convRule: rule23 },
  { start: 7816, length: 1, convRule: rule22 },
  { start: 7817, length: 1, convRule: rule23 },
  { start: 7818, length: 1, convRule: rule22 },
  { start: 7819, length: 1, convRule: rule23 },
  { start: 7820, length: 1, convRule: rule22 },
  { start: 7821, length: 1, convRule: rule23 },
  { start: 7822, length: 1, convRule: rule22 },
  { start: 7823, length: 1, convRule: rule23 },
  { start: 7824, length: 1, convRule: rule22 },
  { start: 7825, length: 1, convRule: rule23 },
  { start: 7826, length: 1, convRule: rule22 },
  { start: 7827, length: 1, convRule: rule23 },
  { start: 7828, length: 1, convRule: rule22 },
  { start: 7829, length: 1, convRule: rule23 },
  { start: 7835, length: 1, convRule: rule141 },
  { start: 7838, length: 1, convRule: rule142 },
  { start: 7840, length: 1, convRule: rule22 },
  { start: 7841, length: 1, convRule: rule23 },
  { start: 7842, length: 1, convRule: rule22 },
  { start: 7843, length: 1, convRule: rule23 },
  { start: 7844, length: 1, convRule: rule22 },
  { start: 7845, length: 1, convRule: rule23 },
  { start: 7846, length: 1, convRule: rule22 },
  { start: 7847, length: 1, convRule: rule23 },
  { start: 7848, length: 1, convRule: rule22 },
  { start: 7849, length: 1, convRule: rule23 },
  { start: 7850, length: 1, convRule: rule22 },
  { start: 7851, length: 1, convRule: rule23 },
  { start: 7852, length: 1, convRule: rule22 },
  { start: 7853, length: 1, convRule: rule23 },
  { start: 7854, length: 1, convRule: rule22 },
  { start: 7855, length: 1, convRule: rule23 },
  { start: 7856, length: 1, convRule: rule22 },
  { start: 7857, length: 1, convRule: rule23 },
  { start: 7858, length: 1, convRule: rule22 },
  { start: 7859, length: 1, convRule: rule23 },
  { start: 7860, length: 1, convRule: rule22 },
  { start: 7861, length: 1, convRule: rule23 },
  { start: 7862, length: 1, convRule: rule22 },
  { start: 7863, length: 1, convRule: rule23 },
  { start: 7864, length: 1, convRule: rule22 },
  { start: 7865, length: 1, convRule: rule23 },
  { start: 7866, length: 1, convRule: rule22 },
  { start: 7867, length: 1, convRule: rule23 },
  { start: 7868, length: 1, convRule: rule22 },
  { start: 7869, length: 1, convRule: rule23 },
  { start: 7870, length: 1, convRule: rule22 },
  { start: 7871, length: 1, convRule: rule23 },
  { start: 7872, length: 1, convRule: rule22 },
  { start: 7873, length: 1, convRule: rule23 },
  { start: 7874, length: 1, convRule: rule22 },
  { start: 7875, length: 1, convRule: rule23 },
  { start: 7876, length: 1, convRule: rule22 },
  { start: 7877, length: 1, convRule: rule23 },
  { start: 7878, length: 1, convRule: rule22 },
  { start: 7879, length: 1, convRule: rule23 },
  { start: 7880, length: 1, convRule: rule22 },
  { start: 7881, length: 1, convRule: rule23 },
  { start: 7882, length: 1, convRule: rule22 },
  { start: 7883, length: 1, convRule: rule23 },
  { start: 7884, length: 1, convRule: rule22 },
  { start: 7885, length: 1, convRule: rule23 },
  { start: 7886, length: 1, convRule: rule22 },
  { start: 7887, length: 1, convRule: rule23 },
  { start: 7888, length: 1, convRule: rule22 },
  { start: 7889, length: 1, convRule: rule23 },
  { start: 7890, length: 1, convRule: rule22 },
  { start: 7891, length: 1, convRule: rule23 },
  { start: 7892, length: 1, convRule: rule22 },
  { start: 7893, length: 1, convRule: rule23 },
  { start: 7894, length: 1, convRule: rule22 },
  { start: 7895, length: 1, convRule: rule23 },
  { start: 7896, length: 1, convRule: rule22 },
  { start: 7897, length: 1, convRule: rule23 },
  { start: 7898, length: 1, convRule: rule22 },
  { start: 7899, length: 1, convRule: rule23 },
  { start: 7900, length: 1, convRule: rule22 },
  { start: 7901, length: 1, convRule: rule23 },
  { start: 7902, length: 1, convRule: rule22 },
  { start: 7903, length: 1, convRule: rule23 },
  { start: 7904, length: 1, convRule: rule22 },
  { start: 7905, length: 1, convRule: rule23 },
  { start: 7906, length: 1, convRule: rule22 },
  { start: 7907, length: 1, convRule: rule23 },
  { start: 7908, length: 1, convRule: rule22 },
  { start: 7909, length: 1, convRule: rule23 },
  { start: 7910, length: 1, convRule: rule22 },
  { start: 7911, length: 1, convRule: rule23 },
  { start: 7912, length: 1, convRule: rule22 },
  { start: 7913, length: 1, convRule: rule23 },
  { start: 7914, length: 1, convRule: rule22 },
  { start: 7915, length: 1, convRule: rule23 },
  { start: 7916, length: 1, convRule: rule22 },
  { start: 7917, length: 1, convRule: rule23 },
  { start: 7918, length: 1, convRule: rule22 },
  { start: 7919, length: 1, convRule: rule23 },
  { start: 7920, length: 1, convRule: rule22 },
  { start: 7921, length: 1, convRule: rule23 },
  { start: 7922, length: 1, convRule: rule22 },
  { start: 7923, length: 1, convRule: rule23 },
  { start: 7924, length: 1, convRule: rule22 },
  { start: 7925, length: 1, convRule: rule23 },
  { start: 7926, length: 1, convRule: rule22 },
  { start: 7927, length: 1, convRule: rule23 },
  { start: 7928, length: 1, convRule: rule22 },
  { start: 7929, length: 1, convRule: rule23 },
  { start: 7930, length: 1, convRule: rule22 },
  { start: 7931, length: 1, convRule: rule23 },
  { start: 7932, length: 1, convRule: rule22 },
  { start: 7933, length: 1, convRule: rule23 },
  { start: 7934, length: 1, convRule: rule22 },
  { start: 7935, length: 1, convRule: rule23 },
  { start: 7936, length: 8, convRule: rule143 },
  { start: 7944, length: 8, convRule: rule144 },
  { start: 7952, length: 6, convRule: rule143 },
  { start: 7960, length: 6, convRule: rule144 },
  { start: 7968, length: 8, convRule: rule143 },
  { start: 7976, length: 8, convRule: rule144 },
  { start: 7984, length: 8, convRule: rule143 },
  { start: 7992, length: 8, convRule: rule144 },
  { start: 8e3, length: 6, convRule: rule143 },
  { start: 8008, length: 6, convRule: rule144 },
  { start: 8017, length: 1, convRule: rule143 },
  { start: 8019, length: 1, convRule: rule143 },
  { start: 8021, length: 1, convRule: rule143 },
  { start: 8023, length: 1, convRule: rule143 },
  { start: 8025, length: 1, convRule: rule144 },
  { start: 8027, length: 1, convRule: rule144 },
  { start: 8029, length: 1, convRule: rule144 },
  { start: 8031, length: 1, convRule: rule144 },
  { start: 8032, length: 8, convRule: rule143 },
  { start: 8040, length: 8, convRule: rule144 },
  { start: 8048, length: 2, convRule: rule145 },
  { start: 8050, length: 4, convRule: rule146 },
  { start: 8054, length: 2, convRule: rule147 },
  { start: 8056, length: 2, convRule: rule148 },
  { start: 8058, length: 2, convRule: rule149 },
  { start: 8060, length: 2, convRule: rule150 },
  { start: 8064, length: 8, convRule: rule143 },
  { start: 8072, length: 8, convRule: rule151 },
  { start: 8080, length: 8, convRule: rule143 },
  { start: 8088, length: 8, convRule: rule151 },
  { start: 8096, length: 8, convRule: rule143 },
  { start: 8104, length: 8, convRule: rule151 },
  { start: 8112, length: 2, convRule: rule143 },
  { start: 8115, length: 1, convRule: rule152 },
  { start: 8120, length: 2, convRule: rule144 },
  { start: 8122, length: 2, convRule: rule153 },
  { start: 8124, length: 1, convRule: rule154 },
  { start: 8126, length: 1, convRule: rule155 },
  { start: 8131, length: 1, convRule: rule152 },
  { start: 8136, length: 4, convRule: rule156 },
  { start: 8140, length: 1, convRule: rule154 },
  { start: 8144, length: 2, convRule: rule143 },
  { start: 8152, length: 2, convRule: rule144 },
  { start: 8154, length: 2, convRule: rule157 },
  { start: 8160, length: 2, convRule: rule143 },
  { start: 8165, length: 1, convRule: rule113 },
  { start: 8168, length: 2, convRule: rule144 },
  { start: 8170, length: 2, convRule: rule158 },
  { start: 8172, length: 1, convRule: rule117 },
  { start: 8179, length: 1, convRule: rule152 },
  { start: 8184, length: 2, convRule: rule159 },
  { start: 8186, length: 2, convRule: rule160 },
  { start: 8188, length: 1, convRule: rule154 },
  { start: 8486, length: 1, convRule: rule163 },
  { start: 8490, length: 1, convRule: rule164 },
  { start: 8491, length: 1, convRule: rule165 },
  { start: 8498, length: 1, convRule: rule166 },
  { start: 8526, length: 1, convRule: rule167 },
  { start: 8544, length: 16, convRule: rule168 },
  { start: 8560, length: 16, convRule: rule169 },
  { start: 8579, length: 1, convRule: rule22 },
  { start: 8580, length: 1, convRule: rule23 },
  { start: 9398, length: 26, convRule: rule170 },
  { start: 9424, length: 26, convRule: rule171 },
  { start: 11264, length: 47, convRule: rule122 },
  { start: 11312, length: 47, convRule: rule123 },
  { start: 11360, length: 1, convRule: rule22 },
  { start: 11361, length: 1, convRule: rule23 },
  { start: 11362, length: 1, convRule: rule172 },
  { start: 11363, length: 1, convRule: rule173 },
  { start: 11364, length: 1, convRule: rule174 },
  { start: 11365, length: 1, convRule: rule175 },
  { start: 11366, length: 1, convRule: rule176 },
  { start: 11367, length: 1, convRule: rule22 },
  { start: 11368, length: 1, convRule: rule23 },
  { start: 11369, length: 1, convRule: rule22 },
  { start: 11370, length: 1, convRule: rule23 },
  { start: 11371, length: 1, convRule: rule22 },
  { start: 11372, length: 1, convRule: rule23 },
  { start: 11373, length: 1, convRule: rule177 },
  { start: 11374, length: 1, convRule: rule178 },
  { start: 11375, length: 1, convRule: rule179 },
  { start: 11376, length: 1, convRule: rule180 },
  { start: 11378, length: 1, convRule: rule22 },
  { start: 11379, length: 1, convRule: rule23 },
  { start: 11381, length: 1, convRule: rule22 },
  { start: 11382, length: 1, convRule: rule23 },
  { start: 11390, length: 2, convRule: rule181 },
  { start: 11392, length: 1, convRule: rule22 },
  { start: 11393, length: 1, convRule: rule23 },
  { start: 11394, length: 1, convRule: rule22 },
  { start: 11395, length: 1, convRule: rule23 },
  { start: 11396, length: 1, convRule: rule22 },
  { start: 11397, length: 1, convRule: rule23 },
  { start: 11398, length: 1, convRule: rule22 },
  { start: 11399, length: 1, convRule: rule23 },
  { start: 11400, length: 1, convRule: rule22 },
  { start: 11401, length: 1, convRule: rule23 },
  { start: 11402, length: 1, convRule: rule22 },
  { start: 11403, length: 1, convRule: rule23 },
  { start: 11404, length: 1, convRule: rule22 },
  { start: 11405, length: 1, convRule: rule23 },
  { start: 11406, length: 1, convRule: rule22 },
  { start: 11407, length: 1, convRule: rule23 },
  { start: 11408, length: 1, convRule: rule22 },
  { start: 11409, length: 1, convRule: rule23 },
  { start: 11410, length: 1, convRule: rule22 },
  { start: 11411, length: 1, convRule: rule23 },
  { start: 11412, length: 1, convRule: rule22 },
  { start: 11413, length: 1, convRule: rule23 },
  { start: 11414, length: 1, convRule: rule22 },
  { start: 11415, length: 1, convRule: rule23 },
  { start: 11416, length: 1, convRule: rule22 },
  { start: 11417, length: 1, convRule: rule23 },
  { start: 11418, length: 1, convRule: rule22 },
  { start: 11419, length: 1, convRule: rule23 },
  { start: 11420, length: 1, convRule: rule22 },
  { start: 11421, length: 1, convRule: rule23 },
  { start: 11422, length: 1, convRule: rule22 },
  { start: 11423, length: 1, convRule: rule23 },
  { start: 11424, length: 1, convRule: rule22 },
  { start: 11425, length: 1, convRule: rule23 },
  { start: 11426, length: 1, convRule: rule22 },
  { start: 11427, length: 1, convRule: rule23 },
  { start: 11428, length: 1, convRule: rule22 },
  { start: 11429, length: 1, convRule: rule23 },
  { start: 11430, length: 1, convRule: rule22 },
  { start: 11431, length: 1, convRule: rule23 },
  { start: 11432, length: 1, convRule: rule22 },
  { start: 11433, length: 1, convRule: rule23 },
  { start: 11434, length: 1, convRule: rule22 },
  { start: 11435, length: 1, convRule: rule23 },
  { start: 11436, length: 1, convRule: rule22 },
  { start: 11437, length: 1, convRule: rule23 },
  { start: 11438, length: 1, convRule: rule22 },
  { start: 11439, length: 1, convRule: rule23 },
  { start: 11440, length: 1, convRule: rule22 },
  { start: 11441, length: 1, convRule: rule23 },
  { start: 11442, length: 1, convRule: rule22 },
  { start: 11443, length: 1, convRule: rule23 },
  { start: 11444, length: 1, convRule: rule22 },
  { start: 11445, length: 1, convRule: rule23 },
  { start: 11446, length: 1, convRule: rule22 },
  { start: 11447, length: 1, convRule: rule23 },
  { start: 11448, length: 1, convRule: rule22 },
  { start: 11449, length: 1, convRule: rule23 },
  { start: 11450, length: 1, convRule: rule22 },
  { start: 11451, length: 1, convRule: rule23 },
  { start: 11452, length: 1, convRule: rule22 },
  { start: 11453, length: 1, convRule: rule23 },
  { start: 11454, length: 1, convRule: rule22 },
  { start: 11455, length: 1, convRule: rule23 },
  { start: 11456, length: 1, convRule: rule22 },
  { start: 11457, length: 1, convRule: rule23 },
  { start: 11458, length: 1, convRule: rule22 },
  { start: 11459, length: 1, convRule: rule23 },
  { start: 11460, length: 1, convRule: rule22 },
  { start: 11461, length: 1, convRule: rule23 },
  { start: 11462, length: 1, convRule: rule22 },
  { start: 11463, length: 1, convRule: rule23 },
  { start: 11464, length: 1, convRule: rule22 },
  { start: 11465, length: 1, convRule: rule23 },
  { start: 11466, length: 1, convRule: rule22 },
  { start: 11467, length: 1, convRule: rule23 },
  { start: 11468, length: 1, convRule: rule22 },
  { start: 11469, length: 1, convRule: rule23 },
  { start: 11470, length: 1, convRule: rule22 },
  { start: 11471, length: 1, convRule: rule23 },
  { start: 11472, length: 1, convRule: rule22 },
  { start: 11473, length: 1, convRule: rule23 },
  { start: 11474, length: 1, convRule: rule22 },
  { start: 11475, length: 1, convRule: rule23 },
  { start: 11476, length: 1, convRule: rule22 },
  { start: 11477, length: 1, convRule: rule23 },
  { start: 11478, length: 1, convRule: rule22 },
  { start: 11479, length: 1, convRule: rule23 },
  { start: 11480, length: 1, convRule: rule22 },
  { start: 11481, length: 1, convRule: rule23 },
  { start: 11482, length: 1, convRule: rule22 },
  { start: 11483, length: 1, convRule: rule23 },
  { start: 11484, length: 1, convRule: rule22 },
  { start: 11485, length: 1, convRule: rule23 },
  { start: 11486, length: 1, convRule: rule22 },
  { start: 11487, length: 1, convRule: rule23 },
  { start: 11488, length: 1, convRule: rule22 },
  { start: 11489, length: 1, convRule: rule23 },
  { start: 11490, length: 1, convRule: rule22 },
  { start: 11491, length: 1, convRule: rule23 },
  { start: 11499, length: 1, convRule: rule22 },
  { start: 11500, length: 1, convRule: rule23 },
  { start: 11501, length: 1, convRule: rule22 },
  { start: 11502, length: 1, convRule: rule23 },
  { start: 11506, length: 1, convRule: rule22 },
  { start: 11507, length: 1, convRule: rule23 },
  { start: 11520, length: 38, convRule: rule182 },
  { start: 11559, length: 1, convRule: rule182 },
  { start: 11565, length: 1, convRule: rule182 },
  { start: 42560, length: 1, convRule: rule22 },
  { start: 42561, length: 1, convRule: rule23 },
  { start: 42562, length: 1, convRule: rule22 },
  { start: 42563, length: 1, convRule: rule23 },
  { start: 42564, length: 1, convRule: rule22 },
  { start: 42565, length: 1, convRule: rule23 },
  { start: 42566, length: 1, convRule: rule22 },
  { start: 42567, length: 1, convRule: rule23 },
  { start: 42568, length: 1, convRule: rule22 },
  { start: 42569, length: 1, convRule: rule23 },
  { start: 42570, length: 1, convRule: rule22 },
  { start: 42571, length: 1, convRule: rule23 },
  { start: 42572, length: 1, convRule: rule22 },
  { start: 42573, length: 1, convRule: rule23 },
  { start: 42574, length: 1, convRule: rule22 },
  { start: 42575, length: 1, convRule: rule23 },
  { start: 42576, length: 1, convRule: rule22 },
  { start: 42577, length: 1, convRule: rule23 },
  { start: 42578, length: 1, convRule: rule22 },
  { start: 42579, length: 1, convRule: rule23 },
  { start: 42580, length: 1, convRule: rule22 },
  { start: 42581, length: 1, convRule: rule23 },
  { start: 42582, length: 1, convRule: rule22 },
  { start: 42583, length: 1, convRule: rule23 },
  { start: 42584, length: 1, convRule: rule22 },
  { start: 42585, length: 1, convRule: rule23 },
  { start: 42586, length: 1, convRule: rule22 },
  { start: 42587, length: 1, convRule: rule23 },
  { start: 42588, length: 1, convRule: rule22 },
  { start: 42589, length: 1, convRule: rule23 },
  { start: 42590, length: 1, convRule: rule22 },
  { start: 42591, length: 1, convRule: rule23 },
  { start: 42592, length: 1, convRule: rule22 },
  { start: 42593, length: 1, convRule: rule23 },
  { start: 42594, length: 1, convRule: rule22 },
  { start: 42595, length: 1, convRule: rule23 },
  { start: 42596, length: 1, convRule: rule22 },
  { start: 42597, length: 1, convRule: rule23 },
  { start: 42598, length: 1, convRule: rule22 },
  { start: 42599, length: 1, convRule: rule23 },
  { start: 42600, length: 1, convRule: rule22 },
  { start: 42601, length: 1, convRule: rule23 },
  { start: 42602, length: 1, convRule: rule22 },
  { start: 42603, length: 1, convRule: rule23 },
  { start: 42604, length: 1, convRule: rule22 },
  { start: 42605, length: 1, convRule: rule23 },
  { start: 42624, length: 1, convRule: rule22 },
  { start: 42625, length: 1, convRule: rule23 },
  { start: 42626, length: 1, convRule: rule22 },
  { start: 42627, length: 1, convRule: rule23 },
  { start: 42628, length: 1, convRule: rule22 },
  { start: 42629, length: 1, convRule: rule23 },
  { start: 42630, length: 1, convRule: rule22 },
  { start: 42631, length: 1, convRule: rule23 },
  { start: 42632, length: 1, convRule: rule22 },
  { start: 42633, length: 1, convRule: rule23 },
  { start: 42634, length: 1, convRule: rule22 },
  { start: 42635, length: 1, convRule: rule23 },
  { start: 42636, length: 1, convRule: rule22 },
  { start: 42637, length: 1, convRule: rule23 },
  { start: 42638, length: 1, convRule: rule22 },
  { start: 42639, length: 1, convRule: rule23 },
  { start: 42640, length: 1, convRule: rule22 },
  { start: 42641, length: 1, convRule: rule23 },
  { start: 42642, length: 1, convRule: rule22 },
  { start: 42643, length: 1, convRule: rule23 },
  { start: 42644, length: 1, convRule: rule22 },
  { start: 42645, length: 1, convRule: rule23 },
  { start: 42646, length: 1, convRule: rule22 },
  { start: 42647, length: 1, convRule: rule23 },
  { start: 42648, length: 1, convRule: rule22 },
  { start: 42649, length: 1, convRule: rule23 },
  { start: 42650, length: 1, convRule: rule22 },
  { start: 42651, length: 1, convRule: rule23 },
  { start: 42786, length: 1, convRule: rule22 },
  { start: 42787, length: 1, convRule: rule23 },
  { start: 42788, length: 1, convRule: rule22 },
  { start: 42789, length: 1, convRule: rule23 },
  { start: 42790, length: 1, convRule: rule22 },
  { start: 42791, length: 1, convRule: rule23 },
  { start: 42792, length: 1, convRule: rule22 },
  { start: 42793, length: 1, convRule: rule23 },
  { start: 42794, length: 1, convRule: rule22 },
  { start: 42795, length: 1, convRule: rule23 },
  { start: 42796, length: 1, convRule: rule22 },
  { start: 42797, length: 1, convRule: rule23 },
  { start: 42798, length: 1, convRule: rule22 },
  { start: 42799, length: 1, convRule: rule23 },
  { start: 42802, length: 1, convRule: rule22 },
  { start: 42803, length: 1, convRule: rule23 },
  { start: 42804, length: 1, convRule: rule22 },
  { start: 42805, length: 1, convRule: rule23 },
  { start: 42806, length: 1, convRule: rule22 },
  { start: 42807, length: 1, convRule: rule23 },
  { start: 42808, length: 1, convRule: rule22 },
  { start: 42809, length: 1, convRule: rule23 },
  { start: 42810, length: 1, convRule: rule22 },
  { start: 42811, length: 1, convRule: rule23 },
  { start: 42812, length: 1, convRule: rule22 },
  { start: 42813, length: 1, convRule: rule23 },
  { start: 42814, length: 1, convRule: rule22 },
  { start: 42815, length: 1, convRule: rule23 },
  { start: 42816, length: 1, convRule: rule22 },
  { start: 42817, length: 1, convRule: rule23 },
  { start: 42818, length: 1, convRule: rule22 },
  { start: 42819, length: 1, convRule: rule23 },
  { start: 42820, length: 1, convRule: rule22 },
  { start: 42821, length: 1, convRule: rule23 },
  { start: 42822, length: 1, convRule: rule22 },
  { start: 42823, length: 1, convRule: rule23 },
  { start: 42824, length: 1, convRule: rule22 },
  { start: 42825, length: 1, convRule: rule23 },
  { start: 42826, length: 1, convRule: rule22 },
  { start: 42827, length: 1, convRule: rule23 },
  { start: 42828, length: 1, convRule: rule22 },
  { start: 42829, length: 1, convRule: rule23 },
  { start: 42830, length: 1, convRule: rule22 },
  { start: 42831, length: 1, convRule: rule23 },
  { start: 42832, length: 1, convRule: rule22 },
  { start: 42833, length: 1, convRule: rule23 },
  { start: 42834, length: 1, convRule: rule22 },
  { start: 42835, length: 1, convRule: rule23 },
  { start: 42836, length: 1, convRule: rule22 },
  { start: 42837, length: 1, convRule: rule23 },
  { start: 42838, length: 1, convRule: rule22 },
  { start: 42839, length: 1, convRule: rule23 },
  { start: 42840, length: 1, convRule: rule22 },
  { start: 42841, length: 1, convRule: rule23 },
  { start: 42842, length: 1, convRule: rule22 },
  { start: 42843, length: 1, convRule: rule23 },
  { start: 42844, length: 1, convRule: rule22 },
  { start: 42845, length: 1, convRule: rule23 },
  { start: 42846, length: 1, convRule: rule22 },
  { start: 42847, length: 1, convRule: rule23 },
  { start: 42848, length: 1, convRule: rule22 },
  { start: 42849, length: 1, convRule: rule23 },
  { start: 42850, length: 1, convRule: rule22 },
  { start: 42851, length: 1, convRule: rule23 },
  { start: 42852, length: 1, convRule: rule22 },
  { start: 42853, length: 1, convRule: rule23 },
  { start: 42854, length: 1, convRule: rule22 },
  { start: 42855, length: 1, convRule: rule23 },
  { start: 42856, length: 1, convRule: rule22 },
  { start: 42857, length: 1, convRule: rule23 },
  { start: 42858, length: 1, convRule: rule22 },
  { start: 42859, length: 1, convRule: rule23 },
  { start: 42860, length: 1, convRule: rule22 },
  { start: 42861, length: 1, convRule: rule23 },
  { start: 42862, length: 1, convRule: rule22 },
  { start: 42863, length: 1, convRule: rule23 },
  { start: 42873, length: 1, convRule: rule22 },
  { start: 42874, length: 1, convRule: rule23 },
  { start: 42875, length: 1, convRule: rule22 },
  { start: 42876, length: 1, convRule: rule23 },
  { start: 42877, length: 1, convRule: rule183 },
  { start: 42878, length: 1, convRule: rule22 },
  { start: 42879, length: 1, convRule: rule23 },
  { start: 42880, length: 1, convRule: rule22 },
  { start: 42881, length: 1, convRule: rule23 },
  { start: 42882, length: 1, convRule: rule22 },
  { start: 42883, length: 1, convRule: rule23 },
  { start: 42884, length: 1, convRule: rule22 },
  { start: 42885, length: 1, convRule: rule23 },
  { start: 42886, length: 1, convRule: rule22 },
  { start: 42887, length: 1, convRule: rule23 },
  { start: 42891, length: 1, convRule: rule22 },
  { start: 42892, length: 1, convRule: rule23 },
  { start: 42893, length: 1, convRule: rule184 },
  { start: 42896, length: 1, convRule: rule22 },
  { start: 42897, length: 1, convRule: rule23 },
  { start: 42898, length: 1, convRule: rule22 },
  { start: 42899, length: 1, convRule: rule23 },
  { start: 42900, length: 1, convRule: rule185 },
  { start: 42902, length: 1, convRule: rule22 },
  { start: 42903, length: 1, convRule: rule23 },
  { start: 42904, length: 1, convRule: rule22 },
  { start: 42905, length: 1, convRule: rule23 },
  { start: 42906, length: 1, convRule: rule22 },
  { start: 42907, length: 1, convRule: rule23 },
  { start: 42908, length: 1, convRule: rule22 },
  { start: 42909, length: 1, convRule: rule23 },
  { start: 42910, length: 1, convRule: rule22 },
  { start: 42911, length: 1, convRule: rule23 },
  { start: 42912, length: 1, convRule: rule22 },
  { start: 42913, length: 1, convRule: rule23 },
  { start: 42914, length: 1, convRule: rule22 },
  { start: 42915, length: 1, convRule: rule23 },
  { start: 42916, length: 1, convRule: rule22 },
  { start: 42917, length: 1, convRule: rule23 },
  { start: 42918, length: 1, convRule: rule22 },
  { start: 42919, length: 1, convRule: rule23 },
  { start: 42920, length: 1, convRule: rule22 },
  { start: 42921, length: 1, convRule: rule23 },
  { start: 42922, length: 1, convRule: rule186 },
  { start: 42923, length: 1, convRule: rule187 },
  { start: 42924, length: 1, convRule: rule188 },
  { start: 42925, length: 1, convRule: rule189 },
  { start: 42926, length: 1, convRule: rule186 },
  { start: 42928, length: 1, convRule: rule190 },
  { start: 42929, length: 1, convRule: rule191 },
  { start: 42930, length: 1, convRule: rule192 },
  { start: 42931, length: 1, convRule: rule193 },
  { start: 42932, length: 1, convRule: rule22 },
  { start: 42933, length: 1, convRule: rule23 },
  { start: 42934, length: 1, convRule: rule22 },
  { start: 42935, length: 1, convRule: rule23 },
  { start: 42936, length: 1, convRule: rule22 },
  { start: 42937, length: 1, convRule: rule23 },
  { start: 42938, length: 1, convRule: rule22 },
  { start: 42939, length: 1, convRule: rule23 },
  { start: 42940, length: 1, convRule: rule22 },
  { start: 42941, length: 1, convRule: rule23 },
  { start: 42942, length: 1, convRule: rule22 },
  { start: 42943, length: 1, convRule: rule23 },
  { start: 42946, length: 1, convRule: rule22 },
  { start: 42947, length: 1, convRule: rule23 },
  { start: 42948, length: 1, convRule: rule194 },
  { start: 42949, length: 1, convRule: rule195 },
  { start: 42950, length: 1, convRule: rule196 },
  { start: 42951, length: 1, convRule: rule22 },
  { start: 42952, length: 1, convRule: rule23 },
  { start: 42953, length: 1, convRule: rule22 },
  { start: 42954, length: 1, convRule: rule23 },
  { start: 42997, length: 1, convRule: rule22 },
  { start: 42998, length: 1, convRule: rule23 },
  { start: 43859, length: 1, convRule: rule197 },
  { start: 43888, length: 80, convRule: rule198 },
  { start: 65313, length: 26, convRule: rule9 },
  { start: 65345, length: 26, convRule: rule12 },
  { start: 66560, length: 40, convRule: rule201 },
  { start: 66600, length: 40, convRule: rule202 },
  { start: 66736, length: 36, convRule: rule201 },
  { start: 66776, length: 36, convRule: rule202 },
  { start: 68736, length: 51, convRule: rule97 },
  { start: 68800, length: 51, convRule: rule102 },
  { start: 71840, length: 32, convRule: rule9 },
  { start: 71872, length: 32, convRule: rule12 },
  { start: 93760, length: 32, convRule: rule9 },
  { start: 93792, length: 32, convRule: rule12 },
  { start: 125184, length: 34, convRule: rule203 },
  { start: 125218, length: 34, convRule: rule204 }
];
var bsearch = (a) => (array) => (size3) => (compare3) => {
  const go = (go$a0$copy) => (go$a1$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const i = go$a0, k = go$a1;
      if (i > k || i >= array.length) {
        go$c = false;
        go$r = Nothing;
        continue;
      }
      const j = unsafeClamp(floor(toNumber(i + k | 0) / 2));
      const b = array[j];
      const v = compare3(a)(b);
      if (v === 2) {
        go$c = false;
        go$r = $Maybe(1, b);
        continue;
      }
      if (v === 1) {
        go$a0 = j + 1 | 0;
        go$a1 = k;
        continue;
      }
      go$a0 = i;
      go$a1 = j - 1 | 0;
    }
    return go$r;
  };
  return go(0)(size3);
};
var blkCmp = (v) => (v1) => {
  if (v.start >= v1.start && v.start < (v1.start + v1.length | 0)) {
    return EQ;
  }
  if (v.start > v1.start) {
    return GT;
  }
  return LT;
};
var getRule = (blocks) => (unichar) => (size3) => {
  const maybeCharBlock = bsearch({ start: unichar, length: 1, convRule: nullrule })(blocks)(size3)(blkCmp);
  if (maybeCharBlock.tag === 0) {
    return Nothing;
  }
  if (maybeCharBlock.tag === 1) {
    return $Maybe(1, maybeCharBlock._1.convRule);
  }
  fail();
};
var caseConv = (f) => ($$char2) => {
  const maybeConversionRule = getRule(convchars)($$char2)(1332);
  if (maybeConversionRule.tag === 0) {
    return $$char2;
  }
  if (maybeConversionRule.tag === 1) {
    return $$char2 + f(maybeConversionRule._1) | 0;
  }
  fail();
};

// output-es/Data.Lazy/foreign.js
var defer = function(thunk) {
  var v = null;
  return function() {
    if (thunk === void 0)
      return v;
    v = thunk();
    thunk = void 0;
    return v;
  };
};
var force = function(l) {
  return l();
};

// output-es/Data.Show.Generic/foreign.js
var intercalate2 = function(separator) {
  return function(xs) {
    return xs.join(separator);
  };
};

// output-es/Data.Show.Generic/index.js
var genericShowConstructor = (dictGenericShowArgs) => (dictIsSymbol) => ({
  "genericShow'": (v) => {
    const ctor = dictIsSymbol.reflectSymbol($$Proxy);
    const v1 = dictGenericShowArgs.genericShowArgs(v);
    if (v1.length === 0) {
      return ctor;
    }
    return "(" + intercalate2(" ")([ctor, ...v1]) + ")";
  }
});

// output-es/Parsing/index.js
var $ParseError = (_1, _2) => ({ _1, _2 });
var $ParseState = (_1, _2, _3) => ({ _1, _2, _3 });
var $RunParser = (tag, _1, _2) => ({ tag, _1, _2 });
var More = (value0) => $RunParser(0, value0);
var Lift = (value0) => $RunParser(1, value0);
var lazyParserT = {
  defer: (f) => {
    const m = defer(f);
    return (state1, more, lift12, $$throw, done) => force(m)(state1, more, lift12, $$throw, done);
  }
};
var genericShow = /* @__PURE__ */ (() => {
  const $0 = genericShowConstructor({
    genericShowArgs: (v) => ["{ column: " + showIntImpl(v.column) + ", index: " + showIntImpl(v.index) + ", line: " + showIntImpl(v.line) + " }"]
  })({ reflectSymbol: () => "Position" });
  return (x) => $0["genericShow'"](x);
})();
var functorParserT = { map: (f) => (v) => (state1, more, lift12, $$throw, done) => more((v1) => v(state1, more, lift12, $$throw, (state2, a) => more((v2) => done(state2, f(a))))) };
var applyParserT = {
  apply: (v) => (v1) => (state1, more, lift12, $$throw, done) => more((v2) => v(
    state1,
    more,
    lift12,
    $$throw,
    (state2, f) => more((v3) => v1(state2, more, lift12, $$throw, (state3, a) => more((v4) => done(state3, f(a)))))
  )),
  Functor0: () => functorParserT
};
var bindParserT = {
  bind: (v) => (next) => (state1, more, lift12, $$throw, done) => more((v1) => v(state1, more, lift12, $$throw, (state2, a) => more((v2) => next(a)(state2, more, lift12, $$throw, done)))),
  Apply0: () => applyParserT
};
var applicativeParserT = { pure: (a) => (state1, v, v1, v2, done) => done(state1, a), Apply0: () => applyParserT };
var monadParserT = { Applicative0: () => applicativeParserT, Bind1: () => bindParserT };
var monadRecParserT = {
  tailRecM: (next) => (initArg) => (state1, more, lift12, $$throw, done) => {
    const loop = (state2, arg, gas) => next(arg)(
      state2,
      more,
      lift12,
      $$throw,
      (state3, step) => {
        if (step.tag === 0) {
          if (gas === 0) {
            return more((v1) => loop(state3, step._1, 30));
          }
          return loop(state3, step._1, gas - 1 | 0);
        }
        if (step.tag === 1) {
          return done(state3, step._1);
        }
        fail();
      }
    );
    return loop(state1, initArg, 30);
  },
  Monad0: () => monadParserT
};
var monoidParserT = (dictMonoid) => {
  const $0 = dictMonoid.Semigroup0();
  const semigroupParserT1 = {
    append: (a) => (b) => (state1, more, lift12, $$throw, done) => more((v2) => more((v1) => a(
      state1,
      more,
      lift12,
      $$throw,
      (state2, a$1) => more((v2$1) => {
        const $1 = $0.append(a$1);
        return more((v3) => b(state2, more, lift12, $$throw, (state3, a$2) => more((v4) => done(state3, $1(a$2)))));
      })
    )))
  };
  return {
    mempty: (() => {
      const $1 = dictMonoid.mempty;
      return (state1, v, v1, v2, done) => done(state1, $1);
    })(),
    Semigroup0: () => semigroupParserT1
  };
};
var altParserT = {
  alt: (v) => (v1) => (v2, $0, $1, $2, $3) => {
    const $4 = v2._1;
    const $5 = v2._2;
    return $0((v3) => v(
      $ParseState($4, $5, false),
      $0,
      $1,
      (v4, $6) => {
        const $7 = v4._3;
        return $0((v5) => {
          if ($7) {
            return $2(v4, $6);
          }
          return v1(v2, $0, $1, $2, $3);
        });
      },
      $3
    ));
  },
  Functor0: () => functorParserT
};
var showParseError = { show: (v) => "(ParseError " + showStringImpl(v._1) + " " + genericShow(v._2) + ")" };
var runParserT$p = (dictMonadRec) => {
  const Monad0 = dictMonadRec.Monad0();
  return (state1) => (v) => {
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const step = go$a0;
        const v1 = step();
        if (v1.tag === 0) {
          go$a0 = v1._1;
          continue;
        }
        if (v1.tag === 1) {
          go$c = false;
          go$r = Monad0.Bind1().Apply0().Functor0().map(Loop)(v1._1);
          continue;
        }
        if (v1.tag === 2) {
          go$c = false;
          go$r = Monad0.Applicative0().pure($Step(1, $Tuple(v1._2, v1._1)));
          continue;
        }
        fail();
      }
      return go$r;
    };
    return dictMonadRec.tailRecM(go)((v1) => v(
      state1,
      More,
      Lift,
      (state2, err) => $RunParser(2, state2, $Either(0, err)),
      (state2, res) => $RunParser(2, state2, $Either(1, res))
    ));
  };
};
var position = (state1, v, v1, v2, done) => done(state1, state1._2);
var mapParserT = (dictMonadRec) => {
  const runParserT$p1 = runParserT$p(dictMonadRec);
  return (dictFunctor) => (f) => (p) => (state1, v, lift12, $$throw, done) => lift12(dictFunctor.map((v1) => {
    const $0 = v1._1;
    const $1 = v1._2;
    return (v2) => {
      if ($0.tag === 0) {
        return $$throw($1, $0._1);
      }
      if ($0.tag === 1) {
        return done($1, $0._1);
      }
      fail();
    };
  })(f(runParserT$p1(state1)(p))));
};
var initialPos = { index: 0, line: 1, column: 1 };
var runParserT = (dictMonadRec) => {
  const runParserT$p1 = runParserT$p(dictMonadRec);
  return (s) => (p) => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(fst)(runParserT$p1($ParseState(s, initialPos, false))(p));
};
var runParserT1 = /* @__PURE__ */ runParserT(monadRecIdentity);
var getParserT = (state1, v, v1, v2, done) => done(state1, state1);
var fail2 = (message2) => (state1, more, lift12, $$throw, done) => more((v1) => position(
  state1,
  more,
  lift12,
  $$throw,
  (state2, a) => more((v2) => $$throw(state2, $ParseError(message2, a)))
));
var plusParserT = { empty: /* @__PURE__ */ fail2("No alternative"), Alt0: () => altParserT };
var alternativeParserT = { Applicative0: () => applicativeParserT, Plus1: () => plusParserT };
var consume = (state1, v, v1, v2, done) => done($ParseState(state1._1, state1._2, true), void 0);

// output-es/Parsing.Combinators/index.js
var manyRec2 = /* @__PURE__ */ manyRec(monadRecParserT)(alternativeParserT);
var withErrorMessage = (p) => (msg) => {
  const $0 = fail2("Expected " + msg);
  return (v2, $1, $2, $3, $4) => {
    const $5 = v2._1;
    const $6 = v2._2;
    return $1((v3) => p(
      $ParseState($5, $6, false),
      $1,
      $2,
      (v4, $7) => {
        const $8 = v4._3;
        return $1((v5) => {
          if ($8) {
            return $3(v4, $7);
          }
          return $0(v2, $1, $2, $3, $4);
        });
      },
      $4
    ));
  };
};
var sepBy1 = (p) => (sep2) => (state1, more, lift12, $$throw, done) => more((v1) => p(
  state1,
  more,
  lift12,
  $$throw,
  (state2, a) => more((v2) => {
    const $0 = manyRec2((state1$1, more$1, lift1$1, throw$1, done$1) => more$1((v2$1) => more$1((v1$1) => sep2(
      state1$1,
      more$1,
      lift1$1,
      throw$1,
      (state2$1, a$1) => more$1((v2$2) => more$1((v3) => p(state2$1, more$1, lift1$1, throw$1, (state3, a$2) => more$1((v4) => done$1(state3, a$2)))))
    ))));
    return more((v1$1) => $0(state2, more, lift12, $$throw, (state2$1, a$1) => more((v2$1) => done(state2$1, $NonEmpty(a, a$1)))));
  })
));
var sepBy = (p) => (sep2) => (v2, $0, $1, $2, $3) => {
  const $4 = v2._1;
  const $5 = v2._2;
  return $0((v3) => $0((v1) => sepBy1(p)(sep2)(
    $ParseState($4, $5, false),
    $0,
    $1,
    (v4, $6) => {
      const $7 = v4._3;
      return $0((v5) => {
        if ($7) {
          return $2(v4, $6);
        }
        return $3(v2, Nil);
      });
    },
    (state2, a) => $0((v2$1) => $3(state2, $List(1, a._1, a._2)))
  )));
};
var optionMaybe = (p) => (v2, $0, $1, $2, $3) => {
  const $4 = v2._1;
  const $5 = v2._2;
  return $0((v3) => $0((v1) => p(
    $ParseState($4, $5, false),
    $0,
    $1,
    (v4, $6) => {
      const $7 = v4._3;
      return $0((v5) => {
        if ($7) {
          return $2(v4, $6);
        }
        return $3(v2, Nothing);
      });
    },
    (state2, a) => $0((v2$1) => $3(state2, $Maybe(1, a)))
  )));
};
var choice = (dictFoldable) => {
  const $0 = dictFoldable.foldr((p1) => (v) => {
    if (v.tag === 0) {
      return $Maybe(1, p1);
    }
    if (v.tag === 1) {
      return $Maybe(
        1,
        (v2, $02, $1, $2, $3) => {
          const $4 = v2._1;
          const $5 = v2._2;
          return $02((v3) => p1(
            $ParseState($4, $5, false),
            $02,
            $1,
            (v4, $6) => {
              const $7 = v4._3;
              return $02((v5) => {
                if ($7) {
                  return $2(v4, $6);
                }
                return v._1(v2, $02, $1, $2, $3);
              });
            },
            $3
          ));
        }
      );
    }
    fail();
  })(Nothing);
  return (x) => {
    const $1 = $0(x);
    if ($1.tag === 0) {
      return fail2("No alternative");
    }
    if ($1.tag === 1) {
      return $1._1;
    }
    fail();
  };
};

// output-es/Data.String.Regex/foreign.js
var regexImpl = function(left) {
  return function(right) {
    return function(s1) {
      return function(s2) {
        try {
          return right(new RegExp(s1, s2));
        } catch (e) {
          return left(e.message);
        }
      };
    };
  };
};
var test = function(r) {
  return function(s) {
    var lastIndex = r.lastIndex;
    var result = r.test(s);
    r.lastIndex = lastIndex;
    return result;
  };
};
var _match = function(just) {
  return function(nothing) {
    return function(r) {
      return function(s) {
        var m = s.match(r);
        if (m == null || m.length === 0) {
          return nothing;
        } else {
          for (var i = 0; i < m.length; i++) {
            m[i] = m[i] == null ? nothing : just(m[i]);
          }
          return just(m);
        }
      };
    };
  };
};
var replace2 = function(r) {
  return function(s1) {
    return function(s2) {
      return s2.replace(r, s1);
    };
  };
};

// output-es/Data.String.Regex/index.js
var regex = (s) => (f) => regexImpl(Left)(Right)(s)((f.global ? "g" : "") + (f.ignoreCase ? "i" : "") + (f.multiline ? "m" : "") + (f.dotAll ? "s" : "") + (f.sticky ? "y" : "") + (f.unicode ? "u" : ""));
var match = /* @__PURE__ */ _match(Just)(Nothing);

// output-es/Parsing.String/index.js
var updatePosSingle = (v) => (cp) => (after) => {
  if (cp === 10) {
    return { index: v.index + 1 | 0, line: v.line + 1 | 0, column: 1 };
  }
  if (cp === 13) {
    const v2 = codePointAt(0)(after);
    if (v2.tag === 1 && v2._1 === 10) {
      return { index: v.index + 1 | 0, line: v.line, column: v.column };
    }
    return { index: v.index + 1 | 0, line: v.line + 1 | 0, column: 1 };
  }
  if (cp === 9) {
    return { index: v.index + 1 | 0, line: v.line, column: (v.column + 8 | 0) - intMod(v.column - 1 | 0)(8) | 0 };
  }
  return { index: v.index + 1 | 0, line: v.line, column: v.column + 1 | 0 };
};
var updatePosString = (updatePosString$a0$copy) => (updatePosString$a1$copy) => (updatePosString$a2$copy) => {
  let updatePosString$a0 = updatePosString$a0$copy;
  let updatePosString$a1 = updatePosString$a1$copy;
  let updatePosString$a2 = updatePosString$a2$copy;
  let updatePosString$c = true;
  let updatePosString$r;
  while (updatePosString$c) {
    const pos = updatePosString$a0, before = updatePosString$a1, after = updatePosString$a2;
    const v = uncons(before);
    if (v.tag === 0) {
      updatePosString$c = false;
      updatePosString$r = pos;
      continue;
    }
    if (v.tag === 1) {
      updatePosString$a0 = v._1.tail === "" ? updatePosSingle(pos)(v._1.head)(after) : updatePosSingle(pos)(v._1.head)(v._1.tail);
      updatePosString$a1 = v._1.tail;
      updatePosString$a2 = after;
      continue;
    }
    fail();
  }
  return updatePosString$r;
};
var satisfy = (f) => (v, $0, $1, $2, $3) => {
  const v3 = uncons(v._1);
  if (v3.tag === 0) {
    return $2(v, $ParseError("Unexpected EOF", v._2));
  }
  if (v3.tag === 1) {
    if (v3._1.head < 0 || v3._1.head > 65535) {
      return $2(v, $ParseError("Expected Char", v._2));
    }
    if (v3._1.head >= 0 && v3._1.head <= 65535) {
      const ch = fromCharCode(v3._1.head);
      if (f(ch)) {
        return $3($ParseState(v3._1.tail, updatePosSingle(v._2)(v3._1.head)(v3._1.tail), true), ch);
      }
      return $2(v, $ParseError("Predicate unsatisfied", v._2));
    }
  }
  fail();
};
var eof = (v, $0, $1, $2, $3) => {
  if (v._1 === "") {
    return $3($ParseState(v._1, v._2, true), void 0);
  }
  return $2(v, $ParseError("Expected EOF", v._2));
};
var consumeWith = (f) => (v, $0, $1, $2, $3) => {
  const v3 = f(v._1);
  if (v3.tag === 0) {
    return $2(v, $ParseError(v3._1, v._2));
  }
  if (v3.tag === 1) {
    return $3($ParseState(v3._1.remainder, updatePosString(v._2)(v3._1.consumed)(v3._1.remainder), v3._1.consumed !== ""), v3._1.value);
  }
  fail();
};
var string = (str) => consumeWith((input) => {
  const v = stripPrefix(str)(input);
  if (v.tag === 1) {
    return $Either(1, { value: str, consumed: str, remainder: v._1 });
  }
  return $Either(0, "Expected " + showStringImpl(str));
});
var $$char = (c) => withErrorMessage(satisfy((v) => v === c))(showCharImpl(c));

// output-es/Data.String.Regex.Flags/index.js
var noFlags = { global: false, ignoreCase: false, multiline: false, dotAll: false, sticky: false, unicode: false };
var ignoreCase = { global: false, ignoreCase: true, multiline: false, dotAll: false, sticky: false, unicode: false };
var global2 = { global: true, ignoreCase: false, multiline: false, dotAll: false, sticky: false, unicode: false };

// output-es/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output-es/Parsing.Token/index.js
var token = (tokpos) => (state1, more, lift12, $$throw, done) => more((v1) => getParserT(
  state1,
  more,
  lift12,
  $$throw,
  (state2, a) => more((v2) => {
    if (a._1.tag === 0) {
      return fail2("Unexpected EOF")(state2, more, lift12, $$throw, done);
    }
    if (a._1.tag === 1) {
      const $0 = a._1._1;
      const $1 = a._1._2;
      return more((v1$1) => {
        const $2 = $ParseState($1, tokpos($0), true);
        return more((v2$1) => done($2, $0));
      });
    }
    fail();
  })
));
var when = (tokpos) => (f) => (v1, $0, $1, $2, $3) => {
  const $4 = v1._3;
  const $5 = v1._2;
  return $0((v1$1) => token(tokpos)(
    v1,
    $0,
    $1,
    (v2, $6) => $2($ParseState(v2._1, v2._2, $4), $ParseError($6._1, $5)),
    (state2, a) => $0((v2) => {
      const $6 = f(a) ? (state1, v, v1$2, v2$1, done) => done(state1, void 0) : fail2("No alternative");
      return $0((v1$2) => $6(
        state2,
        $0,
        $1,
        (v2$1, $7) => $2($ParseState(v2$1._1, v2$1._2, $4), $ParseError($7._1, $5)),
        (state2$1, a$1) => $0((v2$1) => $3(state2$1, a))
      ));
    })
  ));
};
var match2 = (dictEq) => (tokpos) => (tok) => when(tokpos)((v) => dictEq.eq(v)(tok));
var eof2 = (state1, more, lift12, $$throw, done) => more((v1) => getParserT(
  state1,
  more,
  lift12,
  $$throw,
  (state2, a) => more((v2) => {
    if (a._1.tag === 0) {
      return consume(state2, more, lift12, $$throw, done);
    }
    return fail2("Expected EOF")(state2, more, lift12, $$throw, done);
  })
));

// output-es/Data.Version.Internal/index.js
var lieAboutPos = (v) => initialPos;
var isDigit = (c) => "0" <= c && c <= "9";
var nonNegativeInt = /* @__PURE__ */ (() => {
  const $0 = toUnfoldable(unfoldableArray);
  const $1 = some(alternativeParserT)(lazyParserT)(when(lieAboutPos)(isDigit));
  return (state1, more, lift12, $$throw, done) => more((v1) => more((v1$1) => $1(
    state1,
    more,
    lift12,
    $$throw,
    (state2, a) => more((v2) => {
      const $2 = fromString(fromCharArray($0(a)));
      return more((v2$1) => {
        if ($2.tag === 0) {
          return fail2("invalid 32-bit integer")(state2, more, lift12, $$throw, done);
        }
        if ($2.tag === 1) {
          return done(state2, $2._1);
        }
        fail();
      });
    })
  )));
})();
var isAsciiAlpha = (x) => {
  const $0 = caseConv((v) => v.lowdist)(toCharCode(x));
  if ($0 < 97) {
    return false;
  }
  return $0 <= 122;
};

// output-es/Data.Version/index.js
var $Identifier = (tag, _1) => ({ tag, _1 });
var $Version = (_1, _2, _3, _4, _5) => ({ _1, _2, _3, _4, _5 });
var toUnfoldable2 = /* @__PURE__ */ toUnfoldable(unfoldableArray);
var compare2 = /* @__PURE__ */ (() => ordArray(ordInt).compare)();
var all = /* @__PURE__ */ (() => foldableArray.foldMap((() => {
  const semigroupConj1 = { append: (v) => (v1) => v && v1 };
  return { mempty: true, Semigroup0: () => semigroupConj1 };
})()))();
var showIdentifier = (i) => {
  if (i.tag === 0) {
    return showIntImpl(i._1);
  }
  if (i.tag === 1) {
    return i._1;
  }
  fail();
};
var showVersion = (v) => joinWith(".")(arrayMap(showIntImpl)([v._1, v._2, v._3])) + (v._4.tag === 0 ? "" : "-" + joinWith(".")(arrayMap(showIdentifier)(toUnfoldable2(v._4)))) + (v._5.tag === 0 ? "" : "+" + joinWith(".")(arrayMap(showIdentifier)(toUnfoldable2(v._5))));
var ordIdentifier = {
  compare: (v) => (v1) => {
    if (v.tag === 0) {
      if (v1.tag === 1) {
        return LT;
      }
      if (v1.tag === 0) {
        return ordInt.compare(v._1)(v1._1);
      }
      fail();
    }
    if (v.tag === 1) {
      if (v1.tag === 0) {
        return GT;
      }
      if (v1.tag === 1) {
        return ordString.compare(v._1)(v1._1);
      }
    }
    fail();
  },
  Eq0: () => eqIdentifier
};
var eqIdentifier = {
  eq: (i1) => (i2) => ordIdentifier.compare(i1)(i2) === 2
  /* EQ */
};
var comparePre = (v) => (v1) => {
  if (v.tag === 0) {
    if (v1.tag === 0) {
      return EQ;
    }
    return GT;
  }
  if (v1.tag === 0) {
    return LT;
  }
  if (v.tag === 1 && v1.tag === 1) {
    const helper = (v2) => (v3) => {
      if (v2.tag === 0) {
        if (v3.tag === 0) {
          return EQ;
        }
        return LT;
      }
      if (v3.tag === 0) {
        return GT;
      }
      if (v2.tag === 1 && v3.tag === 1) {
        const $02 = ordIdentifier.compare(v2._1)(v3._1);
        const $12 = helper(v2._2)(v3._2);
        if ($02 === 0) {
          return LT;
        }
        if ($02 === 1) {
          return GT;
        }
        if ($02 === 2) {
          return $12;
        }
      }
      fail();
    };
    const $0 = ordIdentifier.compare(v._1)(v1._1);
    const $1 = helper(v._2)(v1._2);
    if ($0 === 0) {
      return LT;
    }
    if ($0 === 1) {
      return GT;
    }
    if ($0 === 2) {
      return $1;
    }
  }
  fail();
};
var ordVersion = {
  compare: (v1) => (v2) => {
    const $0 = compare2([v1._1, v1._2, v1._3])([v2._1, v2._2, v2._3]);
    const $1 = comparePre(v1._4)(v2._4);
    if ($0 === 0) {
      return LT;
    }
    if ($0 === 1) {
      return GT;
    }
    if ($0 === 2) {
      return $1;
    }
    fail();
  },
  Eq0: () => eqVersion
};
var eqVersion = {
  eq: (v1) => (v2) => ordVersion.compare(v1)(v2) === 2
  /* EQ */
};
var acceptableIdentifier = (ch) => "0" <= ch && ch <= "9" || isAsciiAlpha(ch) || ch === "-";
var textual = (str) => {
  if (all((v) => v(str))([
    (x) => {
      const $0 = fromString(x);
      if ($0.tag === 0) {
        return true;
      }
      if ($0.tag === 1) {
        return false;
      }
      fail();
    },
    (x) => {
      const $0 = stripPrefix("0")(x);
      if ($0.tag === 0) {
        return true;
      }
      if ($0.tag === 1) {
        return false;
      }
      fail();
    },
    (() => {
      const $0 = all(acceptableIdentifier);
      return (x) => $0(toCharArray(x));
    })()
  ])) {
    return $Maybe(1, $Identifier(1, str));
  }
  return Nothing;
};
var versionParser = /* @__PURE__ */ (() => {
  const $0 = some(alternativeParserT)(lazyParserT)(when(lieAboutPos)(acceptableIdentifier));
  const identifier = (v2, $1, $2, $3, $4) => {
    const $5 = v2._1;
    const $6 = v2._2;
    return $1((v3) => $1((v1) => nonNegativeInt(
      $ParseState($5, $6, false),
      $1,
      $2,
      (v4, $7) => {
        const $8 = v4._3;
        return $1((v5) => {
          if ($8) {
            return $3(v4, $7);
          }
          return $1((v1$1) => $0(
            v2,
            $1,
            $2,
            $3,
            (state2, a) => $1((v2$1) => {
              const str = fromCharArray(toUnfoldable2(a));
              const v = textual(str);
              if (v.tag === 1) {
                return $4(state2, v._1);
              }
              if (v.tag === 0) {
                return fail2("invalid identifier: " + str)(state2, $1, $2, $3, $4);
              }
              fail();
            })
          ));
        });
      },
      (state2, a) => $1((v2$1) => $4(state2, $Identifier(0, a < 0 ? 0 : a)))
    )));
  };
  return (state1, more, lift12, $$throw, done) => more((v1) => nonNegativeInt(
    state1,
    more,
    lift12,
    $$throw,
    (state2, a) => more((v2) => more((v1$1) => match2(eqChar)(lieAboutPos)(".")(
      state2,
      more,
      lift12,
      $$throw,
      (state2$1, a$1) => more((v2$1) => more((v1$2) => nonNegativeInt(
        state2$1,
        more,
        lift12,
        $$throw,
        (state2$2, a$2) => more((v2$2) => more((v1$3) => match2(eqChar)(lieAboutPos)(".")(
          state2$2,
          more,
          lift12,
          $$throw,
          (state2$3, a$3) => more((v2$3) => more((v1$4) => nonNegativeInt(
            state2$3,
            more,
            lift12,
            $$throw,
            (state2$4, a$4) => more((v2$4) => more((v1$5) => {
              const $1 = (state2$5, a$5) => more((v2$5) => more((v1$6) => {
                const $12 = (state2$6, a$6) => more((v2$6) => more((v1$7) => eof2(
                  state2$6,
                  more,
                  lift12,
                  $$throw,
                  (state2$7, a$7) => more((v2$7) => done(state2$7, $Version(a, a$2, a$4, a$5, a$6)))
                )));
                const $22 = state2$5._1;
                const $32 = state2$5._2;
                return more((v3) => {
                  const $4 = (v4, $42) => {
                    const $5 = v4._3;
                    return more((v5) => {
                      if ($5) {
                        return $$throw(v4, $42);
                      }
                      return $12(state2$5, Nil);
                    });
                  };
                  return more((v2$6) => more((v1$7) => match2(eqChar)(lieAboutPos)("+")(
                    $ParseState($22, $32, false),
                    more,
                    lift12,
                    $4,
                    (state2$6, a$6) => more((v2$7) => more((v3$1) => sepBy(identifier)(match2(eqChar)(lieAboutPos)("."))(
                      state2$6,
                      more,
                      lift12,
                      $4,
                      (state3, a$7) => more((v4) => $12(state3, a$7))
                    )))
                  )));
                });
              }));
              const $2 = state2$4._1;
              const $3 = state2$4._2;
              return more((v3) => {
                const $4 = (v4, $42) => {
                  const $5 = v4._3;
                  return more((v5) => {
                    if ($5) {
                      return $$throw(v4, $42);
                    }
                    return $1(state2$4, Nil);
                  });
                };
                return more((v2$5) => more((v1$6) => match2(eqChar)(lieAboutPos)("-")(
                  $ParseState($2, $3, false),
                  more,
                  lift12,
                  $4,
                  (state2$5, a$5) => more((v2$6) => more((v3$1) => sepBy(identifier)(match2(eqChar)(lieAboutPos)("."))(
                    state2$5,
                    more,
                    lift12,
                    $4,
                    (state3, a$6) => more((v4) => $1(state3, a$6))
                  )))
                )));
              });
            }))
          )))
        )))
      )))
    )))
  ));
})();
var parseVersion = /* @__PURE__ */ (() => {
  const $0 = foldrArray(Cons)(Nil);
  return (x) => runParserT1($0(toCharArray(x)))(versionParser);
})();

// output-es/Effect.Exception/foreign.js
function showErrorImpl(err) {
  return err.stack || err.toString();
}
function error(msg) {
  return new Error(msg);
}
function message(e) {
  return e.message;
}
function throwException(e) {
  return function() {
    throw e;
  };
}
function catchException(c) {
  return function(t) {
    return function() {
      try {
        return t();
      } catch (e) {
        if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
          return c(e)();
        } else {
          return c(new Error(e.toString()))();
        }
      }
    };
  };
}

// output-es/Effect.Aff/foreign.js
var Aff = function() {
  var EMPTY = {};
  var PURE = "Pure";
  var THROW = "Throw";
  var CATCH = "Catch";
  var SYNC = "Sync";
  var ASYNC = "Async";
  var BIND = "Bind";
  var BRACKET = "Bracket";
  var FORK = "Fork";
  var SEQ = "Sequential";
  var MAP = "Map";
  var APPLY = "Apply";
  var ALT = "Alt";
  var CONS = "Cons";
  var RESUME = "Resume";
  var RELEASE = "Release";
  var FINALIZER = "Finalizer";
  var FINALIZED = "Finalized";
  var FORKED = "Forked";
  var FIBER = "Fiber";
  var THUNK = "Thunk";
  function Aff2(tag, _1, _2, _3) {
    this.tag = tag;
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
  }
  function AffCtr(tag) {
    var fn = function(_1, _2, _3) {
      return new Aff2(tag, _1, _2, _3);
    };
    fn.tag = tag;
    return fn;
  }
  function nonCanceler2(error3) {
    return new Aff2(PURE, void 0);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error3) {
      setTimeout(function() {
        throw error3;
      }, 0);
    }
  }
  function runSync(left, right, eff) {
    try {
      return right(eff());
    } catch (error3) {
      return left(error3);
    }
  }
  function runAsync(left, eff, k) {
    try {
      return eff(k)();
    } catch (error3) {
      k(left(error3))();
      return nonCanceler2;
    }
  }
  var Scheduler = function() {
    var limit = 1024;
    var size3 = 0;
    var ix = 0;
    var queue = new Array(limit);
    var draining = false;
    function drain() {
      var thunk;
      draining = true;
      while (size3 !== 0) {
        size3--;
        thunk = queue[ix];
        queue[ix] = void 0;
        ix = (ix + 1) % limit;
        thunk();
      }
      draining = false;
    }
    return {
      isDraining: function() {
        return draining;
      },
      enqueue: function(cb) {
        var i, tmp;
        if (size3 === limit) {
          tmp = draining;
          drain();
          draining = tmp;
        }
        queue[(ix + size3) % limit] = cb;
        size3++;
        if (!draining) {
          drain();
        }
      }
    };
  }();
  function Supervisor(util) {
    var fibers = {};
    var fiberId = 0;
    var count = 0;
    return {
      register: function(fiber) {
        var fid = fiberId++;
        fiber.onComplete({
          rethrow: true,
          handler: function(result) {
            return function() {
              count--;
              delete fibers[fid];
            };
          }
        })();
        fibers[fid] = fiber;
        count++;
      },
      isEmpty: function() {
        return count === 0;
      },
      killAll: function(killError, cb) {
        return function() {
          if (count === 0) {
            return cb();
          }
          var killCount = 0;
          var kills = {};
          function kill(fid) {
            kills[fid] = fibers[fid].kill(killError, function(result) {
              return function() {
                delete kills[fid];
                killCount--;
                if (util.isLeft(result) && util.fromLeft(result)) {
                  setTimeout(function() {
                    throw util.fromLeft(result);
                  }, 0);
                }
                if (killCount === 0) {
                  cb();
                }
              };
            })();
          }
          for (var k in fibers) {
            if (fibers.hasOwnProperty(k)) {
              killCount++;
              kill(k);
            }
          }
          fibers = {};
          fiberId = 0;
          count = 0;
          return function(error3) {
            return new Aff2(SYNC, function() {
              for (var k2 in kills) {
                if (kills.hasOwnProperty(k2)) {
                  kills[k2]();
                }
              }
            });
          };
        };
      }
    };
  }
  var SUSPENDED = 0;
  var CONTINUE = 1;
  var STEP_BIND = 2;
  var STEP_RESULT = 3;
  var PENDING = 4;
  var RETURN = 5;
  var COMPLETED = 6;
  function Fiber(util, supervisor, aff) {
    var runTick = 0;
    var status2 = SUSPENDED;
    var step = aff;
    var fail3 = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run2(localRunTick) {
      var tmp, result, attempt;
      while (true) {
        tmp = null;
        result = null;
        attempt = null;
        switch (status2) {
          case STEP_BIND:
            status2 = CONTINUE;
            try {
              step = bhead(step);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e) {
              status2 = RETURN;
              fail3 = util.left(e);
              step = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step)) {
              status2 = RETURN;
              fail3 = step;
              step = null;
            } else if (bhead === null) {
              status2 = RETURN;
            } else {
              status2 = STEP_BIND;
              step = util.fromRight(step);
            }
            break;
          case CONTINUE:
            switch (step.tag) {
              case BIND:
                if (bhead) {
                  btail = new Aff2(CONS, bhead, btail);
                }
                bhead = step._2;
                status2 = CONTINUE;
                step = step._1;
                break;
              case PURE:
                if (bhead === null) {
                  status2 = RETURN;
                  step = util.right(step._1);
                } else {
                  status2 = STEP_BIND;
                  step = step._1;
                }
                break;
              case SYNC:
                status2 = STEP_RESULT;
                step = runSync(util.left, util.right, step._1);
                break;
              case ASYNC:
                status2 = PENDING;
                step = runAsync(util.left, step._1, function(result2) {
                  return function() {
                    if (runTick !== localRunTick) {
                      return;
                    }
                    runTick++;
                    Scheduler.enqueue(function() {
                      if (runTick !== localRunTick + 1) {
                        return;
                      }
                      status2 = STEP_RESULT;
                      step = result2;
                      run2(runTick);
                    });
                  };
                });
                return;
              case THROW:
                status2 = RETURN;
                fail3 = util.left(step._1);
                step = null;
                break;
              case CATCH:
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status2 = CONTINUE;
                step = step._1;
                break;
              case BRACKET:
                bracketCount++;
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status2 = CONTINUE;
                step = step._1;
                break;
              case FORK:
                status2 = STEP_RESULT;
                tmp = Fiber(util, supervisor, step._2);
                if (supervisor) {
                  supervisor.register(tmp);
                }
                if (step._1) {
                  tmp.run();
                }
                step = util.right(tmp);
                break;
              case SEQ:
                status2 = CONTINUE;
                step = sequential(util, supervisor, step._1);
                break;
            }
            break;
          case RETURN:
            bhead = null;
            btail = null;
            if (attempts === null) {
              status2 = COMPLETED;
              step = interrupt || fail3 || step;
            } else {
              tmp = attempts._3;
              attempt = attempts._1;
              attempts = attempts._2;
              switch (attempt.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status2 = RETURN;
                  } else if (fail3) {
                    status2 = CONTINUE;
                    step = attempt._2(util.fromLeft(fail3));
                    fail3 = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail3) {
                    status2 = RETURN;
                  } else {
                    bhead = attempt._1;
                    btail = attempt._2;
                    status2 = STEP_BIND;
                    step = util.fromRight(step);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail3 === null) {
                    result = util.fromRight(step);
                    attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status2 = CONTINUE;
                      step = attempt._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail3), attempts, interrupt);
                  status2 = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                  } else if (fail3) {
                    step = attempt._1.failed(util.fromLeft(fail3))(attempt._2);
                  } else {
                    step = attempt._1.completed(util.fromRight(step))(attempt._2);
                  }
                  fail3 = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail3), attempts, interrupt);
                  status2 = CONTINUE;
                  step = attempt._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status2 = RETURN;
                  step = attempt._1;
                  fail3 = attempt._2;
                  break;
              }
            }
            break;
          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step));
              }
            }
            joins = null;
            if (interrupt && fail3) {
              setTimeout(function() {
                throw util.fromLeft(fail3);
              }, 0);
            } else if (util.isLeft(step) && rethrow) {
              setTimeout(function() {
                if (rethrow) {
                  throw util.fromLeft(step);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status2 = CONTINUE;
            break;
          case PENDING:
            return;
        }
      }
    }
    function onComplete(join2) {
      return function() {
        if (status2 === COMPLETED) {
          rethrow = rethrow && join2.rethrow;
          join2.handler(step)();
          return function() {
          };
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join2;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill(error3, cb) {
      return function() {
        if (status2 === COMPLETED) {
          cb(util.right(void 0))();
          return function() {
          };
        }
        var canceler = onComplete({
          rethrow: false,
          handler: function() {
            return cb(util.right(void 0));
          }
        })();
        switch (status2) {
          case SUSPENDED:
            interrupt = util.left(error3);
            status2 = COMPLETED;
            step = interrupt;
            run2(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error3);
            }
            if (bracketCount === 0) {
              if (status2 === PENDING) {
                attempts = new Aff2(CONS, new Aff2(FINALIZER, step(error3)), attempts, interrupt);
              }
              status2 = RETURN;
              step = null;
              fail3 = null;
              run2(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error3);
            }
            if (bracketCount === 0) {
              status2 = RETURN;
              step = null;
              fail3 = null;
            }
        }
        return canceler;
      };
    }
    function join(cb) {
      return function() {
        var canceler = onComplete({
          rethrow: false,
          handler: cb
        })();
        if (status2 === SUSPENDED) {
          run2(runTick);
        }
        return canceler;
      };
    }
    return {
      kill,
      join,
      onComplete,
      isSuspended: function() {
        return status2 === SUSPENDED;
      },
      run: function() {
        if (status2 === SUSPENDED) {
          if (!Scheduler.isDraining()) {
            Scheduler.enqueue(function() {
              run2(runTick);
            });
          } else {
            run2(runTick);
          }
        }
      }
    };
  }
  function runPar(util, supervisor, par, cb) {
    var fiberId = 0;
    var fibers = {};
    var killId = 0;
    var kills = {};
    var early = new Error("[ParAff] Early exit");
    var interrupt = null;
    var root = EMPTY;
    function kill(error3, par2, cb2) {
      var step = par2;
      var head = null;
      var tail = null;
      var count = 0;
      var kills2 = {};
      var tmp, kid;
      loop:
        while (true) {
          tmp = null;
          switch (step.tag) {
            case FORKED:
              if (step._3 === EMPTY) {
                tmp = fibers[step._1];
                kills2[count++] = tmp.kill(error3, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head === null) {
                break loop;
              }
              step = head._2;
              if (tail === null) {
                head = null;
              } else {
                head = tail._1;
                tail = tail._2;
              }
              break;
            case MAP:
              step = step._2;
              break;
            case APPLY:
            case ALT:
              if (head) {
                tail = new Aff2(CONS, head, tail);
              }
              head = step;
              step = step._1;
              break;
          }
        }
      if (count === 0) {
        cb2(util.right(void 0))();
      } else {
        kid = 0;
        tmp = count;
        for (; kid < tmp; kid++) {
          kills2[kid] = kills2[kid]();
        }
      }
      return kills2;
    }
    function join(result, head, tail) {
      var fail3, step, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail3 = result;
        step = null;
      } else {
        step = result;
        fail3 = null;
      }
      loop:
        while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head === null) {
            cb(fail3 || step)();
            return;
          }
          if (head._3 !== EMPTY) {
            return;
          }
          switch (head.tag) {
            case MAP:
              if (fail3 === null) {
                head._3 = util.right(head._1(util.fromRight(step)));
                step = head._3;
              } else {
                head._3 = fail3;
              }
              break;
            case APPLY:
              lhs = head._1._3;
              rhs = head._2._3;
              if (fail3) {
                head._3 = fail3;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail3 === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join(fail3, null, null);
                    } else {
                      join(fail3, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head._3 = step;
              }
              break;
            case ALT:
              lhs = head._1._3;
              rhs = head._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail3 = step === lhs ? rhs : lhs;
                step = null;
                head._3 = fail3;
              } else {
                head._3 = step;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join(step, null, null);
                    } else {
                      join(step, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail === null) {
            head = null;
          } else {
            head = tail._1;
            tail = tail._2;
          }
        }
    }
    function resolve3(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run2() {
      var status2 = CONTINUE;
      var step = par;
      var head = null;
      var tail = null;
      var tmp, fid;
      loop:
        while (true) {
          tmp = null;
          fid = null;
          switch (status2) {
            case CONTINUE:
              switch (step.tag) {
                case MAP:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(MAP, step._1, EMPTY, EMPTY);
                  step = step._2;
                  break;
                case APPLY:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(APPLY, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                case ALT:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(ALT, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                default:
                  fid = fiberId++;
                  status2 = RETURN;
                  tmp = step;
                  step = new Aff2(FORKED, fid, new Aff2(CONS, head, tail), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve3(step)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head === null) {
                break loop;
              }
              if (head._1 === EMPTY) {
                head._1 = step;
                status2 = CONTINUE;
                step = head._2;
                head._2 = EMPTY;
              } else {
                head._2 = step;
                step = head;
                if (tail === null) {
                  head = null;
                } else {
                  head = tail._1;
                  tail = tail._2;
                }
              }
          }
        }
      root = step;
      for (fid = 0; fid < fiberId; fid++) {
        fibers[fid].run();
      }
    }
    function cancel(error3, cb2) {
      interrupt = util.left(error3);
      var innerKills;
      for (var kid in kills) {
        if (kills.hasOwnProperty(kid)) {
          innerKills = kills[kid];
          for (kid in innerKills) {
            if (innerKills.hasOwnProperty(kid)) {
              innerKills[kid]();
            }
          }
        }
      }
      kills = null;
      var newKills = kill(error3, root, cb2);
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            for (var kid2 in newKills) {
              if (newKills.hasOwnProperty(kid2)) {
                newKills[kid2]();
              }
            }
            return nonCanceler2;
          };
        });
      };
    }
    run2();
    return function(killError) {
      return new Aff2(ASYNC, function(killCb) {
        return function() {
          return cancel(killError, killCb);
        };
      });
    };
  }
  function sequential(util, supervisor, par) {
    return new Aff2(ASYNC, function(cb) {
      return function() {
        return runPar(util, supervisor, par, cb);
      };
    });
  }
  Aff2.EMPTY = EMPTY;
  Aff2.Pure = AffCtr(PURE);
  Aff2.Throw = AffCtr(THROW);
  Aff2.Catch = AffCtr(CATCH);
  Aff2.Sync = AffCtr(SYNC);
  Aff2.Async = AffCtr(ASYNC);
  Aff2.Bind = AffCtr(BIND);
  Aff2.Bracket = AffCtr(BRACKET);
  Aff2.Fork = AffCtr(FORK);
  Aff2.Seq = AffCtr(SEQ);
  Aff2.ParMap = AffCtr(MAP);
  Aff2.ParApply = AffCtr(APPLY);
  Aff2.ParAlt = AffCtr(ALT);
  Aff2.Fiber = Fiber;
  Aff2.Supervisor = Supervisor;
  Aff2.Scheduler = Scheduler;
  Aff2.nonCanceler = nonCanceler2;
  return Aff2;
}();
var _pure = Aff.Pure;
var _throwError = Aff.Throw;
function _catchError(aff) {
  return function(k) {
    return Aff.Catch(aff, k);
  };
}
function _map(f) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f(aff._1));
    } else {
      return Aff.Bind(aff, function(value) {
        return Aff.Pure(f(value));
      });
    }
  };
}
function _bind(aff) {
  return function(k) {
    return Aff.Bind(aff, k);
  };
}
function _fork(immediate) {
  return function(aff) {
    return Aff.Fork(immediate, aff);
  };
}
var _liftEffect = Aff.Sync;
function _parAffMap(f) {
  return function(aff) {
    return Aff.ParMap(f, aff);
  };
}
function _parAffApply(aff1) {
  return function(aff2) {
    return Aff.ParApply(aff1, aff2);
  };
}
function _parAffAlt(aff1) {
  return function(aff2) {
    return Aff.ParAlt(aff1, aff2);
  };
}
var makeAff = Aff.Async;
function generalBracket(acquire) {
  return function(options) {
    return function(k) {
      return Aff.Bracket(acquire, options, k);
    };
  };
}
function _makeFiber(util, aff) {
  return function() {
    return Aff.Fiber(util, null, aff);
  };
}
var _delay = function() {
  function setDelay(n, k) {
    if (n === 0 && typeof setImmediate !== "undefined") {
      return setImmediate(k);
    } else {
      return setTimeout(k, n);
    }
  }
  function clearDelay(n, t) {
    if (n === 0 && typeof clearImmediate !== "undefined") {
      return clearImmediate(t);
    } else {
      return clearTimeout(t);
    }
  }
  return function(right, ms) {
    return Aff.Async(function(cb) {
      return function() {
        var timer = setDelay(ms, cb(right()));
        return function() {
          return Aff.Sync(function() {
            return right(clearDelay(ms, timer));
          });
        };
      };
    });
  };
}();
var _sequential = Aff.Seq;

// output-es/Effect.Aff/index.js
var suspendAff = /* @__PURE__ */ _fork(false);
var functorAff = { map: _map };
var forkAff = /* @__PURE__ */ _fork(true);
var ffiUtil = {
  isLeft: (v) => {
    if (v.tag === 0) {
      return true;
    }
    if (v.tag === 1) {
      return false;
    }
    fail();
  },
  fromLeft: (v) => {
    if (v.tag === 0) {
      return v._1;
    }
    if (v.tag === 1) {
      return _crashWith("unsafeFromLeft: Right");
    }
    fail();
  },
  fromRight: (v) => {
    if (v.tag === 1) {
      return v._1;
    }
    if (v.tag === 0) {
      return _crashWith("unsafeFromRight: Left");
    }
    fail();
  },
  left: Left,
  right: Right
};
var monadAff = { Applicative0: () => applicativeAff, Bind1: () => bindAff };
var bindAff = { bind: _bind, Apply0: () => applyAff };
var applyAff = { apply: (f) => (a) => _bind(f)((f$p) => _bind(a)((a$p) => applicativeAff.pure(f$p(a$p)))), Functor0: () => functorAff };
var applicativeAff = { pure: _pure, Apply0: () => applyAff };
var $$finally = (fin) => (a) => generalBracket(_pure())({ killed: (v) => (v$1) => fin, failed: (v) => (v$1) => fin, completed: (v) => (v$1) => fin })((v) => a);
var monadEffectAff = { liftEffect: _liftEffect, Monad0: () => monadAff };
var joinFiber = (v) => makeAff((k) => {
  const $0 = v.join(k);
  return () => {
    const a$p = $0();
    const $1 = _liftEffect(a$p);
    return (v$1) => $1;
  };
});
var nonCanceler = /* @__PURE__ */ (() => {
  const $0 = _pure();
  return (v) => $0;
})();
var never = /* @__PURE__ */ makeAff((v) => () => nonCanceler);
var altAff = { alt: (a1) => (a2) => _catchError(a1)((v) => a2), Functor0: () => functorAff };
var plusAff = { empty: /* @__PURE__ */ _throwError(/* @__PURE__ */ error("Always fails")), Alt0: () => altAff };

// output-es/Effect.Console/foreign.js
var log2 = function(s) {
  return function() {
    console.log(s);
  };
};

// output-es/Node.Path/foreign.js
import path from "path";
var normalize = path.normalize;
function concat2(segments) {
  return path.join.apply(this, segments);
}
function resolve(from) {
  return (to) => () => path.resolve.apply(this, from.concat([to]));
}
var basename = path.basename;
var extname = path.extname;
var sep = path.sep;
var delimiter = path.delimiter;
var parse = path.parse;
var isAbsolute = path.isAbsolute;

// output-es/Data.Nullable/foreign.js
var nullImpl = null;
function nullable(a, r, f) {
  return a == null ? r : f(a);
}
function notNull(x) {
  return x;
}

// output-es/Data.Nullable/index.js
var showNullable = (dictShow) => ({
  show: (x) => {
    const $0 = nullable(x, Nothing, Just);
    if ($0.tag === 0) {
      return "null";
    }
    if ($0.tag === 1) {
      return dictShow.show($0._1);
    }
    fail();
  }
});

// output-es/Effect.Uncurried/foreign.js
var mkEffectFn1 = function mkEffectFn12(fn) {
  return function(x) {
    return fn(x)();
  };
};

// output-es/Foreign.Object/foreign.js
var empty = {};
function _foldM(bind2) {
  return function(f) {
    return function(mz) {
      return function(m) {
        var acc = mz;
        function g(k2) {
          return function(z) {
            return f(z)(k2)(m[k2]);
          };
        }
        for (var k in m) {
          if (hasOwnProperty.call(m, k)) {
            acc = bind2(acc)(g(k));
          }
        }
        return acc;
      };
    };
  };
}
function _lookup(no, yes, k, m) {
  return k in m ? yes(m[k]) : no;
}
function toArrayWithKey(f) {
  return function(m) {
    var r = [];
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r.push(f(k)(m[k]));
      }
    }
    return r;
  };
}
var keys = Object.keys || toArrayWithKey(function(k) {
  return function() {
    return k;
  };
});

// output-es/Foreign.Object/index.js
var mutate = (f) => (m) => {
  const s = { ...m };
  f(s)();
  return s;
};
var foldM = (dictMonad) => {
  const bind1 = dictMonad.Bind1().bind;
  return (f) => (z) => _foldM(bind1)(f)(dictMonad.Applicative0().pure(z));
};
var foldM1 = /* @__PURE__ */ foldM(monadST);
var union = (m) => mutate((s) => foldM1((s$p) => (k) => (v) => () => {
  s$p[k] = v;
  return s$p;
})(s)(m));
var fold2 = /* @__PURE__ */ _foldM(applyFlipped);

// output-es/Node.EventEmitter/foreign.js
import EventEmitter from "node:events";
var newImpl = function() {
  return new EventEmitter();
};
var unsafeEmitFn = (emitter) => emitter.emit.bind(emitter);
var listenerCountImpl = (emitter, eventName) => emitter.listenerCount(eventName);
var unsafeOff = (emitter, eventName, cb) => emitter.off(eventName, cb);
var unsafeOn = (emitter, eventName, cb) => emitter.on(eventName, cb);
var unsafeOnce = (emitter, eventName, cb) => emitter.once(eventName, cb);
var setMaxListenersImpl = (emitter, max3) => emitter.setMaxListeners(max3);

// output-es/Node.EventEmitter/index.js
var $EventHandle = (_1, _2) => ({ _1, _2 });
var subscribeSameFunction = (onXFn, eventEmitter, eventName, jsCb) => {
  onXFn(eventEmitter, eventName, jsCb);
  return () => unsafeOff(eventEmitter, eventName, jsCb);
};
var once = (v) => (psCb) => (eventEmitter) => {
  const $0 = v._1;
  const $1 = v._2(psCb);
  return () => subscribeSameFunction(unsafeOnce, eventEmitter, $0, $1);
};
var on = (v) => (psCb) => (eventEmitter) => {
  const $0 = v._1;
  const $1 = v._2(psCb);
  return () => subscribeSameFunction(unsafeOn, eventEmitter, $0, $1);
};

// output-es/Node.Platform/index.js
var $Platform = (tag) => tag;
var AIX = /* @__PURE__ */ $Platform(
  0
  /* AIX */
);
var Darwin = /* @__PURE__ */ $Platform(
  1
  /* Darwin */
);
var FreeBSD = /* @__PURE__ */ $Platform(
  2
  /* FreeBSD */
);
var Linux = /* @__PURE__ */ $Platform(
  3
  /* Linux */
);
var OpenBSD = /* @__PURE__ */ $Platform(
  4
  /* OpenBSD */
);
var SunOS = /* @__PURE__ */ $Platform(
  5
  /* SunOS */
);
var Win32 = /* @__PURE__ */ $Platform(
  6
  /* Win32 */
);
var Android = /* @__PURE__ */ $Platform(
  7
  /* Android */
);
var fromString2 = (v) => {
  if (v === "aix") {
    return $Maybe(1, AIX);
  }
  if (v === "darwin") {
    return $Maybe(1, Darwin);
  }
  if (v === "freebsd") {
    return $Maybe(1, FreeBSD);
  }
  if (v === "linux") {
    return $Maybe(1, Linux);
  }
  if (v === "openbsd") {
    return $Maybe(1, OpenBSD);
  }
  if (v === "sunos") {
    return $Maybe(1, SunOS);
  }
  if (v === "win32") {
    return $Maybe(1, Win32);
  }
  if (v === "android") {
    return $Maybe(1, Android);
  }
  return Nothing;
};

// output-es/Node.Process/foreign.js
import process from "process";
var abortImpl = process.abort ? () => process.abort() : null;
var argv = () => process.argv.slice();
var channelRefImpl = process.channel && process.channel.ref ? () => process.channel.ref() : null;
var channelUnrefImpl = process.channel && process.channel.unref ? () => process.channel.unref() : null;
var chdirImpl = (dir) => process.chdir(dir);
var cwd = () => process.cwd();
var debugPort = process.debugPort;
var disconnectImpl = process.disconnect ? () => process.disconnect() : null;
var getEnv = () => Object.assign({}, process.env);
var execPath = () => process.execPath;
var setExitCodeImpl = (code) => {
  process.exitCode = code;
};
var getExitCodeImpl = () => process.exitCode;
var getGidImpl = () => process.getgid();
var getUidImpl = () => process.getuid();
var killStrImpl = (pid2, sig) => process.kill(pid2, sig);
var pid = process.pid;
var platformStr = process.platform;
var ppid = process.ppid;
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;
var stdinIsTTY = process.stdinIsTTY;
var stdoutIsTTY = process.stdoutIsTTY;
var stderrIsTTY = process.stderrIsTTY;
var version = process.version;

// output-es/Node.Process/index.js
var identity9 = (x) => x;
var platform = /* @__PURE__ */ fromString2(platformStr);
var getUid = () => {
  const a$p = getUidImpl();
  return nullable(a$p, Nothing, Just);
};
var getGid = () => {
  const a$p = getGidImpl();
  return nullable(a$p, Nothing, Just);
};
var getExitCode = () => {
  const a$p = getExitCodeImpl();
  return nullable(a$p, Nothing, Just);
};

// output-es/Node.Encoding/index.js
var $Encoding = (tag) => tag;
var UTF8 = /* @__PURE__ */ $Encoding(
  1
  /* UTF8 */
);

// output-es/Data.Date.Component/index.js
var $Month = (tag) => tag;
var $Weekday = (tag) => tag;
var Monday = /* @__PURE__ */ $Weekday(
  0
  /* Monday */
);
var Tuesday = /* @__PURE__ */ $Weekday(
  1
  /* Tuesday */
);
var Wednesday = /* @__PURE__ */ $Weekday(
  2
  /* Wednesday */
);
var Thursday = /* @__PURE__ */ $Weekday(
  3
  /* Thursday */
);
var Friday = /* @__PURE__ */ $Weekday(
  4
  /* Friday */
);
var Saturday = /* @__PURE__ */ $Weekday(
  5
  /* Saturday */
);
var Sunday = /* @__PURE__ */ $Weekday(
  6
  /* Sunday */
);
var January = /* @__PURE__ */ $Month(
  0
  /* January */
);
var February = /* @__PURE__ */ $Month(
  1
  /* February */
);
var March = /* @__PURE__ */ $Month(
  2
  /* March */
);
var April = /* @__PURE__ */ $Month(
  3
  /* April */
);
var May = /* @__PURE__ */ $Month(
  4
  /* May */
);
var June = /* @__PURE__ */ $Month(
  5
  /* June */
);
var July = /* @__PURE__ */ $Month(
  6
  /* July */
);
var August = /* @__PURE__ */ $Month(
  7
  /* August */
);
var September = /* @__PURE__ */ $Month(
  8
  /* September */
);
var October = /* @__PURE__ */ $Month(
  9
  /* October */
);
var November = /* @__PURE__ */ $Month(
  10
  /* November */
);
var December = /* @__PURE__ */ $Month(
  11
  /* December */
);
var eqMonth = {
  eq: (x) => (y) => {
    if (x === 0) {
      return y === 0;
    }
    if (x === 1) {
      return y === 1;
    }
    if (x === 2) {
      return y === 2;
    }
    if (x === 3) {
      return y === 3;
    }
    if (x === 4) {
      return y === 4;
    }
    if (x === 5) {
      return y === 5;
    }
    if (x === 6) {
      return y === 6;
    }
    if (x === 7) {
      return y === 7;
    }
    if (x === 8) {
      return y === 8;
    }
    if (x === 9) {
      return y === 9;
    }
    if (x === 10) {
      return y === 10;
    }
    return x === 11 && y === 11;
  }
};
var ordMonth = {
  compare: (x) => (y) => {
    if (x === 0) {
      if (y === 0) {
        return EQ;
      }
      return LT;
    }
    if (y === 0) {
      return GT;
    }
    if (x === 1) {
      if (y === 1) {
        return EQ;
      }
      return LT;
    }
    if (y === 1) {
      return GT;
    }
    if (x === 2) {
      if (y === 2) {
        return EQ;
      }
      return LT;
    }
    if (y === 2) {
      return GT;
    }
    if (x === 3) {
      if (y === 3) {
        return EQ;
      }
      return LT;
    }
    if (y === 3) {
      return GT;
    }
    if (x === 4) {
      if (y === 4) {
        return EQ;
      }
      return LT;
    }
    if (y === 4) {
      return GT;
    }
    if (x === 5) {
      if (y === 5) {
        return EQ;
      }
      return LT;
    }
    if (y === 5) {
      return GT;
    }
    if (x === 6) {
      if (y === 6) {
        return EQ;
      }
      return LT;
    }
    if (y === 6) {
      return GT;
    }
    if (x === 7) {
      if (y === 7) {
        return EQ;
      }
      return LT;
    }
    if (y === 7) {
      return GT;
    }
    if (x === 8) {
      if (y === 8) {
        return EQ;
      }
      return LT;
    }
    if (y === 8) {
      return GT;
    }
    if (x === 9) {
      if (y === 9) {
        return EQ;
      }
      return LT;
    }
    if (y === 9) {
      return GT;
    }
    if (x === 10) {
      if (y === 10) {
        return EQ;
      }
      return LT;
    }
    if (y === 10) {
      return GT;
    }
    if (x === 11 && y === 11) {
      return EQ;
    }
    fail();
  },
  Eq0: () => eqMonth
};
var boundedMonth = { bottom: January, top: December, Ord0: () => ordMonth };
var boundedEnumMonth = {
  cardinality: 12,
  toEnum: (v) => {
    if (v === 1) {
      return $Maybe(1, January);
    }
    if (v === 2) {
      return $Maybe(1, February);
    }
    if (v === 3) {
      return $Maybe(1, March);
    }
    if (v === 4) {
      return $Maybe(1, April);
    }
    if (v === 5) {
      return $Maybe(1, May);
    }
    if (v === 6) {
      return $Maybe(1, June);
    }
    if (v === 7) {
      return $Maybe(1, July);
    }
    if (v === 8) {
      return $Maybe(1, August);
    }
    if (v === 9) {
      return $Maybe(1, September);
    }
    if (v === 10) {
      return $Maybe(1, October);
    }
    if (v === 11) {
      return $Maybe(1, November);
    }
    if (v === 12) {
      return $Maybe(1, December);
    }
    return Nothing;
  },
  fromEnum: (v) => {
    if (v === 0) {
      return 1;
    }
    if (v === 1) {
      return 2;
    }
    if (v === 2) {
      return 3;
    }
    if (v === 3) {
      return 4;
    }
    if (v === 4) {
      return 5;
    }
    if (v === 5) {
      return 6;
    }
    if (v === 6) {
      return 7;
    }
    if (v === 7) {
      return 8;
    }
    if (v === 8) {
      return 9;
    }
    if (v === 9) {
      return 10;
    }
    if (v === 10) {
      return 11;
    }
    if (v === 11) {
      return 12;
    }
    fail();
  },
  Bounded0: () => boundedMonth,
  Enum1: () => enumMonth
};
var enumMonth = {
  succ: (x) => boundedEnumMonth.toEnum((() => {
    if (x === 0) {
      return 2;
    }
    if (x === 1) {
      return 3;
    }
    if (x === 2) {
      return 4;
    }
    if (x === 3) {
      return 5;
    }
    if (x === 4) {
      return 6;
    }
    if (x === 5) {
      return 7;
    }
    if (x === 6) {
      return 8;
    }
    if (x === 7) {
      return 9;
    }
    if (x === 8) {
      return 10;
    }
    if (x === 9) {
      return 11;
    }
    if (x === 10) {
      return 12;
    }
    if (x === 11) {
      return 13;
    }
    fail();
  })()),
  pred: (x) => boundedEnumMonth.toEnum((() => {
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    if (x === 2) {
      return 2;
    }
    if (x === 3) {
      return 3;
    }
    if (x === 4) {
      return 4;
    }
    if (x === 5) {
      return 5;
    }
    if (x === 6) {
      return 6;
    }
    if (x === 7) {
      return 7;
    }
    if (x === 8) {
      return 8;
    }
    if (x === 9) {
      return 9;
    }
    if (x === 10) {
      return 10;
    }
    if (x === 11) {
      return 11;
    }
    fail();
  })()),
  Ord0: () => ordMonth
};

// output-es/Data.Date/foreign.js
var createDate = function(y, m, d) {
  var date = new Date(Date.UTC(y, m, d));
  if (y >= 0 && y < 100) {
    date.setUTCFullYear(y);
  }
  return date;
};
function canonicalDateImpl(ctor, y, m, d) {
  var date = createDate(y, m - 1, d);
  return ctor(date.getUTCFullYear())(date.getUTCMonth() + 1)(date.getUTCDate());
}

// output-es/Data.Date/index.js
var $$$Date = (_1, _2, _3) => ({ _1, _2, _3 });
var eqDate = {
  eq: (x) => (y) => x._1 === y._1 && (() => {
    if (x._2 === 0) {
      return y._2 === 0;
    }
    if (x._2 === 1) {
      return y._2 === 1;
    }
    if (x._2 === 2) {
      return y._2 === 2;
    }
    if (x._2 === 3) {
      return y._2 === 3;
    }
    if (x._2 === 4) {
      return y._2 === 4;
    }
    if (x._2 === 5) {
      return y._2 === 5;
    }
    if (x._2 === 6) {
      return y._2 === 6;
    }
    if (x._2 === 7) {
      return y._2 === 7;
    }
    if (x._2 === 8) {
      return y._2 === 8;
    }
    if (x._2 === 9) {
      return y._2 === 9;
    }
    if (x._2 === 10) {
      return y._2 === 10;
    }
    return x._2 === 11 && y._2 === 11;
  })() && x._3 === y._3
};
var ordDate = {
  compare: (x) => (y) => {
    const v = ordInt.compare(x._1)(y._1);
    if (v === 0) {
      return LT;
    }
    if (v === 1) {
      return GT;
    }
    const v1 = ordMonth.compare(x._2)(y._2);
    if (v1 === 0) {
      return LT;
    }
    if (v1 === 1) {
      return GT;
    }
    return ordInt.compare(x._3)(y._3);
  },
  Eq0: () => eqDate
};
var canonicalDate = (y) => (m) => (d) => canonicalDateImpl(
  (y$p) => (m$p) => (d$p) => $$$Date(
    y$p,
    (() => {
      const $0 = boundedEnumMonth.toEnum(m$p);
      if ($0.tag === 1) {
        return $0._1;
      }
      fail();
    })(),
    d$p
  ),
  y,
  (() => {
    if (m === 0) {
      return 1;
    }
    if (m === 1) {
      return 2;
    }
    if (m === 2) {
      return 3;
    }
    if (m === 3) {
      return 4;
    }
    if (m === 4) {
      return 5;
    }
    if (m === 5) {
      return 6;
    }
    if (m === 6) {
      return 7;
    }
    if (m === 7) {
      return 8;
    }
    if (m === 8) {
      return 9;
    }
    if (m === 9) {
      return 10;
    }
    if (m === 10) {
      return 11;
    }
    if (m === 11) {
      return 12;
    }
    fail();
  })(),
  d
);

// output-es/Data.Time/index.js
var $Time = (_1, _2, _3, _4) => ({ _1, _2, _3, _4 });
var eqTime = { eq: (x) => (y) => x._1 === y._1 && x._2 === y._2 && x._3 === y._3 && x._4 === y._4 };
var ordTime = {
  compare: (x) => (y) => {
    const v = ordInt.compare(x._1)(y._1);
    if (v === 0) {
      return LT;
    }
    if (v === 1) {
      return GT;
    }
    const v1 = ordInt.compare(x._2)(y._2);
    if (v1 === 0) {
      return LT;
    }
    if (v1 === 1) {
      return GT;
    }
    const v2 = ordInt.compare(x._3)(y._3);
    if (v2 === 0) {
      return LT;
    }
    if (v2 === 1) {
      return GT;
    }
    return ordInt.compare(x._4)(y._4);
  },
  Eq0: () => eqTime
};

// output-es/Data.DateTime/index.js
var $DateTime = (_1, _2) => ({ _1, _2 });
var DateTime = (value0) => (value1) => $DateTime(value0, value1);
var eqDateTime = { eq: (x) => (y) => eqDate.eq(x._1)(y._1) && x._2._1 === y._2._1 && x._2._2 === y._2._2 && x._2._3 === y._2._3 && x._2._4 === y._2._4 };
var ordDateTime = {
  compare: (x) => (y) => {
    const v = ordDate.compare(x._1)(y._1);
    if (v === 0) {
      return LT;
    }
    if (v === 1) {
      return GT;
    }
    return ordTime.compare(x._2)(y._2);
  },
  Eq0: () => eqDateTime
};

// output-es/Data.DateTime.Instant/foreign.js
function toDateTimeImpl(ctor) {
  return function(instant) {
    var dt = new Date(instant);
    return ctor(dt.getUTCFullYear())(dt.getUTCMonth() + 1)(dt.getUTCDate())(dt.getUTCHours())(dt.getUTCMinutes())(dt.getUTCSeconds())(dt.getUTCMilliseconds());
  };
}

// output-es/Data.DateTime.Instant/index.js
var toDateTime = /* @__PURE__ */ toDateTimeImpl((y) => (mo) => (d) => (h) => (mi) => (s) => (ms) => $DateTime(
  canonicalDate(y)((() => {
    const $0 = boundedEnumMonth.toEnum(mo);
    if ($0.tag === 1) {
      return $0._1;
    }
    fail();
  })())(d),
  $Time(h, mi, s, ms)
));

// output-es/Node.Buffer.Immutable/foreign.js
import { Buffer as Buffer2 } from "node:buffer";
var alloc = (size3) => Buffer2.alloc(size3);
var size2 = (buff) => buff.length;
var fromStringImpl2 = (str, encoding) => Buffer2.from(str, encoding);
var readImpl = (ty, offset, buf) => buf["read" + ty](offset);
var toStringImpl = (enc, buff) => buff.toString(enc);
var sliceImpl2 = (start, end, buff) => buff.slice(start, end);
var concatToLength = (buffs, totalLength) => Buffer2.concat(buffs, totalLength);

// output-es/Node.Buffer.Immutable/index.js
var toString2 = (enc) => (buf) => toStringImpl(
  (() => {
    if (enc === 0) {
      return "ascii";
    }
    if (enc === 1) {
      return "utf8";
    }
    if (enc === 2) {
      return "utf16le";
    }
    if (enc === 3) {
      return "ucs2";
    }
    if (enc === 4) {
      return "base64";
    }
    if (enc === 5) {
      return "base64url";
    }
    if (enc === 6) {
      return "latin1";
    }
    if (enc === 7) {
      return "binary";
    }
    if (enc === 8) {
      return "hex";
    }
    fail();
  })(),
  buf
);
var read2 = (ty) => (off) => (buf) => readImpl(
  (() => {
    if (ty === 0) {
      return "UInt8";
    }
    if (ty === 1) {
      return "UInt16LE";
    }
    if (ty === 2) {
      return "UInt16BE";
    }
    if (ty === 3) {
      return "UInt32LE";
    }
    if (ty === 4) {
      return "UInt32BE";
    }
    if (ty === 5) {
      return "Int8";
    }
    if (ty === 6) {
      return "Int16LE";
    }
    if (ty === 7) {
      return "Int16BE";
    }
    if (ty === 8) {
      return "Int32LE";
    }
    if (ty === 9) {
      return "Int32BE";
    }
    if (ty === 10) {
      return "FloatLE";
    }
    if (ty === 11) {
      return "FloatBE";
    }
    if (ty === 12) {
      return "DoubleLE";
    }
    if (ty === 13) {
      return "DoubleBE";
    }
    fail();
  })(),
  off,
  buf
);
var fromString3 = (str) => (enc) => fromStringImpl2(
  str,
  (() => {
    if (enc === 0) {
      return "ascii";
    }
    if (enc === 1) {
      return "utf8";
    }
    if (enc === 2) {
      return "utf16le";
    }
    if (enc === 3) {
      return "ucs2";
    }
    if (enc === 4) {
      return "base64";
    }
    if (enc === 5) {
      return "base64url";
    }
    if (enc === 6) {
      return "latin1";
    }
    if (enc === 7) {
      return "binary";
    }
    if (enc === 8) {
      return "hex";
    }
    fail();
  })()
);

// output-es/Node.FS.Constants/foreign.js
import { constants } from "node:fs";
var f_OK = constants.F_OK;
var r_OK = constants.R_OK;
var w_OK = constants.W_OK;
var x_OK = constants.X_OK;
var copyFile_EXCL = constants.COPYFILE_EXCL;
var copyFile_FICLONE = constants.COPYFILE_FICLONE;
var copyFile_FICLONE_FORCE = constants.COPYFILE_FICLONE_FORCE;

// output-es/Node.FS.Constants/index.js
var $FileFlags = (tag) => tag;
var R = /* @__PURE__ */ $FileFlags(
  0
  /* R */
);

// output-es/Node.FS.Perms/index.js
var semiringPerm = {
  add: (v) => (v1) => ({ r: v.r || v1.r, w: v.w || v1.w, x: v.x || v1.x }),
  zero: { r: false, w: false, x: false },
  mul: (v) => (v1) => ({ r: v.r && v1.r, w: v.w && v1.w, x: v.x && v1.x }),
  one: { r: true, w: true, x: true }
};
var permToString = (x) => showIntImpl(((x.r ? 4 : 0) + (x.w ? 2 : 0) | 0) + (x.x ? 1 : 0) | 0);
var permsToString = (v) => "0" + permToString(v.u) + permToString(v.g) + permToString(v.o);
var permsAll = /* @__PURE__ */ (() => ({ u: semiringPerm.one, g: semiringPerm.one, o: semiringPerm.one }))();

// output-es/Node.FS.Async/foreign.js
import {
  access,
  copyFile,
  mkdtemp,
  rename,
  truncate,
  chown,
  chmod,
  stat,
  lstat,
  link,
  symlink,
  readlink,
  realpath,
  unlink,
  rmdir,
  rm,
  mkdir,
  readdir,
  utimes,
  readFile,
  writeFile,
  appendFile,
  open,
  read as read3,
  write as write2,
  close
} from "node:fs";

// output-es/Node.FS.Async/index.js
var handleCallback = (cb) => (err, a) => {
  const v = nullable(err, Nothing, Just);
  if (v.tag === 0) {
    return cb($Either(1, a))();
  }
  if (v.tag === 1) {
    return cb($Either(0, v._1))();
  }
  fail();
};
var mkdir$p = (file) => (v) => (cb) => {
  const $0 = { recursive: v.recursive, mode: permsToString(v.mode) };
  return () => mkdir(file, $0, handleCallback(cb));
};
var readTextFile = (encoding) => (file) => (cb) => {
  const $0 = {
    encoding: (() => {
      if (encoding === 0) {
        return "ASCII";
      }
      if (encoding === 1) {
        return "UTF8";
      }
      if (encoding === 2) {
        return "UTF16LE";
      }
      if (encoding === 3) {
        return "UCS2";
      }
      if (encoding === 4) {
        return "Base64";
      }
      if (encoding === 5) {
        return "Base64Url";
      }
      if (encoding === 6) {
        return "Latin1";
      }
      if (encoding === 7) {
        return "Binary";
      }
      if (encoding === 8) {
        return "Hex";
      }
      fail();
    })()
  };
  return () => readFile(file, $0, handleCallback(cb));
};
var readdir2 = (file) => (cb) => () => readdir(file, handleCallback(cb));
var writeTextFile = (encoding) => (file) => (buff) => (cb) => {
  const $0 = {
    encoding: (() => {
      if (encoding === 0) {
        return "ASCII";
      }
      if (encoding === 1) {
        return "UTF8";
      }
      if (encoding === 2) {
        return "UTF16LE";
      }
      if (encoding === 3) {
        return "UCS2";
      }
      if (encoding === 4) {
        return "Base64";
      }
      if (encoding === 5) {
        return "Base64Url";
      }
      if (encoding === 6) {
        return "Latin1";
      }
      if (encoding === 7) {
        return "Binary";
      }
      if (encoding === 8) {
        return "Hex";
      }
      fail();
    })()
  };
  return () => writeFile(file, buff, $0, handleCallback(cb));
};

// output-es/Node.FS.Aff/index.js
var toAff1 = (f) => (a) => {
  const $0 = f(a);
  return makeAff((k) => {
    const $1 = $0(k);
    return () => {
      $1();
      return nonCanceler;
    };
  });
};
var toAff2 = (f) => (a) => (b) => {
  const $0 = f(a)(b);
  return makeAff((k) => {
    const $1 = $0(k);
    return () => {
      $1();
      return nonCanceler;
    };
  });
};
var toAff3 = (f) => (a) => (b) => (c) => {
  const $0 = f(a)(b)(c);
  return makeAff((k) => {
    const $1 = $0(k);
    return () => {
      $1();
      return nonCanceler;
    };
  });
};

// output-es/Node.FS.Sync/foreign.js
import {
  accessSync,
  copyFileSync,
  mkdtempSync,
  renameSync,
  truncateSync,
  chownSync,
  chmodSync,
  statSync,
  lstatSync,
  linkSync,
  symlinkSync,
  readlinkSync,
  realpathSync,
  unlinkSync,
  rmdirSync,
  rmSync,
  mkdirSync,
  readdirSync,
  utimesSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
  existsSync,
  openSync,
  readSync,
  writeSync,
  fsyncSync,
  closeSync
} from "node:fs";

// output-es/Node.FS.Sync/index.js
var fdRead2 = (fd) => (buff) => (off) => (len) => (pos) => {
  const $0 = (() => {
    if (pos.tag === 0) {
      return nullImpl;
    }
    if (pos.tag === 1) {
      return notNull(pos._1);
    }
    fail();
  })();
  return () => readSync(fd, buff, off, len, $0);
};
var fdOpen2 = (file) => (flags) => (mode) => {
  const $0 = (() => {
    if (flags === 0) {
      return "r";
    }
    if (flags === 1) {
      return "r+";
    }
    if (flags === 2) {
      return "rs";
    }
    if (flags === 3) {
      return "rs+";
    }
    if (flags === 4) {
      return "w";
    }
    if (flags === 5) {
      return "wx";
    }
    if (flags === 6) {
      return "w+";
    }
    if (flags === 7) {
      return "wx+";
    }
    if (flags === 8) {
      return "a";
    }
    if (flags === 9) {
      return "ax";
    }
    if (flags === 10) {
      return "a+";
    }
    if (flags === 11) {
      return "ax+";
    }
    fail();
  })();
  const $1 = (() => {
    if (mode.tag === 0) {
      return nullImpl;
    }
    if (mode.tag === 1) {
      return notNull(mode._1);
    }
    fail();
  })();
  return () => openSync(file, $0, $1);
};

// output-es/Control.Monad.Reader.Trans/index.js
var bindReaderT = (dictBind) => {
  const $0 = dictBind.Apply0();
  const $1 = $0.Functor0();
  const applyReaderT1 = (() => {
    const functorReaderT1 = {
      map: (x) => {
        const $2 = $1.map(x);
        return (v) => (x$1) => $2(v(x$1));
      }
    };
    return { apply: (v) => (v1) => (r) => $0.apply(v(r))(v1(r)), Functor0: () => functorReaderT1 };
  })();
  return { bind: (v) => (k) => (r) => dictBind.bind(v(r))((a) => k(a)(r)), Apply0: () => applyReaderT1 };
};
var monadReaderT = (dictMonad) => {
  const $0 = dictMonad.Applicative0();
  const $1 = $0.Apply0();
  const applicativeReaderT1 = (() => {
    const $2 = $1.Functor0();
    const functorReaderT1 = {
      map: (x) => {
        const $3 = $2.map(x);
        return (v) => (x$1) => $3(v(x$1));
      }
    };
    const applyReaderT1 = { apply: (v) => (v1) => (r) => $1.apply(v(r))(v1(r)), Functor0: () => functorReaderT1 };
    return {
      pure: (x) => {
        const $3 = $0.pure(x);
        return (v) => $3;
      },
      Apply0: () => applyReaderT1
    };
  })();
  const bindReaderT1 = bindReaderT(dictMonad.Bind1());
  return { Applicative0: () => applicativeReaderT1, Bind1: () => bindReaderT1 };
};
var monadEffectReader = (dictMonadEffect) => {
  const monadReaderT1 = monadReaderT(dictMonadEffect.Monad0());
  return {
    liftEffect: (x) => {
      const $0 = dictMonadEffect.liftEffect(x);
      return (v) => $0;
    },
    Monad0: () => monadReaderT1
  };
};

// output-es/Control.Monad.Except.Trans/index.js
var bindExceptT = (dictMonad) => ({
  bind: (v) => (k) => dictMonad.Bind1().bind(v)((v2) => {
    if (v2.tag === 0) {
      return dictMonad.Applicative0().pure($Either(0, v2._1));
    }
    if (v2.tag === 1) {
      return k(v2._1);
    }
    fail();
  }),
  Apply0: () => applyExceptT(dictMonad)
});
var applyExceptT = (dictMonad) => {
  const $0 = dictMonad.Bind1().Apply0().Functor0();
  const functorExceptT1 = {
    map: (f) => $0.map((m) => {
      if (m.tag === 0) {
        return $Either(0, m._1);
      }
      if (m.tag === 1) {
        return $Either(1, f(m._1));
      }
      fail();
    })
  };
  return {
    apply: (() => {
      const $1 = bindExceptT(dictMonad);
      return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeExceptT(dictMonad).pure(f$p(a$p))));
    })(),
    Functor0: () => functorExceptT1
  };
};
var applicativeExceptT = (dictMonad) => ({ pure: (x) => dictMonad.Applicative0().pure($Either(1, x)), Apply0: () => applyExceptT(dictMonad) });
var monadThrowExceptT = (dictMonad) => {
  const monadExceptT1 = { Applicative0: () => applicativeExceptT(dictMonad), Bind1: () => bindExceptT(dictMonad) };
  return { throwError: (x) => dictMonad.Applicative0().pure($Either(0, x)), Monad0: () => monadExceptT1 };
};

// output-es/Control.Monad.State.Trans/index.js
var bindStateT = (dictMonad) => ({ bind: (v) => (f) => (s) => dictMonad.Bind1().bind(v(s))((v1) => f(v1._1)(v1._2)), Apply0: () => applyStateT(dictMonad) });
var applyStateT = (dictMonad) => {
  const $0 = dictMonad.Bind1().Apply0().Functor0();
  const functorStateT1 = { map: (f) => (v) => (s) => $0.map((v1) => $Tuple(f(v1._1), v1._2))(v(s)) };
  return {
    apply: (() => {
      const $1 = bindStateT(dictMonad);
      return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeStateT(dictMonad).pure(f$p(a$p))));
    })(),
    Functor0: () => functorStateT1
  };
};
var applicativeStateT = (dictMonad) => ({ pure: (a) => (s) => dictMonad.Applicative0().pure($Tuple(a, s)), Apply0: () => applyStateT(dictMonad) });
var monadRecStateT = (dictMonadRec) => {
  const Monad0 = dictMonadRec.Monad0();
  const monadStateT1 = { Applicative0: () => applicativeStateT(Monad0), Bind1: () => bindStateT(Monad0) };
  return {
    tailRecM: (f) => (a) => (s) => dictMonadRec.tailRecM((v) => Monad0.Bind1().bind(f(v._1)(v._2))((v2) => Monad0.Applicative0().pure((() => {
      if (v2._1.tag === 0) {
        return $Step(0, $Tuple(v2._1._1, v2._2));
      }
      if (v2._1.tag === 1) {
        return $Step(1, $Tuple(v2._1._1, v2._2));
      }
      fail();
    })())))($Tuple(a, s)),
    Monad0: () => monadStateT1
  };
};
var monadStateStateT = (dictMonad) => {
  const monadStateT1 = { Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) };
  return { state: (f) => (x) => dictMonad.Applicative0().pure(f(x)), Monad0: () => monadStateT1 };
};

// output-es/Effect.Aff.Class/index.js
var monadAffAff = { liftAff: (x) => x, MonadEffect0: () => monadEffectAff };
var monadAffReader = (dictMonadAff) => {
  const monadEffectReader2 = monadEffectReader(dictMonadAff.MonadEffect0());
  return {
    liftAff: (x) => {
      const $0 = dictMonadAff.liftAff(x);
      return (v) => $0;
    },
    MonadEffect0: () => monadEffectReader2
  };
};

// output-es/UpChangelog.App/index.js
var monadEffectApp = /* @__PURE__ */ monadEffectReader(monadEffectAff);
var monadAskEnvApp = /* @__PURE__ */ (() => {
  const monadReaderT1 = monadReaderT(monadAff);
  return { ask: _pure, Monad0: () => monadReaderT1 };
})();
var monadAffApp = /* @__PURE__ */ monadAffReader(monadAffAff);
var monadApp = /* @__PURE__ */ monadReaderT(monadAff);
var bindApp = /* @__PURE__ */ bindReaderT(bindAff);
var logDebug = (msg) => bindApp.bind(monadAskEnvApp.ask)((env) => monadEffectApp.liftEffect(env.logger.logDebug(msg)));
var logError = (msg) => bindApp.bind(monadAskEnvApp.ask)((env) => monadEffectApp.liftEffect(env.logger.logError(msg)));
var logInfo = (msg) => bindApp.bind(monadAskEnvApp.ask)((env) => monadEffectApp.liftEffect(env.logger.logInfo(msg)));
var applicativeApp = /* @__PURE__ */ (() => {
  const functorReaderT1 = {
    map: (x) => {
      const $0 = _map(x);
      return (v) => (x$1) => $0(v(x$1));
    }
  };
  const applyReaderT1 = { apply: (v) => (v1) => (r) => applyAff.apply(v(r))(v1(r)), Functor0: () => functorReaderT1 };
  return {
    pure: (x) => {
      const $0 = _pure(x);
      return (v) => $0;
    },
    Apply0: () => applyReaderT1
  };
})();

// output-es/UpChangelog.Constants/index.js
var readmeContent = /* @__PURE__ */ (() => {
  const $0 = "\n# About\n\nThis directory contains changelog entries for work that has not yet been\nreleased. When a release goes out, these files will be concatenated and\nprepended to `CHANGELOG.md` in a new section for that release.\n\n## For Maintainers\n\nSee https://github.com/JordanMartinez/purescript-up-changelog for details of this process.\n\n## For Contributors\n\nWhen making a new PR, do the following steps. Each is described in the sections that follow:\n1. Add a new file to this directory where the file name follows the naming convention described below\n1. Fill that file with the proper content\n\nTo ensure you're doing it correctly, see the [Checklist](#checklist)\n\n### File Naming Convention\n\nThe file should be named `{PREFIX}_{SLUG}.md`.\n\n`{PREFIX}` is one of the following:\n* `breaking`: for breaking changes\n* `feature`: for new features\n* `fix`: for bug fixes\n* `internal`: for work that will not directly affect users of the project\n* `misc`: for anything else that needs to be logged\n\n`{SLUG}` should be a short description of the work you've done. The name has no\nimpact on the final CHANGELOG.md.\n\nSome example names:\n* `fix_issue-9876.md`\n* `breaking_deprecate-classes.md`\n* `misc_add-forum-to-readme.md`\n\n### File Contents\n\nThe contents of the file can be as brief as:\n\n```markdown\n* A short message, like the title of your commit\n```\n\nPlease remember the initial `*`! These files will all be concatenated into\nlists.\n\nIf you have more to say about your work, indent additional lines like so:\n\n``````markdown\n* A short message, like the title of your commit\n\n  Here is a longer explanation of what this is all about. Of course, this file\n  is Markdown, so feel free to use *formatting*\n\n  ```\n  and code blocks\n  ```\n\n  if it makes your work more understandable.\n``````\n\nYou do not have to edit your changelog file to include a reference to your PR.\nThe `CHANGELOG.md` updating script will do this automatically and credit you.\n\n### Checklist\n\nUse this checklist to help you remember to do everything described above.\n\n- [ ] A new file has been added to `CHANGELOG.d`\n- [ ] The file name starts with one of the `{PREFIX}` values above.\n- [ ] The file's content does not reference the PR number that introduces it\n- [ ] The file's first line (i.e. title line) starts with `* ` followed by a short description\n- If the file contains content after the first line (i.e. body part):\n    - [ ] the file has a blank line separating the title line from the body part\n    - [ ] each line in the body part is indented by at least two spaces\n";
  return drop(length2(take2(1)($0)))($0);
})();
var changelogContent = /* @__PURE__ */ (() => {
  const $0 = "\n# Changelog\n\nNotable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). This file is updated via [purs-changelog](https://github.com/JordanMartinez/purescript-up-changelog)\n\n## 0.0.0\n\nRan `purs-changelog`\n";
  return drop(length2(take2(1)($0)))($0);
})();

// output-es/Data.Map.Internal/index.js
var $$$Map = (tag, _1, _2, _3, _4, _5, _6) => ({ tag, _1, _2, _3, _4, _5, _6 });
var Leaf2 = /* @__PURE__ */ $$$Map(
  0
  /* Leaf */
);
var unsafeNode = (k, v, l, r) => {
  if (l.tag === 0) {
    if (r.tag === 0) {
      return $$$Map(1, 1, 1, k, v, l, r);
    }
    if (r.tag === 1) {
      return $$$Map(1, 1 + r._1 | 0, 1 + r._2 | 0, k, v, l, r);
    }
    fail();
  }
  if (l.tag === 1) {
    if (r.tag === 0) {
      return $$$Map(1, 1 + l._1 | 0, 1 + l._2 | 0, k, v, l, r);
    }
    if (r.tag === 1) {
      return $$$Map(1, l._1 > r._1 ? 1 + l._1 | 0 : 1 + r._1 | 0, (1 + l._2 | 0) + r._2 | 0, k, v, l, r);
    }
  }
  fail();
};
var unsafeBalancedNode = (k, v, l, r) => {
  if (l.tag === 0) {
    if (r.tag === 0) {
      return $$$Map(1, 1, 1, k, v, Leaf2, Leaf2);
    }
    if (r.tag === 1 && r._1 > 1) {
      if (r._5.tag === 1 && (() => {
        if (r._6.tag === 0) {
          return r._5._1 > 0;
        }
        if (r._6.tag === 1) {
          return r._5._1 > r._6._1;
        }
        fail();
      })()) {
        return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
      }
      return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
    }
    return unsafeNode(k, v, l, r);
  }
  if (l.tag === 1) {
    if (r.tag === 1) {
      if (r._1 > (l._1 + 1 | 0)) {
        if (r._5.tag === 1 && (() => {
          if (r._6.tag === 0) {
            return r._5._1 > 0;
          }
          if (r._6.tag === 1) {
            return r._5._1 > r._6._1;
          }
          fail();
        })()) {
          return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
        }
        return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
      }
      if (l._1 > (r._1 + 1 | 0)) {
        if (l._6.tag === 1 && (() => {
          if (l._5.tag === 0) {
            return 0 <= l._6._1;
          }
          if (l._5.tag === 1) {
            return l._5._1 <= l._6._1;
          }
          fail();
        })()) {
          return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
        }
        return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
      }
      return unsafeNode(k, v, l, r);
    }
    if (r.tag === 0 && l._1 > 1) {
      if (l._6.tag === 1 && (() => {
        if (l._5.tag === 0) {
          return 0 <= l._6._1;
        }
        if (l._5.tag === 1) {
          return l._5._1 <= l._6._1;
        }
        fail();
      })()) {
        return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
      }
      return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
    }
    return unsafeNode(k, v, l, r);
  }
  fail();
};
var lookup = (dictOrd) => (k) => {
  const go = (go$a0$copy) => {
    let go$a0 = go$a0$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0;
      if (v.tag === 0) {
        go$c = false;
        go$r = Nothing;
        continue;
      }
      if (v.tag === 1) {
        const v1 = dictOrd.compare(k)(v._3);
        if (v1 === 0) {
          go$a0 = v._5;
          continue;
        }
        if (v1 === 1) {
          go$a0 = v._6;
          continue;
        }
        if (v1 === 2) {
          go$c = false;
          go$r = $Maybe(1, v._4);
          continue;
        }
      }
      fail();
    }
    return go$r;
  };
  return go;
};
var insert = (dictOrd) => (k) => (v) => {
  const go = (v1) => {
    if (v1.tag === 0) {
      return $$$Map(1, 1, 1, k, v, Leaf2, Leaf2);
    }
    if (v1.tag === 1) {
      const v2 = dictOrd.compare(k)(v1._3);
      if (v2 === 0) {
        return unsafeBalancedNode(v1._3, v1._4, go(v1._5), v1._6);
      }
      if (v2 === 1) {
        return unsafeBalancedNode(v1._3, v1._4, v1._5, go(v1._6));
      }
      if (v2 === 2) {
        return $$$Map(1, v1._1, v1._2, k, v, v1._5, v1._6);
      }
    }
    fail();
  };
  return go;
};
var fromFoldable2 = (dictOrd) => (dictFoldable) => dictFoldable.foldl((m) => (v) => insert(dictOrd)(v._1)(v._2)(m))(Leaf2);

// output-es/Data.String.Regex.Unsafe/index.js
var unsafeRegex = (s) => (f) => {
  const $0 = regex(s)(f);
  if ($0.tag === 0) {
    return _crashWith($0._1);
  }
  if ($0.tag === 1) {
    return $0._1;
  }
  fail();
};

// output-es/Effect.Timer/foreign.js
function setTimeoutImpl(ms) {
  return function(fn) {
    return function() {
      return setTimeout(fn, ms);
    };
  };
}
function clearTimeoutImpl(id2) {
  return function() {
    clearTimeout(id2);
  };
}

// output-es/Node.ChildProcess.Types/foreign.js
var showKillSignal = (ks) => ks + "";
var fromKillSignalImpl = (fromInt, fromStr, sig) => {
  const ty = typeof sig;
  if (ty === "number")
    return fromInt(sig | 0);
  if (ty === "string")
    return fromStr(sig);
  throw new Error("Impossible. Got kill signal that was neither int nor string: " + sig);
};

// output-es/Node.ChildProcess.Types/index.js
var $Exit = (tag, _1) => ({ tag, _1 });
var fromKillSignal$p = (fromInt) => (fromStr) => (sig) => fromKillSignalImpl(fromInt, fromStr, sig);
var showExit = {
  show: (v) => {
    if (v.tag === 0) {
      return "Normally " + showIntImpl(v._1);
    }
    if (v.tag === 1) {
      const $0 = fromKillSignalImpl(Left, Right, v._1);
      if ($0.tag === 0) {
        return "BySignal " + showIntImpl($0._1);
      }
      if ($0.tag === 1) {
        return "BySignal " + showStringImpl($0._1);
      }
    }
    fail();
  }
};

// output-es/Node.UnsafeChildProcess.Safe/foreign.js
var connectedImpl = (cp) => cp.connected;
var disconnectImpl2 = (cp) => cp.disconnect();
var exitCodeImpl = (cp) => cp.exitCode;
var pidImpl = (cp) => cp.pid;
var killImpl2 = (cp) => cp.kill();
var killStrImpl2 = (cp, str) => cp.kill(str);
var killedImpl = (cp) => cp.killed;
var refImpl = (cp) => cp.ref();
var unrefImpl = (cp) => cp.unref();
var signalCodeImpl = (cp) => cp.signalCode;
var spawnArgs = (cp) => cp.spawnArgs;
var spawnFile = (cp) => cp.spawnFile;

// output-es/Node.UnsafeChildProcess.Safe/index.js
var identity10 = (x) => x;
var show = /* @__PURE__ */ (() => showNullable(showInt).show)();
var exitH = /* @__PURE__ */ $EventHandle(
  "exit",
  (cb) => (code, signal) => {
    const v = nullable(signal, Nothing, Just);
    const v1 = nullable(code, Nothing, Just);
    if (v1.tag === 1) {
      return cb($Exit(0, v1._1))();
    }
    if (v.tag === 1) {
      return cb($Exit(1, v._1))();
    }
    return _crashWith("Impossible. 'exit' event did not get an exit code or kill signal: " + show(code) + "; " + signal)();
  }
);

// output-es/Node.UnsafeChildProcess.Unsafe/foreign.js
import {
  exec,
  exec as exec2,
  exec as exec3,
  exec as exec4,
  execFile,
  execFile as execFile2,
  execFile as execFile3,
  execFile as execFile4,
  spawn,
  spawn as spawn2,
  execSync,
  execSync as execSync2,
  execFileSync,
  execFileSync as execFileSync2,
  spawnSync,
  spawnSync as spawnSync2,
  fork,
  fork as fork2
} from "node:child_process";
var unsafeStdin = (cp) => cp.stdin;
var unsafeStdout = (cp) => cp.stdout;
var unsafeStderr = (cp) => cp.stderr;
var unsafeChannelRefImpl = (cp) => cp.channel.ref();
var unsafeChannelUnrefImpl = (cp) => cp.channel.unref();

// output-es/Node.ChildProcess/foreign.js
var _undefined = void 0;

// output-es/Node.ChildProcess/index.js
var spawn$p = (cmd) => (args) => (buildOpts) => {
  const o = buildOpts({
    cwd: Nothing,
    env: Nothing,
    argv0: Nothing,
    appendStdio: Nothing,
    detached: Nothing,
    uid: Nothing,
    gid: Nothing,
    serialization: Nothing,
    shell: Nothing,
    windowsVerbatimArguments: Nothing,
    windowsHide: Nothing,
    timeout: Nothing,
    killSignal: Nothing
  });
  const $0 = {
    stdio: [
      "pipe",
      "pipe",
      "pipe",
      "ipc",
      ...(() => {
        if (o.appendStdio.tag === 0) {
          return [];
        }
        if (o.appendStdio.tag === 1) {
          return o.appendStdio._1;
        }
        fail();
      })()
    ],
    cwd: (() => {
      if (o.cwd.tag === 0) {
        return _undefined;
      }
      if (o.cwd.tag === 1) {
        return o.cwd._1;
      }
      fail();
    })(),
    env: (() => {
      if (o.env.tag === 0) {
        return _undefined;
      }
      if (o.env.tag === 1) {
        return o.env._1;
      }
      fail();
    })(),
    argv0: (() => {
      if (o.argv0.tag === 0) {
        return _undefined;
      }
      if (o.argv0.tag === 1) {
        return o.argv0._1;
      }
      fail();
    })(),
    detached: (() => {
      if (o.detached.tag === 0) {
        return _undefined;
      }
      if (o.detached.tag === 1) {
        return o.detached._1;
      }
      fail();
    })(),
    uid: (() => {
      if (o.uid.tag === 0) {
        return _undefined;
      }
      if (o.uid.tag === 1) {
        return o.uid._1;
      }
      fail();
    })(),
    gid: (() => {
      if (o.gid.tag === 0) {
        return _undefined;
      }
      if (o.gid.tag === 1) {
        return o.gid._1;
      }
      fail();
    })(),
    serialization: (() => {
      if (o.serialization.tag === 0) {
        return _undefined;
      }
      if (o.serialization.tag === 1) {
        return o.serialization._1;
      }
      fail();
    })(),
    shell: (() => {
      if (o.shell.tag === 0) {
        return _undefined;
      }
      if (o.shell.tag === 1) {
        return o.shell._1;
      }
      fail();
    })(),
    windowsVerbatimArguments: (() => {
      if (o.windowsVerbatimArguments.tag === 0) {
        return _undefined;
      }
      if (o.windowsVerbatimArguments.tag === 1) {
        return o.windowsVerbatimArguments._1;
      }
      fail();
    })(),
    windowsHide: (() => {
      if (o.windowsHide.tag === 0) {
        return _undefined;
      }
      if (o.windowsHide.tag === 1) {
        return o.windowsHide._1;
      }
      fail();
    })(),
    timeout: (() => {
      if (o.timeout.tag === 0) {
        return _undefined;
      }
      if (o.timeout.tag === 1) {
        return o.timeout._1;
      }
      fail();
    })(),
    killSignal: (() => {
      if (o.killSignal.tag === 0) {
        return _undefined;
      }
      if (o.killSignal.tag === 1) {
        return o.killSignal._1;
      }
      fail();
    })()
  };
  return () => spawn2(cmd, args, $0);
};

// output-es/Node.ChildProcess.Aff/index.js
var parOneOf = /* @__PURE__ */ (() => {
  const $0 = foldrArray((x) => _parAffAlt(x))(plusAff.empty);
  return (x) => _sequential($0(x));
})();
var waitSpawned = (cp) => parOneOf([
  makeAff((done) => () => {
    let ref = () => {
    };
    const removeListener = once($EventHandle("spawn", identity10))(() => {
      const $02 = ref;
      $02();
      const a$p = pidImpl(cp);
      const pid$p = nullable(a$p, Nothing, Just);
      return done($Either(
        1,
        $Either(
          1,
          (() => {
            if (pid$p.tag === 1) {
              return pid$p._1;
            }
            fail();
          })()
        )
      ))();
    })(cp)();
    ref = removeListener;
    const $0 = _liftEffect(removeListener);
    return (v) => $0;
  }),
  makeAff((done) => () => {
    let ref = () => {
    };
    const removeListener = once($EventHandle("error", mkEffectFn1))((sysErr) => () => {
      const $02 = ref;
      $02();
      return done($Either(1, $Either(0, sysErr)))();
    })(cp)();
    ref = removeListener;
    const $0 = _liftEffect(removeListener);
    return (v) => $0;
  })
]);

// output-es/Node.Errors.SystemError/foreign.js
var getField = (field, err) => err[field];

// output-es/Node.Library.Execa.ShebangCommand/index.js
var intercalate3 = /* @__PURE__ */ intercalate1(monoidString);
var shebangCommand = (firstLineOfFile) => {
  const $0 = split("/");
  const $1 = match(unsafeRegex("^#! ?(.*)")(noFlags))(firstLineOfFile);
  if ($1.tag === 1) {
    if (1 < $1._1.length) {
      if ($1._1[1].tag === 1) {
        const v = unconsImpl((v2) => Nothing, (x) => (xs) => $Maybe(1, { head: x, tail: xs }), split(" ")($1._1[1]._1));
        if (v.tag === 1) {
          if (v._1.tail.length === 0) {
            const $22 = last($0(v._1.head));
            if ($22.tag === 1) {
              if ($22._1 !== "env") {
                return $Maybe(1, $22._1);
              }
              return Nothing;
            }
            if ($22.tag === 0) {
              return Nothing;
            }
            fail();
          }
          const $2 = last($0(v._1.head));
          if ($2.tag === 1) {
            return $Maybe(1, $2._1 === "env" ? intercalate3(" ")(v._1.tail) : intercalate3(" ")([$2._1, ...v._1.tail]));
          }
          if ($2.tag === 0) {
            return Nothing;
          }
          fail();
        }
        return Nothing;
      }
      if ($1._1[1].tag === 0) {
        return Nothing;
      }
      fail();
    }
    return Nothing;
  }
  if ($1.tag === 0) {
    return Nothing;
  }
  fail();
};

// output-es/Node.Library.Execa.Utils/foreign.js
var buildCustomErrorImpl = (msg, obj) => Object.assign(new Error(msg), obj);

// output-es/Node.Library.Execa.Utils/index.js
var envKey$p = (env) => (key) => {
  if (platform.tag === 0 ? false : platform.tag === 1 && platform._1 === 6) {
    return fold2((b) => (a) => (v2) => {
      if (b.tag === 0) {
        if (toUpper(a) === toUpper(key)) {
          return $Maybe(1, v2);
        }
        return Nothing;
      }
      return b;
    })(Nothing)(env);
  }
  return _lookup(Nothing, Just, key, env);
};

// output-es/Foreign/foreign.js
function tagOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
var isArray = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
};

// output-es/Foreign/index.js
var $ForeignError = (tag, _1, _2) => ({ tag, _1, _2 });
var unsafeReadTagged = (dictMonad) => (tag) => (value) => {
  if (tagOf(value) === tag) {
    return applicativeExceptT(dictMonad).pure(value);
  }
  return monadThrowExceptT(dictMonad).throwError($NonEmpty(
    $ForeignError(1, tag, tagOf(value)),
    Nil
  ));
};

// output-es/Node.FS.Stats/foreign.js
var isFileImpl = (s) => s.isFile();
var isSymbolicLinkImpl = (s) => s.isSymbolicLink();
var modeImpl = (s) => s.mode;
var uidImpl = (s) => s.uid;
var gidImpl = (s) => s.gid;

// output-es/Node.Library.Execa.IsExe/index.js
var identity11 = (x) => x;
var coreWindows = {
  isExe: (path2) => (options) => makeAff((cb) => () => {
    stat(
      path2,
      handleCallback((v) => {
        if (v.tag === 0) {
          return cb($Either(1, $Tuple($Maybe(1, v._1), false)));
        }
        if (v.tag === 1) {
          const $0 = !isSymbolicLinkImpl(v._1) && !isFileImpl(v._1) ? () => false : () => {
            const a$p = getEnv();
            const mbPathExt = envKey$p(a$p)("PATHEXT");
            if (options.pathExt.tag === 0) {
              if (mbPathExt.tag === 0) {
                return true;
              }
              if (mbPathExt.tag === 1) {
                const pathLen = toCodePointArray(path2).length;
                const pathExt = split(";")(mbPathExt._1);
                const $02 = find(($03) => "" === $03)(pathExt);
                const $1 = find((p1) => toLower(p1) === toLower(drop(length2(take2(pathLen - toCodePointArray(p1).length | 0)(path2)))(path2)))(pathExt);
                return (() => {
                  if ($02.tag === 0) {
                    return true;
                  }
                  if ($02.tag === 1) {
                    return false;
                  }
                  fail();
                })() || (() => {
                  if ($1.tag === 0) {
                    return false;
                  }
                  if ($1.tag === 1) {
                    return true;
                  }
                  fail();
                })();
              }
              fail();
            }
            if (options.pathExt.tag === 0) {
              return true;
            }
            if (options.pathExt.tag === 1) {
              const pathLen = toCodePointArray(path2).length;
              const pathExt = split(";")(options.pathExt._1);
              const $02 = find(($03) => "" === $03)(pathExt);
              const $1 = find((p1) => toLower(p1) === toLower(drop(length2(take2(pathLen - toCodePointArray(p1).length | 0)(path2)))(path2)))(pathExt);
              return (() => {
                if ($02.tag === 0) {
                  return true;
                }
                if ($02.tag === 1) {
                  return false;
                }
                fail();
              })() || (() => {
                if ($1.tag === 0) {
                  return false;
                }
                if ($1.tag === 1) {
                  return true;
                }
                fail();
              })();
            }
            fail();
          };
          return () => {
            const result = $0();
            return cb($Either(1, $Tuple(Nothing, result)))();
          };
        }
        fail();
      })
    );
    return nonCanceler;
  }),
  isExeSync: (path2) => (options) => () => {
    const statsObj = statSync(path2);
    if (!isSymbolicLinkImpl(statsObj) && !isFileImpl(statsObj)) {
      return false;
    }
    const a$p = getEnv();
    const mbPathExt = envKey$p(a$p)("PATHEXT");
    if (options.pathExt.tag === 0) {
      if (mbPathExt.tag === 0) {
        return true;
      }
      if (mbPathExt.tag === 1) {
        const pathLen = toCodePointArray(path2).length;
        const pathExt = split(";")(mbPathExt._1);
        const $0 = find(($02) => "" === $02)(pathExt);
        const $1 = find((p1) => toLower(p1) === toLower(drop(length2(take2(pathLen - toCodePointArray(p1).length | 0)(path2)))(path2)))(pathExt);
        return (() => {
          if ($0.tag === 0) {
            return true;
          }
          if ($0.tag === 1) {
            return false;
          }
          fail();
        })() || (() => {
          if ($1.tag === 0) {
            return false;
          }
          if ($1.tag === 1) {
            return true;
          }
          fail();
        })();
      }
      fail();
    }
    if (options.pathExt.tag === 0) {
      return true;
    }
    if (options.pathExt.tag === 1) {
      const pathLen = toCodePointArray(path2).length;
      const pathExt = split(";")(options.pathExt._1);
      const $0 = find(($02) => "" === $02)(pathExt);
      const $1 = find((p1) => toLower(p1) === toLower(drop(length2(take2(pathLen - toCodePointArray(p1).length | 0)(path2)))(path2)))(pathExt);
      return (() => {
        if ($0.tag === 0) {
          return true;
        }
        if ($0.tag === 1) {
          return false;
        }
        fail();
      })() || (() => {
        if ($1.tag === 0) {
          return false;
        }
        if ($1.tag === 1) {
          return true;
        }
        fail();
      })();
    }
    fail();
  }
};
var coreNonWindows = {
  isExe: (path2) => (options) => makeAff((cb) => () => {
    stat(
      path2,
      handleCallback((v) => {
        if (v.tag === 0) {
          return cb($Either(1, $Tuple($Maybe(1, v._1), false)));
        }
        if (v.tag === 1) {
          const $0 = v._1;
          const $1 = unsafeClamp(floor(uidImpl($0)));
          const $2 = unsafeClamp(floor(modeImpl($0)));
          const $3 = (() => {
            const gid = unsafeClamp(floor(gidImpl($0)));
            return () => {
              const v$1 = getUid();
              const v1 = getGid();
              const b = options.uid.tag === 0 ? anyImpl(
                identity11,
                [
                  ($2 & 1) !== 0,
                  ($2 & 8) !== 0 && (() => {
                    if (options.gid.tag === 0) {
                      if (v1.tag === 0) {
                        return false;
                      }
                      if (v1.tag === 1) {
                        return gid === v1._1;
                      }
                      fail();
                    }
                    if (options.gid.tag === 0) {
                      return false;
                    }
                    if (options.gid.tag === 1) {
                      return gid === options.gid._1;
                    }
                    fail();
                  })(),
                  ($2 & 64) !== 0 && (() => {
                    if (v$1.tag === 0) {
                      return false;
                    }
                    if (v$1.tag === 1) {
                      return $1 === v$1._1;
                    }
                    fail();
                  })(),
                  ($2 & 72) !== 0 && (() => {
                    if (v$1.tag === 0) {
                      return false;
                    }
                    if (v$1.tag === 1) {
                      return 0 === v$1._1;
                    }
                    fail();
                  })()
                ]
              ) : anyImpl(
                identity11,
                [
                  ($2 & 1) !== 0,
                  ($2 & 8) !== 0 && (() => {
                    if (options.gid.tag === 0) {
                      if (v1.tag === 0) {
                        return false;
                      }
                      if (v1.tag === 1) {
                        return gid === v1._1;
                      }
                      fail();
                    }
                    if (options.gid.tag === 0) {
                      return false;
                    }
                    if (options.gid.tag === 1) {
                      return gid === options.gid._1;
                    }
                    fail();
                  })(),
                  ($2 & 64) !== 0 && (() => {
                    if (options.uid.tag === 0) {
                      return false;
                    }
                    if (options.uid.tag === 1) {
                      return $1 === options.uid._1;
                    }
                    fail();
                  })(),
                  ($2 & 72) !== 0 && (() => {
                    if (options.uid.tag === 0) {
                      return false;
                    }
                    if (options.uid.tag === 1) {
                      return 0 === options.uid._1;
                    }
                    fail();
                  })()
                ]
              );
              return isFileImpl($0) && b;
            };
          })();
          return () => {
            const b = $3();
            return cb($Either(1, $Tuple(Nothing, b)))();
          };
        }
        fail();
      })
    );
    return nonCanceler;
  }),
  isExeSync: (path2) => (options) => () => {
    const stats = statSync(path2);
    const $0 = unsafeClamp(floor(uidImpl(stats)));
    const $1 = unsafeClamp(floor(modeImpl(stats)));
    const gid = unsafeClamp(floor(gidImpl(stats)));
    const v = getUid();
    const v1 = getGid();
    const b = options.uid.tag === 0 ? anyImpl(
      identity11,
      [
        ($1 & 1) !== 0,
        ($1 & 8) !== 0 && (() => {
          if (options.gid.tag === 0) {
            if (v1.tag === 0) {
              return false;
            }
            if (v1.tag === 1) {
              return gid === v1._1;
            }
            fail();
          }
          if (options.gid.tag === 0) {
            return false;
          }
          if (options.gid.tag === 1) {
            return gid === options.gid._1;
          }
          fail();
        })(),
        ($1 & 64) !== 0 && (() => {
          if (v.tag === 0) {
            return false;
          }
          if (v.tag === 1) {
            return $0 === v._1;
          }
          fail();
        })(),
        ($1 & 72) !== 0 && (() => {
          if (v.tag === 0) {
            return false;
          }
          if (v.tag === 1) {
            return 0 === v._1;
          }
          fail();
        })()
      ]
    ) : anyImpl(
      identity11,
      [
        ($1 & 1) !== 0,
        ($1 & 8) !== 0 && (() => {
          if (options.gid.tag === 0) {
            if (v1.tag === 0) {
              return false;
            }
            if (v1.tag === 1) {
              return gid === v1._1;
            }
            fail();
          }
          if (options.gid.tag === 0) {
            return false;
          }
          if (options.gid.tag === 1) {
            return gid === options.gid._1;
          }
          fail();
        })(),
        ($1 & 64) !== 0 && (() => {
          if (options.uid.tag === 0) {
            return false;
          }
          if (options.uid.tag === 1) {
            return $0 === options.uid._1;
          }
          fail();
        })(),
        ($1 & 72) !== 0 && (() => {
          if (options.uid.tag === 0) {
            return false;
          }
          if (options.uid.tag === 1) {
            return 0 === options.uid._1;
          }
          fail();
        })()
      ]
    );
    return isFileImpl(stats) && b;
  }
};
var isExeSync = (path2) => (options) => {
  const $0 = platform.tag === 1 && platform._1 === 6 ? coreWindows.isExeSync(path2)(options) : coreNonWindows.isExeSync(path2)(options);
  const $1 = catchException((x) => () => $Either(0, x))(() => {
    const a$p = $0();
    return $Either(1, a$p);
  });
  return () => {
    const mbEither = $1();
    if (mbEither.tag === 0 && options.ignoreErrors && mbEither._1.code === "EACCESS") {
      return $Either(1, false);
    }
    if (mbEither.tag === 0) {
      return $Either(0, mbEither._1);
    }
    if (mbEither.tag === 1) {
      return $Either(1, mbEither._1);
    }
    fail();
  };
};

// output-es/Node.Library.Execa.Which/index.js
var quotedRegex = /* @__PURE__ */ unsafeRegex('^".*"$')(noFlags);
var isWindows = () => {
  const a$p = getEnv();
  const ty = envKey$p(a$p)("OSTYPE");
  return (platform.tag === 0 ? false : platform.tag === 1 && platform._1 === 6) || (ty.tag === 0 ? false : ty.tag === 1 && ty._1 === "cygwin") || (ty.tag === 0 ? false : ty.tag === 1 && ty._1 === "msys");
};
var jsColon = () => {
  const w = isWindows();
  return w ? ";" : ":";
};
var getPathInfo = (cmd) => (options) => {
  const hasWindowsSlashRegex = unsafeRegex("\\\\")(noFlags);
  const hasPosixSlashRegex = unsafeRegex("\\/")(noFlags);
  return () => {
    const cwd2 = cwd();
    const a$p = getEnv();
    const mbPath = envKey$p(a$p)("PATH");
    const a$p$1 = getEnv();
    const mbPathExt = envKey$p(a$p$1)("PATHEXT");
    const isWin2 = isWindows();
    const colon = (() => {
      if (options.colon.tag === 0) {
        return jsColon();
      }
      if (options.colon.tag === 1) {
        return options.colon._1;
      }
      fail();
    })();
    const pathExtExe = (() => {
      if (isWin2) {
        if (options.pathExt.tag === 0) {
          if (mbPathExt.tag === 0) {
            return ".EXE;.CMD;.BAT;.exe;.cmd;.bat";
          }
          if (mbPathExt.tag === 1) {
            return mbPathExt._1;
          }
          fail();
        }
        if (options.pathExt.tag === 0) {
          return ".EXE;.CMD;.BAT;.exe;.cmd;.bat";
        }
        if (options.pathExt.tag === 1) {
          return options.pathExt._1;
        }
        fail();
      }
      return "";
    })();
    return {
      pathEnv: (() => {
        if (test(hasPosixSlashRegex)(cmd) || isWin2 && test(hasWindowsSlashRegex)(cmd)) {
          return [""];
        }
        const paths = split(colon)((() => {
          if (options.path.tag === 0) {
            if (mbPath.tag === 0) {
              return "";
            }
            if (mbPath.tag === 1) {
              return mbPath._1;
            }
            fail();
          }
          if (options.path.tag === 0) {
            return "";
          }
          if (options.path.tag === 1) {
            return options.path._1;
          }
          fail();
        })());
        if (isWin2) {
          return [cwd2, ...paths];
        }
        return paths;
      })(),
      pathExt: isWin2 ? split(colon)(pathExtExe) : [""],
      pathExtExe
    };
  };
};
var dotSlashRegex = /* @__PURE__ */ unsafeRegex("^\\.[\\/]")(noFlags);
var whichSync = (cmd) => (options) => {
  const $0 = getPathInfo(cmd)(options);
  return () => {
    const v = $0();
    const $1 = v.pathEnv;
    const $2 = v.pathExt;
    const $3 = v.pathExtExe;
    return monadRecEffect.tailRecM((v$1) => {
      if (v$1.innerLoop.tag === 0) {
        if (v$1.outerLoopIdx >= 0 && v$1.outerLoopIdx < $1.length) {
          const pathPart = test(quotedRegex)($1[v$1.outerLoopIdx]) ? slice(1)(-1)($1[v$1.outerLoopIdx]) : $1[v$1.outerLoopIdx];
          const pCmd = concat2([pathPart, cmd]);
          const $42 = $Step(
            0,
            {
              innerLoop: $Maybe(
                1,
                { p: pathPart !== "" && test(dotSlashRegex)(cmd) ? slice(0)(2)(cmd) + pCmd : pCmd, j: 0 }
              ),
              found: v$1.found,
              outerLoopIdx: v$1.outerLoopIdx
            }
          );
          return () => $42;
        }
        const $4 = $Step(
          1,
          $Either(0, buildCustomErrorImpl("not found: " + cmd, { code: "ENOENT" }))
        );
        return () => $4;
      }
      if (v$1.innerLoop.tag === 1) {
        if (v$1.innerLoop._1.j >= 0 && v$1.innerLoop._1.j < $2.length) {
          const cur = v$1.innerLoop._1.p + $2[v$1.innerLoop._1.j];
          const $42 = isExeSync(cur)({
            pathExt: $Maybe(1, $3),
            uid: Nothing,
            gid: Nothing,
            ignoreErrors: false
          });
          return () => {
            const eOrB = $42();
            const $5 = () => {
              const $52 = $Step(
                0,
                { innerLoop: $Maybe(1, { p: v$1.innerLoop._1.p, j: v$1.innerLoop._1.j + 1 | 0 }), found: v$1.found, outerLoopIdx: v$1.outerLoopIdx }
              );
              return () => $52;
            };
            if (eOrB.tag === 1) {
              if (eOrB._1 && !options.all) {
                return $Step(1, $Either(1, [cur]));
              }
              if (eOrB._1) {
                return $Step(
                  0,
                  {
                    found: snoc(v$1.found)(cur),
                    innerLoop: $Maybe(1, { p: v$1.innerLoop._1.p, j: v$1.innerLoop._1.j + 1 | 0 }),
                    outerLoopIdx: v$1.outerLoopIdx
                  }
                );
              }
            }
            return $5()();
          };
        }
        const $4 = $Step(0, { outerLoopIdx: v$1.outerLoopIdx + 1 | 0, innerLoop: Nothing, found: v$1.found });
        return () => $4;
      }
      fail();
    })({ found: [], outerLoopIdx: 0, innerLoop: Nothing })();
  };
};

// output-es/Node.Library.Execa.CrossSpawn/foreign.js
import process2 from "process";
var processHasChdir = () => process2.chdir !== void 0;

// output-es/Node.Library.Execa.CrossSpawn/index.js
var for_2 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
var intercalate4 = /* @__PURE__ */ intercalate1(monoidString);
var isWindows2 = /* @__PURE__ */ (() => platform.tag === 0 ? false : platform.tag === 1 && platform._1 === 6)();
var parse3 = (command2) => (args) => (options) => {
  const resolveCommand = (parseRec) => {
    const $0 = (() => {
      if (parseRec.options.env.tag === 0) {
        return getEnv;
      }
      if (parseRec.options.env.tag === 1) {
        const $02 = parseRec.options.env._1;
        return () => $02;
      }
      fail();
    })();
    return () => {
      const env = $0();
      const cwd2 = cwd();
      const hasChdir = processHasChdir();
      for_2(applyMaybe.apply(hasChdir ? $Maybe(1, identity) : Nothing)(parseRec.options.cwd))((optionCwd) => () => chdirImpl(optionCwd))();
      const a$p = traversableMaybe.traverse(applicativeEffect)((envPath) => {
        const $1 = whichSync(command2)({
          path: $Maybe(1, envPath),
          pathExt: $Maybe(1, delimiter),
          colon: Nothing,
          all: false
        });
        return () => {
          const a$p2 = $1();
          const attempt1 = (() => {
            if (a$p2.tag === 0) {
              return Nothing;
            }
            if (a$p2.tag === 1) {
              return $Maybe(
                1,
                (() => {
                  if (0 < a$p2._1.length) {
                    return a$p2._1[0];
                  }
                  fail();
                })()
              );
            }
            fail();
          })();
          if ((() => {
            if (attempt1.tag === 0) {
              return false;
            }
            if (attempt1.tag === 1) {
              return true;
            }
            fail();
          })()) {
            return attempt1;
          }
          const a$p$1 = whichSync(command2)({
            path: $Maybe(1, envPath),
            pathExt: Nothing,
            colon: Nothing,
            all: false
          })();
          if (a$p$1.tag === 0) {
            return Nothing;
          }
          if (a$p$1.tag === 1) {
            return $Maybe(
              1,
              (() => {
                if (0 < a$p$1._1.length) {
                  return a$p$1._1[0];
                }
                fail();
              })()
            );
          }
          fail();
        };
      })(_lookup(Nothing, Just, "Path", env))();
      const b = (() => {
        if (a$p.tag === 1) {
          return a$p._1;
        }
        if (a$p.tag === 0) {
          return Nothing;
        }
        fail();
      })();
      for_2(applyMaybe.apply(hasChdir ? $Maybe(1, identity) : Nothing)(parseRec.options.cwd))((v1) => () => chdirImpl(cwd2))();
      if (b.tag === 1) {
        if (parseRec.options.cwd.tag === 1) {
          const a$p$1 = resolve([parseRec.options.cwd._1])(b._1)();
          return $Maybe(1, a$p$1);
        }
        if (parseRec.options.cwd.tag === 0) {
          const a$p$1 = resolve([""])(b._1)();
          return $Maybe(1, a$p$1);
        }
      }
      return Nothing;
    };
  };
  const metaCharsRegex = unsafeRegex('([()\\][%!^"`<>&|;, *?])')(global2);
  const isExecutableRegex = unsafeRegex("\\.(?:com|exe)$")(ignoreCase);
  const isCommandShimRegex = unsafeRegex("node_modules[\\\\/].bin[\\\\/][^\\\\/]+\\.cmd$")(ignoreCase);
  const initParseRec = { command: command2, args, options };
  const escapeCommand = replace2(metaCharsRegex)("^$1");
  const parseWindows = (() => {
    if ((() => {
      if (options.shell.tag === 0) {
        return false;
      }
      if (options.shell.tag === 1) {
        return true;
      }
      fail();
    })()) {
      return () => initParseRec;
    }
    const $0 = resolveCommand(initParseRec);
    return () => {
      const mbFile = $0();
      const v = (() => {
        if (mbFile.tag === 0) {
          return $Tuple(initParseRec, mbFile);
        }
        if (mbFile.tag === 1) {
          const $1 = alloc(150);
          const $2 = fdOpen2(mbFile._1)(R)(Nothing);
          catchException((x) => () => $Either(0, x))(() => {
            const resource = $2();
            const b = fdRead2(resource)($1)(0)(150)($Maybe(1, 0))();
            closeSync(resource);
            return $Either(1, b);
          })();
          const $3 = shebangCommand(toString2(UTF8)($1));
          if ($3.tag === 0) {
            return $Tuple(initParseRec, mbFile);
          }
          if ($3.tag === 1) {
            const rec1 = { args: [mbFile._1, ...initParseRec.args], command: $3._1, options: initParseRec.options };
            const newCommand = resolveCommand(rec1)();
            return $Tuple(rec1, newCommand);
          }
        }
        fail();
      })();
      if (v._2.tag === 1 && !test(isExecutableRegex)(v._2._1)) {
        const a$p = getEnv();
        const a$p$1 = envKey$p(a$p)("COMSPEC");
        const comSpec = (() => {
          if (a$p$1.tag === 0) {
            return "cmd.exe";
          }
          if (a$p$1.tag === 1) {
            return a$p$1._1;
          }
          fail();
        })();
        return {
          args: [
            ...arrayMap((v$1) => "/q")(toLower(comSpec) === "cmd.exe" && !initParseRec.options.windowsEnableCmdEcho ? [void 0] : []),
            "/d",
            "/s",
            "/c",
            '"' + intercalate4(" ")([
              escapeCommand(normalize(v._1.command)),
              ...(() => {
                const $1 = replace2(unsafeRegex('(\\\\*)"')(global2))('$1$1\\"');
                return arrayMap((() => {
                  const $2 = replace2(unsafeRegex("(\\\\*)$")(noFlags))("$1$1");
                  const $3 = replace2(metaCharsRegex)("^$1");
                  const go = (go$a0$copy) => (go$a1$copy) => {
                    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
                    while (go$c) {
                      const n = go$a0, acc = go$a1;
                      if (n <= 0) {
                        go$c = false;
                        go$r = acc;
                        continue;
                      }
                      go$a0 = n - 1 | 0;
                      go$a1 = $3(acc);
                    }
                    return go$r;
                  };
                  const $4 = go(test(isCommandShimRegex)(v._2._1) ? 2 : 1);
                  return (x) => $4('"' + $2($1(x)) + '"');
                })())(v._1.args);
              })()
            ]) + '"'
          ],
          command: comSpec,
          options: {
            windowsVerbatimArguments: $Maybe(1, true),
            cwd: v._1.options.cwd,
            env: v._1.options.env,
            shell: v._1.options.shell,
            windowsEnableCmdEcho: v._1.options.windowsEnableCmdEcho
          }
        };
      }
      return v._1;
    };
  })();
  if (!isWindows2) {
    return () => initParseRec;
  }
  return parseWindows;
};

// output-es/Node.Buffer/index.js
var concat$p = (arrs) => (n) => (v) => concatToLength(arrs, n);

// output-es/Node.Stream/foreign.js
import stream from "node:stream";
var readChunkImpl = (useBuffer, useString, chunk) => {
  if (chunk instanceof Buffer) {
    return useBuffer(chunk);
  } else if (typeof chunk === "string") {
    return useString(chunk);
  } else {
    throw new Error(
      "Node.Stream.readChunkImpl: Unrecognised chunk type; expected String or Buffer, got: " + chunk
    );
  }
};
var pipeImpl = (r, w) => r.pipe(w);
var writeImpl = (w, buf) => w.write(buf);
var endImpl = (w) => w.end();
var destroyImpl = (w) => w.destroy();
var pipelineImpl = (src, transforms, dst, cb) => stream.pipeline([src, ...transforms, dst], cb);
var newPassThrough = () => new stream.PassThrough({ objectMode: false });

// output-es/Node.Stream/index.js
var dataH = /* @__PURE__ */ $EventHandle(
  "data",
  (cb) => (chunk) => readChunkImpl(
    ($0) => cb($0)(),
    (v) => throwException(error("Got a String, not a Buffer. Stream encoding should not be set"))(),
    chunk
  )
);

// output-es/Node.Library.Execa.GetStream/index.js
var getStreamBuffer = (inputStream) => (initialOptions) => {
  const $0 = (() => {
    if (initialOptions.maxBuffer.tag === 0) {
      return infinity;
    }
    if (initialOptions.maxBuffer.tag === 1) {
      return initialOptions.maxBuffer._1;
    }
    fail();
  })();
  return _bind(_liftEffect(() => {
    let chunksRef = [];
    let lengthRef = 0;
    const stream2 = newPassThrough();
    const rmData = on(dataH)((buf) => () => {
      const $1 = chunksRef;
      chunksRef = snoc($1)(buf);
      const $2 = lengthRef;
      lengthRef = $2 + toNumber(size2(buf));
    })(stream2)();
    return {
      getBufferedValue: () => {
        const chunks = chunksRef;
        const len = lengthRef;
        return concat$p(chunks)(len)();
      },
      getBufferedLength: () => lengthRef,
      stream: stream2,
      unsubcribe: rmData
    };
  }))(($$interface) => makeAff((cb) => {
    const $1 = $$interface.stream;
    return () => {
      pipelineImpl(
        inputStream,
        [],
        $1,
        (err) => {
          const $22 = nullable(err, Nothing, Just);
          const bufferedData = $$interface.getBufferedValue();
          return cb($Either(1, { buffer: bufferedData, inputError: $22 }))();
        }
      );
      const rmListener = on(dataH)((v) => {
        const $22 = $$interface.getBufferedLength;
        return () => {
          const bufferedLen = $22();
          if (bufferedLen > $0) {
            const bufferedData = $$interface.getBufferedValue();
            return cb($Either(
              1,
              {
                buffer: bufferedData,
                inputError: $Maybe(
                  1,
                  error((() => {
                    if (initialOptions.maxBuffer.tag === 0) {
                      return "Max buffer exceeded";
                    }
                    if (initialOptions.maxBuffer.tag === 1) {
                      return "Max buffer size exceeded. Buffer size was: " + showNumberImpl(initialOptions.maxBuffer._1);
                    }
                    fail();
                  })())
                )
              }
            ))();
          }
        };
      })($$interface.stream)();
      const $2 = $$interface.unsubcribe;
      const $3 = _liftEffect(() => {
        $2();
        return rmListener();
      });
      return (v) => $3;
    };
  }));
};

// output-es/Node.Library.Execa.NpmRunPath/index.js
var intercalate5 = /* @__PURE__ */ intercalate1(monoidString);
var monoidMaybe2 = /* @__PURE__ */ monoidMaybe(semigroupString);
var npmRunPath = (initialOptions) => {
  const go = (options) => (result) => (previous) => (cwdPath) => {
    if (previous.tag === 1 && previous._1 === cwdPath) {
      const $02 = resolve([cwdPath, options.execPath])("..");
      return () => {
        const nodeBinaryPath = $02();
        return intercalate5(delimiter)([
          ...result,
          nodeBinaryPath,
          ...(() => {
            if (options.path.tag === 0) {
              return [];
            }
            if (options.path.tag === 1) {
              return [options.path._1];
            }
            fail();
          })()
        ]);
      };
    }
    const nextResult = concat2([cwdPath, "node_modules/.bin"]);
    const $0 = resolve([cwdPath])("..");
    return () => {
      const nextCwdPath = $0();
      return go(options)(snoc(result)(nextResult))($Maybe(1, cwdPath))(nextCwdPath)();
    };
  };
  return () => {
    const processCwd = cwd();
    const a$p = getEnv();
    const processPath = envKey$p(a$p)("PATH");
    const processExecPath = execPath();
    const options = {
      cwd: (() => {
        if (initialOptions.cwd.tag === 0) {
          return processCwd;
        }
        if (initialOptions.cwd.tag === 1) {
          return initialOptions.cwd._1;
        }
        fail();
      })(),
      path: initialOptions.path.tag === 0 ? processPath : initialOptions.path,
      execPath: (() => {
        if (initialOptions.execPath.tag === 0) {
          return processExecPath;
        }
        if (initialOptions.execPath.tag === 1) {
          return initialOptions.execPath._1;
        }
        fail();
      })()
    };
    const cwdPath = resolve([])(options.cwd)();
    return go(options)([])(Nothing)(cwdPath)();
  };
};
var npmRunPathEnv = (env) => (options) => {
  const $0 = npmRunPath(options);
  return () => {
    const a$p = $0();
    return mutate(($1) => () => {
      $1.PATH = a$p;
      return $1;
    })(env);
  };
};
var defaultNpmRunPathOptions = /* @__PURE__ */ (() => monoidRecord()((() => {
  const Semigroup0 = monoidMaybe2.Semigroup0();
  const Semigroup0$1 = monoidMaybe2.Semigroup0();
  const Semigroup0$2 = monoidMaybe2.Semigroup0();
  const semigroupRecordCons1 = {
    appendRecord: (v) => (ra) => (rb) => ({ cwd: Semigroup0.append(ra.cwd)(rb.cwd), execPath: Semigroup0$1.append(ra.execPath)(rb.execPath), path: Semigroup0$2.append(ra.path)(rb.path) })
  };
  return { memptyRecord: (v) => ({ cwd: monoidMaybe2.mempty, execPath: monoidMaybe2.mempty, path: monoidMaybe2.mempty }), SemigroupRecord0: () => semigroupRecordCons1 };
})()).mempty)();

// output-es/Parsing.Combinators.Array/index.js
var many3 = (p) => (state1, more, lift12, $$throw, done) => more((v1) => {
  const loop = (state2, arg, gas) => {
    const $0 = (state3, step) => {
      if (step.tag === 0) {
        if (gas === 0) {
          return more((v1$1) => loop(state3, step._1, 30));
        }
        return loop(state3, step._1, gas - 1 | 0);
      }
      if (step.tag === 1) {
        const $02 = step._1;
        return more((v2) => done(state3, reverse(fromFoldableImpl(foldableList.foldr, $02))));
      }
      fail();
    };
    const $1 = state2._1;
    const $2 = state2._2;
    return more((v3) => more((v1$1) => p(
      $ParseState($1, $2, false),
      more,
      lift12,
      (v2, $3) => more((v5) => $0(state2, $Step(1, arg))),
      (state2$1, a) => more((v2) => $0(state2$1, $Step(0, $List(1, a, arg))))
    )));
  };
  return loop(state1, Nil, 30);
});
var many1 = (p) => (state1, more, lift12, $$throw, done) => more((v1) => many3(p)(
  state1,
  more,
  lift12,
  $$throw,
  (state2, a) => more((v2) => {
    if (a.length > 0) {
      return done(state2, a);
    }
    return fail2("Expected at least 1")(state2, more, lift12, $$throw, done);
  })
));

// output-es/Node.Library.Execa.SignalExit/foreign.js
function unsafeProcessHasProp(prop) {
  return global.process[prop] !== null && global.process[prop] !== void 0;
}
function unsafeReadProcessProp(prop) {
  return global.process[prop];
}
function unsafeWriteProcessProp(prop, value) {
  global.process[prop] = value;
}
function processCallFn(originalProcessReallyExit, exitCode) {
  return originalProcessReallyExit.call(global.process, exitCode);
}
function customProcessEmit(cb) {
  return function(ev, arg) {
    const thisArg = this;
    const argumentsArg = arguments;
    return cb((originalProcessEmit) => originalProcessEmit.apply(thisArg, argumentsArg), ev, arg);
  };
}

// output-es/Node.Library.Execa.SignalExit/index.js
var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableArray);
var member = (k) => {
  const go = (go$a0$copy) => {
    let go$a0 = go$a0$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0;
      if (v.tag === 0) {
        go$c = false;
        go$r = false;
        continue;
      }
      if (v.tag === 1) {
        const v1 = ordString.compare(k)(v._3);
        if (v1 === 0) {
          go$a0 = v._5;
          continue;
        }
        if (v1 === 1) {
          go$a0 = v._6;
          continue;
        }
        if (v1 === 2) {
          go$c = false;
          go$r = true;
          continue;
        }
      }
      fail();
    }
    return go$r;
  };
  return go;
};
var $$for = /* @__PURE__ */ (() => {
  const traverse2 = traversableArray.traverse(applicativeEffect);
  return (x) => (f) => traverse2(f)(x);
})();
var isWin = /* @__PURE__ */ (() => platform.tag === 1 && platform._1 === 6)();
var signals = /* @__PURE__ */ (() => [
  "SIGHUP",
  "SIGINT",
  "SIGTERM",
  ...!isWin ? ["SIGABRT", "SIGALRM", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT", "SIGPROF"] : [],
  ...(platform.tag === 0 ? false : platform.tag === 1 && platform._1 === 3) ? ["SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT"] : []
])();
var getGlobalRecOnProcessObject = () => {
  const cond$p = unsafeProcessHasProp("__purescript_signal_exit__");
  if (cond$p) {
    return unsafeReadProcessProp("__purescript_signal_exit__");
  }
  const v = unsafeReadProcessProp("emit");
  const v1 = unsafeReadProcessProp("reallyExit");
  const emitter = newImpl();
  setMaxListenersImpl(emitter, 0);
  const countRef = { value: 0 };
  const emittedEventsRef = { value: Leaf2 };
  const loadedRef = { value: false };
  const signalListenersRef = { value: [] };
  const obj = {
    originalProcessEmit: v,
    originalProcessReallyExit: v1,
    restoreOriginalProcessFunctions: () => {
      unsafeWriteProcessProp("emit", v);
      return unsafeWriteProcessProp("reallyExit", v1);
    },
    emitter,
    countRef,
    emittedEventsRef,
    loadedRef,
    signalListenersRef
  };
  unsafeWriteProcessProp("__purescript_signal_exit__", obj);
  return obj;
};
var exitH2 = /* @__PURE__ */ $EventHandle(
  "exit",
  (cb) => (code, err) => cb(nullable(code, Nothing, Just))(nullable(err, Nothing, Just))()
);
var exitE = (code) => (err) => (v) => {
  const $0 = (() => {
    if (code.tag === 0) {
      return nullImpl;
    }
    if (code.tag === 1) {
      return notNull(code._1);
    }
    fail();
  })();
  const $1 = (() => {
    const $12 = (() => {
      if (err.tag === 0) {
        return nullImpl;
      }
      if (err.tag === 1) {
        return notNull(err._1);
      }
      fail();
    })();
    return () => unsafeEmitFn(v)("exit", $0, $12);
  })();
  return () => {
    $1();
  };
};
var afterexitH = /* @__PURE__ */ $EventHandle(
  "afterexit",
  (cb) => (code, err) => cb(nullable(code, Nothing, Just))(nullable(err, Nothing, Just))()
);
var afterexitE = (code) => (err) => (v) => {
  const $0 = (() => {
    if (code.tag === 0) {
      return nullImpl;
    }
    if (code.tag === 1) {
      return notNull(code._1);
    }
    fail();
  })();
  const $1 = (() => {
    const $12 = (() => {
      if (err.tag === 0) {
        return nullImpl;
      }
      if (err.tag === 1) {
        return notNull(err._1);
      }
      fail();
    })();
    return () => unsafeEmitFn(v)("afterexit", $0, $12);
  })();
  return () => {
    $1();
  };
};
var onExit$p = (cb) => (options) => {
  const unload = () => {
    const v = getGlobalRecOnProcessObject();
    const b = v.loadedRef.value;
    if (b) {
      v.loadedRef.value = false;
      const $0 = v.signalListenersRef.value;
      traverse_2((v1) => {
        if (v1.tag === 0) {
          return () => {
          };
        }
        if (v1.tag === 1) {
          return v1._1;
        }
        fail();
      })($0)();
      v.restoreOriginalProcessFunctions();
      const $1 = v.countRef.value;
      v.countRef.value = $1 - 1 | 0;
    }
  };
  const processEmitFn = customProcessEmit((runOriginalProcessEmit, ev, arg) => {
    const v = getGlobalRecOnProcessObject();
    if (ev === "exit") {
      const v1 = nullable(arg, Nothing, Just);
      const exitCode = (() => {
        if (v1.tag === 0) {
          const a$p = getExitCode();
          return (() => {
            if (a$p.tag === 0) {
              return nullImpl;
            }
            if (a$p.tag === 1) {
              return notNull(a$p._1);
            }
            fail();
          })();
        }
        if (v1.tag === 1) {
          setExitCodeImpl(v1._1);
          return notNull(v1._1);
        }
        fail();
      })();
      const ret = runOriginalProcessEmit(v.originalProcessEmit);
      const v$1 = getGlobalRecOnProcessObject();
      const eventsAlreadyEmitted = v$1.emittedEventsRef.value;
      const $0 = member("exit")(eventsAlreadyEmitted);
      if (!$0) {
        const $12 = v$1.emittedEventsRef.value;
        v$1.emittedEventsRef.value = insert(ordString)("exit")()($12);
        unsafeEmitFn(v$1.emitter)("exit", exitCode, nullImpl);
      } else if ($0) {
      } else {
        fail();
      }
      const v$2 = getGlobalRecOnProcessObject();
      const eventsAlreadyEmitted$1 = v$2.emittedEventsRef.value;
      const $1 = member("afterexit")(eventsAlreadyEmitted$1);
      if (!$1) {
        const $2 = v$2.emittedEventsRef.value;
        v$2.emittedEventsRef.value = insert(ordString)("afterexit")()($2);
        unsafeEmitFn(v$2.emitter)("afterexit", exitCode, nullImpl);
      } else if ($1) {
      } else {
        fail();
      }
      return ret;
    }
    return runOriginalProcessEmit(v.originalProcessEmit);
  });
  return () => {
    const v = getGlobalRecOnProcessObject();
    const $0 = v.emitter;
    const v$1 = getGlobalRecOnProcessObject();
    const b = v$1.loadedRef.value;
    if (!b) {
      v$1.loadedRef.value = true;
      const $1 = v$1.countRef.value;
      v$1.countRef.value = $1 + 1 | 0;
      const signalListeners = $$for(signals)((sig) => {
        const $2 = on($EventHandle(toUpper(sig), identity9))(() => {
          const listenersLen = listenerCountImpl(process, sig);
          const count = v$1.countRef.value;
          if (listenersLen === count) {
            unload();
            const $22 = notNull(sig);
            const v$2 = getGlobalRecOnProcessObject();
            const eventsAlreadyEmitted = v$2.emittedEventsRef.value;
            const $32 = member("exit")(eventsAlreadyEmitted);
            if (!$32) {
              const $42 = v$2.emittedEventsRef.value;
              v$2.emittedEventsRef.value = insert(ordString)("exit")()($42);
              unsafeEmitFn(v$2.emitter)("exit", nullImpl, $22);
            } else if ($32) {
            } else {
              fail();
            }
            const $4 = notNull(sig);
            const v$3 = getGlobalRecOnProcessObject();
            const eventsAlreadyEmitted$1 = v$3.emittedEventsRef.value;
            const $5 = member("afterexit")(eventsAlreadyEmitted$1);
            if (!$5) {
              const $6 = v$3.emittedEventsRef.value;
              v$3.emittedEventsRef.value = insert(ordString)("afterexit")()($6);
              unsafeEmitFn(v$3.emitter)("afterexit", nullImpl, $4);
            } else if ($5) {
            } else {
              fail();
            }
            return killStrImpl(pid, isWin && sig === "SIGHUP" ? "SIGINT" : sig);
          }
        })(process);
        const $3 = catchException((x) => () => $Either(0, x))(() => {
          const rm2 = $2();
          const $32 = catchException((x) => () => $Either(0, x))(() => {
            const a$p = rm2();
            return $Either(1, a$p);
          });
          return $Either(1, () => {
            $32();
          });
        });
        return () => {
          const a$p = $3();
          if (a$p.tag === 0) {
            return Nothing;
          }
          if (a$p.tag === 1) {
            return $Maybe(1, a$p._1);
          }
          fail();
        };
      })();
      v$1.signalListenersRef.value = signalListeners;
      unsafeWriteProcessProp("emit", processEmitFn);
      unsafeWriteProcessProp(
        "reallyExit",
        (v$2) => {
          const v1 = getGlobalRecOnProcessObject();
          const $2 = nullable(v$2, Nothing, Just);
          const exitCode = (() => {
            if ($2.tag === 0) {
              return 0;
            }
            if ($2.tag === 1) {
              return $2._1;
            }
            fail();
          })();
          unsafeWriteProcessProp("exit", exitCode);
          exitE($Maybe(1, exitCode))(Nothing)(v1.emitter)();
          afterexitE($Maybe(1, exitCode))(Nothing)(v1.emitter)();
          return processCallFn(v1.originalProcessReallyExit, notNull(exitCode));
        }
      );
    } else if (b) {
    } else {
      fail();
    }
    const unSubscribe = options.alwaysLast ? on(afterexitH)(cb)(v.emitter)() : on(exitH2)(cb)(v.emitter)();
    return () => {
      unSubscribe();
      const exitLen = listenerCountImpl($0, "exit");
      const afterExitLen = listenerCountImpl($0, "afterexit");
      if (exitLen === 0 && afterExitLen === 0) {
        return unload();
      }
    };
  };
};

// output-es/Node.Buffer.Types/index.js
var $BufferValueType = (tag) => tag;
var UInt8 = /* @__PURE__ */ $BufferValueType(
  0
  /* UInt8 */
);

// output-es/Node.Library.Execa.StripFinalNewline/index.js
var stripFinalNewlineBuf = (b) => {
  const charR = toNumber(13);
  const charN = toNumber(10);
  return () => {
    const len = size2(b);
    if (len === 0) {
      return b;
    }
    if (len === 1) {
      const lastChar2 = read2(UInt8)(len - 1 | 0)(b);
      if (lastChar2 === charN || lastChar2 === charR) {
        return sliceImpl2(0, len - 1 | 0, b);
      }
      return b;
    }
    const lastChar = read2(UInt8)(len - 1 | 0)(b);
    if (lastChar === charN && read2(UInt8)(len - 2 | 0)(b) === charR) {
      return sliceImpl2(0, len - 2 | 0, b);
    }
    if (lastChar === charN || lastChar === charR) {
      return sliceImpl2(0, len - 1 | 0, b);
    }
    return b;
  };
};

// output-es/Node.Library.HumanSignals/foreign.js
import { constants as constants2 } from "os";

// output-es/Node.Library.HumanSignals/index.js
var $StandardSource = (tag) => tag;
var $UnhandledAction = (tag) => tag;
var identity12 = (x) => x;
var Terminate = /* @__PURE__ */ $UnhandledAction(
  0
  /* Terminate */
);
var Core = /* @__PURE__ */ $UnhandledAction(
  1
  /* Core */
);
var Ignore = /* @__PURE__ */ $UnhandledAction(
  2
  /* Ignore */
);
var Pause = /* @__PURE__ */ $UnhandledAction(
  3
  /* Pause */
);
var Unpause = /* @__PURE__ */ $UnhandledAction(
  4
  /* Unpause */
);
var Ansi = /* @__PURE__ */ $StandardSource(
  0
  /* Ansi */
);
var Posix = /* @__PURE__ */ $StandardSource(
  1
  /* Posix */
);
var Bsd = /* @__PURE__ */ $StandardSource(
  2
  /* Bsd */
);
var Systemv = /* @__PURE__ */ $StandardSource(
  3
  /* Systemv */
);
var Other = /* @__PURE__ */ $StandardSource(
  4
  /* Other */
);
var signals2 = /* @__PURE__ */ (() => {
  const byName = {
    SIGHUP: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGHUP", constants2.signals);
      return {
        name: "SIGHUP",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 1;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Terminal closed",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGINT: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGINT", constants2.signals);
      return {
        name: "SIGINT",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 2;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "User interruption with CTRL-C",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Ansi,
        forced: false
      };
    })(),
    SIGQUIT: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGQUIT", constants2.signals);
      return {
        name: "SIGQUIT",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 3;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "User interruption with CTRL-\\",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Posix,
        forced: false
      };
    })(),
    SIGILL: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGILL", constants2.signals);
      return {
        name: "SIGILL",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 4;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Invalid machine instruction",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Ansi,
        forced: false
      };
    })(),
    SIGTRAP: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGTRAP", constants2.signals);
      return {
        name: "SIGTRAP",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 5;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Debugger breakpoint",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Posix,
        forced: false
      };
    })(),
    SIGABRT: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGABRT", constants2.signals);
      return {
        name: "SIGABRT",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 6;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Aborted",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Ansi,
        forced: false
      };
    })(),
    SIGIOT: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGIOT", constants2.signals);
      return {
        name: "SIGIOT",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 6;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Aborted",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Bsd,
        forced: false
      };
    })(),
    SIGBUS: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGBUS", constants2.signals);
      return {
        name: "SIGBUS",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 7;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Bus error due to misaligned, non-existing address or paging error",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Bsd,
        forced: false
      };
    })(),
    SIGEMT: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGEMT", constants2.signals);
      return {
        name: "SIGEMT",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 7;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Command should be emulated but is not implemented",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Other,
        forced: false
      };
    })(),
    SIGFPE: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGFPE", constants2.signals);
      return {
        name: "SIGFPE",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 8;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Floating point arithmetic error",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Ansi,
        forced: false
      };
    })(),
    SIGKILL: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGKILL", constants2.signals);
      return {
        name: "SIGKILL",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 9;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Forced termination",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: true
      };
    })(),
    SIGUSR1: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGUSR1", constants2.signals);
      return {
        name: "SIGUSR1",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 10;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGSEGV: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGSEGV", constants2.signals);
      return {
        name: "SIGSEGV",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 11;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Segmentation fault",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Ansi,
        forced: false
      };
    })(),
    SIGUSR2: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGUSR2", constants2.signals);
      return {
        name: "SIGUSR2",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 12;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGPIPE: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGPIPE", constants2.signals);
      return {
        name: "SIGPIPE",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 13;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Broken pipe or socket",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGALRM: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGALRM", constants2.signals);
      return {
        name: "SIGALRM",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 14;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Timeout or timer",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGTERM: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGTERM", constants2.signals);
      return {
        name: "SIGTERM",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 15;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Termination",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Ansi,
        forced: false
      };
    })(),
    SIGSTKFLT: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGSTKFLT", constants2.signals);
      return {
        name: "SIGSTKFLT",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 16;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Stack is empty or overflowed",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Other,
        forced: false
      };
    })(),
    SIGCHLD: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGCHLD", constants2.signals);
      return {
        name: "SIGCHLD",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 17;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Child process terminated, paused or unpaused",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Ignore,
        standard: Posix,
        forced: false
      };
    })(),
    SIGCLD: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGCLD", constants2.signals);
      return {
        name: "SIGCLD",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 17;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Child process terminated, paused or unpaused",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Ignore,
        standard: Other,
        forced: false
      };
    })(),
    SIGCONT: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGCONT", constants2.signals);
      return {
        name: "SIGCONT",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 18;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Unpaused",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Unpause,
        standard: Posix,
        forced: true
      };
    })(),
    SIGSTOP: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGSTOP", constants2.signals);
      return {
        name: "SIGSTOP",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 19;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Paused",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Pause,
        standard: Posix,
        forced: true
      };
    })(),
    SIGTSTP: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGTSTP", constants2.signals);
      return {
        name: "SIGTSTP",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 20;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: 'Paused using CTRL-Z or "suspend"',
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Pause,
        standard: Posix,
        forced: false
      };
    })(),
    SIGTTIN: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGTTIN", constants2.signals);
      return {
        name: "SIGTTIN",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 21;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Background process cannot read terminal input",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Pause,
        standard: Posix,
        forced: false
      };
    })(),
    SIGBREAK: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGBREAK", constants2.signals);
      return {
        name: "SIGBREAK",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 21;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "User interruption with CTRL-BREAK",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Other,
        forced: false
      };
    })(),
    SIGTTOU: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGTTOU", constants2.signals);
      return {
        name: "SIGTTOU",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 22;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Background process cannot write to terminal output",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Pause,
        standard: Posix,
        forced: false
      };
    })(),
    SIGURG: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGURG", constants2.signals);
      return {
        name: "SIGURG",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 23;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Socket received out-of-band data",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Ignore,
        standard: Bsd,
        forced: false
      };
    })(),
    SIGXCPU: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGXCPU", constants2.signals);
      return {
        name: "SIGXCPU",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 24;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Process timed out",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Bsd,
        forced: false
      };
    })(),
    SIGXFSZ: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGXFSZ", constants2.signals);
      return {
        name: "SIGXFSZ",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 25;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "File too big",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Bsd,
        forced: false
      };
    })(),
    SIGVTALRM: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGVTALRM", constants2.signals);
      return {
        name: "SIGVTALRM",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 26;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Timeout or timer",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Bsd,
        forced: false
      };
    })(),
    SIGPROF: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGPROF", constants2.signals);
      return {
        name: "SIGPROF",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 27;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Timeout or timer",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Bsd,
        forced: false
      };
    })(),
    SIGWINCH: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGWINCH", constants2.signals);
      return {
        name: "SIGWINCH",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 28;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Terminal window size changed",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Ignore,
        standard: Bsd,
        forced: false
      };
    })(),
    SIGIO: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGIO", constants2.signals);
      return {
        name: "SIGIO",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 29;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "I/O is available",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Other,
        forced: false
      };
    })(),
    SIGPOLL: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGPOLL", constants2.signals);
      return {
        name: "SIGPOLL",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 29;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Watched event",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Other,
        forced: false
      };
    })(),
    SIGINFO: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGINFO", constants2.signals);
      return {
        name: "SIGINFO",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 29;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Request for process information",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Ignore,
        standard: Other,
        forced: false
      };
    })(),
    SIGPWR: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGPWR", constants2.signals);
      return {
        name: "SIGPWR",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 30;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Device running out of power",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Systemv,
        forced: false
      };
    })(),
    SIGSYS: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGSYS", constants2.signals);
      return {
        name: "SIGSYS",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 31;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Invalid system call",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Core,
        standard: Other,
        forced: false
      };
    })(),
    SIGUNUSED: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGUNUSED", constants2.signals);
      return {
        name: "SIGUNUSED",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 31;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Invalid system call",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Other,
        forced: false
      };
    })(),
    SIGRT1: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT1", constants2.signals);
      return {
        name: "SIGRT1",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 34;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT2: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT2", constants2.signals);
      return {
        name: "SIGRT2",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 35;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT3: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT3", constants2.signals);
      return {
        name: "SIGRT3",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 36;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT4: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT4", constants2.signals);
      return {
        name: "SIGRT4",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 37;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT5: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT5", constants2.signals);
      return {
        name: "SIGRT5",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 38;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT6: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT6", constants2.signals);
      return {
        name: "SIGRT6",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 39;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT7: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT7", constants2.signals);
      return {
        name: "SIGRT7",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 40;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT8: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT8", constants2.signals);
      return {
        name: "SIGRT8",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 41;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT9: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT9", constants2.signals);
      return {
        name: "SIGRT9",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 42;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT10: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT10", constants2.signals);
      return {
        name: "SIGRT10",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 43;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT11: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT11", constants2.signals);
      return {
        name: "SIGRT11",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 44;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT12: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT12", constants2.signals);
      return {
        name: "SIGRT12",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 45;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT13: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT13", constants2.signals);
      return {
        name: "SIGRT13",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 46;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT14: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT14", constants2.signals);
      return {
        name: "SIGRT14",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 47;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT15: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT15", constants2.signals);
      return {
        name: "SIGRT15",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 48;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT16: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT16", constants2.signals);
      return {
        name: "SIGRT16",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 49;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT17: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT17", constants2.signals);
      return {
        name: "SIGRT17",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 50;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT18: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT18", constants2.signals);
      return {
        name: "SIGRT18",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 51;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT19: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT19", constants2.signals);
      return {
        name: "SIGRT19",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 52;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT20: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT20", constants2.signals);
      return {
        name: "SIGRT20",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 53;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT21: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT21", constants2.signals);
      return {
        name: "SIGRT21",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 54;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT22: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT22", constants2.signals);
      return {
        name: "SIGRT22",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 55;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT23: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT23", constants2.signals);
      return {
        name: "SIGRT23",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 56;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT24: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT24", constants2.signals);
      return {
        name: "SIGRT24",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 57;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT25: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT25", constants2.signals);
      return {
        name: "SIGRT25",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 58;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT26: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT26", constants2.signals);
      return {
        name: "SIGRT26",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 59;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT27: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT27", constants2.signals);
      return {
        name: "SIGRT27",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 60;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT28: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT28", constants2.signals);
      return {
        name: "SIGRT28",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 61;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT29: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT29", constants2.signals);
      return {
        name: "SIGRT29",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 62;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT30: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT30", constants2.signals);
      return {
        name: "SIGRT30",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 63;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })(),
    SIGRT31: (() => {
      const mbConstantSignal = _lookup(Nothing, Just, "SIGRT31", constants2.signals);
      return {
        name: "SIGRT31",
        number: (() => {
          if (mbConstantSignal.tag === 0) {
            return 64;
          }
          if (mbConstantSignal.tag === 1) {
            return mbConstantSignal._1;
          }
          fail();
        })(),
        description: "Application-specific signal (realtime)",
        supported: (() => {
          if (mbConstantSignal.tag === 0) {
            return false;
          }
          if (mbConstantSignal.tag === 1) {
            return true;
          }
          fail();
        })(),
        action: Terminate,
        standard: Posix,
        forced: false
      };
    })()
  };
  const signalsArray = toArrayWithKey((v) => identity12)(byName);
  return {
    byName,
    byNumber: foldlArray((acc) => (number) => {
      const $0 = find((v) => {
        const $02 = _lookup(Nothing, Just, v.name, constants2.signals);
        return $02.tag === 1 && number === $02._1;
      })(signalsArray);
      const $1 = find((x) => number === x.number)(signalsArray);
      if ($0.tag === 0) {
        if ($1.tag === 0) {
          return acc;
        }
        if ($1.tag === 1) {
          return insert(ordInt)(number)($1._1)(acc);
        }
        fail();
      }
      if ($0.tag === 0) {
        return acc;
      }
      if ($0.tag === 1) {
        return insert(ordInt)(number)($0._1)(acc);
      }
      fail();
    })(Leaf2)(rangeImpl(0, 64)),
    byString: byName
  };
})();

// output-es/Node.Library.Execa/foreign.js
function setTimeoutImpl2(timeout, cb) {
  const t = setTimeout(cb, timeout);
  return t.unref ? t : { unref: () => {
  } };
}

// output-es/Node.Library.Execa/index.js
var intercalate6 = /* @__PURE__ */ intercalate1(monoidString);
var for_3 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
var sequence_ = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe)(identity3);
var for_1 = /* @__PURE__ */ for_(applicativeAff)(foldableMaybe);
var noEscapeRegex = /* @__PURE__ */ unsafeRegex("^[\\w.-]+$")(noFlags);
var mkExecaResult = (r) => {
  const signalDescription = (() => {
    if (r.signal.tag === 1) {
      const $0 = fromKillSignalImpl(Left, Right, r.signal._1);
      if ($0.tag === 0) {
        const $1 = lookup(ordInt)($0._1)(signals2.byNumber);
        if ($1.tag === 1) {
          return $Maybe(1, $1._1.description);
        }
        return Nothing;
      }
      if ($0.tag === 1) {
        const $1 = _lookup(Nothing, Just, $0._1, signals2.byString);
        if ($1.tag === 1) {
          return $Maybe(1, $1._1.description);
        }
        return Nothing;
      }
      fail();
    }
    if (r.signal.tag === 0) {
      return Nothing;
    }
    fail();
  })();
  const errorCode = r.spawnError.tag === 1 ? $Maybe(1, getField("code", r.spawnError._1)) : Nothing;
  const shortMessage = (() => {
    if (r.timedOut && r.execaOptions.timeout.tag === 1) {
      return "Command timed out after (Milliseconds " + showNumberImpl(r.execaOptions.timeout._1) + ")milliseconds: " + r.command;
    }
    if (r.canceled) {
      return "Command was canceled: " + r.command;
    }
    if (errorCode.tag === 1) {
      return "Command failed with " + errorCode._1 + ": " + r.command;
    }
    if (r.signal.tag === 1 && signalDescription.tag === 1) {
      const $0 = fromKillSignalImpl(Left, Right, r.signal._1);
      if ($0.tag === 0) {
        return "Command was killed with " + showIntImpl($0._1) + " (" + signalDescription._1 + "): " + r.command;
      }
      if ($0.tag === 1) {
        return "Command was killed with " + showStringImpl($0._1) + " (" + signalDescription._1 + "): " + r.command;
      }
      fail();
    }
    if (r.exitCode.tag === 1) {
      return "Command failed with exit code " + showIntImpl(r.exitCode._1) + ": " + r.command;
    }
    if (r.stdinErr.tag === 1) {
      return "Command had error in `stdin`: " + message(r.stdinErr._1) + ": " + r.command;
    }
    if (r.stdoutErr.tag === 1) {
      return "Command had error in `stdout`: " + message(r.stdoutErr._1) + ": " + r.command;
    }
    if (r.stderrErr.tag === 1) {
      return "Command had error in `stderr`: " + message(r.stderrErr._1) + ": " + r.command;
    }
    if (r.spawnError.tag === 1) {
      return "Command failed to spawn: " + getField("message", r.spawnError._1) + ": " + r.command;
    }
    return "Command failed: " + r.command;
  })() + (r.spawnError.tag === 1 ? "\n" + getField("message", r.spawnError._1) : "");
  return {
    originalMessage: (() => {
      const $0 = r.spawnError.tag === 1 ? $Maybe(1, getField("message", r.spawnError._1)) : Nothing;
      const $1 = r.stdoutErr.tag === 0 ? r.stderrErr : r.stdoutErr;
      const $2 = (() => {
        if (r.stdinErr.tag === 0) {
          if ($1.tag === 1) {
            return $Maybe(1, message($1._1));
          }
          return Nothing;
        }
        if (r.stdinErr.tag === 1) {
          return $Maybe(1, message(r.stdinErr._1));
        }
        return Nothing;
      })();
      if ($0.tag === 0) {
        return $2;
      }
      return $0;
    })(),
    message: intercalate6("\n")([shortMessage, r.stderr, r.stdout]),
    shortMessage,
    escapedCommand: r.escapedCommand,
    exit: r.exitStatus,
    exitCode: r.exitCode,
    pid: r.pid,
    signal: r.signal,
    signalDescription,
    stdinError: r.stdinErr,
    stdoutError: r.stdoutErr,
    stderrError: r.stderrErr,
    stdout: r.stdout,
    stderr: r.stderr,
    timedOut: r.timedOut,
    canceled: r.canceled,
    killed: r.killed && !r.timedOut
  };
};
var getEnv2 = (r) => () => {
  const processEnv = getEnv();
  const env = r.extendEnv ? union(r.env)(processEnv) : r.env;
  if (r.preferLocal.tag === 0) {
    return env;
  }
  if (r.preferLocal.tag === 1) {
    return npmRunPathEnv(env)({
      cwd: r.preferLocal._1.localDir,
      path: defaultNpmRunPathOptions.path,
      execPath: r.preferLocal._1.execPath
    })();
  }
  fail();
};
var execaKill = (mbKillSignal) => (forceKillAfterTimeout) => (cp) => {
  const isSigTerm = fromKillSignal$p((i) => {
    const $0 = lookup(ordInt)(i)(signals2.byNumber);
    if ($0.tag === 0) {
      return false;
    }
    if ($0.tag === 1) {
      return "SIGTERM" === toUpper($0._1.name);
    }
    fail();
  })((s) => "SIGTERM" === toUpper(s));
  const killSignal = (() => {
    if (mbKillSignal.tag === 0) {
      return "SIGTERM";
    }
    if (mbKillSignal.tag === 1) {
      return mbKillSignal._1;
    }
    fail();
  })();
  return () => {
    const killSignalSucceeded = killStrImpl2(cp, killSignal);
    for_3(isSigTerm(killSignal) && killSignalSucceeded ? forceKillAfterTimeout : Nothing)((v) => {
      const $0 = unsafeClamp(floor(v));
      return () => {
        const t = setTimeoutImpl2($0, () => {
          killStrImpl2(cp, "SIGKILL");
        });
        return t.unref();
      };
    })();
    return killSignalSucceeded;
  };
};
var doubleQuotesregex = /* @__PURE__ */ unsafeRegex('"')(global2);
var getEscapedCommand = (file) => (args) => intercalate6(" ")(arrayMap((arg) => {
  if (test(noEscapeRegex)(arg)) {
    return arg;
  }
  return '"' + replace2(doubleQuotesregex)('\\"')(arg) + '"';
})([file, ...args]));
var defaultOptions = {
  cleanup: true,
  preferLocal: /* @__PURE__ */ $Maybe(1, { localDir: Nothing, execPath: Nothing }),
  stripFinalNewline: true,
  extendEnv: true,
  maxBuffer: /* @__PURE__ */ toNumber(1e8),
  encoding: UTF8,
  windowsVerbatimArguments: false,
  windowsHide: true,
  windowsEnableCmdEcho: false
};
var handleArguments = (file) => (args) => (initOptions) => {
  const $0 = parse3(file)(args)({
    shell: initOptions.shell,
    env: initOptions.env,
    cwd: initOptions.cwd,
    windowsVerbatimArguments: Nothing,
    windowsEnableCmdEcho: (() => {
      if (initOptions.windowsEnableCmdEcho.tag === 0) {
        return false;
      }
      if (initOptions.windowsEnableCmdEcho.tag === 1) {
        return initOptions.windowsEnableCmdEcho._1;
      }
      fail();
    })()
  });
  return () => {
    const parsed = $0();
    const processCwd = cwd();
    const env = getEnv2({
      env: (() => {
        if (initOptions.env.tag === 0) {
          return empty;
        }
        if (initOptions.env.tag === 1) {
          return initOptions.env._1;
        }
        fail();
      })(),
      extendEnv: (() => {
        if (initOptions.extendEnv.tag === 0) {
          return true;
        }
        if (initOptions.extendEnv.tag === 1) {
          return initOptions.extendEnv._1;
        }
        fail();
      })(),
      preferLocal: initOptions.preferLocal
    })();
    if (initOptions.timeout.tag === 1 && initOptions.timeout._1.milliseconds > 0) {
      return {
        file: parsed.command,
        args: parsed.args,
        options: {
          cleanup: (() => {
            if (initOptions.cleanup.tag === 0) {
              return true;
            }
            if (initOptions.cleanup.tag === 1) {
              return initOptions.cleanup._1;
            }
            fail();
          })(),
          stdioExtra: (() => {
            if (initOptions.stdioExtra.tag === 0) {
              return [];
            }
            if (initOptions.stdioExtra.tag === 1) {
              return initOptions.stdioExtra._1;
            }
            fail();
          })(),
          maxBuffer: (() => {
            if (initOptions.maxBuffer.tag === 0) {
              return defaultOptions.maxBuffer;
            }
            if (initOptions.maxBuffer.tag === 1) {
              return initOptions.maxBuffer._1;
            }
            fail();
          })(),
          stripFinalNewline: (() => {
            if (initOptions.stripFinalNewline.tag === 0) {
              return true;
            }
            if (initOptions.stripFinalNewline.tag === 1) {
              return initOptions.stripFinalNewline._1;
            }
            fail();
          })(),
          cwd: (() => {
            if (initOptions.cwd.tag === 0) {
              return processCwd;
            }
            if (initOptions.cwd.tag === 1) {
              return initOptions.cwd._1;
            }
            fail();
          })(),
          encoding: (() => {
            if (initOptions.encoding.tag === 0) {
              return UTF8;
            }
            if (initOptions.encoding.tag === 1) {
              return initOptions.encoding._1;
            }
            fail();
          })(),
          env,
          argv0: initOptions.argv0,
          detached: (() => {
            if (initOptions.detached.tag === 0) {
              return false;
            }
            if (initOptions.detached.tag === 1) {
              return initOptions.detached._1;
            }
            fail();
          })(),
          uid: initOptions.uid,
          gid: initOptions.gid,
          shell: initOptions.shell,
          timeout: $Maybe(1, initOptions.timeout._1.milliseconds),
          killSignal: $Maybe(1, initOptions.timeout._1.killSignal),
          timeoutWithKillSignal: $Maybe(1, initOptions.timeout._1),
          windowsHide: (() => {
            if (initOptions.windowsHide.tag === 0) {
              return true;
            }
            if (initOptions.windowsHide.tag === 1) {
              return initOptions.windowsHide._1;
            }
            fail();
          })(),
          windowsVerbatimArguments: (() => {
            if (parsed.options.windowsVerbatimArguments.tag === 0) {
              return false;
            }
            if (parsed.options.windowsVerbatimArguments.tag === 1) {
              return parsed.options.windowsVerbatimArguments._1;
            }
            fail();
          })()
        },
        parsed
      };
    }
    return {
      file: parsed.command,
      args: parsed.args,
      options: {
        cleanup: (() => {
          if (initOptions.cleanup.tag === 0) {
            return true;
          }
          if (initOptions.cleanup.tag === 1) {
            return initOptions.cleanup._1;
          }
          fail();
        })(),
        stdioExtra: (() => {
          if (initOptions.stdioExtra.tag === 0) {
            return [];
          }
          if (initOptions.stdioExtra.tag === 1) {
            return initOptions.stdioExtra._1;
          }
          fail();
        })(),
        maxBuffer: (() => {
          if (initOptions.maxBuffer.tag === 0) {
            return defaultOptions.maxBuffer;
          }
          if (initOptions.maxBuffer.tag === 1) {
            return initOptions.maxBuffer._1;
          }
          fail();
        })(),
        stripFinalNewline: (() => {
          if (initOptions.stripFinalNewline.tag === 0) {
            return true;
          }
          if (initOptions.stripFinalNewline.tag === 1) {
            return initOptions.stripFinalNewline._1;
          }
          fail();
        })(),
        cwd: (() => {
          if (initOptions.cwd.tag === 0) {
            return processCwd;
          }
          if (initOptions.cwd.tag === 1) {
            return initOptions.cwd._1;
          }
          fail();
        })(),
        encoding: (() => {
          if (initOptions.encoding.tag === 0) {
            return UTF8;
          }
          if (initOptions.encoding.tag === 1) {
            return initOptions.encoding._1;
          }
          fail();
        })(),
        env,
        argv0: initOptions.argv0,
        detached: (() => {
          if (initOptions.detached.tag === 0) {
            return false;
          }
          if (initOptions.detached.tag === 1) {
            return initOptions.detached._1;
          }
          fail();
        })(),
        uid: initOptions.uid,
        gid: initOptions.gid,
        shell: initOptions.shell,
        timeout: Nothing,
        killSignal: Nothing,
        timeoutWithKillSignal: Nothing,
        windowsHide: (() => {
          if (initOptions.windowsHide.tag === 0) {
            return true;
          }
          if (initOptions.windowsHide.tag === 1) {
            return initOptions.windowsHide._1;
          }
          fail();
        })(),
        windowsVerbatimArguments: (() => {
          if (parsed.options.windowsVerbatimArguments.tag === 0) {
            return false;
          }
          if (parsed.options.windowsVerbatimArguments.tag === 1) {
            return parsed.options.windowsVerbatimArguments._1;
          }
          fail();
        })()
      },
      parsed
    };
  };
};
var defaultExecaOptions = {
  cleanup: Nothing,
  preferLocal: Nothing,
  stdioExtra: Nothing,
  stripFinalNewline: Nothing,
  extendEnv: Nothing,
  encoding: Nothing,
  cwd: Nothing,
  env: Nothing,
  argv0: Nothing,
  detached: Nothing,
  uid: Nothing,
  gid: Nothing,
  shell: Nothing,
  timeout: Nothing,
  maxBuffer: Nothing,
  windowsVerbatimArguments: Nothing,
  windowsHide: Nothing,
  windowsEnableCmdEcho: Nothing
};
var execa = (file) => (args) => (buildOptions) => {
  const options = buildOptions(defaultExecaOptions);
  return _bind(_liftEffect(handleArguments(file)(args)(options)))((parsed) => {
    const escapedCommand = getEscapedCommand(file)(args);
    const command2 = file + " " + intercalate6(" ")(args);
    return _bind(_liftEffect(spawn$p(parsed.file)(parsed.args)((v) => ({
      cwd: $Maybe(1, parsed.options.cwd),
      env: $Maybe(1, parsed.options.env),
      argv0: options.argv0,
      appendStdio: $Maybe(1, parsed.options.stdioExtra),
      detached: options.detached,
      uid: options.uid,
      gid: options.gid,
      serialization: Nothing,
      shell: options.shell.tag === 1 ? $Maybe(1, options.shell._1) : Nothing,
      windowsVerbatimArguments: $Maybe(1, parsed.options.windowsVerbatimArguments),
      windowsHide: $Maybe(1, parsed.options.windowsHide),
      timeout: v.timeout,
      killSignal: v.killSignal
    }))))((spawned) => _bind(_liftEffect(() => ({ value: Nothing })))((stdinErrRef) => _bind(_liftEffect(() => ({ value: false })))((canceledRef) => _bind(suspendAff(waitSpawned(spawned)))((spawnedFiber) => _bind(!parsed.options.cleanup || parsed.options.detached ? _pure(spawnedFiber) : suspendAff(_bind(_liftEffect(() => ({ value: Nothing })))((removeHandlerRef) => $$finally(_liftEffect(() => {
      const $0 = removeHandlerRef.value;
      return sequence_($0)();
    }))(_bind(_liftEffect((() => {
      const $0 = onExit$p((v) => (v1) => () => {
        killStrImpl2(spawned, "SIGTERM");
      })({ alwaysLast: false });
      return () => {
        const removal = $0();
        return removeHandlerRef.value = $Maybe(1, removal);
      };
    })()))(() => joinFiber(spawnedFiber))))))((processSpawnedFiber) => {
      const mainFiber = (postSpawn) => _bind(joinFiber(processSpawnedFiber))((res) => {
        if (res.tag === 0) {
          const $0 = res._1;
          return _liftEffect((() => {
            const gotENOENT = getField("code", $0) === "ENOENT";
            return () => {
              const a$p = exitCodeImpl(spawned);
              const unfixedExitCode$p = nullable(a$p, Nothing, Just);
              const a$p$1 = signalCodeImpl(spawned);
              const signalCode$p = nullable(a$p$1, Nothing, Just);
              const exitCode$p = unfixedExitCode$p.tag === 1 && gotENOENT ? $Maybe(1, 127) : unfixedExitCode$p;
              const canceled = canceledRef.value;
              const killed$p = killedImpl(spawned);
              return mkExecaResult({
                spawnError: $Maybe(1, $0),
                pid: Nothing,
                stdinErr: Nothing,
                stdoutErr: Nothing,
                stderrErr: Nothing,
                exitStatus: (() => {
                  if (exitCode$p.tag === 1) {
                    return $Exit(0, exitCode$p._1);
                  }
                  if (signalCode$p.tag === 1) {
                    return $Exit(1, signalCode$p._1);
                  }
                  return _crashWith("Impossible: either exit or signal should be non-null");
                })(),
                exitCode: exitCode$p,
                signal: signalCode$p.tag === 1 ? $Maybe(1, signalCode$p._1) : Nothing,
                stdout: "",
                stderr: "",
                command: command2,
                escapedCommand,
                execaOptions: parsed.options,
                timedOut: false,
                canceled,
                killed: killed$p
              });
            };
          })());
        }
        if (res.tag === 1) {
          const $0 = res._1;
          return _bind(_liftEffect(() => ({ value: Nothing })))((timeoutRef) => _bind(_liftEffect(() => ({ value: () => {
          } })))((clearKillOnTimeoutRef) => _bind(_map((v) => {
          })(forkAff((() => {
            if (parsed.options.timeoutWithKillSignal.tag === 1) {
              const $1 = parsed.options.timeoutWithKillSignal._1.milliseconds;
              const $2 = parsed.options.timeoutWithKillSignal._1.killSignal;
              return makeAff((cb) => {
                const $3 = setTimeoutImpl($1)(() => {
                  const killed$p = killedImpl(spawned);
                  if (!killed$p) {
                    killStrImpl2(spawned, $2);
                    const a$p = pidImpl(spawned);
                    for_3(nullable(a$p, Nothing, Just))((v) => {
                      const $32 = unsafeStdin(spawned);
                      return () => {
                        destroyImpl($32);
                        destroyImpl(unsafeStdout(spawned));
                        destroyImpl(unsafeStderr(spawned));
                      };
                    })();
                    timeoutRef.value = $Maybe(1, $2);
                  } else if (killed$p) {
                  } else {
                    fail();
                  }
                  return cb($Either(1, void 0))();
                });
                return () => {
                  const tid = $3();
                  clearKillOnTimeoutRef.value = clearTimeoutImpl(tid);
                  return nonCanceler;
                };
              });
            }
            return never;
          })())))(() => _bind(_liftEffect((() => {
            const $1 = unsafeStdin(spawned);
            return () => unsafeOnce($1, "error", (error3) => stdinErrRef.value = $Maybe(1, error3));
          })()))(() => _bind(for_1(postSpawn)((callback) => callback($0)))(() => _bind(forkAff(makeAff((done) => {
            const $1 = exitH._2((exitResult) => () => {
              const $12 = clearKillOnTimeoutRef.value;
              $12();
              return done($Either(1, exitResult))();
            });
            return () => {
              unsafeOnce(spawned, exitH._1, $1);
              return nonCanceler;
            };
          })))((v) => {
            const mkStdIoFiber = (stream2) => forkAff(_bind(getStreamBuffer(stream2)({
              maxBuffer: $Maybe(1, parsed.options.maxBuffer)
            }))((streamResult) => _bind(_liftEffect((() => {
              const $1 = parsed.options.stripFinalNewline ? stripFinalNewlineBuf(streamResult.buffer) : () => streamResult.buffer;
              return () => {
                const buf = $1();
                if ((() => {
                  if (streamResult.inputError.tag === 0) {
                    return false;
                  }
                  if (streamResult.inputError.tag === 1) {
                    return true;
                  }
                  fail();
                })()) {
                  destroyImpl(stream2);
                }
                return toString2(parsed.options.encoding)(buf);
              };
            })()))((text2) => _pure({ text: text2, error: streamResult.inputError }))));
            return _bind(mkStdIoFiber(unsafeStdout(spawned)))((stdoutFiber) => _bind(mkStdIoFiber(unsafeStderr(spawned)))((stderrFiber) => _bind(_sequential(_parAffApply(_parAffApply(_parAffMap((v1) => (v2) => (v3) => ({ exit: v1, stdout: v2, stderr: v3 }))(joinFiber(v)))(joinFiber(stdoutFiber)))(joinFiber(stderrFiber))))((result) => _liftEffect(() => {
              const stdinErr = stdinErrRef.value;
              const canceled = canceledRef.value;
              const killed$p = killedImpl(spawned);
              const timeout = timeoutRef.value;
              if (result.exit.tag === 0) {
                return mkExecaResult({
                  spawnError: Nothing,
                  stdinErr,
                  stdoutErr: result.stdout.error,
                  stderrErr: result.stderr.error,
                  exitStatus: result.exit,
                  exitCode: $Maybe(1, result.exit._1),
                  pid: $Maybe(1, $0),
                  signal: timeout,
                  stdout: result.stdout.text,
                  stderr: result.stderr.text,
                  command: command2,
                  escapedCommand,
                  execaOptions: parsed.options,
                  timedOut: (() => {
                    if (timeout.tag === 0) {
                      return false;
                    }
                    if (timeout.tag === 1) {
                      return true;
                    }
                    fail();
                  })(),
                  canceled,
                  killed: killed$p
                });
              }
              if (result.exit.tag === 1) {
                return mkExecaResult({
                  spawnError: Nothing,
                  stdinErr,
                  stdoutErr: result.stdout.error,
                  stderrErr: result.stderr.error,
                  exitStatus: result.exit,
                  exitCode: Nothing,
                  pid: $Maybe(1, $0),
                  signal: $Maybe(1, result.exit._1),
                  stdout: result.stdout.text,
                  stderr: result.stderr.text,
                  command: command2,
                  escapedCommand,
                  execaOptions: parsed.options,
                  timedOut: (() => {
                    if (timeout.tag === 0) {
                      return false;
                    }
                    if (timeout.tag === 1) {
                      return true;
                    }
                    fail();
                  })(),
                  canceled,
                  killed: killed$p
                });
              }
              fail();
            }))));
          }))))));
        }
        fail();
      });
      return _pure({
        cancel: _liftEffect(() => {
          const killSucceeded = killStrImpl2(spawned, "SIGTERM");
          if (killSucceeded) {
            return canceledRef.value = true;
          }
        }),
        getResult: mainFiber(Nothing),
        "getResult'": (cb) => mainFiber($Maybe(1, cb)),
        unsafeChannelRef: _liftEffect(() => unsafeChannelRefImpl(spawned)),
        unsafeChannelUnref: _liftEffect(() => unsafeChannelUnrefImpl(spawned)),
        connected: _liftEffect(() => connectedImpl(spawned)),
        disconnect: _liftEffect(() => disconnectImpl2(spawned)),
        kill: _liftEffect(() => killImpl2(spawned)),
        killWithSignal: (signal) => _liftEffect(() => killStrImpl2(spawned, signal)),
        killForced: (forceKillAfterTimeout) => _liftEffect(execaKill($Maybe(1, "SIGTERM"))($Maybe(1, forceKillAfterTimeout))(spawned)),
        killForcedWithSignal: (signal) => (forceKillAfterTimeout) => _liftEffect(execaKill($Maybe(1, signal))($Maybe(
          1,
          forceKillAfterTimeout
        ))(spawned)),
        killed: _liftEffect(() => killedImpl(spawned)),
        unref: _liftEffect(() => unrefImpl(spawned)),
        ref: _liftEffect(() => refImpl(spawned)),
        spawnArgs: spawnArgs(spawned),
        spawnFile: spawnFile(spawned),
        childProcess: spawned,
        stdin: {
          stream: unsafeStdin(spawned),
          writeUtf8: (string2) => _liftEffect(() => {
            writeImpl(unsafeStdin(spawned), fromString3(string2)(UTF8));
          }),
          writeUtf8End: (string2) => _liftEffect(() => {
            writeImpl(unsafeStdin(spawned), fromString3(string2)(UTF8));
            endImpl(unsafeStdin(spawned));
          }),
          end: _liftEffect((() => {
            const $0 = unsafeStdin(spawned);
            return () => {
              endImpl($0);
            };
          })()),
          pipeFromParentProcessStdin: _liftEffect((() => {
            const $0 = unsafeStdin(spawned);
            return () => {
              pipeImpl(stdin, $0);
            };
          })())
        },
        stdout: {
          stream: unsafeStdout(spawned),
          pipeToParentStdout: _liftEffect((() => {
            const $0 = unsafeStdout(spawned);
            return () => {
              pipeImpl($0, stdout);
            };
          })())
        },
        stderr: {
          stream: unsafeStderr(spawned),
          pipeToParentStderr: _liftEffect((() => {
            const $0 = unsafeStderr(spawned);
            return () => {
              pipeImpl($0, stderr);
            };
          })())
        },
        waitSpawned: _bind(_liftEffect(() => {
          const a$p = pidImpl(spawned);
          return nullable(a$p, Nothing, Just);
        }))((mbPid) => {
          if (mbPid.tag === 1) {
            return _pure($Either(1, mbPid._1));
          }
          if (mbPid.tag === 0) {
            return waitSpawned(spawned);
          }
          fail();
        })
      });
    })))));
  });
};

// output-es/UpChangelog.Git/index.js
var identity13 = (x) => x;
var git = (cmd) => (args) => monadAffApp.liftAff(_bind(execa("git")([cmd, ...args])(identity13))((v) => v.getResult));

// output-es/UpChangelog.Utils/foreign.js
var toUtcDate = (str) => {
  try {
    return new Date(str).toISOString();
  } catch (e) {
    return null;
  }
};

// output-es/UpChangelog.Utils/index.js
var lines = /* @__PURE__ */ split("\n");
var commaSeparate = (v) => {
  if (v.length === 0) {
    return "";
  }
  if (v.length === 1) {
    return v[0];
  }
  if (v.length === 2) {
    return v[0] + " and " + v[1];
  }
  const $0 = unsnoc(v);
  if ($0.tag === 1) {
    return joinWith(", ")($0._1.init) + ", and " + $0._1.last;
  }
  return _crashWith("This is not possible");
};
var breakOnEnd = (ptn) => (s) => {
  const $0 = lastIndexOf2(ptn)(s);
  if ($0.tag === 0) {
    return { before: "", after: s };
  }
  if ($0.tag === 1) {
    return splitAt2($0._1)(s);
  }
  fail();
};
var breakOn = (ptn) => (s) => {
  const $0 = indexOf2(ptn)(s);
  if ($0.tag === 0) {
    return { before: s, after: "" };
  }
  if ($0.tag === 1) {
    return splitAt2($0._1)(s);
  }
  fail();
};

// output-es/UpChangelog.Command.Init/index.js
var init = /* @__PURE__ */ (() => bindApp.bind(monadAskEnvApp.ask)((v) => {
  const $0 = v.cli.changelogDir;
  const $1 = v.cli.changelogFile;
  const $2 = v.cli.overwriteReadme;
  return bindApp.bind((() => {
    const $3 = logDebug("Changelog dir, '" + $0 + "' already exists.");
    const $4 = bindApp.bind(logInfo("Changelog dir, '" + $0 + "' does not exist. Creating..."))(() => bindApp.bind(monadEffectApp.liftEffect(resolve([])($0)))((absChangelogDir) => bindApp.bind(monadAffApp.liftAff(toAff2(mkdir$p)(absChangelogDir)({
      recursive: true,
      mode: permsAll
    })))(() => logInfo("Changelog dir, '" + $0 + "' created."))));
    return bindApp.bind(monadEffectApp.liftEffect(() => existsSync($0)))((cond$p) => {
      if (cond$p) {
        return $3;
      }
      return $4;
    });
  })())(() => {
    const readme = concat2([$0, "README.md"]);
    return bindApp.bind(bindApp.bind(monadEffectApp.liftEffect(() => existsSync(readme)))((fileExists) => {
      if (fileExists && !$2) {
        return bindApp.bind(logError("File, '" + readme + "', exists but --overwrite-readme flag not used. Not overwriting."))(() => applicativeApp.pure(false));
      }
      return bindApp.bind(logDebug("File, '" + readme + "', either does not exist or --overwrite-readme flag was used. Overwriting."))(() => bindApp.bind(monadAffApp.liftAff(toAff3(writeTextFile)(UTF8)(readme)(readmeContent)))(() => bindApp.bind((() => {
        const $3 = _map((v$1) => {
        });
        const $4 = git("add")([readme]);
        return (x) => $3($4(x));
      })())(() => bindApp.bind(logDebug("Staged file, '" + readme + "'."))(() => applicativeApp.pure(true)))));
    }))((dirReadme) => bindApp.bind(bindApp.bind(monadEffectApp.liftEffect(() => existsSync($1)))((fileExists) => {
      if (fileExists) {
        return bindApp.bind(logInfo("File, '" + $1 + "', exists. Not overwriting."))(() => bindApp.bind(logDebug("Checking whether file's content can be separated between the preamble and release entries..."))(() => bindApp.bind(monadAffApp.liftAff(toAff2(readTextFile)(UTF8)($1)))((fileContent) => {
          const v1 = breakOn("\n## ")(fileContent);
          if (v1.before !== "" && v1.after !== "") {
            return bindApp.bind(logInfo("File's content will be split properly when calling `update` command in future."))(() => applicativeApp.pure(true));
          }
          return bindApp.bind(logError("Could not find a match for pattern: '\n## '. Wil not properly split changelog when `update` command is used later."))(() => bindApp.bind(logDebug(joinWith(" ")([
            "A changelog file needs to have some initial content (called the preamble)",
            "followed by the separator (a line starting with '## ') for the `update`",
            " command to function correctly."
          ])))(() => applicativeApp.pure(false)));
        })));
      }
      return bindApp.bind(logDebug("File, '" + $1 + "', does not exist. Creating."))(() => bindApp.bind(monadAffApp.liftAff(toAff3(writeTextFile)(UTF8)($1)(changelogContent)))(() => bindApp.bind((() => {
        const $3 = _map((v$1) => {
        });
        const $4 = git("add")([$1]);
        return (x) => $3($4(x));
      })())(() => bindApp.bind(logDebug("Staged file, '" + $1 + "'."))(() => applicativeApp.pure(true)))));
    }))((logFile) => {
      const $3 = dirReadme && logFile;
      const $4 = monadEffectApp.liftEffect(throwException(error(joinWith("\n")([
        "Failed to initialize repo, so that calling `update` command in future works properly.",
        "Rerun this command with `--log-debug` to see more context."
      ]))));
      if (!$3) {
        return $4;
      }
      if ($3) {
        return applicativeApp.pure();
      }
      fail();
    }));
  });
}))();

// output-es/Data.Argonaut.Core/foreign.js
function stringify(j) {
  return JSON.stringify(j);
}
function _caseJson(isNull2, isBool, isNum, isStr, isArr, isObj, j) {
  if (j == null)
    return isNull2();
  else if (typeof j === "boolean")
    return isBool(j);
  else if (typeof j === "number")
    return isNum(j);
  else if (typeof j === "string")
    return isStr(j);
  else if (Object.prototype.toString.call(j) === "[object Array]")
    return isArr(j);
  else
    return isObj(j);
}

// output-es/Data.Argonaut.Decode.Error/index.js
var $JsonDecodeError = (tag, _1, _2) => ({ tag, _1, _2 });
var AtKey = (value0) => (value1) => $JsonDecodeError(3, value0, value1);
var MissingValue = /* @__PURE__ */ $JsonDecodeError(
  5
  /* MissingValue */
);
var printJsonDecodeError = (err) => {
  const go = (v) => {
    if (v.tag === 0) {
      return "  Expected value of type '" + v._1 + "'.";
    }
    if (v.tag === 1) {
      return "  Unexpected value " + stringify(v._1) + ".";
    }
    if (v.tag === 2) {
      return "  At array index " + showIntImpl(v._1) + ":\n" + go(v._2);
    }
    if (v.tag === 3) {
      return "  At object key '" + v._1 + "':\n" + go(v._2);
    }
    if (v.tag === 4) {
      return "  Under '" + v._1 + "':\n" + go(v._2);
    }
    if (v.tag === 5) {
      return "  No value was found.";
    }
    fail();
  };
  return "An error occurred while decoding a JSON value:\n" + go(err);
};

// output-es/Data.Argonaut.Decode.Class/index.js
var gDecodeJsonNil = { gDecodeJson: (v) => (v1) => $Either(1, {}) };
var decodeRecord = (dictGDecodeJson) => () => ({
  decodeJson: (json2) => {
    const v = _caseJson(
      (v2) => Nothing,
      (v2) => Nothing,
      (v2) => Nothing,
      (v2) => Nothing,
      (v2) => Nothing,
      Just,
      json2
    );
    if (v.tag === 1) {
      return dictGDecodeJson.gDecodeJson(v._1)($$Proxy);
    }
    if (v.tag === 0) {
      return $Either(0, $JsonDecodeError(0, "Object"));
    }
    fail();
  }
});
var gDecodeJsonCons = (dictDecodeJsonField) => (dictGDecodeJson) => (dictIsSymbol) => () => () => ({
  gDecodeJson: (object) => (v) => {
    const fieldName = dictIsSymbol.reflectSymbol($$Proxy);
    const v1 = dictDecodeJsonField.decodeJsonField(_lookup(Nothing, Just, fieldName, object));
    if (v1.tag === 1) {
      const $0 = AtKey(fieldName);
      if (v1._1.tag === 0) {
        return $Either(0, $0(v1._1._1));
      }
      if (v1._1.tag === 1) {
        const $1 = v1._1._1;
        const $2 = dictGDecodeJson.gDecodeJson(object)($$Proxy);
        return (() => {
          if ($2.tag === 0) {
            const $3 = $2._1;
            return (v$1) => $Either(0, $3);
          }
          if ($2.tag === 1) {
            const $3 = $2._1;
            return (f) => f($3);
          }
          fail();
        })()((rest) => $Either(1, unsafeSet(dictIsSymbol.reflectSymbol($$Proxy))($1)(rest)));
      }
      fail();
    }
    if (v1.tag === 0) {
      return $Either(0, $JsonDecodeError(3, fieldName, MissingValue));
    }
    fail();
  }
});

// output-es/Data.Argonaut.Parser/foreign.js
function _jsonParser(fail3, succ, s) {
  try {
    return succ(JSON.parse(s));
  } catch (e) {
    return fail3(e.message);
  }
}

// output-es/Data.Argonaut.Decode.Parser/index.js
var parseJson = (x) => {
  const $0 = _jsonParser(Left, Right, x);
  if ($0.tag === 0) {
    return $Either(0, $JsonDecodeError(0, "JSON"));
  }
  if ($0.tag === 1) {
    return $Either(1, $0._1);
  }
  fail();
};

// output-es/Data.Formatter.Parser.Utils/index.js
var printPosition = (v) => "(line " + showIntImpl(v.line) + ", col " + showIntImpl(v.column) + ")";
var runP = (p) => (s) => {
  const $0 = runParserT1(s)((state1, more, lift12, $$throw, done) => more((v2) => more((v1) => p(
    state1,
    more,
    lift12,
    $$throw,
    (state2, a) => more((v2$1) => more((v3) => eof(state2, more, lift12, $$throw, (state3, a$1) => more((v4) => done(state3, a)))))
  ))));
  if ($0.tag === 0) {
    return $Either(0, $0._1._1 + " " + printPosition($0._1._2));
  }
  if ($0.tag === 1) {
    return $Either(1, $0._1);
  }
  fail();
};
var oneOfAs = (dictFunctor) => (dictFoldable) => {
  const choice2 = choice(dictFoldable);
  return (dictMonad) => (p) => (xs) => choice2(dictFunctor.map((v) => {
    const $0 = v._2;
    const $1 = p(v._1);
    return (state1, more, lift12, $$throw, done) => more((v1) => $1(state1, more, lift12, $$throw, (state2, a) => more((v2) => done(state2, $0))));
  })(xs));
};

// output-es/Data.Formatter.Parser.Number/index.js
var oneOfAs2 = /* @__PURE__ */ oneOfAs(functorArray)(foldableArray);
var parseDigit = (dictMonad) => {
  const $0 = oneOfAs2(dictMonad)($$char)([
    $Tuple("0", 0),
    $Tuple("1", 1),
    $Tuple("2", 2),
    $Tuple("3", 3),
    $Tuple("4", 4),
    $Tuple("5", 5),
    $Tuple("6", 6),
    $Tuple("7", 7),
    $Tuple("8", 8),
    $Tuple("9", 9)
  ]);
  return (v1, $1, $2, $3, $4) => {
    const $5 = v1._3;
    return $0(v1, $1, $2, (v2, $6) => $3($ParseState(v2._1, v2._2, $5), $6), $4);
  };
};

// output-es/Data.Formatter.DateTime/index.js
var $FormatterCommand = (tag, _1) => ({ tag, _1 });
var $Meridiem = (tag) => tag;
var bind = /* @__PURE__ */ (() => bindReaderT(bindEither).bind)();
var for_4 = /* @__PURE__ */ for_(applicativeEither)(foldableArray);
var oneOfAs3 = /* @__PURE__ */ oneOfAs(functorArray)(foldableArray);
var negate = (a) => -a;
var identity14 = (x) => x;
var monadStateT = {
  Applicative0: () => applicativeStateT(monadIdentity),
  Bind1: () => bindStateT(monadIdentity)
};
var lift1 = (m) => (state1, v, lift$p, v1, done) => lift$p(bindStateT(monadIdentity).Apply0().Functor0().map((a) => (v2) => done(state1, a))(m));
var monadStateStateT2 = /* @__PURE__ */ monadStateStateT(monadIdentity);
var parseDigit2 = /* @__PURE__ */ parseDigit(monadStateT);
var mapParserT2 = /* @__PURE__ */ mapParserT(/* @__PURE__ */ monadRecStateT(monadRecIdentity));
var foldMap2 = /* @__PURE__ */ (() => foldableList.foldMap(monoidParserT(monoidUnit)))();
var AM = /* @__PURE__ */ $Meridiem(
  0
  /* AM */
);
var PM = /* @__PURE__ */ $Meridiem(
  1
  /* PM */
);
var YearFull = /* @__PURE__ */ $FormatterCommand(
  0
  /* YearFull */
);
var MonthTwoDigits = /* @__PURE__ */ $FormatterCommand(
  5
  /* MonthTwoDigits */
);
var DayOfMonthTwoDigits = /* @__PURE__ */ $FormatterCommand(
  6
  /* DayOfMonthTwoDigits */
);
var Hours24 = /* @__PURE__ */ $FormatterCommand(
  12
  /* Hours24 */
);
var MinutesTwoDigits = /* @__PURE__ */ $FormatterCommand(
  16
  /* MinutesTwoDigits */
);
var SecondsTwoDigits = /* @__PURE__ */ $FormatterCommand(
  18
  /* SecondsTwoDigits */
);
var Milliseconds = /* @__PURE__ */ $FormatterCommand(
  19
  /* Milliseconds */
);
var validateRange = (min2) => (max3) => bind(Right)((v) => {
  const $0 = v.num < min2 || v.num > max3 ? $Either(0, "Number is out of range [ " + showIntImpl(min2) + ", " + showIntImpl(max3) + " ]") : $Either(1, void 0);
  return (v$1) => $0;
});
var validAccum = (v) => {
  if (v.hour.tag === 1 && v.hour._1 === 24) {
    return for_4([v.minute, v.second, v.millisecond])((val) => {
      if ((() => {
        if (val.tag === 0) {
          return false;
        }
        if (val.tag === 1) {
          return val._1 > 0;
        }
        fail();
      })()) {
        return $Either(0, "When hour is 24, other time components must be 0");
      }
      return $Either(1, void 0);
    });
  }
  return $Either(1, void 0);
};
var takeSome = (dictAlternative) => {
  const Applicative0 = dictAlternative.Applicative0();
  return (dictLazy) => (v) => (v1) => {
    if (v === 0) {
      return Applicative0.pure(Nil);
    }
    return Applicative0.Apply0().apply(dictAlternative.Plus1().Alt0().Functor0().map(Cons)(v1))(dictLazy.defer((v3) => takeMany(dictAlternative)(dictLazy)(v - 1 | 0)(v1)));
  };
};
var takeMany = (dictAlternative) => {
  const $0 = dictAlternative.Applicative0();
  return (dictLazy) => (v) => (v1) => {
    if (v === 0) {
      return $0.pure(Nil);
    }
    return dictAlternative.Plus1().Alt0().alt(takeSome(dictAlternative)(dictLazy)(v)(v1))($0.pure(Nil));
  };
};
var takeSome1 = /* @__PURE__ */ takeSome(alternativeParserT)(lazyParserT);
var parseShortMonth = (dictMonad) => oneOfAs3(dictMonad)((x) => (v1, $0, $1, $2, $3) => {
  const $4 = v1._3;
  return string(x)(v1, $0, $1, (v2, $5) => $2($ParseState(v2._1, v2._2, $4), $5), $3);
})([
  $Tuple("Jan", January),
  $Tuple("Feb", February),
  $Tuple("Mar", March),
  $Tuple("Apr", April),
  $Tuple("May", May),
  $Tuple("Jun", June),
  $Tuple("Jul", July),
  $Tuple("Aug", August),
  $Tuple("Sep", September),
  $Tuple("Oct", October),
  $Tuple("Nov", November),
  $Tuple("Dec", December)
]);
var parseShortMonth1 = /* @__PURE__ */ parseShortMonth(monadStateT);
var parseMonth = (dictMonad) => oneOfAs3(dictMonad)((x) => (v1, $0, $1, $2, $3) => {
  const $4 = v1._3;
  return string(x)(v1, $0, $1, (v2, $5) => $2($ParseState(v2._1, v2._2, $4), $5), $3);
})([
  $Tuple("January", January),
  $Tuple("February", February),
  $Tuple("March", March),
  $Tuple("April", April),
  $Tuple("May", May),
  $Tuple("June", June),
  $Tuple("July", July),
  $Tuple("August", August),
  $Tuple("September", September),
  $Tuple("October", October),
  $Tuple("November", November),
  $Tuple("December", December)
]);
var parseMonth1 = /* @__PURE__ */ parseMonth(monadStateT);
var parseMeridiem = (dictMonad) => oneOfAs3(dictMonad)((x) => (v1, $0, $1, $2, $3) => {
  const $4 = v1._3;
  return string(x)(v1, $0, $1, (v2, $5) => $2($ParseState(v2._1, v2._2, $4), $5), $3);
})([$Tuple("am", AM), $Tuple("AM", AM), $Tuple("pm", PM), $Tuple("PM", PM)]);
var parseMeridiem1 = /* @__PURE__ */ parseMeridiem(monadStateT);
var parseInt2 = (dictMonad) => {
  const parseDigit1 = parseDigit(dictMonad);
  return (maxLength) => (validators) => (errMsg) => {
    const $0 = takeSome1(maxLength)(parseDigit1);
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => (() => {
        const go = (go$a0$copy) => (go$a1$copy) => {
          let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
          while (go$c) {
            const b = go$a0, v3 = go$a1;
            if (v3.tag === 0) {
              go$c = false;
              go$r = b;
              continue;
            }
            if (v3.tag === 1) {
              go$a0 = (b * 10 | 0) + v3._1 | 0;
              go$a1 = v3._2;
              continue;
            }
            fail();
          }
          return go$r;
        };
        const num = go(0)(a);
        const v = validators({
          length: (() => {
            const go$1 = (go$1$a0$copy) => (go$1$a1$copy) => {
              let go$1$a0 = go$1$a0$copy, go$1$a1 = go$1$a1$copy, go$1$c = true, go$1$r;
              while (go$1$c) {
                const b = go$1$a0, v3 = go$1$a1;
                if (v3.tag === 0) {
                  go$1$c = false;
                  go$1$r = b;
                  continue;
                }
                if (v3.tag === 1) {
                  go$1$a0 = b + 1 | 0;
                  go$1$a1 = v3._2;
                  continue;
                }
                fail();
              }
              return go$1$r;
            };
            return go$1(0)(a);
          })(),
          num,
          maxLength
        });
        if (v.tag === 0) {
          return fail2(errMsg + "(" + v._1 + ")");
        }
        if (v.tag === 1) {
          return (state1$1, v$1, v1$1, v2$1, done$1) => done$1(state1$1, num);
        }
        fail();
      })()(state2, more, lift1$1, $$throw, done))
    ));
  };
};
var parseInt1 = /* @__PURE__ */ parseInt2(monadStateT);
var parseSignedInt = (dictMonad) => {
  const parseInt22 = parseInt2(dictMonad);
  return (maxLength) => (validators) => (errMsg) => {
    const $0 = optionMaybe(withErrorMessage(satisfy((v) => v === "-"))("'-'"));
    return (state1, more, lift1$1, $$throw, done) => more((v1) => more((v1$1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => {
        const $1 = (() => {
          if (a.tag === 0) {
            return false;
          }
          if (a.tag === 1) {
            return true;
          }
          fail();
        })();
        return more((v2$1) => {
          const $2 = $1 ? negate : identity14;
          const $3 = parseInt22(maxLength)(validators)(errMsg);
          return more((v1$2) => $3(state2, more, lift1$1, $$throw, (state2$1, a$1) => more((v2$2) => done(state2$1, $2(a$1)))));
        });
      })
    )));
  };
};
var parseSignedInt1 = /* @__PURE__ */ parseSignedInt(monadStateT);
var parseDayOfWeekNameShort = (dictMonad) => oneOfAs3(dictMonad)((x) => (v1, $0, $1, $2, $3) => {
  const $4 = v1._3;
  return string(x)(v1, $0, $1, (v2, $5) => $2($ParseState(v2._1, v2._2, $4), $5), $3);
})([
  $Tuple("Mon", Monday),
  $Tuple("Tue", Tuesday),
  $Tuple("Wed", Wednesday),
  $Tuple("Thu", Thursday),
  $Tuple("Fri", Friday),
  $Tuple("Sat", Saturday),
  $Tuple("Sun", Sunday)
]);
var parseDayOfWeekNameShort1 = /* @__PURE__ */ parseDayOfWeekNameShort(monadStateT);
var parseDayOfWeekName = (dictMonad) => oneOfAs3(dictMonad)((x) => (v1, $0, $1, $2, $3) => {
  const $4 = v1._3;
  return string(x)(v1, $0, $1, (v2, $5) => $2($ParseState(v2._1, v2._2, $4), $5), $3);
})([
  $Tuple("Monday", Monday),
  $Tuple("Tuesday", Tuesday),
  $Tuple("Wednesday", Wednesday),
  $Tuple("Thursday", Thursday),
  $Tuple("Friday", Friday),
  $Tuple("Saturday", Saturday),
  $Tuple("Sunday", Sunday)
]);
var parseDayOfWeekName1 = /* @__PURE__ */ parseDayOfWeekName(monadStateT);
var initialAccum = {
  year: Nothing,
  month: Nothing,
  day: Nothing,
  hour: Nothing,
  minute: Nothing,
  second: Nothing,
  millisecond: Nothing,
  meridiem: Nothing
};
var exactLength = /* @__PURE__ */ bind(Right)((v) => {
  const $0 = v.maxLength !== v.length ? $Either(0, "Expected " + showIntImpl(v.maxLength) + " digits but got " + showIntImpl(v.length)) : $Either(1, void 0);
  return (v$1) => $0;
});
var unformatCommandParser = (v) => {
  if (v.tag === 0) {
    const $0 = parseSignedInt1(4)(exactLength)("Incorrect full year");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { year: $Maybe(1, a), day: s.day, hour: s.hour, meridiem: s.meridiem, millisecond: s.millisecond, minute: s.minute, month: s.month, second: s.second }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 1) {
    const $0 = parseSignedInt1(2)(exactLength)("Incorrect 2-digit year");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { year: $Maybe(1, a), day: s.day, hour: s.hour, meridiem: s.meridiem, millisecond: s.millisecond, minute: s.minute, month: s.month, second: s.second }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 2) {
    const $0 = some(alternativeParserT)(lazyParserT)(parseDigit2);
    return (state1, more, lift1$1, $$throw, done) => more((v1) => more((v2) => more((v1$1) => {
      const $1 = (state2, a) => more((v2$1) => more((v3) => more((v1$2) => $0(
        state2,
        more,
        lift1$1,
        $$throw,
        (state2$1, a$1) => more((v2$2) => {
          const go = (go$a0$copy) => (go$a1$copy) => {
            let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
            while (go$c) {
              const b = go$a0, v$1 = go$a1;
              if (v$1.tag === 0) {
                go$c = false;
                go$r = b;
                continue;
              }
              if (v$1.tag === 1) {
                go$a0 = (b * 10 | 0) + v$1._1 | 0;
                go$a1 = v$1._2;
                continue;
              }
              fail();
            }
            return go$r;
          };
          const $12 = go(0)(a$1);
          return more((v4) => {
            const $22 = a * $12 | 0;
            return more((v2$3) => lift1(monadStateStateT2.state((s) => $Tuple(
              void 0,
              {
                year: $Maybe(1, $22),
                day: s.day,
                hour: s.hour,
                meridiem: s.meridiem,
                millisecond: s.millisecond,
                minute: s.minute,
                month: s.month,
                second: s.second
              }
            )))(state2$1, more, lift1$1, $$throw, done));
          });
        })
      ))));
      const $2 = state1._1;
      const $3 = state1._2;
      return more((v3) => more((v1$2) => string("-")(
        $ParseState($2, $3, false),
        more,
        lift1$1,
        (v2$1, $4) => more((v5) => $1(state1, 1)),
        (state2, a) => more((v2$1) => $1(state2, -1))
      )));
    })));
  }
  if (v.tag === 3) {
    return (state1, more, lift1$1, $$throw, done) => more((v1) => more((v1$1) => parseMonth1(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => {
        const $0 = (() => {
          if (a === 0) {
            return 1;
          }
          if (a === 1) {
            return 2;
          }
          if (a === 2) {
            return 3;
          }
          if (a === 3) {
            return 4;
          }
          if (a === 4) {
            return 5;
          }
          if (a === 5) {
            return 6;
          }
          if (a === 6) {
            return 7;
          }
          if (a === 7) {
            return 8;
          }
          if (a === 8) {
            return 9;
          }
          if (a === 9) {
            return 10;
          }
          if (a === 10) {
            return 11;
          }
          if (a === 11) {
            return 12;
          }
          fail();
        })();
        return more((v2$1) => lift1(monadStateStateT2.state((s) => $Tuple(
          void 0,
          {
            month: $Maybe(1, $0),
            day: s.day,
            hour: s.hour,
            meridiem: s.meridiem,
            millisecond: s.millisecond,
            minute: s.minute,
            second: s.second,
            year: s.year
          }
        )))(state2, more, lift1$1, $$throw, done));
      })
    )));
  }
  if (v.tag === 4) {
    return (state1, more, lift1$1, $$throw, done) => more((v1) => more((v1$1) => parseShortMonth1(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => {
        const $0 = (() => {
          if (a === 0) {
            return 1;
          }
          if (a === 1) {
            return 2;
          }
          if (a === 2) {
            return 3;
          }
          if (a === 3) {
            return 4;
          }
          if (a === 4) {
            return 5;
          }
          if (a === 5) {
            return 6;
          }
          if (a === 6) {
            return 7;
          }
          if (a === 7) {
            return 8;
          }
          if (a === 8) {
            return 9;
          }
          if (a === 9) {
            return 10;
          }
          if (a === 10) {
            return 11;
          }
          if (a === 11) {
            return 12;
          }
          fail();
        })();
        return more((v2$1) => lift1(monadStateStateT2.state((s) => $Tuple(
          void 0,
          {
            month: $Maybe(1, $0),
            day: s.day,
            hour: s.hour,
            meridiem: s.meridiem,
            millisecond: s.millisecond,
            minute: s.minute,
            second: s.second,
            year: s.year
          }
        )))(state2, more, lift1$1, $$throw, done));
      })
    )));
  }
  if (v.tag === 5) {
    const $0 = parseInt1(2)((() => {
      const $02 = validateRange(1)(12);
      return (r) => {
        const $1 = $02(r);
        if ($1.tag === 0) {
          return $Either(0, $1._1);
        }
        if ($1.tag === 1) {
          const $2 = exactLength(r);
          if ($2.tag === 0) {
            return $Either(0, $2._1);
          }
          if ($2.tag === 1) {
            return $Either(1, void 0);
          }
        }
        fail();
      };
    })())("Incorrect 2-digit month");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { month: $Maybe(1, a), day: s.day, hour: s.hour, meridiem: s.meridiem, millisecond: s.millisecond, minute: s.minute, second: s.second, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 6) {
    const $0 = parseInt1(2)((() => {
      const $02 = validateRange(1)(31);
      return (r) => {
        const $1 = $02(r);
        if ($1.tag === 0) {
          return $Either(0, $1._1);
        }
        if ($1.tag === 1) {
          const $2 = exactLength(r);
          if ($2.tag === 0) {
            return $Either(0, $2._1);
          }
          if ($2.tag === 1) {
            return $Either(1, void 0);
          }
        }
        fail();
      };
    })())("Incorrect day of month");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { day: $Maybe(1, a), hour: s.hour, meridiem: s.meridiem, millisecond: s.millisecond, minute: s.minute, month: s.month, second: s.second, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 7) {
    const $0 = parseInt1(2)(validateRange(1)(31))("Incorrect day of month");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { day: $Maybe(1, a), hour: s.hour, meridiem: s.meridiem, millisecond: s.millisecond, minute: s.minute, month: s.month, second: s.second, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 8) {
    const $0 = some(alternativeParserT)(lazyParserT)(parseDigit2);
    return (state1, more, lift1$1, $$throw, done) => more((v1) => more((v1$1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => {
        const go = (go$a0$copy) => (go$a1$copy) => {
          let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
          while (go$c) {
            const b = go$a0, v$1 = go$a1;
            if (v$1.tag === 0) {
              go$c = false;
              go$r = b;
              continue;
            }
            if (v$1.tag === 1) {
              go$a0 = (b * 10 | 0) + v$1._1 | 0;
              go$a1 = v$1._2;
              continue;
            }
            fail();
          }
          return go$r;
        };
        const $1 = go(0)(a);
        return more((v2$1) => {
          const $2 = 1e3 * toNumber($1);
          const v1$2 = $2 >= -86399778816e5 && $2 <= 8639977881599999 ? $Maybe(1, toDateTime($2)) : Nothing;
          if (v1$2.tag === 0) {
            return fail2("Incorrect timestamp")(state2, more, lift1$1, $$throw, done);
          }
          if (v1$2.tag === 1) {
            return lift1((() => {
              const $3 = {
                year: $Maybe(1, v1$2._1._1._1),
                month: $Maybe(
                  1,
                  (() => {
                    if (v1$2._1._1._2 === 0) {
                      return 1;
                    }
                    if (v1$2._1._1._2 === 1) {
                      return 2;
                    }
                    if (v1$2._1._1._2 === 2) {
                      return 3;
                    }
                    if (v1$2._1._1._2 === 3) {
                      return 4;
                    }
                    if (v1$2._1._1._2 === 4) {
                      return 5;
                    }
                    if (v1$2._1._1._2 === 5) {
                      return 6;
                    }
                    if (v1$2._1._1._2 === 6) {
                      return 7;
                    }
                    if (v1$2._1._1._2 === 7) {
                      return 8;
                    }
                    if (v1$2._1._1._2 === 8) {
                      return 9;
                    }
                    if (v1$2._1._1._2 === 9) {
                      return 10;
                    }
                    if (v1$2._1._1._2 === 10) {
                      return 11;
                    }
                    if (v1$2._1._1._2 === 11) {
                      return 12;
                    }
                    fail();
                  })()
                ),
                day: $Maybe(1, v1$2._1._1._3),
                hour: $Maybe(1, v1$2._1._2._1),
                minute: $Maybe(1, v1$2._1._2._2),
                second: $Maybe(1, v1$2._1._2._3),
                millisecond: $Maybe(1, v1$2._1._2._4),
                meridiem: Nothing
              };
              return monadStateStateT2.state((v$1) => $Tuple(void 0, $3));
            })())(state2, more, lift1$1, $$throw, done);
          }
          fail();
        });
      })
    )));
  }
  if (v.tag === 9) {
    const $0 = parseInt1(1)(validateRange(1)(7))("Incorrect day of week");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(state1, more, lift1$1, $$throw, (state2, a) => more((v2) => done(state2, void 0))));
  }
  if (v.tag === 10) {
    return (state1, more, lift1$1, $$throw, done) => more((v1) => more((v1$1) => parseDayOfWeekName1(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => {
        const $0 = (() => {
          if (a === 0) {
            return 1;
          }
          if (a === 1) {
            return 2;
          }
          if (a === 2) {
            return 3;
          }
          if (a === 3) {
            return 4;
          }
          if (a === 4) {
            return 5;
          }
          if (a === 5) {
            return 6;
          }
          if (a === 6) {
            return 7;
          }
          fail();
        })();
        return more((v2$1) => lift1(monadStateStateT2.state((s) => $Tuple(
          void 0,
          {
            day: $Maybe(1, $0),
            hour: s.hour,
            meridiem: s.meridiem,
            millisecond: s.millisecond,
            minute: s.minute,
            month: s.month,
            second: s.second,
            year: s.year
          }
        )))(state2, more, lift1$1, $$throw, done));
      })
    )));
  }
  if (v.tag === 11) {
    return (state1, more, lift1$1, $$throw, done) => more((v1) => more((v1$1) => parseDayOfWeekNameShort1(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => {
        const $0 = (() => {
          if (a === 0) {
            return 1;
          }
          if (a === 1) {
            return 2;
          }
          if (a === 2) {
            return 3;
          }
          if (a === 3) {
            return 4;
          }
          if (a === 4) {
            return 5;
          }
          if (a === 5) {
            return 6;
          }
          if (a === 6) {
            return 7;
          }
          fail();
        })();
        return more((v2$1) => lift1(monadStateStateT2.state((s) => $Tuple(
          void 0,
          {
            day: $Maybe(1, $0),
            hour: s.hour,
            meridiem: s.meridiem,
            millisecond: s.millisecond,
            minute: s.minute,
            month: s.month,
            second: s.second,
            year: s.year
          }
        )))(state2, more, lift1$1, $$throw, done));
      })
    )));
  }
  if (v.tag === 12) {
    const $0 = parseInt1(2)((() => {
      const $02 = validateRange(0)(24);
      return (r) => {
        const $1 = $02(r);
        if ($1.tag === 0) {
          return $Either(0, $1._1);
        }
        if ($1.tag === 1) {
          const $2 = exactLength(r);
          if ($2.tag === 0) {
            return $Either(0, $2._1);
          }
          if ($2.tag === 1) {
            return $Either(1, void 0);
          }
        }
        fail();
      };
    })())("Incorrect 24 hour");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { hour: $Maybe(1, a), day: s.day, meridiem: s.meridiem, millisecond: s.millisecond, minute: s.minute, month: s.month, second: s.second, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 13) {
    const $0 = parseInt1(2)((() => {
      const $02 = validateRange(0)(12);
      return (r) => {
        const $1 = $02(r);
        if ($1.tag === 0) {
          return $Either(0, $1._1);
        }
        if ($1.tag === 1) {
          const $2 = exactLength(r);
          if ($2.tag === 0) {
            return $Either(0, $2._1);
          }
          if ($2.tag === 1) {
            return $Either(1, void 0);
          }
        }
        fail();
      };
    })())("Incorrect 12 hour");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { hour: $Maybe(1, a), day: s.day, meridiem: s.meridiem, millisecond: s.millisecond, minute: s.minute, month: s.month, second: s.second, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 14) {
    return (state1, more, lift1$1, $$throw, done) => more((v1) => parseMeridiem1(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { meridiem: $Maybe(1, a), day: s.day, hour: s.hour, millisecond: s.millisecond, minute: s.minute, month: s.month, second: s.second, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 16) {
    const $0 = parseInt1(2)((() => {
      const $02 = validateRange(0)(59);
      return (r) => {
        const $1 = $02(r);
        if ($1.tag === 0) {
          return $Either(0, $1._1);
        }
        if ($1.tag === 1) {
          const $2 = exactLength(r);
          if ($2.tag === 0) {
            return $Either(0, $2._1);
          }
          if ($2.tag === 1) {
            return $Either(1, void 0);
          }
        }
        fail();
      };
    })())("Incorrect 2-digit minute");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { minute: $Maybe(1, a), day: s.day, hour: s.hour, meridiem: s.meridiem, millisecond: s.millisecond, month: s.month, second: s.second, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 15) {
    const $0 = parseInt1(2)(validateRange(0)(59))("Incorrect minute");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { minute: $Maybe(1, a), day: s.day, hour: s.hour, meridiem: s.meridiem, millisecond: s.millisecond, month: s.month, second: s.second, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 18) {
    const $0 = parseInt1(2)((() => {
      const $02 = validateRange(0)(59);
      return (r) => {
        const $1 = $02(r);
        if ($1.tag === 0) {
          return $Either(0, $1._1);
        }
        if ($1.tag === 1) {
          const $2 = exactLength(r);
          if ($2.tag === 0) {
            return $Either(0, $2._1);
          }
          if ($2.tag === 1) {
            return $Either(1, void 0);
          }
        }
        fail();
      };
    })())("Incorrect 2-digit second");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { second: $Maybe(1, a), day: s.day, hour: s.hour, meridiem: s.meridiem, millisecond: s.millisecond, minute: s.minute, month: s.month, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 17) {
    const $0 = parseInt1(2)(validateRange(0)(59))("Incorrect second");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { second: $Maybe(1, a), day: s.day, hour: s.hour, meridiem: s.meridiem, millisecond: s.millisecond, minute: s.minute, month: s.month, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 19) {
    const $0 = parseInt1(3)(exactLength)("Incorrect millisecond");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => lift1(monadStateStateT2.state((s) => $Tuple(
        void 0,
        { millisecond: $Maybe(1, a), day: s.day, hour: s.hour, meridiem: s.meridiem, minute: s.minute, month: s.month, second: s.second, year: s.year }
      )))(state2, more, lift1$1, $$throw, done))
    ));
  }
  if (v.tag === 22) {
    return (state1, more, lift1$1, $$throw, done) => more((v1) => string(v._1)(state1, more, lift1$1, $$throw, (state2, a) => more((v2) => done(state2, void 0))));
  }
  if (v.tag === 20) {
    const $0 = parseInt1(1)(exactLength)("Incorrect 1-digit millisecond");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => more((v1$1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => {
        const $1 = a * 100 | 0;
        return more((v2$1) => lift1(monadStateStateT2.state((s) => $Tuple(
          void 0,
          { millisecond: $Maybe(1, $1), day: s.day, hour: s.hour, meridiem: s.meridiem, minute: s.minute, month: s.month, second: s.second, year: s.year }
        )))(state2, more, lift1$1, $$throw, done));
      })
    )));
  }
  if (v.tag === 21) {
    const $0 = parseInt1(2)(exactLength)("Incorrect 2-digit millisecond");
    return (state1, more, lift1$1, $$throw, done) => more((v1) => more((v1$1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => {
        const $1 = a * 10 | 0;
        return more((v2$1) => lift1(monadStateStateT2.state((s) => $Tuple(
          void 0,
          { millisecond: $Maybe(1, $1), day: s.day, hour: s.hour, meridiem: s.meridiem, minute: s.minute, month: s.month, second: s.second, year: s.year }
        )))(state2, more, lift1$1, $$throw, done));
      })
    )));
  }
  fail();
};
var unformatAccumToDateTime = (a) => {
  const $0 = validAccum(a);
  const $1 = (() => {
    if (a.year.tag === 0) {
      return 0;
    }
    if (a.year.tag === 1) {
      return a.year._1;
    }
    fail();
  })();
  const $2 = $1 >= -271820 && $1 <= 275759 ? $Either(1, $1) : $Either(0, "Incorrect year");
  const $3 = (() => {
    if ($2.tag === 0) {
      return $Either(0, $2._1);
    }
    if ($2.tag === 1) {
      const $32 = boundedEnumMonth.toEnum((() => {
        if (a.month.tag === 0) {
          return 1;
        }
        if (a.month.tag === 1) {
          return a.month._1;
        }
        fail();
      })());
      if ($32.tag === 0) {
        return $Either(0, "Incorrect month");
      }
      if ($32.tag === 1) {
        return $Either(1, canonicalDate($2._1)($32._1));
      }
    }
    fail();
  })();
  const $4 = (() => {
    const $42 = (() => {
      if (a.day.tag === 0) {
        return 1;
      }
      if (a.day.tag === 1) {
        return a.day._1;
      }
      fail();
    })();
    const $5 = a.hour.tag === 1 && a.hour._1 === 24 ? $42 + 1 | 0 : $42;
    const $6 = $5 >= 1 && $5 <= 31 ? $Either(1, $5) : $Either(0, "Incorrect day");
    const $7 = (() => {
      if ($3.tag === 0) {
        return $Either(0, $3._1);
      }
      if ($3.tag === 1) {
        if ($6.tag === 0) {
          return $Either(0, $6._1);
        }
        if ($6.tag === 1) {
          return $Either(1, $3._1($6._1));
        }
      }
      fail();
    })();
    const $8 = (() => {
      if ($7.tag === 0) {
        return $Either(0, $7._1);
      }
      if ($7.tag === 1) {
        return $Either(1, DateTime($7._1));
      }
      fail();
    })();
    const $9 = (() => {
      if (a.hour.tag === 1) {
        if (a.meridiem.tag === 1) {
          if (a.hour._1 === 12) {
            if (a.meridiem._1 === 0) {
              return 0;
            }
            if (a.meridiem._1 === 1) {
              return 12;
            }
            fail();
          }
          if (a.meridiem._1 === 1) {
            return a.hour._1 + 12 | 0;
          }
          if (a.meridiem._1 === 0) {
            return a.hour._1;
          }
          fail();
        }
        if (a.meridiem.tag === 0) {
          if (a.hour._1 === 24) {
            return 0;
          }
          return a.hour._1;
        }
        fail();
      }
      return 0;
    })();
    const $10 = $9 >= 0 && $9 <= 23 ? $Either(1, $9) : $Either(0, "Incorrect hour");
    if ($10.tag === 0) {
      if ($8.tag === 0) {
        return $Either(0, $8._1);
      }
      if ($8.tag === 1) {
        return $Either(0, $10._1);
      }
      fail();
    }
    if ($10.tag === 1) {
      const $11 = (() => {
        if (a.minute.tag === 0) {
          return 0;
        }
        if (a.minute.tag === 1) {
          return a.minute._1;
        }
        fail();
      })();
      if ($11 >= 0 && $11 <= 59) {
        const $12 = (() => {
          if (a.second.tag === 0) {
            return 0;
          }
          if (a.second.tag === 1) {
            return a.second._1;
          }
          fail();
        })();
        if ($12 >= 0 && $12 <= 59) {
          const $132 = (() => {
            if (a.millisecond.tag === 0) {
              return 0;
            }
            if (a.millisecond.tag === 1) {
              return a.millisecond._1;
            }
            fail();
          })();
          if ($132 >= 0 && $132 <= 999) {
            if ($8.tag === 0) {
              return $Either(0, $8._1);
            }
            if ($8.tag === 1) {
              return $Either(1, $8._1($Time($10._1, $11, $12, $132)));
            }
            fail();
          }
          if ($8.tag === 0) {
            return $Either(0, $8._1);
          }
          if ($8.tag === 1) {
            return $Either(0, "Incorrect millisecond");
          }
          fail();
        }
        const $13 = (() => {
          if (a.millisecond.tag === 0) {
            return 0;
          }
          if (a.millisecond.tag === 1) {
            return a.millisecond._1;
          }
          fail();
        })();
        if ($8.tag === 0) {
          return $Either(0, $8._1);
        }
        if ($8.tag === 1) {
          return $Either(0, "Incorrect second");
        }
        fail();
      }
      if ($8.tag === 0) {
        return $Either(0, $8._1);
      }
      if ($8.tag === 1) {
        return $Either(0, "Incorrect minute");
      }
      fail();
    }
    if ($8.tag === 0) {
      return $Either(0, $8._1);
    }
    fail();
  })();
  if ($0.tag === 0) {
    return $Either(0, $0._1);
  }
  if ($0.tag === 1) {
    if ($4.tag === 0) {
      return $Either(0, $4._1);
    }
    if ($4.tag === 1) {
      return $Either(1, $4._1);
    }
  }
  fail();
};
var unformatParser = (dictMonad) => {
  const mapParserT1 = mapParserT2(dictMonad.Bind1().Apply0().Functor0());
  return (f) => {
    const $0 = mapParserT1((s) => {
      const v = s(initialAccum);
      return dictMonad.Applicative0().pure($Tuple(
        (() => {
          if (v._1._1.tag === 0) {
            return $Either(0, v._1._1._1);
          }
          if (v._1._1.tag === 1) {
            return $Either(1, v._2);
          }
          fail();
        })(),
        v._1._2
      ));
    })(foldMap2(unformatCommandParser)(f));
    return (state1, more, lift1$1, $$throw, done) => more((v1) => $0(
      state1,
      more,
      lift1$1,
      $$throw,
      (state2, a) => more((v2) => {
        const $1 = unformatAccumToDateTime(a);
        if ($1.tag === 0) {
          return fail2($1._1)(state2, more, lift1$1, $$throw, done);
        }
        if ($1.tag === 1) {
          return done(state2, $1._1);
        }
        fail();
      })
    ));
  };
};
var unformat2 = /* @__PURE__ */ (() => {
  const $0 = unformatParser(monadIdentity);
  return (x) => runP($0(x));
})();

// output-es/Data.PreciseDateTime.Internal/index.js
var fromFoldable3 = /* @__PURE__ */ foldrArray(Cons)(Nil);
var timeFormat = /* @__PURE__ */ fromFoldable3([
  Hours24,
  /* @__PURE__ */ $FormatterCommand(22, ":"),
  MinutesTwoDigits,
  /* @__PURE__ */ $FormatterCommand(22, ":"),
  SecondsTwoDigits
]);
var dateFormat = /* @__PURE__ */ fromFoldable3([
  YearFull,
  /* @__PURE__ */ $FormatterCommand(22, "-"),
  MonthTwoDigits,
  /* @__PURE__ */ $FormatterCommand(22, "-"),
  DayOfMonthTwoDigits
]);
var dateTimeFormatISO = /* @__PURE__ */ (() => foldableList.foldr(Cons)(foldableList.foldr(Cons)(timeFormat)($List(
  1,
  $FormatterCommand(22, "T"),
  Nil
)))(dateFormat))();

// output-es/Data.RFC3339String.Format/index.js
var iso8601Format = /* @__PURE__ */ (() => foldableList.foldr(Cons)(foldrArray(Cons)(Nil)([
  $FormatterCommand(22, "."),
  Milliseconds,
  $FormatterCommand(22, "Z")
]))(dateTimeFormatISO))();

// output-es/Fetch.Core/foreign.js
function _fetch(a, b) {
  return fetch(a, b);
}

// output-es/Fetch.Core.Request/foreign.js
function _unsafeNew(url2, options) {
  try {
    return new Request(url2, options);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// output-es/Fetch.Core.Response/foreign.js
function headers(resp) {
  return resp.headers;
}
function ok(resp) {
  return resp.ok;
}
function redirected(resp) {
  return resp.redirected;
}
function status(resp) {
  return resp.status;
}
function statusText(resp) {
  return resp.statusText;
}
function url(resp) {
  return resp.url;
}
function body(resp) {
  return function() {
    return resp.body;
  };
}
function arrayBuffer(resp) {
  return function() {
    return resp.arrayBuffer();
  };
}
function blob(resp) {
  return function() {
    return resp.blob();
  };
}
function text(resp) {
  return function() {
    return resp.text();
  };
}
function json(resp) {
  return function() {
    return resp.json();
  };
}

// output-es/Data.String.CaseInsensitive/index.js
var eqCaseInsensitiveString = { eq: (v) => (v1) => toLower(v) === toLower(v1) };
var ordCaseInsensitiveString = {
  compare: (v) => (v1) => ordString.compare(toLower(v))(toLower(v1)),
  Eq0: () => eqCaseInsensitiveString
};

// output-es/Fetch.Core.Headers/foreign.js
function unsafeFromRecord(r) {
  return new Headers(r);
}
function _toArray(tuple, headers2) {
  return Array.from(headers2.entries(), function(pair) {
    return tuple(pair[0])(pair[1]);
  });
}

// output-es/Fetch.Internal.Headers/index.js
var toHeaders = /* @__PURE__ */ (() => {
  const $0 = arrayMap((v) => $Tuple(v._1, v._2));
  const $1 = fromFoldable2(ordCaseInsensitiveString)(foldableArray);
  return (x) => $1($0(_toArray(Tuple, x)));
})();

// output-es/Promise.Internal/foreign.js
function thenOrCatch(k, c, p) {
  return p.then(k, c);
}
function resolve2(a) {
  return Promise.resolve(a);
}

// output-es/Promise.Rejection/foreign.js
function _toError(just, nothing, ref) {
  if (ref instanceof Error) {
    return just(ref);
  }
  return nothing;
}

// output-es/Promise.Aff/index.js
var toAff$p = (customCoerce) => (p) => makeAff((cb) => () => {
  thenOrCatch(
    ($0) => {
      const $1 = cb($Either(1, $0));
      const a$p = $1();
      return resolve2(a$p);
    },
    ($0) => {
      const $1 = cb($Either(0, customCoerce($0)));
      const a$p = $1();
      return resolve2(a$p);
    },
    p
  );
  return nonCanceler;
});
var coerce = (rej) => {
  const $0 = _toError(Just, Nothing, rej);
  const $1 = unsafeReadTagged(monadIdentity)("String")(rej);
  const $2 = (() => {
    const $22 = (() => {
      if ($1.tag === 0) {
        return Nothing;
      }
      if ($1.tag === 1) {
        return $Maybe(1, error($1._1));
      }
      fail();
    })();
    if ($0.tag === 0) {
      return $22;
    }
    return $0;
  })();
  if ($2.tag === 0) {
    return error("Promise failed, couldn't extract JS Error or String");
  }
  if ($2.tag === 1) {
    return $2._1;
  }
  fail();
};

// output-es/Fetch.Internal.Response/index.js
var convert = (response) => ({
  headers: toHeaders(headers(response)),
  ok: ok(response),
  redirected: redirected(response),
  status: status(response),
  statusText: statusText(response),
  url: url(response),
  text: _bind(_liftEffect(text(response)))(toAff$p(coerce)),
  json: _bind(_liftEffect(json(response)))(toAff$p(coerce)),
  body: body(response),
  arrayBuffer: _bind(_liftEffect(arrayBuffer(response)))(toAff$p(coerce)),
  blob: _bind(_liftEffect(blob(response)))(toAff$p(coerce))
});

// output-es/Fetch/index.js
var fetch2 = () => () => (dictToCoreRequestOptions) => (url2) => (r) => _bind(_liftEffect((() => {
  const $0 = dictToCoreRequestOptions.convert(r);
  return () => _unsafeNew(url2, $0);
})()))((request) => _bind(_bind(_liftEffect(() => _fetch(request, {})))(toAff$p(coerce)))((cResponse) => _pure(convert(cResponse))));

// output-es/Fetch.Internal.Request/index.js
var toCoreRequestOptionsHelpe = { convertHelper: (v) => (v1) => ({}) };
var toCoreRequestOptionsHelpe1 = (dictToCoreRequestOptionsConverter) => () => () => () => (dictIsSymbol) => (dictToCoreRequestOptionsHelper) => () => () => ({
  convertHelper: (v) => (r) => unsafeSet(dictIsSymbol.reflectSymbol($$Proxy))(dictToCoreRequestOptionsConverter.convertImpl($$Proxy)(unsafeGet(dictIsSymbol.reflectSymbol($$Proxy))(r)))(dictToCoreRequestOptionsHelper.convertHelper($$Proxy)(unsafeDelete(dictIsSymbol.reflectSymbol($$Proxy))(r)))
});

// output-es/UpChangelog.Types/index.js
var $CommitType = (tag) => tag;
var $LoggerType = (tag) => tag;
var $VersionSource = (tag, _1) => ({ tag, _1 });
var FromGitTag = /* @__PURE__ */ $VersionSource(
  3
  /* FromGitTag */
);
var None = /* @__PURE__ */ $LoggerType(
  0
  /* None */
);
var $$Error = /* @__PURE__ */ $LoggerType(
  1
  /* Error */
);
var Info = /* @__PURE__ */ $LoggerType(
  2
  /* Info */
);
var Debug = /* @__PURE__ */ $LoggerType(
  3
  /* Debug */
);
var MergeCommit = /* @__PURE__ */ $CommitType(
  0
  /* MergeCommit */
);
var SquashCommit = /* @__PURE__ */ $CommitType(
  1
  /* SquashCommit */
);

// output-es/UpChangelog.Command.Update/index.js
var fetch3 = /* @__PURE__ */ (() => fetch2()()({
  convert: toCoreRequestOptionsHelpe1({ convertImpl: (v) => unsafeFromRecord })()()()({ reflectSymbol: () => "headers" })(toCoreRequestOptionsHelpe)()().convertHelper($$Proxy)
}))();
var gDecodeJsonCons2 = /* @__PURE__ */ gDecodeJsonCons({
  decodeJsonField: (j) => {
    if (j.tag === 1) {
      return $Maybe(
        1,
        _caseJson(
          (v) => $Either(0, $JsonDecodeError(0, "String")),
          (v) => $Either(0, $JsonDecodeError(0, "String")),
          (v) => $Either(0, $JsonDecodeError(0, "String")),
          Right,
          (v) => $Either(0, $JsonDecodeError(0, "String")),
          (v) => $Either(0, $JsonDecodeError(0, "String")),
          j._1
        )
      );
    }
    return Nothing;
  }
})(gDecodeJsonNil);
var decodeJson = /* @__PURE__ */ (() => decodeRecord(gDecodeJsonCons((() => {
  const $0 = decodeRecord(gDecodeJsonCons2({ reflectSymbol: () => "login" })()())();
  return {
    decodeJsonField: (j) => {
      if (j.tag === 1) {
        return $Maybe(1, $0.decodeJson(j._1));
      }
      return Nothing;
    }
  };
})())(gDecodeJsonNil)({ reflectSymbol: () => "user" })()())().decodeJson)();
var showMaybe = {
  show: (v) => {
    if (v.tag === 1) {
      return "(Just " + showErrorImpl(v._1) + ")";
    }
    if (v.tag === 0) {
      return "Nothing";
    }
    fail();
  }
};
var showMaybe1 = {
  show: (v) => {
    if (v.tag === 1) {
      return "(Just " + showStringImpl(v._1) + ")";
    }
    if (v.tag === 0) {
      return "Nothing";
    }
    fail();
  }
};
var show2 = (record) => (record.canceled ? "{ canceled: true, escapedCommand: " : "{ canceled: false, escapedCommand: ") + showStringImpl(record.escapedCommand) + ", exit: " + showExit.show(record.exit) + "," + (() => {
  if (record.exitCode.tag === 1) {
    return " exitCode: (Just " + showIntImpl(record.exitCode._1) + ")";
  }
  if (record.exitCode.tag === 0) {
    return " exitCode: Nothing";
  }
  fail();
})() + "," + (record.killed ? " killed: true" : " killed: false") + ", message: " + showStringImpl(record.message) + ", originalMessage: " + showMaybe1.show(record.originalMessage) + "," + (() => {
  if (record.pid.tag === 1) {
    return " pid: (Just (Pid " + showIntImpl(record.pid._1) + "))";
  }
  if (record.pid.tag === 0) {
    return " pid: Nothing";
  }
  fail();
})() + ", shortMessage: " + showStringImpl(record.shortMessage) + "," + (() => {
  if (record.signal.tag === 1) {
    return " signal: (Just " + showKillSignal(record.signal._1) + ")";
  }
  if (record.signal.tag === 0) {
    return " signal: Nothing";
  }
  fail();
})() + ", signalDescription: " + showMaybe1.show(record.signalDescription) + ", stderr: " + showStringImpl(record.stderr) + ", stderrError: " + showMaybe.show(record.stderrError) + ", stdinError: " + showMaybe.show(record.stdinError) + ", stdout: " + showStringImpl(record.stdout) + ", stdoutError: " + showMaybe.show(record.stdoutError) + ", timedOut: " + (record.timedOut ? "true" : "false") + " }";
var decodeJson1 = /* @__PURE__ */ (() => decodeRecord(gDecodeJsonCons2({ reflectSymbol: () => "version" })()())().decodeJson)();
var fold1 = /* @__PURE__ */ (() => foldable1NonEmptyArray.foldMap1(semigroupString)(identity5))();
var fold3 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidString)(identity3))();
var traverse = /* @__PURE__ */ (() => traversableArray.traverse(applicativeApp))();
var $$for2 = /* @__PURE__ */ (() => {
  const traverse2 = traversableArray.traverse(applicativeApp);
  return (x) => (f) => traverse2(f)(x);
})();
var show4 = /* @__PURE__ */ showArrayImpl(showIntImpl);
var parsePRNumber = (x) => {
  const $0 = stripPrefix("Merge pull request #")(x);
  const $1 = (() => {
    if ($0.tag === 1) {
      const $12 = Tuple(MergeCommit);
      const $22 = fromString(breakOn(" ")($0._1).before);
      if ($22.tag === 1) {
        return $Maybe(1, $12($22._1));
      }
      return Nothing;
    }
    if ($0.tag === 0) {
      return Nothing;
    }
    fail();
  })();
  const $2 = stripSuffix(")")((() => {
    const $22 = breakOnEnd("(#")(x);
    return drop(length2(take2(2)($22.after)))($22.after);
  })());
  const $3 = (() => {
    if ($2.tag === 1) {
      const $32 = Tuple(SquashCommit);
      const $4 = fromString($2._1);
      if ($4.tag === 1) {
        return $Maybe(1, $32($4._1));
      }
      return Nothing;
    }
    if ($2.tag === 0) {
      return Nothing;
    }
    fail();
  })();
  if ($1.tag === 0) {
    return $3;
  }
  return $1;
};
var lookupPRAuthor = (prNum) => bindApp.bind(monadAskEnvApp.ask)((v) => {
  const $0 = v.mbToken;
  const url2 = "https://api.github.com/repos/" + v.gh.owner + "/" + v.gh.repo + "/pulls/" + showIntImpl(prNum);
  return bindApp.bind(logDebug("Sending GET request to: " + url2))(() => bindApp.bind(monadAffApp.liftAff((() => {
    if ($0.tag === 1) {
      return fetch3(url2)({ headers: { Accept: "application/vnd.github.v3+json", Authorization: "token" + $0._1 } });
    }
    if ($0.tag === 0) {
      return fetch3(url2)({ headers: { Accept: "application/vnd.github.v3+json" } });
    }
    fail();
  })()))((resp) => bindApp.bind(logDebug("Got response: " + showIntImpl(resp.status) + " " + showStringImpl(resp.statusText)))(() => bindApp.bind((() => {
    const $1 = resp.status === 200;
    const $2 = monadEffectApp.liftEffect(throwException(error("Lookup PR author failed. " + showIntImpl(resp.status) + " " + showStringImpl(resp.statusText))));
    if (!$1) {
      return $2;
    }
    if ($1) {
      return applicativeApp.pure();
    }
    fail();
  })())(() => bindApp.bind(monadAffApp.liftAff(resp.json))((j) => {
    const v1 = decodeJson(j);
    if (v1.tag === 0) {
      return monadEffectApp.liftEffect(throwException(error("Error in lookupPRAuthor: " + printJsonDecodeError(v1._1))));
    }
    if (v1.tag === 1) {
      return applicativeApp.pure(v1._1.user.login);
    }
    fail();
  })))));
});
var isInterestingCommit = (v) => {
  if (v.data._1 === 0) {
    return applicativeApp.pure(true);
  }
  if (v.data._1 === 1) {
    return bindApp.bind(git("show")(["--format=", "--name-only", v.hash]))((v2) => applicativeApp.pure(!allImpl(
      (path2) => {
        const $0 = stripPrefix("CHANGELOG.d/")(path2);
        return "CHANGELOG.md" === path2 || (() => {
          if ($0.tag === 0) {
            return false;
          }
          if ($0.tag === 1) {
            return true;
          }
          fail();
        })();
      },
      lines(v2.stdout)
    )));
  }
  fail();
};
var getVersion = /* @__PURE__ */ (() => {
  const $0 = mapMaybe((x) => {
    const $02 = parseVersion(breakOn("v")(trim(x)).after);
    if ($02.tag === 0) {
      return Nothing;
    }
    if ($02.tag === 1) {
      return $Maybe(1, $02._1);
    }
    fail();
  });
  const $1 = maximumBy(foldableArray)(ordVersion.compare);
  const getVersionFromGitTag = bindApp.bind(git("tag")(["--points-at", "HEAD"]))((output) => bindApp.bind(logDebug("`git tag` output was: " + show2(output)))(() => applicativeApp.pure((() => {
    const $2 = $1($0(lines(output.stdout)));
    if ($2.tag === 1) {
      return $Maybe(1, showVersion($2._1));
    }
    return Nothing;
  })())));
  return bindApp.bind(monadAskEnvApp.ask)((v) => {
    if (v.cli.versionSource.tag === 0) {
      const $2 = v.cli.versionSource._1;
      return bindApp.bind((() => {
        const $3 = monadApp.Applicative0();
        const $4 = monadEffectApp.liftEffect(throwException(error("`package.json` file was not found using path '" + $2 + "'. Cannot use it to get the version.")));
        return monadApp.Bind1().bind(monadEffectApp.liftEffect(() => existsSync($2)))((b) => {
          if (!b) {
            return $4;
          }
          if (b) {
            return $3.pure();
          }
          fail();
        });
      })())(() => bindApp.bind(monadAffApp.liftAff(toAff2(readTextFile)(UTF8)($2)))((content) => {
        const $3 = parseJson(content);
        const v1 = (() => {
          if ($3.tag === 0) {
            return $Either(0, $3._1);
          }
          if ($3.tag === 1) {
            return decodeJson1($3._1);
          }
          fail();
        })();
        if (v1.tag === 0) {
          return monadEffectApp.liftEffect(throwException(error("Error in getVersion: " + printJsonDecodeError(v1._1))));
        }
        if (v1.tag === 1) {
          return applicativeApp.pure(v1._1.version);
        }
        fail();
      }));
    }
    if (v.cli.versionSource.tag === 2) {
      return applicativeApp.pure(showVersion(v.cli.versionSource._1));
    }
    if (v.cli.versionSource.tag === 3) {
      return bindApp.bind(getVersionFromGitTag)((mbVersion) => {
        if (mbVersion.tag === 0) {
          return monadEffectApp.liftEffect(throwException(error("Error in getVersion for `FromGitTag` case: did not get a tag. Is HEAD pointing to a tag?")));
        }
        if (mbVersion.tag === 1) {
          return applicativeApp.pure(mbVersion._1);
        }
        fail();
      });
    }
    if (v.cli.versionSource.tag === 1) {
      const $2 = v.cli.versionSource._1;
      return bindApp.bind((() => {
        const $3 = monadApp.Applicative0();
        const $4 = monadEffectApp.liftEffect(throwException(error("A `*.cabal` file was not found using path '" + $2 + "'. Cannot use it to get the version.")));
        return monadApp.Bind1().bind(monadEffectApp.liftEffect(() => existsSync($2)))((b) => {
          if (!b) {
            return $4;
          }
          if (b) {
            return $3.pure();
          }
          fail();
        });
      })())(() => bindApp.bind(monadAffApp.liftAff(toAff2(readTextFile)(UTF8)($2)))((content) => {
        const v1 = findMapImpl(Nothing, isJust, stripPrefix("version:"), lines(content));
        if (v1.tag === 0) {
          return monadEffectApp.liftEffect(throwException(error("Error in getVersion for `Cabal` case: did not find a line with content: `version: <versionString>`.")));
        }
        if (v1.tag === 1) {
          return applicativeApp.pure(trim(v1._1));
        }
        fail();
      }));
    }
    fail();
  });
})();
var getPrAuthors = (prNumbers) => bindApp.bind(monadAskEnvApp.ask)((v) => {
  const $0 = v.cli.mbToken;
  return bindApp.bind((() => {
    if (v.cli.github.tag === 0) {
      const $1 = v.cli.github._1;
      return bindApp.bind((() => {
        const $2 = _map((x) => lines(x.stdout));
        const $3 = git("remote")(["-v"]);
        return (x) => $2($3(x));
      })())((remotes) => bindApp.bind(logDebug("Git remotes are:\n" + joinWith("\n")(remotes)))(() => {
        const $2 = mapMaybe((x) => x)(arrayMap((s) => stripPrefix($1)(s))(remotes));
        if (0 < $2.length) {
          const v$1 = runParserT1(trim($2[0]))((v2, $3, $4, $5, $6) => {
            const $7 = v2._1;
            const $8 = v2._2;
            return $3((v3) => {
              const $9 = (v4, $92) => {
                const $10 = v4._3;
                return $3((v5) => {
                  if ($10) {
                    return $5(v4, $92);
                  }
                  return $3((v1) => $3((v1$1) => string("https://github.com/")(
                    v2,
                    $3,
                    $4,
                    $5,
                    (state2, a) => $3((v2$1) => $3((v2$2) => {
                      const $11 = many1((() => {
                        const $112 = satisfy((c) => c !== "/");
                        return (state1, more, lift12, $$throw, done) => more((v1$2) => $112(
                          state1,
                          more,
                          lift12,
                          $$throw,
                          (state2$1, a$1) => more((v2$3) => done(state2$1, singleton(a$1)))
                        ));
                      })());
                      return $3((v1$2) => $3((v1$3) => $11(
                        state2,
                        $3,
                        $4,
                        $5,
                        (state2$1, a$1) => $3((v2$3) => {
                          const $12 = fold3(a$1);
                          return $3((v2$4) => {
                            const $13 = satisfy((c) => c === "/");
                            return $3((v1$4) => $3((v1$5) => $13(
                              state2$1,
                              $3,
                              $4,
                              $5,
                              (state2$2, a$2) => $3((v2$5) => $3((v2$6) => {
                                const $14 = many1((() => {
                                  const $142 = satisfy((c) => c !== "." && c !== " ");
                                  return (state1, more, lift12, $$throw, done) => more((v1$6) => $142(
                                    state1,
                                    more,
                                    lift12,
                                    $$throw,
                                    (state2$3, a$3) => more((v2$7) => done(state2$3, singleton(a$3)))
                                  ));
                                })());
                                return $3((v1$6) => $3((v1$7) => $14(
                                  state2$2,
                                  $3,
                                  $4,
                                  $5,
                                  (state2$3, a$3) => $3((v2$7) => {
                                    const $15 = fold3(a$3);
                                    return $3((v2$8) => $6(state2$3, { owner: $12, repo: $15 }));
                                  })
                                )));
                              }))
                            )));
                          });
                        })
                      )));
                    }))
                  )));
                });
              };
              return $3((v1) => $3((v1$1) => string("git@github.com:")(
                $ParseState($7, $8, false),
                $3,
                $4,
                $9,
                (state2, a) => $3((v2$1) => $3((v2$2) => {
                  const $10 = many1((() => {
                    const $102 = satisfy((c) => c !== "/");
                    return (state1, more, lift12, $$throw, done) => more((v1$2) => $102(
                      state1,
                      more,
                      lift12,
                      $$throw,
                      (state2$1, a$1) => more((v2$3) => done(state2$1, singleton(a$1)))
                    ));
                  })());
                  return $3((v1$2) => $3((v1$3) => $10(
                    state2,
                    $3,
                    $4,
                    $9,
                    (state2$1, a$1) => $3((v2$3) => {
                      const $11 = fold1(a$1);
                      return $3((v2$4) => {
                        const $12 = satisfy((c) => c === "/");
                        return $3((v1$4) => $3((v1$5) => $12(
                          state2$1,
                          $3,
                          $4,
                          $9,
                          (state2$2, a$2) => $3((v2$5) => $3((v2$6) => {
                            const $13 = many1((() => {
                              const $132 = satisfy((c) => c !== ".");
                              return (state1, more, lift12, $$throw, done) => more((v1$6) => $132(
                                state1,
                                more,
                                lift12,
                                $$throw,
                                (state2$3, a$3) => more((v2$7) => done(state2$3, singleton(a$3)))
                              ));
                            })());
                            return $3((v1$6) => $3((v1$7) => $13(
                              state2$2,
                              $3,
                              $4,
                              $9,
                              (state2$3, a$3) => $3((v2$7) => {
                                const $14 = fold1(a$3);
                                return $3((v2$8) => $3((v1$8) => $3((v1$9) => string(".git")(
                                  state2$3,
                                  $3,
                                  $4,
                                  $9,
                                  (state2$4, a$4) => $3((v2$9) => $3((v2$10) => $6(state2$4, { owner: $11, repo: $14 })))
                                ))));
                              })
                            )));
                          }))
                        )));
                      });
                    })
                  )));
                }))
              )));
            });
          });
          if (v$1.tag === 0) {
            return monadEffectApp.liftEffect(throwException(error(joinWith(" ")([
              "Found remote, but could not determine its repo.",
              " While trying to parse, '" + $2[0] + "',",
              " parser error was: " + showParseError.show(v$1._1)
            ]))));
          }
          if (v$1.tag === 1) {
            return applicativeApp.pure(v$1._1);
          }
          fail();
        }
        return monadEffectApp.liftEffect(throwException(error("Did not find a remote named '" + $1 + "'. See all available remotes via `git remote -v`")));
      }));
    }
    if (v.cli.github.tag === 1) {
      return applicativeApp.pure(v.cli.github._1);
    }
    fail();
  })())((gh) => {
    const $1 = _map(nub(ordString));
    const $2 = traverse((x) => {
      const $22 = lookupPRAuthor(x);
      return (x$1) => $22({ logger: x$1.logger, gh, mbToken: $0 });
    })(prNumbers);
    return (x) => $1($2(x));
  });
});
var updateEntry = (file) => bindApp.bind(bindApp.bind((() => {
  const $0 = _map((x) => lines(x.stdout));
  const $1 = git("log")(["-m", "--follow", '--format="%H %cI %s"', file]);
  return (x) => $0($1(x));
})())((lns) => bindApp.bind(logDebug("For file, '" + file + "', got commits:\n" + joinWith("\n")(lns)))(() => bindApp.bind($$for2(lns)((str) => {
  const v = breakOn(" ")(str);
  const v1 = breakOn(" ")(drop(length2(take2(1)(v.after)))(v.after));
  return applicativeApp.pure((() => {
    const $0 = nullable(toUtcDate(v1.before), Nothing, Just);
    if ($0.tag === 1) {
      const $1 = unformat2(iso8601Format)($0._1);
      if ($1.tag === 0) {
        return Nothing;
      }
      if ($1.tag === 1) {
        return $Maybe(
          1,
          { data: drop(length2(take2(1)(v1.after)))(v1.after), hash: v.before, time: $1._1 }
        );
      }
      fail();
    }
    if ($0.tag === 0) {
      return Nothing;
    }
    fail();
  })());
}))((mbRes) => {
  const $0 = sortWith(ordDateTime)((x) => x.time)(mapMaybe((x) => x)(mbRes));
  if ($0.length > 0) {
    return applicativeApp.pure($0);
  }
  return monadEffectApp.liftEffect(throwException(error("No commits for file: " + file)));
}))))((allCommits) => bindApp.bind((() => {
  const $0 = _map(catMaybes);
  const $1 = $$for2(allCommits)((glc) => {
    const v = parsePRNumber(glc.data);
    if (v.tag === 0) {
      return applicativeApp.pure(Nothing);
    }
    if (v.tag === 1) {
      const glcWithPr = { data: v._1, hash: glc.hash, time: glc.time };
      return bindApp.bind(isInterestingCommit(glcWithPr))((interesting) => applicativeApp.pure(interesting ? $Maybe(1, glcWithPr) : Nothing));
    }
    fail();
  });
  return (x) => $0($1(x));
})())((prCommits) => {
  const prNumbers = arrayMap((x) => x.data._2)(prCommits);
  return bindApp.bind(logDebug("For file, '" + file + "', got PR Numbers:" + show4(prNumbers)))(() => bindApp.bind(getPrAuthors(prNumbers))((prAuthors) => bindApp.bind(logDebug("Reading content of file entry: " + file))(() => bindApp.bind((() => {
    const $0 = _map((x) => breakOn("\n")(trim(x)));
    const $1 = monadAffApp.liftAff(toAff2(readTextFile)(UTF8)(normalize(file)));
    return (x) => $0($1(x));
  })())((v) => applicativeApp.pure({
    file,
    content: prNumbers.length === 0 ? v.before + "" + v.after + "\n" : v.before + " (" + commaSeparate(arrayMap((x) => "#" + showIntImpl(x))(prNumbers)) + " by " + commaSeparate(arrayMap(($0) => "@" + $0)(prAuthors)) + ")" + v.after + "\n",
    date: (() => {
      if (0 < allCommits.length) {
        return allCommits[0].time;
      }
      fail();
    })()
  })))));
}));
var processEntriesStartingWith = (prefix) => (arr) => bindApp.bind(logInfo("Processing entries for prefix: " + prefix))(() => {
  const $0 = _map(sortWith(ordDateTime)((x) => x.date));
  const $1 = traverse(updateEntry)(filterImpl(
    (x) => {
      const $12 = stripPrefix(prefix)(toLower(basename(x)));
      if ($12.tag === 0) {
        return false;
      }
      if ($12.tag === 1) {
        return true;
      }
      fail();
    },
    arr
  ));
  return (x) => $0($1(x));
});
var conditionalSection = (header) => (v) => {
  if (v.length === 0) {
    return "";
  }
  return "\n" + header + ":\n\n" + joinWith("\n")(arrayMap((x) => x.content)(v));
};
var update = /* @__PURE__ */ (() => bindApp.bind(bindApp.bind(monadAskEnvApp.ask)((v) => {
  const $0 = v.cli;
  const $1 = $0.changelogDir;
  const $2 = bindApp.bind(logDebug("Attempting to read changelog dir: " + $0.changelogDir))(() => bindApp.bind(monadAffApp.liftAff(toAff1(readdir2)($0.changelogDir)))((entries) => {
    const $22 = monadEffectApp.liftEffect(throwException(error(joinWith(" ")([
      "Cannot update changelog file as there are no",
      "changelog entry files in '",
      $0.changelogDir + "'."
    ]))));
    if (filterImpl((y) => "README.md" !== y, entries).length === 0) {
      return $22;
    }
    return applicativeApp.pure();
  }));
  const $3 = monadEffectApp.liftEffect(throwException(error("Cannot update changelog file as changelog directory, '" + $0.changelogDir + "', does not exist.")));
  return bindApp.bind(monadEffectApp.liftEffect(() => existsSync($1)))((cond$p) => {
    if (cond$p) {
      return $2;
    }
    return $3;
  });
}))(() => bindApp.bind(monadAskEnvApp.ask)((v) => {
  const $0 = v.cli.changelogDir;
  const $1 = v.cli.changelogFile;
  return bindApp.bind((() => {
    const $2 = _map((x) => lines(x.stdout));
    const $3 = git("ls-tree")(["--name-only", "HEAD", $0 + sep]);
    return (x) => $2($3(x));
  })())((entries$p) => {
    const readmeFile = concat2([$0, "README.md"]);
    const entries = filterImpl(
      (str) => {
        const s = trim(str);
        return s !== "" || s !== readmeFile;
      },
      entries$p
    );
    return bindApp.bind(logInfo("# of entries found in changelog: " + showIntImpl(entries.length)))(() => bindApp.bind(logDebug("Entries found in changelog dir were:\n" + joinWith("\n")(entries)))(() => bindApp.bind(processEntriesStartingWith("breaking")(entries))((breaks) => bindApp.bind(processEntriesStartingWith("feature")(entries))((features) => bindApp.bind(processEntriesStartingWith("fix")(entries))((fixes) => bindApp.bind(processEntriesStartingWith("internal")(entries))((internal) => bindApp.bind(processEntriesStartingWith("misc")(entries))((misc) => {
      const entryFiles = arrayMap((x) => x.file)([...breaks, ...features, ...fixes, ...internal, ...misc]);
      if (entryFiles.length === 0) {
        return monadEffectApp.liftEffect(throwException(error("Cannot update changelog file as there aren't any valid entries in '" + $0 + "'.")));
      }
      return bindApp.bind(git("status")(["-s", "--", $1, ...entryFiles]))((changes) => bindApp.bind((() => {
        const $2 = changes.stdout === "";
        const $3 = monadEffectApp.liftEffect(throwException(error("You have uncommitted changes to changelog files. Please commit, stash, or revert them before running this script.")));
        if (!$2) {
          return $3;
        }
        if ($2) {
          return applicativeApp.pure();
        }
        fail();
      })())(() => bindApp.bind(getVersion)((version2) => bindApp.bind((() => {
        const $2 = _map(breakOn("\n## "));
        const $3 = monadAffApp.liftAff(toAff2(readTextFile)(UTF8)($1));
        return (x) => $2($3(x));
      })())((v1) => {
        const $2 = v1.before;
        const $3 = v1.after;
        return bindApp.bind(logDebug("Changelog preamble is: \n" + $2))(() => bindApp.bind(monadAffApp.liftAff(toAff3(writeTextFile)(UTF8)($1)($2 + "\n## " + version2 + "\n" + conditionalSection("Breaking changes")(breaks) + conditionalSection("New features")(features) + conditionalSection("Bugfixes")(fixes) + conditionalSection("Other improvements")(misc) + conditionalSection("Internal")(internal) + $3)))(() => bindApp.bind(logInfo("Updated changelog file"))(() => bindApp.bind((() => {
          const $4 = _map((v$1) => {
          });
          const $5 = git("add")([$1]);
          return (x) => $4($5(x));
        })())(() => bindApp.bind(logDebug("Staged changelog file in git"))(() => bindApp.bind((() => {
          const $4 = _map((v$1) => {
          });
          const $5 = git("rm")(entryFiles);
          return (x) => $4($5(x));
        })())(() => logDebug("Staged the deletion of the changelog entry files in git")))))));
      }))));
    })))))));
  });
})))();

// output-es/Main/index.js
var $Command = (tag, _1) => ({ tag, _1 });
var identity15 = (x) => x;
var mkLogger = /* @__PURE__ */ (() => {
  const $$default = { logError: (v) => () => {
  }, logInfo: (v) => () => {
  }, logDebug: (v) => () => {
  } };
  return (v) => {
    if (v === 0) {
      return $$default;
    }
    if (v === 1) {
      return { logError: log2, logInfo: $$default.logInfo, logDebug: $$default.logDebug };
    }
    if (v === 2) {
      return { logError: log2, logInfo: log2, logDebug: $$default.logDebug };
    }
    if (v === 3) {
      return { logError: log2, logInfo: log2, logDebug: log2 };
    }
    fail();
  };
})();
var cliParser = /* @__PURE__ */ (() => {
  const $0 = argument(["--changelog-file"])("The file path to the changelog file. (defaults to `CHANGELOG.md`)");
  const changelogFileArg = $ArgParser(
    $0._1,
    {
      step: $0._2.step,
      done: (x) => {
        const $12 = $0._2.done(x);
        if ($12.tag === 0) {
          return $Either(1, "CHANGELOG.md");
        }
        if ($12.tag === 1) {
          return $Either(1, $12._1);
        }
        fail();
      },
      saturated: true
    }
  );
  const $1 = argument(["--changelog-dir"])("The file path to the directory containing changelog entry files. (defaults to `CHANGELOG.d`)");
  const changelogDirArg = $ArgParser(
    $1._1,
    {
      step: $1._2.step,
      done: (x) => {
        const $2 = $1._2.done(x);
        if ($2.tag === 0) {
          return $Either(1, "CHANGELOG.d");
        }
        if ($2.tag === 1) {
          return $Either(1, $2._1);
        }
        fail();
      },
      saturated: true
    }
  );
  return applyParser.apply((() => {
    const $2 = choose("logger")([
      (() => {
        const $22 = flag(["--quiet", "-q"])("Hide all logging");
        return $ArgParser($22._1, functorArgFold.map((v) => None)($22._2));
      })(),
      (() => {
        const $22 = flag(["--log-info"])("Slightly increase logging output");
        return $ArgParser($22._1, functorArgFold.map((v) => Info)($22._2));
      })(),
      (() => {
        const $22 = flag(["--log-debug"])("Output all logging output");
        return $ArgParser($22._1, functorArgFold.map((v) => Debug)($22._2));
      })()
    ]);
    const $3 = applyParser.apply($ArgParser($2._1, functorArgFold.map($$const)($2._2)))(flagHelp);
    return $ArgParser(
      $3._1,
      functorArgFold.map(Tuple)({
        step: $3._2.step,
        done: (x) => {
          const $4 = $3._2.done(x);
          if ($4.tag === 0) {
            return $Either(1, $$Error);
          }
          if ($4.tag === 1) {
            return $Either(1, $4._1);
          }
          fail();
        },
        saturated: true
      })
    );
  })())((() => {
    const $2 = choose("command")([
      command(["update", "u"])("Updates the changelog file with a new releae entry based on files in the changelog directory")(applyParser.apply(applyParser.apply(applyParser.apply(applyParser.apply(applyParser.apply((() => {
        const $22 = choose("repo")([
          (() => {
            const $23 = unformat("REMOTE_NAME")(Right)(argument(["--remote"])("The git remote name to use to determine the repo to use. (default: `origin`)"));
            return $ArgParser($23._1, functorArgFold.map(Left)($23._2));
          })(),
          (() => {
            const $23 = unformat("OWNER/REPO")((s) => {
              const v = breakOn("/")(s);
              const repo = drop(length2(take2(1)(v.after)))(v.after);
              const $24 = "Expected 'OWNER/REPO' but got '" + s + "'";
              if (anyImpl(identity15, [repo === "", contains("/")(repo)])) {
                return $Either(0, $24);
              }
              return $Either(1, { owner: v.before, repo });
            })(argument(["--repo"])("The Github repo in the `user/repo` format (e.g. `purescript/purescript-prelude`)."));
            return $ArgParser($23._1, functorArgFold.map(Right)($23._2));
          })()
        ]);
        return $ArgParser(
          $22._1,
          functorArgFold.map((v) => (v1) => (v2) => (v3) => (v4) => (v5) => $Command(
            1,
            { github: v, versionSource: v2, mbToken: v1, changelogFile: v3, changelogDir: v4 }
          ))({
            step: $22._2.step,
            done: (x) => {
              const $32 = $22._2.done(x);
              if ($32.tag === 0) {
                return $Either(1, $Either(0, "origin"));
              }
              if ($32.tag === 1) {
                return $Either(1, $32._1);
              }
              fail();
            },
            saturated: true
          })
        );
      })())(optional(argument(["--token", "-t"])(joinWith(" ")([
        "An optional GitHub OAuth2 token for authenticating API requests.",
        "The token does not need any permissions.",
        "This program works without one but will start failing once GitHub's rate limit is reached."
      ])))))((() => {
        const $22 = choose("version")([
          unformat("PACKAGE_JSON_FILE")((s) => {
            const $23 = stripSuffix("package.json")(s);
            const $32 = (() => {
              if ($23.tag === 0) {
                return false;
              }
              if ($23.tag === 1) {
                return true;
              }
              fail();
            })();
            if (!$32) {
              return $Either(0, "File path did not end in `package.json`");
            }
            if ($32) {
              return $Either(1, $VersionSource(0, s));
            }
            fail();
          })(argument(["--from-package-json", "-j"])("For the changelog's header's version string, use the `package.json` file's `version` field.")),
          unformat("CABAL_FILE")((s) => {
            const $23 = stripSuffix(".cabal")(s);
            const $32 = (() => {
              if ($23.tag === 0) {
                return false;
              }
              if ($23.tag === 1) {
                return true;
              }
              fail();
            })();
            if (!$32) {
              return $Either(0, "File path did not end in `.cabal`");
            }
            if ($32) {
              return $Either(1, $VersionSource(1, s));
            }
            fail();
          })(argument(["--from-cabal", "-c"])("For the changelog's header's version string, uses a `*.cabal` file's `version` field.")),
          unformat("CABAL_FILE")((v) => $Either(1, FromGitTag))(argument(["--from-git-tag", "-g"])("For the changelog's header's version string, use the git tag to which HEAD currently points.")),
          unformat("SEMVER_VERSION")((x) => {
            const $23 = parseVersion(x);
            if ($23.tag === 0) {
              return $Either(0, showParseError.show($23._1));
            }
            if ($23.tag === 1) {
              return $Either(1, $VersionSource(2, $23._1));
            }
            fail();
          })(argument(["--from-version", "-e"])("For the changelog's header's version string, use the user-provided version via the semver scheme (e.g. `MAJOR.MINOR.PATCH`)."))
        ]);
        return $ArgParser(
          $22._1,
          {
            step: $22._2.step,
            done: (x) => {
              const $32 = $22._2.done(x);
              if ($32.tag === 0) {
                return $Either(1, $VersionSource(0, "package.json"));
              }
              if ($32.tag === 1) {
                return $Either(1, $32._1);
              }
              fail();
            },
            saturated: true
          }
        );
      })()))(changelogFileArg))(changelogDirArg))(flagHelp)),
      command(["init", "i"])("Sets up the repo so that the `update` command will work in the future.")(applyParser.apply(applyParser.apply(applyParser.apply((() => {
        const $22 = $$boolean(flag(["--overwrite-dir-readme"])("When enabled, overwrites the 'CHANGELOG.d" + sep + "README.md' file, if it exists."));
        return $ArgParser(
          $22._1,
          functorArgFold.map((v) => (v1) => (v2) => (v3) => $Command(0, { overwriteReadme: v, changelogFile: v1, changelogDir: v2 }))($22._2)
        );
      })())(changelogFileArg))(changelogDirArg))(flagHelp))
    ]);
    const $3 = applyParser.apply($ArgParser($2._1, functorArgFold.map($$const)($2._2)))(flagHelp);
    return applyParser.apply($ArgParser($3._1, functorArgFold.map($$const)($3._2)))(flagInfo([
      "--version",
      "-v"
    ])("Shows the current version")("0.4.0"));
  })());
})();
var parseCliArgs = /* @__PURE__ */ parseArgs(foldableArray)("purs-changelog")("A CLI for updating the `CHANGELOG.md` file when making a new release.")(cliParser);
var main = () => {
  const a$p = argv();
  const v = parseCliArgs(sliceImpl(2, a$p.length, a$p));
  if (v.tag === 0) {
    log2(printArgError(v._1))();
    if (v._1._2.tag === 7) {
      return setExitCodeImpl(0);
    }
    if (v._1._2.tag === 8) {
      return setExitCodeImpl(0);
    }
    return setExitCodeImpl(1);
  }
  if (v.tag === 1) {
    if (v._1._2.tag === 1) {
      const fiber = _makeFiber(ffiUtil, update({ logger: mkLogger(v._1._1), cli: v._1._2._1 }))();
      fiber.run();
      return;
    }
    if (v._1._2.tag === 0) {
      const fiber = _makeFiber(ffiUtil, init({ logger: mkLogger(v._1._1), cli: v._1._2._1 }))();
      fiber.run();
      return;
    }
  }
  fail();
};

// bin/index.prod.mjs
main();
