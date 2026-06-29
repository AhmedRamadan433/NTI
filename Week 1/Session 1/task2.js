//// 1️⃣ Check if Array is Sorted
function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }

  return true;
}
//////2️⃣ Return Numbers Greater Than a Value
function getGreaterNumbers(arr, value) {
  let result = [];

  for (let num of arr) {
    if (num > value) {
      result.push(num);
    }
  }

  return result;
}
/////3️⃣ Plus One (LeetCode)
function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }

    digits[i] = 0;
  }

  digits.unshift(1);

  return digits;
}
//////4️⃣ Remove Duplicates from Sorted Array (LeetCode)
var removeDuplicates = function (nums) {
  if (nums.length === 0) return 0;

  let k = 0;
  let curr = null;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== curr) {
      curr = nums[i];
      nums[k] = nums[i];
      k++;
    }
  }

  // Fill remaining with -1
  for (let i = k; i < nums.length; i++) {
    nums[i] = -1;
  }

  return k;
};
