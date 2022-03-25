exports.module = middleware = {
  name: "CheckLength",
  localAction(next, action) {
    return function (ctx) {
      console.log(ctx);
      console.log(action);

      return next(ctx)
        .then((res) => {
          console.log(ctx.action);
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    };
  },
};
