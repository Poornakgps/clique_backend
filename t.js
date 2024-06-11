const fs = require('fs');

// Function to convert an image file to Base64 string
function imageToBase64(filePath) {
    // Read the image file as a Buffer
    const buffer = fs.readFileSync(filePath);

    // Convert the buffer to a Base64 string
    const base64String = buffer.toString('base64');

    return base64String;
}

// Example usage
const imagePath = 'uploads/1718080015065.jpeg'; // Replace this with the path to your image file
const base64Image = imageToBase64(imagePath);
console.log(base64Image); // Print the Base64 string representation of the image
