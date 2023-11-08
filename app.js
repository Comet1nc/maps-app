const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Use the provided PORT environment variable or default to 3000.

// Define a route to serve static files (HTML, CSS, JS, etc.) from the 'src' directory.
app.use(express.static("src"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
