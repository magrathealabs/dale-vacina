function doPost(e){
  var req = null;
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Página1');
    sheet.getRange(14,4).setValue(JSON.stringify(e));

    var parameter = e.parameter;
    var command = parameter.command;
    var user = parameter.text;
    var text = null;

    if (user) {
      if (command === '/vacina1dose') {
        text = firstDose(sheet, user);
      } else if (command === '/vacina2dose') {
        text = secondDose(sheet, user);  
      }
    }

    var progressBarText = twoDosesProgressBars(sheet);
    req = text ? text + '\n\n' + progressBarText : progressBarText;
    Logger.log(req);
  } catch (error) {
    Logger.log(error);
  }

  var output = JSON.stringify({
    "text": req,
    "response_type": "in_channel",
  })
    
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}

function firstDose(sheet, user) {
  var text;
  if (alreadyTookFirstDose(sheet, user)) {
    text = 'O usuário ' + user + ' já foi vacinado com a *primeira* dose.';
  } else {
    incrementFirstDoseCount(sheet, user)
    text = 'O usuário ' + user + ' foi registrado com sucesso para a *primeira* dose!'
  }
  return text;
}

function secondDose(sheet, user) {
  var text;
  if (!alreadyTookFirstDose(sheet, user)) {
    text = 'O usuário ' + user + ' ainda não foi vacinado com a primeira dose, não foi possível registrar a segunda.';
  } else if (alreadyTookSecondDose(sheet, user)) {
    text = 'O usuário ' + user + ' já foi vacinado com a *segunda* dose.';
  } else {
    incrementSecondDoseCount(sheet, user)
    text = 'O usuário ' + user + ' foi registrado com sucesso para a *segunda* dose!'
  }
  return text;
}

function incrementFirstDoseCount(sheet, user) {
  sheet.getRange(8,1).setValue(sheet.getRange(8,1).getValue() + 1); // increment count
  sheet.getRange(8,3).setValue(sheet.getRange(8,3).getValue() + ', ' + user);  // count user
}

function alreadyTookFirstDose(sheet, user) {
  var users = sheet.getRange(8,3).getValue();
  return users.includes(user);
}

function incrementSecondDoseCount(sheet, user) {
  sheet.getRange(12,1).setValue(sheet.getRange(12,1).getValue() + 1); // increment count
  sheet.getRange(12,3).setValue(sheet.getRange(12,3).getValue() + ', ' + user);  // count user
}

function alreadyTookSecondDose(sheet, user) {
  var users = sheet.getRange(12,3).getValue();
  return users.includes(user);
}

function twoDosesProgressBars(sheet) {
  var firstDoseBar = progressBar(sheet, 8);
  var secondDoseBar = progressBar(sheet, 12);

  return 'População da Magrathea Vacinada\n' + firstDoseBar + '\nPopulação da Magrathea Totalmente Vacinada\n' + secondDoseBar
}

function progressBar(sheet, lineNum) {
  var total = sheet.getRange(lineNum,2).getValue();
  var current = sheet.getRange(lineNum,1).getValue();
  var current_percent = Math.round((current / total) * 100);
  var progress_bar = [];

	for (n = 0; n < 20; n++) {
    if (current_percent < (n+1)*5) {
    	progress_bar.push("░");
    } else {
    	progress_bar.push("▓"); 
    }    
	}

  var result = progress_bar.join('') + ' ' + current_percent + '% (' + current + '/' + total + ')';

  return result;
}
