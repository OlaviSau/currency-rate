const {Router} = require("express");
const {Database} = require("sqlite3");
const {get} = require("axios");
const router = Router();
const db = new Database(`${__dirname}/historical.db`);

router.get("/", (req, res) => db.all(
  `select * from rates where date between ? and ? order by date`,
  [req.query.start_at, req.query.end_at],
  (error, rates) => {
    if (error) {
      return res.status(500).json({error: "A unexpected error has occurred."});
    }

    const start_at = Date.parse(req.query.start_at);
    const end_at = Date.parse(req.query.end_at);
    const day2ms = 86400000;
    let day = 0;

    while (start_at + day * day2ms <= end_at) {
      if (!rates[day] || start_at + day * day2ms !== Date.parse(rates.date)) {
        const url = new URL("https://api.exchangeratesapi.io/history");
        url.searchParams.set("start_at", req.query.start_at);
        url.searchParams.set("end_at", req.query.end_at);
        url.searchParams.set("base", "USD");
        url.searchParams.set("symbols", "EUR");

        return get(url.toString()).then(({data}) => {
            res.json(Object.keys(data.rates).map(
              date => ({
                from: "USD",
                to: "EUR",
                date,
                rate: data.rates[date]["EUR"]
              })
            ));
          }
        );
      }
      day++;
    }

    res.json(rates);
  })
);

module.exports = router;
