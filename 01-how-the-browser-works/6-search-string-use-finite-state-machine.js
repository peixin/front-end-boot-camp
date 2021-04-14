const targetChars = "abcdef";

function match(string) {
  console.log(`'${string}' contain '${targetChars}'?`);
  let state = start;
  for (let c of string) {
    // const oldStateName = state.name;
    state = state(c);
    // console.log(`${oldStateName} ==> ${c} ==> ${state.name}`);
  }
  return state === end;
}

function start(c) {
  if (c === "a") {
    return foundA;
  } else {
    return start;
  }
}

function foundA(c) {
  if (c === "b") {
    return foundB;
  } else {
    return start(c);
  }
}

function foundB(c) {
  if (c === "c") {
    return foundC;
  } else {
    return start(c);
  }
}

function foundC(c) {
  if (c === "d") {
    return foundD;
  } else {
    return start(c);
  }
}

function foundD(c) {
  if (c === "e") {
    return foundE;
  } else {
    return start(c);
  }
}

function foundE(c) {
  if (c === "f") {
    return end;
  } else {
    return start(c);
  }
}

function end(c) {
  return end;
}

const expect = (result, expectResult) => {
  if (result === expectResult) {
    if (result) {
      console.log(`✅ YES.`);
    } else {
      console.log(`✅ No.`);
    }
  } else {
    console.log(`❌ Unexpected result!`);
  }
  console.log("");
};

expect(match("must match abcdef."), true);
expect(match("not match abcde."), false);
expect(match("abbccddeeff"), false);
expect(match("ababcdef"), true);
