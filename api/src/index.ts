import express from "express";

const app = express();

app.listen(8000, () => {
  console.log("Server running on 8000 with auto restart!");
});

function myname(a: number): void {
  function myname2(a: number): number {
    return a;
  }

  myname2(a);
}

function hola(): string {
  myname(2);

  return "omg" + "cap";
}

app.get("/", (req, res) => {
  res.send("Awesome! We're live debugging this!");
  hola();
});
