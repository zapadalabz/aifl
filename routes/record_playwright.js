const express = require('express');
const playwright = require('playwright');
require("dotenv").config();

var TurndownService = require('turndown');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const recordPlaywrightRoutes = express.Router();

const browsers = {};
const pages = {};

const MANAGEBAC_BASE_URL = process.env.MANAGEBAC_BASE_URL;


recordPlaywrightRoutes.post('/playwright/login', async (req, res) => {
  const { username, password } = req.body;

  browsers[username] = await playwright.chromium.launch();;
  const context = await browsers[username].newContext();
  pages[username] = await context.newPage();;

  const browser = browsers[username];
  const page = pages[username];

  try {
    await page.goto(`${MANAGEBAC_BASE_URL}/login`);

    // Fill the form and submit
    await page.fill('#session_login', username);
    await page.fill('#session_password', password);
    await page.click('input[value="Sign in"]');    

    await page.goto(`${MANAGEBAC_BASE_URL}/teacher/classes/my`);

    const courses = await page.$$('.ib-class-row');

    let output = [];
    for (let course of courses) {
        const title = await course.$('.title');
        const link = await title.$('a');
        const href = await link.getAttribute('href');
        const id = href.split('/').pop();
        const text = await link.innerText();
        const code = await (await title.$('.labels-set .label')).innerText();
        
        output.push({'title': text, 'id': id, 'code': code});
        //console.log(text, href);
      }
    //console.log(output);
    if (output.length === 0) {
        throw new Error('No courses found. Check your credentials.');
    }
    
    browsers[username] = browser;
    pages[username] = page;
    res.json(output);
  } catch (error) {
    //console.error(error);
    res.status(400).json({ status: 'Failed to log in', error: error.message });
    await browser.close();
  } 
});

recordPlaywrightRoutes.get('/playwright/getClass/:email/:id', async (req, res) => {    
    const browser = browsers[req.params.email];
    const page = pages[req.params.email];
    
    try {
        await page.goto(`${MANAGEBAC_BASE_URL}/teacher/classes/${req.params.id}/gradebook/core_tasks`);

        const termGrade = await (await page.$$('.grid-nav-tile .btn')).pop();
        const termGradeURL = await termGrade.getAttribute('href');

        await page.goto(MANAGEBAC_BASE_URL+termGradeURL);

        const current_term = await (await page.$('#select2-term-container')).innerText();

        //Get Student Details
        const studentCard = await page.$$('.student-grade');
        let studentList = [];
        for (student of studentCard) {
            let studentObj = {};

            const studentName = await student.$('.student-name a');
            const studentNameText = await studentName.innerText();
            //console.log(studentNameText);
            //Check if criteria are listed(MYP vs DP)
            
            const criteria_grades = await student.$$('div.form-group.completion-warning-criteria');
            if(criteria_grades){
                let MYP = {}
                for(criteria of criteria_grades){
                    const criteria_label = await criteria.$('label');
                    const criteria_label_text = await criteria_label.innerText();
                    const points_btn = await criteria.$('div.points-button.selected');
                    let criteria_value_text = "";
                    if(points_btn){
                        criteria_value_text = await points_btn.innerText();
                    }
                    MYP[criteria_label_text] = criteria_value_text;
                    //console.log(criteriaNameText, criteriaValueText);
                }
                if (Object.keys(MYP).length !== 0){
                    studentObj["MYP"] = MYP;
                    studentObj["program"] = "myp";
                }else{
                    studentObj["program"] = "dp";
                }
                
            }else{
                studentObj["program"] = "dp";
            }
            //ATLs
            const studentDetails = await student.$$('div.form-group.cell');

            const commentElement = await student.$('div.student-comment div.fr-element.fr-view');
            var turndownService = new TurndownService();
            let comment = "";
            if (commentElement) {
                comment = await commentElement.innerHTML();
                comment = turndownService.turndown(comment);
            }

            
            studentObj['comment'] = comment;

            for(detail of studentDetails){
                const label = await (await detail.$('.control-label')).innerText();
                const value = await (await detail.$('.select2-selection__rendered')).innerText();
                if(label === "Overall Mark"){
                    studentObj[label] = value;
                }else if(value !== ""){
                    studentObj[label] = value;
                }else{
                    studentObj[label] = "E";
                }
                
            }
            studentObj["id"] = await student.getAttribute('data-student');
            studentObj["name"] = studentNameText;
            
            studentList.push(studentObj);
        }

        return res.json({term: current_term, studentList: studentList});

    } catch (error) {
        console.error(error);
        res.json({ status: 'Failed to get classes', error: error.message });
    }
});

