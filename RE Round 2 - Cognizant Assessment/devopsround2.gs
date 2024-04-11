

function pointsCount() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const demoSheet = ss.getSheetByName("Demosheet");
  const demoSheetValues = demoSheet.getDataRange().getValues();
  const badgeSheet = ss.getSheetByName("Badgesheet");
  const badgeSheetValues = badgeSheet.getDataRange().getValues();
  var validDate = new Date('January 1, 2024');


  for ( let i=1 ; i < demoSheetValues.length; i++){
    var row = demoSheetValues[i];
    var url = row[5];
    var badgesArray=[];
    let count = 0;
    var skillBagesArray=[];
    var trimmedDateString;

  if(url){
  var response = UrlFetchApp.fetch(url);
  var htmlResponse = response.getContentText()

  const $ = Cheerio.load(htmlResponse)
  

  const bagesEarn = $('span.ql-title-medium.l-mts').map(function(){
    return $(this).text().trim();
  }).get();
  
  for (let i=1 ;i<badgeSheetValues.length ; i++){
    var row = badgeSheetValues[i];
    badgesArray.push(row);
  }

    // Extract only the date part from the text content
  var earnDates = $('span.ql-body-medium.l-mbs').map(function(){
      var text = $(this).text().trim();
      // Extract the date part by splitting the string and taking the second part
      var datePart = text.split("Earned '");
      return datePart;
  }).get();

  var valueearnDates = earnDates.map(function(edate){
      trimmedDateString = edate.replace(/\s+/g, ' ').trim();
    return new Date(trimmedDateString)
  })


for (let i = 0; i < badgeSheetValues.length; i++) {
    for (let j = 0; j < bagesEarn.length; j++) {
        // Check if badge values match and the date is valid
        if (badgeSheetValues[i][0] == bagesEarn[j] && valueearnDates[j].getTime() >= validDate.getTime()) {
            skillBagesArray.push(bagesEarn[j]);
            count++;
            break; 
        }
    }
}

console.log(skillBagesArray);
console.log(count);

const badgesString = skillBagesArray.join(', ');
demoSheet.getRange(i+1,9,1,1).setValue(badgesString);
demoSheet.getRange(i+1,10,1,1).setValue(count);


}
}
}


// Fetching skill badges from qwiklabs catalog 

function test() {
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1idV_nY79eg4dyojYQDScd2xwd3ZXsqaZfk0hDG0TDFg/edit#gid=1878330627");
  var sheet = ss.getSheetByName("Badgesheet");
  var pageNumber = 10;

  var allSkillbages = [];

  for (let page = 1; page < pageNumber ; page++) {
    var url = "https://www.cloudskillsboost.google/catalog?keywords=&locale=&page=" + page + "&skill-badge%5B%5D=skill-badge";
    var response = UrlFetchApp.fetch(url);
    var htmlREs = response.getContentText();
    const $ = Cheerio.load(htmlREs);
    const bagesEarn = $('h3.ql-title-large.catalog-item__title.js-catalog-item-title').map(function(){
      return $(this).text().trim();
    }).get();

  
    if (bagesEarn.length > 0) {
        allSkillbages = allSkillbages.concat(bagesEarn);
      }
      
      var values = allSkillbages.map(function(skillBages){
        return [skillBages];
      })

      sheet.getRange(2,1,values.length,1).setValues(values)

  }
}






function myFunction() {
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const demoSheet = ss.getActiveSheet();
  const demoSheetValues = demoSheet.getDataRange().getValues();

  const badgeSheet = ss.getActiveSheet();
  const badgeSheetValues = badgeSheet.getDataRange().getValues();


  for ( let i=1 ; i < demoSheetValues.length; i++){
    var row = demoSheetValues[i];
    var url = row[5];

  if(url){
  var response = UrlFetchApp.fetch(url);
  var htmlResponse = response.getContentText()

  const $ = Cheerio.load(htmlResponse)
  const userName = $('h1.ql-display-small').text().trim(); // to check the url is correcr or not 
  demoSheet.getRange(i+1,7,1,1).setValue(userName); // set name into google sheet

  const bagesEarn = $('span.ql-title-medium.l-mts').map(function(){
    return $(this).text().trim();
  }).get();


        // Concatenate the badge names into a single string
      const badgesString = bagesEarn.join(', '); 

      // Set the concatenated string into the cell
      demoSheet.getRange(i + 1,8,1,1).setValue(badgesString);
       console.log(badgesString)



  }
}
}








