const targetChars = "abcabx";

const findChars = (str) => {
  console.log(str);
  let matchedQueue = [];
  for (const char of str) {
    if (
      matchedQueue.length &&
      char !== targetChars.charAt(matchedQueue.length)
    ) {
      matchedQueue.length = 0;
    }

    if (char === targetChars.charAt(matchedQueue.length)) {
      matchedQueue.push(char);
    }

    if (matchedQueue.length === targetChars.length) {
      return true;
    }
  }
  return false;
};

const expect = (result, expectResult) => {
  if (result === expectResult) {
    if (result) {
      console.log(`✅ Find string "${targetChars}" from above.`);
    } else {
      console.log(`✅ Can't find string "${targetChars}" from above.`);
    }
  } else {
    console.log(`❌ Unexpected result!`);
  }
  console.log("");
};

expect(findChars("must match abcabx."), true);
expect(findChars("not match abcbax."), false);
expect(findChars("abcccccabx"), false);
// todo: fix it
expect(findChars("abcabcabx"), true);
