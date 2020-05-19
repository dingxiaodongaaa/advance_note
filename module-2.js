// async function t1() {
//     let a = await "lagou";
//     console.log(a);
//   }
//   t1();

// async function t2() {
//       let a = await new Promise((resolve) => {});
//       console.log(a);
//     }
//     t2()

// async function t3() {
//     let a = await new Promise((resolve) => {
//       resolve();
//     });
//     console.log(a);
//   }
//   t3();

// async function t4() {
//     let a = await new Promise((resolve) => {
//       resolve("hello");
//     });
//     console.log(a);
//   }
//   t4();

// async function t5() {
//     let a = await new Promise((resolve) => {
//       resolve("hello");
//     }).then(() => {
//       return "lala";
//     });
//     console.log(a);
//   }
//   t5();

// async function t6() {
//     let a = await fn().then((res) => {
//       return res;
//     });
//     console.log(a);
//   }
//   async function fn() {
//     await new Promise((resolve) => {
//       resolve("lagou");
//     });
//   }
// //   t6();
//   console.log(fn()) //为什么会返回一个pending状态的promise

// async function t7() {
//     let a = await fn().then((res) => {
//       return res;
//     });
//     console.log(a);
//   }
//   async function fn() {
//     await new Promise((resolve) => {
//       resolve("lagou");
//     });
//     return "lala";
//   }
//   t7();
// console.log(fn())
