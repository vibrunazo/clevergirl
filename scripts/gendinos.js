// This script will look into a decompiled game APK at
const apkdir = "C:/vib/dev/apktool/jwa1316/assets/Database/Assets/Data/CreaturesAttributesData/";
// and upload the creature stats to the spreadsheet in the OUT tab

const fs = require('fs');
const readline = require('readline');
const {
  google
} = require('googleapis');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = './scripts/credentials.json';

// Load client secrets from a local file.
fs.readFile('./scripts/client_secret.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), generateJSON);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function generateJSON(auth) {
  const sheets = google.sheets({
    version: 'v4',
    auth
  });
  const sheetid = '1kAvrE-Lo-foNSmKv2Gn_tdL_VivQ1yqek7p2NUO-vsc';
  const readrange = 'stats!A1:M';
  sheets.spreadsheets.values.get({
    spreadsheetId: sheetid,
    // range: 'Class Data!A2:E',
    range: readrange,
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);



    const rows = res.data.values;
    const params = rows[0];
    const newjson = [];
    rows.shift();
    if (rows.length) {
      rows.forEach((row, rownumber) => { // each dino
        const newdino = {};
        params.forEach((param, i) => { // each param of that dino
          newdino[param] = row[i];

          if (param == "filename") {
            let filename = newdino["filename"]
            // console.log("filename: " + filename);
            openDinoFile(filename, newdino["name"], rownumber);

          }
        });
        newjson.push(newdino);
      });

      // console.log(newjson);
      setTimeout(function () {
        updatesheet(sheets, sheetid);
        console.log('timeout over')
      }, 2000)

      // const path = './dist/dinos.json';
      const path = './src/app/dino-table/dinostats.ts';

      var json = JSON.stringify(newjson);
      var filetext = "export const DINOS: any[] = " + json;
      // fs.writeFile(path, filetext, 'utf8', () => console.log('created json'));

    } else {
      console.log('No data found.');
    }
  });
}

const outputrows = [];
outputrows.push(["dinoname", "hp", "armor", "damage", "crit", "speed", "filename"]);

function openDinoFile(filename, dinoname, rownumber) {
  if (!filename || filename.length == 0) {
    console.log("error: filename undefined");
    return;
  }
  let fullfilename = "";
  fullfilename = filename + "CreatureAttributes.json";


  // const filename = "AllosauruCreatureAttributes.json";
  // puts one new entry in the array with my name
  // so the read file call back can later look this up and replace it with the full data row in this same spot
  // this is done so that all rows end up in the original order, because the async callback can return at any arbitrary order
  outputrows.push([]);
  // console.log(outputrows);

  fs.readFile(apkdir + fullfilename, 'utf8', (e, data) => fileOpened(e, data, filename, dinoname, rownumber));

}



function fileOpened(e, d, filename, dinoname, rownumber) {
  if (e) {
    console.log("failed opening file for " + filename + " " + dinoname);
    console.log(e);
    return;
  }
  j = JSON.parse(d);
  hp = j.hp;
  damage = j.miap;
  speed = j.s;
  crit = j.chc / 100000;
  armor = j.def / 100000;

  // console.log("file opened for " + filename + " " + dinoname);
  // console.log("hp: " + hp);
  // console.log("armor: " + armor);
  // console.log("attack: " + attack);
  // console.log("crit: " + crit);
  // console.log("speed: " + speed);
  row = [dinoname, hp, armor, damage, crit, speed, filename]
  // outputrows[0] = row;
  // rownumber = outputrows.indexOf(r => r[0] == filename);
  outputrows[rownumber+1] = row;
  // outputrows.push(row);
  // console.log(outputrows);

}

function updatesheet(sheets, sheetid) {
  writerange = 'out!A1:G';
  var body = {
    values: outputrows
  };

  sheets.spreadsheets.values.update({
    spreadsheetId: sheetid,
    range: writerange,
    valueInputOption: "RAW",
    resource: body
  }).then((response) => {
    var result = response.result;
    // console.log(`${result.updatedCells} cells updated.`);
    console.log("sucess writing sheet");
    console.log(result);
    console.log(body);

  }).catch((e) => {
    console.log("error writing sheet");
    console.log(e);

  });
}


