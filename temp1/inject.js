const fs = require('fs');

const questions = [
    { q: '1. How do you say "Good morning" in Polish?', options: { a: 'Dobranoc', b: 'Dzień dobry', c: 'Cześć', d: 'Do widzenia' }, ans: 'b' },
    { q: '2. What does "Cześć" mean?', options: { a: 'Goodbye', b: 'Thank you', c: 'Hello / Hi', d: 'Please' }, ans: 'c' },
    { q: '3. How do you say "Thank you"?', options: { a: 'Proszę', b: 'Przepraszam', c: 'Dziękuję', d: 'Tak' }, ans: 'c' },
    { q: '4. How do you say "Please"?', options: { a: 'Proszę', b: 'Dziękuję', c: 'Nie', d: 'Tak' }, ans: 'a' },
    { q: '5. What does "Do widzenia" mean?', options: { a: 'Good night', b: 'See you later', c: 'Goodbye (formal)', d: 'Hello' }, ans: 'c' },
    { q: '6. How do you ask "What is your name?"', options: { a: 'Ile masz lat?', b: 'Jak się masz?', c: 'Jak masz na imię?', d: 'Skąd jesteś?' }, ans: 'c' },
    { q: '7. How do you answer: "Jak masz na imię?"', options: { a: 'Mam 25 lat', b: 'Jestem z Polski', c: 'Mam na imię Anna', d: 'Jestem dobrze' }, ans: 'c' },
    { q: '8. How do you ask "How old are you?"', options: { a: 'Skąd jesteś?', b: 'Ile masz lat?', c: 'Kim jesteś?', d: 'Gdzie mieszkasz?' }, ans: 'b' },
    { q: '9. "Mam 30 lat" means:', options: { a: 'I am 30 years old', b: 'I have 30 books', c: 'I am from 30 cities', d: 'I work for 30 years' }, ans: 'a' },
    { q: '10. How do you ask "Where are you from?"', options: { a: 'Gdzie pracujesz?', b: 'Skąd jesteś?', c: 'Gdzie mieszkasz?', d: 'Kim jesteś?' }, ans: 'b' },
    { q: '11. What number is "pięć"?', options: { a: '3', b: '4', c: '5', d: '6' }, ans: 'c' },
    { q: '12. What does "dziesięć" mean?', options: { a: '7', b: '8', c: '9', d: '10' }, ans: 'd' },
    { q: '13. How do you say "today" in Polish?', options: { a: 'Jutro', b: 'Wczoraj', c: 'Dzisiaj', d: 'Zawsze' }, ans: 'c' },
    { q: '14. "Jutro" means:', options: { a: 'Today', b: 'Yesterday', c: 'Tomorrow', d: 'Morning' }, ans: 'a' },
    { q: '15. How do you ask "What time is it?"', options: { a: 'Kiedy pracujesz?', b: 'Ile kosztuje?', c: 'Która jest godzina?', d: 'Jak długo?' }, ans: 'c' },
    { q: '16. What does "Pracuję w biurze" mean?', options: { a: 'I live in an office', b: 'I work in an office', c: 'I study in an office', d: 'I clean an office' }, ans: 'b' },
    { q: '17. How do you say "I don’t understand"?', options: { a: 'Nie wiem', b: 'Nie rozumiem', c: 'Nie mówię', d: 'Nie chcę' }, ans: 'b' },
    { q: '18. "Ile to kosztuje?" means:', options: { a: 'How are you?', b: 'How much does it cost?', c: 'Where is it?', d: 'What is this?' }, ans: 'b' },
    { q: '19. How do you say "Yes" in Polish?', options: { a: 'Nie', b: 'Tak', c: 'Może', d: 'Już' }, ans: 'b' },
    { q: '20. How do you say "No"?', options: { a: 'Tak', b: 'Dobrze', c: 'Nie', d: 'Proszę' }, ans: 'c' },
    { q: '21. What does "dom" mean?', options: { a: 'Room', b: 'Door', c: 'House', d: 'School' }, ans: 'c' },
    { q: '22. "Sklep" means:', options: { a: 'School', b: 'Shop', c: 'Hospital', d: 'Office' }, ans: 'b' },
    { q: '23. What does "woda" mean?', options: { a: 'Coffee', b: 'Milk', c: 'Water', d: 'Juice' }, ans: 'c' },
    { q: '24. "Chleb" is:', options: { a: 'Cheese', b: 'Bread', c: 'Butter', d: 'Meat' }, ans: 'b' },
    { q: '25. What does "Dobrze" mean?', options: { a: 'Bad', b: 'Fast', c: 'Good / Okay', d: 'Slow' }, ans: 'c' },
    { q: '26. Choose the correct sentence:', options: { a: 'Wczoraj idę do pracy', b: 'Wczoraj poszedłem do pracy', c: 'Wczoraj iść do pracy', d: 'Wczoraj idziemy do pracy' }, ans: 'b' },
    { q: '27. What does "Muszę pracować jutro" mean?', options: { a: 'I want to work tomorrow', b: 'I worked yesterday', c: 'I must work tomorrow', d: 'I like my work' }, ans: 'c' },
    { q: '28. Choose the correct question: "Why are you learning Polish?"', options: { a: 'Dlaczego uczysz się polski?', b: 'Dlaczego uczę się polski?', c: 'Dlaczego uczysz polska?', d: 'Dlaczego uczyć się polski?' }, ans: 'a' },
    { q: '29. Fill in the blank: ____ mieszkam w Warszawie od dwóch lat.', options: { a: 'Jestem', b: 'Mam', c: 'Mieszkam', d: 'Pracuję' }, ans: 'c' },
    { q: '30. What does "Szukam pracy w biurze" mean?', options: { a: 'I work in an office', b: 'I like office work', c: 'I am looking for a job in an office', d: 'I finished office work' }, ans: 'c' },
    { q: '31. Choose the correct form: Ona ____ po polsku bardzo dobrze.', options: { a: 'mówi', b: 'mówię', c: 'mówić', d: 'mówią' }, ans: 'a' },
    { q: '32. What does "Nie mam czasu dzisiaj" mean?', options: { a: 'I don’t like today', b: 'I don’t have time today', c: 'I am not working today', d: 'I have time today' }, ans: 'b' },
    { q: '33. Choose the correct sentence:', options: { a: 'Lubię kawa', b: 'Lubię kawę', c: 'Lubić kawę', d: 'Lubię kawy jest' }, ans: 'b' },
    { q: '34. What does "Po pracy idę do domu" mean?', options: { a: 'I work at home', b: 'After work I go home', c: 'I go to work from home', d: 'Before work I go home' }, ans: 'b' },
    { q: '35. Choose the correct reply: – Czy możesz mi pomóc?', options: { a: 'Tak, mogę', b: 'Tak, mogę pomagam', c: 'Tak, pomagać', d: 'Tak, pomagaj' }, ans: 'a' }
];

