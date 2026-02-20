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
