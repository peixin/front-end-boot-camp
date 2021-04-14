const targetChars = "abababx";

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

function end(c) {
  return end;
}

function foundA(c) {
  if (c === "b") {
    return foundB;
  } else {
    return start(c);
  }
}

function foundB(c) {
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
  if (c === "a") {
    return foundA3;
  } else {
    return start(c);
  }
}

function foundA3(c) {
  if (c === "b") {
    return foundB3;
  } else {
    return start(c);
  }
}

function foundB3(c) {
  if (c === "x") {
    return end;
  } else {
    return foundB2(c);
  }
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

expect(match("abababx"), true);
expect(match("not match abababa."), false);
expect(match("ababababx"), true);
