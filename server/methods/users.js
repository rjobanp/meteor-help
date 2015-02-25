ServiceConfiguration.configurations.remove({
  service: "github"
});

//if ( process.env.PRODUCTION_GITHUB ) {
  ServiceConfiguration.configurations.insert({
    service: "github",
    clientId: "8f52a8257940e4a47040",
    secret: "6af65e2bcdee63276fbbb984f7cc67d17c949b42"
  });
// } else {
//   // DEV Config Below
//   ServiceConfiguration.configurations.insert({
//     service: "github",
//     clientId: "88b3db4063ccd1af778a",
//     secret: "23d16d68d4d53795be2e629dd2733ddb93393718"
//   });
// }