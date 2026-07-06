function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var fileData = e.parameter.fileData; // Base64 string
    var fileName = e.parameter.fileName;
    var fileUrl = "No file uploaded";

    // Handle File Upload to Google Drive if present
    if (fileData && fileName) {
      var folder = DriveApp.getRootFolder(); // Or find a specific folder by ID
      var contentType = fileData.substring(5, fileData.indexOf(';base64'));
      var bytes = Utilities.base64Decode(fileData.substr(fileData.indexOf('base64,') + 7));
      var blob = Utilities.newBlob(bytes, contentType, fileName);
      var file = folder.createFile(blob);
      fileUrl = file.getUrl();
    }

    // Append data rows matching your form fields
    sheet.appendRow([
      new Date(),
      e.parameter.orgName,
      e.parameter.contactPerson,
      e.parameter.contactEmail,
      e.parameter.contactPhone,
      e.parameter.oppType,
      e.parameter.description,
      fileUrl,
      e.parameter.appLink,
      e.parameter.notes
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}