let htmlContent = '<h3 class="section-subtitle test-title">Assessment Questions</h3>\n';
questions.forEach((q, i) => {
    let name = 'q' + (i + 1);
    htmlContent += `                        <div class="question-item">
                            <p>${q.q}</p>
                            <div class="options">
                                <label><input type="radio" name="${name}" value="a" required> ${q.options.a}</label>
                                <label><input type="radio" name="${name}" value="b"> ${q.options.b}</label>
                                <label><input type="radio" name="${name}" value="c"> ${q.options.c}</label>
                                <label><input type="radio" name="${name}" value="d"> ${q.options.d}</label>
                            </div>
                        </div>\n`;
});

let jsContent = '';
questions.forEach((q, i) => {
    jsContent += `            if (data.get('q${i + 1}') === '${q.ans}') score++;\n`;
});

let oldHtml = fs.readFileSync('test.html', 'utf-8');
let htmlStart = oldHtml.indexOf('<h3 class="section-subtitle test-title">Assessment Questions</h3>');
let htmlEnd = oldHtml.indexOf('<button type="submit" class="btn-gold-large">Submit Assessment</button>');

let newHtml = oldHtml.substring(0, htmlStart) + htmlContent + '                        ' + oldHtml.substring(htmlEnd);

fs.writeFileSync('test.html', newHtml);
console.log('test.html updated.');

let oldJs = fs.readFileSync('main.js', 'utf-8');
let jsStart = oldJs.indexOf("const totalQuestions = ");
let jsEnd = oldJs.indexOf("const percentage = Math.round((score / totalQuestions) * 100);");

let replacementJs = `const totalQuestions = 35;
${jsContent}
            `;
let newJs = oldJs.substring(0, jsStart) + replacementJs + oldJs.substring(jsEnd);

// Also add mailto link in JS
let jsMailToStart = newJs.indexOf('assessmentForm.classList.add(\'hidden\');');
let mailtoLogic = `            const firstName = data.get('firstName') || '';
            const lastName = data.get('lastName') || '';
            const email = data.get('email') || '';
            const phone = data.get('phone') || '';
            
            const bodyText = \`Assessment Result for \${firstName} \${lastName}
Email: \${email}
Phone: \${phone}
Language: \${data.get('language') || ''}

Score: \${score} / \${totalQuestions}
Percentage: \${percentage}%
\`;
            
            window.location.href = \`mailto:info@wizgate.eu,\${email}?subject=\${encodeURIComponent('Self Assessment Result')}&body=\${encodeURIComponent(bodyText)}\`;

            `;

newJs = newJs.substring(0, jsMailToStart) + mailtoLogic + newJs.substring(jsMailToStart);

fs.writeFileSync('main.js', newJs);
console.log('main.js updated.');
