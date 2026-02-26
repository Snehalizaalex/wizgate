import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(indexPath, 'utf-8');

// The markers based on exact HTML comments:
const homeStart = content.indexOf('<!-- Home Section -->');
const coursesStart = content.indexOf('<!-- Courses Section -->');
const aboutStart = content.indexOf('<!-- About Us Section -->');
const testStart = content.indexOf('<!-- Self Assessment Test Section -->');
const contactStart = content.indexOf('<!-- Contact Us Section -->');
const mainEnd = content.indexOf('</main>');

const header = content.substring(0, homeStart);
const homeSection = content.substring(homeStart, coursesStart);
const coursesSection = content.substring(coursesStart, aboutStart);
const aboutSection = content.substring(aboutStart, testStart);
const testSection = content.substring(testStart, contactStart);
const contactSection = content.substring(contactStart, mainEnd);
const footer = content.substring(mainEnd);

// Replace navbar links in the header
let modifiedHeader = header
    .replace(/href="#home"/g, 'href="index.html"')
    .replace(/href="#courses"/g, 'href="courses.html"')
    .replace(/href="#about"/g, 'href="about.html"')
    .replace(/href="#test"/g, 'href="test.html"')
    .replace(/href="#contact"/g, 'href="contact.html"');

// Create the files
fs.writeFileSync('index.html', modifiedHeader + homeSection + footer);
fs.writeFileSync('courses.html', modifiedHeader + coursesSection + footer);
fs.writeFileSync('about.html', modifiedHeader + aboutSection + footer);
fs.writeFileSync('test.html', modifiedHeader + testSection + footer);
fs.writeFileSync('contact.html', modifiedHeader + contactSection + footer);

console.log("Pages split successfully.");
