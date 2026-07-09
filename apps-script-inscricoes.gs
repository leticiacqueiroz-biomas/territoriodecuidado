// Script de inscrições · Territórios do Cuidar
// v2: grava na planilha + envia e-mail de confirmação ao inscrito.
// Cole no Apps Script da planilha (Extensões > Apps Script) e reimplante:
// Implantar > Gerenciar implantações > lápis (editar) > Versão: Nova versão > Implantar.
// (Assim a URL /exec continua a mesma.)

var CALENDAR_LINK = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  + '&text=Territ%C3%B3rios%20do%20Cuidar'
  + '&dates=20260730T080000/20260730T160000&ctz=America/Bahia'
  + '&location=Ecovila%20Piracanga%2C%20Mara%C3%BA%20-%20BA'
  + '&details=Um%20encontro%20sobre%20o%20cuidado%3A%20vivido%2C%20praticado%20e%20aprendido.%20https%3A%2F%2Fxn--territriodecuidado-v1b.com.br%2F';

// ID da planilha de inscrições (fixo, para funcionar mesmo se o script não estiver vinculado)
var SPREADSHEET_ID = '1pePPoEs78AwBUxpDBRQyJAa_PJsvEX0LtTO-MTsNdbo';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data', 'Nome', 'Organização', 'WhatsApp', 'E-mail']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
    var p = e.parameter;
    sheet.appendRow([
      new Date(),
      p.nome || '',
      p.organizacao || '',
      p.whatsapp || '',
      p.email || ''
    ]);

    if (p.email) {
      try {
        var primeiroNome = (p.nome || '').trim().split(' ')[0];
        MailApp.sendEmail({
          to: p.email,
          subject: 'Inscrição confirmada · Territórios do Cuidar',
          name: 'Territórios do Cuidar',
          htmlBody:
            '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#22291f">'
            + '<h2 style="color:#1e3a2f">Inscrição confirmada' + (primeiroNome ? ', ' + primeiroNome : '') + '! 🌱</h2>'
            + '<p>Que alegria receber você no <strong>Territórios do Cuidar</strong>, um encontro sobre o cuidado: vivido, praticado e aprendido.</p>'
            + '<p><strong>📅 Quando:</strong> 30 de julho de 2026, quinta-feira, das 8h às 16h<br>'
            + '<strong>📍 Onde:</strong> Ecovila Piracanga, Maraú - BA</p>'
            + '<p><a href="' + CALENDAR_LINK + '" style="color:#2e5d48;font-weight:bold">Adicionar à sua agenda →</a></p>'
            + '<p>Informações: <a href="https://xn--territriodecuidado-v1b.com.br/" style="color:#2e5d48">territóriodecuidado.com.br</a><br>'
            + 'Dúvidas: responda este e-mail ou escreva para leticia@biomas.ai</p>'
            + '<p style="color:#7ba88f;font-style:italic">O cuidado transforma espaços em lugares, e lugares em lares.</p>'
            + '<p style="font-size:12px;color:#999">Realização: Biomas Brasil · Instituto Somos Água</p>'
            + '</div>',
          replyTo: 'leticia@biomas.ai'
        });
      } catch (mailErr) {
        // registro segue válido mesmo se o e-mail falhar
      }
    }

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('erro: ' + err.message);
  }
}

// Para testar sem o site: selecione "testeManual" na barra do editor e clique em Executar.
// Deve aparecer uma linha "Teste manual" na planilha.
function testeManual() {
  var resultado = doPost({ parameter: {
    nome: 'Teste manual',
    organizacao: 'Apps Script',
    whatsapp: '(00) 0 0000-0000',
    email: ''
  }});
  Logger.log(resultado.getContent());
}
