"""Excelを変更せず、18列の原文・数値をJavaScriptへ変換する（Python標準ライブラリのみ）。"""
import argparse
import collections
import hashlib
import json
import posixpath
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
HEADERS = ['番号', '人物', 'レアリティ', 'タイプ・得意分野', '能力の方向性', 'コスト', '攻撃力', '防御力', '兵力', 'スキル名', 'スキル内容', '特性名', '特性内容', '二つ名', '決め台詞（創作）', '画像制作状況', '設定状況', '備考']
KEYS = ['id', 'name', 'rarity', 'type', 'direction', 'cost', 'attack', 'defense', 'troop', 'skillName', 'skillText', 'traitName', 'traitText', 'title', 'quote', 'imageStatus', 'settingStatus', 'notes']

def read_cards(path):
    with zipfile.ZipFile(path) as z:
        wb = ET.fromstring(z.read('xl/workbook.xml'))
        sheets = wb.findall('s:sheets/s:sheet', NS)
        sheet = next((s for s in sheets if s.attrib['name'] == '108枚統合管理表'), None)
        if sheet is None:
            raise ValueError('対象シート「108枚統合管理表」がありません')
        rid = sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
        rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        target = next(r.attrib['Target'] for r in rels if r.attrib['Id'] == rid)
        target = target.lstrip('/') if target.startswith('/') else posixpath.normpath('xl/' + target)
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(t.text or '' for t in n.findall('.//s:t', NS)) for n in ET.fromstring(z.read('xl/sharedStrings.xml'))]
        rows = {}
        for row in ET.fromstring(z.read(target)).findall('s:sheetData/s:row', NS):
            number = int(row.attrib['r'])
            values = [None] * 18
            for cell in row.findall('s:c', NS):
                letters = re.match(r'[A-Z]+', cell.attrib['r'])[0]
                col = 0
                for ch in letters:
                    col = col * 26 + ord(ch) - 64
                if col > 18:
                    continue
                if number >= 5 and cell.find('s:f', NS) is not None:
                    raise ValueError(f'{cell.attrib["r"]}: 数式は原本で確定値にしてください')
                t = cell.attrib.get('t', 'n')
                v = cell.find('s:v', NS)
                if t == 'inlineStr':
                    value = ''.join(n.text or '' for n in cell.findall('.//s:t', NS))
                elif v is None:
                    value = None
                elif t == 's':
                    value = strings[int(v.text)]
                elif t == 'n':
                    value = float(v.text)
                    value = int(value) if value.is_integer() else value
                else:
                    value = v.text
                values[col - 1] = value
            rows[number] = values
    if rows.get(5) != HEADERS:
        raise ValueError('5行目の18列見出しが仕様と一致しません')
    source = [(n, v) for n, v in sorted(rows.items()) if n > 5 and any(x is not None for x in v)]
    cards = [dict(zip(KEYS, values), sourceRow=n) for n, values in source]
    errors = []
    if len(cards) != 108:
        errors.append(f'全カード数が108ではありません: {len(cards)}')
    counts = dict(collections.Counter(c['rarity'] for c in cards))
    if counts != {'UR': 9, 'SSR': 27, 'SR': 27, 'R': 45}:
        errors.append(f'レアリティ内訳が不正: {counts}')
    if len({c['id'] for c in cards}) != len(cards):
        errors.append('IDが重複しています')
    for c in cards:
        for key in KEYS[:15]:
            if c[key] is None or c[key] == '':
                errors.append(f'{c["sourceRow"]}行 {key}: 欠落しています')
        for key in ['cost', 'attack', 'defense', 'troop']:
            if not isinstance(c[key], int) or c[key] < 0:
                errors.append(f'{c["sourceRow"]}行 {key}: 0以上の整数ではありません')
        if not isinstance(c['id'], str) or not re.fullmatch(r'(UR|SSR|SR|R)\d{2}', c['id']) or not c['id'].startswith(c['rarity']):
            errors.append(f'{c["sourceRow"]}行: IDとレアリティが不正です')
    if errors:
        raise ValueError('\n'.join(errors))
    return cards, {'file': Path(path).name, 'sha256': hashlib.sha256(Path(path).read_bytes()).hexdigest(), 'sheet': '108枚統合管理表', 'headerRow': 5, 'count': len(cards), 'rarities': counts, 'columns': HEADERS}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('xlsx', type=Path)
    parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'cards-data.js')
    args = parser.parse_args()
    try:
        cards, source = read_cards(args.xlsx)
        content = '// Excel原文から自動生成。直接編集しないでください。\n'
        content += 'globalThis.CARD_SOURCE = ' + json.dumps(source, ensure_ascii=False, indent=2) + ';\n'
        content += 'globalThis.CARD_DATA = ' + json.dumps(cards, ensure_ascii=False, indent=2) + ';\n'
        args.output.parent.mkdir(parents=True, exist_ok=True)
        temp = args.output.with_suffix('.tmp')
        temp.write_text(content, encoding='utf-8')
        temp.replace(args.output)
        print(json.dumps(source, ensure_ascii=False, indent=2))
    except Exception as exc:
        print(f'変換エラー: {exc}', file=sys.stderr)
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
