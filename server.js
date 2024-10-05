const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;

// Middleware
app.use(express.json());

// REST API
const cars = JSON.parse(
  fs.readFileSync(`${__dirname}/assets/data/cars.json`, "utf-8")
);

// GET / => default URL untuk root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "ping successfully",
  });
});

// GET cars => membuka list cars (Collection URL)
app.get("/cars", (req, res) => {
  if (!cars) {
    return res.status(404).json({
      status: "failed",
      message: "cars data is not found",
      isSuccess: false,
      data: null,
    });
  }

  res.status(200).json({
    status: "success",
    message: "success to get cars data",
    isSuccess: true,
    totalData: cars.length,
    data: { cars },
  });
});

// GET cars by id => membuka satu data cars (Resource URL)
app.get("/cars/:id", (req, res) => {
  const carId = req.params.id;

  const car = cars.find((i) => i.id === carId);

  if (!car) {
    return res.status(404).json({
      status: "failed",
      message: `failed to get a car data from id = ${carId}`,
      isSuccess: false,
      data: null,
    });
  }

  res.status(200).json({
    status: "success",
    message: `success to get a car data`,
    isSuccess: true,
    data: { car },
  });
});

// POST cars => mengembalikan response data cars yang sudah terbuat
app.post("/cars", (req, res) => {
  const newCar = req.body;

  cars.push(newCar);

  fs.writeFile(
    `${__dirname}/assets/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "success to add new car data",
        isSuccess: true,
        data: { car: newCar },
      });
    }
  );
});

// PUT cars => mengembalikan response data cars yang sudah terupdate
app.put("/cars/:id", (req, res) => {
  const carId = req.params.id;

  const car = cars.find((i) => i.id === carId);

  const carIndex = cars.findIndex((car) => car.id === carId);

  cars[carIndex] = { ...cars[carIndex], ...req.body };

  if (!car) {
    return res.status(404).json({
      status: "failed",
      message: `failed to get a car data from id = ${carId}`,
      isSuccess: false,
      data: null,
    });
  }

  fs.writeFile(
    `${__dirname}/assets/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "success",
        message: "success to rewrite car data for this id",
        isSuccess: true,
      });
    }
  );
});

// DELETE cars => mengembalikan response data cars yang sudah terhapus
app.delete("/cars/:id", (req, res) => {
  const carId = req.params.id;

  const car = cars.find((i) => i.id === carId);

  const carIndex = cars.findIndex((car) => car.id === carId);

  cars.splice(carIndex, 1);

  if (!car) {
    return res.status(404).json({
      status: "failed",
      message: `failed to get a car data from id = ${carId}`,
      isSuccess: false,
      data: null,
    });
  }

  fs.writeFile(
    `${__dirname}/assets/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "success",
        message: "success to delete car data for this id",
        isSuccess: true,
      });
    }
  );
});

// Custom middleware untuk handle URL yang tidak ada
app.use((req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "URL not exist",
  });
});

app.listen(PORT, () => {
  console.log("application start at port:3000");
});
