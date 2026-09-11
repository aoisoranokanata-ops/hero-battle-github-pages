# 108枚の能力分類

Excelの原文と別の対応表です。スキル・特性それぞれの原文はautomation-data.jsに保存し、実行時も照合します。

AUTO：完全自動、SELECT：対象選択、MANUAL：裁定が必要。カード分類はMANUAL、SELECT、AUTOの順に優先します。entry＝登場、turnStart＝自分ターン開始、passive＝継続、kill＝撃破、battleKill＝戦闘撃破、survived＝戦闘生存、beforeDeath＝兵力0になる時、afterAttack＝攻撃後、combat＝手動の戦闘裁定。

| ID | 人物 | カード分類 | スキル分類 / 発動条件 | 特性分類 / 発動条件 | 手動の理由 |
| --- | --- | --- | --- | --- | --- |
| UR01 | ゼウス | SELECT | SELECT / entry | AUTO / turnStart |  |
| UR02 | オーディン | SELECT | SELECT / entry | AUTO / passive |  |
| UR03 | 天照大神 | AUTO | AUTO / entry | AUTO / turnStart |  |
| UR04 | ルーナ | AUTO | AUTO / entry | AUTO / passive |  |
| UR05 | ガネーシャ | SELECT | SELECT / entry | AUTO / passive |  |
| UR06 | スサノオ | MANUAL | MANUAL / entry | AUTO / entry | 「次の自分のターンまで」の終了時点を裁定してください。 |
| UR07 | ラー | AUTO | AUTO / entry | AUTO / passive |  |
| UR08 | アテナ | SELECT | SELECT / entry | AUTO / passive |  |
| UR09 | アポロン | AUTO | AUTO / entry | AUTO / passive |  |
| SSR01 | 織田信長 | SELECT | SELECT / entry | AUTO / entry |  |
| SSR02 | 豊臣秀吉 | AUTO | AUTO / entry | AUTO / passive |  |
| SSR03 | 徳川家康 | AUTO | AUTO / entry | AUTO / passive |  |
| SSR04 | 真田幸村 | AUTO | AUTO / passive | AUTO / passive |  |
| SSR05 | 源義経 | MANUAL | MANUAL / entry | AUTO / passive | 先に攻撃する効果と基本の攻撃手順の関係を裁定してください。 |
| SSR06 | 武田信玄 | MANUAL | MANUAL / entry | AUTO / passive | 再攻撃の回数とタイミングを裁定してください。登場ターンの補正も手動です。 |
| SSR07 | 上杉謙信 | SELECT | SELECT / entry | AUTO / passive |  |
| SSR08 | 坂本龍馬 | AUTO | AUTO / entry | AUTO / passive |  |
| SSR09 | 卑弥呼 | SELECT | SELECT / entry | AUTO / passive |  |
| SSR10 | ジャンヌ・ダルク | AUTO | AUTO / entry | AUTO / passive |  |
| SSR11 | ナポレオン | AUTO | AUTO / entry | AUTO / passive |  |
| SSR12 | アレクサンドロス大王 | AUTO | AUTO / kill | AUTO / kill |  |
| SSR13 | ジュリアス・シーザー | AUTO | AUTO / entry | AUTO / passive |  |
| SSR14 | ハンニバル | AUTO | AUTO / entry | AUTO / passive |  |
| SSR15 | チンギス・ハン | AUTO | AUTO / entry | AUTO / passive |  |
| SSR16 | レオニダス | AUTO | AUTO / passive | AUTO / passive |  |
| SSR17 | リチャード獅子心王 | SELECT | SELECT / entry | AUTO / passive |  |
| SSR18 | 始皇帝 | AUTO | AUTO / entry | AUTO / passive |  |
| SSR19 | 空海 | SELECT | SELECT / entry | AUTO / passive |  |
| SSR20 | 聖徳太子 | SELECT | SELECT / entry | AUTO / passive |  |
| SSR21 | 孔子 | SELECT | SELECT / entry | AUTO / passive |  |
| SSR22 | 諸葛孔明 | SELECT | SELECT / entry | AUTO / passive |  |
| SSR23 | レオナルド・ダ・ヴィンチ | SELECT | SELECT / entry | AUTO / passive |  |
| SSR24 | ニュートン | SELECT | SELECT / entry | AUTO / passive |  |
| SSR25 | アインシュタイン | AUTO | AUTO / entry | AUTO / passive |  |
| SSR26 | ガリレオ・ガリレイ | SELECT | SELECT / entry | AUTO / passive |  |
| SSR27 | ソクラテス | MANUAL | MANUAL / entry | AUTO / passive | 「次の自分のターンまで」の無効期間を裁定してください。全体防御補正も含め手動処理します。 |
| SR01 | 伊達政宗 | AUTO | AUTO / entry | AUTO / passive |  |
| SR02 | 明智光秀 | SELECT | SELECT / entry | AUTO / passive |  |
| SR03 | 石田三成 | AUTO | AUTO / passive | AUTO / passive |  |
| SR04 | 本多忠勝 | AUTO | AUTO / beforeDeath | AUTO / passive |  |
| SR05 | 宮本武蔵 | SELECT | SELECT / entry | AUTO / passive |  |
| SR06 | 平清盛 | AUTO | AUTO / entry | AUTO / passive |  |
| SR07 | 北条政子 | SELECT | AUTO / entry | SELECT / entry |  |
| SR08 | 西郷隆盛 | AUTO | AUTO / entry | AUTO / passive |  |
| SR09 | 紫式部 | SELECT | SELECT / entry | AUTO / passive |  |
| SR10 | クレオパトラ | MANUAL | SELECT / entry | MANUAL / combat | 攻撃力が下がっている敵との戦闘中だけの防御補正を手動で適用・解除してください。 |
| SR11 | スパルタクス | AUTO | AUTO / passive | AUTO / survived |  |
| SR12 | サラディン | SELECT | SELECT / afterAttack | AUTO / passive |  |
| SR13 | ウィリアム1世 | AUTO | AUTO / battleKill | AUTO / passive |  |
| SR14 | エリザベス1世 | AUTO | AUTO / entry | AUTO / passive |  |
| SR15 | ルイ14世 | AUTO | AUTO / passive | AUTO / passive |  |
| SR16 | ピョートル大帝 | SELECT | SELECT / entry | SELECT / turnStart |  |
| SR17 | 孫子 | MANUAL | MANUAL / entry | AUTO / passive | 手札をランダムに見る処理と「次のターンまで」の期限は裁定が必要です。 |
| SR18 | 岳飛 | MANUAL | MANUAL / combat | MANUAL / combat | かばう対象・戦闘中の補正は手動裁定です。 かばった戦闘中だけ防御力＋2を手動で適用・解除してください。 |
| SR19 | マルコ・ポーロ | SELECT | SELECT / entry | AUTO / passive |  |
| SR20 | コロンブス | SELECT | SELECT / entry | AUTO / passive |  |
| SR21 | マゼラン | SELECT | SELECT / entry | SELECT / turnStart |  |
| SR22 | エジソン | SELECT | SELECT / entry | SELECT / turnStart |  |
| SR23 | ファラデー | AUTO | AUTO / entry | AUTO / turnStart |  |
| SR24 | パスカル | AUTO | AUTO / entry | AUTO / passive |  |
| SR25 | ベートーヴェン | AUTO | AUTO / entry | AUTO / passive |  |
| SR26 | モーツァルト | SELECT | SELECT / entry | SELECT / turnStart |  |
| SR27 | シェイクスピア | SELECT | SELECT / entry | AUTO / passive |  |
| R01 | 聖武天皇 | SELECT | SELECT / entry | SELECT / entry |  |
| R02 | 桓武天皇 | SELECT | SELECT / entry | AUTO / passive |  |
| R03 | 藤原道長 | AUTO | AUTO / entry | AUTO / passive |  |
| R04 | 菅原道真 | AUTO | AUTO / entry | AUTO / passive |  |
| R05 | 源頼朝 | SELECT | SELECT / entry | AUTO / passive |  |
| R06 | 足利尊氏 | AUTO | AUTO / entry | AUTO / passive |  |
| R07 | 足利義満 | AUTO | AUTO / entry | AUTO / entry |  |
| R08 | 北条早雲 | AUTO | AUTO / passive | AUTO / passive |  |
| R09 | 毛利元就 | SELECT | SELECT / entry | AUTO / passive |  |
| R10 | 長宗我部元親 | SELECT | SELECT / entry | AUTO / passive |  |
| R11 | 島津義弘 | AUTO | AUTO / entry | AUTO / passive |  |
| R12 | 井伊直虎 | SELECT | SELECT / entry | AUTO / passive |  |
| R13 | 大久保利通 | SELECT | SELECT / entry | AUTO / passive |  |
| R14 | 伊藤博文 | SELECT | AUTO / entry | SELECT / entry |  |
| R15 | 福沢諭吉 | AUTO | AUTO / entry | AUTO / passive |  |
| R16 | ペリクレス | SELECT | SELECT / entry | AUTO / passive |  |
| R17 | アウグストゥス | SELECT | SELECT / entry | AUTO / passive |  |
| R18 | コンスタンティヌス1世 | AUTO | AUTO / entry | AUTO / passive |  |
| R19 | カール大帝 | SELECT | SELECT / entry | AUTO / passive |  |
| R20 | ウィリアム・ウォレス | AUTO | AUTO / passive | AUTO / survived |  |
| R21 | フリードリヒ2世 | SELECT | SELECT / entry | AUTO / passive |  |
| R22 | マリア・テレジア | SELECT | SELECT / entry | AUTO / passive |  |
| R23 | ワシントン | SELECT | SELECT / entry | AUTO / passive |  |
| R24 | リンカーン | SELECT | SELECT / entry | SELECT / entry |  |
| R25 | ガリバルディ | AUTO | AUTO / entry | AUTO / passive |  |
| R26 | 孫文 | SELECT | SELECT / entry | AUTO / passive |  |
| R27 | 劉邦 | SELECT | SELECT / entry | AUTO / passive |  |
| R28 | 項羽 | AUTO | AUTO / entry | AUTO / passive |  |
| R29 | 曹操 | SELECT | SELECT / entry | AUTO / passive |  |
| R30 | 劉備 | SELECT | SELECT / entry | AUTO / passive |  |
| R31 | 関羽 | AUTO | AUTO / entry | AUTO / passive |  |
| R32 | 張飛 | AUTO | AUTO / entry | AUTO / passive |  |
| R33 | 司馬遷 | SELECT | SELECT / entry | AUTO / passive |  |
| R34 | 玄奘 | SELECT | SELECT / entry | AUTO / passive |  |
| R35 | 鄭和 | SELECT | SELECT / entry | AUTO / passive |  |
| R36 | アルキメデス | SELECT | SELECT / entry | AUTO / passive |  |
| R37 | ヒポクラテス | SELECT | SELECT / entry | SELECT / entry |  |
| R38 | ミケランジェロ | SELECT | SELECT / entry | AUTO / passive |  |
| R39 | ラファエロ | SELECT | SELECT / entry | SELECT / entry |  |
| R40 | グーテンベルク | AUTO | AUTO / entry | AUTO / passive |  |
| R41 | ジェームズ・ワット | AUTO | AUTO / entry | AUTO / passive |  |
| R42 | ライト兄弟 | MANUAL | MANUAL / entry | AUTO / passive | 「相手より先に攻撃する」と基本ルールとの関係を裁定してください。 |
| R43 | ナイチンゲール | SELECT | SELECT / entry | SELECT / entry |  |
| R44 | マリー・キュリー | AUTO | AUTO / entry | AUTO / passive |  |
| R45 | 野口英世 | SELECT | SELECT / entry | SELECT / entry |  |
