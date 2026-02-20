const SECRET = "YOUR_SECRET"; // Replace with your shared secret

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (payload.secret !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized" })).setMimeType(
        ContentService.MimeType.JSON,
      );
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logs");
    // var sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('Logs');

    sheet.appendRow([
      new Date(), // Timestamp (server-side)
      payload.user || "", // User
      payload.type || "", // Type (breast / bottle / nappy)
      payload.side || "", // Side (left / right / both)
      payload.duration || "", // Duration (seconds)
      payload.amount_before || "", // Amount Before (ml)
      payload.amount_after || "", // Amount After (ml)
      payload.poop || "", // Poop
      payload.pee || "", // Pee
      payload.notes || "", // Notes
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message })).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
}

function doGet(e) {
  try {
    if ((e.parameter.secret || "") !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized" })).setMimeType(
        ContentService.MimeType.JSON,
      );
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logs");
    var lastRow = sheet.getLastRow();

    // Row 1 is the header — need at least 2 rows for any data
    if (lastRow < 2) {
      return ContentService.createTextOutput(JSON.stringify({ status: "ok", data: [] })).setMimeType(
        ContentService.MimeType.JSON,
      );
    }

    var limit = Math.min(Math.max(parseInt(e.parameter.limit) || 20, 1), 100);
    var numDataRows = lastRow - 1; // exclude header row
    var rowsToFetch = Math.min(limit, numDataRows);
    var startRow = lastRow - rowsToFetch + 1;
    var numCols = sheet.getLastColumn();

    // Derive column mapping from the header row for resilience against column reordering
    var headerRow = sheet.getRange(1, 1, 1, numCols).getValues()[0];
    var columnKeyMap = {
      Timestamp: "timestamp",
      User: "user",
      Type: "type",
      Side: "side",
      "Duration (seconds)": "duration",
      "Amount Before (ml)": "amountBefore",
      "Amount After (ml)": "amountAfter",
      Poop: "poop",
      Pee: "pee",
      Notes: "notes",
    };

    var dataRows = sheet.getRange(startRow, 1, rowsToFetch, numCols).getValues();

    var data = dataRows
      .map(function (row) {
        var obj = {};
        headerRow.forEach(function (header, i) {
          var key = columnKeyMap[header] || header;
          var val = row[i];
          // GAS returns Date objects for date cells — JSON.stringify handles them as ISO strings
          obj[key] = val;
        });
        return obj;
      })
      .reverse(); // newest first

    return ContentService.createTextOutput(JSON.stringify({ status: "ok", data: data })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message })).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
}
