var assert = require('assert');
var parseFullName = require('../').parseFullName;
var error;

var verifyName = function (nameToCheck, partsToCheck) {
  assert.strictEqual(nameToCheck.title, partsToCheck[0]);
  assert.strictEqual(nameToCheck.first, partsToCheck[1]);
  assert.strictEqual(nameToCheck.middle, partsToCheck[2]);
  assert.strictEqual(nameToCheck.last, partsToCheck[3]);
  assert.strictEqual(nameToCheck.nick, partsToCheck[4]);
  assert.strictEqual(nameToCheck.suffix, partsToCheck[5]);
  assert.strictEqual(nameToCheck.error.length, partsToCheck[6].length);
  for (var i = 1, l = partsToCheck[6].length; i < l; i++) {
    assert.strictEqual(nameToCheck.error[i], partsToCheck[6][i]);
  }
};



describe('parse-full-name', function () {
  describe('parseFullName', function () {
    it('parses first names', function () {
      verifyName(parseFullName('David Davis'),
        ['', 'David', '', 'Davis', '', '', []]);
      verifyName(parseFullName('Davis, David'),
        ['', 'David', '', 'Davis', '', '', []]);
    });
    it('parses last names', function () {
      verifyName(parseFullName('Gerald Böck'),
        ['', 'Gerald', '', 'Böck', '', '', []]);
      verifyName(parseFullName('Böck, Gerald'),
        ['', 'Gerald', '', 'Böck', '', '', []]);
    });
    it('parses middle names', function () {
      verifyName(parseFullName('David William Davis'),
        ['', 'David', 'William', 'Davis', '', '', []]);
      verifyName(parseFullName('Davis, David William'),
        ['', 'David', 'William', 'Davis', '', '', []]);
    });
    it('parses last names including known prefixes', function () {
      verifyName(parseFullName('Vincent Van Gogh'),
        ['', 'Vincent', '', 'Van Gogh', '', '', []]);
      verifyName(parseFullName('Van Gogh, Vincent'),
        ['', 'Vincent', '', 'Van Gogh', '', '', []]);
      verifyName(parseFullName('Lorenzo de Médici'),
        ['', 'Lorenzo', '', 'de Médici', '', '', []]);
      verifyName(parseFullName('de Médici, Lorenzo'),
        ['', 'Lorenzo', '', 'de Médici', '', '', []]);
      verifyName(parseFullName('Jüan de la Véña'),
        ['', 'Jüan', '', 'de la Véña', '', '', []]);
      verifyName(parseFullName('de la Véña, Jüan'),
        ['', 'Jüan', '', 'de la Véña', '', '', []]);
    });
    it('parses compound last names', function () {
      verifyName(parseFullName('Jüan Martinez de Lorenzo y Gutierez'),
        ['', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', '', '', []]);
      verifyName(parseFullName('de Lorenzo y Gutierez, Jüan Martinez'),
        ['', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', '', '', []]);
    });
    it('parses nicknames', function () {
      verifyName(parseFullName('Orenthal James "O. J." Simpson'),
        ['', 'Orenthal', 'James', 'Simpson', 'O. J.', '', []]);
      verifyName(parseFullName("Orenthal 'O. J.' James Simpson"),
        ['', 'Orenthal', 'James', 'Simpson', 'O. J.', '', []]);
      verifyName(parseFullName('(O. J.) Orenthal James Simpson'),
        ['', 'Orenthal', 'James', 'Simpson', 'O. J.', '', []]);
      verifyName(parseFullName('Simpson, Orenthal James “O. J.”'),
        ['', 'Orenthal', 'James', 'Simpson', 'O. J.', '', []]);
      verifyName(parseFullName("Simpson, Orenthal ‘O. J.’ James"),
        ['', 'Orenthal', 'James', 'Simpson', 'O. J.', '', []]);
      verifyName(parseFullName('Simpson, [O. J.] Orenthal James'),
        ['', 'Orenthal', 'James', 'Simpson', 'O. J.', '', []]);
      verifyName(parseFullName('Strippoli, Charles J (HM Home and Community Svcs LLC)'),
        ['', 'Charles', 'J', 'Strippoli', 'HM Home and Community Svcs LLC', '', []]);

    });
    it('parses known suffixes', function () {
      verifyName(parseFullName('Sammy Davis, Jr.'),
        ['', 'Sammy', '', 'Davis', '', 'Jr.', []]);
      verifyName(parseFullName('Davis, Sammy, Jr.'),
        ['', 'Sammy', '', 'Davis', '', 'Jr.', []]);
      verifyName(parseFullName('Dr. Dr.med.dent. Hans Zimmer'),
        ['Dr.', 'Hans', '', 'Zimmer', '', 'Dr.med.dent.', []]);
      verifyName(parseFullName('dipl.-ing. Hans Zimmer', 'all', 1),
        ['', 'Hans', '', 'Zimmer', '', 'Dipl.-Ing.', []]);
    });
    it('parses unknown suffixes', function () {
      verifyName(parseFullName('John P. Doe-Ray, Jr., LUTC'),
        ['', 'John', 'P.', 'Doe-Ray', '', 'Jr., LUTC', []]);
      verifyName(parseFullName('Doe-Ray, John P., Jr., LUTC'),
        ['', 'John', 'P.', 'Doe-Ray', '', 'Jr., LUTC', []]);
    });
    it('parses titles', function () {
      verifyName(parseFullName('Dr. John P. Doe-Ray, Jr.'),
        ['Dr.', 'John', 'P.', 'Doe-Ray', '', 'Jr.', []]);
      verifyName(parseFullName('Dr. Doe-Ray, John P., Jr.'),
        ['Dr.', 'John', 'P.', 'Doe-Ray', '', 'Jr.', []]);
      verifyName(parseFullName('Doe-Ray, Dr. John P., Jr.'),
        ['Dr.', 'John', 'P.', 'Doe-Ray', '', 'Jr.', []]);
    });

    it('parses title & suffix mixes', function () {
      verifyName(parseFullName('Frau Dr. Sophie Wagner'),
        ['Frau', 'Sophie', '', 'Wagner', '', 'Dr.', []]);
      verifyName(parseFullName('Mr. Prof. John Doe'),
        ['Mr.', 'John', '', 'Doe', '', 'Prof.', []]);
      verifyName(parseFullName('Dr. Prof. John Doe'),
        ['Dr.', 'John', '', 'Doe', '', 'Prof.', []]);
      verifyName(parseFullName('Doctor Professor John Doe'),
        ['Doctor', 'John', '', 'Doe', '', 'Professor', []]);
      verifyName(parseFullName('Dr. Prof. John Albert Doe'),
        ['Dr.', 'John', 'Albert', 'Doe', '', 'Prof.', []]);
      verifyName(parseFullName('Dr. Dr. John Albert Doe'),
        ['Dr.', 'John', 'Albert', 'Doe', '', 'Dr.', []]);
    });
    it('parses name parts in many different orders', function () {
      verifyName(parseFullName(
        'Mr. Jüan Martinez (Martin) de Lorenzo y Gutierez Jr.'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'de Lorenzo y Gutierez, Mr. Jüan Martinez (Martin) Jr.'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'de Lorenzo y Gutierez, Mr. Jüan (Martin) Martinez Jr.'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'Mr. de Lorenzo y Gutierez, Jüan Martinez (Martin) Jr.'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'Mr. de Lorenzo y Gutierez, Jüan (Martin) Martinez Jr.'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'Mr. de Lorenzo y Gutierez Jr., Jüan Martinez (Martin)'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'Mr. de Lorenzo y Gutierez Jr., Jüan (Martin) Martinez'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'Mr. de Lorenzo y Gutierez, Jr. Jüan Martinez (Martin)'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'Mr. de Lorenzo y Gutierez, Jr. Jüan (Martin) Martinez'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
    });
    it('automatically fixes all upper and all lowercase names', function () {
      verifyName(parseFullName(
        'MR. JÜAN MARTINEZ (MARTIN) DE LORENZO Y GUTIEREZ JR.'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'mr. jüan martinez (martin) de lorenzo y gutierez jr.'),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
    });
    it('manually fixes case, or not, when specified', function () {
      verifyName(parseFullName(
        'Mr. JÜAN MARTINEZ (MARTIN) DE LORENZO Y GUTIEREZ Jr.'),
        ['Mr.', 'JÜAN', 'MARTINEZ', 'DE LORENZO Y GUTIEREZ', 'MARTIN', 'Jr.', []]);
      verifyName(parseFullName(
        'Mr. JÜAN MARTINEZ (MARTIN) DE LORENZO Y GUTIEREZ JR.', 'all', 1),
        ['Mr.', 'Jüan', 'Martinez', 'de Lorenzo y Gutierez', 'Martin', 'Jr.', []]);
      verifyName(parseFullName(
        'Dr. b.a. Julia Storm', 'all', 1),
        ['Dr.', 'Julia', '', 'Storm', '', 'B.A.', []]);
      verifyName(parseFullName(
        'mr. jüan martinez (martin) de lorenzo y gutierez jr.', 'all', 0),
        ['mr.', 'jüan', 'martinez', 'de lorenzo y gutierez', 'martin', 'jr.', []]);
    });
    it('handles leading or trailing whitespace', function () {
      verifyName(parseFullName('Ezekiel Johnson '),
        ['', 'Ezekiel', '', 'Johnson', '', '', []]);
      verifyName(parseFullName('  Ezekiel Johnson'),
        ['', 'Ezekiel', '', 'Johnson', '', '', []]);
    });
    it('returns a single part, when specified', function () {
      assert.strictEqual(parseFullName(
        'Mr. Jüan Martinez (Martin) de Lorenzo y Gutierez Jr.',
        'title'), 'Mr.');
      assert.strictEqual(parseFullName(
        'Mr. Jüan Martinez (Martin) de Lorenzo y Gutierez Jr.',
        'first'), 'Jüan');
      assert.strictEqual(parseFullName(
        'Mr. Jüan Martinez (Martin) de Lorenzo y Gutierez Jr.',
        'middle'), 'Martinez');
      assert.strictEqual(parseFullName(
        'Mr. Jüan Martinez (Martin) de Lorenzo y Gutierez Jr.',
        'last'), 'de Lorenzo y Gutierez');
      assert.strictEqual(parseFullName(
        'Mr. Jüan Martinez (Martin) de Lorenzo y Gutierez Jr.',
        'nick'), 'Martin');
      assert.strictEqual(parseFullName(
        'Mr. Jüan Martinez (Martin) de Lorenzo y Gutierez Jr.',
        'suffix'), 'Jr.');
    });
    it('continues processing, even when fed garbage input', function () {
      verifyName(parseFullName('as;dfkj ;aerha;sfa ef;oia;woeig hz;sofi hz;oifj;zoseifj zs;eofij z;soeif jzs;oefi jz;osif z;osefij zs;oif jz;soefihz;sodifh z;sofu hzsieufh zlsiudfh zksefiulzseofih ;zosufh ;oseihgfz;osef h:OSfih lziusefhaowieufyg oaweifugy'),
        ['', 'as;dfkj',
          ';aerha;sfa ef;oia;woeig hz;sofi hz;oifj;zoseifj zs;eofij z;soeif jzs;oefi jz;osif z;osefij zs;oif jz;soefihz;sodifh z;sofu hzsieufh zlsiudfh zksefiulzseofih ;zosufh ;oseihgfz;osef h:OSfih lziusefhaowieufyg',
          'oaweifugy', '', '', ['Error: 22 middle names']]);
    });
    it('returns warnings for null/undefined names', function () {
      verifyName(parseFullName(null), ['', '', '', '', '', '', ['Error: No input']]);
      verifyName(parseFullName(), ['', '', '', '', '', '', ['Error: No input']]);
    });
    it('will throw errors, when specified', function () {
      assert.doesNotThrow(function () { return parseFullName(''); });
      assert.throws(function () { return parseFullName('', 'all', -1, 1); });
    });
  });
});
