"""原本は読み取り専用。破損ケースは一時ディレクトリのコピーに作成する。"""
import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
from xlsx_to_cards import read_cards, NS

SOURCE = Path(sys.argv.pop(1)) if len(sys.argv) > 1 else None

class ConversionTests(unittest.TestCase):
    def test_exact_generated_data(self):
        cards, meta = read_cards(SOURCE)
        generated = (Path(__file__).resolve().parents[1] / 'cards-data.js').read_text(encoding='utf-8')
        data = json.loads(generated.split('globalThis.CARD_DATA = ', 1)[1].strip().removesuffix(';'))
        self.assertEqual(cards, data)
        self.assertEqual(meta['count'], 108)

    def invalid(self, change, pattern):
        with tempfile.TemporaryDirectory() as folder:
            copy = Path(folder) / 'test.xlsx'
            with zipfile.ZipFile(SOURCE) as source, zipfile.ZipFile(copy, 'w') as output:
                for entry in source.infolist():
                    data = source.read(entry.filename)
                    if entry.filename == 'xl/worksheets/sheet1.xml':
                        sheet = ET.fromstring(data)
                        change(sheet)
                        data = ET.tostring(sheet, encoding='utf-8', xml_declaration=True)
                    output.writestr(entry, data)
            with self.assertRaisesRegex(ValueError, pattern):
                read_cards(copy)

    def test_missing_cost(self):
        def change(s):
            row=s.find('s:sheetData/s:row[@r="6"]', NS)
            row.remove(row.find('s:c[@r="F6"]', NS))
        self.invalid(change, 'cost: 欠落')

    def test_duplicate_id(self):
        def change(s):
            first=s.find('.//s:c[@r="A6"]', NS)
            second=s.find('.//s:c[@r="A7"]', NS)
            for ch in list(second): second.remove(ch)
            second.attrib['t']=first.attrib['t']
            for ch in first: second.append(ET.fromstring(ET.tostring(ch)))
        self.invalid(change, 'IDが重複')

    def test_missing_card(self):
        def change(s):
            rows=s.find('s:sheetData', NS)
            rows.remove(rows.find('s:row[@r="113"]', NS))
        self.invalid(change, '全カード数が108ではありません')

    def test_formula_rejected(self):
        def change(s):
            cell=s.find('.//s:c[@r="F6"]', NS)
            ET.SubElement(cell, '{'+NS['s']+'}f').text='1+9'
        self.invalid(change, '数式は原本で確定値')

if __name__ == '__main__':
    if SOURCE is None:
        raise SystemExit('使い方: python tests/converter.test.py 正本.xlsx')
    unittest.main()
