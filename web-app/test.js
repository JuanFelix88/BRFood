(async () => {
  const response = await fetch("http://nitrogenio/index.php?menu=control_panel&rawmode=yes&clientstatehash=40cd750bba9870f18aada2478b24840a&action=pbxStatus&serverevents=true", {
    "headers": {
      "accept": "text/event-stream",
      "accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\", \"Microsoft Edge WebView2\";v=\"124\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "cookie": "lang=pt_BR; issabelSession=o7g0sa7c1aqb85rm7tcfmruhk6",
      "Referer": "https://nitrogenio/index.php?menu=control_panel",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  });

  console.log(await response.text())
})();