recordPlaywrightRoutes.post('/playwright/updateStudentCard', async (req, res) => {    
    const browser = browsers[req.body.email];
    const page = pages[req.body.email];
    const studentObj = req.body.studentObj;

    // XPath to find the exact text match (note: this is case-sensitive)
    const xpathExpression = `div[data-student='${studentObj.id}']`;

    // Find the anchor element (a) that contains the student's name
    const studentCard = await page.$(xpathExpression);

    //Update the comment
    const commentElement = await studentCard.$('div.student-comment div.fr-element.fr-view');
    await commentElement.fill(studentObj.comment);

    //Update the MYP Criteria
    if(studentObj.program === "myp"){
        const criteria_grades = await studentCard.$$('div.form-group.completion-warning-criteria');
        for(criteria of criteria_grades){
            const criteria_label = await criteria.$('label');
            const criteria_label_text = await criteria_label.innerText();
            const points_btn = await criteria.$$('div.points-button');
            if (studentObj["MYP"][criteria_label_text] === ""){
                const points_btn_selected = await criteria.$('div.points-button.selected');
                if(points_btn_selected){
                    await points_btn_selected.click();
                }
            }else if (studentObj["MYP"][criteria_label_text] === "N/A"){
                await points_btn[0].click();
            }else{
                const btn_index = parseInt(studentObj["MYP"][criteria_label_text])+1;
                await points_btn[btn_index].click();
            }
        }
    }

    //Update the ATLs
    const studentATLs = await studentCard.$$('div.form-group.cell');

    for(atl of studentATLs){
                const label = await (await atl.$('.control-label')).innerText();
                const combobox = await atl.$('span[role="combobox"]');
                if(studentObj[label]===""){
                    await combobox.press("ArrowDown");
                    for(i=0; i<22; i++){
                        await combobox.press("ArrowUp");
                    }
                    await combobox.press("Enter");
                }else{
                    if(label === "Overall Mark"){
                        await combobox.press("N");
                        if (studentObj[label].length === 1){
                            await combobox.press(studentObj[label][0]);
                            await combobox.press(studentObj[label][0]);
                        }else if (studentObj[detail][1] === "-"){
                            await combobox.press(studentObj[label][0]);
                            await combobox.press(studentObj[label][0]);
                            await combobox.press(studentObj[label][0]);
                        }else{
                            await combobox.press(studentObj[label][0]);                            
                        }
                    }else{
                        await combobox.press(studentObj[label][0]);
                    }
                }
                
                
            }
});

recordPlaywrightRoutes.post('/playwright/updateStudentCardList', async (req, res) => {    
    const browser = browsers[req.body.email];
    const page = pages[req.body.email];
    const studentObjs = req.body.studentObj;
    try{
        for(const studentObj of Object.values(studentObjs)){
            await delay(100);
            console.log(studentObj.name);
            // XPath to find the exact text match (note: this is case-sensitive)
            const xpathExpression = `div[data-student='${studentObj.id}']`;
    
            // Find the anchor element (a) that contains the student's name
            const studentCard = await page.$(xpathExpression);
    
            //Update the comment
            const commentElement = await studentCard.$('div.student-comment div.fr-element.fr-view');
            await commentElement.fill(studentObj.comment);
            //Update the MYP Criteria
            if(studentObj.program === "myp"){
                const criteria_grades = await studentCard.$$('div.form-group.completion-warning-criteria');
                for(criteria of criteria_grades){
                    const criteria_label = await criteria.$('label');
                    const criteria_label_text = await criteria_label.innerText();
                    const points_btn = await criteria.$$('div.points-button');
                    if (studentObj["MYP"][criteria_label_text] === ""){
                        const points_btn_selected = await criteria.$('div.points-button.selected');
                        if(points_btn_selected){
                            await points_btn_selected.click();
                        }
                    }else if (studentObj["MYP"][criteria_label_text] === "N/A"){
                        await points_btn[0].click();
                    }else{
                        const btn_index = parseInt(studentObj["MYP"][criteria_label_text])+1;
                        await points_btn[btn_index].click();
                    }
                    await delay(100);
                }
            }
    
            //Update the ATLs
            const studentATLs = await studentCard.$$('div.form-group.cell');
    
            for(atl of studentATLs){
                const label = await (await atl.$('.control-label')).innerText();
                const combobox = await atl.$('span[role="combobox"]');
                if(studentObj[label]===""){
                    await combobox.press("ArrowDown");
                    for(i=0; i<22; i++){
                        await delay(10);
                        await combobox.press("ArrowUp");
                    }
                    await delay(200);
                    await combobox.press("Enter");
                }else{
                    if(label === "Overall Mark"){
                        await combobox.press("N");
                        await delay(10);
                        if (studentObj[label].length === 1){
                            await combobox.press(studentObj[label][0]);
                            await delay(10);
                            await combobox.press(studentObj[label][0]);
                            await delay(10);
                        }else if (studentObj[label][1] === "-"){
                            await combobox.press(studentObj[label][0]);
                            await delay(10);
                            await combobox.press(studentObj[label][0]);
                            await delay(10);
                            await combobox.press(studentObj[label][0]);
                            await delay(10);
                        }else{
                            await combobox.press(studentObj[label][0]); 
                            await delay(10);                           
                        }
                    }else{
                        await delay(10);
                        await combobox.press(studentObj[label][0]);
                        await delay(10);
                    }
                }                
                await delay(10);
            }
        }
        res.send({status:"Success"});
    }catch(error){
        console.error(error);
        res.json({ status: 'Failed to update students', error: error.message });
    }    
});


module.exports = recordPlaywrightRoutes;