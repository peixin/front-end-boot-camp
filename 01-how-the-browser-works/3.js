const targetChar = "a";

const findChar = (str) => {
  console.log(str);
  for (const char of str) {
    if (char === targetChar) {
      return true;
    }
  }
  return false;
};

const expect = (result, expectResult) => {
  if (result === expectResult) {
    if (result) {
      console.log(`✅ Find character "${targetChar}" from above.`);
    } else {
      console.log(`✅ Can't find character "${targetChar}" from above.`);
    }
  } else {
    console.log(`❌ Unexpected result!`);
  }
  console.log("");
};

expect(findChar("I love apple."), true);
expect(findChar("I love cherry."), false);
