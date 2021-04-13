const targetChars = "abcabx";

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
  if (c === "a") {
    return foundA2;
  } else {
    return start(c);
  }
}

function foundA2(c) {
  if (c === "b") {
    return foundB2;
  } else {
    return start(c);
  }
}

function foundB2(c) {
  if (c === "x") {
    return end;
  } else {
    return foundB(c);
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

expect(match("abcabx"), true);
expect(match("not match abcab."), false);
expect(match("abccabx"), false);
expect(match("abcabcabx"), true);
