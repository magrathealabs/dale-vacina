const LOG_LINE = 14;
const LOG_COLUMN = 4;

const firstDoseLocations = {
  currentCount: {
    line: 8,
    column: 1 
  },
  totalCount: {
    line: 8,
    column: 2 
  },
  users: {
    line: 8,
    column: 3
  }
}

const secondDoseLocations = {
  currentCount: {
    line: 12,
    column: 1 
  },
  totalCount: {
    line: 12,
    column: 2 
  },
  users: {
    line: 12,
    column: 3
  }
}


function doPost(e){
  var req = null;
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Página1');
    sheet.getRange(LOG_LINE, LOG_COLUMN).setValue(JSON.stringify(e));

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

    var progressBarText = progressBars(sheet);
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
  var alreadyTookFirstDose = alreadyTookDose(sheet, user, firstDoseLocations);

  if (alreadyTookFirstDose) {
    text = 'O usuário ' + user + ' já foi vacinado com a *primeira* dose.';
  } else {
    incrementDoseCount(sheet, user, firstDoseLocations)
    text = 'O usuário ' + user + ' foi registrado com sucesso para a *primeira* dose!'
  }
  return text;
}

function secondDose(sheet, user) {
  var text;
  var alreadyTookFirstDose = alreadyTookDose(sheet, user, firstDoseLocations);
  var alreadyTookSecondDose = alreadyTookDose(sheet, user, secondDoseLocations);

  if (!alreadyTookFirstDose) {
    text = 'O usuário ' + user + ' ainda não foi vacinado com a primeira dose, não foi possível registrar a segunda.';
  } else if (alreadyTookSecondDose) {
    text = 'O usuário ' + user + ' já foi vacinado com a *segunda* dose.';
  } else {
    incrementDoseCount(sheet, user, secondDoseLocations)
    text = 'O usuário ' + user + ' foi registrado com sucesso para a *segunda* dose!'
  }
  return text;
}

function incrementDoseCount(sheet, user, locations) {
  sheet.getRange(locations.currentCount.line, locations.currentCount.column).setValue(
    sheet.getRange(locations.currentCount.line, locations.currentCount.column).getValue() + 1
  );

  sheet.getRange(locations.users.line, locations.users.column).setValue(
    sheet.getRange(locations.users.line, locations.users.column).getValue() + ', ' + user
  );
}

function alreadyTookDose(sheet, user, locations) {
  var users = sheet.getRange(locations.users.line, locations.users.column).getValue();
  return users.includes(user);
}

function progressBars(sheet) {
  var firstDoseBar = progressBar(sheet, firstDoseLocations);
  var secondDoseBar = progressBar(sheet, secondDoseLocations);

  return 'População da Magrathea Vacinada\n' + firstDoseBar + '\nPopulação da Magrathea Totalmente Vacinada\n' + secondDoseBar
}

function progressBar(sheet, locations) {
  var total = sheet.getRange(locations.totalCount.line, locations.totalCount.column).getValue();
  var current = sheet.getRange(locations.currentCount.line, locations.currentCount.column).getValue();
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
