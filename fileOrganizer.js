
const fs = require("fs").promises; 
const path = require("path"); 
// Organize files into folders based on type 
async function organizeFiles(directory) { 
const extensionsMap = { 
Images: [".jpg", ".jpeg", ".png", ".gif"], 
Documents: [".pdf", ".docx", ".txt", ".xlsx"], 
Videos: [".mp4", ".mkv", ".avi"], 
}; 
const files = await fs.readdir(directory); 
for (const file of files) { 
const filePath = path.join(directory, file); 
const stats = await fs.stat(filePath); 
// Skip folders to avoid self-moving 
if (stats.isDirectory()) continue; 
const ext = path.extname(file).toLowerCase(); 
let folderName = "Others"; 
// Match file extension to folder type 
for (const [key, extensions] of Object.entries(extensionsMap)) { 
if (extensions.includes(ext)) { 
folderName = key; 
break; 
} 
} 


const folderPath = path.join(directory, folderName); 
// Create the folder if it doesn't exist 
await fs.mkdir(folderPath, { recursive: true }); 
// Move the file 
const destPath = path.join(folderPath, file); 
await fs.rename(filePath, destPath); 
console.log(`Moved: ${file} -> ${folderName}`); 
} 
// Write a summary of the operation 
const summaryPath = path.join(directory, "summary.txt"); 
const summaryContent = files.map(file => `Processed: ${file}`).join("\n"); await fs.writeFile(summaryPath, summaryContent); 
console.log("Files organized successfully."); 
} 
// Get the directory path from command-line arguments 
const inputDir = process.argv[2]; 
if (!inputDir) { 
console.error("Please provide a directory path as an argument."); process.exit(1); 
} 
// Run the file organizer 
organizeFiles(inputDir).catch(err => console.error("Error:", err)); 
