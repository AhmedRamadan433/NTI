const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const filePath = path.join(__dirname, "books.json");

function send(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readBooks() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function writeBooks(books) {
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
}

function readBody(req, callback) {
  let body = "";

  req.on("data", function (chunk) {
    body += chunk;
  });

  req.on("end", function () {
    try {
      const data = body ? JSON.parse(body) : {};
      callback(null, data);
    } catch (error) {
      callback(error);
    }
  });
}

function getNewId(books) {
  if (books.length === 0) {
    return 1;
  }

  return books[books.length - 1].id + 1;
}

const server = http.createServer(function (req, res) {
  const url = req.url.split("?")[0];
  const parts = url.split("/");
  const id = Number(parts[2]);

  try {
    if (req.method === "GET" && url === "/books") {
      const books = readBooks();
      send(res, 200, books);
      return;
    }

    if (req.method === "GET" && parts[1] === "books" && parts[2]) {
      const books = readBooks();
      const book = books.find(function (item) {
        return item.id === id;
      });

      if (!book) {
        send(res, 404, { message: "Book not found" });
        return;
      }

      send(res, 200, book);
      return;
    }

    if (req.method === "POST" && url === "/books") {
      readBody(req, function (error, body) {
        if (error) {
          send(res, 400, { message: "Invalid JSON" });
          return;
        }

        try {
          const books = readBooks();

          const newBook = {
            id: getNewId(books),
            title: body.title,
            author: body.author,
            price: body.price,
            available: body.available,
          };

          books.push(newBook);
          writeBooks(books);

          send(res, 201, newBook);
        } catch (fileError) {
          send(res, 500, { message: "File error" });
        }
      });

      return;
    }

    if (req.method === "DELETE" && parts[1] === "books" && parts[2]) {
      const books = readBooks();
      const index = books.findIndex(function (book) {
        return book.id === id;
      });

      if (index === -1) {
        send(res, 404, { message: "Book not found" });
        return;
      }

      books.splice(index, 1);
      writeBooks(books);

      send(res, 200, { message: "Book deleted" });
      return;
    }

    if (req.method === "PUT" && parts[1] === "books" && parts[2]) {
      readBody(req, function (error, body) {
        if (error) {
          send(res, 400, { message: "Invalid JSON" });
          return;
        }

        try {
          const books = readBooks();
          const book = books.find(function (item) {
            return item.id === id;
          });

          if (!book) {
            send(res, 404, { message: "Book not found" });
            return;
          }

          book.title = body.title;
          book.author = body.author;
          book.price = body.price;
          book.available = body.available;

          writeBooks(books);
          send(res, 200, book);
        } catch (fileError) {
          send(res, 500, { message: "File error" });
        }
      });

      return;
    }

    send(res, 404, { message: "Route not found" });
  } catch (error) {
    send(res, 500, { message: "Server error" });
  }
});

server.listen(PORT, function () {
  console.log("Server running on http://localhost:" + PORT);
});
