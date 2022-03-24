const { ServiceBroker, Context } = require("moleculer");
const ApiGateway = require("moleculer-web");
const jwt = require("jsonwebtoken");

const broker = new ServiceBroker({
  // middlewares: [middleware],
  // transporter: 'NATS',
  cacher: {
    type: "redis",
    options: {
      ttl: 60 * 5,
    },
  },
  created(broker) {
    console.log("Broker created!");
  },
  async started(broker) {
    console.log("Broker started!");
  },
  async stopped(broker) {
    console.log("Broker stopped!");
  },
});

broker.createService({
  name: "test",

  mixins: [ApiGateway],
  settings: {
    // routes: [
    //   {
    //     aliases: {
    //       "GET LIST"(req, res) {
    //         res.send("Hello");
    //       },
    //     },
    //   },
    // ],
  },
  actions: {
    signIn: {
      rest: {
        path: "/sign-in",
        method: "POST",
      },
      cache: true,
      params: {
        username: "string",
        password: "string",
      },
      handler(ctx) {
        const { username, password } = ctx.params;
        if (username && password) {
          const token = jwt.sign({ username }, "SecretKey");
          return { token };
        }
      },
    },
    sum: {
      cache: true,
      handler(ctx) {
        const sum = ctx.params.a.reduce((acc, item, index) => {
          return acc + item;
        }, 0);
        return sum;
      },
    },
    write: {
      cache: true,
      params: {
        name: "string",
      },
      handler(ctx) {
        this.logger.info("Handler called");

        return `I fall in love with ${ctx.params.name}`;
      },
    },
    list: {
      cache: true,
      handler(ctx) {
        this.logger.info("Handler called");
        return [
          { id: 1, name: "Peter" },
          { id: 2, name: "Tony" },
          { name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
          { name: "iPhone 11 Pro", quantity: 25, price: 999 },
          { name: "Huawei P30 Pro", quantity: 15, price: 679 },
        ];
      },
    },
  },
});

broker.start();
